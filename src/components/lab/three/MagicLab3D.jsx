import React, { Suspense, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import LabScene from './magic-lab/LabScene';
import useLabStore from './magic-lab/store';
import AiAssistant from './magic-lab/AiAssistant';
import SoundManager from './magic-lab/SoundManager';
import { useSoundEffects, useSoundStore } from './magic-lab/useSoundEffects';
import DiscoveryMap from '../DiscoveryMap'; 
import {
  ArrowLeft,
  Menu,
  Flame,
  RotateCcw,
  Settings,
  FlaskConical,
  Info,
  Plus,
  Scissors,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Volume2,
  VolumeX,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const normalize = (f) => {
  if (!f) return "";
  const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  return f.toString().replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => subMap[m]).trim().toUpperCase();
};

const GalaxyBackground = () => (
  <div className="absolute inset-0 overflow-hidden z-[-1] pointer-events-none select-none">
    <div className="absolute inset-0 bg-[#04040a]" />
    <div className="absolute inset-0 opacity-60 mix-blend-screen overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle,#4e1a8a_0%,transparent_70%)] animate-nebula-drift blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-[radial-gradient(circle,#0a4b8a_0%,transparent_70%)] animate-cosmic-pulse blur-[100px]" />
      <div className="absolute top-[30%] left-[40%] w-[50%] h-[50%] bg-[radial-gradient(circle,#8a1a4e_0%,transparent_60%)] animate-pulse-soft blur-[140px] opacity-40" />
    </div>
    <div className="absolute inset-0 opacity-80 animate-nebula-drift" style={{ backgroundImage: 'radial-gradient(2px 2px at 10px 10px, #eee, rgba(0,0,0,0)), radial-gradient(2px 2px at 150px 150px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 300px 300px, #fff, rgba(0,0,0,0))', backgroundSize: '250px 250px' }} />
    <div className="absolute inset-0 opacity-60 animate-star-twinkle" style={{ backgroundImage: 'radial-gradient(1.5px 1.5px at 50px 50px, #fff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 200px 100px, #fff, rgba(0,0,0,0))', backgroundSize: '300px 300px' }} />
    <div className="absolute inset-0 opacity-40 animate-cosmic-pulse" style={{ backgroundImage: 'radial-gradient(1px 1px at 80px 120px, #ffcc00, rgba(0,0,0,0)), radial-gradient(1px 1px at 250px 200px, #ffcc00, rgba(0,0,0,0))', backgroundSize: '400px 400px' }} />
    <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] scale-150 animate-float-slow" />
  </div>
);

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
  const allowedFormulas = useLabStore(state => state.allowedFormulas);
  const isPouringFormula = useLabStore(state => state.isPouringFormula);
  const dropToBeaker = useLabStore(state => state.dropToBeaker);
  const clearBeaker = useLabStore(state => state.clearBeaker);
  const toggleHeat = useLabStore(state => state.toggleHeat);
  const addBeaker = useLabStore(state => state.addBeaker);
  const removeBeaker = useLabStore(state => state.removeBeaker);
  const setActiveBeaker = useLabStore(state => state.setActiveBeaker);
  const settings = useLabStore(state => state.settings);
  const updateSettings = useLabStore(state => state.updateSettings);

  const activeBeaker = beakers[activeBeakerIndex] || beakers[0];
  const [showSettings, setShowSettings] = useState(false);
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  // Sound Effects
  const { playSound } = useSoundEffects();
  const { enabled: soundEnabled, toggleSound } = useSoundStore();

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
        
        setDbChemicals(chemsData);
        setDbReactions(rxsData);
        
        // Initial progression
        const starters = chemsData.filter(c => c.is_starter || c.isStarter).map(c => c.formula);
        const saved = localStorage.getItem('chem_odyssey_discovered');
        let initialDiscovered = starters;
        
        if (saved) {
          try {
            initialDiscovered = Array.from(new Set([...starters, ...JSON.parse(saved)]));
          } catch (e) { console.error("Stored data corrupted"); }
        }
        
        setDiscoveredFormulas(initialDiscovered);
        setData(chemsData, rxsData, initialDiscovered);
        
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
    return Object.values(chemicalsMap)
      .filter(c => discoveredFormulas.includes(c.formula));
  }, [discoveredFormulas]);

  if (isLoading) return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0f] text-white rounded-3xl min-h-[600px]">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-6" />
      <h2 className="text-xl font-bold uppercase tracking-widest animate-pulse">Đang nạp dữ liệu Lab...</h2>
    </div>
  );

  return (
    <div 
      className="relative w-full min-h-[600px] h-full overflow-hidden font-sans text-white select-none transition-colors duration-1000 rounded-3xl shadow-2xl border border-white/10"
      style={{ backgroundColor: settings.bgType === 'color' ? settings.bgColor : 'transparent' }}
    >
      {settings.bgType === 'galaxy' && <GalaxyBackground />}
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

        {showDiscoveryJournal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
             <div className="relative w-full h-full flex flex-col">
                <button 
                  onClick={() => setShowDiscoveryJournal(false)} 
                  className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/5 hover:bg-red-500 rounded-full flex items-center justify-center transition-all border border-white/10"
                >
                  <X size={24} />
                </button>
                <div className="flex-1">
                  <DiscoveryMap 
                    chemicals={dbChemicals} 
                    reactions={dbReactions} 
                    discoveredFormulas={discoveredFormulas} 
                  />
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 2, 5], fov: 45 }}>
           <Suspense fallback={null}>
             <LabScene />
           </Suspense>
        </Canvas>
        <Loader /> 
      </div>

      {/* --- UI OVERLAY --- */}
      
      {/* 2. Feedback Log (Top Center) */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-lg px-4 pointer-events-none">
        <div className={`
          bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 shadow-2xl text-center transition-all duration-500
          ${isMessageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
        `}>
           <p className="text-blue-300 font-mono text-sm leading-tight">
             {activeBeaker.reactionMessage}
           </p>
        </div>
      </div>

      <AiAssistant chemicals={dbChemicals} reactions={dbReactions} />

      {/* 3. Beaker Selector (Top Right) */}
      <div className="absolute top-6 right-6 z-20 hidden md:flex flex-col items-end gap-2">
         <div className="flex gap-2 bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/10">
            {beakers.map((b, i) => (
               <button
                  key={b.id}
                  onClick={() => setActiveBeaker(i)}
                  className={`
                     w-12 h-12 rounded-xl border flex items-center justify-center transition-all relative
                     ${i === activeBeakerIndex 
                        ? 'bg-blue-600/30 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                     }
                  `}
               >
                  <FlaskConical size={20} className={i === activeBeakerIndex ? 'text-blue-400' : 'text-white/40'} />
                  {b.contents.length > 0 && (
                     <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-[10px] font-bold rounded-full flex items-center justify-center">
                        {b.contents.length}
                     </span>
                  )}
               </button>
            ))}
            {beakers.length < 4 && (
               <button
                  onClick={addBeaker}
                  className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-all"
               >
                  <Plus size={20} />
               </button>
            )}
         </div>
         <div className="flex gap-2">
            {beakers.length > 1 && (
               <button onClick={() => removeBeaker(activeBeakerIndex)} className="text-[10px] text-white/30 hover:text-red-400 px-2 flex items-center gap-1 transition-colors">
                  <Trash2 size={12} /> Dọn dẹp cốc
               </button>
            )}
         </div>
      </div>

      {/* 4. Chemical Shelf (Left Side) */}
      <div className="absolute left-6 top-24 bottom-24 z-20 w-80 pointer-events-none">
         <div className="h-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-4 pointer-events-auto flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-4 px-2">
               <h3 className="font-bold text-lg flex items-center gap-2">
                  <FlaskConical size={20} className="text-blue-400" />
                  <span>Kệ Hóa Chất</span>
               </h3>
               <button 
                  onClick={() => setShowDiscoveryJournal(true)}
                  className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-md"
                  title="Sổ tay khám phá"
               >
                  <BookOpen size={16} />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
               <div className="grid grid-cols-2 gap-4 pb-4">
                  {availableChemicals.map((chem) => {
                  const isBeingPoured = isPouringFormula === chem.formula;
                  
                  return (
                    <button 
                       key={chem.formula}
                       disabled={!!isPouringFormula}
                       onClick={() => handleDropToBeaker(chem.formula)}
                       className={`
                          group relative flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 transform
                          bg-white/5 border-white/10 hover:bg-white/15 hover:border-blue-500/50 hover:-translate-y-1 active:scale-95 cursor-pointer
                          ${isBeingPoured ? 'ring-2 ring-blue-500 bg-blue-500/20' : ''}
                       `}
                    >
                       <div className="relative w-16 h-16 mb-2 flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: chem.color || '#ffffff' }} />
                          <div 
                             className="w-10 h-10 rounded-full shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.5),4px_4px_8px_rgba(255,255,255,0.2)] transition-transform group-hover:scale-110"
                             style={{ background: `radial-gradient(circle at 30% 30%, ${chem.color || '#ffffff'}, #000)`, border: '1px solid rgba(255,255,255,0.1)' }}
                          />
                       </div>
                       <div className="text-center">
                          <span className="block text-sm font-bold font-mono text-white/90 group-hover:text-white">{chem.formula}</span>
                          <span className="block text-[8px] text-white/30 truncate w-24 group-hover:text-white/60">{chem.name}</span>
                       </div>
                    </button>
                  );
               })}
               </div>
            </div>
         </div>
      </div>

      {/* 6. Bottom Navigation Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
         <div className="flex items-center bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full px-12 py-3 space-x-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <button
               onClick={handleToggleHeat}
               className={`
                  relative p-5 rounded-full transition-all duration-500 transform active:scale-90
                  ${activeBeaker.isHeating 
                     ? 'bg-orange-600 text-white shadow-[0_0_30px_rgba(234,88,12,0.6)] scale-110' 
                     : 'bg-white/10 text-white/40 hover:bg-white/20 hover:text-white/80'
                  }
               `}
            >
               <Flame size={32} fill={activeBeaker.isHeating ? "currentColor" : "none"} />
            </button>

            <button
               onClick={handleClearBeaker}
               className="p-3 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-full transition-all border border-transparent hover:border-red-500/30"
            >
               <RotateCcw size={26} />
            </button>

            <button 
               onClick={() => setShowSettings(!showSettings)}
               className={`p-2 transition-colors ${showSettings ? 'text-blue-400' : 'text-white/40 hover:text-white'}`}
            >
               <Settings size={28} />
            </button>
         </div>
      </div>

      {/* 8. Settings Panel */}
      {showSettings && (
         <div className="absolute top-24 right-6 z-50 w-72 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-lg">Cài đặt</h3>
               <button onClick={() => setShowSettings(false)} className="text-white/40 hover:text-white">
                  <X size={20} />
               </button>
            </div>
            <div className="space-y-6">
               <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-sm font-medium">Chế độ Galaxy</span>
                  <button 
                     onClick={() => updateSettings({ bgType: settings.bgType === 'color' ? 'galaxy' : 'color' })}
                     className={`w-12 h-6 rounded-full transition-colors relative ${settings.bgType === 'galaxy' ? 'bg-blue-500' : 'bg-white/10'}`}
                  >
                     <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.bgType === 'galaxy' ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
               </div>
               <div className="border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 mb-4">
                     <div className="flex items-center gap-2">
                        {soundEnabled ? <Volume2 size={18} className="text-green-400" /> : <VolumeX size={18} className="text-white/40" />}
                        <span className="text-sm font-medium">Âm thanh</span>
                     </div>
                     <button onClick={toggleSound} className={`w-12 h-6 rounded-full transition-all relative ${soundEnabled ? 'bg-green-500' : 'bg-white/10'}`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}

      <div className="absolute bottom-8 right-8 z-20">
         <div className="group relative">
            <div className="p-3 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md border border-white/10 cursor-help">
               <Info size={20} className="text-white/40 group-hover:text-blue-400" />
            </div>
            <div className="absolute bottom-full right-0 mb-4 w-72 bg-black/90 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none transform translate-y-4 group-hover:translate-y-0 text-xs shadow-2xl">
               <p className="font-bold text-blue-400 mb-3 border-b border-blue-400/20 pb-2">HƯỚNG DẪN 3D LAB:</p>
               <ul className="space-y-2 text-white/70 leading-relaxed">
                  <li>• Nhấn icon cốc để chuyển đổi cốc.</li>
                  <li>• Thêm hóa chất để quan sát phản ứng.</li>
                  <li>• Khám phá các chất mới để mở khóa Nexus Hóa Học.</li>
               </ul>
            </div>
         </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        @keyframes scaleIn { from { transform: scale(0.8) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes nebula-drift { 0% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(-20px, 10px) rotate(5deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
        @keyframes cosmic-pulse { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.1); opacity: 0.6; } }
        @keyframes star-twinkle { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes pulse-soft { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .animate-nebula-drift { animation: nebula-drift 20s ease-in-out infinite; }
        .animate-cosmic-pulse { animation: cosmic-pulse 10s ease-in-out infinite; }
        .animate-star-twinkle { animation: star-twinkle 3s ease-in-out infinite; }
        .animate-pulse-soft { animation: pulse-soft 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default MagicLab3D;
