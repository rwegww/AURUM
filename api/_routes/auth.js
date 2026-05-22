import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { firebaseAdmin } from '../lib/firebaseAdmin.js';
import crypto from 'crypto';

const router = express.Router();

// Google Login with Firebase
router.post('/google-firebase', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'Token missing' });

    console.log('🔍 Received ID Token (start):', idToken.substring(0, 20) + '...');
    const decodedToken = await firebaseAdmin.verifyToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // 1. Check if user exists by firebase uid
    let user = await User.findById(uid);
    
    // 2. If not found by UID, check by email (to link existing accounts)
    if (!user && email) {
      user = await User.findOne({ email });
      if (user) {
        console.log(`🔗 Linking existing user ${user.username} (email: ${email}) to Firebase UID: ${uid}`);
        // We need to update the user ID to the Firebase UID for future lookups
        // Note: If the ID is a primary key, we might need a specific method. 
        // For now, let's just log in with this user and keep their existing ID
        // But to make findById(uid) work next time, we should ideally update the ID or store the mapping.
      }
    }

    if (!user) {
      // Create new user with Firebase UID as primary key
      user = await User.create({
        id: uid, 
        username: name || email.split('@')[0],
        email,
        password: 'google_oauth_no_password',
        role: 'student'
      });
    }

    const sessionId = crypto.randomUUID();
    await User.update(user.id, { currentSessionId: sessionId });

    const token = jwt.sign(
      { id: user.id, role: user.role, sessionId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        xp: user.xp,
        level: user.level,
        inventory: user.inventory || { ingredients: [], craftedItems: [] },
        unlockedLessons: user.unlockedLessons,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('🔥 Lỗi xác thực Firebase chi tiết:', {
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    res.status(401).json({ 
      message: `Lỗi Firebase: ${err.message}`, 
      error: err.code || 'unknown'
    });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, role, teacherCode } = req.body;
    
    if (role === 'teacher') {
      const validCode = process.env.TEACHER_INVITE_CODE || 'AURUM_TEACHER_2026';
      if (teacherCode !== validCode) {
        return res.status(403).json({ message: 'Mã xác thực giáo viên không hợp lệ!' });
      }
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
    }

    const user = await User.create({ username, password, email, role: role || 'student' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        xp: user.xp,
        level: user.level,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi đăng ký', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Attempt to find user by username OR email
    const user = await User.findOne({ username, email: username });
    
    if (!user) {
      return res.status(400).json({ message: 'Thông tin đăng nhập không chính xác' });
    }

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Thông tin đăng nhập không chính xác' });
    }

    const sessionId = crypto.randomUUID();
    await User.update(user.id, { currentSessionId: sessionId });

    const token = jwt.sign(
      { id: user.id, role: user.role, sessionId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        xp: user.xp,
        level: user.level,
        inventory: user.inventory || { ingredients: [], craftedItems: [] },
        unlockedLessons: user.unlockedLessons,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi đăng nhập', error: err.message });
  }
});

export default router;
