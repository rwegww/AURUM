import express from 'express';
import { Discussion, Note } from '../models/Discussion.js';
import { supabase } from '../lib/supabase.js';
import User from '../models/User.js';
import { auth } from '../_middleware/auth.js';

const router = express.Router();

// Middleware to verify JWT

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
