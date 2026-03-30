import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { molecules, bondTypeLabels } from '../../data/molecules';

const MoleculeViewer = () => {
  const [selectedMolecule, setSelectedMolecule] = useState(molecules[0]);
  const [viewMode, setViewMode] = useState('ball-stick'); // 'ball-stick' or 'space-fill'
  const [showLabels, setShowLabels] = useState(true);
  const [showBondInfo, setShowBondInfo] = useState(true);
  const [hoveredAtom, setHoveredAtom] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  const categories = useMemo(() => {
    const cats = new Set(molecules.map(m => m.category));
    return ['all', ...cats];
  }, []);

  const filteredMolecules = useMemo(() => {
    if (filterCategory === 'all') return molecules;
    return molecules.filter(m => m.category === filterCategory);
  }, [filterCategory]);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }, []);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const renderBond = (bond, atoms) => {
    const fromAtom = atoms.find(a => a.id === bond.from);
    const toAtom = atoms.find(a => a.id === bond.to);
    if (!fromAtom || !toAtom) return null;

    const dx = toAtom.x - fromAtom.x;
    const dy = toAtom.y - fromAtom.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / len;
    const ny = dx / len;
    const offset = 4;

    const bondColor = bond.type === 'ionic' ? '#f39c12' : '#94a3b8';
    const strokeWidth = viewMode === 'space-fill' ? 0 : 4;

    switch (bond.type) {
      case 'single':
        return (
          <line
            key={`${bond.from}-${bond.to}`}
            x1={fromAtom.x} y1={fromAtom.y}
            x2={toAtom.x} y2={toAtom.y}
            stroke={bondColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        );
      case 'double':
        return (
          <g key={`${bond.from}-${bond.to}`}>
            <line
              x1={fromAtom.x + nx * offset} y1={fromAtom.y + ny * offset}
              x2={toAtom.x + nx * offset} y2={toAtom.y + ny * offset}
              stroke={bondColor} strokeWidth={strokeWidth} strokeLinecap="round"
            />
            <line
              x1={fromAtom.x - nx * offset} y1={fromAtom.y - ny * offset}
              x2={toAtom.x - nx * offset} y2={toAtom.y - ny * offset}
              stroke={bondColor} strokeWidth={strokeWidth} strokeLinecap="round"
            />
          </g>
        );
      case 'triple':
        return (
          <g key={`${bond.from}-${bond.to}`}>
            <line
              x1={fromAtom.x} y1={fromAtom.y}
              x2={toAtom.x} y2={toAtom.y}
              stroke={bondColor} strokeWidth={strokeWidth} strokeLinecap="round"
            />
            <line
              x1={fromAtom.x + nx * offset * 1.8} y1={fromAtom.y + ny * offset * 1.8}
              x2={toAtom.x + nx * offset * 1.8} y2={toAtom.y + ny * offset * 1.8}
              stroke={bondColor} strokeWidth={strokeWidth} strokeLinecap="round"
            />
            <line
              x1={fromAtom.x - nx * offset * 1.8} y1={fromAtom.y - ny * offset * 1.8}
              x2={toAtom.x - nx * offset * 1.8} y2={toAtom.y - ny * offset * 1.8}
              stroke={bondColor} strokeWidth={strokeWidth} strokeLinecap="round"
            />
          </g>
        );
      case 'ionic':
        return (
          <line
            key={`${bond.from}-${bond.to}`}
            x1={fromAtom.x} y1={fromAtom.y}
            x2={toAtom.x} y2={toAtom.y}
            stroke={bondColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray="8,6"
          />
        );
      default:
        return null;
    }
  };

  const renderAtom = (atom) => {
    const isHovered = hoveredAtom === atom.id;
    const r = viewMode === 'space-fill' ? atom.radius * 2.2 : atom.radius;

    return (
      <g
        key={atom.id}
        onMouseEnter={() => setHoveredAtom(atom.id)}
        onMouseLeave={() => setHoveredAtom(null)}
        style={{ cursor: 'pointer' }}
      >
        {/* Glow effect on hover */}
        {isHovered && (
          <circle
            cx={atom.x} cy={atom.y} r={r + 8}
            fill="none"
            stroke="#76c034"
            strokeWidth="3"
            opacity="0.6"
          >
            <animate attributeName="r" values={`${r + 6};${r + 12};${r + 6}`} dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Atom sphere with gradient */}
        <defs>
          <radialGradient id={`grad-${atom.id}`} cx="35%" cy="35%">
            <stop offset="0%" stopColor={lightenColor(atom.color, 60)} />
            <stop offset="70%" stopColor={atom.color} />
            <stop offset="100%" stopColor={darkenColor(atom.color, 30)} />
          </radialGradient>
        </defs>
        <circle
          cx={atom.x} cy={atom.y} r={r}
          fill={`url(#grad-${atom.id})`}
          stroke={isHovered ? '#76c034' : darkenColor(atom.color, 20)}
          strokeWidth={isHovered ? 3 : 1.5}
          style={{ transition: 'all 0.2s ease' }}
        />

        {/* Element Label */}
        {showLabels && (
          <text
            x={atom.x} y={atom.y + (viewMode === 'space-fill' ? 1 : 1)}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={atom.element === 'H' || atom.element === 'S' ? '#2c3e50' : '#ffffff'}
            fontSize={viewMode === 'space-fill' ? 16 : 12}
            fontWeight="900"
            fontFamily="Inter, sans-serif"
            style={{ pointerEvents: 'none' }}
          >
            {atom.element}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="space-y-6">
      {/* Molecule Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        
        {/* Left Panel - Molecule List */}
        <div className="bg-white rounded-[28px] border border-viet-border p-5 shadow-sm">
          <h3 className="text-[12px] font-black text-viet-green uppercase tracking-widest mb-4">Chọn phân tử</h3>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  filterCategory === cat
                    ? 'bg-viet-green text-white'
                    : 'bg-[#f0f2f5] text-viet-text-light hover:bg-viet-green/10'
                }`}
              >
                {cat === 'all' ? 'Tất cả' : cat}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
            {filteredMolecules.map(mol => (
              <button
                key={mol.id}
                onClick={() => { setSelectedMolecule(mol); resetView(); }}
                className={`w-full text-left p-3 rounded-2xl border transition-all ${
                  selectedMolecule?.id === mol.id
                    ? 'bg-viet-green/10 border-viet-green shadow-md shadow-viet-green/5'
                    : 'bg-white border-viet-border hover:border-viet-green/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[15px] font-black text-viet-text">{mol.formula}</span>
                    <span className="text-[11px] text-viet-text-light ml-2 font-medium">{mol.name}</span>
                  </div>
                  <span className="text-[9px] font-bold text-viet-text-light bg-[#f0f2f5] px-2 py-0.5 rounded-md">Lớp {mol.gradeLevel}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - SVG Viewer */}
        <div className="bg-white rounded-[28px] border border-viet-border shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-viet-border bg-[#fdfaf1]">
            <div className="flex items-center gap-2">
              {/* View Mode */}
              <div className="flex bg-[#f0f2f5] p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('ball-stick')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                    viewMode === 'ball-stick' ? 'bg-white text-viet-green shadow-sm' : 'text-viet-text-light'
                  }`}
                >
                  Que
                </button>
                <button
                  onClick={() => setViewMode('space-fill')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                    viewMode === 'space-fill' ? 'bg-white text-viet-green shadow-sm' : 'text-viet-text-light'
                  }`}
                >
                  Đặc
                </button>
              </div>

              {/* Labels Toggle */}
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
                  showLabels ? 'bg-viet-green/10 border-viet-green/30 text-viet-green' : 'bg-white border-viet-border text-viet-text-light'
                }`}
              >
                Nhãn
              </button>

              {/* Bond Info Toggle */}
              <button
                onClick={() => setShowBondInfo(!showBondInfo)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
                  showBondInfo ? 'bg-viet-green/10 border-viet-green/30 text-viet-green' : 'bg-white border-viet-border text-viet-text-light'
                }`}
              >
                Liên kết
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="w-8 h-8 rounded-lg bg-white border border-viet-border text-viet-text font-bold hover:border-viet-green/30 transition-all text-lg flex items-center justify-center">−</button>
              <span className="text-[11px] font-black text-viet-text-light w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="w-8 h-8 rounded-lg bg-white border border-viet-border text-viet-text font-bold hover:border-viet-green/30 transition-all text-lg flex items-center justify-center">+</button>
              <button onClick={resetView} className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-viet-text-light border border-viet-border hover:border-viet-green/30 transition-all">Reset</button>
            </div>
          </div>

          {/* SVG Render Area */}
          <div
            className="relative bg-gradient-to-br from-[#f8faf5] to-[#fdfaf1] cursor-grab active:cursor-grabbing"
            style={{ height: '420px' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 420 360"
              className="w-full h-full"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.2s ease',
              }}
            >
              {/* Grid Background */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" strokeOpacity="0.3" />
                </pattern>
              </defs>
              <rect width="420" height="360" fill="url(#grid)" />

              {/* Bonds */}
              {selectedMolecule?.bonds.map(bond => renderBond(bond, selectedMolecule.atoms))}

              {/* Atoms */}
              {selectedMolecule?.atoms.map(atom => renderAtom(atom))}
            </svg>

            {/* Hovered Atom Info */}
            <AnimatePresence>
              {hoveredAtom !== null && selectedMolecule && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-4 left-4 bg-white rounded-xl border border-viet-border p-3 shadow-lg z-10"
                >
                  {(() => {
                    const atom = selectedMolecule.atoms.find(a => a.id === hoveredAtom);
                    return atom ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full" style={{ background: atom.color }} />
                        <div>
                          <p className="text-[14px] font-black text-viet-text">{atom.element}</p>
                          <p className="text-[10px] font-bold text-viet-text-light">Nguyên tử #{atom.id + 1}</p>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Zoom hint */}
            <div className="absolute bottom-3 right-3 text-[10px] font-bold text-viet-text-light/50 bg-white/80 px-2 py-1 rounded-lg">
              Cuộn để zoom • Kéo để di chuyển
            </div>
          </div>

          {/* Molecule Info Panel */}
          {selectedMolecule && (
            <div className="p-6 border-t border-viet-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-black text-viet-text">{selectedMolecule.formula}</h2>
                  <p className="text-[14px] font-bold text-viet-text-light">{selectedMolecule.name}</p>
                </div>
                <span className="text-[10px] font-bold text-viet-green bg-viet-green/10 px-3 py-1 rounded-lg uppercase tracking-wider">
                  {selectedMolecule.category}
                </span>
              </div>
              <p className="text-[14px] text-viet-text font-medium leading-relaxed mb-4">{selectedMolecule.description}</p>

              {showBondInfo && (
                <div className="flex flex-wrap gap-3">
                  {selectedMolecule.bonds.map((bond, i) => {
                    const fromAtom = selectedMolecule.atoms.find(a => a.id === bond.from);
                    const toAtom = selectedMolecule.atoms.find(a => a.id === bond.to);
                    return (
                      <div key={i} className="px-3 py-2 bg-[#f8f9fa] rounded-xl border border-viet-border text-[11px]">
                        <span className="font-black text-viet-text">{fromAtom?.element}—{toAtom?.element}</span>
                        <span className="text-viet-text-light ml-1.5 font-medium">{bondTypeLabels[bond.type]}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Color utility helpers
function lightenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return `rgb(${R},${G},${B})`;
}

function darkenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  return `rgb(${R},${G},${B})`;
}

export default MoleculeViewer;
