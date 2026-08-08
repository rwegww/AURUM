import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import { sendLoginOtpEmail, sendPasswordResetOtpEmail } from '../lib/mailer.js';
import { AuthSecurity, authSecret, normalizeEmail, isValidEmail } from '../lib/authSecurity.js';
import { auth } from '../_middleware/auth.js';
import { supabase } from '../lib/supabase.js';
import { isValidNewPassword, PASSWORD_POLICY_MESSAGE } from '../../shared/passwordPolicy.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const router = express.Router();
router.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
const hasControlCharacters = (value) => [...value].some((character) => {
  const codePoint = character.codePointAt(0);
  return codePoint < 32 || codePoint === 127;
});
const createOtp = () => crypto.randomInt(100000, 1000000).toString();
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
  if (err.retryAfter) res.set('Retry-After', String(err.retryAfter));
  return res.status(status).json({
    message: err.expose ? err.message : fallbackMessage,
    error: err.code || (status >= 500 ? 'AUTH_INTERNAL_ERROR' : 'AUTH_FAILED'),
    ...(err.retryAfter ? { retryAfter: err.retryAfter } : {}),
  });
};

const normalizeRegistrationInput = ({ username, password, email, proofImageUrl } = {}) => {
  const normalizedUsername = typeof username === 'string' ? username.trim() : '';
  const normalizedPassword = typeof password === 'string' ? password : '';
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedUsername || normalizedUsername.length > 64 || normalizedUsername.includes('@') || hasControlCharacters(normalizedUsername)) {
    throw authRouteError(400, 'Tên đăng nhập không được chứa @, ký tự điều khiển hoặc vượt quá 64 ký tự.', 'INVALID_USERNAME');
  }
  if (!isValidNewPassword(normalizedPassword)) {
    throw authRouteError(400, PASSWORD_POLICY_MESSAGE, 'INVALID_PASSWORD');
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

const createLoginResponse = async (user, completedSessionId = null) => {
  authSecret();
  assertLoginAllowed(user);
  const sessionId = completedSessionId || crypto.randomUUID();
  if (!completedSessionId && !await AuthSecurity.createSession(user, sessionId)) {
    throw authRouteError(401, 'Thông tin đăng nhập đã thay đổi. Vui lòng đăng nhập lại.', 'INVALID_CREDENTIALS');
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, sessionId },
    authSecret(),
    { algorithm: 'HS256', expiresIn: '7d' }
  );

  return {
    token,
    sessionId,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      xp: user.xp,
      level: user.level,
      inventory: user.inventory || { ingredients: [], craftedItems: [] },
      unlockedLessons: user.unlockedLessons,
      avatarSeed: user.avatarSeed,
      avatarUrl: user.avatarUrl,
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
    await AuthSecurity.limit(req, 'register', email, { account: 5, ip: 20, seconds: 3600 });
    
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
    await AuthSecurity.limit(req, 'register', email, { account: 5, ip: 20, seconds: 3600 });
    
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

// Legacy approval links were reusable bearer credentials. Existing links now
// guide the recipient to password login or email recovery without exchanging a token.
router.post('/magic-login', (_req, res) => res.status(410).json({
  message: 'Liên kết đăng nhập cũ không còn được hỗ trợ. Hãy đăng nhập bằng mật khẩu hoặc chọn Quên mật khẩu.',
  error: 'MAGIC_LINK_RETIRED',
}));

const requestChallenge = (purpose) => async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    if (!isValidEmail(email)) throw authRouteError(400, 'Email không hợp lệ.', 'INVALID_EMAIL');
    await AuthSecurity.limit(req, `request-${purpose}`, email, { account: 5, ip: 20, seconds: 3600 });
    const responseAt = Date.now() + 4000;
    const code = createOtp();
    const challenge = await AuthSecurity.issue(email, purpose, code);
    if (!challenge || typeof challenge.issued !== 'boolean') throw new Error('Invalid challenge result');
    if (challenge.issued && challenge.user_id) {
      const send = purpose === 'reset' ? sendPasswordResetOtpEmail : sendLoginOtpEmail;
      // Same public response for missing, locked, cooldown and failed-delivery cases.
      // Never return SMTP errors or a mailbox preview containing a login credential.
      try {
        const result = await send(email, challenge.username, code, 10);
        if (!result?.success) console.error('Authentication email delivery failed:', purpose);
      } catch {
        console.error('Authentication email delivery failed:', purpose);
      }
    }
    await AuthSecurity.waitForEmailResponse(responseAt);
    return res.json({
      message: 'Nếu email thuộc tài khoản đang hoạt động, bạn sẽ nhận được mã xác thực. Vui lòng kiểm tra hộp thư và thư rác.',
      expiresIn: 600,
      retryAfter: 60,
    });
  } catch (err) {
    return sendAuthRouteError(res, err, 'Không thể xử lý yêu cầu lúc này. Vui lòng thử lại sau.');
  }
};

router.post('/request-otp', requestChallenge('login'));
router.post('/forgot-password', requestChallenge('reset'));

const verifyChallenge = (purpose) => async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const code = typeof req.body?.otp === 'string' ? req.body.otp.replace(/\s/g, '') : '';
    if (!isValidEmail(email) || !/^\d{6}$/.test(code)) {
      throw authRouteError(400, 'Vui lòng nhập email hợp lệ và mã gồm 6 chữ số.', 'INVALID_CHALLENGE');
    }
    if (purpose === 'reset' && !isValidNewPassword(req.body?.newPassword)) {
      throw authRouteError(400, PASSWORD_POLICY_MESSAGE, 'INVALID_PASSWORD');
    }
    await AuthSecurity.limit(req, `verify-${purpose}`, email, { account: 20, ip: 60, seconds: 900 });
    const passwordHash = purpose === 'reset' ? await bcrypt.hash(req.body.newPassword, 12) : null;
    const result = await AuthSecurity.complete(email, purpose, code, passwordHash);
    if (!result?.user_id) {
      throw authRouteError(400, 'Mã không hợp lệ, đã hết hạn hoặc đã dùng. Vui lòng yêu cầu mã mới.', 'INVALID_CHALLENGE');
    }
    if (purpose === 'reset') {
      return res.json({ message: 'Đã đặt lại mật khẩu và thu hồi các phiên cũ. Vui lòng đăng nhập bằng mật khẩu mới.' });
    }
    const user = await User.findById(result.user_id);
    if (!user || !result.session_id) throw new Error('Invalid completed login');
    return res.json(await createLoginResponse(user, result.session_id));
  } catch (err) {
    return sendAuthRouteError(res, err, 'Không thể xác thực lúc này. Vui lòng thử lại sau.');
  }
};
router.post('/verify-otp', verifyChallenge('login'));
router.post('/reset-password', verifyChallenge('reset'));

// A real bcrypt comparison also runs for unknown usernames to reduce timing leaks.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync('unused-auth-timing-placeholder', 10);
router.post('/login', async (req, res) => {
  try {
    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!username || username.length > 320 || !password || Buffer.byteLength(password) > 1024
      || password === 'supabase_oauth_no_password') {
      throw authRouteError(400, 'Thông tin đăng nhập không chính xác.', 'INVALID_CREDENTIALS');
    }
    await AuthSecurity.limit(req, 'login', username.toLowerCase());
    const user = await User.findOne({ username, email: normalizeEmail(username) });
    const isMatch = await User.comparePassword(password, user?.password || DUMMY_PASSWORD_HASH);
    if (!user || !isMatch) {
      throw authRouteError(400, 'Thông tin đăng nhập không chính xác.', 'INVALID_CREDENTIALS');
    }
    return res.json(await createLoginResponse(user));
  } catch (err) {
    return sendAuthRouteError(res, err, 'Lỗi đăng nhập');
  }
});

router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (typeof currentPassword !== 'string' || !currentPassword || Buffer.byteLength(currentPassword) > 1024
      || !isValidNewPassword(newPassword)) {
      throw authRouteError(400, `Cần mật khẩu hiện tại. ${PASSWORD_POLICY_MESSAGE}`, 'INVALID_PASSWORD');
    }
    await AuthSecurity.limit(req, 'change-password', req.user.id);
    if (currentPassword === 'supabase_oauth_no_password' || !req.user.password
      || !await User.comparePassword(currentPassword, req.user.password)) {
      throw authRouteError(400, 'Mật khẩu hiện tại không chính xác.', 'INVALID_CREDENTIALS');
    }
    const changed = await AuthSecurity.changePassword(req.user, await bcrypt.hash(newPassword, 12));
    if (!changed) throw authRouteError(409, 'Thông tin tài khoản đã thay đổi. Vui lòng đăng nhập lại.', 'CREDENTIALS_CHANGED');
    return res.json({ message: 'Đã đổi mật khẩu và thu hồi các phiên cũ. Vui lòng đăng nhập lại.' });
  } catch (err) {
    return sendAuthRouteError(res, err, 'Không thể đổi mật khẩu lúc này.');
  }
});

router.post('/logout', auth, async (req, res) => {
  try {
    if (req.decodedCustomJwt) {
      await AuthSecurity.logout(req.user.id, req.decodedCustomJwt.sessionId);
    } else {
      const { error } = await supabase.auth.admin.signOut(req.token, 'local');
      if (error) throw error;
    }
    return res.json({ success: true });
  } catch (err) {
    return sendAuthRouteError(res, err, 'Không thể thu hồi phiên lúc này.');
  }
});

export default router;
