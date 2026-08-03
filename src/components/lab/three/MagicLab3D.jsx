import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import GameWorkspace from '../2d-engine/GameWorkspace';
import useLabStore from './magic-lab/store';

import SoundManager from './magic-lab/SoundManager';
import { useSoundEffects, useSoundStore } from './magic-lab/useSoundEffects';
import { AlertTriangle, ArrowRightLeft, Beaker, Zap, Flame, FlaskConical, BookOpen, NotebookPen, Download, Filter, Sparkles } from 'lucide-react';
import { getChemicalImage } from '../../../data/chemicalImages';
import ChemicalTooltip from '../ChemicalTooltip';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { reactions as staticReactionsData } from '@/data/reactions';

const normalize = (f) => {
  if (!f) return "";
  const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  return f.toString().replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => subMap[m]).trim().toUpperCase();
};

const withAlpha = (color, alpha) => /^#[0-9a-f]{6}$/i.test(color || '')
  ? `${color}${alpha}`
  : color || 'rgba(255,255,255,0.2)';

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
  const userId = user?.id;
  const userUnlockedChemicals = user?.unlockedChemicals;
  
  // --- Game Data Local State ---
  const [dbChemicals, setDbChemicals] = useState([]);
  const [discoveredFormulas, setDiscoveredFormulas] = useState([]);
  const discoveredFormulasRef = useRef([]);
  const [isLoading, setIsLoading] = useState(true);
  const [labLoadError, setLabLoadError] = useState('');
  const [loadVersion, setLoadVersion] = useState(0);
  const [progressSaveError, setProgressSaveError] = useState('');
  
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
  const setHeatPower = useLabStore(state => state.setHeatPower);
  const scoopSolids = useLabStore(state => state.scoopSolids);
  const pourToBeaker = useLabStore(state => state.pourToBeaker);
  const toggleElectrolysis = useLabStore(state => state.toggleElectrolysis);
  const resetLabSession = useLabStore(state => state.resetLabSession);

  const activeBeaker = beakers[activeBeakerIndex] || beakers[0];
  const [showLabSettings, setShowLabSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRecipeBook, setShowRecipeBook] = useState(false);
  const [pouringMode, setPouringMode] = useState(false); // true khi đang chọn cốc đích để rót

  // --- Lab Notepad State & Storage ---
  const [showNotepad, setShowNotepad] = useState(false);
  const [notepadTab, setNotepadTab] = useState('history'); // 'history' | 'notes'
  const [userNotes, setUserNotes] = useState('');
  const notesStorageKey = `aurum_lab_notes:${isLoggedIn && userId ? userId : 'guest'}`;
  const [notesReadyKey, setNotesReadyKey] = useState('');

  useEffect(() => {
    resetLabSession(isLoggedIn && userId ? `user:${userId}` : 'guest');
  }, [isLoggedIn, resetLabSession, userId]);

  useEffect(() => {
    setUserNotes(localStorage.getItem(notesStorageKey) || '');
    setNotesReadyKey(notesStorageKey);
  }, [notesStorageKey]);

  useEffect(() => {
    if (notesReadyKey === notesStorageKey) {
      localStorage.setItem(notesStorageKey, userNotes);
    }
  }, [notesReadyKey, notesStorageKey, userNotes]);

  // Group and aggregate chemical history for active beaker
  const activeHistory = useMemo(() => {
    const eventsMap = new Map();

    // Process inputs added
    (activeBeaker.addedHistory || []).forEach(item => {
      const key = `input_${item.formula}_${item.unit}`;
      if (!eventsMap.has(key)) {
        eventsMap.set(key, {
          type: 'input',
          formula: item.formula,
          name: item.name,
          unit: item.unit,
          totalAmount: 0,
          count: 0,
          lastTime: item.time || 'Vừa xong'
        });
      }
      const entry = eventsMap.get(key);
      entry.totalAmount += (item.amount || 0);
      entry.count += 1;
      if (item.time) entry.lastTime = item.time;
    });

    // Process reaction yields
    (activeBeaker.yieldHistory || []).forEach(item => {
      const key = `yield_${item.formula}_${item.unit}`;
      if (!eventsMap.has(key)) {
        eventsMap.set(key, {
          type: 'yield',
          formula: item.formula,
          name: item.name,
          unit: item.unit,
          totalAmount: 0,
          count: 0,
          lastTime: 'Vừa xong'
        });
      }
      const entry = eventsMap.get(key);
      entry.totalAmount += (item.amount || 0);
      entry.count += 1;
    });

    // Format lines
    return Array.from(eventsMap.values()).map(e => {
      if (e.type === 'input') {
        return {
          text: `Cho ${e.totalAmount}${e.unit} ${e.name} (${e.formula}) vào cốc${e.count > 1 ? ` (x${e.count})` : ''}`,
          time: e.lastTime
        };
      } else {
        return {
          text: `Ước tính thu được ${e.totalAmount}${e.unit} ${e.name} (${e.formula})${e.count > 1 ? ` (x${e.count})` : ''}`,
          time: e.lastTime
        };
      }
    });
  }, [activeBeaker.addedHistory, activeBeaker.yieldHistory]);

  const handleExportNotepad = () => {
    const lines = [];
    lines.push("=== AURUM CHEMISTRY LAB - SỔ TAY NHẬT KÝ THÍ NGHIỆM ===");
    lines.push(`Thời gian xuất: ${new Date().toLocaleString('vi-VN')}`);
    lines.push(`Cốc thí nghiệm đang chọn: #${activeBeakerIndex + 1}\n`);
    lines.push("Giả định tính lượng: dung dịch 1 M; khí ở 25°C và 1 atm.\n");
    lines.push("--- 📜 LỊCH SỬ THAO TÁC HÓA CHẤT ---");
    if (activeHistory.length === 0) {
      lines.push("(Chưa có thao tác nào)");
    } else {
      activeHistory.forEach((h, i) => {
        lines.push(`${i + 1}. [${h.time}] ${h.text}`);
      });
    }
    lines.push("\n--- GHI CHÚ CÁ NHÂN ---");
    lines.push(userNotes || "(Chưa có ghi chú)");
    
    const blob = new Blob([lines.join("\n")], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AURUM_Lab_Notepad_Beaker${activeBeakerIndex + 1}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
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
    const controller = new AbortController();
    const fetchData = async () => {
      setIsLoading(true);
      setLabLoadError('');
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const [chemsRes, rxsRes] = await Promise.all([
          fetch('/api/lab/chemicals', { headers, signal: controller.signal }),
          fetch('/api/lab/reactions', { headers, signal: controller.signal })
        ]);
        if (!chemsRes.ok || !rxsRes.ok) throw new Error('Không thể tải dữ liệu hóa chất và phản ứng.');
        const chemsData = await chemsRes.json();
        const rxsData = await rxsRes.json();
        if (!Array.isArray(chemsData) || !Array.isArray(rxsData)) throw new Error('Dữ liệu Lab trả về không hợp lệ.');
        
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
        let initialDiscovered = starters;

        if (isLoggedIn && userUnlockedChemicals) {
          initialDiscovered = Array.from(new Set([...starters, ...userUnlockedChemicals]));
        } else if (!isLoggedIn) {
          const saved = localStorage.getItem('chem_odyssey_discovered:guest') || localStorage.getItem('chem_odyssey_discovered');
          if (saved) {
            try {
              initialDiscovered = Array.from(new Set([...starters, ...JSON.parse(saved)]));
            } catch {
              localStorage.removeItem('chem_odyssey_discovered:guest');
            }
          }
        }
        
        discoveredFormulasRef.current = initialDiscovered;
        setDiscoveredFormulas(initialDiscovered);
        setData(processedChems, rxsData, initialDiscovered);
        
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error("Failed to fetch lab data:", err);
        setLabLoadError(err.message || 'Không thể tải dữ liệu Lab.');
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [isLoggedIn, loadVersion, setData, userId, userUnlockedChemicals]);

  // Sync auth user progress
  useEffect(() => {
    if (isLoggedIn && userId && userUnlockedChemicals && dbChemicals.length > 0) {
      const starters = dbChemicals.filter(c => c.is_starter || c.isStarter).map(c => c.formula);
      const combined = Array.from(new Set([...starters, ...userUnlockedChemicals]));
      discoveredFormulasRef.current = combined;
      setDiscoveredFormulas(combined);
      setUnlocked(combined);
    }
  }, [dbChemicals, isLoggedIn, setUnlocked, userId, userUnlockedChemicals]);

  const normalizedDiscoveredSet = useMemo(() => new Set(discoveredFormulas.map(f => normalize(f))), [discoveredFormulas]);

  // Handle new discoveries
  const handleOnDiscovery = useCallback((products) => {
    const previousFormulas = discoveredFormulasRef.current;
    const previousNormalized = new Set(previousFormulas.map(formula => normalize(formula)));
    const newProducts = products.filter(p => !previousNormalized.has(normalize(p.formula)));
    
    if (newProducts.length > 0) {
      const targetNorm = normalize(newProducts[0].formula);
      const chemObj = dbChemicals.find(c => normalize(c.formula) === targetNorm);
      if (chemObj) {
        setNewDiscovery(chemObj);
        playSound('success');
      }

      const allNewFormulas = newProducts.map(p => p.formula);
      const updated = Array.from(new Set([...previousFormulas, ...allNewFormulas]));
      discoveredFormulasRef.current = updated;
      setDiscoveredFormulas(updated);
      setUnlocked(updated);
      setProgressSaveError('');
      
      if (isLoggedIn) {
        const token = localStorage.getItem('token');
        void (async () => {
          try {
            const response = await fetch('/api/lab/unlock', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ formulas: allNewFormulas }),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.message || 'Không thể lưu khám phá.');
            try {
              await refreshUser();
            } catch (refreshError) {
              console.warn('Đã lưu khám phá nhưng chưa làm mới được hồ sơ:', refreshError);
            }
          } catch (error) {
            console.error("Failed to save progress:", error);
            const failedFormulas = new Set(allNewFormulas.map(formula => normalize(formula)));
            const rollback = discoveredFormulasRef.current.filter(formula => (
              !failedFormulas.has(normalize(formula)) || previousNormalized.has(normalize(formula))
            ));
            discoveredFormulasRef.current = rollback;
            setDiscoveredFormulas(rollback);
            setUnlocked(rollback);
            setNewDiscovery(null);
            setProgressSaveError(`${error.message} Tiến độ cục bộ đã được hoàn tác.`);
          }
        })();
      } else {
        localStorage.setItem('chem_odyssey_discovered:guest', JSON.stringify(updated));
      }
    }
  }, [dbChemicals, isLoggedIn, playSound, refreshUser, setUnlocked]);

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

  const handleScoopSolids = useCallback(() => {
    const hasSolids = activeBeaker.contents.some(c => c.state === 'solid');
    if (!hasSolids) return;
    playSound('click');
    scoopSolids();
  }, [scoopSolids, activeBeaker.contents, playSound]);

  const handlePourTo = useCallback((toIdx) => {
    playSound('pour', { chemicalState: 'liquid' });
    pourToBeaker(activeBeakerIndex, toIdx);
    setPouringMode(false);
  }, [pourToBeaker, activeBeakerIndex, playSound]);

  // Bản đồ tra cứu Lớp học dự phòng cho Bảng điều chế
  const staticGradeMap = useMemo(() => {
    const map = {};
    if (Array.isArray(staticReactionsData)) {
      staticReactionsData.forEach(r => {
        if (r.id && r.gradeLevel) map[r.id] = r.gradeLevel;
        if (r.equation && r.gradeLevel) map[r.equation] = r.gradeLevel;
      });
    }
    return map;
  }, []);

  // Danh sách phản ứng đã khám phá cho bảng điều chế
  const knownReactions = useMemo(() => {
    const rxs = useLabStore.getState().reactions || [];
    return rxs.filter(rx => {
      return rx.reactants.every(r => normalizedDiscoveredSet.has(normalize(r.formula)));
    });
  }, [normalizedDiscoveredSet]);

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
      .filter(c => normalizedDiscoveredSet.has(normalize(c.formula)))
      .filter(c => 
        String(c.name || '').toLowerCase().includes(query) ||
        String(c.formula || '').toLowerCase().includes(query)
      );
  }, [normalizedDiscoveredSet, searchQuery]);

  if (isLoading) return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0f] text-white rounded-3xl min-h-[600px]">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-6" />
      <h2 className="text-xl font-bold uppercase tracking-widest animate-pulse">Đang nạp dữ liệu Lab...</h2>
    </div>
  );

  if (labLoadError) return (
    <div className="flex min-h-[420px] flex-1 flex-col items-center justify-center rounded-3xl bg-[#0a0a0f] p-8 text-center text-white">
      <AlertTriangle className="mb-4 h-12 w-12 text-amber-400" />
      <h2 className="text-xl font-black">Không thể mở phòng Lab</h2>
      <p className="mt-2 max-w-md text-sm text-white/60">{labLoadError}</p>
      <button
        type="button"
        onClick={() => setLoadVersion(version => version + 1)}
        className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-blue-500"
      >
        Thử lại
      </button>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="relative h-full min-h-[720px] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0f] font-sans text-white shadow-2xl transition-colors duration-1000 md:min-h-[600px]"
    >
      <GameWorkspace />

      <SoundManager />

      {/* --- Discovery UI Overlays --- */}
      <AnimatePresence>
        {newDiscovery && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -50 }} 
            className="absolute top-6 left-1/2 -translate-x-1/2 z-[200] pointer-events-auto"
          >
             <div className="bg-slate-900/90 backdrop-blur-2xl border border-blue-500/30 rounded-3xl p-5 flex items-center gap-5 shadow-[0_10px_40px_rgba(59,130,246,0.4)]">
                <Sparkles className="h-10 w-10 text-blue-300" />
                <div>
                  <h2 className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-0.5">Khám phá hóa chất mới</h2>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-black text-white drop-shadow-md leading-none">{newDiscovery.formula}</span>
                    <span className="text-white/60 font-medium text-xs mb-1">({newDiscovery.name})</span>
                  </div>
                </div>
                <button 
                  onClick={() => setNewDiscovery(null)} 
                  className="ml-4 w-8 h-8 flex items-center justify-center bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-xl transition-all"
                >
                  ✕
                </button>
             </div>
           </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {progressSaveError && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="absolute left-1/2 top-4 z-[210] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-start gap-3 rounded-2xl border border-rose-400/30 bg-rose-950/90 p-4 text-xs text-rose-100 shadow-2xl backdrop-blur-xl"
            role="alert"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-300" />
            <span>{progressSaveError}</span>
            <button type="button" onClick={() => setProgressSaveError('')} className="ml-2 text-rose-200" aria-label="Đóng thông báo">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main UI Layout */}
      <div className="pointer-events-none absolute inset-0 z-[10] flex flex-col justify-between px-2 pb-2 pt-2 sm:px-4 sm:pb-4 sm:pt-4">
        {/* Top Header */}
        <div className="pointer-events-auto flex items-start justify-end overflow-x-auto pb-2">
          <div className="flex min-w-max gap-2">
            <button 
              onClick={() => {
                setShowNotepad(!showNotepad);
                if (!showNotepad) setShowRecipeBook(false);
              }}
              className={`flex items-center gap-2 px-4 h-12 rounded-2xl border backdrop-blur-xl transition-all font-bold text-xs uppercase tracking-widest shadow-lg group relative ${
                showNotepad 
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                  : 'bg-slate-900/40 border-white/10 hover:border-white/20 hover:bg-slate-800/40 text-white/80'
              }`}
            >
              <NotebookPen className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform duration-300" />
              <span>Nhật ký thí nghiệm</span>
              {activeHistory.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md text-[10px] font-black">
                  {activeHistory.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => window.location.assign('/lab/discovery')}
              className="flex items-center gap-2 px-4 h-12 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 hover:bg-slate-800/40 transition-all font-bold text-xs uppercase tracking-widest shadow-lg group"
            >
              <svg className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              <span className="text-white/80 group-hover:text-white transition-colors">Sổ tay khám phá</span>
              <span className="ml-1 px-1.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-md text-[10px] font-black">{discoveredFormulas.length}</span>
            </button>
            <button 
              onClick={() => {
                setShowRecipeBook(!showRecipeBook);
                if (!showRecipeBook) setShowNotepad(false);
              }}
              className={`flex items-center gap-2 px-4 h-12 backdrop-blur-xl rounded-2xl border transition-all font-bold text-xs uppercase tracking-widest shadow-lg group ${
                showRecipeBook
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-900/40 border-white/10 hover:border-white/20 hover:bg-slate-800/40 text-white/80'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              <span>Bảng điều chế</span>
              <span className="ml-1 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md text-[10px] font-black">{knownReactions.length}</span>
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
                  {activeBeaker.safetyWarning && (
                    <span className="mt-2 block border-t border-amber-300/20 pt-2 text-xs font-bold text-amber-200">
                      ⚠️ {activeBeaker.safetyWarning}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Left Sidebar - Chemicals & Tools */}
          <motion.div 
            initial={false}
            animate={{ x: isSidebarOpen ? 0 : -280, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 120 }}
            className="pointer-events-auto relative z-20 mb-2 mt-2 flex min-h-0 w-[min(280px,calc(100vw-3rem))] flex-col rounded-[28px] border border-white/10 bg-slate-950/85 p-3 pb-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-xl isolate sm:p-4"
          >
            {/* Toggle Button */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="absolute -right-8 top-1/2 -translate-y-1/2 w-8 h-20 bg-slate-900/90 border border-white/10 border-l-0 hover:border-white/20 rounded-r-2xl flex items-center justify-center shadow-[4px_0_10px_-2px_rgba(0,0,0,0.5)] transition-all pointer-events-auto hover:bg-slate-800/90 group"
            >
              <div className="text-white/60 group-hover:text-blue-400 transition-colors">
                {isSidebarOpen ? <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg> : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>}
              </div>
            </button>

            {/* Tools Area */}
            <div className="flex justify-between items-center mb-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 gap-1">
              <button 
                onClick={cycleContainerType}
                className="flex-1 h-10 rounded-xl flex items-center justify-center hover:bg-indigo-500/10 text-white/50 hover:text-indigo-400 border border-transparent hover:border-indigo-500/20 transition-all hover:scale-105 active:scale-95"
                title="Đổi dụng cụ"
              >
                {activeBeaker.containerType === 'flask' && <FlaskConical className="w-4 h-4" />}
                {activeBeaker.containerType === 'dish' && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="16" rx="10" ry="3"/><path d="M2 16v-2a10 3 0 0 1 20 0v2"/></svg>}
                {(!activeBeaker.containerType || activeBeaker.containerType === 'beaker') && <Beaker className="w-4 h-4" />}
              </button>
              <button 
                onClick={handleToggleHeat}
                className={`flex-1 h-10 rounded-xl flex items-center justify-center transition-all ${
                  activeBeaker.isHeating 
                    ? 'bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] border border-orange-400/30' 
                    : 'hover:bg-white/5 text-white/50 hover:text-white border border-transparent'
                }`}
                title="Đun nóng"
              >
                <Flame className={`w-4 h-4 ${activeBeaker.isHeating ? 'animate-bounce' : ''}`} />
              </button>
              <button 
                onClick={() => {
                  playSound('click');
                  toggleElectrolysis();
                }}
                className={`flex-1 h-10 rounded-xl flex items-center justify-center transition-all ${
                  activeBeaker.isElectrolyzing 
                    ? 'bg-gradient-to-tr from-cyan-600 to-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] border border-blue-400/30' 
                    : 'hover:bg-white/5 text-white/50 hover:text-cyan-300 border border-transparent'
                }`}
                title="Điện phân"
              >
                <Zap className={`w-4 h-4 ${activeBeaker.isElectrolyzing ? 'animate-pulse' : ''}`} />
              </button>
              <button 
                onClick={handleScoopSolids}
                disabled={!activeBeaker.contents.some(c => c.state === 'solid')}
                className="flex-1 h-10 rounded-xl flex items-center justify-center hover:bg-amber-500/10 text-white/50 hover:text-amber-400 border border-transparent hover:border-amber-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Vớt kết tủa / chất rắn"
              >
                <Filter className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setPouringMode(value => !value)}
                disabled={beakers.length < 2 || !activeBeaker.contents.some(c => c.state === 'liquid')}
                className={`flex h-10 flex-1 items-center justify-center rounded-xl border transition-all disabled:cursor-not-allowed disabled:opacity-30 ${pouringMode ? 'border-blue-400/40 bg-blue-500/20 text-blue-300' : 'border-transparent text-white/50 hover:border-blue-500/20 hover:bg-blue-500/10 hover:text-blue-300'}`}
                title="Rót dung dịch sang cốc khác"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>

              <button 
                onClick={handleClearBeaker}
                className="flex-1 h-10 rounded-xl flex items-center justify-center hover:bg-cyan-500/10 text-white/50 hover:text-cyan-400 border border-transparent hover:border-cyan-500/20 transition-all hover:scale-105 active:scale-95"
                title="Làm mới cốc"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
              <button 
                onClick={addBeaker}
                className="flex-1 h-10 rounded-xl flex items-center justify-center hover:bg-emerald-500/10 text-white/50 hover:text-emerald-400 border border-transparent hover:border-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                title="Thêm cốc mới"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              </button>
            </div>

            {/* Heat Power Slider */}
            {(() => {
              const tempVal = (typeof activeBeaker?.heatTemperature === 'number' && !Number.isNaN(activeBeaker.heatTemperature)) ? activeBeaker.heatTemperature : 25;
              const powerVal = (typeof activeBeaker?.heatPower === 'number' && !Number.isNaN(activeBeaker.heatPower)) ? activeBeaker.heatPower : 5;
              return (
                <div className={`mb-3 p-3 rounded-2xl border transition-all ${activeBeaker.isHeating ? 'bg-white/5 border-orange-500/30' : 'bg-black/20 border-white/5 opacity-50'}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-orange-400/80">Mức lửa</span>
                    <div className="flex gap-3 text-[11px] font-black tabular-nums">
                      <span className={`${!activeBeaker.isHeating ? 'text-white/30' : 'text-orange-400'}`}>
                        🔥 Mức {powerVal}
                      </span>
                      <span className={`${
                        !activeBeaker.isHeating ? 'text-white/30'
                        : tempVal >= 800 ? 'text-red-400 animate-pulse' 
                        : tempVal >= 400 ? 'text-orange-400' 
                        : tempVal >= 100 ? 'text-amber-400' 
                        : 'text-white/60'
                      }`}>
                        🌡️ {Math.round(tempVal)}°C
                      </span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={powerVal}
                    disabled={!activeBeaker.isHeating}
                    onChange={(e) => setHeatPower(Number(e.target.value))}
                    className={`w-full h-1.5 rounded-full appearance-none accent-orange-500 ${activeBeaker.isHeating ? 'cursor-pointer' : 'cursor-not-allowed grayscale'}`}
                    style={{
                      background: activeBeaker.isHeating 
                        ? `linear-gradient(to right, #f59e0b 0%, #ef4444 ${((powerVal - 1) / 9) * 100}%, rgba(255,255,255,0.1) ${((powerVal - 1) / 9) * 100}%)`
                        : 'rgba(255,255,255,0.1)'
                    }}
                  />
                  <div className="flex justify-between mt-1 text-[8px] text-white/30 font-bold">
                    <span>Nhỏ</span>
                    <span>Vừa</span>
                    <span>Max</span>
                  </div>
                </div>
              );
            })()}

            <p className="mb-2 rounded-lg border border-white/5 bg-black/20 px-2 py-1.5 text-[8px] font-semibold leading-relaxed text-white/35">
              Định lượng ước tính với dung dịch 1 M và khí ở 25°C, 1 atm.
            </p>


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
                    aria-label={`Thêm ${chem.name} (${chem.formula}), trạng thái ${chem.state || 'chưa xác định'}`}
                    title={`${chem.name} (${chem.formula})`}
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
                        e.currentTarget.style.borderColor = withAlpha(chem.color, '60');
                        e.currentTarget.style.boxShadow = `0 0 15px ${withAlpha(chem.color, '30')}`;
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
                    onFocus={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setMousePos({ x: rect.right, y: rect.top });
                      setHoveredChem(chem);
                    }}
                    onBlur={() => setHoveredChem(null)}
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

          {/* Right Side Panel - Swaps between Beakers Selector and Handbook/Recipe Book with 3D Flip */}
          <div className="my-auto pointer-events-auto self-center max-h-[95%] [perspective:1000px] isolate z-30 mr-2">
            <AnimatePresence mode="wait">
              {(!showNotepad && !showRecipeBook) ? (
                /* --- FRONT: Beaker Selector Column (#1, #2, #3, #4) --- */
                <motion.div
                  key="beakers-column"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="w-24 bg-slate-900/40 backdrop-blur-xl border border-white/10 p-3 rounded-[28px] flex flex-col gap-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
                >
                  {beakers.map((b, idx) => (
                    <div key={b.id} className="relative group">
                      <button
                        onClick={() => {
                          if (pouringMode && idx !== activeBeakerIndex) handlePourTo(idx);
                          else setActiveBeaker(idx);
                        }}
                        className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center transition-all border duration-300 relative overflow-hidden ${
                          pouringMode && activeBeakerIndex !== idx
                            ? 'bg-blue-500/15 border-blue-400 animate-pulse'
                            : activeBeakerIndex === idx
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
                          <div className="absolute inset-0 border border-white/30 rounded-b-lg rounded-t-sm" />
                          <div className="absolute top-0 left-0 w-full h-0.5 border-b border-white/30" />
                          <div className="absolute top-2 left-0.5 w-1.5 h-0.5 bg-white/20" />
                          <div className="absolute top-4 left-0.5 w-2 h-0.5 bg-white/20" />
                          <div className="absolute top-6 left-0.5 w-1.5 h-0.5 bg-white/20" />
                          
                          {b.contents.length > 0 && (
                            <div 
                              className="absolute bottom-0 w-full transition-all duration-500 rounded-b-[7px] overflow-hidden" 
                              style={{ 
                                height: `${Math.min(b.contents.length * 25, 90)}%`,
                                backgroundColor: b.contents[b.contents.length - 1].color 
                              }} 
                            >
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
                </motion.div>
              ) : showNotepad ? (
                /* --- BACK: Nhật ký thí nghiệm (Notepad Panel) --- */
                <motion.div
                  key="notepad-panel"
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 90, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="flex h-[500px] max-h-[75vh] w-[min(360px,calc(100vw-1.5rem))] flex-col gap-3 rounded-[28px] border border-white/15 bg-slate-950/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <NotebookPen className="w-4 h-4 text-amber-400" />
                      <h3 className="text-xs font-black text-white uppercase tracking-wider">Nhật Ký Thí Nghiệm</h3>
                    </div>
                    <button
                      onClick={() => setShowNotepad(false)}
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/80 flex items-center justify-center text-xs font-bold transition-colors"
                      title="Thu nhỏ lại"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1 rounded-xl bg-white/5 p-1">
                    <button type="button" onClick={() => setNotepadTab('history')} className={`rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-wider ${notepadTab === 'history' ? 'bg-amber-500/20 text-amber-200' : 'text-white/50'}`}>
                      Lịch sử
                    </button>
                    <button type="button" onClick={() => setNotepadTab('notes')} className={`rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-wider ${notepadTab === 'notes' ? 'bg-amber-500/20 text-amber-200' : 'text-white/50'}`}>
                      Ghi chú
                    </button>
                  </div>

                  {notepadTab === 'history' ? (
                    <div className="my-1 flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                      {activeHistory.length > 0 ? activeHistory.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/5 p-2.5 text-xs">
                          <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                          <div className="flex-1">
                            <p className="font-semibold leading-tight text-white/90">{item.text}</p>
                            <span className="text-[10px] font-normal text-white/40">{item.time}</span>
                          </div>
                        </div>
                      )) : (
                        <div className="flex h-full flex-col items-center justify-center text-center text-xs italic text-white/40">
                          Chưa có lịch sử thao tác nào trong Cốc #{activeBeakerIndex + 1}.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="my-1 flex min-h-0 flex-1 flex-col gap-2">
                      <label htmlFor="lab-personal-notes" className="text-[10px] font-bold text-white/50">
                        Ghi chú này được lưu riêng cho tài khoản hiện tại.
                      </label>
                      <textarea
                        id="lab-personal-notes"
                        value={userNotes}
                        onChange={event => setUserNotes(event.target.value)}
                        placeholder="Ghi lại giả thuyết, quan sát hoặc kết luận..."
                        className="min-h-0 flex-1 resize-none rounded-xl border border-white/10 bg-black/20 p-3 text-xs leading-relaxed text-white outline-none placeholder:text-white/25 focus:border-amber-400/50"
                      />
                    </div>
                  )}

                  {/* Footer actions */}
                  <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                    <span className="text-white/40 text-[11px]">Cốc #{activeBeakerIndex + 1}</span>
                    <button
                      onClick={handleExportNotepad}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px] transition-colors border border-amber-500/30"
                    >
                      <Download className="w-3.5 h-3.5" /> Xuất file (.txt)
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* --- BACK: Bảng điều chế (Recipe Book Panel) --- */
                <motion.div
                  key="recipe-panel"
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 90, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="flex h-[500px] max-h-[75vh] w-[min(360px,calc(100vw-1.5rem))] flex-col gap-3 rounded-[28px] border border-white/15 bg-slate-950/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-xs font-black text-white uppercase tracking-wider">Bảng Điều Chế</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30">
                        {knownReactions.length} phản ứng
                      </span>
                      <button
                        onClick={() => setShowRecipeBook(false)}
                        className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/80 flex items-center justify-center text-xs font-bold transition-colors"
                        title="Thu nhỏ lại"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Reaction List */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-1 my-1">
                    {knownReactions.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-white/40 text-xs italic">
                        Chưa khám phá được phản ứng nào.<br />Hãy thử trộn các hóa chất!
                      </div>
                    ) : (
                      knownReactions.map((rx, idx) => {
                        const gradeVal = rx.gradeLevel || rx.grade_level_id || rx.grade || rx.khoi_id || staticGradeMap[rx.id] || staticGradeMap[rx.equation] || 8;
                        return (
                          <div key={rx.id || idx} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <h4 className="text-xs font-bold text-white leading-tight">{rx.name}</h4>
                              <span className="text-[9px] font-black uppercase text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                                Lớp {gradeVal}
                              </span>
                            </div>
                            <div className="bg-slate-900/60 rounded-lg px-2.5 py-1.5 mb-1.5 border border-white/5 font-mono text-[11px] text-emerald-400">
                              {rx.equation}
                            </div>
                            {rx.observation && (
                              <p className="text-[10px] text-white/60 leading-relaxed">
                                <span className="font-bold text-white/80">Hiện tượng:</span> {rx.observation}
                              </p>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
