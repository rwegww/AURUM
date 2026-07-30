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

                {/* DC Power Supply & Wires for Electrolysis */}
                <AnimatePresence>
                  {beaker.isElectrolyzing && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute -left-[190px] bottom-0 w-44 h-44 pointer-events-none z-10 flex flex-col justify-end"
                    >
                       {/* SVG Wires (Matching Reference Image Arc Paths) */}
                       <svg className="absolute -top-[125px] -left-6 w-[340px] h-[260px] overflow-visible pointer-events-none z-30 drop-shadow-[0_8px_15px_rgba(0,0,0,0.6)]">
                         <defs>
                           {/* Cable Gradients for 3D Tubular Look */}
                           <linearGradient id="redWireTubular" x1="0%" y1="0%" x2="0%" y2="100%">
                             <stop offset="0%" stopColor="#f87171" />
                             <stop offset="40%" stopColor="#ef4444" />
                             <stop offset="100%" stopColor="#991b1b" />
                           </linearGradient>
                           <linearGradient id="blackWireTubular" x1="0%" y1="0%" x2="0%" y2="100%">
                             <stop offset="0%" stopColor="#475569" />
                             <stop offset="40%" stopColor="#0f172a" />
                             <stop offset="100%" stopColor="#020617" />
                           </linearGradient>
                         </defs>

                         {/* Shadows under wires */}
                         <path d="M 68 188 C -10 180, 30 15, 240 34" fill="none" stroke="#000" strokeWidth="8" strokeOpacity="0.35" strokeLinecap="round" />
                         <path d="M 148 188 C 165 90, 205 10, 276 34" fill="none" stroke="#000" strokeWidth="8" strokeOpacity="0.35" strokeLinecap="round" />

                         {/* Red (+) Cable: Plugs into Red Socket on Power Supply -> Loops Left and Up -> Plugs into Left Electrode Socket */}
                         <path d="M 68 188 C -10 180, 30 15, 240 34" fill="none" stroke="url(#redWireTubular)" strokeWidth="6" strokeLinecap="round" />
                         <path d="M 68 188 C -10 180, 30 15, 240 34" fill="none" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="6 18" strokeLinecap="round" opacity="0.9">
                           <animate attributeName="stroke-dashoffset" from="24" to="0" dur="0.7s" repeatCount="indefinite" />
                         </path>

                         {/* Black (-) Cable: Plugs into Black Socket on Power Supply -> Loops High Up -> Plugs into Right Electrode Socket */}
                         <path d="M 148 188 C 165 90, 205 10, 276 34" fill="none" stroke="url(#blackWireTubular)" strokeWidth="6" strokeLinecap="round" />
                         <path d="M 148 188 C 165 90, 205 10, 276 34" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 18" strokeLinecap="round" opacity="0.9">
                           <animate attributeName="stroke-dashoffset" from="0" to="24" dur="0.7s" repeatCount="indefinite" />
                         </path>

                         {/* Plugs into Power Supply Sockets */}
                         {/* Red Banana Plug on Power Supply */}
                         <g transform="translate(62, 178)">
                           <rect x="0" y="0" width="12" height="14" rx="3" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />
                           <circle cx="6" cy="7" r="2.5" fill="#fef08a" />
                         </g>
                         {/* Black Banana Plug on Power Supply */}
                         <g transform="translate(142, 178)">
                           <rect x="0" y="0" width="12" height="14" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
                           <circle cx="6" cy="7" r="2.5" fill="#38bdf8" />
                         </g>

                         {/* Plugs inserted Vertically into Electrode Sockets */}
                         {/* Red Banana Plug on Left Electrode (+)") */}
                         <g transform="translate(233, 14)">
                           <rect x="0" y="0" width="14" height="22" rx="3" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" />
                           <text x="7" y="15" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="900">+</text>
                         </g>
                         {/* Black Banana Plug on Right Electrode (-)") */}
                         <g transform="translate(269, 14)">
                           <rect x="0" y="0" width="14" height="22" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
                           <text x="7" y="14" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="900">-</text>
                         </g>
                       </svg>

                       {/* Metallic Grey Benchtop DC Power Supply Unit (Matching Reference Image) */}
                       <div className="relative w-44 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.7)] border-2 border-slate-400/80 p-3 flex flex-col items-center z-20">
                          
                          {/* Top Screws */}
                          <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-slate-500 shadow-inner border border-slate-600" />
                          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-500 shadow-inner border border-slate-600" />

                          {/* Terminals Sockets on Upper Face */}
                          <div className="w-full flex justify-between px-2 mb-2">
                             {/* Red Socket (+) */}
                             <div className="flex items-center gap-1">
                               <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-red-800 via-red-600 to-red-500 border-2 border-red-900 shadow-md flex items-center justify-center">
                                 <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
                               </div>
                               <span className="text-[12px] font-black text-slate-800">+</span>
                             </div>

                             {/* Black Socket (-) */}
                             <div className="flex items-center gap-1">
                               <span className="text-[12px] font-black text-slate-800">-</span>
                               <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-700 border-2 border-slate-950 shadow-md flex items-center justify-center">
                                 <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
                               </div>
                             </div>
                          </div>

                          {/* Machine Title Label */}
                          <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-800 mb-1.5">
                             DC POWER SUPPLY
                          </div>

                          {/* LED Display Box */}
                          <div className="w-full bg-slate-950 border-2 border-slate-700 rounded-xl p-2 mb-2 flex items-center justify-center shadow-inner relative overflow-hidden">
                             {/* Segment Glow */}
                             <div className="absolute inset-0 bg-cyan-500/10 blur-sm pointer-events-none" />
                             <span className="text-xl font-mono font-black text-cyan-400 tracking-widest drop-shadow-[0_0_8px_#22d3ee]">
                               12.0 V
                             </span>
                          </div>

                          {/* Status Indicator LEDs */}
                          <div className="w-full flex justify-around mb-2 text-[7px] font-black uppercase text-slate-700">
                             <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] animate-pulse" />
                                <span>POWER</span>
                             </div>
                             <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500/80 shadow-[0_0_4px_#10b981]" />
                                <span>O.C.P</span>
                             </div>
                          </div>

                          {/* Rotary Knobs & Output Button */}
                          <div className="w-full grid grid-cols-3 gap-1 items-center pt-1 border-t border-slate-400/50">
                             {/* VOLTAGE Knob */}
                             <div className="flex flex-col items-center">
                               <span className="text-[6px] font-black text-slate-700 uppercase mb-0.5">VOLTAGE</span>
                               <div className="w-6 h-6 rounded-full bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-600 shadow-md flex items-center justify-center relative">
                                  <div className="absolute top-0.5 w-0.5 h-2 bg-white rounded-full" />
                               </div>
                               <span className="text-[5px] text-slate-600 font-bold mt-0.5">0-30 V</span>
                             </div>

                             {/* OUTPUT Button */}
                             <div className="flex flex-col items-center">
                               <span className="text-[6px] font-black text-slate-700 uppercase mb-0.5">OUTPUT</span>
                               <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-500 to-emerald-400 border-2 border-emerald-900 shadow-[0_0_10px_rgba(16,185,129,0.8)] flex items-center justify-center text-[6px] font-black text-white cursor-pointer active:scale-95 transition-transform">
                                  ON
                               </div>
                             </div>

                             {/* CURRENT Knob */}
                             <div className="flex flex-col items-center">
                               <span className="text-[6px] font-black text-slate-700 uppercase mb-0.5">CURRENT</span>
                               <div className="w-6 h-6 rounded-full bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-600 shadow-md flex items-center justify-center relative">
                                  <div className="absolute top-0.5 w-0.5 h-2 bg-white rounded-full" />
                               </div>
                               <span className="text-[5px] text-slate-600 font-bold mt-0.5">0-5 A</span>
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
