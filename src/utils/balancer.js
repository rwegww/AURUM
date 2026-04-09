/**
 * Thuật toán cân bằng phương trình hóa học
 * Phân tích công thức → Xây dựng ma trận nguyên tố → Giải hệ phương trình
 */

// Parse chemical formula like "Fe2O3" → { Fe: 2, O: 3 }
export function parseFormula(formula) {
  const elements = {};
  
  // Helper to handle cleaning and normalization
  const clean = (f) => f
    .replace(/₀/g, '0').replace(/₁/g, '1').replace(/₂/g, '2')
    .replace(/₃/g, '3').replace(/₄/g, '4').replace(/₅/g, '5')
    .replace(/₆/g, '6').replace(/₇/g, '7').replace(/₈/g, '8').replace(/₉/g, '9')
    .replace(/[↑↓]/g, '')
    .trim();

  function parse(f) {
    let result = {};
    let i = 0;
    while (i < f.length) {
      if (f[i] === '(') {
        let pMatch = 1;
        let start = i + 1;
        while (pMatch > 0 && ++i < f.length) {
          if (f[i] === '(') pMatch++;
          if (f[i] === ')') pMatch--;
        }
        let sub = f.substring(start, i);
        i++;
        let multiplierMatch = f.substring(i).match(/^\d+/);
        let multiplier = 1;
        if (multiplierMatch) {
          multiplier = parseInt(multiplierMatch[0]);
          i += multiplierMatch[0].length;
        }
        let subRes = parse(sub);
        for (let el in subRes) {
          result[el] = (result[el] || 0) + subRes[el] * multiplier;
        }
      } else {
        let match = f.substring(i).match(/^([A-Z][a-z]*)(\d*)/);
        if (match) {
          const sym = match[1];
          const count = parseInt(match[2] || "1");
          result[sym] = (result[sym] || 0) + count;
          i += match[0].length;
        } else {
          i++;
        }
      }
    }
    return result;
  }

  return parse(clean(formula));
}

// Balance a simple equation using brute force (up to coeff 10)
// Input: reactants = ["H2", "O2"], products = ["H2O"]
// Output: { balanced: true, coefficients: [2, 1, 2], equation: "2H₂ + O₂ → 2H₂O" }
export function balanceEquation(reactantFormulas, productFormulas) {
  const allFormulas = [...reactantFormulas, ...productFormulas];
  const n = allFormulas.length;
  
  // Get all unique elements
  const allElements = new Set();
  allFormulas.forEach(f => {
    Object.keys(parseFormula(f)).forEach(el => allElements.add(el));
  });
  const elementList = [...allElements];
  
  // Brute force: try coefficients 1-10 for each compound
  const maxCoeff = 10;
  
  function tryCoeffs(coeffs, idx) {
    if (idx === n) {
      // Check if balanced
      return elementList.every(el => {
        let reactantSum = 0;
        let productSum = 0;
        
        reactantFormulas.forEach((f, i) => {
          const parsed = parseFormula(f);
          reactantSum += (parsed[el] || 0) * coeffs[i];
        });
        
        productFormulas.forEach((f, i) => {
          const parsed = parseFormula(f);
          productSum += (parsed[el] || 0) * coeffs[reactantFormulas.length + i];
        });
        
        return reactantSum === productSum && reactantSum > 0;
      });
    }
    
    for (let c = 1; c <= maxCoeff; c++) {
      coeffs[idx] = c;
      if (tryCoeffs(coeffs, idx + 1)) return true;
    }
    return false;
  }
  
  const coefficients = new Array(n).fill(1);
  const balanced = tryCoeffs(coefficients, 0);
  
  if (balanced) {
    // Simplify by GCD
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    let g = coefficients[0];
    for (let i = 1; i < coefficients.length; i++) {
      g = gcd(g, coefficients[i]);
    }
    const simplified = coefficients.map(c => c / g);
    
    // Build equation string
    const reactantStr = reactantFormulas.map((f, i) => 
      (simplified[i] > 1 ? simplified[i] : '') + f
    ).join(' + ');
    
    const productStr = productFormulas.map((f, i) => 
      (simplified[reactantFormulas.length + i] > 1 ? simplified[reactantFormulas.length + i] : '') + f
    ).join(' + ');
    
    return {
      balanced: true,
      coefficients: simplified,
      equation: `${reactantStr} → ${productStr}`
    };
  }
  
  return { balanced: false, coefficients: [], equation: '' };
}

// Pre-defined balancing exercises for practice mode
export const balancingExercises = [
  {
    id: "ex_01",
    difficulty: "easy",
    reactants: ["H₂", "O₂"],
    products: ["H₂O"],
    answer: [2, 1, 2],
    hint: "Đếm số nguyên tử H và O ở hai vế"
  },
  {
    id: "ex_02",
    difficulty: "easy",
    reactants: ["Fe", "O₂"],
    products: ["Fe₂O₃"],
    answer: [4, 3, 2],
    hint: "Cân bằng Fe trước, sau đó O"
  },
  {
    id: "ex_03",
    difficulty: "medium",
    reactants: ["Al", "HCl"],
    products: ["AlCl₃", "H₂"],
    answer: [2, 6, 2, 3],
    hint: "Cân bằng Cl trước, rồi Al, cuối cùng H"
  },
  {
    id: "ex_04",
    difficulty: "medium",
    reactants: ["CH₄", "O₂"],
    products: ["CO₂", "H₂O"],
    answer: [1, 2, 1, 2],
    hint: "Cân bằng C, rồi H, cuối cùng là O"
  },
  {
    id: "ex_05",
    difficulty: "hard",
    reactants: ["C₂H₅OH", "O₂"],
    products: ["CO₂", "H₂O"],
    answer: [1, 3, 2, 3],
    hint: "Đây là phản ứng cháy rượu. Cân bằng C → H → O"
  },
  {
    id: "ex_06",
    difficulty: "easy",
    reactants: ["Na", "H₂O"],
    products: ["NaOH", "H₂"],
    answer: [2, 2, 2, 1],
    hint: "Cân bằng Na trước, rồi H"
  },
];
