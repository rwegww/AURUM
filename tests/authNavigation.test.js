import { describe, expect, it } from 'vitest';
import { getPostLoginPath } from '../src/utils/authNavigation.js';

describe('điều hướng sau đăng nhập', () => {
  it('đưa quản trị viên trở lại đúng màn hình admin đã mở', () => {
    expect(getPostLoginPath(
      { role: 'admin' },
      { pathname: '/admin/nguoi_dung/user-1', search: '?tab=progress', hash: '#recent' },
    )).toBe('/admin/nguoi_dung/user-1?tab=progress#recent');
  });

  it('không đưa người không có quyền vào màn hình admin', () => {
    expect(getPostLoginPath(
      { role: 'student' },
      { pathname: '/admin/approvals' },
    )).toBe('/');
  });

  it('cho phép quản trị viên mở màn hình giáo viên', () => {
    expect(getPostLoginPath(
      { role: 'admin' },
      { pathname: '/teacher/lop/class-1' },
    )).toBe('/teacher/lop/class-1');
  });
});
