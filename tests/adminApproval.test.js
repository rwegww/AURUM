import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const database = vi.hoisted(() => ({ row: null }));
vi.mock('../api/_lib/supabase.js', () => ({
  supabase: {
    from: () => {
      const filters = [];
      let patch;
      const query = {
        select: () => query,
        eq: (column, value) => { filters.push((row) => row[column] === value); return query; },
        is: (column, value) => { filters.push((row) => (row[column] ?? null) === value); return query; },
        update: (value) => { patch = value; return query; },
        maybeSingle: async () => {
          if (!database.row || !filters.every((test) => test(database.row))) return { data: null, error: null };
          if (patch) database.row = { ...database.row, ...patch };
          return { data: structuredClone(database.row), error: null };
        },
      };
      return query;
    },
  },
}));

import AdminApproval from '../api/_models/AdminApproval.js';

beforeEach(() => {
  database.row = {
    id: '11111111-1111-4111-8111-111111111111',
    action_key: 'lesson.update',
    status: 'pending',
    approver_ids: ['admin-a', 'admin-b'],
    updated_at: '2026-01-01T00:00:00.000Z',
    expires_at: new Date(Date.now() + 60_000).toISOString(),
    executed_at: null,
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('logic duyệt thay đổi của hai admin', () => {
  it('chỉ một quản trị viên được thực thi khi hai yêu cầu đến đồng thời', async () => {
    const results = await Promise.allSettled([
      AdminApproval.claimExecution(database.row.id, { id: 'admin-a' }),
      AdminApproval.claimExecution(database.row.id, { id: 'admin-b' }),
    ]);
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
    expect(results.filter((result) => result.status === 'rejected')).toHaveLength(1);
    expect(database.row.status).toBe('executed');
    expect(database.row.executed_at).toBeNull();
  });

  it('không tính hai lần cùng một người là hai xác nhận', async () => {
    database.row.approver_ids = ['admin-a', 'admin-a'];
    await expect(AdminApproval.claimExecution(database.row.id, { id: 'admin-a' }))
      .rejects.toMatchObject({ code: 'APPROVALS_INSUFFICIENT' });
    expect(database.row.status).toBe('pending');
  });

  it('không cho thực thi yêu cầu đã hết hạn', async () => {
    database.row.expires_at = '2020-01-01T00:00:00.000Z';
    await expect(AdminApproval.claimExecution(database.row.id, { id: 'admin-a' }))
      .rejects.toMatchObject({ code: 'APPROVAL_EXPIRED' });
    expect(database.row.status).toBe('failed');
  });

  it('không ghi đè kết quả thành công bằng lỗi từ một lần xử lý đến muộn', async () => {
    await AdminApproval.claimExecution(database.row.id, { id: 'admin-a' });
    await AdminApproval.markExecuted(database.row.id, { message: 'Đã lưu' }, 'admin-a');
    expect(await AdminApproval.markFailed(database.row.id, 'Lỗi cũ')).toBeNull();
    expect(database.row.status).toBe('executed');
    expect(database.row.result).toEqual({ message: 'Đã lưu' });
  });
  it('cho phép tiếp tục một yêu cầu đã đủ hai xác nhận nhưng bị gián đoạn', async () => {
    vi.spyOn(AdminApproval, 'findById').mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      status: 'pending',
      approverIds: ['admin-a', 'admin-b'],
      currentApprovals: 2,
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    });

    const state = await AdminApproval.addApproval(
      '11111111-1111-4111-8111-111111111111',
      { id: 'admin-a' },
    );

    expect(state.alreadyApproved).toBe(true);
    expect(state.readyToExecute).toBe(true);
  });

  it('tạo cùng một mã băm cho payload có thứ tự khóa khác nhau', () => {
    const first = AdminApproval.createRequestHash('lesson.update', {
      id: 'lesson-1',
      lesson: { title: 'Hóa học', order: 2 },
    });
    const second = AdminApproval.createRequestHash('lesson.update', {
      lesson: { order: 2, title: 'Hóa học' },
      id: 'lesson-1',
    });

    expect(first).toBe(second);
  });
});
