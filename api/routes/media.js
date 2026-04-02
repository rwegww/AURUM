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
    folder: 'chemistry-odyssey/lessons',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'mp4'],
    resource_type: 'auto'
  }
});

const upload = multer({ storage: storage });

// Role Middleware
const adminOnly = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();

    let userId;
    let user;

    const { data: { user: sbUser } } = await supabase.auth.getUser(token);
    if (sbUser) {
      userId = sbUser.id;
      user = await User.findById(userId);
    } else {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
        user = await User.findById(userId);
      } catch (err) {
        throw new Error();
      }
    }

    if (!user || user.role === 'student') throw new Error();

    req.user = user;
    next();
  } catch (e) {
    res.status(403).json({ message: 'Quyền truy cập bị từ chối' });
  }
};

// Upload Endpoint
router.post('/upload', adminOnly, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có tệp nào được tải lên' });
    }
    
    res.json({
      url: req.file.path,
      public_id: req.file.filename,
      message: 'Tải lên thành công!'
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tải lên Cloudinary', error: err.message });
  }
});

export default router;
