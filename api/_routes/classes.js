import express from 'express';
import { supabase } from '../lib/supabase.js';
import { auth } from '../_middleware/auth.js';
import multer from 'multer';
import mammoth from 'mammoth';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

const canManageClasses = (user) => user?.role === 'teacher' || user?.role === 'admin';

const requireTeacherOrAdmin = (req, res) => {
  if (!canManageClasses(req.user)) {
    res.status(403).json({ error: 'Chỉ giáo viên mới có quyền thực hiện thao tác này' });
    return false;
  }
  return true;
};

const ensureClassOwner = async (classId, user, res) => {
  const { data: classData, error } = await supabase
    .from('classes')
    .select('id, teacher_id')
    .eq('id', classId)
    .maybeSingle();

  if (error || !classData) {
    res.status(404).json({ error: 'Không tìm thấy lớp học' });
    return null;
  }

  if (user.role !== 'admin' && classData.teacher_id !== user.id) {
    res.status(403).json({ error: 'Bạn không có quyền quản lý lớp học này' });
    return null;
  }

  return classData;
};

const isClassMember = async (classId, userId) => {
  const { data, error } = await supabase
    .from('class_members')
    .select('class_id')
    .eq('class_id', classId)
    .eq('student_id', userId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};

const ensureClassAccess = async (classId, user, res) => {
  const { data: classData, error } = await supabase
    .from('classes')
    .select('id, teacher_id')
    .eq('id', classId)
    .maybeSingle();

  if (error) throw error;
  if (!classData) {
    res.status(404).json({ error: 'Khong tim thay lop hoc' });
    return null;
  }

  if (user.role === 'admin' || classData.teacher_id === user.id) {
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
        if (!req.file) return res.status(400).json({ error: 'Không tìm thấy tệp' });

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
        let currentQuestion = null;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            
            // Determine Part
            if (/^PHẦN\s+I\b/i.test(line)) { currentPart = 1; continue; }
            if (/^PHẦN\s+II\b/i.test(line)) { currentPart = 2; continue; }
            if (/^PHẦN\s+III\b/i.test(line)) { currentPart = 3; continue; }
            
            // Detect Question start
            const qMatch = line.match(/^(?:Câu\s*\d+|Bài\s*\d+|C\d+)\s*[.:]?\s*(.*)/i);
            if (qMatch) {
                if (currentQuestion) questions.push(currentQuestion);
                qIndex++;
                let type = 'multiple_choice';
                if (currentPart === 2) type = 'true_false';
                if (currentPart === 3) type = 'short_answer';
                
                currentQuestion = {
                    id: 'q_' + Date.now() + '_' + qIndex,
                    part: currentPart,
                    type: type,
                    content: qMatch[1],
                    options: type === 'multiple_choice' ? {A:'', B:'', C:'', D:''} : (type === 'true_false' ? {a:'', b:'', c:'', d:''} : null),
                    correct_answer: type === 'true_false' ? {a:'', b:'', c:'', d:''} : ''
                };
                continue;
            }

            if (currentQuestion) {
                // Detect options for Multiple Choice
                if (currentQuestion.type === 'multiple_choice') {
                    const optMatch = line.match(/^([A-D])\s*[.:]\s*(.*)/i);
                    if (optMatch) {
                        const key = optMatch[1].toUpperCase();
                        currentQuestion.options[key] = optMatch[2];
                        continue;
                    }
                }
                
                // Detect options for True/False
                if (currentQuestion.type === 'true_false') {
                    const optMatch = line.match(/^([a-d])\s*[.:)]\s*(.*)/i);
                    if (optMatch) {
                        const key = optMatch[1].toLowerCase();
                        currentQuestion.options[key] = optMatch[2];
                        continue;
                    }
                }

                // If not an option, it's continuation of question content
                if (currentQuestion.content.length > 0) currentQuestion.content += '\n';
                currentQuestion.content += line;
            }
        }
        
        if (currentQuestion) questions.push(currentQuestion);

        res.json(questions);
    } catch (err) {
        console.error('Parse exam file error:', err);
        res.status(500).json({ error: 'Lỗi hệ thống khi phân tích đề thi' });
    }
});

// Get all classes for a teacher or student
router.get('/', auth, async (req, res) => {
  try {
    const { role, id } = req.user;
    
    // Select class properties and count members
    let query = supabase.from('classes')
      .select('*, teacher:teacher_id(username), student_count:class_members(count)');

    if (role === 'teacher') {
      query = query.eq('teacher_id', id);
    } else if (role === 'admin') {
      // Admin can inspect all classes.
    } else {
      // For student, get classes they joined
      const { data: memberData } = await supabase.from('class_members').select('class_id').eq('student_id', id);
      const classIds = memberData?.map(m => m.class_id) || [];
      if (classIds.length === 0) return res.json([]);
      query = query.in('id', classIds);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    // Format response to flatten student_count
    const formattedData = data.map(cls => ({
        ...cls,
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
    
    // 1. Get joined classes
    const { data: members, error: memErr } = await supabase
      .from('class_members')
      .select('class_id')
      .eq('student_id', userId);
    
    if (memErr) throw memErr;
    const classIds = members.map(m => m.class_id);
    
    if (classIds.length === 0) return res.json({});

    // 2. For each class, count posts that the student can see
    // This is a bit heavy for a single query if many classes, 
    // but for now we fetch recent posts count.
    const { data: posts, error: postErr } = await supabase
      .from('class_posts')
      .select('class_id, created_at')
      .in('class_id', classIds)
      .or(`target_student_id.is.null,target_student_id.eq.${userId},author_id.eq.${userId}`);

    if (postErr) throw postErr;

    // 3. Group by class_id
    const stats = {};
    posts.forEach(p => {
      if (!stats[p.class_id]) stats[p.class_id] = { count: 0, latest: p.created_at };
      stats[p.class_id].count++;
      if (new Date(p.created_at) > new Date(stats[p.class_id].latest)) {
        stats[p.class_id].latest = p.created_at;
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
       return res.status(403).json({ error: 'Chỉ dành cho giáo viên' });
    }

    // 1. Get all class IDs for this teacher
    const { data: classes } = await supabase.from('classes').select('id').eq('teacher_id', userId);
    const classIds = classes?.map(c => c.id) || [];

    if (classIds.length === 0) {
      return res.json({ total_students: 0, active_assignments: 0 });
    }

    // 2. Count unique students
    const { data: members } = await supabase.from('class_members').select('student_id').in('class_id', classIds);
    const uniqueStudents = new Set(members?.map(m => m.student_id));

    // 3. Count active assignments
    const { count: assignmentCount } = await supabase
      .from('class_posts')
      .select('*', { count: 'exact', head: true })
      .in('class_id', classIds)
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

    const { name, grade_level, description } = req.body;
    const teacher_id = req.user.id;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data, error } = await supabase
      .from('classes')
      .insert([{ name, grade_level, description, teacher_id, code }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
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
      if (line.startsWith('Phần I.')) { currentPart = 1; continue; }
      if (line.startsWith('Phần II.')) { currentPart = 2; continue; }
      if (line.startsWith('Phần III.')) { currentPart = 3; continue; }
      if (line.includes('------ HẾT ------') || line.startsWith('ĐÁP ÁN')) { break; }

      if (!currentPart) continue;

      if (line.startsWith('Câu ')) {
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
    const student_id = req.user.id;

    const { data: classData, error: classErr } = await supabase
      .from('classes')
      .select('id, name, teacher_id')
      .eq('code', code)
      .single();

    if (classErr || !classData) return res.status(404).json({ error: 'Mã lớp không hợp lệ' });

    const { error: joinErr } = await supabase
      .from('class_members')
      .insert([{ class_id: classData.id, student_id }]);

    if (joinErr) {
        if (joinErr.code === '23505') return res.status(400).json({ error: 'Bạn đã tham gia lớp này rồi' });
        throw joinErr;
    }
    


    res.json({ message: 'Tham gia lớp thành công', class_id: classData.id });
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
      .from('class_members')
      .select('student:student_id(id, username, last_active_at, active_minutes)')
      .eq('class_id', id);

    if (error) throw error;
    
    const formatted = data.map(m => ({
      ...m.student,
      isOnline: m.student?.last_active_at && new Date(m.student.last_active_at) > new Date(Date.now() - 5*60*1000)
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
      .from('class_posts')
      .select('*, author:author_id(username), target:target_student_id(username)')
      .eq('class_id', id)
      .order('created_at', { ascending: false });

    // If student, only show:
    // 1. Posts targeted to everyone (null)
    // 2. Posts targeted specifically to them
    // 3. Posts AUTHORED by them (even if targeted to teacher)
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      query = query.or(`target_student_id.is.null,target_student_id.eq.${req.user.id},author_id.eq.${req.user.id}`);
    } else {
      // If teacher, they see everything for their class
    }

    let { data: posts, error: postErr } = await query;
    if (postErr) throw postErr;
    if (!posts) posts = [];

    // For students, check if each assignment is completed
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      const { data: submissions, error: subErr } = await supabase
        .from('class_assignment_submissions')
        .select('post_id, score, answers, status')
        .eq('student_id', req.user.id);
      
      if (subErr) console.error('Submissions fetch error:', subErr);

      const submissionMap = {};
      (submissions || []).forEach(s => {
        submissionMap[s.post_id] = s;
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
          .from('lessons')
          .select('id, class_id')
          .eq('id', p.media_url)
          .single();
        if (lesson) p.lesson = lesson;
      }
      return p;
    }));

    res.json(enhancedPosts);
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

    const { type, content, media_url, deadline, target_student_id } = req.body;
    const author_id = req.user.id;

    // Sanitize empty strings to null for DB insertion
    const insertData = {
      class_id: id,
      author_id,
      type,
      content,
      media_url: media_url || null,
      deadline: deadline || null,
      target_student_id: target_student_id || null,
      questions: req.body.questions || []
    };

    const { data, error } = await supabase
      .from('class_posts')
      .insert([insertData])
      .select('*, author:author_id(username)')
      .single();

    if (error) throw error;
    res.status(201).json(data);
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
      .from('class_schedules')
      .select('*')
      .eq('class_id', id)
      .order('start_time', { ascending: true });

    if (error) throw error;
    res.json(data);
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
      .from('class_schedules')
      .insert([{ class_id: id, title, start_time, end_time, meet_url }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assignments Management
// Get all assignments for teacher's classes
router.get('/assignments/all', auth, async (req, res) => {
  try {
    if (!requireTeacherOrAdmin(req, res)) return;

    const userId = req.user.id;
    // Get classes teacher manages
    let classQuery = supabase.from('classes').select('id');
    if (req.user.role !== 'admin') {
      classQuery = classQuery.eq('teacher_id', userId);
    }
    const { data: teacherClasses, error: classError } = await classQuery;
    if (classError) throw classError;
    const classIds = teacherClasses.map(c => c.id);
    if (classIds.length === 0) return res.json([]);

    const { data, error } = await supabase
      .from('class_posts')
      .select('*, class:class_id(name)')
      .in('class_id', classIds)
      .eq('type', 'assignment')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get submissions/progress for an assignment
router.get('/assignments/:postId/submissions', auth, async (req, res) => {
  try {
    if (!requireTeacherOrAdmin(req, res)) return;

    const { postId } = req.params;
    
    // Get assignment info to get class_id
    const { data: post } = await supabase.from('class_posts').select('class_id').eq('id', postId).single();
    if (post && !(await ensureClassOwner(post.class_id, req.user, res))) return;
    if (!post) return res.status(404).json({ error: 'Không tìm thấy bài tập' });

    // Get all class members
    const { data: members } = await supabase.from('class_members').select('student:student_id(id, username)').eq('class_id', post.class_id);
    
    // Get submissions
    const { data: submissions } = await supabase.from('class_assignment_submissions').select('*').eq('post_id', postId);

    // Map together
    const progress = (members || []).map(m => {
      const sub = (submissions || []).find(s => s.student_id === m.student.id);
      return {
        student: m.student,
        submitted: !!sub,
        submitted_at: sub?.submitted_at,
        status: sub?.status,
        score: sub?.score
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
    const student_id = req.user.id;

    const { data: post, error: postError } = await supabase
      .from('class_posts')
      .select('class_id, type, target_student_id')
      .eq('id', postId)
      .single();
    if (postError || !post) return res.status(404).json({ error: 'Không tìm thấy bài tập' });
    if (post.type !== 'assignment') {
      return res.status(400).json({ error: 'Bai dang nay khong phai bai tap' });
    }
    if (post.target_student_id && post.target_student_id !== student_id) {
      return res.status(403).json({ error: 'Bai tap nay khong duoc giao cho ban' });
    }

    const { data: membership, error: membershipError } = await supabase
      .from('class_members')
      .select('class_id')
      .eq('class_id', post.class_id)
      .eq('student_id', student_id)
      .maybeSingle();

    if (membershipError) throw membershipError;
    if (!membership) return res.status(403).json({ error: 'Bạn chưa tham gia lớp học này' });

    const { data, error } = await supabase
      .from('class_assignment_submissions')
      .upsert([{ 
        post_id: postId, 
        student_id, 
        status: 'submitted',
        answers: Array.isArray(answers) ? answers : [],
        score: null,
        feedback: null
      }], { onConflict: 'post_id,student_id' })
      .select()
      .single();

    if (error) throw error;



    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Grade/Feedback an assignment (Teacher)
router.post('/assignments/:postId/grade/:studentId', auth, async (req, res) => {
  try {
    const { postId, studentId } = req.params;
    const { score, feedback } = req.body;

    // Check if user is teacher
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Chỉ giáo viên mới có quyền chấm điểm' });
    }

    const { data: post, error: postError } = await supabase
      .from('class_posts')
      .select('class_id, type')
      .eq('id', postId)
      .single();
    if (postError || !post) return res.status(404).json({ error: 'Khong tim thay bai tap' });
    if (post.type !== 'assignment') {
      return res.status(400).json({ error: 'Bai dang nay khong phai bai tap' });
    }
    if (!(await ensureClassOwner(post.class_id, req.user, res))) return;

    const { data, error } = await supabase
      .from('class_assignment_submissions')
      .update({ score, feedback, status: 'graded' })
      .eq('post_id', postId)
      .eq('student_id', studentId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an assignment
router.delete('/assignments/:postId', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Check if user is the author or teacher of the class
    const { data: post } = await supabase.from('class_posts').select('author_id, class_id').eq('id', postId).single();
    if (!post) return res.status(404).json({ error: 'Không tìm thấy bài tập' });

    const ownsClass = req.user.role === 'admin' || !!(await ensureClassOwner(post.class_id, req.user, res));
    if (res.headersSent) return;
    if (post.author_id !== req.user.id && !ownsClass) {
      return res.status(403).json({ error: 'Bạn không có quyền xóa bài tập này' });
    }

    const { error } = await supabase.from('class_posts').delete().eq('id', postId);
    if (error) throw error;
    
    res.json({ message: 'Đã xóa bài tập' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /teacher/notifications - Fetch notifications for classes managed by this teacher
router.get('/teacher/notifications', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Chỉ dành cho giáo viên và quản trị viên' });
    }

    // 1. Get all class IDs for this teacher
    const { data: classes, error: classErr } = await supabase
      .from('classes')
      .select('id, name')
      .eq('teacher_id', userId);

    if (classErr) throw classErr;
    if (!classes || classes.length === 0) {
      return res.json([]);
    }

    const classIds = classes.map(c => c.id);
    const classMap = {};
    classes.forEach(c => {
      classMap[c.id] = c.name;
    });

    // 2. Fetch new student joins
    const { data: newMembers, error: memErr } = await supabase
      .from('class_members')
      .select('class_id, student_id, joined_at, student:student_id(username)')
      .in('class_id', classIds)
      .order('joined_at', { ascending: false })
      .limit(15);

    if (memErr) throw memErr;

    // 3. Fetch student messages (posts that are not from this teacher)
    const { data: posts, error: msgErr } = await supabase
      .from('class_posts')
      .select('id, class_id, content, type, created_at, author:author_id(username)')
      .in('class_id', classIds)
      .neq('author_id', userId)
      .order('created_at', { ascending: false })
      .limit(15);

    if (msgErr) throw msgErr;

    // 4. Fetch homework submissions
    const { data: assignments, error: assignErr } = await supabase
      .from('class_posts')
      .select('id, content, class_id')
      .in('class_id', classIds)
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
        .from('class_assignment_submissions')
        .select('post_id, student_id, submitted_at, student:student_id(username)')
        .in('post_id', assignmentIds)
        .order('submitted_at', { ascending: false })
        .limit(15);

      if (subErr) throw subErr;

      submissions = (subs || []).map(s => {
        const assign = assignmentMap[s.post_id];
        return {
          id: `sub-${s.post_id}-${s.student_id}-${new Date(s.submitted_at).getTime()}`,
          type: 'submission',
          title: 'Học sinh nộp bài tập',
          message: `Học sinh ${s.student?.username || 'Học sinh'} đã nộp bài tập: "${assign?.content?.substring(0, 30) || 'Bài tập'}${assign?.content?.length > 30 ? '...' : ''}"`,
          timestamp: s.submitted_at,
          link: '/teacher/assignments'
        };
      });
    }

    // 5. Fetch near-deadline assignments (within 48 hours)
    const now = new Date();
    const fortyEightHoursLater = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const { data: nearDue, error: dueErr } = await supabase
      .from('class_posts')
      .select('id, class_id, content, deadline')
      .in('class_id', classIds)
      .eq('type', 'assignment')
      .gt('deadline', now.toISOString())
      .lt('deadline', fortyEightHoursLater.toISOString())
      .limit(5);

    if (dueErr) throw dueErr;

    // Combine notifications
    const notifications = [];

    // Add student joins
    (newMembers || []).forEach(m => {
      notifications.push({
        id: `join-${m.class_id}-${m.student_id}-${new Date(m.joined_at).getTime()}`,
        type: 'student_join',
        title: 'Học sinh mới tham gia lớp',
        message: `Học sinh ${m.student?.username || 'Học sinh'} đã tham gia lớp "${classMap[m.class_id]}"`,
        timestamp: m.joined_at,
        link: `/teacher/classes/${m.class_id}`
      });
    });

    // Add student messages
    (posts || []).forEach(p => {
      notifications.push({
        id: `msg-${p.id}`,
        type: 'message',
        title: 'Tin nhắn mới từ học sinh',
        message: `${p.author?.username || 'Học sinh'} ("${classMap[p.class_id]}"): "${p.content?.substring(0, 50)}${p.content?.length > 50 ? '...' : ''}"`,
        timestamp: p.created_at,
        link: `/teacher/classes/${p.class_id}`
      });
    });

    // Add submissions
    notifications.push(...submissions);

    // Add near due assignments
    (nearDue || []).forEach(d => {
      notifications.push({
        id: `due-${d.id}`,
        type: 'due_soon',
        title: 'Bài tập sắp hết hạn',
        message: `Bài tập "${d.content?.substring(0, 30)}${d.content?.length > 30 ? '...' : ''}" lớp "${classMap[d.class_id]}" sắp đến hạn nộp`,
        timestamp: d.deadline,
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
