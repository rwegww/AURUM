import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chemicals, reactions } from '../../data/reactions';

const ChemicalTooltip = ({ formula, x, y, visible }) => {
  const details = useMemo(() => {
    if (!formula) return null;
    const chemical = chemicals.find(c => c.formula === formula || c.id === formula);
    
    // Tìm các phản ứng mà chất này tham gia làm chất tham gia (reactant)
    const possibleReactions = reactions.filter(rx => 
      rx.reactants && rx.reactants.some(r => r.formula === (chemical ? chemical.formula : formula))
    );
    
    return { chemical, possibleReactions };
  }, [formula]);

  return (
    <AnimatePresence>
      {visible && details && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{ 
             left: x + 20, 
             top: y - 20,
             // Chống tràn màn hình cơ bản
             maxHeight: '90vh' 
          }}
          className="fixed z-[9999] pointer-events-none min-w-[300px] max-w-[340px] rounded-2xl border border-white/10 bg-[#0a0a0f]/95 p-4 shadow-2xl backdrop-blur-xl flex flex-col"
        >
          {/* Header Đặc tính */}
          {details.chemical ? (
            <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 shadow-inner"
                    style={{ backgroundColor: (details.chemical.color || '#fff') + '20' }}>
                   <span className="text-base font-black text-white">{details.chemical.formula}</span>
               </div>
               <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-white text-[15px] truncate leading-tight mb-1">{details.chemical.name}</h4>
                  <div className="text-[10px] font-bold text-white/50 flex flex-wrap gap-2 uppercase tracking-wider">
                     <span className="text-emerald-400/80">{details.chemical.category || 'Không xác định'}</span>
                     <span>•</span>
                     <span>{details.chemical.molarMass ? `${details.chemical.molarMass} g/mol` : '? g/mol'}</span>
                  </div>
               </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/5">
                   <span className="text-base font-black text-white">{formula}</span>
               </div>
               <div>
                  <h4 className="font-bold text-white text-[15px] leading-tight mb-1">Chưa rõ thông tin</h4>
                  <p className="text-[10px] text-white/50 uppercase">Chất chưa có trong CSDL</p>
               </div>
            </div>
          )}
          
          {details.chemical && (
            <div className="mb-4">
               <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5">Trạng thái tự nhiên</h5>
               <p className="text-xs font-semibold text-white/90 bg-white/5 px-2.5 py-1.5 rounded-lg inline-block border border-white/5">
                 {details.chemical.state === 'solid' ? 'Khối rắn (Solid)' : 
                  details.chemical.state === 'liquid' ? 'Lỏng (Liquid)' : 
                  details.chemical.state === 'gas' ? 'Khí (Gas)' : 'Chưa rõ'}
               </p>
            </div>
          )}

          {/* Phản ứng có thể tham gia */}
          <div className="flex-1 min-h-0 flex flex-col">
             <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 flex items-center justify-between">
                Phản ứng có thể tham gia
                <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-md text-[9px] font-bold border border-blue-500/20">
                   {details.possibleReactions.length} phản ứng
                </span>
             </h5>
             {details.possibleReactions.length > 0 ? (
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                   {details.possibleReactions.map((rx, idx) => (
                      <div key={idx} className="bg-white/5 rounded-lg p-2.5 border border-white/5 relative overflow-hidden group">
                         {/* Nếu phản ứng cần nhiệt độ, hiển thị icon lửa mờ */}
                         {rx.requiresHeat && (
                           <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-10 text-orange-500 text-lg">🔥</div>
                         )}
                         <p className="text-[11px] font-bold text-white/90 mb-1 z-10 relative">{rx.name}</p>
                         <div className="text-[10px] font-semibold text-emerald-400 z-10 relative">
                            {rx.equation || (
                              rx.reactants.map(r => r.formula).join(' + ') + ' → ' + rx.products.map(p => p.formula).join(' + ')
                            )}
                         </div>
                      </div>
                   ))}
                </div>
             ) : (
                <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5 mt-1">
                  <p className="text-[10px] font-medium text-white/40 italic">Chất này chưa có phản ứng nào được ghi nhận trong cơ sở dữ liệu hiện tại.</p>
                </div>
             )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChemicalTooltip;
