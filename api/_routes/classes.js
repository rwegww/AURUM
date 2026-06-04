import express from 'express';
import { supabase } from '../lib/supabase.js';
import { auth } from '../_middleware/auth.js';
import multer from 'multer';
import mammoth from 'mammoth';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

const canManageClasses = (user) => user?.role === 'teacher' || user?.role === 'admin';

const normalizeClass = (classData) => {
  if (!classData) return classData;
  const gradeLevelId = classData.khoi_id ?? null;
  return {
    ...classData,
    name: classData.ten ?? classData.name,
    description: classData.mo_ta ?? classData.description,
    code: classData.ma_lop ?? classData.code,
    teacher_id: classData.giao_vien_id ?? classData.teacher_id,
    grade_level_id: gradeLevelId,
    khoi_id: gradeLevelId,
    gradeLevelId,
    ten: undefined,
    mo_ta: undefined,
    ma_lop: undefined,
    giao_vien_id: undefined,
  };
};

const normalizeSubmission = (submission) => {
  if (!submission) return submission;
  return {
    ...submission,
    post_id: submission.bai_dang_id ?? submission.post_id,
    student_id: submission.hoc_sinh_id ?? submission.student_id,
    score: submission.diem ?? submission.score,
    teacher_feedback: submission.phan_hoi_giao_vien ?? submission.teacher_feedback ?? null,
    submitted_at: submission.nop_luc ?? submission.submitted_at,
    answers: submission.cau_tra_loi ?? submission.answers,
    bai_dang_id: undefined,
    hoc_sinh_id: undefined,
    diem: undefined,
    phan_hoi_giao_vien: undefined,
    nop_luc: undefined,
    cau_tra_loi: undefined,
  };
};

const normalizeLessonRef = (lesson) => {
  if (!lesson) return lesson;
  const gradeLevelId = lesson.khoi_id ?? null;
  return {
    ...lesson,
    grade_level_id: gradeLevelId,
    khoi_id: gradeLevelId,
  };
};

const normalizePost = (post) => post ? ({
  ...post,
  class_id: post.lop_id ?? post.class_id,
  author_id: post.tac_gia_id ?? post.author_id,
  target_student_id: post.hoc_sinh_nhan_id ?? post.target_student_id,
  content: post.noi_dung ?? post.content,
  deadline: post.han_nop ?? post.deadline,
  questions: post.cau_hoi ?? post.questions ?? [],
  lop_id: undefined,
  tac_gia_id: undefined,
  hoc_sinh_nhan_id: undefined,
  noi_dung: undefined,
  han_nop: undefined,
  cau_hoi: undefined,
}) : post;

const normalizeSchedule = (schedule) => schedule ? ({
  ...schedule,
  class_id: schedule.lop_id ?? schedule.class_id,
  title: schedule.tieu_de ?? schedule.title,
  start_time: schedule.bat_dau_luc ?? schedule.start_time,
  end_time: schedule.ket_thuc_luc ?? schedule.end_time,
  lop_id: undefined,
  tieu_de: undefined,
  bat_dau_luc: undefined,
  ket_thuc_luc: undefined,
}) : schedule;

const requireTeacherOrAdmin = (req, res) => {
  if (!canManageClasses(req.user)) {
    res.status(403).json({ error: 'Chá»‰ giÃ¡o viÃªn má»›i cÃ³ quyá»n thá»±c hiá»‡n thao tÃ¡c nÃ y' });
    return false;
  }
  return true;
};

const ensureClassOwner = async (classId, user, res) => {
  const { data: classData, error } = await supabase
    .from('lop')
    .select('id, giao_vien_id')
    .eq('id', classId)
    .maybeSingle();

  if (error || !classData) {
    res.status(404).json({ error: 'KhÃ´ng tÃ¬m tháº¥y lá»›p há»c' });
    return null;
  }

  if (user.role !== 'admin' && classData.giao_vien_id !== user.id) {
    res.status(403).json({ error: 'Báº¡n khÃ´ng cÃ³ quyá»n quáº£n lÃ½ lá»›p há»c nÃ y' });
    return null;
  }

  return classData;
};

const isClassMember = async (classId, userId) => {
  const { data, error } = await supabase
    .from('thanh_vien_lop')
    .select('lop_id')
    .eq('lop_id', classId)
    .eq('hoc_sinh_id', userId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};

const ensureClassAccess = async (classId, user, res) => {
  const { data: classData, error } = await supabase
    .from('lop')
    .select('id, giao_vien_id')
    .eq('id', classId)
    .maybeSingle();

  if (error) throw error;
  if (!classData) {
    res.status(404).json({ error: 'Khong tim thay lop hoc' });
    return null;
  }

  if (user.role === 'admin' || classData.giao_vien_id === user.id) {
    return classData;
  }

  if (user.role === 'teacher') {
    res.status(403).json({ error: 'Ban khong co quyen truy cap lop hoc nay' });
    return null;
  }

  if (!(await isClassMember(classId, user.id))) {
    res.status(403).json({ error: 'Ban chua tham gia lop hoc nay' });
    return null;
  }

  return classData;
};



// Parse exam files for 2025 format
router.post('/parse-exam-file', auth, upload.single('file'), async (req, res) => {
  try {
    if (!requireTeacherOrAdmin(req, res)) return;
    if (!req.file) return res.status(400).json({ error: 'KhÃ´ng tÃ¬m tháº¥y tá»‡p' });

    let text = '';
    if (req.file.mimetype === 'application/pdf') {
        const pdf = (await import('pdf-parse')).default;
        const data = await pdf(req.file.buffer);
        text = data.text;
    } else {
        const data = await mammoth.extractRawText({ buffer: req.file.buffer });
        text = data.value;
    }

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const questions = [];
    let currentPart = 1;
    let qIndex = 0;
    let partQIndices = { 1: 0, 2: 0, 3: 0 };
    let currentQuestion = null;
    let mode = 'question';

    let answersObj = { part1: {}, part2: {}, part3: {} };
    
    let part1Numbers = [];
    let part1Letters = [];
    let part2Letters = [];
    let part3Answers = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        if (/^(--+)?\s*Háº¾T\s*(--+)?$/i.test(line) || /^ÄÃP ÃN/i.test(line) || /^HÆ¯á»šNG DáºªN GIáº¢I/i.test(line)) {
            mode = 'answer';
        }

        if (mode === 'question') {
            if (/^PHáº¦N\s+I\b/i.test(line)) { currentPart = 1; continue; }
            if (/^PHáº¦N\s+II\b/i.test(line)) { currentPart = 2; continue; }
            if (/^PHáº¦N\s+III\b/i.test(line)) { currentPart = 3; continue; }

            const qMatch = line.match(/^(?:CÃ¢u\s*|BÃ i\s*|C\s*)?(\d+)\b\s*[.:]?\s*(.*)/i);
            
            // To prevent matching arbitrary numbers like "1 lÃ­t", we ensure it starts with CÃ¢u/BÃ i/C 
            // OR we use the previous logic but with \b
            let isQuestionStart = false;
            let pNum = null;
            let contentStr = '';
            
            const qMatchStrict = line.match(/^(?:CÃ¢u|BÃ i|C)\s*(\d+)\b(?:\s*\(.*?\))?\s*[.:]?\s*(.*)/i);
            if (qMatchStrict) {
                isQuestionStart = true;
                pNum = parseInt(qMatchStrict[1]);
                contentStr = qMatchStrict[2];
            } else if (/^CÃ¢u\s*\d+/i.test(line)) {
                isQuestionStart = true;
                const tempMatch = line.match(/^CÃ¢u\s*(\d+)\s*[.:]?\s*(.*)/i);
                if (tempMatch) {
                    pNum = parseInt(tempMatch[1]);
                    contentStr = tempMatch[2];
                } else {
                    pNum = NaN;
                    contentStr = line;
                }
            }

            if (isQuestionStart) { 
                if (currentQuestion) questions.push(currentQuestion);
                qIndex++;
                if (isNaN(pNum) || pNum === null) {
                   partQIndices[currentPart]++;
                   pNum = partQIndices[currentPart];
                } else {
                   partQIndices[currentPart] = pNum;
                }

                let type = 'multiple_choice';
                if (currentPart === 2) type = 'true_false';
                if (currentPart === 3) type = 'short_answer';
                
                currentQuestion = {
                    id: 'q_' + Date.now() + '_' + qIndex,
                    part: currentPart,
                    partNum: pNum,
                    type: type,
                    content: contentStr,
                    options: type === 'multiple_choice' ? {A:'', B:'', C:'', D:''} : (type === 'true_false' ? {a:'', b:'', c:'', d:''} : null),
                    correct_answer: type === 'true_false' ? {a:'', b:'', c:'', d:''} : ''
                };
                continue;
            }

            if (currentQuestion) {
                if (currentQuestion.type === 'multiple_choice') {
                    const mcRegex = /(?:^|\s+)([A-D])\s*[.:]\s*(.*?)(?=\s+[A-D]\s*[.:]|$)/gi;
                    let match;
                    let hasMatch = false;
                    while ((match = mcRegex.exec(line)) !== null) {
                        const key = match[1].toUpperCase();
                        currentQuestion.options[key] = match[2].trim();
                        hasMatch = true;
                    }
                    if (hasMatch) continue;
                }
                
                if (currentQuestion.type === 'true_false') {
                    const tfRegex = /(?:^|\s+)([a-d])\s*[.:)]\s*(.*?)(?=\s+[a-d]\s*[.:)]|$)/gi;
                    let match;
                    let hasMatch = false;
                    while ((match = tfRegex.exec(line)) !== null) {
                        const key = match[1].toLowerCase();
                        currentQuestion.options[key] = match[2].trim();
                        hasMatch = true;
                    }
                    if (hasMatch) continue;
                }

                if (currentQuestion.content.length > 0) currentQuestion.content += '\n';
                currentQuestion.content += line;
            }
        } else if (mode === 'answer') {
            if (/PHáº¦N\s+I\b/i.test(line)) { currentPart = 1; continue; }
            else if (/PHáº¦N\s+II\b/i.test(line)) { currentPart = 2; continue; }
            else if (/PHáº¦N\s+III\b/i.test(line)) { currentPart = 3; continue; }

            if (currentPart === 1) {
                let inlineMatches = [...line.matchAll(/(?:CÃ¢u\s*)?(\d+)\s*[.:-]?\s*([A-D])/gi)];
                if (inlineMatches.length > 0) {
                    for (let m of inlineMatches) {
                        answersObj.part1[parseInt(m[1])] = m[2].toUpperCase();
                    }
                    continue;
                }
                if (/^(\d+\s*)+$/.test(line)) {
                    part1Numbers.push(...line.split(/\s+/).filter(Boolean).map(Number));
                }
                else if (/^([A-D]\s*)+$/i.test(line)) {
                    part1Letters.push(...line.split(/\s+/).filter(Boolean).map(l => l.toUpperCase()));
                }
            } else if (currentPart === 2) {
                let m = line.match(/^(?:CÃ¢u\s*)?(\d+)\s*[.:-]?\s*([SDÄ\s,;]+)$/i);
                if (m) {
                    let qNum = parseInt(m[1]);
                    let chars = m[2].replace(/[^SDÄ]/gi, '').toUpperCase();
                    if (chars.length === 4) {
                        answersObj.part2[qNum] = {
                            a: chars[0] === 'D' || chars[0] === 'Ä',
                            b: chars[1] === 'D' || chars[1] === 'Ä',
                            c: chars[2] === 'D' || chars[2] === 'Ä',
                            d: chars[3] === 'D' || chars[3] === 'Ä'
                        };
                    }
                    continue;
                }
                if (/^([SDÄ]\s*)+$/i.test(line.replace(/[,;]/g, ' '))) {
                    part2Letters.push(...line.replace(/[,;]/g, ' ').split(/\s+/).filter(Boolean).map(l => l.toUpperCase()));
                }
            } else if (currentPart === 3) {
                let match = line.match(/^(?:CÃ¢u\s*)?(\d+)\s*[.:-]\s*(-?\d+(?:[.,]\d+)?)$/i);
                if (match) {
                    answersObj.part3[parseInt(match[1])] = match[2].trim();
                    continue;
                }
                if (/^(-?\d+(?:[.,]\d+)?\s*)+$/.test(line)) {
                    part3Answers.push(...line.split(/\s+/).filter(Boolean));
                }
            }
        }
    }
    
    if (currentQuestion) questions.push(currentQuestion);

    // ZIP part 1
    let p1Len = Math.min(part1Numbers.length, part1Letters.length);
    for (let i = 0; i < p1Len; i++) {
        answersObj.part1[part1Numbers[i]] = part1Letters[i];
    }

    // ZIP part 2
    let p2NumQs = Math.floor(part2Letters.length / 4);
    for (let i = 0; i < p2NumQs; i++) {
        let chunk = part2Letters.slice(i * 4, i * 4 + 4);
        answersObj.part2[i + 1] = {
            a: chunk[0] === 'D' || chunk[0] === 'Ä',
            b: chunk[1] === 'D' || chunk[1] === 'Ä',
            c: chunk[2] === 'D' || chunk[2] === 'Ä',
            d: chunk[3] === 'D' || chunk[3] === 'Ä'
        };
    }

    // ZIP part 3
    for (let i = 0; i < part3Answers.length; i++) {
        answersObj.part3[i + 1] = part3Answers[i];
    }

    for (let q of questions) {
        if (q.part === 1 && answersObj.part1[q.partNum]) {
            q.correct_answer = answersObj.part1[q.partNum];
        } else if (q.part === 2 && answersObj.part2[q.partNum]) {
            q.correct_answer = answersObj.part2[q.partNum];
        } else if (q.part === 3 && answersObj.part3[q.partNum]) {
            q.correct_answer = answersObj.part3[q.partNum];
        }
    }

    res.json(questions);
  } catch (err) {
    console.error('Error parsing exam file:', err);
    res.status(500).json({ error: 'Failed to parse file', details: err.message });
  }
});

// Get all lop for a teacher or student
router.get('/', auth, async (req, res) => {
  try {
    const { role, id } = req.user;
    
    // Select class properties and count members
    let query = supabase.from('lop')
      .select('*, teacher:giao_vien_id(username), student_count:thanh_vien_lop(count)');

    if (role === 'teacher') {
      query = query.eq('giao_vien_id', id);
    } else if (role === 'admin') {
      // Admin can inspect all lop.
    } else {
      // For student, get lop they joined
      const { data: memberData } = await supabase.from('thanh_vien_lop').select('lop_id').eq('hoc_sinh_id', id);
      const classIds = memberData?.map(m => m.lop_id) || [];
      if (classIds.length === 0) return res.json([]);
      query = query.in('id', classIds);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    // Format response to flatten student_count
    const formattedData = data.map(cls => ({
        ...normalizeClass(cls),
        student_count: cls.student_count?.[0]?.count || 0
    }));

    res.json(formattedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get class stats for notifications
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 1. Get joined lop
    const { data: members, error: memErr } = await supabase
      .from('thanh_vien_lop')
      .select('lop_id')
      .eq('hoc_sinh_id', userId);
    
    if (memErr) throw memErr;
    const classIds = members.map(m => m.lop_id);
    
    if (classIds.length === 0) return res.json({});

    // 2. For each class, count posts that the student can see
    // This is a bit heavy for a single query if many lop, 
    // but for now we fetch recent posts count.
    const { data: posts, error: postErr } = await supabase
      .from('bai_dang_lop')
      .select('lop_id, created_at')
      .in('lop_id', classIds)
      .or(`hoc_sinh_nhan_id.is.null,hoc_sinh_nhan_id.eq.${userId},tac_gia_id.eq.${userId}`);

    if (postErr) throw postErr;

    // 3. Group by lop_id
    const stats = {};
    posts.forEach(p => {
      if (!stats[p.lop_id]) stats[p.lop_id] = { count: 0, latest: p.created_at };
      stats[p.lop_id].count++;
      if (new Date(p.created_at) > new Date(stats[p.lop_id].latest)) {
        stats[p.lop_id].latest = p.created_at;
      }
    });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get total summary for teacher dashboard
router.get('/teacher-summary', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
       return res.status(403).json({ error: 'Chá»‰ dÃ nh cho giÃ¡o viÃªn' });
    }

    // 1. Get all class IDs for this teacher
    const { data: lop } = await supabase.from('lop').select('id').eq('giao_vien_id', userId);
    const classIds = lop?.map(c => c.id) || [];

    if (classIds.length === 0) {
      return res.json({ total_students: 0, active_assignments: 0 });
    }

    // 2. Count unique students
    const { data: members } = await supabase.from('thanh_vien_lop').select('hoc_sinh_id').in('lop_id', classIds);
    const uniqueStudents = new Set(members?.map(m => m.hoc_sinh_id));

    // 3. Count active assignments
    const { count: assignmentCount } = await supabase
      .from('bai_dang_lop')
      .select('*', { count: 'exact', head: true })
      .in('lop_id', classIds)
      .eq('type', 'assignment');

    res.json({
      total_students: uniqueStudents.size,
      active_assignments: assignmentCount || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new class (Teacher only)
router.post('/', auth, async (req, res) => {
  try {
    if (!requireTeacherOrAdmin(req, res)) return;

    const { name, description } = req.body;
    const khoi_id = req.body.khoi_id ?? req.body.gradeLevelId;
    const giao_vien_id = req.user.id;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data, error } = await supabase
      .from('lop')
      .insert([{ ten: name, khoi_id, mo_ta: description, giao_vien_id, ma_lop: code }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(normalizeClass(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Parse exam file (Format 2025)
router.post('/parse-exam-file', auth, upload.single('file'), async (req, res) => {
  try {
    if (!requireTeacherOrAdmin(req, res)) return;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    // Extract text from DOCX
    const result = await mammoth.extractRawText({ buffer: req.file.buffer });
    const text = result.value;
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);

    const questions = [];
    let currentPart = 0;
    let currentQuestion = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('Pháº§n I.')) { currentPart = 1; continue; }
      if (line.startsWith('Pháº§n II.')) { currentPart = 2; continue; }
      if (line.startsWith('Pháº§n III.')) { currentPart = 3; continue; }
      if (line.includes('------ Háº¾T ------') || line.startsWith('ÄÃP ÃN')) { break; }

      if (!currentPart) continue;

      if (line.startsWith('CÃ¢u ')) {
        if (currentQuestion) questions.push(currentQuestion);
        currentQuestion = {
          id: 'q' + (questions.length + 1),
          part: currentPart,
          type: currentPart === 1 ? 'multiple_choice' : currentPart === 2 ? 'true_false' : 'short_answer',
          content: line,
          options: currentPart !== 3 ? {} : undefined,
          correct_answer: currentPart === 2 ? {a:'', b:'', c:'', d:''} : ''
        };
      } else if (currentQuestion) {
        if (currentPart === 1) {
          if (line.match(/^[A-D]\./)) {
            const parts = line.split(/(?=[A-D]\.)/);
            parts.forEach(p => {
              const m = p.trim().match(/^([A-D])\.\s*(.*)/);
              if (m) currentQuestion.options[m[1]] = m[2];
            });
          } else {
            if (Object.keys(currentQuestion.options).length === 0) currentQuestion.content += '\n' + line;
          }
        } else if (currentPart === 2) {
          if (line.match(/^[a-d]\)/)) {
            const m = line.match(/^([a-d])\)\s*(.*)/);
            if (m) currentQuestion.options[m[1]] = m[2];
          } else {
            if (Object.keys(currentQuestion.options).length === 0) currentQuestion.content += '\n' + line;
          }
        } else if (currentPart === 3) {
          currentQuestion.content += '\n' + line;
        }
      }
    }
    if (currentQuestion) questions.push(currentQuestion);

    res.json(questions);
  } catch (err) {
    console.error('Error parsing exam file:', err);
    res.status(500).json({ error: 'Failed to parse file', details: err.message });
  }
});

// Join a class (Student)
router.post('/join', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Chi hoc sinh moi co the tham gia lop hoc' });
    }

    const { code } = req.body;
    const hoc_sinh_id = req.user.id;

    const { data: classData, error: classErr } = await supabase
      .from('lop')
      .select('id, ten, giao_vien_id')
      .eq('ma_lop', code)
      .single();

    if (classErr || !classData) return res.status(404).json({ error: 'MÃ£ lá»›p khÃ´ng há»£p lá»‡' });

    const { error: joinErr } = await supabase
      .from('thanh_vien_lop')
      .insert([{ lop_id: classData.id, hoc_sinh_id }]);

    if (joinErr) {
        if (joinErr.code === '23505') return res.status(400).json({ error: 'Báº¡n Ä‘Ã£ tham gia lá»›p nÃ y rá»“i' });
        throw joinErr;
    }
    


    res.json({ message: 'Tham gia lá»›p thÃ nh cÃ´ng', lop_id: classData.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one class by id for teachers, admins, or joined students.
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!(await ensureClassAccess(id, req.user, res))) return;

    const { data, error } = await supabase
      .from('lop')
      .select('*, teacher:giao_vien_id(username), student_count:thanh_vien_lop(count)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Khong tim thay lop hoc' });

    res.json({
      ...normalizeClass(data),
      student_count: data.student_count?.[0]?.count || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get class members (Students)
router.get('/:id/members', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!(await ensureClassAccess(id, req.user, res))) return;

    const { data, error } = await supabase
      .from('thanh_vien_lop')
      .select('student:hoc_sinh_id(id, username, hoat_dong_cuoi_luc, phut_hoat_dong)')
      .eq('lop_id', id);

    if (error) throw error;
    
    const formatted = data.map(m => ({
      ...m.student,
      last_active_at: m.student?.hoat_dong_cuoi_luc,
      active_minutes: m.student?.phut_hoat_dong ?? 0,
      isOnline: m.student?.hoat_dong_cuoi_luc && new Date(m.student.hoat_dong_cuoi_luc) > new Date(Date.now() - 5*60*1000),
      hoat_dong_cuoi_luc: undefined,
      phut_hoat_dong: undefined
    }));
    
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get class posts (messages, assignments, videos)
router.get('/:id/posts', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!(await ensureClassAccess(id, req.user, res))) return;

    let query = supabase
      .from('bai_dang_lop')
      .select('*, author:tac_gia_id(username), target:hoc_sinh_nhan_id(username)')
      .eq('lop_id', id)
      .order('created_at', { ascending: false });

    // If student, only show:
    // 1. Posts targeted to everyone (null)
    // 2. Posts targeted specifically to them
    // 3. Posts AUTHORED by them (even if targeted to teacher)
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      query = query.or(`hoc_sinh_nhan_id.is.null,hoc_sinh_nhan_id.eq.${req.user.id},tac_gia_id.eq.${req.user.id}`);
    } else {
      // If teacher, they see everything for their class
    }

    let { data: posts, error: postErr } = await query;
    if (postErr) throw postErr;
    if (!posts) posts = [];

    // For students, check if each assignment is completed
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      const { data: submissions, error: subErr } = await supabase
        .from('bai_nop')
        .select('bai_dang_id, diem, cau_tra_loi, status, phan_hoi_giao_vien')
        .eq('hoc_sinh_id', req.user.id);
      
      if (subErr) console.error('Submissions fetch error:', subErr);

      const submissionMap = {};
      (submissions || []).forEach(s => {
        submissionMap[s.bai_dang_id] = normalizeSubmission(s);
      });

      posts = posts.map(p => ({
        ...p,
        is_completed: p.type === 'assignment' && !!submissionMap[p.id],
        user_submission: p.type === 'assignment' ? submissionMap[p.id] : null
      }));
    }

    // Enhance assignments with lesson details if media_url is a lesson ID
    const enhancedPosts = await Promise.all(posts.map(async (p) => {
      if (p.type === 'assignment' && p.media_url) {
        const { data: lesson } = await supabase
          .from('bai_hoc')
          .select('id, khoi_id')
          .eq('id', p.media_url)
          .single();
        if (lesson) p.lesson = normalizeLessonRef(lesson);
      }
      return p;
    }));

    res.json(enhancedPosts.map(normalizePost));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a class post
router.post('/:id/posts', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!requireTeacherOrAdmin(req, res)) return;
    if (!(await ensureClassOwner(id, req.user, res))) return;

    const { type, content, media_url, deadline, hoc_sinh_nhan_id } = req.body;
    const tac_gia_id = req.user.id;

    // Sanitize empty strings to null for DB insertion
    const insertData = {
      lop_id: id,
      tac_gia_id,
      type,
      noi_dung: content,
      media_url: media_url || null,
      han_nop: deadline || null,
      hoc_sinh_nhan_id: hoc_sinh_nhan_id || null,
      cau_hoi: req.body.questions || []
    };

    const { data, error } = await supabase
      .from('bai_dang_lop')
      .insert([insertData])
      .select('*, author:tac_gia_id(username)')
      .single();

    if (error) throw error;
    res.status(201).json(normalizePost(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get class schedules
router.get('/:id/schedules', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!(await ensureClassAccess(id, req.user, res))) return;

    const { data, error } = await supabase
      .from('lich_lop')
      .select('*')
      .eq('lop_id', id)
      .order('bat_dau_luc', { ascending: true });

    if (error) throw error;
    res.json((data || []).map(normalizeSchedule));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a class schedule
router.post('/:id/schedules', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!requireTeacherOrAdmin(req, res)) return;
    if (!(await ensureClassOwner(id, req.user, res))) return;

    const { title, start_time, end_time, meet_url } = req.body;

    const { data, error } = await supabase
      .from('lich_lop')
      .insert([{ lop_id: id, tieu_de: title, bat_dau_luc: start_time, ket_thuc_luc: end_time, meet_url }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(normalizeSchedule(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assignments Management
// Get all assignments for teacher's lop
router.get('/assignments/all', auth, async (req, res) => {
  try {
    if (!requireTeacherOrAdmin(req, res)) return;

    const userId = req.user.id;
    // Get lop teacher manages
    let classQuery = supabase.from('lop').select('id');
    if (req.user.role !== 'admin') {
      classQuery = classQuery.eq('giao_vien_id', userId);
    }
    const { data: teacherClasses, error: classError } = await classQuery;
    if (classError) throw classError;
    const classIds = teacherClasses.map(c => c.id);
    if (classIds.length === 0) return res.json([]);

    const { data, error } = await supabase
      .from('bai_dang_lop')
      .select('*, class:lop_id(ten)')
      .in('lop_id', classIds)
      .eq('type', 'assignment')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json((data || []).map((post) => {
      const normalized = normalizePost(post);
      if (post.class) normalized.class = { ...post.class, name: post.class.ten ?? post.class.name, ten: undefined };
      return normalized;
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get submissions/progress for an assignment
router.get('/assignments/:postId/submissions', auth, async (req, res) => {
  try {
    if (!requireTeacherOrAdmin(req, res)) return;

    const { postId } = req.params;
    
    // Get assignment info to get lop_id
    const { data: post } = await supabase.from('bai_dang_lop').select('lop_id').eq('id', postId).single();
    if (post && !(await ensureClassOwner(post.lop_id, req.user, res))) return;
    if (!post) return res.status(404).json({ error: 'KhÃ´ng tÃ¬m tháº¥y bÃ i táº­p' });

    // Get all class members
    const { data: members } = await supabase.from('thanh_vien_lop').select('student:hoc_sinh_id(id, username)').eq('lop_id', post.lop_id);
    
    // Get submissions
    const { data: submissions } = await supabase.from('bai_nop').select('*').eq('bai_dang_id', postId);

    // Map together
    const progress = (members || []).map(m => {
      const sub = (submissions || []).find(s => s.hoc_sinh_id === m.student.id);
      return {
        student: m.student,
        submitted: !!sub,
        submitted_at: sub?.nop_luc,
        status: sub?.status,
        score: sub?.diem,
        teacher_feedback: sub?.phan_hoi_giao_vien ?? null,
        answers: sub?.cau_tra_loi
      };
    });

    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit an assignment (Student)
router.post('/assignments/:postId/submit', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Chi hoc sinh moi co the nop bai' });
    }

    const { postId } = req.params;
    const { answers } = req.body;
    const hoc_sinh_id = req.user.id;

    const { data: post, error: postError } = await supabase
      .from('bai_dang_lop')
      .select('lop_id, type, hoc_sinh_nhan_id')
      .eq('id', postId)
      .single();
    if (postError || !post) return res.status(404).json({ error: 'KhÃ´ng tÃ¬m tháº¥y bÃ i táº­p' });
    if (post.type !== 'assignment') {
      return res.status(400).json({ error: 'Bai dang nay khong phai bai tap' });
    }
    if (post.hoc_sinh_nhan_id && post.hoc_sinh_nhan_id !== hoc_sinh_id) {
      return res.status(403).json({ error: 'Bai tap nay khong duoc giao cho ban' });
    }

    const { data: membership, error: membershipError } = await supabase
      .from('thanh_vien_lop')
      .select('lop_id')
      .eq('lop_id', post.lop_id)
      .eq('hoc_sinh_id', hoc_sinh_id)
      .maybeSingle();

    if (membershipError) throw membershipError;
    if (!membership) return res.status(403).json({ error: 'Báº¡n chÆ°a tham gia lá»›p há»c nÃ y' });

    const { data, error } = await supabase
      .from('bai_nop')
      .upsert([{ 
        bai_dang_id: postId, 
        hoc_sinh_id, 
        status: 'submitted',
        cau_tra_loi: answers || {},
        diem: null,
        phan_hoi_giao_vien: null
      }], { onConflict: 'bai_dang_id,hoc_sinh_id' })
      .select()
      .single();

    if (error) throw error;



    res.json(normalizeSubmission(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Grade/Feedback an assignment (Teacher)
router.post('/assignments/:postId/grade/:studentId', auth, async (req, res) => {
  try {
    const { postId, studentId } = req.params;
    const { score, phan_hoi } = req.body;

    // Check if user is teacher
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Chá»‰ giÃ¡o viÃªn má»›i cÃ³ quyá»n cháº¥m Ä‘iá»ƒm' });
    }

    const { data: post, error: postError } = await supabase
      .from('bai_dang_lop')
      .select('lop_id, type')
      .eq('id', postId)
      .single();
    if (postError || !post) return res.status(404).json({ error: 'Khong tim thay bai tap' });
    if (post.type !== 'assignment') {
      return res.status(400).json({ error: 'Bai dang nay khong phai bai tap' });
    }
    if (!(await ensureClassOwner(post.lop_id, req.user, res))) return;

    const { data, error } = await supabase
      .from('bai_nop')
      .update({ diem: score, phan_hoi_giao_vien: phan_hoi, status: 'graded' })
      .eq('bai_dang_id', postId)
      .eq('hoc_sinh_id', studentId)
      .select()
      .single();

    if (error) throw error;
    res.json(normalizeSubmission(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an assignment
router.delete('/assignments/:postId', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Check if user is the author or teacher of the class
    const { data: post } = await supabase.from('bai_dang_lop').select('tac_gia_id, lop_id').eq('id', postId).single();
    if (!post) return res.status(404).json({ error: 'KhÃ´ng tÃ¬m tháº¥y bÃ i táº­p' });

    const ownsClass = req.user.role === 'admin' || !!(await ensureClassOwner(post.lop_id, req.user, res));
    if (res.headersSent) return;
    if (post.tac_gia_id !== req.user.id && !ownsClass) {
      return res.status(403).json({ error: 'Báº¡n khÃ´ng cÃ³ quyá»n xÃ³a bÃ i táº­p nÃ y' });
    }

    const { error } = await supabase.from('bai_dang_lop').delete().eq('id', postId);
    if (error) throw error;
    
    res.json({ message: 'ÄÃ£ xÃ³a bÃ i táº­p' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /teacher/notifications - Fetch notifications for lop managed by this teacher
router.get('/teacher/notifications', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Chá»‰ dÃ nh cho giÃ¡o viÃªn vÃ  quáº£n trá»‹ viÃªn' });
    }

    // 1. Get all class IDs for this teacher
    const { data: lop, error: classErr } = await supabase
      .from('lop')
      .select('id, ten')
      .eq('giao_vien_id', userId);

    if (classErr) throw classErr;
    if (!lop || lop.length === 0) {
      return res.json([]);
    }

    const classIds = lop.map(c => c.id);
    const classMap = {};
    lop.forEach(c => {
      classMap[c.id] = c.ten;
    });

    // 2. Fetch new student joins
    const { data: newMembers, error: memErr } = await supabase
      .from('thanh_vien_lop')
      .select('lop_id, hoc_sinh_id, tham_gia_luc, student:hoc_sinh_id(username)')
      .in('lop_id', classIds)
      .order('tham_gia_luc', { ascending: false })
      .limit(15);

    if (memErr) throw memErr;

    // 3. Fetch student messages (posts that are not from this teacher)
    const { data: posts, error: msgErr } = await supabase
      .from('bai_dang_lop')
      .select('id, lop_id, noi_dung, type, created_at, author:tac_gia_id(username)')
      .in('lop_id', classIds)
      .neq('tac_gia_id', userId)
      .order('created_at', { ascending: false })
      .limit(15);

    if (msgErr) throw msgErr;

    // 4. Fetch homework submissions
    const { data: assignments, error: assignErr } = await supabase
      .from('bai_dang_lop')
      .select('id, noi_dung, lop_id')
      .in('lop_id', classIds)
      .eq('type', 'assignment');

    if (assignErr) throw assignErr;

    let submissions = [];
    if (assignments && assignments.length > 0) {
      const assignmentIds = assignments.map(a => a.id);
      const assignmentMap = {};
      assignments.forEach(a => {
        assignmentMap[a.id] = a;
      });

      const { data: subs, error: subErr } = await supabase
        .from('bai_nop')
        .select('bai_dang_id, hoc_sinh_id, nop_luc, student:hoc_sinh_id(username)')
        .in('bai_dang_id', assignmentIds)
        .order('nop_luc', { ascending: false })
        .limit(15);

      if (subErr) throw subErr;

      submissions = (subs || []).map(s => {
        const assign = assignmentMap[s.bai_dang_id];
        return {
          id: `sub-${s.bai_dang_id}-${s.hoc_sinh_id}-${new Date(s.nop_luc).getTime()}`,
          type: 'submission',
          title: 'Há»c sinh ná»™p bÃ i táº­p',
          message: `Há»c sinh ${s.student?.username || 'Há»c sinh'} Ä‘Ã£ ná»™p bÃ i táº­p: "${assign?.noi_dung?.substring(0, 30) || 'BÃ i táº­p'}${assign?.noi_dung?.length > 30 ? '...' : ''}"`,
          timestamp: s.nop_luc,
          link: '/teacher/assignments'
        };
      });
    }

    // 5. Fetch near-deadline assignments (within 48 hours)
    const now = new Date();
    const fortyEightHoursLater = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const { data: nearDue, error: dueErr } = await supabase
      .from('bai_dang_lop')
      .select('id, lop_id, noi_dung, han_nop')
      .in('lop_id', classIds)
      .eq('type', 'assignment')
      .gt('han_nop', now.toISOString())
      .lt('han_nop', fortyEightHoursLater.toISOString())
      .limit(5);

    if (dueErr) throw dueErr;

    // Combine notifications
    const notifications = [];

    // Add student joins
    (newMembers || []).forEach(m => {
      notifications.push({
        id: `join-${m.lop_id}-${m.hoc_sinh_id}-${new Date(m.tham_gia_luc).getTime()}`,
        type: 'student_join',
        title: 'Há»c sinh má»›i tham gia lá»›p',
        message: `Há»c sinh ${m.student?.username || 'Há»c sinh'} Ä‘Ã£ tham gia lá»›p "${classMap[m.lop_id]}"`,
        timestamp: m.tham_gia_luc,
        link: `/teacher/lop/${m.lop_id}`
      });
    });

    // Add student messages
    (posts || []).forEach(p => {
      notifications.push({
        id: `msg-${p.id}`,
        type: 'message',
        title: 'Tin nháº¯n má»›i tá»« há»c sinh',
        message: `${p.author?.username || 'Há»c sinh'} ("${classMap[p.lop_id]}"): "${p.noi_dung?.substring(0, 50)}${p.noi_dung?.length > 50 ? '...' : ''}"`,
        timestamp: p.created_at,
        link: `/teacher/lop/${p.lop_id}`
      });
    });

    // Add submissions
    notifications.push(...submissions);

    // Add near due assignments
    (nearDue || []).forEach(d => {
      notifications.push({
        id: `due-${d.id}`,
        type: 'due_soon',
        title: 'BÃ i táº­p sáº¯p háº¿t háº¡n',
        message: `BÃ i táº­p "${d.noi_dung?.substring(0, 30)}${d.noi_dung?.length > 30 ? '...' : ''}" lá»›p "${classMap[d.lop_id]}" sáº¯p Ä‘áº¿n háº¡n ná»™p`,
        timestamp: d.han_nop,
        link: '/teacher/assignments'
      });
    });

    // Sort by timestamp descending
    notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(notifications.slice(0, 25));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

