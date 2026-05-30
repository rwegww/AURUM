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
        given: [{ label: 'm(H2O)', value: 9, unit: 'g' }],
        target: { label: 'n(H2O)', unit: 'mol' },
      },
    });

    expect(html).toContain('n = m / M');
    expect(html).toContain('data-arena-model="calculation-experiment"');
    expect(html).toContain('Nhập kết quả');
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
