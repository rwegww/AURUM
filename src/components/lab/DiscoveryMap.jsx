import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { molecules } from '../../data/molecules';
import { elements } from '../../data/elements';
import { craftableItems } from '../../data/labInventory';
import { CheckCircle2, Lock, ChevronRight } from 'lucide-react';

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
        let count = 1;
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
  return 'Nghiên cứu khoa học, giáo dụng và mô phỏng thí nghiệm.';
};

const CATEGORY_THEME = {
  'Kim loại': { color: '#3b82f6', icon: '⛏️', label: 'Kim loại' },
  'Phi kim / Khí': { color: '#8b5cf6', icon: '☁️', label: 'Phi kim / Khí' },
  'Axit': { color: '#ef4444', icon: '🧪', label: 'Axit' },
  'Bazơ': { color: '#10b981', icon: '🧼', label: 'Bazơ' },
  'Muối': { color: '#f59e0b', icon: '🧂', label: 'Muối' },
  'Khác': { color: '#64748b', icon: '📦', label: 'Khác' }
};

const DiscoveryMap = ({ chemicals = [], reactions = [], discoveredFormulas = [] }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const normalizedDiscovered = useMemo(() => 
    new Set(discoveredFormulas.map(f => normalize(f)))
  , [discoveredFormulas]);

  const treeData = useMemo(() => {
    const groups = {
      'Kim loại': [],
      'Phi kim / Khí': [],
      'Axit': [],
      'Bazơ': [],
      'Muối': [],
      'Khác': []
    };

    chemicals.forEach(chem => {
      const type = (chem.category || chem.type || '').toLowerCase();
      const normF = normalize(chem.formula);
      const isDiscovered = normalizedDiscovered.has(normF) || chem.is_starter || chem.isStarter;
      
      const node = {
         ...chem,
         normalizedFormula: normF,
         isDiscovered
      };

      if (type.includes('kim loại')) groups['Kim loại'].push(node);
      else if (type.includes('phi kim') || type.includes('khí') || chem.state === 'gas') groups['Phi kim / Khí'].push(node);
      else if (type.includes('axit')) groups['Axit'].push(node);
      else if (type.includes('bazơ') || type.includes('bazo')) groups['Bazơ'].push(node);
      else if (type.includes('muối')) groups['Muối'].push(node);
      else groups['Khác'].push(node);
    });

    const result = {};
    Object.keys(groups).forEach(k => {
      if (groups[k].length > 0) {
         groups[k].sort((a, b) => {
            if (a.isDiscovered === b.isDiscovered) return a.normalizedFormula.localeCompare(b.normalizedFormula);
            return a.isDiscovered ? -1 : 1; // Discovered first
         });
         result[k] = groups[k];
      }
    });
    return result;
  }, [chemicals, normalizedDiscovered]);

  const categoryKeys = Object.keys(treeData);
  const totalItems = chemicals.length;
  const discoveredCount = chemicals.filter(c => normalizedDiscovered.has(normalize(c.formula)) || c.is_starter || c.isStarter).length;

  const selectedData = useMemo(() => {
    if (!selectedId) return null;
    
    // Search in chemicals first
    const node = chemicals.find(c => normalize(c.formula) === selectedId);
    let isDiscovered = normalizedDiscovered.has(selectedId);
    
    if (node) {
        isDiscovered = isDiscovered || node.is_starter || node.isStarter;
    }

    // Try to enrich with data
    const molecule = molecules.find(m => normalize(m.formula) === selectedId);
    if (molecule) return { ...node, ...molecule, isDiscovered, formula: selectedId };

    const element = elements.find(e => normalize(e.symbol) === selectedId);
    if (element) return { ...node, ...element, isDiscovered, name: element.name, description: element.desc, formula: selectedId };

    const craftable = craftableItems.find(c => normalize(c.formula) === selectedId);
    if (craftable) return { ...node, ...craftable, isDiscovered, formula: selectedId };

    return { ...node, isDiscovered, formula: selectedId };
  }, [selectedId, chemicals, normalizedDiscovered]);

  return (
    <div className="w-full h-full bg-[#0a0c10] overflow-hidden relative flex flex-col font-sans text-white">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Main Map Area */}
      <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar relative">
        <div className="flex flex-row items-center min-w-max min-h-full py-16 px-12 relative z-10">
          
          {/* 1. ROOT NODE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="shrink-0 relative z-10"
          >
            <div className="px-8 py-5 bg-viet-green text-white rounded-[2rem] font-black text-xl uppercase tracking-widest shadow-lg shadow-viet-green/20 border-b-[6px] border-emerald-700 select-none">
              🧪 VẬT CHẤT
            </div>
          </motion.div>

          {/* Root Connector */}
          <div className="w-12 h-[3px] bg-white/10 shrink-0" />

          {/* 2. CATEGORIES COLUMN */}
          <div className="flex flex-col gap-6 shrink-0 relative">
            {categoryKeys.map((category, cIdx) => {
              const isFirst = cIdx === 0;
              const isLast = cIdx === categoryKeys.length - 1;
              const isOnly = categoryKeys.length === 1;

              const theme = CATEGORY_THEME[category] || CATEGORY_THEME['Khác'];
              const isExpanded = expandedCategory === category;
              const items = treeData[category] || [];
              const doneCount = items.filter(i => i.isDiscovered).length;
              const totalCount = items.length;
              const isComplete = doneCount === totalCount && totalCount > 0;

              return (
                <div key={category} className="flex flex-row items-center relative">
                  {/* Vertical Branch Line */}
                  {!isOnly && (
                    <div
                      className="absolute left-0 w-[3px] bg-white/10 z-0"
                      style={{
                        top: isFirst ? '50%' : '0',
                        bottom: isLast ? '50%' : '0',
                      }}
                    />
                  )}

                  {/* Horizontal Connector to Category */}
                  <div className="w-12 h-[3px] bg-white/10 shrink-0 z-0" />

                  {/* Category Node */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: cIdx * 0.05 }}
                    className="shrink-0 relative z-10"
                  >
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : category)}
                      className={`flex items-center gap-4 px-5 py-4 rounded-[20px] border-2 transition-all duration-300 w-[260px] text-left group ${
                        isExpanded
                          ? 'bg-[#1a1c23] shadow-2xl scale-[1.02]'
                          : 'bg-[#1a1c23]/60 hover:bg-[#1a1c23] hover:shadow-lg hover:scale-[1.01]'
                      }`}
                      style={{
                        borderColor: isExpanded ? theme.color : 'rgba(255,255,255,0.1)',
                        boxShadow: isExpanded ? `0 12px 30px ${theme.color}30` : undefined
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-inner bg-black/40"
                        style={{ borderBottom: `2px solid ${theme.color}` }}
                      >
                        {theme.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-[15px] font-black text-white leading-tight mb-1 uppercase tracking-wider">
                          {theme.label}
                        </h2>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-white/40">
                            {doneCount}/{totalCount} chất
                          </span>
                          {isComplete && <CheckCircle2 size={12} className="text-viet-green" />}
                        </div>
                      </div>
                      <ChevronRight
                        size={18}
                        className={`text-white/20 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                        style={{ color: isExpanded ? theme.color : undefined }}
                      />
                    </button>
                  </motion.div>

                  {/* 3. CHEMICALS GRID */}
                  <AnimatePresence>
                    {isExpanded && items.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                        className="flex flex-row items-center shrink-0 overflow-hidden"
                      >
                        {/* Connector from Category to Items Grid */}
                        <div className="w-12 h-[3px] bg-white/10 shrink-0" />

                        <div className="bg-[#1a1c23]/40 backdrop-blur-md border border-white/10 p-6 rounded-[32px] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-max shrink-0 my-4">
                          {items.map((item, iIdx) => (
                            <motion.button
                                key={item.formula}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: iIdx * 0.02 }}
                                onClick={() => setSelectedId(item.normalizedFormula)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all w-[220px] text-left relative overflow-hidden group ${
                                    item.isDiscovered 
                                        ? 'bg-[#1a1c23] border-white/10 hover:border-white/30 shadow-lg' 
                                        : 'bg-[#1a1c23]/30 border-white/5 opacity-60 hover:opacity-100'
                                }`}
                                style={{
                                    borderColor: selectedId === item.normalizedFormula ? theme.color : undefined
                                }}
                            >
                                {/* Highlight bar for selected */}
                                {selectedId === item.normalizedFormula && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: theme.color }} />
                                )}

                                <div 
                                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/10 relative overflow-hidden"
                                    style={{ backgroundColor: item.isDiscovered ? theme.color + '20' : '#00000040' }}
                                >
                                    {item.isDiscovered && (
                                        <div className="absolute inset-0 opacity-20 blur-md" style={{ backgroundColor: theme.color }} />
                                    )}
                                    {item.isDiscovered ? (
                                        <span className="text-[13px] font-black italic text-white relative z-10">{item.formula}</span>
                                    ) : (
                                        <Lock size={16} className="text-white/20 relative z-10" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-[12px] font-bold leading-tight truncate ${item.isDiscovered ? 'text-white' : 'text-white/40'}`}>
                                        {item.isDiscovered ? item.name : 'Chất bí ẩn'}
                                    </p>
                                    <p className="text-[9px] font-black text-white/30 mt-1 uppercase tracking-widest">
                                        {item.is_starter || item.isStarter ? 'GỐC' : 'TỔNG HỢP'}
                                    </p>
                                </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="w-16 shrink-0" />
        </div>
      </div>

      {/* Substance Detail Card (Right Modal) */}
      <AnimatePresence>
        {selectedId && selectedData && (
          <>
            {/* Backdrop Mask */}
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setSelectedId(null)}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            
            {/* Side Card */}
            <motion.div 
               initial={{ x: 400, opacity: 0 }} 
               animate={{ x: 0, opacity: 1 }} 
               exit={{ x: 400, opacity: 0 }}
               className="absolute top-6 right-6 bottom-6 w-[450px] bg-[#1a1c23]/95 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-[101] overflow-hidden flex flex-col"
            >
               {/* Card Header & Glow */}
               <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-viet-green to-transparent opacity-50" />
               
               <div className="p-10 flex flex-col items-center text-center">
                  <button onClick={() => setSelectedId(null)} className="absolute top-6 left-6 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all border border-white/5">
                     <span className="text-white/60 text-lg font-light">✕</span>
                  </button>

                  <div className="mt-8 mb-6 relative">
                     <motion.div 
                        animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-10 bg-viet-green/10 blur-3xl rounded-full pointer-events-none" 
                     />
                     <h2 className="text-7xl font-black italic tracking-tighter text-white font-sora relative z-10 drop-shadow-2xl">
                        {selectedData.formula || selectedData.symbol}
                     </h2>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-3">{selectedData.isDiscovered ? selectedData.name : 'Vật chất bí ẩn'}</h3>
                  <div className="px-6 py-2 bg-white/10 border border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-[3px]">
                     {selectedData.category || 'Vật chất'}
                  </div>
               </div>

               <div className="flex-grow p-8 pt-0 flex flex-col gap-6 custom-scrollbar overflow-y-auto">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-viet-green">🔬</div>
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

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </div>
  );
};

export default DiscoveryMap;
