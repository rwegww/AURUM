import { supabase } from '../lib/supabase.js';

export const Discussion = {
  // Get all discussions for a lesson, joined with user profile info
  async getByLesson(lessonId) {
    // 1. Fetch comments first
    let { data: comments, error } = await supabase
      .from('lesson_discussions')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!comments || comments.length === 0) return [];

    // 2. Get unique user IDs
    const userIds = [...new Set(comments.map(c => c.user_id))].filter(Boolean);

    if (userIds.length > 0) {
      // 3. Fetch user info for corresponding IDs
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id, username, role')
        .in('id', userIds);

      if (!userError && users) {
        const userMap = users.reduce((acc, u) => {
          acc[u.id] = u;
          return acc;
        }, {});

        // 4. Manually join
        comments = comments.map(c => ({
          ...c,
          user: userMap[c.user_id] || null
        }));
      }
    }
    
    return comments;
  },

  // Create a new comment or reply
  async create(userId, lessonId, content, parentId = null) {
    const { data, error } = await supabase
      .from('lesson_discussions')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        content,
        parent_id: parentId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Like a comment (increment likes)
  async like(id) {
    // Note: In a production app, we should have a separate 'likes' table to prevent double-liking
    // For this educational prototype, we'll use a simple counter for now.
    const { data, error } = await supabase.rpc('increment_likes', { row_id: id });
    
    if (error) {
      // Fallback if RPC doesn't exist yet
      const { data: current, error: getError } = await supabase
        .from('lesson_discussions')
        .select('likes')
        .eq('id', id)
        .single();
      
      if (getError) throw getError;

      const { data: updated, error: updateError } = await supabase
        .from('lesson_discussions')
        .update({ likes: (current.likes || 0) + 1 })
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) throw updateError;
      return updated;
    }
    return data;
  }
};

export const Note = {
  // Get user's private note for a lesson
  async get(userId, lessonId) {
    const { data, error } = await supabase
      .from('user_notes')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // Save or update a user's note
  async save(userId, lessonId, content) {
    const { data, error } = await supabase
      .from('user_notes')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        content,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,lesson_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
