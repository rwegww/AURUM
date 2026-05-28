import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { molecules } from '../../data/molecules';
import { elements } from '../../data/elements';
import { craftableItems } from '../../data/labInventory';
import { CheckCircle2, Lock, ChevronRight, Activity, ArrowRight, Plus, Microscope } from 'lucide-react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// Helper to normalize formulas (Hâ‚‚ -> H2)
const normalize = (f) => {
  if (!f) return "";
  const subMap = { 'â‚€': '0', 'â‚': '1', 'â‚‚': '2', 'â‚ƒ': '3', 'â‚„': '4', 'â‚…': '5', 'â‚†': '6', 'â‚‡': '7', 'â‚ˆ': '8', 'â‚‰': '9' };
  return f.toString().replace(/[â‚€â‚â‚‚â‚ƒâ‚„â‚…â‚†â‚‡â‚ˆâ‚‰]/g, (m) => subMap[m]).trim().toUpperCase();
};

const calculateMolarMass = (formula, elements) => {
  if (!formula) return 0;
  const clean = formula.toString().replace(/[â‚€â‚â‚‚â‚ƒâ‚„â‚…â‚†â‚‡â‚ˆâ‚‰]/g, (m) => {
    const subMap = { 'â‚€': '0', 'â‚': '1', 'â‚‚': '2', 'â‚ƒ': '3', 'â‚„': '4', 'â‚…': '5', 'â‚†': '6', 'â‚‡': '7', 'â‚ˆ': '8', 'â‚‰': '9' };
    return subMap[m];
  }).trim();

  const parse = (f) => {
    let total = 0;
    let i = 0;
    while (i < f.length) {
      if (f[i] === '(') {
        let start = i + 1;
        let pMatch = 1;
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
        total += parse(sub) * multiplier;
      } else {
        let match = f.substring(i).match(/^([A-Z][a-z]*)(\d*)/);
        if (match) {
          const sym = match[1];
          const count = parseInt(match[2] || "1");
          const el = elements.find(e => e.symbol === sym);
          if (el) total += parseFloat(el.weight) * count;
          i += match[0].length;
        } else {
          i++;
        }
      }
    }
    return total;
  };
  const result = parse(clean);
  return result > 0 ? result.toFixed(3) : "??";
};

const getApplications = (formula, name, category) => {
  const apps = {
    'H2O': 'Sá»± sá»‘ng, dung mÃ´i váº¡n nÄƒng, lÃ m mÃ¡t cÃ´ng nghiá»‡p.',
    'NACL': 'Gia vá»‹ thá»±c pháº©m, báº£o quáº£n thá»©c Äƒn, sáº£n xuáº¥t xÃºt-clo.',
    'CO2': 'NhiÃªn lá»ng, chá»¯a chÃ¡y, cÃ´ng nghá»‡ thá»±c pháº©m (nÆ°á»›c ngá»t).',
    'O2': 'Duy trÃ¬ sá»± sá»‘ng, y táº¿, tÃªn lá»­a, luyá»‡n kim.',
    'H2': 'NhiÃªn liá»‡u sáº¡ch, sáº£n xuáº¥t amoniac, cÃ´ng nghiá»‡p thá»±c pháº©m.',
    'H2SO4': 'Sáº£n xuáº¥t phÃ¢n bÃ³n, cháº¥t táº©y rá»­a, áº¯c quy chÃ¬.',
    'NAOH': 'Sáº£n xuáº¥t xÃ  phÃ²ng, giáº¥y, xá»­ lÃ½ nÆ°á»›c tháº£i.',
    'FE3O4': 'Sáº£n xuáº¥t nam chÃ¢m, sÆ¡n chá»‘ng gá»‰, core cho linh kiá»‡n Ä‘iá»‡n tá»­.',
    'HCL': 'Táº©y gá»‰ thÃ©p, Ä‘iá»u chá»‰nh pH, sáº£n xuáº¥t há»£p cháº¥t vÃ´ cÆ¡.',
    'NH3': 'PhÃ¢n bÃ³n (Ä‘áº¡m), há»‡ thá»‘ng lÃ m láº¡nh cÃ´ng nghiá»‡p.',
    'CACO3': 'Sáº£n xuáº¥t xi mÄƒng, vÃ´i, pháº¥n viáº¿t, thá»±c pháº©m bá»• sung.',
    'AL': 'Váº­t liá»‡u hÃ ng khÃ´ng, bao bÃ¬, dÃ¢y Ä‘iá»‡n, xÃ¢y dá»±ng.',
    'FE': 'Cá»‘t thÃ©p xÃ¢y dá»±ng, mÃ¡y mÃ³c, linh kiá»‡n, hemoglobin trong mÃ¡u.',
    'CU': 'DÃ¢y dáº«n Ä‘iá»‡n, vi máº¡ch, trang trÃ­, Ä‘á»“ng Ä‘Ãºc tÆ°á»£ng.',
    'ZN': 'Máº¡ chá»‘ng gá»‰ cho thÃ©p, sáº£n xuáº¥t pin, há»£p kim Ä‘á»“ng thau.'
  };
  const norm = normalize(formula);
  if (apps[norm]) return apps[norm];
  if (category?.includes('Axit')) return 'Sáº£n xuáº¥t hÃ³a cháº¥t, táº©y rá»­a bá» máº·t, Ä‘iá»u chá»‰nh pH.';
  if (category?.includes('BazÆ¡')) return 'Xá»­ lÃ½ nÆ°á»›c, sáº£n xuáº¥t cháº¥t táº©y rá»­a, xÃ  phÃ²ng.';
  if (category?.includes('Muá»‘i')) return 'CÃ´ng nghiá»‡p thá»±c pháº©m, sáº£n xuáº¥t phÃ¢n bÃ³n, hÃ³a cháº¥t.';
  if (category?.includes('Kim loáº¡i')) return 'CÆ¡ khÃ­ cháº¿ táº¡o, Ä‘iá»‡n tá»­, xÃ¢y dá»±ng.';
  return 'NghiÃªn cá»©u khoa há»c, giÃ¡o dá»¥c vÃ  mÃ´ phá»ng thÃ­ nghiá»‡m.';
};

const TIER_THEME = {
  0: { color: '#3b82f6', icon: 'ðŸ’Ž', label: 'Báº­c 0: NguyÃªn báº£n' },
  1: { color: '#10b981', icon: 'ðŸŒ¿', label: 'Báº­c 1: SÆ¡ cáº¥p' },
  2: { color: '#f59e0b', icon: 'âš¡', label: 'Báº­c 2: Trung cáº¥p' },
  3: { color: '#ef4444', icon: 'ðŸ”¥', label: 'Báº­c 3: Cao cáº¥p' },
  4: { color: '#8b5cf6', icon: 'ðŸ”®', label: 'KhÃ¡c / Huyá»n bÃ­' }
};

const buildPyramidRows = (items) => {
  const rows = [];
  let currentIndex = 0;
  // Báº¯t Ä‘áº§u vá»›i sá»‘ lÆ°á»£ng cháº¥t vá»«a pháº£i á»Ÿ Ä‘á»‰nh Ä‘á»ƒ chÃ³p khÃ´ng quÃ¡ nhá»n (vÃ­ dá»¥: 2 cháº¥t)
  let itemsInRow = 2;

  while (currentIndex < items.length) {
    const row = items.slice(currentIndex, currentIndex + itemsInRow);
    rows.push(row);
    currentIndex += itemsInRow;
    itemsInRow++;
  }
  return rows;
};

const DiscoveryMap = ({ chemicals = [], reactions: _reactions = [], discoveredFormulas = [] }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const containerRef = useRef(null);

  const normalizedDiscovered = useMemo(() => 
    new Set(discoveredFormulas.map(f => normalize(f)))
  , [discoveredFormulas]);

  // Compute Tiers using BFS on Reactions
  const treeData = useMemo(() => {
    const tierMap = new Map();
    const elementsByTier = { 0: [], 1: [], 2: [], 3: [], 4: [] };

    // Initialize Tier 0 (Starters)
    chemicals.forEach(chem => {
      const normF = normalize(chem.formula);
      if (chem.is_starter || chem.isStarter) {
        tierMap.set(normF, 0);
      }
    });

    // Run BFS to assign tiers
    let changed = true;
    let iterations = 0;
    while(changed && iterations < 10) {
      changed = false;
      iterations++;
      _reactions.forEach(rx => {
        if (!rx.reactants || !rx.products) return;
        
        let maxReactantTier = -1;
        let allReactantsHaveTier = true;
        
        rx.reactants.forEach(r => {
          const rf = normalize(r.formula);
          if (tierMap.has(rf)) {
            maxReactantTier = Math.max(maxReactantTier, tierMap.get(rf));
          } else {
            allReactantsHaveTier = false;
          }
        });

        if (allReactantsHaveTier && maxReactantTier !== -1) {
          const productTier = Math.min(maxReactantTier + 1, 3);
          rx.products.forEach(p => {
            const pf = normalize(p.formula);
            const currentTier = tierMap.get(pf);
            if (currentTier === undefined || productTier < currentTier) {
               tierMap.set(pf, productTier);
               changed = true;
            }
          });
        }
      });
    }

    chemicals.forEach(chem => {
      const normF = normalize(chem.formula);
      let tier = tierMap.get(normF);
      if (tier === undefined) tier = 4;
      
      const isDiscovered = normalizedDiscovered.has(normF) || chem.is_starter || chem.isStarter;
      
      const node = {
         ...chem,
         normalizedFormula: normF,
         isDiscovered,
         tier
      };
      
      if (!elementsByTier[tier]) elementsByTier[tier] = [];
      elementsByTier[tier].push(node);
    });

    const result = {};
    [0,1,2,3,4].forEach(t => {
       if (elementsByTier[t] && elementsByTier[t].length > 0) {
           elementsByTier[t].sort((a,b) => {
               if (a.isDiscovered === b.isDiscovered) return a.normalizedFormula.localeCompare(b.normalizedFormula);
               return a.isDiscovered ? -1 : 1;
           });
           result[t] = elementsByTier[t];
       }
    });
    return result;
  }, [chemicals, _reactions, normalizedDiscovered]);

  const tierKeys = Object.keys(treeData).map(Number).sort();

  const selectedData = useMemo(() => {
    if (!selectedId) return null;
    
    const node = chemicals.find(c => normalize(c.formula) === selectedId);
    let isDiscovered = normalizedDiscovered.has(selectedId);
    if (node) isDiscovered = isDiscovered || node.is_starter || node.isStarter;

    const molecule = molecules.find(m => normalize(m.formula) === selectedId);
    if (molecule) return { ...node, ...molecule, isDiscovered, formula: selectedId };
    const element = elements.find(e => normalize(e.symbol) === selectedId);
    if (element) return { ...node, ...element, isDiscovered, name: element.name, description: element.desc, formula: selectedId };
    const craftable = craftableItems.find(c => normalize(c.formula) === selectedId);
    if (craftable) return { ...node, ...craftable, isDiscovered, formula: selectedId };

    return { ...node, isDiscovered, formula: selectedId };
  }, [selectedId, chemicals, normalizedDiscovered]);

  const synthesisPathways = useMemo(() => {
    if (!selectedId || !_reactions) return [];
    return _reactions.filter(rx => 
       rx.products && Array.isArray(rx.products) && rx.products.some(p => normalize(p.formula) === normalize(selectedId))
    );
  }, [selectedId, _reactions]);

  const highlightedNodes = useMemo(() => {
    const highlights = new Set();
    const activeId = hoveredId || selectedId;
    if (activeId) {
      highlights.add(activeId);
      _reactions.forEach(rx => {
        if (rx.products && rx.products.some(p => normalize(p.formula) === activeId)) {
          rx.reactants?.forEach(r => highlights.add(normalize(r.formula)));
        }
      });
      _reactions.forEach(rx => {
        if (rx.reactants && rx.reactants.some(r => normalize(r.formula) === activeId)) {
          rx.products?.forEach(p => highlights.add(normalize(p.formula)));
        }
      });
    }
    return highlights;
  }, [hoveredId, selectedId, _reactions]);

  const renderPathwayNode = (formula, coeff, name, isProduct = false) => {
     const isDiscovered = normalizedDiscovered.has(normalize(formula));
     return (
        <div className="flex flex-col items-center gap-1">
           <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${isProduct ? 'border-viet-green bg-viet-green/10' : (isDiscovered ? 'border-white/20 bg-white/5' : 'border-red-500/30 bg-red-500/10')}`}>
              <span className={`font-black italic ${isProduct ? 'text-viet-green' : (isDiscovered ? 'text-white' : 'text-red-400')}`}>
                 {coeff > 1 ? <span className="text-[10px] opacity-70 mr-0.5">{coeff}</span> : null}
                 {formula}
              </span>
           </div>
           <span className="text-[9px] text-center font-bold text-white/50 w-16 truncate" title={name}>{name || formula}</span>
        </div>
     );
  };

  const renderItemNode = (item, theme) => {
    const isHighlighted = highlightedNodes.has(item.normalizedFormula);
    const isFaded = highlightedNodes.size > 0 && !isHighlighted;

    return (
        <motion.button
            key={item.formula}
            onMouseEnter={() => setHoveredId(item.normalizedFormula)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setSelectedId(item.normalizedFormula)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all duration-300 w-[180px] text-left relative overflow-hidden group ${
                item.isDiscovered 
                    ? 'bg-[#1a1c23] border-white/10 hover:border-white/30 shadow-lg' 
                    : 'bg-[#1a1c23]/30 border-white/5 opacity-60 hover:opacity-100'
            }`}
            style={{
                borderColor: isHighlighted ? theme.color : (selectedId === item.normalizedFormula ? theme.color : undefined),
                opacity: isFaded ? 0.3 : 1,
                transform: isHighlighted ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isHighlighted ? `0 0 20px ${theme.color}40` : undefined,
                zIndex: isHighlighted ? 10 : 1
            }}
        >
            {isHighlighted && (
                <div className="absolute inset-0 opacity-10" style={{ backgroundColor: theme.color }} />
            )}

            <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 relative overflow-hidden transition-colors"
                style={{ backgroundColor: item.isDiscovered ? theme.color + '20' : '#00000040' }}
            >
                {item.isDiscovered && (
                    <div className="absolute inset-0 opacity-20 blur-md" style={{ backgroundColor: theme.color }} />
                )}
                {item.isDiscovered ? (
                    <span className="text-[11px] font-black italic text-white relative z-10">{item.formula}</span>
                ) : (
                    <Lock size={14} className="text-white/20 relative z-10" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-[11px] font-bold leading-tight truncate ${item.isDiscovered ? 'text-white' : 'text-white/40'}`}>
                    {item.isDiscovered ? item.name : 'Cháº¥t bÃ­ áº©n'}
                </p>
                <p className="text-[8px] font-black text-white/30 mt-0.5 uppercase tracking-widest">
                    {item.category || 'Váº­t cháº¥t'}
                </p>
            </div>
        </motion.button>
    );
  };

  return (
    <div className="w-full h-full bg-[#0a0c10] overflow-hidden relative flex flex-col font-sans text-white">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Main Map Area with Zoom & Pan */}
      <div className="flex-1 overflow-hidden relative" ref={containerRef}>
        <TransformWrapper
          initialScale={1}
          minScale={0.4}
          maxScale={1.5}
          centerOnInit={true}
          limitToBounds={true}
          wheel={{ step: 0.1 }}
          panning={{ velocityDisabled: false }}
        >
          <TransformComponent wrapperStyle={{ width: '100%', height: '100%', cursor: 'grab' }} contentStyle={{ minWidth: '100%', minHeight: '100%' }}>
            
            {/* Top-to-Bottom Tree Layout */}
            <div className="flex flex-col items-center min-w-max min-h-max py-24 px-12 relative z-10 gap-32">
              
              {/* ROOT NODE / START */}
              <div className="flex justify-center w-full shrink-0">
                 <motion.div
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="px-8 py-4 bg-viet-green text-white rounded-full font-black text-xl uppercase tracking-widest shadow-[0_0_40px_rgba(16,185,129,0.3)] border-b-[4px] border-emerald-700 select-none flex items-center justify-center"
                 >
                   CÃ‚Y TIáº¾N HÃ“A Váº¬T CHáº¤T
                 </motion.div>
              </div>

              {/* TIERS AS ROWS */}
              {tierKeys.map((tier, tIdx) => {
                const theme = TIER_THEME[tier];
                const items = treeData[tier] || [];
                
                return (
                  <div key={tier} className="flex flex-col gap-8 shrink-0 relative items-center justify-center w-full">
                    {/* Tier Header */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: tIdx * 0.1 }}
                      className="z-20 bg-[#0a0c10]/90 backdrop-blur-md py-3 px-8 rounded-full border border-white/10 flex items-center justify-center gap-4 shadow-xl mb-4"
                    >
                       <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-white/5 border border-white/10" style={{ color: theme.color }}>
                          {theme.icon}
                       </div>
                       <div className="flex flex-col">
                           <h2 className="text-sm font-black uppercase tracking-widest text-white leading-none">{theme.label}</h2>
                           <span className="text-[10px] font-bold text-white/40 mt-1">{items.length} cháº¥t</span>
                       </div>
                    </motion.div>

                    {/* Items Grid for this Tier Row */}
                    <motion.div 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ delay: tIdx * 0.1 + 0.2 }}
                       className="flex flex-col items-center gap-4"
                       style={{ maxWidth: '4000px' }}
                    >
                       {buildPyramidRows(items).map((rowItems, rIdx) => (
                          <div key={rIdx} className="flex justify-center gap-4">
                             {rowItems.map(item => renderItemNode(item, theme))}
                          </div>
                       ))}
                    </motion.div>
                  </div>
                );
              })}

              <div className="h-32 shrink-0" />
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>

      {/* Substance Detail Card (Right Modal) */}
      <AnimatePresence>
        {selectedId && selectedData && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setSelectedId(null)}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
               initial={{ x: 600, opacity: 0 }} 
               animate={{ x: 0, opacity: 1 }} 
               exit={{ x: 600, opacity: 0 }}
               className="absolute top-4 right-4 bottom-4 w-[550px] bg-[#1a1c23]/95 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-[101] overflow-hidden flex flex-col"
            >
               <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-viet-green to-transparent opacity-50" />
               <div className="p-8 pb-4 flex flex-col items-center text-center relative shrink-0">
                  <button onClick={() => setSelectedId(null)} className="absolute top-6 left-6 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all border border-white/5">
                     <span className="text-white/60 text-lg font-light">âœ•</span>
                  </button>
                  <div className="mt-4 mb-4 relative">
                     <motion.div 
                        animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-10 bg-viet-green/10 blur-3xl rounded-full pointer-events-none" 
                     />
                     <h2 className="text-6xl font-black italic tracking-tighter text-white font-sora relative z-10 drop-shadow-2xl">
                        {selectedData.formula || selectedData.symbol}
                     </h2>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">{selectedData.isDiscovered ? selectedData.name : 'Váº­t cháº¥t bÃ­ áº©n'}</h3>
                  <div className="px-5 py-1.5 bg-white/10 border border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-[3px]">
                     {selectedData.category || 'Váº­t cháº¥t'}
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-4 flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-viet-green/20 flex items-center justify-center text-viet-green">
                           <Activity size={16} />
                        </div>
                        <h4 className="text-[12px] font-black text-white/60 uppercase tracking-[3px]">CÃ¢y Tá»•ng Há»£p</h4>
                     </div>
                     <div className="bg-black/30 p-6 rounded-[24px] border border-white/5 flex flex-col gap-6">
                        {selectedData.is_starter || selectedData.isStarter ? (
                           <div className="text-center py-4">
                              <p className="text-white/40 text-[13px] font-semibold italic">NguyÃªn liá»‡u gá»‘c. Trá»ng tÃ¢m trong vÅ© trá»¥ váº­t cháº¥t.</p>
                           </div>
                        ) : synthesisPathways.length > 0 ? (
                           synthesisPathways.map((pathway, pIdx) => (
                              <div key={pathway.id} className="flex flex-col gap-3">
                                 <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">CÃ¡ch tá»•ng há»£p #{pIdx + 1}</span>
                                    <span className="text-[10px] font-bold text-white/20 bg-white/5 px-2 py-0.5 rounded">{pathway.type || 'Pháº£n á»©ng'}</span>
                                 </div>
                                 <div className="flex items-center justify-center gap-3 flex-wrap">
                                    <div className="flex items-center gap-2">
                                       {pathway.reactants.map((reactant, rIdx) => (
                                          <React.Fragment key={`r-${rIdx}`}>
                                             {rIdx > 0 && <Plus size={14} className="text-white/30" />}
                                             {renderPathwayNode(reactant.formula, reactant.coeff, reactant.name, false)}
                                          </React.Fragment>
                                       ))}
                                    </div>
                                    <div className="flex flex-col items-center justify-center mx-2">
                                       <span className="text-[8px] text-white/30 font-bold mb-1">{pathway.conditions ? 'ÄK' : ''}</span>
                                       <ArrowRight size={20} className="text-viet-green opacity-70" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                       {pathway.products.map((product, prIdx) => {
                                          const isTarget = normalize(product.formula) === normalize(selectedData.formula);
                                          return (
                                             <React.Fragment key={`p-${prIdx}`}>
                                                {prIdx > 0 && <Plus size={14} className="text-white/30" />}
                                                {renderPathwayNode(product.formula, product.coeff, product.name, isTarget)}
                                             </React.Fragment>
                                          );
                                       })}
                                    </div>
                                 </div>
                                 {pathway.conditions && (
                                    <p className="text-[10px] text-white/40 italic text-center mt-2">ÄK: {pathway.conditions}</p>
                                 )}
                              </div>
                           ))
                        ) : (
                           <div className="text-center py-4">
                              <p className="text-white/40 text-[13px] font-semibold italic">ChÆ°a cÃ³ cÃ´ng thá»©c nÃ o Ä‘á»ƒ táº¡o ra cháº¥t nÃ y trong dá»¯ liá»‡u.</p>
                           </div>
                        )}
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/50"><Microscope size={16} /></div>
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[4px]">TÃ­nh cháº¥t & MÃ´ táº£</h4>
                     </div>
                     <div className="bg-white/5 p-6 rounded-[24px] border border-white/5">
                        <p className="text-white/80 text-[14px] leading-relaxed font-medium italic">
                           {selectedData.isDiscovered ? (selectedData.description || 'ChÆ°a cÃ³ mÃ´ táº£ chi tiáº¿t cho váº­t cháº¥t nÃ y.') : 'Báº¡n chÆ°a khÃ¡m phÃ¡ ra bÃ­ máº­t cá»§a váº­t cháº¥t nÃ y. HÃ£y thá»­ káº¿t há»£p cÃ¡c nguyÃªn tá»‘ trong phÃ²ng Lab!'}
                        </p>
                     </div>
                  </div>
                  <div className="flex flex-col gap-4">
                     <div className="bg-white/5 p-6 rounded-[24px] border border-white/5 flex flex-col gap-2">
                        <span className="text-[8px] font-black text-viet-green uppercase tracking-[3px]">Khá»‘i lÆ°á»£ng nguyÃªn tá»­ / phÃ¢n tá»­</span>
                        <div className="flex items-baseline gap-2">
                           <span className="text-3xl font-black text-white italic">{calculateMolarMass(selectedData.formula || selectedData.symbol, elements)}</span>
                           <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">u (amu)</span>
                        </div>
                     </div>
                     <div className="bg-white/5 p-6 rounded-[24px] border border-white/5 space-y-3">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-viet-green" />
                           <span className="text-[8px] font-black text-white/50 uppercase tracking-[3px]">á»¨ng dá»¥ng trong Ä‘á»i sá»‘ng</span>
                        </div>
                        <p className="text-white/80 text-[13px] leading-relaxed font-semibold italic border-l-2 border-viet-green/30 pl-4">
                           {selectedData.isDiscovered ? getApplications(selectedData.formula || selectedData.symbol, selectedData.name, selectedData.category) : 'KhÃ¡m phÃ¡ cháº¥t nÃ y trong phÃ²ng Lab Ä‘á»ƒ tÃ¬m hiá»ƒu cÃ¡c á»©ng dá»¥ng thá»±c táº¿ phong phÃº!'}
                        </p>
                     </div>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiscoveryMap;

