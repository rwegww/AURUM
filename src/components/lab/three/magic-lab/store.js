import { create } from 'zustand';
import { CHEMICALS, getReaction, isChemicalAllowed } from './reactionDB';

// Helper for generating unique IDs even when called rapidly
let idCounter = Date.now();
const generateId = () => ++idCounter;

const createDefaultBeaker = (id, message = "Cốc thí nghiệm mới") => ({
  id,
  contents: [],
  droppedSolids: [],
  reactionMessage: message,
  isHeating: false,
  activeBubbles: false,
  activeFlame: false,
  activeSmoke: false,
  smokeColor: '#ffffff',
  intensity: 'medium', // low, medium, high, extreme
  reactionProducts: [],
  shake: false,
});

const useLabStore = create((set, get) => ({
  // --- Quản lý nhiều cốc ---
  beakers: [createDefaultBeaker(generateId(), "Cốc thí nghiệm 1")],
  activeBeakerIndex: 0,

  // --- Trạng thái toàn cục (cho animation) ---
  isPouringFormula: null,
  allowedFormulas: Object.keys(CHEMICALS),

  // --- Cài đặt (Settings) ---
  settings: {
    bgColor: '#1a1a2e',
    beakerOpacity: 0.92,
    bgType: 'galaxy', // 'color' hoặc 'galaxy'
  },

  updateSettings: (newSettings) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings }
    }));
  },

  // --- Actions quản lý cốc ---
  setActiveBeaker: (index) => {
    set(state => {
      const beaker = state.beakers[index];
      if (!beaker) return {};
      
      const newAllowed = Object.keys(CHEMICALS).filter(f => 
        isChemicalAllowed(f, beaker.contents, beaker.isHeating)
      );
      
      return { 
        activeBeakerIndex: index,
        allowedFormulas: newAllowed
      };
    });
  },

  addBeaker: () => {
    set(state => {
      if (state.beakers.length >= 4) return {}; 
      const newBeaker = createDefaultBeaker(generateId(), `Cốc thí nghiệm ${state.beakers.length + 1}`);
      const newBeakers = [...state.beakers, newBeaker];
      return { beakers: newBeakers };
    });
  },

  removeBeaker: (index) => {
    set(state => {
      if (state.beakers.length <= 1) return {}; 
      const newBeakers = state.beakers.filter((_, i) => i !== index);
      const newActiveIndex = Math.min(state.activeBeakerIndex, newBeakers.length - 1);
      
      const beaker = newBeakers[newActiveIndex];
      const newAllowed = Object.keys(CHEMICALS).filter(f => 
        isChemicalAllowed(f, beaker.contents, beaker.isHeating)
      );

      return { 
        beakers: newBeakers, 
        activeBeakerIndex: newActiveIndex,
        allowedFormulas: newAllowed
      };
    });
  },

  splitProducts: (index) => {
    const state = get();
    const beaker = state.beakers[index];
    if (!beaker || beaker.contents.length < 2) return;

    const contents = [...beaker.contents];
    const mid = Math.ceil(contents.length / 2);
    const part1 = contents.slice(0, mid);
    const part2 = contents.slice(mid);

    const part1Names = [...new Set(part1.map(p => p.formula))].join(', ');
    const part2Names = [...new Set(part2.map(p => p.formula))].join(', ');

    set(state => {
      const newBeakers = [...state.beakers];
      
      // Cập nhật cốc hiện tại (giữ part1)
      newBeakers[index] = {
        ...beaker,
        contents: part1,
        droppedSolids: beaker.droppedSolids.filter(s => part1.some(p => p.formula === s.formula)),
        reactionMessage: `Cốc ${index + 1} còn lại: ${part1Names}. Đã chuyển ${part2Names} sang cốc mới.`
      };

      // Tạo cốc mới (chứa part2)
      if (newBeakers.length < 4) {
        const newBeaker = {
          ...createDefaultBeaker(generateId(), `Chứa sản phẩm tách: ${part2Names}`),
          contents: part2,
          droppedSolids: beaker.droppedSolids.filter(s => part2.some(p => p.formula === s.formula))
        };
        newBeakers.push(newBeaker);
      }

      const activeBeaker = newBeakers[state.activeBeakerIndex];
      const newAllowed = Object.keys(CHEMICALS).filter(f => 
        isChemicalAllowed(f, activeBeaker.contents, activeBeaker.isHeating)
      );

      return { beakers: newBeakers, allowedFormulas: newAllowed };
    });
  },

  toggleHeat: () => {
    set(state => {
      const idx = state.activeBeakerIndex;
      const beaker = state.beakers[idx];
      const newHeating = !beaker.isHeating;

      const newAllowed = Object.keys(CHEMICALS).filter(f => 
        isChemicalAllowed(f, beaker.contents, newHeating)
      );

      const newBeakers = [...state.beakers];
      let updatedBeaker = { 
        ...beaker, 
        isHeating: newHeating,
        activeSmoke: newHeating ? beaker.activeSmoke : false,
        reactionMessage: !newHeating && beaker.reactionMessage === "Nước đang bay hơi..." ? "Đã dừng đun nóng." : beaker.reactionMessage
      };

      if (newHeating) {
        const reaction = getReaction(beaker.contents, true);
        if (reaction) {
          updatedBeaker = { 
            ...get()._processBeakerReaction(reaction, beaker.contents, beaker.droppedSolids, newHeating, idx),
          };
        } else if (beaker.contents.some(c => c.state === 'liquid')) {
          // Ngay lập tức cho hiện hiệu ứng khói nếu có chất lỏng
          updatedBeaker.activeSmoke = true;
          updatedBeaker.smokeColor = '#ffffff';
          updatedBeaker.intensity = 'low';
        }
      }

      newBeakers[idx] = updatedBeaker;
      return { beakers: newBeakers, allowedFormulas: newAllowed };
    });
  },

  dropToBeaker: (formulaStr) => {
    const chemical = CHEMICALS[formulaStr];
    if (!chemical) return;

    set({ isPouringFormula: formulaStr });

    setTimeout(() => {
      set(state => {
        const idx = state.activeBeakerIndex;
        const beaker = state.beakers[idx];
        
        const newId = generateId();
        const newContents = [...beaker.contents, { ...chemical, key: formulaStr, id: newId }];
        let newSolids = [...beaker.droppedSolids];

        if (chemical.state === 'solid' || chemical.type === 'metal') {
          newSolids.push({ ...chemical, key: formulaStr, id: newId });
        }

        const reaction = getReaction(newContents, beaker.isHeating);
        
        const newBeakers = [...state.beakers];
        let updatedBeaker = {
          ...beaker,
          contents: newContents,
          droppedSolids: newSolids,
        };

        if (reaction) {
          updatedBeaker = get()._processBeakerReaction(reaction, newContents, newSolids, beaker.isHeating, idx);
        }

        newBeakers[idx] = updatedBeaker;

        const newAllowed = Object.keys(CHEMICALS).filter(f => 
          isChemicalAllowed(f, updatedBeaker.contents, beaker.isHeating)
        );

        return { 
          beakers: newBeakers, 
          isPouringFormula: null,
          allowedFormulas: newAllowed
        };
      });
    }, 800);
  },

  _processBeakerReaction: (reaction, contents, solids, isHeating, beakerIdx) => {
    let processedContents = [...contents];
    let consumedReactants = [...reaction.reactants];

    if (!reaction.preserveReactants) {
      processedContents = processedContents.filter(item => {
        const index = consumedReactants.indexOf(item.formula);
        if (index > -1) {
          consumedReactants.splice(index, 1);
          return false;
        }
        return true;
      });
    }

    const products = [];
    reaction.products.forEach((prodFormula, i) => {
      const prodData = CHEMICALS[prodFormula] || { formula: prodFormula, color: '#ffffff', state: 'liquid' };
      processedContents.push({ ...prodData, key: prodFormula, id: generateId() });
      products.push({ formula: prodData.formula, color: prodData.color });
    });

    const remainingFormulas = processedContents.map(c => c.formula);
    const newSolids = solids.filter(solid => remainingFormulas.includes(solid.formula));

    const effects = reaction.effects || {};
    const intensity = effects.intensity || 'medium';
    const smokeColor = effects.smoke === 'purple' ? '#a855f7' : (effects.smoke === 'grey' ? '#666666' : '#ffffff');

    // Trigger Shake if intense
    if (intensity === 'extreme' || intensity === 'shatter' || intensity === 'high') {
       setTimeout(() => {
          set(state => {
            const bks = [...state.beakers];
            if (bks[beakerIdx]) bks[beakerIdx].shake = false;
            return { beakers: bks };
          });
       }, 500);
    }

    if (effects.gas || effects.smoke) {
        setTimeout(() => {
            set(state => {
              const bks = [...state.beakers];
              if (bks[beakerIdx]) {
                bks[beakerIdx].activeBubbles = false;
                bks[beakerIdx].activeSmoke = false;
              }
              return { beakers: bks };
            });
        }, 5000);
    }
    
    if (effects.type === 'explosion' || effects.type === 'fire') {
        const duration = intensity === 'extreme' ? 4000 : 2500;
        setTimeout(() => {
          set(state => {
            const bks = [...state.beakers];
            if (bks[beakerIdx]) bks[beakerIdx].activeFlame = false;
            return { beakers: bks };
          });
        }, duration);
    }
    
    if (products.length > 0) {
        setTimeout(() => {
          set(state => {
            const bks = [...state.beakers];
            if (bks[beakerIdx]) bks[beakerIdx].reactionProducts = [];
            return { beakers: bks };
          });
        }, 8000);
    }

    return {
      contents: processedContents,
      droppedSolids: newSolids,
      reactionMessage: reaction.message,
      activeBubbles: !!effects.gas,
      activeFlame: effects.type === 'explosion' || effects.type === 'fire',
      activeSmoke: !!effects.smoke || effects.type === 'smoke_only',
      smokeColor: smokeColor,
      intensity: intensity,
      reactionProducts: products,
      isHeating: isHeating,
      shake: intensity === 'extreme' || intensity === 'shatter' || intensity === 'high'
    };
  },

  evaporateStep: (index) => {
    set(state => {
      const beaker = state.beakers[index];
      if (!beaker || !beaker.isHeating) return {};

      const liquids = beaker.contents.filter(item => item.state === 'liquid' && item.formula !== 'Hg'); // Hg doesn't evaporate easily in this sim
      if (liquids.length === 0) {
        // Nếu không còn nước mà vẫn còn muối tan (NaCl, FeCl2, etc.)
        // Chuyển sang solid
        const solubles = beaker.contents.filter(item => item.state === 'liquid' && item.formula !== 'H2O');
        
        if (beaker.contents.length > 0) {
           const newContents = beaker.contents.map(item => {
              if (item.state === 'liquid' && item.formula !== 'H2O') {
                 return { ...item, state: 'solid' };
              }
              return item;
           }).filter(item => item.formula !== 'H2O'); // Xóa sạch H2O

           const newSolids = [...beaker.droppedSolids];
           newContents.forEach(c => {
              if (c.state === 'solid' && !newSolids.some(s => s.id === c.id)) {
                   newSolids.push(c);
              }
           });

           const bks = [...state.beakers];
           bks[index] = { 
             ...beaker, 
             contents: newContents, 
             droppedSolids: newSolids,
             activeSmoke: false,
             reactionMessage: liquids.length === 0 && beaker.contents.some(c => c.formula === 'H2O') ? "Nước đã bay hơi hết. Chất rắn kết tinh." : beaker.reactionMessage
           };
           return { beakers: bks };
        }
        return { beakers: state.beakers };
      }

      // Xóa bớt 1 item lỏng (H2O ưu tiên)
      let foundH2O = liquids.find(l => l.formula === 'H2O');
      let targetItem = foundH2O || liquids[0];
      let targetId = targetItem.id;

      const newContents = beaker.contents.filter(c => c.id !== targetId);
      const bks = [...state.beakers];
      bks[index] = { 
        ...beaker, 
        contents: newContents,
        activeSmoke: true,
        smokeColor: '#ffffff',
        intensity: 'low',
        reactionMessage: `${targetItem.name || targetItem.formula} đang bay hơi...`
      };

      return { beakers: bks };
    });
  },

  clearBeaker: () => set(state => {
    const idx = state.activeBeakerIndex;
    const newBeakers = [...state.beakers];
    newBeakers[idx] = createDefaultBeaker(generateId(), "Đã rửa sạch cốc.");
    
    return {
      beakers: newBeakers,
      isPouringFormula: null,
      allowedFormulas: Object.keys(CHEMICALS)
    };
  }),
}));

export default useLabStore;
