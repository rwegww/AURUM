import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initialInventory, recipes, getLevelFromXP } from '@/data/labInventory';

const CraftingStation = () => {
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('chem_lab_inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [xp, setXP] = useState(() => {
    const saved = localStorage.getItem('chem_lab_xp');
    return saved ? parseInt(saved) : 0;
  });

  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [craftingResult, setCraftingResult] = useState(null);
  const [isCrafting, setIsCrafting] = useState(false);

  useEffect(() => {
    localStorage.setItem('chem_lab_inventory', JSON.stringify(inventory));
    localStorage.setItem('chem_lab_xp', xp.toString());
  }, [inventory, xp]);

  const toggleIngredient = (item) => {
    if (selectedIngredients.some(i => i.id === item.id)) {
      setSelectedIngredients(selectedIngredients.filter(i => i.id !== item.id));
    } else if (selectedIngredients.length < 3) {
      setSelectedIngredients([...selectedIngredients, item]);
    }
  };

  const handleCraft = () => {
    if (selectedIngredients.length < 2) return;
    setIsCrafting(true);
    setCraftingResult(null);

    setTimeout(() => {
      const ingredientIds = selectedIngredients.map(i => i.id).sort();
      const recipe = recipes.find(r => 
        r.ingredients.length === ingredientIds.length && 
        r.ingredients.every((ing, idx) => ing === ingredientIds[idx])
      );

      if (recipe) {
        // Success
        setInventory(prev => {
          const next = [...prev];
          const productIdx = next.findIndex(i => i.id === recipe.productId);
          if (productIdx !== -1) {
            next[productIdx] = { ...next[productIdx], amount: (next[productIdx].amount || 0) + 1 };
          }
          return next;
        });
        setXP(prev => prev + 50);
        setCraftingResult({ success: true, product: recipe.productName, xp: 50 });
      } else {
        // Failure
        setCraftingResult({ success: false, message: "Kết hợp này không tạo ra chất mới!" });
        setXP(prev => Math.max(0, prev + 5)); // Small consolation XP
      }
      setIsCrafting(false);
      setSelectedIngredients([]);
    }, 2000);
  };

  const levelInfo = getLevelFromXP(xp);

  return (
    <div className="space-y-8">
      {/* Player Stats */}
      <div className="bg-white rounded-[28px] border border-viet-border p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-viet-green border-[4px] border-viet-green/20 flex items-center justify-center text-white text-2xl font-black">
            {levelInfo.level}
          </div>
          <div>
            <h3 className="text-xl font-black text-viet-text leading-none">{levelInfo.title}</h3>
            <p className="text-[11px] font-bold text-viet-green uppercase tracking-widest mt-1">Cấp độ thông thái</p>
          </div>
        </div>
        <div className="flex-1 max-w-sm ml-8">
          <div className="flex justify-between text-[11px] font-black text-viet-text-light uppercase mb-2">
            <span>Kinh nghiệm: {xp} XP</span>
            <span>{levelInfo.nextLevelXP} XP</span>
          </div>
          <div className="w-full h-3 bg-[#f0f2f5] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-viet-green to-[#98d65a]"
              initial={{ width: 0 }}
              animate={{ width: `${(xp / levelInfo.nextLevelXP) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inventory */}
        <div className="bg-white rounded-[28px] border border-viet-border p-6 shadow-sm">
          <h3 className="text-[12px] font-black text-viet-green uppercase tracking-widest mb-6 border-b border-viet-border pb-3 flex items-center justify-between">
            Túi nguyên liệu
            <span className="text-[10px] font-bold text-viet-text-light normal-case">Chọn 2-3 chất để chế tạo</span>
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {inventory.map(item => {
              const isSelected = selectedIngredients.some(i => i.id === item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleIngredient(item)}
                  className={`aspect-square p-2 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 group overflow-hidden relative ${
                    isSelected 
                      ? 'bg-viet-green/10 border-viet-green shadow-lg scale-105' 
                      : 'bg-white border-viet-border hover:border-viet-green/30'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-viet-green rounded-full flex items-center justify-center">
                       <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                       </svg>
                    </div>
                  )}
                  <span className="text-2xl group-hover:scale-110 transition-transform">{item.symbol}</span>
                  <span className="text-[10px] font-black text-viet-text tracking-tight">{item.formula}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Crafting Area */}
        <div className="bg-white rounded-[28px] border border-viet-border p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-viet-green opacity-[0.03] rounded-bl-full"></div>
           
           <h3 className="text-[12px] font-black text-viet-green uppercase tracking-widest mb-8">Trạm chế tạo</h3>
           
           <div className="flex gap-4 mb-10 items-center justify-center h-20">
              {selectedIngredients.length > 0 ? (
                selectedIngredients.map((ing, idx) => (
                  <motion.div 
                    key={ing.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-2xl bg-viet-green/5 border border-viet-green/20 flex flex-col items-center justify-center text-viet-green relative"
                  >
                    <span className="text-xl">{ing.symbol}</span>
                    <span className="text-[9px] font-black">{ing.formula}</span>
                    {idx < selectedIngredients.length - 1 && (
                      <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-viet-text-light font-black">+</span>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-viet-text-light/40 text-[13px] font-bold italic">Kéo thả hoặc chọn nguyên liệu</div>
              )}
           </div>

           <button
             onClick={handleCraft}
             disabled={selectedIngredients.length < 2 || isCrafting}
             className={`px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-[14px] transition-all ${
               selectedIngredients.length >= 2 && !isCrafting
                 ? 'viet-btn-green shadow-xl shadow-viet-green/20 scale-105'
                 : 'bg-[#f0f2f5] text-viet-text-light cursor-not-allowed opacity-50'
             }`}
           >
             {isCrafting ? 'Đang thực hiện...' : 'Bắt đầu tổng hợp'}
           </button>

           {/* Crafting Animation Cover */}
           <AnimatePresence>
             {isCrafting && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center"
                >
                   <div className="relative">
                      {/* Animated Laboratory Beakers */}
                      <div className="text-6xl animate-bounce">⚗️</div>
                      <div className="absolute -top-4 -right-4 w-6 h-6 rounded-full bg-viet-green animate-ping"></div>
                      <p className="mt-4 text-[13px] font-black text-viet-green uppercase tracking-widest">Đang pha trộn...</p>
                   </div>
                </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {craftingResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`rounded-[32px] p-8 border-2 flex flex-col items-center text-center shadow-2xl ${
              craftingResult.success 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-orange-50 border-orange-200'
            }`}
          >
            {craftingResult.success ? (
              <>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-2xl font-black text-emerald-700 mb-2">Thủ thuật thành công!</h3>
                <p className="text-viet-text font-bold text-lg mb-4">
                  Bạn đã chế tạo ra <span className="text-emerald-700 underline decoration-2">{craftingResult.product}</span>
                </p>
                <div className="px-6 py-2 bg-emerald-700 text-white rounded-full font-black text-[12px] uppercase">
                  +{craftingResult.xp} XP Kinh nghiệm
                </div>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">💥</div>
                <h3 className="text-2xl font-black text-orange-700 mb-2">Không có kết quả!</h3>
                <p className="text-viet-text font-bold mb-4">{craftingResult.message}</p>
                <div className="px-6 py-2 bg-orange-700 text-white rounded-full font-black text-[12px] uppercase">
                  +5 XP (Công lao thử nghiệm)
                </div>
              </>
            )}
            <button 
              onClick={() => setCraftingResult(null)}
              className="mt-8 text-viet-text-light font-black text-[13px] uppercase tracking-widest hover:text-viet-text"
            >
              Đóng thông báo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CraftingStation;
