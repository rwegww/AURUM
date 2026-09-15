import { describe, expect, it } from 'vitest';
import { renderTheoryMarkup } from '../apps/mobile/components/journey/theoryMarkup';

describe('Nội dung bài giảng mobile', () => {
  it('giữ bảng, định dạng và công thức trong nội dung Markdown', () => {
    const html = renderTheoryMarkup([{ type: 'markdown', content: { text: '**Nước** có công thức $H_2O$.\n\n| Chất | Công thức |\n| --- | --- |\n| Nước | $H_2O$ |' } }]);
    expect(html).toContain('<strong>Nước</strong>');
    expect(html).toContain('<table>');
    expect(html).toContain('class="katex"');
    expect(html).not.toContain('$H_2O$');
  });
  it('không biến công thức trong đoạn mã thành HTML', () => {
    const html = renderTheoryMarkup([{ type: 'paragraph', content: { text: '`$H_2O$`' } }]);
    expect(html).toContain('<code>$H_2O$</code>');
    expect(html).not.toContain('katex');
  });
  it('chặn HTML và URL thực thi trong bài giảng hoặc khung chú ý', () => {
    const html = renderTheoryMarkup([{ type: 'warningBox', content: { title: '<script>alert(1)</script>', content: '[bấm](javascript:alert(1))\n<img src=x onerror=alert(1)>' } }]);
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('href="javascript:');
    expect(html).toContain('class="warning"');
  });
  it('xử lý đủ loại module của website và bỏ qua dữ liệu thiếu', () => {
    const html = renderTheoryMarkup([null, { type: 'heading', content: { level: 'h3', text: 'II. Nguyên tử' } }, { type: 'list', content: { items: ['Một', 'Hai'] } }, { type: 'infoBox', content: { title: 'Ghi nhớ', content: 'Dòng 1\\nDòng 2' } }]);
    expect(html).toContain('<h3>Nguyên tử</h3>');
    expect(html.match(/<li>/g)).toHaveLength(2);
    expect(html).toContain('class="info"');
    expect(html).toContain('<br>');
    expect(renderTheoryMarkup(null)).toBe('');
  });
});
