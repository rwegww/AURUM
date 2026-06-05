import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import Lesson from '../models/Lesson.js';
import AdminApproval from '../models/AdminApproval.js';
import { auth, requireRole } from '../_middleware/auth.js';
import { sendTeacherApprovalEmail, sendTeacherRejectionEmail } from '../lib/mailer.js';
import { supabase } from '../lib/supabase.js';

const router = express.Router();
const adminGuard = [auth, requireRole('admin')];

const approvalSummary = (request) => ({
  id: request.id,
  status: request.status,
  actionKey: request.actionKey,
  actionLabel: request.actionLabel,
  currentApprovals: request.currentApprovals,
  requiredApprovals: request.requiredApprovals,
  approverIds: request.approverIds,
});

const withApproval = (result, request) => {
  const approval = approvalSummary(request);
  if (result && typeof result === 'object' && !Array.isArray(result)) {
    return { ...result, approval };
  }
  return { data: result, approval };
};

const sendPendingApproval = (res, state) => res.status(202).json({
  message: state.alreadyApproved
    ? 'Bạn đã xác nhận yêu cầu này. Cần quản trị viên còn lại xác nhận để thực thi.'
    : 'Đã ghi nhận xác nhận đầu tiên. Cần quản trị viên còn lại xác nhận để thực thi.',
  requiresSecondAdminApproval: true,
  approvalRequest: state.request,
});

const ensureFeedback = async (id) => {
  const feedback = await Feedback.findById(id);
  if (!feedback) {
    const err = new Error('Không tìm thấy phản hồi');
    err.status = 404;
    throw err;
  }
  return feedback;
};

const parseTeacherRequest = async (id) => {
  const phan_hoi = await Feedback.findById(id);
  if (!phan_hoi || phan_hoi.type !== 'teacher_registration') {
    const err = new Error('Yêu cầu không tồn tại');
    err.status = 404;
    throw err;
  }

  let requestPayload;
  try {
    requestPayload = JSON.parse(phan_hoi.message);
  } catch {
    const err = new Error('Dữ liệu yêu cầu giáo viên không hợp lệ');
    err.status = 400;
    throw err;
  }

  return { phan_hoi, requestPayload };
};

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

const createClassCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

const adminActions = {
  'user.lock': {
    label: 'Thay đổi trạng thái tài khoản',
    execute: async ({ id, isLocked }) => {
      const locked = Boolean(isLocked);
      const updatedUser = await User.toggleLock(id, locked);
      return {
        message: locked ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản',
        user: updatedUser,
      };
    },
  },
  'feedback.resolve': {
    label: 'Đánh dấu phản hồi đã xử lý',
    execute: async ({ id }) => {
      await ensureFeedback(id);
      await Feedback.updateStatus(id, 'resolved');
      return { message: 'Đã giải quyết phản hồi' };
    },
  },
  'feedback.approve_praise': {
    label: 'Duyệt lời khen hiển thị trang chủ',
    execute: async ({ id }) => {
      const phan_hoi = await ensureFeedback(id);
      if (phan_hoi.type !== 'praise') {
        const err = new Error('Chỉ có thể duyệt lời khen ngợi');
        err.status = 400;
        throw err;
      }

      await Feedback.approve(id);
      return { message: 'Đã duyệt lời khen ngợi' };
    },
  },
  'lesson.create': {
    label: 'Tạo bài học',
    execute: async ({ lesson }) => Lesson.create(lesson),
  },
  'lesson.update': {
    label: 'Cập nhật bài học',
    execute: async ({ id, lesson }) => Lesson.update(id, lesson),
  },
  'lesson.delete': {
    label: 'Xóa bài học',
    execute: async ({ id }) => {
      await Lesson.delete(id);
      return { message: 'Đã xóa bài học thành công' };
    },
  },
  'teacher.approve': {
    label: 'Duyệt tài khoản giáo viên',
    execute: async ({ id }) => {
      const { phan_hoi, requestPayload } = await parseTeacherRequest(id);
      const { email, hashedPassword } = requestPayload;

      const user = await User.create({
        username: phan_hoi.username,
        email,
        password: hashedPassword,
        role: 'teacher',
        skipHash: true,
      });

      await Feedback.updateStatus(phan_hoi.id, 'resolved');

      const magicToken = jwt.sign(
        { id: user.id, role: user.role, magicLogin: true },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      await sendTeacherApprovalEmail(email, phan_hoi.username, magicToken);
      return { message: 'Đã duyệt yêu cầu và gửi email thành công' };
    },
  },
  'teacher.reject': {
    label: 'Từ chối tài khoản giáo viên',
    execute: async ({ id }) => {
      const { phan_hoi, requestPayload } = await parseTeacherRequest(id);
      const { email } = requestPayload;

      await Feedback.updateStatus(phan_hoi.id, 'rejected');
      await sendTeacherRejectionEmail(
        email,
        phan_hoi.username,
        'Tài liệu minh chứng của bạn có thể không hợp lệ hoặc không rõ ràng.'
      );

      return { message: 'Đã từ chối yêu cầu và gửi email thành công' };
    },
  },
  'class.create': {
    label: 'Tạo lớp học',
    execute: async ({ name, description, khoi_id, giao_vien_id }) => {
      const { data, error } = await supabase
        .from('lop')
        .insert([{ ten: name, khoi_id, mo_ta: description, giao_vien_id, ma_lop: createClassCode() }])
        .select()
        .single();

      if (error) throw error;
      return normalizeClass(data);
    },
  },
  'class.post.create': {
    label: 'Tạo bài đăng lớp học',
    execute: async ({ insertData }) => {
      const { data, error } = await supabase
        .from('bai_dang_lop')
        .insert([insertData])
        .select('*, author:tac_gia_id(username)')
        .single();

      if (error) throw error;
      return normalizePost(data);
    },
  },
  'class.schedule.create': {
    label: 'Tạo lịch lớp học',
    execute: async ({ insertData }) => {
      const { data, error } = await supabase
        .from('lich_lop')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;
      return normalizeSchedule(data);
    },
  },
  'assignment.grade': {
    label: 'Chấm bài tập',
    execute: async ({ postId, studentId, updateData }) => {
      const { data, error } = await supabase
        .from('bai_nop')
        .update(updateData)
        .eq('bai_dang_id', postId)
        .eq('hoc_sinh_id', studentId)
        .select()
        .single();

      if (error) throw error;
      return normalizeSubmission(data);
    },
  },
  'assignment.delete': {
    label: 'Xóa bài tập',
    execute: async ({ postId }) => {
      const { error } = await supabase.from('bai_dang_lop').delete().eq('id', postId);
      if (error) throw error;
      return { message: 'Đã xóa bài tập' };
    },
  },
};

const getAdminAction = (actionKey) => {
  const action = adminActions[actionKey];
  if (!action) {
    const err = new Error('Loại thay đổi không được hỗ trợ.');
    err.status = 400;
    throw err;
  }
  return action;
};

const executeApprovalState = async (req, res, state, statusCode = 200) => {
  const action = getAdminAction(state.request.actionKey);

  try {
    const result = await action.execute(state.request.payload || {});
    const executedRequest = await AdminApproval.markExecuted(state.request.id, result, req.user.id);
    return res.status(statusCode).json(withApproval(result, executedRequest));
  } catch (err) {
    await AdminApproval.markFailed(state.request.id, err.message);
    throw err;
  }
};

const requestAdminChange = async (req, res, actionKey, payload, { statusCode = 200 } = {}) => {
  const action = getAdminAction(actionKey);
  const state = await AdminApproval.createOrApprove({
    actionKey,
    actionLabel: action.label,
    payload,
    adminUser: req.user,
  });

  if (!state.readyToExecute) {
    return sendPendingApproval(res, state);
  }

  return executeApprovalState(req, res, state, statusCode);
};

const handleRouteError = (res, message, err, fallbackStatus = 500) => {
  const status = err.status || fallbackStatus;
  return res.status(status).json({ message, error: err.message });
};

// GET /api/admin/stats - System-wide statistics
router.get('/stats', adminGuard, async (req, res) => {
  try {
    const [totalUsers, totalLessons, totalFeedback, userStats, feedbackDistribution] = await Promise.all([
      User.countStudents(),
      Lesson.countAll(),
      Feedback.countUnread(),
      User.aggregateStats(),
      Feedback.getTypeDistribution(),
    ]);

    res.json({
      totalUsers,
      totalLessons,
      unreadFeedback: totalFeedback,
      totalXP: userStats.totalXP,
      avgLevel: userStats.avgLevel,
      levelDistribution: userStats.levelDistribution,
      gradeDistribution: userStats.gradeDistribution,
      topXP: userStats.topXP,
      topStreak: userStats.topStreak,
      feedbackDistribution,
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy thống kê', error: err.message });
  }
});

// GET /api/admin/approvals - List pending admin changes
router.get('/approvals', adminGuard, async (req, res) => {
  try {
    const allowedStatuses = new Set(['pending', 'executed', 'rejected', 'failed']);
    const status = allowedStatuses.has(req.query.status) ? req.query.status : 'pending';
    const approvals = await AdminApproval.list({ status });
    res.json(approvals);
  } catch (err) {
    handleRouteError(res, 'Lỗi lấy danh sách yêu cầu duyệt', err);
  }
});

// POST /api/admin/approvals/:id/approve - Second admin confirmation
router.post('/approvals/:id/approve', adminGuard, async (req, res) => {
  try {
    const state = await AdminApproval.addApproval(req.params.id, req.user);
    if (!state.readyToExecute) {
      return sendPendingApproval(res, state);
    }

    return await executeApprovalState(req, res, state);
  } catch (err) {
    handleRouteError(res, 'Lỗi xác nhận yêu cầu duyệt', err);
  }
});

// POST /api/admin/approvals/:id/reject - Reject a pending admin change
router.post('/approvals/:id/reject', adminGuard, async (req, res) => {
  try {
    const rejected = await AdminApproval.reject(req.params.id, req.user, req.body?.reason);
    res.json({ message: 'Đã từ chối yêu cầu thay đổi', approval: approvalSummary(rejected) });
  } catch (err) {
    handleRouteError(res, 'Lỗi từ chối yêu cầu duyệt', err);
  }
});

// GET /api/admin/users - List all users with activity monitoring
router.get(['/users', '/nguoi_dung'], adminGuard, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('nguoi_dung')
      .select('id, username, role, diem_kinh_nghiem, cap_do, hoat_dong_cuoi_luc, phut_hoat_dong, bi_khoa, created_at')
      .order('hoat_dong_cuoi_luc', { ascending: false });

    if (error) throw error;
    res.json(data.map(u => ({
      ...u,
      xp: u.diem_kinh_nghiem ?? 0,
      level: u.cap_do ?? 1,
      last_active_at: u.hoat_dong_cuoi_luc,
      active_minutes: u.phut_hoat_dong ?? 0,
      is_locked: u.bi_khoa ?? false,
      isOnline: u.hoat_dong_cuoi_luc && new Date(u.hoat_dong_cuoi_luc) > new Date(Date.now() - 5 * 60 * 1000),
      createdAt: u.created_at,
      diem_kinh_nghiem: undefined,
      cap_do: undefined,
      hoat_dong_cuoi_luc: undefined,
      phut_hoat_dong: undefined,
      bi_khoa: undefined,
      created_at: undefined,
    })));
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách người dùng', error: err.message });
  }
});

// PATCH /api/admin/users/:id/lock - Toggle user lock status
router.patch(['/users/:id/lock', '/nguoi_dung/:id/lock'], adminGuard, async (req, res) => {
  try {
    const { id } = req.params;
    const { isLocked } = req.body;
    return await requestAdminChange(req, res, 'user.lock', { id, isLocked: Boolean(isLocked) });
  } catch (err) {
    handleRouteError(res, 'Lỗi thay đổi trạng thái tài khoản', err);
  }
});

// GET /api/admin/users/:id - Get single user detail
router.get(['/users/:id', '/nguoi_dung/:id'], adminGuard, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy học sinh' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy thông tin học sinh', error: err.message });
  }
});

// GET /api/admin/feedback - List all feedback
router.get(['/feedback', '/phan_hoi'], adminGuard, async (req, res) => {
  try {
    const phan_hois = await Feedback.findAll();
    res.json(phan_hois);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy phản hồi', error: err.message });
  }
});

// POST /api/admin/feedback/submit - Student submission
router.post('/feedback/submit', async (req, res) => {
  try {
    const { message, type, imageUrl } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');

    let userId = null;
    let username = 'Anonymous';

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
          userId = user.id;
          username = user.username;
        }
      } catch (_jwtErr) {
        try {
          const { data } = await supabase.auth.getUser(token);
          const sbUser = data?.user;
          if (sbUser) {
            const user = await User.findById(sbUser.id) || await User.findOne({ email: sbUser.email });
            if (user) {
              userId = user.id;
              username = user.username;
            }
          }
        } catch (_sbErr) {
          // Ignore Supabase token fallback failure.
        }
      }
    }

    if (!message) return res.status(400).json({ message: 'Vui lòng nhập nội dung' });

    await Feedback.create({
      userId,
      username,
      message,
      type,
      imageUrl,
    });
    res.status(201).json({ message: 'Gửi phản hồi thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi gửi phản hồi', error: err.message });
  }
});

// PATCH /api/admin/feedback/:id - Resolve feedback
router.patch(['/feedback/:id', '/phan_hoi/:id'], adminGuard, async (req, res) => {
  try {
    return await requestAdminChange(req, res, 'feedback.resolve', { id: req.params.id });
  } catch (err) {
    handleRouteError(res, 'Lỗi cập nhật phản hồi', err);
  }
});

// PATCH /api/admin/feedback/:id/approve - Approve praise
router.patch(['/feedback/:id/approve', '/phan_hoi/:id/approve'], adminGuard, async (req, res) => {
  try {
    return await requestAdminChange(req, res, 'feedback.approve_praise', { id: req.params.id });
  } catch (err) {
    handleRouteError(res, 'Lỗi duyệt lời khen', err);
  }
});

// POST /api/admin/lessons - Create new lesson
router.post(['/lessons', '/bai_hoc'], adminGuard, async (req, res) => {
  try {
    return await requestAdminChange(req, res, 'lesson.create', { lesson: req.body }, { statusCode: 201 });
  } catch (err) {
    handleRouteError(res, 'Lỗi tạo bài học', err);
  }
});

// PUT /api/admin/lessons/:id - Update lesson
router.put(['/lessons/:id', '/bai_hoc/:id'], adminGuard, async (req, res) => {
  try {
    return await requestAdminChange(req, res, 'lesson.update', { id: req.params.id, lesson: req.body });
  } catch (err) {
    handleRouteError(res, 'Lỗi cập nhật bài học', err);
  }
});

// DELETE /api/admin/lessons/:id - Delete lesson
router.delete(['/lessons/:id', '/bai_hoc/:id'], adminGuard, async (req, res) => {
  try {
    return await requestAdminChange(req, res, 'lesson.delete', { id: req.params.id });
  } catch (err) {
    handleRouteError(res, 'Lỗi xóa bài học', err);
  }
});

// Duyệt yêu cầu giáo viên
router.post('/teacher-requests/:id/approve', adminGuard, async (req, res) => {
  try {
    return await requestAdminChange(req, res, 'teacher.approve', { id: req.params.id });
  } catch (err) {
    console.error('Lỗi duyệt giáo viên:', err);
    handleRouteError(res, 'Lỗi duyệt giáo viên', err);
  }
});

// Từ chối yêu cầu giáo viên
router.post('/teacher-requests/:id/reject', adminGuard, async (req, res) => {
  try {
    return await requestAdminChange(req, res, 'teacher.reject', { id: req.params.id });
  } catch (err) {
    console.error('Lỗi từ chối giáo viên:', err);
    handleRouteError(res, 'Lỗi từ chối giáo viên', err);
  }
});

export default router;
