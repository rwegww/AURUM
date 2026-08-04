import { parseFormula } from './balancer.js';

const SUBSCRIPT_DIGITS = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
  '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
};

export const ATOMIC_WEIGHTS = {
  H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011,
  N: 14.007, O: 15.999, F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305,
  Al: 26.982, Si: 28.085, P: 30.974, S: 32.06, Cl: 35.45, K: 39.098,
  Ar: 39.948, Ca: 40.078, Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996,
  Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38,
  Ga: 69.723, Ge: 72.630, As: 74.922, Se: 78.971, Br: 79.904, Kr: 83.798,
  Rb: 85.468, Sr: 87.62, Ag: 107.868, Sn: 118.710, I: 126.904, Ba: 137.327,
  Pt: 195.084, Au: 196.967, Hg: 200.592, Pb: 207.2,
};

export const normalizeLabFormula = (formula) => String(formula || '')
  .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (digit) => SUBSCRIPT_DIGITS[digit] || digit)
  .replace(/\s+/g, '')
  .trim()
  .toUpperCase();

export const calculateMolarMass = (formula) => {
  try {
    const counts = parseFormula(formula);
    const mass = Object.entries(counts).reduce(
      (total, [element, count]) => total + (ATOMIC_WEIGHTS[element] || 0) * count,
      0,
    );
    return mass > 0 ? mass : null;
  } catch {
    return null;
  }
};

const getChemical = (chemicals, formula) => {
  const normalized = normalizeLabFormula(formula);
  return chemicals?.[formula]
    || chemicals?.[normalized]
    || Object.values(chemicals || {}).find((item) => normalizeLabFormula(item.formula) === normalized)
    || {};
};

export const batchToMoles = (batch, chemical = {}) => {
  if (Number.isFinite(batch?.moles) && batch.moles >= 0) return batch.moles;

  const amount = Number(batch?.amount);
  if (!Number.isFinite(amount) || amount <= 0) return 0;

  const unit = String(batch?.unit || '').toLowerCase();
  const state = batch?.state || chemical?.state;
  const molarMass = Number(chemical?.molarMass || chemical?.molar_mass) || calculateMolarMass(batch?.formula);

  if (unit === 'mol') return amount;
  if (state === 'gas' && (unit === 'ml' || unit === 'l')) {
    const liters = unit === 'ml' ? amount / 1000 : amount;
    return liters / 24; // Thể tích mol gần ĐK phòng (25°C, 1 atm).
  }
  if (unit === 'ml' && state === 'liquid') {
    const concentration = Number(batch?.concentrationM || chemical?.concentrationM || chemical?.molarity) || 1;
    return (amount / 1000) * concentration;
  }
  if (!molarMass) return 0;
  return amount / molarMass;
};

const molesToDisplayAmount = (moles, chemical, formula) => {
  const state = chemical?.state || 'liquid';
  if (state === 'gas') {
    const liters = moles * 24;
    return liters >= 1
      ? { amount: Number(liters.toFixed(3)), unit: 'L' }
      : { amount: Number((liters * 1000).toFixed(1)), unit: 'ml' };
  }

  const molarMass = Number(chemical?.molarMass || chemical?.molar_mass) || calculateMolarMass(formula);
  return {
    amount: Number((moles * (molarMass || 1)).toFixed(3)),
    unit: molarMass ? 'g' : 'mol',
  };
};

const extractTemperature = (conditionText) => {
  const match = conditionText.match(/(\d{2,4})(?:\s*-\s*\d{2,4})?\s*°?\s*c/i);
  return match ? Number(match[1]) : null;
};

export const getReactionRequirements = (reaction = {}) => {
  const conditionText = String(reaction.conditions || '').toLowerCase();
  const parsedTemperature = extractTemperature(conditionText);
  const hasMaximumTemperature = /dưới|thấp hơn|không quá|<\s*\d/.test(conditionText);
  const isAmbientTemperature = /nhiệt độ (thường|phòng)|điều kiện thường/.test(conditionText);
  const requiresMolten = conditionText.includes('nóng chảy');
  const hasHeatingCue = /gia nhiệt|đun|đốt|nung|nóng đỏ|nhiệt độ (?:cao|rất cao)|nhiệt độ\s*[>~]/.test(conditionText);
  const requiresHeat = Boolean(reaction.requires_heat ?? reaction.requiresHeat)
    || requiresMolten
    || (!hasMaximumTemperature && !isAmbientTemperature && (
      hasHeatingCue || (parsedTemperature !== null && parsedTemperature > 25)
    ));
  const requiresElectrolysis = conditionText.includes('điện phân');
  const explicitTemperature = Number(reaction.minTemp || reaction.min_temp)
    || (hasMaximumTemperature ? null : parsedTemperature);
  const inferredTemperature = requiresMolten
    ? (conditionText.includes('phenol') ? 50 : 500)
    : /nóng đỏ|rất cao|>\u00a0?900|trên 900/.test(conditionText)
      ? 900
      : requiresHeat ? 100 : 25;
  const minTemperature = explicitTemperature || inferredTemperature;

  const unsupported = [];
  if (conditionText.includes('xúc tác')) unsupported.push('xúc tác');
  const requiresLight = /ánh sáng|chiếu sáng|tia uv|tia tử ngoại/.test(conditionText);
  const lightHasHeatingAlternative = requiresLight && conditionText.includes('hoặc') && hasHeatingCue;
  if (requiresLight && !lightHasHeatingAlternative) unsupported.push('ánh sáng');
  if (/áp suất|\batm\b/.test(conditionText)) unsupported.push('áp suất');
  if (/môi trường (axit|bazơ|kiềm)/.test(conditionText)) unsupported.push('môi trường phản ứng');
  if (/làm lạnh|nhiệt độ (?:thấp|rất thấp)/.test(conditionText)) unsupported.push('làm lạnh');

  return {
    requiresHeat,
    requiresElectrolysis,
    requiresMolten,
    minTemperature,
    maxTemperature: hasMaximumTemperature ? parsedTemperature : null,
    unsupported: Array.from(new Set(unsupported)),
  };
};

export const checkReactionConditions = (reaction, environment = {}) => {
  const requirements = getReactionRequirements(reaction);
  const missing = [];
  const currentTemperature = Number(environment.currentTemp) || 25;

  if (requirements.requiresHeat && !environment.isHeating) missing.push('Cần bật gia nhiệt');
  if (requirements.requiresHeat && currentTemperature < requirements.minTemperature) {
    missing.push(`Cần đạt tối thiểu ${requirements.minTemperature}°C`);
  }
  if (requirements.maxTemperature && currentTemperature >= requirements.maxTemperature) {
    missing.push(`Cần giữ nhiệt độ dưới ${requirements.maxTemperature}°C`);
  }
  if (requirements.requiresElectrolysis && !environment.isElectrolyzing) missing.push('Cần bật điện phân');
  if (requirements.unsupported.length > 0) {
    missing.push(`Chưa hỗ trợ: ${requirements.unsupported.join(', ')}`);
  }

  return { met: missing.length === 0, missing, requirements };
};

const getCoefficient = (species) => {
  const value = Number(typeof species === 'string' ? 1 : species?.coeff ?? species?.coefficient ?? species?.ratio ?? 1);
  return Number.isFinite(value) && value > 0 ? value : 1;
};

const getSpeciesFormula = (species) => typeof species === 'string'
  ? species
  : species?.formula || species?.name || '';

const isNeutralVisualColor = color => !color
  || color === '#ffffff'
  || color === '#f8fafc'
  || color === '#f1f5f9'
  || String(color).includes('255,255,255');

const getFlamePalette = (reaction) => {
  const reactants = new Set((reaction.reactants || []).map(item => normalizeLabFormula(getSpeciesFormula(item))));
  if (reactants.has('K')) return ['#7c3aed', '#e9d5ff'];
  if (reactants.has('NA')) return ['#f59e0b', '#fef08a'];
  if (reactants.has('CU') || [...reactants].some(formula => formula.startsWith('CU'))) return ['#059669', '#a7f3d0'];
  if (reactants.has('MG') || reactants.has('AL')) return ['#e2e8f0', '#ffffff'];
  if (reactants.has('H2')) return ['#2563eb', '#bfdbfe'];
  if (reactants.has('S')) return ['#2563eb', '#93c5fd'];
  return ['#ea580c', '#fef08a'];
};

export const getReactionVisualProfile = (reaction = {}, productBatches = [], chemicals = {}) => {
  const animation = String(reaction.animation || 'mix').toLowerCase();
  const gasProducts = productBatches.filter((product) => {
    const chemical = getChemical(chemicals, product.formula);
    return (product.state || chemical.state) === 'gas';
  });
  const precipitateProducts = productBatches.filter(product => product.isPrecipitate);
  const coloredProduct = productBatches.find((product) => {
    const chemical = getChemical(chemicals, product.formula);
    return !isNeutralVisualColor(product.color || chemical.color);
  });
  const coloredChemical = coloredProduct ? getChemical(chemicals, coloredProduct.formula) : {};
  const gasFormula = normalizeLabFormula(gasProducts[0]?.formula);
  const smokeColors = {
    NO2: '#9a3412',
    CL2: '#84cc16',
    BR2: '#7c2d12',
    I2: '#7e22ce',
  };
  const isExplosion = animation === 'explosion' || /\bnổ\b/i.test(reaction.name || '');
  const isBurning = animation === 'burn' || animation === 'combustion';
  const isFizzing = animation === 'fizz' || gasProducts.length > 0;
  const isSmoking = animation.startsWith('smoke') || isBurning || isExplosion || gasProducts.length > 0;
  const isColorChange = animation === 'color-change';
  const isMixing = animation === 'mix' || animation === 'synthesis' || isColorChange;
  const hasPrecipitation = precipitateProducts.length > 0;
  const intensity = isExplosion ? 'extreme' : (isBurning || gasProducts.length > 0 ? 'high' : (hasPrecipitation ? 'medium' : 'low'));

  return {
    type: hasPrecipitation ? 'precipitation' : animation,
    sound: isExplosion ? 'explosion' : (isBurning ? 'fire' : (isFizzing ? 'fizz' : (isSmoking ? 'smoke' : null))),
    activeBubbles: isFizzing,
    activeFlame: isExplosion || isBurning,
    activeSmoke: isSmoking,
    activeSwirl: isMixing || hasPrecipitation,
    activePrecipitation: hasPrecipitation,
    shake: isExplosion,
    intensity,
    duration: isExplosion ? 2800 : (isBurning ? 4500 : 5000),
    smokeColor: animation === 'smoke_purple' ? '#a855f7' : (smokeColors[gasFormula] || '#e2e8f0'),
    primaryColor: precipitateProducts[0]?.color || coloredProduct?.color || coloredChemical.color || '#60a5fa',
    secondaryColor: isColorChange ? '#ffffff' : '#93c5fd',
    flameColors: getFlamePalette(reaction),
  };
};

export const calculateReactionOutcome = (reaction, batches = [], chemicals = {}) => {
  const reactants = Array.isArray(reaction?.reactants) ? reaction.reactants : [];
  const products = Array.isArray(reaction?.products) ? reaction.products : [];
  if (reactants.length === 0 || products.length === 0) return null;

  const availableByFormula = new Map();
  batches.forEach((batch) => {
    const formula = normalizeLabFormula(batch.formula);
    const moles = batchToMoles(batch, getChemical(chemicals, batch.formula));
    if (formula && moles > 0) availableByFormula.set(formula, (availableByFormula.get(formula) || 0) + moles);
  });

  let extent = Infinity;
  for (const reactant of reactants) {
    const formula = normalizeLabFormula(getSpeciesFormula(reactant));
    const available = availableByFormula.get(formula) || 0;
    if (available <= 0) return null;
    extent = Math.min(extent, available / getCoefficient(reactant));
  }
  if (!Number.isFinite(extent) || extent <= 0) return null;

  const toConsume = new Map(reactants.map((reactant) => [
    normalizeLabFormula(getSpeciesFormula(reactant)),
    extent * getCoefficient(reactant),
  ]));

  const remainingBatches = [];
  batches.forEach((batch) => {
    const formula = normalizeLabFormula(batch.formula);
    let remainingConsumption = toConsume.get(formula) || 0;
    const chemical = getChemical(chemicals, batch.formula);
    const batchMoles = batchToMoles(batch, chemical);

    if (remainingConsumption <= 0 || batchMoles <= 0) {
      remainingBatches.push({ ...batch, moles: batchMoles });
      return;
    }

    const consumed = Math.min(batchMoles, remainingConsumption);
    toConsume.set(formula, Math.max(0, remainingConsumption - consumed));
    const molesLeft = batchMoles - consumed;
    if (molesLeft > 1e-9) {
      const ratio = molesLeft / batchMoles;
      remainingBatches.push({
        ...batch,
        amount: Number((Number(batch.amount) * ratio).toFixed(4)),
        moles: molesLeft,
      });
    }
  });

  const productBatches = products.map((product) => {
    const formula = getSpeciesFormula(product);
    const chemical = getChemical(chemicals, formula);
    const moles = extent * getCoefficient(product);
    return {
      formula,
      name: chemical.name || product?.name || formula,
      state: product?.state || chemical.state || 'liquid',
      color: product?.color || chemical.color || '#ffffff',
      ...molesToDisplayAmount(moles, chemical, formula),
      moles,
      isProduct: true,
      isPrecipitate: Boolean(product?.isPrecipitate),
      precipitateAppearance: product?.precipitateAppearance || null,
    };
  });

  return {
    extent,
    remainingBatches,
    productBatches,
    batches: [...remainingBatches, ...productBatches],
  };
};

export const isStructurallyBalancedReaction = (reaction) => {
  try {
    const totals = (speciesList) => speciesList.reduce((result, species) => {
      const formula = getSpeciesFormula(species);
      const coefficient = getCoefficient(species);
      Object.entries(parseFormula(formula)).forEach(([element, count]) => {
        result[element] = (result[element] || 0) + count * coefficient;
      });
      return result;
    }, {});

    const left = totals(reaction.reactants || []);
    const right = totals(reaction.products || []);
    const elements = new Set([...Object.keys(left), ...Object.keys(right)]);
    return elements.size > 0 && [...elements].every((element) => left[element] === right[element]);
  } catch {
    return false;
  }
};

export const formatStructuredEquation = (reaction) => {
  const formatSide = (speciesList) => (speciesList || []).map((species) => {
    const coefficient = getCoefficient(species);
    return `${coefficient > 1 ? coefficient : ''}${getSpeciesFormula(species)}`;
  }).join(' + ');
  return `${formatSide(reaction.reactants)} → ${formatSide(reaction.products)}`;
};
