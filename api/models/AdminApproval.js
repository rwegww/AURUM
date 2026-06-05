import crypto from 'crypto';
import { supabase } from '../lib/supabase.js';

export const REQUIRED_ADMIN_APPROVALS = 2;
const TABLE_NAME = 'yeu_cau_duyet_admin';

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
    action_key: undefined,
    action_label: undefined,
    request_hash: undefined,
    requested_by: undefined,
    approver_ids: undefined,
    created_at: undefined,
    updated_at: undefined,
    executed_at: undefined,
    expires_at: undefined,
  };
};

const getSingle = async (query) => {
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return normalizeApproval(data);
};

export const AdminApproval = {
  createRequestHash,

  async list({ status = 'pending' } = {}) {
    let query = supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

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

  async findPendingByHash(requestHash) {
    return getSingle(
      supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('request_hash', requestHash)
        .eq('status', 'pending')
    );
  },

  async createOrApprove({ actionKey, actionLabel, payload, adminUser }) {
    const requestHash = createRequestHash(actionKey, payload);
    const existing = await this.findPendingByHash(requestHash);

    if (existing) {
      return this.addApproval(existing.id, adminUser);
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

    if (request.approverIds.includes(adminUser.id)) {
      return {
        request,
        readyToExecute: false,
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
      .select()
      .single();

    if (error) throw error;

    const updatedRequest = normalizeApproval(data);
    return {
      request: updatedRequest,
      readyToExecute: updatedRequest.currentApprovals >= REQUIRED_ADMIN_APPROVALS,
      alreadyApproved: false,
    };
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
      .select()
      .single();

    if (error) throw error;
    return normalizeApproval(data);
  },

  async markFailed(id, errorMessage) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        status: 'failed',
        error: errorMessage,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

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

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        status: 'rejected',
        error: reason || `Bị từ chối bởi ${adminUser.username || adminUser.id}`,
        executed_by: adminUser.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return normalizeApproval(data);
  },
};

export default AdminApproval;
