import express from 'express';
import { supabase } from '../lib/supabase.js';
import User from '../models/User.js';

const router = express.Router();

// 1. Get List of Materials with Filters
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = supabase.from('materials').select('*').order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tải danh sách tài liệu', error: err.message });
  }
});

// 2. Get Single Material & Increment View Count
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch material
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Increment view count (fire and forget)
    supabase.rpc('increment_material_view', { material_id: id }).then();

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tải chi tiết tài liệu', error: err.message });
  }
});

// 3. Post Feedback for a Material
router.post('/:id/feedback', async (req, res) => {
  try {
    const { id: material_id } = req.params;
    const { content, rating, userId } = req.body;

    if (!content || !rating) {
      return res.status(400).json({ message: 'Thiếu nội dung hoặc đánh giá' });
    }

    const { data, error } = await supabase
      .from('material_feedback')
      .insert([{
        material_id,
        user_id: userId,
        content,
        rating
      }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi gửi phản hồi', error: err.message });
  }
});

// 4. Get Feedback for a Material
router.get('/:id/feedback', async (req, res) => {
  try {
    const { id: material_id } = req.params;
    
    // 1. Fetch feedbacks first
    let { data: feedbacks, error } = await supabase
      .from('material_feedback')
      .select('*')
      .eq('material_id', material_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!feedbacks || feedbacks.length === 0) return res.json([]);

    // 2. Get unique user IDs
    const userIds = [...new Set(feedbacks.map(f => f.user_id))].filter(Boolean);

    if (userIds.length > 0) {
      // 3. Fetch usernames for these IDs
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id, username')
        .in('id', userIds);

      if (!userError && users) {
        const userMap = users.reduce((acc, u) => {
          acc[u.id] = u;
          return acc;
        }, {});

        // 4. Manually join the data
        feedbacks = feedbacks.map(f => ({
          ...f,
          users: userMap[f.user_id] || null
        }));
      }
    }
    
    return res.json(feedbacks);
  } catch (err) {
    console.error('Lỗi tải phản hồi:', err);
    res.status(500).json({ message: 'Lỗi tải phản hồi', error: err.message });
  }
});

export default router;
