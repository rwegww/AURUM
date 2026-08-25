const MAX_ASSIGNMENT_CONTENT_LENGTH = 2000;
export const MAX_ASSIGNMENT_QUESTIONS = 200;
export const MAX_ASSIGNMENT_FILE_SIZE = 20 * 1024 * 1024;
export const ASSIGNMENT_FILE_ACCEPT = '.pdf,.doc,.docx';

const ASSIGNMENT_FILE_EXTENSIONS = new Set(['pdf', 'doc', 'docx']);

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const getFileExtension = (fileName = '') => {
  const lastDot = fileName.lastIndexOf('.');
  return lastDot >= 0 ? fileName.slice(lastDot + 1).toLowerCase() : '';
};

export const getErrorMessage = (payload, fallback) => (
  payload?.message || payload?.error || fallback
);

export const isValidHttpUrl = (value) => {
  if (!normalizeText(value)) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const validateAssignmentFile = (file) => {
  if (!file) return 'Vui lòng chọn tệp PDF hoặc Word';
  if (!ASSIGNMENT_FILE_EXTENSIONS.has(getFileExtension(file.name))) {
    return 'Chỉ hỗ trợ tệp PDF, DOC hoặc DOCX';
  }
  if (file.size <= 0) return 'Tệp đã chọn đang rỗng';
  if (file.size > MAX_ASSIGNMENT_FILE_SIZE) return 'Tệp đính kèm tối đa 20MB';
  return '';
};

export const getQuestionOptions = (question = {}) => (
  Array.isArray(question.options)
    ? question.options
    : (question.options && typeof question.options === 'object' ? Object.values(question.options) : [])
);

export const getCorrectOptionIndex = (question = {}) => {
  if (Number.isInteger(question.correct_index)) return question.correct_index;

  const correctAnswer = question.correct_answer ?? question.answer ?? question.dap_an;
  if (typeof correctAnswer === 'number' && Number.isInteger(correctAnswer)) return correctAnswer;
  if (typeof correctAnswer !== 'string') return null;

  const trimmed = correctAnswer.trim();
  const numericAnswer = Number(trimmed);
  if (trimmed !== '' && Number.isInteger(numericAnswer)) return numericAnswer;
  if (/^[A-D]$/i.test(trimmed)) return trimmed.toUpperCase().charCodeAt(0) - 65;

  const normalizedAnswer = trimmed.toLowerCase().replace(/\s+/g, ' ');
  const index = getQuestionOptions(question).findIndex((option) => (
    String(option).trim().toLowerCase().replace(/\s+/g, ' ') === normalizedAnswer
  ));
  return index >= 0 ? index : null;
};

const normalizeBooleanAnswer = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (['true', 'đúng', 'dung'].includes(normalized)) return true;
  if (['false', 'sai'].includes(normalized)) return false;
  return null;
};

const toOptionObject = (options, keys) => {
  if (Array.isArray(options)) {
    return Object.fromEntries(keys.map((key, index) => [key, String(options[index] ?? '')]));
  }
  const safeOptions = options && typeof options === 'object' ? options : {};
  return Object.fromEntries(keys.map((key) => [key, String(safeOptions[key] ?? safeOptions[key.toLowerCase()] ?? '')]));
};

export const normalizeExamQuestions = (questions) => {
  if (!Array.isArray(questions)) return [];

  return questions.map((question, index) => {
    const safeQuestion = question && typeof question === 'object' ? question : {};
    const type = ['multiple_choice', 'true_false', 'short_answer', 'essay'].includes(safeQuestion.type)
      ? safeQuestion.type
      : 'multiple_choice';
    const normalized = {
      ...safeQuestion,
      id: safeQuestion.id || `q-${Date.now()}-${index}`,
      type,
      part: Number.isFinite(Number(safeQuestion.part)) ? Number(safeQuestion.part) : 1,
      content: String(safeQuestion.content ?? safeQuestion.question ?? ''),
    };

    delete normalized.correct_index;
    delete normalized.answer;
    delete normalized.dap_an;

    if (type === 'multiple_choice') {
      normalized.options = toOptionObject(safeQuestion.options, ['A', 'B', 'C', 'D']);
      const correctIndex = getCorrectOptionIndex(safeQuestion);
      normalized.correct_answer = correctIndex !== null && correctIndex >= 0 && correctIndex < 4
        ? String.fromCharCode(65 + correctIndex)
        : '';
    } else if (type === 'true_false') {
      normalized.options = toOptionObject(safeQuestion.options, ['a', 'b', 'c', 'd']);
      const sourceAnswers = safeQuestion.correct_answer && typeof safeQuestion.correct_answer === 'object'
        ? safeQuestion.correct_answer
        : {};
      normalized.correct_answer = Object.fromEntries(
        ['a', 'b', 'c', 'd'].map((key) => [key, normalizeBooleanAnswer(sourceAnswers[key])])
      );
    } else {
      normalized.options = undefined;
      normalized.correct_answer = String(safeQuestion.correct_answer ?? safeQuestion.sample_answer ?? '');
    }

    return normalized;
  });
};

export const validateExamQuestions = (questions) => {
  if (!Array.isArray(questions)) return 'Danh sách câu hỏi không hợp lệ';
  if (questions.length > MAX_ASSIGNMENT_QUESTIONS) {
    return `Mỗi bài tập tối đa ${MAX_ASSIGNMENT_QUESTIONS} câu hỏi`;
  }

  for (let index = 0; index < questions.length; index += 1) {
    const question = questions[index];
    const label = `Câu ${index + 1}`;
    if (!normalizeText(question?.content)) return `${label}: vui lòng nhập nội dung câu hỏi`;

    const type = question?.type || 'multiple_choice';
    if (type === 'multiple_choice') {
      const options = getQuestionOptions(question);
      if (options.length < 2 || options.some((option) => !normalizeText(String(option)))) {
        return `${label}: vui lòng nhập đầy đủ các phương án`;
      }
      const correctIndex = getCorrectOptionIndex(question);
      if (correctIndex === null || correctIndex < 0 || correctIndex >= options.length) {
        return `${label}: vui lòng chọn đáp án đúng`;
      }
    }

    if (type === 'true_false') {
      const options = question?.options && typeof question.options === 'object'
        ? Object.values(question.options)
        : [];
      const answers = question?.correct_answer && typeof question.correct_answer === 'object'
        ? Object.values(question.correct_answer)
        : [];
      if (options.length === 0 || options.some((option) => !normalizeText(String(option)))) {
        return `${label}: vui lòng nhập đầy đủ các mệnh đề`;
      }
      if (answers.length !== options.length || answers.some((answer) => typeof answer !== 'boolean')) {
        return `${label}: vui lòng chọn Đúng hoặc Sai cho mọi mệnh đề`;
      }
    }
  }

  return '';
};

export const validateAssignmentDraft = (draft, { uploadMethod = 'link', uploadedFile = null, now = Date.now() } = {}) => {
  const errors = {};
  const content = normalizeText(draft?.content);
  const deadline = normalizeText(draft?.deadline);
  const mediaUrl = normalizeText(draft?.bai_hoc_id);

  if (!normalizeText(draft?.lop_id)) errors.lop_id = 'Vui lòng chọn lớp học';
  if (!content) errors.content = 'Vui lòng nhập nội dung bài tập';
  else if (content.length > MAX_ASSIGNMENT_CONTENT_LENGTH) errors.content = `Nội dung tối đa ${MAX_ASSIGNMENT_CONTENT_LENGTH} ký tự`;

  if (deadline) {
    const deadlineTime = new Date(deadline).getTime();
    if (!Number.isFinite(deadlineTime)) errors.deadline = 'Hạn nộp không hợp lệ';
    else if (deadlineTime <= Number(now)) errors.deadline = 'Hạn nộp phải ở trong tương lai';
  }

  if (uploadMethod === 'link' && mediaUrl && !isValidHttpUrl(mediaUrl)) {
    errors.media = 'Liên kết tài liệu phải bắt đầu bằng http:// hoặc https://';
  }
  if (uploadMethod === 'file' && (uploadedFile || mediaUrl)) {
    if (!uploadedFile || !mediaUrl) errors.media = 'Tệp chưa được tải lên hoàn tất';
  }

  const questionError = validateExamQuestions(draft?.questions ?? []);
  if (questionError) errors.questions = questionError;
  return errors;
};

export const buildAssignmentPayload = (draft, questions) => ({
  type: 'assignment',
  content: normalizeText(draft.content),
  deadline: normalizeText(draft.deadline) ? new Date(draft.deadline).toISOString() : null,
  media_url: normalizeText(draft.bai_hoc_id) || null,
  questions: normalizeExamQuestions(questions).map((question) => {
    const normalized = { ...question, content: normalizeText(question.content) };
    if (normalized.options && typeof normalized.options === 'object') {
      normalized.options = Object.fromEntries(
        Object.entries(normalized.options).map(([key, value]) => [key, normalizeText(String(value))])
      );
    }
    if (normalized.type === 'short_answer' || normalized.type === 'essay') {
      normalized.correct_answer = normalizeText(normalized.correct_answer);
    }
    return normalized;
  }),
});

export const getAssignmentClassId = (assignment) => assignment?.class_id ?? assignment?.lop_id ?? '';

export const assignmentMatchesClass = (assignment, classFilter) => (
  classFilter === 'all' || String(getAssignmentClassId(assignment)) === String(classFilter)
);

export const isAssignmentPast = (assignment, now = Date.now()) => {
  if (!assignment?.deadline) return false;
  const deadline = new Date(assignment.deadline).getTime();
  return Number.isFinite(deadline) && deadline <= Number(now);
};

export const formatDate = (value, options, fallback = 'Không xác định') => {
  if (!value) return fallback;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return fallback;
  return new Intl.DateTimeFormat('vi-VN', options).format(date);
};

export const formatAnswer = (answer) => {
  if (answer === null || answer === undefined || answer === '') return '(Chưa trả lời)';
  if (typeof answer !== 'object') return String(answer);

  const entries = Object.entries(answer);
  if (entries.length === 0) return '(Chưa trả lời)';
  return entries.map(([key, value]) => {
    const booleanValue = normalizeBooleanAnswer(value);
    return booleanValue === null
      ? `${key.toUpperCase()}: ${String(value || '(Chưa trả lời)')}`
      : `${key.toUpperCase()}: ${booleanValue ? 'Đúng' : 'Sai'}`;
  }).join(', ');
};

export const validateGrade = (score, feedback) => {
  const errors = {};
  if (score === '' || score === null || score === undefined) {
    errors.score = 'Vui lòng nhập điểm';
  } else {
    const numericScore = Number(score);
    if (!Number.isFinite(numericScore) || numericScore < 0 || numericScore > 10) {
      errors.score = 'Điểm phải là một số từ 0 đến 10';
    }
  }
  if (normalizeText(feedback).length > 1500) errors.feedback = 'Nhận xét tối đa 1500 ký tự';
  return errors;
};
