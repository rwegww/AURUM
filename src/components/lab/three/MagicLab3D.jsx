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
  Flame,
  RotateCcw,
  Settings,
  Plus,
  Scissors,
  Trash2,
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
    <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url(\'https://www.transparenttextures.com/patterns/stardust.png\')] scale-150 animate-float-slow" />
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
  const [activeTab, setActiveTab] = useState('liquid');
  const [showLabSettings, setShowLabSettings] = useState(false);
  const [isMessageVisible, setIsMessageVisible] = useState(false);

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
      .filter(c => discoveredFormulas.includes(c.formula))
      .filter(c => {
        if (activeTab === 'all') return true;
        if (activeTab === 'liquid') return c.state === 'liquid' && !c.type;
        if (activeTab === 'solid') return c.state === 'solid' && !c.type;
        if (activeTab === 'metal') return c.type?.includes('metal') && c.type !== 'nonmetal';
        if (activeTab === 'nonmetal') return c.type?.includes('nonmetal');
        return true;
      });
  }, [activeTab, discoveredFormulas]);

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
      </AnimatePresence>

      {/* Main UI Layout */}
      <div className="absolute inset-0 flex flex-col pointer-events-none p-6">
        {/* Top Header */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/lectures')}
              className="w-12 h-12 bg-black/30 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="bg-black/30 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/10 flex flex-col justify-center">
              <h1 className="text-sm font-black italic uppercase tracking-tighter text-blue-400">Magic Lab 3D</h1>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest">
                   {activeBeaker.id ? `Cốc: #${activeBeaker.id.toString().slice(-4)}` : 'Sẵn sàng'}
                 </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setShowDiscoveryJournal(true)}
              className="flex items-center gap-2 px-4 h-12 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest"
            >
              <BookOpen size={18} className="text-purple-400" />
              <span>Sổ tay khám phá ({discoveredFormulas.length})</span>
            </button>
            <button 
              onClick={() => setShowLabSettings(true)}
              className="w-12 h-12 bg-black/30 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Middle Content - Interaction Area */}
        <div className="flex-1 relative flex items-center justify-center pointer-events-none">
           {/* Floating Message */}
           <AnimatePresence>
             {isMessageVisible && (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 className="absolute top-1/4 bg-blue-600/20 backdrop-blur-xl border border-blue-500/30 px-6 py-3 rounded-2xl text-blue-200 text-sm font-medium shadow-2xl"
               >
                 {activeBeaker.reactionMessage}
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Bottom Panel */}
        <div className="flex gap-6 items-end pointer-events-auto h-[280px]">
          {/* Left Column - Tools */}
          <div className="flex flex-col gap-3">
            <div className="bg-black/30 backdrop-blur-md p-2 rounded-3xl border border-white/10 flex flex-col gap-2">
              <button 
                onClick={handleToggleHeat}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${activeBeaker.isHeating ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'hover:bg-white/5 text-white/50'}`}
                title="Đun nóng"
              >
                <Flame size={24} />
              </button>
              <button 
                onClick={handleClearBeaker}
                className="w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all"
                title="Dọn dép"
              >
                <RotateCcw size={24} />
              </button>
              <button 
                onClick={() => {}} 
                className="w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-blue-500/20 text-white/50 hover:text-blue-400 transition-all opacity-30 cursor-not-allowed"
                title="Cắt lát (Coming Soon)"
              >
                <Scissors size={24} />
              </button>
            </div>

            <div className="bg-black/30 backdrop-blur-md p-2 rounded-3xl border border-white/10 flex flex-col gap-2">
               <button 
                 onClick={addBeaker}
                 className="w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-green-500/20 text-white/50 hover:text-green-400 transition-all"
                 title="Thêm cốc"
               >
                 <Plus size={24} />
               </button>
            </div>
          </div>

          {/* Center Column - Chemicals Inventory */}
          <div className="flex-1 bg-black/30 backdrop-blur-md rounded-[40px] border border-white/10 p-6 flex flex-col shadow-2xl relative overflow-hidden group/inventory">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover/inventory:opacity-100 transition-opacity" />
            
            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              {[
                { id: 'liquid', label: 'Dung dịch' },
                { id: 'solid', label: 'Chất rắn' },
                { id: 'metal', label: 'Kim loại' },
                { id: 'all', label: 'Tất cả' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-[10px] uppercase font-black tracking-widest px-4 py-2 rounded-full transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white/70'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Chemicals Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <div className="grid grid-cols-6 gap-3">
                {availableChemicals.map((chem) => (
                  <motion.button
                    key={chem.formula}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDropToBeaker(chem.formula)}
                    disabled={isPouringFormula !== null}
                    className={`group relative p-3 rounded-2xl border transition-all ${isPouringFormula === chem.formula ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                  >
                    {/* Status Badge */}
                    {isPouringFormula === chem.formula && (
                       <div className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center animate-bounce">
                         <div className="w-2 h-2 bg-blue-600 rounded-full" />
                       </div>
                    )}
                    
                    {/* Icon/Symbol */}
                    <div className="aspect-square flex items-center justify-center rounded-xl bg-black/40 mb-2 overflow-hidden relative">
                      <div 
                        className="absolute inset-0 opacity-20 blur-lg" 
                        style={{ backgroundColor: chem.color }} 
                      />
                      {chem.state === 'solid' ? (
                         <div className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: chem.color, clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }} />
                      ) : (
                         <div className="w-5 h-7 border-2 border-white/20 rounded-b-lg relative overflow-hidden">
                           <div className="absolute bottom-0 w-full h-1/2 opacity-60" style={{ backgroundColor: chem.color }} />
                         </div>
                      )}
                    </div>

                    {/* Label */}
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-black tracking-tight">{chem.formula}</span>
                      <span className="text-[8px] text-white/40 font-bold uppercase truncate w-full text-center">{chem.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Beakers Selector */}
          <div className="w-24 bg-black/30 backdrop-blur-md rounded-3xl border border-white/10 p-2 flex flex-col gap-2 overflow-y-auto max-h-full custom-scrollbar">
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
                    <Trash2 size={12} />
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
                  <button onClick={() => setShowLabSettings(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors"><X/></button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Phông nền</label>
                    <div className="grid grid-cols-2 gap-3">
                       <button 
                         onClick={() => updateLabSettings({ bgType: 'galaxy' })}
                         className={`p-4 rounded-2xl border text-xs font-bold transition-all ${settings.bgType === 'galaxy' ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-white/5'}`}
                       >Vũ trụ</button>
                       <button 
                         onClick={() => updateLabSettings({ bgType: 'color', bgColor: '#0a0a0f' })}
                         className={`p-4 rounded-2xl border text-xs font-bold transition-all ${settings.bgType === 'color' ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-white/5'}`}
                       >Mặc định</button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      {soundEnabled ? <Volume2 size={20} className="text-blue-400" /> : <VolumeX size={20} className="text-white/30" />}
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
                    <X size={24} />
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <DiscoveryMap activeView="map" embedded={true} unlockedChemicals={discoveredFormulas} />
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Assistant UI */}
      <AiAssistant 
        currentItems={activeBeaker.contents} 
        reactions={dbReactions} 
        chemicals={dbChemicals}
      />

      <Canvas
        shadows
        camera={{ position: [0, 6, 12], fov: 35 }}
        className="w-full h-full"
        style={{ pointerEvents: 'auto' }}
      >
        <color attach="background" args={['#000000']} />
        <LabScene beakers={beakers} currentBeakerIndex={activeBeakerIndex} />
      </Canvas>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        @keyframes nebula-drift {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.1) translate(20px, 10px); }
        }
        .animate-nebula-drift { animation: nebula-drift 30s ease-in-out infinite; }
        @keyframes cosmic-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        .animate-cosmic-pulse { animation: cosmic-pulse 15s ease-in-out infinite; }
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        .animate-star-twinkle { animation: star-twinkle 4s ease-in-out infinite; }
        .shadow-3xl { box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.7); }
      `}</style>
    </div>
  );
};

export default MagicLab3D;
