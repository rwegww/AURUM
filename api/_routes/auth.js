import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, role = 'student', grade } = req.body;

    if (role !== 'student') {
      return res.status(403).json({ message: 'Public registration only supports student accounts' });
    }

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Missing required registration fields' });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'TÃªn Ä‘Äƒng nháº­p Ä‘Ã£ tá»“n táº¡i' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email da duoc su dung' });
    }

    const user = await User.create({ username, password, email, role: 'student', grade });
    const sessionId = crypto.randomUUID();
    await User.update(user.id, { currentSessionId: sessionId });

    const token = jwt.sign(
      { id: user.id, role: user.role, sessionId },
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
        createdAt: user.createdAt,
        linkedAccounts: user.linkedAccounts || {}
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Lá»—i Ä‘Äƒng kÃ½', error: err.message });
  }
});

// Register Teacher (Pending Approval)
router.post('/register-teacher', async (req, res) => {
  // Ensure we always respond with JSON
  res.setHeader('Content-Type', 'application/json');
  
  try {
    console.log('ðŸ“ [register-teacher] Request body keys:', Object.keys(req.body || {}));
    const { username, password, email, proofImageUrl } = req.body;
    
    if (!username || !password || !email || !proofImageUrl) {
      console.warn('âš ï¸ [register-teacher] Missing fields:', { username: !!username, password: !!password, email: !!email, proofImageUrl: !!proofImageUrl });
      return res.status(400).json({ message: 'Vui lÃ²ng cung cáº¥p Ä‘áº§y Ä‘á»§ thÃ´ng tin vÃ  áº£nh minh chá»©ng' });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'TÃªn Ä‘Äƒng nháº­p Ä‘Ã£ tá»“n táº¡i' });
    }

    // Check if email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email Ä‘Ã£ Ä‘Æ°á»£c sá»­ dá»¥ng' });
    }
    
    // Hash the password so we don't store it in plain text even in phan_hoi
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const messageContent = JSON.stringify({
      email: email,
      hashedPassword: hashedPassword
    });

    // Create a special phan_hoi entry to hold the request
    await Feedback.create({
      userId: null,
      username: username,
      type: 'teacher_registration',
      message: messageContent,
      imageUrl: proofImageUrl,
      status: 'unread'
    });

    console.log('âœ… [register-teacher] Teacher registration request created for:', username);
    return res.status(201).json({ message: 'YÃªu cáº§u Ä‘Äƒng kÃ½ Ä‘Ã£ Ä‘Æ°á»£c gá»­i. Vui lÃ²ng chá» Quáº£n trá»‹ viÃªn duyá»‡t qua Email.' });
  } catch (err) {
    console.error('âŒ [register-teacher] Error:', err.message, err.stack);
    return res.status(500).json({ message: 'Lá»—i server', error: err.message });
  }
});

// Magic Login via Email Link
router.post('/magic-login', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.magicLogin) {
      return res.status(400).json({ message: 'Token khÃ´ng há»£p lá»‡ cho tÃ­nh nÄƒng nÃ y' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'KhÃ´ng tÃ¬m tháº¥y ngÆ°á»i dÃ¹ng' });
    }

    const sessionId = crypto.randomUUID();
    await User.update(user.id, { currentSessionId: sessionId });

    const authToken = jwt.sign(
      { id: user.id, role: user.role, sessionId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token: authToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        xp: user.xp,
        level: user.level,
        inventory: user.inventory || { ingredients: [], craftedItems: [] },
        unlockedLessons: user.unlockedLessons,
        createdAt: user.createdAt,
        linkedAccounts: user.linkedAccounts || {}
      }
    });
  } catch (err) {
    res.status(401).json({ message: 'Link Ä‘Äƒng nháº­p Ä‘Ã£ háº¿t háº¡n hoáº·c khÃ´ng há»£p lá»‡', error: err.message });
  }
});


// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Attempt to find user by username OR email
    const user = await User.findOne({ username, email: username });
    
    if (!user) {
      return res.status(400).json({ message: 'ThÃ´ng tin Ä‘Äƒng nháº­p khÃ´ng chÃ­nh xÃ¡c' });
    }

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'ThÃ´ng tin Ä‘Äƒng nháº­p khÃ´ng chÃ­nh xÃ¡c' });
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
        createdAt: user.createdAt,
        linkedAccounts: user.linkedAccounts || {}
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Lá»—i Ä‘Äƒng nháº­p', error: err.message });
  }
});

export default router;

