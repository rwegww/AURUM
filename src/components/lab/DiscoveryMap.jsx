import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { molecules } from '../../data/molecules';
import { elements } from '../../data/elements';
import { craftableItems } from '../../data/labInventory';
import { CheckCircle2, Lock, ChevronRight, Activity, ArrowRight, Plus, Microscope } from 'lucide-react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// Helper to normalize formulas (H₂ -> H2)
const normalize = (f) => {
  if (!f) return "";
  const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  return f.toString().replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => subMap[m]).trim().toUpperCase();
};

const calculateMolarMass = (formula, elements) => {
  if (!formula) return 0;
  const clean = formula.toString().replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => {
    const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
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
    'H2O': 'Sự sống, dung môi vạn năng, làm mát công nghiệp.',
    'NACL': 'Gia vị thực phẩm, bảo quản thức ăn, sản xuất xút-clo.',
    'CO2': 'Nhiên lỏng, chữa cháy, công nghệ thực phẩm (nước ngọt).',
    'O2': 'Duy trì sự sống, y tế, tên lửa, luyện kim.',
    'H2': 'Nhiên liệu sạch, sản xuất amoniac, công nghiệp thực phẩm.',
    'H2SO4': 'Sản xuất phân bón, chất tẩy rửa, ắc quy chì.',
    'NAOH': 'Sản xuất xà phòng, giấy, xử lý nước thải.',
    'FE3O4': 'Sản xuất nam châm, sơn chống gỉ, core cho linh kiện điện tử.',
    'HCL': 'Tẩy gỉ thép, điều chỉnh pH, sản xuất hợp chất vô cơ.',
    'NH3': 'Phân bón (đạm), hệ thống làm lạnh công nghiệp.',
    'CACO3': 'Sản xuất xi măng, vôi, phấn viết, thực phẩm bổ sung.',
    'AL': 'Vật liệu hàng không, bao bì, dây điện, xây dựng.',
    'FE': 'Cốt thép xây dựng, máy móc, linh kiện, hemoglobin trong máu.',
    'CU': 'Dây dẫn điện, vi mạch, trang trí, đồng đúc tượng.',
    'ZN': 'Mạ chống gỉ cho thép, sản xuất pin, hợp kim đồng thau.'
  };
  const norm = normalize(formula);
  if (apps[norm]) return apps[norm];
  if (category?.includes('Axit')) return 'Sản xuất hóa chất, tẩy rửa bề mặt, điều chỉnh pH.';
  if (category?.includes('Bazơ')) return 'Xử lý nước, sản xuất chất tẩy rửa, xà phòng.';
  if (category?.includes('Muối')) return 'Công nghiệp thực phẩm, sản xuất phân bón, hóa chất.';
  if (category?.includes('Kim loại')) return 'Cơ khí chế tạo, điện tử, xây dựng.';
  return 'Nghiên cứu khoa học, giáo dục và mô phỏng thí nghiệm.';
};

const TIER_THEME = {
  0: { color: '#3b82f6', icon: '💎', label: 'Bậc 0: Nguyên bản' },
  1: { color: '#10b981', icon: '🌿', label: 'Bậc 1: Sơ cấp' },
  2: { color: '#f59e0b', icon: '⚡', label: 'Bậc 2: Trung cấp' },
  3: { color: '#ef4444', icon: '🔥', label: 'Bậc 3: Cao cấp' },
  4: { color: '#8b5cf6', icon: '🔮', label: 'Khác / Huyền bí' }
};

const buildPyramidRows = (items) => {
  const rows = [];
  let currentIndex = 0;
  // Bắt đầu với số lượng chất vừa phải ở đỉnh để chóp không quá nhọn (ví dụ: 2 chất)
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
                    {item.isDiscovered ? item.name : 'Chất bí ẩn'}
                </p>
                <p className="text-[8px] font-black text-white/30 mt-0.5 uppercase tracking-widest">
                    {item.category || 'Vật chất'}
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
                   CÂY TIẾN HÓA VẬT CHẤT
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
                           <span className="text-[10px] font-bold text-white/40 mt-1">{items.length} chất</span>
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
                     <span className="text-white/60 text-lg font-light">✕</span>
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
                  <h3 className="text-2xl font-black text-white mb-2">{selectedData.isDiscovered ? selectedData.name : 'Vật chất bí ẩn'}</h3>
                  <div className="px-5 py-1.5 bg-white/10 border border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-[3px]">
                     {selectedData.category || 'Vật chất'}
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-4 flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-viet-green/20 flex items-center justify-center text-viet-green">
                           <Activity size={16} />
                        </div>
                        <h4 className="text-[12px] font-black text-white/60 uppercase tracking-[3px]">Cây Tổng Hợp</h4>
                     </div>
                     <div className="bg-black/30 p-6 rounded-[24px] border border-white/5 flex flex-col gap-6">
                        {selectedData.is_starter || selectedData.isStarter ? (
                           <div className="text-center py-4">
                              <p className="text-white/40 text-[13px] font-semibold italic">Nguyên liệu gốc. Trọng tâm trong vũ trụ vật chất.</p>
                           </div>
                        ) : synthesisPathways.length > 0 ? (
                           synthesisPathways.map((pathway, pIdx) => (
                              <div key={pathway.id} className="flex flex-col gap-3">
                                 <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Cách tổng hợp #{pIdx + 1}</span>
                                    <span className="text-[10px] font-bold text-white/20 bg-white/5 px-2 py-0.5 rounded">{pathway.type || 'Phản ứng'}</span>
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
                                       <span className="text-[8px] text-white/30 font-bold mb-1">{pathway.conditions ? 'ĐK' : ''}</span>
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
                                    <p className="text-[10px] text-white/40 italic text-center mt-2">ĐK: {pathway.conditions}</p>
                                 )}
                              </div>
                           ))
                        ) : (
                           <div className="text-center py-4">
                              <p className="text-white/40 text-[13px] font-semibold italic">Chưa có công thức nào để tạo ra chất này trong dữ liệu.</p>
                           </div>
                        )}
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/50"><Microscope size={16} /></div>
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[4px]">Tính chất & Mô tả</h4>
                     </div>
                     <div className="bg-white/5 p-6 rounded-[24px] border border-white/5">
                        <p className="text-white/80 text-[14px] leading-relaxed font-medium italic">
                           {selectedData.isDiscovered ? (selectedData.description || 'Chưa có mô tả chi tiết cho vật chất này.') : 'Bạn chưa khám phá ra bí mật của vật chất này. Hãy thử kết hợp các nguyên tố trong phòng Lab!'}
                        </p>
                     </div>
                  </div>
                  <div className="flex flex-col gap-4">
                     <div className="bg-white/5 p-6 rounded-[24px] border border-white/5 flex flex-col gap-2">
                        <span className="text-[8px] font-black text-viet-green uppercase tracking-[3px]">Khối lượng nguyên tử / phân tử</span>
                        <div className="flex items-baseline gap-2">
                           <span className="text-3xl font-black text-white italic">{calculateMolarMass(selectedData.formula || selectedData.symbol, elements)}</span>
                           <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">u (amu)</span>
                        </div>
                     </div>
                     <div className="bg-white/5 p-6 rounded-[24px] border border-white/5 space-y-3">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-viet-green" />
                           <span className="text-[8px] font-black text-white/50 uppercase tracking-[3px]">Ứng dụng trong đời sống</span>
                        </div>
                        <p className="text-white/80 text-[13px] leading-relaxed font-semibold italic border-l-2 border-viet-green/30 pl-4">
                           {selectedData.isDiscovered ? getApplications(selectedData.formula || selectedData.symbol, selectedData.name, selectedData.category) : 'Khám phá chất này trong phòng Lab để tìm hiểu các ứng dụng thực tế phong phú!'}
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
