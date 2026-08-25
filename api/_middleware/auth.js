import { supabase } from '../_lib/supabase.js';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import User from '../_models/User.js';
import { AuthSecurity } from '../_lib/authSecurity.js';

class AuthenticationError extends Error {
  constructor(code, message, status = 401) {
    super(message);
    this.name = 'AuthenticationError';
    this.code = code;
    this.status = status;
  }
}

export const extractBearerToken = (req) => {
  const header = req.header('Authorization');
  if (!header) return null;

  const match = /^Bearer\s+(\S+)$/i.exec(header.trim());
  if (!match) {
    throw new AuthenticationError(
      'INVALID_AUTHORIZATION_HEADER',
      'Định dạng phiên đăng nhập không hợp lệ.'
    );
  }

  return match[1];
};

const verifyCustomToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    if (
      decoded
      && typeof decoded === 'object'
      && !decoded.magicLogin && !decoded.purpose
      && typeof decoded.id === 'string'
      && decoded.id.trim()
    ) {
      return decoded;
    }
  } catch {
    // It may be a Supabase access token; validate it with the Auth server below.
  }
  return null;
};

const normalizeUserRole = (role) => {
  const normalized = typeof role === 'string'
    ? role.trim().toLowerCase().replace(/\s+/g, '_')
    : '';

  if (['admin', 'quan_tri', 'quan_tri_vien', 'quản_trị', 'quản_trị_viên'].includes(normalized)) {
    return 'admin';
  }
  if (['teacher', 'giao_vien', 'giáo_viên'].includes(normalized)) {
    return 'teacher';
  }
  if (['student', 'hoc_sinh', 'học_sinh'].includes(normalized)) {
    return 'student';
  }

  return role;
};

const normalizeAuthenticatedUser = (user) => user ? ({
  ...user,
  role: normalizeUserRole(user.role),
}) : user;

const getGoogleAvatarUrl = (sbUser) => {
  const url = sbUser?.user_metadata?.avatar_url || sbUser?.user_metadata?.picture;
  if (typeof url !== 'string') return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' ? parsed.toString() : null;
  } catch {
    return null;
  }
};

const resolveSupabaseUser = async (token) => {
  const { data, error } = await supabase.auth.getUser(token);
  const sbUser = data?.user;

  if (!sbUser || error) {
    throw new AuthenticationError('INVALID_TOKEN', 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.');
  }

  // Prefer an explicit OAuth link over a same-id lookup. A teacher/admin may
  // link Google after a student shadow profile was created for that OAuth id.
  let user = await User.findOne({ googleId: sbUser.id });

  if (!user) {
    user = await User.findById(sbUser.id);
  }

  if (!user && sbUser.email) {
    const emailConfirmed = Boolean(sbUser.email_confirmed_at || sbUser.confirmed_at);
    const emailUser = emailConfirmed ? await User.findOne({ email: sbUser.email }) : null;

    // Registration email is not proof of ownership: automatic email merging
    // would let a pre-registered password survive the victim's Google login.
    if (emailUser) {
      throw new AuthenticationError(
        emailUser.role !== 'student' ? 'PRIVILEGED_ACCOUNT_LINK_REQUIRED' : 'ACCOUNT_LINK_REQUIRED',
        'Email này đã có tài khoản. Hãy đăng nhập bằng mật khẩu (hoặc đặt lại mật khẩu), rồi liên kết Google từ hồ sơ.',
        403
      );
    }
    user = emailUser;
  }

  if (!user) {
    if (!sbUser.email_confirmed_at && !sbUser.confirmed_at) {
      throw new AuthenticationError('EMAIL_NOT_VERIFIED', 'Vui lòng xác minh email trước khi đăng nhập.', 403);
    }
    const googleAvatarUrl = getGoogleAvatarUrl(sbUser);
    user = await User.create({
      id: sbUser.id,
      username: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Môn đồ Hóa học',
      email: sbUser.email,
      // OAuth accounts must never share a publicly known password.
      password: crypto.randomBytes(48).toString('base64url'),
      role: 'student',
      linkedAccounts: {
        google: sbUser.id,
        ...(googleAvatarUrl ? { googleAvatarUrl } : {}),
      },
    });
  } else {
    const googleAvatarUrl = getGoogleAvatarUrl(sbUser);
    const linkedAccounts = user.linkedAccounts || {};
    const shouldSyncGoogleProfile = !linkedAccounts.google || linkedAccounts.google === sbUser.id;
    if (shouldSyncGoogleProfile && (linkedAccounts.google !== sbUser.id || linkedAccounts.googleAvatarUrl !== googleAvatarUrl)) {
      user = await User.update(user.id, {
        linkedAccounts: {
          ...linkedAccounts,
          google: sbUser.id,
          ...(googleAvatarUrl ? { googleAvatarUrl } : {}),
        },
      });
    }
  }

  const sessionId = jwt.decode(token)?.session_id;
  if (!user || !(await AuthSecurity.oauthSessionActive(sessionId, sbUser.id, user.id))) {
    throw new AuthenticationError('INVALID_SESSION', 'Phiên đăng nhập đã bị thu hồi. Vui lòng đăng nhập lại.');
  }
  return { user: normalizeAuthenticatedUser(user), decodedCustomJwt: null };
};

export const authenticateToken = async (token) => {
  if (!token) {
    throw new AuthenticationError('MISSING_TOKEN', 'Thiếu phiên đăng nhập.');
  }

  const decoded = verifyCustomToken(token);
  let user;

  if (decoded) {
    user = await User.findById(decoded.id);
    if (!user) {
      throw new AuthenticationError('USER_NOT_FOUND', 'Không tìm thấy thông tin người dùng.');
    }
    if (typeof decoded.sessionId !== 'string' || !decoded.sessionId.trim() || !user.currentSessionId) {
      throw new AuthenticationError('INVALID_SESSION', 'Phiên đăng nhập không còn hợp lệ.');
    }
    if (user.currentSessionId !== decoded.sessionId) {
      throw new AuthenticationError('DUAL_LOGIN', 'Tài khoản này đang đăng nhập ở nơi khác.');
    }
  } else {
    ({ user } = await resolveSupabaseUser(token));
  }

  user = normalizeAuthenticatedUser(user);

  if (user.isLocked) {
    throw new AuthenticationError(
      'ACCOUNT_LOCKED',
      'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.',
      403
    );
  }

  return { user, decodedCustomJwt: decoded };
};

export const auth = async (req, res, next) => {
  try {
    const token = extractBearerToken(req);
    const { user, decodedCustomJwt } = await authenticateToken(token);

    req.user = user;
    req.userId = user.id;
    req.token = token;
    if (decodedCustomJwt) req.decodedCustomJwt = decodedCustomJwt;
    return next();
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.error('Authentication backend error:', error);
      return res.status(503).json({
        message: 'Dịch vụ xác thực tạm thời không khả dụng. Vui lòng thử lại sau.',
        error: 'AUTH_SERVICE_UNAVAILABLE',
      });
    }

    return res.status(error.status).json({
      message: error.message,
      error: error.code,
    });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Quyền truy cập bị từ chối' });
  }
  return next();
};
