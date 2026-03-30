import express from 'express';
import Lesson from '../models/Lesson.js';

const router = express.Router();

// Get all lessons with optional class filter
router.get('/', async (req, res) => {
  try {
    const { classId, programId } = req.query;
    let query = {};
    if (classId) query.classId = parseInt(classId);
    if (programId) query.programId = programId;

    const lessons = await Lesson.find(query)
      .select('lessonId classId title chapter order isPremium description')
      .sort({ classId: 1, order: 1 });
    
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tải danh sách bài học', error: err.message });
  }
});

// Get specific lesson by lessonId (slug)
router.get('/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findOne({ lessonId });
    
    if (!lesson) {
      return res.status(404).json({ message: 'Không tìm thấy bài học' });
    }

    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tải bài học', error: err.message });
  }
});

export default router;
