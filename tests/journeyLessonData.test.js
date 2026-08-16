import { describe, expect, it } from 'vitest';
import { class6Data } from '../src/data/curriculum/class6/index.js';
import { class7Data } from '../src/data/curriculum/class7/index.js';
import { class8Data } from '../src/data/curriculum/class8/index.js';
import { class9Data } from '../src/data/curriculum/class9/index.js';
import { class10Data } from '../src/data/curriculum/class10/index.js';
import { class11Data } from '../src/data/curriculum/class11/index.js';
import { ketnoi as class12Lessons } from '../src/data/curriculum/class12/index.js';
import {
  countJourneyQuestions,
  getJourneyQuizGroups,
  JOURNEY_LEVELS,
  normalizeJourneyChallenges,
} from '../src/utils/journeyLessonData.js';

const allLessons = [
  ...class6Data.ketnoi,
  ...class7Data.ketnoi,
  ...class8Data.ketnoi,
  ...class9Data.ketnoi,
  ...class10Data.ketnoi,
  ...class11Data.ketnoi,
  ...class12Lessons,
];

describe('dữ liệu lộ trình học', () => {
  it('giữ nguyên loại và nội dung của thử thách tương tác', () => {
    const [imageSelection, matching] = normalizeJourneyChallenges(class8Data.ketnoi[0].challenges);

    expect(imageSelection.type).toBe('image-selection');
    expect(imageSelection.images).toHaveLength(4);
    expect(imageSelection.correctAnswer).toBe(0);
    expect(matching.type).toBe('matching');
    expect(matching.leftItems).toHaveLength(3);
  });

  it('chuyển thử thách văn bản cũ thành nhiệm vụ lab', () => {
    const [challenge] = normalizeJourneyChallenges([
      { text: 'Quan sát hiện tượng và ghi lại kết quả.', narrative: 'Hãy làm theo hướng dẫn.' },
    ]);

    expect(challenge.type).toBe('lab-task');
    expect(challenge.text).toContain('Quan sát hiện tượng');
  });

  it('chuẩn hóa cả answer và correctAnswer mà không làm mất đáp án', () => {
    const groups = getJourneyQuizGroups({
      quizzes: [
        { question: 'Câu 1', options: ['A', 'B'], correctAnswer: 1 },
        { question: 'Câu 2', options: ['A', 'B'], answer: 0 },
      ],
    });

    expect(groups.level1.map((question) => question.correctAnswer)).toEqual([1]);
    expect(groups.level2.map((question) => question.correctAnswer)).toEqual([0]);
    expect(groups.level3.map((question) => question.correctAnswer)).toEqual([1, 0]);
  });

  it('chia ngân hàng phẳng thành vòng cơ bản, vòng nâng cao và vòng tổng hợp', () => {
    const lesson = class10Data.ketnoi[0];
    const groups = getJourneyQuizGroups(lesson);

    JOURNEY_LEVELS.forEach((level) => expect(groups[level].length).toBeGreaterThan(0));
    expect(groups.level1.length + groups.level2.length).toBe(lesson.game.basic.length);
    expect(groups.level3.length).toBe(lesson.game.basic.length);
    expect(countJourneyQuestions(lesson)).toBe(lesson.game.basic.length);
  });

  it('dùng câu cơ bản cho vòng 1 và thử thách tương tác cho vòng 2 ở dữ liệu khối 8', () => {
    const lesson = class8Data.ketnoi[0];
    const groups = getJourneyQuizGroups(lesson);

    expect(groups.level1).toHaveLength(lesson.game.basic.length);
    expect(groups.level2).toHaveLength(lesson.challenges.length);
    expect(groups.level2.some((question) => question.type === 'matching')).toBe(true);
  });

  it('vòng 3 luôn chứa đầy đủ câu hỏi của hai vòng trước và không lặp câu', () => {
    allLessons.forEach((lesson) => {
      const groups = getJourneyQuizGroups(lesson);
      const signature = (question) => JSON.stringify([
        question.type,
        question.question || question.content || question.text,
        question.options || question.images || question.items || [],
      ]);
      const expected = new Set([...groups.level1, ...groups.level2].map(signature));
      const actual = groups.level3.map(signature);

      expect(new Set(actual).size, `${lesson.id || lesson.lessonId} có câu tổng hợp bị lặp`).toBe(actual.length);
      expect(new Set(actual), `${lesson.id || lesson.lessonId} thiếu câu ở vòng tổng hợp`).toEqual(expected);
    });
  });

  it('tất cả bài trong chương trình đều có câu hỏi chơi được ở cả ba mốc sao', () => {
    expect(allLessons).toHaveLength(129);

    allLessons.forEach((lesson) => {
      const groups = getJourneyQuizGroups(lesson);
      JOURNEY_LEVELS.forEach((level) => {
        expect(groups[level].length, `${lesson.id || lesson.lessonId} thiếu ${level}`).toBeGreaterThan(0);
      });
    });
  });
});
