import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CHEM_FORMULAS, QUICK_FORMULAS, UNIT_CONVERSIONS } from '@/data/chemFormulas';
import { UniversalFormulaSim } from '@/components/simulations';

const CATEGORY_ICONS = {
  basic: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ),
  concentration: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.054.585M8 6h8l1 3H7l1-3zM9 20h6a2 2 0 002-2V9H7v9a2 2 0 002 2z" />
    </svg>
  ),
  gases: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  ),
  reaction: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  advanced: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.054.585M8 6h8l1 3H7l1-3zM9 20h6a2 2 0 002-2V9H7v9a2 2 0 002 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11v4m0 0l-2-2m2 2l2-2" />
    </svg>
  ),
};

const ChemCalculator = () => {
  const [selectedGroup, setSelectedGroup] = useState('basic');
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState('experiment'); // Mặc định là chế độ mô phỏng mới
  const [showQuickRef, setShowQuickRef] = useState(false);

  const groupData = CHEM_FORMULAS[selectedGroup];

  const findFormulaById = useCallback((id) => {
    for (const group of Object.values(CHEM_FORMULAS)) {
      for (const cat of group.categories) {
        const found = cat.formulas.find(f => f.id === id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const handleSelectFormula = (formula) => {
    setSelectedFormula(formula);
    setInputValues({});
    setResult(null);
  };



  const handleInputChange = (key, value) => {
    setInputValues(prev => ({ ...prev, [key]: value === '' ? '' : value }));
  };

  const handleCalculate = () => {
    if (!selectedFormula) return;
    const vars = {};
    selectedFormula.variables.forEach(v => {
      vars[v.key] = inputValues[v.key] !== '' && inputValues[v.key] !== undefined ? parseFloat(inputValues[v.key]) : null;
    });
    const filledCount = Object.values(vars).filter(v => v !== null).length;
    if (filledCount < selectedFormula.variables.length - 1) {
      setResult({ error: `Vui lòng nhập ít nhất ${selectedFormula.variables.length - 1} giá trị.` });
      return;
    }
    const solved = selectedFormula.solve(vars);
    if (solved) {
      setResult({ success: true, values: solved });
    } else {
      setResult({ error: 'Không đủ dữ liệu hoặc công thức không hỗ trợ tổ hợp này.' });
    }
  };

  const handleClear = () => { setInputValues({}); setResult(null); };

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '—';
    if (Math.abs(num) >= 1e6 || (Math.abs(num) < 0.001 && num !== 0)) return num.toExponential(4);
    return parseFloat(num.toFixed(6)).toString();
  };

  return (
    <div className="min-h-screen bg-viet-bg pt-[70px]">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-8">
          <Link to="/lab" className="text-viet-green text-[10px] font-black uppercase tracking-widest hover:underline mb-2 inline-block">← Phòng thí nghiệm</Link>
          <h1 className="text-[32px] font-black text-viet-text">Máy tính Hóa học Vạn năng</h1>
          <p className="text-[14px] text-viet-text-light mt-1">Tính toán mọi công thức Hóa học, tích hợp Bảng Tuần Hoàn và mô phỏng trực quan.</p>
        </div>

        {/* Cụm Nút chức năng */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <button onClick={() => { setMode('experiment'); setSelectedFormula(null); setResult(null); }}
            className={`px-6 py-3 rounded-2xl text-[13px] font-black uppercase tracking-wider transition-all ${mode === 'experiment' ? 'bg-viet-green text-white shadow-lg shadow-viet-green/20' : 'bg-white text-viet-text-light border-2 border-viet-border hover:border-viet-green/30'}`}>
            🔬 Mô phỏng tương tác
          </button>
          <button onClick={() => { setMode('simple'); setSelectedFormula(null); setResult(null); }}
            className={`px-6 py-3 rounded-2xl text-[13px] font-black uppercase tracking-wider transition-all ${mode === 'simple' ? 'bg-viet-green text-white shadow-lg shadow-viet-green/20' : 'bg-white text-viet-text-light border-2 border-viet-border hover:border-viet-green/30'}`}>
            🧮 Tính nhanh (Cơ bản)
          </button>
          <button onClick={() => setShowQuickRef(!showQuickRef)}
            className={`px-6 py-3 rounded-2xl text-[13px] font-black uppercase tracking-wider transition-all ml-auto ${showQuickRef ? 'bg-amber-500 text-white' : 'bg-white text-viet-text-light border-2 border-viet-border'}`}>
            📋 Bảng tra cứu & Đổi đơn vị
          </button>
        </div>

        <AnimatePresence>
          {showQuickRef && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-8">
              <div className="viet-card p-6">
                <h3 className="text-[14px] font-black text-viet-text uppercase tracking-wider mb-4">Đổi đơn vị thường gặp</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {UNIT_CONVERSIONS.map((u, i) => (
                    <div key={i} className="bg-viet-bg rounded-xl p-3 text-center border border-viet-border">
                      <span className="text-[12px] font-bold text-viet-text">{u.from}</span>
                      <span className="text-[11px] text-viet-text-light mx-2">=</span>
                      <span className="text-[12px] font-bold text-viet-green">{u.to}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CỘT TRÁI - Danh sách Công thức */}
          <div className="lg:col-span-4 space-y-4">
            <div className="viet-card p-4">
              <h3 className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px] mb-3">Phân loại theo Nhóm</h3>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(CHEM_FORMULAS).map(([key, data]) => (
                  <button key={key} onClick={() => { setSelectedGroup(key); setSelectedFormula(null); setResult(null); }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${selectedGroup === key ? 'bg-viet-green text-white shadow-lg shadow-viet-green/20' : 'bg-viet-bg text-viet-text-light hover:bg-viet-green/10'}`}>
                    <div className={`${selectedGroup === key ? 'text-white' : 'text-viet-green'}`}>
                      {CATEGORY_ICONS[key] || data.icon}
                    </div>
                    <span className="text-[9px] font-black text-center leading-tight h-[24px] flex items-center">{data.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>



            <div className="viet-card p-4">
              <h3 className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px] mb-3">{groupData?.label} — Danh mục</h3>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {groupData?.categories.map((cat, ci) => (
                  <div key={ci}>
                    <h4 className="text-[11px] font-black text-viet-text uppercase tracking-wide mb-2 px-1 opacity-50">{cat.name}</h4>
                    <div className="space-y-1.5">
                      {cat.formulas.map(f => (
                        <button key={f.id} onClick={() => handleSelectFormula(f)}
                          className={`w-full text-left p-3 rounded-xl transition-all ${selectedFormula?.id === f.id ? 'bg-viet-green border-2 border-viet-green shadow-lg text-white' : 'bg-viet-bg hover:bg-viet-green/10 border-2 border-transparent text-viet-text'}`}>
                          <div className={`text-[12px] font-bold ${selectedFormula?.id === f.id ? 'text-white' : ''}`}>{f.name}</div>
                          <div className={`text-[11px] font-black mt-0.5 ${selectedFormula?.id === f.id ? 'text-green-100' : 'text-viet-green'}`}>{f.formula}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI - Khu vực tính toán & Mô phỏng */}
          <div className="lg:col-span-8">
            {!selectedFormula ? (
              <div className="viet-card p-12 text-center flex flex-col items-center justify-center min-h-[500px]">
                <div className="text-[64px] mb-6">
                  {mode === 'experiment' ? '🔬' : '🧮'}
                </div>
                <h2 className="text-[22px] font-black text-viet-text mb-3">Chọn một công thức hóa học</h2>
                <p className="text-[14px] text-viet-text-light max-w-md mx-auto leading-relaxed">
                  {mode === 'experiment' 
                    ? 'Trong chế độ Mô phỏng, bạn có thể tra cứu nhanh Khối lượng mol (M) từ Bảng Tuần Hoàn và xem ảnh động (animation) phản ánh trực quan kết quả tính toán.'
                    : 'Nhập số liệu vào các ô trống, hệ thống sẽ tự động giải giá trị còn lại bằng các phép biến đổi toán học.'}
                </p>
              </div>
            ) : (
              <motion.div key={selectedFormula.id + mode} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                
                {/* --- CHẾ ĐỘ MÔ PHỎNG TƯƠNG TÁC --- */}
                {mode === 'experiment' && (
                  <UniversalFormulaSim 
                    formula={selectedFormula}
                    inputValues={inputValues}
                    onInputChange={handleInputChange}
                    result={result}
                    onCalculate={handleCalculate}
                  />
                )}

                {/* --- CHẾ ĐỘ TÍNH NHANH (CƠ BẢN) --- */}
                {mode === 'simple' && (
                  <>
                    <div className="viet-card p-8 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-viet-green/5 to-transparent pointer-events-none" />
                      <div className="relative">
                        <h2 className="text-[14px] font-black text-viet-text-light uppercase tracking-wider mb-3">{selectedFormula.name}</h2>
                        <div className="text-[40px] font-black text-viet-text leading-none">{selectedFormula.formula}</div>
                      </div>
                    </div>

                    <div className="viet-card p-6">
                      <h3 className="text-[11px] font-black text-[#b4bac2] uppercase tracking-[2px] mb-4">Nhập giá trị đã biết (để trống ô cần tìm)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedFormula.variables.map(v => {
                          const isResult = result?.success && result.values[v.key] !== undefined;
                          return (
                            <div key={v.key}>
                              <label className="text-[11px] font-bold text-viet-text mb-1.5 block">{v.label}</label>
                              <div className="relative">
                                <input type="number" step="any"
                                  value={isResult ? formatNumber(result.values[v.key]) : (inputValues[v.key] ?? '')}
                                  onChange={(e) => handleInputChange(v.key, e.target.value)}
                                  readOnly={isResult} placeholder={`Nhập ${v.key}...`}
                                  className={`w-full h-[52px] rounded-2xl px-5 pr-16 text-[16px] font-bold outline-none transition-all ${isResult ? 'bg-viet-green/10 border-2 border-viet-green text-viet-green ring-4 ring-viet-green/10' : 'bg-viet-bg border-2 border-viet-border text-viet-text focus:border-viet-green focus:ring-4 focus:ring-viet-green/5'}`} />
                                <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-black uppercase ${isResult ? 'text-viet-green' : 'text-[#b4bac2]'}`}>{v.unit}</span>
                                {isResult && (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 w-6 h-6 bg-viet-green rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {result?.error && (
                        <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-[13px] font-bold text-red-600">⚠️ {result.error}</div>
                      )}
                      <div className="flex gap-3 mt-6">
                        <button onClick={handleCalculate} className="flex-1 h-[52px] bg-viet-green text-white rounded-2xl text-[14px] font-black uppercase tracking-wider hover:bg-[#5fa52e] transition-all shadow-lg shadow-viet-green/20 active:scale-[0.98]">Tính kết quả</button>
                        <button onClick={handleClear} className="h-[52px] px-6 bg-white border-2 border-viet-border text-viet-text-light rounded-2xl text-[14px] font-black uppercase tracking-wider hover:border-red-300 hover:text-red-500 transition-all active:scale-[0.98]">Xóa</button>
                      </div>
                    </div>

                    {result?.success && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="viet-card p-6 border-2 border-viet-green">
                        <h3 className="text-[11px] font-black text-viet-green uppercase tracking-[2px] mb-4">Kết quả phép tính</h3>
                        <div className="space-y-3">
                          {Object.entries(result.values).map(([key, val]) => {
                            const varInfo = selectedFormula.variables.find(v => v.key === key);
                            return (
                              <div key={key} className="flex items-center justify-between p-4 bg-viet-green/10 rounded-xl border border-viet-green/20">
                                <span className="text-[13px] font-bold text-viet-text uppercase tracking-wider">{varInfo?.label || key}</span>
                                <span className="text-[20px] font-black text-viet-green">{formatNumber(val)} <span className="text-[12px]">{varInfo?.unit}</span></span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChemCalculator;
