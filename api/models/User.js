import { supabase } from '../lib/supabase.js';
import bcrypt from 'bcryptjs';

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
  async findOne({ username }) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
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
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: userData.id, // Allow custom ID (Firebase UID)
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'student',
        inventory: userData.inventory || { ingredients: [], craftedItems: [] },
        unlocked_lessons: userData.unlockedLessons || []
      }])
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
