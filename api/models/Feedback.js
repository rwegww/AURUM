import { supabase } from '../lib/supabase.js';

export const Feedback = {
  async create(feedbackData) {
    const { data, error } = await supabase
      .from('feedback')
      .insert([{
        user_id: feedbackData.userId,
        username: feedbackData.username,
        message: feedbackData.message,
        type: feedbackData.type || 'suggestion',
        status: feedbackData.status || 'unread'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async findAll() {
    const { data, error } = await supabase
      .from('feedback')
      .select('*, users(username)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    // Map internal users object to match what populate would provide if needed
    return data.map(f => ({
      ...f,
      id: f.id,
      createdAt: f.created_at,
      userId: { username: f.users?.username }
    }));
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async countUnread() {
    const { count, error } = await supabase
      .from('feedback')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'unread');
    
    if (error) throw error;
    return count;
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('feedback')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export default Feedback;
