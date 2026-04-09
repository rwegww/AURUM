import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { molecules } from '../../data/molecules';
import { elements } from '../../data/elements';
import { craftableItems } from '../../data/labInventory';

// Helper to normalize formulas (H₂ -> H2)
const normalize = (f) => {
  if (!f) return "";
  const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  return f.toString().replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => subMap[m]).trim().toUpperCase();
};

const calculateMolarMass = (formula, elements) => {
  if (!formula) return 0;
  // Use a case-sensitive version for mass calculation
  const clean = formula.toString().replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => {
    const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
    return subMap[m];
  }).trim();

  const parse = (f) => {
    let total = 0;
    let i = 0;
    while (i < f.length) {
      if (f[i] === '(') {
        let count = 1;
        let start = i + 1;
        let pMatch = 1;
        while (pMatch > 0 && ++i < f.length) {
          if (f[i] === '(') pMatch++;
          if (f[i] === ')') pMatch--;
        }
        let sub = f.substring(start, i);
        i++;
        let multiplierMatch = f.substring(i).match(/^\d+/);
        let multiplier = 1;
        if (multiplierMatch) {
          multiplier = parseInt(multiplierMatch[0]);
          i += multiplierMatch[0].length;
        }
        total += parse(sub) * multiplier;
      } else {
        let match = f.substring(i).match(/^([A-Z][a-z]*)(\d*)/);
        if (match) {
          const sym = match[1];
          const count = parseInt(match[2] || "1");
          const el = elements.find(e => e.symbol === sym);
          if (el) total += parseFloat(el.weight) * count;
          i += match[0].length;
        } else {
          i++;
        }
      }
    }
    return total;
  };
  const result = parse(clean);
  return result > 0 ? result.toFixed(3) : "??";
};

const getApplications = (formula, name, category) => {
  const apps = {
    'H2O': 'Sự sống, dung môi vạn năng, làm mát công nghiệp.',
    'NACL': 'Gia vị thực phẩm, bảo quản thức ăn, sản xuất xút-clo.',
    'CO2': 'Nhiên lỏng, chữa cháy, công nghệ thực phẩm (nước ngọt).',
    'O2': 'Duy trì sự sống, y tế, tên lửa, luyện kim.',
    'H2': 'Nhiên liệu sạch, sản xuất amoniac, công nghiệp thực phẩm.',
    'H2SO4': 'Sản xuất phân bón, chất tẩy rửa, ắc quy chì.',
    'NAOH': 'Sản xuất xà phòng, giấy, xử lý nước thải.',
    'FE3O4': 'Sản xuất nam châm, sơn chống gỉ, core cho linh kiện điện tử.',
    'HCL': 'Tẩy gỉ thép, điều chỉnh pH, sản xuất hợp chất vô cơ.',
    'NH3': 'Phân bón (đạm), hệ thống làm lạnh công nghiệp.',
    'CACO3': 'Sản xuất xi măng, vôi, phấn viết, thực phẩm bổ sung.',
    'AL': 'Vật liệu hàng không, bao bì, dây điện, xây dựng.',
    'FE': 'Cốt thép xây dựng, máy móc, linh kiện, hemoglobin trong máu.',
    'CU': 'Dây dẫn điện, vi mạch, trang trí, đồng đúc tượng.',
    'ZN': 'Mạ chống gỉ cho thép, sản xuất pin, hợp kim đồng thau.'
  };
  const norm = normalize(formula);
  if (apps[norm]) return apps[norm];
  if (category?.includes('Axit')) return 'Sản xuất hóa chất, tẩy rửa bề mặt, điều chỉnh pH.';
  if (category?.includes('Bazơ')) return 'Xử lý nước, sản xuất chất tẩy rửa, xà phòng.';
  if (category?.includes('Muối')) return 'Công nghiệp thực phẩm, sản xuất phân bón, hóa chất.';
  if (category?.includes('Kim loại')) return 'Cơ khí chế tạo, điện tử, xây dựng.';
  return 'Nghiên cứu khoa học, giáo dụng và mô phỏng thí nghiệm.';
};

const getElementCount = (formula) => {
  const norm = normalize(formula);
  const elements = norm.match(/[A-Z][a-z]?/g);
  return elements ? new Set(elements).size : 1;
};

const DiscoveryMap = ({ chemicals = [], reactions = [], discoveredFormulas = [] }) => {
  const [scale, setScale] = useState(0.8);
  const [position, setPosition] = useState({ x: 0, y: -200 });
  const [selectedId, setSelectedId] = useState(null);

  const normalizedDiscovered = useMemo(() => 
    new Set(discoveredFormulas.map(f => normalize(f)))
  , [discoveredFormulas]);

  // Graph Data Processing
  const graphData = useMemo(() => {
    const nodes = {};
    const layers = [];
    const allEdges = [];

    // Initialize nodes with complexity-based levels for starters
    chemicals.forEach(chem => {
      const normF = normalize(chem.formula);
      const isStarter = chem.is_starter || chem.isStarter;
      const complexity = getElementCount(normF);
      
      nodes[normF] = { 
        ...chem, 
        is_starter: isStarter,
        normalizedFormula: normF,
        isDiscovered: normalizedDiscovered.has(normF), 
        level: isStarter ? complexity - 1 : -1, 
        parents: [], 
        children: [] 
      };
    });

    // Propagate levels through reactions
    let changed = true;
    let iteration = 0;
    const visited = new Set(Object.keys(nodes).filter(id => nodes[id].is_starter));

    while (changed && iteration < 15) {
      changed = false;
      iteration++;
      
      reactions.forEach(rx => {
        const rids = rx.reactants.map(r => normalize(r.formula));
        const pids = rx.products.map(p => normalize(p.formula));
        
        // Match reaction if all reactants have an assigned level
        if (rids.length > 0 && rids.every(rid => nodes[rid] && nodes[rid].level >= 0)) {
           const maxParentLevel = Math.max(...rids.map(rid => nodes[rid].level));
           const targetLevel = maxParentLevel + 1;

            pids.forEach(pid => {
              // Register connections for edges (will be unique-ified later)
              rids.forEach(rid => {
                // Hierarchical Enforcement: Only connect if product level is greater than reactant level
                // This prevents sibling connections between reactants.
                if (nodes[rid] && nodes[pid] && nodes[pid].level > nodes[rid].level) {
                   allEdges.push({ from: rid, to: pid });
                }
              });

              if (nodes[pid] && (nodes[pid].level === -1 || targetLevel < nodes[pid].level)) {
                 nodes[pid].level = targetLevel;
                 visited.add(pid);
                 changed = true;
              }
            });
        }
      });
    }

    // Build layers array from calculated levels
    const maxLevel = Math.max(0, ...Object.values(nodes).map(n => n.level));
    for (let i = 0; i <= maxLevel; i++) {
      const layerNodes = Object.keys(nodes).filter(id => nodes[id].level === i);
      if (layerNodes.length > 0) {
        layers[i] = layerNodes;
      }
    }

    // Build unique connections
    const uniqueConns = [];
    const connSeen = new Set();
    allEdges.forEach(edge => {
      const pair = `${edge.from}->${edge.to}`;
      if (!connSeen.has(pair) && nodes[edge.from] && nodes[edge.to]) {
        uniqueConns.push(edge);
        connSeen.add(pair);
        if (!nodes[edge.from].children.includes(edge.to)) nodes[edge.from].children.push(edge.to);
        if (!nodes[edge.to].parents.includes(edge.from)) nodes[edge.to].parents.push(edge.from);
      }
    });

    // Coordinate System
    const coords = {};
    const NODE_WIDTH = 220;
    const HORIZONTAL_GAP = 120;
    const VERTICAL_GAP = 350;

    layers.forEach((layerIds, lIdx) => {
      const sortedIds = [...layerIds].sort((a, b) => (nodes[a]?.type || '').localeCompare(nodes[b]?.type || ''));
      const totalW = (sortedIds.length * (NODE_WIDTH + HORIZONTAL_GAP)) - HORIZONTAL_GAP;
      sortedIds.forEach((id, idx) => {
        coords[id] = {
          x: (idx * (NODE_WIDTH + HORIZONTAL_GAP)) - (totalW / 2),
          y: lIdx * VERTICAL_GAP
        };
      });
    });

    return { nodes, connections: uniqueConns, coords };
  }, [chemicals, reactions, normalizedDiscovered]);

  const { nodes, connections, coords } = graphData;

  const handleReset = () => { setScale(0.8); setPosition({ x: 0, y: -200 }); };
  const handleZoom = (e) => setScale(prev => Math.min(Math.max(prev * (e.deltaY > 0 ? 0.9 : 1.1), 0.2), 3));

  const nodeColor = (type) => {
    if (type?.includes('Kim loại')) return '#3b82f6';
    if (type?.includes('Axit')) return '#ef4444';
    if (type?.includes('Bazơ')) return '#10b981';
    if (type?.includes('Muối')) return '#f59e0b';
    return '#76c034';
  };

  const selectedData = useMemo(() => {
    if (!selectedId) return null;
    const node = nodes[selectedId];
    if (!node) return null;

    // 1. Check discovered status
    const isDiscovered = node.isDiscovered || node.is_starter;
    
    // 2. Try to find in molecules
    const molecule = molecules.find(m => normalize(m.formula) === selectedId);
    if (molecule) return { ...molecule, isDiscovered };

    // 3. Try to find in elements
    const element = elements.find(e => normalize(e.symbol) === selectedId);
    if (element) return { ...element, isDiscovered, name: element.name, description: element.desc };

    // 4. Try to find in craftableItems
    const craftable = craftableItems.find(c => normalize(c.formula) === selectedId);
    if (craftable) return { ...craftable, isDiscovered };

    return { ...node, isDiscovered };
  }, [selectedId, nodes]);

  const discoveredCount = Array.from(normalizedDiscovered).filter(f => nodes[f] && !nodes[f].is_starter).length;
  const totalCount = Object.values(nodes).filter(n => !n.is_starter).length || 1;
  const progressPercent = Math.round((discoveredCount / totalCount) * 100);
  const maxDepth = Math.max(0, ...Object.values(nodes).map(n => n.level));

  return (
    <div className="w-full h-full bg-[#0a0c10] overflow-hidden relative rounded-[32px] cursor-grab active:cursor-grabbing border border-white/5" onWheel={handleZoom}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <motion.div 
        drag dragMomentum={false} animate={{ x: position.x, y: position.y, scale }}
        onDragEnd={(_, info) => setPosition({ x: position.x + info.offset.x, y: position.y + info.offset.y })}
        className="absolute inset-x-1/2 inset-y-1/2" // Removed origin-center to test stability
      >
        {/* SVG Plane */}
        <svg style={{ position: 'absolute', width: 10000, height: 10000, left: -5000, top: -5000, overflow: 'visible', pointerEvents: 'none' }}>
          <defs>
             {/* Flattened: Removed neon filters */}
          </defs>

          {/* Test Pattern: Draw a circle at the origin to verify SVG position */}
          <circle cx="5000" cy="5000" r="10" fill="red" opacity="0.5" />

          {connections.map((conn, idx) => {
            const from = coords[conn.from];
            const to = coords[conn.to];
            if (!from || !to) return null;

            const nTo = nodes[conn.to];
            const nFrom = nodes[conn.from];
            const active = nTo?.isDiscovered;
            const potential = nFrom?.isDiscovered || nFrom?.is_starter;
            if (!potential) return null;

            // Offset by 5000 to match the absolute SVG plane
            const x1 = from.x + 110 + 5000;
            const y1 = from.y + 100 + 5000;
            const x2 = to.x + 110 + 5000;
            const y2 = to.y + 5000;
            const midY = y1 + (y2 - y1) * 0.5;
            const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

            return (
              <motion.path
                key={idx} d={d} stroke={active ? nodeColor(nTo.type) : "rgba(255,255,255,0.4)"}
                strokeWidth={active ? 3 : 2} strokeDasharray={active ? "none" : "6,6"}
                fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                style={active ? { strokeOpacity: 0.9 } : { strokeOpacity: 0.4 }}
              />
            );
          })}
        </svg>

        {Object.entries(nodes).map(([id, node]) => {
          const pos = coords[id];
          if (!pos) return null;
          const discovered = node.isDiscovered || node.is_starter;
          const near = node.parents.some(pid => nodes[pid]?.isDiscovered || nodes[pid]?.is_starter);
          if (!discovered && !near) return null;

          return (
            <motion.div
              key={id} initial={{ scale: 0 }} animate={{ scale: 1 }}
              whileHover={{ scale: discovered ? 1.05 : 1, y: -5 }}
              onClick={() => setSelectedId(id)}
              className={`absolute p-6 rounded-[32px] border-2 flex flex-col items-center justify-center transition-all duration-700 cursor-pointer ${
                discovered ? 'bg-[#1a1c23] border-viet-green border-opacity-60 shadow-[0_0_20px_rgba(118,192,52,0.1)]' : 'bg-[#1a1c23]/40 border-white/10 grayscale opacity-40'
              } ${selectedId === id ? 'ring-4 ring-viet-green ring-offset-4 ring-offset-[#0a0c10]' : ''}`}
              style={{ left: pos.x, top: pos.y, width: 220, height: 100 }}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-black italic tracking-tighter" style={{ color: discovered ? node.color : 'inherit' }}>{node.formula}</span>
                <span className="text-[9px] font-black uppercase text-center truncate w-full opacity-40">{discovered ? node.name : 'Vật chất bí ẩn'}</span>
              </div>
              {node.is_starter && (
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center border-4 border-[#0a0c10] rotate-12">
                   <span className="text-[7px] font-black uppercase tracking-widest">Gốc</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Global Progress Slider & Controls - Bottom Right */}
      <motion.div 
        drag
        dragMomentum={false}
        whileDrag={{ scale: 1.02 }}
        className="absolute bottom-10 right-10 flex flex-col items-end gap-6 z-50 cursor-grab active:cursor-grabbing"
      >
        <div className="flex flex-col items-end gap-3">
          <button onClick={handleReset} className="px-6 py-4 bg-viet-green text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 shadow-xl transition-all">🎯 Tâm điểm</button>
          <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-full px-4 py-2">
            <p className="text-[8px] font-black text-white/30 uppercase tracking-[3px]">Cuộn để thu phóng • Kéo để di chuyển</p>
          </div>
        </div>

        <div className="bg-[#1a1c23]/80 backdrop-blur-2xl border border-white/10 p-5 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[300px]">
          <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-viet-green animate-pulse" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[4px]">Thu phóng & Phạm vi</span>
              </div>
              <span className="text-xl font-black text-viet-green italic">{Math.round(((scale - 0.2) / (3 - 0.2)) * 100)}%</span>
            </div>
          
          <div className="relative h-6 flex items-center group/slider">
            {/* Real Slider Input (Hidden but functional) */}
            <input 
              type="range" 
              min="0.2" 
              max="3" 
              step="0.01" 
              value={scale} 
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            
            {/* Track */}
            <div className="absolute inset-0 h-1.5 top-1/2 -translate-y-1/2 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${((scale - 0.2) / (3 - 0.2)) * 100}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-viet-green shadow-[0_0_15px_rgba(74,222,128,0.5)]"
              />
            </div>
            
            {/* Slider Thumb */}
            <motion.div 
              animate={{ left: `${((scale - 0.2) / (3 - 0.2)) * 100}%` }}
              className="absolute w-8 h-8 rounded-full bg-white shadow-2xl border-4 border-viet-green flex items-center justify-center -translate-x-1/2 pointer-events-none group-hover/slider:scale-110 transition-transform"
            >
              <div className="w-2 h-2 bg-viet-green rounded-full shadow-[0_0_10px_rgba(74,222,128,1)]" />
            </motion.div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/50">
                <span>Tiến độ khám phá</span>
                <span className="text-viet-green">{progressPercent}%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[7px] font-black text-white/20 uppercase tracking-[2px]">Đã tạo</span>
                    <span className="text-[10px] font-black text-white/80">{discoveredCount} chất</span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[7px] font-black text-white/20 uppercase tracking-[2px]">Mạng lưới</span>
                    <span className="text-[10px] font-black text-white/80">Cấp độ: {maxDepth}</span>
                </div>
              </div>
          </div>
        </div>
      </motion.div>
      {/* Substance Detail Card */}
      <AnimatePresence>
        {selectedId && selectedData && (
          <>
            {/* Backdrop Mask */}
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setSelectedId(null)}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            
            {/* Side Card */}
            <motion.div 
               initial={{ x: 400, opacity: 0 }} 
               animate={{ x: 0, opacity: 1 }} 
               exit={{ x: 400, opacity: 0 }}
               className="absolute top-10 right-10 bottom-10 w-[450px] bg-[#1a1c23]/90 backdrop-blur-3xl border border-white/10 rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-[101] overflow-hidden flex flex-col"
            >
               {/* Card Header & Glow */}
               <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-viet-green to-transparent opacity-50" />
               
               <div className="p-10 flex flex-col items-center text-center">
                  <button onClick={() => setSelectedId(null)} className="absolute top-8 left-8 w-12 h-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all border border-white/5">
                     <span className="text-white/60 text-xl font-light">✕</span>
                  </button>

                  <div className="mt-10 mb-8 relative">
                     <motion.div 
                        animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-10 bg-viet-green/5 blur-3xl rounded-full" 
                     />
                     <h2 className="text-8xl font-black italic tracking-tighter text-white font-sora relative z-10">
                        {selectedData.formula || selectedData.symbol}
                     </h2>
                  </div>

                  <h3 className="text-3xl font-black text-white mb-2">{selectedData.isDiscovered ? selectedData.name : 'Vật chất bí ẩn'}</h3>
                  <div className="px-6 py-1.5 bg-viet-green text-white rounded-full text-[10px] font-black uppercase tracking-[3px] shadow-lg shadow-viet-green/20">
                     {selectedData.category || 'Vật chất'}
                  </div>
               </div>

               <div className="flex-grow p-10 pt-0 flex flex-col gap-8 custom-scrollbar overflow-y-auto">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-viet-green">🔬</div>
                        <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[4px]">Tính chất & Mô tả</h4>
                     </div>
                     <div className="bg-white/5 p-8 rounded-[32px] border border-white/5">
                        <p className="text-white/80 text-[15px] leading-relaxed font-medium italic">
                           {selectedData.isDiscovered ? (selectedData.description || 'Chưa có mô tả chi tiết cho vật chất này.') : 'Bạn chưa khám phá ra bí mật của vật chất này. Hãy thử kết hợp các nguyên tố trong phòng Lab!'}
                        </p>
                     </div>
                  </div>

                  <div className="flex flex-col gap-6">
                     <div className="bg-white/5 p-6 rounded-[24px] border border-white/5 flex flex-col gap-2">
                        <span className="text-[8px] font-black text-viet-green uppercase tracking-[3px]">Khối lượng nguyên tử / phân tử</span>
                        <div className="flex items-baseline gap-2">
                           <span className="text-3xl font-black text-white italic">{calculateMolarMass(selectedData.formula || selectedData.symbol, elements)}</span>
                           <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">u (amu)</span>
                        </div>
                     </div>

                     <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 space-y-3">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-viet-green" />
                           <span className="text-[8px] font-black text-white/40 uppercase tracking-[3px]">Ứng dụng trong đời sống</span>
                        </div>
                        <p className="text-white/80 text-[13px] leading-relaxed font-semibold italic border-l-2 border-viet-green/20 pl-4">
                           {selectedData.isDiscovered ? getApplications(selectedData.formula || selectedData.symbol, selectedData.name, selectedData.category) : 'Khám phá chất này trong phòng Lab để tìm hiểu các ứng dụng thực tế phong phú!'}
                        </p>
                     </div>
                  </div>

                  {selectedData.isDiscovered && (
                    <motion.button 
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full mt-auto py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black text-[11px] uppercase tracking-[4px] transition-all"
                    >
                      Xem mô hình 3D
                    </motion.button>
                  )}
               </div>

               {/* Footer Decoration */}
               <div className="p-8 border-t border-white/5 flex justify-center">
                  <div className="flex gap-1">
                     {[...Array(3)].map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-viet-green/30" />)}
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiscoveryMap;
