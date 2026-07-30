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

const CHIP_SHAPES = [
  // Shape 0: Sharp Pentagon Crystal
  [
    { points: "12,24 28,6 48,12 42,36 20,40", fill: 'top', stroke: 'bright' },
    { points: "20,40 42,36 36,54 12,48", fill: 'front', stroke: 'dim' },
    { points: "42,36 48,12 58,24 36,54", fill: 'side', stroke: 'dim' }
  ],
  // Shape 1: Angular Trapezoidal Chunk
  [
    { points: "8,18 36,8 54,22 34,42 14,38", fill: 'top', stroke: 'bright' },
    { points: "14,38 34,42 26,56 6,46", fill: 'front', stroke: 'dim' },
    { points: "34,42 54,22 58,38 26,56", fill: 'side', stroke: 'dim' }
  ],
  // Shape 2: Sharp Triangular Spike
  [
    { points: "25,5 52,28 15,38", fill: 'top', stroke: 'bright' },
    { points: "15,38 52,28 38,55 10,48", fill: 'front', stroke: 'dim' },
    { points: "52,28 25,5 60,20 38,55", fill: 'side', stroke: 'dim' }
  ],
  // Shape 3: Rhomboid Mineral Block
  [
    { points: "18,12 45,8 55,30 28,35", fill: 'top', stroke: 'bright' },
    { points: "28,35 55,30 42,52 15,48", fill: 'front', stroke: 'dim' },
    { points: "55,30 45,8 62,20 42,52", fill: 'side', stroke: 'dim' }
  ],
  // Shape 4: Irregular Hexagonal Pebble
  [
    { points: "15,20 28,10 46,14 50,30 32,40 18,36", fill: 'top', stroke: 'bright' },
    { points: "18,36 32,40 24,54 10,46", fill: 'front', stroke: 'dim' },
    { points: "32,40 50,30 56,42 24,54", fill: 'side', stroke: 'dim' }
  ]
];

const pseudoRandom = (seed) => {
  let h = 0;
  const str = String(seed);
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return () => {
    h = Math.imul(48271, h) % 2147483647;
    return (h & 2147483647) / 2147483647;
  };
};

const SolidChunk = ({ solid, color = '#7e8794', index = 0 }) => {
  const seedKey = solid?.id || solid?.formula || `solid-${index}`;
  
  const { chips, leftPos } = useMemo(() => {
    const rng = pseudoRandom(seedKey);
    
    // Render 1-2 clean, sharp mineral chips per dropped solid
    const chipCount = Math.floor(rng() * 2) + 1;
    const generatedChips = [];

    for (let i = 0; i < chipCount; i++) {
      const shapeIdx = Math.floor(rng() * CHIP_SHAPES.length);
      const rot = (rng() * 50) - 25; // -25 to +25 deg
      const scale = 0.85 + rng() * 0.35; // 0.85 to 1.2
      const x = (i * 18) - (chipCount > 1 ? 9 : 0) + (rng() * 4 - 2);
      const y = (rng() * 4) - 2;

      generatedChips.push({
        id: i,
        x,
        y,
        scale,
        rot,
        facets: CHIP_SHAPES[shapeIdx]
      });
    }

    // Spread solids across the bottom width evenly based on index (12% to 62%)
    // Position depends strictly on index & seedKey (NEVER totalSolids)
    // so dropping a new solid (n+1) will NEVER cause previous solids (n) to move!
    const baseLeft = 14 + ((index * 16) % 48);
    const boundedLeft = Math.min(Math.max(baseLeft + (rng() * 6 - 3), 12), 62);

    return { chips: generatedChips, leftPos: boundedLeft };
  }, [seedKey, index]);

  return (
    <motion.div
      initial={{ y: -140, opacity: 0, scale: 0.5, rotate: (index % 2 === 0 ? -12 : 12) }}
      animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', bounce: 0.2, damping: 14, stiffness: 70 }}
      className="absolute bottom-2 pointer-events-none"
      style={{
        left: `${leftPos}%`,
        width: '45px',
        height: '38px',
        zIndex: 15 + index,
        filter: 'drop-shadow(0px 3px 4px rgba(0,0,0,0.45))'
      }}
    >
      <svg viewBox="0 0 100 75" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={`gravel-top-${seedKey}-${index}`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor={(!color || color === '#ffffff' || color === '#c0c0c0') ? '#8892a0' : color} />
            <stop offset="100%" stopColor="#4a525d" />
          </linearGradient>
          <linearGradient id={`gravel-front-${seedKey}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={(!color || color === '#ffffff' || color === '#c0c0c0') ? '#7e8794' : color} />
            <stop offset="100%" stopColor="#2c323b" />
          </linearGradient>
          <linearGradient id={`gravel-side-${seedKey}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#454c57" />
            <stop offset="100%" stopColor="#181b20" />
          </linearGradient>
        </defs>

        {chips.map((chip) => (
          <g
            key={chip.id}
            transform={`translate(${25 + chip.x}, ${18 + chip.y}) rotate(${chip.rot}) scale(${chip.scale})`}
          >
            {/* Soft Ambient Ground Shadow */}
            <ellipse cx="28" cy="48" rx="18" ry="5" fill="rgba(0, 0, 0, 0.4)" />

            {/* Polygon Facets for Granule */}
            {chip.facets.map((facet, fIdx) => (
              <polygon
                key={fIdx}
                points={facet.points}
                fill={
                  facet.fill === 'top'
                    ? `url(#gravel-top-${seedKey}-${index})`
                    : facet.fill === 'front'
                    ? `url(#gravel-front-${seedKey}-${index})`
                    : `url(#gravel-side-${seedKey}-${index})`
                }
                stroke={facet.stroke === 'bright' ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.5)'}
                strokeWidth={facet.stroke === 'bright' ? "1.2" : "0.8"}
                strokeLinejoin="round"
              />
            ))}

            {/* Conchoidal Texture Line */}
            <path
              d="M 20 22 Q 28 17 35 24"
              fill="none"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="0.8"
            />
          </g>
        ))}
      </svg>
    </motion.div>
  );
};

const Precipitate = ({ color, index }) => {
  return (
    <div className="absolute bottom-0 left-0 w-full pointer-events-none flex flex-col justify-end" style={{ height: `${25 + index * 5}%`, zIndex: 5 + index }}>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: '100%', opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="w-full relative"
        style={{
          backgroundColor: color,
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.2) 100%)`,
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          boxShadow: '0 -2px 5px rgba(0,0,0,0.1)'
        }}
      >
        {/* Noise overlay to simulate granular/powdery texture of chemical precipitates */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none rounded-t-xl"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
          }}
        />
      </motion.div>
    </div>
  );
};

const containerConfigs = {
  beaker: {
    clipPath: 'polygon(15% 10%, 85% 10%, 85% 89%, 84.6% 92.5%, 83% 95.5%, 80% 97.8%, 76% 99%, 71% 99%, 29% 99%, 24% 99%, 20% 97.8%, 17% 95.5%, 15.4% 92.5%, 15% 89%)',
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
        <path d="M 22 25 L 22 120" stroke="rgba(255,255,255,0.3)" strokeWidth="4" strokeLinecap="round" />
        <path d="M 78 45 L 78 110" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" />
      </>
    )
  },
  flask: {
    clipPath: 'polygon(40% 10%, 60% 10%, 60% 40%, 85% 88%, 84.2% 92%, 82.5% 95.5%, 79.5% 98%, 75% 99%, 25% 99%, 20.5% 98%, 17.5% 95.5%, 15.8% 92%, 15% 88%, 40% 40%)',
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
        <path d="M 22 110 L 35 75" stroke="rgba(255,255,255,0.3)" strokeWidth="4" strokeLinecap="round" />
      </>
    )
  },
  dish: {
    clipPath: 'polygon(5% 20%, 95% 20%, 95% 45%, 93.5% 58%, 90% 70%, 85% 81%, 78% 90%, 69% 96.5%, 58% 99.5%, 42% 99.5%, 31% 96.5%, 22% 90%, 15% 81%, 10% 70%, 6.5% 58%, 5% 45%)',
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
  }
};

const Beaker2D = ({ beakerData, isActive, onClick }) => {
  const { contents, addedHistory, yieldHistory, isHeating, isElectrolyzing, activeBubbles, activeSmoke, smokeColor, intensity, shake, activeFlame, containerType } = beakerData;
  const config = containerConfigs[containerType || 'beaker'] || containerConfigs['beaker'];

  // Lọc ra các chất lỏng/dung dịch để tính toán mực nước
  const liquidContents = contents.filter(c => c.state !== 'solid' && c.type !== 'metal');
  
  const totalVolume = Math.min(liquidContents.length * 20, 95); // max 95% full
  const topColor = liquidContents.length > 0 ? liquidContents[liquidContents.length - 1].color : 'transparent';

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

  // Group and sum chemical quantities for inputs and yields
  const groupedInputs = useMemo(() => {
    if (!addedHistory || addedHistory.length === 0) return [];
    const map = new Map();
    addedHistory.forEach(item => {
      const key = `${item.formula}_${item.unit}`;
      if (!map.has(key)) {
        map.set(key, { ...item, totalAmount: 0 });
      }
      map.get(key).totalAmount += (item.amount || 0);
    });
    return Array.from(map.values());
  }, [addedHistory]);

  const groupedYields = useMemo(() => {
    if (!yieldHistory || yieldHistory.length === 0) return [];
    const map = new Map();
    yieldHistory.forEach(item => {
      const key = `${item.formula}_${item.unit}`;
      if (!map.has(key)) {
        map.set(key, { ...item, totalAmount: 0 });
      }
      map.get(key).totalAmount += (item.amount || 0);
    });
    return Array.from(map.values());
  }, [yieldHistory]);

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

            {/* Solids: Tách biệt khối thả vào (SolidChunk) và kết tủa sinh ra (Precipitate) */}
            {beakerData.droppedSolids?.map((solid, idx) => (
              solid.isPrecipitate ? 
                <Precipitate key={solid.id || idx} color={solid.color || '#ffffff'} index={idx} />
                : 
                <SolidChunk key={solid.id || idx} solid={solid} color={solid.color || '#ffffff'} index={idx} />
            ))}
            
            {/* Electrodes & Electrolysis Visuals */}
            <AnimatePresence>
              {isElectrolyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none z-10"
                >
                  {/* Left Electrode (Anode +) */}
                  <div className="absolute left-[26%] bottom-[8%] top-[-28px] w-[10%] flex flex-col items-center z-30">
                    {/* Red Plug Socket on Top */}
                    <div className="w-5 h-7 bg-gradient-to-r from-red-600 via-red-500 to-red-700 rounded-t-md shadow-lg border border-red-900 flex items-center justify-center text-[10px] font-black text-white">
                      +
                    </div>
                    {/* Metallic Neck */}
                    <div className="w-3 h-2 bg-gradient-to-r from-slate-400 to-slate-600 border-t border-b border-slate-700" />
                    {/* Carbon Rod (Deep in Liquid) */}
                    <div className="w-[85%] h-full bg-gradient-to-r from-slate-900 via-slate-700 to-slate-950 rounded-b-md shadow-inner border-x border-slate-800" />
                  </div>
                  
                  {/* Right Electrode (Cathode -) */}
                  <div className="absolute right-[26%] bottom-[8%] top-[-28px] w-[10%] flex flex-col items-center z-30">
                    {/* Black Plug Socket on Top */}
                    <div className="w-5 h-7 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 rounded-t-md shadow-lg border border-slate-950 flex items-center justify-center text-[10px] font-black text-white">
                      -
                    </div>
                    {/* Metallic Neck */}
                    <div className="w-3 h-2 bg-gradient-to-r from-slate-400 to-slate-600 border-t border-b border-slate-700" />
                    {/* Carbon Rod (Deep in Liquid) */}
                    <div className="w-[85%] h-full bg-gradient-to-r from-slate-900 via-slate-700 to-slate-950 rounded-b-md shadow-inner border-x border-slate-800" />
                  </div>

                  {/* Floating Ion Particles (+ and -) inside liquid */}
                  <div className="absolute inset-x-2 bottom-[10%] h-[60%] overflow-hidden pointer-events-none mix-blend-screen">
                     {/* Red Positive Ions (+) */}
                     <motion.div 
                       animate={{ y: [0, -15, 0], x: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
                       transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                       className="absolute left-[38%] top-[30%] w-3 h-3 rounded-full bg-red-500/80 border border-red-300 text-white text-[8px] font-black flex items-center justify-center shadow-[0_0_6px_#ef4444]"
                     >+</motion.div>
                     <motion.div 
                       animate={{ y: [0, 12, 0], x: [0, -6, 0], opacity: [0.4, 0.9, 0.4] }}
                       transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                       className="absolute left-[45%] top-[60%] w-3 h-3 rounded-full bg-red-500/80 border border-red-300 text-white text-[8px] font-black flex items-center justify-center shadow-[0_0_6px_#ef4444]"
                     >+</motion.div>

                     {/* Blue Negative Ions (-) */}
                     <motion.div 
                       animate={{ y: [0, -12, 0], x: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                       transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                       className="absolute right-[42%] top-[25%] w-3 h-3 rounded-full bg-blue-500/80 border border-blue-300 text-white text-[8px] font-black flex items-center justify-center shadow-[0_0_6px_#3b82f6]"
                     >-</motion.div>
                     <motion.div 
                       animate={{ y: [0, 15, 0], x: [0, 6, 0], opacity: [0.4, 0.9, 0.4] }}
                       transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                       className="absolute right-[36%] top-[55%] w-3 h-3 rounded-full bg-blue-500/80 border border-blue-300 text-white text-[8px] font-black flex items-center justify-center shadow-[0_0_6px_#3b82f6]"
                     >-</motion.div>
                  </div>

                  {/* Micro Electric Sparks */}
                  <motion.div 
                    className="absolute bottom-[20%] inset-x-[30%] h-[30%] mix-blend-screen"
                    animate={{ 
                      opacity: [0.2, 0.8, 0.3, 1, 0.2],
                      filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(0deg)']
                    }}
                    transition={{ duration: 0.4, repeat: Infinity }}
                  >
                    <svg viewBox="0 0 100 50" className="w-full h-full drop-shadow-[0_0_6px_rgba(34,211,238,0.9)]">
                       <path d="M 5 25 Q 25 5 50 25 T 95 25" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
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
