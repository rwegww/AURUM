import express from 'express';
import { Discussion, Note } from '../models/Discussion.js';
import { auth } from '../_middleware/auth.js';

const router = express.Router();
const MAX_COMMENT_LENGTH = 2000;
const MAX_NOTE_LENGTH = 8000;

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

// --- DISCUSSION ROUTES ---

// Get student's private note for a lesson. Keep this before /:lessonId.
router.get('/notes/:lessonId', auth, async (req, res) => {
  try {
    const note = await Note.get(req.user.id, req.params.lessonId);
    res.json(note || { content: '' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
    const normalizedLessonId = normalizeText(lessonId);
    const normalizedContent = normalizeText(content);

    if (!normalizedLessonId) return res.status(400).json({ error: 'Thiếu bài học để gửi thảo luận.' });
    if (!normalizedContent) return res.status(400).json({ error: 'Vui lòng nhập nội dung thảo luận.' });
    if (normalizedContent.length > MAX_COMMENT_LENGTH) {
      return res.status(400).json({ error: `Nội dung thảo luận tối đa ${MAX_COMMENT_LENGTH} ký tự.` });
    }
    
    const comment = await Discussion.create(req.user.id, normalizedLessonId, normalizedContent, parentId);
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

// Save student's private note
router.post('/notes', auth, async (req, res) => {
  try {
    const { lessonId, content } = req.body;
    const normalizedLessonId = normalizeText(lessonId);
    const normalizedContent = typeof content === 'string' ? content.trim() : '';

    if (!normalizedLessonId) return res.status(400).json({ error: 'Thiếu bài học để lưu ghi chú.' });
    if (normalizedContent.length > MAX_NOTE_LENGTH) {
      return res.status(400).json({ error: `Ghi chú tối đa ${MAX_NOTE_LENGTH} ký tự.` });
    }

    const note = await Note.save(req.user.id, normalizedLessonId, normalizedContent);
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
