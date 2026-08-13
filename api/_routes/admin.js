import express from 'express';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import Lesson from '../models/Lesson.js';
import AdminApproval from '../models/AdminApproval.js';
import { auth, authenticateToken, extractBearerToken, requireRole } from '../_middleware/auth.js';
import { sendTeacherApprovalEmail, sendTeacherRejectionEmail } from '../lib/mailer.js';
import { supabase } from '../lib/supabase.js';

const router = express.Router();
const adminGuard = [auth, requireRole('admin')];
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SAFE_TEXT_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@-]{0,127}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;
const PUBLIC_FEEDBACK_TYPES = new Set(['bug', 'suggestion', 'praise', 'other']);
const ADMIN_FEEDBACK_KINDS = new Set(['all', 'feedback', 'teachers']);
const LESSON_ARRAY_FIELDS = ['theoryModules', 'videoModules', 'storySlides', 'challenges'];

router.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

const httpError = (status, message, code = 'INVALID_REQUEST') => {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  error.expose = true;
  return error;
};

const isPlainObject = (value) => Boolean(
  value
  && typeof value === 'object'
  && !Array.isArray(value)
  && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)
);

const hasControlCharacters = (value) => [...value].some((character) => {
  const codePoint = character.codePointAt(0);
  return codePoint < 32 || codePoint === 127;
});

const assertUuid = (value, label = 'ID') => {
  if (typeof value !== 'string' || !UUID_PATTERN.test(value)) {
    throw httpError(400, `${label} không hợp lệ.`, 'INVALID_ID');
  }
  return value;
};

const assertTextId = (value, label = 'ID') => {
  if (typeof value !== 'string' || !SAFE_TEXT_ID_PATTERN.test(value)) {
    throw httpError(400, `${label} không hợp lệ.`, 'INVALID_ID');
  }
  return value;
};

const normalizeRequiredText = (value, label, maxLength) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw httpError(400, `${label} không được để trống.`, 'VALIDATION_ERROR');
  }
  const normalized = value.trim();
  if (normalized.length > maxLength) {
    throw httpError(400, `${label} không được vượt quá ${maxLength} ký tự.`, 'VALIDATION_ERROR');
  }
  return normalized;
};

const normalizeOptionalText = (value, label, maxLength) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== 'string') {
    throw httpError(400, `${label} phải là chuỗi.`, 'VALIDATION_ERROR');
  }
  const normalized = value.trim();
  if (normalized.length > maxLength) {
    throw httpError(400, `${label} không được vượt quá ${maxLength} ký tự.`, 'VALIDATION_ERROR');
  }
  return normalized || null;
};

const normalizeWebUrl = (value, label, { required = false } = {}) => {
  if (value === undefined || value === null || value === '') {
    if (required) throw httpError(400, `${label} không được để trống.`, 'VALIDATION_ERROR');
    return value === undefined ? undefined : null;
  }
  if (typeof value !== 'string' || value.length > 2048) {
    throw httpError(400, `${label} không hợp lệ.`, 'VALIDATION_ERROR');
  }
  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('invalid protocol');
    return parsed.toString();
  } catch {
    throw httpError(400, `${label} phải là địa chỉ HTTP(S) hợp lệ.`, 'VALIDATION_ERROR');
  }
};

const parsePageOptions = (query, { allowNullSort = false } = {}) => {
  const rawLimit = query.limit;
  const limit = rawLimit === undefined ? DEFAULT_PAGE_SIZE : Number(rawLimit);
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_PAGE_SIZE) {
    throw httpError(400, `limit phải là số nguyên từ 1 đến ${MAX_PAGE_SIZE}.`, 'INVALID_PAGINATION');
  }

  let cursor;
  if (query.before !== undefined) {
    try {
      const decoded = JSON.parse(Buffer.from(String(query.before), 'base64url').toString('utf8'));
      if (
        !isPlainObject(decoded)
        || !(
          (typeof decoded.sort === 'string' && !Number.isNaN(Date.parse(decoded.sort)))
          || (allowNullSort && decoded.sort === null)
        )
        || typeof decoded.id !== 'string'
        || !SAFE_TEXT_ID_PATTERN.test(decoded.id)
      ) {
        throw new Error('invalid cursor');
      }
      cursor = {
        sort: decoded.sort === null ? null : new Date(decoded.sort).toISOString(),
        id: decoded.id,
      };
    } catch {
      throw httpError(400, 'Con trỏ before không hợp lệ.', 'INVALID_PAGINATION');
    }
  }
  return { limit, cursor };
};

const encodeCursor = (sort, id) => Buffer
  .from(JSON.stringify({ sort, id }), 'utf8')
  .toString('base64url');

const sendPage = (res, items, limit, cursorSelector) => {
  const hasMore = items.length > limit;
  const page = hasMore ? items.slice(0, limit) : items;
  const nextCursor = hasMore && page.length ? cursorSelector(page.at(-1)) : null;
  res.set('X-Has-More', hasMore ? 'true' : 'false');
  if (nextCursor) res.set('X-Next-Cursor', nextCursor);
  return res.json(page);
};

const redactSensitiveFields = (value) => {
  if (Array.isArray(value)) return value.map(redactSensitiveFields);
  if (!isPlainObject(value)) return value;

  return Object.entries(value).reduce((safe, [key, nestedValue]) => {
    if (/(?:password|password_hash|hashedpassword|token|secret|authorization|sessionid|current_session_id)/i.test(key)) {
      return safe;
    }
    safe[key] = redactSensitiveFields(nestedValue);
    return safe;
  }, {});
};

const toAdminUserDto = (user) => {
  if (!user) return user;
  return redactSensitiveFields({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    xp: user.xp,
    level: user.level,
    avatarSeed: user.avatarSeed,
    createdAt: user.createdAt,
    lastActiveAt: user.lastActiveAt,
    activeMinutes: user.activeMinutes,
    isLocked: user.isLocked,
    streakCount: user.streakCount,
    unlockedLessons: user.unlockedLessons,
    unlockedChemicals: user.unlockedChemicals,
    inventory: user.inventory,
    arenaStats: user.arenaStats,
    teacherStats: user.teacherStats,
  });
};

const toAdminFeedbackDto = (feedback) => {
  if (!feedback) return feedback;

  let message = typeof feedback.message === 'string' ? feedback.message : '';
  if (feedback.type === 'teacher_registration') {
    message = '{}';
    try {
      const payload = JSON.parse(feedback.message);
      message = JSON.stringify({ email: typeof payload?.email === 'string' ? payload.email : null });
    } catch {
      // Keep malformed legacy requests inspectable without exposing their raw contents.
    }
  }

  const owner = feedback.userId && typeof feedback.userId === 'object'
    ? { username: feedback.userId.username || null }
    : feedback.userId || null;

  return redactSensitiveFields({
    id: feedback.id,
    username: feedback.username,
    message,
    type: feedback.type,
    status: feedback.status,
    imageUrl: feedback.imageUrl,
    isApproved: Boolean(feedback.isApproved ?? feedback.is_approved),
    metadata: feedback.metadata,
    userId: owner,
    createdAt: feedback.createdAt,
  });
};

const normalizeLessonInput = (input, { create = false } = {}) => {
  if (!isPlainObject(input)) {
    throw httpError(400, 'Dữ liệu bài học phải là một đối tượng JSON.', 'VALIDATION_ERROR');
  }

  const lesson = {};
  const requestedId = input.lessonId ?? input.id;
  if (requestedId !== undefined) lesson.lessonId = assertTextId(requestedId, 'ID bài học');

  const grade = input.gradeLevelId ?? input.khoi_id ?? input.classId;
  if (grade !== undefined) {
    const numericGrade = Number(grade);
    if (!Number.isInteger(numericGrade) || numericGrade < 6 || numericGrade > 12) {
      throw httpError(400, 'Khối lớp phải là số nguyên từ 6 đến 12.', 'VALIDATION_ERROR');
    }
    lesson.gradeLevelId = numericGrade;
  }

  if (input.title !== undefined) lesson.title = normalizeRequiredText(input.title, 'Tiêu đề bài học', 300);
  if (input.chapter !== undefined) lesson.chapter = normalizeOptionalText(input.chapter, 'Chương', 200);
  if (input.description !== undefined) lesson.description = normalizeOptionalText(input.description, 'Mô tả', 5000);
  if (input.programId !== undefined) {
    const programId = normalizeRequiredText(input.programId, 'Bộ sách', 50);
    if (!/^[A-Za-z0-9_-]+$/.test(programId)) {
      throw httpError(400, 'Mã bộ sách không hợp lệ.', 'VALIDATION_ERROR');
    }
    lesson.programId = programId;
  }
  if (input.order !== undefined) {
    const order = Number(input.order);
    if (!Number.isInteger(order) || order < 0 || order > 10000) {
      throw httpError(400, 'Thứ tự bài học phải là số nguyên từ 0 đến 10000.', 'VALIDATION_ERROR');
    }
    lesson.order = order;
  }

  for (const field of LESSON_ARRAY_FIELDS) {
    if (input[field] !== undefined) {
      if (!Array.isArray(input[field])) {
        throw httpError(400, `${field} phải là một mảng.`, 'VALIDATION_ERROR');
      }
      lesson[field] = input[field];
    }
  }

  if (input.quizzes !== undefined) {
    const quizzes = input.quizzes;
    if (Array.isArray(quizzes)) {
      lesson.quizzes = quizzes;
    } else if (isPlainObject(quizzes)) {
      for (const level of ['level1', 'level2', 'level3']) {
        if (quizzes[level] !== undefined && !Array.isArray(quizzes[level])) {
          throw httpError(400, `quizzes.${level} phải là một mảng.`, 'VALIDATION_ERROR');
        }
      }
      lesson.quizzes = quizzes;
    } else {
      throw httpError(400, 'quizzes phải là một mảng hoặc đối tượng phân cấp.', 'VALIDATION_ERROR');
    }
  }

  if (input.game !== undefined) {
    if (!isPlainObject(input.game)) {
      throw httpError(400, 'game phải là một đối tượng JSON.', 'VALIDATION_ERROR');
    }
    lesson.game = input.game;
  }
  if (input.introVideoUrl !== undefined) {
    lesson.introVideoUrl = normalizeWebUrl(input.introVideoUrl, 'Video giới thiệu');
  }
  if (input.isPremium !== undefined) {
    if (typeof input.isPremium !== 'boolean') {
      throw httpError(400, 'isPremium phải là giá trị boolean.', 'VALIDATION_ERROR');
    }
    lesson.isPremium = input.isPremium;
  }

  if (create) {
    lesson.lessonId ||= `lesson_${crypto.randomUUID()}`;
    if (!lesson.title || lesson.gradeLevelId === undefined) {
      throw httpError(400, 'Tiêu đề và khối lớp là bắt buộc khi tạo bài học.', 'VALIDATION_ERROR');
    }
    lesson.programId ||= 'ketnoi';
  } else if (Object.keys(lesson).filter((key) => key !== 'lessonId').length === 0) {
    throw httpError(400, 'Không có trường bài học hợp lệ để cập nhật.', 'VALIDATION_ERROR');
  }

  if (JSON.stringify(lesson).length > 1_500_000) {
    throw httpError(413, 'Nội dung bài học vượt quá dung lượng cho phép.', 'PAYLOAD_TOO_LARGE');
  }
  return lesson;
};

const approvalSummary = (request) => ({
  id: request.id,
  status: request.status,
  actionKey: request.actionKey,
  actionLabel: request.actionLabel,
  currentApprovals: request.currentApprovals,
  requiredApprovals: request.requiredApprovals,
  approverIds: request.approverIds,
});

const toAdminApprovalDto = (request) => request ? redactSensitiveFields(request) : request;

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
  approvalRequest: toAdminApprovalDto(state.request),
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

const parseTeacherRequest = async (id, { requirePassword = true } = {}) => {
  assertUuid(id, 'ID yêu cầu giáo viên');
  const phan_hoi = await Feedback.findById(id);
  if (!phan_hoi || phan_hoi.type !== 'teacher_registration') {
    throw httpError(404, 'Yêu cầu không tồn tại.', 'TEACHER_REQUEST_NOT_FOUND');
  }
  if (phan_hoi.status !== 'unread') {
    throw httpError(409, 'Yêu cầu giáo viên này đã được xử lý.', 'TEACHER_REQUEST_ALREADY_PROCESSED');
  }

  let requestPayload;
  try {
    requestPayload = JSON.parse(phan_hoi.message);
  } catch {
    throw httpError(400, 'Dữ liệu yêu cầu giáo viên không hợp lệ.', 'INVALID_TEACHER_REQUEST');
  }

  if (!isPlainObject(requestPayload)) {
    throw httpError(400, 'Dữ liệu yêu cầu giáo viên không hợp lệ.', 'INVALID_TEACHER_REQUEST');
  }

  const email = typeof requestPayload.email === 'string'
    ? requestPayload.email.trim().toLowerCase()
    : '';
  if (!EMAIL_PATTERN.test(email) || email.length > 320) {
    throw httpError(400, 'Email trong yêu cầu giáo viên không hợp lệ.', 'INVALID_TEACHER_REQUEST');
  }
  if (
    requirePassword
    && (typeof requestPayload.hashedPassword !== 'string' || !BCRYPT_HASH_PATTERN.test(requestPayload.hashedPassword))
  ) {
    throw httpError(400, 'Mật khẩu bảo vệ trong yêu cầu giáo viên không hợp lệ.', 'INVALID_TEACHER_REQUEST');
  }
  const teacherUsername = typeof phan_hoi.username === 'string' ? phan_hoi.username.trim() : '';
  if (!teacherUsername || teacherUsername.length > 64 || hasControlCharacters(teacherUsername)) {
    throw httpError(400, 'Tên đăng nhập trong yêu cầu giáo viên không hợp lệ.', 'INVALID_TEACHER_REQUEST');
  }
  normalizeWebUrl(phan_hoi.imageUrl, 'Ảnh minh chứng', { required: true });

  if (requirePassword) {
    const [existingUsername, existingEmail] = await Promise.all([
      User.findOne({ username: teacherUsername }),
      User.findOne({ email }),
    ]);
    if (existingUsername || existingEmail) {
      throw httpError(409, 'Tên đăng nhập hoặc email giáo viên đã tồn tại.', 'TEACHER_ALREADY_EXISTS');
    }
  }

  return {
    phan_hoi: { ...phan_hoi, username: teacherUsername },
    requestPayload: { ...requestPayload, email },
  };
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

const createClassCode = () => crypto.randomBytes(5).toString('base64url').slice(0, 6).toUpperCase();

const normalizeClassCreateInput = ({ name, description, khoi_id, giao_vien_id } = {}) => {
  const gradeLevelId = Number(khoi_id);
  if (!Number.isInteger(gradeLevelId) || gradeLevelId < 6 || gradeLevelId > 12) {
    throw httpError(400, 'Khối lớp phải là số nguyên từ 6 đến 12.', 'VALIDATION_ERROR');
  }

  return {
    name: normalizeRequiredText(name, 'Tên lớp', 200),
    description: normalizeOptionalText(description, 'Mô tả lớp', 2000),
    khoi_id: gradeLevelId,
    giao_vien_id: assertTextId(giao_vien_id, 'ID giáo viên'),
  };
};

const adminActions = {
  'user.lock': {
    label: 'Thay đổi trạng thái tài khoản',
    prepare: async ({ id, isLocked }) => {
      assertTextId(id, 'ID người dùng');
      if (typeof isLocked !== 'boolean') {
        throw httpError(400, 'isLocked phải là giá trị boolean.', 'VALIDATION_ERROR');
      }
      const target = await User.findById(id);
      if (!target) throw httpError(404, 'Không tìm thấy người dùng.', 'USER_NOT_FOUND');
      if (target.role === 'admin') {
        throw httpError(403, 'Không thể khóa tài khoản quản trị viên.', 'ADMIN_LOCK_FORBIDDEN');
      }
      return { id, isLocked, username: target.username, email: target.email, role: target.role };
    },
    execute: async ({ id, isLocked }) => {
      assertTextId(id, 'ID người dùng');
      if (typeof isLocked !== 'boolean') {
        throw httpError(400, 'isLocked phải là giá trị boolean.', 'VALIDATION_ERROR');
      }
      const target = await User.findById(id);
      if (!target) throw httpError(404, 'Không tìm thấy người dùng.', 'USER_NOT_FOUND');
      if (target.role === 'admin') {
        throw httpError(403, 'Không thể khóa tài khoản quản trị viên.', 'ADMIN_LOCK_FORBIDDEN');
      }
      const updatedUser = await User.toggleLock(id, isLocked);
      return {
        message: isLocked ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản',
        user: toAdminUserDto(updatedUser),
      };
    },
  },
  'feedback.resolve': {
    label: 'Đánh dấu phản hồi đã xử lý',
    prepare: async ({ id }) => {
      assertUuid(id, 'ID phản hồi');
      const feedback = await ensureFeedback(id);
      if (feedback.status !== 'unread') {
        throw httpError(409, 'Phản hồi này đã được xử lý.', 'FEEDBACK_ALREADY_PROCESSED');
      }
      return {
        id,
        content: feedback.message || feedback.noi_dung || '',
        username: feedback.username || feedback.userId?.username || 'Ẩn danh',
        type: feedback.type,
      };
    },
    execute: async ({ id }) => {
      assertUuid(id, 'ID phản hồi');
      const feedback = await ensureFeedback(id);
      if (feedback.status !== 'unread') {
        throw httpError(409, 'Phản hồi này đã được xử lý.', 'FEEDBACK_ALREADY_PROCESSED');
      }
      await Feedback.updateStatus(id, 'resolved');
      return { message: 'Đã giải quyết phản hồi' };
    },
  },
  'feedback.approve_praise': {
    label: 'Duyệt lời khen hiển thị trang chủ',
    prepare: async ({ id }) => {
      assertUuid(id, 'ID phản hồi');
      const feedback = await ensureFeedback(id);
      if (feedback.type !== 'praise') {
        throw httpError(400, 'Chỉ có thể duyệt lời khen ngợi.', 'INVALID_FEEDBACK_TYPE');
      }
      if (feedback.isApproved || feedback.is_approved) {
        throw httpError(409, 'Lời khen này đã được duyệt.', 'FEEDBACK_ALREADY_APPROVED');
      }
      return {
        id,
        content: feedback.message || feedback.noi_dung || '',
        username: feedback.username || feedback.userId?.username || 'Ẩn danh',
        type: feedback.type,
        rating: feedback.metadata?.rating || feedback.danh_gia || null,
        createdAt: feedback.createdAt || feedback.created_at || null,
      };
    },
    execute: async ({ id }) => {
      assertUuid(id, 'ID phản hồi');
      const phan_hoi = await ensureFeedback(id);
      if (phan_hoi.type !== 'praise') {
        throw httpError(400, 'Chỉ có thể duyệt lời khen ngợi.', 'INVALID_FEEDBACK_TYPE');
      }
      if (phan_hoi.isApproved || phan_hoi.is_approved) {
        throw httpError(409, 'Lời khen này đã được duyệt.', 'FEEDBACK_ALREADY_APPROVED');
      }

      await Feedback.approve(id);
      return { message: 'Đã duyệt lời khen ngợi' };
    },
  },
  'lesson.create': {
    label: 'Tạo bài học',
    prepare: async ({ lesson }) => ({ lesson: normalizeLessonInput(lesson, { create: true }) }),
    execute: async ({ lesson }) => Lesson.create(normalizeLessonInput(lesson, { create: true })),
  },
  'lesson.update': {
    label: 'Cập nhật bài học',
    prepare: async ({ id, lesson }) => {
      assertTextId(id, 'ID bài học');
      const currentLesson = await Lesson.findById(id);
      if (!currentLesson) throw httpError(404, 'Không tìm thấy bài học.', 'LESSON_NOT_FOUND');
      return { id, title: currentLesson.title, lesson: normalizeLessonInput(lesson) };
    },
    execute: async ({ id, lesson }) => {
      assertTextId(id, 'ID bài học');
      const currentLesson = await Lesson.findById(id);
      if (!currentLesson) throw httpError(404, 'Không tìm thấy bài học.', 'LESSON_NOT_FOUND');
      const patch = normalizeLessonInput(lesson);
      const mergedLesson = normalizeLessonInput({ ...currentLesson, ...patch, lessonId: id }, { create: true });
      return Lesson.update(id, mergedLesson);
    },
  },
  'lesson.delete': {
    label: 'Xóa bài học',
    prepare: async ({ id }) => {
      assertTextId(id, 'ID bài học');
      const lesson = await Lesson.findById(id);
      if (!lesson) throw httpError(404, 'Không tìm thấy bài học.', 'LESSON_NOT_FOUND');
      return { id, title: lesson.title, gradeLevelId: lesson.gradeLevelId };
    },
    execute: async ({ id }) => {
      assertTextId(id, 'ID bài học');
      const lesson = await Lesson.findById(id);
      if (!lesson) throw httpError(404, 'Không tìm thấy bài học.', 'LESSON_NOT_FOUND');
      await Lesson.delete(id);
      return { message: 'Đã xóa bài học thành công' };
    },
  },
  'teacher.approve': {
    label: 'Duyệt tài khoản giáo viên',
    prepare: async ({ id }) => {
      const { phan_hoi, requestPayload } = await parseTeacherRequest(id);
      return {
        id,
        username: phan_hoi.username,
        email: requestPayload.email,
        proofUrl: phan_hoi.imageUrl || null,
      };
    },
    execute: async ({ id }) => {
      const { phan_hoi, requestPayload } = await parseTeacherRequest(id);
      const { email, hashedPassword } = requestPayload;

      await User.create({
        username: phan_hoi.username,
        email,
        password: hashedPassword,
        role: 'teacher',
        skipHash: true,
      });

      let feedbackUpdated = true;
      try {
        await Feedback.updateStatus(phan_hoi.id, 'resolved');
      } catch (error) {
        feedbackUpdated = false;
        console.error('Đã tạo tài khoản giáo viên nhưng không thể cập nhật yêu cầu:', error);
      }

      let emailResult;
      try {
        emailResult = await sendTeacherApprovalEmail(email, phan_hoi.username);
      } catch (error) {
        emailResult = { success: false, error: error.message };
      }
      if (!emailResult?.success) {
        console.error('Đã tạo tài khoản giáo viên nhưng không thể gửi email thông báo:', emailResult?.error);
      }
      const warnings = [];
      if (!feedbackUpdated) warnings.push('trạng thái yêu cầu chưa được đồng bộ');
      if (!emailResult?.success) warnings.push('email thông báo chưa gửi được');
      return {
        message: warnings.length === 0
          ? 'Đã duyệt yêu cầu và gửi email thành công.'
          : `Đã tạo tài khoản giáo viên; ${warnings.join(' và ')}.`,
        emailSent: Boolean(emailResult?.success),
        feedbackUpdated,
      };
    },
  },
  'teacher.reject': {
    label: 'Từ chối tài khoản giáo viên',
    prepare: async ({ id }) => {
      const { phan_hoi, requestPayload } = await parseTeacherRequest(id, { requirePassword: false });
      return {
        id,
        username: phan_hoi.username,
        email: requestPayload.email,
        proofUrl: phan_hoi.imageUrl || null,
      };
    },
    execute: async ({ id }) => {
      const { phan_hoi, requestPayload } = await parseTeacherRequest(id, { requirePassword: false });
      const { email } = requestPayload;

      await Feedback.updateStatus(phan_hoi.id, 'rejected');
      let emailResult;
      try {
        emailResult = await sendTeacherRejectionEmail(
          email,
          phan_hoi.username,
          'Tài liệu minh chứng của bạn có thể không hợp lệ hoặc không rõ ràng.'
        );
      } catch (error) {
        emailResult = { success: false, error: error.message };
      }
      if (!emailResult?.success) {
        console.error('Đã từ chối yêu cầu giáo viên nhưng không thể gửi email thông báo:', emailResult?.error);
      }

      return {
        message: emailResult?.success
          ? 'Đã từ chối yêu cầu và gửi email thành công.'
          : 'Đã từ chối yêu cầu, nhưng chưa gửi được email thông báo.',
        emailSent: Boolean(emailResult?.success),
      };
    },
  },
  'class.create': {
    label: 'Tạo lớp học',
    execute: async (payload) => {
      const { name, description, khoi_id, giao_vien_id } = normalizeClassCreateInput(payload);
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
  const claimedRequest = await AdminApproval.claimExecution(state.request.id, req.user);
  const action = getAdminAction(claimedRequest.actionKey);
  let result;

  try {
    result = await action.execute(claimedRequest.payload || {});
  } catch (err) {
    try {
      await AdminApproval.markFailed(claimedRequest.id, err.message);
    } catch (stateError) {
      console.error('Không thể ghi nhận lỗi thực thi yêu cầu duyệt:', stateError);
    }
    throw err;
  }

  try {
    const executedRequest = await AdminApproval.markExecuted(claimedRequest.id, result, req.user.id);
    return res.status(statusCode).json(withApproval(result, executedRequest));
  } catch (err) {
    console.error('Thay đổi đã thực thi nhưng không thể chốt yêu cầu duyệt:', err);
    throw httpError(
      500,
      'Thay đổi đã được áp dụng nhưng trạng thái xác nhận chưa đồng bộ. Vui lòng kiểm tra nhật ký trước khi thử lại.',
      'APPROVAL_FINALIZATION_FAILED',
    );
  }
};

const requestAdminChange = async (req, res, actionKey, payload, { statusCode = 200 } = {}) => {
  const action = getAdminAction(actionKey);
  const preparedPayload = action.prepare ? await action.prepare(payload) : payload;
  const state = await AdminApproval.createOrApprove({
    actionKey,
    actionLabel: action.label,
    payload: preparedPayload,
    adminUser: req.user,
  });

  if (!state.readyToExecute) {
    return sendPendingApproval(res, state);
  }

  return executeApprovalState(req, res, state, statusCode);
};

const handleRouteError = (res, message, err, fallbackStatus = 500) => {
  const status = err.status || fallbackStatus;
  const exposedMessage = err.expose || status < 500 ? err.message : message;
  return res.status(status).json({
    message: exposedMessage || message,
    error: err.code || (status >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_FAILED'),
  });
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
    handleRouteError(res, 'Lỗi lấy thống kê', err);
  }
});

// POST /api/admin/media/signature - Short-lived signed upload parameters for admin media
router.post('/media/signature', adminGuard, async (req, res) => {
  try {
    const folder = typeof req.body?.folder === 'string' ? req.body.folder.trim() : '';
    if (!/^chemistry-odyssey\/admin(?:\/[A-Za-z0-9_-]+)*$/.test(folder) || folder.length > 160) {
      throw httpError(400, 'Thư mục tải lên của quản trị viên không hợp lệ.', 'INVALID_UPLOAD_FOLDER');
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      throw httpError(503, 'Dịch vụ tải tệp tạm thời chưa được cấu hình.', 'UPLOAD_SERVICE_UNAVAILABLE');
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, apiSecret);
    return res.json({ cloudName, apiKey, folder, timestamp, signature });
  } catch (err) {
    return handleRouteError(res, 'Không thể tạo quyền tải tệp.', err);
  }
});

const enrichApprovalPayloads = async (approvalRows) => {
  if (!Array.isArray(approvalRows) || approvalRows.length === 0) return approvalRows;

  const feedbackIdsToFetch = new Set();
  const userIdsToFetch = new Set();
  const lessonIdsToFetch = new Set();

  approvalRows.forEach((item) => {
    const payload = item.payload || {};
    if (item.actionKey === 'feedback.approve_praise' || item.actionKey === 'feedback.resolve') {
      if (payload.id && (!payload.content && !payload.noi_dung)) feedbackIdsToFetch.add(payload.id);
    } else if (item.actionKey === 'teacher.approve' || item.actionKey === 'teacher.reject') {
      if (payload.id && !payload.username) feedbackIdsToFetch.add(payload.id);
    } else if (item.actionKey === 'user.lock') {
      if (payload.id && !payload.username) userIdsToFetch.add(payload.id);
    } else if (item.actionKey === 'lesson.delete' || item.actionKey === 'lesson.update') {
      if (payload.id && !payload.title && !payload.lesson?.title) lessonIdsToFetch.add(payload.id);
    }
  });

  const feedbackMap = new Map();
  if (feedbackIdsToFetch.size > 0) {
    const { data: feedbacks } = await supabase
      .from('phan_hoi')
      .select('id, noi_dung, username, type, image_url, thong_tin_bo_sung')
      .in('id', Array.from(feedbackIdsToFetch));
    (feedbacks || []).forEach((f) => feedbackMap.set(f.id, f));
  }

  const userMap = new Map();
  if (userIdsToFetch.size > 0) {
    const { data: users } = await supabase
      .from('nguoi_dung')
      .select('id, username, email, role')
      .in('id', Array.from(userIdsToFetch));
    (users || []).forEach((u) => userMap.set(u.id, u));
  }

  const lessonMap = new Map();
  if (lessonIdsToFetch.size > 0) {
    const { data: lessons } = await supabase
      .from('bai_hoc')
      .select('id, tieu_de, khoi_id')
      .in('id', Array.from(lessonIdsToFetch));
    (lessons || []).forEach((l) => lessonMap.set(l.id, l));
  }

  return approvalRows.map((item) => {
    const payload = { ...(item.payload || {}) };

    if (item.actionKey === 'feedback.approve_praise' || item.actionKey === 'feedback.resolve') {
      const fb = feedbackMap.get(payload.id);
      if (fb) {
        if (!payload.content && !payload.noi_dung) payload.content = fb.noi_dung || '';
        if (!payload.username) payload.username = fb.username || 'Ẩn danh';
        if (!payload.type) payload.type = fb.type;
        if (fb.thong_tin_bo_sung && typeof fb.thong_tin_bo_sung === 'object') {
          if (!payload.rating && fb.thong_tin_bo_sung.rating) payload.rating = fb.thong_tin_bo_sung.rating;
        }
      }
    } else if (item.actionKey === 'teacher.approve' || item.actionKey === 'teacher.reject') {
      const fb = feedbackMap.get(payload.id);
      if (fb) {
        if (!payload.username) payload.username = fb.username;
        let email = '';
        try {
          const parsed = JSON.parse(fb.noi_dung);
          email = parsed.email || '';
        } catch {}
        if (!payload.email) payload.email = email || fb.thong_tin_bo_sung?.email;
        if (!payload.proofUrl) payload.proofUrl = fb.image_url;
      }
    } else if (item.actionKey === 'user.lock') {
      const u = userMap.get(payload.id);
      if (u) {
        if (!payload.username) payload.username = u.username;
        if (!payload.email) payload.email = u.email;
        if (!payload.role) payload.role = u.role;
      }
    } else if (item.actionKey === 'lesson.delete' || item.actionKey === 'lesson.update') {
      const l = lessonMap.get(payload.id);
      if (l) {
        if (!payload.title && !payload.lesson?.title) payload.title = l.tieu_de;
        if (!payload.gradeLevelId) payload.gradeLevelId = l.khoi_id;
      }
    }

    return { ...item, payload };
  });
};

// GET /api/admin/approvals - List pending admin changes
router.get('/approvals', adminGuard, async (req, res) => {
  try {
    const allowedStatuses = new Set(['pending', 'executed', 'rejected', 'failed']);
    const requestedStatus = req.query.status ?? 'pending';
    if (!allowedStatuses.has(requestedStatus)) {
      throw httpError(400, 'Trạng thái yêu cầu duyệt không hợp lệ.', 'INVALID_STATUS');
    }
    const { limit, cursor } = parsePageOptions(req.query);
    const rawApprovalRows = await AdminApproval.list({ status: requestedStatus, limit, cursor });
    const approvalRows = await enrichApprovalPayloads(rawApprovalRows);
    const actorIds = [...new Set(approvalRows.flatMap((item) => (
      [item.requestedBy, item.executedBy].filter(Boolean)
    )))];
    let actorsById = new Map();
    if (actorIds.length > 0) {
      const { data: actors, error: actorError } = await supabase
        .from('nguoi_dung')
        .select('id, username')
        .in('id', actorIds);
      if (actorError) throw actorError;
      actorsById = new Map((actors || []).map((actor) => [actor.id, { username: actor.username }]));
    }
    const approvals = approvalRows.map((item) => toAdminApprovalDto({
      ...item,
      requester: actorsById.get(item.requestedBy) || null,
      executor: actorsById.get(item.executedBy) || null,
    }));
    return sendPage(
      res,
      approvals,
      limit,
      (item) => encodeCursor(item.createdAt, item.id),
    );
  } catch (err) {
    return handleRouteError(res, 'Lỗi lấy danh sách yêu cầu duyệt', err);
  }
});

// POST /api/admin/approvals/:id/approve - Second admin confirmation
router.post('/approvals/:id/approve', adminGuard, async (req, res) => {
  try {
    const id = assertUuid(req.params.id, 'ID yêu cầu duyệt');
    const state = await AdminApproval.addApproval(id, req.user);
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
    const id = assertUuid(req.params.id, 'ID yêu cầu duyệt');
    const reason = normalizeOptionalText(req.body?.reason, 'Lý do từ chối', 500) || '';
    const rejected = await AdminApproval.reject(id, req.user, reason);
    return res.json({ message: 'Đã từ chối yêu cầu thay đổi', approval: approvalSummary(rejected) });
  } catch (err) {
    handleRouteError(res, 'Lỗi từ chối yêu cầu duyệt', err);
  }
});

// GET /api/admin/users - List all users with activity monitoring
router.get(['/users', '/nguoi_dung'], adminGuard, async (req, res) => {
  try {
    const { limit, cursor } = parsePageOptions(req.query, { allowNullSort: true });
    let query = supabase
      .from('nguoi_dung')
      .select('id, username, role, diem_kinh_nghiem, cap_do, hoat_dong_cuoi_luc, phut_hoat_dong, bi_khoa, created_at')
      .order('hoat_dong_cuoi_luc', { ascending: false, nullsFirst: false })
      .order('id', { ascending: false });

    if (cursor) {
      query = cursor.sort === null
        ? query.is('hoat_dong_cuoi_luc', null).lt('id', cursor.id)
        : query.or(
          `hoat_dong_cuoi_luc.is.null,hoat_dong_cuoi_luc.lt.${cursor.sort},and(hoat_dong_cuoi_luc.eq.${cursor.sort},id.lt.${cursor.id})`
        );
    }
    const { data, error } = await query.limit(limit + 1);

    if (error) throw error;
    const users = (data || []).map(u => ({
      ...u,
      xp: u.diem_kinh_nghiem ?? 0,
      level: u.cap_do ?? 1,
      last_active_at: u.hoat_dong_cuoi_luc,
      active_minutes: u.phut_hoat_dong ?? 0,
      is_locked: u.bi_khoa ?? false,
      isOnline: Boolean(u.hoat_dong_cuoi_luc && new Date(u.hoat_dong_cuoi_luc) > new Date(Date.now() - 5 * 60 * 1000)),
      createdAt: u.created_at,
      diem_kinh_nghiem: undefined,
      cap_do: undefined,
      hoat_dong_cuoi_luc: undefined,
      phut_hoat_dong: undefined,
      bi_khoa: undefined,
      created_at: undefined,
    }));
    return sendPage(
      res,
      users,
      limit,
      (item) => encodeCursor(item.last_active_at, item.id),
    );
  } catch (err) {
    return handleRouteError(res, 'Lỗi lấy danh sách người dùng', err);
  }
});

// PATCH /api/admin/users/:id/lock - Toggle user lock status
router.patch(['/users/:id/lock', '/nguoi_dung/:id/lock'], adminGuard, async (req, res) => {
  try {
    const { id } = req.params;
    const { isLocked } = req.body;
    return await requestAdminChange(req, res, 'user.lock', { id, isLocked });
  } catch (err) {
    handleRouteError(res, 'Lỗi thay đổi trạng thái tài khoản', err);
  }
});

// GET /api/admin/users/:id - Get single user detail
router.get(['/users/:id', '/nguoi_dung/:id'], adminGuard, async (req, res) => {
  try {
    const id = assertTextId(req.params.id, 'ID người dùng');
    const user = await User.findById(id);
    if (!user) throw httpError(404, 'Không tìm thấy người dùng.', 'USER_NOT_FOUND');

    if (user.role === 'teacher') {
      const { data: classes, error } = await supabase
        .from('lop')
        .select('id, ten, ma_lop, khoi_id, created_at, thanh_vien_lop(count)')
        .eq('giao_vien_id', id)
        .order('created_at', { ascending: false });
      if (error) throw error;

      const normalizedClasses = (classes || []).map((classItem) => {
        const relationCount = Array.isArray(classItem.thanh_vien_lop)
          ? classItem.thanh_vien_lop[0]?.count
          : classItem.thanh_vien_lop?.count;
        return {
          id: classItem.id,
          name: classItem.ten,
          code: classItem.ma_lop,
          gradeLevelId: classItem.khoi_id,
          studentCount: Number(relationCount) || 0,
          createdAt: classItem.created_at,
        };
      });
      user.teacherStats = {
        classes: normalizedClasses,
        totalStudents: normalizedClasses.reduce((total, classItem) => total + classItem.studentCount, 0),
      };
    }

    return res.json(toAdminUserDto(user));
  } catch (err) {
    return handleRouteError(res, 'Lỗi lấy thông tin người dùng', err);
  }
});

// GET /api/admin/feedback - List all feedback
router.get(['/feedback', '/phan_hoi'], adminGuard, async (req, res) => {
  try {
    const { limit, cursor } = parsePageOptions(req.query);
    const kind = req.query.kind === undefined ? 'all' : String(req.query.kind);
    if (!ADMIN_FEEDBACK_KINDS.has(kind)) {
      throw httpError(400, 'Nhóm phản hồi không hợp lệ.', 'INVALID_FEEDBACK_KIND');
    }
    const [feedbackRows, unreadTeacherRequests] = await Promise.all([
      Feedback.findAll({ limit, cursor, kind }),
      Feedback.countPendingTeacherRegistrations(),
    ]);
    const feedback = feedbackRows.map(toAdminFeedbackDto);
    res.set('X-Unread-Teacher-Requests', String(unreadTeacherRequests));
    return sendPage(
      res,
      feedback,
      limit,
      (item) => encodeCursor(item.createdAt, item.id),
    );
  } catch (err) {
    return handleRouteError(res, 'Lỗi lấy phản hồi', err);
  }
});

// POST /api/admin/feedback/submit - Student submission
router.post('/feedback/submit', async (req, res) => {
  try {
    const { message, type = 'suggestion', imageUrl, name, email } = req.body || {};
    const normalizedMessage = normalizeRequiredText(message, 'Nội dung phản hồi', 5000);
    if (!PUBLIC_FEEDBACK_TYPES.has(type)) {
      throw httpError(400, 'Loại phản hồi không hợp lệ.', 'INVALID_FEEDBACK_TYPE');
    }
    const normalizedImageUrl = normalizeWebUrl(imageUrl, 'Ảnh đính kèm');
    const token = extractBearerToken(req);

    let userId = null;
    let username = 'Ẩn danh';

    if (token) {
      const { user } = await authenticateToken(token);
      userId = user.id;
      username = user.username;
    }

    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';

    if (trimmedName && username === 'Ẩn danh') {
      username = trimmedName;
    }

    const metadata = {};
    if (trimmedName) metadata.name = trimmedName;
    if (trimmedEmail) metadata.email = trimmedEmail;

    await Feedback.create({
      userId,
      username,
      message: normalizedMessage,
      type,
      imageUrl: normalizedImageUrl,
      metadata,
    });
    return res.status(201).json({ message: 'Gửi phản hồi thành công!' });
  } catch (err) {
    return handleRouteError(res, 'Lỗi gửi phản hồi', err);
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
