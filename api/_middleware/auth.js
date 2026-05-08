import { supabase } from '../lib/supabase.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('Token missing');

    let userId;
    let user;

    // 1. Try to verify as custom JWT first
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
      req.decodedCustomJwt = decoded;
      user = await User.findById(userId);
    } catch (jwtErr) {
      // 2. Fallback: Try as Supabase token
      const { data, error: sbError } = await supabase.auth.getUser(token);
      const sbUser = data?.user;
      
      if (sbUser && !sbError) {
        userId = sbUser.id;
        user = await User.findById(userId);
        
        // Link account by email if not found by ID
        if (!user && sbUser.email) {
          user = await User.findOne({ email: sbUser.email });
        }
        
        // If still no user, create them (auto-registration)
        if (!user) {
          user = await User.create({
            id: userId,
            username: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Môn đồ Hóa học',
            email: sbUser.email,
            password: 'supabase_oauth_no_password',
            role: 'student'
          });
        }
      } else {
        throw new Error('Xác thực thất bại');
      }
    }

    if (!user) throw new Error('Không tìm thấy thông tin người dùng');
    if (user.isLocked) throw new Error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');

    // Dual login feature temporarily disabled due to false positive lockouts

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    const status = e.message === 'DUAL_LOGIN' || e.message.includes('đăng nhập ở một thiết bị khác') ? 401 : 401;
    res.status(status).json({ 
      message: e.message === 'DUAL_LOGIN' ? 'Tài khoản đã đăng nhập ở nơi khác' : e.message, 
      error: e.message === 'DUAL_LOGIN' ? 'DUAL_LOGIN' : e.message 
    });
  }
};
