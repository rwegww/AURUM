import { reactionsCore } from './reactions_core.js';
import { reactionsBatch1_2 } from './reactions_batch_1_2.js';
import { reactionsBatch3_4 } from './reactions_batch_3_4.js';
import { reactionsBatch5 } from './reactions_batch_5.js';
import { chemicals } from './chemicals.js';
import { unlockRequirements } from './unlockRequirements.js';
import { reactionTypes } from './constants.js';

export const reactions = [
  ...reactionsCore,
  ...reactionsBatch1_2,
  ...reactionsBatch3_4,
  ...reactionsBatch5,
];

export { chemicals, unlockRequirements, reactionTypes };

// Find reaction helper
export const findReaction = (reactantFormulas, isHeating = false) => {
  if (!reactantFormulas || reactantFormulas.length === 0) return null;
  const formulas = reactantFormulas.filter(f => f !== null && f !== undefined);

  return reactions.find(rx => {
    const rxReactantFormulas = rx.reactants.map(r => r.formula);
    if (rxReactantFormulas.length !== formulas.length) return false;
    const matchReactants = formulas.every(f => rxReactantFormulas.includes(f));
    if (rx.requiresHeat && !isHeating) return false;
    return matchReactants;
  });
};
