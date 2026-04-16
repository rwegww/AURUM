import React, { Suspense, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import LabScene from './magic-lab/LabScene';
import useLabStore from './magic-lab/store';

import SoundManager from './magic-lab/SoundManager';
import { useSoundEffects, useSoundStore } from './magic-lab/useSoundEffects';
import DiscoveryMap from '../DiscoveryMap'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const normalize = (f) => {
  if (!f) return "";
  const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  return f.toString().replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => subMap[m]).trim().toUpperCase();
};

const MagicLab3D = () => {
  const { user, isLoggedIn, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  // --- Game Data Local State ---
  const [dbChemicals, setDbChemicals] = useState([]);
  const [dbReactions, setDbReactions] = useState([]);
  const [discoveredFormulas, setDiscoveredFormulas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- Discovery State ---
  const [newDiscovery, setNewDiscovery] = useState(null);
  const [showDiscoveryJournal, setShowDiscoveryJournal] = useState(false);

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
  const settings = useLabStore(state => state.settings);
  const updateLabSettings = useLabStore(state => state.updateSettings);

  const activeBeaker = beakers[activeBeakerIndex] || beakers[0];
  const [showLabSettings, setShowLabSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- Fullscreen Logic ---
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
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
        setDbReactions(rxsData);
        
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
  }, []);

  // Sync auth user progress
  useEffect(() => {
    if (isLoggedIn && user && user.unlockedChemicals && dbChemicals.length > 0) {
      const starters = dbChemicals.filter(c => c.is_starter || c.isStarter).map(c => c.formula);
      const combined = Array.from(new Set([...starters, ...user.unlockedChemicals]));
      setDiscoveredFormulas(combined);
      setUnlocked(combined);
    }
  }, [user, isLoggedIn, dbChemicals]);

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
      className="relative w-full min-h-[600px] h-full overflow-hidden font-sans text-white select-none transition-colors duration-1000 rounded-3xl shadow-2xl border border-white/10 bg-[#0a0a0f]"
    >
      <Canvas
        shadows={{ type: 1 }}
        camera={{ position: [0, 6, 12], fov: 35 }}
        className="w-full h-full"
        style={{ pointerEvents: 'auto', position: 'absolute', top: 0, left: 0 }}
      >
        <color attach="background" args={['#0a0a0f']} />
        <LabScene beakers={beakers} currentBeakerIndex={activeBeakerIndex} />
      </Canvas>

      <SoundManager />

      {/* --- Discovery UI Overlays --- */}
      <AnimatePresence>
        {newDiscovery && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl rounded-3xl">
             <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[#1a1c23] border border-white/10 rounded-[40px] p-10 text-center max-w-sm shadow-[0_0_50px_rgba(59,130,246,0.3)]">
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
              onClick={() => setShowDiscoveryJournal(true)}
              className="flex items-center gap-2 px-4 h-12 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest"
            >
              <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              <span>Sổ tay khám phá ({discoveredFormulas.length})</span>
            </button>
            <button 
              onClick={toggleFullscreen}
              className="w-12 h-12 bg-black/30 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all text-blue-400"
              title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
            >
              {isFullscreen ? <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v5H3M21 8h-5V3M3 16h5v5M16 21v-5h5"/></svg> : <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>}
            </button>
            <button 
              onClick={() => setShowLabSettings(true)}
              className="w-12 h-12 bg-black/30 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all"
            >
               <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
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
            animate={{ x: isSidebarOpen ? 0 : -340, opacity: isSidebarOpen ? 1 : 0.4 }}
            className="relative w-[280px] mt-1 mb-0 bg-black/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 pb-2 pointer-events-auto flex flex-col shadow-2xl min-h-0"
          >
            {/* Toggle Button */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-20 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg border border-white/20 transition-all"
            >
              {isSidebarOpen ? <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg> : <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>}
            </button>

            {/* Tools Area */}
            <div className="flex justify-between items-center mb-4 bg-white/5 p-1.5 rounded-2xl border border-white/5">
              <button 
                onClick={handleToggleHeat}
                className={`flex-1 h-12 rounded-xl flex items-center justify-center transition-all ${activeBeaker.isHeating ? 'bg-orange-500 text-white shadow-lg' : 'hover:bg-white/5 text-white/50'}`}
                title="Đun nóng"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.5 4 6.5 2 2 3 5.5 3 8.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
              </button>
              <button 
                onClick={handleClearBeaker}
                className="flex-1 h-12 rounded-xl flex items-center justify-center hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all"
                title="Làm mới cốc"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
              <button 
                onClick={addBeaker}
                className="flex-1 h-12 rounded-xl flex items-center justify-center hover:bg-green-500/20 text-white/50 hover:text-green-400 transition-all"
                title="Thêm cốc mới"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-3 group">
               <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/30 group-focus-within:text-blue-400">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
               </div>
               <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm hóa chất..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:border-blue-500/50 transition-all"
               />
            </div>

            {/* Chemicals Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 min-h-0" style={{ minHeight: 0 }}>
              <div className="grid grid-cols-3 gap-1.5 pb-20">
                {availableChemicals.map((chem) => (
                  <motion.button
                    key={chem.formula + chem.name}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDropToBeaker(chem.formula)}
                    disabled={isPouringFormula !== null}
                    className={`group relative p-2 rounded-xl border transition-all ${isPouringFormula === chem.formula ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                  >
                    <div className="aspect-square flex items-center justify-center rounded-lg bg-black/40 mb-1 overflow-hidden relative">
                      <div className="absolute inset-0 opacity-20 blur-lg" style={{ backgroundColor: chem.color }} />
                      {chem.state === 'solid' ? (
                         <div className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: chem.color, clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }} />
                      ) : (
                         <div className="w-4 h-6 border-2 border-white/20 rounded-b-md relative overflow-hidden">
                           <div className="absolute bottom-0 w-full h-1/2 opacity-60" style={{ backgroundColor: chem.color }} />
                         </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center leading-none">
                      <span className="text-[10px] font-black tracking-tight">{chem.formula}</span>
                      <span className="text-[7px] text-white/40 font-bold uppercase truncate w-full text-center mt-0.5">{chem.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Beakers Selector */}
          <div className="w-24 bg-black/30 backdrop-blur-md rounded-3xl border border-white/10 p-2 flex flex-col gap-2 overflow-y-auto my-2 custom-scrollbar pointer-events-auto self-center max-h-full">
            {beakers.map((b, idx) => (
              <div key={b.id} className="relative group">
                <button
                  onClick={() => setActiveBeaker(idx)}
                  className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center transition-all border ${activeBeakerIndex === idx ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                >
                  <div className="w-8 h-10 border-2 border-white/30 rounded-b-lg relative overflow-hidden mb-1">
                    {b.contents.length > 0 && (
                      <div 
                        className="absolute bottom-0 w-full transition-all duration-500" 
                        style={{ 
                          height: `${Math.min(b.contents.length * 20, 100)}%`,
                          backgroundColor: b.contents[b.contents.length - 1].color 
                        }} 
                      />
                    )}
                  </div>
                  <span className="text-[10px] font-black opacity-50">#{idx + 1}</span>
                </button>
                {beakers.length > 1 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeBeaker(idx); }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110 active:scale-95"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
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
               className="relative bg-[#0d0e12] border border-white/10 rounded-[32px] p-8 w-full max-w-md shadow-2xl"
             >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black uppercase italic italic">Tùy chỉnh Lab</h2>
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

      {/* Discovery Map Overlay */}
      <AnimatePresence>
        {showDiscoveryJournal && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-8">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDiscoveryJournal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
             <motion.div 
                initial={{ y: 50, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="relative w-full max-w-6xl h-full bg-[#0d0e12]/80 border border-white/10 rounded-[40px] overflow-hidden flex flex-col shadow-3xl"
             >
                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-black/20">
                  <div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Synthesis Nexus</h2>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Bản đồ tiến trình khám phá hóa học</p>
                  </div>
                  <button onClick={() => setShowDiscoveryJournal(false)} className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <DiscoveryMap chemicals={dbChemicals} reactions={dbReactions} discoveredFormulas={discoveredFormulas} />
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>



      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.7); }
      `}</style>
    </div>
  );
};

export default MagicLab3D;
