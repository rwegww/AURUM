import { describe, expect, it } from 'vitest';
import {
  formatSgkLessonReference,
  getAurumLessonOrder,
  getLessonDisplayTitle,
  getSgkLessonNumber,
} from '../src/utils/lessonLabels.js';

describe('lessonLabels', () => {
  it('keeps AURUM sequence separate from a sparse SGK lesson number', () => {
    const lesson = {
      id: 'hoa6_kntt_bai6',
      lessonId: 'hoa6_kntt_bai6',
      order: 6,
      title: 'Bài 6: Đo khối lượng',
    };

    expect(getAurumLessonOrder(lesson, 1)).toBe(2);
    expect(getSgkLessonNumber(lesson)).toBe(6);
    expect(getLessonDisplayTitle(lesson)).toBe('Đo khối lượng');
    expect(formatSgkLessonReference(lesson)).toBe('Bài 6: Đo khối lượng - SGK');
  });

  it('reads SGK lesson number from numeric local lesson ids', () => {
    const lesson = {
      lessonId: 3,
      order: 3,
      title: 'Bài 3: Mol và tỉ khối chất khí',
    };

    expect(getSgkLessonNumber(lesson)).toBe(3);
    expect(formatSgkLessonReference(lesson)).toBe('Bài 3: Mol và tỉ khối chất khí - SGK');
  });

  it('supports lesson titles that use a dot after the number', () => {
    const lesson = {
      id: 'hoa12_kntt_bai31',
      lessonId: 'hoa12_kntt_bai31',
      order: 31,
      title: 'Bài 31. Kiểm tra tổng hợp - Ôn thi Tốt nghiệp THPT',
    };

    expect(getAurumLessonOrder(lesson, 29)).toBe(30);
    expect(getSgkLessonNumber(lesson)).toBe(31);
    expect(getLessonDisplayTitle(lesson)).toBe('Kiểm tra tổng hợp - Ôn thi Tốt nghiệp THPT');
  });
});
