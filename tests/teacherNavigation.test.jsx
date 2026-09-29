import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import TeacherLayout from '../src/components/layout/TeacherLayout';
import { NotificationPanel } from '../src/components/navigation/ManagementHeader';
import Navbar from '../src/components/navigation/Navbar';

vi.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'teacher-fixture',
      role: 'teacher',
      username: 'Giáo viên kiểm thử',
      streakCount: 0,
    },
    isLoggedIn: true,
    logout: vi.fn(),
    recoverStreak: vi.fn(),
    resetStreak: vi.fn(),
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => ({
      'nav.teacher_portal': 'CỔNG GIÁO VIÊN',
      'nav.open_menu': 'Mở trình đơn chính',
      'nav.close_menu': 'Đóng trình đơn chính',
    })[key] || key,
    i18n: { language: 'vi', changeLanguage: vi.fn() },
  }),
}));

const renderTeacherLayout = (path) => renderToStaticMarkup(
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/teacher" element={<TeacherLayout />}>
        <Route path="*" element={<div>Nội dung kiểm thử</div>} />
      </Route>
    </Routes>
  </MemoryRouter>,
);

const getLinkTags = (html, href) => (
  [...html.matchAll(new RegExp(`<a[^>]*href="${href}"[^>]*>`, 'g'))].map(([tag]) => tag)
);

describe('điều hướng cổng giáo viên', () => {
  it('render an toàn phía máy chủ và cung cấp thông báo trên mobile', () => {
    const html = renderTeacherLayout('/teacher');

    expect(html).toContain('aria-controls="management-mobile-menu"');
    expect(html).toContain('AURUM');
  });

  it('chỉ đánh dấu đúng mục cha khi đang xem chi tiết lớp', () => {
    const html = renderTeacherLayout('/teacher/lop/class-1');
    const classLinks = getLinkTags(html, '/teacher/lop');
    const overviewLinks = getLinkTags(html, '/teacher');

    expect(classLinks).toHaveLength(1);
    expect(classLinks.every((tag) => tag.includes('aria-current="page"'))).toBe(true);
    expect(overviewLinks).toHaveLength(1);
    expect(overviewLinks.every((tag) => !tag.includes('aria-current="page"'))).toBe(true);
  });

  it('cung cấp đầy đủ lối vào các chức năng học sinh', () => {
    const html = renderTeacherLayout('/teacher');

    for (const href of ['/', '/classroom', '/my-class', '/lab', '/arena', '/library']) {
      expect(html).toContain(`href="${href}"`);
    }
  });

  it('không lồng nút đổi trạng thái vào liên kết thông báo', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-05T10:00:00+07:00'));

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <NotificationPanel
          id="teacher-notifications-test"
          className=""
          notifications={[{
            id: 'submission-1',
            type: 'submission',
            title: 'Học sinh nộp bài',
            message: 'Một bài nộp mới',
            timestamp: '2026-09-05T09:55:00+07:00',
            link: '/teacher/assignments',
          }]}
          readIds={[]}
          unreadCount={1}
          onClose={vi.fn()}
          onMarkAllAsRead={vi.fn()}
          onOpenNotification={vi.fn()}
          onToggleReadStatus={vi.fn()}
        />
      </MemoryRouter>,
    );

    const linkStart = html.indexOf('href="/teacher/assignments"');
    const linkEnd = html.indexOf('</a>', linkStart);
    const toggleButton = html.indexOf('aria-label="Đánh dấu là đã đọc"', linkStart);

    expect(linkStart).toBeGreaterThan(-1);
    expect(linkEnd).toBeGreaterThan(linkStart);
    expect(toggleButton).toBeGreaterThan(linkEnd);
    expect(html).toContain('5 phút trước');

    vi.useRealTimers();
  });

  it('hiển thị lối vào cổng giáo viên trong menu chính trên mobile', () => {
    const useStateSpy = vi.spyOn(React, 'useState');
    useStateSpy.mockImplementationOnce(() => [true, vi.fn()]);

    try {
      const html = renderToStaticMarkup(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>,
      );

      expect(html).toContain('id="main-mobile-navigation"');
      expect(html).toContain('aria-label="Đóng trình đơn chính"');
      expect(html).toContain('href="/teacher"');
      expect(html).toContain('CỔNG GIÁO VIÊN');
    } finally {
      useStateSpy.mockRestore();
    }
  });
});
