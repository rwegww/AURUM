import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import { firebaseAdmin } from '../lib/firebaseAdmin.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

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
        createdAt: user.createdAt,
        linkedAccounts: user.linkedAccounts || {}
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
    const { username, password, email, role, teacherCode, grade } = req.body;
    
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

    const user = await User.create({ username, password, email, role: role || 'student', grade });

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
        createdAt: user.createdAt,
        linkedAccounts: user.linkedAccounts || {}
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi đăng ký', error: err.message });
  }
});

// DEBUG: Test register-teacher step by step (remove after debugging)
router.post('/debug-register-teacher', async (req, res) => {
  const steps = [];
  try {
    steps.push('step1: route entered');
    const { username, password, email, proofImageUrl } = req.body;
    steps.push(`step2: parsed body - username=${username}, email=${email}, hasProof=${!!proofImageUrl}`);

    const existingUser = await User.findOne({ username });
    steps.push(`step3: User.findOne done - exists=${!!existingUser}`);

    const hashedPassword = await bcrypt.hash(password || 'test', 10);
    steps.push('step4: bcrypt.hash done');

    await Feedback.create({
      userId: null,
      username: username || 'debugtest',
      type: 'teacher_registration',
      message: JSON.stringify({ email, hashedPassword }),
      imageUrl: proofImageUrl || 'https://example.com/test.jpg',
      status: 'unread'
    });
    steps.push('step5: Feedback.create done');

    return res.json({ success: true, steps });
  } catch (err) {
    steps.push(`ERROR: ${err.message}`);
    return res.status(500).json({ success: false, steps, error: err.message, stack: err.stack });
  }
});

// Register Teacher (Pending Approval)
router.post('/register-teacher', async (req, res) => {
  // Ensure we always respond with JSON
  res.setHeader('Content-Type', 'application/json');
  
  try {
    console.log('📝 [register-teacher] Request body keys:', Object.keys(req.body || {}));
    const { username, password, email, proofImageUrl } = req.body;
    
    if (!username || !password || !email || !proofImageUrl) {
      console.warn('⚠️ [register-teacher] Missing fields:', { username: !!username, password: !!password, email: !!email, proofImageUrl: !!proofImageUrl });
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin và ảnh minh chứng' });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
    }

    // Check if email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }
    
    // Hash the password so we don't store it in plain text even in feedback
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const messageContent = JSON.stringify({
      email: email,
      hashedPassword: hashedPassword
    });

    // Create a special feedback entry to hold the request
    await Feedback.create({
      userId: null,
      username: username,
      type: 'teacher_registration',
      message: messageContent,
      imageUrl: proofImageUrl,
      status: 'unread'
    });

    console.log('✅ [register-teacher] Teacher registration request created for:', username);
    return res.status(201).json({ message: 'Yêu cầu đăng ký đã được gửi. Vui lòng chờ Quản trị viên duyệt qua Email.' });
  } catch (err) {
    console.error('❌ [register-teacher] Error:', err.message, err.stack);
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// Magic Login via Email Link
router.post('/magic-login', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.magicLogin) {
      return res.status(400).json({ message: 'Token không hợp lệ cho tính năng này' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
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
    res.status(401).json({ message: 'Link đăng nhập đã hết hạn hoặc không hợp lệ', error: err.message });
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
        createdAt: user.createdAt,
        linkedAccounts: user.linkedAccounts || {}
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi đăng nhập', error: err.message });
  }
});

export default router;
