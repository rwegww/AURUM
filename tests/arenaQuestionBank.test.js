import { describe, expect, it } from 'vitest';
import { arenaQuestions } from '../src/data/arenaQuestions.js';

const DIFFICULTIES = ['easy', 'medium', 'hard', 'super'];
const GAME_TYPES = ['calculation', 'balancing', 'atom_match', 'electron_match'];

const countAtoms = (formula) => {
  const counts = {};
  const regex = /([A-Z][a-z]?)(\d*)/g;
  let match = regex.exec(formula);

  while (match) {
    const [, element, rawCount] = match;
    counts[element] = (counts[element] || 0) + Number(rawCount || 1);
    match = regex.exec(formula);
  }

  return counts;
};

const countSide = (formulas, coefficients) => formulas.reduce((total, formula, index) => {
  Object.entries(countAtoms(formula)).forEach(([element, count]) => {
    total[element] = (total[element] || 0) + count * coefficients[index];
  });
  return total;
}, {});

describe('ngân hàng câu hỏi Arena PK', () => {
  it('có ít nhất 12 câu và đủ 3 câu cho mỗi dạng ở từng độ khó', () => {
    DIFFICULTIES.forEach((difficulty) => {
      const questions = arenaQuestions[difficulty];
      expect(questions.length).toBeGreaterThanOrEqual(12);

      GAME_TYPES.forEach((gameType) => {
        expect(questions.filter((question) => question.gameType === gameType).length)
          .toBeGreaterThanOrEqual(3);
      });
    });
  });

  it('không trùng mã hoặc nội dung câu hỏi', () => {
    const questions = DIFFICULTIES.flatMap((difficulty) => arenaQuestions[difficulty]);
    expect(new Set(questions.map((question) => question.id)).size).toBe(questions.length);
    expect(new Set(questions.map((question) => question.question)).size).toBe(questions.length);
  });

  it('mọi câu đều có payload, đáp án và giới hạn hợp lệ', () => {
    DIFFICULTIES.flatMap((difficulty) => arenaQuestions[difficulty]).forEach((question) => {
      expect(GAME_TYPES).toContain(question.gameType);
      expect(Object.keys(question.payload || {}).length).toBeGreaterThan(0);
      expect(Object.keys(question.answer || {}).length).toBeGreaterThan(0);
      expect(question.points).toBeGreaterThan(0);
      expect(question.timeLimitSeconds).toBeGreaterThanOrEqual(10);
      expect(question.timeLimitSeconds).toBeLessThanOrEqual(180);
      expect(question.explanation).toBeTruthy();
    });
  });

  it('các phương trình có đáp án thực sự cân bằng', () => {
    DIFFICULTIES.flatMap((difficulty) => arenaQuestions[difficulty])
      .filter((question) => question.gameType === 'balancing')
      .forEach((question) => {
        const { reactants, products } = question.payload.equation;
        const coefficients = question.answer.coefficients;
        const splitIndex = reactants.length;
        expect(countSide(reactants, coefficients.slice(0, splitIndex)))
          .toEqual(countSide(products, coefficients.slice(splitIndex)));
      });
  });

  it('câu ghép nguyên tử khớp công thức phân tử', () => {
    DIFFICULTIES.flatMap((difficulty) => arenaQuestions[difficulty])
      .filter((question) => question.gameType === 'atom_match')
      .forEach((question) => {
        const placementCounts = Object.values(question.answer.placements).reduce((counts, symbol) => ({
          ...counts,
          [symbol]: (counts[symbol] || 0) + 1,
        }), {});
        expect(placementCounts).toEqual(countAtoms(question.payload.formula));
        expect(Object.keys(question.answer.placements).sort())
          .toEqual(question.payload.slots.map((slot) => slot.id).sort());
      });
  });

  it('tổng electron khớp số hiệu nguyên tử', () => {
    DIFFICULTIES.flatMap((difficulty) => arenaQuestions[difficulty])
      .filter((question) => question.gameType === 'electron_match')
      .forEach((question) => {
        const total = question.answer.shells.reduce((sum, value) => sum + value, 0);
        expect(total).toBe(question.payload.atomicNumber);
        expect(question.answer.shells).toHaveLength(question.payload.shellLabels.length);
      });
  });
});
