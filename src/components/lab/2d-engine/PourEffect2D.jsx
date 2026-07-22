import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useLabStore from '../three/magic-lab/store';

const PourEffect2D = ({ formula, targetBeakerIndex }) => {
  const chemicals = useLabStore(state => state.chemicals);
  const chem = chemicals[formula];
  
  if (!formula || !chem) return null;

  const color = chem.color || '#3b82f6';
  const isSolid = chem.state === 'solid';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: '200px', opacity: 1 }}
        exit={{ height: 0, opacity: 0, top: '200px' }}
        transition={{ duration: 0.3 }}
        className="absolute z-20 pointer-events-none"
        style={{
          top: '-150px', // Starts above the beaker
          left: '50%',
          transform: 'translateX(-50%)',
          width: isSolid ? '20px' : '8px',
        }}
      >
        {isSolid ? (
          // Solid pouring (particles falling)
          <div className="w-full h-full relative overflow-hidden">
             {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -20, x: Math.random() * 10 - 5 }}
                  animate={{ y: 250, x: Math.random() * 15 - 7.5 }}
                  transition={{ 
                    duration: 0.5 + Math.random() * 0.2, 
                    repeat: Infinity, 
                    delay: Math.random() * 0.5,
                    ease: "linear"
                  }}
                  className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-sm"
                  style={{ backgroundColor: color }}
                />
             ))}
          </div>
        ) : (
          // Liquid pouring (continuous stream)
          <div 
            className="w-full h-full rounded-b-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            style={{ 
              background: `linear-gradient(to bottom, transparent, ${color} 20%, ${color})`,
              filter: `drop-shadow(0 0 5px ${color})`
            }} 
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PourEffect2D;
