import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const authFixture = vi.hoisted(() => ({ value: {} }));

vi.mock('../src/context/AuthContext', () => ({
  useAuth: () => authFixture.value,
}));

vi.mock('react-i18next', () => ({
  Trans: ({ children }) => children,
  useTranslation: () => ({
    t: (key, options = {}) => {
      if (key === 'common.grade') return `Lớp ${options.grade}`;
      const gradeMatch = key.match(/^classroom\.grades\.(\d+)\.title$/);
      if (gradeMatch) return `Hành trình khối ${gradeMatch[1]}`;
      if (key.endsWith('.desc')) return 'Mô tả hành trình';
      if (key === 'classroom.enter_class') return 'Vào lớp học';
      if (key === 'classroom.knowledge_tree.title') return 'Cây Kiến Thức Tổng';
      if (key === 'classroom.knowledge_tree.subtitle') return 'Bản đồ kiến thức';
      if (key === 'classroom.knowledge_tree.academic_map') return 'BẢN ĐỒ KIẾN THỨC';
      return key;
    },
  }),
}));

const { default: Classroom } = await import('../src/pages/student/Classroom.jsx');

const renderClassroom = () => renderToStaticMarkup(
  <MemoryRouter>
    <Classroom />
  </MemoryRouter>,
);

describe('initial placement rendering', () => {
  beforeEach(() => {
    authFixture.value = {
      user: {
        role: 'student',
        balancingProgress: {
          placement: { required: true, status: 'unassigned', assignedGrade: null, attempts: 0, history: [] },
        },
      },
      startGradePlacement: vi.fn(),
      submitGradePlacement: vi.fn(),
    };
  });

  it('asks an unassigned new student to choose from grades 6 through 12', () => {
    const html = renderClassroom();

    expect(html).toContain('Bạn chưa được xếp lớp');
    expect(html).toContain('Hành trình khối 6');
    expect(html).toContain('Hành trình khối 12');
    expect((html.match(/Chọn khối này/g) || [])).toHaveLength(7);
    expect(html).not.toContain('Cây Kiến Thức Tổng');
  });

  it('shows only the confirmed grade and the knowledge map after placement', () => {
    authFixture.value.user.balancingProgress.placement = {
      required: true,
      status: 'placed',
      assignedGrade: '9',
      selectedGrade: '9',
    };

    const html = renderClassroom();

    expect(html).toContain('Đã xác nhận khối 9');
    expect(html).toContain('Hành trình khối 9');
    expect(html).not.toContain('Hành trình khối 8');
    expect(html).not.toContain('Hành trình khối 10');
    expect(html).toContain('Cây Kiến Thức Tổng');
  });
});
