const stripMarkdown = (value = '') => String(value)
  .replace(/\*\*/g, '')
  .replace(/`/g, '')
  .trim();

const splitLessonTitle = (title = '') => String(title).split(': ').pop() || title;

const getModules = (lesson) => Array.isArray(lesson?.theoryModules) ? lesson.theoryModules : [];

const findModule = (lesson, suffix) => getModules(lesson).find((module) => String(module.id || '').endsWith(suffix));

const parseMarkdownTable = (text = '') => {
  const lines = String(text)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && line.endsWith('|'));

  if (lines.length < 3) return [];

  return lines
    .slice(2)
    .map((line) => line.slice(1, -1).split('|').map((cell) => stripMarkdown(cell)))
    .filter((cells) => cells.length >= 2);
};

export const getLessonSummary = (lesson) => {
  const goalsModule = findModule(lesson, 'learning-goals-list');
  const conceptsModule = findModule(lesson, 'concept-map-table');
  const applicationsModule = findModule(lesson, 'applications-list');
  const labModule = findModule(lesson, 'mini-lab-box');
  const mistakesModule = findModule(lesson, 'mistakes');
  const keywordsModule = getModules(lesson).find((module) => {
    const text = module?.content?.text || '';
    return module.type === 'paragraph' && String(text).includes(',') && String(module.id || '').startsWith('mod');
  });

  const conceptRows = parseMarkdownTable(conceptsModule?.content?.text);
  const concepts = conceptRows.slice(0, 4).map((row) => ({
    title: row[0],
    description: row[1],
    signal: row[2],
    note: row[3],
  }));

  const applications = Array.isArray(applicationsModule?.content?.items)
    ? applicationsModule.content.items.slice(0, 3)
    : [];

  const goals = Array.isArray(goalsModule?.content?.items)
    ? goalsModule.content.items.slice(0, 4)
    : [];

  const commonMistakes = String(mistakesModule?.content?.content || '')
    .split('\n')
    .map((line) => stripMarkdown(line.replace(/^-\s*/, '')))
    .filter(Boolean)
    .slice(0, 3);

  const keywords = String(keywordsModule?.content?.text || '')
    .split(',')
    .map((item) => stripMarkdown(item))
    .filter(Boolean)
    .slice(0, 6);

  return {
    title: splitLessonTitle(lesson?.title),
    chapter: lesson?.chapter || '',
    goals,
    concepts,
    applications,
    commonMistakes,
    keywords,
    lab: {
      title: labModule?.content?.title || 'Nhiệm vụ quan sát',
      content: labModule?.content?.content || '',
    },
    quizCounts: {
      level1: lesson?.quizzes?.level1?.length || 0,
      level2: lesson?.quizzes?.level2?.length || 0,
      level3: lesson?.quizzes?.level3?.length || 0,
    },
    challengeCount: Array.isArray(lesson?.challenges) ? lesson.challenges.length : 0,
  };
};
