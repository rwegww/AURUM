const SUBSCRIPT_DIGITS = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
};

const GROUP_CLOSE = {
  '(': ')',
  '[': ']',
  '{': '}',
};

const ARROW_PATTERN = /<=>|↔|⇌|->|=>|=|→/;

const normalizeDigits = (value) =>
  value.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (digit) => SUBSCRIPT_DIGITS[digit] || digit);

const cleanFormulaInput = (formula) => {
  if (formula === null || formula === undefined) return '';

  return normalizeDigits(String(formula))
    .replace(/[↑↓]/g, '')
    .replace(/\s+/g, '')
    .replace(/\((aq|s|l|g|r|dd)\)/gi, '')
    .trim();
};

const parseCharge = (formula) => {
  const cleaned = cleanFormulaInput(formula);
  if (/^e(?:\^\d*)?[+-]$/i.test(cleaned)) {
    return { formula: 'e', charge: cleaned.endsWith('+') ? 1 : -1, isElectron: true };
  }

  const explicit = cleaned.match(/^(.*)\^(\d*)([+-])$/u);
  if (explicit) {
    const magnitude = Number.parseInt(explicit[2] || '1', 10);
    return { formula: explicit[1], charge: explicit[3] === '+' ? magnitude : -magnitude, isElectron: false };
  }

  const signed = cleaned.match(/^(.*)([+-])$/u);
  if (!signed) return { formula: cleaned, charge: 0, isElectron: false };

  let baseFormula = signed[1];
  let magnitude = 1;
  const monoatomicCharge = baseFormula.match(/^([A-Z][a-z]?)(\d+)$/u);
  if (monoatomicCharge) {
    baseFormula = monoatomicCharge[1];
    magnitude = Number.parseInt(monoatomicCharge[2], 10);
  }

  return { formula: baseFormula, charge: signed[2] === '+' ? magnitude : -magnitude, isElectron: false };
};

const formatChargedFormula = ({ formula, charge, isElectron }) => {
  if (!charge) return formula;
  if (isElectron) return `e${charge > 0 ? '+' : '-'}`;
  return `${formula}^${Math.abs(charge) > 1 ? Math.abs(charge) : ''}${charge > 0 ? '+' : '-'}`;
};

const readNumber = (text, startIndex) => {
  let index = startIndex;
  while (index < text.length && /\d/.test(text[index])) index += 1;
  if (index === startIndex) return { value: 1, nextIndex: startIndex };
  return { value: Number.parseInt(text.slice(startIndex, index), 10), nextIndex: index };
};

const mergeCounts = (target, source, multiplier = 1) => {
  Object.entries(source).forEach(([element, count]) => {
    target[element] = (target[element] || 0) + count * multiplier;
  });
};

const parseFormulaSegment = (text, startIndex = 0, closeChar = null) => {
  const counts = {};
  let index = startIndex;

  while (index < text.length) {
    const char = text[index];

    if (closeChar && char === closeChar) {
      return { counts, nextIndex: index + 1 };
    }

    if (GROUP_CLOSE[char]) {
      const parsedGroup = parseFormulaSegment(text, index + 1, GROUP_CLOSE[char]);
      const multiplier = readNumber(text, parsedGroup.nextIndex);
      mergeCounts(counts, parsedGroup.counts, multiplier.value);
      index = multiplier.nextIndex;
      continue;
    }

    if (Object.values(GROUP_CLOSE).includes(char)) {
      throw new Error(`Dấu ngoặc đóng "${char}" không khớp trong công thức "${text}".`);
    }

    const elementMatch = text.slice(index).match(/^([A-Z][a-z]?)(\d*)/);
    if (elementMatch) {
      const [, element, rawCount] = elementMatch;
      counts[element] = (counts[element] || 0) + Number.parseInt(rawCount || '1', 10);
      index += elementMatch[0].length;
      continue;
    }

    throw new Error(`Không đọc được ký tự "${char}" trong công thức "${text}".`);
  }

  if (closeChar) {
    throw new Error(`Thiếu dấu ngoặc đóng "${closeChar}" trong công thức "${text}".`);
  }

  return { counts, nextIndex: index };
};

const parseHydratePart = (part) => {
  const match = part.match(/^(\d+)(?=[A-Z([{])/);
  if (!match) return { multiplier: 1, formula: part };
  return {
    multiplier: Number.parseInt(match[1], 10),
    formula: part.slice(match[1].length),
  };
};

export function normalizeFormula(formula) {
  const cleaned = cleanFormulaInput(formula).replace(/^(\d+)(?=[A-Z([{])/u, '');
  return formatChargedFormula(parseCharge(cleaned));
}

export function parseFormula(formula) {
  const cleaned = cleanFormulaInput(formula);
  if (!cleaned) throw new Error('Công thức hóa học không được để trống.');

  const parsedCharge = parseCharge(cleaned);
  if (parsedCharge.isElectron) return {};

  const formulaWithoutLeadingCoefficient = parsedCharge.formula.replace(/^(\d+)(?=[A-Z([{])/u, '');
  const parts = formulaWithoutLeadingCoefficient.split(/[·.]/u).filter(Boolean);
  const total = {};

  parts.forEach((rawPart) => {
    const { multiplier, formula: formulaPart } = parseHydratePart(rawPart);
    if (!formulaPart) throw new Error(`Phần hydrate "${rawPart}" không hợp lệ.`);
    const parsed = parseFormulaSegment(formulaPart);
    mergeCounts(total, parsed.counts, multiplier);
  });

  if (Object.keys(total).length === 0) {
    throw new Error(`Không tìm thấy nguyên tố trong công thức "${formula}".`);
  }

  return total;
}

export function parseSpeciesList(input) {
  let list;
  if (Array.isArray(input)) {
    list = input;
  } else {
    const text = String(input || '').trim();
    if (/\s\+\s/u.test(text)) {
      list = text.split(/\s+\+\s+/u);
    } else {
      const compact = [];
      let start = 0;
      for (let index = 0; index < text.length; index += 1) {
        if (text[index] !== '+') continue;
        const isTrailingCharge = index === text.length - 1;
        const isChargeBeforeSeparator = text[index + 1] === '+';
        const followsCharge = text[index - 1] === '+';
        if (isTrailingCharge || isChargeBeforeSeparator) continue;
        if (followsCharge || text[index + 1] !== '+') {
          compact.push(text.slice(start, index));
          start = index + 1;
        }
      }
      compact.push(text.slice(start));
      list = compact;
    }
  }

  return list
    .map((formula) => normalizeFormula(formula))
    .filter(Boolean);
}

export function parseEquation(equationText) {
  const parts = String(equationText || '').split(ARROW_PATTERN);
  if (parts.length !== 2) {
    throw new Error('Hãy nhập phương trình có mũi tên, ví dụ: Fe + O2 -> Fe2O3.');
  }

  const reactants = parseSpeciesList(parts[0]);
  const products = parseSpeciesList(parts[1]);

  if (reactants.length === 0 || products.length === 0) {
    throw new Error('Phương trình cần có chất tham gia và sản phẩm.');
  }

  return { reactants, products };
}

const absBigInt = (value) => (value < 0n ? -value : value);

const gcdBigInt = (a, b) => {
  let x = absBigInt(a);
  let y = absBigInt(b);
  while (y !== 0n) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1n;
};

const lcmBigInt = (a, b) => (absBigInt(a * b) / gcdBigInt(a, b)) || 1n;

const fraction = (numerator, denominator = 1n) => {
  let n = BigInt(numerator);
  let d = BigInt(denominator);
  if (d === 0n) throw new Error('Không thể chia cho 0 khi giải hệ phương trình.');
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const divisor = gcdBigInt(n, d);
  return { n: n / divisor, d: d / divisor };
};

const F0 = fraction(0n);
const F1 = fraction(1n);

const isZero = (value) => value.n === 0n;
const add = (a, b) => fraction(a.n * b.d + b.n * a.d, a.d * b.d);
const sub = (a, b) => fraction(a.n * b.d - b.n * a.d, a.d * b.d);
const mul = (a, b) => fraction(a.n * b.n, a.d * b.d);
const div = (a, b) => fraction(a.n * b.d, a.d * b.n);
const neg = (value) => fraction(-value.n, value.d);
const compareZero = (value) => (value.n === 0n ? 0 : value.n > 0n ? 1 : -1);

const toFractionMatrix = (matrix) =>
  matrix.map((row) => row.map((value) => fraction(value)));

const rref = (matrix) => {
  const rows = matrix.map((row) => row.map((cell) => fraction(cell.n, cell.d)));
  const pivotColumns = [];
  let pivotRow = 0;

  for (let column = 0; column < rows[0].length && pivotRow < rows.length; column += 1) {
    let selectedRow = -1;
    for (let row = pivotRow; row < rows.length; row += 1) {
      if (!isZero(rows[row][column])) {
        selectedRow = row;
        break;
      }
    }

    if (selectedRow === -1) continue;

    [rows[pivotRow], rows[selectedRow]] = [rows[selectedRow], rows[pivotRow]];

    const pivotValue = rows[pivotRow][column];
    rows[pivotRow] = rows[pivotRow].map((cell) => div(cell, pivotValue));

    for (let row = 0; row < rows.length; row += 1) {
      if (row === pivotRow || isZero(rows[row][column])) continue;
      const factor = rows[row][column];
      rows[row] = rows[row].map((cell, cellIndex) => sub(cell, mul(factor, rows[pivotRow][cellIndex])));
    }

    pivotColumns.push(column);
    pivotRow += 1;
  }

  return { matrix: rows, pivotColumns };
};

const buildNullspaceBasis = (matrix) => {
  const { matrix: reduced, pivotColumns } = rref(matrix);
  const columnCount = matrix[0].length;
  const freeColumns = [];

  for (let column = 0; column < columnCount; column += 1) {
    if (!pivotColumns.includes(column)) freeColumns.push(column);
  }

  return freeColumns.map((freeColumn) => {
    const vector = Array.from({ length: columnCount }, () => F0);
    vector[freeColumn] = F1;

    pivotColumns.forEach((pivotColumn, rowIndex) => {
      vector[pivotColumn] = neg(reduced[rowIndex][freeColumn]);
    });

    return vector;
  });
};

const allSameSign = (vector) => {
  const signs = vector.map(compareZero);
  if (signs.some((sign) => sign === 0)) return 0;
  if (signs.every((sign) => sign > 0)) return 1;
  if (signs.every((sign) => sign < 0)) return -1;
  return 0;
};

const addVectors = (vectors, weights) => {
  const result = Array.from({ length: vectors[0].length }, () => F0);
  vectors.forEach((vector, vectorIndex) => {
    const weight = fraction(weights[vectorIndex]);
    vector.forEach((value, index) => {
      result[index] = add(result[index], mul(value, weight));
    });
  });
  return result;
};

const findPositiveNullspaceVector = (basis) => {
  if (basis.length === 0) return null;

  for (const vector of basis) {
    const sign = allSameSign(vector);
    if (sign > 0) return vector;
    if (sign < 0) return vector.map(neg);
  }

  const searchValues = [-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8];
  const weights = [];
  let attempts = 0;
  const maxAttempts = 50000;

  const search = (depth) => {
    if (attempts > maxAttempts) return null;
    if (depth === basis.length) {
      attempts += 1;
      const vector = addVectors(basis, weights);
      const sign = allSameSign(vector);
      if (sign > 0) return vector;
      if (sign < 0) return vector.map(neg);
      return null;
    }

    for (const value of searchValues) {
      weights[depth] = value;
      const result = search(depth + 1);
      if (result) return result;
    }

    return null;
  };

  return search(0);
};

const fractionVectorToIntegers = (vector) => {
  const commonDenominator = vector.reduce((acc, value) => lcmBigInt(acc, value.d), 1n);
  let integers = vector.map((value) => (value.n * commonDenominator) / value.d);

  const sign = integers.find((value) => value !== 0n) < 0n ? -1n : 1n;
  integers = integers.map((value) => value * sign);

  const divisor = integers.reduce((acc, value) => gcdBigInt(acc, value), absBigInt(integers[0]) || 1n);
  integers = integers.map((value) => value / divisor);

  return integers.map((value) => {
    const numberValue = Number(value);
    if (!Number.isSafeInteger(numberValue)) {
      throw new Error('Hệ số quá lớn để hiển thị an toàn.');
    }
    return numberValue;
  });
};

const validateBalance = (reactants, products, coefficients) => {
  const reactantCount = reactants.length;
  const reactantTotals = {};
  const productTotals = {};

  reactants.forEach((formula, index) => {
    const counts = parseFormula(formula);
    Object.entries(counts).forEach(([element, count]) => {
      reactantTotals[element] = (reactantTotals[element] || 0) + count * coefficients[index];
    });
  });

  products.forEach((formula, index) => {
    const counts = parseFormula(formula);
    Object.entries(counts).forEach(([element, count]) => {
      productTotals[element] = (productTotals[element] || 0) + count * coefficients[reactantCount + index];
    });
  });

  const reactantCharge = reactants.reduce(
    (total, formula, index) => total + parseCharge(formula).charge * coefficients[index],
    0,
  );
  const productCharge = products.reduce(
    (total, formula, index) => total + parseCharge(formula).charge * coefficients[reactantCount + index],
    0,
  );

  const elements = Array.from(new Set([...Object.keys(reactantTotals), ...Object.keys(productTotals)])).sort();
  return {
    balanced: elements.every((element) => reactantTotals[element] === productTotals[element])
      && reactantCharge === productCharge,
    elements: [...elements.map((element) => ({
      element,
      reactants: reactantTotals[element] || 0,
      products: productTotals[element] || 0,
    })), {
      element: 'Điện tích',
      reactants: reactantCharge,
      products: productCharge,
    }],
  };
};

const formatTerm = (coefficient, formula) => `${coefficient > 1 ? coefficient : ''}${formula}`;

const formatEquation = (reactants, products, coefficients) => {
  const reactantTerms = reactants.map((formula, index) => formatTerm(coefficients[index], formula));
  const productTerms = products.map((formula, index) => formatTerm(coefficients[reactants.length + index], formula));
  return `${reactantTerms.join(' + ')} → ${productTerms.join(' + ')}`;
};

export function balanceEquation(reactantFormulas, productFormulas) {
  try {
    const reactants = parseSpeciesList(reactantFormulas);
    const products = parseSpeciesList(productFormulas);

    if (reactants.length === 0 || products.length === 0) {
      throw new Error('Cần nhập ít nhất một chất ở mỗi vế.');
    }

    const reactantCounts = reactants.map(parseFormula);
    const productCounts = products.map(parseFormula);
    const reactantElements = new Set(reactantCounts.flatMap((counts) => Object.keys(counts)));
    const productElements = new Set(productCounts.flatMap((counts) => Object.keys(counts)));
    const elements = Array.from(new Set([...reactantElements, ...productElements])).sort();

    const missingInProducts = [...reactantElements].filter((element) => !productElements.has(element));
    const missingInReactants = [...productElements].filter((element) => !reactantElements.has(element));

    if (missingInProducts.length || missingInReactants.length) {
      return {
        balanced: false,
        coefficients: [],
        equation: '',
        reactants,
        products,
        error: `Hai vế chưa có cùng tập nguyên tố. Thiếu ở sản phẩm: ${missingInProducts.join(', ') || 'không'}; thiếu ở chất tham gia: ${missingInReactants.join(', ') || 'không'}.`,
      };
    }

    const rawMatrix = elements.map((element) => [
      ...reactantCounts.map((counts) => counts[element] || 0),
      ...productCounts.map((counts) => -(counts[element] || 0)),
    ]);
    const charges = [
      ...reactants.map((formula) => parseCharge(formula).charge),
      ...products.map((formula) => -parseCharge(formula).charge),
    ];
    if (charges.some(charge => charge !== 0)) rawMatrix.push(charges);

    const basis = buildNullspaceBasis(toFractionMatrix(rawMatrix));
    const solutionVector = findPositiveNullspaceVector(basis);

    if (!solutionVector) {
      return {
        balanced: false,
        coefficients: [],
        equation: '',
        reactants,
        products,
        error: 'Không tìm được bộ hệ số dương cho phương trình này.',
      };
    }

    const coefficients = fractionVectorToIntegers(solutionVector);
    const validation = validateBalance(reactants, products, coefficients);

    if (!validation.balanced) {
      return {
        balanced: false,
        coefficients: [],
        equation: '',
        reactants,
        products,
        error: 'Kết quả giải hệ chưa cân bằng được nguyên tố hai vế.',
      };
    }

    return {
      balanced: true,
      coefficients,
      reactantCoefficients: coefficients.slice(0, reactants.length),
      productCoefficients: coefficients.slice(reactants.length),
      reactants,
      products,
      equation: formatEquation(reactants, products, coefficients),
      elements: validation.elements,
      method: 'linear-algebra',
    };
  } catch (error) {
    let reactants = [];
    let products = [];
    try {
      reactants = parseSpeciesList(reactantFormulas);
      products = parseSpeciesList(productFormulas);
    } catch {
      // Giữ danh sách rỗng để không che mất lỗi phân tích ban đầu.
    }
    return {
      balanced: false,
      coefficients: [],
      equation: '',
      reactants,
      products,
      error: error.message,
    };
  }
}

export function balanceEquationText(equationText) {
  try {
    const { reactants, products } = parseEquation(equationText);
    return balanceEquation(reactants, products);
  } catch (error) {
    return {
      balanced: false,
      coefficients: [],
      equation: '',
      reactants: [],
      products: [],
      error: error.message,
    };
  }
}

export const balancingExercises = [
  {
    id: 'ex_01',
    difficulty: 'easy',
    reactants: ['H₂', 'O₂'],
    products: ['H₂O'],
    answer: [2, 1, 2],
    hint: 'Đếm số nguyên tử H và O ở hai vế',
  },
  {
    id: 'ex_02',
    difficulty: 'easy',
    reactants: ['Fe', 'O₂'],
    products: ['Fe₂O₃'],
    answer: [4, 3, 2],
    hint: 'Cân bằng Fe trước, sau đó O',
  },
  {
    id: 'ex_03',
    difficulty: 'medium',
    reactants: ['Al', 'HCl'],
    products: ['AlCl₃', 'H₂'],
    answer: [2, 6, 2, 3],
    hint: 'Cân bằng Cl trước, rồi Al, cuối cùng H',
  },
  {
    id: 'ex_04',
    difficulty: 'medium',
    reactants: ['CH₄', 'O₂'],
    products: ['CO₂', 'H₂O'],
    answer: [1, 2, 1, 2],
    hint: 'Cân bằng C, rồi H, cuối cùng là O',
  },
  {
    id: 'ex_05',
    difficulty: 'hard',
    reactants: ['C₂H₅OH', 'O₂'],
    products: ['CO₂', 'H₂O'],
    answer: [1, 3, 2, 3],
    hint: 'Đây là phản ứng cháy rượu. Cân bằng C, H rồi O',
  },
  {
    id: 'ex_06',
    difficulty: 'easy',
    reactants: ['Na', 'H₂O'],
    products: ['NaOH', 'H₂'],
    answer: [2, 2, 2, 1],
    hint: 'Cân bằng Na trước, rồi H',
  },
];
