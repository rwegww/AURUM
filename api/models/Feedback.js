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
        status: feedbackData.status || 'unread',
        image_url: feedbackData.imageUrl || null
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
      imageUrl: f.image_url,
      isApproved: f.is_approved,
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
  },

  async approve(id) {
    const { data, error } = await supabase
      .from('feedback')
      .update({ is_approved: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getApprovedPraises() {
    const { data, error } = await supabase
      .from('feedback')
      .select('username, message, created_at, users(role)')
      .eq('type', 'praise')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map(f => ({
      name: f.username || 'Anonymous',
      role: f.users?.role || 'Học sinh',
      content: f.message,
      rating: 5 // Default for praises
    }));
  }
};

export default Feedback;
