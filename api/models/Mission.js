import { supabase } from '../lib/supabase.js';

export const Mission = {
  // Helper to check and reset daily missions
  async checkAndResetDailies(userId) {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // 1. Get all daily missions for the user
    const { data: userMissions, error: umError } = await supabase
      .from('user_missions')
      .select('*, missions!inner(*)')
      .eq('user_id', userId)
      .eq('missions.type', 'daily');

    if (umError) return;

    const resetPromises = userMissions
      .filter(um => {
        const lastReset = new Date(um.last_reset_at);
        const lastResetStr = lastReset.toISOString().split('T')[0];
        return lastResetStr !== todayStr;
      })
      .map(um => {
        return supabase
          .from('user_missions')
          .update({
            current_count: 0,
            is_completed: false,
            is_claimed: false,
            last_reset_at: now.toISOString(),
            updated_at: now.toISOString()
          })
          .eq('id', um.id);
      });

    if (resetPromises.length > 0) {
      await Promise.all(resetPromises);
      return true; // Indicates some resets happened
    }
    return false;
  },

  // Get all active missions with user progress
  async getUserMissions(userId) {
    // Check and reset dailies first
    await this.checkAndResetDailies(userId);

    // 1. Get all missions
    const { data: missions, error: mError } = await supabase
      .from('missions')
      .select('*')
      .order('type', { ascending: false });

    if (mError) throw mError;

    // 2. Get user progress
    const { data: progress, error: pError } = await supabase
      .from('user_missions')
      .select('*')
      .eq('user_id', userId);

    if (pError) throw pError;

    // 3. Merge data
    return missions.map(mission => {
      const userProgress = progress.find(p => p.mission_id === mission.id);
      return {
        ...mission,
        currentCount: userProgress ? userProgress.current_count : 0,
        isCompleted: userProgress ? userProgress.is_completed : false,
        isClaimed: userProgress ? userProgress.is_claimed : false,
        updatedAt: userProgress ? userProgress.updated_at : null
      };
    });
  },

  // Update mission progress for a specific action
  async updateProgress(userId, actionType, increment = 1) {
    // Check and reset dailies before updating
    await this.checkAndResetDailies(userId);

    // 1. Find relevant missions of this action type
    const { data: missions, error: mError } = await supabase
      .from('missions')
      .select('*')
      .eq('action_type', actionType);

    if (mError) throw mError;
    if (!missions || missions.length === 0) return;

    for (const mission of missions) {
      // 2. Upsert user progress
      const { data: currentProgress, error: cpError } = await supabase
        .from('user_missions')
        .select('*')
        .eq('user_id', userId)
        .eq('mission_id', mission.id)
        .maybeSingle();

      if (cpError) continue;

      let newCount = (currentProgress?.current_count || 0) + increment;
      let isCompleted = newCount >= mission.target_count;

      const { error: upsertError } = await supabase
        .from('user_missions')
        .upsert({
          user_id: userId,
          mission_id: mission.id,
          current_count: newCount,
          is_completed: isCompleted,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,mission_id' });

      if (upsertError) console.error(`Error updating mission ${mission.id}:`, upsertError);
    }
  },

  // Claim mission reward
  async claimReward(userId, missionId) {
    // 1. Verify mission status
    const { data: mission, error: mError } = await supabase
      .from('missions')
      .select('*')
      .eq('id', missionId)
      .single();

    if (mError) throw mError;

    const { data: progress, error: pError } = await supabase
      .from('user_missions')
      .select('*')
      .eq('user_id', userId)
      .eq('mission_id', missionId)
      .single();

    if (pError) throw pError;
    if (!progress.is_completed) throw new Error('Mission not completed');
    if (progress.is_claimed) throw new Error('Reward already claimed');

    // 2. Mark as claimed
    const { error: claimError } = await supabase
      .from('user_missions')
      .update({ is_claimed: true })
      .eq('id', progress.id);

    if (claimError) throw claimError;

    // 3. Grant XP to user
    const { data: user, error: uError } = await supabase
      .from('users')
      .select('xp, level')
      .eq('id', userId)
      .single();

    if (uError) throw uError;

    const newXP = (user.xp || 0) + (mission.xp_reward || 0);
    // Simple level up logic: ہر 1000 XP پر ایک لیول (Level = 1 + floor(XP/1000))
    // Based on the game, maybe it's different, but let's keep it simple or follow existing logic
    const newLevel = Math.floor(newXP / 1000) + 1;

    const { error: updateError } = await supabase
      .from('users')
      .update({ xp: newXP, level: newLevel })
      .eq('id', userId);

    if (updateError) throw updateError;

    return { xpGained: mission.xp_reward, totalXP: newXP, newLevel };
  }
};

export default Mission;
