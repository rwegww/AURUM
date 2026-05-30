export { elements } from '../../../src/data/elements.js';
export { enrichElement } from '../../../src/data/elementEnrichment.js';
export { molecules } from '../../../src/data/molecules.js';
export {
  craftableItems,
  getLevelFromXP,
  ingredients,
  initialInventory,
  rarityConfig,
  recipes,
} from '../../../src/data/labInventory.js';
export { arenaQuestions } from '../../../src/data/arenaQuestions.js';
export { CHEM_FORMULAS, QUICK_FORMULAS, UNIT_CONVERSIONS } from '../../../src/data/chemFormulas.js';
export { CORE_KNOWLEDGE_LESSONS } from '../../../src/data/coreKnowledge.js';
export { CHEMISTRY_KNOWLEDGE_BASE } from '../../../src/data/theory.js';
export { class8Data } from '../../../src/data/curriculum/class8.js';
export { class9Data } from '../../../src/data/curriculum/class9.js';
export { class10Data } from '../../../src/data/curriculum/class10.js';
export { class11Data } from '../../../src/data/curriculum/class11.js';
export { class12Data } from '../../../src/data/curriculum/class12.js';
export { balanceEquation, balancingExercises, parseFormula } from '../../../src/utils/balancer.js';
export { stableRange } from '../../../src/utils/stableRandom.js';
export * from '../../../src/data/reactions/index.js';

import { class8Data } from '../../../src/data/curriculum/class8.js';
import { class9Data } from '../../../src/data/curriculum/class9.js';
import { class10Data } from '../../../src/data/curriculum/class10.js';
import { class11Data } from '../../../src/data/curriculum/class11.js';
import { class12Data } from '../../../src/data/curriculum/class12.js';

export const curriculumByGrade = {
  8: class8Data,
  9: class9Data,
  10: class10Data,
  11: class11Data,
  12: class12Data,
};

export const gradeOptions = ['8', '9', '10', '11', '12'];

export const flattenCurriculum = (grade: string | number) => {
  const data = (curriculumByGrade as unknown as Record<string, Record<string, unknown>>)[String(grade)];
  if (!data) return [];
  return Object.values(data).filter(Array.isArray).flat();
};
