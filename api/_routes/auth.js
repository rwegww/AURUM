import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import { sendLoginOtpEmail } from '../lib/mailer.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const router = express.Router();
const emailOtpStore = new Map();
const OTP_TTL_MS = Number(process.env.LOGIN_OTP_TTL_SECONDS || 600) * 1000;
const OTP_COOLDOWN_MS = Number(process.env.LOGIN_OTP_COOLDOWN_SECONDS || 60) * 1000;
const OTP_MAX_ATTEMPTS = Number(process.env.LOGIN_OTP_MAX_ATTEMPTS || 5);

const normalizeEmail = (email = '') => String(email).trim().toLowerCase();
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const createOtp = () => crypto.randomInt(100000, 1000000).toString();
const hashOtp = (email, otp) =>
  crypto
    .createHash('sha256')
    .update(`${email}:${otp}:${process.env.JWT_SECRET || 'aurum-login-otp'}`)
    .digest('hex');

const removeExpiredOtp = (email) => {
  const record = emailOtpStore.get(email);
  if (record && record.expiresAt <= Date.now()) {
    emailOtpStore.delete(email);
    return true;
  }
  return false;
};

const createLoginResponse = async (user) => {
  const sessionId = crypto.randomUUID();
  await User.update(user.id, { currentSessionId: sessionId });

  const token = jwt.sign(
    { id: user.id, role: user.role, sessionId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      xp: user.xp,
      level: user.level,
      inventory: user.inventory || { ingredients: [], craftedItems: [] },
      unlockedLessons: user.unlockedLessons,
      createdAt: user.createdAt,
      linkedAccounts: user.linkedAccounts || {}
    }
  };
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, role = 'student', grade } = req.body;

    if (role !== 'student') {
      return res.status(403).json({ message: 'Đăng ký công khai chỉ dành cho tài khoản học sinh.' });
    }

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ tên đăng nhập, email và mật khẩu.' });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
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
    res.status(500).json({ message: 'Lỗi đăng ký', error: err.message });
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

    console.log('Đã tạo yêu cầu đăng ký giáo viên cho:', username);
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
    if (!token) return res.status(400).json({ message: 'Thiếu mã đăng nhập.' });

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

// Request login OTP via email
router.post('/request-otp', async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email không hợp lệ' });
    }

    removeExpiredOtp(email);
    const existingOtp = emailOtpStore.get(email);
    if (existingOtp && Date.now() - existingOtp.sentAt < OTP_COOLDOWN_MS) {
      const retryAfter = Math.ceil((OTP_COOLDOWN_MS - (Date.now() - existingOtp.sentAt)) / 1000);
      return res.status(429).json({
        message: `Vui lòng chờ ${retryAfter} giây trước khi gửi lại mã`,
        retryAfter
      });
    }

    const publicResponse = {
      message: 'Nếu email đã đăng ký, mã OTP đã được gửi.',
      expiresIn: Math.floor(OTP_TTL_MS / 1000)
    };

    const user = await User.findOne({ email });
    if (!user) {
      return res.json(publicResponse);
    }

    const otp = createOtp();
    const ttlMinutes = Math.max(1, Math.ceil(OTP_TTL_MS / 60000));
    const sendResult = await sendLoginOtpEmail(email, user.username, otp, ttlMinutes);

    if (!sendResult.success) {
      return res.status(500).json({
        message: 'Không gửi được mã OTP. Vui lòng thử lại sau.',
        error: sendResult.error
      });
    }

    emailOtpStore.set(email, {
      userId: user.id,
      hash: hashOtp(email, otp),
      expiresAt: Date.now() + OTP_TTL_MS,
      attempts: 0,
      sentAt: Date.now()
    });

    return res.json({
      ...publicResponse,
      ...(process.env.NODE_ENV !== 'production' && sendResult.previewUrl
        ? { previewUrl: sendResult.previewUrl }
        : {})
    });
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi gửi mã OTP', error: err.message });
  }
});

// Verify login OTP and create a normal app session
router.post('/verify-otp', async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const otp = String(req.body?.otp || '').replace(/\s/g, '');

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email không hợp lệ' });
    }
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ message: 'Mã OTP phải gồm 6 chữ số' });
    }

    const expired = removeExpiredOtp(email);
    const record = emailOtpStore.get(email);
    if (expired || !record) {
      return res.status(400).json({ message: 'Mã OTP đã hết hạn hoặc không hợp lệ' });
    }

    record.attempts += 1;
    if (record.attempts > OTP_MAX_ATTEMPTS) {
      emailOtpStore.delete(email);
      return res.status(400).json({ message: 'Bạn đã nhập sai quá nhiều lần. Vui lòng gửi mã mới.' });
    }

    if (hashOtp(email, otp) !== record.hash) {
      if (record.attempts >= OTP_MAX_ATTEMPTS) {
        emailOtpStore.delete(email);
      }
      return res.status(400).json({ message: 'Mã OTP không chính xác' });
    }

    const user = await User.findById(record.userId);
    emailOtpStore.delete(email);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    return res.json(await createLoginResponse(user));
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi xác thực OTP', error: err.message });
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

