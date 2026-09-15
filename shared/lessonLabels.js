const toPositiveInteger = (value) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
};

const extractSgkNumberFromId = (value) => {
  const match = String(value || '').match(/bai[_-]?(\d+)/i);
  return match ? toPositiveInteger(match[1]) : null;
};

const extractSgkNumberFromTitle = (title) => {
  const match = String(title || '').match(/^\s*B\S*\s+(\d+)\s*[:.\-–—]?\s*/i);
  return match ? toPositiveInteger(match[1]) : null;
};

export const stripLessonNumberPrefix = (title) =>
  String(title || '')
    .replace(/^\s*B\S*\s+\d+\s*[:.\-–—]?\s*/i, '')
    .trim();

export const getLessonDisplayTitle = (lesson) => {
  const strippedTitle = stripLessonNumberPrefix(lesson?.title);
  return strippedTitle || lesson?.title || '';
};

export const getSgkLessonNumber = (lesson) => {
  const explicitNumber = toPositiveInteger(
    lesson?.sgkLessonNumber ??
    lesson?.textbookLessonNumber ??
    lesson?.sgkLesson?.number ??
    lesson?.textbookLesson?.number
  );
  if (explicitNumber) return explicitNumber;

  const idNumber = extractSgkNumberFromId(lesson?.id) || extractSgkNumberFromId(lesson?.lessonId);
  if (idNumber) return idNumber;

  const numericLessonId = toPositiveInteger(lesson?.lessonId);
  if (numericLessonId) return numericLessonId;

  const titleNumber = extractSgkNumberFromTitle(lesson?.title);
  if (titleNumber) return titleNumber;

  return toPositiveInteger(lesson?.order);
};

export const getAurumLessonOrder = (lesson, zeroBasedIndex) => {
  const index = Number(zeroBasedIndex);
  if (Number.isInteger(index) && index >= 0) return index + 1;

  return toPositiveInteger(lesson?.systemOrder) ||
    toPositiveInteger(lesson?.aurumOrder) ||
    toPositiveInteger(lesson?.sequence) ||
    toPositiveInteger(lesson?.order);
};

export const formatSgkLessonReference = (lesson) => {
  const sgkLessonNumber = getSgkLessonNumber(lesson);
  if (!sgkLessonNumber) return '';

  const title = getLessonDisplayTitle(lesson);
  return title
    ? `Bài ${sgkLessonNumber}: ${title} - SGK`
    : `Bài ${sgkLessonNumber} - SGK`;
};
