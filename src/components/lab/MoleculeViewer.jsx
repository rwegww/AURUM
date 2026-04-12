import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { molecules, bondTypeLabels, elementColors, elementRadii } from '../../data/molecules';
import { useAuth } from '@/context/AuthContext';

const normalize = (f) => {
  if (!f) return "";
  const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  return f.toString().replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => subMap[m]).trim().toUpperCase();
};

const MoleculeViewer = () => {
  const { user, isLoggedIn } = useAuth();
  const [allChemicals, setAllChemicals] = useState([]);
  const [discoveredFormulas, setDiscoveredFormulas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMolecule, setSelectedMolecule] = useState(null);
  const [viewMode, setViewMode] = useState('ball-stick'); // 'ball-stick' or 'space-fill'
  const [showLabels, setShowLabels] = useState(true);
  const [showBondInfo, setShowBondInfo] = useState(true);
  const [hoveredAtom, setHoveredAtom] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [zoom, setZoom] = useState(1.5);
  const [rotation, setRotation] = useState({ x: 0.3, y: 0.5 }); // Initial tilt
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const viewportRef = useRef(null);

  // Sync with Laboratory Cabinet data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const res = await fetch('/api/lab/chemicals', { headers });
        const chemsData = await res.json();
        setAllChemicals(chemsData);
        
        // Progression Logic (matches ReactionSimulator)
        const starters = chemsData.filter(c => c.is_starter || c.isStarter).map(c => c.formula);
        
        if (isLoggedIn && user) {
          setDiscoveredFormulas(Array.from(new Set([...starters, ...(user.unlockedChemicals || [])])));
        } else {
          const saved = localStorage.getItem('chem_odyssey_discovered');
          if (saved) {
            try {
              setDiscoveredFormulas(Array.from(new Set([...starters, ...JSON.parse(saved)])));
            } catch (e) { setDiscoveredFormulas(starters); }
          } else {
            setDiscoveredFormulas(starters);
          }
        }
      } catch (err) {
        console.error("Failed to sync molecule library:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user, isLoggedIn]);

  const synchronizedMolecules = useMemo(() => {
    const normDiscovered = discoveredFormulas.map(f => normalize(f));
    
    // Sub-function to generate a simple visual structure for unknown molecules
    const generateFallbackModel = (formula, name) => {
      let norm = formula.toString();
      const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
      norm = norm.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => subMap[m]);
      
      const parts = norm.match(/([A-Z][a-z]?)(\d*)/g) || [];
      let atoms = [];
      let idCounter = 0;
      
      parts.forEach(part => {
        const elemMatch = part.match(/[A-Z][a-z]?/);
        const countMatch = part.match(/\d+/);
        const elem = elemMatch ? elemMatch[0] : 'Unknown';
        const count = countMatch ? parseInt(countMatch[0]) : 1;
        
        for(let i=0; i<count; i++) {
           atoms.push({ id: idCounter++, element: elem, position: [0, 0, 0] });
        }
      });

      // Distribute positions
      if (atoms.length > 1) {
          atoms[0].position = [0, 0, 0]; // Center atom
          for(let i=1; i<atoms.length; i++) {
              const angle = (i - 1) * (Math.PI * 2) / (atoms.length - 1);
              // Slight spacing for generic bonds
              atoms[i].position = [Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, (i%2)*0.2];
          }
      }

      const bonds = [];
      for(let i=1; i<atoms.length; i++) {
          bonds.push({ from: 0, to: i, type: "single" });
      }

      return {
        id: formula.toLowerCase(),
        name: name,
        formula: formula,
        description: "Mô hình cấu trúc giả lập cơ bản.",
        atoms,
        bonds
      };
    };

    // Merge API chemical meta with static 3D coordinate data
    return allChemicals
      .filter(chem => normDiscovered.includes(normalize(chem.formula)))
      .map(chem => {
        const model3d = molecules.find(m => normalize(m.formula) === normalize(chem.formula));
        const finalModel = model3d || generateFallbackModel(chem.formula, chem.name);
        
        return {
          ...finalModel,
          name: chem.name, // Use name from API
          category: chem.type || finalModel.category || 'Khác', // Use type from API as category
          gradeLevel: chem.grade_level || finalModel.gradeLevel || 8
        };
      });
  }, [allChemicals, discoveredFormulas]);

  useEffect(() => {
    if (synchronizedMolecules.length > 0 && !selectedMolecule) {
        setSelectedMolecule(synchronizedMolecules[0]);
    }
  }, [synchronizedMolecules]);

  const categories = useMemo(() => {
    const cats = new Set(synchronizedMolecules.map(m => m.category));
    return ['all', ...Array.from(cats)];
  }, [synchronizedMolecules]);

  const filteredMolecules = useMemo(() => {
    if (filterCategory === 'all') return synchronizedMolecules;
    return synchronizedMolecules.filter(m => m.category === filterCategory);
  }, [filterCategory, synchronizedMolecules]);

  // 3D Projection & Rotation Logic
  const projectedData = useMemo(() => {
    if (!selectedMolecule) return { atoms: [], bonds: [] };

    const { x: rotX, y: rotY } = rotation;
    const cx = Math.cos(rotX);
    const sx = Math.sin(rotX);
    const cy = Math.cos(rotY);
    const sy = Math.sin(rotY);

    // Project Atoms
    const atoms = selectedMolecule.atoms.map(atom => {
      let [x, y, z] = atom.position;

      // Rotate Y
      const x1 = x * cy + z * sy;
      const z1 = -x * sy + z * cy;

      // Rotate X
      const y2 = y * cx - z1 * sx;
      const z2 = y * sx + z1 * cx;

      const scale = 80 * zoom; 
      return {
        ...atom,
        projX: x1 * scale + 210, // Center X
        projY: y2 * scale + 180, // Center Y
        projZ: z2,
        color: elementColors[atom.element] || '#ccc',
        radius: elementRadii[atom.element] || 15
      };
    });

    // Project & Sort Bonds
    const bonds = selectedMolecule.bonds.map(bond => {
      const fromAtom = atoms.find(a => a.id === bond.from);
      const toAtom = atoms.find(a => a.id === bond.to);
      return {
        ...bond,
        fromAtom,
        toAtom,
        avgZ: (fromAtom?.projZ + toAtom?.projZ) / 2
      };
    });

    return { atoms, bonds };
  }, [selectedMolecule, rotation, zoom]);

  // Depth Sorting: Render items from back to front
  const zOrderedItems = useMemo(() => {
    const items = [
      ...projectedData.atoms.map(a => ({ type: 'atom', z: a.projZ + 0.1, data: a })), // Bias atoms forward so they appear on top of bonds
      ...projectedData.bonds.map(b => ({ type: 'bond', z: b.avgZ, data: b }))
    ];
    return items.sort((a, b) => a.z - b.z);
  }, [projectedData]);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    
    setRotation(prev => ({
      x: prev.x + dy * 0.01,
      y: prev.y + dx * 0.01
    }));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, [isDragging, lastMousePos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.2, Math.min(5, prev + delta)));
  }, []);

  // Attach non-passive wheel listener manually to allow preventDefault()
  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.addEventListener('wheel', handleWheel, { passive: false });
      return () => viewport.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  const resetView = () => {
    setZoom(1.5);
    setRotation({ x: 0.3, y: 0.5 });
  };

  const renderBond = (bond) => {
    const { fromAtom, toAtom } = bond;
    if (!fromAtom || !toAtom) return null;

    const dx = toAtom.projX - fromAtom.projX;
    const dy = toAtom.projY - fromAtom.projY;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / len;
    const ny = dx / len;
    const offset = 3;

    const bondColor = bond.type === 'ionic' ? '#f39c12' : '#cbd5e1';
    const strokeWidth = viewMode === 'space-fill' ? 0 : 6;
    const opacity = Math.max(0.3, (bond.avgZ + 2) / 4 + 0.5);

    switch (bond.type) {
      case 'single':
      case 'ionic':
        return (
          <line
            key={`bond-${bond.from}-${bond.to}`}
            x1={fromAtom.projX} y1={fromAtom.projY}
            x2={toAtom.projX} y2={toAtom.projY}
            stroke={bondColor} strokeWidth={strokeWidth} strokeLinecap="round" 
            opacity={0.8} strokeDasharray={bond.type === 'ionic' ? "8,6" : "none"}
          />
        );
      case 'double':
        return (
          <g key={`bond-${bond.from}-${bond.to}`} opacity={opacity}>
            <line
              x1={fromAtom.projX + nx * offset} y1={fromAtom.projY + ny * offset}
              x2={toAtom.projX + nx * offset} y2={toAtom.projY + ny * offset}
              stroke={bondColor} strokeWidth={strokeWidth/1.5} strokeLinecap="round"
            />
            <line
              x1={fromAtom.projX - nx * offset} y1={fromAtom.projY - ny * offset}
              x2={toAtom.projX - nx * offset} y2={toAtom.projY - ny * offset}
              stroke={bondColor} strokeWidth={strokeWidth/1.5} strokeLinecap="round"
            />
          </g>
        );
      case 'triple':
        return (
          <g key={`bond-${bond.from}-${bond.to}`} opacity={opacity}>
            <line x1={fromAtom.projX} y1={fromAtom.projY} x2={toAtom.projX} y2={toAtom.projY} stroke={bondColor} strokeWidth={strokeWidth/2} strokeLinecap="round" />
            <line x1={fromAtom.projX + nx * offset * 1.8} y1={fromAtom.projY + ny * offset * 1.8} x2={toAtom.projX + nx * offset * 1.8} y2={toAtom.projY + ny * offset * 1.8} stroke={bondColor} strokeWidth={strokeWidth/2} strokeLinecap="round" />
            <line x1={fromAtom.projX - nx * offset * 1.8} y1={fromAtom.projY - ny * offset * 1.8} x2={toAtom.projX - nx * offset * 1.8} y2={toAtom.projY - ny * offset * 1.8} stroke={bondColor} strokeWidth={strokeWidth/2} strokeLinecap="round" />
          </g>
        );
      default: return null;
    }
  };

  const renderAtom = (atom) => {
    const isHovered = hoveredAtom === atom.id;
    const baseR = viewMode === 'space-fill' ? atom.radius * 2.8 : atom.radius;
    const r = baseR; // Flattened: Removed perspective scaling

    return (
      <g
        key={`atom-${atom.id}`}
        onMouseEnter={() => setHoveredAtom(atom.id)}
        onMouseLeave={() => setHoveredAtom(null)}
        style={{ cursor: 'pointer' }}
      >
        <defs>
           {/* Flattened: Removed radial gradients */}
        </defs>
        <circle
          cx={atom.projX} cy={atom.projY} r={r}
          fill={atom.color}
          stroke={isHovered ? '#76c034' : atom.color}
          strokeWidth={isHovered ? 2 : 0}
          opacity={1}
        />
        {showLabels && (
          <text
            x={atom.projX} y={atom.projY}
            textAnchor="middle" dominantBaseline="middle"
            fill={atom.element === 'H' ? '#2c3e50' : '#ffffff'}
            fontSize={r * 0.9} fontWeight="900" style={{ pointerEvents: 'none' }}
          >
            {atom.element}
          </text>
        )}
      </g>
    );
  };

  if (isLoading) return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[600px] text-viet-text">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-viet-green border-t-transparent rounded-full mb-6" />
      <h2 className="text-xl font-black italic tracking-widest uppercase animate-pulse">Đang đồng bộ dữ liệu...</h2>
    </div>
  );

  if (synchronizedMolecules.length === 0) return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[600px] text-center p-8">
      <div className="text-6xl mb-6">🔬</div>
      <h2 className="text-2xl font-black text-viet-text italic uppercase mb-2">Thư viện đang trống</h2>
      <p className="text-viet-text-light font-bold max-w-md mx-auto">
        Vào "Mô phỏng phản ứng" để khám phá thêm các chất mới. Mỗi chất bạn phát hiện sẽ xuất hiện tại đây dưới dạng mô hình 3D.
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left Side: Molecule List */}
        <div className="bg-white rounded-[28px] border border-viet-border p-5 shadow-sm flex flex-col h-[700px]">
          <h3 className="text-[12px] font-black text-viet-green uppercase tracking-widest mb-4">Thư viện phân tử 3D</h3>
          
          <div className="flex flex-wrap gap-1.5 mb-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                  filterCategory === cat ? 'bg-viet-green text-white shadow-md' : 'bg-[#f0f2f5] text-viet-text-light hover:bg-[#e2e8f0]'
                }`}
              >
                {cat === 'all' ? 'Tất cả' : cat}
              </button>
            ))}
          </div>

          <div className="space-y-2 overflow-y-auto custom-scrollbar flex-grow pr-1">
            {filteredMolecules.map(mol => (
              <button
                key={mol.id}
                onClick={() => { setSelectedMolecule(mol); resetView(); }}
                className={`w-full text-left p-4 rounded-3xl border transition-all ${
                  selectedMolecule?.id === mol.id ? 'bg-viet-green/5 border-viet-green shadow-sm' : 'bg-white border-viet-border hover:border-viet-green/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-viet-text">{mol.formula}</span>
                    <p className="text-[11px] text-viet-text-light font-bold mt-0.5">{mol.name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-black text-viet-text-light bg-gray-100 px-2 py-0.5 rounded-md uppercase">Lớp {mol.gradeLevel}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Visualizer */}
        <div className="bg-white rounded-[28px] border border-viet-border flex flex-col h-[700px]">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-viet-border bg-[#fdfaf1]">
            <div className="flex items-center gap-4">
               <div className="flex bg-[#f0f2f5] p-1 rounded-[14px]">
                {['ball-stick', 'space-fill'].map(mode => (
                    <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            viewMode === mode ? 'bg-white text-viet-green shadow-sm' : 'text-viet-text-light'
                        }`}
                    >
                        {mode === 'ball-stick' ? 'Mô hình que' : 'Mô hình đặc'}
                    </button>
                ))}
               </div>
               <button onClick={() => setShowLabels(!showLabels)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${showLabels ? 'bg-viet-green/10 border-viet-green/30 text-viet-green' : 'bg-white border-gray-200 text-viet-text-light'}`}>Hiện nhãn</button>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#f0f2f5] px-4 py-2 rounded-xl border border-gray-200">
                    <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="text-xl font-bold hover:text-viet-green transition-colors">−</button>
                    <span className="text-[11px] font-bold w-12 text-center">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(z => Math.min(4, z + 0.2))} className="text-xl font-bold hover:text-viet-green transition-colors">+</button>
                </div>
                <button onClick={resetView} className="px-5 py-2 rounded-xl text-[10px] font-black text-viet-text-light border border-gray-200 bg-white hover:bg-gray-50 uppercase tracking-widest">Đặt lại góc nhìn</button>
            </div>
          </div>

          {/* 3D Viewport */}
          <div
            ref={viewportRef}
            className="flex-grow relative bg-[#fafbfc] cursor-grab active:cursor-grabbing touch-none select-none overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Depth Gradients */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#f8fafc_100%)]" />
            
            <svg viewBox="0 0 420 360" className="w-full h-full relative z-10">
              {zOrderedItems.map(item => 
                item.type === 'bond' ? renderBond(item.data) : renderAtom(item.data)
              )}
            </svg>

            {/* Interaction Help */}
            <div className="absolute top-8 left-8 space-y-3">
                <div className="bg-white rounded-2xl border border-viet-border p-4">
                    <p className="text-[10px] font-black text-viet-green uppercase tracking-widest mb-2">Góc quan sát</p>
                    <div className="space-y-1">
                        <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-viet-green" style={{ width: `${(rotation.y % (Math.PI * 2)) / (Math.PI * 2) * 100}%` }} />
                        </div>
                        <p className="text-[9px] font-bold text-viet-text-light italic">Y-Axis: {Math.round(rotation.y * 180 / Math.PI)}°</p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 right-8 text-[10px] font-black text-viet-text-light/50 flex flex-col items-end gap-1 uppercase tracking-widest">
                <span>Giữ chuột để xoay</span>
                <span>Cuộn để thu phóng</span>
            </div>
          </div>

          {/* Molecule Card */}
          <div className="p-10 border-t border-viet-border bg-white relative z-20">
            <div className="flex items-start justify-between mb-6">
              <div>
                <motion.h2 
                    key={selectedMolecule?.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-black text-viet-text mb-2 font-sora italic"
                >
                    {selectedMolecule?.formula}
                </motion.h2>
                <p className="text-lg font-bold text-viet-green uppercase tracking-[3px]">{selectedMolecule?.name}</p>
              </div>
              <div className="px-6 py-2 bg-viet-green text-white rounded-full text-[11px] font-black uppercase tracking-[2px] shadow-lg shadow-viet-green/20">
                {selectedMolecule?.category}
              </div>
            </div>
            
            <div className="bg-[#fbf9f2] p-6 rounded-[32px] border border-viet-border/50">
                <p className="text-[16px] text-viet-text font-medium leading-relaxed italic">
                    "{selectedMolecule?.description}"
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Utilities
const lightenColor = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return `rgb(${R},${G},${B})`;
};

const darkenColor = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  return `rgb(${R},${G},${B})`;
};

export default MoleculeViewer;
