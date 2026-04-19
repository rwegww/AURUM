import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import { supabase } from '../lib/supabase.js';

const router = express.Router();

// Middleware to verify JWT (handles both Custom JWT and Supabase tokens)
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('Token missing');

    let userId;
    let user;

    // 1. Try to verify as Supabase token
    const { data, error: sbError } = await supabase.auth.getUser(token);
    const sbUser = data?.user;
    
    if (sbUser && !sbError) {
      userId = sbUser.id;
      // Check if user exists in our local 'users' table
      user = await User.findById(userId);
      
      // If Supabase user exists but not in our 'users' table, create a basic profile
      if (!user) {
        user = await User.create({
          id: userId,
          username: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Môn đồ Hóa học',
          email: sbUser.email,
          password: 'supabase_oauth_no_password',
          role: 'student'
        });
      }
    } else {
      // 2. Fallback: Try to verify as custom JWT (legacy/internal)
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
        user = await User.findById(userId);
      } catch (jwtErr) {
        throw new Error('Xác thực thất bại');
      }
    }

    if (!user) throw new Error('Không tìm thấy thông tin người dùng');
    if (user.isLocked) throw new Error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    console.error('Auth Middleware Error:', e.message);
    res.status(401).json({ message: 'Vui lòng đăng nhập lại', error: e.message });
  }
};

// Get Online Count (Public)
router.get('/online-count', async (req, res) => {
  try {
    const activeCount = await User.countActiveStudents();
    // Fallback minimum to 1 if we are sure at least the current user is active (though this is public)
    res.json({ count: Math.max(1, activeCount) });
  } catch (err) {
    res.status(200).json({ count: 1 });
  }
});

// Get Leaderboard (Public)
router.get('/leaderboard', async (req, res) => {
  try {
    const students = await User.findStudents();
    // Return only top 10 and strip sensitive data if any
    const topStudents = students.slice(0, 10).map(s => ({
      username: s.username,
      xp: s.xp || 0,
      level: s.level || 1,
      role: s.role,
      avatarSeed: s.avatarSeed,
      lastActiveAt: s.lastActiveAt,
      activeMinutes: s.activeMinutes,
      isOnline: s.isOnline
    }));
    res.json(topStudents);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tải bảng xếp hạng', error: err.message });
  }
});

// Get Profile
router.get('/profile', auth, async (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    role: req.user.role,
    xp: req.user.xp,
    level: req.user.level,
    inventory: req.user.inventory,
    unlockedLessons: req.user.unlockedLessons,
    unlockedChemicals: req.user.unlockedChemicals || [],
    avatarSeed: req.user.avatarSeed,
    createdAt: req.user.createdAt,
    arenaStats: req.user.arenaStats || { total: 0, wins: 0, losses: 0, points: 0 },
    arenaAvatar: req.user.arenaAvatar || { seed: 'Chem Master', aura: '#a855f7' },
    streakCount: req.user.streakCount || 0,
    lastStreakAt: req.user.lastStreakAt,
    todayOnlineMinutes: req.user.todayOnlineMinutes || 0,
    todayLessonCompleted: req.user.todayLessonCompleted || false
  });
});

// Update Profile
router.patch('/profile', auth, async (req, res) => {
  try {
    const updatedUser = await User.update(req.user.id, req.body);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật thông tin', error: err.message });
  }
});

// Update XP & Progress
router.post('/progress', auth, async (req, res) => {
  try {
    const { xpGain, unlockedLessonId, isLessonCompletion } = req.body;
    let { xp, level, unlockedLessons, todayLessonCompleted } = req.user;
    
    if (xpGain) {
      // Apply streak bonus if applicable
      const streakBonus = Math.floor((req.user.streakCount || 0) / 7) * 5; // e.g., +5 XP for every 7 days of streak
      xp += (xpGain + streakBonus);
      level = Math.floor(xp / 1000) + 1;
    }

    const updateFields = { xp, level };

    if (unlockedLessonId && !unlockedLessons.includes(unlockedLessonId)) {
      unlockedLessons.push(unlockedLessonId);
      updateFields.unlockedLessons = unlockedLessons;
    }

    if (isLessonCompletion) {
      updateFields.today_lesson_completed = true;
      
      // Update streak if not already updated today
      const today = new Date().toISOString().split('T')[0];
      const lastStreak = req.user.lastStreakAt ? new Date(req.user.lastStreakAt).toISOString().split('T')[0] : null;
      
      if (today !== lastStreak) {
        updateFields.streak_count = (req.user.streakCount || 0) + 1;
        updateFields.last_streak_at = new Date().toISOString();
      }
    }

    const updatedUser = await User.update(req.user.id, updateFields);
    
    res.json({
      xp: updatedUser.xp,
      level: updatedUser.level,
      unlockedLessons: updatedUser.unlockedLessons,
      streakCount: updatedUser.streakCount,
      todayLessonCompleted: updatedUser.todayLessonCompleted
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật tiến độ', error: err.message });
  }
});

// Heartbeat (Activity Tracking & Streak)
router.post('/heartbeat', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const lastActiveDate = req.user.lastActiveAt ? new Date(req.user.lastActiveAt).toISOString().split('T')[0] : null;
    
    let onlineMinutes = req.user.todayOnlineMinutes || 0;
    
    // Reset online minutes if it's a new day
    if (today !== lastActiveDate) {
      onlineMinutes = 0;
    }
    
    onlineMinutes += 1;
    
    const updateFields = {
      last_active_at: now.toISOString(),
      today_online_minutes: onlineMinutes,
      active_minutes: (req.user.activeMinutes || 0) + 1
    };

    // Auto-reset today_lesson_completed on new day
    if (today !== lastActiveDate) {
      updateFields.today_lesson_completed = false;
    }

    // Check for streak maintenance (10 minutes online)
    const lastStreakDate = req.user.lastStreakAt ? new Date(req.user.lastStreakAt).toISOString().split('T')[0] : null;
    if (onlineMinutes >= 10 && today !== lastStreakDate) {
      updateFields.streak_count = (req.user.streakCount || 0) + 1;
      updateFields.last_streak_at = now.toISOString();
    }

    await User.update(userId, updateFields);

    res.json({ 
      success: true, 
      onlineMinutes, 
      streakCount: updateFields.streak_count || req.user.streakCount 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recover Streak
router.post('/streak/recover', auth, async (req, res) => {
  try {
    const { streakToRestore } = req.body; // The streak count they want to get back
    const currentXP = req.user.xp || 0;
    
    // Cost formula: 100 XP base + (streak * 20)
    const cost = 100 + (streakToRestore * 20);
    
    if (currentXP < cost) {
      return res.status(400).json({ message: `Bạn cần ${cost} XP để khôi phục chuỗi ${streakToRestore} ngày. Hiện tại bạn chỉ có ${currentXP} XP.` });
    }

    const updatedUser = await User.update(req.user.id, {
      xp: currentXP - cost,
      streak_count: streakToRestore,
      last_streak_at: new Date().toISOString()
    });

    res.json({
      message: 'Khôi phục chuỗi thành công!',
      streakCount: updatedUser.streakCount,
      xp: updatedUser.xp
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khôi phục chuỗi', error: err.message });
  }
});

export default router;
