import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import Lesson from '../models/Lesson.js';
import { auth, requireRole } from '../_middleware/auth.js';

import { sendTeacherApprovalEmail, sendTeacherRejectionEmail } from '../lib/mailer.js';

import { supabase } from '../lib/supabase.js';

const router = express.Router();
const adminGuard = [auth, requireRole('admin')];

// GET /api/admin/stats - System-wide statistics
router.get('/stats', adminGuard, async (req, res) => {
  try {
    const [totalUsers, totalLessons, totalFeedback, userStats, feedbackDistribution] = await Promise.all([
      User.countStudents(),
      Lesson.countAll(),
      Feedback.countUnread(),
      User.aggregateStats(),
      Feedback.getTypeDistribution()
    ]);
    
    res.json({
      totalUsers,
      totalLessons,
      unreadFeedback: totalFeedback,
      totalXP: userStats.totalXP,
      avgLevel: userStats.avgLevel,
      levelDistribution: userStats.levelDistribution,
      gradeDistribution: userStats.gradeDistribution,
      topXP: userStats.topXP,
      topStreak: userStats.topStreak,
      feedbackDistribution
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy thống kê', error: err.message });
  }
});

// GET /api/admin/nguoi_dung - List all nguoi_dung with activity monitoring
router.get('/users', adminGuard, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('nguoi_dung')
      .select('id, username, role, diem_kinh_nghiem, cap_do, hoat_dong_cuoi_luc, phut_hoat_dong, bi_khoa')
      .order('hoat_dong_cuoi_luc', { ascending: false });
    
    if (error) throw error;
    res.json(data.map(u => ({
      ...u,
      xp: u.diem_kinh_nghiem ?? 0,
      level: u.cap_do ?? 1,
      last_active_at: u.hoat_dong_cuoi_luc,
      active_minutes: u.phut_hoat_dong ?? 0,
      is_locked: u.bi_khoa ?? false,
      isOnline: u.hoat_dong_cuoi_luc && new Date(u.hoat_dong_cuoi_luc) > new Date(Date.now() - 5*60*1000),
      diem_kinh_nghiem: undefined,
      cap_do: undefined,
      hoat_dong_cuoi_luc: undefined,
      phut_hoat_dong: undefined,
      bi_khoa: undefined
    })));
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách người dùng', error: err.message });
  }
});

// PATCH /api/admin/nguoi_dung/:id/lock - Toggle user lock status
router.patch('/users/:id/lock', adminGuard, async (req, res) => {
  try {
    const { id } = req.params;
    const { isLocked } = req.body;
    
    const updatedUser = await User.toggleLock(id, isLocked);
    res.json({ message: isLocked ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi thay đổi trạng thái tài khoản', error: err.message });
  }
});

// GET /api/admin/nguoi_dung/:id - Get single user detail
router.get('/users/:id', adminGuard, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy học sinh' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy thông tin học sinh', error: err.message });
  }
});

// GET /api/admin/feedback - List all phan_hois
router.get('/feedback', adminGuard, async (req, res) => {
  try {
    const phan_hois = await Feedback.findAll();
    res.json(phan_hois);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy phản hồi', error: err.message });
  }
});

// POST /api/admin/feedback/submit - Student submission
router.post('/feedback/submit', async (req, res) => {
  try {
    const { message, type, imageUrl } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    let userId = null;
    let username = 'Anonymous';

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
          userId = user.id;
          username = user.username;
        }
        } catch (_jwtErr) {
        try {
          const { data } = await supabase.auth.getUser(token);
          const sbUser = data?.user;
          if (sbUser) {
            const user = await User.findById(sbUser.id) || await User.findOne({ email: sbUser.email });
            if (user) {
              userId = user.id;
              username = user.username;
            }
          }
        } catch (_sbErr) {
          // Ignore Supabase token fallback failure; custom JWT auth may still identify the user.
        }
      }
    }

    if (!message) return res.status(400).json({ message: 'Vui lòng nhập nội dung' });

    await Feedback.create({
      userId,
      username,
      message,
      type,
      imageUrl
    });
    res.status(201).json({ message: 'Gửi phản hồi thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi gửi phản hồi', error: err.message });
  }
});

// PATCH /api/admin/feedback/:id - Resolve phan_hoi
router.patch('/feedback/:id', adminGuard, async (req, res) => {
  try {
    const phan_hoi = await Feedback.findById(req.params.id);
    if (!phan_hoi) return res.status(404).json({ message: 'Không tìm thấy phản hồi' });

    await Feedback.updateStatus(req.params.id, 'resolved');
    res.json({ message: 'Đã giải quyết phản hồi' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật phản hồi', error: err.message });
  }
});

// PATCH /api/admin/feedback/:id/approve - Approve praise
router.patch('/feedback/:id/approve', adminGuard, async (req, res) => {
  try {
    const phan_hoi = await Feedback.findById(req.params.id);
    if (!phan_hoi) return res.status(404).json({ message: 'Không tìm thấy phản hồi' });
    if (phan_hoi.type !== 'praise') return res.status(400).json({ message: 'Chỉ có thể duyệt lời khen ngợi' });

    await Feedback.approve(req.params.id);
    res.json({ message: 'Đã duyệt lời khen ngợi' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi duyệt lời khen', error: err.message });
  }
});

// ==========================================
// LESSON MANAGEMENT
// ==========================================

// POST /api/admin/lessons - Create new lesson
router.post('/lessons', adminGuard, async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo bài học', error: err.message });
  }
});

// PUT /api/admin/lessons/:id - Update lesson
router.put('/lessons/:id', adminGuard, async (req, res) => {
  try {
    const lesson = await Lesson.update(req.params.id, req.body);
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật bài học', error: err.message });
  }
});

// DELETE /api/admin/lessons/:id - Delete lesson
router.delete('/lessons/:id', adminGuard, async (req, res) => {
  try {
    await Lesson.delete(req.params.id);
    res.json({ message: 'Đã xóa bài học thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Duyệt yêu cầu giáo viên
router.post('/teacher-requests/:id/approve', adminGuard, async (req, res) => {
  try {
    const phan_hoi = await Feedback.findById(req.params.id);
    if (!phan_hoi || phan_hoi.type !== 'teacher_registration') {
      return res.status(404).json({ message: 'Yêu cầu không tồn tại' });
    }

    const { email, hashedPassword } = JSON.parse(phan_hoi.message);

    // Create teacher account
    const user = await User.create({
      username: phan_hoi.username,
      email: email,
      password: hashedPassword,
      role: 'teacher',
      skipHash: true
    });

    // Update phan_hoi status
    await Feedback.updateStatus(phan_hoi.id, 'resolved');

    // Generate magic login token
    const magicToken = jwt.sign(
      { id: user.id, role: user.role, magicLogin: true },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Valid for 7 days
    );

    // Send email
    await sendTeacherApprovalEmail(email, phan_hoi.username, magicToken);

    res.json({ message: 'Đã duyệt yêu cầu và gửi email thành công' });
  } catch (err) {
    console.error('Lỗi duyệt giáo viên:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Từ chối yêu cầu giáo viên
router.post('/teacher-requests/:id/reject', adminGuard, async (req, res) => {
  try {
    const phan_hoi = await Feedback.findById(req.params.id);
    if (!phan_hoi || phan_hoi.type !== 'teacher_registration') {
      return res.status(404).json({ message: 'Yêu cầu không tồn tại' });
    }

    const { email } = JSON.parse(phan_hoi.message);

    // Update phan_hoi status
    await Feedback.updateStatus(phan_hoi.id, 'rejected');

    // Send email
    await sendTeacherRejectionEmail(email, phan_hoi.username, 'Tài liệu minh chứng của bạn có thể không hợp lệ hoặc không rõ ràng.');

    res.json({ message: 'Đã từ chối yêu cầu và gửi email thành công' });
  } catch (err) {
    console.error('Lỗi từ chối giáo viên:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

export default router;

