/**
 * Thuáº­t toÃ¡n cÃ¢n báº±ng phÆ°Æ¡ng trÃ¬nh hÃ³a há»c
 * PhÃ¢n tÃ­ch cÃ´ng thá»©c â†’ XÃ¢y dá»±ng ma tráº­n nguyÃªn tá»‘ â†’ Giáº£i há»‡ phÆ°Æ¡ng trÃ¬nh
 */

// Parse chemical formula like "Fe2O3" â†’ { Fe: 2, O: 3 }
export function parseFormula(formula) {
  // Helper to handle cleaning and normalization
  const clean = (f) => f
    .replace(/â‚€/g, '0').replace(/â‚/g, '1').replace(/â‚‚/g, '2')
    .replace(/â‚ƒ/g, '3').replace(/â‚„/g, '4').replace(/â‚…/g, '5')
    .replace(/â‚†/g, '6').replace(/â‚‡/g, '7').replace(/â‚ˆ/g, '8').replace(/â‚‰/g, '9')
    .replace(/[â†‘â†“]/g, '')
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

// Balance a simple equation using brute force
// Input: reactants = ["H2", "O2"], products = ["H2O"]
// Output: { balanced: true, coefficients: [2, 1, 2], equation: "2Hâ‚‚ + Oâ‚‚ â†’ 2Hâ‚‚O" }
export function balanceEquation(reactantFormulas, productFormulas, customMax = 10) {
  const allFormulas = [...reactantFormulas, ...productFormulas];
  const n = allFormulas.length;
  
  // Get all unique elements
  const allElements = new Set();
  allFormulas.forEach(f => {
    Object.keys(parseFormula(f)).forEach(el => allElements.add(el));
  });
  const elementList = [...allElements];
  
  // Brute force: try coefficients 1-maxCoeff for each compound
  const maxCoeff = customMax;
  
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
      equation: `${reactantStr} â†’ ${productStr}`
    };
  }
  
  return { balanced: false, coefficients: [], equation: '' };
}

// Pre-defined balancing exercises for practice mode
export const balancingExercises = [
  {
    id: "ex_01",
    difficulty: "easy",
    reactants: ["Hâ‚‚", "Oâ‚‚"],
    products: ["Hâ‚‚O"],
    answer: [2, 1, 2],
    hint: "Äáº¿m sá»‘ nguyÃªn tá»­ H vÃ  O á»Ÿ hai váº¿"
  },
  {
    id: "ex_02",
    difficulty: "easy",
    reactants: ["Fe", "Oâ‚‚"],
    products: ["Feâ‚‚Oâ‚ƒ"],
    answer: [4, 3, 2],
    hint: "CÃ¢n báº±ng Fe trÆ°á»›c, sau Ä‘Ã³ O"
  },
  {
    id: "ex_03",
    difficulty: "medium",
    reactants: ["Al", "HCl"],
    products: ["AlClâ‚ƒ", "Hâ‚‚"],
    answer: [2, 6, 2, 3],
    hint: "CÃ¢n báº±ng Cl trÆ°á»›c, rá»“i Al, cuá»‘i cÃ¹ng H"
  },
  {
    id: "ex_04",
    difficulty: "medium",
    reactants: ["CHâ‚„", "Oâ‚‚"],
    products: ["COâ‚‚", "Hâ‚‚O"],
    answer: [1, 2, 1, 2],
    hint: "CÃ¢n báº±ng C, rá»“i H, cuá»‘i cÃ¹ng lÃ  O"
  },
  {
    id: "ex_05",
    difficulty: "hard",
    reactants: ["Câ‚‚Hâ‚…OH", "Oâ‚‚"],
    products: ["COâ‚‚", "Hâ‚‚O"],
    answer: [1, 3, 2, 3],
    hint: "ÄÃ¢y lÃ  pháº£n á»©ng chÃ¡y rÆ°á»£u. CÃ¢n báº±ng C â†’ H â†’ O"
  },
  {
    id: "ex_06",
    difficulty: "easy",
    reactants: ["Na", "Hâ‚‚O"],
    products: ["NaOH", "Hâ‚‚"],
    answer: [2, 2, 2, 1],
    hint: "CÃ¢n báº±ng Na trÆ°á»›c, rá»“i H"
  },
];

