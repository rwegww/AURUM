import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CHEM_FORMULAS, QUICK_FORMULAS, UNIT_CONVERSIONS } from '@/data/chemFormulas';
import { CHEM_SIMULATIONS } from '@/data/chemExperiments';
import { MolaritySim, pHScaleSim, GasLawSim, DensitySim } from '@/components/simulations';

const SIM_COMPONENTS = {
  MolaritySim: <MolaritySim />,
  pHScaleSim: <pHScaleSim />,
  GasLawSim: <GasLawSim />,
  DensitySim: <DensitySim />
};

const ChemCalculator = () => {
  const [selectedGrade, setSelectedGrade] = useState(8);
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState('simple');
  const [showQuickRef, setShowQuickRef] = useState(false);
  const [activeSim, setActiveSim] = useState(null);

  const gradeData = CHEM_FORMULAS[selectedGrade];

  const findFormulaById = useCallback((id) => {
    for (const grade of Object.values(CHEM_FORMULAS)) {
      for (const cat of grade.categories) {
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

  const handleQuickSelect = (quick) => {
    setSelectedGrade(quick.grade);
    const formula = findFormulaById(quick.id);
    if (formula) handleSelectFormula(formula);
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

  const gradeSims = CHEM_SIMULATIONS.filter(s => s.grade === selectedGrade);

  return (
    <div className="min-h-screen bg-viet-bg pt-[70px]">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-8">
          <Link to="/lab" className="text-viet-green text-[10px] font-black uppercase tracking-widest hover:underline mb-2 inline-block">← Phòng thí nghiệm</Link>
          <h1 className="text-[32px] font-black text-viet-text">Máy tính Hóa học</h1>
          <p className="text-[14px] text-viet-text-light mt-1">Nhập giá trị để tính toán hoặc thí nghiệm mô phỏng tương tác.</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[['simple', '🧮 Tính đơn giản'], ['experiment', '🔬 Thí nghiệm mô phỏng']].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); setSelectedFormula(null); setResult(null); setActiveSim(null); }}
              className={`px-6 py-3 rounded-2xl text-[13px] font-black uppercase tracking-wider transition-all ${mode === m ? 'bg-viet-green text-white shadow-lg shadow-viet-green/20' : 'bg-white text-viet-text-light border-2 border-viet-border hover:border-viet-green/30'}`}>
              {label}
            </button>
          ))}
          <button onClick={() => setShowQuickRef(!showQuickRef)}
            className={`px-6 py-3 rounded-2xl text-[13px] font-black uppercase tracking-wider transition-all ml-auto ${showQuickRef ? 'bg-amber-500 text-white' : 'bg-white text-viet-text-light border-2 border-viet-border'}`}>
            📋 Bảng tra cứu
          </button>
        </div>

        <AnimatePresence>
          {showQuickRef && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-8">
              <div className="viet-card p-6">
                <h3 className="text-[14px] font-black text-viet-text uppercase tracking-wider mb-4">Đổi đơn vị thường gặp</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {UNIT_CONVERSIONS.map((u, i) => (
                    <div key={i} className="bg-viet-bg rounded-xl p-3 text-center">
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

        {/* ==================== SIMPLE MODE ==================== */}
        {mode === 'simple' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <div className="viet-card p-4 mb-4">
                <h3 className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px] mb-3">Chọn lớp</h3>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(CHEM_FORMULAS).map(([grade, data]) => (
                    <button key={grade} onClick={() => { setSelectedGrade(parseInt(grade)); setSelectedFormula(null); setResult(null); }}
                      className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${selectedGrade === parseInt(grade) ? 'bg-viet-green text-white shadow-lg shadow-viet-green/20' : 'bg-viet-bg text-viet-text-light hover:bg-viet-green/5'}`}>
                      <span className="text-[18px]">{data.icon}</span>
                      <span className="text-[10px] font-black">{parseInt(grade)}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="viet-card p-4 mb-4">
                <h3 className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px] mb-3">Công thức hay dùng</h3>
                <div className="space-y-1.5">
                  {QUICK_FORMULAS.map(q => (
                    <button key={q.id} onClick={() => handleQuickSelect(q)}
                      className={`w-full text-left p-3 rounded-xl transition-all ${selectedFormula?.id === q.id ? 'bg-viet-green/10 border-2 border-viet-green' : 'bg-viet-bg hover:bg-viet-green/5 border-2 border-transparent'}`}>
                      <div className="text-[13px] font-black text-viet-text">{q.label}</div>
                      <div className="text-[10px] text-viet-text-light mt-0.5">{q.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="viet-card p-4">
                <h3 className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px] mb-3">{gradeData?.label} — Danh mục</h3>
                <div className="space-y-3">
                  {gradeData?.categories.map((cat, ci) => (
                    <div key={ci}>
                      <h4 className="text-[11px] font-black text-viet-text uppercase tracking-wide mb-2 px-1 opacity-50">{cat.name}</h4>
                      <div className="space-y-1">
                        {cat.formulas.map(f => (
                          <button key={f.id} onClick={() => handleSelectFormula(f)}
                            className={`w-full text-left p-3 rounded-xl transition-all ${selectedFormula?.id === f.id ? 'bg-viet-green/10 border-2 border-viet-green' : 'bg-viet-bg hover:bg-viet-green/5 border-2 border-transparent'}`}>
                            <div className="text-[12px] font-bold text-viet-text">{f.name}</div>
                            <div className="text-[11px] font-black text-viet-green mt-0.5">{f.formula}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              {!selectedFormula ? (
                <div className="viet-card p-12 text-center">
                  <div className="text-[64px] mb-4">🧮</div>
                  <h2 className="text-[22px] font-black text-viet-text mb-2">Chọn một công thức</h2>
                  <p className="text-[14px] text-viet-text-light max-w-md mx-auto">Chọn công thức từ danh sách bên trái để bắt đầu tính toán.</p>
                </div>
              ) : (
                <motion.div key={selectedFormula.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="viet-card p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-viet-green/3 to-transparent pointer-events-none" />
                    <div className="relative">
                      <h2 className="text-[14px] font-black text-viet-text-light uppercase tracking-wider mb-3">{selectedFormula.name}</h2>
                      <div className="text-[36px] font-black text-viet-text leading-none">{selectedFormula.formula}</div>
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
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 w-6 h-6 bg-viet-green rounded-full flex items-center justify-center">
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
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="viet-card p-6 border-2 border-viet-green/20">
                      <h3 className="text-[11px] font-black text-viet-green uppercase tracking-[2px] mb-3">Kết quả</h3>
                      <div className="space-y-2">
                        {Object.entries(result.values).map(([key, val]) => {
                          const varInfo = selectedFormula.variables.find(v => v.key === key);
                          return (
                            <div key={key} className="flex items-center justify-between p-3 bg-viet-green/5 rounded-xl">
                              <span className="text-[13px] font-bold text-viet-text">{varInfo?.label || key}</span>
                              <span className="text-[16px] font-black text-viet-green">{formatNumber(val)} {varInfo?.unit}</span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* ==================== EXPERIMENT MODE ==================== */}
        {mode === 'experiment' && (
          <div>
            {/* Grade Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {Object.entries(CHEM_FORMULAS).map(([grade, data]) => (
                <button key={grade} onClick={() => { setSelectedGrade(parseInt(grade)); setActiveSim(null); }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all ${selectedGrade === parseInt(grade) ? 'bg-viet-green text-white shadow-lg shadow-viet-green/20' : 'bg-white text-viet-text-light border-2 border-viet-border hover:border-viet-green/30'}`}>
                  <span className="text-[16px]">{data.icon}</span>
                  <span className="text-[12px] font-black">{data.label}</span>
                </button>
              ))}
            </div>

            {!activeSim ? (
              /* Simulation Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {gradeSims.map(sim => (
                  <motion.button key={sim.id} onClick={() => setActiveSim(sim)}
                    whileHover={{ y: -4 }}
                    className="viet-card p-6 text-left hover:shadow-xl transition-all border-2 border-transparent hover:border-viet-green/20 group">
                    <div className="text-[40px] mb-4">{sim.icon}</div>
                    <h3 className="text-[16px] font-black text-viet-text mb-2 group-hover:text-viet-green transition-colors">{sim.title}</h3>
                    <p className="text-[12px] text-viet-text-light leading-relaxed mb-4">{sim.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {sim.topics.map(t => (
                        <span key={t} className="text-[9px] font-black uppercase tracking-wider bg-viet-green/10 text-viet-green px-2 py-1 rounded-lg">{t}</span>
                      ))}
                    </div>
                  </motion.button>
                ))}
                {gradeSims.length === 0 && (
                  <div className="col-span-full viet-card p-12 text-center">
                    <div className="text-[48px] mb-4">🔍</div>
                    <h3 className="text-[18px] font-black text-viet-text mb-2">Chưa có mô phỏng</h3>
                    <p className="text-[13px] text-viet-text-light">Các thí nghiệm mô phỏng cho lớp này đang được cập nhật.</p>
                  </div>
                )}
              </div>
            ) : (
              /* Active Simulation */
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-4 mb-6">
                  <button onClick={() => setActiveSim(null)}
                    className="flex items-center gap-2 text-viet-green text-[11px] font-black uppercase tracking-widest hover:underline">
                    ← Quay lại danh sách
                  </button>
                </div>

                <div className="viet-card overflow-hidden">
                  {/* Sim Header */}
                  <div className="p-6 border-b border-viet-border bg-gradient-to-r from-viet-green/5 to-transparent">
                    <div className="flex items-center gap-4">
                      <span className="text-[36px]">{activeSim.icon}</span>
                      <div>
                        <h2 className="text-[20px] font-black text-viet-text">{activeSim.title}</h2>
                        <p className="text-[12px] text-viet-text-light mt-1">{activeSim.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {activeSim.topics.map(t => (
                        <span key={t} className="text-[9px] font-black uppercase tracking-wider bg-viet-green/10 text-viet-green px-2 py-1 rounded-lg">{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Simulation Component */}
                  <div className="p-6">
                    {SIM_COMPONENTS[activeSim.component] || (
                      <div className="p-8 text-center text-viet-text-light">
                        Đang phát triển mô phỏng này...
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-viet-bg/30 border-t border-viet-border flex items-center justify-between">
                    <p className="text-[10px] text-viet-text-light">
                      Mô phỏng phát triển độc quyền bởi <span className="font-bold text-viet-green">Chemistry Odyssey</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChemCalculator;
