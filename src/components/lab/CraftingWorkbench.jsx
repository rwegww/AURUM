import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, FlaskConical, Hammer, LockKeyhole, Package, Sparkles, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  canCraftItem,
  craftableItems,
  craftItemInInventory,
  getIngredientAmountMap,
  getRecipeRequirementCounts,
  ingredients,
  normalizeInventory,
  rarityConfig,
} from '@/data/labInventory';
import { getChemicalImage } from '@/data/chemicalImages';

const LOCAL_INVENTORY_KEY = 'aurum_lab_inventory';
const LOCAL_DISCOVERY_KEY = 'chem_odyssey_discovered';

const toAsciiFormula = (formula) => {
  const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  return String(formula || '').replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (match) => subMap[match] || match);
};

const formatFormula = (formula) =>
  String(formula || '').split('').map((char, index) => {
    if (/\d/.test(char) && index > 0) {
      return <sub key={`${char}-${index}`} className="text-[0.68em]">{char}</sub>;
    }
    return <React.Fragment key={`${char}-${index}`}>{char}</React.Fragment>;
  });

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

const CraftingWorkbench = ({ open, onClose, onCrafted }) => {
  const { isLoggedIn, user, refreshUser } = useAuth();
  const [inventory, setInventory] = useState(() => normalizeInventory(user?.inventory));
  const [unlockedChemicals, setUnlockedChemicals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [craftingId, setCraftingId] = useState('');
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!open) return;

    const loadInventory = async () => {
      setLoading(true);
      setNotice(null);
      try {
        if (isLoggedIn) {
          const token = localStorage.getItem('token');
          const res = await fetch('/api/lab/inventory', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error('Không thể tải kho nguyên liệu.');
          const data = await res.json();
          setInventory(normalizeInventory(data.inventory));
          setUnlockedChemicals(data.unlockedChemicals || []);
        } else {
          const saved = localStorage.getItem(LOCAL_INVENTORY_KEY);
          setInventory(normalizeInventory(saved ? JSON.parse(saved) : null));
          const savedDiscovery = localStorage.getItem(LOCAL_DISCOVERY_KEY);
          setUnlockedChemicals(savedDiscovery ? JSON.parse(savedDiscovery) : []);
        }
      } catch (error) {
        setNotice({ type: 'error', text: error.message });
        setInventory(normalizeInventory(user?.inventory));
        setUnlockedChemicals(user?.unlockedChemicals || []);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, [isLoggedIn, open, user?.inventory, user?.unlockedChemicals]);

  const ingredientAmounts = useMemo(() => getIngredientAmountMap(inventory), [inventory]);
  const craftedSet = useMemo(() => new Set(inventory.craftedItems || []), [inventory]);
  const unlockedChemicalsSet = useMemo(() => {
    return new Set((unlockedChemicals || []).map(f => toAsciiFormula(f).toUpperCase()));
  }, [unlockedChemicals]);
  const ownedCount = useMemo(() => {
    return craftableItems.filter(item => 
      craftedSet.has(item.id) || unlockedChemicalsSet.has(toAsciiFormula(item.formula).toUpperCase())
    ).length;
  }, [craftedSet, unlockedChemicalsSet]);

  const craftItem = async (item) => {
    setCraftingId(item.id);
    setNotice(null);

    try {
      if (isLoggedIn) {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/lab/craft', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ itemId: item.id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Không thể chế tạo vật phẩm.');
        setInventory(normalizeInventory(data.inventory));
        setUnlockedChemicals(data.unlockedChemicals || []);
        setNotice({ type: 'success', text: data.message || item.unlockMessage });
        onCrafted?.(toAsciiFormula(item.formula));
        await refreshUser?.();
      } else {
        const { inventory: nextInventory } = craftItemInInventory(item.id, inventory);
        setInventory(nextInventory);
        localStorage.setItem(LOCAL_INVENTORY_KEY, JSON.stringify(nextInventory));

        const saved = JSON.parse(localStorage.getItem(LOCAL_DISCOVERY_KEY) || '[]');
        const formula = toAsciiFormula(item.formula);
        const nextDiscovery = Array.from(new Set([...saved, formula]));
        localStorage.setItem(LOCAL_DISCOVERY_KEY, JSON.stringify(nextDiscovery));
        setUnlockedChemicals(nextDiscovery);
        setNotice({ type: 'success', text: item.unlockMessage });
        onCrafted?.(formula);
      }
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    } finally {
      setCraftingId('');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-[140] bg-black/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: 560, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 560, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="absolute bottom-4 right-4 top-4 z-[141] flex w-[min(560px,calc(100%-2rem))] flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#11151d] text-white shadow-[0_40px_120px_rgba(0,0,0,0.65)]"
          >
            <div className="border-b border-white/10 p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
                    <Hammer size={14} />
                    Xưởng chế tạo
                  </div>
                  <h2 className="text-3xl font-black italic tracking-tight">Nguyên liệu kiến thức</h2>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <Package className="mb-2 text-emerald-300" size={18} />
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Nguyên liệu</p>
                  <p className="text-2xl font-black">{inventory.ingredients.reduce((sum, item) => sum + item.amount, 0)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <FlaskConical className="mb-2 text-blue-300" size={18} />
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Đã sở hữu</p>
                  <p className="text-2xl font-black">{ownedCount}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <Sparkles className="mb-2 text-amber-300" size={18} />
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Công thức</p>
                  <p className="text-2xl font-black">{craftableItems.length}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-6 custom-scrollbar">
              {notice && (
                <div className={`rounded-2xl border p-4 text-sm font-bold ${
                  notice.type === 'success'
                    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100'
                    : 'border-rose-400/30 bg-rose-400/10 text-rose-100'
                }`}>
                  {notice.text}
                </div>
              )}

              <section>
                <h3 className="mb-3 text-[11px] font-black uppercase tracking-[0.24em] text-white/40">Kho hiện có</h3>
                {ingredients.filter((ing) => (ingredientAmounts[ing.id] || 0) > 0).length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {ingredients
                      .filter((ing) => (ingredientAmounts[ing.id] || 0) > 0)
                      .map((ingredient) => (
                        <div key={ingredient.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                          <ElementSphere symbol={ingredient.formula} size="md" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[11px] font-black text-white">{ingredient.name}</p>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-white/35">{ingredient.formula}</p>
                          </div>
                          <span className="rounded-lg bg-white px-2 py-1 text-xs font-black text-slate-900">{ingredientAmounts[ingredient.id]}</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-sm font-semibold text-white/35">
                    Kho nguyên liệu đang trống. Hãy hoàn thành bài học và câu hỏi thử thách để tích lũy nguyên liệu kiến thức!
                  </div>
                )}
              </section>

              <section>
                <h3 className="mb-3 text-[11px] font-black uppercase tracking-[0.24em] text-white/40">Công thức chế tạo</h3>
                <div className="space-y-3">
                  {craftableItems.map((item) => {
                    const status = canCraftItem(item, inventory);
                    const alreadyOwned = status.alreadyCrafted || unlockedChemicalsSet.has(toAsciiFormula(item.formula).toUpperCase());
                    const requirementCounts = getRecipeRequirementCounts(item);
                    const rarity = rarityConfig[item.rarity] || rarityConfig.common;

                    return (
                      <div key={item.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                        <div className="mb-3 flex items-start justify-between gap-4">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-b from-white/10 to-white/[0.02] shadow-inner transition-transform duration-300 hover:scale-110 ${
                              item.rarity === 'legendary' ? 'border-amber-500/30 shadow-amber-500/5' :
                              item.rarity === 'rare' ? 'border-purple-500/30 shadow-purple-500/5' :
                              item.rarity === 'uncommon' ? 'border-blue-500/30 shadow-blue-500/5' : 'border-white/10'
                            }`}>
                              <MoleculeModel formula={item.formula} size="md" />
                            </div>
                            <div className="min-w-0">
                              <div className="mb-1 flex flex-wrap items-center gap-2">
                                <h4 className="text-base font-black leading-tight text-white">{item.name}</h4>
                                <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${rarity.color}`}>
                                  {rarity.label}
                                </span>
                              </div>
                              <p className="text-2xl font-black italic text-emerald-300">{formatFormula(toAsciiFormula(item.formula))}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => craftItem(item)}
                            disabled={loading || craftingId === item.id || alreadyOwned || !status.canCraft}
                            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
                          >
                            {alreadyOwned ? <CheckCircle2 size={16} /> : status.canCraft ? <Hammer size={16} /> : <LockKeyhole size={16} />}
                            {alreadyOwned ? 'Đã có' : craftingId === item.id ? 'Đang tạo' : 'Chế tạo'}
                          </button>
                        </div>

                        <p className="mb-3 text-sm font-medium leading-relaxed text-white/65">{item.description}</p>

                        <div className="flex flex-wrap gap-2">
                          {Object.entries(requirementCounts).map(([ingredientId, amount]) => {
                            const ingredient = ingredients.find((candidate) => candidate.id === ingredientId);
                            const available = ingredientAmounts[ingredientId] || 0;
                            const enough = available >= amount;
                            return (
                              <span
                                key={ingredientId}
                                className={`rounded-xl border px-2.5 py-1.5 text-[10px] font-black ${
                                  enough
                                    ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-100'
                                    : 'border-rose-400/25 bg-rose-400/10 text-rose-100'
                                }`}
                              >
                                <ElementSphere symbol={ingredient?.formula || ingredientId} size="sm" />
                                <span className="ml-1.5">{ingredient?.name || ingredientId}: {available}/{amount}</span>
                              </span>
                            );
                          })}
                          <span className="rounded-xl border border-amber-400/25 bg-amber-400/10 px-2.5 py-1.5 text-[10px] font-black text-amber-100">
                            +{item.xpReward} XP
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CraftingWorkbench;
