import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Khá»‘i lÆ°á»£ng riÃªng (g/mL hoáº·c g/cmÂ³)
const MATERIALS = [
  { name: 'Gá»— Sá»“i', density: 0.6, color: '#A0522D' },
  { name: 'Xá»‘p (Styrofoam)', density: 0.05, color: '#f0f0f0' },
  { name: 'NÆ°á»›c Ä‘Ã¡', density: 0.92, color: '#AEEEEE' },
  { name: 'NhÃ´m', density: 2.7, color: '#C0C0C0' },
  { name: 'Sáº¯t', density: 7.87, color: '#696969' },
  { name: 'VÃ ng', density: 19.3, color: '#FFD700' },
  { name: 'TÃ¹y chá»‰nh', density: 1.0, color: '#FF8C00' }
];

const LIQUIDS = [
  { name: 'NÆ°á»›c', density: 1.0, color: 'rgba(52, 184, 118, 0.4)' },
  { name: 'XÄƒng', density: 0.74, color: 'rgba(255, 215, 0, 0.4)' },
  { name: 'Thá»§y ngÃ¢n', density: 13.53, color: 'rgba(169, 169, 169, 0.8)' },
];

const DensitySim = () => {
  const [materialIdx, setMaterialIdx] = useState(0);
  const [liquidIdx, setLiquidIdx] = useState(0);
  const [mass, setMass] = useState(50); // g
  const [customVol, setCustomVol] = useState(50); // cmÂ³
  
  const material = MATERIALS[materialIdx];
  const liquid = LIQUIDS[liquidIdx];
  
  // TÃ­nh toÃ¡n
  let volume, density;
  if (material.name === 'TÃ¹y chá»‰nh') {
    volume = customVol;
    density = mass / volume;
  } else {
    density = material.density;
    volume = mass / density;
  }

  // Khá»‘i lÆ°á»£ng riÃªng cá»§a cháº¥t lá»ng
  const liquidDensity = liquid.density;
  
  // Tráº¡ng thÃ¡i ná»•i/chÃ¬m
  const isFloating = density < liquidDensity;
  
  // TÃ­nh toÃ¡n pháº§n trÄƒm chÃ¬m (náº¿u ná»•i)
  // Lá»±c Ä‘áº©y Archimedes: F_A = d_liquid * V_submerged * g
  // Trá»ng lá»±c: P = m * g = d_object * V_total * g
  // Ná»•i khi F_A = P => V_submerged / V_total = d_object / d_liquid
  const submergedRatio = isFloating ? density / liquidDensity : 1;
  
  // TÃ­nh toÃ¡n vá»‹ trÃ­ Y cho animation (mÃ´ phá»ng)
  // Bá»ƒ nÆ°á»›c tá»« y=100 Ä‘áº¿n y=300 (máº·t nÆ°á»›c á»Ÿ y=100)
  // Khá»‘i váº­t cÃ³ chiá»u cao giáº£ Ä‘á»‹nh tá»· lá»‡ vá»›i cbrt(volume)
  const boxSize = Math.max(20, Math.min(80, Math.cbrt(volume) * 10));
  
  // Náº¿u chÃ¬m: cháº¡m Ä‘Ã¡y (y=300 - boxSize)
  // Náº¿u ná»•i: pháº§n chÃ¬m = submergedRatio * boxSize, máº·t nÆ°á»›c y=100 => vá»‹ trÃ­ y = 100 - boxSize + (submergedRatio * boxSize)
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
            borderRadius: material.name === 'NÆ°á»›c Ä‘Ã¡' ? '8px' : '4px',
            left: 'calc(50% - ' + boxSize/2 + 'px)',
            top: 0
          }}
        >
          {mass.toFixed(0)}g
        </motion.div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Váº­t liá»‡u */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px]">Váº­t thá»ƒ</label>
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
              <label className="text-[9px] font-bold text-viet-text-light">Khá»‘i lÆ°á»£ng (m)</label>
              <span className="text-[12px] font-black">{mass.toFixed(1)} g</span>
            </div>
            <input type="range" min="1" max="200" step="1" value={mass} onChange={e => setMass(parseFloat(e.target.value))}
              className="w-full h-2 bg-viet-border rounded-full appearance-none accent-viet-text" />
          </div>

          {material.name === 'TÃ¹y chá»‰nh' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <div className="flex justify-between mb-1 mt-2">
                <label className="text-[9px] font-bold text-viet-text-light">Thá»ƒ tÃ­ch (V)</label>
                <span className="text-[12px] font-black">{customVol.toFixed(1)} cmÂ³</span>
              </div>
              <input type="range" min="1" max="200" step="1" value={customVol} onChange={e => setCustomVol(parseFloat(e.target.value))}
                className="w-full h-2 bg-viet-border rounded-full appearance-none accent-amber-500" />
            </motion.div>
          )}
        </div>

        {/* Cháº¥t lá»ng */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px]">Cháº¥t lá»ng</label>
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
        <h4 className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px] mb-3">ThÃ´ng sá»‘ & Káº¿t quáº£ (d = m / V)</h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-3">
            <div className="text-[9px] font-bold text-viet-text-light uppercase">Khá»‘i lÆ°á»£ng riÃªng (Váº­t)</div>
            <div className="text-[18px] font-black text-viet-text">{density.toFixed(2)} <span className="text-[10px]">g/cmÂ³</span></div>
          </div>
          <div className="bg-white rounded-xl p-3">
            <div className="text-[9px] font-bold text-viet-text-light uppercase">Thá»ƒ tÃ­ch (Váº­t)</div>
            <div className="text-[18px] font-black text-viet-text">{volume.toFixed(2)} <span className="text-[10px]">cmÂ³</span></div>
          </div>
          <div className="bg-white rounded-xl p-3">
            <div className="text-[9px] font-bold text-viet-text-light uppercase">Tráº¡ng thÃ¡i</div>
            <div className={`text-[18px] font-black ${isFloating ? 'text-blue-500' : 'text-gray-600'}`}>
              {isFloating ? 'Ná»•i' : 'ChÃ¬m'}
            </div>
          </div>
        </div>
        {isFloating && (
          <div className="mt-3 text-[11px] font-bold text-blue-600 bg-blue-50 p-2 rounded-lg text-center border border-blue-200">
            Váº­t ná»•i vÃ  chÃ¬m {(submergedRatio * 100).toFixed(1)}% trong {liquid.name}.
          </div>
        )}
      </div>
    </div>
  );
};

export default DensitySim;

