import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { MiniGameRenderer } from '../src/components/arena/ArenaBattleRoom.jsx';

const renderGame = (task) => renderToStaticMarkup(
  <MiniGameRenderer
    task={task}
    onSubmit={vi.fn()}
    submitting={false}
    disabled={false}
  />,
);

describe('arena mini game renderers', () => {
  it('renders the calculation mini game controls', () => {
    const html = renderGame({
      id: 'calc',
      gameType: 'calculation',
      payload: {
        formula: 'n = m / M',
        given: [
          { label: 'm(H2O)', value: 9, unit: 'g' },
          { label: 'M(H2O)', value: 18, unit: 'g/mol' },
        ],
        target: { label: 'n(H2O)', unit: 'mol' },
      },
    });

    expect(html).toContain('n = m / M');
    expect(html).toContain('data-arena-model="formula-calculator"');
    expect(html).toContain('data-arena-model="calculation-experiment"');
    expect(html).toContain('data-arena-model="experiment-controls"');
    expect(html).toContain('Cân điện tử');
    expect(html).toContain('Mẫu cân');
    expect(html).toContain('M(H2O)');
    expect(html).toContain('Giai đoạn 1');
    expect(html).not.toContain('Thông số cố định');
    expect(html).not.toContain('Nhập kết quả');
  });

  it('builds a formula model from legacy calculation payloads', () => {
    const html = renderGame({
      id: 'legacy-zinc',
      gameType: 'calculation',
      payload: {
        visual: 'gas',
        formula: 'n = V / 22,4; m = n.M',
        given: [
          { label: 'V(H2)', value: 2.24, unit: 'L' },
          { label: 'M(Zn)', value: 65, unit: 'g/mol' },
        ],
        target: { label: 'm(Zn)', unit: 'g' },
      },
    });

    expect(html).toContain('Thu khí ở nước');
    expect(html).toContain('n = V / 22,4; m = n.M');
    expect(html).toContain('Tính n(H2)');
    expect(html).toContain('Tính m(Zn)');
    expect(html).toContain('data-arena-model="experiment-controls"');
    expect(html).toContain('V mol đktc');
    expect(html).toContain('Giai đoạn 1/2');
    expect(html).toContain('Sang giai đoạn 2');
    expect(html).not.toContain('Áp dụng');
    expect(html).not.toContain('Thông số cố định');
    expect(html).not.toContain('Chưa có mô hình công thức cho câu này.');
  });

  it('renders the balancing mini game controls', () => {
    const html = renderGame({
      id: 'balance',
      gameType: 'balancing',
      payload: {
        equation: { reactants: ['H2', 'O2'], products: ['H2O'] },
        minCoefficient: 1,
        maxCoefficient: 6,
      },
    });

    expect(html).toContain('H2');
    expect(html).toContain('data-arena-model="balancing-scale"');
  });

  it('renders the atom matching mini game controls', () => {
    const html = renderGame({
      id: 'atom',
      gameType: 'atom_match',
      payload: {
        formula: 'H2O',
        slots: [{ id: 'center', label: 'Tâm' }],
        choices: [{ symbol: 'O', name: 'Oxi' }],
      },
    });

    expect(html).toContain('H2O');
    expect(html).toContain('Oxi');
    expect(html).toContain('data-arena-model="atom-drag-drop"');
  });

  it('renders the electron matching mini game controls', () => {
    const html = renderGame({
      id: 'electron',
      gameType: 'electron_match',
      payload: {
        symbol: 'O',
        atomicNumber: 8,
        shellLabels: ['K', 'L'],
      },
    });

    expect(html).toContain('Lớp K');
    expect(html).toContain('Z = 8');
  });
});
