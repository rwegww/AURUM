import express from 'express';
import { supabase } from '../_lib/supabase.js';
import AdminApproval from '../_models/AdminApproval.js';
import { auth } from '../_middleware/auth.js';
import multer from 'multer';
import mammoth from 'mammoth';
import { parseExamContent } from '../_lib/examParser.js';

const MAX_EXAM_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const ALLOWED_EXAM_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const ALLOWED_EXAM_EXTENSIONS = new Set(['.pdf', '.doc', '.docx']);
const ALLOWED_POST_TYPES = new Set(['announcement', 'assignment', 'video']);
const ALLOWED_QUESTION_TYPES = new Set(['multiple_choice', 'true_false', 'short_answer', 'essay']);
const MAX_POST_CONTENT_LENGTH = 10_000;
const MAX_MEDIA_REFERENCE_LENGTH = 2_048;
const MAX_ASSIGNMENT_QUESTIONS = 200;
const MAX_SCHEDULE_TITLE_LENGTH = 200;
const MAX_MEETING_URL_LENGTH = 2_048;
const MAX_ANSWER_PAYLOAD_LENGTH = 100_000;
const DEFAULT_CLASS_POST_PAGE_SIZE = 20;
const MAX_CLASS_POST_PAGE_SIZE = 50;
const DEFAULT_CLASS_MEMBER_PREVIEW_SIZE = 20;
const DEFAULT_CLASS_SCHEDULE_PREVIEW_SIZE = 6;
const CLASS_POST_SELECT = [
  'id',
  'lop_id',
  'tac_gia_id',
  'type',
  'noi_dung',
  'media_url',
  'han_nop',
  'hoc_sinh_nhan_id',
  'cau_hoi',
  'created_at',
  'author:tac_gia_id(username)',
  'target:hoc_sinh_nhan_id(username)',
].join(',');

const getFileExtension = (filename = '') => {
  const dotIndex = filename.lastIndexOf('.');
  return dotIndex >= 0 ? filename.slice(dotIndex).toLowerCase() : '';
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_EXAM_FILE_SIZE_BYTES },
  fileFilter: (_req, file, callback) => {
    const extension = getFileExtension(file.originalname);
    if (ALLOWED_EXAM_MIME_TYPES.has(file.mimetype) || ALLOWED_EXAM_EXTENSIONS.has(extension)) {
      return callback(null, true);
    }
    return callback(new Error('UNSUPPORTED_EXAM_FILE_TYPE'));
  },
});

const parseExamUpload = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'Tệp quá lớn. Giới hạn tối đa là 20MB.' });
    }

    if (err.message === 'UNSUPPORTED_EXAM_FILE_TYPE') {
      return res.status(400).json({ error: 'Chỉ hỗ trợ tệp PDF, DOC hoặc DOCX.' });
    }

    return res.status(400).json({ error: 'Không thể tải tệp lên.', details: err.message });
  });
};

const router = express.Router();

const canManageClasses = (user) => user?.role === 'teacher' || user?.role === 'admin';
const canUseStudentClassFeatures = (user) => user?.role === 'student';

const normalizeCreateClassInput = ({ name, description, khoi_id }) => {
  const normalizedName = typeof name === 'string' ? name.trim() : '';
  const normalizedDescription = typeof description === 'string' ? description.trim() : '';
  const gradeLevelId = Number(khoi_id);

  if (!normalizedName || normalizedName.length > 200) {
    const error = new Error('Tên lớp phải có từ 1 đến 200 ký tự.');
    error.status = 400;
    throw error;
  }
  if (description !== undefined && typeof description !== 'string') {
    const error = new Error('Mô tả lớp phải là chuỗi.');
    error.status = 400;
    throw error;
  }
  if (normalizedDescription.length > 2000) {
    const error = new Error('Mô tả lớp không được vượt quá 2000 ký tự.');
    error.status = 400;
    throw error;
  }
  if (!Number.isInteger(gradeLevelId) || gradeLevelId < 6 || gradeLevelId > 12) {
    const error = new Error('Khối lớp phải là số nguyên từ 6 đến 12.');
    error.status = 400;
    throw error;
  }

  return {
    name: normalizedName,
    description: normalizedDescription || null,
    khoi_id: gradeLevelId,
  };
};

const httpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const parseClassPostPagination = (query) => {
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? DEFAULT_CLASS_POST_PAGE_SIZE : Number(query.limit);
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > MAX_CLASS_POST_PAGE_SIZE) {
    throw httpError(400, `page phải từ 1 và limit phải từ 1 đến ${MAX_CLASS_POST_PAGE_SIZE}.`);
  }
  const from = (page - 1) * limit;
  return { page, limit, from, to: from + limit - 1 };
};

const normalizeOptionalText = (value, fieldLabel, maxLength) => {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') {
    throw httpError(400, `${fieldLabel} phải là chuỗi.`);
  }

  const normalized = value.trim();
  if (!normalized) return null;
  if (normalized.length > maxLength) {
    throw httpError(400, `${fieldLabel} không được vượt quá ${maxLength} ký tự.`);
  }
  return normalized;
};

const normalizeDateTime = (value, fieldLabel, { required = false } = {}) => {
  if (value === undefined || value === null || value === '') {
    if (required) throw httpError(400, `${fieldLabel} là bắt buộc.`);
    return null;
  }
  if (typeof value !== 'string') {
    throw httpError(400, `${fieldLabel} không hợp lệ.`);
  }

  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) {
    throw httpError(400, `${fieldLabel} không hợp lệ.`);
  }
  return new Date(timestamp).toISOString();
};

const isHttpUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const normalizePostInput = (body = {}) => {
  const type = typeof body.type === 'string' ? body.type.trim() : '';
  if (!ALLOWED_POST_TYPES.has(type)) {
    throw httpError(400, 'Loại bài đăng không hợp lệ.');
  }

  const content = typeof body.content === 'string' ? body.content.trim() : '';
  if (!content) throw httpError(400, 'Nội dung bài đăng là bắt buộc.');
  if (content.length > MAX_POST_CONTENT_LENGTH) {
    throw httpError(400, `Nội dung bài đăng không được vượt quá ${MAX_POST_CONTENT_LENGTH} ký tự.`);
  }

  const mediaUrl = normalizeOptionalText(body.media_url, 'Liên kết học liệu', MAX_MEDIA_REFERENCE_LENGTH);
  if (type === 'video' && (!mediaUrl || !isHttpUrl(mediaUrl))) {
    throw httpError(400, 'Bài đăng video cần một đường dẫn http hoặc https hợp lệ.');
  }

  const deadline = type === 'assignment'
    ? normalizeDateTime(body.deadline, 'Hạn nộp')
    : null;
  if (deadline && Date.parse(deadline) <= Date.now()) {
    throw httpError(400, 'Hạn nộp phải ở thời điểm tương lai.');
  }

  const targetStudentId = normalizeOptionalText(body.hoc_sinh_nhan_id, 'ID học sinh nhận', 128);
  const questions = body.questions ?? [];
  if (!Array.isArray(questions)) {
    throw httpError(400, 'Danh sách câu hỏi không hợp lệ.');
  }
  if (questions.length > MAX_ASSIGNMENT_QUESTIONS) {
    throw httpError(400, `Mỗi bài tập chỉ được có tối đa ${MAX_ASSIGNMENT_QUESTIONS} câu hỏi.`);
  }
  if (type !== 'assignment' && questions.length > 0) {
    throw httpError(400, 'Chỉ bài tập mới được chứa câu hỏi.');
  }
  if (questions.some((question) => (
    !question
    || typeof question !== 'object'
    || Array.isArray(question)
    || !ALLOWED_QUESTION_TYPES.has(question.type || 'multiple_choice')
  ))) {
    throw httpError(400, 'Danh sách câu hỏi chứa phần tử không hợp lệ.');
  }

  return {
    type,
    content,
    media_url: mediaUrl,
    deadline,
    hoc_sinh_nhan_id: targetStudentId,
    questions: type === 'assignment' ? questions : [],
  };
};

const normalizeScheduleInput = (body = {}) => {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (!title) throw httpError(400, 'Tên lịch học là bắt buộc.');
  if (title.length > MAX_SCHEDULE_TITLE_LENGTH) {
    throw httpError(400, `Tên lịch học không được vượt quá ${MAX_SCHEDULE_TITLE_LENGTH} ký tự.`);
  }

  const startTime = normalizeDateTime(body.start_time, 'Thời gian bắt đầu', { required: true });
  const endTime = normalizeDateTime(body.end_time, 'Thời gian kết thúc');
  if (endTime && Date.parse(endTime) <= Date.parse(startTime)) {
    throw httpError(400, 'Thời gian kết thúc phải sau thời gian bắt đầu.');
  }

  const meetUrl = normalizeOptionalText(body.meet_url, 'Liên kết buổi học', MAX_MEETING_URL_LENGTH);
  if (meetUrl && !isHttpUrl(meetUrl)) {
    throw httpError(400, 'Liên kết buổi học phải dùng giao thức http hoặc https.');
  }

  return {
    title,
    start_time: startTime,
    end_time: endTime,
    meet_url: meetUrl,
  };
};

const extractPdfText = async (buffer) => {
  const { PDFParse } = await import('pdf-parse');
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text || '';
  } finally {
    await parser.destroy();
  }
};

const sendPendingAdminApproval = (res, request, alreadyApproved = false) => res.status(202).json({
  message: alreadyApproved
    ? 'Yêu cầu này đang chờ quản trị viên còn lại xác nhận.'
    : 'Đã tạo yêu cầu duyệt. Cần quản trị viên còn lại xác nhận để thực thi.',
  requiresSecondAdminApproval: true,
  approvalRequest: request,
});

const requestAdminApprovalOnly = async (req, res, actionKey, actionLabel, payload) => {
  const requestHash = AdminApproval.createRequestHash(actionKey, payload);
  const existing = await AdminApproval.findPendingByHash(requestHash);
  if (existing) {
    return sendPendingAdminApproval(res, existing, existing.approverIds.includes(req.user.id));
  }

  const state = await AdminApproval.createOrApprove({
    actionKey,
    actionLabel,
    payload,
    adminUser: req.user,
  });

  return sendPendingAdminApproval(res, state.request, state.alreadyApproved);
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

const normalizeTextAnswer = (value) => String(value ?? '')
  .trim()
  .toLowerCase()
  .replace(/\s+/g, ' ');

const getAnswerFromCollection = (answers, index) => {
  if (!answers) return undefined;
  return answers[index] ?? answers[String(index)];
};

const getCorrectMultipleChoiceIndex = (question) => {
  if (Number.isInteger(question?.correct_index)) return question.correct_index;

  const correctAnswer = question?.correct_answer ?? question?.answer ?? question?.dap_an;
  if (typeof correctAnswer === 'number' && Number.isInteger(correctAnswer)) return correctAnswer;
  if (typeof correctAnswer !== 'string') return null;

  const trimmed = correctAnswer.trim();
  const numericTrimmed = Number(trimmed);
  if (Number.isInteger(numericTrimmed)) return numericTrimmed;
  if (/^[A-D]$/i.test(trimmed)) return trimmed.toUpperCase().charCodeAt(0) - 65;

  const options = Array.isArray(question.options)
    ? question.options
    : (question.options ? Object.values(question.options) : []);
  const normalizedCorrect = normalizeTextAnswer(trimmed);
  const optionIndex = options.findIndex((option) => normalizeTextAnswer(option) === normalizedCorrect);
  return optionIndex >= 0 ? optionIndex : null;
};

const isTrueFalseComplete = (expected, actual) => {
  if (!expected || typeof expected !== 'object' || !actual || typeof actual !== 'object') return false;
  const expectedKeys = Object.keys(expected);
  if (expectedKeys.length === 0) return false;
  if (!expectedKeys.every((key) => typeof expected[key] === 'boolean')) return false;
  return expectedKeys.every((key) => typeof actual[key] === 'boolean');
};

const isTrueFalseCorrect = (expected, actual) => (
  isTrueFalseComplete(expected, actual)
  && Object.keys(expected).every((key) => Boolean(actual[key]) === Boolean(expected[key]))
);

const computeAutoGrade = (questions = [], answers = {}) => {
  if (!Array.isArray(questions) || questions.length === 0) {
    return { score: null, correct: 0, total: 0, needsManualReview: true };
  }

  let correct = 0;
  let total = 0;
  let needsManualReview = false;

  questions.forEach((question, index) => {
    const type = question?.type || 'multiple_choice';
    const answer = getAnswerFromCollection(answers, index);

    if (type === 'multiple_choice') {
      const correctIndex = getCorrectMultipleChoiceIndex(question);
      if (correctIndex === null) {
        needsManualReview = true;
        return;
      }

      total += 1;
      if (Number(answer) === correctIndex) correct += 1;
      return;
    }

    if (type === 'true_false') {
      const expected = question.correct_answer ?? question.correct_answers;
      if (!isTrueFalseComplete(expected, answer)) {
        needsManualReview = true;
        return;
      }

      total += 1;
      if (isTrueFalseCorrect(expected, answer)) correct += 1;
      return;
    }

    needsManualReview = true;
  });

  if (total === 0) {
    return { score: null, correct: 0, total: 0, needsManualReview: true };
  }

  const score = Math.round((correct / total) * 100) / 10;
  return { score, correct, total, needsManualReview };
};

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
    res.status(403).json({ error: 'Chỉ giáo viên mới có quyền thực hiện thao tác này' });
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
    res.status(404).json({ error: 'Không tìm thấy lớp học' });
    return null;
  }

  if (user.role !== 'admin' && classData.giao_vien_id !== user.id) {
    res.status(403).json({ error: 'Bạn không có quyền quản lý lớp học này' });
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
    res.status(404).json({ error: 'Không tìm thấy lớp học.' });
    return null;
  }

  if (user.role === 'admin' || classData.giao_vien_id === user.id) {
    return classData;
  }

  if (user.role === 'teacher') {
    res.status(403).json({ error: 'Bạn không có quyền truy cập lớp học này.' });
    return null;
  }

  if (!(await isClassMember(classId, user.id))) {
    res.status(403).json({ error: 'Bạn chưa tham gia lớp học này.' });
    return null;
  }

  return classData;
};

const fetchAllRows = async (createQuery, pageSize = 1000) => {
  const rows = [];
  let from = 0;

  while (true) {
    const { data, error } = await createQuery(from, from + pageSize - 1);
    if (error) throw error;

    const page = data || [];
    rows.push(...page);
    if (page.length < pageSize) return rows;
    from += pageSize;
  }
};

const fetchClassMembers = async (classId, { limit } = {}) => {
  let query = supabase
    .from('thanh_vien_lop')
    .select('student:hoc_sinh_id(id, username, hoat_dong_cuoi_luc, phut_hoat_dong)')
    .eq('lop_id', classId)
    .order('tham_gia_luc', { ascending: false });

  if (limit) query = query.range(0, limit);
  const { data, error } = await query;
  if (error) throw error;

  const rows = data || [];
  const hasMore = Boolean(limit && rows.length > limit);
  const visibleRows = limit ? rows.slice(0, limit) : rows;
  return {
    items: visibleRows.map(({ student }) => ({
      ...student,
      last_active_at: student?.hoat_dong_cuoi_luc,
      active_minutes: student?.phut_hoat_dong ?? 0,
      isOnline: Boolean(student?.hoat_dong_cuoi_luc && new Date(student.hoat_dong_cuoi_luc) > new Date(Date.now() - 5 * 60 * 1000)),
      hoat_dong_cuoi_luc: undefined,
      phut_hoat_dong: undefined,
    })),
    hasMore,
  };
};

const fetchClassSchedules = async (classId, { upcomingOnly = false, limit } = {}) => {
  let query = supabase
    .from('lich_lop')
    .select('id,lop_id,tieu_de,bat_dau_luc,ket_thuc_luc,meet_url,created_at')
    .eq('lop_id', classId)
    .order('bat_dau_luc', { ascending: true });

  if (upcomingOnly) query = query.gte('bat_dau_luc', new Date().toISOString());
  if (limit) query = query.range(0, limit);
  const { data, error } = await query;
  if (error) throw error;

  const rows = data || [];
  const hasMore = Boolean(limit && rows.length > limit);
  return {
    items: (limit ? rows.slice(0, limit) : rows).map(normalizeSchedule),
    hasMore,
  };
};

const fetchClassPosts = async (classId, user, pagination, { includeCount = true } = {}) => {
  let query = supabase
    .from('bai_dang_lop')
    .select(CLASS_POST_SELECT, includeCount ? { count: 'exact' } : undefined)
    .eq('lop_id', classId)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false });

  if (user.role !== 'teacher' && user.role !== 'admin') {
    query = query.or(`hoc_sinh_nhan_id.is.null,hoc_sinh_nhan_id.eq.${user.id},tac_gia_id.eq.${user.id}`);
  }

  const rangeEnd = includeCount ? pagination.to : pagination.to + 1;
  const { data, error, count } = await query.range(pagination.from, rangeEnd);
  if (error) throw error;

  let posts = data || [];
  const hasMore = includeCount
    ? pagination.page * pagination.limit < (Number(count) || 0)
    : posts.length > pagination.limit;
  if (!includeCount && hasMore) posts = posts.slice(0, pagination.limit);

  const assignmentPostIds = posts
    .filter((post) => post.type === 'assignment')
    .map((post) => post.id);
  const lessonIds = [...new Set(posts
    .filter((post) => post.type === 'assignment' && post.media_url && !isHttpUrl(post.media_url))
    .map((post) => post.media_url))];

  const submissionsPromise = user.role === 'student' && assignmentPostIds.length > 0
    ? supabase
      .from('bai_nop')
      .select('bai_dang_id, diem, cau_tra_loi, status, phan_hoi_giao_vien, nop_luc')
      .eq('hoc_sinh_id', user.id)
      .in('bai_dang_id', assignmentPostIds)
    : Promise.resolve({ data: [], error: null });
  const lessonsPromise = lessonIds.length > 0
    ? supabase
      .from('bai_hoc')
      .select('id, khoi_id')
      .in('id', lessonIds)
    : Promise.resolve({ data: [], error: null });

  const [submissionsResult, lessonsResult] = await Promise.all([submissionsPromise, lessonsPromise]);
  if (submissionsResult.error) throw submissionsResult.error;
  if (lessonsResult.error) throw lessonsResult.error;

  const submissionMap = new Map((submissionsResult.data || []).map((submission) => [
    submission.bai_dang_id,
    normalizeSubmission(submission),
  ]));
  const lessonMap = new Map((lessonsResult.data || []).map((lesson) => [lesson.id, normalizeLessonRef(lesson)]));

  posts = posts.map((post) => ({
    ...post,
    ...(user.role === 'student' && post.type === 'assignment' ? {
      is_completed: submissionMap.has(post.id),
      user_submission: submissionMap.get(post.id) || null,
    } : {}),
    ...(lessonMap.has(post.media_url) ? { lesson: lessonMap.get(post.media_url) } : {}),
  }));

  return {
    items: posts.map(normalizePost),
    total: includeCount ? Number(count) || 0 : null,
    hasMore,
  };
};

const fetchClassOverviewData = async (classId, user, requestedSections = new Set(['posts', 'schedules', 'members'])) => {
  const tasks = {};
  if (requestedSections.has('posts')) {
    tasks.posts = fetchClassPosts(
      classId,
      user,
      parseClassPostPagination({ page: 1, limit: DEFAULT_CLASS_POST_PAGE_SIZE }),
      { includeCount: false },
    );
  }
  if (requestedSections.has('schedules')) {
    tasks.schedules = fetchClassSchedules(classId, {
      upcomingOnly: true,
      limit: DEFAULT_CLASS_SCHEDULE_PREVIEW_SIZE,
    });
  }
  if (requestedSections.has('members')) {
    tasks.members = fetchClassMembers(classId, { limit: DEFAULT_CLASS_MEMBER_PREVIEW_SIZE });
  }

  const entries = Object.entries(tasks);
  const values = await Promise.all(entries.map(([, task]) => task));
  const result = Object.fromEntries(entries.map(([key], index) => [key, values[index]]));

  return {
    posts: result.posts?.items || [],
    postsHasMore: result.posts?.hasMore || false,
    schedules: result.schedules?.items || [],
    schedulesHasMore: result.schedules?.hasMore || false,
    members: result.members?.items || [],
    membersHasMore: result.members?.hasMore || false,
  };
};

const createClassCode = () => Math.random().toString(36).slice(2, 8).toUpperCase().padEnd(6, '0');

const insertClassWithUniqueCode = async (classInput, maxAttempts = 5) => {
  let lastError;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const { data, error } = await supabase
      .from('lop')
      .insert([{ ...classInput, ma_lop: createClassCode() }])
      .select()
      .single();

    if (!error) return data;
    lastError = error;
    if (error.code !== '23505') throw error;
  }

  throw lastError || new Error('Không thể tạo mã lớp duy nhất.');
};



// Parse exam files for 2025 format
router.post('/parse-exam-file', auth, parseExamUpload, async (req, res) => {
  try {
    if (!requireTeacherOrAdmin(req, res)) return;
    if (!req.file) return res.status(400).json({ error: 'Không tìm thấy tệp' });

    let text = '';
    let html = '';
    try {
      if (req.file.mimetype === 'application/pdf' || getFileExtension(req.file.originalname) === '.pdf') {
        text = await extractPdfText(req.file.buffer);
      } else {
        const [rawData, htmlData] = await Promise.all([
          mammoth.extractRawText({ buffer: req.file.buffer }),
          mammoth.convertToHtml({ buffer: req.file.buffer }),
        ]);
        text = rawData.value;
        html = htmlData.value;
      }
    } catch (parseError) {
      console.warn('Không thể đọc tệp đề thi:', parseError.message);
      return res.status(422).json({ error: 'Không thể đọc nội dung tệp. Vui lòng kiểm tra lại tệp PDF, DOC hoặc DOCX.' });
    }

    if (!text.trim()) {
      return res.status(422).json({ error: 'Tệp không có nội dung văn bản để tạo câu hỏi.' });
    }

    const questions = parseExamContent({ text, html });

    if (questions.length === 0) {
      return res.status(422).json({ error: 'Không tìm thấy câu hỏi theo định dạng được hỗ trợ trong tệp.' });
    }

    res.json(questions);
  } catch (err) {
    console.error('Error parsing exam file:', err);
    res.status(err.status || 500).json({
      error: err.status ? err.message : 'Không thể phân tích tệp đề thi.',
    });
  }
});

// Get all lop for a teacher or student
router.get('/', auth, async (req, res) => {
  try {
    const startedAt = Date.now();
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

    if (req.query.includeOverview === 'first' && formattedData.length > 0) {
      const overview = await fetchClassOverviewData(formattedData[0].id, req.user);
      res.set('Server-Timing', `class-initial;dur=${Date.now() - startedAt}`);
      return res.json({
        classes: formattedData,
        selectedClassId: formattedData[0].id,
        overview,
      });
    }

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
    // This is a bit heavy for a single query if many lop,    // but for now we fetch recent posts count.
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
       return res.status(403).json({ error: 'Chỉ dành cho giáo viên' });
    }

    // Admins inspect the same global class list returned by GET /api/classes.
    const lop = await fetchAllRows((from, to) => {
      let query = supabase
        .from('lop')
        .select('id')
        .order('id', { ascending: true });
      if (req.user.role === 'teacher') query = query.eq('giao_vien_id', userId);
      return query.range(from, to);
    });
    const classIds = lop.map(c => c.id);

    if (classIds.length === 0) {
      return res.json({ total_students: 0, active_assignments: 0 });
    }

    // 2. Count unique students
    const members = await fetchAllRows((from, to) => supabase
      .from('thanh_vien_lop')
      .select('lop_id, hoc_sinh_id')
      .in('lop_id', classIds)
      .order('hoc_sinh_id', { ascending: true })
      .order('lop_id', { ascending: true })
      .range(from, to));
    const uniqueStudents = new Set(members.map(m => m.hoc_sinh_id));

    // 3. Count active assignments
    const { count: assignmentCount, error: assignmentError } = await supabase
      .from('bai_dang_lop')
      .select('*', { count: 'exact', head: true })
      .in('lop_id', classIds)
      .eq('type', 'assignment')
      .or(`han_nop.is.null,han_nop.gt.${new Date().toISOString()}`);

    if (assignmentError) throw assignmentError;

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

    const { name, description, khoi_id } = normalizeCreateClassInput({
      name: req.body?.name,
      description: req.body?.description,
      khoi_id: req.body?.khoi_id ?? req.body?.gradeLevelId,
    });
    const giao_vien_id = req.user.id;

    if (req.user.role === 'admin') {
      return await requestAdminApprovalOnly(req, res, 'class.create', 'Tạo lớp học', {
        name,
        description,
        khoi_id,
        giao_vien_id,
      });
    }

    const data = await insertClassWithUniqueCode({
      ten: name,
      khoi_id,
      mo_ta: description,
      giao_vien_id,
    });
    res.status(201).json(normalizeClass(data));
  } catch (err) {
    res.status(err.status || 500).json({ error: err.status ? err.message : 'Không thể tạo lớp học.' });
  }
});

// Join a class (Student)
router.post('/join', auth, async (req, res) => {
  try {
    if (!canUseStudentClassFeatures(req.user)) {
      return res.status(403).json({ error: 'Chỉ học sinh mới có thể tham gia lớp học.' });
    }

    const code = typeof req.body?.code === 'string' ? req.body.code.trim().toUpperCase() : '';
    if (!/^[A-Z0-9]{6}$/.test(code)) {
      return res.status(400).json({ error: 'Mã lớp phải gồm đúng 6 chữ cái hoặc chữ số.' });
    }
    const hoc_sinh_id = req.user.id;

    const { data: classData, error: classErr } = await supabase
      .from('lop')
      .select('id, ten, giao_vien_id')
      .eq('ma_lop', code)
      .maybeSingle();

    if (classErr) throw classErr;
    if (!classData) return res.status(404).json({ error: 'Mã lớp không hợp lệ' });

    const { error: joinErr } = await supabase
      .from('thanh_vien_lop')
      .insert([{ lop_id: classData.id, hoc_sinh_id }]);

    if (joinErr) {
        if (joinErr.code === '23505') return res.status(409).json({ error: 'Bạn đã tham gia lớp này rồi' });
        throw joinErr;
    }


    res.json({ message: 'Tham gia lớp thành công', lop_id: classData.id });
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
    if (!data) return res.status(404).json({ error: 'Không tìm thấy lớp học.' });

    res.json({
      ...normalizeClass(data),
      student_count: data.student_count?.[0]?.count || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a class (Teacher owner or Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!requireTeacherOrAdmin(req, res)) return;

    const { id } = req.params;
    const classData = await ensureClassOwner(id, req.user, res);
    if (!classData) return;

    const { error } = await supabase
      .from('lop')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Đã xóa lớp học thành công.' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Không thể xóa lớp học.' });
  }
});

// Get class members (Students)
router.get('/:id/members', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!(await ensureClassAccess(id, req.user, res))) return;
    const members = await fetchClassMembers(id);
    res.json(members.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Load the student class screen in one authenticated request.
router.get('/:id/overview', auth, async (req, res) => {
  try {
    const startedAt = Date.now();
    const { id } = req.params;
    if (!(await ensureClassAccess(id, req.user, res))) return;

    const requestedSections = typeof req.query.include === 'string'
      ? new Set(req.query.include.split(',').map((value) => value.trim()).filter(Boolean))
      : new Set(['posts', 'schedules', 'members']);
    const allowedSections = new Set(['posts', 'schedules', 'members']);
    if ([...requestedSections].some((section) => !allowedSections.has(section))) {
      return res.status(400).json({ error: 'Nhóm dữ liệu tổng quan không hợp lệ.' });
    }

    const overview = await fetchClassOverviewData(id, req.user, requestedSections);
    res.set('Server-Timing', `class-overview;dur=${Date.now() - startedAt}`);
    return res.json(overview);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
});

// Get class posts (messages, assignments, videos)
router.get('/:id/posts', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!(await ensureClassAccess(id, req.user, res))) return;
    const pagination = parseClassPostPagination(req.query);
    const posts = await fetchClassPosts(id, req.user, pagination);
    res.set('X-Total-Count', String(posts.total));
    res.set('X-Has-More', posts.hasMore ? 'true' : 'false');
    res.json(posts.items);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// Send a private student message to the class teacher.
router.post('/:id/messages', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!canUseStudentClassFeatures(req.user)) {
      return res.status(403).json({ error: 'Chỉ học sinh mới có thể gửi tin nhắn cho giáo viên.' });
    }

    const classData = await ensureClassAccess(id, req.user, res);
    if (!classData) return;

    const content = typeof req.body?.content === 'string' ? req.body.content.trim() : '';
    if (!content) {
      return res.status(400).json({ error: 'Vui lòng nhập nội dung tin nhắn.' });
    }
    if (content.length > 2000) {
      return res.status(400).json({ error: 'Tin nhắn tối đa 2000 ký tự.' });
    }

    const { data, error } = await supabase
      .from('bai_dang_lop')
      .insert([{
        lop_id: id,
        tac_gia_id: req.user.id,
        type: 'announcement',
        noi_dung: content,
        media_url: null,
        han_nop: null,
        hoc_sinh_nhan_id: classData.giao_vien_id,
        cau_hoi: [],
      }])
      .select('*, author:tac_gia_id(username), target:hoc_sinh_nhan_id(username)')
      .single();

    if (error) throw error;
    res.status(201).json(normalizePost(data));
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

    const {
      type,
      content,
      media_url,
      deadline,
      hoc_sinh_nhan_id,
      questions,
    } = normalizePostInput(req.body || {});
    const tac_gia_id = req.user.id;

    if (hoc_sinh_nhan_id) {
      const { data: membership, error: membershipError } = await supabase
        .from('thanh_vien_lop')
        .select('lop_id')
        .eq('lop_id', id)
        .eq('hoc_sinh_id', hoc_sinh_nhan_id)
        .maybeSingle();

      if (membershipError) throw membershipError;
      if (!membership) {
        return res.status(400).json({ error: 'Học sinh nhận không thuộc lớp học này.' });
      }
    }

    const insertData = {
      lop_id: id,
      tac_gia_id,
      type,
      noi_dung: content,
      media_url,
      han_nop: deadline,
      hoc_sinh_nhan_id,
      cau_hoi: questions,
    };

    if (req.user.role === 'admin') {
      return await requestAdminApprovalOnly(req, res, 'class.post.create', 'Tạo bài đăng lớp học', { insertData });
    }

    const { data, error } = await supabase
      .from('bai_dang_lop')
      .insert([insertData])
      .select('*, author:tac_gia_id(username)')
      .single();

    if (error) throw error;
    res.status(201).json(normalizePost(data));
  } catch (err) {
    res.status(err.status || 500).json({ error: err.status ? err.message : 'Không thể tạo bài đăng.' });
  }
});

// Get class schedules
router.get('/:id/schedules', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!(await ensureClassAccess(id, req.user, res))) return;
    const schedules = await fetchClassSchedules(id);
    res.json(schedules.items);
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

    const { title, start_time, end_time, meet_url } = normalizeScheduleInput(req.body || {});
    const insertData = { lop_id: id, tieu_de: title, bat_dau_luc: start_time, ket_thuc_luc: end_time, meet_url };

    if (req.user.role === 'admin') {
      return await requestAdminApprovalOnly(req, res, 'class.schedule.create', 'Tạo lịch lớp học', { insertData });
    }

    const { data, error } = await supabase
      .from('lich_lop')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(normalizeSchedule(data));
  } catch (err) {
    res.status(err.status || 500).json({ error: err.status ? err.message : 'Không thể tạo lịch học.' });
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
    const { data: post, error: postError } = await supabase
      .from('bai_dang_lop')
      .select('lop_id, type')
      .eq('id', postId)
      .single();
    if (postError?.code === 'PGRST116' || !post) {
      return res.status(404).json({ error: 'Không tìm thấy bài tập' });
    }
    if (postError) throw postError;
    if (post.type !== 'assignment') {
      return res.status(400).json({ error: 'Bài đăng này không phải bài tập.' });
    }
    if (!(await ensureClassOwner(post.lop_id, req.user, res))) return;

    // Get all class members
    const { data: members, error: memberError } = await supabase
      .from('thanh_vien_lop')
      .select('student:hoc_sinh_id(id, username)')
      .eq('lop_id', post.lop_id);
    if (memberError) throw memberError;
    // Get submissions
    const { data: submissions, error: submissionError } = await supabase
      .from('bai_nop')
      .select('*')
      .eq('bai_dang_id', postId);
    if (submissionError) throw submissionError;

    // Map together
    const submissionMap = new Map((submissions || []).map((submission) => [submission.hoc_sinh_id, submission]));
    const progress = (members || []).filter((member) => member.student).map(m => {
      const sub = submissionMap.get(m.student.id);
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
    if (!canUseStudentClassFeatures(req.user)) {
      return res.status(403).json({ error: 'Chỉ học sinh mới có thể nộp bài.' });
    }

    const { postId } = req.params;
    const { answers } = req.body;
    const hoc_sinh_id = req.user.id;

    const { data: post, error: postError } = await supabase
      .from('bai_dang_lop')
      .select('lop_id, type, hoc_sinh_nhan_id, cau_hoi, han_nop')
      .eq('id', postId)
      .single();
    if (postError || !post) return res.status(404).json({ error: 'Không tìm thấy bài tập' });
    if (post.type !== 'assignment') {
      return res.status(400).json({ error: 'Bài đăng này không phải bài tập.' });
    }
    if (post.hoc_sinh_nhan_id && post.hoc_sinh_nhan_id !== hoc_sinh_id) {
      return res.status(403).json({ error: 'Bài tập này không được giao cho bạn.' });
    }
    if (post.han_nop && Number.isFinite(Date.parse(post.han_nop)) && Date.parse(post.han_nop) <= Date.now()) {
      return res.status(409).json({ error: 'Bài tập đã hết hạn nộp.' });
    }

    const { data: membership, error: membershipError } = await supabase
      .from('thanh_vien_lop')
      .select('lop_id')
      .eq('lop_id', post.lop_id)
      .eq('hoc_sinh_id', hoc_sinh_id)
      .maybeSingle();

    if (membershipError) throw membershipError;
    if (!membership) return res.status(403).json({ error: 'Bạn chưa tham gia lớp học này' });

    if (answers !== undefined && (!answers || typeof answers !== 'object')) {
      return res.status(400).json({ error: 'Câu trả lời không hợp lệ.' });
    }
    const safeAnswers = answers || {};
    if (JSON.stringify(safeAnswers).length > MAX_ANSWER_PAYLOAD_LENGTH) {
      return res.status(413).json({ error: 'Nội dung câu trả lời quá lớn.' });
    }
    const autoGrade = computeAutoGrade(post.cau_hoi, safeAnswers);
    const hasFinalAutoScore = !autoGrade.needsManualReview && autoGrade.score !== null;

    const { data, error } = await supabase
      .from('bai_nop')
      .insert([{
        bai_dang_id: postId,
        hoc_sinh_id,
        status: hasFinalAutoScore ? 'graded' : 'submitted',
        cau_tra_loi: safeAnswers,
        diem: hasFinalAutoScore ? autoGrade.score : null,
        phan_hoi_giao_vien: null
      }])
      .select()
      .single();

    if (error?.code === '23505') {
      return res.status(409).json({ error: 'Bạn đã nộp bài tập này rồi.' });
    }
    if (error) throw error;

    res.json({
      ...normalizeSubmission(data),
      auto_grade: autoGrade,
    });
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
      return res.status(403).json({ error: 'Chỉ giáo viên mới có quyền chấm điểm' });
    }

    if (score === undefined || score === null || (typeof score === 'string' && !score.trim())) {
      return res.status(400).json({ error: 'Vui lòng nhập điểm từ 0 đến 10.' });
    }
    const numericScore = Number(score);
    if (!Number.isFinite(numericScore) || numericScore < 0 || numericScore > 10) {
      return res.status(400).json({ error: 'Điểm phải là một số từ 0 đến 10.' });
    }

    if (phan_hoi !== undefined && phan_hoi !== null && typeof phan_hoi !== 'string') {
      return res.status(400).json({ error: 'Phản hồi của giáo viên phải là chuỗi.' });
    }
    const trimmedFeedback = typeof phan_hoi === 'string' ? phan_hoi.trim() : '';
    if (trimmedFeedback.length > 1500) {
      return res.status(400).json({ error: 'Phản hồi không được vượt quá 1500 ký tự.' });
    }

    const { data: post, error: postError } = await supabase
      .from('bai_dang_lop')
      .select('lop_id, type')
      .eq('id', postId)
      .single();
    if (postError || !post) return res.status(404).json({ error: 'Không tìm thấy bài tập' });
    if (post.type !== 'assignment') {
      return res.status(400).json({ error: 'Bài đăng này không phải bài tập.' });
    }
    if (!(await ensureClassOwner(post.lop_id, req.user, res))) return;

    const updateData = {
      diem: Math.round(numericScore * 10) / 10,
      phan_hoi_giao_vien: trimmedFeedback || null,
      status: 'graded'
    };

    if (req.user.role === 'admin') {
      return await requestAdminApprovalOnly(req, res, 'assignment.grade', 'Chấm bài tập', {
        postId,
        studentId,
        updateData,
      });
    }

    const { data, error } = await supabase
      .from('bai_nop')
      .update(updateData)
      .eq('bai_dang_id', postId)
      .eq('hoc_sinh_id', studentId)
      .select()
      .single();

    if (error?.code === 'PGRST116' || !data) {
      return res.status(404).json({ error: 'Học sinh chưa nộp bài tập này.' });
    }
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
    if (!requireTeacherOrAdmin(req, res)) return;

    const { data: post, error: postError } = await supabase
      .from('bai_dang_lop')
      .select('tac_gia_id, lop_id, type')
      .eq('id', postId)
      .single();
    if (postError?.code === 'PGRST116' || !post) {
      return res.status(404).json({ error: 'Không tìm thấy bài tập' });
    }
    if (postError) throw postError;
    if (post.type !== 'assignment') {
      return res.status(400).json({ error: 'Bài đăng này không phải bài tập.' });
    }

    const ownsClass = req.user.role === 'admin' || !!(await ensureClassOwner(post.lop_id, req.user, res));
    if (res.headersSent) return;
    if (post.tac_gia_id !== req.user.id && !ownsClass) {
      return res.status(403).json({ error: 'Bạn không có quyền xóa bài tập này' });
    }

    if (req.user.role === 'admin') {
      return await requestAdminApprovalOnly(req, res, 'assignment.delete', 'Xóa bài tập', { postId });
    }

    const { error } = await supabase.from('bai_dang_lop').delete().eq('id', postId);
    if (error) throw error;
    res.json({ message: 'Đã xóa bài tập' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /teacher/notifications - Fetch notifications for lop managed by this teacher
router.get('/teacher/notifications', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Chỉ dành cho giáo viên và quản trị viên' });
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
      .eq('hoc_sinh_nhan_id', userId)
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
          title: 'Học sinh nộp bài tập',
          message: `Học sinh ${s.student?.username || 'Học sinh'} đã nộp bài tập: "${assign?.noi_dung?.substring(0, 30) || 'Bài tập'}${assign?.noi_dung?.length > 30 ? '...' : ''}"`,
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
      .order('han_nop', { ascending: true })
      .limit(5);

    if (dueErr) throw dueErr;

    // Combine notifications
    const notifications = [];

    // Add student joins
    (newMembers || []).forEach(m => {
      notifications.push({
        id: `join-${m.lop_id}-${m.hoc_sinh_id}-${new Date(m.tham_gia_luc).getTime()}`,
        type: 'student_join',
        title: 'Học sinh mới tham gia lớp',
        message: `Học sinh ${m.student?.username || 'Học sinh'} đã tham gia lớp "${classMap[m.lop_id]}"`,
        timestamp: m.tham_gia_luc,
        link: `/teacher/lop/${m.lop_id}`
      });
    });

    // Add student messages
    (posts || []).forEach(p => {
      notifications.push({
        id: `msg-${p.id}`,
        type: 'message',
        title: 'Tin nhắn mới từ học sinh',
        message: `${p.author?.username || 'Học sinh'} ("${classMap[p.lop_id]}"): "${p.noi_dung?.substring(0, 50)}${p.noi_dung?.length > 50 ? '...' : ''}"`,
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
        title: 'Bài tập sắp hết hạn',
        message: `Bài tập "${d.noi_dung?.substring(0, 30)}${d.noi_dung?.length > 30 ? '...' : ''}" lớp "${classMap[d.lop_id]}" sắp đến hạn nộp`,
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
