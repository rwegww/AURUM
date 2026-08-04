const SUBSCRIPT_DIGITS = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
  '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
};

const normalizeFormula = (formula) => String(formula || '')
  .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, digit => SUBSCRIPT_DIGITS[digit] || digit)
  .replace(/\s+/g, '')
  .toUpperCase();

const signature = formulas => Array.from(new Set(formulas.map(normalizeFormula))).sort().join('|');

const DEFAULT_SAFETY_WARNING = 'Mô phỏng an toàn; không tự thực hiện ngoài đời thật nếu không có giáo viên hoặc kỹ thuật viên phòng thí nghiệm giám sát.';
const LEGACY_GENERIC_SAFETY_WARNING = 'Thí nghiệm an toàn, có thể thực hiện trên mô phỏng';

const QUALITATIVE_REACTION_IDS = new Set([
  'rx_099', 'rx_100', 'rx_102', 'rx_103', 'rx_104', 'rx_109', 'rx_119',
  'rx_120', 'rx_121', 'rx_122', 'rx_124', 'rx_125', 'rx_132', 'rx_139',
  'rx_142', 'rx_157', 'rx_175', 'rx_180', 'rx_181', 'rx_184', 'rx_185',
  'rx_193', 'rx_201', 'rx_203', 'rx_204', 'rx_205',
]);

// Các bản ghi này có phương trình hiển thị đúng nhưng dữ liệu hệ số cấu trúc cũ bị thiếu/sai.
// Sửa tại lớp chuẩn hóa giúp cả dữ liệu tĩnh lẫn bản ghi Supabase cũ nhận cùng một bản vá.
const STRUCTURAL_OVERRIDES = {
  rx_068: {
    reactants: [
      { formula: 'Al₂O₃', coeff: 1, name: 'Nhôm Oxit' },
      { formula: 'NaOH', coeff: 2, name: 'Natri Hidroxit' },
    ],
    products: [
      { formula: 'NaAlO₂', coeff: 2, name: 'Natri Aluminat' },
      { formula: 'H₂O', coeff: 1, name: 'Nước' },
    ],
    equation: 'Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O',
    conditions: 'Dung dịch kiềm đặc, đun nóng',
  },
  rx_144: {
    products: [
      { formula: 'C₆H₂Br₃NH₂', coeff: 1, name: '2,4,6-Tribromanilin' },
      { formula: 'HBr', coeff: 3, name: 'Axit Bromhiđric' },
    ],
  },
  rx_187: {
    reactants: [
      { formula: 'Al', coeff: 1, name: 'Nhôm' },
      { formula: 'FeCl₃', coeff: 3, name: 'Sắt(III) Clorua' },
    ],
    products: [
      { formula: 'AlCl₃', coeff: 1, name: 'Nhôm Clorua' },
      { formula: 'FeCl₂', coeff: 3, name: 'Sắt(II) Clorua' },
    ],
  },
};

const PRECIPITATE_PROFILES = {
  BASO4: { name: 'Bari Sunfat', color: '#f8fafc', appearance: 'fine', colorLabel: 'trắng mịn' },
  AGCL: { name: 'Bạc Clorua', color: '#ffffff', appearance: 'curdy', colorLabel: 'trắng vón cục' },
  AGBR: { name: 'Bạc Bromua', color: '#fde9a9', appearance: 'curdy', colorLabel: 'vàng nhạt' },
  AGI: { name: 'Bạc Iotua', color: '#facc15', appearance: 'curdy', colorLabel: 'vàng đậm' },
  CACO3: { name: 'Canxi Cacbonat', color: '#f1f5f9', appearance: 'fine', colorLabel: 'trắng' },
  'CU(OH)2': { name: 'Đồng(II) Hidroxit', color: '#38bdf8', appearance: 'gelatinous', colorLabel: 'xanh lơ dạng keo' },
  CU2O: { name: 'Đồng(I) Oxit', color: '#c2410c', appearance: 'granular', colorLabel: 'đỏ gạch' },
  'FE(OH)2': { name: 'Sắt(II) Hidroxit', color: '#a7c7a0', appearance: 'gelatinous', colorLabel: 'trắng xanh' },
  'FE(OH)3': { name: 'Sắt(III) Hidroxit', color: '#9a3412', appearance: 'gelatinous', colorLabel: 'nâu đỏ' },
  'AL(OH)3': { name: 'Nhôm Hidroxit', color: '#f8fafc', appearance: 'gelatinous', colorLabel: 'trắng dạng keo' },
  AG3PO4: { name: 'Bạc Photphat', color: '#eab308', appearance: 'granular', colorLabel: 'vàng' },
  MNO2: { name: 'Mangan Đioxit', color: '#111827', appearance: 'fine', colorLabel: 'nâu đen' },
  S: { name: 'Lưu huỳnh', color: '#eab308', appearance: 'fine', colorLabel: 'vàng' },
  C6H2BR3NH2: { name: '2,4,6-Tribromanilin', color: '#ffffff', appearance: 'crystalline', colorLabel: 'trắng' },
  C6H2BR3OH: { name: '2,4,6-Tribromophenol', color: '#ffffff', appearance: 'crystalline', colorLabel: 'trắng' },
};

const IONIC_EQUATIONS = new Map([
  [signature(['BaCl₂', 'Na₂SO₄']), {
    ionicEquation: 'Ba²⁺(aq) + 2Cl⁻(aq) + 2Na⁺(aq) + SO₄²⁻(aq) → BaSO₄(s)↓ + 2Na⁺(aq) + 2Cl⁻(aq)',
    netIonicEquation: 'Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s)↓',
  }],
  [signature(['BaCl₂', 'H₂SO₄']), {
    ionicEquation: 'Ba²⁺(aq) + 2Cl⁻(aq) + 2H⁺(aq) + SO₄²⁻(aq) → BaSO₄(s)↓ + 2H⁺(aq) + 2Cl⁻(aq)',
    netIonicEquation: 'Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s)↓',
  }],
  [signature(['AgNO₃', 'NaCl']), {
    ionicEquation: 'Ag⁺(aq) + NO₃⁻(aq) + Na⁺(aq) + Cl⁻(aq) → AgCl(s)↓ + Na⁺(aq) + NO₃⁻(aq)',
    netIonicEquation: 'Ag⁺(aq) + Cl⁻(aq) → AgCl(s)↓',
  }],
  [signature(['AgNO₃', 'KCl']), {
    ionicEquation: 'Ag⁺(aq) + NO₃⁻(aq) + K⁺(aq) + Cl⁻(aq) → AgCl(s)↓ + K⁺(aq) + NO₃⁻(aq)',
    netIonicEquation: 'Ag⁺(aq) + Cl⁻(aq) → AgCl(s)↓',
  }],
  [signature(['AgNO₃', 'NaBr']), {
    ionicEquation: 'Ag⁺(aq) + NO₃⁻(aq) + Na⁺(aq) + Br⁻(aq) → AgBr(s)↓ + Na⁺(aq) + NO₃⁻(aq)',
    netIonicEquation: 'Ag⁺(aq) + Br⁻(aq) → AgBr(s)↓',
  }],
  [signature(['AgNO₃', 'NaI']), {
    ionicEquation: 'Ag⁺(aq) + NO₃⁻(aq) + Na⁺(aq) + I⁻(aq) → AgI(s)↓ + Na⁺(aq) + NO₃⁻(aq)',
    netIonicEquation: 'Ag⁺(aq) + I⁻(aq) → AgI(s)↓',
  }],
  [signature(['CO₂', 'Ca(OH)₂']), {
    ionicEquation: 'CO₂(g) + Ca²⁺(aq) + 2OH⁻(aq) → CaCO₃(s)↓ + H₂O(l)',
    netIonicEquation: 'CO₂(g) + Ca²⁺(aq) + 2OH⁻(aq) → CaCO₃(s)↓ + H₂O(l)',
  }],
  [signature(['Ca(HCO₃)₂']), {
    ionicEquation: 'Ca²⁺(aq) + 2HCO₃⁻(aq) → CaCO₃(s)↓ + CO₂(g)↑ + H₂O(l)',
    netIonicEquation: 'Ca²⁺(aq) + 2HCO₃⁻(aq) → CaCO₃(s)↓ + CO₂(g)↑ + H₂O(l)',
  }],
  [signature(['CuSO₄', 'NaOH']), {
    ionicEquation: 'Cu²⁺(aq) + SO₄²⁻(aq) + 2Na⁺(aq) + 2OH⁻(aq) → Cu(OH)₂(s)↓ + 2Na⁺(aq) + SO₄²⁻(aq)',
    netIonicEquation: 'Cu²⁺(aq) + 2OH⁻(aq) → Cu(OH)₂(s)↓',
  }],
  [signature(['FeCl₂', 'NaOH']), {
    ionicEquation: 'Fe²⁺(aq) + 2Cl⁻(aq) + 2Na⁺(aq) + 2OH⁻(aq) → Fe(OH)₂(s)↓ + 2Na⁺(aq) + 2Cl⁻(aq)',
    netIonicEquation: 'Fe²⁺(aq) + 2OH⁻(aq) → Fe(OH)₂(s)↓',
  }],
  [signature(['FeCl₃', 'NaOH']), {
    ionicEquation: 'Fe³⁺(aq) + 3Cl⁻(aq) + 3Na⁺(aq) + 3OH⁻(aq) → Fe(OH)₃(s)↓ + 3Na⁺(aq) + 3Cl⁻(aq)',
    netIonicEquation: 'Fe³⁺(aq) + 3OH⁻(aq) → Fe(OH)₃(s)↓',
  }],
  [signature(['Na₃PO₄', 'AgNO₃']), {
    ionicEquation: '3Na⁺(aq) + PO₄³⁻(aq) + 3Ag⁺(aq) + 3NO₃⁻(aq) → Ag₃PO₄(s)↓ + 3Na⁺(aq) + 3NO₃⁻(aq)',
    netIonicEquation: '3Ag⁺(aq) + PO₄³⁻(aq) → Ag₃PO₄(s)↓',
  }],
  [signature(['AlCl₃', 'NH₃', 'H₂O']), {
    ionicEquation: 'Al³⁺(aq) + 3Cl⁻(aq) + 3NH₃(aq) + 3H₂O(l) → Al(OH)₃(s)↓ + 3NH₄⁺(aq) + 3Cl⁻(aq)',
    netIonicEquation: 'Al³⁺(aq) + 3NH₃(aq) + 3H₂O(l) → Al(OH)₃(s)↓ + 3NH₄⁺(aq)',
  }],
]);

const withPrecipitationMetadata = (reaction) => {
  const observationMentionsPrecipitate = /kết tủa/i.test(reaction.observation || '');
  const isPrecipitationContext = reaction.animation === 'precipitation' || observationMentionsPrecipitate;
  if (!isPrecipitationContext) return reaction;

  const products = (reaction.products || []).map(product => {
    const profile = PRECIPITATE_PROFILES[normalizeFormula(product.formula)];
    const isPrecipitate = Boolean(profile);
    if (isPrecipitate) {
      return {
        ...product,
        state: 'solid',
        color: profile.color,
        isPrecipitate: true,
        precipitateAppearance: profile.appearance,
      };
    }

    // Trong phản ứng kết tủa dung dịch, sản phẩm phụ tan không được lắng như chất rắn.
    if (reaction.animation === 'precipitation') {
      return { ...product, state: product.state || 'liquid', isPrecipitate: false };
    }
    return product;
  });

  const firstPrecipitate = products.find(product => product.isPrecipitate);
  if (!firstPrecipitate) return { ...reaction, products };

  const profile = PRECIPITATE_PROFILES[normalizeFormula(firstPrecipitate.formula)];
  const ionic = IONIC_EQUATIONS.get(signature((reaction.reactants || []).map(item => item.formula))) || {};

  return {
    ...reaction,
    products,
    precipitationEquation: reaction.equation,
    precipitate: {
      formula: firstPrecipitate.formula,
      name: firstPrecipitate.name || profile.name,
      color: profile.color,
      colorLabel: profile.colorLabel,
      appearance: profile.appearance,
    },
    ...ionic,
  };
};

export const enrichReaction = (reaction) => {
  if (!reaction) return reaction;
  const overridden = { ...reaction, ...(STRUCTURAL_OVERRIDES[reaction.id] || {}) };
  const authoredSafetyWarning = overridden.safetyWarning || overridden.safety_warning;
  const completed = {
    ...overridden,
    conditions: overridden.conditions || 'Nhiệt độ thường',
    observation: overridden.observation || 'Không có hiện tượng quan sát rõ bằng mắt thường.',
    animation: overridden.animation || 'mix',
    dangerLevel: overridden.dangerLevel ?? overridden.danger_level ?? 1,
    safetyWarning: !authoredSafetyWarning || authoredSafetyWarning === LEGACY_GENERIC_SAFETY_WARNING
      ? DEFAULT_SAFETY_WARNING
      : authoredSafetyWarning,
    isQualitative: Boolean(overridden.isQualitative || QUALITATIVE_REACTION_IDS.has(overridden.id)),
  };

  return withPrecipitationMetadata(completed);
};

export const enrichReactions = reactions => (reactions || []).map(enrichReaction);

export const getPrecipitateProfile = formula => PRECIPITATE_PROFILES[normalizeFormula(formula)] || null;
