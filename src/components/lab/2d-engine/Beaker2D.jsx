import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Particle = ({ delay, xOffset, color, speed = 1, size = 4 }) => (
  <motion.div
    initial={{ y: '100%', x: `${xOffset}px`, opacity: 0, scale: 0 }}
    animate={{ 
      y: '-20%', 
      x: `${xOffset + (Math.random() * 10 - 5)}px`,
      opacity: [0, 1, 0.8, 0], 
      scale: [0, 1, 1.2, 0] 
    }}
    transition={{
      duration: (1.5 + Math.random()) / speed,
      repeat: Infinity,
      delay: delay,
      ease: "easeOut"
    }}
    className="absolute bottom-4 rounded-full"
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      boxShadow: `0 0 ${size}px ${color}`
    }}
  />
);

const Beaker2D = ({ beakerData, isActive, onClick }) => {
  const { contents, isHeating, activeBubbles, activeSmoke, smokeColor, intensity, shake, activeFlame } = beakerData;

  const totalVolume = Math.min(contents.length * 20, 95); // max 95% full
  const topColor = contents.length > 0 ? contents[contents.length - 1].color : 'transparent';

  // Generate particles based on state
  const bubbles = useMemo(() => {
    if (!activeBubbles) return [];
    return Array.from({ length: intensity === 'extreme' ? 15 : 8 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 2,
      x: Math.random() * 60 - 30, // -30 to 30
      color: 'rgba(255, 255, 255, 0.6)',
      speed: intensity === 'extreme' ? 1.5 : 1,
      size: Math.random() * 4 + 2
    }));
  }, [activeBubbles, intensity]);

  const smoke = useMemo(() => {
    if (!activeSmoke) return [];
    return Array.from({ length: intensity === 'extreme' ? 12 : 6 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 2,
      x: Math.random() * 40 - 20,
      color: smokeColor || 'rgba(200, 200, 200, 0.6)',
      speed: intensity === 'extreme' ? 1 : 0.7,
      size: Math.random() * 10 + 5
    }));
  }, [activeSmoke, smokeColor, intensity]);

  const shakeAnimation = shake ? {
    x: [0, -5, 5, -5, 5, 0],
    y: [0, -2, 2, -2, 2, 0],
    transition: { duration: 0.4, repeat: Infinity }
  } : {};

  return (
    <motion.div 
      className="relative flex flex-col items-center justify-end cursor-pointer group shrink-0"
      onClick={onClick}
      animate={shakeAnimation}
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Smoke Effects (above beaker) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 pointer-events-none z-30">
        <AnimatePresence>
          {activeSmoke && smoke.map(p => (
            <motion.div
              key={p.id}
              initial={{ y: 0, x: p.x, opacity: 0, scale: 0.5 }}
              animate={{ 
                y: -100 - Math.random() * 50, 
                x: p.x + (Math.random() * 40 - 20),
                opacity: [0, 0.6, 0], 
                scale: [0.5, 2, 3] 
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2 / p.speed,
                repeat: Infinity,
                delay: p.delay,
                ease: "linear"
              }}
              className="absolute bottom-0 left-1/2 rounded-full blur-md"
              style={{
                width: p.size * 2,
                height: p.size * 2,
                backgroundColor: p.color,
                marginLeft: -p.size
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* The Beaker Graphic (SVG + HTML Overlay) */}
      <div className="relative w-28 h-40 mt-32 z-10">
        
        {/* Active Selection Glow */}
        {isActive && (
          <motion.div 
            className="absolute -inset-4 bg-blue-500/20 blur-xl rounded-full z-0 pointer-events-none"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Liquid Layer (clipped to beaker shape) */}
        <div 
          className="absolute inset-0 z-10 bottom-1" 
          style={{
            clipPath: 'polygon(15% 10%, 85% 10%, 85% 90%, 75% 100%, 25% 100%, 15% 90%)'
          }}
        >
          <div className="absolute bottom-0 w-full flex flex-col justify-end bg-transparent" style={{ height: '100%' }}>
            <motion.div 
              className="w-full relative transition-all duration-500 ease-out overflow-hidden"
              style={{ height: `${totalVolume}%`, backgroundColor: topColor }}
              initial={{ height: 0 }}
              animate={{ height: `${totalVolume}%` }}
            >
              {/* Internal Bubbles */}
              {activeBubbles && bubbles.map(p => (
                <Particle key={p.id} delay={p.delay} xOffset={p.x + 50} color={p.color} speed={p.speed} size={p.size} />
              ))}

              {/* Water Surface Line */}
              {totalVolume > 0 && (
                 <div className="absolute top-0 w-full h-1 bg-white/30" />
              )}
            </motion.div>
          </div>
        </div>

        {/* Beaker Glass Outline (Vector/CSS) */}
        <svg viewBox="0 0 100 140" className="absolute inset-0 w-full h-full z-20 drop-shadow-2xl overflow-visible pointer-events-none">
          {/* Back glass lip */}
          <ellipse cx="50" cy="15" rx="35" ry="5" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          
          {/* Main Body */}
          <path 
            d="M 15 15 L 15 125 A 15 15 0 0 0 30 140 L 70 140 A 15 15 0 0 0 85 125 L 85 15" 
            fill="rgba(255,255,255,0.05)" 
            stroke="rgba(255,255,255,0.6)" 
            strokeWidth="2" 
          />
          
          {/* Front glass lip */}
          <path d="M 15 15 A 35 5 0 0 0 85 15" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
          
          {/* Measurement marks */}
          <line x1="20" y1="40" x2="30" y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
          <line x1="20" y1="70" x2="35" y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
          <line x1="20" y1="100" x2="30" y2="100" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
          <text x="38" y="74" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="sans-serif">250ml</text>

          {/* Highlights */}
          <path d="M 22 25 L 22 120" stroke="rgba(255,255,255,0.3)" strokeWidth="4" strokeLinecap="round" />
          <path d="M 78 45 L 78 110" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" />
        </svg>

      </div>

      {/* Fire Effect (below beaker) */}
      <div className="absolute -bottom-6 w-24 h-16 z-0 pointer-events-none flex justify-center">
        <AnimatePresence>
          {activeFlame && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              className="relative w-full h-full flex justify-center items-end"
            >
              {/* Flame Base */}
              <motion.div 
                animate={{ scale: [1, 1.1, 1], rotate: [-2, 2, -2] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-16 h-12 bg-gradient-to-t from-orange-600 via-amber-500 to-transparent blur-md rounded-full origin-bottom mix-blend-screen"
              />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: [3, -3, 3] }}
                transition={{ duration: 0.3, repeat: Infinity }}
                className="absolute w-10 h-10 bg-gradient-to-t from-yellow-300 via-white to-transparent blur-sm rounded-full origin-bottom mix-blend-screen"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Beaker2D;
