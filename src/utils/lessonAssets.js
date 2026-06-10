export const getLessonInfographicUrl = (lesson, grade, order) => {
  const classId = lesson?.classId || grade;
  const lessonOrder = lesson?.order || order;

  return lesson?.infographicUrl
    || lesson?.assets?.infographicUrl
    || lesson?.game?.assets?.infographicUrl
    || (classId && lessonOrder ? `/assets/curriculum/class${classId}/${classId}-${lessonOrder}.png` : '');
};
