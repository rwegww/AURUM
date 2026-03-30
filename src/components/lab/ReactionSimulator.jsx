import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chemicals, findReaction, reactionTypes } from '@/data/reactions';

const ReactionSimulator = () => {
  const [selectedA, setSelectedA] = useState(null);
  const [selectedB, setSelectedB] = useState(null);
  const [result, setResult] = useState(null);
  const [isReacting, setIsReacting] = useState(false);
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = useMemo(() => {
    const cats = new Set(chemicals.map(c => c.category));
    return ['all', ...Array.from(cats)];
  }, []);

  const filteredChemicals = useMemo(() => {
    return chemicals.filter(c => {
      const matchCategory = filterCategory === 'all' || c.category === filterCategory;
      return matchCategory;
    });
  }, [filterCategory]);

  const searchFilterA = filteredChemicals.filter(c =>
    c.name.toLowerCase().includes(searchA.toLowerCase()) || c.formula.includes(searchA)
  );
  const searchFilterB = filteredChemicals.filter(c =>
    c.name.toLowerCase().includes(searchB.toLowerCase()) || c.formula.includes(searchB)
  );

  const handleReact = () => {
    if (!selectedA || !selectedB) return;
    setIsReacting(true);
    setResult(null);

    setTimeout(() => {
      const found = findReaction(selectedA.formula, selectedB.formula);
      setResult(found || 'no-reaction');
      setIsReacting(false);
    }, 1500);
  };

  const resetAll = () => {
    setSelectedA(null);
    setSelectedB(null);
    setResult(null);
    setSearchA('');
    setSearchB('');
  };

  const getStateIcon = (state) => {
    switch (state) {
      case 'gas': return '💨';
      case 'liquid': return '💧';
      case 'solid': return '🧱';
      default: return '⚗️';
    }
  };

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 bg-white/50 p-2 rounded-2xl border border-viet-border">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
              filterCategory === cat
                ? 'bg-viet-green text-white shadow-lg shadow-viet-green/20'
                : 'bg-white text-viet-text-light border border-viet-border hover:border-viet-green/30'
            }`}
          >
            {cat === 'all' ? 'Tất cả' : cat}
          </button>
        ))}
      </div>

      {/* Chemical Selection Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chemical A */}
        <div className="bg-white rounded-[28px] border border-viet-border p-6 shadow-sm">
          <h3 className="text-[13px] font-black text-viet-green uppercase tracking-widest mb-4">
            ⚗️ Chất tham gia 1
          </h3>
          <input
            type="text"
            value={searchA}
            onChange={(e) => setSearchA(e.target.value)}
            placeholder="Tìm hóa chất..."
            className="w-full h-[42px] bg-[#f8f9fa] border border-viet-border rounded-xl px-4 text-[13px] text-viet-text font-medium mb-4 outline-none focus:border-viet-green/50"
          />
          <div className="max-h-[200px] overflow-y-auto space-y-2 custom-scrollbar">
            {searchFilterA.map(chem => (
              <button
                key={chem.formula}
                onClick={() => { setSelectedA(chem); setSearchA(''); }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  selectedA?.formula === chem.formula
                    ? 'bg-viet-green/10 border-viet-green text-viet-green'
                    : 'bg-white border-viet-border hover:border-viet-green/30 text-viet-text'
                }`}
              >
                <span className="text-lg">{getStateIcon(chem.state)}</span>
                <div>
                  <span className="text-[14px] font-black">{chem.formula}</span>
                  <span className="text-[11px] text-viet-text-light ml-2 font-medium">{chem.name}</span>
                </div>
              </button>
            ))}
          </div>
          {selectedA && (
            <div className="mt-4 p-4 bg-viet-green/5 rounded-2xl border border-viet-green/10 text-center">
              <span className="text-2xl font-black text-viet-green">{selectedA.formula}</span>
              <p className="text-[11px] text-viet-text-light font-bold mt-1">{selectedA.name}</p>
            </div>
          )}
        </div>

        {/* Chemical B */}
        <div className="bg-white rounded-[28px] border border-viet-border p-6 shadow-sm">
          <h3 className="text-[13px] font-black text-viet-green uppercase tracking-widest mb-4">
            🧪 Chất tham gia 2
          </h3>
          <input
            type="text"
            value={searchB}
            onChange={(e) => setSearchB(e.target.value)}
            placeholder="Tìm hóa chất..."
            className="w-full h-[42px] bg-[#f8f9fa] border border-viet-border rounded-xl px-4 text-[13px] text-viet-text font-medium mb-4 outline-none focus:border-viet-green/50"
          />
          <div className="max-h-[200px] overflow-y-auto space-y-2 custom-scrollbar">
            {searchFilterB.map(chem => (
              <button
                key={chem.formula}
                onClick={() => { setSelectedB(chem); setSearchB(''); }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  selectedB?.formula === chem.formula
                    ? 'bg-viet-green/10 border-viet-green text-viet-green'
                    : 'bg-white border-viet-border hover:border-viet-green/30 text-viet-text'
                }`}
              >
                <span className="text-lg">{getStateIcon(chem.state)}</span>
                <div>
                  <span className="text-[14px] font-black">{chem.formula}</span>
                  <span className="text-[11px] text-viet-text-light ml-2 font-medium">{chem.name}</span>
                </div>
              </button>
            ))}
          </div>
          {selectedB && (
            <div className="mt-4 p-4 bg-viet-green/5 rounded-2xl border border-viet-green/10 text-center">
              <span className="text-2xl font-black text-viet-green">{selectedB.formula}</span>
              <p className="text-[11px] text-viet-text-light font-bold mt-1">{selectedB.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reaction Button */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleReact}
          disabled={!selectedA || !selectedB || isReacting}
          className={`px-12 py-4 rounded-2xl text-[16px] font-black uppercase tracking-wider transition-all ${
            selectedA && selectedB && !isReacting
              ? 'viet-btn-green shadow-2xl shadow-viet-green/20 hover:scale-105'
              : 'bg-[#f0f2f5] text-viet-text-light cursor-not-allowed'
          }`}
        >
          {isReacting ? (
            <span className="flex items-center gap-3">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang phản ứng...
            </span>
          ) : (
            '⚡ Tiến hành phản ứng'
          )}
        </button>
        {(selectedA || selectedB) && (
          <button
            onClick={resetAll}
            className="px-6 py-4 rounded-2xl text-[14px] font-bold text-viet-text-light border border-viet-border hover:border-red-300 hover:text-red-500 transition-all"
          >
            Đặt lại
          </button>
        )}
      </div>

      {/* Reaction Animation & Result */}
      <AnimatePresence>
        {isReacting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-12"
          >
            <div className="relative">
              {/* Animated bubbles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-viet-green/40"
                  initial={{ x: 0, y: 0, scale: 0 }}
                  animate={{
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
                  style={{ left: '50%', top: '50%' }}
                />
              ))}
              <div className="w-24 h-24 bg-viet-green/20 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-4xl">⚡</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && !isReacting && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {result === 'no-reaction' ? (
              <div className="bg-orange-50 border border-orange-200 rounded-[28px] p-8 text-center">
                <div className="text-5xl mb-4">🚫</div>
                <h3 className="text-xl font-black text-orange-600 mb-2">Không có phản ứng xảy ra</h3>
                <p className="text-viet-text-light font-medium">
                  Hai chất <strong>{selectedA?.formula}</strong> và <strong>{selectedB?.formula}</strong> không phản ứng với nhau trong điều kiện thông thường.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-[28px] border border-viet-green/20 p-8 shadow-xl shadow-viet-green/5">
                {/* Success Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-viet-green/10 rounded-full flex items-center justify-center">
                    <span className="text-3xl">✅</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-viet-text">{result.name}</h3>
                    <span className="text-[11px] font-bold text-viet-green uppercase tracking-widest">
                      {reactionTypes[result.type] || result.type}
                    </span>
                  </div>
                </div>

                {/* Equation */}
                <div className="bg-[#fdfaf1] rounded-2xl p-6 border border-viet-border mb-6">
                  <p className="text-[11px] font-black text-viet-text-light uppercase tracking-widest mb-2">Phương trình</p>
                  <p className="text-2xl font-black text-viet-text text-center py-2">{result.equation}</p>
                </div>

                {/* Products */}
                <div className="mb-6">
                  <p className="text-[11px] font-black text-viet-text-light uppercase tracking-widest mb-3">Sản phẩm tạo thành</p>
                  <div className="flex flex-wrap gap-3">
                    {result.products.map((p, i) => (
                      <div key={i} className="px-5 py-3 bg-viet-green/5 rounded-2xl border border-viet-green/10">
                        <span className="text-lg font-black text-viet-green">{p.formula}</span>
                        <span className="text-[12px] text-viet-text-light ml-2 font-medium">{p.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conditions & Observation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-200/50">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Điều kiện</p>
                    <p className="text-[14px] font-bold text-viet-text">{result.conditions}</p>
                  </div>
                  <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-200/50">
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Hiện tượng quan sát</p>
                    <p className="text-[14px] font-bold text-viet-text">{result.observation}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReactionSimulator;
