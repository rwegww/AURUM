import { supabase } from '../_lib/supabase.js';

const DISCUSSION_COLUMNS = 'id,nguoi_dung_id,bai_hoc_id,noi_dung,cha_id,luot_thich,created_at';

const mapDiscussion = (comment) => comment ? ({
  ...comment,
  content: comment.noi_dung ?? comment.content,
  parent_id: comment.cha_id ?? comment.parent_id,
  likes: comment.luot_thich ?? comment.likes ?? 0,
  noi_dung: undefined,
  cha_id: undefined,
  luot_thich: undefined
}) : null;

const mapNote = (note) => note ? ({
  ...note,
  content: note.noi_dung ?? note.content,
  noi_dung: undefined
}) : null;

export const Discussion = {
  // Phân trang theo bình luận gốc và tải kèm phản hồi của từng bình luận.
  async getByLesson(lessonId, { page = 1, limit = 10 } = {}) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data: rootComments, error, count } = await supabase
      .from('thao_luan')
      .select(DISCUSSION_COLUMNS, { count: 'exact' })
      .eq('bai_hoc_id', lessonId)
      .is('cha_id', null)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .range(from, to);

    if (error) throw error;
    if (!rootComments || rootComments.length === 0) {
      return { items: [], total: Number(count) || 0, hasMore: false };
    }

    const rootIds = rootComments.map((comment) => comment.id);
    const { data: replies, error: replyError } = await supabase
      .from('thao_luan')
      .select(DISCUSSION_COLUMNS)
      .eq('bai_hoc_id', lessonId)
      .in('cha_id', rootIds)
      .order('created_at', { ascending: true })
      .order('id', { ascending: true });

    if (replyError) throw replyError;
    let comments = [...rootComments, ...(replies || [])];

    // 2. Get unique user IDs
    const userIds = [...new Set(comments.map(c => c.nguoi_dung_id))].filter(Boolean);

    if (userIds.length > 0) {
      // 3. Fetch user info for corresponding IDs
      const { data: nguoi_dung, error: userError } = await supabase
        .from('nguoi_dung')
        .select('id, username, role')
        .in('id', userIds);

      if (!userError && nguoi_dung) {
        const userMap = nguoi_dung.reduce((acc, u) => {
          acc[u.id] = u;
          return acc;
        }, {});

        // 4. Manually join
        comments = comments.map(c => ({
          ...c,
          user: userMap[c.nguoi_dung_id] || null
        })).map(mapDiscussion);
      }
    }
    
    const total = Number(count) || 0;
    return {
      items: comments.map(mapDiscussion),
      total,
      hasMore: page * limit < total,
    };
  },

  // Create a new comment or reply
  async create(userId, lessonId, content, parentId = null) {
    const { data, error } = await supabase
      .from('thao_luan')
      .insert({
        nguoi_dung_id: userId,
        bai_hoc_id: lessonId,
        noi_dung: content,
        cha_id: parentId
      })
      .select()
      .single();

    if (error) throw error;
    return mapDiscussion(data);
  },

  // Like a comment (increment likes)
  async like(id) {
    // Note: In a production app, we should have a separate 'likes' table to prevent double-liking
    // For this educational prototype, we'll use a simple counter for now.
    const { data, error } = await supabase.rpc('increment_likes', { row_id: id });
    
    if (error) {
      // Fallback if RPC doesn't exist yet
      const { data: current, error: getError } = await supabase
        .from('thao_luan')
        .select('luot_thich')
        .eq('id', id)
        .single();
      
      if (getError) throw getError;

      const { data: updated, error: updateError } = await supabase
        .from('thao_luan')
        .update({ luot_thich: (current.luot_thich || 0) + 1 })
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) throw updateError;
      return mapDiscussion(updated);
    }
    return mapDiscussion(data);
  }
};

export const Note = {
  // Get user's private note for a lesson
  async get(userId, lessonId) {
    const { data, error } = await supabase
      .from('ghi_chu')
      .select('*')
      .eq('nguoi_dung_id', userId)
      .eq('bai_hoc_id', lessonId)
      .maybeSingle();

    if (error) throw error;
    return mapNote(data);
  },

  // Save or update a user's note
  async save(userId, lessonId, content) {
    const { data, error } = await supabase
      .from('ghi_chu')
      .upsert({
        nguoi_dung_id: userId,
        bai_hoc_id: lessonId,
        noi_dung: content,
        updated_at: new Date().toISOString()
      }, { onConflict: 'nguoi_dung_id,bai_hoc_id' })
      .select()
      .single();

    if (error) throw error;
    return mapNote(data);
  }
};
