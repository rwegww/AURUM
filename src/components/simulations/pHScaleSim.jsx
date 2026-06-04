import React, { useState } from 'react';

// Dá»¯ liá»‡u pH chuáº©n cá»§a cÃ¡c cháº¥t phá»• biáº¿n (25Â°C)
const SUBSTANCES = [
  { name: 'HCl 1M', pH: 0, color: '#ff1a1a', category: 'Axit máº¡nh' },
  { name: 'Axit dáº¡ dÃ y', pH: 1.5, color: '#ff4d4d', category: 'Axit máº¡nh' },
  { name: 'NÆ°á»›c chanh', pH: 2.3, color: '#ff6b35', category: 'Axit yáº¿u' },
  { name: 'Giáº¥m (CHâ‚ƒCOOH)', pH: 2.9, color: '#ff8c42', category: 'Axit yáº¿u' },
  { name: 'NÆ°á»›c cam', pH: 3.5, color: '#ffaa33', category: 'Axit yáº¿u' },
  { name: 'CÃ  phÃª Ä‘en', pH: 5.0, color: '#c4a035', category: 'Axit yáº¿u' },
  { name: 'Sá»¯a tÆ°Æ¡i', pH: 6.5, color: '#a8b834', category: 'Gáº§n trung tÃ­nh' },
  { name: 'NÆ°á»›c cáº¥t (Hâ‚‚O)', pH: 7.0, color: '#76c034', category: 'Trung tÃ­nh' },
  { name: 'MÃ¡u ngÆ°á»i', pH: 7.4, color: '#34b876', category: 'BazÆ¡ yáº¿u' },
  { name: 'NÆ°á»›c biá»ƒn', pH: 8.1, color: '#34a4b8', category: 'BazÆ¡ yáº¿u' },
  { name: 'XÃ  phÃ²ng', pH: 10.0, color: '#3478b8', category: 'BazÆ¡ yáº¿u' },
  { name: 'Amoniac (NHâ‚ƒ)', pH: 11.6, color: '#4834b8', category: 'BazÆ¡' },
  { name: 'NÆ°á»›c javel (NaClO)', pH: 12.5, color: '#6b34b8', category: 'BazÆ¡ máº¡nh' },
  { name: 'NaOH 1M', pH: 14.0, color: '#9b34b8', category: 'BazÆ¡ máº¡nh' },
];

const PHScaleSim = () => {
  const [selectedIdx, setSelectedIdx] = useState(7); // NÆ°á»›c cáº¥t máº·c Ä‘á»‹nh
  const substance = SUBSTANCES[selectedIdx];
  const hConc = Math.pow(10, -substance.pH);
  const ohConc = Math.pow(10, -(14 - substance.pH));
  const pOH = 14 - substance.pH;

  const getAcidityLabel = (pH) => {
    if (pH < 3) return 'Axit máº¡nh';
    if (pH < 7) return 'Axit';
    if (pH === 7) return 'Trung tÃ­nh';
    if (pH < 11) return 'BazÆ¡';
    return 'BazÆ¡ máº¡nh';
  };

  return (
    <div className="space-y-6">
      {/* pH Scale Visual */}
      <div className="bg-white rounded-2xl p-5 border border-viet-border">
        {/* Scale bar */}
        <div className="relative h-12 rounded-xl overflow-hidden mb-2"
          style={{ background: 'linear-gradient(to right, #ff1a1a, #ff6b35, #ffaa33, #c4a035, #76c034, #34b876, #3478b8, #4834b8, #9b34b8)' }}>
          {/* Indicator */}
          <div className="absolute top-0 h-full w-1 bg-white shadow-lg transition-all duration-500 z-10"
            style={{ left: `${(substance.pH / 14) * 100}%`, transform: 'translateX(-50%)' }}>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-viet-text text-white text-[11px] font-black px-2 py-0.5 rounded-md whitespace-nowrap">
              pH {substance.pH}
            </div>
          </div>
        </div>

        {/* Scale labels */}
        <div className="flex justify-between text-[9px] font-black text-[#b4bac2] uppercase">
          <span>0 (Axit)</span>
          <span>7 (Trung tÃ­nh)</span>
          <span>14 (BazÆ¡)</span>
        </div>
      </div>

      {/* Beaker with solution color */}
      <div className="flex justify-center">
        <div className="relative">
          <svg width="160" height="180" viewBox="0 0 160 180">
            <rect x="20" y="20" width="120" height="140" rx="6" fill="none" stroke="#ddd" strokeWidth="2" />
            <rect x="22" y="60" width="116" height="98" rx="4" fill={substance.color} opacity="0.35" className="transition-all duration-500" />
            <rect x="22" y="60" width="116" height="98" rx="4" fill={substance.color} opacity="0.15" />
            <text x="80" y="115" textAnchor="middle" fill={substance.color} fontSize="13" fontWeight="900">{substance.name}</text>
          </svg>
        </div>
      </div>

      {/* Substance Selector */}
      <div>
        <label className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px] block mb-2">Chá»n cháº¥t</label>
        <div className="grid grid-cols-2 gap-1.5 max-h-[200px] overflow-y-auto pr-1">
          {SUBSTANCES.map((s, i) => (
            <button key={s.name} onClick={() => setSelectedIdx(i)}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-[11px] font-bold transition-all text-left ${i === selectedIdx ? 'bg-white border-2 border-viet-green shadow-md' : 'bg-viet-bg border-2 border-transparent hover:border-viet-green/20'}`}>
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
              <div>
                <div className="text-viet-text font-black text-[11px]">{s.name}</div>
                <div className="text-[9px] text-viet-text-light">pH {s.pH}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="bg-viet-bg rounded-2xl p-5 space-y-3">
        <h4 className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px]">ThÃ´ng sá»‘ hÃ³a há»c</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3">
            <div className="text-[9px] font-bold text-viet-text-light uppercase">pH</div>
            <div className="text-[22px] font-black" style={{ color: substance.color }}>{substance.pH}</div>
          </div>
          <div className="bg-white rounded-xl p-3">
            <div className="text-[9px] font-bold text-viet-text-light uppercase">pOH = 14 - pH</div>
            <div className="text-[22px] font-black text-viet-text">{pOH.toFixed(1)}</div>
          </div>
          <div className="bg-white rounded-xl p-3">
            <div className="text-[9px] font-bold text-viet-text-light uppercase">[Hâº] = 10â»áµ–á´´</div>
            <div className="text-[14px] font-black text-viet-green">{hConc.toExponential(2)} <span className="text-[9px]">mol/L</span></div>
          </div>
          <div className="bg-white rounded-xl p-3">
            <div className="text-[9px] font-bold text-viet-text-light uppercase">[OHâ»] = 10â»áµ–á´¼á´´</div>
            <div className="text-[14px] font-black text-viet-text">{ohConc.toExponential(2)} <span className="text-[9px]">mol/L</span></div>
          </div>
        </div>
        <div className="text-center p-3 rounded-xl" style={{ backgroundColor: substance.color + '15', borderColor: substance.color, borderWidth: 2 }}>
          <span className="text-[12px] font-black" style={{ color: substance.color }}>{getAcidityLabel(substance.pH)}</span>
        </div>
      </div>
    </div>
  );
};

export default PHScaleSim;

