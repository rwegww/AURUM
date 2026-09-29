const CLOUDINARY_CLOUD_NAME = 'dpcorzgkm';

const CLASS_67_INFOGRAPHIC_ORDERS = {
  '6': new Set(['2', '6', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17']),
  '7': new Set(['1', '2', '3', '4', '5', '6', '7']),
};

const getClass67InfographicUrl = (classId, lessonOrder) => {
  const normalizedClassId = String(classId || '');
  const normalizedOrder = String(lessonOrder || '');
  if (!CLASS_67_INFOGRAPHIC_ORDERS[normalizedClassId]?.has(normalizedOrder)) return '';

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/aurum/curriculum/class${normalizedClassId}/${normalizedClassId}-${normalizedOrder}.png`;
};

export const getLessonInfographicUrl = (lesson, grade, order) => {
  const classId = lesson?.classId || grade;
  const lessonOrder = lesson?.order || order;
  const declaredUrl = lesson?.infographicUrl
    || lesson?.assets?.infographicUrl
    || lesson?.game?.assets?.infographicUrl
    || '';
  const class67Url = getClass67InfographicUrl(classId, lessonOrder);
  const isMissingLocalClass67Asset = class67Url
    && /^\/assets\/curriculum\/class[67]\//.test(declaredUrl);

  if (declaredUrl && !isMissingLocalClass67Asset) return declaredUrl;
  return class67Url
    || (classId && lessonOrder ? `/assets/curriculum/class${classId}/${classId}-${lessonOrder}.webp` : '');
};
