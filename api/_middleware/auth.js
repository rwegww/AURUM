import { supabase } from '../lib/supabase.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('Token missing');

    let userId;
    let user;

    const decoded = (() => {
      try {
        return jwt.verify(token, process.env.JWT_SECRET);
      } catch {
        return null;
      }
    })();

    if (decoded) {
      userId = decoded.id;
      req.decodedCustomJwt = decoded;
      user = await User.findById(userId);

      if (!decoded.sessionId) {
        throw new Error('INVALID_SESSION');
      }
      if (user?.currentSessionId && user.currentSessionId !== decoded.sessionId) {
        throw new Error('DUAL_LOGIN');
      }
    } else {
      const { data, error: sbError } = await supabase.auth.getUser(token);
      const sbUser = data?.user;

      if (!sbUser || sbError) {
        throw new Error('Xác thực thất bại');
      }

      userId = sbUser.id;
      user = await User.findById(userId);

      if (!user) {
        user = await User.findOne({ googleId: sbUser.id });
        if (!user && sbUser.email) {
          user = await User.findOne({ email: sbUser.email });
        }
      }

      if (!user) {
        user = await User.create({
          id: userId,
          username: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Môn đồ Hóa học',
          email: sbUser.email,
          password: 'supabase_oauth_no_password',
          role: 'student',
        });
      }
    }

    if (!user) throw new Error('Không tìm thấy thông tin người dùng');
    if (user.isLocked) {
      throw new Error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
    }

    req.user = user;
    req.userId = user.id;
    req.token = token;
    next();
  } catch (error) {
    const message = error.message === 'DUAL_LOGIN'
      ? 'Tai khoan da dang nhap o noi khac'
      : error.message === 'INVALID_SESSION'
        ? 'Phien dang nhap khong hop le'
        : error.message;

    res.status(401).json({
      message,
      error: error.message === 'DUAL_LOGIN' ? 'DUAL_LOGIN' : error.message,
    });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Quyền truy cập bị từ chối' });
  }
  return next();
};
