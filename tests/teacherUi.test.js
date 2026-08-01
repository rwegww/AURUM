import { describe, expect, it } from 'vitest';
import {
  formatTeacherDateTime,
  localDateTimeToIso,
  toDateTimeLocalValue,
  toNonNegativeInteger,
} from '../src/utils/teacherUi.js';

describe('tiện ích giao diện giáo viên', () => {
  it('không hiển thị Invalid Date khi dữ liệu ngày giờ bị lỗi', () => {
    expect(formatTeacherDateTime('not-a-date')).toBe('Không rõ thời gian');
    expect(formatTeacherDateTime(null, 'Chưa có')).toBe('Chưa có');
  });

  it('chuyển datetime-local sang ISO và từ chối giá trị không hợp lệ', () => {
    const iso = localDateTimeToIso('2030-05-12T08:30');
    expect(Number.isNaN(new Date(iso).getTime())).toBe(false);
    expect(localDateTimeToIso('not-a-date')).toBe('');
  });

  it('tạo giá trị datetime-local theo múi giờ của trình duyệt', () => {
    const localDate = new Date(2030, 4, 12, 8, 5, 42);
    expect(toDateTimeLocalValue(localDate)).toBe('2030-05-12T08:05');
  });

  it('chuẩn hóa số lượng để dữ liệu lỗi không làm hỏng giao diện', () => {
    expect(toNonNegativeInteger('12.9')).toBe(12);
    expect(toNonNegativeInteger(-1)).toBe(0);
    expect(toNonNegativeInteger('không phải số')).toBe(0);
  });
});
