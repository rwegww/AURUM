import { describe, expect, it } from 'vitest';
import { getJourneyLessonStatuses, getNextJourneyLevel, resolveJourneyGrade } from '../shared/journeyProgress.js';
import { getJourneyQuizGroups } from '../shared/journeyLessonData.js';
import { isJourneyAnswerCorrect } from '../shared/journeyAnswers.js';

const lessons = [{ lessonId: 'first' }, { lessonId: 'second' }, { lessonId: 'third' }];
const complete = { level1: 1, level2: 1, level3: 1 };
const student = (progress = {}) => ({ role: 'student', balancingProgress: progress });

describe('Shared web/native journey progression', () => {
  it.each(['6', '7', '8'])('opens just the first lesson by default for grade %s', (grade) => {
    expect(getJourneyLessonStatuses(lessons, student(), grade).map((lesson) => lesson.isUnlocked)).toEqual([true, false, false]);
  });
  it('keeps the next stage locked until all three rounds are saved', () => {
    const user = student({ lessonStars: { first: { level1: 1, level2: 1 } } });
    expect(getJourneyLessonStatuses(lessons, user, '8')[1].isUnlocked).toBe(false);
    user.balancingProgress.lessonStars.first.level3 = 1;
    expect(getJourneyLessonStatuses(lessons, user, '8').map((lesson) => lesson.isUnlocked)).toEqual([true, true, false]);
  });
  it('opens a passed higher grade even if grade ids arrive as numbers', () => {
    expect(getJourneyLessonStatuses(lessons, student({ passedGrades: [10] }), '10')[0].isUnlocked).toBe(true);
  });
  it('opens the assigned grade and preserves access to completed lessons', () => {
    const user = student({ placement: { status: 'placed', assignedGrade: 11 }, lessonStars: { third: complete } });
    expect(getJourneyLessonStatuses(lessons, user, '11').map((lesson) => lesson.isUnlocked)).toEqual([true, false, true]);
  });
  it.each(['teacher', 'admin'])('opens all lessons for %s', (role) => {
    expect(getJourneyLessonStatuses(lessons, { role }, '12').every((lesson) => lesson.isUnlocked)).toBe(true);
  });
  it('resumes the next round and replays the final round after completion', () => {
    expect(getNextJourneyLevel({})).toBe('level1');
    expect(getNextJourneyLevel({ level1: 1 })).toBe('level2');
    expect(getNextJourneyLevel({ level1: 1, level2: 1 })).toBe('level3');
    expect(getNextJourneyLevel(complete)).toBe('level3');
  });
  it('honors a direct grade route instead of silently showing the profile grade', () => {
    expect(resolveJourneyGrade({ routeGrade: ['10'], selectedGrade: '8', user: { studyPlan: { grade: 7 } } })).toBe('10');
    expect(resolveJourneyGrade({ routeGrade: 'invalid', selectedGrade: '6' })).toBe('6');
  });
  it('restricts placement-managed students to their assigned grade', () => {
    expect(resolveJourneyGrade({ routeGrade: '12', user: student({ placement: { required: true, status: 'placed', assignedGrade: 9 } }) })).toBe('9');
  });
});

describe('Question parity across web and native', () => {
  it('retains image, fill, ordering and matching questions in the three rounds', () => {
    const basic = { question: 'Chọn hình', images: ['a.png', 'b.png'], correctAnswer: 1 };
    const advanced = [
      { question: 'Điền kí hiệu', correctAnswer: 'O' },
      { type: 'drag-drop', question: 'Sắp xếp', items: [{ id: 'a' }, { id: 'b' }], correctOrder: ['a', 'b'] },
      { type: 'matching', question: 'Ghép cặp', leftItems: [{ label: 'Hydrogen' }], items: [{ id: 'h' }], correctOrder: ['h'] },
    ];
    const groups = getJourneyQuizGroups({ quizzes: { level1: [basic], level2: advanced } });
    expect(groups.level1.map((item) => item.type)).toEqual(['image-selection']);
    expect(groups.level2.map((item) => item.type)).toEqual(['fill-in-the-blank', 'drag-drop', 'matching']);
    expect(groups.level3).toHaveLength(4);
  });
  it('does not accidentally select answer zero for an empty answer', () => {
    const question = { type: 'multiple-choice', correctAnswer: 0 };
    expect(isJourneyAnswerCorrect(question, null)).toBe(false);
    expect(isJourneyAnswerCorrect(question, '')).toBe(false);
    expect(isJourneyAnswerCorrect(question, 0)).toBe(true);
  });
  it('uses the same case/whitespace rules for written answers', () => {
    expect(isJourneyAnswerCorrect({ type: 'fill-in-the-blank', correctAnswer: 'NaCl' }, ' nacl ')).toBe(true);
  });
  it.each(['matching', 'drag-drop'])('checks the complete order of %s answers', (type) => {
    const question = { type, correctOrder: ['a', 'b'] };
    expect(isJourneyAnswerCorrect(question, [{ id: 'b' }, { id: 'a' }])).toBe(false);
    expect(isJourneyAnswerCorrect(question, [{ id: 'a' }])).toBe(false);
    expect(isJourneyAnswerCorrect(question, [{ id: 'a' }, { id: 'b' }])).toBe(true);
  });
});
