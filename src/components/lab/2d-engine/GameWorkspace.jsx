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

                {/* Temperature Display (Right Side) */}
                <AnimatePresence>
                  {(beaker.isHeating || Math.round(beaker.heatTemperature) > 25) && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute top-1/2 -translate-y-1/2 -right-20 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl p-2 z-30 pointer-events-none shadow-xl flex flex-col items-center"
                    >
                      <span className="text-[9px] uppercase font-bold text-white/50 mb-1 tracking-widest">Nhiệt độ</span>
                      <span className={`text-sm font-black tabular-nums leading-none ${
                        beaker.heatTemperature >= 800 ? 'text-red-400 animate-pulse drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]'
                        : beaker.heatTemperature >= 400 ? 'text-orange-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.5)]'
                        : beaker.heatTemperature > 50 ? 'text-amber-400'
                        : 'text-blue-300'
                      }`}>
                        {Math.round(beaker.heatTemperature)}°C
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Battery & Wires for Electrolysis */}
                <AnimatePresence>
                  {beaker.isElectrolyzing && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute -left-[160px] bottom-0 w-36 h-32 pointer-events-none z-10 flex flex-col justify-end"
                    >
                       {/* SVG Wires Connecting Battery to Beaker Electrodes */}
                       <svg className="absolute -top-[110px] left-0 w-[280px] h-[220px] overflow-visible pointer-events-none z-30 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                         <defs>
                           {/* Cable Gradients */}
                           <linearGradient id="redWireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                             <stop offset="0%" stopColor="#ef4444" />
                             <stop offset="50%" stopColor="#f87171" />
                             <stop offset="100%" stopColor="#b91c1c" />
                           </linearGradient>
                           <linearGradient id="blueWireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                             <stop offset="0%" stopColor="#3b82f6" />
                             <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
                             <stop offset="100%" stopColor="#1d4ed8" />
                           </linearGradient>
                         </defs>

                         {/* Shadow paths for realism */}
                         <path d="M 32 175 C 65 220, 150 180, 202 32" fill="none" stroke="#000" strokeWidth="6" strokeOpacity="0.4" strokeLinecap="round" />
                         <path d="M 104 175 C 130 225, 180 185, 238 32" fill="none" stroke="#000" strokeWidth="6" strokeOpacity="0.4" strokeLinecap="round" />

                         {/* Red (+) Cable */}
                         <path d="M 32 175 C 65 220, 150 180, 202 32" fill="none" stroke="url(#redWireGrad)" strokeWidth="4.5" strokeLinecap="round" />
                         {/* Animated Glowing Pulse Inside Red Wire */}
                         <path d="M 32 175 C 65 220, 150 180, 202 32" fill="none" stroke="#fef08a" strokeWidth="2" strokeDasharray="8 16" strokeLinecap="round" opacity="0.8">
                           <animate attributeName="stroke-dashoffset" from="24" to="0" dur="0.8s" repeatCount="indefinite" />
                         </path>

                         {/* Black/Blue (-) Cable */}
                         <path d="M 104 175 C 130 225, 180 185, 238 32" fill="none" stroke="url(#blueWireGrad)" strokeWidth="4.5" strokeLinecap="round" />
                         {/* Animated Glowing Pulse Inside Blue Wire */}
                         <path d="M 104 175 C 130 225, 180 185, 238 32" fill="none" stroke="#93c5fd" strokeWidth="2" strokeDasharray="8 16" strokeLinecap="round" opacity="0.8">
                           <animate attributeName="stroke-dashoffset" from="0" to="24" dur="0.8s" repeatCount="indefinite" />
                         </path>

                         {/* Alligator Clips Clamping Electrodes */}
                         {/* Red Clip on Left Electrode */}
                         <g transform="translate(196, 22) rotate(-15)">
                           <rect x="0" y="0" width="12" height="16" rx="2" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
                           <rect x="2" y="14" width="8" height="6" fill="#94a3b8" />
                           <circle cx="6" cy="6" r="2" fill="#fef08a" />
                         </g>

                         {/* Blue Clip on Right Electrode */}
                         <g transform="translate(232, 22) rotate(15)">
                           <rect x="0" y="0" width="12" height="16" rx="2" fill="#2563eb" stroke="#1e40af" strokeWidth="1" />
                           <rect x="2" y="14" width="8" height="6" fill="#94a3b8" />
                           <circle cx="6" cy="6" r="2" fill="#93c5fd" />
                         </g>
                       </svg>

                       {/* Lab Power Supply / Heavy Duty Battery */}
                       <div className="relative w-36 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.8)] border-2 border-slate-700 p-2.5 flex flex-col justify-between z-20">
                          {/* Corner Bolts */}
                          <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-slate-500 shadow-inner" />
                          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-slate-500 shadow-inner" />
                          
                          {/* Binding Posts / Terminals on Top */}
                          <div className="flex justify-between px-3 -mt-6 mb-1">
                             {/* Positive (+) Terminal Knob */}
                             <div className="flex flex-col items-center">
                               <div className="w-5 h-5 bg-gradient-to-t from-red-700 via-red-500 to-red-400 rounded-full border-2 border-red-900 shadow-md flex items-center justify-center text-[10px] font-black text-white">+</div>
                               <div className="w-2.5 h-2 bg-amber-600 rounded-b-sm border-t border-amber-400" />
                             </div>

                             {/* Negative (-) Terminal Knob */}
                             <div className="flex flex-col items-center">
                               <div className="w-5 h-5 bg-gradient-to-t from-blue-700 via-blue-500 to-blue-400 rounded-full border-2 border-blue-900 shadow-md flex items-center justify-center text-[10px] font-black text-white">-</div>
                               <div className="w-2.5 h-2 bg-amber-600 rounded-b-sm border-t border-amber-400" />
                             </div>
                          </div>

                          {/* Digital LED Display Panel */}
                          <div className="bg-black/90 border border-slate-700 rounded-lg p-1.5 mb-2 flex items-center justify-between shadow-inner">
                             <div className="flex flex-col">
                               <span className="text-[7px] uppercase font-bold text-slate-400 tracking-wider">DC POWER</span>
                               <span className="text-[9px] font-bold text-slate-500">12.0 V / 3.5 A</span>
                             </div>
                             <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-cyan-900/50">
                                <motion.div 
                                  animate={{ opacity: [0.6, 1, 0.6] }}
                                  transition={{ repeat: Infinity, duration: 0.8 }}
                                  className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" 
                                />
                                <span className="text-[11px] font-mono font-black text-cyan-400 tracking-widest drop-shadow-[0_0_3px_#22d3ee]">12.0V</span>
                             </div>
                          </div>

                          {/* Controls & Brand */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                             <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
                                <span className="text-[8px] font-extrabold text-emerald-400 tracking-wider">ACTIVE</span>
                             </div>
                             <div className="text-[8px] font-black text-amber-500/80 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20">
                               ⚡ DÒNG ĐIỆN DC
                             </div>
                          </div>
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
