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
  item.id || '',
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

const distributeQuestionBank = (questions) => {
  const bank = normalizeQuestionBank(questions);
  if (bank.length === 0) return emptyGroups();

  // Ngân hàng chỉ có một hoặc hai câu (dữ liệu cũ khối 11-12) được dùng cho
  // cả ba mốc để không tạo mốc sao rỗng. Ngân hàng lớn hơn được chia đều.
  if (bank.length < JOURNEY_LEVELS.length) {
    return Object.fromEntries(JOURNEY_LEVELS.map((level) => [level, [...bank]]));
  }

  return bank.reduce((groups, question, index) => {
    groups[JOURNEY_LEVELS[index % JOURNEY_LEVELS.length]].push(question);
    return groups;
  }, emptyGroups());
};

const normalizeLegacyQuizArray = (quizzes) => {
  const hasDeclaredLevels = quizzes.some((question) => readQuestionLevel(question));
  if (!hasDeclaredLevels) return distributeQuestionBank(quizzes);

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

const countPopulatedGroups = (groups) => JOURNEY_LEVELS.filter((level) => groups[level].length > 0).length;

export const getJourneyQuizGroups = (lesson) => {
  const quizzes = lesson?.quizzes;
  let groups = Array.isArray(quizzes)
    ? normalizeLegacyQuizArray(quizzes)
    : normalizeGroupedQuizzes(quizzes);
  const gameGroups = getGameGroups(lesson?.game);
  const gamePool = uniqueItems(JOURNEY_LEVELS.flatMap((level) => gameGroups[level]));

  if (countPopulatedGroups(groups) === 0 && gamePool.length > 0) {
    groups = countPopulatedGroups(gameGroups) > 1
      ? gameGroups
      : distributeQuestionBank(gamePool);
  } else {
    groups = Object.fromEntries(JOURNEY_LEVELS.map((level) => [
      level,
      groups[level].length > 0 ? groups[level] : gameGroups[level],
    ]));
  }

  const challengePool = normalizeJourneyChallenges(lesson?.challenges)
    .filter((item) => item.type !== 'lab-task');
  const fallbackPool = uniqueItems([
    ...JOURNEY_LEVELS.flatMap((level) => groups[level]),
    ...gamePool,
    ...challengePool,
  ]);
  const fallbackGroups = distributeQuestionBank(fallbackPool);

  return Object.fromEntries(JOURNEY_LEVELS.map((level) => [
    level,
    groups[level].length > 0
      ? groups[level]
      : (fallbackGroups[level].length > 0 ? fallbackGroups[level] : fallbackPool),
  ]));
};

export const countJourneyQuestions = (lesson) => {
  const groups = getJourneyQuizGroups(lesson);
  return uniqueItems(JOURNEY_LEVELS.flatMap((level) => groups[level])).length;
};
