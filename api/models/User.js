import { supabase } from '../lib/supabase.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const defaultBalancingProgress = {
  completedNodeIds: [],
  completedCount: 0,
  passedGrades: [],
  lessonStars: {}
};

const isMissingDbObject = (error) =>
  error?.code === '42P01' ||
  error?.code === '42703' ||
  error?.code === 'PGRST205' ||
  error?.message?.includes('Could not find the table') ||
  error?.message?.includes('Could not find the column');

const normalizeIdList = (items, objectKey) => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => (typeof item === 'string' ? item : item?.[objectKey] || item?.item_id))
    .filter(Boolean);
};

const normalizeBalancingProgress = (progress) => {
  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) {
    return { ...defaultBalancingProgress };
  }

  return {
    completedNodeIds: progress.completedNodeIds || [],
    completedCount: progress.completedCount || 0,
    passedGrades: progress.passedGrades || [],
    lessonStars: progress.lessonStars || {}
  };
};

const attachUserProgress = async (user) => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('item_type, item_id, progress_data, unlocked_at')
      .eq('user_id', user.id);

    if (error) throw error;

    user.unlocked_lessons = (data || [])
      .filter((item) => item.item_type === 'lesson')
      .map((item) => item.item_id);
    user.unlocked_chemicals = (data || [])
      .filter((item) => item.item_type === 'chemical')
      .map((item) => item.item_id);

    const balancing = (data || []).find(
      (item) => item.item_type === 'balancing' && item.item_id === 'current'
    );
    user.balancing_progress = balancing?.progress_data || user.balancing_progress;
    return user;
  } catch (error) {
    if (!isMissingDbObject(error)) throw error;
  }

  try {
    const { data: lessons } = await supabase
      .from('user_unlocked_lessons')
      .select('lesson_id')
      .eq('user_id', user.id);
    const { data: chemicals } = await supabase
      .from('user_unlocked_chemicals')
      .select('chemical_formula')
      .eq('user_id', user.id);

    user.unlocked_lessons = lessons || [];
    user.unlocked_chemicals = chemicals || [];
  } catch (_e) {
    console.warn('User progress tables missing or inaccessible, returning base user.');
    user.unlocked_lessons = [];
    user.unlocked_chemicals = [];
  }

  return user;
};

const upsertUserProgress = async (rows) => {
  if (!rows.length) return false;

  const { error } = await supabase
    .from('user_progress')
    .upsert(rows, { onConflict: 'user_id,item_type,item_id' });

  if (error) {
    if (isMissingDbObject(error)) return false;
    throw error;
  }

  return true;
};

const upsertLegacyProgress = async (userId, { lessons = [], chemicals = [], balancingProgress } = {}) => {
  if (balancingProgress) {
    const { error } = await supabase
      .from('users')
      .update({ balancing_progress: balancingProgress })
      .eq('id', userId);
    if (error && !isMissingDbObject(error)) throw error;
  }

  for (const lessonId of lessons) {
    const { error } = await supabase
      .from('user_unlocked_lessons')
      .upsert({ user_id: userId, lesson_id: lessonId }, { onConflict: 'user_id,lesson_id' });
    if (error && !isMissingDbObject(error)) throw error;
  }

  for (const chemical of chemicals) {
    const { error } = await supabase
      .from('user_unlocked_chemicals')
      .upsert({ user_id: userId, chemical_formula: chemical }, { onConflict: 'user_id,chemical_formula' });
    if (error && !isMissingDbObject(error)) throw error;
  }
};

const mapUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    id: user.id,
    createdAt: user.created_at,
    // Flatten normalized arrays if they exist in the joined record
    unlockedLessons: normalizeIdList(user.unlocked_lessons, 'lesson_id').length > 0
      ? normalizeIdList(user.unlocked_lessons, 'lesson_id')
      : (user.unlockedLessons || []),
    unlockedChemicals: normalizeIdList(user.unlocked_chemicals, 'chemical_formula').length > 0
      ? normalizeIdList(user.unlocked_chemicals, 'chemical_formula')
      : (user.unlockedChemicals || []),
    avatarSeed: user.avatar_seed || user.username,
    arenaStats: user.arena_stats || { total: 0, wins: 0, losses: 0, points: 0 },
    arenaAvatar: user.arena_avatar || { seed: 'Chem Master', aura: '#a855f7' },
    // Cleanup
    unlocked_lessons: undefined,
    unlocked_chemicals: undefined,
    avatar_seed: undefined,
    arena_stats: undefined,
    arena_avatar: undefined,
    created_at: undefined,
    lastActiveAt: user.updated_at || user.last_active_at,
    activeMinutes: user.active_minutes || 0,
    isOnline: user.is_online || (user.last_active_at && new Date(user.last_active_at) > new Date(Date.now() - 5*60*1000)),
    isLocked: user.is_locked || false,
    balancingProgress: normalizeBalancingProgress(user.balancing_progress),
    streakCount: user.streak_count || 0,
    lastStreakAt: user.last_streak_at,
    todayOnlineMinutes: user.today_online_minutes || 0,
    todayLessonCompleted: user.today_lesson_completed || false,
    currentSessionId: user.current_session_id,
    studyPlan: user.study_plan || { studyTime: '20:00', dailyLessonTarget: 1, remindersEnabled: true },
    linkedAccounts: user.linked_accounts || {}
  };
};

export const User = {
  async findOne(filter) {
    // 1. Fetch core user data first (safe)
    if (filter.username && filter.email) {
      const byUsername = await this.findOne({ username: filter.username });
      if (byUsername) return byUsername;
      return this.findOne({ email: filter.email });
    }

    let query = supabase.from('users').select('*');

    if (filter.username) {
      query = query.eq('username', filter.username);
    } else if (filter.email) {
      query = query.eq('email', filter.email);
    } else if (filter.id) {
      query = query.eq('id', filter.id);
    } else if (filter.googleId) {
      query = query.eq('linked_accounts->>google', filter.googleId);
    }

    const { data: user, error: userError } = await query.maybeSingle();
    if (userError) {
      // Gracefully handle missing linked_accounts column
      if (userError.message?.includes('Could not find the column') || userError.code === '42703') {
        console.warn('Column not found in users table, returning null for findOne:', userError.message);
        return null;
      }
      throw userError;
    }
    if (!user) return null;
    return mapUser(await attachUserProgress(user));
  },

  async findById(id) {
    // 1. Fetch core (safe)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (userError) throw userError;
    if (!user) return null;
    return mapUser(await attachUserProgress(user));
  },

  async create(userData) {
    const hashedPassword = userData.skipHash ? userData.password : await bcrypt.hash(userData.password, 10);
    const userId = userData.id || crypto.randomUUID();
    
    // 1. Create User
    const { error } = await supabase
      .from('users')
      .insert([{
        id: userId,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'student',
        avatar_seed: userData.avatarSeed || userData.username,
        study_plan: { studyTime: '20:00', dailyLessonTarget: 1, remindersEnabled: true, grade: userData.grade || null },
        streak_count: 0,
        today_online_minutes: 0,
        today_lesson_completed: false
      }])
      .select()
      .single();
    
    if (error) throw error;

    // 2. Initial Unlocked Content (if any)
    const initialLessons = userData.unlockedLessons || [];
    const initialChemicals = userData.unlockedChemicals || [];
    const initialBalancingProgress = { ...defaultBalancingProgress };
    const progressRows = [
      ...initialLessons.map((lessonId) => ({
        user_id: userId,
        item_type: 'lesson',
        item_id: lessonId,
        progress_data: {}
      })),
      ...initialChemicals.map((chemical) => ({
        user_id: userId,
        item_type: 'chemical',
        item_id: chemical,
        progress_data: {}
      })),
      {
        user_id: userId,
        item_type: 'balancing',
        item_id: 'current',
        progress_data: initialBalancingProgress
      }
    ];

    const savedToProgress = await upsertUserProgress(progressRows);
    if (!savedToProgress) {
      await upsertLegacyProgress(userId, {
        lessons: initialLessons,
        chemicals: initialChemicals,
        balancingProgress: initialBalancingProgress
      });
    }

    return this.findById(userId);
  },

  async update(id, updateData) {
    const pgUpdateData = { ...updateData };
    
    // Handle special mappings
    if (updateData.avatarSeed) {
      pgUpdateData.avatar_seed = updateData.avatarSeed;
      delete pgUpdateData.avatarSeed;
    }

    const balancingProgress = updateData.balancingProgress;
    delete pgUpdateData.balancingProgress;

    if (updateData.linkedAccounts) {
      pgUpdateData.linked_accounts = updateData.linkedAccounts;
      delete pgUpdateData.linkedAccounts;
    }
    
    // 1. Update Core User Data (excluding junction lists)
    const junctionLessons = updateData.unlockedLessons;
    const junctionChemicals = updateData.unlockedChemicals;
    delete pgUpdateData.unlockedLessons;
    delete pgUpdateData.unlockedChemicals;

    if (updateData.currentSessionId) {
      pgUpdateData.current_session_id = updateData.currentSessionId;
      delete pgUpdateData.currentSessionId;
    }

    if (updateData.studyPlan) {
      pgUpdateData.study_plan = updateData.studyPlan;
      delete pgUpdateData.studyPlan;
    }

    if (Object.keys(pgUpdateData).length > 0) {
      console.log(`[User.update] Updating ID ${id} with:`, JSON.stringify(pgUpdateData, null, 2));
      const { error } = await supabase
        .from('users')
        .update(pgUpdateData)
        .eq('id', id);
      if (error) {
        // Gracefully handle missing columns (e.g. current_session_id, linked_accounts, etc.)
        if (error.message?.includes('Could not find the column') || error.code === '42703') {
          console.warn('[User.update] Column missing in users table, skipping update:', error.message);
        } else {
          console.error('[User.update] Supabase error:', error);
          throw error;
        }
      }
    }

    // 2. Update Junction Tables for Unlocked Content
    // NOTE: This implementation is simple "add if missing". 
    // For a full replacement, we'd need to delete first if that's the intent.
    const progressRows = [];
    if (junctionLessons) {
      progressRows.push(...junctionLessons.map((lessonId) => ({
        user_id: id,
        item_type: 'lesson',
        item_id: lessonId,
        progress_data: {}
      })));
    }

    if (junctionChemicals) {
      progressRows.push(...junctionChemicals.map((chemical) => ({
        user_id: id,
        item_type: 'chemical',
        item_id: chemical,
        progress_data: {}
      })));
    }

    if (balancingProgress) {
      progressRows.push({
        user_id: id,
        item_type: 'balancing',
        item_id: 'current',
        progress_data: balancingProgress
      });
    }

    if (progressRows.length > 0) {
      const savedToProgress = await upsertUserProgress(progressRows);
      if (!savedToProgress) {
        await upsertLegacyProgress(id, {
          lessons: junctionLessons || [],
          chemicals: junctionChemicals || [],
          balancingProgress
        });
      }
    }

    return this.findById(id);
  },

  async findStudents() {
    // For the leaderboard, we ONLY need names and XP. 
    // This query is extremely safe because it doesn't use any complex joins.
    const { data, error } = await supabase
      .from('users')
      .select(`
        id, username, role, xp, level, avatar_seed, updated_at, last_active_at, active_minutes, is_locked
      `)
      .eq('role', 'student')
      .order('xp', { ascending: false });
    
    if (error) throw error;
    return data.map(mapUser);
  },

  async countStudents() {
    const { count, error } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'student');
    
    if (error) throw error;
    return count;
  },

  async countActiveStudents() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { count, error } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'student')
      .gt('last_active_at', fiveMinutesAgo);
    
    if (error) throw error;
    return count;
  },

  async aggregateStats() {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, xp, level, study_plan, streak_count, avatar_seed')
      .eq('role', 'student');
    
    if (error) throw error;
    
    const totalXP = data.reduce((sum, u) => sum + (u.xp || 0), 0);
    const avgLevel = data.length > 0 ? data.reduce((sum, u) => sum + (u.level || 1), 0) / data.length : 1;
    
    const levels = {};
    const grades = {};
    
    data.forEach(u => {
      const lvl = u.level || 1;
      levels[lvl] = (levels[lvl] || 0) + 1;
      
      const grade = u.study_plan?.grade || 'Chưa rõ';
      grades[grade] = (grades[grade] || 0) + 1;
    });
    
    const levelDistribution = Object.keys(levels).map(lvl => ({
      name: `Cấp ${lvl}`,
      students: levels[lvl]
    })).sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));
    
    const gradeDistribution = Object.keys(grades).map(g => ({
      name: g === 'Chưa rõ' ? g : `Lớp ${g}`,
      students: grades[g],
      color: g === 'Chưa rõ' ? '#94a3b8' : (g == 8 ? '#f43f5e' : (g == 9 ? '#eab308' : (g == 10 ? '#3b82f6' : (g == 11 ? '#a855f7' : '#14b8a6'))))
    }));

    const topXP = [...data].sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 5).map(u => ({
      id: u.id,
      name: u.username,
      xp: u.xp || 0,
      level: u.level || 1,
      avatar: u.avatar_seed || u.username
    }));
    
    const topStreak = [...data].sort((a, b) => (b.streak_count || 0) - (a.streak_count || 0)).slice(0, 5).map(u => ({
      id: u.id,
      name: u.username,
      streak: u.streak_count || 0,
      avatar: u.avatar_seed || u.username
    }));

    return { totalXP, avgLevel, levelDistribution, gradeDistribution, topXP, topStreak };
  },

  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  async toggleLock(id, lockStatus) {
    const { data, error } = await supabase
      .from('users')
      .update({ is_locked: lockStatus })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return mapUser(data);
  }
};

export default User;
