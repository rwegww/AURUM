import React from 'react';
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
      
      {/* 2D Background / Environment */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#020617] pointer-events-none -z-20">
         {/* Wall Grid Pattern */}
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* The 2D Table Surface */}
      <div className="absolute bottom-0 w-[150%] h-[25vh] bg-[#0f172a] border-t-4 border-[#334155] shadow-[inset_0_20px_50px_rgba(0,0,0,0.5)] -z-10" style={{ transform: 'rotateX(60deg)', transformOrigin: 'bottom' }} />

      {/* Beakers Layout */}
      <div className="relative w-full max-w-4xl h-full flex items-end justify-center gap-16 pb-[15vh]">
        {beakers.map((beaker, i) => {
          const isActive = i === activeBeakerIndex;

          return (
            <div key={beaker.id} className="relative flex flex-col items-center">
              
              {/* Drop Shadow on the table */}
              <div className="absolute -bottom-4 w-32 h-6 bg-black/40 blur-md rounded-full pointer-events-none" />

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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameWorkspace;
