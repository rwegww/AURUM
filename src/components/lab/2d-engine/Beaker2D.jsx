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

const containerConfigs = {
  beaker: {
    clipPath: 'polygon(15% 10%, 85% 10%, 85% 90%, 75% 100%, 25% 100%, 15% 90%)',
    width: 'w-28',
    height: 'h-40',
    viewBox: '0 0 100 140',
    renderSVG: () => (
      <>
        <ellipse cx="50" cy="15" rx="35" ry="5" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <path d="M 15 15 L 15 125 A 15 15 0 0 0 30 140 L 70 140 A 15 15 0 0 0 85 125 L 85 15" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
        <path d="M 15 15 A 35 5 0 0 0 85 15" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
        <line x1="20" y1="40" x2="30" y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        <line x1="20" y1="70" x2="35" y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        <line x1="20" y1="100" x2="30" y2="100" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        <text x="38" y="74" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="sans-serif">250ml</text>
        <path d="M 22 25 L 22 120" stroke="rgba(255,255,255,0.3)" strokeWidth="4" strokeLinecap="round" />
        <path d="M 78 45 L 78 110" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" />
      </>
    )
  },
  test_tube: {
    clipPath: 'polygon(30% 5%, 70% 5%, 70% 90%, 65% 97%, 50% 100%, 35% 97%, 30% 90%)',
    width: 'w-16',
    height: 'h-48',
    viewBox: '0 0 100 140',
    renderSVG: () => (
      <>
        <ellipse cx="50" cy="5" rx="20" ry="3" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <path d="M 30 5 L 30 120 A 20 20 0 0 0 70 120 L 70 5" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
        <path d="M 30 5 A 20 3 0 0 0 70 5" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
        <path d="M 35 15 L 35 110" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />
      </>
    )
  },
  flask: {
    clipPath: 'polygon(40% 10%, 60% 10%, 60% 40%, 85% 90%, 75% 100%, 25% 100%, 15% 90%, 40% 40%)',
    width: 'w-32',
    height: 'h-40',
    viewBox: '0 0 100 140',
    renderSVG: () => (
      <>
        <ellipse cx="50" cy="15" rx="10" ry="3" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <path d="M 40 15 L 40 50 L 15 125 A 15 15 0 0 0 30 140 L 70 140 A 15 15 0 0 0 85 125 L 60 50 L 60 15" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 40 15 A 10 3 0 0 0 60 15" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
        <line x1="25" y1="100" x2="35" y2="100" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        <line x1="20" y1="115" x2="30" y2="115" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        <text x="40" y="104" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="sans-serif">250ml</text>
        <path d="M 22 110 L 35 75" stroke="rgba(255,255,255,0.3)" strokeWidth="4" strokeLinecap="round" />
      </>
    )
  },
  dish: {
    clipPath: 'polygon(5% 20%, 95% 20%, 95% 70%, 80% 100%, 20% 100%, 5% 70%)',
    width: 'w-40',
    height: 'h-16',
    viewBox: '0 0 100 50',
    renderSVG: () => (
      <>
        <ellipse cx="50" cy="10" rx="45" ry="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <path d="M 5 10 L 5 25 A 25 25 0 0 0 30 50 L 70 50 A 25 25 0 0 0 95 25 L 95 10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
        <path d="M 5 10 A 45 8 0 0 0 95 10" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
        <path d="M 12 18 L 12 25" stroke="rgba(255,255,255,0.3)" strokeWidth="4" strokeLinecap="round" />
      </>
    )
  },
  bubbler: {
    clipPath: 'polygon(20% 10%, 80% 10%, 80% 90%, 70% 100%, 30% 100%, 20% 90%)',
    width: 'w-24',
    height: 'h-48',
    viewBox: '0 0 100 140',
    renderSVG: () => (
      <>
        {/* Main Bottle */}
        <ellipse cx="50" cy="15" rx="30" ry="5" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <path d="M 20 15 L 20 125 A 15 15 0 0 0 35 140 L 65 140 A 15 15 0 0 0 80 125 L 80 15" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
        <path d="M 20 15 A 30 5 0 0 0 80 15" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
        
        {/* Central glass tube */}
        <rect x="45" y="-10" width="10" height="130" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" rx="2" />
        {/* Side exit tube */}
        <path d="M 80 30 L 95 30 L 95 20" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="4" />
        <path d="M 25 25 L 25 120" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />
      </>
    )
  }
};

const Beaker2D = ({ beakerData, isActive, onClick }) => {
  const { contents, isHeating, activeBubbles, activeSmoke, smokeColor, intensity, shake, activeFlame, containerType } = beakerData;
  const config = containerConfigs[containerType || 'beaker'] || containerConfigs['beaker'];

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
    transition: { duration: 0.4, repeat: Infinity }
  } : {};

  return (
    <motion.div 
      className="relative flex flex-col items-center justify-end"
      animate={shakeAnimation}
      onClick={onClick}
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
      <div className={`relative ${config.width} ${config.height} mt-32 z-10 flex flex-col items-center justify-end`}>
        
        {/* Active Selection Glow */}
        {isActive && (
          <div className="absolute -inset-4 bg-blue-500/20 blur-xl rounded-full pointer-events-none" />
        )}

        {/* Liquid Layer (clipped to beaker shape) */}
        <div 
          className="absolute inset-0 z-10 bottom-1" 
          style={{
            clipPath: config.clipPath
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
        <svg viewBox={config.viewBox} preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-20 drop-shadow-2xl overflow-visible pointer-events-none">
          {config.renderSVG()}
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
