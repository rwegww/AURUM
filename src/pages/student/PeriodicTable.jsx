import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { elements } from '@/data/elements';
import { enrichElement } from '@/data/elementEnrichment';
import AtomicModel from '@/components/common/AtomicModel';

const PeriodicTable = () => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [filter, setFilter] = useState('all');
  const [detailTab, setDetailTab] = useState('overview');

  const categories = [
    { id: 'all', label: 'Tất cả', color: 'bg-viet-green' },
    { id: 'diatomic-nonmetal', label: 'Phi kim', color: 'bg-emerald-500/20' },
    { id: 'noble-gas', label: 'Khí hiếm', color: 'bg-indigo-500/20' },
    { id: 'alkali-metal', label: 'Kim loại kiềm', color: 'bg-red-500/20' },
    { id: 'alkaline-earth-metal', label: 'Kim loại kiềm thổ', color: 'bg-orange-500/20' },
    { id: 'metalloid', label: 'Á kim', color: 'bg-teal-500/20' },
    { id: 'polyatomic-nonmetal', label: 'Phi kim đa nguyên tử', color: 'bg-green-500/20' },
    { id: 'post-transition-metal', label: 'Kim loại sau chuyển tiếp', color: 'bg-cyan-500/20' },
    { id: 'transition-metal', label: 'Kim loại chuyển tiếp', color: 'bg-yellow-500/20' },
    { id: 'lanthanide', label: 'Lanthan', color: 'bg-pink-500/20' },
    { id: 'actinide', label: 'Actini', color: 'bg-purple-500/20' },
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case 'alkali-metal': return 'from-red-500/10 to-red-600/5 border-red-200 text-red-600';
      case 'alkaline-earth-metal': return 'from-orange-500/10 to-orange-600/5 border-orange-200 text-orange-600';
      case 'transition-metal': return 'from-yellow-500/10 to-yellow-600/5 border-yellow-200 text-yellow-600';
      case 'post-transition-metal': return 'from-cyan-500/10 to-cyan-600/5 border-cyan-200 text-cyan-600';
      case 'metalloid': return 'from-teal-500/10 to-teal-600/5 border-teal-200 text-teal-600';
      case 'diatomic-nonmetal': return 'from-emerald-500/10 to-emerald-600/5 border-emerald-200 text-emerald-600';
      case 'polyatomic-nonmetal': return 'from-green-500/10 to-green-600/5 border-green-200 text-green-600';
      case 'noble-gas': return 'from-indigo-500/10 to-indigo-600/5 border-indigo-200 text-indigo-600';
      case 'lanthanide': return 'from-pink-500/10 to-pink-600/5 border-pink-200 text-pink-600';
      case 'actinide': return 'from-purple-500/10 to-purple-600/5 border-purple-200 text-purple-600';
      default: return 'from-slate-500/10 to-slate-600/5 border-slate-200 text-slate-600';
    }
  };

  const handleSelect = (el) => {
    setSelectedElement(enrichElement(el));
    setDetailTab('overview');
  };

  return (
    <div className="min-h-screen bg-viet-bg pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-black text-viet-text italic tracking-tighter uppercase mb-2"
            >
              Bảng tuần hoàn <span className="text-viet-green underline decoration-4 underline-offset-8">nguyên tố</span>
            </motion.h1>
            <p className="text-viet-text-light font-bold">Khám phá vũ trụ của các nguyên tử trong giao diện Lab hiện đại</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-end bg-white/50 p-2 rounded-2xl border border-viet-border h-fit">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  filter === cat.id
                    ? 'bg-viet-green text-white border-viet-green shadow-lg shadow-viet-green/20 scale-105'
                    : 'bg-white text-viet-text-light border-viet-border hover:border-viet-green/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Periodic Table Grid */}
        <div className="relative overflow-x-auto pb-12 mask-fade-right">
          <div className="grid grid-cols-18 gap-2 min-w-[1200px]">
            {elements.map((el) => {
              const isActive = filter === 'all' || el.category === filter;
              const isHighlighted = hoveredElement && hoveredElement.number === el.number;
              return (
                <motion.div
                  key={el.symbol}
                  layoutId={`element-${el.symbol}`}
                  onClick={() => handleSelect(el)}
                  onHoverStart={() => setHoveredElement(el)}
                  onHoverEnd={() => setHoveredElement(null)}
                  style={{ gridColumn: el.x, gridRow: el.y }}
                  className={`relative aspect-square cursor-pointer transition-all duration-300 group ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-20 scale-90 grayscale'
                  }`}
                >
                  <div className={`absolute inset-0 rounded-xl border bg-gradient-to-br shadow-sm transition-all duration-500 ${getCategoryColor(el.category)} 
                    ${isHighlighted ? 'ring-4 ring-viet-green/30 shadow-2xl z-10 -translate-y-2' : ''}`}>
                    <div className="p-1 px-1.5 h-full flex flex-col justify-between">
                      <span className="text-[10px] font-bold opacity-60 leading-none">{el.number}</span>
                      <div className="flex flex-col items-center justify-center flex-1 -mt-1">
                        <span className="text-sm font-black leading-none">{el.symbol}</span>
                        <span className="text-[7px] font-bold opacity-70 truncate w-full text-center mt-0.5">{el.name}</span>
                      </div>
                      <span className="text-[7px] font-bold opacity-40 leading-none text-right">
                        {parseFloat(el.weight).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap gap-6 justify-center bg-white p-6 rounded-[30px] border border-viet-border shadow-sm">
          {categories.slice(1).map(cat => (
            <div key={cat.id} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full border ${getCategoryColor(cat.id).split(' ')[2]}`}></div>
              <span className="text-[10px] text-viet-text-light font-bold uppercase tracking-wider">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {selectedElement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/80 backdrop-blur-md"
            onClick={() => setSelectedElement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-viet-border rounded-[40px] max-w-5xl w-full max-h-[90vh] overflow-y-auto relative shadow-[0_30px_100px_-20px_rgba(118,192,52,0.15)]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedElement(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#f8f9fa] border border-viet-border flex items-center justify-center hover:bg-white hover:border-viet-green/50 transition-all shadow-sm z-20"
              >
                <svg className="w-4 h-4 text-viet-text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="p-8 pb-0">
                <div className="flex items-center gap-6 mb-6">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br flex items-center justify-center ${getCategoryColor(selectedElement.category)}`}>
                    <span className="text-4xl font-black">{selectedElement.symbol}</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-viet-text">{selectedElement.name}</h2>
                    <p className={`text-[12px] font-black uppercase tracking-[0.2em] mt-1 ${getCategoryColor(selectedElement.category).split(' ')[3]}`}>
                      {selectedElement.category.replace(/-/g, ' ')}
                    </p>
                  </div>
                  <div className="ml-auto flex gap-3">
                    <div className="text-center px-4 py-2 bg-[#f8f9fa] rounded-xl border border-viet-border">
                      <p className="text-[9px] font-black text-viet-text-light uppercase tracking-widest">Số hiệu</p>
                      <p className="text-xl font-black text-viet-text">{selectedElement.number}</p>
                    </div>
                    <div className="text-center px-4 py-2 bg-[#f8f9fa] rounded-xl border border-viet-border">
                      <p className="text-[9px] font-black text-viet-text-light uppercase tracking-widest">Khối lượng</p>
                      <p className="text-xl font-black text-viet-text">{parseFloat(selectedElement.weight).toFixed(4)}</p>
                    </div>
                    {selectedElement.electronegativity && (
                      <div className="text-center px-4 py-2 bg-viet-green/5 rounded-xl border border-viet-green/10">
                        <p className="text-[9px] font-black text-viet-green uppercase tracking-widest">Độ âm điện</p>
                        <p className="text-xl font-black text-viet-green">{selectedElement.electronegativity}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-[#f0f2f5] p-1 rounded-xl">
                  {[
                    { id: 'overview', label: '📋 Tổng quan' },
                    { id: 'properties', label: '🔬 Tính chất' },
                    { id: 'discover', label: '🌟 Khám phá' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setDetailTab(tab.id)}
                      className={`flex-1 py-2.5 rounded-lg text-[12px] font-black uppercase tracking-wider transition-all ${
                        detailTab === tab.id
                          ? 'bg-white text-viet-green shadow-sm'
                          : 'text-viet-text-light hover:text-viet-text'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {detailTab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Bohr Model */}
                        <div className="flex flex-col items-center gap-6">
                          <div className="relative w-64 h-64 flex items-center justify-center bg-[#fdfaf1] rounded-full border border-viet-border/50">
                            <AtomicModel shells={selectedElement.shells} symbol={selectedElement.symbol} />
                          </div>
                          <div className="text-center space-y-2">
                            <p className="text-[11px] font-black text-viet-text-light uppercase tracking-[0.4em]">Cấu hình electron</p>
                            <p className="text-lg font-black text-viet-green tracking-tight">
                              {selectedElement.electron_configuration || selectedElement.shells?.join('-')}
                            </p>
                            <div className="flex gap-2 justify-center mt-2">
                              {selectedElement.shells?.map((s, i) => (
                                <div key={i} className="px-3 py-1 bg-white rounded-lg text-[11px] text-viet-text font-bold border border-viet-border shadow-sm">
                                  {s}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="space-y-4">
                          <p className="text-viet-text font-medium leading-relaxed">{selectedElement.desc}</p>

                          <div className="grid grid-cols-2 gap-3">
                            {selectedElement.state && (
                              <div className="p-3 bg-[#f8f9fa] rounded-xl border border-viet-border">
                                <p className="text-[9px] font-black text-viet-text-light uppercase tracking-widest mb-1">Trạng thái</p>
                                <p className="text-[14px] font-black text-viet-text">{selectedElement.state}</p>
                              </div>
                            )}
                            {selectedElement.meltingPoint !== undefined && (
                              <div className="p-3 bg-[#f8f9fa] rounded-xl border border-viet-border">
                                <p className="text-[9px] font-black text-viet-text-light uppercase tracking-widest mb-1">Nhiệt độ nóng chảy</p>
                                <p className="text-[14px] font-black text-viet-text">{selectedElement.meltingPoint}°C</p>
                              </div>
                            )}
                            {selectedElement.boilingPoint !== undefined && (
                              <div className="p-3 bg-[#f8f9fa] rounded-xl border border-viet-border">
                                <p className="text-[9px] font-black text-viet-text-light uppercase tracking-widest mb-1">Nhiệt độ sôi</p>
                                <p className="text-[14px] font-black text-viet-text">{selectedElement.boilingPoint}°C</p>
                              </div>
                            )}
                            {selectedElement.density && (
                              <div className="p-3 bg-[#f8f9fa] rounded-xl border border-viet-border">
                                <p className="text-[9px] font-black text-viet-text-light uppercase tracking-widest mb-1">Mật độ</p>
                                <p className="text-[14px] font-black text-viet-text">{selectedElement.density}</p>
                              </div>
                            )}
                          </div>

                          {selectedElement.discoveredBy && (
                            <div className="p-4 bg-viet-green/5 rounded-2xl border border-viet-green/10">
                              <p className="text-[9px] font-black text-viet-green uppercase tracking-widest mb-1">Phát hiện bởi</p>
                              <p className="text-[14px] font-bold text-viet-text">
                                {selectedElement.discoveredBy}
                                {selectedElement.yearDiscovered && ` (${selectedElement.yearDiscovered})`}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {detailTab === 'properties' && (
                    <motion.div key="properties" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      {selectedElement.properties ? (
                        <div className="space-y-6">
                          <h3 className="text-[13px] font-black text-viet-green uppercase tracking-widest">Tính chất đặc trưng</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {selectedElement.properties.map((prop, i) => (
                              <div key={i} className="flex items-start gap-3 p-4 bg-[#f8f9fa] rounded-2xl border border-viet-border">
                                <div className="w-7 h-7 rounded-lg bg-viet-green/10 flex items-center justify-center shrink-0 mt-0.5">
                                  <span className="text-[12px] font-black text-viet-green">{i + 1}</span>
                                </div>
                                <p className="text-[14px] font-medium text-viet-text leading-relaxed">{prop}</p>
                              </div>
                            ))}
                          </div>

                          {selectedElement.uses && (
                            <>
                              <h3 className="text-[13px] font-black text-viet-green uppercase tracking-widest mt-8">Ứng dụng thực tế</h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedElement.uses.map((use, i) => (
                                  <span key={i} className="px-4 py-2 bg-white rounded-xl border border-viet-border text-[13px] font-bold text-viet-text">
                                    {use}
                                  </span>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <span className="text-5xl opacity-30 block mb-4">🔬</span>
                          <p className="text-viet-text-light font-bold">Dữ liệu tính chất chi tiết cho nguyên tố này đang được cập nhật.</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {detailTab === 'discover' && (
                    <motion.div key="discover" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      {selectedElement.funFact ? (
                        <div className="space-y-6">
                          {/* Fun Fact */}
                          <div className="bg-gradient-to-br from-viet-green/5 to-[#fdfaf1] p-8 rounded-[28px] border border-viet-green/10 relative overflow-hidden">
                            <div className="absolute top-4 right-4 text-6xl opacity-10">💡</div>
                            <h3 className="text-[13px] font-black text-viet-green uppercase tracking-widest mb-4">Bạn có biết?</h3>
                            <p className="text-[17px] font-medium text-viet-text leading-relaxed relative z-10">
                              {selectedElement.funFact}
                            </p>
                          </div>

                          {/* Quick Stats */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-5 bg-white rounded-2xl border border-viet-border">
                              <p className="text-3xl font-black text-viet-text">{selectedElement.number}</p>
                              <p className="text-[10px] font-black text-viet-text-light uppercase tracking-widest mt-1">Proton</p>
                            </div>
                            <div className="text-center p-5 bg-white rounded-2xl border border-viet-border">
                              <p className="text-3xl font-black text-viet-text">{selectedElement.number}</p>
                              <p className="text-[10px] font-black text-viet-text-light uppercase tracking-widest mt-1">Electron</p>
                            </div>
                            <div className="text-center p-5 bg-white rounded-2xl border border-viet-border">
                              <p className="text-3xl font-black text-viet-text">{Math.round(parseFloat(selectedElement.weight)) - selectedElement.number}</p>
                              <p className="text-[10px] font-black text-viet-text-light uppercase tracking-widest mt-1">Neutron</p>
                            </div>
                          </div>

                          {selectedElement.discoveredBy && (
                            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-200/50">
                              <h3 className="text-[12px] font-black text-blue-600 uppercase tracking-widest mb-2">📜 Lịch sử khám phá</h3>
                              <p className="text-[14px] font-medium text-viet-text">
                                Nguyên tố <strong>{selectedElement.name}</strong> được phát hiện bởi <strong>{selectedElement.discoveredBy}</strong>
                                {selectedElement.yearDiscovered ? ` vào năm ${selectedElement.yearDiscovered}` : ' từ thời cổ đại'}.
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <span className="text-5xl opacity-30 block mb-4">🌟</span>
                          <p className="text-viet-text-light font-bold">Thông tin khám phá thú vị cho nguyên tố này đang được bổ sung.</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-8 pb-8">
                <button onClick={() => setSelectedElement(null)} className="viet-btn-green w-full">
                  Đóng chi tiết
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PeriodicTable;
