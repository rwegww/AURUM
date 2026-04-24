import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Khối lượng riêng (g/mL hoặc g/cm³)
const MATERIALS = [
  { name: 'Gỗ Sồi', density: 0.6, color: '#A0522D' },
  { name: 'Xốp (Styrofoam)', density: 0.05, color: '#f0f0f0' },
  { name: 'Nước đá', density: 0.92, color: '#AEEEEE' },
  { name: 'Nhôm', density: 2.7, color: '#C0C0C0' },
  { name: 'Sắt', density: 7.87, color: '#696969' },
  { name: 'Vàng', density: 19.3, color: '#FFD700' },
  { name: 'Tùy chỉnh', density: 1.0, color: '#FF8C00' }
];

const LIQUIDS = [
  { name: 'Nước', density: 1.0, color: 'rgba(52, 184, 118, 0.4)' },
  { name: 'Xăng', density: 0.74, color: 'rgba(255, 215, 0, 0.4)' },
  { name: 'Thủy ngân', density: 13.53, color: 'rgba(169, 169, 169, 0.8)' },
];

const DensitySim = () => {
  const [materialIdx, setMaterialIdx] = useState(0);
  const [liquidIdx, setLiquidIdx] = useState(0);
  const [mass, setMass] = useState(50); // g
  const [customVol, setCustomVol] = useState(50); // cm³
  
  const material = MATERIALS[materialIdx];
  const liquid = LIQUIDS[liquidIdx];
  
  // Tính toán
  let volume, density;
  if (material.name === 'Tùy chỉnh') {
    volume = customVol;
    density = mass / volume;
  } else {
    density = material.density;
    volume = mass / density;
  }

  // Khối lượng riêng của chất lỏng
  const liquidDensity = liquid.density;
  
  // Trạng thái nổi/chìm
  const isFloating = density < liquidDensity;
  
  // Tính toán phần trăm chìm (nếu nổi)
  // Lực đẩy Archimedes: F_A = d_liquid * V_submerged * g
  // Trọng lực: P = m * g = d_object * V_total * g
  // Nổi khi F_A = P => V_submerged / V_total = d_object / d_liquid
  const submergedRatio = isFloating ? density / liquidDensity : 1;
  
  // Tính toán vị trí Y cho animation (mô phỏng)
  // Bể nước từ y=100 đến y=300 (mặt nước ở y=100)
  // Khối vật có chiều cao giả định tỷ lệ với cbrt(volume)
  const boxSize = Math.max(20, Math.min(80, Math.cbrt(volume) * 10));
  
  // Nếu chìm: chạm đáy (y=300 - boxSize)
  // Nếu nổi: phần chìm = submergedRatio * boxSize, mặt nước y=100 => vị trí y = 100 - boxSize + (submergedRatio * boxSize)
  const targetY = isFloating ? 100 - boxSize * (1 - submergedRatio) : 300 - boxSize;

  return (
    <div className="space-y-6">
      {/* Simulation Area */}
      <div className="bg-white rounded-2xl p-4 border border-viet-border flex justify-center relative overflow-hidden h-[340px]">
        {/* Liquid Container */}
        <div className="absolute bottom-0 w-full h-[240px] flex justify-center">
          <div className="w-[80%] h-full relative" style={{ backgroundColor: liquid.color, borderLeft: '4px solid #ddd', borderRight: '4px solid #ddd', borderBottom: '4px solid #ddd', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
            {/* Water surface line */}
            <div className="absolute top-0 w-full h-1 bg-white/50" />
          </div>
        </div>

        {/* Object */}
        <motion.div
          animate={{ y: targetY }}
          transition={{ type: "spring", stiffness: 50, damping: 10, mass: mass/10 }}
          className="absolute shadow-lg flex items-center justify-center text-[10px] font-black text-white/80 overflow-hidden"
          style={{
            width: boxSize,
            height: boxSize,
            backgroundColor: material.color,
            border: '2px solid rgba(0,0,0,0.1)',
            borderRadius: material.name === 'Nước đá' ? '8px' : '4px',
            left: 'calc(50% - ' + boxSize/2 + 'px)',
            top: 0
          }}
        >
          {mass.toFixed(0)}g
        </motion.div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vật liệu */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px]">Vật thể</label>
          <div className="flex flex-wrap gap-2">
            {MATERIALS.map((m, i) => (
              <button key={m.name} onClick={() => setMaterialIdx(i)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${i === materialIdx ? 'bg-viet-text text-white' : 'bg-viet-bg hover:bg-gray-200'}`}>
                {m.name}
              </button>
            ))}
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[9px] font-bold text-viet-text-light">Khối lượng (m)</label>
              <span className="text-[12px] font-black">{mass.toFixed(1)} g</span>
            </div>
            <input type="range" min="1" max="200" step="1" value={mass} onChange={e => setMass(parseFloat(e.target.value))}
              className="w-full h-2 bg-viet-border rounded-full appearance-none accent-viet-text" />
          </div>

          {material.name === 'Tùy chỉnh' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <div className="flex justify-between mb-1 mt-2">
                <label className="text-[9px] font-bold text-viet-text-light">Thể tích (V)</label>
                <span className="text-[12px] font-black">{customVol.toFixed(1)} cm³</span>
              </div>
              <input type="range" min="1" max="200" step="1" value={customVol} onChange={e => setCustomVol(parseFloat(e.target.value))}
                className="w-full h-2 bg-viet-border rounded-full appearance-none accent-amber-500" />
            </motion.div>
          )}
        </div>

        {/* Chất lỏng */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px]">Chất lỏng</label>
          <div className="flex flex-wrap gap-2">
            {LIQUIDS.map((l, i) => (
              <button key={l.name} onClick={() => setLiquidIdx(i)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${i === liquidIdx ? 'bg-viet-green text-white' : 'bg-viet-bg hover:bg-green-50'}`}>
                {l.name} ({l.density} g/mL)
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-viet-bg rounded-2xl p-5">
        <h4 className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px] mb-3">Thông số & Kết quả (d = m / V)</h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-3">
            <div className="text-[9px] font-bold text-viet-text-light uppercase">Khối lượng riêng (Vật)</div>
            <div className="text-[18px] font-black text-viet-text">{density.toFixed(2)} <span className="text-[10px]">g/cm³</span></div>
          </div>
          <div className="bg-white rounded-xl p-3">
            <div className="text-[9px] font-bold text-viet-text-light uppercase">Thể tích (Vật)</div>
            <div className="text-[18px] font-black text-viet-text">{volume.toFixed(2)} <span className="text-[10px]">cm³</span></div>
          </div>
          <div className="bg-white rounded-xl p-3">
            <div className="text-[9px] font-bold text-viet-text-light uppercase">Trạng thái</div>
            <div className={`text-[18px] font-black ${isFloating ? 'text-blue-500' : 'text-gray-600'}`}>
              {isFloating ? 'Nổi' : 'Chìm'}
            </div>
          </div>
        </div>
        {isFloating && (
          <div className="mt-3 text-[11px] font-bold text-blue-600 bg-blue-50 p-2 rounded-lg text-center border border-blue-200">
            Vật nổi và chìm {(submergedRatio * 100).toFixed(1)}% trong {liquid.name}.
          </div>
        )}
      </div>
    </div>
  );
};

export default DensitySim;
