import React from 'react';
import { motion } from 'framer-motion';

const AtomicModel = ({ shells = [], symbol = '' }) => {
  // Dynamically calculate spacing and radius based on shell count to ensure it fits
  const shellCount = shells.length;
  const baseSpacing = shellCount > 5 ? 20 : 28;
  const startRadius = shellCount > 5 ? 35 : 45;

  return (
    <div className="relative w-full h-[350px] flex items-center justify-center">
      {/* Nucleus */}
      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-viet-green to-emerald-600 shadow-xl flex items-center justify-center text-white font-black text-sm z-50">
        <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
        {symbol}
      </div>

      {/* Shells */}
      {shells.map((electrons, index) => {
        const radius = startRadius + (index * baseSpacing);
        return (
          <div
            key={`${symbol}-shell-${index}`}
            className="absolute flex items-center justify-center"
            style={{
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
            }}
          >
            {/* The circular orbit path */}
            <div className="absolute inset-0 rounded-full border border-viet-green/10 pointer-events-none" />

            {/* Electrons on this orbit */}
            {[...Array(electrons)].map((_, eIndex) => {
              const startAngle = (eIndex / electrons) * 360;
              return (
                <motion.div
                  key={`${symbol}-e-${index}-${eIndex}`}
                  className="absolute w-2 h-2 rounded-full bg-viet-green shadow-[0_0_8px_rgba(118,192,52,0.4)] border border-white/50 z-20"
                  animate={{
                    rotate: [startAngle, startAngle + 360],
                  }}
                  transition={{
                    duration: 15 + index * 5, // Even slower for visual stability
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    top: -4,
                    left: '50%',
                    marginLeft: '-4px',
                    transformOrigin: `4px ${radius + 4}px`,
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
