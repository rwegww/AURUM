import React, { useState, useMemo } from 'react';

// Dữ liệu hóa học chuẩn - Chất tan và màu sắc
const SOLUTES = [
  { name: 'CuSO₄', label: 'Đồng(II) sunfat', M: 249.68, color: [0, 100, 220], maxConc: 1.38 },
  { name: 'KMnO₄', label: 'Kali pemanganat', M: 158.03, color: [148, 0, 148], maxConc: 0.41 },
  { name: 'NaCl', label: 'Natri clorua', M: 58.44, color: [180, 180, 180], maxConc: 5.4 },
  { name: 'K₂CrO₄', label: 'Kali cromat', M: 194.19, color: [220, 180, 0], maxConc: 3.4 },
  { name: 'CoCl₂', label: 'Cobalt(II) clorua', M: 129.84, color: [200, 50, 80], maxConc: 4.35 },
  { name: 'FeCl₃', label: 'Sắt(III) clorua', M: 162.2, color: [180, 120, 0], maxConc: 5.7 },
];

const MolaritySim = () => {
  const [soluteIdx, setSoluteIdx] = useState(0);
  const [mass, setMass] = useState(20); // gam
  const [volume, setVolume] = useState(500); // mL

  const solute = SOLUTES[soluteIdx];
  const volumeL = volume / 1000;
  const mol = mass / solute.M;
  const concentration = volumeL > 0 ? mol / volumeL : 0;
  const isSaturated = concentration > solute.maxConc;
  const effectiveConc = Math.min(concentration, solute.maxConc);

  // Tính opacity dựa trên nồng độ (0 → trong suốt, maxConc → đậm)
  const opacity = Math.min(effectiveConc / solute.maxConc, 1) * 0.85;
  const solutionColor = `rgba(${solute.color[0]}, ${solute.color[1]}, ${solute.color[2]}, ${opacity})`;

  // Tính chiều cao dung dịch theo thể tích (max 200px cho 1000mL)
  const liquidHeight = Math.min((volume / 1000) * 200, 200);

  return (
    <div className="space-y-6">
      {/* Beaker Visual */}
      <div className="flex justify-center">
        <svg width="280" height="320" viewBox="0 0 280 320">
          {/* Beaker outline */}
          <rect x="40" y="50" width="200" height="240" rx="8" fill="none" stroke="#ccc" strokeWidth="3" />
          <rect x="30" y="45" width="220" height="12" rx="4" fill="#e0e0e0" stroke="#ccc" strokeWidth="2" />

          {/* Solution */}
          <rect x="43" y={290 - liquidHeight} width="194" height={liquidHeight} rx="4"
            fill={solutionColor} className="transition-all duration-300" />

          {/* Precipitate if saturated */}
          {isSaturated && (
            <g>
              {[...Array(8)].map((_, i) => (
                <circle key={i}
                  cx={80 + Math.random() * 120}
                  cy={275 + Math.random() * 10}
                  r={2 + Math.random() * 3}
                  fill={`rgba(${solute.color[0]}, ${solute.color[1]}, ${solute.color[2]}, 0.9)`}
                />
              ))}
            </g>
          )}

          {/* Volume scale marks */}
          {[200, 400, 600, 800, 1000].map((ml, i) => {
            const y = 290 - (ml / 1000) * 200;
            return (
              <g key={ml}>
                <line x1="235" y1={y} x2="245" y2={y} stroke="#aaa" strokeWidth="1" />
                <text x="248" y={y + 4} fill="#999" fontSize="9" fontWeight="bold">{ml}</text>
              </g>
            );
          })}
          <text x="250" y={100} fill="#bbb" fontSize="8" fontWeight="bold">mL</text>

          {/* Label */}
          <text x="140" y={300 - liquidHeight / 2 + 5} textAnchor="middle"
            fill="white" fontSize="14" fontWeight="900" opacity={opacity > 0.3 ? 1 : 0}>
            {solute.name}
          </text>
        </svg>
      </div>

      {/* Controls */}
      <div className="space-y-5">
        {/* Solute Selector */}
        <div>
          <label className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px] block mb-2">Chất tan</label>
          <div className="grid grid-cols-3 gap-2">
            {SOLUTES.map((s, i) => (
              <button key={s.name} onClick={() => setSoluteIdx(i)}
                className={`p-2 rounded-xl text-[11px] font-bold transition-all ${i === soluteIdx ? 'bg-viet-green text-white shadow-md' : 'bg-viet-bg text-viet-text-light hover:bg-viet-green/10'}`}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: `rgb(${s.color.join(',')})` }} />
                  {s.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mass Slider */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px]">Khối lượng chất tan</label>
            <span className="text-[13px] font-black text-viet-text">{mass.toFixed(1)} g</span>
          </div>
          <input type="range" min="0" max="200" step="0.5" value={mass} onChange={e => setMass(parseFloat(e.target.value))}
            className="w-full h-2 bg-viet-border rounded-full appearance-none cursor-pointer accent-viet-green" />
          <div className="flex justify-between text-[9px] text-[#ccc] font-bold mt-1"><span>0 g</span><span>200 g</span></div>
        </div>

        {/* Volume Slider */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px]">Thể tích dung dịch</label>
            <span className="text-[13px] font-black text-viet-text">{volume} mL</span>
          </div>
          <input type="range" min="100" max="1000" step="10" value={volume} onChange={e => setVolume(parseInt(e.target.value))}
            className="w-full h-2 bg-viet-border rounded-full appearance-none cursor-pointer accent-viet-green" />
          <div className="flex justify-between text-[9px] text-[#ccc] font-bold mt-1"><span>100 mL</span><span>1000 mL</span></div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-viet-bg rounded-2xl p-5 space-y-3">
        <h4 className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px]">Kết quả tính toán</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3">
            <div className="text-[9px] font-bold text-viet-text-light uppercase">Khối lượng mol (M)</div>
            <div className="text-[16px] font-black text-viet-text">{solute.M} <span className="text-[10px] text-viet-text-light">g/mol</span></div>
          </div>
          <div className="bg-white rounded-xl p-3">
            <div className="text-[9px] font-bold text-viet-text-light uppercase">Số mol (n = m/M)</div>
            <div className="text-[16px] font-black text-viet-green">{mol.toFixed(4)} <span className="text-[10px] text-viet-text-light">mol</span></div>
          </div>
          <div className="bg-white rounded-xl p-3 col-span-2">
            <div className="text-[9px] font-bold text-viet-text-light uppercase">Nồng độ mol (Cₘ = n/V)</div>
            <div className={`text-[22px] font-black ${isSaturated ? 'text-red-500' : 'text-viet-green'}`}>
              {concentration.toFixed(4)} <span className="text-[10px] text-viet-text-light">mol/L</span>
            </div>
            {isSaturated && (
              <div className="text-[10px] font-bold text-red-500 mt-1">⚠️ Bão hòa! Nồng độ bão hòa: {solute.maxConc} M — Chất tan dư sẽ lắng xuống đáy.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MolaritySim;
