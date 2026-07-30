import { create } from 'zustand';

// Helper for generating unique IDs
let idCounter = Date.now();
const generateId = () => ++idCounter;

// Bảng khối lượng nguyên tử chuẩn IUPAC
const ATOMIC_WEIGHTS = {
  'H': 1.008, 'He': 4.0026, 'Li': 6.94, 'Be': 9.0122, 'B': 10.81, 'C': 12.011,
  'N': 14.007, 'O': 15.999, 'F': 18.998, 'Ne': 20.180, 'Na': 22.990, 'Mg': 24.305,
  'Al': 26.982, 'Si': 28.085, 'P': 30.974, 'S': 32.06, 'Cl': 35.45, 'K': 39.098,
  'Ar': 39.948, 'Ca': 40.078, 'Sc': 44.956, 'Ti': 47.867, 'V': 50.942, 'Cr': 51.996,
  'Mn': 54.938, 'Fe': 55.845, 'Co': 58.933, 'Ni': 58.693, 'Cu': 63.546, 'Zn': 65.38,
  'Ga': 69.723, 'Ge': 72.630, 'As': 74.922, 'Se': 78.971, 'Br': 79.904, 'Kr': 83.798,
  'Rb': 85.468, 'Sr': 87.62, 'Ag': 107.868, 'Ba': 137.327, 'Pt': 195.084, 'Au': 196.967,
  'Hg': 200.592, 'Pb': 207.2, 'I': 126.904
};

/**
 * Đếm số lượng từng nguyên tố trong công thức có ngoặc (), [].
 */
function parseFormula(formula) {
  if (!formula) return {};
  const cleaned = String(formula)
    .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (match) => {
      const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
      return subMap[match] || match;
    })
    .replace(/\[/g, '(')
    .replace(/\]/g, ')');

  const tokens = cleaned.match(/([A-Z][a-z]?|\d+|[()])/g);
  if (!tokens) return {};

  const stack = [{}];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];
    if (token === '(') {
      stack.push({});
    } else if (token === ')') {
      i++;
      const multiplier = (i < tokens.length && /^\d+$/.test(tokens[i])) ? parseInt(tokens[i], 10) : 1;
      const top = stack.pop();
      const current = stack[stack.length - 1];
      for (const [elem, count] of Object.entries(top)) {
        current[elem] = (current[elem] || 0) + count * multiplier;
      }
      continue;
    } else if (/^\d+$/.test(token)) {
      // digit handled by previous element/bracket
    } else {
      const elem = token;
      let multiplier = 1;
      if (i + 1 < tokens.length && /^\d+$/.test(tokens[i + 1])) {
        multiplier = parseInt(tokens[i + 1], 10);
        i++;
      }
      const current = stack[stack.length - 1];
      current[elem] = (current[elem] || 0) + multiplier;
    }
    i++;
  }

  return stack[0];
}

/**
 * Tính khối lượng mol phân tử, hỗ trợ chất ngậm nước (vd: CuSO4.5H2O).
 */
function calculateMolarMass(formula) {
  if (!formula) return 40.0;
  const cleanStr = String(formula).replace(/\(aq\)|\(s\)|\(g\)|\(l\)|\+/gi, '').trim();
  const parts = cleanStr.split('.');
  let totalMass = 0.0;

  // Xử lý phần chính
  const mainElements = parseFormula(parts[0]);
  for (const [elem, count] of Object.entries(mainElements)) {
    totalMass += (ATOMIC_WEIGHTS[elem] || 0.0) * count;
  }

  // Xử lý phần ngậm nước (nếu có)
  if (parts.length > 1) {
    for (let p = 1; p < parts.length; p++) {
      const hydrate = parts[p];
      const match = hydrate.match(/^(\d*)(.*)/);
      if (match) {
        const n = match[1] ? parseInt(match[1], 10) : 1;
        const subElements = parseFormula(match[2]);
        let subMass = 0;
        for (const [el, cnt] of Object.entries(subElements)) {
          subMass += (ATOMIC_WEIGHTS[el] || 0.0) * cnt;
        }
        totalMass += n * subMass;
      }
    }
  }

  return totalMass > 0 ? Math.round(totalMass * 1000) / 1000 : 40.0;
}

function calculateStoichiometricYields(reaction, addedHistory, chemicals) {
  if (!addedHistory || addedHistory.length === 0) return [];

  const inputMolesMap = new Map();
  addedHistory.forEach(item => {
    const rawFormula = item.formula;
    const cleanForm = normalizeFormula(rawFormula);
    const amount = item.amount || (item.unit === 'g' ? 25 : 50);
    const unit = item.unit || 'ml';
    const state = item.state || 'liquid';
    const M = calculateMolarMass(rawFormula);

    let moles = (unit === 'g' || state === 'solid' || state === 'metal') 
      ? amount / M 
      : (state === 'gas' ? (amount / 1000) / 22.4 : amount / M);

    inputMolesMap.set(cleanForm, (inputMolesMap.get(cleanForm) || 0) + moles);
  });

  let limitMoles = Infinity;
  const reactants = reaction.reactants || [];
  if (reactants.length > 0) {
    reactants.forEach(r => {
      const form = typeof r === 'string' ? r : (r.formula || r.name || '');
      const cleanForm = normalizeFormula(form);
      const coeff = typeof r === 'object' && r.coeff ? r.coeff : 1;
      
      let availMoles = inputMolesMap.get(cleanForm);
      if (availMoles === undefined) {
        for (const [k, v] of inputMolesMap.entries()) {
          if (k.includes(cleanForm) || cleanForm.includes(k)) {
            availMoles = v;
            break;
          }
        }
      }
      if (availMoles === undefined) availMoles = 1.087;

      const normMoles = availMoles / coeff;
      if (normMoles < limitMoles) {
        limitMoles = normMoles;
      }
    });
  }

  if (!isFinite(limitMoles) || limitMoles <= 0) {
    limitMoles = 1.087; // fallback 25g Na
  }

  const yields = [];
  const products = reaction.products || [];

  products.forEach(p => {
    const prodFormula = typeof p === 'string' ? p : p.formula;
    const cleanForm = normalizeFormula(prodFormula);
    const coeff = typeof p === 'object' && (p.coeff || p.coefficient || p.ratio) ? (p.coeff || p.coefficient || p.ratio) : (products.length === 1 && reactants.length >= 2 ? 2 : 1);
    const prodData = chemicals[prodFormula] || chemicals[cleanForm] || { formula: prodFormula, name: prodFormula, state: 'liquid' };
    const M = calculateMolarMass(prodFormula);

    const prodMoles = limitMoles * coeff;

    let amount = 0;
    let unit = 'g';

    if (prodData.state === 'solid' || prodData.type === 'metal') {
      amount = Math.round(prodMoles * M * 100) / 100;
      unit = 'g';
    } else if (prodData.state === 'gas') {
      const volLiters = prodMoles * 22.4;
      if (volLiters >= 1.0) {
        amount = Math.round(volLiters * 100) / 100;
        unit = 'L';
      } else {
        amount = Math.round(volLiters * 1000 * 10) / 10;
        unit = 'ml';
      }
    } else {
      amount = Math.round(prodMoles * M * 100) / 100;
      unit = 'g';
    }

    yields.push({
      id: generateId(),
      formula: prodFormula,
      name: prodData.name || prodFormula,
      state: prodData.state || 'liquid',
      amount: amount > 0 ? amount : 5,
      unit,
      isProduct: true
    });
  });

  return yields;
}

const normalizeFormula = (formula) => {
  const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  return String(formula || '').replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (match) => subMap[match] || match).trim().toUpperCase();
};

const createDefaultBeaker = (id, message = "Cốc thí nghiệm mới") => ({
  id,
  contents: [],
  droppedSolids: [],
  reactionMessage: message,
  isHeating: false,
  isElectrolyzing: false,
  heatTemperature: 25, // °C - nhiệt độ hiện tại
  heatPower: 5, // Mức lửa (0-10)
  containerType: 'beaker', // 'beaker', 'flask', 'dish'
  activeBubbles: false,
  activeFlame: false,
  activeSmoke: false,
  smokeColor: '#ffffff',
  intensity: 'medium', 
  reactionProducts: [],
  shake: false,
  heatTime: 0,
  liquidVolume: 1.0,
  addedHistory: [], // Array of { id, formula, name, state, amount, unit, timestamp }
  yieldHistory: [], // Array of { id, formula, name, state, amount, unit, isProduct }
});

const useLabStore = create((set, get) => ({
  // --- Data from Backend ---
  chemicals: {}, // Map of formula -> data
  reactions: [], // Array of reaction objects
  unlockedFormulas: [], // What the user can see/use

  // --- Beakers State ---
  beakers: [createDefaultBeaker(generateId(), "Mời bắt đầu thí nghiệm")],
  activeBeakerIndex: 0,

  // --- Animation/UI State ---
  isPouringFormula: null,
  allowedFormulas: [],

  // --- Settings ---
  settings: {
    bgColor: '#0a0a0f',
    beakerOpacity: 0.92,
    bgType: 'galaxy', 
  },

  updateSettings: (newSettings) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings }
    }));
  },

  gameTick: () => {
    set(state => {
      let beakersChanged = false;
      const newBeakers = state.beakers.map(beaker => {
        let updatedBeaker = { ...beaker };
        let changed = false;

        // Xử lý tăng/giảm nhiệt độ (Sanitize NaN/undefined)
        const currentTemp = (typeof beaker.heatTemperature === 'number' && !Number.isNaN(beaker.heatTemperature)) ? beaker.heatTemperature : 25;
        const currentPower = (typeof beaker.heatPower === 'number' && !Number.isNaN(beaker.heatPower)) ? beaker.heatPower : 5;

        if (beaker.isHeating) {
          // Tăng nhiệt: mỗi giây (tick) tăng = heatPower * 1.5
          updatedBeaker.heatTemperature = Math.min(1200, currentTemp + currentPower * 1.5);
          updatedBeaker.heatPower = currentPower;
          changed = true;
          updatedBeaker.heatTime = (beaker.heatTime || 0) + 1;
        } else {
          // Giảm nhiệt tự nhiên về 25°C
          if (currentTemp > 25) {
            updatedBeaker.heatTemperature = Math.max(25, currentTemp - 5);
            changed = true;
          } else {
            if (beaker.heatTemperature !== 25) {
              updatedBeaker.heatTemperature = 25;
              changed = true;
            }
          }
        }

        // Nếu nhiệt độ thay đổi, kiểm tra giới hạn chịu nhiệt của cốc
        if (changed) {
          let maxTemp = 450; // beaker
          if (beaker.containerType === 'flask') maxTemp = 250;
          if (beaker.containerType === 'dish') maxTemp = 1000;

          if (updatedBeaker.heatTemperature > maxTemp && !updatedBeaker.reactionMessage.includes("QUÁ NHIỆT")) {
            updatedBeaker = {
              ...createDefaultBeaker(beaker.id, "💥 CỐC BỊ QUÁ NHIỆT VÀ ĐÃ VỠ!"),
              isHeating: false,
              activeFlame: true,
              activeSmoke: true,
              intensity: 'extreme',
              shake: true,
            };
            
            // Xóa hiệu ứng vỡ sau 3.5s
            setTimeout(() => {
              set(s => {
                const bks = [...s.beakers];
                const bIdx = bks.findIndex(b => b.id === beaker.id);
                if (bIdx !== -1 && bks[bIdx].reactionMessage.includes("QUÁ NHIỆT")) {
                  bks[bIdx] = {
                    ...bks[bIdx],
                    activeFlame: false,
                    activeSmoke: false,
                    shake: false,
                    reactionMessage: "Cốc thí nghiệm mới (đã thay cốc khác)"
                  };
                }
                return { beakers: bks };
              });
            }, 3500);
          } else if (updatedBeaker.heatTemperature > maxTemp * 0.9 && !updatedBeaker.reactionMessage.includes("QUÁ NHIỆT")) {
            updatedBeaker.reactionMessage = "⚠️ Cảnh báo: Cốc sắp quá nhiệt!";
          }
        }

        // Logic bay hơi (Mỗi 2 tick = 2 giây, nếu đang đun)
        if (beaker.isHeating && beaker.heatTime % 2 === 0 && !updatedBeaker.reactionMessage.includes("QUÁ NHIỆT")) {
          const hasLiquids = beaker.contents.some(c => c.state !== 'solid');
          if (hasLiquids && updatedBeaker.heatTemperature >= 100) {
            const newVol = Math.max(0, beaker.liquidVolume - 0.05);
            updatedBeaker.liquidVolume = newVol;
            updatedBeaker.activeSmoke = true;
            updatedBeaker.smokeColor = '#ffffff';
            updatedBeaker.intensity = newVol < 0.3 ? 'high' : 'low';

            if (newVol <= 0) {
              updatedBeaker.contents = beaker.contents.filter(c => c.state === 'solid');
              updatedBeaker.reactionMessage = "Dung dịch đã bay hơi hoàn toàn.";
              updatedBeaker.activeSmoke = false;
            }
            changed = true;
          }
        }
        
        // Kiểm tra xem phản ứng mới có được kích hoạt không (do nhiệt độ tăng)
        if (changed && beaker.isHeating && !updatedBeaker.reactionMessage.includes("QUÁ NHIỆT")) {
           const formulas = updatedBeaker.contents.map(c => c.formula);
           const reaction = get()._findReaction(formulas, true, updatedBeaker.isElectrolyzing, updatedBeaker.heatTemperature);
           if (reaction) {
              const bIdx = state.beakers.findIndex(b => b.id === beaker.id);
              updatedBeaker = get()._processBeakerReaction(reaction, updatedBeaker.contents, updatedBeaker.droppedSolids, true, bIdx, updatedBeaker);
           }
        }

        if (changed) beakersChanged = true;
        return updatedBeaker;
      });

      return beakersChanged ? { beakers: newBeakers } : {};
    });
  },

  // --- Initialization ---
  setData: (chemicalsArray, reactionsArray, unlocked) => {
    const chemMap = {};
    chemicalsArray.forEach(c => { chemMap[c.formula] = c; });
    
    set({ 
      chemicals: chemMap, 
      reactions: reactionsArray, 
      unlockedFormulas: unlocked,
      allowedFormulas: unlocked // Initial allowed
    });
  },

  setUnlocked: (unlocked) => {
    set({ unlockedFormulas: unlocked });
  },

  // --- Actions ---
  setActiveBeaker: (index) => {
    set(state => {
      const beaker = state.beakers[index];
      if (!beaker) return {};
      // In this version, we don't restrict placement too much, 
      // but we could filters based on beaker state if needed.
      return { 
        activeBeakerIndex: index,
        allowedFormulas: state.unlockedFormulas
      };
    });
  },

  addBeaker: () => {
    set(state => {
      if (state.beakers.length >= 4) return {}; 
      const newBeaker = createDefaultBeaker(generateId(), `Cốc thí nghiệm ${state.beakers.length + 1}`);
      return { beakers: [...state.beakers, newBeaker] };
    });
  },

  removeBeaker: (index) => {
    set(state => {
      if (state.beakers.length <= 1) return {}; 
      const newBeakers = state.beakers.filter((_, i) => i !== index);
      const newActiveIndex = Math.min(state.activeBeakerIndex, newBeakers.length - 1);
      return { 
        beakers: newBeakers, 
        activeBeakerIndex: newActiveIndex,
        allowedFormulas: state.unlockedFormulas
      };
    });
  },

  setHeatPower: (power) => {
    set(state => {
      const idx = state.activeBeakerIndex;
      const newBeakers = [...state.beakers];
      newBeakers[idx] = { ...newBeakers[idx], heatPower: power };
      return { beakers: newBeakers };
    });
  },

  toggleHeat: () => {
    set(state => {
      const idx = state.activeBeakerIndex;
      const beaker = state.beakers[idx];
      const newHeating = !beaker.isHeating;
      const newBeakers = [...state.beakers];
      
      let updatedBeaker = { 
        ...beaker, 
        isHeating: newHeating,
        activeSmoke: newHeating ? beaker.activeSmoke : false,
      };

      if (newHeating) {
        const formulas = beaker.contents.map(c => c.formula);
        const reaction = get()._findReaction(formulas, true, beaker.isElectrolyzing, beaker.heatTemperature);
        if (reaction) {
          updatedBeaker = get()._processBeakerReaction(reaction, beaker.contents, beaker.droppedSolids, true, idx);
        } else if (beaker.contents.some(c => c.state === 'liquid')) {
          updatedBeaker.activeSmoke = true;
          updatedBeaker.smokeColor = '#ffffff';
          updatedBeaker.intensity = 'low';
        }
      }

      newBeakers[idx] = updatedBeaker;
      return { beakers: newBeakers };
    });
  },

  toggleElectrolysis: () => {
    set(state => {
      const idx = state.activeBeakerIndex;
      const beaker = state.beakers[idx];
      const newElectrolyzing = !beaker.isElectrolyzing;
      const newBeakers = [...state.beakers];
      
      let updatedBeaker = { 
        ...beaker, 
        isElectrolyzing: newElectrolyzing,
      };

      if (newElectrolyzing) {
        const formulas = beaker.contents.map(c => c.formula);
        const reaction = get()._findReaction(formulas, beaker.isHeating, true, beaker.heatTemperature);
        if (reaction) {
          updatedBeaker = get()._processBeakerReaction(reaction, beaker.contents, beaker.droppedSolids, beaker.isHeating, idx);
        }
      }

      newBeakers[idx] = updatedBeaker;
      return { beakers: newBeakers };
    });
  },

  dropToBeaker: (formulaStr) => {
    const chemical = get().chemicals[formulaStr];
    if (!chemical) return;

    set({ isPouringFormula: formulaStr });

    setTimeout(() => {
      set(state => {
        const idx = state.activeBeakerIndex;
        const beaker = state.beakers[idx];
        
        const newId = generateId();
        const newContents = [...beaker.contents, { ...chemical, id: newId }];
        let newSolids = [...beaker.droppedSolids];

        if (chemical.state === 'solid' || chemical.type === 'metal') {
          newSolids.push({ ...chemical, id: newId });
        }

        const doseAmount = (chemical.formula === 'Na' || chemical.name?.toLowerCase().includes('natri')) ? 25.0 : ((chemical.state === 'solid' || chemical.type === 'metal') ? 25.0 : (chemical.state === 'gas' ? 100 : 50));
        const doseUnit = (chemical.state === 'solid' || chemical.type === 'metal') ? 'g' : 'ml';
        const historyItem = {
          id: newId,
          formula: chemical.formula,
          name: chemical.name || chemical.formula,
          state: chemical.state || 'liquid',
          amount: doseAmount,
          unit: doseUnit,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        const updatedAddedHistory = [...(beaker.addedHistory || []), historyItem];

      const formulas = newContents.map(c => c.formula);
      const reaction = get()._findReaction(formulas, beaker.isHeating, beaker.isElectrolyzing, beaker.heatTemperature);
        
        const newBeakers = [...state.beakers];
        let updatedBeaker = {
          ...beaker,
          contents: newContents,
          droppedSolids: newSolids,
          addedHistory: updatedAddedHistory,
          liquidVolume: 1.0,
          heatTime: 0,
        };

        if (reaction) {
          updatedBeaker = get()._processBeakerReaction(reaction, newContents, newSolids, beaker.isHeating, idx);
        } else {
          // Kiểm tra xem có phản ứng tiềm năng nào thiếu điều kiện không
          const potential = get()._findPotentialReaction(formulas);
          if (potential) {
            const requiresHeat = Boolean(potential.requires_heat ?? potential.requiresHeat);
            const conditionStr = (potential.conditions || '').toLowerCase();
            const requiresElectrolysis = conditionStr.includes('điện phân');
            const requiresMolten = conditionStr.includes('nóng chảy');

            let msg = "⚠️ Thiếu điều kiện: ";
            let missing = [];

            if (requiresHeat && !beaker.isHeating) {
              missing.push("Cần đun nóng");
            } else if (requiresHeat && potential.minTemp && beaker.heatTemperature < potential.minTemp) {
              missing.push(`Nhiệt độ tối thiểu ${potential.minTemp}°C`);
            }
            
            if (requiresElectrolysis && !beaker.isElectrolyzing) {
              missing.push("Cần dòng điện (Điện phân)");
            }
            
            if (requiresMolten && (!beaker.isHeating || beaker.heatTemperature < 500)) {
              missing.push("Cần nhiệt độ cao để nóng chảy");
            }

            if (missing.length > 0) {
              msg += missing.join(", ");
            } else if (potential.conditions && !requiresElectrolysis) {
              msg += potential.conditions;
            } else {
              msg = "⚠️ Cần thêm điều kiện (Xúc tác/...)";
            }
            updatedBeaker.reactionMessage = msg;
          }
        }

        // Visual effect when dropping gases (keep gas in beaker for reactions)
        if (chemical.state === 'gas') {
          updatedBeaker.activeBubbles = true;
          updatedBeaker.activeSmoke = true;
          updatedBeaker.reactionMessage = `Sục khí ${chemical.formula} vào cốc.`;
          
          setTimeout(() => {
            set(s => {
              const bks = [...s.beakers];
              if (bks[idx]) {
                bks[idx].activeBubbles = false;
                bks[idx].activeSmoke = false;
              }
              return { beakers: bks };
            });
          }, 3000);
        }

        newBeakers[idx] = updatedBeaker;

        return { 
          beakers: newBeakers, 
          isPouringFormula: null,
        };
      });
    }, 800);
  },

  _findPotentialReaction: (formulas) => {
    const { reactions } = get();
    const uniqueFormulas = Array.from(new Set(formulas.map(normalizeFormula)));
    const sortedReactions = [...reactions].sort((a, b) => b.reactants.length - a.reactants.length);

    return sortedReactions.find(rx => {
      const rxReactants = Array.from(new Set(rx.reactants.map(r => normalizeFormula(r.formula))));
      return rxReactants.every(r => uniqueFormulas.includes(r));
    });
  },

  _findReaction: (formulas, isHeating, isElectrolyzing, currentTemp = 25) => {
    const { reactions } = get();
    // Lấy danh sách các loại hóa chất độc nhất trong cốc
    const uniqueFormulas = Array.from(new Set(formulas.map(normalizeFormula)));
    
    // Ưu tiên các phản ứng cần nhiều chất tham gia nhất để tránh phản ứng phụ kích hoạt trước
    const sortedReactions = [...reactions].sort((a, b) => b.reactants.length - a.reactants.length);

    return sortedReactions.find(rx => {
      // Lấy danh sách các chất tham gia của phản ứng này
      const rxReactants = Array.from(new Set(rx.reactants.map(r => normalizeFormula(r.formula))));
      
      // Kiểm tra xem TOÀN BỘ chất tham gia của phản ứng có NẰM TRONG cốc hay không (Subset match)
      const isSubset = rxReactants.every(r => uniqueFormulas.includes(r));
      if (!isSubset) return false;
      
      const requiresHeat = Boolean(rx.requires_heat ?? rx.requiresHeat);
      if (requiresHeat && !isHeating) return false;

      // Kiểm tra nhiệt độ tối thiểu nếu phản ứng yêu cầu
      const minTemp = rx.minTemp || 0;
      if (requiresHeat && minTemp > 0 && currentTemp < minTemp) return false;

      // Kiểm tra điều kiện điện phân / nóng chảy
      const condition = (rx.conditions || '').toLowerCase();
      if (condition.includes('điện phân')) {
        if (!isElectrolyzing) return false;
      }
      if (condition.includes('nóng chảy')) {
        // Điện phân nóng chảy thường cần nhiệt độ cao
        if (!isHeating || currentTemp < 500) return false;
      }

      // Chặn các phản ứng yêu cầu xúc tác chưa được hỗ trợ (nếu có)
      if (condition.includes('xúc tác') && !condition.includes('nóng chảy') && !condition.includes('điện phân')) {
        return false;
      }

      return true;
    });
  },

  _processBeakerReaction: (reaction, contents, solids, isHeating, beakerIdx) => {
    const { chemicals } = get();
    let processedContents = [...contents];
    
    // Most reactions in the backend consume all reactants
    processedContents = []; 

    const products = [];
    const newYields = [...(beakerIdx !== undefined && get().beakers[beakerIdx]?.yieldHistory || [])];

    // Calculate exact chemical yields using stoichiometry and limiting reactant algorithm
    const currentAdded = (beakerIdx !== undefined && get().beakers[beakerIdx]?.addedHistory) || [];
    const stoichiometricYields = calculateStoichiometricYields(reaction, currentAdded, chemicals);

    if (stoichiometricYields.length > 0) {
      stoichiometricYields.forEach(yd => {
        const prodData = chemicals[yd.formula] || { formula: yd.formula, name: yd.formula, color: '#ffffff', state: yd.state };
        processedContents.push({ ...prodData, id: generateId(), isPrecipitate: true });
        products.push({ formula: prodData.formula, color: prodData.color });
        newYields.push(yd);
      });
    } else {
      reaction.products.forEach((prod) => {
        const prodData = chemicals[prod.formula] || { formula: prod.formula, name: prod.formula, color: '#ffffff', state: 'liquid' };
        processedContents.push({ ...prodData, id: generateId(), isPrecipitate: true });
        products.push({ formula: prodData.formula, color: prodData.color });

        const yAmount = prodData.state === 'solid' ? 5.0 : (prodData.state === 'gas' ? 100 : 50);
        const yUnit = prodData.state === 'solid' ? 'g' : 'ml';
        newYields.push({
          id: generateId(),
          formula: prodData.formula,
          name: prodData.name || prodData.formula,
          state: prodData.state || 'liquid',
          amount: yAmount,
          unit: yUnit,
          isProduct: true
        });
      });
    }

    const newSolids = processedContents.filter(c => c.state === 'solid');

    // Heuristics for visual effects based on reaction animation string or product types
    const animation = reaction.animation || '';
    const isExplosion = animation === 'explosion' || reaction.name?.toLowerCase().includes('nổ');
    const hasGas = processedContents.some(c => c.state === 'gas') || reaction.name?.toLowerCase().includes('khí');
    
    const intensity = isExplosion ? 'high' : (hasGas ? 'medium' : 'low');
    const smokeColor = animation === 'smoke_purple' ? '#a855f7' : '#ffffff';

    if (isExplosion) {
       setTimeout(() => {
          set(state => {
            const bks = [...state.beakers];
            if (bks[beakerIdx]) bks[beakerIdx].shake = false;
            return { beakers: bks };
          });
       }, 500);
    }

    if (hasGas) {
        setTimeout(() => {
            set(state => {
              const bks = [...state.beakers];
              if (bks[beakerIdx]) {
                bks[beakerIdx].activeBubbles = false;
                bks[beakerIdx].activeSmoke = false;
                // Remove gases from contents
                bks[beakerIdx].contents = bks[beakerIdx].contents.filter(c => c.state !== 'gas');
              }
              return { beakers: bks };
            });
        }, 5000);
    }
    
    if (isExplosion) {
        setTimeout(() => {
          set(state => {
            const bks = [...state.beakers];
            if (bks[beakerIdx]) bks[beakerIdx].activeFlame = false;
            return { beakers: bks };
          });
        }, 2500);
    }

    // Call external discovery handler if provided (will be set in component)
    if (get().onDiscovery) {
      get().onDiscovery(reaction.products);
    }

    return {
      contents: processedContents,
      droppedSolids: newSolids,
      yieldHistory: newYields,
      reactionMessage: (reaction.name || "Phản ứng đã xảy ra!") + (reaction.conditions ? ` • ĐK: ${reaction.conditions}` : ''),
      activeBubbles: hasGas,
      activeFlame: isExplosion,
      activeSmoke: hasGas || isExplosion,
      smokeColor: smokeColor,
      intensity: intensity,
      reactionProducts: products,
      isHeating: isHeating,
      shake: isExplosion,
      liquidVolume: 1.0,
      heatTime: 0
    };
  },

  setOnDiscovery: (callback) => set({ onDiscovery: callback }),

  clearBeaker: () => set(state => {
    const idx = state.activeBeakerIndex;
    const newBeakers = [...state.beakers];
    newBeakers[idx] = {
      ...createDefaultBeaker(generateId(), "Đã làm sạch dụng cụ."),
      isHeating: false,
      isElectrolyzing: false,
      heatTemperature: 25,
      activeFlame: false,
      activeSmoke: false,
      activeBubbles: false,
      shake: false
    };
    return { beakers: newBeakers, isPouringFormula: null };
  }),

  cycleContainerType: () => set(state => {
    const idx = state.activeBeakerIndex;
    const newBeakers = [...state.beakers];
    const types = ['beaker', 'dish'];
    const current = newBeakers[idx].containerType || 'beaker';
    const nextIdx = (types.indexOf(current) + 1) % types.length;
    newBeakers[idx] = { ...newBeakers[idx], containerType: types[nextIdx] };
    return { beakers: newBeakers };
  }),

  // Vớt kết tủa / chất rắn ra khỏi cốc -> đưa vào cốc mới
  scoopSolids: () => {
    set(state => {
      const idx = state.activeBeakerIndex;
      const beaker = state.beakers[idx];
      const solids = beaker.contents.filter(c => c.state === 'solid');
      if (solids.length === 0) return {};

      // Tạo cốc mới chứa chất rắn
      if (state.beakers.length >= 4) return {};
      const newBeaker = createDefaultBeaker(generateId(), `Mẫu vớt từ Cốc #${idx + 1}`);
      newBeaker.contents = solids;
      newBeaker.droppedSolids = solids;

      // Loại bỏ chất rắn khỏi cốc gốc
      const newBeakers = [...state.beakers];
      newBeakers[idx] = {
        ...beaker,
        contents: beaker.contents.filter(c => c.state !== 'solid'),
        droppedSolids: [],
        reactionMessage: `Đã vớt ${solids.length} chất rắn/kết tủa ra khỏi cốc.`
      };
      newBeakers.push(newBeaker);

      return { beakers: newBeakers };
    });
  },

  // Rót dung dịch từ cốc này sang cốc khác
  pourToBeaker: (fromIdx, toIdx) => {
    set(state => {
      const fromBeaker = state.beakers[fromIdx];
      const toBeaker = state.beakers[toIdx];
      if (!fromBeaker || !toBeaker) return {};

      // Chỉ rót chất lỏng (không rót chất rắn)
      const liquids = fromBeaker.contents.filter(c => c.state !== 'solid');
      const remainingSolids = fromBeaker.contents.filter(c => c.state === 'solid');
      if (liquids.length === 0) return {};

      const newToContents = [...toBeaker.contents, ...liquids];
      const newBeakers = [...state.beakers];

      // Cốc nguồn: giữ lại chất rắn, mất chất lỏng
      newBeakers[fromIdx] = {
        ...fromBeaker,
        contents: remainingSolids,
        liquidVolume: remainingSolids.length > 0 ? 0.1 : 0,
        reactionMessage: `Đã rót dung dịch sang Cốc #${toIdx + 1}.`
      };

      // Cốc đích: nhận chất lỏng, kiểm tra phản ứng
      let updatedToBeaker = {
        ...toBeaker,
        contents: newToContents,
        liquidVolume: 1.0,
        reactionMessage: `Nhận dung dịch từ Cốc #${fromIdx + 1}.`,
        addedHistory: [
          ...(toBeaker.addedHistory || []),
          ...liquids.map(l => ({
            id: generateId(),
            formula: l.formula,
            name: l.name || l.formula,
            state: l.state || 'liquid',
            amount: 50,
            unit: 'ml',
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          }))
        ]
      };

      // Kiểm tra phản ứng tại cốc đích
      const formulas = newToContents.map(c => c.formula);
      const reaction = get()._findReaction(formulas, toBeaker.isHeating, toBeaker.isElectrolyzing, toBeaker.heatTemperature);
      if (reaction) {
        const newSolids = [...toBeaker.droppedSolids];
        updatedToBeaker = {
          ...updatedToBeaker,
          ...get()._processBeakerReaction(reaction, newToContents, newSolids, toBeaker.isHeating, toIdx)
        };
      } else {
        const potential = get()._findPotentialReaction(formulas);
        if (potential) {
          const requiresHeat = Boolean(potential.requires_heat ?? potential.requiresHeat);
          const conditionStr = (potential.conditions || '').toLowerCase();
          const requiresElectrolysis = conditionStr.includes('điện phân');
          const requiresMolten = conditionStr.includes('nóng chảy');
          
          let msg = "⚠️ Thiếu điều kiện: ";
          let missing = [];

          if (requiresHeat && !toBeaker.isHeating) missing.push("Cần đun nóng");
          else if (requiresHeat && potential.minTemp && toBeaker.heatTemperature < potential.minTemp) missing.push(`Nhiệt độ tối thiểu ${potential.minTemp}°C`);
          
          if (requiresElectrolysis && !toBeaker.isElectrolyzing) missing.push("Cần dòng điện (Điện phân)");
          if (requiresMolten && (!toBeaker.isHeating || toBeaker.heatTemperature < 500)) missing.push("Cần nhiệt độ cao");

          if (missing.length > 0) msg += missing.join(", ");
          else if (potential.conditions && !requiresElectrolysis) msg += potential.conditions;
          else msg = "⚠️ Cần thêm điều kiện (Xúc tác/...)";
          
          updatedToBeaker.reactionMessage = msg;
        }
      }

      newBeakers[toIdx] = updatedToBeaker;
      return { beakers: newBeakers };
    });
  },
}));

export default useLabStore;

