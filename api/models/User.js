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
    isLocked: user.is_locked || false
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
    }

    const { data: user, error: userError } = await query.maybeSingle();
    if (userError) throw userError;
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
    const hashedPassword = await bcrypt.hash(userData.password, 10);
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
        inventory: userData.inventory || { ingredients: [], craftedItems: [] },
        avatar_seed: userData.avatarSeed || userData.username
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
    
    // 1. Update Core User Data (excluding junction lists)
    const junctionLessons = updateData.unlockedLessons;
    const junctionChemicals = updateData.unlockedChemicals;
    delete pgUpdateData.unlockedLessons;
    delete pgUpdateData.unlockedChemicals;

    if (Object.keys(pgUpdateData).length > 0) {
      const { error } = await supabase
        .from('users')
        .update(pgUpdateData)
        .eq('id', id);
      if (error) throw error;
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

  async aggregateStats() {
    const { data, error } = await supabase
      .from('users')
      .select('xp, level')
      .eq('role', 'student');
    
    if (error) throw error;
    
    const totalXP = data.reduce((sum, u) => sum + (u.xp || 0), 0);
    const avgLevel = data.length > 0 ? data.reduce((sum, u) => sum + (u.level || 1), 0) / data.length : 1;
    
    return { totalXP, avgLevel };
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
