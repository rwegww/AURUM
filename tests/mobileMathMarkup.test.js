import { describe, expect, it } from 'vitest';
import { hasMath, renderMathMarkup } from '../apps/mobile/components/journey/mathMarkup.js';

describe('Mobile chemistry formula display', () => {
  it('renders subscript, superscript and fractions with the same KaTeX engine as web', () => {
    const html = renderMathMarkup('Nước $H_2O$, ion $Ca^{2+}$ và $\\frac{m}{V}$.');
    expect(html).toContain('class="katex"');
    expect(html).toContain('msupsub');
    expect(html).toContain('mfrac');
    expect(html).not.toContain('$H_2O$');
  });
  it('preserves plain Vietnamese text and line breaks', () => {
    expect(hasMath('Nước H₂O')).toBe(false);
    expect(renderMathMarkup('Chất\nHỗn hợp')).toBe('Chất<br>Hỗn hợp');
  });
  it('escapes authored HTML and rejects executable math links', () => {
    const html = renderMathMarkup('<img src=x onerror=alert(1)> $\\href{javascript:alert(1)}{x}$');
    expect(html).toContain('&lt;img');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('href="javascript:');
  });
  it('does not crash for incomplete or invalid formulas', () => {
    expect(() => renderMathMarkup('$\\invalidcommand{x}$')).not.toThrow();
    expect(renderMathMarkup('Còn $chưa kết thúc')).toContain('$chưa kết thúc');
  });
});
