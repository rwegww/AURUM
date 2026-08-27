const CORE_SECTION_PATTERN = /^(kiến thức|nội dung)\s+(trọng tâm|cốt lõi)$/i;
const CORE_SECTION_END_PATTERN = /^(bảng ghi nhớ|ghi nhớ nhanh|tóm tắt|tổng kết|hệ thống hóa kiến thức|luyện tập|ví dụ minh họa|hoạt động thực hành|từ khóa|hiểu sâu hơn|vận dụng|mini-lab|phiếu tự kiểm tra)/i;
const GENERIC_HEADING_PATTERN = /^(khởi động học tập|đích đến của bài học|cách học bài này|mục tiêu cần đạt|kiến thức trọng tâm|nội dung cốt lõi)$/i;

const stripMarkdown = (value = '') => String(value)
  .replace(/\$([^$]+)\$/g, '$1')
  .replace(/\\\(|\\\)|\\\[|\\\]/g, '')
  .replace(/\*\*|__|`/g, '')
  .replace(/^[-*+]\s+/, '')
  .replace(/\s+/g, ' ')
  .trim();

const getModuleText = (module) => {
  const content = module?.content;
  if (!content) return '';
  if (typeof content === 'string') return stripMarkdown(content);
  if (typeof content.text === 'string') return stripMarkdown(content.text);
  if (Array.isArray(content.items)) return stripMarkdown(content.items[0]);
  if (typeof content.content === 'string') return stripMarkdown(content.content);
  return '';
};

const getTopicDescription = (modules, headingIndex) => {
  for (let index = headingIndex + 1; index < modules.length; index += 1) {
    const module = modules[index];
    if (module?.type === 'heading') break;

    const text = getModuleText(module);
    if (text) return text;
  }
  return '';
};

const createTopic = (lessonId, module, modules, moduleIndex, topicIndex) => ({
  id: `${lessonId}:core:${topicIndex + 1}`,
  title: stripMarkdown(module?.content?.text) || `Ý chính ${topicIndex + 1}`,
  description: getTopicDescription(modules, moduleIndex),
});

export const getLessonCoreTopics = (lesson) => {
  const modules = Array.isArray(lesson?.theoryModules) ? lesson.theoryModules : [];
  const headings = modules
    .map((module, index) => ({ module, index, title: stripMarkdown(module?.content?.text) }))
    .filter(({ module, title }) => module?.type === 'heading' && title);

  const coreMarker = headings.find(({ title }) => CORE_SECTION_PATTERN.test(title));
  let coreHeadings;

  if (coreMarker) {
    coreHeadings = headings.filter(({ index, title }) => (
      index > coreMarker.index && !CORE_SECTION_END_PATTERN.test(title)
    ));

    const firstEndHeading = headings.find(({ index, title }) => (
      index > coreMarker.index && CORE_SECTION_END_PATTERN.test(title)
    ));
    if (firstEndHeading) {
      coreHeadings = coreHeadings.filter(({ index }) => index < firstEndHeading.index);
    }
  } else {
    coreHeadings = headings.filter(({ title }) => !GENERIC_HEADING_PATTERN.test(title));
  }

  const lessonId = lesson?.lessonId || lesson?.id || 'lesson';
  const topics = coreHeadings.map(({ module, index }, topicIndex) => (
    createTopic(lessonId, module, modules, index, topicIndex)
  ));

  if (topics.length > 0) return topics;

  const fallbackTitle = stripMarkdown(lesson?.description) || 'Tổng quan bài học';
  return [{
    id: `${lessonId}:core:1`,
    title: fallbackTitle,
    description: '',
  }];
};

export const buildKnowledgeMapTree = (lessons = []) => {
  const gradeMap = {};

  lessons.forEach((lesson) => {
    const classId = Number(lesson?.classId ?? lesson?.gradeLevelId);
    if (!Number.isInteger(classId)) return;

    if (!gradeMap[classId]) gradeMap[classId] = [];
    gradeMap[classId].push({
      ...lesson,
      classId,
      lessonId: lesson.lessonId || lesson.id,
      topics: getLessonCoreTopics(lesson),
    });
  });

  Object.values(gradeMap).forEach((gradeLessons) => {
    gradeLessons.sort((a, b) => {
      const orderDifference = Number(a.order || 0) - Number(b.order || 0);
      if (orderDifference !== 0) return orderDifference;
      return String(a.title || '').localeCompare(String(b.title || ''), 'vi');
    });
  });

  return gradeMap;
};

