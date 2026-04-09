import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { supabase } from '../lib/supabase.js';

dotenv.config();

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'chemistry-odyssey/assignments',
    resource_type: 'auto'
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Role Middleware (Admin or Teacher)
const teacherOrAdmin = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      console.warn('⚠️ No Authorization header provided');
      return res.status(401).json({ message: 'Không tìm thấy mã xác thực' });
    }

    const token = authHeader.replace('Bearer ', '');
    let userId;
    let user;

    // Try Supabase auth first
    const { data: { user: sbUser }, error: sbError } = await supabase.auth.getUser(token);
    
    if (sbUser) {
      userId = sbUser.id;
      user = await User.findById(userId);
    } else {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
        user = await User.findById(userId);
      } catch (err) {
        console.error('❌ Token verification failed:', err.message);
        return res.status(401).json({ message: 'Mã xác thực không hợp lệ' });
      }
    }

    if (!user) {
      console.warn(`⚠️ User not found for ID: ${userId}`);
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    if (user.role !== 'admin' && user.role !== 'teacher') {
      console.warn(`⚠️ Forbidden access for role: ${user.role} (User: ${user.username})`);
      return res.status(403).json({ message: 'Quyền truy cập bị từ chối' });
    }

    req.user = user;
    next();
  } catch (e) {
    console.error('❌ teacherOrAdmin Middleware Error:', e);
    res.status(500).json({ message: 'Lỗi xác thực hệ thống', error: e.message });
  }
};

// Upload Endpoint
router.post('/upload', (req, res, next) => {
  // Manual check for teacherOrAdmin so we can catch errors better
  teacherOrAdmin(req, res, (err) => {
    if (err) return next(err);
    
    // Proceed to file upload
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.error('❌ Multer/Cloudinary Upload Error:', err);
        return res.status(500).json({ 
          message: 'Lỗi tải tệp lên máy chủ lưu trữ', 
          error: err.message,
          details: err
        });
      }
      
      try {
        if (!req.file) {
          return res.status(400).json({ message: 'Không có tệp nào được nhận' });
        }
        
        console.log('✅ File uploaded successfully:', req.file.path);
        res.json({
          url: req.file.path,
          public_id: req.file.filename,
          message: 'Tải lên thành công!'
        });
      } catch (err) {
        console.error('❌ Post-upload Error:', err);
        res.status(500).json({ message: 'Lỗi xử lý kết quả tải lên', error: err.message });
      }
    });
  });
});

export default router;
