import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { elements } from '@/data/elements';

const UniversalFormulaSim = ({ formula }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  
  // Xác định biến đích (biến kết quả)
  const [targetVarKey, setTargetVarKey] = useState(formula.variables[0].key);
  
  // Giá trị đầu vào mặc định
  // Giá trị đầu vào mặc định hợp lý cho từng loại biến
  const [inputs, setInputs] = useState(() => {
    const defaultVals = {};
    formula.variables.forEach(v => {
      if (v.key === 'V') defaultVals[v.key] = 1.0;
      else if (v.key === 'n') defaultVals[v.key] = 0.5;
      else if (v.key === 'm') defaultVals[v.key] = 20;
      else if (v.key === 'M' || v.key === 'MA' || v.key === 'MB') defaultVals[v.key] = 56;
      else if (v.key === 'C' || v.key === 'Cm') defaultVals[v.key] = 1;
      else if (v.key === 'C%') defaultVals[v.key] = 15;
      else if (v.key === 'N') defaultVals[v.key] = 3.01e23;
      else if (v.key === 'P') defaultVals[v.key] = 1;
      else if (v.key === 'T') defaultVals[v.key] = 298; // 25C
      else if (v.key === 'd' || v.key === 'dA/B' || v.key === 'dA/kk' || v.key === 'dA/H₂') defaultVals[v.key] = 1.2;
      else if (v.key === 'H%') defaultVals[v.key] = 80;
      else defaultVals[v.key] = 10;
    });
    return defaultVals;
  });

  // Xác định khoảng (range) cho các thanh trượt
  const getVarRange = (key) => {
    if (key === 'm' || key === 'mct' || key === 'mdd') return { min: 0.1, max: 200, step: 0.1 };
    if (key === 'M' || key === 'MA' || key === 'MB') return { min: 1, max: 250, step: 1 };
    if (key === 'V') return { min: 0.1, max: 25, step: 0.1 };
    if (key === 'n') return { min: 0.01, max: 10, step: 0.01 };
    if (key === 'C' || key === 'Cm') return { min: 0.1, max: 5, step: 0.1 };
    if (key === 'C%' || key === 'H%') return { min: 1, max: 100, step: 1 };
    if (key === 'P') return { min: 0.1, max: 10, step: 0.1 };
    if (key === 'T') return { min: 273, max: 1000, step: 1 };
    if (key === 'N') return { min: 1e22, max: 1e24, step: 1e22 };
    if (key.startsWith('d')) return { min: 0.1, max: 5, step: 0.1 };
    return { min: 0.1, max: 100, step: 0.1 };
  };

  // Kết quả tính toán
  const [result, setResult] = useState({});

  // Cập nhật giá trị
  const handleInputChange = (key, val) => {
    setInputs(prev => ({ ...prev, [key]: parseFloat(val) || 0 }));
  };

  // Tự động tính toán khi input hoặc công thức thay đổi
  useEffect(() => {
    const varsToSolve = { ...inputs };
    varsToSolve[targetVarKey] = null; // Biến đích cần tính
    
    const solved = formula.solve(varsToSolve);
    if (solved) {
      setResult(solved);
    }
  }, [inputs, targetVarKey, formula]);

  // Đổi công thức thì reset target
  useEffect(() => {
    setTargetVarKey(formula.variables[0].key);
  }, [formula]);

  // Bảng tuần hoàn auto-fill
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
    
    const mVar = formula.variables.find(v => v.key === 'M' || v.key === 'MA' || v.key === 'MB');
    if (mVar) {
      handleInputChange(mVar.key, parseFloat(el.weight));
    }
  };

  const varKeys = formula.variables.map(v => v.key);
  const isParticleSim = varKeys.includes('N');
  const isGasSim = varKeys.includes('P') || varKeys.includes('T') || varKeys.includes('d') || varKeys.includes('dA/kk'); 
  const isBeakerSim = !isParticleSim && !isGasSim && (varKeys.includes('C') || varKeys.includes('Cm') || varKeys.includes('C%') || varKeys.includes('V')); 
  const isScaleSim = !isParticleSim && !isGasSim && !isBeakerSim; // Còn lại mặc định là cái cân

  // Màu mô phỏng
  const simColorHex = selectedElement 
    ? (selectedElement.category.includes('metal') && !selectedElement.category.includes('nonmetal') ? '#A0AAB5' : 
       selectedElement.category.includes('gas') ? '#87CEEB' : '#9b59b6')
    : '#9b59b6'; // Tím KMnO4 mặc định

  // Helper chuyển HEX sang RGB
  const hexToRgb = (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '155, 89, 182';
  };
  const simColorRgb = hexToRgb(simColorHex);

  // === Tính toán các biến trực quan cho Beaker ===
  const currentVol = inputs.V ?? inputs.mdd ?? result.V ?? result.mdd ?? 1; 
  const maxVol = 2; // Tối đa 2L
  const liquidHeightPercent = Math.min((currentVol / maxVol) * 100, 100);
  
  const currentConc = inputs.Cm ?? inputs['C%'] ?? result.Cm ?? result['C%'] ?? inputs.n ?? result.n ?? 1;
  const maxConc = 5; // Nồng độ tối đa hiển thị
  const concentrationOpacity = Math.min(currentConc / maxConc, 1);
  const isSaturated = currentConc > 3.5; // Giả lập bão hòa nếu nồng độ quá cao

  return (
    <div className="space-y-6">
      
      {/* 1. MÔ PHỎNG TƯƠNG TÁC (Visual Area) */}
      <div className="viet-card p-6 bg-[#f8f9fa] border-2 border-[#e9ecef] shadow-inner relative overflow-hidden flex flex-col md:flex-row gap-8 justify-center items-center min-h-[400px]">
        
        {/* === CỘT TRÁI: SLIDER ĐIỀU KHIỂN (Vertical Sliders) === */}
        <div className="flex gap-8 items-end h-[250px]">
          {formula.variables.filter(v => v.key !== targetVarKey).map(v => {
            const val = inputs[v.key];
            const range = getVarRange(v.key);
            
            // Xử lý hiển thị slider an toàn
            const percent = Math.min(Math.max((val - range.min) / (range.max - range.min) * 100, 0), 100);
            
            return (
              <div key={v.key} className="flex flex-col items-center h-full">
                <div className="text-[12px] font-black text-viet-text text-center w-24 mb-2 leading-tight">
                  {v.label.split('(')[0].trim()}
                  <div className="text-[10px] font-bold text-viet-text-light">({v.unit})</div>
                </div>
                
                {/* Vertical Slider Wrapper */}
                <div className="relative h-[180px] w-8 flex justify-center group">
                  <div className="absolute top-0 bottom-0 w-2 bg-gray-300 rounded-full" />
                  <input 
                    type="range" min={range.min} max={range.max} step={range.step} 
                    value={val} 
                    onChange={(e) => handleInputChange(v.key, e.target.value)}
                    className="absolute w-[180px] h-8 -rotate-90 appearance-none bg-transparent cursor-ns-resize z-10"
                    style={{ top: '75px', transformOrigin: 'center' }}
                  />
                  {/* Custom Thumb */}
                  <motion.div 
                    className="absolute w-12 h-6 bg-[#5c9ce6] border-2 border-[#4a80bc] rounded-md shadow-md flex items-center justify-center text-white text-[10px] font-bold pointer-events-none"
                    style={{ bottom: `${percent}%`, marginBottom: '-12px' }}
                  >
                    |||
                  </motion.div>
                </div>
                
                <div className="mt-4 font-mono text-[14px] font-black text-[#34495e]">
                  {v.key === 'N' ? val.toExponential(2) : val.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* === GIỮA: VISUAL CONTAINER (Beaker/Scale) === */}
        <div className="relative flex flex-col items-center">
          
          {/* VISUAL: BEAKER (Dung dịch) */}
          {isBeakerSim && (
            <div className="relative">
              {/* Vỏ cốc */}
              <svg width="240" height="280" viewBox="0 0 240 280" className="drop-shadow-xl z-10 relative">
                {/* Miệng cốc */}
                <path d="M 10 30 Q 120 50 230 30 L 220 260 Q 120 280 20 260 Z" fill="rgba(255,255,255,0.4)" stroke="#ccc" strokeWidth="4" />
                <path d="M 10 30 Q 120 10 230 30" fill="none" stroke="#ccc" strokeWidth="4" />
                <path d="M 10 30 Q -10 10 10 -10" fill="none" stroke="#ccc" strokeWidth="4" /> {/* Mỏ cốc */}
                
                {/* Vạch chia thể tích */}
                <line x1="30" y1="80" x2="50" y2="80" stroke="#999" strokeWidth="2" />
                <text x="60" y="85" fill="#666" fontSize="14" fontWeight="bold">1 L</text>
                <line x1="25" y1="110" x2="40" y2="110" stroke="#999" strokeWidth="1" />
                <line x1="25" y1="140" x2="40" y2="140" stroke="#999" strokeWidth="1" />
                <line x1="20" y1="170" x2="45" y2="170" stroke="#999" strokeWidth="2" />
                <text x="55" y="175" fill="#666" fontSize="12" fontWeight="bold">½ L</text>
                <line x1="18" y1="200" x2="35" y2="200" stroke="#999" strokeWidth="1" />
                <line x1="15" y1="230" x2="35" y2="230" stroke="#999" strokeWidth="1" />
              </svg>

              {/* Chất lỏng bên trong */}
              <motion.div 
                className="absolute bottom-[20px] left-[20px] right-[20px] rounded-b-[40px] z-0 overflow-hidden"
                style={{ 
                  height: `${liquidHeightPercent * 2.4}px`, 
                  backgroundColor: `rgba(${simColorRgb}, ${0.1 + concentrationOpacity * 0.9})`,
                  transition: 'background-color 0.3s ease'
                }}
                animate={{ height: `${liquidHeightPercent * 2.4}px` }}
                transition={{ type: "spring", stiffness: 60 }}
              >
                {/* Mặt thoáng chất lỏng */}
                <div className="absolute top-0 w-full h-[15px] rounded-[50%] bg-white/20" />
                
                {/* Hạt kết tủa bão hòa */}
                {isSaturated && (
                  <>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 px-3 py-1 rounded-md text-[14px] font-black text-red-600 shadow-md border border-red-200">
                      Bão hoà!
                    </div>
                    {[...Array(30)].map((_, i) => (
                      <div key={i} className="absolute bottom-2 w-2 h-2 bg-black rounded-sm rotate-45"
                        style={{ left: `${10 + Math.random() * 80}%`, bottom: `${Math.random() * 10}px` }} />
                    ))}
                  </>
                )}
              </motion.div>

              {/* Nhãn dán */}
              <div className="absolute top-[80px] left-1/2 -translate-x-1/2 bg-white/90 border border-gray-300 px-6 py-3 rounded-lg shadow-sm z-20 font-black text-[20px]">
                {selectedElement?.symbol || 'KMnO₄'}
              </div>
            </div>
          )}

          {/* VISUAL: Khí/Áp suất/Nhiệt độ */}
          {!isBeakerSim && isGasSim && (
            <div className="relative w-[200px] h-[240px] border-[6px] border-gray-700 rounded-t-full rounded-b-xl overflow-hidden bg-gradient-to-b from-gray-100 to-gray-300 shadow-inner">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
                <div className="text-[12px] font-black text-gray-500 uppercase">Bình Khí</div>
                <div className="text-[28px] font-black text-gray-800">{selectedElement?.symbol || 'Gas'}</div>
              </div>
              <motion.div 
                className="absolute bottom-0 w-full bg-[#e74c3c]"
                style={{ height: `${Math.min((inputs.T || 273) / 500 * 100, 100)}%`, opacity: 0.8 }}
              />
              {/* Particles */}
              {[...Array(Math.min(Math.floor((inputs.n || inputs.P || 1)*20), 100))].map((_, i) => (
                <motion.div key={i} className="absolute w-3 h-3 rounded-full bg-blue-500 shadow-sm"
                  initial={{ x: Math.random()*180, y: Math.random()*200 }}
                  animate={{ 
                    x: [Math.random()*180, Math.random()*180, Math.random()*180],
                    y: [Math.random()*200, Math.random()*200, Math.random()*200]
                  }}
                  transition={{ repeat: Infinity, duration: Math.max(0.5, 2 - (inputs.T || 273)/300), ease: "linear" }}
                />
              ))}
            </div>
          )}

          {/* VISUAL: Hạt vi mô (Kính hiển vi) */}
          {isParticleSim && (
            <div className="relative w-[240px] h-[240px] rounded-full border-[8px] border-gray-800 bg-gray-900 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              {/* Ánh sáng đèn kính hiển vi */}
              <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none" />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center z-20 bg-black/40 px-3 py-1 rounded-full border border-white/10">
                <div className="text-[14px] font-black text-amber-400">{(inputs.N || result.N || 0).toExponential(3)} hạt</div>
              </div>
              {/* Particles */}
              {[...Array(Math.min(Math.floor((inputs.n || result.n || 1) * 30), 100))].map((_, i) => (
                <motion.div key={i} className="absolute rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  style={{ 
                    width: Math.random() * 6 + 4, height: Math.random() * 6 + 4,
                    backgroundColor: simColorHex,
                    left: `${20 + Math.random() * 60}%`, top: `${20 + Math.random() * 60}%`
                  }}
                  animate={{ 
                    x: [(Math.random()-0.5)*40, (Math.random()-0.5)*40],
                    y: [(Math.random()-0.5)*40, (Math.random()-0.5)*40],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ repeat: Infinity, duration: Math.random() * 3 + 2, ease: "easeInOut", repeatType: 'mirror' }}
                />
              ))}
            </div>
          )}

          {/* VISUAL: Cân điện tử (Mặc định cho khối lượng) */}
          {isScaleSim && (
            <div className="flex flex-col items-center">
              <motion.div 
                animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-24 h-24 rounded-2xl shadow-xl flex items-center justify-center text-white font-black text-[28px] border-4 border-black/10 z-10"
                style={{ backgroundColor: simColorHex }}>
                {selectedElement?.symbol || 'X'}
              </motion.div>
              <div className="w-48 h-8 bg-gray-300 rounded-t-xl border-b-4 border-gray-400 mt-[-8px] z-0" />
              <div className="w-56 h-16 bg-[#2c3e50] rounded-xl flex items-center justify-center shadow-2xl relative">
                <div className="w-40 h-10 bg-[#9ea79a] rounded flex items-center justify-end px-3 font-mono text-[24px] font-black text-gray-900 border-inset border-2 border-[#7a8276] shadow-inner">
                  {(inputs.m || inputs.mct || inputs.mdd || result.m || result.mct || result.mdd || 0).toFixed(2)} g
                </div>
              </div>
            </div>
          )}
        </div>

        {/* === CỘT PHẢI: METER ĐO KẾT QUẢ TƯƠNG TÁC === */}
        <div className="flex flex-col items-center h-[280px] relative w-32">
          <div className="text-[12px] font-black text-viet-text text-center w-full mb-2 leading-tight">
            {formula.variables.find(v => v.key === targetVarKey)?.label.split('(')[0].trim()}
            <div className="text-[10px] font-bold text-viet-text-light">({formula.variables.find(v => v.key === targetVarKey)?.unit})</div>
          </div>
          
          {/* Cột đo Nồng độ / Kết quả */}
          <div className="w-8 h-[200px] border-2 border-gray-400 bg-gray-200 relative">
            <motion.div 
              className="absolute bottom-0 w-full"
              style={{ backgroundColor: `rgb(${simColorRgb})` }}
              animate={{ height: `${Math.min(Math.max((result[targetVarKey] || 0) / getVarRange(targetVarKey).max * 100, 0), 100)}%` }}
              transition={{ type: "spring", stiffness: 80 }}
            />
            {/* Mũi tên chỉ thị kết quả */}
            <motion.div 
              className="absolute -right-10 flex items-center pointer-events-none"
              animate={{ bottom: `${Math.min(Math.max((result[targetVarKey] || 0) / getVarRange(targetVarKey).max * 100, 0), 100)}%`, marginBottom: '-10px' }}
              transition={{ type: "spring", stiffness: 80 }}
            >
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-purple-700 border-b-[10px] border-b-transparent mr-1" />
              <div className="font-mono text-[12px] font-black text-purple-900 whitespace-nowrap bg-white/80 px-1 rounded border border-purple-200">
                {targetVarKey === 'N' ? (result[targetVarKey] || 0).toExponential(2) : (result[targetVarKey] || 0).toFixed(2)}
              </div>
            </motion.div>
          </div>
          
          <div className="mt-2 text-[12px] font-bold text-gray-500">0</div>
        </div>

      </div>

      {/* 2. CHỌN BIẾN ĐÍCH & CHẤT TỪ BẢNG TUẦN HOÀN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Khung Chọn Biến Cần Tính */}
        <div className="viet-card p-5 border-2 border-blue-200 bg-blue-50/50">
          <h3 className="text-[12px] font-black text-blue-800 uppercase tracking-[2px] mb-3">🎯 Chọn Đại Lượng Cần Tính</h3>
          <div className="flex flex-wrap gap-3">
            {formula.variables.map(v => (
              <label key={v.key} className={`cursor-pointer flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${targetVarKey === v.key ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-blue-200 text-blue-800 hover:border-blue-400'}`}>
                <input 
                  type="radio" name="targetVar" 
                  checked={targetVarKey === v.key} 
                  onChange={() => setTargetVarKey(v.key)}
                  className="hidden" 
                />
                <span className="font-black text-[16px]">{v.key}</span>
                <span className={`text-[10px] ${targetVarKey === v.key ? 'text-blue-100' : 'text-blue-500'}`}>({v.unit})</span>
              </label>
            ))}
          </div>
          <div className="mt-4 text-[11px] text-blue-700 font-medium">
            💡 Kéo các thanh trượt ở trên để thay đổi thông số, đại lượng <strong className="font-black">[{targetVarKey}]</strong> sẽ tự động tính toán.
          </div>
        </div>

        {/* Khung Chọn Chất (Bảng Tuần Hoàn) */}
        <div className="viet-card p-5 border-2 border-amber-200 bg-amber-50/50">
          <h3 className="text-[12px] font-black text-amber-800 uppercase tracking-[2px] mb-3 flex items-center gap-2">
            <span>⚛️</span> Nạp chất từ Bảng Tuần Hoàn
          </h3>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }}
              placeholder="Gõ tên chất (VD: Cu, Fe, Oxi...)"
              className="w-full h-[48px] rounded-xl px-4 border-2 border-amber-300 focus:border-amber-500 outline-none text-[14px] font-bold bg-white"
            />
            {showDropdown && filteredElements.length > 0 && (
              <div className="absolute top-[100%] left-0 w-full mt-2 bg-white border-2 border-amber-200 rounded-xl shadow-xl z-30 overflow-hidden">
                {filteredElements.map(el => (
                  <button key={el.number} onClick={() => handleSelectElement(el)}
                    className="w-full text-left p-3 hover:bg-amber-50 flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-[12px] font-black text-amber-800">{el.symbol}</span>
                      <span className="text-[13px] font-bold text-gray-800">{el.name}</span>
                    </div>
                    <span className="text-[12px] font-black text-gray-500">{el.weight} g/mol</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedElement && (
            <div className="mt-3 p-3 bg-white rounded-xl border border-amber-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[16px] font-black text-white shadow-sm" style={{ backgroundColor: simColorHex }}>
                  {selectedElement.symbol}
                </div>
                <div>
                  <div className="text-[12px] font-black text-gray-800">{selectedElement.name}</div>
                  <div className="text-[10px] text-gray-500 capitalize">{selectedElement.category.replace(/-/g, ' ')}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] font-bold text-gray-500 uppercase">Khối lượng mol</div>
                <div className="text-[14px] font-black text-amber-600">{selectedElement.weight}</div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default UniversalFormulaSim;
