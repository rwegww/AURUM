import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DiscoveryMap from './DiscoveryMap';

const reactionTypesTranslate = {
  "combination": "Phản ứng hóa hợp",
  "decomposition": "Phản ứng phân hủy",
  "single-replacement": "Phản ứng thế",
  "double-replacement": "Phản ứng trao đổi",
  "combustion": "Phản ứng cháy",
  "redox": "Phản ứng oxi hóa-khử",
};

const normalize = (f) => {
  if (!f) return "";
  const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  return f.toString().replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => subMap[m]).trim().toUpperCase();
};

// --- Specialized Lab Equipment Components ---

const Liquid = ({ color, level, isReacting, isGas }) => (
  <motion.div
    className="absolute bottom-0 left-0 right-0 overflow-hidden"
    initial={{ height: 0 }}
    animate={{ height: isGas ? '100%' : `${level}%` }}
    transition={{ duration: 1, ease: "easeOut" }}
    style={{ backgroundColor: isGas ? 'transparent' : color }}
  >
    {/* Surface Tension / Reflection */}
    {!isGas && (
      <div className="absolute top-0 left-0 right-0 h-2 bg-white/20 blur-[1px] z-10" />
    )}
    
    {isGas && (
      <div className="absolute inset-0">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-md"
            style={{
              width: Math.random() * 40 + 20,
              height: Math.random() * 40 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: color,
              opacity: 0.2
            }}
            animate={isReacting ? {
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.4, 0.1],
              x: [0, Math.random() * 30 - 15, 0],
              y: [0, Math.random() * 30 - 15, 0]
            } : {
              opacity: 0.15,
              y: [0, -10, 0]
            }}
            transition={{ duration: 3 + Math.random() * 3, repeat: Infinity }}
          />
        ))}
      </div>
    )}
    {!isGas && level > 0 && (
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {isReacting && [...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/60 rounded-full blur-[1px]"
            style={{
              width: Math.random() * 3 + 2,
              height: Math.random() * 3 + 2,
              left: `${Math.random() * 100}%`,
              bottom: 0,
            }}
            animate={{ y: -150, opacity: [0, 1, 0], x: Math.random() * 20 - 10 }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    )}
  </motion.div>
);

const GasTube = ({ color, isActive }) => (
  <AnimatePresence>
    {isActive && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-30 pointer-events-none"
      >
        <svg width="100%" height="100%" viewBox="0 0 1000 400" preserveAspectRatio="none" fill="none">
           <path d="M750 150 H250 V280" stroke="rgba(255,255,255,0.4)" strokeWidth="8" strokeLinecap="round" />
           <motion.path 
             d="M750 150 H250 V280" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray="10 20"
             animate={{ strokeDashoffset: [0, -60] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
           />
        </svg>
      </motion.div>
    )}
  </AnimatePresence>
);

const Spatula = ({ color, isActive, direction = 'left' }) => (
  <AnimatePresence>
    {isActive && (
      <motion.div
        initial={{ opacity: 0, left: direction === 'left' ? "75%" : "25%", top: "20%", rotate: direction === 'left' ? 45 : -45, x: direction === 'left' ? -24 : 24, scaleX: direction === 'left' ? 1 : -1 }}
        animate={{ opacity: 1, left: direction === 'left' ? "25%" : "75%", top: "45%", rotate: direction === 'left' ? -15 : 15, x: direction === 'left' ? -24 : 24, scaleX: direction === 'left' ? 1 : -1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="absolute -translate-y-1/2 z-50 pointer-events-none"
        style={{ transformOrigin: "24px center" }}
      >
         <div className="relative scale-75 md:scale-100 origin-[24px_center] transition-transform">
            <div className="w-56 h-3 bg-gradient-to-r from-slate-200 to-slate-500 rounded-full shadow-2xl border border-white/20" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-8 bg-gradient-to-b from-slate-100 to-slate-300 rounded-lg shadow-inner flex items-center justify-center border border-slate-400">
               <motion.div className="w-6 h-5 rounded-full" style={{ backgroundColor: color }} initial={{ scale: 0 }} animate={{ scale: 1 }} />
            </div>
            <div className="absolute left-[20px] top-6">
               {[...Array(5)].map((_, i) => (
                 <motion.div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} animate={{ y: [0, 150], opacity: [1, 0], scale: [1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
               ))}
            </div>
         </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Pipette = ({ color, isActive, direction = 'left' }) => (
  <AnimatePresence>
    {isActive && (
      <motion.div
        initial={{ opacity: 0, left: direction === 'left' ? "75%" : "25%", top: "20%" }}
        animate={{ opacity: 1, left: direction === 'left' ? "25%" : "75%", top: "40%" }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="absolute -translate-y-1/2 -translate-x-1/2 z-50 pointer-events-none"
      >
         <div className="relative flex flex-col items-center scale-75 md:scale-100 origin-center transition-transform">
            <div className="w-8 h-12 bg-red-400 rounded-t-full border border-red-500 shadow-md z-10" />
            <div className="w-4 h-24 bg-white/40 border-x border-b border-white/60 rounded-b-full shadow-inner flex flex-col justify-end overflow-hidden pb-1">
               <motion.div className="w-full rounded-b-full" style={{ backgroundColor: color }} initial={{ height: "80%" }} animate={{ height: "10%" }} transition={{ duration: 3, delay: 0.5 }} />
            </div>
            <div className="absolute top-[130px] flex flex-col items-center">
               {[...Array(5)].map((_, i) => (
                 <motion.div key={i} className="w-3 h-4" style={{ backgroundColor: color, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }} initial={{ y: 0, opacity: 0, scale: 0 }} animate={{ y: [0, 100], opacity: [0, 1, 0], scale: [0, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 + i * 0.3 }} />
               ))}
            </div>
         </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const TTube = ({ colorA, colorB, isActive }) => (
  <AnimatePresence>
    {isActive && (
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        exit={{ opacity: 0, scaleY: 0 }}
        style={{ originY: 0 }}
        className="absolute inset-0 z-30 pointer-events-none"
      >
        <svg width="100%" height="100%" viewBox="0 0 1000 400" preserveAspectRatio="none" fill="none">
           <path d="M250 150 H750" stroke="rgba(255,255,255,0.4)" strokeWidth="10" strokeLinecap="round" />
           <path d="M500 150 V280" stroke="rgba(255,255,255,0.2)" strokeWidth="10" strokeLinecap="round" />
           <motion.path 
             d="M250 150 H500" stroke={colorA} strokeWidth="5" strokeLinecap="round" strokeDasharray="10 20"
             animate={{ strokeDashoffset: [0, -60] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
           />
           <motion.path 
             d="M750 150 H500" stroke={colorB} strokeWidth="5" strokeLinecap="round" strokeDasharray="10 20"
             animate={{ strokeDashoffset: [0, 60] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
           />
           <motion.path 
             d="M500 150 V280" stroke="white" strokeWidth="6" strokeLinecap="round" strokeDasharray="10 20"
             animate={{ strokeDashoffset: [0, -60] }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
           />
        </svg>
      </motion.div>
    )}
  </AnimatePresence>
);

const Crucible = ({ colorA, colorB, isActive }) => (
  <AnimatePresence>
    {isActive && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="absolute bottom-[20px] left-1/2 -translate-x-1/2 z-30"
      >
        <div className="w-40 h-28 bg-gradient-to-b from-slate-300 to-slate-400 rounded-b-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-4 border-slate-500/50 flex flex-col items-center justify-center relative overflow-hidden">
           <div className="flex gap-3 mb-2 z-10">
              <motion.div animate={{ rotate: [12, 15, 12] }} transition={{ duration: 2, repeat: Infinity }} className="w-8 h-8 rounded-sm shadow-lg" style={{ backgroundColor: colorA }} />
              <motion.div animate={{ rotate: [-12, -15, -12] }} transition={{ duration: 2, repeat: Infinity }} className="w-8 h-8 rounded-sm shadow-lg" style={{ backgroundColor: colorB }} />
           </div>
           <motion.div className="absolute inset-0 bg-orange-500/10 blur-xl rounded-full" animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 1.5, repeat: Infinity }} />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Vessel = ({ chemical, status, isReacting, interactionMode }) => {
  const color = chemical?.color || '#38bdf8';
  const state = chemical?.state || 'liquid';

  let animState = { rotate: 0, x: 0, y: 0 };
  const isRight = status === 'right';

  if (isReacting && isRight) {
    if (interactionMode === 'mix' && state === 'liquid') {
      animState = { rotate: -45, x: -150, y: 50 };
    } else if (interactionMode === 'drop' && state === 'liquid') {
      animState = { rotate: -20, x: -160, y: 20 };
    } else if (interactionMode === 'solid-liquid' && state === 'liquid') {
      // In case the user swapped slots, if B is liquid and they selected 'thả rắn', 
      // the liquid would theoretically pour. But the solid's container should remain still.
      animState = { rotate: -45, x: -150, y: 50 };
    }
  }

  return (
    <div className="relative h-[200px] flex items-end justify-center">
      <motion.div
        className="relative z-30"
        initial={{ rotate: 0, x: 0, y: 0 }}
        animate={animState}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {state === 'gas' ? (
          <div className="w-16 h-40 relative group">
             <div className="w-full h-full bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 rounded-t-full rounded-b-xl border-2 border-white/20 shadow-2xl relative overflow-hidden glass-panel">
                {chemical && (
                  <motion.div className="absolute inset-0" style={{ backgroundColor: color }} animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 3, repeat: Infinity }} />
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
             </div>
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-6 bg-slate-500 rounded-t-lg border-2 border-white/30 shadow-lg" />
          </div>
        ) : state === 'solid' ? (
          <div className="w-24 h-28 bg-gradient-to-b from-white/10 to-transparent border-2 border-white/20 rounded-xl relative overflow-hidden shadow-2xl glass-panel">
            <div className="absolute top-0 left-0 right-0 h-6 bg-white/10 border-b border-white/20" />
            {chemical && (
              <div className="absolute bottom-2 left-2 right-2 top-8 flex flex-wrap gap-1 content-end">
                {[...Array(12)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    animate={{ y: [0, -2, 0], rotate: [0, 5, 0] }} 
                    transition={{ duration: 2 + Math.random(), repeat: Infinity }}
                    className="w-4 h-4 rounded-sm shadow-lg border border-white/10" 
                    style={{ backgroundColor: color, opacity: 0.9 }} 
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-28 h-32 border-x-4 border-b-4 rounded-b-2xl relative bg-white/5 border-white/40 overflow-hidden">
            {chemical && <Liquid color={color} level={60} isReacting={isReacting} isGas={state === 'gas'} />}
          </div>
        )}
      </motion.div>
      {chemical && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute -top-14 left-1/2 -translate-x-1/2 z-50">
          <div className="px-5 py-2 glass-pill min-w-[80px] text-center">
            <span className="text-lg font-black text-white tracking-widest leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              {chemical.formula}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// --- Main Simulator Component ---

const ReactionSimulator = () => {
  const { user, isLoggedIn, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [chemicals, setChemicals] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState('mix');
  const [showDiscoveryJournal, setShowDiscoveryJournal] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const [chemsRes, rxsRes] = await Promise.all([
          fetch('/api/lab/chemicals', { headers }),
          fetch('/api/lab/reactions', { headers })
        ]);
        const chemsData = await chemsRes.json();
        const rxsData = await rxsRes.json();
        setChemicals(chemsData);
        setReactions(rxsData);
        
        // --- Initial Progression Logic ---
        const starters = chemsData.filter(c => c.is_starter || c.isStarter).map(c => c.formula);
        
        // Sync with LocalStorage as a baseline (for guests or before auth loads)
        const saved = localStorage.getItem('chem_odyssey_discovered');
        if (saved) {
          try {
            setDiscoveredFormulas(Array.from(new Set([...starters, ...JSON.parse(saved)])));
          } catch (e) { setDiscoveredFormulas(starters); }
        } else {
          setDiscoveredFormulas(starters);
          localStorage.setItem('chem_odyssey_discovered', JSON.stringify(starters));
        }
      } catch (err) {
        console.error("Failed to fetch lab data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Dynamic Sync for Authenticated Users ---
  // When 'user' finishes loading asynchronously, sync their chemicals into state
  useEffect(() => {
    if (isLoggedIn && user && user.unlockedChemicals && chemicals.length > 0) {
      setDiscoveredFormulas(prev => {
        const starters = chemicals.filter(c => c.is_starter || c.isStarter).map(c => c.formula);
        return Array.from(new Set([...prev, ...starters, ...user.unlockedChemicals]));
      });
    }
  }, [user, isLoggedIn, chemicals]);

  const findReaction = (reactantFormulas, isHeating = false) => {
    if (!reactantFormulas || reactantFormulas.length === 0) return null;
    const formulas = reactantFormulas.filter(f => f !== null && f !== undefined);
    
    return reactions.find(rx => {
      const rxReactantFormulas = rx.reactants.map(r => r.formula);
      if (rxReactantFormulas.length !== formulas.length) return false;
      const matchReactants = formulas.every(f => rxReactantFormulas.includes(f));
      if (rx.requires_heat && !isHeating) return false;
      return matchReactants;
    });
  };

  // --- Derived Progression State ---
  const starterFormulas = useMemo(() => 
    chemicals.filter(c => c.is_starter).map(c => c.formula)
  , [chemicals]);

  const totalDiscoverable = useMemo(() => 
    chemicals.filter(c => !c.is_starter).length
  , [chemicals]);

  const discoveredProductsCount = useMemo(() => 
    discoveredFormulas.filter(f => !starterFormulas.includes(f)).length
  , [discoveredFormulas, starterFormulas]);

  const progressPercent = useMemo(() => 
    totalDiscoverable > 0 ? Math.round((discoveredProductsCount / totalDiscoverable) * 100) : 0
  , [discoveredProductsCount, totalDiscoverable]);

  const categories = useMemo(() => {
    const discoveredChems = chemicals.filter(c => discoveredFormulas.includes(c.formula));
    const cats = new Set(discoveredChems.map(c => c.type));
    return ['all', ...Array.from(cats)];
  }, [chemicals, discoveredFormulas]);

  const filteredChemicals = useMemo(() => {
    return chemicals.filter(c => {
      const isDiscovered = discoveredFormulas.includes(c.formula);
      if (!isDiscovered) return false;
      const matchCategory = filterCategory === 'all' || c.type === filterCategory;
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.formula.includes(search);
      return matchCategory && matchSearch;
    });
  }, [chemicals, filterCategory, search, discoveredFormulas]);

  const handleReact = () => {
    if (!selectedA && !selectedB) return;

    // Phase 3: Interaction Mode Validation
    const stateA = selectedA?.state || 'liquid';
    const stateB = selectedB?.state || 'liquid';
    const hasGas = stateA === 'gas' || stateB === 'gas';
    const hasSolid = stateA === 'solid' || stateB === 'solid';
    const hasLiquid = stateA === 'liquid' || stateB === 'liquid';

    let expectedInteractions = ['mix'];
    if (hasGas && hasLiquid) expectedInteractions = ['bubble'];
    else if (hasSolid && hasLiquid) expectedInteractions = ['solid-liquid', 'drop'];
    else if (stateA === 'solid' && stateB === 'solid') expectedInteractions = ['mix']; // Nung nóng 2 rắn
    else if (stateA === 'liquid' && stateB === 'liquid') expectedInteractions = ['mix'];

    if (selectedA && selectedB && !expectedInteractions.includes(selectedInteraction)) {
      setResult('wrong-interaction');
      return;
    }

    setIsReacting(true);
    setResult(null);
    setTimeout(() => {
      const formulas = [selectedA?.formula, selectedB?.formula];
      const found = findReaction(formulas, isHeating);

      if (found && found.products) {
        const normalizedDiscovered = discoveredFormulas.map(f => normalize(f));
        const newProducts = found.products.filter(p => !normalizedDiscovered.includes(normalize(p.formula)));
        
        if (newProducts.length > 0) {
          // Keep the first one for the "Wow!" modal if it exists in the master list
          const targetNorm = normalize(newProducts[0].formula);
          const chemObj = chemicals.find(c => normalize(c.formula) === targetNorm);
          if (chemObj) setNewDiscovery(chemObj);

          const allNewFormulas = newProducts.map(p => p.formula);
          const updated = Array.from(new Set([...discoveredFormulas, ...allNewFormulas]));
          setDiscoveredFormulas(updated);
          
          if (isLoggedIn) {
            const token = localStorage.getItem('token');
            fetch('/api/lab/unlock', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ formulas: allNewFormulas })
            }).then(() => {
              refreshUser();
            }).catch(err => console.error("Failed to save progress:", err));
          } else {
            localStorage.setItem('chem_odyssey_discovered', JSON.stringify(updated));
          }
        }

        // Phase 4: Hazard / Safety System Check
        const toxicGases = ['Cl2', 'H2S', 'NO2', 'SO2', 'CO', 'PH3'];
        const isHazard = found.animation === 'explosion' || 
                        found.products?.some(p => toxicGases.includes(normalize(p.formula)));
        
        if (isHazard) {
           setResult({ type: 'hazard', ...found });
           setIsReacting(false);
           return;
        }
      }

      setResult(found || 'no-reaction');
      setIsReacting(false);
    }, 4000);
  };

  const resetAll = () => {
    setSelectedA(null); setSelectedB(null); setIsHeating(false); setResult(null); setSearch('');
  };

  const collectProduct = () => {
    if (!result || result === 'no-reaction') return;
    const mainProduct = result.products[0];
    const chemData = chemicals.find(c => c.formula === mainProduct.formula);
    if (chemData) {
      setSelectedA(chemData); setSelectedB(null); setResult(null);
    }
  };

  const handleExit = () => {
    navigate('/classroom');
  };

  const toggleFullScreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      console.error(`Error attempting to toggle full-screen mode: ${err.message}`);
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  if (isLoading) return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0c10] text-white">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-viet-green border-t-transparent rounded-full mb-6" />
      <h2 className="text-2xl font-black italic tracking-widest uppercase animate-pulse">Đang chuẩn bị dụng cụ...</h2>
      <p className="mt-2 text-white/40 font-bold uppercase text-xs tracking-[4px]">Hệ thống Lab v2.2</p>
    </div>
  );

  return (
    <div ref={containerRef} className={`relative flex-1 flex flex-col md:flex-row gap-6 p-4 md:p-8 lab-ambient-bg min-h-[600px] overflow-hidden transition-all duration-700 ${isFullscreen ? 'fixed inset-0 z-[100]' : ''} rounded-[48px]`}>
      <div className="absolute inset-0 lab-grid-overlay pointer-events-none opacity-20" />

      {/* Modals and Overlays */}
      <AnimatePresence>
        {/* New Discovery Modal */}
        {newDiscovery && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl">
             <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[48px] p-12 text-center max-w-md">
                <div className="text-6xl mb-6">✨</div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase italic">Phát hiện mới!</h2>
                <div className="text-5xl font-black text-viet-green mb-2">{newDiscovery.formula}</div>
                <p className="text-slate-500 mb-8 font-medium">{newDiscovery.name}</p>
                <button onClick={() => setNewDiscovery(null)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl w-full font-black uppercase tracking-widest hover:scale-105 transition-transform">Tiếp tục hành trình</button>
             </motion.div>
          </motion.div>
        )}

        {/* Discovery Journal Modal */}
        {showDiscoveryJournal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, y: 50, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              className="bg-[#0a0c10] w-[95vw] h-[90vh] rounded-[56px] border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden"
            >
              <button 
                onClick={() => setShowDiscoveryJournal(false)} 
                className="absolute top-8 right-8 w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-red-500 hover:scale-110 active:scale-90 transition-all z-[210] border border-white/10 backdrop-blur-xl"
              >
                <span className="text-xl">✕</span>
              </button>
              
              <div className="absolute top-10 left-10 z-20 pointer-events-none">
                <span className="text-viet-green text-[12px] font-black uppercase tracking-[12px] mb-3 block opacity-40">Mạng lưới khám phá</span>
                <h2 className="text-4xl lg:text-5xl font-black text-white italic uppercase tracking-tighter">
                  Synthesis <span className="text-viet-green">Nexus</span>
                </h2>
              </div>

              <div className="flex-1 w-full h-full">
                <DiscoveryMap 
                  chemicals={chemicals} 
                  reactions={reactions} 
                  discoveredFormulas={discoveredFormulas} 
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SIDEBAR: Chemical Cabinet & Tools */}
      <motion.aside initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:w-80 flex flex-col gap-6 glass-panel rounded-[40px] p-6 h-fit max-h-[calc(100vh-10rem)] lg:sticky lg:top-8 z-20">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xl font-black italic uppercase tracking-tighter text-white/90">Phòng <span className="text-viet-green">vật tư</span></h3>
          <button onClick={() => setShowDiscoveryJournal(true)} className="w-10 h-10 glass-pill text-viet-green flex items-center justify-center hover:bg-viet-green hover:text-white transition-all shadow-lg" title="Sổ tay Hành trình">📖</button>
        </div>

        <div className="space-y-6 flex-1 overflow-hidden flex flex-col">
          <div className="space-y-3">
             <span className="text-[10px] font-black uppercase tracking-[4px] text-white/30 px-2">Kho hóa chất</span>
             <div className="space-y-4">
               <input type="text" placeholder="Tìm kiếm..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-viet-green/50 outline-none transition-all focus:bg-white/10 placeholder:text-white/20" />
               <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer hover:bg-white/10 transition-all">
                 {categories.map(cat => <option key={cat} value={cat} className="bg-slate-900">{cat}</option>)}
               </select>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-2 gap-3 min-h-0">
            {filteredChemicals.map((chem) => (
              <motion.div 
                key={chem.formula} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => { if (activeSlot === 'A') setSelectedA(chem); else setSelectedB(chem); }}
                className={`p-4 rounded-3xl cursor-pointer transition-all border-2 text-center group ${
                  (selectedA?.formula === chem.formula || selectedB?.formula === chem.formula)
                  ? 'bg-viet-green/20 border-viet-green shadow-[0_0_20px_rgba(118,192,52,0.3)]' : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="text-xl font-black mb-1 group-hover:scale-110 transition-transform" style={{ color: (selectedA?.formula === chem.formula || selectedB?.formula === chem.formula) ? '#76c034' : chem.color }}>{chem.formula}</div>
                <div className="text-[8px] font-black uppercase opacity-40 truncate group-hover:opacity-100 transition-opacity">{chem.name}</div>
              </motion.div>
            ))}
          </div>

        </div>
      </motion.aside>

      {/* CENTER AREA: Lab & Controls */}
      <main className="flex-1 flex flex-col gap-8">
        <div className="relative glass-panel rounded-[56px] p-8 md:p-12 flex flex-col items-center shadow-inner overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-viet-green/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
          {/* Lab Control Bar */}
          <div className="absolute top-6 left-6 z-50 flex items-center gap-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExit}
              className="px-6 py-3 bg-viet-green text-white rounded-full font-black text-[11px] uppercase tracking-[3px] hover:brightness-110 transition-all flex items-center gap-2"
            >
              <span>THOÁT</span>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullScreen}
              className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl transition-all shadow-2xl group"
              title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
            >
              {isFullscreen ? (
                <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h6m0 0v6m0-6L14 10M9 21H3m0 0v-6m0 6l7-7" />
                </svg>
              )}
            </motion.button>
          </div>

          <div className="text-center mb-14 relative z-10">
            <span className="text-viet-green text-[10px] font-black uppercase tracking-[8px] mb-2 block">Phòng thí nghiệm v2.2</span>
            <h2 className="text-3xl font-black text-white italic uppercase">Hệ thống <span className="text-viet-green">phản ứng</span></h2>
          </div>

          <div className="relative z-20 w-full aspect-[2/1] bg-black/20 rounded-[48px] border border-white/10 p-4">
            {isReacting && selectedA && selectedB && (
              <>
                {selectedB.state === 'gas' && selectedA.state !== 'gas' && <GasTube color={selectedB.color} isActive={isReacting} />}
                
                {selectedInteraction === 'solid-liquid' && (
                  <Spatula 
                    color={selectedA.state === 'solid' ? selectedA.color : selectedB.color} 
                    isActive={isReacting} 
                    direction={selectedA.state === 'solid' ? 'right' : 'left'} 
                  />
                )}

                {selectedInteraction === 'drop' && (
                  <Pipette 
                    color={selectedA.state === 'liquid' ? selectedA.color : selectedB.color} 
                    isActive={isReacting} 
                    direction={selectedA.state === 'liquid' ? 'right' : 'left'} 
                  />
                )}

                {selectedA.state === 'gas' && selectedB.state === 'gas' && <TTube colorA={selectedA.color} colorB={selectedB.color} isActive={isReacting} />}
                {selectedA.state === 'solid' && selectedB.state === 'solid' && <Crucible colorA={selectedA.color} colorB={selectedB.color} isActive={isReacting} />}
              </>
            )}
            <AnimatePresence>
              {isHeating && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className={`absolute bottom-4 -translate-x-1/2 z-15 transition-all duration-500 ${(selectedA?.state === 'gas' && selectedB?.state === 'gas') ? 'left-1/2' : activeSlot === 'B' ? 'left-3/4' : 'left-1/4'}`}
                >
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div key={i} className="w-3 h-20 bg-gradient-to-t from-orange-500 via-yellow-300 to-transparent rounded-full" animate={{ height: [30, 80, 30], y: [0, -15, 0] }} transition={{ duration: 0.4, delay: i * 0.1, repeat: Infinity }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-8 flex justify-center items-end h-[200px] pointer-events-none">
              {/* Slot A */}
              <div onClick={(e) => { e.stopPropagation(); setActiveSlot('A'); }} className={`absolute left-1/4 -translate-x-1/2 bottom-0 cursor-pointer transition-all duration-500 pointer-events-auto ${activeSlot === 'A' ? 'z-40 scale-110' : 'z-20 opacity-40'}`}>
                <Vessel chemical={selectedA} status="left" isReacting={isReacting} interactionMode={selectedInteraction} />
                <div className={`mt-4 h-1.5 w-full rounded-full ${activeSlot === 'A' ? 'bg-viet-green shadow-lg' : 'bg-white/10'}`} />
              </div>

              {/* Middle Slot (Collection) - Show if reactants are both gas OR products are all gas */}
              <AnimatePresence>
                {((selectedA?.state === 'gas' && selectedB?.state === 'gas') || 
                  (result && result !== 'no-reaction' && result.products?.every(p => chemicals.find(c => c.formula === p.formula)?.state === 'gas'))) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute left-1/2 -translate-x-1/2 bottom-0 z-30"
                  >
                    <Vessel
                      chemical={result && result !== 'no-reaction' && result.products ? (chemicals.find(c => c.formula === result.products[0]?.formula)) : null} 
                      isReacting={isReacting} 
                      interactionMode="mix"
                    />
                    <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div onClick={(e) => { e.stopPropagation(); setActiveSlot('B'); }} className={`absolute left-3/4 -translate-x-1/2 bottom-0 cursor-pointer transition-all duration-500 pointer-events-auto ${activeSlot === 'B' ? 'z-40 scale-110' : 'z-20 opacity-40'}`}>
                <Vessel chemical={selectedB} status="right" isReacting={isReacting} interactionMode={selectedInteraction} />
                <div className={`mt-4 h-1.5 w-full rounded-full ${activeSlot === 'B' ? 'bg-viet-green shadow-lg' : 'bg-white/10'}`} />
              </div>
            </div>
          </div>

          {/* Interaction Mode Selection */}
          <div className="flex flex-wrap justify-center gap-2 mt-8 w-full z-20">
            {['mix', 'bubble', 'solid-liquid', 'drop'].map(mode => (
              <button 
                key={mode}
                onClick={() => setSelectedInteraction(mode)}
                className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedInteraction === mode ? 'bg-viet-green/20 border-viet-green text-viet-green shadow-lg scale-105' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white'}`}
              >
                {mode === 'mix' ? '💧 Trộn dung dịch' : mode === 'bubble' ? '💨 Sục khí' : mode === 'solid-liquid' ? '🪨 Thả rắn vào lỏng' : '🧪 Nhỏ giọt lên rắn'}
              </button>
            ))}
          </div>

          <div className="flex justify-center flex-wrap gap-4 mt-6 w-full z-20">
            <button onClick={() => setIsHeating(!isHeating)} className={`px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[2px] transition-all border-2 ${isHeating ? 'bg-orange-600 border-orange-400 text-white shadow-xl scale-105' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}>
              🔥 {isHeating ? 'Đang bật' : 'Gia nhiệt'}
            </button>
            <button onClick={handleReact} disabled={(!selectedA && !selectedB) || isReacting} className="px-10 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[2px] bg-gradient-to-r from-viet-green to-blue-500 text-white shadow-xl hover:scale-105 disabled:opacity-30">
              {isReacting ? '⌛ Đang xử lý...' : '⚡ Phản ứng'}
            </button>
            <button onClick={resetAll} className="px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[2px] bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
              Đặt lại
            </button>
          </div>
        </div>


      </main>

      {/* RIGHT SIDEBAR: Result Panel */}
      <motion.aside initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:w-80 flex flex-col glass-panel rounded-[40px] p-6 lg:sticky lg:top-8 h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-2 mb-8">
           <span className="text-viet-green text-[10px] font-black uppercase tracking-[6px] opacity-40">Màn hình giám sát</span>
           <h3 className="text-xl font-black italic uppercase tracking-tighter text-white/90">Báo cáo <span className="text-viet-green">kết quả</span></h3>
        </div>
        <AnimatePresence mode="wait">
          {!result && !isReacting ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-white/10 rounded-[32px] gap-4">
              <span className="text-4xl">🧪</span>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Đang chờ phản ứng...</p>
            </motion.div>
          ) : isReacting ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-8 text-center bg-white/5 rounded-[32px] gap-4">
              <div className="w-12 h-12 border-4 border-viet-green border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-viet-green italic">Đang phân tích...</p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-[32px] border-2 shadow-inner ${(result === 'no-reaction' || result === 'wrong-interaction') ? 'bg-orange-500/10 border-orange-500/20' : result?.type === 'hazard' ? 'bg-red-900/40 border-red-500' : 'bg-viet-green/10 border-viet-green/20'}`}>
               {result === 'wrong-interaction' ? (
                 <div className="text-center space-y-4">
                    <span className="text-4xl block">❌</span>
                    <p className="text-sm font-black text-orange-400">SAI THAO TÁC</p>
                    <p className="text-[10px] text-white/60 italic leading-relaxed">
                      Hai chất hóa học này không thể tương tác bằng phương thức bạn vừa chọn. Vui lòng quan sát trạng thái của chất (Rắn/Lỏng/Khí) và chọn lại cách thích hợp.
                    </p>
                 </div>
               ) : result?.type === 'hazard' ? (
                 <div className="text-center space-y-4">
                    <span className="text-5xl block animate-bounce">☢️</span>
                    <h4 className="text-lg font-black text-red-500 uppercase">Sự cố nguy hiểm!</h4>
                    <p className="text-[10px] text-red-200 bg-red-950/50 p-4 rounded-xl border border-red-500/30 leading-relaxed text-justify">
                      Phản ứng sinh ra cháy nổ hoặc khí độc. Trong môi trường thực tế, thao tác này cực kỳ nghiêm trọng và phải được thực hiện trong tủ hút có bảo hộ. <br/><br/>Hệ thống đã tự động dừng thí nghiệm để đảm bảo an toàn.
                    </p>
                     <div className="flex flex-col items-center gap-3">
                        <span className="text-[10px] font-black uppercase text-red-400 tracking-[4px]">Sản phẩm nguy hại</span>
                        <div className="flex flex-wrap justify-center gap-2">
                           {result.products.map((p, i) => (
                             <div key={i} className="bg-red-500/30 px-3 py-1 rounded-lg text-sm font-black text-white">{p.formula}</div>
                           ))}
                        </div>
                     </div>
                     <div className="flex gap-2 mt-4">
                        <button onClick={collectProduct} className="flex-1 py-3 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 shadow-lg">
                           📦 Thu hoạch khí
                        </button>
                        <button onClick={resetAll} className="flex-1 py-3 bg-white/10 text-white/60 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20">
                           Hủy bỏ
                        </button>
                     </div>
                 </div>
               ) : result === 'no-reaction' ? (
                 <div className="text-center space-y-4">
                    <span className="text-4xl block">⚠️</span>
                    <p className="text-sm font-black text-orange-200">KHÔNG PHẢN ỨNG</p>
                    <p className="text-[10px] text-white/40 italic">Vui lòng kiểm tra lại 2 chất tham gia hoặc điều kiện nhiệt độ.</p>
                 </div>
               ) : (
                 <div className="space-y-6">
                    <div className="flex flex-col items-center gap-3">
                       <span className="text-[10px] font-black uppercase text-viet-green tracking-[4px]">Sản phẩm</span>
                       <div className="flex flex-wrap justify-center gap-2">
                          {result.products.map((p, i) => (
                            <div key={i} className="bg-viet-green/30 px-3 py-1 rounded-lg text-sm font-black">{p.formula}</div>
                          ))}
                       </div>
                    </div>
                    <p className="text-[10px] text-white/60 italic leading-relaxed text-center">{result.observation || result.description}</p>
                    <button onClick={collectProduct} className="w-full py-4 bg-viet-green text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 shadow-lg">
                      📦 Thu hoạch
                    </button>
                 </div>
               )}
            </motion.div>
          ) }
        </AnimatePresence>
      </motion.aside>
    </div>
  );
};

export default ReactionSimulator;
