import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import Lesson from '../models/Lesson.js';

import { supabase } from '../lib/supabase.js';

const router = express.Router();

// Role Middleware
const adminOnly = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('Token missing');

    let userId;
    let user;

    // 1. Try Supabase
    const { data: { user: sbUser }, error: sbError } = await supabase.auth.getUser(token);
    if (sbUser && !sbError) {
      userId = sbUser.id;
      user = await User.findById(userId);
    } else {
      // 2. Try Custom JWT
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
        user = await User.findById(userId);
      } catch (jwtErr) {
         throw new Error('Xác thực thất bại');
      }
    }

    if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
      throw new Error('Forbidden: Quyền truy cập bị từ chối');
    }

    req.user = user;
    next();
  } catch (e) {
    console.error('Admin Auth Error:', e.message);
    res.status(403).json({ message: 'Quyền truy cập bị từ chối', error: e.message });
  }
};

// GET /api/admin/stats - System-wide statistics
router.get('/stats', adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalLessons, totalFeedback, userStats] = await Promise.all([
      User.countStudents(),
      Lesson.countAll(),
      Feedback.countUnread(),
      User.aggregateStats()
    ]);
    
    res.json({
      totalUsers,
      totalLessons,
      unreadFeedback: totalFeedback,
      totalXP: userStats.totalXP,
      avgLevel: Math.round(userStats.avgLevel)
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy thống kê', error: err.message });
  }
});

// GET /api/admin/users - List all users with activity monitoring
router.get('/users', adminOnly, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, role, xp, level, last_active_at, active_minutes, is_locked')
      .order('last_active_at', { ascending: false });
    
    if (error) throw error;
    res.json(data.map(u => ({
      ...u,
      isOnline: u.last_active_at && new Date(u.last_active_at) > new Date(Date.now() - 5*60*1000)
    })));
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách người dùng', error: err.message });
  }
});

// PATCH /api/admin/users/:id/lock - Toggle user lock status
router.patch('/users/:id/lock', adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { isLocked } = req.body;
    
    const updatedUser = await User.toggleLock(id, isLocked);
    res.json({ message: isLocked ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi thay đổi trạng thái tài khoản', error: err.message });
  }
});

// GET /api/admin/users/:id - Get single user detail
router.get('/users/:id', adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy học sinh' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy thông tin học sinh', error: err.message });
  }
});

// GET /api/admin/feedback - List all feedbacks
router.get('/feedback', adminOnly, async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy phản hồi', error: err.message });
  }
});

// POST /api/admin/feedback/submit - Student submission
router.post('/feedback/submit', async (req, res) => {
  try {
    const { message, type } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    let userId = null;
    let username = 'Anonymous';

    if (token) {
      // Try Supabase first
      const { data: { user: sbUser } } = await supabase.auth.getUser(token);
      if (sbUser) {
        const user = await User.findById(sbUser.id);
        if (user) {
          userId = user.id;
          username = user.username;
        }
      } else {
        // Try Custom JWT
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded.id);
          if (user) {
            userId = user.id;
            username = user.username;
          }
        } catch (err) {}
      }
    }

    if (!message) return res.status(400).json({ message: 'Vui lòng nhập nội dung' });

    await Feedback.create({
      userId,
      username,
      message,
      type
    });
    res.status(201).json({ message: 'Gửi phản hồi thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi gửi phản hồi', error: err.message });
  }
});

// PATCH /api/admin/feedback/:id - Resolve feedback
router.patch('/feedback/:id', adminOnly, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Không tìm thấy phản hồi' });

    await Feedback.updateStatus(req.params.id, 'resolved');
    res.json({ message: 'Đã giải quyết phản hồi' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật phản hồi', error: err.message });
  }
});

// ==========================================
// LESSON MANAGEMENT
// ==========================================

// POST /api/admin/lessons - Create new lesson
router.post('/lessons', adminOnly, async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo bài học', error: err.message });
  }
});

// PUT /api/admin/lessons/:id - Update lesson
router.put('/lessons/:id', adminOnly, async (req, res) => {
  try {
    const lesson = await Lesson.update(req.params.id, req.body);
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật bài học', error: err.message });
  }
});

// DELETE /api/admin/lessons/:id - Delete lesson
router.delete('/lessons/:id', adminOnly, async (req, res) => {
  try {
    await Lesson.delete(req.params.id);
    res.json({ message: 'Đã xóa bài học thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa bài học', error: err.message });
  }
});

export default router;
