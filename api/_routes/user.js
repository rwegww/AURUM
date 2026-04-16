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
    arenaStats: req.user.arena_stats || { total: 0, wins: 0, losses: 0, points: 0 },
    arenaAvatar: req.user.arena_avatar || { seed: 'Chem Master', aura: '#a855f7' },
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
    const { xpGain, unlockedLessonId } = req.body;
    let { xp, level, unlockedLessons } = req.user;
    
    if (xpGain) {
      xp += xpGain;
      // Simple leveling logic: 1000 XP per level
      level = Math.floor(xp / 1000) + 1;
    }

    if (unlockedLessonId && !unlockedLessons.includes(unlockedLessonId)) {
      unlockedLessons.push(unlockedLessonId);
    }

    const updatedUser = await User.update(req.user.id, { xp, level, unlockedLessons });
    
    res.json({
      xp: updatedUser.xp,
      level: updatedUser.level,
      unlockedLessons: updatedUser.unlockedLessons
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật tiến độ', error: err.message });
  }
});

// Heartbeat (Activity Tracking)
router.post('/heartbeat', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date().toISOString();
    
    // 1. Try to use the optimized RPC function
    const { error: rpcError } = await supabase.rpc('increment_active_minutes', { user_id: userId });
    
    // 2. If RPC fails (e.g. not defined yet), fallback to manual update
    if (rpcError) {
      const { error: updateError } = await supabase.from('users').update({ 
        last_active_at: now,
        active_minutes: (req.user.activeMinutes || 0) + 1 
      }).eq('id', userId);

      if (updateError) {
        // If update fails, it's likely the columns don't exist yet
        console.warn(`[HEARTBEAT] Could not update activity for ${userId}. Missing columns?`, updateError.message);
        return res.json({ success: false, message: 'Database schema update required' });
      }
    }

    res.json({ success: true, timestamp: now });
  } catch (err) {
    console.error('[HEARTBEAT ERROR]', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
