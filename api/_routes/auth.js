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
const hasControlCharacters = (value) => [...value].some((character) => {
  const codePoint = character.codePointAt(0);
  return codePoint < 32 || codePoint === 127;
});
const createOtp = () => crypto.randomInt(100000, 1000000).toString();
const hashOtp = (email, otp) =>
  crypto
    .createHash('sha256')
    .update(`${email}:${otp}:${process.env.JWT_SECRET || 'aurum-login-otp'}`)
    .digest('hex');

const authRouteError = (status, message, code) => {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  error.expose = true;
  return error;
};

const assertLoginAllowed = (user) => {
  if (user?.isLocked) {
    throw authRouteError(
      403,
      'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.',
      'ACCOUNT_LOCKED',
    );
  }
};

const sendAuthRouteError = (res, err, fallbackMessage, fallbackStatus = 500) => {
  const status = err.status || fallbackStatus;
  return res.status(status).json({
    message: err.expose ? err.message : fallbackMessage,
    error: err.code || (status >= 500 ? 'AUTH_INTERNAL_ERROR' : 'AUTH_FAILED'),
  });
};

const normalizeRegistrationInput = ({ username, password, email, proofImageUrl } = {}) => {
  const normalizedUsername = typeof username === 'string' ? username.trim() : '';
  const normalizedPassword = typeof password === 'string' ? password : '';
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedUsername || normalizedUsername.length > 64 || hasControlCharacters(normalizedUsername)) {
    throw authRouteError(400, 'Tên đăng nhập không hợp lệ hoặc vượt quá 64 ký tự.', 'INVALID_USERNAME');
  }
  if (normalizedPassword.length < 6 || normalizedPassword.length > 128) {
    throw authRouteError(400, 'Mật khẩu phải có từ 6 đến 128 ký tự.', 'INVALID_PASSWORD');
  }
  if (normalizedPassword === 'supabase_oauth_no_password') {
    throw authRouteError(400, 'Mật khẩu này không an toàn. Vui lòng chọn mật khẩu khác.', 'INVALID_PASSWORD');
  }
  if (!isValidEmail(normalizedEmail) || normalizedEmail.length > 320) {
    throw authRouteError(400, 'Email không hợp lệ.', 'INVALID_EMAIL');
  }

  let normalizedProofImageUrl;
  if (proofImageUrl !== undefined) {
    try {
      if (typeof proofImageUrl !== 'string') throw new Error('invalid URL');
      const parsed = new URL(proofImageUrl);
      if (!['http:', 'https:'].includes(parsed.protocol) || proofImageUrl.length > 2048) throw new Error('invalid URL');
      normalizedProofImageUrl = parsed.toString();
    } catch {
      throw authRouteError(400, 'Ảnh minh chứng phải là địa chỉ HTTP(S) hợp lệ.', 'INVALID_PROOF_URL');
    }
  }

  return {
    username: normalizedUsername,
    password: normalizedPassword,
    email: normalizedEmail,
    proofImageUrl: normalizedProofImageUrl,
  };
};

const removeExpiredOtp = (email) => {
  const record = emailOtpStore.get(email);
  if (record && record.expiresAt <= Date.now()) {
    emailOtpStore.delete(email);
    return true;
  }
  return false;
};

const createLoginResponse = async (user) => {
  assertLoginAllowed(user);
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
    const { role = 'student', grade } = req.body || {};

    if (role !== 'student') {
      return res.status(403).json({ message: 'Đăng ký công khai chỉ dành cho tài khoản học sinh.' });
    }

    const { username, password, email } = normalizeRegistrationInput(req.body);
    
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
    return res.status(201).json(await createLoginResponse(user));
  } catch (err) {
    return sendAuthRouteError(res, err, 'Lỗi đăng ký');
  }
});

// Register Teacher (Pending Approval)
router.post('/register-teacher', async (req, res) => {
  // Ensure we always respond with JSON
  res.setHeader('Content-Type', 'application/json');
  
  try {
    if (!req.body?.proofImageUrl) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin và ảnh minh chứng' });
    }
    const { username, password, email, proofImageUrl } = normalizeRegistrationInput(req.body);
    
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

    const pendingRequest = await Feedback.findPendingTeacherRegistration({ username, email });
    if (pendingRequest) {
      throw authRouteError(
        409,
        'Tên đăng nhập hoặc email này đã có yêu cầu đang chờ duyệt.',
        'TEACHER_REQUEST_PENDING',
      );
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
      status: 'unread',
      metadata: { email },
    });

    return res.status(201).json({ message: 'Yêu cầu đăng ký đã được gửi. Vui lòng chờ Quản trị viên duyệt qua Email.' });
  } catch (err) {
    if ((err.status || 500) >= 500) {
      console.error('Lỗi tạo yêu cầu giáo viên:', err);
    }
    return sendAuthRouteError(res, err, 'Không thể tạo yêu cầu giáo viên.');
  }
});

// Magic Login via Email Link
router.post('/magic-login', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Thiếu mã đăng nhập.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    if (!decoded.magicLogin) {
      return res.status(400).json({ message: 'Token không hợp lệ cho tính năng này' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    return res.json(await createLoginResponse(user));
  } catch (err) {
    if (err.code === 'ACCOUNT_LOCKED') {
      return sendAuthRouteError(res, err, 'Không thể đăng nhập.');
    }
    return res.status(401).json({
      message: 'Link đăng nhập đã hết hạn hoặc không hợp lệ',
      error: 'INVALID_MAGIC_LINK',
    });
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
    if (!user || user.isLocked) {
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
    return sendAuthRouteError(res, err, 'Lỗi gửi mã OTP');
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
    return sendAuthRouteError(res, err, 'Lỗi xác thực OTP');
  }
});


// Login
router.post('/login', async (req, res) => {
  try {
    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    // Older OAuth accounts were provisioned with this shared placeholder.
    // Deny it for existing accounts too, without modifying their database rows.
    if (!username || !password || password === 'supabase_oauth_no_password') {
      return res.status(400).json({ message: 'Thông tin đăng nhập không chính xác', error: 'INVALID_CREDENTIALS' });
    }
    
    // Attempt to find user by username OR email
    const user = await User.findOne({ username, email: username });
    
    if (!user) {
      return res.status(400).json({ message: 'Thông tin đăng nhập không chính xác' });
    }

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Thông tin đăng nhập không chính xác' });
    }

    return res.json(await createLoginResponse(user));
  } catch (err) {
    return sendAuthRouteError(res, err, 'Lỗi đăng nhập');
  }
});

export default router;

