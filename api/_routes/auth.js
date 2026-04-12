import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { firebaseAdmin } from '../lib/firebaseAdmin.js';

const router = express.Router();

// Google Login with Firebase
router.post('/google-firebase', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'Token missing' });

    const decodedToken = await firebaseAdmin.verifyToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Check if user exists by firebase uid (which we store in users.id)
    let user = await User.findById(uid);
    
    // Fallback: check by email if UID not found (maybe they first registered via email)
    if (!user && email) {
      // Find user by email and potentially link them? 
      // For now, let's create a new one if not found
    }

    if (!user) {
      // Create new user with Firebase UID as primary key
      user = await User.create({
        id: uid, // Use Firebase UID
        username: name || email.split('@')[0],
        email,
        password: 'google_oauth_no_password',
        role: 'student'
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
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
        inventory: user.inventory,
        unlockedLessons: user.unlockedLessons,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Lỗi xác thực Firebase:', err);
    res.status(401).json({ message: 'Xác thực Google thất bại', error: err.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, role } = req.body;
    
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

    const token = jwt.sign(
      { id: user.id, role: user.role },
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
        inventory: user.inventory,
        unlockedLessons: user.unlockedLessons,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi đăng nhập', error: err.message });
  }
});

export default router;
