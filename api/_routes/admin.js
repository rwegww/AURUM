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
    res.status(500).json({ message: 'Lá»—i láº¥y thá»‘ng kÃª', error: err.message });
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
    res.status(500).json({ message: 'Lá»—i láº¥y danh sÃ¡ch ngÆ°á»i dÃ¹ng', error: err.message });
  }
});

// PATCH /api/admin/nguoi_dung/:id/lock - Toggle user lock status
router.patch('/users/:id/lock', adminGuard, async (req, res) => {
  try {
    const { id } = req.params;
    const { isLocked } = req.body;
    
    const updatedUser = await User.toggleLock(id, isLocked);
    res.json({ message: isLocked ? 'ÄÃ£ khÃ³a tÃ i khoáº£n' : 'ÄÃ£ má»Ÿ khÃ³a tÃ i khoáº£n', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Lá»—i thay Ä‘á»•i tráº¡ng thÃ¡i tÃ i khoáº£n', error: err.message });
  }
});

// GET /api/admin/nguoi_dung/:id - Get single user detail
router.get('/users/:id', adminGuard, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'KhÃ´ng tÃ¬m tháº¥y há»c sinh' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lá»—i láº¥y thÃ´ng tin há»c sinh', error: err.message });
  }
});

// GET /api/admin/feedback - List all phan_hois
router.get('/feedback', adminGuard, async (req, res) => {
  try {
    const phan_hois = await Feedback.findAll();
    res.json(phan_hois);
  } catch (err) {
    res.status(500).json({ message: 'Lá»—i láº¥y pháº£n há»“i', error: err.message });
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

    if (!message) return res.status(400).json({ message: 'Vui lÃ²ng nháº­p ná»™i dung' });

    await Feedback.create({
      userId,
      username,
      message,
      type,
      imageUrl
    });
    res.status(201).json({ message: 'Gá»­i pháº£n há»“i thÃ nh cÃ´ng!' });
  } catch (err) {
    res.status(500).json({ message: 'Lá»—i gá»­i pháº£n há»“i', error: err.message });
  }
});

// PATCH /api/admin/feedback/:id - Resolve phan_hoi
router.patch('/feedback/:id', adminGuard, async (req, res) => {
  try {
    const phan_hoi = await Feedback.findById(req.params.id);
    if (!phan_hoi) return res.status(404).json({ message: 'KhÃ´ng tÃ¬m tháº¥y pháº£n há»“i' });

    await Feedback.updateStatus(req.params.id, 'resolved');
    res.json({ message: 'ÄÃ£ giáº£i quyáº¿t pháº£n há»“i' });
  } catch (err) {
    res.status(500).json({ message: 'Lá»—i cáº­p nháº­t pháº£n há»“i', error: err.message });
  }
});

// PATCH /api/admin/feedback/:id/approve - Approve praise
router.patch('/feedback/:id/approve', adminGuard, async (req, res) => {
  try {
    const phan_hoi = await Feedback.findById(req.params.id);
    if (!phan_hoi) return res.status(404).json({ message: 'KhÃ´ng tÃ¬m tháº¥y pháº£n há»“i' });
    if (phan_hoi.type !== 'praise') return res.status(400).json({ message: 'Chá»‰ cÃ³ thá»ƒ duyá»‡t lá»i khen ngá»£i' });

    await Feedback.approve(req.params.id);
    res.json({ message: 'ÄÃ£ duyá»‡t lá»i khen ngá»£i' });
  } catch (err) {
    res.status(500).json({ message: 'Lá»—i duyá»‡t lá»i khen', error: err.message });
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
    res.status(500).json({ message: 'Lá»—i táº¡o bÃ i há»c', error: err.message });
  }
});

// PUT /api/admin/lessons/:id - Update lesson
router.put('/lessons/:id', adminGuard, async (req, res) => {
  try {
    const lesson = await Lesson.update(req.params.id, req.body);
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: 'Lá»—i cáº­p nháº­t bÃ i há»c', error: err.message });
  }
});

// DELETE /api/admin/lessons/:id - Delete lesson
router.delete('/lessons/:id', adminGuard, async (req, res) => {
  try {
    await Lesson.delete(req.params.id);
    res.json({ message: 'ÄÃ£ xÃ³a bÃ i há»c thÃ nh cÃ´ng' });
  } catch (err) {
    res.status(500).json({ message: 'Lá»—i server' });
  }
});

// Duyá»‡t yÃªu cáº§u giÃ¡o viÃªn
router.post('/teacher-requests/:id/approve', adminGuard, async (req, res) => {
  try {
    const phan_hoi = await Feedback.findById(req.params.id);
    if (!phan_hoi || phan_hoi.type !== 'teacher_registration') {
      return res.status(404).json({ message: 'YÃªu cáº§u khÃ´ng tá»“n táº¡i' });
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

    res.json({ message: 'ÄÃ£ duyá»‡t yÃªu cáº§u vÃ  gá»­i email thÃ nh cÃ´ng' });
  } catch (err) {
    console.error('Lá»—i duyá»‡t giÃ¡o viÃªn:', err);
    res.status(500).json({ message: 'Lá»—i server' });
  }
});

// Tá»« chá»‘i yÃªu cáº§u giÃ¡o viÃªn
router.post('/teacher-requests/:id/reject', adminGuard, async (req, res) => {
  try {
    const phan_hoi = await Feedback.findById(req.params.id);
    if (!phan_hoi || phan_hoi.type !== 'teacher_registration') {
      return res.status(404).json({ message: 'YÃªu cáº§u khÃ´ng tá»“n táº¡i' });
    }

    const { email } = JSON.parse(phan_hoi.message);

    // Update phan_hoi status
    await Feedback.updateStatus(phan_hoi.id, 'rejected');

    // Send email
    await sendTeacherRejectionEmail(email, phan_hoi.username, 'TÃ i liá»‡u minh chá»©ng cá»§a báº¡n cÃ³ thá»ƒ khÃ´ng há»£p lá»‡ hoáº·c khÃ´ng rÃµ rÃ ng.');

    res.json({ message: 'ÄÃ£ tá»« chá»‘i yÃªu cáº§u vÃ  gá»­i email thÃ nh cÃ´ng' });
  } catch (err) {
    console.error('Lá»—i tá»« chá»‘i giÃ¡o viÃªn:', err);
    res.status(500).json({ message: 'Lá»—i server' });
  }
});

export default router;

