import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import JourneyManager from '../src/pages/admin/JourneyManager';
import AdminDashboard from '../src/pages/admin/AdminDashboard';
import ApprovalManager from '../src/pages/admin/ApprovalManager';
import FeedbackManager from '../src/pages/admin/FeedbackManager';
import LessonManager from '../src/pages/admin/LessonManager';
import JourneyDetail from '../src/pages/admin/JourneyDetail';
import UserManager from '../src/pages/admin/UserManager';
import UserDetail from '../src/pages/admin/UserDetail';

vi.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'admin-fixture', role: 'admin', username: 'Quản trị kiểm thử' } }),
}));

describe('admin screen rendering', () => {
  it('renders journey order state without shadowing the built-in Map constructor', () => {
    const html = renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(JourneyManager)));
    expect(html).toContain('Hành trình');
    expect(html).toContain('Đang tải hành trình');
  });

  it.each([
    ['dashboard', AdminDashboard],
    ['approvals', ApprovalManager],
    ['feedback', FeedbackManager],
    ['lessons', LessonManager],
    ['journey detail', JourneyDetail],
    ['users', UserManager],
    ['user detail', UserDetail],
  ])('renders the initial %s screen without a runtime exception', (_name, Component) => {
    const html = renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(Component)));
    expect(html.length).toBeGreaterThan(0);
  });
});
