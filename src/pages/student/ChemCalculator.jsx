import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CHEM_FORMULAS, QUICK_FORMULAS, UNIT_CONVERSIONS } from '@/data/chemFormulas';

const ChemCalculator = () => {
  const [selectedGrade, setSelectedGrade] = useState(8);
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState('simple'); // 'simple' | 'experiment'
  const [experimentSteps, setExperimentSteps] = useState([]);
  const [showQuickRef, setShowQuickRef] = useState(false);

  const gradeData = CHEM_FORMULAS[selectedGrade];

  // Find a formula by ID across all grades
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
    setExperimentSteps([]);
  };

  const handleQuickSelect = (quick) => {
    setSelectedGrade(quick.grade);
    const formula = findFormulaById(quick.id);
    if (formula) handleSelectFormula(formula);
  };

  const handleInputChange = (key, value) => {
    const newValues = { ...inputValues, [key]: value === '' ? '' : value };
    setInputValues(newValues);
  };

  const handleCalculate = () => {
    if (!selectedFormula) return;
    
    const vars = {};
    selectedFormula.variables.forEach(v => {
      vars[v.key] = inputValues[v.key] !== '' && inputValues[v.key] !== undefined 
        ? parseFloat(inputValues[v.key]) 
        : null;
    });

    const filledCount = Object.values(vars).filter(v => v !== null).length;
    const totalVars = selectedFormula.variables.length;
    
    if (filledCount < totalVars - 1) {
      setResult({ error: `Vui lòng nhập ít nhất ${totalVars - 1} giá trị để tính toán.` });
      return;
    }

    const solved = selectedFormula.solve(vars);
    if (solved) {
      setResult({ success: true, values: solved });
      
      // Add to experiment steps if in experiment mode
      if (mode === 'experiment') {
        setExperimentSteps(prev => [...prev, {
          formula: selectedFormula.formula,
          inputs: { ...inputValues },
          output: solved,
          timestamp: Date.now(),
        }]);
      }
    } else {
      setResult({ error: 'Không đủ dữ liệu hoặc công thức không hỗ trợ tổ hợp này.' });
    }
  };

  const handleClear = () => {
    setInputValues({});
    setResult(null);
  };

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '—';
    if (Math.abs(num) >= 1e6 || (Math.abs(num) < 0.001 && num !== 0)) {
      return num.toExponential(4);
    }
    return parseFloat(num.toFixed(6)).toString();
  };

  return (
    <div className="min-h-screen bg-viet-bg pt-[70px]">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link to="/lab" className="text-viet-green text-[10px] font-black uppercase tracking-widest hover:underline">
              ← Phòng thí nghiệm
            </Link>
          </div>
          <h1 className="text-[32px] font-black text-viet-text leading-tight">
            Máy tính Hóa học
          </h1>
          <p className="text-[14px] text-viet-text-light mt-1">
            Nhập các giá trị đã biết, hệ thống sẽ tính giá trị còn lại cho bạn.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setMode('simple')}
            className={`px-6 py-3 rounded-2xl text-[13px] font-black uppercase tracking-wider transition-all ${
              mode === 'simple'
                ? 'bg-viet-green text-white shadow-lg shadow-viet-green/20'
                : 'bg-white text-viet-text-light border-2 border-viet-border hover:border-viet-green/30'
            }`}
          >
            🧮 Tính đơn giản
          </button>
          <button
            onClick={() => setMode('experiment')}
            className={`px-6 py-3 rounded-2xl text-[13px] font-black uppercase tracking-wider transition-all ${
              mode === 'experiment'
                ? 'bg-viet-green text-white shadow-lg shadow-viet-green/20'
                : 'bg-white text-viet-text-light border-2 border-viet-border hover:border-viet-green/30'
            }`}
          >
            🔬 Thí nghiệm
          </button>
          <button
            onClick={() => setShowQuickRef(!showQuickRef)}
            className={`px-6 py-3 rounded-2xl text-[13px] font-black uppercase tracking-wider transition-all ml-auto ${
              showQuickRef
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                : 'bg-white text-viet-text-light border-2 border-viet-border hover:border-amber-400/30'
            }`}
          >
            📋 Bảng tra cứu
          </button>
        </div>

        {/* Quick Reference Panel */}
        <AnimatePresence>
          {showQuickRef && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Grade & Formula Selection */}
          <div className="lg:col-span-4">
            {/* Grade Tabs */}
            <div className="viet-card p-4 mb-4">
              <h3 className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px] mb-3">Chọn lớp</h3>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(CHEM_FORMULAS).map(([grade, data]) => (
                  <button
                    key={grade}
                    onClick={() => { setSelectedGrade(parseInt(grade)); setSelectedFormula(null); setResult(null); }}
                    className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${
                      selectedGrade === parseInt(grade)
                        ? 'bg-viet-green text-white shadow-lg shadow-viet-green/20'
                        : 'bg-viet-bg text-viet-text-light hover:bg-viet-green/5 hover:text-viet-green'
                    }`}
                  >
                    <span className="text-[18px]">{data.icon}</span>
                    <span className="text-[10px] font-black">{parseInt(grade)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Formulas */}
            <div className="viet-card p-4 mb-4">
              <h3 className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px] mb-3">Công thức hay dùng</h3>
              <div className="space-y-1.5">
                {QUICK_FORMULAS.map(q => (
                  <button
                    key={q.id}
                    onClick={() => handleQuickSelect(q)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedFormula?.id === q.id
                        ? 'bg-viet-green/10 border-2 border-viet-green'
                        : 'bg-viet-bg hover:bg-viet-green/5 border-2 border-transparent'
                    }`}
                  >
                    <div className="text-[13px] font-black text-viet-text">{q.label}</div>
                    <div className="text-[10px] text-viet-text-light mt-0.5">{q.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Formula Categories */}
            <div className="viet-card p-4">
              <h3 className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px] mb-3">
                {gradeData?.label} — Danh mục
              </h3>
              <div className="space-y-3">
                {gradeData?.categories.map((cat, catIdx) => (
                  <div key={catIdx}>
                    <h4 className="text-[11px] font-black text-viet-text uppercase tracking-wide mb-2 px-1 opacity-50">
                      {cat.name}
                    </h4>
                    <div className="space-y-1">
                      {cat.formulas.map(f => (
                        <button
                          key={f.id}
                          onClick={() => handleSelectFormula(f)}
                          className={`w-full text-left p-3 rounded-xl transition-all ${
                            selectedFormula?.id === f.id
                              ? 'bg-viet-green/10 border-2 border-viet-green'
                              : 'bg-viet-bg hover:bg-viet-green/5 border-2 border-transparent'
                          }`}
                        >
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

          {/* Right Panel - Calculator */}
          <div className="lg:col-span-8">
            {!selectedFormula ? (
              /* Empty State */
              <div className="viet-card p-12 text-center">
                <div className="text-[64px] mb-4">🧮</div>
                <h2 className="text-[22px] font-black text-viet-text mb-2">Chọn một công thức</h2>
                <p className="text-[14px] text-viet-text-light max-w-md mx-auto">
                  Chọn công thức từ danh sách bên trái hoặc từ mục "Công thức hay dùng" để bắt đầu tính toán.
                </p>
              </div>
            ) : (
              /* Calculator Interface */
              <motion.div
                key={selectedFormula.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Formula Display */}
                <div className="viet-card p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-viet-green/3 to-transparent pointer-events-none" />
                  <div className="relative">
                    <h2 className="text-[14px] font-black text-viet-text-light uppercase tracking-wider mb-3">
                      {selectedFormula.name}
                    </h2>
                    <div className="text-[36px] font-black text-viet-text leading-none tracking-tight">
                      {selectedFormula.formula}
                    </div>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="viet-card p-6">
                  <h3 className="text-[11px] font-black text-[#b4bac2] uppercase tracking-[2px] mb-4">
                    Nhập giá trị đã biết (để trống ô cần tìm)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedFormula.variables.map(v => {
                      const isResult = result?.success && result.values[v.key] !== undefined;
                      return (
                        <div key={v.key} className="relative">
                          <label className="text-[11px] font-bold text-viet-text mb-1.5 block">
                            {v.label}
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              step="any"
                              value={isResult ? formatNumber(result.values[v.key]) : (inputValues[v.key] ?? '')}
                              onChange={(e) => handleInputChange(v.key, e.target.value)}
                              readOnly={isResult}
                              placeholder={`Nhập ${v.key}...`}
                              className={`w-full h-[52px] rounded-2xl px-5 pr-16 text-[16px] font-bold outline-none transition-all ${
                                isResult
                                  ? 'bg-viet-green/10 border-2 border-viet-green text-viet-green ring-4 ring-viet-green/10'
                                  : 'bg-viet-bg border-2 border-viet-border text-viet-text focus:border-viet-green focus:ring-4 focus:ring-viet-green/5'
                              }`}
                            />
                            <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-black uppercase ${
                              isResult ? 'text-viet-green' : 'text-[#b4bac2]'
                            }`}>
                              {v.unit}
                            </span>
                            {isResult && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-viet-green rounded-full flex items-center justify-center"
                              >
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Error Message */}
                  {result?.error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-[13px] font-bold text-red-600"
                    >
                      ⚠️ {result.error}
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleCalculate}
                      className="flex-1 h-[52px] bg-viet-green text-white rounded-2xl text-[14px] font-black uppercase tracking-wider hover:bg-[#5fa52e] transition-all shadow-lg shadow-viet-green/20 active:scale-[0.98]"
                    >
                      Tính kết quả
                    </button>
                    <button
                      onClick={handleClear}
                      className="h-[52px] px-6 bg-white border-2 border-viet-border text-viet-text-light rounded-2xl text-[14px] font-black uppercase tracking-wider hover:border-red-300 hover:text-red-500 transition-all active:scale-[0.98]"
                    >
                      Xóa
                    </button>
                  </div>
                </div>

                {/* Result Summary (for experiment mode) */}
                {result?.success && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="viet-card p-6 border-2 border-viet-green/20"
                  >
                    <h3 className="text-[11px] font-black text-viet-green uppercase tracking-[2px] mb-3">Kết quả</h3>
                    <div className="space-y-2">
                      {Object.entries(result.values).map(([key, val]) => {
                        const varInfo = selectedFormula.variables.find(v => v.key === key);
                        return (
                          <div key={key} className="flex items-center justify-between p-3 bg-viet-green/5 rounded-xl">
                            <span className="text-[13px] font-bold text-viet-text">{varInfo?.label || key}</span>
                            <span className="text-[16px] font-black text-viet-green">
                              {formatNumber(val)} {varInfo?.unit}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Experiment Steps Log */}
            {mode === 'experiment' && experimentSteps.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="viet-card p-6 mt-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-black text-[#b4bac2] uppercase tracking-[2px]">
                    Nhật ký thí nghiệm ({experimentSteps.length} bước)
                  </h3>
                  <button
                    onClick={() => setExperimentSteps([])}
                    className="text-[10px] font-black text-red-400 uppercase tracking-wider hover:text-red-600 transition-colors"
                  >
                    Xóa tất cả
                  </button>
                </div>
                <div className="space-y-3">
                  {experimentSteps.map((step, i) => (
                    <div key={step.timestamp} className="p-4 bg-viet-bg rounded-2xl border border-viet-border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-7 h-7 rounded-xl bg-viet-green/10 flex items-center justify-center text-[11px] font-black text-viet-green">
                          {i + 1}
                        </div>
                        <span className="text-[13px] font-black text-viet-text">{step.formula}</span>
                      </div>
                      <div className="ml-10 grid grid-cols-2 gap-2">
                        {Object.entries(step.inputs).filter(([, v]) => v !== '').map(([key, val]) => (
                          <div key={key} className="text-[11px]">
                            <span className="font-bold text-viet-text-light">{key}:</span>{' '}
                            <span className="font-black text-viet-text">{val}</span>
                          </div>
                        ))}
                        {Object.entries(step.output).map(([key, val]) => (
                          <div key={key} className="text-[11px]">
                            <span className="font-bold text-viet-green">{key}:</span>{' '}
                            <span className="font-black text-viet-green">{formatNumber(val)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChemCalculator;
