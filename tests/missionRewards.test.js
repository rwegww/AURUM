import { beforeEach, describe, expect, it, vi } from 'vitest';

const db = vi.hoisted(() => ({ missions: [], progress: [], user: {}, writeError: null, xp: 0 }));
vi.mock('../api/lib/supabase.js', () => ({
  supabase: {
    from(table) {
      const filters = [];
      let operation = 'select';
      let payload;
      let options;
      const query = {
        select() { return query; },
        order() { return query; },
        eq(key, value) { filters.push([key, value]); return query; },
        single() { return query; },
        update(value) { operation = 'update'; payload = value; return query; },
        upsert(value, config) { operation = 'upsert'; payload = value; options = config; return query; },
        then(resolve, reject) {
          return Promise.resolve().then(() => {
            if (table === 'nguoi_dung') return { data: db.user, error: null };
            const rows = table === 'nhiem_vu' ? db.missions : db.progress;
            const selected = rows.filter(row => filters.every(([key, value]) => key === 'nhiem_vu.type'
              ? db.missions.find(m => m.id === row.nhiem_vu_id)?.type === value
              : row[key] === value));
            if (operation !== 'select' && db.writeError) return { data: null, error: db.writeError };
            if (operation === 'update') selected.forEach(row => Object.assign(row, payload));
            if (operation === 'upsert') {
              const existing = rows.find(row => row.nguoi_dung_id === payload.nguoi_dung_id && row.nhiem_vu_id === payload.nhiem_vu_id);
              if (!existing) rows.push({ id: 'progress', da_nhan: false, dat_lai_cuoi_luc: new Date().toISOString(), ...payload });
              else if (!options?.ignoreDuplicates) Object.assign(existing, { da_nhan: false }, payload);
            }
            return { data: selected, error: null };
          }).then(resolve, reject);
        },
      };
      return query;
    },
    rpc: vi.fn(async (_name, { p_user_id, p_mission_id }) => {
      const row = db.progress.find(item => item.nguoi_dung_id === p_user_id && item.nhiem_vu_id === p_mission_id);
      if (!row?.da_hoan_thanh || row.da_nhan) return { data: null, error: null };
      row.da_nhan = true;
      const reward = db.missions.find(item => item.id === p_mission_id).thuong_xp;
      db.xp += reward;
      return { data: { xpGained: reward, totalXP: db.xp, newLevel: 1 }, error: null };
    }),
  },
}));

import Mission from '../api/models/Mission.js';
import { supabase } from '../api/lib/supabase.js';

beforeEach(() => {
  db.missions = [{ id: 'mission', type: 'achievement', loai_hanh_dong: 'streak', so_luong_muc_tieu: 7, thuong_xp: 50 }];
  db.progress = [];
  db.user = { so_ngay_chuoi: 7, phut_online_hom_nay: 0, da_hoan_thanh_bai_hom_nay: false };
  db.writeError = null;
  db.xp = 0;
  vi.clearAllMocks();
});

describe('mission reward eligibility', () => {
  it('claims a streak shown as completed even when no progress row exists', async () => {
    expect((await Mission.getUserMissions('user'))[0].isCompleted).toBe(true);
    await expect(Mission.claimReward('user', 'mission')).resolves.toMatchObject({ xpGained: 50 });
    expect(db.progress[0].da_nhan).toBe(true);
  });

  it.each(['minutes', 'lesson'])('claims a daily light mission completed through %s', async (source) => {
    Object.assign(db.missions[0], { type: 'daily', loai_hanh_dong: 'streak_light', so_luong_muc_tieu: 1 });
    db.user.phut_online_hom_nay = source === 'minutes' ? 10 : 0;
    db.user.da_hoan_thanh_bai_hom_nay = source === 'lesson';
    db.progress = [{ id: 'progress', nguoi_dung_id: 'user', nhiem_vu_id: 'mission', da_nhan: false, da_hoan_thanh: false, dat_lai_cuoi_luc: new Date().toISOString() }];
    await expect(Mission.claimReward('user', 'mission')).resolves.toMatchObject({ xpGained: 50 });
  });

  it('rejects an incomplete mission without granting XP', async () => {
    db.user.so_ngay_chuoi = 6;
    await expect(Mission.claimReward('user', 'mission')).rejects.toThrow('chưa hoàn thành');
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it('does not overwrite claimed progress or grant the reward twice', async () => {
    await Mission.claimReward('user', 'mission');
    await expect(Mission.claimReward('user', 'mission')).rejects.toThrow('đã nhận');
    expect(db.xp).toBe(50);
  });

  it('preserves the atomic claim gate for simultaneous requests', async () => {
    const results = await Promise.allSettled([Mission.claimReward('user', 'mission'), Mission.claimReward('user', 'mission')]);
    expect(results.filter(result => result.status === 'fulfilled')).toHaveLength(1);
    expect(db.xp).toBe(50);
    expect(db.progress[0].da_nhan).toBe(true);
  });

  it('stops before payout when progress cannot be persisted', async () => {
    db.writeError = new Error('Database unavailable');
    await expect(Mission.claimReward('user', 'mission')).rejects.toThrow('Database unavailable');
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it('keeps ordinary completed missions claimable', async () => {
    db.missions[0].loai_hanh_dong = 'lesson_complete';
    db.progress = [{ nguoi_dung_id: 'user', nhiem_vu_id: 'mission', da_hoan_thanh: true, da_nhan: false }];
    await expect(Mission.claimReward('user', 'mission')).resolves.toMatchObject({ xpGained: 50 });
  });

  it('resets yesterday\'s daily completion before accepting a claim', async () => {
    Object.assign(db.missions[0], { type: 'daily', loai_hanh_dong: 'lesson_complete' });
    db.progress = [{ id: 'progress', nguoi_dung_id: 'user', nhiem_vu_id: 'mission', da_hoan_thanh: true, da_nhan: false, dat_lai_cuoi_luc: '2020-01-01T00:00:00Z' }];
    await expect(Mission.claimReward('user', 'mission')).rejects.toThrow('chưa hoàn thành');
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it('does not pay out when resetting daily progress fails', async () => {
    Object.assign(db.missions[0], { type: 'daily', loai_hanh_dong: 'lesson_complete' });
    db.progress = [{ id: 'progress', nguoi_dung_id: 'user', nhiem_vu_id: 'mission', da_hoan_thanh: true, da_nhan: false, dat_lai_cuoi_luc: '2020-01-01T00:00:00Z' }];
    db.writeError = new Error('Reset failed');
    await expect(Mission.claimReward('user', 'mission')).rejects.toThrow('Reset failed');
    expect(supabase.rpc).not.toHaveBeenCalled();
  });
});
