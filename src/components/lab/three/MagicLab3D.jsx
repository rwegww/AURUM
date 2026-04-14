import React, { Suspense, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import LabScene from './magic-lab/LabScene';
import useLabStore from './magic-lab/store';
import AiAssistant from './magic-lab/AiAssistant';
import { CHEMICALS } from './magic-lab/reactionDB';
import SoundManager from './magic-lab/SoundManager';
import { useSoundEffects, useSoundStore } from './magic-lab/useSoundEffects';
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
  VolumeX
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const GalaxyBackground = () => (
  <div className="absolute inset-0 overflow-hidden z-[-1] pointer-events-none select-none">
    {/* Base Space Layer */}
    <div className="absolute inset-0 bg-[#04040a]" />
    
    {/* Deep Space Gradients (Nebula) */}
    <div className="absolute inset-0 opacity-60 mix-blend-screen overflow-hidden">
      {/* Vibrant Purple Nebula */}
      <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle,#4e1a8a_0%,transparent_70%)] animate-nebula-drift blur-[120px]" />
      {/* Cyber Blue Nebula */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-[radial-gradient(circle,#0a4b8a_0%,transparent_70%)] animate-cosmic-pulse blur-[100px]" />
      {/* Magenta Spark */}
      <div className="absolute top-[30%] left-[40%] w-[50%] h-[50%] bg-[radial-gradient(circle,#8a1a4e_0%,transparent_60%)] animate-pulse-soft blur-[140px] opacity-40" />
    </div>

    {/* Primary Star Field (Denser) */}
    <div className="absolute inset-0 opacity-80 animate-nebula-drift" style={{ backgroundImage: 'radial-gradient(2px 2px at 10px 10px, #eee, rgba(0,0,0,0)), radial-gradient(2px 2px at 150px 150px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 300px 300px, #fff, rgba(0,0,0,0))', backgroundSize: '250px 250px' }} />
    
    {/* Secondary Twinkling Stars */}
    <div className="absolute inset-0 opacity-60 animate-star-twinkle" style={{ backgroundImage: 'radial-gradient(1.5px 1.5px at 50px 50px, #fff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 200px 100px, #fff, rgba(0,0,0,0))', backgroundSize: '300px 300px' }} />

    {/* Distant Golden Stars */}
    <div className="absolute inset-0 opacity-40 animate-cosmic-pulse" style={{ backgroundImage: 'radial-gradient(1px 1px at 80px 120px, #ffcc00, rgba(0,0,0,0)), radial-gradient(1px 1px at 250px 200px, #ffcc00, rgba(0,0,0,0))', backgroundSize: '400px 400px' }} />

    {/* Subtle Space Smoke/Dust */}
    <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] scale-150 animate-float-slow" />
  </div>
);

const MagicLab3D = () => {
  const { user } = useAuth();
  const liteMode = false; // Default to false in chem-odyssey
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('liquid');
  
  // Game State from Store
  const beakers = useLabStore(state => state.beakers);
  const activeBeakerIndex = useLabStore(state => state.activeBeakerIndex);
  const allowedFormulas = useLabStore(state => state.allowedFormulas);
  const isPouringFormula = useLabStore(state => state.isPouringFormula);
  
  const activeBeaker = beakers[activeBeakerIndex] || beakers[0];
  
  // Actions
  const dropToBeaker = useLabStore(state => state.dropToBeaker);
  const clearBeaker = useLabStore(state => state.clearBeaker);
  const toggleHeat = useLabStore(state => state.toggleHeat);
  const addBeaker = useLabStore(state => state.addBeaker);
  const removeBeaker = useLabStore(state => state.removeBeaker);
  const setActiveBeaker = useLabStore(state => state.setActiveBeaker);
  const splitProducts = useLabStore(state => state.splitProducts);
  const settings = useLabStore(state => state.settings);
  const updateSettings = useLabStore(state => state.updateSettings);
  
  const [showSettings, setShowSettings] = useState(false);
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  // Sound Effects
  const { playSound } = useSoundEffects();
  const { enabled: soundEnabled, toggleSound, volume, setVolume } = useSoundStore();

  // Wrapped handlers với âm thanh
  const handleClearBeaker = useCallback(() => {
    playSound('wash');
    clearBeaker();
  }, [clearBeaker, playSound]);

  const handleToggleHeat = useCallback(() => {
    playSound('click');
    toggleHeat();
  }, [toggleHeat, playSound]);

  const handleDropToBeaker = useCallback((chemKey) => {
    const chem = CHEMICALS[chemKey];
    playSound('pour', { chemicalState: chem?.state || chem?.type || 'liquid' });
    dropToBeaker(chemKey);
  }, [dropToBeaker, playSound]);

  const handleAddBeaker = useCallback(() => {
    playSound('click');
    addBeaker();
  }, [addBeaker, playSound]);

  const handleSetActiveBeaker = useCallback((index) => {
    playSound('click');
    setActiveBeaker(index);
  }, [setActiveBeaker, playSound]);

  const handleSplitProducts = useCallback((index) => {
    playSound('pour');
    splitProducts(index);
  }, [splitProducts, playSound]);

  useEffect(() => {
    // Chỉ hiện thông báo nếu có nội dung thực sự (không phải mặc định)
    const isDefaultMessage = activeBeaker.reactionMessage?.includes("Cốc thí nghiệm");
    if (activeBeaker.reactionMessage && !isDefaultMessage) {
      setIsMessageVisible(true);
      const timer = setTimeout(() => {
        setIsMessageVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setIsMessageVisible(false);
    }
  }, [activeBeaker.reactionMessage, activeBeakerIndex]);

  const availableChemicals = useMemo(() => {
    const internalKeywords = ['_Pink', 'NaCl', 'FeCl2', 'ZnCl2', 'FeSO4', 'KOH', 'CaSO4', 'BaSO4', 'AgCl', 'AgI', 'PbI2', 'CuOH2', 'MgCl2', 'AlCl3', 'CuCl2', 'CuNO32', 'NH4Cl', 'RbOH', 'CsOH'];
    
    return Object.entries(CHEMICALS)
      .filter(([key, c]) => !internalKeywords.some(kw => key.includes(kw) || c.formula.includes(kw)))
      .map(([key, c]) => ({ ...c, key }))
      .filter(c => {
        if (activeTab === 'all') return true;
        if (activeTab === 'liquid') return c.state === 'liquid' && !c.type;
        if (activeTab === 'solid') return c.state === 'solid' && !c.type;
        if (activeTab === 'metal') return c.type === 'metal';
        if (activeTab === 'nonmetal') return c.type === 'nonmetal';
        return true;
      });
  }, [activeTab]);

  return (
    <div 
      className="relative w-full min-h-[600px] h-full overflow-hidden font-sans text-white select-none transition-colors duration-1000 rounded-3xl shadow-2xl border border-white/10"
      style={{ backgroundColor: settings.bgType === 'color' ? settings.bgColor : 'transparent' }}
    >
      {settings.bgType === 'galaxy' && <GalaxyBackground />}

      {/* Sound Manager */}
      <SoundManager />

      {/* --- 3D Canvas Layer --- */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 2, 5], fov: 45 }}>
           <Suspense fallback={null}>
             <LabScene />
           </Suspense>
        </Canvas>
        <Loader /> 
      </div>

      {/* --- UI OVERLAY --- */}
      
      {/* 2. Màn hình phân tích / Log (Top Center) */}
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

      {/* 2.5 AI Assistant (Middle Right) */}
      <AiAssistant beakerContents={activeBeaker.contents} />

      {/* 3. Beaker Selector (Top Right) */}
      <div className="absolute top-6 right-6 z-20 hidden md:flex flex-col items-end gap-2">
         <div className="flex gap-2 bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/10">
            {beakers.map((b, i) => (
               <button
                  key={b.id}
                  onClick={() => handleSetActiveBeaker(i)}
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
                  onClick={handleAddBeaker}
                  className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-all"
                  title="Thêm cốc mới"
               >
                  <Plus size={20} />
               </button>
            )}
         </div>
         {beakers.length > 1 && (
            <button 
               onClick={() => removeBeaker(activeBeakerIndex)}
               className="text-[10px] text-white/40 hover:text-red-400 flex items-center gap-1 transition-colors px-2"
            >
               <Trash2 size={12} /> Dẹp cốc này
            </button>
         )}
      </div>

      {/* 4. Lưới hóa chất (Left Side) - Luôn hiển thị */}
      <div className="absolute left-6 top-24 bottom-24 z-20 w-80 pointer-events-none">
         <div className="h-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-4 pointer-events-auto flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-4 px-2">
               <h3 className="font-bold text-lg flex items-center gap-2">
                  <FlaskConical size={20} className="text-blue-400" />
                  <span>Kệ Hóa Chất</span>
               </h3>
               <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/60">
                  {availableChemicals.length}
               </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
               {/* Category Tabs */}
               <div className="flex bg-black/40 p-1 rounded-xl mb-4 overflow-x-auto no-scrollbar gap-1 border border-white/5">
                  {[
                    { id: 'liquid', label: 'Dung dịch' },
                    { id: 'solid', label: 'Chất rắn' },
                    { id: 'metal', label: 'Kim loại' },
                    { id: 'nonmetal', label: 'Phi kim' },
                    { id: 'all', label: 'Tất cả' }
                  ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                           px-3 py-2 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap flex-1
                           ${activeTab === tab.id 
                              ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                              : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                           }
                        `}
                    >
                        {tab.label}
                    </button>
                  ))}
               </div>

               <div className="grid grid-cols-2 gap-4">
                  {availableChemicals.map((chem) => {
                  const isAllowed = allowedFormulas.includes(chem.key);
                  const isBeingPoured = isPouringFormula === chem.key;
                  
                  return (
                    <button 
                       key={chem.key}
                       disabled={!isAllowed || !!isPouringFormula}
                       onClick={() => handleDropToBeaker(chem.key)}
                       className={`
                          group relative flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 transform
                          ${isAllowed 
                             ? 'bg-white/5 border-white/10 hover:bg-white/15 hover:border-blue-500/50 hover:-translate-y-1 active:scale-95 cursor-pointer' 
                             : 'bg-black/40 border-white/5 opacity-20 grayscale cursor-not-allowed'
                          }
                          ${isBeingPoured ? 'ring-2 ring-blue-500 bg-blue-500/20' : ''}
                       `}
                    >
                       {/* Visual Icon (3D Ball) */}
                       <div className="relative w-16 h-16 mb-2 flex items-center justify-center">
                          <div 
                             className="absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-100 transition-opacity"
                             style={{ backgroundColor: chem.color || '#ffffff' }}
                          />
                          <div 
                             className={`
                                w-10 h-10 rounded-full shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.5),4px_4px_8px_rgba(255,255,255,0.2)]
                                transition-transform group-hover:scale-110
                             `}
                             style={{ 
                                background: `radial-gradient(circle at 30% 30%, ${chem.color || '#ffffff'}, #000)`,
                                border: '1px solid rgba(255,255,255,0.1)'
                             }}
                          />
                          {/* State indicator icon */}
                          <div 
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold border border-white/20
                               ${chem.state === 'solid' ? 'bg-orange-500' : (chem.state === 'gas' ? 'bg-blue-400' : 'bg-green-500')}
                            `}
                          >
                             {chem.state?.[0].toUpperCase()}
                          </div>
                       </div>

                       {/* Formula & Name */}
                       <div className="text-center">
                          <span className="block text-sm font-bold font-mono text-white/90 group-hover:text-white">{chem.formula}</span>
                          <span className="block text-[9px] text-white/40 group-hover:text-white/60 truncate w-24">
                             {chem.name}
                          </span>
                       </div>

                       {/* Hover Overlay Hint */}
                       <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus size={12} className="text-blue-400" />
                       </div>
                    </button>
                  );
               })}
               </div>
            </div>
         </div>
      </div>

      {/* 5. Nút Tách Chất (giữa màn hình khi có nhiều chất) */}
      {activeBeaker.contents.length >= 2 && (
         <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20">
            <button
               onClick={() => handleSplitProducts(activeBeakerIndex)}
               className="flex items-center gap-2 px-6 py-3 bg-blue-600/80 hover:bg-blue-600 rounded-full backdrop-blur-xl border border-blue-400/50 shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all transform hover:scale-110 active:scale-95 text-sm font-bold animate-bounce"
            >
               <Scissors size={18} />
               <span>Tách sản phẩm sang cốc mới</span>
            </button>
         </div>
      )}

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
               title="Dọn sạch cốc"
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
               <h3 className="font-bold text-lg">Cài đặt phòng thí nghiệm</h3>
               <button onClick={() => setShowSettings(false)} className="text-white/40 hover:text-white">
                  <X size={20} />
               </button>
            </div>

            <div className="space-y-6">
               {/* Background Type */}
               <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-sm font-medium">Chế độ Galaxy</span>
                  <button 
                     onClick={() => updateSettings({ bgType: settings.bgType === 'color' ? 'galaxy' : 'color' })}
                     className={`w-12 h-6 rounded-full transition-colors relative ${settings.bgType === 'galaxy' ? 'bg-blue-500' : 'bg-white/10'}`}
                  >
                     <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.bgType === 'galaxy' ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
               </div>

               {/* Background Color */}
               <div className={settings.bgType === 'galaxy' ? 'opacity-30 pointer-events-none' : ''}>
                  <label className="text-xs text-white/40 uppercase font-bold mb-3 block">Màu nền sân khấu</label>
                  <div className="flex flex-wrap gap-2">
                     {[
                        '#000000', // Noir
                        '#0a0a0f', // Midnight
                        '#0f172a', // Slate
                        '#1e1b4b', // Deep Indigo
                        '#162816', // Dark Forest
                        '#1e1e1e', // Graphite
                        '#2d1b1b', // Maroon Black
                        '#022c22'  // Emerald Night
                     ].map(color => (
                        <button
                           key={color}
                           onClick={() => updateSettings({ bgColor: color })}
                           className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${settings.bgColor === color ? 'border-blue-500 scale-110' : 'border-transparent'}`}
                           style={{ backgroundColor: color }}
                        />
                     ))}
                     <input 
                        type="color" 
                        value={settings.bgColor}
                        onChange={(e) => updateSettings({ bgColor: e.target.value })}
                        className="w-8 h-8 rounded-full bg-transparent border-none cursor-pointer p-0 overflow-hidden"
                     />
                  </div>
               </div>

               {/* Beaker Opacity */}
               <div>
                  <label className="text-xs text-white/40 uppercase font-bold mb-3 block flex justify-between">
                     <span>Độ đục cốc thủy tinh</span>
                     <span className="text-blue-400">{Math.round(settings.beakerOpacity * 100)}%</span>
                  </label>
                  <input 
                     type="range" 
                     min="0.1" 
                     max="1.0" 
                     step="0.05"
                     value={settings.beakerOpacity}
                     onChange={(e) => updateSettings({ beakerOpacity: parseFloat(e.target.value) })}
                     className="w-full accent-blue-500 bg-white/10 rounded-lg h-1 appearance-none cursor-pointer"
                  />
               </div>

               {/* Sound Effects */}
               <div className="border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 mb-4">
                     <div className="flex items-center gap-2">
                        {soundEnabled ? <Volume2 size={18} className="text-green-400" /> : <VolumeX size={18} className="text-white/40" />}
                        <span className="text-sm font-medium">Hiệu ứng âm thanh</span>
                     </div>
                     <button
                        onClick={toggleSound}
                        className={`w-12 h-6 rounded-full transition-colors relative ${soundEnabled ? 'bg-green-500' : 'bg-white/10'}`}
                     >
                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                     </button>
                  </div>

                  <div className={!soundEnabled ? 'opacity-30 pointer-events-none' : ''}>
                     <label className="text-xs text-white/40 uppercase font-bold mb-3 block flex justify-between">
                        <span>Âm lượng</span>
                        <span className="text-green-400">{Math.round(volume * 100)}%</span>
                     </label>
                     <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full accent-green-500 bg-white/10 rounded-lg h-1 appearance-none cursor-pointer"
                     />
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* 7. Tips (Bottom Right) */}
      <div className="absolute bottom-8 right-8 z-20">
         <div className="group relative">
            <div className="p-3 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md border border-white/10 cursor-help">
               <Info size={20} className="text-white/40 group-hover:text-blue-400" />
            </div>
            <div className="absolute bottom-full right-0 mb-4 w-72 bg-black/90 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none transform translate-y-4 group-hover:translate-y-0 text-xs shadow-2xl">
               <p className="font-bold text-blue-400 mb-3 border-b border-blue-400/20 pb-2">HƯỚNG DẪN MULTI-BEAKER:</p>
               <ul className="space-y-2 text-white/70 leading-relaxed">
                  <li>• Nhấn icon cốc góc trên phải để chuyển đổi hoặc thêm cốc.</li>
                  <li>• Khi có ít nhất 2 chất, dùng nút <b>Scissors</b> để tách sản phẩm.</li>
                  <li>• Có thể làm thí nghiệm song song trên 4 cốc khác nhau.</li>
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

        @keyframes scaleIn {
          from { transform: scale(0.8) translateY(10px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }

        @keyframes nebula-drift {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, 10px) rotate(5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        @keyframes cosmic-pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }

        @keyframes star-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .animate-nebula-drift {
          animation: nebula-drift 20s ease-in-out infinite;
        }

        .animate-cosmic-pulse {
          animation: cosmic-pulse 10s ease-in-out infinite;
        }

        .animate-star-twinkle {
          animation: star-twinkle 3s ease-in-out infinite;
        }

        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
};

export default MagicLab3D;
