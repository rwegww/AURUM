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
    expect(html).toContain('CÃ¢n Ä‘iá»‡n tá»­');
    expect(html).toContain('Máº«u cÃ¢n');
    expect(html).toContain('M(H2O)');
    expect(html).toContain('Giai Ä‘oáº¡n 1');
    expect(html).not.toContain('ThÃ´ng sá»‘ cá»‘ Ä‘á»‹nh');
    expect(html).not.toContain('Nháº­p káº¿t quáº£');
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

    expect(html).toContain('Thu khÃ­ á»Ÿ nÆ°á»›c');
    expect(html).toContain('n = V / 22,4; m = n.M');
    expect(html).toContain('TÃ­nh n(H2)');
    expect(html).toContain('TÃ­nh m(Zn)');
    expect(html).toContain('data-arena-model="experiment-controls"');
    expect(html).toContain('V mol Ä‘ktc');
    expect(html).toContain('Giai Ä‘oáº¡n 1/2');
    expect(html).toContain('Sang giai Ä‘oáº¡n 2');
    expect(html).not.toContain('Ãp dá»¥ng');
    expect(html).not.toContain('ThÃ´ng sá»‘ cá»‘ Ä‘á»‹nh');
    expect(html).not.toContain('ChÆ°a cÃ³ mÃ´ hÃ¬nh cÃ´ng thá»©c cho cÃ¢u nÃ y.');
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
        slots: [{ id: 'center', label: 'TÃ¢m' }],
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

    expect(html).toContain('Lá»›p K');
    expect(html).toContain('Z = 8');
  });
});

