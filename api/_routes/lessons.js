import express from 'express';
import Lesson from '../_models/Lesson.js';

const router = express.Router();

// Get all bai_hoc with optional class filter
router.get('/', async (req, res) => {
  try {
    const { classId, gradeLevelId, programId } = req.query;
    let query = {};
    const requestedGradeLevelId = gradeLevelId ?? classId;
    if (requestedGradeLevelId) query.gradeLevelId = parseInt(requestedGradeLevelId);
    if (programId) query.programId = programId;

    const bai_hoc = await Lesson.find(query);
    
    res.json(bai_hoc);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tải danh sách bài học', error: err.message });
  }
});

// Get specific lesson by lessonId (slug)
router.get('/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Không tìm thấy bài học' });
    }

    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tải bài học', error: err.message });
  }
});

export default router;

