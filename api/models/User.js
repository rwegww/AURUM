import { supabase } from '../lib/supabase.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const mapUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    id: user.id,
    createdAt: user.created_at,
    unlockedLessons: user.unlocked_lessons || [],
    unlocked_lessons: undefined,
    created_at: undefined
  };
};

export const User = {
  async findOne(filter) {
    let query = supabase.from('users').select('*');
    
    if (filter.username && filter.email) {
      // Use quotes for values in .or() to handle special characters like '@'
      query = query.or(`username.eq."${filter.username}",email.eq."${filter.email}"`);
    } else if (filter.username) {
      query = query.eq('username', filter.username);
    } else if (filter.email) {
      query = query.eq('email', filter.email);
    } else if (filter.id) {
      query = query.eq('id', filter.id);
    }

    const { data, error } = await query.single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    return mapUser(data);
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    return mapUser(data);
  },

  async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Construct insert object
    const insertData = {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'student',
      inventory: userData.inventory || { ingredients: [], craftedItems: [] },
      unlocked_lessons: userData.unlockedLessons || []
    };

    // Only include ID if explicitly provided (e.g. from Firebase/Google)
    // Otherwise generate a random UUID to satisfy DB constraint
    if (userData.id) {
      insertData.id = userData.id;
    } else {
      insertData.id = crypto.randomUUID();
    }

    const { data, error } = await supabase
      .from('users')
      .insert([insertData])
      .select()
      .single();
    
    if (error) throw error;
    return mapUser(data);
  },

  async update(id, updateData) {
    const pgUpdateData = { ...updateData };
    if (updateData.unlockedLessons) {
      pgUpdateData.unlocked_lessons = updateData.unlockedLessons;
      delete pgUpdateData.unlockedLessons;
    }

    const { data, error } = await supabase
      .from('users')
      .update(pgUpdateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return mapUser(data);
  },

  async findStudents() {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, role, xp, level, inventory, unlocked_lessons')
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
  }
};



export default User;
