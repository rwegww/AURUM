import crypto from 'crypto';
import { supabase } from '../_lib/supabase.js';

export const REQUIRED_ADMIN_APPROVALS = 2;
const TABLE_NAME = 'yeu_cau_duyet_admin';
const approvalError = (status, message, code) => {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  error.expose = true;
  return error;
};

const isExpired = (request) => (
  request?.expiresAt && new Date(request.expiresAt).getTime() <= Date.now()
);

const sortValue = (value) => {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortValue(value[key]);
        return acc;
      }, {});
  }
  return value;
};

const createRequestHash = (actionKey, payload) =>
  crypto
    .createHash('sha256')
    .update(`${actionKey}:${JSON.stringify(sortValue(payload || {}))}`)
    .digest('hex');

const normalizeApproval = (row) => {
  if (!row) return null;
  const approverIds = Array.isArray(row.approver_ids) ? row.approver_ids : [];
  return {
    ...row,
    actionKey: row.action_key,
    actionLabel: row.action_label,
    requestHash: row.request_hash,
    requestedBy: row.requested_by,
    approverIds,
    currentApprovals: approverIds.length,
    requiredApprovals: REQUIRED_ADMIN_APPROVALS,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    executedAt: row.executed_at,
    expiresAt: row.expires_at,
    executedBy: row.executed_by,
    action_key: undefined,
    action_label: undefined,
    request_hash: undefined,
    requested_by: undefined,
    approver_ids: undefined,
    created_at: undefined,
    updated_at: undefined,
    executed_at: undefined,
    expires_at: undefined,
    executed_by: undefined,
  };
};

const getSingle = async (query) => {
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return normalizeApproval(data);
};

export const AdminApproval = {
  createRequestHash,

  async list({ status = 'pending', limit = 50, cursor } = {}) {
    let query = supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }
    if (status === 'pending') {
      query = query.gt('expires_at', new Date().toISOString());
    }
    if (cursor) {
      query = query.or(
        `created_at.lt.${cursor.sort},and(created_at.eq.${cursor.sort},id.lt.${cursor.id})`
      );
    }
    query = query.limit(limit + 1);

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(normalizeApproval);
  },

  async findById(id) {
    return getSingle(
      supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id', id)
    );
  },

  async findPendingByHash(requestHash, { includeExpired = false } = {}) {
    let query = supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('request_hash', requestHash)
      .eq('status', 'pending');
    if (!includeExpired) query = query.gt('expires_at', new Date().toISOString());

    return getSingle(
      query
    );
  },

  async createOrApprove({ actionKey, actionLabel, payload, adminUser }) {
    const requestHash = createRequestHash(actionKey, payload);
    let existing = await this.findPendingByHash(requestHash, { includeExpired: true });

    if (existing) {
      if (isExpired(existing)) {
        await this.markFailed(existing.id, 'Yêu cầu duyệt đã hết hạn.', 'pending');
        existing = null;
      } else {
        return this.addApproval(existing.id, adminUser);
      }
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([{
        action_key: actionKey,
        action_label: actionLabel,
        request_hash: requestHash,
        requested_by: adminUser.id,
        approver_ids: [adminUser.id],
        payload: payload || {},
        status: 'pending',
      }])
      .select()
      .single();

    if (error?.code === '23505') {
      // Another request created the same pending action concurrently. Reuse it
      // instead of surfacing an intermittent unique-constraint failure.
      const concurrent = await this.findPendingByHash(requestHash);
      if (concurrent) return this.addApproval(concurrent.id, adminUser);
    }
    if (error) throw error;

    const request = normalizeApproval(data);
    return {
      request,
      readyToExecute: request.currentApprovals >= REQUIRED_ADMIN_APPROVALS,
      alreadyApproved: false,
    };
  },

  async addApproval(id, adminUser) {
    const request = await this.findById(id);
    if (!request) {
      const err = new Error('Không tìm thấy yêu cầu duyệt.');
      err.status = 404;
      throw err;
    }

    if (request.status !== 'pending') {
      const err = new Error('Yêu cầu này không còn ở trạng thái chờ duyệt.');
      err.status = 409;
      throw err;
    }
    if (isExpired(request)) {
      await this.markFailed(request.id, 'Yêu cầu duyệt đã hết hạn.', 'pending');
      throw approvalError(410, 'Yêu cầu duyệt đã hết hạn. Vui lòng tạo yêu cầu mới.', 'APPROVAL_EXPIRED');
    }

    if (request.approverIds.includes(adminUser.id)) {
      return {
        request,
        readyToExecute: request.currentApprovals >= REQUIRED_ADMIN_APPROVALS,
        alreadyApproved: true,
      };
    }

    const nextApproverIds = [...request.approverIds, adminUser.id];
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        approver_ids: nextApproverIds,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('status', 'pending')
      .eq('updated_at', request.updatedAt)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      throw approvalError(
        409,
        'Yêu cầu duyệt vừa được thay đổi. Vui lòng tải lại danh sách.',
        'APPROVAL_CONFLICT'
      );
    }

    const updatedRequest = normalizeApproval(data);
    return {
      request: updatedRequest,
      readyToExecute: updatedRequest.currentApprovals >= REQUIRED_ADMIN_APPROVALS,
      alreadyApproved: false,
    };
  },

  async claimExecution(id, adminUser) {
    const request = await this.findById(id);
    if (!request) {
      throw approvalError(404, 'Không tìm thấy yêu cầu duyệt.', 'APPROVAL_NOT_FOUND');
    }
    if (request.status !== 'pending') {
      throw approvalError(409, 'Yêu cầu này đang hoặc đã được xử lý.', 'APPROVAL_NOT_PENDING');
    }
    if (isExpired(request)) {
      await this.markFailed(id, 'Yêu cầu duyệt đã hết hạn.', 'pending');
      throw approvalError(410, 'Yêu cầu duyệt đã hết hạn. Vui lòng tạo yêu cầu mới.', 'APPROVAL_EXPIRED');
    }

    const distinctApprovers = [...new Set(request.approverIds)];
    if (
      distinctApprovers.length < REQUIRED_ADMIN_APPROVALS
      || !distinctApprovers.includes(adminUser.id)
    ) {
      throw approvalError(409, 'Yêu cầu chưa có đủ xác nhận hợp lệ.', 'APPROVALS_INSUFFICIENT');
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        // Claim with an existing constrained status so this remains compatible
        // with databases created before a dedicated "executing" status existed.
        status: 'executed',
        result: { executionState: 'running' },
        error: null,
        executed_by: adminUser.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('status', 'pending')
      .eq('updated_at', request.updatedAt)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      throw approvalError(409, 'Yêu cầu này đang được xử lý bởi quản trị viên khác.', 'APPROVAL_ALREADY_CLAIMED');
    }
    return normalizeApproval(data);
  },

  async markExecuted(id, result, executedBy) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        status: 'executed',
        result: result || {},
        error: null,
        executed_by: executedBy,
        executed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('status', 'executed')
      .is('executed_at', null)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw approvalError(409, 'Trạng thái yêu cầu duyệt không hợp lệ.', 'APPROVAL_STATE_CONFLICT');
    return normalizeApproval(data);
  },

  async markFailed(id, errorMessage, expectedStatus = 'executed') {
    let query = supabase
      .from(TABLE_NAME)
      .update({
        status: 'failed',
        error: String(errorMessage || 'Lỗi thực thi không xác định').slice(0, 1000),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    if (expectedStatus) query = query.eq('status', expectedStatus);
    if (expectedStatus === 'executed') query = query.is('executed_at', null);
    const { data, error } = await query
      .select()
      .maybeSingle();

    if (error) throw error;
    return normalizeApproval(data);
  },

  async reject(id, adminUser, reason = '') {
    const request = await this.findById(id);
    if (!request) {
      const err = new Error('Không tìm thấy yêu cầu duyệt.');
      err.status = 404;
      throw err;
    }

    if (request.status !== 'pending') {
      const err = new Error('Yêu cầu này không còn ở trạng thái chờ duyệt.');
      err.status = 409;
      throw err;
    }
    if (isExpired(request)) {
      await this.markFailed(request.id, 'Yêu cầu duyệt đã hết hạn.', 'pending');
      throw approvalError(410, 'Yêu cầu duyệt đã hết hạn và không thể bị từ chối.', 'APPROVAL_EXPIRED');
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        status: 'rejected',
        error: reason || `Bị từ chối bởi ${adminUser.username || adminUser.id}`,
        executed_by: adminUser.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('status', 'pending')
      .eq('updated_at', request.updatedAt)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw approvalError(409, 'Yêu cầu duyệt vừa được thay đổi. Vui lòng tải lại.', 'APPROVAL_CONFLICT');
    return normalizeApproval(data);
  },
};

export default AdminApproval;
