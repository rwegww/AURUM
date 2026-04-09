import express from 'express';
import { supabase } from '../lib/supabase.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
// removed redundant import

const router = express.Router();

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('Token missing');

    let userId;
    let user;

    const { data: { user: sbUser }, error: sbError } = await supabase.auth.getUser(token);
    
    if (sbUser && !sbError) {
      userId = sbUser.id;
      user = await User.findById(userId);
    } else {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
        user = await User.findById(userId);
      } catch (jwtErr) {
        throw new Error('Xác thực thất bại');
      }
    }

    if (!user) throw new Error('Không tìm thấy thông tin người dùng');

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Vui lòng đăng nhập lại', error: e.message });
  }
};

// Get all classes for a teacher or student
router.get('/', auth, async (req, res) => {
  try {
    const { role, id } = req.user; // Assuming authMiddleware sets req.user
    let query = supabase.from('classes').select('*, teacher:teacher_id(username)');

    if (role === 'teacher' || role === 'admin') {
      query = query.eq('teacher_id', id);
    } else {
      // For student, get classes they joined
      const { data: memberData } = await supabase.from('class_members').select('class_id').eq('student_id', id);
      const classIds = memberData?.map(m => m.class_id) || [];
      query = query.in('id', classIds);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
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

// Create a new class (Teacher only)
router.post('/', auth, async (req, res) => {
  try {
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

// Join a class (Student)
router.post('/join', auth, async (req, res) => {
  try {
    const { code } = req.body;
    const student_id = req.user.id;

    const { data: classData, error: classErr } = await supabase
      .from('classes')
      .select('id')
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
    const { data, error } = await supabase
      .from('class_members')
      .select('student:student_id(id, username)')
      .eq('class_id', id);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get class posts (messages, assignments, videos)
router.get('/:id/posts', auth, async (req, res) => {
  try {
    const { id } = req.params;
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

    // For students, check if each assignment is completed
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      const { data: submissions } = await supabase
        .from('class_assignment_submissions')
        .select('post_id')
        .eq('student_id', req.user.id);
      
      const submittedPostIds = submissions?.map(s => s.post_id) || [];
      posts = posts.map(p => ({
        ...p,
        is_completed: p.type === 'assignment' && submittedPostIds.includes(p.id)
      }));
    }

    // Enhance assignments with lesson details if media_url is a lesson ID
    const enhancedPosts = await Promise.all(posts.map(async (p) => {
      if (p.type === 'assignment' && p.media_url) {
        const { data: lesson } = await supabase
          .from('lessons')
          .select('id, grade_level')
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
      target_student_id: target_student_id || null
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
    const userId = req.user.id;
    // Get classes teacher manages
    const { data: teacherClasses } = await supabase.from('classes').select('id').eq('teacher_id', userId);
    const classIds = teacherClasses.map(c => c.id);

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
    const { postId } = req.params;
    
    // Get assignment info to get class_id
    const { data: post } = await supabase.from('class_posts').select('class_id').eq('id', postId).single();
    if (!post) return res.status(404).json({ error: 'Không tìm thấy bài tập' });

    // Get all class members
    const { data: members } = await supabase.from('class_members').select('student:student_id(id, username)').eq('class_id', post.class_id);
    
    // Get submissions
    const { data: submissions } = await supabase.from('class_assignment_submissions').select('*').eq('post_id', postId);

    // Map together
    const progress = members.map(m => {
      const sub = submissions.find(s => s.student_id === m.student.id);
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
    const { postId } = req.params;
    const student_id = req.user.id;

    const { data, error } = await supabase
      .from('class_assignment_submissions')
      .upsert([{ post_id: postId, student_id, status: 'submitted' }], { onConflict: 'post_id, student_id' })
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
    const { data: post } = await supabase.from('class_posts').select('author_id').eq('id', postId).single();
    if (!post) return res.status(404).json({ error: 'Không tìm thấy bài tập' });

    if (post.author_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Bạn không có quyền xóa bài tập này' });
    }

    const { error } = await supabase.from('class_posts').delete().eq('id', postId);
    if (error) throw error;
    
    res.json({ message: 'Đã xóa bài tập' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
