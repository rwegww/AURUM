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
    const { data: { user: sbUser }, error: sbError } = await supabase.auth.getUser(token);
    
    if (sbUser && !sbError) {
      userId = sbUser.id;
      // Check if user exists in our local 'users' table
      user = await User.findById(userId);
      
      // If Supabase user exists but not in our 'users' table, create a basic profile
      if (!user) {
        user = await User.create({
          id: userId,
          username: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'User',
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

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    console.error('Auth Middleware Error:', e.message);
    res.status(401).json({ message: 'Vui lòng đăng nhập lại', error: e.message });
  }
};

// Get Profile
router.get('/profile', auth, async (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    role: req.user.role,
    xp: req.user.xp,
    level: req.user.level,
    inventory: req.user.inventory,
    unlockedLessons: req.user.unlockedLessons
  });
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

export default router;
