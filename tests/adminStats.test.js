import { beforeEach, describe, expect, it, vi } from 'vitest';

const database = vi.hoisted(() => ({ students: [], requests: 0, cap: 150 }));

vi.mock('../api/_lib/supabase.js', () => ({
  supabase: {
    from: () => {
      let cursor;
      const query = {
        select: () => query,
        eq: () => query,
        order: () => query,
        limit: () => query,
        gt: (_column, value) => { cursor = value; return query; },
        then: (resolve, reject) => {
          database.requests += 1;
          const data = database.students.filter((student) => !cursor || student.id > cursor).slice(0, database.cap);
          return Promise.resolve({ data, error: null }).then(resolve, reject);
        },
      };
      return query;
    },
  },
}));

import User from '../api/_models/User.js';

beforeEach(() => {
  database.students = [];
  database.requests = 0;
});

describe('thống kê admin qua nhiều trang dữ liệu', () => {
  it('tính đủ hơn 1000 học sinh và lấy đúng người dẫn đầu ở trang cuối', async () => {
    database.students = Array.from({ length: 1001 }, (_, index) => ({
      id: String(index).padStart(5, '0'),
      username: `student-${index}`,
      diem_kinh_nghiem: index === 1000 ? 5000 : 10,
      cap_do: 2,
      ke_hoach_hoc: { grade: 10 },
      so_ngay_chuoi: index === 1000 ? 30 : 1,
    }));

    const stats = await User.aggregateStats();
    expect(stats.totalXP).toBe(15000);
    expect(stats.avgLevel).toBe(2);
    expect(stats.gradeDistribution[0].students).toBe(1001);
    expect(stats.levelDistribution[0].students).toBe(1001);
    expect(stats.topXP[0].id).toBe('01000');
    expect(stats.topStreak[0].id).toBe('01000');
    expect(database.requests).toBeGreaterThan(1);
  });

  it('trả thống kê rỗng hợp lệ khi chưa có học sinh', async () => {
    expect(await User.aggregateStats()).toEqual({
      totalXP: 0, avgLevel: 0, gradeDistribution: [], levelDistribution: [], topXP: [], topStreak: [],
    });
  });
});
