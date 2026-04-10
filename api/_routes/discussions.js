import express from 'express';
import { Discussion, Note } from '../models/Discussion.js';
import { supabase } from '../lib/supabase.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to verify JWT
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Hãy đăng nhập để thực hiện' });

    const { data: { user: sbUser }, error: sbError } = await supabase.auth.getUser(token);
    
    if (sbUser && !sbError) {
      req.user = await User.findById(sbUser.id);
      if (!req.user) {
         // Create profile if missing
         req.user = await User.create({
            id: sbUser.id,
            username: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0],
            email: sbUser.email
         });
      }
      return next();
    }
    throw new Error('Unauthorized');
  } catch (err) {
    res.status(401).json({ error: 'Phiên làm việc hết hạn' });
  }
};

// --- DISCUSSION ROUTES ---

// Get discussions for a lesson
router.get('/:lessonId', async (req, res) => {
  try {
    const discussions = await Discussion.getByLesson(req.params.lessonId);
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post a new comment or reply
router.post('/', auth, async (req, res) => {
  try {
    const { lessonId, content, parentId } = req.body;
    if (!content) return res.status(400).json({ error: 'Nội dung không được để trống' });
    
    const comment = await Discussion.create(req.user.id, lessonId, content, parentId);
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like a comment
router.post('/:id/like', auth, async (req, res) => {
  try {
    const updated = await Discussion.like(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NOTE ROUTES ---

// Get student's private note for a lesson
router.get('/notes/:lessonId', auth, async (req, res) => {
  try {
    const note = await Note.get(req.user.id, req.params.lessonId);
    res.json(note || { content: '' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save student's private note
router.post('/notes', auth, async (req, res) => {
  try {
    const { lessonId, content } = req.body;
    const note = await Note.save(req.user.id, lessonId, content);
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
