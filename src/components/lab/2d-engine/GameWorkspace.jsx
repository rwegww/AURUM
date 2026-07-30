import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useLabStore from '../three/magic-lab/store';
import Beaker2D from './Beaker2D';
import PourEffect2D from './PourEffect2D';

const GameWorkspace = () => {
  const beakers = useLabStore(state => state.beakers);
  const activeBeakerIndex = useLabStore(state => state.activeBeakerIndex);
  const setActiveBeaker = useLabStore(state => state.setActiveBeaker);
  const isPouringFormula = useLabStore(state => state.isPouringFormula);
  const gameTick = useLabStore(state => state.gameTick);
  const pourToBeaker = useLabStore(state => state.pourToBeaker);

  // Global Game Loop (1 tick = 1 second)
  React.useEffect(() => {
    const interval = setInterval(() => {
       gameTick();
    }, 1000);
    return () => clearInterval(interval);
  }, [gameTick]);

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-end overflow-hidden perspective-[1000px]">
      
      {/* 2D Background Image */}
      <div className="absolute inset-0 pointer-events-none -z-20 overflow-hidden">
        <img 
          src="/images/lab/bg-lab.png" 
          alt="Lab Background" 
          className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
        />
        {/* Subtle Ambient Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40 pointer-events-none" />
      </div>

      {/* The 2D Lab Table Surface Image */}
      <div className="absolute bottom-0 w-full h-[30vh] z-0 pointer-events-none flex items-end justify-center overflow-hidden">
        <img 
          src="/images/lab/table-lab.png" 
          alt="Lab Table" 
          className="w-full h-full object-fill drop-shadow-[0_-10px_30px_rgba(0,0,0,0.7)]"
        />
      </div>

      {/* Beakers Layout */}
      <div className="relative z-10 w-full max-w-4xl h-full flex items-end justify-center gap-16 pb-[10vh]">
        {beakers.map((beaker, i) => {
          const isActive = i === activeBeakerIndex;

          return (
            <div key={beaker.id} className="relative flex flex-col items-center" data-beaker-target={i}>
              
              {/* Drop Shadow on the table */}
              <div 
                 className="absolute -bottom-4 w-32 h-6 bg-black/40 blur-md rounded-full pointer-events-none transition-all duration-300"
                 style={{ opacity: beaker.isHeating ? 0.2 : 1, transform: beaker.isHeating ? 'scale(0.8)' : 'scale(1)' }}
              />

              {/* Tripod Stand and Bunsen Burner */}
              <AnimatePresence>
                {beaker.isHeating && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -bottom-4 w-32 h-20 pointer-events-none flex flex-col items-center justify-end z-0"
                  >
                    {/* Burner Flame */}
                    <div className="absolute bottom-1 w-12 h-14 flex items-end justify-center z-10">
                       <div className="absolute bottom-0 w-6 h-3 bg-slate-700 rounded-sm shadow-md border-t border-slate-500" />
                       <div className="absolute bottom-3 w-2 h-3 bg-slate-600 rounded-sm" />
                       
                       <motion.div 
                         animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.9, 0.7] }}
                         transition={{ repeat: Infinity, duration: 0.15 }}
                         className="absolute bottom-5 w-8 h-10 bg-gradient-to-t from-blue-500 via-cyan-400 to-transparent blur-[2px] rounded-t-full origin-bottom mix-blend-screen"
                       />
                       <motion.div 
                         animate={{ scale: [1, 1.2, 1] }}
                         transition={{ repeat: Infinity, duration: 0.1 }}
                         className="absolute bottom-5 w-4 h-7 bg-gradient-to-t from-white to-blue-200 blur-[1px] rounded-t-full origin-bottom mix-blend-screen"
                       />
                    </div>


                    
                    {/* Tripod Structure */}
                    <svg className="absolute w-full h-full text-slate-500 drop-shadow-xl z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M 20 95 L 35 25 L 65 25 L 80 95" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 50 25 L 50 95" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-60" />
                      <path d="M 25 25 L 75 25" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                      <path d="M 32 25 A 18 6 0 0 0 68 25" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Beaker Container (moves up when heating) */}
              <motion.div
                drag
                dragSnapToOrigin={true}
                onDragStart={() => setActiveBeaker(i)}
                onDragEnd={(e, info) => {
                  const draggedEl = document.querySelector(`[data-drag-id="${i}"]`);
                  if (draggedEl) {
                    const originalPointerEvents = draggedEl.style.pointerEvents;
                    draggedEl.style.pointerEvents = 'none';
                    const dropTarget = document.elementFromPoint(info.point.x, info.point.y);
                    draggedEl.style.pointerEvents = originalPointerEvents;

                    const targetBeaker = dropTarget?.closest('[data-beaker-target]');
                    if (targetBeaker) {
                      const targetIdx = parseInt(targetBeaker.getAttribute('data-beaker-target'), 10);
                      if (targetIdx !== i && !isNaN(targetIdx)) {
                         pourToBeaker(i, targetIdx);
                      }
                    }
                  }
                }}
                whileDrag={{ scale: 1.1, rotate: 15, zIndex: 100 }}
                animate={{ y: beaker.isHeating ? -70 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative flex flex-col items-center cursor-grab active:cursor-grabbing touch-none"
                style={{ zIndex: isActive ? 50 : 10 }}
                data-drag-id={i}
              >
                {/* The Pouring Stream (if active) */}
                {isActive && isPouringFormula && (
                  <PourEffect2D formula={isPouringFormula} targetBeakerIndex={i} />
                )}

                {/* The 2D Beaker Sprite */}
                <Beaker2D 
                  beakerData={beaker} 
                  isActive={isActive} 
                  onClick={() => setActiveBeaker(i)} 
                />

                {/* Left Side Display: Chemical Inputs & Reaction Products */}
                <AnimatePresence>
                  {(() => {
                    const added = beaker.addedHistory || [];
                    const yields = beaker.yieldHistory || [];
                    const contents = beaker.contents || [];

                    if (added.length === 0 && contents.length === 0 && yields.length === 0) return null;

                    // Aggregate added inputs strictly from addedHistory
                    const inputMap = new Map();
                    added.forEach(item => {
                      const key = `${item.formula}_${item.unit}`;
                      if (!inputMap.has(key)) {
                        inputMap.set(key, { formula: item.formula, name: item.name, amount: 0, unit: item.unit });
                      }
                      inputMap.get(key).amount += (item.amount || 0);
                    });

                    // Aggregate yields / products
                    const yieldMap = new Map();
                    yields.forEach(item => {
                      const key = `${item.formula}_${item.unit}`;
                      if (!yieldMap.has(key)) {
                        yieldMap.set(key, { formula: item.formula, name: item.name, amount: 0, unit: item.unit, state: item.state });
                      }
                      yieldMap.get(key).amount += (item.amount || 0);
                    });

                    const inputList = Array.from(inputMap.values());
                    const yieldList = Array.from(yieldMap.values());

                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute top-1/2 -translate-y-1/2 -left-48 sm:-left-56 bg-slate-950/90 backdrop-blur-xl border border-white/15 rounded-2xl p-3 z-30 pointer-events-auto shadow-2xl flex flex-col gap-2 min-w-[170px] max-w-[210px] text-white"
                      >
                        {/* Input Chemicals */}
                        {inputList.length > 0 && (
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                              <span className="text-[9px] font-black uppercase tracking-wider text-blue-400">Đã cho vào</span>
                            </div>
                            <div className="space-y-0.5 pl-2.5 border-l border-blue-500/30 text-xs font-medium">
                              {inputList.map((inp, idx) => (
                                <div key={idx} className="flex justify-between items-center gap-2">
                                  <span className="font-bold text-white/90">{inp.formula}</span>
                                  <span className="text-[11px] font-mono text-blue-300">{inp.amount}{inp.unit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Reaction Yields / Products */}
                        {yieldList.length > 0 && (
                          <div className="pt-1.5 border-t border-white/10">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400">Sản phẩm thu được</span>
                            </div>
                            <div className="space-y-0.5 pl-2.5 border-l border-emerald-500/30 text-xs font-medium">
                              {yieldList.map((yd, idx) => (
                                <div key={idx} className="flex justify-between items-center gap-2">
                                  <span className="font-bold text-emerald-300">
                                    {yd.formula} {yd.state === 'gas' ? '↑' : ''}
                                  </span>
                                  <span className="text-[11px] font-mono text-emerald-400">{yd.amount}{yd.unit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Reaction Message badge if not default */}
                        {beaker.reactionMessage && !beaker.reactionMessage.includes("Mời bắt đầu") && (
                          <div className="mt-1 pt-1.5 border-t border-white/10 text-[10px] font-bold text-amber-300 leading-tight italic">
                            ✨ {beaker.reactionMessage}
                          </div>
                        )}
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>

                {/* Temperature Display (Right Side) */}
                <AnimatePresence>
                  {(() => {
                    const temp = (typeof beaker?.heatTemperature === 'number' && !Number.isNaN(beaker.heatTemperature)) ? beaker.heatTemperature : 25;
                    if (!beaker?.isHeating && Math.round(temp) <= 25) return null;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="absolute top-1/2 -translate-y-1/2 -right-20 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl p-2 z-30 pointer-events-none shadow-xl flex flex-col items-center"
                      >
                        <span className="text-[9px] uppercase font-bold text-white/50 mb-1 tracking-widest">Nhiệt độ</span>
                        <span className={`text-sm font-black tabular-nums leading-none ${
                          temp >= 800 ? 'text-red-400 animate-pulse drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]'
                          : temp >= 400 ? 'text-orange-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.5)]'
                          : temp > 50 ? 'text-amber-400'
                          : 'text-blue-300'
                        }`}>
                          {Math.round(temp)}°C
                        </span>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameWorkspace;
