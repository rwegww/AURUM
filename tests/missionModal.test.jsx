import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}));

const { default: MissionModal } = await import('../src/components/lessons/MissionModal.jsx');

describe('MissionModal', () => {
  it('does not invent a challenge or unlock progress when lesson data is empty', () => {
    const onUnlock = vi.fn();
    const html = renderToStaticMarkup(
      <MissionModal
        challenges={[]}
        lessonTitle="Bài học chưa cấu hình"
        onUnlock={onUnlock}
        onCancel={vi.fn()}
      />,
    );

    expect(html).toContain('Chưa có thử thách hợp lệ');
    expect(html).toContain('Tiến độ sẽ không được mở khóa');
    expect(html).not.toContain('Cốc thủy tinh');
    expect(onUnlock).not.toHaveBeenCalled();
  });
});
