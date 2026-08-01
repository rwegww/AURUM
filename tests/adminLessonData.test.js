import { describe, expect, it } from 'vitest';
import {
  countQuizQuestions,
  normalizeQuizGroups,
  reorderJourneyLessons,
  validateJourneyLesson,
} from '../src/utils/adminLessonData.js';

describe('dữ liệu hành trình trong admin', () => {
  it('lưu được thao tác đổi chỗ khi hai bài đang trùng thứ tự', () => {
    const lessons = [
      { lessonId: 'a', order: 1 },
      { lessonId: 'b', order: 1 },
      { lessonId: 'c', order: 3 },
    ];
    const reordered = reorderJourneyLessons(lessons, 1, -1);
    expect(reordered).toEqual([
      { lessonId: 'b', order: 1 },
      { lessonId: 'a', order: 2 },
      { lessonId: 'c', order: 3 },
    ]);
    expect(lessons[0]).toEqual({ lessonId: 'a', order: 1 });
  });
  it('giữ nguyên ba nhóm câu hỏi và chuẩn hóa đáp án', () => {
    const quizzes = normalizeQuizGroups({
      level1: [{ question: 'Câu dễ', options: ['A', 'B'], answer: 1 }],
      level2: [{ question: 'Câu vừa', options: ['A', 'B'], correctAnswer: 0 }],
      level3: [],
    });

    expect(quizzes.level1[0].answer).toBe(1);
    expect(quizzes.level2[0].answer).toBe(0);
    expect(countQuizQuestions(quizzes)).toBe(2);
  });

  it('mở được dữ liệu câu hỏi cũ bị hỏng mà không tự chọn đáp án A', () => {
    const quizzes = normalizeQuizGroups({
      level1: [null, { question: 'Chưa có đáp án', options: ['A', 'B'], answer: '' }],
    });
    expect(quizzes.level1[0].question).toBe('');
    expect(quizzes.level1[1].answer).toBeNull();
    expect(validateJourneyLesson({ quizzes, game: { rewardXp: 0, rewardGem: 0 } }).length).toBeGreaterThan(0);
  });

  it('chuyển mảng câu hỏi cũ vào đúng cấp độ', () => {
    const quizzes = normalizeQuizGroups([
      { level: 'easy', question: 'Dễ', options: ['A', 'B'], answer: 0 },
      { level: 'hard', question: 'Khó', options: ['A', 'B'], answer: 1 },
    ]);

    expect(quizzes.level1).toHaveLength(1);
    expect(quizzes.level2).toHaveLength(0);
    expect(quizzes.level3).toHaveLength(1);
  });

  it('chấp nhận phần thưởng bằng 0 nhưng chặn câu hỏi hỏng', () => {
    const validLesson = {
      quizzes: {
        level1: [{ question: 'Hợp lệ', options: ['A', 'B'], answer: 0 }],
        level2: [],
        level3: [],
      },
      game: { rewardXp: 0, rewardGem: 0 },
    };
    expect(validateJourneyLesson(validLesson)).toEqual([]);

    const invalidLesson = {
      ...validLesson,
      quizzes: {
        ...validLesson.quizzes,
        level1: [{ question: '', options: ['A', ''], answer: 4 }],
      },
    };
    expect(validateJourneyLesson(invalidLesson)).toEqual(expect.arrayContaining([
      expect.stringContaining('nội dung câu hỏi đang trống'),
      expect.stringContaining('không được để trống phương án'),
      expect.stringContaining('đáp án đúng không hợp lệ'),
    ]));
  });
});
