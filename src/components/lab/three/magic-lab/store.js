import { create } from 'zustand';
import {
  calculateReactionOutcome,
  checkReactionConditions,
  normalizeLabFormula,
} from '../../../../utils/labChemistry.js';

// Helper for generating unique IDs
let idCounter = Date.now();
const generateId = () => ++idCounter;

const normalizeFormula = normalizeLabFormula;
const getChemicalByFormula = (chemicals, formula) => chemicals[formula]
  || Object.values(chemicals).find(chemical => normalizeFormula(chemical.formula) === normalizeFormula(formula))
  || {};

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
  liquidVolume: 0,
  addedHistory: [], // Array of { id, formula, name, state, amount, unit, timestamp }
  materialBatches: [], // Lượng chất hiện còn, dùng riêng cho tính tỉ lượng.
  yieldHistory: [], // Array of { id, formula, name, state, amount, unit, isProduct }
  safetyWarning: '',
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
  sessionKey: null,

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
              ...createDefaultBeaker(beaker.id, "⚡ CỐC BỊ QUÁ NHIỆT VÀ ĐÃ VỠ!"),
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
          const hasLiquids = beaker.contents.some(c => c.state === 'liquid');
          if (hasLiquids && updatedBeaker.heatTemperature >= 100) {
            const previousVolume = Math.max(0.05, Number(beaker.liquidVolume) || 1);
            const newVol = Math.max(0, previousVolume - 0.05);
            const retainedRatio = newVol / previousVolume;
            updatedBeaker.liquidVolume = newVol;
            updatedBeaker.activeSmoke = true;
            updatedBeaker.smokeColor = '#ffffff';
            updatedBeaker.intensity = newVol < 0.3 ? 'high' : 'low';

            if (newVol <= 0) {
              updatedBeaker.contents = beaker.contents.filter(c => c.state !== 'liquid');
              updatedBeaker.materialBatches = (beaker.materialBatches || []).filter(batch => batch.state !== 'liquid');
              updatedBeaker.reactionMessage = "Dung dịch đã bay hơi hoàn toàn.";
              updatedBeaker.activeSmoke = false;
            } else {
              updatedBeaker.materialBatches = (beaker.materialBatches || []).map(batch => (
                batch.state === 'liquid'
                  ? {
                    ...batch,
                    amount: Number((Number(batch.amount || 0) * retainedRatio).toFixed(4)),
                    moles: Number.isFinite(batch.moles) ? batch.moles * retainedRatio : batch.moles,
                  }
                  : batch
              ));
              const amountById = new Map(updatedBeaker.materialBatches.map(batch => [batch.id, batch.amount]));
              updatedBeaker.contents = beaker.contents.map(content => (
                content.state === 'liquid' && amountById.has(content.id)
                  ? { ...content, amount: amountById.get(content.id) }
                  : content
              ));
            }
            changed = true;
          }
        }
        
        // Kiểm tra xem phản ứng mới có được kích hoạt không (do nhiệt độ tăng)
        if (changed && beaker.isHeating && !updatedBeaker.reactionMessage.includes("QUÁ NHIỆT")) {
           const formulas = updatedBeaker.contents.map(c => c.formula);
           const reaction = get()._findReaction(formulas, true, updatedBeaker.isElectrolyzing, updatedBeaker.heatTemperature);
           if (reaction) {
              updatedBeaker = get()._processBeakerReaction(reaction, updatedBeaker);
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
      reactions: [...reactionsArray].sort((a, b) => (b.reactants?.length || 0) - (a.reactants?.length || 0)),
      unlockedFormulas: unlocked,
      allowedFormulas: unlocked // Initial allowed
    });
  },

  resetLabSession: (sessionKey) => set(state => {
    if (state.sessionKey === sessionKey) return {};
    return {
      sessionKey,
      beakers: [createDefaultBeaker(generateId(), "Mời bắt đầu thí nghiệm")],
      activeBeakerIndex: 0,
      isPouringFormula: null,
      onDiscovery: null,
    };
  }),

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
          updatedBeaker = get()._processBeakerReaction(reaction, updatedBeaker);
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
          updatedBeaker = get()._processBeakerReaction(reaction, updatedBeaker);
        }
      }

      newBeakers[idx] = updatedBeaker;
      return { beakers: newBeakers };
    });
  },

  dropToBeaker: (formulaStr) => {
    const chemical = get().chemicals[formulaStr];
    if (!chemical) return;

    const targetBeakerId = get().beakers[get().activeBeakerIndex]?.id;
    if (!targetBeakerId) return;

    set({ isPouringFormula: formulaStr });

    setTimeout(() => {
      set(state => {
        const idx = state.beakers.findIndex(beaker => beaker.id === targetBeakerId);
        if (idx === -1) return { isPouringFormula: null };
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
        const updatedMaterialBatches = [...(beaker.materialBatches || []), { ...historyItem }];

        const formulas = newContents.map(c => c.formula);
        const reaction = get()._findReaction(formulas, beaker.isHeating, beaker.isElectrolyzing, beaker.heatTemperature);
        
        const newBeakers = [...state.beakers];
        let updatedBeaker = {
          ...beaker,
          contents: newContents,
          droppedSolids: newSolids,
          addedHistory: updatedAddedHistory,
          materialBatches: updatedMaterialBatches,
          liquidVolume: chemical.state === 'liquid'
            ? Math.min(1, (Number(beaker.liquidVolume) || 0) + 1)
            : beaker.liquidVolume,
          heatTime: 0,
          safetyWarning: '',
        };

        if (reaction) {
          updatedBeaker = get()._processBeakerReaction(reaction, updatedBeaker);
        } else {
          // Kiểm tra xem có phản ứng tiềm năng nào thiếu điều kiện không
          const potential = get()._findPotentialReaction(formulas);
          if (potential) {
            const conditionResult = checkReactionConditions(potential, {
              isHeating: beaker.isHeating,
              isElectrolyzing: beaker.isElectrolyzing,
              currentTemp: beaker.heatTemperature,
            });
            updatedBeaker.reactionMessage = `⚠️ Thiếu điều kiện: ${conditionResult.missing.join(', ') || potential.conditions || 'Chưa xác định'}`;
          }
        }

        // Visual effect when dropping gases (keep gas in beaker for reactions)
        if (chemical.state === 'gas') {
          updatedBeaker.activeBubbles = true;
          updatedBeaker.activeSmoke = true;
          if (!reaction) updatedBeaker.reactionMessage = `Sục khí ${chemical.formula} vào cốc.`;
          
          setTimeout(() => {
            set(s => {
              const bks = [...s.beakers];
              const currentIndex = bks.findIndex(item => item.id === targetBeakerId);
              if (currentIndex !== -1) {
                bks[currentIndex] = {
                  ...bks[currentIndex],
                  activeBubbles: false,
                  activeSmoke: false,
                };
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
    return reactions.find(rx => {
      const rxReactants = Array.from(new Set((rx.reactants || []).map(r => normalizeFormula(r.formula))));
      return rxReactants.every(r => uniqueFormulas.includes(r));
    });
  },

  _findReaction: (formulas, isHeating, isElectrolyzing, currentTemp = 25) => {
    const { reactions } = get();
    const uniqueFormulas = Array.from(new Set(formulas.map(normalizeFormula)));
    return reactions.find(rx => {
      const rxReactants = Array.from(new Set((rx.reactants || []).map(r => normalizeFormula(r.formula))));
      if (!rxReactants.every(r => uniqueFormulas.includes(r))) return false;
      return checkReactionConditions(rx, { isHeating, isElectrolyzing, currentTemp }).met;
    });
  },

  _processBeakerReaction: (reaction, beaker) => {
    const { chemicals } = get();
    const outcome = calculateReactionOutcome(reaction, beaker.materialBatches || [], chemicals);
    if (!outcome) {
      return { ...beaker, reactionMessage: '⚠️ Không đủ lượng chất để phản ứng.' };
    }

    const materialBatches = outcome.batches.map(batch => ({ ...batch, id: batch.id || generateId() }));
    const processedContents = materialBatches.map(batch => {
      const prodData = getChemicalByFormula(chemicals, batch.formula);
      return {
        ...prodData,
        formula: batch.formula,
        name: batch.name || prodData.name || batch.formula,
        state: batch.state || prodData.state || 'liquid',
        color: prodData.color || '#ffffff',
        id: batch.id,
        amount: batch.amount,
        unit: batch.unit,
        isPrecipitate: Boolean(batch.isPrecipitate),
      };
    });
    const products = outcome.productBatches.map(product => ({
      formula: product.formula,
      color: getChemicalByFormula(chemicals, product.formula).color || '#ffffff',
    }));
    const newYields = [
      ...(beaker.yieldHistory || []),
      ...outcome.productBatches.map(product => ({ ...product, id: generateId() })),
    ];
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
            const index = bks.findIndex(item => item.id === beaker.id);
            if (index !== -1) bks[index] = { ...bks[index], shake: false };
            return { beakers: bks };
          });
       }, 500);
    }

    if (hasGas) {
        setTimeout(() => {
            set(state => {
              const bks = [...state.beakers];
              const index = bks.findIndex(item => item.id === beaker.id);
              if (index !== -1) {
                const nonGasBatches = (bks[index].materialBatches || []).filter(batch => batch.state !== 'gas');
                bks[index] = {
                  ...bks[index],
                  activeBubbles: false,
                  activeSmoke: false,
                  materialBatches: nonGasBatches,
                  contents: bks[index].contents.filter(c => c.state !== 'gas'),
                };
              }
              return { beakers: bks };
            });
        }, 5000);
    }
    
    if (isExplosion) {
        setTimeout(() => {
          set(state => {
            const bks = [...state.beakers];
            const index = bks.findIndex(item => item.id === beaker.id);
            if (index !== -1) bks[index] = { ...bks[index], activeFlame: false };
            return { beakers: bks };
          });
        }, 2500);
    }

    // Call external discovery handler if provided (will be set in component)
    if (get().onDiscovery) {
      get().onDiscovery(reaction.products);
    }

    return {
      ...beaker,
      contents: processedContents,
      droppedSolids: newSolids,
      materialBatches,
      yieldHistory: newYields,
      reactionMessage: (reaction.name || "Phản ứng đã xảy ra!") + (reaction.conditions ? ` • ĐK: ${reaction.conditions}` : ''),
      activeBubbles: hasGas,
      activeFlame: isExplosion,
      activeSmoke: hasGas || isExplosion,
      smokeColor: smokeColor,
      intensity: intensity,
      reactionProducts: products,
      isHeating: beaker.isHeating,
      shake: isExplosion,
      liquidVolume: processedContents.some(content => content.state === 'liquid')
        ? (beaker.contents.some(content => content.state === 'liquid') ? beaker.liquidVolume : 1)
        : 0,
      heatTime: 0,
      safetyWarning: reaction.safety_warning || reaction.safetyWarning || '',
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
    const types = ['beaker', 'flask', 'dish'];
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
      const solidIds = new Set(solids.map(solid => solid.id));
      const solidBatches = (beaker.materialBatches || []).filter(batch => solidIds.has(batch.id) || batch.state === 'solid');
      newBeaker.materialBatches = solidBatches;
      newBeaker.addedHistory = solidBatches.map(batch => ({
        ...batch,
        id: generateId(),
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      }));

      // Loại bỏ chất rắn khỏi cốc gốc
      const newBeakers = [...state.beakers];
      newBeakers[idx] = {
        ...beaker,
        contents: beaker.contents.filter(c => c.state !== 'solid'),
        droppedSolids: [],
        materialBatches: (beaker.materialBatches || []).filter(batch => !solidIds.has(batch.id) && batch.state !== 'solid'),
        reactionMessage: `Đã vớt ${solids.length} chất rắn/kết tủa ra khỏi cốc.`
      };
      newBeakers.push(newBeaker);

      return { beakers: newBeakers };
    });
  },

  // Rót dung dịch từ cốc này sang cốc khác
  pourToBeaker: (fromIdx, toIdx) => {
    set(state => {
      if (fromIdx === toIdx) return {};
      const fromBeaker = state.beakers[fromIdx];
      const toBeaker = state.beakers[toIdx];
      if (!fromBeaker || !toBeaker) return {};

      // Chỉ rót pha lỏng; khí và chất rắn không được coi là dung dịch.
      const liquids = fromBeaker.contents.filter(c => c.state === 'liquid');
      const liquidIds = new Set(liquids.map(liquid => liquid.id));
      const movedBatches = (fromBeaker.materialBatches || []).filter(batch => liquidIds.has(batch.id) || batch.state === 'liquid');
      const remainingContents = fromBeaker.contents.filter(c => c.state !== 'liquid');
      if (liquids.length === 0) return {};

      const newToContents = [...toBeaker.contents, ...liquids];
      const newBeakers = [...state.beakers];

      // Cốc nguồn: giữ lại chất rắn, mất chất lỏng
      newBeakers[fromIdx] = {
        ...fromBeaker,
        contents: remainingContents,
        materialBatches: (fromBeaker.materialBatches || []).filter(batch => !movedBatches.some(moved => moved.id === batch.id)),
        liquidVolume: 0,
        reactionMessage: `Đã rót dung dịch sang Cốc #${toIdx + 1}.`
      };

      // Cốc đích: nhận chất lỏng, kiểm tra phản ứng
      let updatedToBeaker = {
        ...toBeaker,
        contents: newToContents,
        materialBatches: [...(toBeaker.materialBatches || []), ...movedBatches],
        liquidVolume: 1.0,
        reactionMessage: `Nhận dung dịch từ Cốc #${fromIdx + 1}.`,
        addedHistory: [
          ...(toBeaker.addedHistory || []),
          ...movedBatches.map(l => ({
            id: generateId(),
            formula: l.formula,
            name: l.name || l.formula,
            state: l.state || 'liquid',
            amount: l.amount,
            unit: l.unit,
            moles: l.moles,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          }))
        ]
      };

      // Kiểm tra phản ứng tại cốc đích
      const formulas = newToContents.map(c => c.formula);
      const reaction = get()._findReaction(formulas, toBeaker.isHeating, toBeaker.isElectrolyzing, toBeaker.heatTemperature);
      if (reaction) {
        updatedToBeaker = get()._processBeakerReaction(reaction, updatedToBeaker);
      } else {
        const potential = get()._findPotentialReaction(formulas);
        if (potential) {
          const conditionResult = checkReactionConditions(potential, {
            isHeating: toBeaker.isHeating,
            isElectrolyzing: toBeaker.isElectrolyzing,
            currentTemp: toBeaker.heatTemperature,
          });
          updatedToBeaker.reactionMessage = `⚠️ Thiếu điều kiện: ${conditionResult.missing.join(', ') || potential.conditions || 'Chưa xác định'}`;
        }
      }

      newBeakers[toIdx] = updatedToBeaker;
      return { beakers: newBeakers };
    });
  },
}));

export default useLabStore;
