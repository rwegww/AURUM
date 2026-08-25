import { describe, expect, it } from 'vitest';
import {
  buildAssignmentPayload,
  MAX_ASSIGNMENT_QUESTIONS,
  normalizeExamQuestions,
  validateAssignmentDraft,
  validateExamQuestions,
  validateGrade,
} from '../src/utils/teacherAssignmentUtils.js';

const validQuestion = {
  type: 'multiple_choice',
  content: 'Chất nào là axit?',
  options: { A: 'HCl', B: 'NaOH', C: 'NaCl', D: 'H2O' },
  correct_answer: 'A',
};

describe('kiểm tra dữ liệu bài tập của giáo viên', () => {
  it('chặn hạn nộp trong quá khứ và liên kết không an toàn', () => {
    const errors = validateAssignmentDraft({
      lop_id: 'lop-1',
      content: 'Hoàn thành bài tập',
      deadline: '2026-01-01T08:00',
      bai_hoc_id: 'javascript:alert(1)',
      questions: [],
    }, { now: new Date('2026-01-02T08:00:00Z').getTime() });

    expect(errors.deadline).toBeTruthy();
    expect(errors.media).toBeTruthy();
  });

  it('chặn bài tập vượt giới hạn câu hỏi của API', () => {
    const questions = Array.from({ length: MAX_ASSIGNMENT_QUESTIONS + 1 }, () => validQuestion);
    expect(validateExamQuestions(questions)).toContain(String(MAX_ASSIGNMENT_QUESTIONS));
  });

  it('chuẩn hóa hạn nộp và nội dung trước khi gửi', () => {
    const payload = buildAssignmentPayload({
      content: '  Bài tập chương 1  ',
      deadline: '2030-05-12T08:30',
      bai_hoc_id: ' https://example.com/de-bai.pdf ',
    }, [validQuestion]);

    expect(payload.content).toBe('Bài tập chương 1');
    expect(payload.media_url).toBe('https://example.com/de-bai.pdf');
    expect(Number.isNaN(new Date(payload.deadline).getTime())).toBe(false);
  });

  it('không biến điểm trống thành điểm 0', () => {
    expect(validateGrade('', '').score).toBeTruthy();
    expect(validateGrade('0', '').score).toBeUndefined();
  });

  it('giữ nguyên câu tự luận và đáp án tham khảo nhiều dòng', () => {
    const [question] = normalizeExamQuestions([{
      type: 'essay',
      part: 2,
      content: 'Trình bày cách pha dung dịch.',
      correct_answer: 'Bước 1\nBước 2',
    }]);

    expect(question).toMatchObject({
      type: 'essay',
      part: 2,
      correct_answer: 'Bước 1\nBước 2',
    });
    expect(question.options).toBeUndefined();
  });
});
