import { JOURNEY_LEVELS } from './journeyLessonData.js';

export const lessonIdOf = (lesson) => lesson?.lessonId ?? lesson?.id;
export const journeyStarsOf = (user, lessonId) => user?.balancingProgress?.lessonStars?.[lessonId] || {};
export const isJourneyComplete = (stars) => JOURNEY_LEVELS.every((level) => Number(stars?.[level] || 0) > 0);
export const getNextJourneyLevel = (stars) => JOURNEY_LEVELS.find((level) => !(Number(stars?.[level]) > 0)) || 'level3';

export const getJourneyLessonStatuses = (lessons, user, grade) => lessons.map((lesson, index) => {
  const stars = journeyStarsOf(user, lessonIdOf(lesson));
  const isCompleted = isJourneyComplete(stars);
  const firstUnlocked = ['6', '7', '8'].includes(String(grade))
    || (user?.balancingProgress?.passedGrades || []).map(String).includes(String(grade))
    || (user?.balancingProgress?.placement?.status === 'placed'
      && String(user.balancingProgress.placement.assignedGrade) === String(grade));
  const isUnlocked = ['admin', 'teacher'].includes(user?.role)
    || (index === 0 && firstUnlocked)
    || (index > 0 && isJourneyComplete(journeyStarsOf(user, lessonIdOf(lessons[index - 1]))))
    || isCompleted;
  return { ...lesson, stars, isCompleted, isUnlocked };
});

export const resolveJourneyGrade = ({ routeGrade, selectedGrade, user }) => {
  const valid = (value) => ['6', '7', '8', '9', '10', '11', '12'].includes(String(value));
  const placement = user?.balancingProgress?.placement;
  if (user?.role === 'student' && placement?.required && placement.status === 'placed' && valid(placement.assignedGrade)) {
    return String(placement.assignedGrade);
  }
  const route = Array.isArray(routeGrade) ? routeGrade[0] : routeGrade;
  return [route, selectedGrade, user?.studyPlan?.grade, '8'].find(valid).toString();
};
