import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { elements } from '@/data/elements';

const UniversalFormulaSim = ({ formula, inputValues, onInputChange, result, onCalculate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);

  // Lọc nguyên tố
  const filteredElements = useMemo(() => {
    if (!searchTerm) return [];
    return elements.filter(e => 
      e.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [searchTerm]);

  const handleSelectElement = (el) => {
    setSelectedElement(el);
    setSearchTerm('');
    setShowDropdown(false);
    
    // Tự động điền M (Khối lượng mol) nếu công thức có biến này
    const mVar = formula.variables.find(v => v.key === 'M' || v.key === 'MA' || v.key === 'MB');
    if (mVar) {
      onInputChange(mVar.key, parseFloat(el.weight));
    }
  };

  // Xác định loại mô phỏng (dựa vào biến)
  const varKeys = formula.variables.map(v => v.key);
  const isScaleSim = varKeys.includes('m') && varKeys.includes('M'); // Cân khối lượng
  const isBeakerSim = varKeys.includes('C') || varKeys.includes('Cm') || varKeys.includes('V') && !varKeys.includes('P'); // Dung dịch
  const isGasSim = varKeys.includes('P') || varKeys.includes('T') || varKeys.includes('d'); // Khí
  const isParticleSim = varKeys.includes('N'); // Số hạt

  // Màu sắc mô phỏng
  const simColor = selectedElement 
    ? (selectedElement.category.includes('metal') && !selectedElement.category.includes('nonmetal') ? '#A0AAB5' : 
       selectedElement.category.includes('gas') ? '#87CEEB' : '#F4A460')
    : '#76c034';

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '—';
    if (Math.abs(num) >= 1e6 || (Math.abs(num) < 0.001 && num !== 0)) return num.toExponential(4);
    return parseFloat(num.toFixed(4)).toString();
  };

  return (
    <div className="space-y-6">
      {/* 1. Thanh tìm kiếm nguyên tố từ Bảng tuần hoàn */}
      <div className="viet-card p-6 border-2 border-viet-green/30 bg-viet-green/5">
        <h3 className="text-[12px] font-black text-viet-green uppercase tracking-[2px] mb-3 flex items-center gap-2">
          <span>⚛️</span> Dữ liệu Bảng Tuần Hoàn
        </h3>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }}
            placeholder="Nhập ký hiệu hoặc tên (VD: Fe, Oxi, Cu...)"
            className="w-full h-[48px] rounded-xl px-4 border-2 border-viet-border focus:border-viet-green outline-none text-[14px] font-bold"
          />
          {showDropdown && filteredElements.length > 0 && (
            <div className="absolute top-[100%] left-0 w-full mt-2 bg-white border-2 border-viet-border rounded-xl shadow-xl z-10 overflow-hidden">
              {filteredElements.map(el => (
                <button key={el.number} onClick={() => handleSelectElement(el)}
                  className="w-full text-left p-3 hover:bg-viet-bg flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-viet-green/10 flex items-center justify-center text-[12px] font-black text-viet-green">{el.symbol}</span>
                    <span className="text-[13px] font-bold text-viet-text">{el.name}</span>
                  </div>
                  <span className="text-[12px] font-black text-viet-text-light">{el.weight} g/mol</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedElement && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-white rounded-xl border border-viet-border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[18px] font-black text-white shadow-md" style={{ backgroundColor: simColor }}>
                {selectedElement.symbol}
              </div>
              <div>
                <div className="text-[14px] font-black text-viet-text">{selectedElement.name}</div>
                <div className="text-[11px] text-viet-text-light capitalize">{selectedElement.category.replace(/-/g, ' ')}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-viet-text-light uppercase">Khối lượng mol (M)</div>
              <div className="text-[18px] font-black text-viet-green">{selectedElement.weight}</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* 2. Form Nhập liệu (Giống Simple mode) */}
      <div className="viet-card p-6">
        <h3 className="text-[11px] font-black text-[#b4bac2] uppercase tracking-[2px] mb-4">Thiết lập thông số</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formula.variables.map(v => {
            const isResult = result?.success && result.values[v.key] !== undefined;
            const isAutoFilled = selectedElement && (v.key === 'M' || v.key === 'MA') && inputValues[v.key] == selectedElement.weight;
            return (
              <div key={v.key}>
                <label className="text-[11px] font-bold text-viet-text mb-1.5 flex items-center gap-2">
                  {v.label}
                  {isAutoFilled && <span className="text-[9px] text-viet-green bg-viet-green/10 px-1.5 py-0.5 rounded-md">Từ bảng TH</span>}
                </label>
                <div className="relative">
                  <input type="number" step="any"
                    value={isResult ? formatNumber(result.values[v.key]) : (inputValues[v.key] ?? '')}
                    onChange={(e) => onInputChange(v.key, e.target.value)}
                    readOnly={isResult}
                    placeholder={`Nhập ${v.key}...`}
                    className={`w-full h-[52px] rounded-2xl px-5 pr-16 text-[16px] font-bold outline-none transition-all ${isResult ? 'bg-viet-green/10 border-2 border-viet-green text-viet-green ring-4 ring-viet-green/10' : isAutoFilled ? 'bg-amber-50 border-2 border-amber-300 focus:border-amber-500' : 'bg-viet-bg border-2 border-viet-border focus:border-viet-green'}`} />
                  <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-black uppercase ${isResult ? 'text-viet-green' : 'text-[#b4bac2]'}`}>{v.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
        {result?.error && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-[13px] font-bold text-red-600">⚠️ {result.error}</div>
        )}
        <div className="mt-6 flex justify-end">
          <button onClick={onCalculate} className="px-8 h-[52px] bg-viet-green text-white rounded-2xl text-[14px] font-black uppercase tracking-wider hover:bg-[#5fa52e] transition-all shadow-lg shadow-viet-green/20">Thực hiện mô phỏng</button>
        </div>
      </div>

      {/* 3. Khung Mô Phỏng Trực Quan */}
      {result?.success && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="viet-card p-6 overflow-hidden relative border-2 border-viet-green">
          <h3 className="text-[12px] font-black text-viet-green uppercase tracking-[2px] mb-6 flex items-center justify-between">
            <span>Mô phỏng: {formula.name}</span>
            <span className="text-[20px] font-black opacity-30">{formula.formula}</span>
          </h3>
          
          <div className="flex flex-col items-center justify-center min-h-[240px] py-4 bg-gradient-to-b from-white to-viet-bg rounded-2xl relative">
            
            {/* --- VISUAL: Cân điện tử (Scale) --- */}
            {isScaleSim && (
              <div className="flex flex-col items-center relative">
                <motion.div 
                  initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  className="w-20 h-20 rounded-lg shadow-lg flex items-center justify-center text-white font-black text-[20px] border-[3px] border-black/10 z-10"
                  style={{ backgroundColor: simColor }}>
                  {selectedElement?.symbol || 'X'}
                </motion.div>
                <div className="w-40 h-8 bg-gray-300 rounded-t-lg border-b-4 border-gray-400 mt-[-4px]" />
                <div className="w-48 h-16 bg-gray-800 rounded-lg flex items-center justify-center shadow-2xl relative">
                  <div className="w-32 h-10 bg-[#9ea79a] rounded flex items-center justify-end px-3 font-mono text-[24px] font-black text-gray-900 border-inset border-2 border-[#7a8276] shadow-inner">
                    {(inputValues.m || result.values.m)?.toFixed(2)} g
                  </div>
                </div>
                <div className="absolute -right-32 top-10 text-left">
                  <div className="text-[12px] font-black text-[#b4bac2] uppercase">Kết quả</div>
                  <div className="text-[24px] font-black text-viet-green">
                    n = {(inputValues.n || result.values.n)?.toExponential(4)} mol
                  </div>
                </div>
              </div>
            )}

            {/* --- VISUAL: Cốc dung dịch (Beaker) --- */}
            {!isScaleSim && isBeakerSim && (
              <div className="flex items-end h-[200px] relative">
                <div className="w-32 h-[180px] border-x-4 border-b-4 border-gray-300 rounded-b-2xl relative flex items-end">
                  <motion.div 
                    initial={{ height: 0 }} animate={{ height: '70%' }}
                    className="w-full rounded-b-xl opacity-80"
                    style={{ backgroundColor: simColor }}
                  />
                  {/* Markings */}
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="absolute left-0 w-3 h-0.5 bg-gray-300" style={{ bottom: `${(i+1)*25}%` }} />
                  ))}
                </div>
                <div className="absolute -right-36 top-1/2 -translate-y-1/2 text-left">
                  {varKeys.includes('C') && <div className="text-[18px] font-black text-viet-green">C% = {(inputValues.C || result.values.C)?.toFixed(2)}%</div>}
                  {varKeys.includes('Cm') && <div className="text-[18px] font-black text-viet-green">Cₘ = {(inputValues.Cm || result.values.Cm)?.toFixed(2)} M</div>}
                  {varKeys.includes('V') && <div className="text-[14px] font-bold text-viet-text-light">V = {(inputValues.V || result.values.V)} L</div>}
                </div>
              </div>
            )}

            {/* --- VISUAL: Khí/Bong bóng (Gas Balloon) --- */}
            {!isScaleSim && !isBeakerSim && isGasSim && (
              <div className="flex flex-col items-center relative">
                <motion.div 
                  animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="w-32 h-40 rounded-full flex flex-col items-center justify-center text-white relative shadow-inner"
                  style={{ backgroundColor: simColor, border: '2px solid rgba(255,255,255,0.5)' }}>
                  <div className="text-[32px] font-black opacity-30">{selectedElement?.symbol || 'Khí'}</div>
                  <div className="absolute bottom-[-10px] w-4 h-6 bg-yellow-600 rounded-t-sm" />
                </motion.div>
                <div className="absolute -right-40 top-1/2 -translate-y-1/2 text-left">
                  {varKeys.includes('V') && <div className="text-[16px] font-black text-viet-green">V = {(inputValues.V || result.values.V)?.toFixed(2)} L</div>}
                  {varKeys.includes('P') && <div className="text-[14px] font-bold text-viet-text">P = {(inputValues.P || result.values.P)?.toFixed(2)} atm</div>}
                  {varKeys.includes('d') && <div className="text-[14px] font-bold text-viet-text">d = {(inputValues.d || result.values.d)?.toFixed(2)}</div>}
                </div>
              </div>
            )}

            {/* --- VISUAL: Hạt vi mô (Particles) --- */}
            {!isScaleSim && !isBeakerSim && !isGasSim && isParticleSim && (
              <div className="w-64 h-48 bg-gray-900 rounded-2xl relative overflow-hidden flex items-center justify-center border-4 border-gray-700">
                <div className="text-center z-10 bg-black/50 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                  <div className="text-[12px] font-bold text-[#b4bac2]">Số hạt vi mô (Nguyên tử/Phân tử)</div>
                  <div className="text-[24px] font-black text-amber-400">{(inputValues.N || result.values.N)?.toExponential(4)}</div>
                </div>
                {/* Background stars/particles */}
                {[...Array(30)].map((_, i) => (
                  <motion.div key={i} className="absolute rounded-full bg-white opacity-40"
                    style={{ 
                      width: Math.random()*4+2, height: Math.random()*4+2,
                      left: `${Math.random()*100}%`, top: `${Math.random()*100}%`,
                      backgroundColor: simColor
                    }}
                    animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ repeat: Infinity, duration: Math.random()*2+1 }}
                  />
                ))}
              </div>
            )}

            {/* --- GENERIC FALLBACK --- */}
            {!isScaleSim && !isBeakerSim && !isGasSim && !isParticleSim && (
              <div className="text-center">
                <div className="text-[48px] mb-2">🔄</div>
                <div className="text-[16px] font-black text-viet-green">Tính toán thành công!</div>
              </div>
            )}

          </div>

          {/* Dòng tóm tắt dưới cùng */}
          <div className="mt-6 p-4 bg-viet-green/10 rounded-xl flex flex-wrap gap-4 justify-between items-center border border-viet-green/20">
            {Object.entries(result.values).map(([k, v]) => {
              const label = formula.variables.find(fv => fv.key === k)?.label || k;
              const unit = formula.variables.find(fv => fv.key === k)?.unit || '';
              return (
                <div key={k}>
                  <div className="text-[10px] font-bold text-viet-text-light uppercase">{label}</div>
                  <div className="text-[16px] font-black text-viet-text">{formatNumber(v)} <span className="text-[11px]">{unit}</span></div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UniversalFormulaSim;
