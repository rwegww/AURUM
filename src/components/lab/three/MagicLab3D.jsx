import React, { Suspense, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import GameWorkspace from '../2d-engine/GameWorkspace';
import useLabStore from './magic-lab/store';

import SoundManager from './magic-lab/SoundManager';
import { useSoundEffects, useSoundStore } from './magic-lab/useSoundEffects';
import DiscoveryMap from '../DiscoveryMap'; 
import { ArrowLeft, Beaker, Zap, Droplets, Flame, Search, FlaskConical } from 'lucide-react';
import { getChemicalImage } from '../../../data/chemicalImages';
import ChemicalTooltip from '../ChemicalTooltip';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const normalize = (f) => {
  if (!f) return "";
  const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  return f.toString().replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => subMap[m]).trim().toUpperCase();
};

const isElement = (formula) => {
  const clean = String(formula || '').replace(/[^a-zA-Z]/g, '');
  const capitals = clean.match(/[A-Z]/g) || [];
  return capitals.length === 1;
};

const getElementSymbol = (formula) => {
  return String(formula || '').replace(/[^a-zA-Z]/g, '');
};

const getElementStyle = (symbol) => {
  const styles = {
    H: { bg: 'radial-gradient(circle at 35% 35%, #38bdf8 10%, #0284c7 80%, #0369a1 100%)', shadow: 'shadow-blue-500/20' },
    O: { bg: 'radial-gradient(circle at 35% 35%, #f87171 10%, #dc2626 80%, #991b1b 100%)', shadow: 'shadow-red-500/20' },
    FE: { bg: 'radial-gradient(circle at 35% 35%, #cbd5e1 10%, #64748b 80%, #475569 100%)', shadow: 'shadow-slate-400/20' },
    NA: { bg: 'radial-gradient(circle at 35% 35%, #fb923c 10%, #ea580c 80%, #c2410c 100%)', shadow: 'shadow-orange-500/20' },
    CL: { bg: 'radial-gradient(circle at 35% 35%, #4ade80 10%, #16a34a 80%, #15803d 100%)', shadow: 'shadow-green-500/20' },
    C: { bg: 'radial-gradient(circle at 35% 35%, #6b7280 10%, #374151 80%, #111827 100%)', shadow: 'shadow-gray-700/20' },
    S: { bg: 'radial-gradient(circle at 35% 35%, #fde047 10%, #ca8a04 80%, #a16207 100%)', shadow: 'shadow-yellow-500/20' },
    N: { bg: 'radial-gradient(circle at 35% 35%, #818cf8 10%, #4f46e5 80%, #3730a3 100%)', shadow: 'shadow-indigo-500/20' },
    CA: { bg: 'radial-gradient(circle at 35% 35%, #f8fafc 10%, #cbd5e1 80%, #94a3b8 100%)', shadow: 'shadow-slate-300/20' },
    AG: { bg: 'radial-gradient(circle at 35% 35%, #e2e8f0 10%, #94a3b8 80%, #64748b 100%)', shadow: 'shadow-slate-400/20' },
    AU: { bg: 'radial-gradient(circle at 35% 35%, #fcd34d 10%, #d97706 80%, #b45309 100%)', shadow: 'shadow-amber-500/20' },
    F: { bg: 'radial-gradient(circle at 35% 35%, #a7f3d0 10%, #10b981 80%, #047857 100%)', shadow: 'shadow-emerald-500/20' },
    BR: { bg: 'radial-gradient(circle at 35% 35%, #b45309 10%, #78350f 80%, #451a03 100%)', shadow: 'shadow-amber-900/20' },
    I: { bg: 'radial-gradient(circle at 35% 35%, #d8b4fe 10%, #8b5cf6 80%, #6d28d9 100%)', shadow: 'shadow-purple-500/20' },
    HE: { bg: 'radial-gradient(circle at 35% 35%, #f472b6 10%, #db2777 80%, #9d174d 100%)', shadow: 'shadow-pink-500/20' },
    NE: { bg: 'radial-gradient(circle at 35% 35%, #fda4af 10%, #f43f5e 80%, #be123c 100%)', shadow: 'shadow-rose-500/20' },
    AR: { bg: 'radial-gradient(circle at 35% 35%, #67e8f9 10%, #06b6d4 80%, #0891b2 100%)', shadow: 'shadow-cyan-500/20' },
    SI: { bg: 'radial-gradient(circle at 35% 35%, #94a3b8 10%, #475569 80%, #334155 100%)', shadow: 'shadow-slate-600/20' },
    BE: { bg: 'radial-gradient(circle at 35% 35%, #bef264 10%, #84cc16 80%, #4d7c0f 100%)', shadow: 'shadow-lime-500/20' },
    BA: { bg: 'radial-gradient(circle at 35% 35%, #a7f3d0 10%, #22c55e 80%, #15803d 100%)', shadow: 'shadow-green-600/20' }
  };
  return styles[symbol.toUpperCase()] || { bg: 'radial-gradient(circle at 35% 35%, #d8b4fe 10%, #a855f7 80%, #6b21a8 100%)', shadow: 'shadow-purple-500/20' };
};

const ElementSphere = ({ symbol, size = 'md' }) => {
  const imgSrc = getChemicalImage(symbol);
  const sizeClasses = {
    sm: 'w-5 h-5 text-[9px] font-black',
    md: 'w-8 h-8 text-[12px] font-black',
    lg: 'w-10 h-10 text-[15px] font-black'
  };
  
  if (imgSrc) {
    return (
      <div className={`relative ${sizeClasses[size]} rounded-full shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.5),0_4px_8px_rgba(0,0,0,0.3)] border border-white/20 shrink-0 select-none overflow-hidden`}>
        <img src={imgSrc} alt={symbol} className="absolute inset-0 w-full h-full object-cover" />
      </div>
    );
  }

  const style = getElementStyle(symbol);
  return (
    <span 
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.5),0_4px_8px_rgba(0,0,0,0.3)] border border-white/20 ${style.shadow} shrink-0 select-none`}
      style={{ background: style.bg }}
    >
      {symbol}
    </span>
  );
};

const MoleculeModel = ({ formula, size = 'md' }) => {
  const formulaUpper = String(formula || '').toUpperCase();
  const imgSrc = getChemicalImage(formula);
  
  const conf = {
    sm: {
      container: 'w-8 h-8',
      center: 'w-4 h-4 text-[6px]',
      sat: 'w-2.5 h-2.5 text-[4px]',
      bondH: 'w-4 h-0.5',
      bondV: 'w-4 h-0.5',
      offsetH2O_X: 'translate-x-2.5',
      offsetH2O_Y: 'translate-y-1.5',
      offsetCO2: 'translate-x-3',
      offsetNaCl: 'translate-x-1.5',
      offsetNH3_X: 'translate-x-2.5',
      offsetNH3_Y: 'translate-y-1.5',
      offsetNH3_B: 'translate-y-2.5',
      offsetFe_X: 'translate-x-1.5',
      offsetFe_Y: 'translate-y-1',
      offsetFe_O: 'translate-y-1.5',
      offsetGen: 'translate-x-1'
    },
    md: {
      container: 'w-12 h-12',
      center: 'w-6 h-6 text-[8px]',
      sat: 'w-4 h-4 text-[6px]',
      bondH: 'w-6 h-0.5',
      bondV: 'w-6 h-0.5',
      offsetH2O_X: 'translate-x-4',
      offsetH2O_Y: 'translate-y-2',
      offsetCO2: 'translate-x-4.5',
      offsetNaCl: 'translate-x-2',
      offsetNH3_X: 'translate-x-4',
      offsetNH3_Y: 'translate-y-2',
      offsetNH3_B: 'translate-y-4',
      offsetFe_X: 'translate-x-2',
      offsetFe_Y: 'translate-y-1',
      offsetFe_O: 'translate-y-2',
      offsetGen: 'translate-x-1.5'
    },
    lg: {
      container: 'w-24 h-24',
      center: 'w-12 h-12 text-[14px]',
      sat: 'w-8 h-8 text-[10px]',
      bondH: 'w-12 h-1',
      bondV: 'w-12 h-1',
      offsetH2O_X: 'translate-x-8',
      offsetH2O_Y: 'translate-y-4',
      offsetCO2: 'translate-x-9',
      offsetNaCl: 'translate-x-4',
      offsetNH3_X: 'translate-x-8',
      offsetNH3_Y: 'translate-y-4',
      offsetNH3_B: 'translate-y-8',
      offsetFe_X: 'translate-x-4',
      offsetFe_Y: 'translate-y-2',
      offsetFe_O: 'translate-y-4',
      offsetGen: 'translate-x-3'
    }
  }[size] || {
    container: 'w-12 h-12',
    center: 'w-6 h-6 text-[8px]',
    sat: 'w-4 h-4 text-[6px]',
    bondH: 'w-6 h-0.5',
    bondV: 'w-6 h-0.5',
    offsetH2O_X: 'translate-x-4',
    offsetH2O_Y: 'translate-y-2',
    offsetCO2: 'translate-x-4.5',
    offsetNaCl: 'translate-x-2',
    offsetNH3_X: 'translate-x-4',
    offsetNH3_Y: 'translate-y-2',
    offsetNH3_B: 'translate-y-4',
    offsetFe_X: 'translate-x-2',
    offsetFe_Y: 'translate-y-1',
    offsetFe_O: 'translate-y-2',
    offsetGen: 'translate-x-1.5'
  };

  if (imgSrc) {
    return (
      <div className={`relative ${conf.container} rounded-full overflow-hidden flex items-center justify-center shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.5),0_4px_8px_rgba(0,0,0,0.3)] border border-white/20 select-none shrink-0`}>
        <img src={imgSrc} alt={formula} className="absolute inset-0 w-full h-full object-cover" />
      </div>
    );
  }

  const styleH = { bg: 'radial-gradient(circle at 35% 35%, #38bdf8 10%, #0284c7 80%, #0369a1 100%)' };
  const styleO = { bg: 'radial-gradient(circle at 35% 35%, #f87171 10%, #dc2626 80%, #991b1b 100%)' };
  const styleC = { bg: 'radial-gradient(circle at 35% 35%, #6b7280 10%, #374151 80%, #111827 100%)' };
  const styleNa = { bg: 'radial-gradient(circle at 35% 35%, #fb923c 10%, #ea580c 80%, #c2410c 100%)' };
  const styleCl = { bg: 'radial-gradient(circle at 35% 35%, #4ade80 10%, #16a34a 80%, #15803d 100%)' };
  const styleN = { bg: 'radial-gradient(circle at 35% 35%, #818cf8 10%, #4f46e5 80%, #3730a3 100%)' };
  const styleFe = { bg: 'radial-gradient(circle at 35% 35%, #cbd5e1 10%, #64748b 80%, #475569 100%)' };

  const commonClasses = "rounded-full flex items-center justify-center text-white shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.5),0_4px_8px_rgba(0,0,0,0.3)] border border-white/20 select-none shrink-0 font-black";

  if (formulaUpper.includes('H') && formulaUpper.includes('O') && !formulaUpper.includes('C')) {
    return (
      <div className={`relative ${conf.container} flex items-center justify-center`}>
        <div className={`absolute ${conf.bondH} bg-white/20 rotate-[30deg] -${conf.offsetH2O_X} -translate-y-1`} />
        <div className={`absolute ${conf.bondH} bg-white/20 -rotate-[30deg] ${conf.offsetH2O_X} -translate-y-1`} />
        <div className={`${commonClasses} ${conf.center} absolute`} style={{ background: styleO.bg }}>O</div>
        <div className={`${commonClasses} ${conf.sat} absolute -${conf.offsetH2O_X} ${conf.offsetH2O_Y}`} style={{ background: styleH.bg }}>H</div>
        <div className={`${commonClasses} ${conf.sat} absolute ${conf.offsetH2O_X} ${conf.offsetH2O_Y}`} style={{ background: styleH.bg }}>H</div>
      </div>
    );
  }

  if (formulaUpper.includes('C') && formulaUpper.includes('O')) {
    return (
      <div className={`relative ${conf.container} flex items-center justify-center`}>
        <div className={`absolute bg-white/20`} style={{ width: `calc(${conf.bondH} * 1.5)`, height: '2px' }} />
        <div className={`${commonClasses} ${conf.center} absolute`} style={{ background: styleC.bg }}>C</div>
        <div className={`${commonClasses} ${conf.sat} absolute -${conf.offsetCO2}`} style={{ background: styleO.bg }}>O</div>
        <div className={`${commonClasses} ${conf.sat} absolute ${conf.offsetCO2}`} style={{ background: styleO.bg }}>O</div>
      </div>
    );
  }

  if (formulaUpper.includes('NA') && formulaUpper.includes('CL')) {
    return (
      <div className={`relative ${conf.container} flex items-center justify-center`}>
        <div className={`${commonClasses} ${conf.center} absolute -${conf.offsetNaCl}`} style={{ background: styleNa.bg }}>Na</div>
        <div className={`${commonClasses} ${conf.center} absolute ${conf.offsetNaCl}`} style={{ background: styleCl.bg }}>Cl</div>
      </div>
    );
  }

  if (formulaUpper.includes('N') && formulaUpper.includes('H')) {
    return (
      <div className={`relative ${conf.container} flex items-center justify-center`}>
        <div className={`absolute ${conf.bondV} bg-white/20 rotate-[90deg] translate-y-1`} />
        <div className={`absolute ${conf.bondH} bg-white/20 rotate-[30deg] -${conf.offsetNH3_X} -translate-y-1`} />
        <div className={`absolute ${conf.bondH} bg-white/20 -rotate-[30deg] ${conf.offsetNH3_X} -translate-y-1`} />
        <div className={`${commonClasses} ${conf.center} absolute`} style={{ background: styleN.bg }}>N</div>
        <div className={`${commonClasses} ${conf.sat} absolute -${conf.offsetNH3_X} -${conf.offsetNH3_Y}`} style={{ background: styleH.bg }}>H</div>
        <div className={`${commonClasses} ${conf.sat} absolute ${conf.offsetNH3_X} -${conf.offsetNH3_Y}`} style={{ background: styleH.bg }}>H</div>
        <div className={`${commonClasses} ${conf.sat} absolute ${conf.offsetNH3_B}`} style={{ background: styleH.bg }}>H</div>
      </div>
    );
  }

  if (formulaUpper.includes('FE')) {
    return (
      <div className={`relative ${conf.container} flex items-center justify-center`}>
        <div className={`${commonClasses} ${conf.sat} absolute -${conf.offsetFe_X} -${conf.offsetFe_Y}`} style={{ background: styleFe.bg }}>Fe</div>
        <div className={`${commonClasses} ${conf.sat} absolute ${conf.offsetFe_X} -${conf.offsetFe_Y}`} style={{ background: styleFe.bg }}>Fe</div>
        <div className={`${commonClasses} ${conf.sat} absolute ${conf.offsetFe_O}`} style={{ background: styleO.bg }}>O</div>
      </div>
    );
  }

  return (
    <div className={`relative ${conf.container} flex items-center justify-center`}>
      <div className={`${commonClasses} ${conf.sat} absolute -${conf.offsetGen}`} style={{ background: 'radial-gradient(circle at 35% 35%, #d8b4fe 10%, #a855f7 80%, #6b21a8 100%)' }}>M</div>
      <div className={`${commonClasses} ${conf.sat} absolute ${conf.offsetGen}`} style={{ background: 'radial-gradient(circle at 35% 35%, #a7f3d0 10%, #22c55e 80%, #15803d 100%)' }}>X</div>
    </div>
  );
};

const MagicLab3D = () => {
  const { user, isLoggedIn, refreshUser } = useAuth();
  
  // --- Game Data Local State ---
  const [dbChemicals, setDbChemicals] = useState([]);
  const [discoveredFormulas, setDiscoveredFormulas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- Discovery State ---
  const [newDiscovery, setNewDiscovery] = useState(null);

  // Store Hooks
  const setData = useLabStore(state => state.setData);
  const setUnlocked = useLabStore(state => state.setUnlocked);
  const setOnDiscovery = useLabStore(state => state.setOnDiscovery);
  const beakers = useLabStore(state => state.beakers);
  const activeBeakerIndex = useLabStore(state => state.activeBeakerIndex);
  const isPouringFormula = useLabStore(state => state.isPouringFormula);
  const dropToBeaker = useLabStore(state => state.dropToBeaker);
  const clearBeaker = useLabStore(state => state.clearBeaker);
  const toggleHeat = useLabStore(state => state.toggleHeat);
  const addBeaker = useLabStore(state => state.addBeaker);
  const removeBeaker = useLabStore(state => state.removeBeaker);
  const setActiveBeaker = useLabStore(state => state.setActiveBeaker);
  const cycleContainerType = useLabStore(state => state.cycleContainerType);

  const activeBeaker = beakers[activeBeakerIndex] || beakers[0];
  const [showLabSettings, setShowLabSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Tooltip state
  const [hoveredChem, setHoveredChem] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const containerRef = useRef(null);

  // --- Fullscreen Logic ---
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      if (containerRef.current) {
        containerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      }
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Sound Effects
  const { playSound } = useSoundEffects();
  const { enabled: soundEnabled, toggleSound: toggleLabSound } = useSoundStore();

  // --- 1. Fetch Backend Data ---
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
        
        // Frontend Override: Force KMnO4 to be liquid (solution) as requested
        // Frontend Override: Force all forms of KMnO4 to be liquid (solution)
        const processedChems = [];
        const seenFormulas = new Set();
        
        chemsData.forEach(c => {
          const formula = normalize(c.formula).replace(/:/g, '');
          if (formula === 'KMNO4') {
            c.state = 'liquid';
            c.color = '#800080';
            c.opacity = 0.9;
          }
          
          // Deduplicate if formula and name are basically the same
          if (!seenFormulas.has(c.formula + c.name)) {
            processedChems.push(c);
            seenFormulas.add(c.formula + c.name);
          }
        });

        setDbChemicals(processedChems);
        // Initial progression
        const starters = processedChems.filter(c => c.is_starter || c.isStarter).map(c => c.formula);
        const saved = localStorage.getItem('chem_odyssey_discovered');
        let initialDiscovered = starters;
        
        if (saved) {
          try {
            initialDiscovered = Array.from(new Set([...starters, ...JSON.parse(saved)]));
          } catch (e) { console.error("Stored data corrupted"); }
        }
        
        setDiscoveredFormulas(initialDiscovered);
        setData(processedChems, rxsData, initialDiscovered);
        
      } catch (err) {
        console.error("Failed to fetch lab data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setData]);

  // Sync auth user progress
  useEffect(() => {
    if (isLoggedIn && user && user.unlockedChemicals && dbChemicals.length > 0) {
      const starters = dbChemicals.filter(c => c.is_starter || c.isStarter).map(c => c.formula);
      const combined = Array.from(new Set([...starters, ...user.unlockedChemicals]));
      setDiscoveredFormulas(combined);
      setUnlocked(combined);
    }
  }, [dbChemicals, isLoggedIn, setUnlocked, user]);

  // Handle new discoveries
  const handleOnDiscovery = useCallback((products) => {
    const normalizedDiscovered = discoveredFormulas.map(f => normalize(f));
    const newProducts = products.filter(p => !normalizedDiscovered.includes(normalize(p.formula)));
    
    if (newProducts.length > 0) {
      const targetNorm = normalize(newProducts[0].formula);
      const chemObj = dbChemicals.find(c => normalize(c.formula) === targetNorm);
      if (chemObj) {
        setNewDiscovery(chemObj);
        playSound('success');
      }

      const allNewFormulas = newProducts.map(p => p.formula);
      const updated = Array.from(new Set([...discoveredFormulas, ...allNewFormulas]));
      setDiscoveredFormulas(updated);
      setUnlocked(updated);
      
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
  }, [discoveredFormulas, dbChemicals, isLoggedIn, playSound, refreshUser, setUnlocked]);

  useEffect(() => {
    setOnDiscovery(handleOnDiscovery);
  }, [handleOnDiscovery, setOnDiscovery]);

  // Audio handlers
  const handleClearBeaker = useCallback(() => {
    playSound('wash');
    clearBeaker();
  }, [clearBeaker, playSound]);

  const handleToggleHeat = useCallback(() => {
    playSound('click');
    toggleHeat();
  }, [toggleHeat, playSound]);

  const handleDropToBeaker = useCallback((chemKey) => {
    const chemMap = useLabStore.getState().chemicals;
    const chem = chemMap[chemKey];
    playSound('pour', { chemicalState: chem?.state || 'liquid' });
    dropToBeaker(chemKey);
  }, [dropToBeaker, playSound]);

  useEffect(() => {
    const isDefaultMessage = activeBeaker.reactionMessage?.includes("Mời bắt đầu");
    if (activeBeaker.reactionMessage && !isDefaultMessage) {
      setIsMessageVisible(true);
      const timer = setTimeout(() => setIsMessageVisible(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setIsMessageVisible(false);
    }
  }, [activeBeaker.reactionMessage, activeBeakerIndex]);

  const availableChemicals = useMemo(() => {
    const chemicalsMap = useLabStore.getState().chemicals;
    const query = searchQuery.toLowerCase().trim();
    
    return Object.values(chemicalsMap)
      .filter(c => discoveredFormulas.includes(c.formula))
      .filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.formula.toLowerCase().includes(query)
      );
  }, [discoveredFormulas, searchQuery]);

  if (isLoading) return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0f] text-white rounded-3xl min-h-[600px]">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-6" />
      <h2 className="text-xl font-bold uppercase tracking-widest animate-pulse">Đang nạp dữ liệu Lab...</h2>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-[600px] h-full overflow-hidden font-sans text-white select-none transition-colors duration-1000 rounded-3xl shadow-2xl border border-white/10 bg-[#0a0a0f]"
    >
      <GameWorkspace />

      <SoundManager />

      {/* --- Discovery UI Overlays --- */}
      <AnimatePresence>
        {newDiscovery && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl rounded-3xl">
             <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 text-center max-w-sm shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                <div className="text-5xl mb-6">✨</div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase italic">Phát hiện mới!</h2>
                <div className="text-4xl font-black text-blue-400 mb-2 drop-shadow-md">{newDiscovery.formula}</div>
                <p className="text-white/60 mb-8 font-medium text-sm">{newDiscovery.name}</p>
                <button onClick={() => setNewDiscovery(null)} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl w-full font-bold uppercase tracking-widest transition-all">Tuyệt quá!</button>
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Main UI Layout */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-4 pt-4 pb-4 z-[10]">
        {/* Top Header */}
        <div className="flex justify-end items-start pointer-events-auto">
          <div className="flex gap-2">
            <button 
              onClick={() => window.open('/lab/discovery', '_blank')}
              className="flex items-center gap-2 px-4 h-12 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 hover:bg-slate-800/40 transition-all font-bold text-xs uppercase tracking-widest shadow-lg group"
            >
              <svg className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              <span className="text-white/80 group-hover:text-white transition-colors">Sổ tay khám phá</span>
              <span className="ml-1 px-1.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-md text-[10px] font-black">{discoveredFormulas.length}</span>
            </button>
            <button 
              onClick={toggleFullscreen}
              className="w-12 h-12 bg-slate-900/40 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 hover:border-white/20 hover:bg-slate-800/40 transition-all text-blue-400 shadow-lg group"
              title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
            >
              {isFullscreen ? (
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v5H3M21 8h-5V3M3 16h5v5M16 21v-5h5"/></svg>
              ) : (
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
              )}
            </button>
            <button 
              onClick={() => setShowLabSettings(true)}
              className="w-12 h-12 bg-slate-900/40 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 hover:border-white/20 hover:bg-slate-800/40 transition-all text-white/60 hover:text-white shadow-lg group"
              title="Tùy chỉnh Lab"
            >
               <svg className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>

        {/* Middle & Bottom Layout */}
        <div className="flex-1 flex justify-between items-stretch pointer-events-none mt-0 relative min-h-0">
          {/* Floating Reaction Message */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none z-[50]">
            <AnimatePresence>
              {isMessageVisible && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-blue-600/20 backdrop-blur-xl border border-blue-500/30 px-6 py-3 rounded-2xl text-blue-200 text-sm font-medium shadow-2xl"
                >
                  {activeBeaker.reactionMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Left Sidebar - Chemicals & Tools */}
          <motion.div 
            initial={false}
            animate={{ x: isSidebarOpen ? 0 : -280, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 120 }}
            className="relative w-[280px] mt-2 mb-2 bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-[28px] p-4 pb-3 pointer-events-auto flex flex-col shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] min-h-0 z-20"
          >
            {/* Toggle Button */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="absolute -right-8 top-1/2 -translate-y-1/2 w-8 h-20 bg-slate-900/60 backdrop-blur-xl border border-white/10 border-l-0 hover:border-white/20 rounded-r-2xl flex items-center justify-center shadow-[4px_0_10px_-2px_rgba(0,0,0,0.5)] transition-all pointer-events-auto hover:bg-slate-800/80 group"
            >
              <div className="text-white/60 group-hover:text-blue-400 transition-colors">
                {isSidebarOpen ? <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg> : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>}
              </div>
            </button>

            {/* Tools Area */}
            <div className="flex justify-between items-center mb-4 bg-white/5 p-1.5 rounded-2xl border border-white/5 gap-1.5">
              <button 
                onClick={cycleContainerType}
                className="flex-1 h-12 rounded-xl flex items-center justify-center hover:bg-indigo-500/10 text-white/50 hover:text-indigo-400 border border-transparent hover:border-indigo-500/20 transition-all hover:scale-105 active:scale-95"
                title="Đổi dụng cụ"
              >
                {activeBeaker.containerType === 'flask' && <FlaskConical className="w-5 h-5" />}
                {activeBeaker.containerType === 'dish' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="16" rx="10" ry="3"/><path d="M2 16v-2a10 3 0 0 1 20 0v2"/></svg>}
                {(!activeBeaker.containerType || activeBeaker.containerType === 'beaker') && <Beaker className="w-5 h-5" />}
              </button>
              <button 
                onClick={handleToggleHeat}
                className={`flex-1 h-12 rounded-xl flex items-center justify-center transition-all ${
                  activeBeaker.isHeating 
                    ? 'bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] border border-orange-400/30' 
                    : 'hover:bg-white/5 text-white/50 hover:text-white border border-transparent'
                }`}
                title="Đun nóng"
              >
                <svg className={`w-5 h-5 ${activeBeaker.isHeating ? 'animate-bounce' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.5 4 6.5 2 2 3 5.5 3 8.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
              </button>
              <button 
                onClick={handleClearBeaker}
                className="flex-1 h-12 rounded-xl flex items-center justify-center hover:bg-cyan-500/10 text-white/50 hover:text-cyan-400 border border-transparent hover:border-cyan-500/20 transition-all hover:scale-105 active:scale-95"
                title="Làm mới cốc"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
              <button 
                onClick={addBeaker}
                className="flex-1 h-12 rounded-xl flex items-center justify-center hover:bg-emerald-500/10 text-white/50 hover:text-emerald-400 border border-transparent hover:border-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                title="Thêm cốc mới"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-3 group">
               <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/30 group-focus-within:text-blue-400 transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
               </div>
               <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm hóa chất..."
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-white/30"
               />
            </div>

            {/* Chemicals Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 min-h-0">
              <div className="grid grid-cols-3 gap-1.5 pb-20">
                {availableChemicals.map((chem) => (
                  <motion.button
                    key={chem.formula + chem.name}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDropToBeaker(chem.formula)}
                    disabled={isPouringFormula !== null}
                    className={`group relative p-2 rounded-xl border transition-all duration-300 ${
                      isPouringFormula === chem.formula 
                        ? 'bg-blue-600/30 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white' 
                        : 'bg-slate-950/40 border-white/5 hover:bg-slate-900/40'
                    }`}
                    style={{
                      borderColor: isPouringFormula === chem.formula ? undefined : 'rgba(255,255,255,0.05)',
                    }}
                    onMouseEnter={(e) => {
                      if (isPouringFormula !== chem.formula) {
                        e.currentTarget.style.borderColor = chem.color + '60';
                        e.currentTarget.style.boxShadow = `0 0 15px ${chem.color}30`;
                      }
                      setHoveredChem(chem);
                    }}
                    onMouseLeave={(e) => {
                      if (isPouringFormula !== chem.formula) {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                      setHoveredChem(null);
                    }}
                    onMouseMove={(e) => {
                      setMousePos({ x: e.clientX, y: e.clientY });
                    }}
                  >
                    <div 
                      className="aspect-square flex items-center justify-center rounded-lg mb-1.5 overflow-hidden relative border border-white/5"
                      style={{
                        background: `radial-gradient(circle, ${chem.color}18 0%, rgba(2, 6, 23, 0.6) 85%)`
                      }}
                    >
                      {isElement(chem.formula) ? (
                        <ElementSphere symbol={getElementSymbol(chem.formula)} size="md" />
                      ) : (
                        <MoleculeModel formula={chem.formula} size="md" />
                      )}
                    </div>
                    <div className="flex flex-col items-center leading-none">
                      <span className="text-[10px] font-black tracking-tight text-white/90 group-hover:text-white transition-colors">{chem.formula}</span>
                      <span className="text-[7px] text-white/40 font-bold uppercase truncate w-full text-center mt-0.5 transition-colors group-hover:text-white/60">{chem.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Beakers Selector */}
          <div className="w-24 bg-slate-900/30 backdrop-blur-xl border border-white/10 p-3 rounded-[28px] flex flex-col gap-3 my-auto pointer-events-auto self-center max-h-[90%] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
            {beakers.map((b, idx) => (
              <div key={b.id} className="relative group">
                <button
                  onClick={() => setActiveBeaker(idx)}
                  className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center transition-all border duration-300 relative overflow-hidden ${
                    activeBeakerIndex === idx 
                      ? 'bg-gradient-to-b from-blue-500/20 to-blue-500/5 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.25)] ring-1 ring-blue-400/30' 
                      : 'bg-slate-950/40 border-white/5 hover:border-white/20 hover:bg-slate-900/40'
                  }`}
                >
                  {/* Active Indicator Pulse dot */}
                  {activeBeakerIndex === idx && (
                    <span className="absolute top-1 right-1 flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                    </span>
                  )}
                  
                  {/* Heating Indicator badge */}
                  {b.isHeating && (
                    <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_#f97316] z-10" title="Đang đun nóng" />
                  )}

                  <div className="w-8 h-10 relative overflow-hidden mb-1 flex items-end justify-center">
                    {/* Outer beaker glass line */}
                    <div className="absolute inset-0 border border-white/30 rounded-b-lg rounded-t-sm" />
                    {/* Lip of beaker */}
                    <div className="absolute top-0 left-0 w-full h-0.5 border-b border-white/30" />
                    {/* Graduations/Measurement lines */}
                    <div className="absolute top-2 left-0.5 w-1.5 h-0.5 bg-white/20" />
                    <div className="absolute top-4 left-0.5 w-2 h-0.5 bg-white/20" />
                    <div className="absolute top-6 left-0.5 w-1.5 h-0.5 bg-white/20" />
                    
                    {/* Liquid content */}
                    {b.contents.length > 0 && (
                      <div 
                        className="absolute bottom-0 w-full transition-all duration-500 rounded-b-[7px] overflow-hidden" 
                        style={{ 
                          height: `${Math.min(b.contents.length * 25, 90)}%`,
                          backgroundColor: b.contents[b.contents.length - 1].color 
                        }} 
                      >
                        {/* Wave effect in beaker */}
                        <div className="absolute -top-[48px] -left-1/2 w-[200%] aspect-square bg-white/25 rounded-[38%] animate-wave opacity-50" />
                        <div className="absolute -top-[52px] -left-1/2 w-[200%] aspect-square bg-white/15 rounded-[35%] animate-wave-slow opacity-75" />
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] font-black tracking-wider transition-colors ${activeBeakerIndex === idx ? 'text-blue-400' : 'text-white/40'}`}>#{idx + 1}</span>
                </button>
                {beakers.length > 1 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeBeaker(idx); }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform hover:scale-110 shadow-md"
                    title="Xóa cốc"
                  >
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showLabSettings && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLabSettings(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="relative bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 w-full max-w-md shadow-2xl"
             >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black uppercase italic">Tùy chỉnh Lab</h2>
                  <button onClick={() => setShowLabSettings(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                </div>

                <div className="space-y-6">
                  {/* Background settings removed as per request */}

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      {soundEnabled ? <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> : <svg className="w-5 h-5 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>}
                      <span className="text-sm font-bold">Hiệu ứng âm thanh</span>
                    </div>
                    <button 
                      onClick={toggleLabSound}
                      className={`w-12 h-6 rounded-full transition-all relative ${soundEnabled ? 'bg-blue-600' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${soundEnabled ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.7); }
        
        @keyframes wave-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-wave {
          animation: wave-rotate 6s linear infinite;
        }
        .animate-wave-slow {
          animation: wave-rotate 9s linear infinite;
        }
        
        @keyframes crystal-shine {
          0% { transform: translateX(-150%) skewX(-30deg); }
          50% { transform: translateX(-150%) skewX(-30deg); }
          100% { transform: translateX(150%) skewX(-30deg); }
        }
        .animate-crystal-shine {
          animation: crystal-shine 4s ease-in-out infinite;
        }
      `}</style>
      <ChemicalTooltip 
        chemicalInfo={hoveredChem} 
        x={mousePos.x} 
        y={mousePos.y} 
        visible={!!hoveredChem} 
      />
    </div>
  );
};

export default MagicLab3D;

