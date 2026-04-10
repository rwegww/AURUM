import express from 'express';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { supabase } from '../lib/supabase.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } }); // 20MB max

// Auth Middleware
const teacherOrAdmin = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: 'Không tìm thấy mã xác thực' });

    const token = authHeader.replace('Bearer ', '');
    const { data, error: sbError } = await supabase.auth.getUser(token);
    const sbUser = data?.user;
    
    let userId = sbUser?.id;
    if (!userId) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (err) {
            return res.status(401).json({ message: 'Mã xác thực không hợp lệ' });
        }
    }

    const user = await User.findById(userId);
    if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
      return res.status(403).json({ message: 'Quyền truy cập bị từ chối' });
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(500).json({ message: 'Lỗi xác thực hệ thống', error: e.message });
  }
};

router.post('/analyze-file', teacherOrAdmin, upload.single('file'), async (req, res) => {
  try {
    console.log('--- Analyzing File (Dynamic Load) ---');
    if (!req.file) {
      return res.status(400).json({ message: 'Không có tệp nào được nhận' });
    }

    let text = '';
    const mimetype = req.file.mimetype;

    if (mimetype === 'application/pdf') {
      const pdf = require('pdf-parse');
      const data = await pdf(req.file.buffer);
      text = data.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               req.file.originalname.endsWith('.docx')) {
      const mammoth = await import('mammoth');
      const data = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = data.value;
    } else {
      // Fallback for .doc
      const WordExtractor = require('word-extractor');
      const extractor = new WordExtractor();
      const doc = await extractor.extract(req.file.buffer);
      text = doc.getBody();
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Không thể trích xuất nội dung từ tệp này.' });
    }

    const questions = parseQuestions(text);
    res.json({ success: true, questions });
  } catch (err) {
    console.error('CRITICAL File Analysis Error:', err);
    res.status(500).json({ message: 'Lỗi phân tích tệp hệ thống', error: err.message });
  }
});

function parseQuestions(text) {
  const questions = [];
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\n+/g, '\n');
  
  // Split by common question markers OR section headers
  const rawBlocks = normalizedText.split(/(?=(?:Câu|Bài|C|Question|Q)\s*\d+[:.-]?|\b\d+[:.-]\s+|(?:PHẦN|Phần)\s*(?:I|II|III|IV|V|1|2|3)[:.-]?)/gi);
  
  let currentSectionMode = 'multiple_choice';

  for (let block of rawBlocks) {
    block = block.trim();
    if (!block) continue;

    // Detect Section Headers
    const headerRegex = /^(?:(?:PHẦN|Phần)\s*(?:I|II|III|IV|V|1|2|3)?[:.-]?\s*)?(?:TRẮC NGHIỆM|TỰ LUẬN|Trắc nghiệm|Tự luận)/i;
    if (headerRegex.test(block)) {
        if (/TỰ LUẬN|Tự luận/i.test(block)) currentSectionMode = 'essay';
        else if (/TRẮC NGHIỆM|Trắc nghiệm/i.test(block)) currentSectionMode = 'multiple_choice';
        
        const headerMatch = block.match(headerRegex)[0];
        const remaining = block.substring(headerMatch.length).trim();
        if (!remaining || remaining.length < 5) continue;
        block = remaining;
    }

    const hasExplicitMarker = /^(?:(?:Câu|Bài|C|Question|Q)\s*\d+[:.-]?|\b\d+[:.-])/i.test(block);

    // Extract options
    const options = [];
    const optionMatches = block.matchAll(/([A-D])[\.:)]\s*([\s\S]*?)(?=\s*[A-D][\.:)]|(?:(?:Câu|Bài|C|Question|Q)\s*\d+[:.-]?)|$)/gi);
    for (const m of optionMatches) {
        options.push(m[2].trim());
    }

    // Extract text
    const questionMatch = block.match(/^(?:(?:Câu|Bài|C|Question|Q)\s*\d+[:.-]?|\b\d+[:.-])\s*([\s\S]*?)(?=\s*[A-D][\.:)]|$)/i);
    let questionText = '';
    if (questionMatch) {
        questionText = questionMatch[1].trim();
    } else if (currentSectionMode === 'essay' && block.length > 30) {
        questionText = block.trim();
    }

    if (!questionText) continue;

    // Fast noise filter
    const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const targetNorm = norm(questionText);
    const noise = ['tracnghiem', 'tuluan', 'dapan', 'baiontap', 'hoahoc', 'made'];
    if (noise.some(kw => targetNorm === kw || (targetNorm.length < 15 && targetNorm.includes(kw))) && !hasExplicitMarker) {
        continue;
    }

    if (options.length >= 2) {
      questions.push({
        type: 'multiple_choice',
        question: questionText,
        options: options.slice(0, 4),
        correct_index: 0
      });
    } else if (hasExplicitMarker || (currentSectionMode === 'essay' && questionText.length > 30)) {
      questions.push({
        type: 'essay',
        question: questionText,
        options: [],
        correct_index: 0,
        sample_answer: ''
      });
    }
  }

  // Answer Keys
  const answerKeyMarkers = ['ĐÁP ÁN', 'MÃ ĐỀ', 'ANSWER KEY'];
  let keyText = '';
  for (const marker of answerKeyMarkers) {
      const match = normalizedText.match(new RegExp(`${marker}[\\s\\S]*`, 'i'));
      if (match) { keyText = match[0]; break; }
  }

  if (keyText) {
    const keyMatches = keyText.matchAll(/(\d+)[\s.:\-\/]*([A-D])/gi);
    for (const match of keyMatches) {
        const qNum = parseInt(match[1]) - 1;
        const letter = match[2].toUpperCase();
        if (questions[qNum] && questions[qNum].type === 'multiple_choice') {
            questions[qNum].correct_index = letter.charCodeAt(0) - 65;
        }
    }
  }

  // Final Clean
  return questions.filter(q => {
      const n = q.question.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      return !['tracnghiem', 'tuluan', 'hoahoc'].some(kw => n === kw || (n.length < 12 && n.includes(kw)));
  });
}

export default router;
