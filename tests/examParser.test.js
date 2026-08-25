import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import mammoth from 'mammoth';
import { describe, expect, it } from 'vitest';
import { parseExamContent } from '../api/lib/examParser.js';

const examPath = fileURLToPath(new URL(
  '../Hóa/hoa-lop-8-de-thi-thuvienhoclieu-com-de-kiem-tra-giua-hk1-khnt8-kntt-24-25.docx',
  import.meta.url,
));

describe('phân tích đề thi Word', () => {
  it('nhận đúng phần tự luận và đáp án từ bảng hướng dẫn chấm', async () => {
    const buffer = fs.readFileSync(examPath);
    const [rawData, htmlData] = await Promise.all([
      mammoth.extractRawText({ buffer }),
      mammoth.convertToHtml({ buffer }),
    ]);

    const questions = parseExamContent({ text: rawData.value, html: htmlData.value });

    expect(questions).toHaveLength(18);
    expect(questions.slice(0, 12).every((question) => question.type === 'multiple_choice')).toBe(true);
    expect(questions.slice(0, 12).every((question) => (
      Object.values(question.options).every(Boolean)
    ))).toBe(true);
    expect(questions.slice(12).every((question) => question.type === 'essay')).toBe(true);
    expect(questions.slice(0, 12).map((question) => question.correct_answer)).toEqual([
      'C', 'B', 'C', 'D', 'A', 'A', 'D', 'C', 'C', 'A', 'A', 'D',
    ]);
    expect(questions[13].correct_answer).toContain('Nên ngồi thẳng người');
    expect(questions[17].correct_answer).toContain('Lựa chọn thực phẩm đảm bảo vệ sinh');
    expect(questions[17].content).not.toContain('HƯỚNG DẪN CHẤM');
  });

  it('ưu tiên tên dạng câu hỏi trong tiêu đề phần thay vì gán cứng theo số phần', () => {
    const questions = parseExamContent({
      text: [
        'II. TỰ LUẬN (2 điểm)',
        'Câu 1: Trình bày hiện tượng quan sát được.',
        'III. ĐÁP ÁN + HƯỚNG DẪN CHẤM',
      ].join('\n'),
    });

    expect(questions).toHaveLength(1);
    expect(questions[0]).toMatchObject({ part: 2, partNum: 1, type: 'essay' });
  });

  it('vẫn đọc được đúng/sai và trả lời ngắn theo cấu trúc đề 2025', () => {
    const questions = parseExamContent({
      text: [
        'PHẦN II: ĐÚNG/SAI',
        'Câu 1: Xác định tính đúng sai của các mệnh đề.',
        'a) Mệnh đề thứ nhất.',
        'b) Mệnh đề thứ hai.',
        'c) Mệnh đề thứ ba.',
        'd) Mệnh đề thứ tư.',
        'PHẦN III: TRẢ LỜI NGẮN',
        'Câu 1: Tính khối lượng chất tạo thành.',
        'HẾT',
        'PHẦN II: ĐÚNG/SAI',
        'Câu 1: ĐSĐS',
        'PHẦN III: TRẢ LỜI NGẮN',
        'Câu 1: 4,5',
      ].join('\n'),
    });

    expect(questions).toHaveLength(2);
    expect(questions[0]).toMatchObject({
      type: 'true_false',
      correct_answer: { a: true, b: false, c: true, d: false },
    });
    expect(questions[1]).toMatchObject({ type: 'short_answer', correct_answer: '4,5' });
  });
});
