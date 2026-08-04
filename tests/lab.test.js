import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  balanceEquationText,
  parseSpeciesList,
} from '../src/utils/balancer.js';
import {
  calculateReactionOutcome,
  checkReactionConditions,
  formatStructuredEquation,
  getReactionVisualProfile,
  isStructurallyBalancedReaction,
  normalizeLabFormula,
} from '../src/utils/labChemistry.js';
import { chemicals as labChemicals, reactions as labReactions } from '../src/data/reactions/index.js';
import {
  craftableItems,
  generateCraftableItems,
  getLevelFromXP,
} from '../src/data/labInventory.js';
import useLabStore from '../src/components/lab/three/magic-lab/store.js';

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe('Lab equation balancer', () => {
  it('balances a molecular equation', () => {
    expect(balanceEquationText('H2 + O2 -> H2O')).toMatchObject({
      balanced: true,
      coefficients: [2, 1, 2],
    });
  });

  it('keeps ionic charges and requires charge conservation', () => {
    expect(parseSpeciesList('NH4+ + OH-')).toEqual(['NH4^+', 'OH^-']);
    expect(balanceEquationText('Fe2+ -> Fe3+').balanced).toBe(false);
    expect(balanceEquationText('Fe2+ -> Fe3+ + e-')).toMatchObject({
      balanced: true,
      coefficients: [1, 1, 1],
      equation: 'Fe^2+ → Fe^3+ + e-',
    });
    expect(balanceEquationText('MnO4^- + Fe^2+ + H^+ -> Mn^2+ + Fe^3+ + H2O')).toMatchObject({
      balanced: true,
      coefficients: [1, 5, 8, 1, 5, 4],
    });
  });
});

describe('Lab reaction engine', () => {
  const chemicals = {
    H2: { formula: 'H2', name: 'Hydrogen', state: 'gas' },
    O2: { formula: 'O2', name: 'Oxygen', state: 'gas' },
    H2O: { formula: 'H2O', name: 'Water', state: 'liquid' },
  };
  const reaction = {
    reactants: [{ formula: 'H2', coeff: 2 }, { formula: 'O2', coeff: 1 }],
    products: [{ formula: 'H2O', coeff: 2 }],
  };

  it('consumes reactants by coefficient and preserves the excess', () => {
    const outcome = calculateReactionOutcome(reaction, [
      { id: 'h', formula: 'H2', state: 'gas', amount: 100, unit: 'ml' },
      { id: 'o', formula: 'O2', state: 'gas', amount: 100, unit: 'ml' },
    ], chemicals);

    expect(outcome.productBatches[0]).toMatchObject({ formula: 'H2O', amount: 0.075, unit: 'g' });
    expect(outcome.remainingBatches).toHaveLength(1);
    expect(outcome.remainingBatches[0]).toMatchObject({ formula: 'O2', amount: 50 });
  });

  it('does not invent a quantity for a missing reactant', () => {
    expect(calculateReactionOutcome(reaction, [
      { formula: 'H2', state: 'gas', amount: 100, unit: 'ml' },
    ], chemicals)).toBeNull();
  });

  it('enforces parsed temperature and reports unsupported conditions', () => {
    const heated = { ...reaction, requiresHeat: true, conditions: 'Nhiệt độ > 900°C' };
    expect(checkReactionConditions(heated, { isHeating: true, currentTemp: 25 })).toMatchObject({ met: false });
    expect(checkReactionConditions(heated, { isHeating: true, currentTemp: 950 })).toMatchObject({ met: true });

    const catalytic = { ...reaction, conditions: '450°C, xúc tác Pt', requiresHeat: true };
    expect(checkReactionConditions(catalytic, { isHeating: true, currentTemp: 450 }).missing.join(' ')).toContain('xúc tác');
  });

  it('does not mistake room temperature for a heating requirement', () => {
    const ambient = checkReactionConditions(
      { conditions: 'Nhiệt độ thường' },
      { isHeating: false, currentTemp: 25 },
    );
    const range = checkReactionConditions(
      { conditions: 'Nhiệt độ cao (350-400°C)' },
      { isHeating: true, currentTemp: 350 },
    );

    expect(ambient.met).toBe(true);
    expect(range.met).toBe(true);
    expect(range.requirements.minTemperature).toBe(350);
  });

  it('accepts heating when light is an alternative condition', () => {
    const result = checkReactionConditions(
      { conditions: 'Chiếu sáng hoặc đun nóng' },
      { isHeating: true, currentTemp: 100 },
    );

    expect(result.met).toBe(true);
    expect(result.requirements.unsupported).not.toContain('ánh sáng');
  });

  it('rejects unbalanced structured data and formats from one source of truth', () => {
    expect(isStructurallyBalancedReaction(reaction)).toBe(true);
    expect(formatStructuredEquation(reaction)).toBe('2H2 + O2 → 2H2O');
    expect(isStructurallyBalancedReaction({
      reactants: reaction.reactants,
      products: [{ formula: 'H2O', coeff: 1 }],
    })).toBe(false);
  });

  it('marks only the insoluble product as precipitate', () => {
    const precipitation = labReactions.find(item => item.id === 'rx_030');
    const chemistry = Object.fromEntries(labChemicals.map(item => [item.formula, item]));
    const outcome = calculateReactionOutcome(precipitation, [
      { formula: 'AgNO₃', state: 'liquid', amount: 50, unit: 'ml' },
      { formula: 'NaCl', state: 'liquid', amount: 50, unit: 'ml' },
    ], chemistry);

    expect(outcome.productBatches.find(item => item.formula === 'AgCl')).toMatchObject({
      state: 'solid',
      isPrecipitate: true,
      precipitateAppearance: 'curdy',
    });
    expect(outcome.productBatches.find(item => item.formula === 'NaNO₃')).toMatchObject({
      state: 'liquid',
      isPrecipitate: false,
    });
    expect(precipitation.netIonicEquation).toBe('Ag⁺(aq) + Cl⁻(aq) → AgCl(s)↓');
  });

  it('maps authored animation types to concrete visual effects', () => {
    const burn = getReactionVisualProfile({
      animation: 'burn',
      reactants: [{ formula: 'Mg' }, { formula: 'O₂' }],
    });
    const precipitation = getReactionVisualProfile({}, [{
      formula: 'Cu(OH)₂', state: 'solid', color: '#38bdf8', isPrecipitate: true,
    }]);

    expect(burn).toMatchObject({ activeFlame: true, activeSmoke: true, sound: 'fire' });
    expect(burn.flameColors).toEqual(['#e2e8f0', '#ffffff']);
    expect(precipitation).toMatchObject({
      activePrecipitation: true,
      activeSwirl: true,
      primaryColor: '#38bdf8',
    });
  });
});

describe('Lab authored data integrity', () => {
  it('contains complete chemical references and balanced or declared qualitative reactions', () => {
    const formulas = new Set(labChemicals.map(item => normalizeLabFormula(item.formula)));
    const missingReferences = labReactions.flatMap(reaction => (
      [...reaction.reactants, ...reaction.products]
        .filter(species => !formulas.has(normalizeLabFormula(species.formula)))
        .map(species => `${reaction.id}:${species.formula}`)
    ));
    const invalidReactions = labReactions.filter(reaction => (
      !reaction.isQualitative && !isStructurallyBalancedReaction(reaction)
    ));

    expect(missingReferences).toEqual([]);
    expect(invalidReactions).toEqual([]);
    expect(new Set(labChemicals.map(item => normalizeLabFormula(item.formula))).size).toBe(labChemicals.length);
  });

  it('completes precipitation records with colors and equations', () => {
    const precipitationReactions = labReactions.filter(reaction => (
      reaction.products.some(product => product.isPrecipitate)
    ));

    expect(precipitationReactions.length).toBeGreaterThanOrEqual(20);
    precipitationReactions.forEach((reaction) => {
      expect(reaction.precipitate?.color).toBeTruthy();
      expect(reaction.precipitate?.colorLabel).toBeTruthy();
      expect(reaction.precipitationEquation).toBe(reaction.equation);
    });
  });
});

describe('Magic Lab store integration', () => {
  const chemicals = [
    { formula: 'H2', name: 'Hydrogen', state: 'gas', molarMass: 2.016, color: '#fff' },
    { formula: 'O2', name: 'Oxygen', state: 'gas', molarMass: 31.998, color: '#fff' },
    { formula: 'H2O', name: 'Water', state: 'liquid', molarMass: 18.015, color: '#fff' },
  ];
  const reactions = [{
    id: 'water',
    name: 'Tạo nước',
    reactants: [{ formula: 'H2', coeff: 2 }, { formula: 'O2', coeff: 1 }],
    products: [{ formula: 'H2O', coeff: 2 }],
    conditions: 'Nhiệt độ thường',
  }];

  it('keeps a delayed drop in the beaker that was originally targeted', () => {
    vi.useFakeTimers();
    const store = useLabStore.getState();
    store.resetLabSession(`test-target-${Date.now()}`);
    store.setData(chemicals, reactions, chemicals.map(item => item.formula));
    store.addBeaker();

    useLabStore.getState().setActiveBeaker(0);
    useLabStore.getState().dropToBeaker('H2');
    useLabStore.getState().setActiveBeaker(1);
    vi.advanceTimersByTime(800);

    expect(useLabStore.getState().beakers[0].materialBatches).toHaveLength(1);
    expect(useLabStore.getState().beakers[1].materialBatches).toHaveLength(0);
  });

  it('runs the authored reaction with stoichiometric quantities', () => {
    vi.useFakeTimers();
    const store = useLabStore.getState();
    store.resetLabSession(`test-reaction-${Date.now()}`);
    store.setData(chemicals, reactions, chemicals.map(item => item.formula));

    useLabStore.getState().dropToBeaker('H2');
    vi.advanceTimersByTime(800);
    useLabStore.getState().dropToBeaker('O2');
    vi.advanceTimersByTime(800);

    const batches = useLabStore.getState().beakers[0].materialBatches;
    expect(batches.find(batch => batch.formula === 'O2')?.amount).toBe(50);
    expect(batches.find(batch => batch.formula === 'H2O')).toMatchObject({ amount: 0.075, unit: 'g' });
  });

  it('evaporates only the liquid phase and preserves gas in the vessel', () => {
    vi.useFakeTimers();
    useLabStore.getState().resetLabSession(`test-evaporation-${Date.now()}`);
    const beaker = useLabStore.getState().beakers[0];
    useLabStore.setState({
      beakers: [{
        ...beaker,
        isHeating: true,
        heatTemperature: 100,
        heatTime: 2,
        liquidVolume: 0.05,
        contents: [
          { id: 'liquid', formula: 'H2O', state: 'liquid' },
          { id: 'gas', formula: 'O2', state: 'gas' },
        ],
        materialBatches: [
          { id: 'liquid', formula: 'H2O', state: 'liquid', amount: 10, unit: 'ml' },
          { id: 'gas', formula: 'O2', state: 'gas', amount: 100, unit: 'ml' },
        ],
      }],
    });

    useLabStore.getState().gameTick();

    const current = useLabStore.getState().beakers[0];
    expect(current.contents.map(item => item.formula)).toEqual(['O2']);
    expect(current.materialBatches.map(item => item.formula)).toEqual(['O2']);
  });
});

describe('Lab crafting progression', () => {
  it('uses the same 1000 XP level interval as the backend', () => {
    expect(getLevelFromXP(999).level).toBe(1);
    expect(getLevelFromXP(1000).level).toBe(2);
    expect(getLevelFromXP(2600)).toMatchObject({ level: 3, nextLevelXP: 3000 });
  });

  it('only exposes authored recipes instead of deriving recipes from atoms', () => {
    const generated = generateCraftableItems([
      { cong_thuc: 'C57H104O6', ten: 'Triolein' },
      { cong_thuc: 'H2O', ten: 'Nước' },
    ]);
    expect(generated).toHaveLength(craftableItems.length);
    expect(generated.some(item => item.formula === 'C57H104O6')).toBe(false);
  });
});
