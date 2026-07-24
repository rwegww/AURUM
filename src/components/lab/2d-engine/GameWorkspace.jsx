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
  const evaporateStep = useLabStore(state => state.evaporateStep);

  // Evaporation Effect Timer
  React.useEffect(() => {
    const interval = setInterval(() => {
      beakers.forEach((beaker, beakerIdx) => {
        if (beaker.isHeating) {
            evaporateStep(beakerIdx);
        }
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [beakers, evaporateStep]);

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
            <div key={beaker.id} className="relative flex flex-col items-center">
              
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
                animate={{ y: beaker.isHeating ? -70 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative z-10 flex flex-col items-center"
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
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameWorkspace;
