import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hammer, 
  Sparkles, 
  FlaskConical, 
  Package, 
  CheckCircle2, 
  LockKeyhole, 
  ChevronLeft, 
  BookOpen, 
  Play, 
  Award,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  ingredients, 
  rarityConfig, 
  normalizeInventory, 
  getIngredientAmountMap, 
  getLevelFromXP,
  canCraftItem,
  getRecipeRequirementCounts
} from '@/data/labInventory';
import { getChemicalImage } from '@/data/chemicalImages';
import { sortMissionsByReward } from '@/utils/missionOrder';

const toAsciiFormula = (formula) => {
  const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  return String(formula || '').replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (match) => subMap[match] || match);
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

const formatFormula = (formula) =>
  String(formula || '').split('').map((char, index) => {
    if (/\d/.test(char) && index > 0) {
      return <sub key={`${char}-${index}`} className="text-[0.68em]">{char}</sub>;
    }
    return <React.Fragment key={`${char}-${index}`}>{char}</React.Fragment>;
  });

const CraftingPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, refreshUser } = useAuth();
  
  const [inventory, setInventory] = useState({ ingredients: [], craftedItems: [] });
  const [craftableItems, setCraftableItems] = useState([]);
  const [unlockedChemicals, setUnlockedChemicals] = useState([]);
  const [tasks, setTasks] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [craftingId, setCraftingId] = useState('');
  const [claimingId, setClaimingId] = useState('');
  const [filterRarity, setFilterRarity] = useState('all');
  const [filterQuery, setFilterQuery] = useState('');
  
  const [successCelebration, setSuccessCelebration] = useState(null);
  const [notice, setNotice] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setNotice(null);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch inventory and dynamic formulas
      const invRes = await fetch('/api/lab/inventory', { headers });
      if (!invRes.ok) throw new Error('Không thể tải kho nguyên liệu.');
      const invData = await invRes.json();
      
      setInventory(normalizeInventory(invData.inventory));
      setCraftableItems(invData.craftableItems || []);
      setUnlockedChemicals(invData.unlockedChemicals || []);

      // Fetch crafting tasks
      const tasksRes = await fetch('/api/lab/crafting/tasks', { headers });
      if (!tasksRes.ok) throw new Error('Không thể tải nhiệm vụ thu thập.');
      const tasksData = await tasksRes.json();
      setTasks(tasksData);
    } catch (error) {
      console.error(error);
      setNotice({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    loadData();
  }, [isLoggedIn, navigate]);

  const ingredientAmounts = useMemo(() => getIngredientAmountMap(inventory), [inventory]);
  const craftedSet = useMemo(() => new Set(inventory.craftedItems || []), [inventory]);
  
  const unlockedChemicalsSet = useMemo(() => {
    return new Set((unlockedChemicals || []).map(f => toAsciiFormula(f).toUpperCase()));
  }, [unlockedChemicals]);

  const stats = useMemo(() => {
    const totalIngredients = inventory.ingredients?.reduce((sum, item) => sum + item.amount, 0) || 0;
    const totalCrafted = craftableItems.filter(item => craftedSet.has(item.id)).length;
    
    const xp = user?.xp || 0;
    const levelInfo = getLevelFromXP(xp);

    return {
      totalIngredients,
      totalCrafted,
      levelInfo
    };
  }, [inventory, craftableItems, craftedSet, user]);

  const handleClaimReward = async (taskId) => {
    setClaimingId(taskId);
    setNotice(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/lab/crafting/tasks/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ taskId })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Không thể nhận phần thưởng.');
      
      // Update local state
      setInventory(normalizeInventory(data.inventory));
      setTasks(current => current.map(task => (
        task.id === taskId ? { ...task, claimed: true } : task
      )));
      
      // Reload tasks list
      const tasksRes = await fetch('/api/lab/crafting/tasks', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (tasksRes.ok) {
        setTasks(await tasksRes.json());
      }
      
      // Show reward notification
      const task = tasks.find(t => t.id === taskId);
      const rewardsText = (data.rewards || task?.rewards || []).map(r => {
        const ing = ingredients.find(i => i.id === r.ingredientId);
        return `${r.amount}x ${ing ? ing.formula : r.ingredientId} (${ing ? ing.name : ''})`;
      }).join(', ');

      setNotice({ 
        type: 'success', 
        text: `Chúc mừng! Bạn đã nhận: ${rewardsText}` 
      });
      
      try {
        await refreshUser?.();
      } catch (refreshError) {
        console.warn('Đã nhận thưởng nhưng chưa làm mới được hồ sơ:', refreshError);
      }
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    } finally {
      setClaimingId('');
    }
  };

  const handleCraft = async (item) => {
    setCraftingId(item.id);
    setNotice(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/lab/craft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId: item.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Không thể chế tạo hợp chất.');

      setInventory(normalizeInventory(data.inventory));
      setUnlockedChemicals(data.unlockedChemicals || []);
      
      // Open success modal celebration
      setSuccessCelebration({
        name: item.name,
        formula: item.formula,
        icon: item.icon,
        description: item.description,
        xpReward: item.xpReward,
        message: data.message || item.unlockMessage
      });

      try {
        await refreshUser?.();
      } catch (refreshError) {
        console.warn('Đã chế tạo nhưng chưa làm mới được hồ sơ:', refreshError);
      }
      
      // Update tasks as crafting might affect active achievements
      const tasksRes = await fetch('/api/lab/crafting/tasks', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (tasksRes.ok) {
        setTasks(await tasksRes.json());
      }
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    } finally {
      setCraftingId('');
    }
  };

  // Filter recipes based on rarity, search query
  const filteredRecipes = useMemo(() => {
    return craftableItems.filter(item => {
      const matchRarity = filterRarity === 'all' || item.rarity === filterRarity;
      const matchQuery = !filterQuery || 
        item.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
        item.formula.toLowerCase().includes(filterQuery.toLowerCase());
      return matchRarity && matchQuery;
    });
  }, [craftableItems, filterRarity, filterQuery]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[oklch(0.98_0.02_135)] text-[#1a1a1a]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mb-6 h-12 w-12 rounded-full border-4 border-viet-green border-t-transparent"
        />
        <h2 className="animate-pulse text-sm font-black uppercase tracking-[0.2em] text-viet-green">Đang khởi động Cơ xưởng chế tạo...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.02_135)] pb-24 pt-32 text-[#1a1a1a] selection:bg-viet-green selection:text-white font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/lab')}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-duo-border border-b-4 bg-white text-[#1a1a1a] hover:bg-slate-50 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-viet-green/10 border border-viet-green/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-viet-green mb-2">
                <Hammer size={12} className="animate-pulse" />
                Phòng Lab Chế Tạo
              </div>
              <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tight text-[#1a1a1a]">Cơ xưởng chế tạo</h1>
            </div>
          </div>
          
          {/* Quick Stats Dashboard */}
          <div className="grid grid-cols-3 gap-3 bg-white border-2 border-duo-border border-b-4 rounded-3xl p-3 md:min-w-[480px]">
            <div className="bg-slate-50 border border-duo-border rounded-2xl p-3 flex flex-col justify-center">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#1a1a1a]/50 block mb-1">Cấp độ Lab</span>
              <span className="text-lg font-black text-viet-green">LV.{stats.levelInfo.level}</span>
              <span className="text-[9px] font-bold text-[#1a1a1a]/70 truncate mt-0.5">{stats.levelInfo.title}</span>
            </div>
            <div className="bg-slate-50 border border-duo-border rounded-2xl p-3 flex flex-col justify-center">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#1a1a1a]/50 block mb-1">Kho nguyên tố</span>
              <span className="text-lg font-black text-blue-600">{stats.totalIngredients}</span>
              <span className="text-[9px] font-bold text-[#1a1a1a]/70 mt-0.5">Mảnh hạt</span>
            </div>
            <div className="bg-slate-50 border border-duo-border rounded-2xl p-3 flex flex-col justify-center">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#1a1a1a]/50 block mb-1">Đã chế tạo</span>
              <span className="text-lg font-black text-purple-600">{stats.totalCrafted}</span>
              <span className="text-[9px] font-bold text-[#1a1a1a]/70 mt-0.5">/ {craftableItems.length} công thức</span>
            </div>
          </div>
        </div>

        {/* Global Notices */}
        {notice && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 rounded-2xl border-2 p-4 text-sm font-bold flex items-center justify-between gap-4 ${
              notice.type === 'success'
                ? 'border-viet-green/30 bg-viet-green/10 text-viet-green'
                : 'border-rose-300 bg-rose-50 text-rose-700'
            }`}
          >
            <span>{notice.text}</span>
            <div className="flex items-center gap-3">
              {notice.type === 'error' && (
                <button onClick={() => loadData()} className="text-xs font-black uppercase tracking-widest hover:underline">
                  Thử lại
                </button>
              )}
              <button
                onClick={() => setNotice(null)}
                className="text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        )}

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Ingredient Tasks (5 Grid Cols on large screens) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border-2 border-duo-border border-b-4 rounded-[32px] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 text-[#1a1a1a]">
                    <Award className="text-amber-500" size={20} />
                    Nhiệm vụ thu thập
                  </h2>
                  <p className="text-[11px] font-bold text-[#1a1a1a]/60 mt-1">Hoàn thành để kiếm mảnh nguyên tố thiết yếu</p>
                </div>
              </div>

              <div className="space-y-4">
                {sortMissionsByReward(tasks).map(task => {
                  const isCompleted = task.progress >= task.target;
                  const isClaimed = task.claimed;
                  const percent = Math.min(100, Math.round((task.progress / task.target) * 100));

                  return (
                    <div 
                      key={task.id} 
                      className={`border-2 border-duo-border border-b-4 rounded-2xl p-4 transition-all duration-300 ${
                        isCompleted 
                          ? 'border-viet-green/30 bg-viet-green/[0.02]' 
                          : 'bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="space-y-1">
                          <span className={`inline-block text-[9px] font-black uppercase tracking-widest rounded-lg px-2 py-0.5 ${
                            task.difficulty === 'hard' 
                              ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                              : task.difficulty === 'medium'
                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                          }`}>
                            Độ khó: {task.difficulty === 'hard' ? 'Khó' : task.difficulty === 'medium' ? 'Vừa' : 'Dễ'}
                          </span>
                          <h3 className="text-sm font-black text-[#1a1a1a]">{task.title}</h3>
                          <p className="text-[11px] text-[#1a1a1a]/70 font-semibold leading-relaxed">{task.description}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center text-[10px] font-black text-[#1a1a1a]/60 mb-1.5">
                          <span>Tiến độ</span>
                          <span>{task.progress}/{task.target} ({percent}%)</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 border border-duo-border">
                          <motion.div
                            className={`h-full ${isCompleted ? 'bg-viet-green' : 'bg-blue-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>

                      {/* Rewards & Action Button */}
                      <div className="flex items-center justify-between gap-4 pt-3 border-t border-duo-border">
                        <div className="flex flex-wrap gap-1.5">
                          {(task.rewards || []).map((rew, i) => {
                            const ing = ingredients.find(x => x.id === rew.ingredientId);
                            return (
                              <span 
                                key={i} 
                                className="bg-white border-2 border-duo-border rounded-xl pl-1.5 pr-2 py-1 text-[10px] font-black text-viet-green flex items-center gap-1.5"
                              >
                                <ElementSphere symbol={ing?.formula || rew.ingredientId} size="sm" />
                                <span>{ing?.formula || rew.ingredientId}: +{rew.amount}</span>
                              </span>
                            );
                          })}
                        </div>

                        {isClaimed ? (
                          <span className="inline-flex items-center gap-1.5 rounded-xl border-2 border-emerald-200 bg-emerald-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-700">
                            <Award size={12} /> Đã nhận
                          </span>
                        ) : isCompleted ? (
                          <button
                            onClick={() => handleClaimReward(task.id)}
                            disabled={claimingId !== ''}
                            className="bg-viet-green hover:bg-viet-green/90 border-b-4 border-viet-green-dark disabled:bg-slate-200 disabled:text-slate-400 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition flex items-center gap-1.5"
                          >
                            <Sparkles size={12} />
                            {claimingId === task.id ? 'Đang nhận' : 'Nhận thưởng'}
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (task.actionType === 'watch_video' || task.actionType === 'complete_lesson') {
                                navigate('/lectures');
                              } else {
                                navigate('/library');
                              }
                            }}
                            className="bg-white hover:bg-slate-50 text-[#1a1a1a]/80 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border-2 border-duo-border border-b-4 transition flex items-center gap-1.5"
                          >
                            {task.actionType === 'watch_video' ? <Play size={10} /> : <BookOpen size={10} />}
                            Thực hiện
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Inventory overview below quests */}
              <div className="mt-8 pt-6 border-t border-duo-border">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#1a1a1a]/60 mb-4 flex items-center gap-2">
                  <Package size={14} />
                  Kho nguyên tố hiện có
                </h3>
                {ingredients.filter((ing) => (ingredientAmounts[ing.id] || 0) > 0).length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                    {ingredients
                      .filter((ing) => (ingredientAmounts[ing.id] || 0) > 0)
                      .map((ingredient) => (
                        <div key={ingredient.id} className="flex items-center gap-3 rounded-2xl border-2 border-duo-border bg-slate-50 p-2.5">
                          <ElementSphere symbol={ingredient.formula} size="md" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[10px] font-black text-[#1a1a1a]">{ingredient.name}</p>
                            <p className="text-[8px] font-bold uppercase tracking-widest text-[#1a1a1a]/55">{ingredient.formula}</p>
                          </div>
                          <span className="rounded-lg bg-viet-green text-white px-2 py-0.5 text-xs font-black">{ingredientAmounts[ingredient.id]}</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-duo-border bg-slate-50/50 p-6 text-center text-xs font-bold text-[#1a1a1a]/50 leading-relaxed">
                    Kho nguyên liệu đang trống. Hãy hoàn thành các nhiệm vụ thu thập ở trên để tích lũy nguyên liệu!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Crafting Recipes (7 Grid Cols on large screens) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border-2 border-duo-border border-b-4 rounded-[32px] p-6">
              
              {/* Filters & Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 text-[#1a1a1a]">
                    <FlaskConical className="text-purple-500" size={20} />
                    Công thức hợp chất
                  </h2>
                  <p className="text-[11px] font-bold text-[#1a1a1a]/60 mt-1">Đồng bộ dữ liệu mô phỏng phản ứng</p>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-2">
                  <select 
                    value={filterRarity} 
                    onChange={(e) => setFilterRarity(e.target.value)}
                    className="bg-white border-2 border-duo-border rounded-xl px-3 py-1.5 text-xs font-black text-[#1a1a1a] focus:outline-none focus:border-viet-green"
                  >
                    <option value="all">Tất cả độ hiếm</option>
                    <option value="common">Phổ thông</option>
                    <option value="uncommon">Đặc biệt</option>
                    <option value="rare">Hiếm</option>
                    <option value="legendary">Huyền thoại</option>
                  </select>

                  <input 
                    type="text" 
                    placeholder="Tìm tên chất, công thức..." 
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="bg-white border-2 border-duo-border rounded-xl px-3 py-1.5 text-xs font-black text-[#1a1a1a] placeholder-[#1a1a1a]/40 focus:outline-none focus:border-viet-green w-[180px]"
                  />
                </div>
              </div>

              {/* Recipe Cards Grid */}
              <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredRecipes.length > 0 ? (
                  filteredRecipes.map((item) => {
                    const status = canCraftItem(item, inventory);
                    const alreadyOwned = status.alreadyCrafted;
                    const alreadyDiscovered = unlockedChemicalsSet.has(toAsciiFormula(item.formula).toUpperCase());
                    const requirementCounts = getRecipeRequirementCounts(item);
                    const rarity = rarityConfig[item.rarity] || rarityConfig.common;

                    return (
                      <div 
                        key={item.id} 
                        className={`rounded-3xl border-2 border-duo-border border-b-4 p-4 transition-all duration-300 bg-white ${
                          alreadyOwned 
                            ? 'border-purple-500/25 bg-purple-50/30' 
                            : status.canCraft 
                              ? 'border-viet-green/30 bg-viet-green/[0.02] shadow-md shadow-viet-green/5' 
                              : 'bg-slate-50/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-b from-white/10 to-white/[0.02] shadow-inner transition-transform duration-300 hover:scale-110 ${
                              item.rarity === 'legendary' ? 'border-amber-500/30 shadow-amber-500/5' :
                              item.rarity === 'rare' ? 'border-purple-500/30 shadow-purple-500/5' :
                              item.rarity === 'uncommon' ? 'border-blue-500/30 shadow-blue-500/5' : 'border-white/10'
                            }`}>
                              <MoleculeModel formula={item.formula} size="md" />
                            </div>
                            <div className="min-w-0">
                              <div className="mb-0.5 flex flex-wrap items-center gap-2">
                                <h4 className="text-sm font-black leading-tight text-[#1a1a1a]">{item.name}</h4>
                                <span className={`rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${rarity.color}`}>
                                  {rarity.label}
                                </span>
                                {alreadyDiscovered && !alreadyOwned && (
                                  <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-cyan-700">
                                    Đã khám phá
                                  </span>
                                )}
                              </div>
                              <p className="text-xl font-black italic text-viet-green leading-tight">
                                {formatFormula(toAsciiFormula(item.formula))}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleCraft(item)}
                            disabled={loading || craftingId !== '' || alreadyOwned || !status.canCraft}
                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition ${
                              alreadyOwned 
                                ? 'bg-purple-600 hover:bg-purple-700 shadow-sm' 
                                : status.canCraft 
                                  ? 'bg-viet-green hover:bg-viet-green/90 shadow-md shadow-viet-green/10' 
                                  : 'bg-slate-200 text-[#1a1a1a]/30 cursor-not-allowed'
                            }`}
                          >
                            {alreadyOwned ? <CheckCircle2 size={12} /> : status.canCraft ? <Hammer size={12} /> : <LockKeyhole size={12} />}
                            {alreadyOwned ? 'Đã chế tạo' : craftingId === item.id ? 'Đang tạo' : 'Chế tạo'}
                          </button>
                        </div>

                        {item.description && (
                          <p className="mb-3 text-[11px] font-semibold leading-relaxed text-[#1a1a1a]/70">{item.description}</p>
                        )}

                        {/* Ingredients Requirements list */}
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(requirementCounts).map(([ingredientId, amount]) => {
                            const ingredient = ingredients.find((candidate) => candidate.id === ingredientId);
                            const available = ingredientAmounts[ingredientId] || 0;
                            const enough = available >= amount;
                            return (
                              <span
                                key={ingredientId}
                                className={`rounded-lg border pl-1.5 pr-2 py-1 text-[9px] font-black flex items-center gap-1.5 ${
                                  enough
                                    ? 'border-viet-green/20 bg-viet-green/5 text-viet-green-dark'
                                    : 'border-rose-500/20 bg-rose-500/5 text-rose-600'
                                }`}
                              >
                                <ElementSphere symbol={ingredient?.formula || ingredientId} size="sm" />
                                <span>{ingredient?.formula || ingredientId}: {available}/{amount}</span>
                              </span>
                            );
                          })}
                          <span className="rounded-lg border border-amber-500/30 bg-amber-50 px-2 py-1 text-[9px] font-black text-amber-600">
                            +{item.xpReward} XP
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-duo-border bg-slate-50/50 p-12 text-center text-xs font-bold text-[#1a1a1a]/50">
                    Không tìm thấy công thức nào khớp với bộ lọc của bạn.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Celebrating dynamic chemical unlock */}
        <AnimatePresence>
          {successCelebration && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSuccessCelebration(null)}
                className="absolute inset-0 bg-[#1a1a1a]/60 backdrop-blur-sm"
              />
              
              <motion.div 
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="relative bg-white border-2 border-duo-border rounded-[36px] p-8 max-w-[500px] w-full text-center shadow-2xl z-10 overflow-hidden"
              >
                {/* Background glow sparks */}
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-viet-green/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-3xl bg-slate-950 border border-white/10 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                    <MoleculeModel formula={successCelebration.formula} size="lg" />
                  </div>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-28 h-28 border border-dashed border-viet-green/30 rounded-full mx-auto -top-2"
                  />
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-viet-green/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-viet-green mb-3 border border-viet-green/20">
                  <Sparkles size={10} />
                  Mở khóa thành công
                </div>

                <h2 className="text-3xl font-black text-[#1a1a1a] mb-1">{successCelebration.name}</h2>
                <h3 className="text-2xl font-black italic text-viet-green mb-4">
                  {formatFormula(toAsciiFormula(successCelebration.formula))}
                </h3>

                <p className="text-[#1a1a1a]/70 text-sm font-semibold leading-relaxed mb-6">
                  {successCelebration.message || `Bạn đã tổng hợp thành công hợp chất ${successCelebration.name} (${successCelebration.formula}) từ các mảnh nguyên tử học tập.`}
                </p>

                <div className="bg-slate-50 border-2 border-duo-border rounded-2xl p-4 flex items-center justify-around gap-4 mb-8">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#1a1a1a]/50 block mb-1">XP Nhận được</span>
                    <span className="text-xl font-black text-amber-600">+{successCelebration.xpReward} XP</span>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#1a1a1a]/50 block mb-1">Trạng thái mô phỏng</span>
                    <span className="text-xs font-black text-viet-green uppercase tracking-widest flex items-center gap-1">
                      <CheckCircle2 size={12} /> Sẵn sàng
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSuccessCelebration(null)}
                  className="w-full bg-viet-green hover:bg-viet-green/90 border-b-4 border-viet-green-dark text-white font-black uppercase tracking-[0.2em] text-xs py-4 rounded-2xl transition cursor-pointer"
                >
                  Xác nhận
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default CraftingPage;
