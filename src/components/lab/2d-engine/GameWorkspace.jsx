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

                    {/* Temperature Display on Burner */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-lg px-2 py-0.5 z-30">
                      <span className={`text-[10px] font-black tabular-nums ${
                        beaker.heatTemperature >= 800 ? 'text-red-400'
                        : beaker.heatTemperature >= 400 ? 'text-orange-400'
                        : 'text-amber-400'
                      }`}>
                        {beaker.heatTemperature || 25}°C
                      </span>
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

                {/* Battery for Electrolysis */}
                <AnimatePresence>
                  {beaker.isElectrolyzing && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="absolute -left-[140%] bottom-0 w-24 h-20 pointer-events-none z-0 flex items-end justify-center"
                    >
                       {/* Wires connecting to beaker */}
                       <svg className="absolute w-[150%] h-[120%] -right-[110%] bottom-4 overflow-visible mix-blend-screen drop-shadow-md">
                         <path d="M 10 20 Q 50 -10 90 20" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2">
                           <animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.5s" repeatCount="indefinite" />
                         </path>
                         <path d="M 10 30 Q 50 0 90 30" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2">
                           <animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.5s" repeatCount="indefinite" />
                         </path>
                       </svg>

                       {/* Battery Body */}
                       <div className="relative w-16 h-16 bg-slate-800 rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.5)] border-2 border-slate-600 flex flex-col items-center justify-between p-1">
                          {/* Terminals */}
                          <div className="absolute -top-3 left-2 w-3 h-3 bg-red-500 rounded-t-sm border border-red-700 flex items-center justify-center text-[8px] font-black text-white">+</div>
                          <div className="absolute -top-3 right-2 w-3 h-3 bg-blue-500 rounded-t-sm border border-blue-700 flex items-center justify-center text-[8px] font-black text-white">-</div>
                          
                          {/* Label */}
                          <div className="w-full mt-2 bg-yellow-500 text-center rounded-sm text-[8px] font-black text-black">12V DC</div>
                          
                          {/* Electricity Effect inside battery */}
                          <motion.div 
                             animate={{ opacity: [0.3, 1, 0.3] }}
                             transition={{ repeat: Infinity, duration: 1 }}
                             className="w-8 h-4 mt-1 bg-cyan-400 blur-[6px]"
                          />
                       </div>
                    </motion.div>
                  )}
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
