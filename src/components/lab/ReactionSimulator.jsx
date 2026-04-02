import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chemicals, findReaction, reactionTypes } from '@/data/reactions';

// --- Sub-components for Visual Lab Equipment ---

const Liquid = ({ color, level, isReacting }) => (
  <motion.div
    className="absolute bottom-0 left-0 right-0 overflow-hidden"
    initial={{ height: 0 }}
    animate={{ height: `${level}%` }}
    transition={{ duration: 1, ease: "easeOut" }}
    style={{ backgroundColor: color }}
  >
    {level > 0 && !isReacting && (
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/30 rounded-full"
            style={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              left: `${Math.random() * 100}%`,
              bottom: '-10%',
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
              x: Math.sin(i) * 10,
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    )}
  </motion.div>
);

const GasTube = ({ color, status, isActive }) => (
  <AnimatePresence>
    {isActive && (
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        exit={{ opacity: 0, scaleY: 0 }}
        style={{ originY: 0 }}
        className={`absolute top-4 ${status === 'left' ? 'left-[4rem]' : 'right-[4rem]'} z-20 pointer-events-none`}
      >
        <svg width="160" height="280" viewBox="0 0 160 280" fill="none">
           {/* Tube Path: From cylinder to Erlenmeyer center */}
           <path 
             d={status === 'left' ? "M0 0 C 40 0, 100 0, 100 60 V220" : "M160 0 C 120 0, 60 0, 60 60 V220"} 
             stroke="rgba(255,255,255,0.4)" 
             strokeWidth="6" 
             strokeLinecap="round"
             className="drop-shadow-sm"
           />
           {/* Inner Gas Flow Particles */}
           <motion.path 
             d={status === 'left' ? "M0 0 C 40 0, 100 0, 100 60 V220" : "M160 0 C 120 0, 60 0, 60 60 V220"} 
             stroke={color} 
             strokeWidth="3" 
             strokeLinecap="round"
             strokeDasharray="4 12"
             animate={{ strokeDashoffset: [0, -32] }}
             transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
           />
        </svg>
      </motion.div>
    )}
  </AnimatePresence>
);

const Spatula = ({ color, status, isActive }) => (
  <AnimatePresence>
    {isActive && (
      <motion.div
        initial={{ 
          opacity: 0, 
          x: status === 'left' ? -80 : 80, 
          y: -40, 
          rotate: status === 'left' ? -45 : 45 
        }}
        animate={{ 
          opacity: 1, 
          x: status === 'left' ? 120 : -120, 
          y: 60, 
          rotate: status === 'left' ? 15 : -15 
        }}
        exit={{ 
          opacity: 0,
          scale: 0.5,
          transition: { duration: 0.3 }
        }}
        className={`absolute top-0 ${status === 'left' ? 'left-8' : 'right-8'} z-40 pointer-events-none`}
      >
         <div className="relative">
            {/* Spatula Handle (Metallic) */}
            <div className={`w-36 h-2 bg-gradient-to-r ${status === 'left' ? 'from-slate-500 to-slate-200' : 'from-slate-200 to-slate-500'} rounded-full shadow-lg border border-white/20`} />
            
            {/* Spatula Scoop */}
            <div className={`absolute ${status === 'left' ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 w-8 h-5 bg-gradient-to-b from-slate-100 to-slate-300 rounded-lg shadow-inner flex items-center justify-center border border-slate-400`}>
               {/* Scooped Solid */}
               <motion.div 
                 className="w-4 h-3 rounded-full" 
                 style={{ backgroundColor: color }}
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
               />
            </div>

            {/* Dropping Particles Animation */}
            <div className={`absolute ${status === 'left' ? 'right-1' : 'left-1'} top-5 flex flex-col items-center`}>
               {[...Array(4)].map((_, i) => (
                 <motion.div
                   key={i}
                   className="w-1.5 h-1.5 rounded-full shadow-sm"
                   style={{ backgroundColor: color }}
                   animate={{ 
                     y: [0, 80], 
                     x: [0, (Math.random() - 0.5) * 10],
                     opacity: [1, 0],
                     scale: [1, 0.5]
                   }}
                   transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                 />
               ))}
            </div>
         </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Vessel = ({ type = 'beaker', chemical, isPouring, isTarget, liquidLevel = 60, status }) => {
  const color = chemical?.color || '#38bdf8';
  const isSolid = chemical?.state === 'solid';
  const isGas = chemical?.state === 'gas';

  return (
    <div className="relative">
      {/* Specialized Interaction Tools */}
      {!isTarget && isGas && <GasTube color={color} status={status} isActive={isPouring} />}
      {!isTarget && isSolid && <Spatula color={color} status={status} isActive={isPouring} />}

      <motion.div
        className="relative"
        animate={isPouring ? (
          isTarget ? { scale: [1, 1.02, 1] } : (
            isGas || isSolid ? { x: 0, y: 0, rotate: 0 } : {
              rotate: status === 'left' ? 45 : -45,
              x: status === 'left' ? 60 : -60,
              y: 20
            }
          )
        ) : { rotate: 0, x: 0, y: 0 }}
      >
        {/* Vessel Shape Rendering */}
        {type === 'erlenmeyer' ? (
          <div className="w-24 h-28 relative flex items-end justify-center">
            <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
               <path d="M35 10 H65 V40 L95 110 H5 L35 40 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
               <clipPath id="flaskClip">
                 <path d="M35 10 H65 V40 L95 110 H5 L35 40 Z" />
               </clipPath>
               {chemical && (
                 <motion.rect 
                   x="0" y={110 - (liquidLevel * 1.1)} width="100" height="120" 
                   fill={color} 
                   clipPath="url(#flaskClip)"
                   initial={{ height: 0 }}
                   animate={{ height: 120 }}
                 />
               )}
               {/* Deep Bubbling Effect for Gas */}
               {isTarget && isPouring && chemical?.formula === '???' && (
                 <g clipPath="url(#flaskClip)">
                   {[...Array(12)].map((_, i) => (
                     <motion.circle
                       key={i}
                       r={Math.random() * 3 + 1}
                       fill="white"
                       fillOpacity="0.4"
                       animate={{ 
                         cy: [110, 30], 
                         cx: [50, 50 + (Math.random() - 0.5) * 20],
                         opacity: [0, 1, 0],
                         scale: [0.5, 1.5, 1]
                       }}
                       transition={{ 
                         duration: Math.random() * 0.8 + 0.4, 
                         repeat: Infinity, 
                         delay: i * 0.1 
                       }}
                     />
                   ))}
                 </g>
               )}
            </svg>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {isGas ? (
              // Pressurized Gas Cylinder
              <div className="w-16 h-36 relative">
                 <div className="w-full h-full bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 rounded-t-full rounded-b-xl border-2 border-white/20 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border border-white/30 bg-slate-400/20 flex items-center justify-center">
                       <div className="w-0.5 h-3 bg-red-500 rounded-full origin-bottom" style={{ transform: 'rotate(45deg)' }} />
                    </div>
                    {chemical && (
                      <motion.div 
                        className="absolute inset-0 opacity-20" 
                        style={{ backgroundColor: color }}
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    <div className="absolute bottom-4 left-2 right-2 h-4 bg-white/5 rounded-full" />
                 </div>
                 {/* Valve on top */}
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-slate-500 rounded-t-lg border-x border-t border-white/30" />
              </div>
            ) : isSolid ? (
              // Wide-mouth Solid Jar
              <div className="w-20 h-24 bg-gradient-to-b from-white/10 to-white/5 border-2 border-white/30 rounded-xl relative overflow-hidden shadow-xl">
                <div className="absolute top-0 left-0 right-0 h-5 bg-white/20 border-b border-white/30" />
                {chemical && (
                  <div className="absolute bottom-2 left-2 right-2 top-8 flex flex-wrap gap-1 content-end">
                    {[...Array(15)].map((_, i) => (
                      <div key={i} className="w-3 h-3 rounded-sm shadow-inner" style={{ backgroundColor: color, opacity: 0.7 }} />
                    ))}
                  </div>
                )}
                <div className="absolute inset-0 bg-white/5 pointer-events-none" />
              </div>
            ) : (
              // Precision Liquid Beaker
              <div className="w-24 h-28 border-x-4 border-b-4 rounded-b-xl relative bg-white/5 border-white/40 shadow-inner">
                <div className="absolute left-1 top-4 w-3 h-[2px] bg-white/40" />
                <div className="absolute left-1 top-10 w-4 h-[2px] bg-white/40" />
                <div className="absolute left-1 top-16 w-3 h-[2px] bg-white/40" />
                <div className="absolute left-1 top-22 w-4 h-[2px] bg-white/40" />
                {chemical && <Liquid color={color} level={liquidLevel} isReacting={false} />}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Chemical Identity Label */}
      {chemical && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 text-center w-32"
        >
          <span className="text-[9px] font-black text-white/50 uppercase tracking-[2px] block mb-1">
            {chemical.state === 'gas' ? 'Cylinder' : chemical.state === 'solid' ? 'Solid Jar' : 'Beaker'}
          </span>
          <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-xl inline-block">
            <span className="text-[14px] font-black text-white tracking-widest">{chemical.formula}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const ReactionSimulator = () => {
  const [selectedA, setSelectedA] = useState(null);
  const [selectedB, setSelectedB] = useState(null);
  const [result, setResult] = useState(null);
  const [isReacting, setIsReacting] = useState(false);
  const [isHeating, setIsHeating] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeSlot, setActiveSlot] = useState('A'); 
  const [discoveredFormulas, setDiscoveredFormulas] = useState([]);
  const [newDiscovery, setNewDiscovery] = useState(null);

  // Initialize and Load Progress
  useEffect(() => {
    const saved = localStorage.getItem('chem_odyssey_discovered');
    const starters = chemicals.filter(c => c.isStarter).map(c => c.formula);
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const combined = Array.from(new Set([...starters, ...parsed]));
        setDiscoveredFormulas(combined);
      } catch (e) {
        setDiscoveredFormulas(starters);
      }
    } else {
      setDiscoveredFormulas(starters);
      localStorage.setItem('chem_odyssey_discovered', JSON.stringify(starters));
    }
  }, []);

  const categories = useMemo(() => {
    const discoveredChems = chemicals.filter(c => discoveredFormulas.includes(c.formula));
    const cats = new Set(discoveredChems.map(c => c.category));
    return ['all', ...Array.from(cats)];
  }, [discoveredFormulas]);

  const filteredChemicals = useMemo(() => {
    return chemicals.filter(c => {
      const isDiscovered = discoveredFormulas.includes(c.formula);
      if (!isDiscovered) return false;

      const matchCategory = filterCategory === 'all' || c.category === filterCategory;
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.formula.includes(search);
      return matchCategory && matchSearch;
    });
  }, [filterCategory, search, discoveredFormulas]);

  const handleReact = () => {
    if (!selectedA && !selectedB) return;
    setIsReacting(true);
    setResult(null);

    // Dynamic timeout based on complex animations (Spatula takes effort!)
    setTimeout(() => {
      const formulas = [selectedA?.formula, selectedB?.formula];
      const found = findReaction(formulas, isHeating);
      setResult(found || 'no-reaction');
      setIsReacting(false);

      if (found && found.products) {
        const newProducts = found.products.filter(p => !discoveredFormulas.includes(p.formula));
        if (newProducts.length > 0) {
          const chemicalObjects = newProducts.map(p => chemicals.find(c => c.formula === p.formula)).filter(Boolean);
          if (chemicalObjects.length > 0) {
            setNewDiscovery(chemicalObjects[0]); 
            const updatedFormulas = Array.from(new Set([...discoveredFormulas, ...newProducts.map(p => p.formula)]));
            setDiscoveredFormulas(updatedFormulas);
            localStorage.setItem('chem_odyssey_discovered', JSON.stringify(updatedFormulas));
          }
        }
      }
    }, 3500);
  };

  const resetAll = () => {
    setSelectedA(null);
    setSelectedB(null);
    setIsHeating(false);
    setResult(null);
    setSearch('');
    setNewDiscovery(null);
  };

  const resetProgress = () => {
    if (window.confirm('Bạn có muốn xóa tiến trình khám phá và bắt đầu lại từ đầu?')) {
      const starters = chemicals.filter(c => c.isStarter).map(c => c.formula);
      setDiscoveredFormulas(starters);
      localStorage.setItem('chem_odyssey_discovered', JSON.stringify(starters));
      window.location.reload();
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Discovery Modal Overlay */}
      <AnimatePresence>
        {newDiscovery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#1a1c23]/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-white rounded-[48px] p-10 text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-viet-green via-blue-400 to-viet-green animate-shimmer" />
              
              <div className="w-24 h-24 bg-viet-green/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
                 ✨
              </div>
              
              <span className="text-viet-green text-[10px] font-black uppercase tracking-[5px] mb-2 block">New Formula Discovered</span>
              <h2 className="text-3xl font-black text-viet-text italic uppercase mb-2">Phát hiện mới!</h2>
              <div className="py-6 border-y border-viet-border/30 my-6">
                 <span className="text-5xl font-black text-viet-green tracking-tighter block mb-2">{newDiscovery.formula}</span>
                 <p className="text-lg font-bold text-viet-text-light uppercase tracking-widest">{newDiscovery.name}</p>
              </div>
              
              <p className="text-[13px] text-viet-text-light font-medium mb-8 leading-relaxed px-6">
                Tuyệt vời! Bạn đã tổng hợp thành công một hợp chất mới. Nó đã được thêm vào tủ hóa chất để phục vụ cho các thí nghiệm tiếp theo.
              </p>
              
              <button
                onClick={() => setNewDiscovery(null)}
                className="w-full py-4 bg-viet-text text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-viet-green transition-all shadow-xl shadow-black/10"
              >
                Tiếp tục khám phá
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Laboratory Environment */}
      <div className="relative bg-[#1a1c23] rounded-[48px] p-8 md:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-t border-white/10 overflow-hidden">
        {/* Background Haze */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-viet-green/5 blur-[120px] rounded-full" />
        
        {/* Lab Title */}
        <div className="relative z-10 text-center mb-16">
           <span className="text-viet-green text-[10px] font-black uppercase tracking-[8px] mb-3 block">Digital Laboratory v2.0</span>
           <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter">Phòng thí nghiệm <span className="text-viet-green">biến hình</span></h2>
        </div>

        {/* The Lab Bench */}
        <div className="relative z-10 flex flex-col items-center gap-12">
           <div className="flex items-end justify-center gap-12 md:gap-24 relative min-h-[400px]">
              {/* Vessel A Slot */}
              <div 
                onClick={() => setActiveSlot('A')}
                className={`cursor-pointer transition-all duration-300 ${activeSlot === 'A' ? 'scale-110' : 'opacity-60 hover:opacity-100'} z-10`}
              >
                 <Vessel 
                   chemical={selectedA} 
                   isPouring={isReacting} 
                   status="left"
                 />
                 <div className={`mt-4 h-1 w-full rounded-full transition-all ${activeSlot === 'A' ? 'bg-viet-green shadow-[0_0_15px_#4ade80]' : 'bg-white/10'}`} />
              </div>

              {/* Mixing Station (Target) */}
              <div className="relative pt-16">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse" />
                <Vessel 
                   type="erlenmeyer" 
                   chemical={isReacting ? { color: '#ffffff', formula: '???' } : (result && result !== 'no-reaction' ? result.products[0] : null)} 
                   isTarget 
                   liquidLevel={isReacting ? 80 : (result && result !== 'no-reaction' ? 60 : (isHeating ? 10 : 0))}
                 />
                 
                 {/* Reaction Effects Overlay */}
                 <AnimatePresence>
                   {(isReacting || isHeating) && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none flex items-center justify-center pt-32"
                     >
                       {/* Bunsen Burner Fire */}
                       {isHeating && (
                         <div className="absolute -bottom-16 flex flex-col items-center">
                            <motion.div 
                              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                              className="w-24 h-28 bg-gradient-to-t from-orange-600 via-orange-400 to-transparent blur-3xl rounded-full" 
                            />
                            <div className="flex gap-1 relative -top-20">
                              {[...Array(6)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-3.5 h-16 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent rounded-full"
                                  animate={{ height: [50, 80, 50], y: [0, -15, 0], opacity: [0.7, 1, 0.7] }}
                                  transition={{ duration: 0.4, delay: i * 0.08, repeat: Infinity }}
                                />
                              ))}
                            </div>
                         </div>
                       )}

                       {/* Interactive Sparks */}
                       {isReacting && (
                         <div className="absolute inset-0">
                           {[...Array(20)].map((_, i) => (
                             <motion.div
                               key={i}
                               className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_15px_#fff]"
                               animate={{
                                 scale: [1, 2, 0],
                                 y: [0, -180],
                                 x: (Math.random() - 0.5) * 200,
                                 opacity: [0, 1, 0]
                               }}
                               transition={{ duration: 1, repeat: Infinity, delay: i * 0.05 }}
                             />
                           ))}
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl animate-bounce drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]">⚡</div>
                         </div>
                       )}
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>

              {/* Vessel B Slot */}
              <div 
                onClick={() => setActiveSlot('B')}
                className={`cursor-pointer transition-all duration-300 ${activeSlot === 'B' ? 'scale-110' : 'opacity-60 hover:opacity-100'} z-10`}
              >
                 <Vessel 
                   chemical={selectedB} 
                   isPouring={isReacting} 
                   status="right"
                 />
                 <div className={`mt-4 h-1 w-full rounded-full transition-all ${activeSlot === 'B' ? 'bg-viet-green shadow-[0_0_15px_#4ade80]' : 'bg-white/10'}`} />
              </div>
           </div>

           {/* High-Tech Bench Surface */}
           <div className="w-full max-w-4xl h-8 bg-gradient-to-b from-[#2a2d3a] via-[#12141a] to-[#0a0c10] rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden mt-8 border border-white/5">
             <div className="absolute inset-0 bg-white/5 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 30px, #fff 31px)' }} />
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-viet-green to-transparent opacity-30" />
           </div>

           {/* Bench Controls */}
           <div className="flex flex-wrap justify-center gap-6 mt-12">
              <button
                onClick={() => setIsHeating(!isHeating)}
                className={`px-8 py-5 rounded-3xl text-[12px] font-black uppercase tracking-widest transition-all flex items-center gap-4 border-2 ${
                  isHeating 
                    ? 'bg-orange-500 border-orange-400 text-white shadow-[0_15px_45px_-10px_rgba(249,115,22,0.6)] scale-105' 
                    : 'bg-white/5 border-white/10 text-white/40 hover:text-white/80 hover:border-white/30 hover:bg-white/[0.08]'
                }`}
              >
                 <span className={isHeating ? 'animate-bounce text-lg' : 'text-lg'}>🔥</span>
                 {isHeating ? 'Đèn cồn đang cháy' : 'Bật đèn cồn'}
              </button>

              <button
                onClick={handleReact}
                disabled={(!selectedA && !selectedB) || isReacting}
                className={`px-12 py-5 rounded-3xl text-[15px] font-black uppercase tracking-[5px] transition-all relative overflow-hidden group ${
                  (selectedA || selectedB) && !isReacting
                    ? 'bg-viet-green text-white shadow-[0_25px_50px_-15px_rgba(74,222,128,0.5)] hover:-translate-y-1 hover:brightness-110'
                    : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10'
                }`}
              >
                {isReacting ? 'Đang thực hiện...' : 'Bắt đầu thí nghiệm'}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
              
              {(selectedA || selectedB) && (
                <button
                  onClick={resetAll}
                  className="px-8 py-5 rounded-3xl text-[12px] font-black text-white/40 uppercase tracking-widest border border-white/10 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5 transition-all"
                >
                  Dọn dẹp bàn
                </button>
              )}
           </div>
        </div>
      </div>

      {/* Chemical Selection Cabinet */}
      <div className="bg-white rounded-[48px] border border-viet-border p-8 md:p-16 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
           <div>
              <h3 className="text-3xl font-black text-viet-text italic -tracking-wider uppercase">Tủ hóa chất <span className="text-viet-green">Alpha</span></h3>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-[12px] font-bold text-viet-text-light uppercase tracking-widest opacity-70">Lựa chọn cho: {activeSlot === 'A' ? 'Bình trái (Vessel 1)' : 'Bình phải (Vessel 2)'}</p>
                <button 
                  onClick={resetProgress}
                  className="text-[10px] font-black text-red-500/50 uppercase tracking-widest hover:text-red-500 transition-colors bg-red-50 px-2 py-1 rounded-md"
                >
                  Reset Tiến trình
                </button>
              </div>
           </div>
           
           <div className="flex flex-wrap gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Mã hóa chất (H2, HCl...)"
                  className="h-14 bg-[#f8f9fa] border border-viet-border rounded-2xl px-6 text-[14px] text-viet-text font-black outline-none focus:border-viet-green focus:ring-4 focus:ring-viet-green/10 md:w-80 transition-all shadow-inner"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide max-w-lg">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[2px] transition-all whitespace-nowrap ${
                      filterCategory === cat
                        ? 'bg-viet-green text-white shadow-xl shadow-viet-green/20 scale-105'
                        : 'bg-[#f8f9fa] text-viet-text-light border border-viet-border/30 hover:border-viet-green/50'
                    }`}
                  >
                    {cat === 'all' ? 'Tất cả' : cat}
                  </button>
                ))}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
           {filteredChemicals.map(chem => (
             <motion.button
               key={chem.formula}
               whileHover={{ y: -6, scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => {
                 if (activeSlot === 'A') setSelectedA(chem);
                 else setSelectedB(chem);
               }}
               className={`p-6 rounded-[32px] border-2 transition-all flex flex-col items-center text-center gap-4 relative group ${
                 (selectedA?.formula === chem.formula || selectedB?.formula === chem.formula)
                  ? 'bg-viet-green border-viet-green shadow-2xl shadow-viet-green/30'
                  : 'bg-white border-viet-border/30 hover:border-viet-green/50'
               }`}
             >
                <div 
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner transition-all group-hover:rotate-12 ${
                    (selectedA?.formula === chem.formula || selectedB?.formula === chem.formula) ? 'bg-white/20' : 'bg-slate-50'
                  }`}
                >
                   <span style={{ color: chem.color }}>
                     {chem.state === 'gas' ? '☁️' : chem.state === 'solid' ? '💎' : '💧'}
                   </span>
                </div>
                <div>
                   <p className={`text-[17px] font-black tracking-tighter ${selectedA?.formula === chem.formula || selectedB?.formula === chem.formula ? 'text-white' : 'text-viet-text'}`}>{chem.formula}</p>
                   <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedA?.formula === chem.formula || selectedB?.formula === chem.formula ? 'text-white/70' : 'text-viet-text-light'}`}>{chem.name}</p>
                </div>
                
                {/* Selection Counter */}
                {(selectedA?.formula === chem.formula || selectedB?.formula === chem.formula) && (
                   <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center text-[11px] font-black text-viet-green shadow-lg">
                      {selectedA?.formula === chem.formula ? '1' : '2'}
                   </div>
                )}
             </motion.button>
           ))}
        </div>
      </div>

      {/* Result Display Overlays */}
      <AnimatePresence>
        {result && !isReacting && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-x-0 bottom-12 z-[150] px-6 pointer-events-none"
          >
            <div className="max-w-5xl mx-auto bg-[#1a1c23]/95 border border-white/10 rounded-[56px] p-10 md:p-12 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)] flex flex-col md:flex-row gap-12 pointer-events-auto backdrop-blur-3xl overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-br from-viet-green/5 to-transparent pointer-events-none" />
               
               {result === 'no-reaction' ? (
                 <div className="w-full text-center py-10">
                    <div className="text-7xl mb-8 animate-pulse">🧪</div>
                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-6">Phản ứng chưa được ghi nhận</h3>
                    <p className="text-white/50 font-bold max-w-xl mx-auto leading-loose text-lg">
                      Không có hiện tượng gì xảy ra với <span className="text-white">{selectedA?.formula}</span> và <span className="text-white">{selectedB?.formula}</span>. 
                      <br/>Hãy thử thay đổi chất tham gia hoặc bật đèn cồn nếu phản ứng cần nhiệt độ!
                    </p>
                    <button onClick={() => setResult(null)} className="mt-10 px-12 py-4 bg-white/10 text-white rounded-2xl text-[12px] font-black uppercase tracking-[3px] hover:bg-white/20 hover:scale-105 transition-all outline-none">Tôi hiểu rồi</button>
                 </div>
               ) : (
                 <>
                   {/* Visual/Equation Pane */}
                   <div className="md:w-1/2 flex flex-col justify-center gap-10 border-b md:border-b-0 md:border-r border-white/10 pb-12 md:pb-0 md:pr-12">
                      <div>
                         <span className="text-viet-green text-[12px] font-black uppercase tracking-[8px] mb-3 block">Báo cáo Thí nghiệm</span>
                         <h3 className="text-4xl font-black text-white italic leading-[1.1] tracking-tight">{result.name}</h3>
                      </div>
                      
                      <div className="bg-white/5 p-10 rounded-[40px] border border-white/10 text-center relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl">⚗️</div>
                         <p className="text-[11px] font-black text-white/30 uppercase tracking-[4px] mb-6 underline decoration-viet-green decoration-2 underline-offset-8 text-center">Phương trình thực tế</p>
                         <p className="text-3xl font-black text-viet-green tracking-tighter break-words drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]">{result.equation}</p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                         {result.products.map(p => (
                           <div key={p.formula} className="px-5 py-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3 hover:bg-white/[0.08] transition-all">
                              <span className="text-viet-green text-xl font-black">{p.formula}</span>
                              <span className="text-[11px] text-white/60 font-bold uppercase tracking-widest">{p.name}</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Observation Pane */}
                   <div className="md:w-1/2 space-y-10">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-viet-green/20 flex items-center justify-center text-viet-green text-xl shadow-lg shadow-viet-green/10">🔍</div>
                           <p className="text-[13px] font-black text-white uppercase tracking-[4px]">Kết quả Quan sát</p>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                           <div className="p-7 bg-white/5 rounded-[32px] border border-white/5 hover:border-white/10 transition-all">
                              <p className="text-[11px] font-black text-white/20 uppercase tracking-[3px] mb-3 group-hover:text-white/40">Mô tả hiện tượng</p>
                              <p className="text-lg font-bold text-white/90 leading-relaxed italic border-l-4 border-viet-green pl-5 pr-2">"{result.observation}"</p>
                           </div>
                           <div className="p-7 bg-white/5 rounded-[32px] border border-white/5 hover:border-white/10 transition-all">
                              <p className="text-[11px] font-black text-white/20 uppercase tracking-[3px] mb-3 group-hover:text-white/40">Điều kiện lý tưởng</p>
                              <p className="text-md font-bold text-white/80 leading-relaxed pl-1 flex items-center gap-3">
                                 <span className="text-yellow-400">⚡</span> {result.conditions}
                              </p>
                           </div>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-6">
                         <button onClick={resetAll} className="flex-1 py-5 bg-viet-green text-white rounded-[24px] text-[13px] font-black uppercase tracking-[3px] shadow-2xl shadow-viet-green/30 hover:scale-105 active:scale-95 transition-all">Làm sạch bàn cân</button>
                         <button onClick={() => setResult(null)} className="px-10 py-5 bg-white/10 text-white rounded-[24px] text-[13px] font-black uppercase tracking-[3px] hover:bg-white/20 transition-all">Dừng xem</button>
                      </div>
                   </div>
                 </>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReactionSimulator;
