import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Middleware to verify JWT
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) throw new Error();

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Vui lòng đăng nhập lại' });
  }
};

// Get Profile
router.get('/profile', auth, async (req, res) => {
  res.json({
    id: req.user._id,
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
    
    if (xpGain) {
      req.user.xp += xpGain;
      // Simple leveling logic: 1000 XP per level
      req.user.level = Math.floor(req.user.xp / 1000) + 1;
    }

    if (unlockedLessonId && !req.user.unlockedLessons.includes(unlockedLessonId)) {
      req.user.unlockedLessons.push(unlockedLessonId);
    }

    await req.user.save();
    
    res.json({
      xp: req.user.xp,
      level: req.user.level,
      unlockedLessons: req.user.unlockedLessons
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật tiến độ', error: err.message });
  }
});

export default router;
