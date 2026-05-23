import { supabase } from '../lib/supabase.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const mapUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    id: user.id,
    createdAt: user.created_at,
    // Flatten normalized arrays if they exist in the joined record
    unlockedLessons: user.unlocked_lessons ? user.unlocked_lessons.map(l => l.lesson_id) : (user.unlockedLessons || []),
    unlockedChemicals: user.unlocked_chemicals ? user.unlocked_chemicals.map(c => c.chemical_formula) : (user.unlockedChemicals || []),
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
    balancingProgress: (user.balancing_progress && typeof user.balancing_progress === 'object') 
      ? {
          completedNodeIds: user.balancing_progress.completedNodeIds || [],
          completedCount: user.balancing_progress.completedCount || 0,
          passedGrades: user.balancing_progress.passedGrades || [],
          lessonStars: user.balancing_progress.lessonStars || {}
        }
      : { completedNodeIds: [], completedCount: 0, passedGrades: [], lessonStars: {} },
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
    let query = supabase.from('users').select('*');
    
    if (filter.username && filter.email) {
      query = query.or(`username.eq."${filter.username}",email.eq."${filter.email}"`);
    } else if (filter.username) {
      query = query.eq('username', filter.username);
    } else if (filter.email) {
      query = query.eq('email', filter.email);
    } else if (filter.id) {
      query = query.eq('id', filter.id);
    } else if (filter.googleId) {
      query = query.eq('linked_accounts->>google', filter.googleId);
    } else if (filter.telegramId) {
      query = query.eq('linked_accounts->>telegram', filter.telegramId);
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

    // 2. Try to fetch junction data (optional, don't crash if tables missing)
    try {
      const { data: lessons } = await supabase.from('user_unlocked_lessons').select('lesson_id').eq('user_id', user.id);
      const { data: chemicals } = await supabase.from('user_unlocked_chemicals').select('chemical_formula').eq('user_id', user.id);
      
      user.unlocked_lessons = lessons || [];
      user.unlocked_chemicals = chemicals || [];
    } catch (e) {
      console.warn('Junction tables missing or inaccessible, returning base user.');
      user.unlocked_lessons = [];
      user.unlocked_chemicals = [];
    }
    
    return mapUser(user);
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

    // 2. Attempt junction data (fail-safe)
    try {
      const { data: lessons } = await supabase.from('user_unlocked_lessons').select('lesson_id').eq('user_id', id);
      const { data: chemicals } = await supabase.from('user_unlocked_chemicals').select('chemical_formula').eq('user_id', id);
      
      user.unlocked_lessons = lessons || [];
      user.unlocked_chemicals = chemicals || [];
    } catch (e) {
      user.unlocked_lessons = [];
      user.unlocked_chemicals = [];
    }
    
    return mapUser(user);
  },

  async create(userData) {
    const hashedPassword = userData.skipHash ? userData.password : await bcrypt.hash(userData.password, 10);
    const userId = userData.id || crypto.randomUUID();
    
    // 1. Create User
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: userId,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'student',
        avatar_seed: userData.avatarSeed || userData.username,
        balancing_progress: { completedNodeIds: [], completedCount: 0, passedGrades: [] },
        study_plan: { studyTime: '20:00', dailyLessonTarget: 1, remindersEnabled: true, grade: userData.grade || null },
        streak_count: 0,
        today_online_minutes: 0,
        today_lesson_completed: false
      }])
      .select()
      .single();
    
    if (error) throw error;

    // 2. Initial Unlocked Content (if any)
    if (userData.unlockedLessons?.length > 0) {
      await supabase.from('user_unlocked_lessons').insert(
        userData.unlockedLessons.map(lessonId => ({ user_id: userId, lesson_id: lessonId }))
      );
    }
    if (userData.unlockedChemicals?.length > 0) {
      await supabase.from('user_unlocked_chemicals').insert(
        userData.unlockedChemicals.map(chem => ({ user_id: userId, chemical_formula: chem }))
      );
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

    if (updateData.balancingProgress) {
      pgUpdateData.balancing_progress = updateData.balancingProgress;
      delete pgUpdateData.balancingProgress;
    }

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
    if (junctionLessons) {
      for (const lessonId of junctionLessons) {
        await supabase.from('user_unlocked_lessons')
          .upsert({ user_id: id, lesson_id: lessonId }, { onConflict: 'user_id,lesson_id' });
      }
    }

    if (junctionChemicals) {
      for (const chem of junctionChemicals) {
        await supabase.from('user_unlocked_chemicals')
          .upsert({ user_id: id, chemical_formula: chem }, { onConflict: 'user_id,chemical_formula' });
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
