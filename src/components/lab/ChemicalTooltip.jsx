import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chemicals } from '../../data/reactions';
import { elements } from '../../data/elements';
import { molecules } from '../../data/molecules';
import { getChemicalImage } from '../../data/chemicalImages';

const withAlpha = (color, alpha) => /^#[0-9a-f]{6}$/i.test(color || '')
  ? `${color}${alpha}`
  : color || 'rgba(255,255,255,0.2)';

const ChemicalTooltip = ({ chemicalInfo, x, y, visible }) => {
  const viewportWidth = typeof window === 'undefined' ? 1024 : window.innerWidth;
  const viewportHeight = typeof window === 'undefined' ? 768 : window.innerHeight;
  const details = useMemo(() => {
    if (!chemicalInfo) return null;
    const formula = chemicalInfo.formula || chemicalInfo; // Fallback in case a string is passed
    
    const chemFromRx = chemicals.find(c => c.formula === formula || c.id === formula);
    const element = elements.find(e => e.symbol === formula);
    const molecule = molecules.find(m => m.formula === formula || m.id === formula);
    const description = element ? element.desc : (molecule ? molecule.description : '');
    
    const combinedChemical = {
      formula: formula,
      name: chemicalInfo.name || (chemFromRx ? chemFromRx.name : (element ? element.name : (molecule ? molecule.name : 'Chưa rõ tên'))),
      category: chemicalInfo.category || (chemFromRx ? chemFromRx.category : (element ? 'Nguyên tố' : (molecule ? molecule.category : 'Hợp chất'))),
      molarMass: chemicalInfo.molarMass || (chemFromRx ? chemFromRx.molarMass : (element ? element.weight : null)),
      state: chemicalInfo.state || (chemFromRx ? chemFromRx.state : (element ? 'solid' : 'Chưa rõ')),
      color: chemicalInfo.color || (chemFromRx ? chemFromRx.color : '#ffffff')
    };

    return { chemical: combinedChemical, description, formula };
  }, [chemicalInfo]);

  return (
    <AnimatePresence>
      {visible && details && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{ 
             left: Math.max(8, Math.min(x + 20, viewportWidth - 368)),
             top: Math.max(8, Math.min(y - 20, viewportHeight - 260)),
             // Chống tràn màn hình cơ bản
             maxHeight: '90vh' 
          }}
          className="pointer-events-none fixed z-[9999] flex min-w-[min(280px,calc(100vw-1rem))] max-w-[min(360px,calc(100vw-1rem))] flex-col rounded-2xl border border-white/10 bg-[#0a0a0f]/95 p-4 shadow-2xl backdrop-blur-xl"
          role="tooltip"
        >
          {/* Header Đặc tính */}
          <div className="flex flex-col gap-3">
             <div className="flex gap-4 items-center">
                 <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-white/10 overflow-hidden relative shadow-inner"
                      style={{ background: `radial-gradient(circle, ${withAlpha(details.chemical.color, '20')} 0%, rgba(2, 6, 23, 0.8) 100%)` }}>
                     {getChemicalImage(details.formula) ? (
                         <img src={getChemicalImage(details.formula)} alt={details.formula} className="w-full h-full object-cover mix-blend-screen opacity-90" />
                     ) : (
                         <span className="text-2xl font-black text-white">{details.formula}</span>
                     )}
                 </div>
                 <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-white text-lg truncate leading-tight mb-2">{details.chemical.name}</h4>
                    <div className="text-[11px] font-bold text-white/50 flex flex-col gap-1.5 uppercase tracking-wider">
                       <div className="flex items-center gap-2">
                         <span className="text-emerald-400/80">{details.chemical.category}</span>
                       </div>
                       {details.chemical.molarMass && (
                         <div className="flex items-center gap-2">
                           <span>{details.chemical.molarMass} g/mol</span>
                         </div>
                       )}
                       {details.chemical.state && details.chemical.state !== 'Chưa rõ' && (
                         <div className="flex items-center gap-2">
                           <span className="text-blue-400/80">
                             {details.chemical.state === 'solid' ? 'Khối rắn (Solid)' : 
                              details.chemical.state === 'liquid' ? 'Lỏng (Liquid)' : 
                              details.chemical.state === 'gas' ? 'Khí (Gas)' : details.chemical.state}
                           </span>
                         </div>
                       )}
                    </div>
                 </div>
             </div>
             
             {details.description && (
               <div className="mt-2 bg-white/5 p-3 rounded-xl border border-white/5">
                 <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5">Thông tin quan trọng</h5>
                 <p className="text-xs text-white/80 leading-relaxed">{details.description}</p>
               </div>
             )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChemicalTooltip;
