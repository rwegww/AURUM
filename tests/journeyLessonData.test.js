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

    JOURNEY_LEVELS.forEach((level) => {
      expect(groups[level].map((question) => question.correctAnswer)).toEqual([1, 0]);
    });
  });

  it('dùng ngân hàng game để bù ba mốc sao khi quizzes đang trống', () => {
    const lesson = class10Data.ketnoi[0];
    const groups = getJourneyQuizGroups(lesson);

    JOURNEY_LEVELS.forEach((level) => expect(groups[level].length).toBeGreaterThan(0));
    expect(countJourneyQuestions(lesson)).toBe(lesson.game.basic.length);
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
