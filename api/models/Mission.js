import { supabase } from '../lib/supabase.js';

const VIETNAM_TIME_ZONE = 'Asia/Ho_Chi_Minh';
const vietnamDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: VIETNAM_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const getVietnamDateKey = (date) => {
  const parts = Object.fromEntries(
    vietnamDateFormatter.formatToParts(date)
      .filter(part => part.type !== 'literal')
      .map(part => [part.type, part.value])
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
};

const mapMissionRow = (mission) => mission ? ({
  ...mission,
  title: mission.tieu_de ?? mission.title,
  description: mission.mo_ta ?? mission.description,
  action_type: mission.loai_hanh_dong ?? mission.action_type,
  target_count: mission.so_luong_muc_tieu ?? mission.target_count,
  xp_reward: mission.thuong_xp ?? mission.xp_reward,
  icon: mission.bieu_tuong ?? mission.icon,
  tieu_de: undefined,
  mo_ta: undefined,
  loai_hanh_dong: undefined,
  so_luong_muc_tieu: undefined,
  thuong_xp: undefined,
  bieu_tuong: undefined
}) : null;

const mapProgressRow = (progress) => progress ? ({
  ...progress,
  nguoi_dung_id: progress.nguoi_dung_id,
  nhiem_vu_id: progress.nhiem_vu_id,
  current_count: progress.so_luong_hien_tai ?? progress.current_count ?? 0,
  is_completed: progress.da_hoan_thanh ?? progress.is_completed ?? false,
  is_claimed: progress.da_nhan ?? progress.is_claimed ?? false,
  last_reset_at: progress.dat_lai_cuoi_luc ?? progress.last_reset_at,
  so_luong_hien_tai: undefined,
  da_hoan_thanh: undefined,
  da_nhan: undefined,
  dat_lai_cuoi_luc: undefined
}) : null;

export const Mission = {
  // Helper to check and reset daily nhiem_vu
  async checkAndResetDailies(userId) {
    const now = new Date();
    const todayStr = getVietnamDateKey(now);

    // 1. Get all daily nhiem_vu for the user
    const { data: userMissions, error: umError } = await supabase
      .from('nhiem_vu_nguoi_dung')
      .select('*, nhiem_vu!inner(*)')
      .eq('nguoi_dung_id', userId)
      .eq('nhiem_vu.type', 'daily');

    if (umError) throw umError;

    const resetPromises = userMissions
      .filter(um => {
        const lastReset = new Date(um.dat_lai_cuoi_luc);
        const lastResetStr = getVietnamDateKey(lastReset);
        return lastResetStr !== todayStr;
      })
      .map(um => {
        return supabase
          .from('nhiem_vu_nguoi_dung')
          .update({
            so_luong_hien_tai: 0,
            da_hoan_thanh: false,
            da_nhan: false,
            dat_lai_cuoi_luc: now.toISOString(),
            updated_at: now.toISOString()
          })
          .eq('id', um.id);
      });

    if (resetPromises.length > 0) {
      const results = await Promise.all(resetPromises);
      const failed = results.find(result => result.error);
      if (failed) throw failed.error;
      return true; // Indicates some resets happened
    }
    return false;
  },

  // Get all active nhiem_vu with user progress
  async getUserMissions(userId) {
    // Check and reset dailies first
    await this.checkAndResetDailies(userId);

    // 1. Get all nhiem_vu
    const { data: missionRows, error: mError } = await supabase
      .from('nhiem_vu')
      .select('*')
      .order('type', { ascending: false });

    if (mError) throw mError;

    // 2. Get user progress
    const { data: progress, error: pError } = await supabase
      .from('nhiem_vu_nguoi_dung')
      .select('*')
      .eq('nguoi_dung_id', userId);

    if (pError) throw pError;

    // 2.5 Get user streak info for syncing
    const { data: user, error: userError } = await supabase
      .from('nguoi_dung')
      .select('so_ngay_chuoi, phut_online_hom_nay, da_hoan_thanh_bai_hom_nay')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // 3. Merge data
    return missionRows.map(mapMissionRow).map(mission => {
      let userProgress = (progress || []).map(mapProgressRow).find(p => p.nhiem_vu_id === mission.id);
      let currentCount = userProgress ? userProgress.current_count : 0;
      let isCompleted = userProgress ? userProgress.is_completed : false;

      // Special handling for streak-based nhiem_vu
      if (mission.action_type === 'streak' && user) {
        currentCount = user.so_ngay_chuoi;
        isCompleted = currentCount >= mission.target_count;
      }
      
      // Special handling for daily streak lighting mission
      if (mission.action_type === 'streak_light' && user) {
        currentCount = (user.phut_online_hom_nay >= 10 || user.da_hoan_thanh_bai_hom_nay) ? 1 : 0;
        isCompleted = currentCount >= mission.target_count;
      }

      return {
        ...mission,
        currentCount,
        isCompleted,
        isClaimed: userProgress ? userProgress.is_claimed : false,
        updatedAt: userProgress ? userProgress.updated_at : null
      };
    });
  },

  // Update mission progress for a specific action
  async updateProgress(userId, actionType, increment = 1) {
    // Check and reset dailies before updating
    await this.checkAndResetDailies(userId);

    // 1. Find relevant nhiem_vu of this action type
    const { data: missionRows, error: mError } = await supabase
      .from('nhiem_vu')
      .select('*')
      .eq('loai_hanh_dong', actionType);

    if (mError) throw mError;
    if (!missionRows || missionRows.length === 0) return;

    for (const mission of missionRows) {
      // 2. Upsert user progress
      const { data: currentProgress, error: cpError } = await supabase
        .from('nhiem_vu_nguoi_dung')
        .select('*')
        .eq('nguoi_dung_id', userId)
        .eq('nhiem_vu_id', mission.id)
        .maybeSingle();

      if (cpError) continue;

      let newCount = (currentProgress?.so_luong_hien_tai || 0) + increment;
      let isCompleted = newCount >= mission.so_luong_muc_tieu;

      const { error: upsertError } = await supabase
        .from('nhiem_vu_nguoi_dung')
        .upsert({
          nguoi_dung_id: userId,
          nhiem_vu_id: mission.id,
          so_luong_hien_tai: newCount,
          da_hoan_thanh: isCompleted,
          updated_at: new Date().toISOString()
        }, { onConflict: 'nguoi_dung_id,nhiem_vu_id' });

      if (upsertError) console.error(`Error updating mission ${mission.id}:`, upsertError);
    }
  },

  // Sync streak progress (called when streak changes)
  async syncStreakProgress(userId, streakCount) {
    const { data: missionRows, error: mError } = await supabase
      .from('nhiem_vu')
      .select('*')
      .eq('loai_hanh_dong', 'streak');

    if (mError || !missionRows) return;

    for (const mission of missionRows) {
      if (streakCount >= mission.so_luong_muc_tieu) {
        await supabase
          .from('nhiem_vu_nguoi_dung')
          .upsert({
            nguoi_dung_id: userId,
            nhiem_vu_id: mission.id,
            so_luong_hien_tai: streakCount,
            da_hoan_thanh: true,
            updated_at: new Date().toISOString()
          }, { onConflict: 'nguoi_dung_id,nhiem_vu_id' });
      }
    }
  },

  // Claim mission reward
  async claimRewardLegacy(userId, missionId) {
    // 1. Verify mission status
    const { data: mission, error: mError } = await supabase
      .from('nhiem_vu')
      .select('*')
      .eq('id', missionId)
      .single();

    if (mError) throw mError;

    const { data: progress, error: pError } = await supabase
      .from('nhiem_vu_nguoi_dung')
      .select('*')
      .eq('nguoi_dung_id', userId)
      .eq('nhiem_vu_id', missionId)
      .single();

    if (pError) throw pError;
    if (!progress.da_hoan_thanh) throw new Error('Mission not completed');
    if (progress.da_nhan) throw new Error('Reward already claimed');

    // 2. Mark as claimed
    const { error: claimError } = await supabase
      .from('nhiem_vu_nguoi_dung')
      .update({ da_nhan: true })
      .eq('id', progress.id);

    if (claimError) throw claimError;

    // 3. Grant XP to user
    const { data: user, error: uError } = await supabase
      .from('nguoi_dung')
      .select('diem_kinh_nghiem, cap_do')
      .eq('id', userId)
      .single();

    if (uError) throw uError;

    const newXP = (user.diem_kinh_nghiem || 0) + (mission.thuong_xp || 0);
    // Simple level up logic: ہر 1000 XP پر ایک لیول (Level = 1 + floor(XP/1000))
    // Based on the game, maybe it's different, but let's keep it simple or follow existing logic
    const newLevel = Math.floor(newXP / 1000) + 1;

    const { error: updateError } = await supabase
      .from('nguoi_dung')
      .update({ diem_kinh_nghiem: newXP, cap_do: newLevel })
      .eq('id', userId);

    if (updateError) throw updateError;

    return { xpGained: mission.thuong_xp, totalXP: newXP, newLevel };
  },

  async claimReward(userId, missionId) {
    // Use the same server-derived eligibility as the list, including daily reset.
    const missions = await this.getUserMissions(userId);
    const mission = missions.find(item => item.id === missionId);
    if (!mission) throw new Error('Không tìm thấy nhiệm vụ.');
    if (mission.isClaimed) throw new Error('Bạn đã nhận phần thưởng nhiệm vụ này.');
    if (!mission.isCompleted) throw new Error('Bạn chưa hoàn thành mục tiêu nhiệm vụ.');

    if (['streak', 'streak_light'].includes(mission.action_type)) {
      const progress = {
        nguoi_dung_id: userId,
        nhiem_vu_id: missionId,
        so_luong_hien_tai: mission.currentCount,
        da_hoan_thanh: true,
        updated_at: new Date().toISOString(),
      };
      // Insert missing progress without replacing an existing claimed flag.
      const { error: insertError } = await supabase
        .from('nhiem_vu_nguoi_dung')
        .upsert(progress, { onConflict: 'nguoi_dung_id,nhiem_vu_id', ignoreDuplicates: true });
      if (insertError) throw insertError;

      const { error: syncError } = await supabase
        .from('nhiem_vu_nguoi_dung')
        .update({
          so_luong_hien_tai: progress.so_luong_hien_tai,
          da_hoan_thanh: true,
          updated_at: progress.updated_at,
        })
        .eq('nguoi_dung_id', userId)
        .eq('nhiem_vu_id', missionId);
      if (syncError) throw syncError;
    }

    // The database still atomically claims and grants XP once, even for racing requests.
    const { data, error } = await supabase.rpc('claim_mission_reward', {
      p_user_id: userId,
      p_mission_id: missionId
    });

    if (error) throw error;
    if (!data) throw new Error('Phần thưởng đã được nhận hoặc trạng thái nhiệm vụ đã thay đổi. Vui lòng tải lại danh sách.');

    return data;
  }
};

export default Mission;
