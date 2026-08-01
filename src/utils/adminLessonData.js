const QUIZ_LEVELS = ['level1', 'level2', 'level3'];

const readText = (value) => typeof value === 'string' ? value : '';

export const reorderJourneyLessons = (lessons, index, direction) => {
  const targetIndex = index + direction;
  if (index < 0 || index >= lessons.length || targetIndex < 0 || targetIndex >= lessons.length) return lessons;
  const reordered = [...lessons];
  [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
  return reordered.map((lesson, position) => ({ ...lesson, order: position + 1 }));
};

export const modulesToMarkdown = (modules) => {
  if (!Array.isArray(modules) || modules.length === 0) return '';
  if (modules.length === 1 && modules[0]?.type === 'markdown') {
    return readText(modules[0]?.content?.text);
  }

  return modules.map((module) => {
    const content = module?.content || {};
    if (module?.type === 'heading') {
      const parsedLevel = Number.parseInt(String(content.level || '').replace('h', ''), 10);
      const level = Number.isInteger(parsedLevel) && parsedLevel >= 1 && parsedLevel <= 6 ? parsedLevel : 2;
      return `${'#'.repeat(level)} ${readText(content.text)}`.trim();
    }
    if (module?.type === 'paragraph') return readText(content.text);
    if (module?.type === 'list') {
      return Array.isArray(content.items) ? content.items.map((item) => `- ${readText(item)}`).join('\n') : '';
    }
    if (module?.type === 'infoBox') {
      return `> ℹ️ **${readText(content.title)}**\n> ${readText(content.content)}`;
    }
    if (module?.type === 'warningBox') {
      return `> ⚠️ **${readText(content.title)}**\n> ${readText(content.content)}`;
    }
    return '';
  }).filter(Boolean).join('\n\n');
};

const normalizeQuestion = (value) => {
  const question = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const options = Array.isArray(question.options)
    ? question.options.map((option) => readText(option))
    : [];
  const rawAnswer = question.answer ?? question.correctAnswer;
  const parsedAnswer = typeof rawAnswer === 'number' || (typeof rawAnswer === 'string' && rawAnswer.trim())
    ? Number(rawAnswer)
    : NaN;
  const answer = Number.isInteger(parsedAnswer) && parsedAnswer >= 0 && parsedAnswer < options.length
    ? parsedAnswer
    : null;

  return {
    ...question,
    question: readText(question.question),
    options,
    answer,
  };
};

const getLegacyLevel = (question) => {
  const level = String(question?.level || '').toLowerCase();
  if (level === 'easy' || level === 'level1') return 'level1';
  if (level === 'hard' || level === 'level3') return 'level3';
  // The student flow historically displays flat quiz arrays at level 2.
  return 'level2';
};

export const normalizeQuizGroups = (quizzes) => {
  if (Array.isArray(quizzes)) {
    return quizzes.reduce((groups, question) => {
      groups[getLegacyLevel(question)].push(normalizeQuestion(question));
      return groups;
    }, { level1: [], level2: [], level3: [] });
  }

  const source = quizzes && typeof quizzes === 'object' ? quizzes : {};
  return {
    ...source,
    ...Object.fromEntries(QUIZ_LEVELS.map((level) => [
      level,
      Array.isArray(source[level]) ? source[level].map(normalizeQuestion) : [],
    ])),
  };
};

export const countQuizQuestions = (quizzes) => QUIZ_LEVELS.reduce(
  (total, level) => total + (Array.isArray(quizzes?.[level]) ? quizzes[level].length : 0),
  0,
);

export const validateJourneyLesson = (lesson) => {
  const errors = [];

  QUIZ_LEVELS.forEach((level, levelIndex) => {
    const questions = Array.isArray(lesson?.quizzes?.[level]) ? lesson.quizzes[level] : [];
    if (questions.length > 10) {
      errors.push(`Đoạn ${levelIndex + 1} chỉ được có tối đa 10 câu hỏi.`);
    }

    questions.forEach((question, questionIndex) => {
      const prefix = `Đoạn ${levelIndex + 1}, câu ${questionIndex + 1}`;
      if (!readText(question?.question).trim()) errors.push(`${prefix}: nội dung câu hỏi đang trống.`);

      const options = Array.isArray(question?.options) ? question.options : [];
      if (options.length < 2) {
        errors.push(`${prefix}: cần ít nhất 2 phương án trả lời.`);
      } else if (options.some((option) => !readText(option).trim())) {
        errors.push(`${prefix}: không được để trống phương án trả lời.`);
      }

      if (!Number.isInteger(question?.answer) || question.answer < 0 || question.answer >= options.length) {
        errors.push(`${prefix}: đáp án đúng không hợp lệ.`);
      }
    });
  });

  const rewardXp = lesson?.game?.rewardXp;
  const rewardGem = lesson?.game?.rewardGem;
  if (!Number.isInteger(rewardXp) || rewardXp < 0) errors.push('XP thưởng phải là số nguyên không âm.');
  if (!Number.isInteger(rewardGem) || rewardGem < 0) errors.push('Đá Aurum phải là số nguyên không âm.');

  return errors;
};
