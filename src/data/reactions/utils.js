export const findReaction = (reactantFormulas, isHeating = false) => {
  if (!reactantFormulas || reactantFormulas.length === 0) return null;

  // Clean nulls from A/B selection
  const formulas = reactantFormulas.filter(f => f !== null && f !== undefined);

  return reactions.find(rx => {
    const rxReactantFormulas = rx.reactants.map(r => r.formula);

    // Match number of reactants
    if (rxReactantFormulas.length !== formulas.length) return false;

    // Match exact formulas
    const matchReactants = formulas.every(f => rxReactantFormulas.includes(f));

    // Check heat condition if required
    if (rx.requiresHeat && !isHeating) return false;

    return matchReactants;
  });
};