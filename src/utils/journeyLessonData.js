import { isCloudinaryVideoUrl } from './videoLinks.js';

export const JOURNEY_LEVELS = ['level1', 'level2', 'level3'];

const SUPPORTED_TYPES = new Set([
  'multiple-choice',
  'image-selection',
  'fill-in-the-blank',
  'drag-drop',
  'matching',
  'lab-task',
]);

const asArray = (value) => Array.isArray(value) ? value : [];

const inferChallengeType = (challenge) => {
  const declaredType = String(challenge?.type || '').trim().toLowerCase();
  if (SUPPORTED_TYPES.has(declaredType)) return declaredType;
  if (declaredType === 'lab' || declaredType === 'checklist') return 'lab-task';
  if (asArray(challenge?.images).length > 0) return 'image-selection';
  if (asArray(challenge?.leftItems).length > 0) return 'matching';
  if (asArray(challenge?.items).length > 0 && asArray(challenge?.correctOrder).length > 0) return 'drag-drop';
  if (asArray(challenge?.options).length > 0 || (
    challenge?.options && typeof challenge.options === 'object'
  )) return 'multiple-choice';
  if (typeof (challenge?.correctAnswer ?? challenge?.answer) === 'string') return 'fill-in-the-blank';
  return 'lab-task';
};

const normalizeOptions = (options) => {
  if (Array.isArray(options)) return options;
  if (options && typeof options === 'object') return Object.values(options);
  return [];
};

const normalizeChoiceAnswer = (answer, options) => {
  if (Number.isInteger(answer)) return answer;
  if (typeof answer === 'string' && answer.trim() !== '') {
    const parsed = Number(answer);
    if (Number.isInteger(parsed)) return parsed;
    const optionIndex = options.findIndex((option) => String(option).trim() === answer.trim());
    if (optionIndex >= 0) return optionIndex;
  }
  return answer;
};

export const normalizeJourneyChallenge = (value, index = 0) => {
  const challenge = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const type = inferChallengeType(challenge);
  const options = normalizeOptions(challenge.options);
  const rawAnswer = challenge.correctAnswer ?? challenge.answer;
  const question = challenge.question || challenge.content || '';
  const text = challenge.text || (type === 'lab-task' ? question : '');

  return {
    ...challenge,
    id: challenge.id || `journey-item-${index + 1}`,
    type,
    question,
    text,
    ...(options.length > 0 ? { options } : {}),
    ...(rawAnswer !== undefined ? {
      correctAnswer: type === 'multiple-choice' || type === 'image-selection'
        ? normalizeChoiceAnswer(rawAnswer, options)
        : rawAnswer,
    } : {}),
  };
};

export const isPlayableJourneyItem = (item) => {
  if (!item) return false;
  const prompt = String(item.question || item.content || item.text || '').trim();
  if (!prompt) return false;

  if (item.type === 'multiple-choice') {
    return asArray(item.options).length >= 2
      && Number.isInteger(item.correctAnswer)
      && item.correctAnswer >= 0
      && item.correctAnswer < item.options.length;
  }
  if (item.type === 'image-selection') {
    return asArray(item.images).length >= 2
      && Number.isInteger(item.correctAnswer)
      && item.correctAnswer >= 0
      && item.correctAnswer < item.images.length;
  }
  if (item.type === 'fill-in-the-blank') {
    return String(item.correctAnswer ?? '').trim().length > 0;
  }
  if (item.type === 'drag-drop' || item.type === 'matching') {
    return asArray(item.items).length > 0 && asArray(item.correctOrder).length === item.items.length;
  }
  return item.type === 'lab-task';
};

export const normalizeJourneyChallenges = (challenges) => asArray(challenges)
  .map(normalizeJourneyChallenge)
  .filter(isPlayableJourneyItem);

const itemSignature = (item) => JSON.stringify([
  item.type || '',
  item.question || item.content || item.text || '',
  item.options || item.images || item.items || [],
]);

const uniqueItems = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    const signature = itemSignature(item);
    if (seen.has(signature)) return false;
    seen.add(signature);
    return true;
  });
};

const normalizeQuestionBank = (questions) => uniqueItems(
  asArray(questions)
    .map(normalizeJourneyChallenge)
    .filter(isPlayableJourneyItem),
);

const emptyGroups = () => ({ level1: [], level2: [], level3: [] });

const readQuestionLevel = (question) => {
  const level = String(question?.level || question?.difficulty || '').trim().toLowerCase();
  if (level === 'level1' || level === 'easy' || level === 'basic') return 'level1';
  if (level === 'level2' || level === 'medium' || level === 'intermediate') return 'level2';
  if (level === 'level3' || level === 'hard' || level === 'advanced') return 'level3';
  return null;
};

const splitProgressiveQuestionBank = (questions) => {
  const bank = normalizeQuestionBank(questions);
  if (bank.length === 0) return [[], []];

  // Một số bài cũ chỉ có một câu. Khi chưa thể tạo thêm dữ liệu có kiểm chứng,
  // dùng lại câu đó ở vòng 2 vẫn an toàn hơn việc tự sinh câu ngoài giáo trình.
  if (bank.length === 1) return [[...bank], [...bank]];

  const splitAt = Math.ceil(bank.length / 2);
  return [bank.slice(0, splitAt), bank.slice(splitAt)];
};

const normalizeDeclaredQuizArray = (quizzes) => {
  const groups = emptyGroups();
  quizzes.forEach((question) => {
    const level = readQuestionLevel(question) || 'level2';
    const normalized = normalizeJourneyChallenge(question, groups[level].length);
    if (isPlayableJourneyItem(normalized)) groups[level].push(normalized);
  });
  return groups;
};

const normalizeGroupedQuizzes = (quizzes) => Object.fromEntries(
  JOURNEY_LEVELS.map((level) => [level, normalizeQuestionBank(quizzes?.[level])]),
);

const getGameGroups = (game) => ({
  level1: normalizeQuestionBank(game?.basic),
  level2: normalizeQuestionBank(game?.intermediate),
  level3: normalizeQuestionBank(game?.advanced),
});

const withoutItems = (items, excludedItems) => {
  const excluded = new Set(excludedItems.map(itemSignature));
  return items.filter((item) => !excluded.has(itemSignature(item)));
};

export const getJourneyQuizGroups = (lesson) => {
  const quizzes = lesson?.quizzes;
  const gameGroups = getGameGroups(lesson?.game);
  const challengePool = normalizeJourneyChallenges(lesson?.challenges)
    .filter((item) => item.type !== 'lab-task');

  let declaredGroups = emptyGroups();
  let flatQuizPool = [];

  if (Array.isArray(quizzes)) {
    if (quizzes.some((question) => readQuestionLevel(question))) {
      declaredGroups = normalizeDeclaredQuizArray(quizzes);
    } else {
      flatQuizPool = normalizeQuestionBank(quizzes);
    }
  } else {
    declaredGroups = normalizeGroupedQuizzes(quizzes);
  }

  const hasExplicitBasicLevel = declaredGroups.level1.length > 0;
  const declaredBasic = hasExplicitBasicLevel
    ? declaredGroups.level1
    : declaredGroups.level2;
  const declaredHarder = hasExplicitBasicLevel
    ? uniqueItems([...declaredGroups.level2, ...declaredGroups.level3])
    : declaredGroups.level3;

  let round1 = uniqueItems([
    ...declaredBasic,
    ...flatQuizPool,
    ...gameGroups.level1,
  ]);
  let round2 = uniqueItems([
    ...declaredHarder,
    ...gameGroups.level2,
    ...gameGroups.level3,
    ...challengePool,
  ]);
  round2 = withoutItems(round2, round1);

  const fullLessonPool = uniqueItems([
    ...JOURNEY_LEVELS.flatMap((level) => declaredGroups[level]),
    ...flatQuizPool,
    ...JOURNEY_LEVELS.flatMap((level) => gameGroups[level]),
    ...challengePool,
  ]);

  // Dữ liệu khối 10-12 thường chỉ có một ngân hàng phẳng. Khi chưa có nguồn
  // nâng cao riêng, giữ thứ tự tác giả: nửa đầu là nhận biết, nửa sau là vận dụng.
  if (round1.length === 0 || round2.length === 0) {
    [round1, round2] = splitProgressiveQuestionBank(fullLessonPool);
  }

  return {
    level1: round1,
    level2: round2,
    // Vòng 3 luôn là bài tổng hợp đúng nghĩa: toàn bộ câu của hai vòng trước,
    // không lấy một nhóm độc lập khiến học sinh bỏ sót kiến thức đã học.
    level3: uniqueItems([...round1, ...round2]),
  };
};

export const countJourneyQuestions = (lesson) => {
  const groups = getJourneyQuizGroups(lesson);
  return groups.level3.length;
};

export const getJourneyVideoUrl = (lesson) => {
  const candidates = [
    lesson?.introVideoUrl,
    lesson?.assets?.journeyVideoUrl,
    lesson?.assets?.introVideoUrl,
    lesson?.assets?.cloudinaryVideoUrl,
    ...asArray(lesson?.videoModules).map((module) => module?.url),
  ];

  const cloudinaryUrl = candidates.find((url) => isCloudinaryVideoUrl(url));
  return typeof cloudinaryUrl === 'string' ? cloudinaryUrl.trim() : '';
};

export const getJourneyStageOverview = (lesson, index = 0) => {
  const quizGroups = getJourneyQuizGroups(lesson);
  const rawTitle = String(lesson?.title || '').trim();
  const title = rawTitle.split(': ').pop() || `Bài học ${index + 1}`;

  return {
    title,
    description: String(lesson?.description || '').trim(),
    videoUrl: getJourneyVideoUrl(lesson),
    questionCounts: Object.fromEntries(
      JOURNEY_LEVELS.map((level) => [level, quizGroups[level].length]),
    ),
    totalQuestions: quizGroups.level3.length,
  };
};
