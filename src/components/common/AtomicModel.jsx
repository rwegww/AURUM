import React from 'react';
import { motion } from 'framer-motion';

const AtomicModel = ({ shells = [], symbol = '' }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Nucleus */}
      <div className="absolute w-10 h-10 rounded-full bg-gradient-to-br from-viet-green to-emerald-600 shadow-lg flex items-center justify-center text-white font-black text-sm z-10">
        {symbol}
      </div>

      {/* Shells */}
      {shells.map((electrons, index) => {
        const radius = 40 + (index * 25);
        return (
          <div
            key={index}
            className="absolute rounded-full border border-viet-green/20"
            style={{
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
            }}
          >
            {/* Electrons */}
            {[...Array(electrons)].map((_, eIndex) => {
              const angle = (eIndex / electrons) * 360;
              return (
                <motion.div
                  key={eIndex}
                  className="absolute w-3 h-3 rounded-full bg-viet-green shadow-sm border border-white"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 10 / (index + 1),
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    left: '50%',
                    top: '50%',
                    marginLeft: '-6px',
                    marginTop: '-6px',
                    transformOrigin: `0 ${radius}px`,
                    transform: `rotate(${angle}js) translateY(-${radius}px)`
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default AtomicModel;
