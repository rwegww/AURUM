import { create } from 'zustand';

// Helper for generating unique IDs
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
  intensity: 'medium', 
  reactionProducts: [],
  shake: false,
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
        const reaction = get()._findReaction(formulas, true);
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

        const formulas = newContents.map(c => c.formula);
        const reaction = get()._findReaction(formulas, beaker.isHeating);
        
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

        return { 
          beakers: newBeakers, 
          isPouringFormula: null,
        };
      });
    }, 800);
  },

  _findReaction: (formulas, isHeating) => {
    const { reactions } = get();
    return reactions.find(rx => {
      const rxReactants = rx.reactants.map(r => r.formula);
      if (rxReactants.length !== formulas.length) return false;
      const match = formulas.every(f => rxReactants.includes(f));
      if (rx.requires_heat && !isHeating) return false;
      return match;
    });
  },

  _processBeakerReaction: (reaction, contents, solids, isHeating, beakerIdx) => {
    const { chemicals } = get();
    let processedContents = [...contents];
    
    // Most reactions in the backend consume all reactants
    processedContents = []; 

    const products = [];
    reaction.products.forEach((prod) => {
      const prodData = chemicals[prod.formula] || { formula: prod.formula, color: '#ffffff', state: 'liquid' };
      processedContents.push({ ...prodData, id: generateId() });
      products.push({ formula: prodData.formula, color: prodData.color });
    });

    const remainingFormulas = processedContents.map(c => c.formula);
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
      reactionMessage: reaction.name || "Phản ứng đã xảy ra!",
      activeBubbles: hasGas,
      activeFlame: isExplosion,
      activeSmoke: hasGas || isExplosion,
      smokeColor: smokeColor,
      intensity: intensity,
      reactionProducts: products,
      isHeating: isHeating,
      shake: isExplosion
    };
  },

  setOnDiscovery: (callback) => set({ onDiscovery: callback }),

  clearBeaker: () => set(state => {
    const idx = state.activeBeakerIndex;
    const newBeakers = [...state.beakers];
    newBeakers[idx] = createDefaultBeaker(generateId(), "Đã làm sạch dụng cụ.");
    return { beakers: newBeakers, isPouringFormula: null };
  }),
}));

export default useLabStore;
