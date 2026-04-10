import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { elements } from '@/data/elements';
import { enrichElement } from '@/data/elementEnrichment';
import AtomicModel from '@/components/common/AtomicModel';

const PeriodicTable = () => {
  const { t, i18n } = useTranslation();
  const [selectedElement, setSelectedElement] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [filter, setFilter] = useState('all');
  const [detailTab, setDetailTab] = useState('overview');
  const [imgError, setImgError] = useState(false);

  // Reset image error state when a new element is selected
  useEffect(() => {
    setImgError(false);
  }, [selectedElement]);

  const categories = [
    { id: 'all', label: t('periodic_table.categories.all'), color: 'bg-viet-green' },
    { id: 'diatomic-nonmetal', label: t('periodic_table.categories.diatomic-nonmetal'), color: 'bg-emerald-500/20' },
    { id: 'noble-gas', label: t('periodic_table.categories.noble-gas'), color: 'bg-indigo-500/20' },
    { id: 'alkali-metal', label: t('periodic_table.categories.alkali-metal'), color: 'bg-red-500/20' },
    { id: 'alkaline-earth-metal', label: t('periodic_table.categories.alkaline-earth-metal'), color: 'bg-orange-500/20' },
    { id: 'metalloid', label: t('periodic_table.categories.metalloid'), color: 'bg-teal-500/20' },
    { id: 'polyatomic-nonmetal', label: t('periodic_table.categories.polyatomic-nonmetal'), color: 'bg-green-500/20' },
    { id: 'post-transition-metal', label: t('periodic_table.categories.post-transition-metal'), color: 'bg-cyan-500/20' },
    { id: 'transition-metal', label: t('periodic_table.categories.transition-metal'), color: 'bg-yellow-500/20' },
    { id: 'lanthanide', label: t('periodic_table.categories.lanthanide'), color: 'bg-pink-500/20' },
    { id: 'actinide', label: t('periodic_table.categories.actinide'), color: 'bg-purple-500/20' },
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

  const getStableWikiUrl = (url) => {
    if (!url || !url.includes('wikimedia.org')) return url;
    const parts = url.split('/');
    if (url.includes('/thumb/')) {
      return `https://en.wikipedia.org/wiki/Special:Redirect/file/${encodeURIComponent(parts[parts.length - 2])}?width=500`;
    }
    return `https://en.wikipedia.org/wiki/Special:Redirect/file/${encodeURIComponent(parts[parts.length - 1])}?width=500`;
  };

  const getElementName = (el) => t(`elements.${el.symbol}.name`, { defaultValue: el.name });
  const getElementDesc = (el) => t(`elements.${el.symbol}.desc`, { defaultValue: el.desc || el.description });
  const getElementFacts = (el) => {
    const localizedFacts = t(`elements.${el.symbol}.facts`, { returnObjects: true });
    if (Array.isArray(localizedFacts)) return localizedFacts;
    return el.facts || [el.funFact] || [];
  };
  const getElementUses = (el) => {
    const localizedUses = t(`elements.${el.symbol}.uses`, { returnObjects: true });
    if (Array.isArray(localizedUses)) return localizedUses;
    return el.uses || [];
  };

  return (
    <div className="min-h-screen bg-[#fffcf5] pt-28 pb-12 shadow-[inset_0_0_100px_rgba(0,0,0,0.02)]">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />

      <div className="max-w-[1600px] mx-auto relative z-10 px-4 md:px-8">
        <div className="bg-white rounded-[40px] md:rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-viet-border/30 overflow-hidden flex flex-col md:flex-row h-auto min-h-[850px]">

          {/* Sidebar */}
          <div className="w-full md:w-72 bg-[#fbf9f2]/50 border-b md:border-b-0 md:border-r border-viet-border/20 p-6 md:p-8 flex flex-col shrink-0">
            <div className="mb-6 md:mb-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span className="text-viet-green text-[8px] md:text-[9px] font-black uppercase tracking-[5px] mb-2 block">{t('periodic_table.database_label')}</span>
                <h1 className="text-2xl md:text-3xl font-black text-viet-text leading-none italic uppercase tracking-tighter mb-3 md:mb-4">
                  {t('periodic_table.title_main')} <br className="hidden md:block" /> {t('periodic_table.title_sub')}
                  <span className="text-viet-green underline decoration-4 underline-offset-4 md:underline-offset-8">{t('periodic_table.title_highlight')}</span>
                </h1>
                <p className="text-viet-text-light text-[10px] md:text-[11px] font-bold leading-relaxed opacity-70 uppercase tracking-widest hidden sm:block">
                  {t('periodic_table.system_desc')}
                </p>
              </motion.div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-[9px] md:text-[10px] font-black text-viet-text/40 uppercase tracking-[4px] mb-2 md:mb-3 px-2">{t('periodic_table.categories_title')}</h3>
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 px-2 md:px-0 scrollbar-hide">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id)}
                    className={`whitespace-nowrap md:whitespace-normal px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all text-left flex items-center gap-4 md:justify-between group shrink-0
                        ${filter === cat.id
                        ? 'bg-viet-green text-white shadow-xl shadow-viet-green/20 md:-translate-x-1'
                        : 'text-viet-text-light hover:bg-white hover:text-viet-green border border-transparent hover:border-viet-border/20'
                      }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`w-2 h-2 rounded-full border transition-colors ${filter === cat.id ? 'bg-white border-white' : getCategoryColor(cat.id).split(' ')[2]}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-viet-border/20 hidden md:block">
              <div className="flex flex-col gap-4 opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-viet-text/10" />
                  <span className="text-[8px] font-black text-viet-text uppercase tracking-widest">{t('periodic_table.tech_manual')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Display Area */}
          <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col bg-[#fafafa]/50 overflow-hidden relative">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none hidden md:block"
              style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />

            <div className="relative flex-1 flex items-center justify-center overflow-x-auto custom-scrollbar overflow-y-hidden">
              <div className="grid grid-cols-18 gap-1 md:gap-1.5 min-w-[700px] lg:min-w-[900px] xl:min-w-[1000px] p-4 scale-[0.65] sm:scale-[0.73] lg:scale-[0.81] xl:scale-[0.85] 2xl:scale-[0.94] origin-center transition-all duration-500">
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
                      className={`relative aspect-square cursor-pointer transition-all duration-300 group ${isActive ? 'opacity-100 scale-100' : 'opacity-10 scale-90 grayscale'
                        }`}
                    >
                      <div className={`absolute inset-0 rounded-2xl border bg-gradient-to-br shadow-sm transition-all duration-500 ${getCategoryColor(el.category)} 
                        ${isHighlighted ? 'ring-4 ring-viet-green/30 shadow-2xl z-10 -translate-y-2' : ''}`}>
                        <div className="p-1 px-1.5 h-full flex flex-col justify-between overflow-hidden">
                          <span className="text-[9px] font-black opacity-40 leading-none">{el.number}</span>
                          <div className="flex flex-col items-center justify-center flex-1">
                            <span className="text-sm font-black leading-none">{el.symbol}</span>
                            <span className="text-[5px] font-black uppercase opacity-60 truncate w-full text-center mt-1 tracking-tighter">{getElementName(el)}</span>
                          </div>
                          <span className="text-[6px] font-black opacity-30 leading-none text-right">
                            {parseFloat(el.weight).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Panel / Key */}
            <div className="mt-auto pt-8 border-t border-viet-border/10 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-viet-text/40 uppercase tracking-widest mb-1">{t('periodic_table.quick_guide.title')}</span>
                  <p className="text-[12px] font-bold text-viet-text italic">{t('periodic_table.quick_guide.desc')}</p>
                </div>
                <div className="h-8 w-[1px] bg-viet-border/30" />
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-[9px] font-black text-viet-text-light uppercase tracking-widest">{t('periodic_table.legend.high_boiling')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-[9px] font-black text-viet-text-light uppercase tracking-widest">{t('periodic_table.legend.gas_state')}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] font-black text-viet-green uppercase tracking-[3px]">Aurum Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Element Detail Modal */}
      <AnimatePresence>
        {selectedElement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/80 backdrop-blur-xl"
            onClick={() => setSelectedElement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-viet-border rounded-[32px] md:rounded-[48px] max-w-5xl w-full h-[95vh] md:h-auto md:max-h-[90vh] overflow-y-auto relative shadow-[0_50px_120px_-30px_rgba(0,0,0,0.2)]"
            >
              <button
                onClick={() => setSelectedElement(null)}
                className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#f8f9fa] border border-viet-border flex items-center justify-center hover:bg-white hover:border-viet-green/50 transition-all shadow-sm z-[60]"
              >
                ✕
              </button>

              <div className="p-6 md:p-12">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-8 mb-8 md:mb-10">
                  <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-gradient-to-br flex items-center justify-center ${getCategoryColor(selectedElement.category)}`}>
                    <span className="text-4xl md:text-5xl font-black">{selectedElement.symbol}</span>
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-viet-text font-sora italic">{getElementName(selectedElement)}</h2>
                    <p className={`text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] mt-1 md:mt-2 ${getCategoryColor(selectedElement.category).split(' ')[3]}`}>
                      {t('periodic_table.modal.category_label')} {t(`periodic_table.categories.${selectedElement.category}`)}
                    </p>
                  </div>
                  <div className="sm:ml-auto flex gap-3 md:gap-4">
                    <div className="flex-1 sm:flex-none text-center px-4 md:px-6 py-2 md:py-3 bg-[#fbf9f2] rounded-xl md:rounded-2xl border border-viet-border">
                      <p className="text-[8px] md:text-[9px] font-black text-viet-text-light uppercase tracking-widest mb-1">{t('periodic_table.modal.atomic_no')}</p>
                      <p className="text-lg md:text-2xl font-black text-viet-text">{selectedElement.number}</p>
                    </div>
                    <div className="flex-1 sm:flex-none text-center px-4 md:px-6 py-2 md:py-3 bg-[#fbf9f2] rounded-xl md:rounded-2xl border border-viet-border">
                      <p className="text-[8px] md:text-[9px] font-black text-viet-text-light uppercase tracking-widest mb-1">{t('periodic_table.modal.mass_wt')}</p>
                      <p className="text-lg md:text-2xl font-black text-viet-text">{parseFloat(selectedElement.weight).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl mb-10">
                  {[
                    { id: 'overview', label: t('periodic_table.modal.tabs.overview') },
                    { id: 'discover', label: t('periodic_table.modal.tabs.discover') },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setDetailTab(tab.id)}
                      className={`flex-1 py-3.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all ${detailTab === tab.id
                          ? 'bg-white text-viet-green shadow-sm'
                          : 'text-viet-text-light hover:text-viet-text'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {detailTab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        <div className="flex flex-col items-center gap-6 md:gap-8 bg-[#fdfaf1]/50 p-6 md:p-10 rounded-[32px] border border-viet-border/30 min-h-0 md:min-h-[450px] justify-center">
                          <div className="scale-75 md:scale-100 origin-center transition-transform">
                            <AtomicModel shells={selectedElement.shells} symbol={selectedElement.symbol} />
                          </div>
                          <div className="text-center">
                            <p className="text-[8px] md:text-[10px] font-black text-viet-text-light uppercase tracking-[3px] md:tracking-[5px] mb-2">{t('periodic_table.modal.bohr_config')}</p>
                            <div className="flex gap-1.5 md:gap-2 justify-center flex-wrap">
                              {selectedElement.shells?.map((s, i) => (
                                <div key={i} className="px-3 md:px-4 py-1.5 md:py-2 bg-white rounded-lg md:rounded-xl text-[12px] md:text-[14px] text-viet-text font-black border border-viet-border">
                                  {s}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="p-6 bg-viet-green/5 rounded-3xl border border-viet-green/10">
                            <h3 className="text-[10px] md:text-[11px] font-black text-viet-green uppercase tracking-widest mb-3">{t('periodic_table.modal.brief_intro')}</h3>
                            <p className="text-viet-text font-medium leading-relaxed italic text-base md:text-lg pr-4 line-clamp-6">
                              "{getElementDesc(selectedElement)}"
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 md:gap-4">
                            {['state', 'meltingPoint', 'boilingPoint', 'density', 'electronConfig'].map((key) => {
                              if (!selectedElement[key]) return null;
                              return (
                                <div key={key} className="p-3 md:p-4 bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm">
                                  <p className="text-[8px] md:text-[9px] font-black text-viet-text-light uppercase tracking-widest mb-1">
                                    {t(`periodic_table.modal.properties.${key}`)}
                                  </p>
                                  <p className="text-[13px] md:text-[15px] font-black text-viet-text">
                                    {selectedElement[key]}{key.includes('Point') ? '°C' : ''}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {detailTab === 'discover' && (
                    <motion.div key="discover" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
                        {/* Image/Media Section */}
                        <div className="lg:col-span-2 relative group">
                          <div className="aspect-square rounded-[30px] md:rounded-[40px] overflow-hidden border-4 border-white shadow-2xl relative">
                            {selectedElement.imageUrl && !imgError ? (
                              <img
                                src={getStableWikiUrl(selectedElement.imageUrl)}
                                alt={getElementName(selectedElement)}
                                referrerPolicy="no-referrer"
                                onError={() => setImgError(true)}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <span className="text-4xl opacity-10 font-black">IMAGE</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                              <p className="text-white text-[10px] font-black uppercase tracking-widest">{t('periodic_table.modal.media_sample')}</p>
                            </div>
                          </div>

                          {/* Discovery Badge */}
                          <div className="mt-4 md:mt-6 p-4 md:p-6 bg-[#fbf9f2] rounded-2xl md:rounded-3xl border border-viet-border/30">
                            <span className="text-[8px] md:text-[9px] font-black text-viet-text/40 uppercase tracking-widest mb-2 md:mb-3 block">{t('periodic_table.modal.discovery.title')}</span>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[8px] md:text-[10px] font-bold text-viet-text-light uppercase">{t('periodic_table.modal.discovery.year')}</p>
                                <p className="text-lg md:text-xl font-black text-viet-green">{selectedElement.yearDiscovered || t('periodic_table.modal.discovery.ancient')}</p>
                              </div>
                              <div>
                                <p className="text-[8px] md:text-[10px] font-bold text-viet-text-light uppercase">{t('periodic_table.modal.discovery.by')}</p>
                                <p className="text-xs md:text-sm font-black text-viet-text leading-tight">{selectedElement.discoveredBy || t('periodic_table.modal.discovery.unknown')}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Info Section */}
                        <div className="lg:col-span-3 flex flex-col gap-4 md:gap-6">
                          {/* Fun Facts */}
                          <div className="bg-gradient-to-br from-viet-green to-[#a0d96d] p-6 md:p-8 rounded-[30px] md:rounded-[40px] text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                              <span className="text-[80px] md:text-[120px] font-black italic">!</span>
                            </div>
                            <div className="relative z-10">
                              <span className="px-3 py-1 bg-white/20 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-3 md:mb-4 block w-fit">{t('periodic_table.modal.facts.badge')}</span>
                              <div className="space-y-3 md:space-y-4">
                                {getElementFacts(selectedElement).length > 0 ? (
                                  getElementFacts(selectedElement).map((fact, i) => (
                                    <p key={i} className="text-base md:text-lg font-black font-sora italic leading-tight border-l-2 border-white/30 pl-4 py-1">
                                      {fact}
                                    </p>
                                  ))
                                ) : (
                                  <p className="text-base md:text-lg font-black font-sora italic leading-tight">
                                    {t('periodic_table.modal.facts.updating')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Applications */}
                          <div className="p-6 md:p-8 bg-white border border-viet-border/30 rounded-[30px] md:rounded-[40px] shadow-sm">
                            <span className="text-[8px] md:text-[9px] font-black text-viet-text/40 uppercase tracking-widest mb-3 md:mb-4 block uppercase">{t('periodic_table.modal.applications.badge')}</span>
                            <div className="flex flex-wrap gap-2">
                              {getElementUses(selectedElement).length > 0 ? (
                                getElementUses(selectedElement).map((use, i) => (
                                  <span key={i} className="px-3 md:px-4 py-1.5 md:py-2 bg-[#fbf9f2] text-viet-text text-[10px] md:text-[11px] font-black rounded-lg md:rounded-xl border border-viet-border/20 lowercase tracking-tight">
                                    # {use}
                                  </span>
                                ))
                              ) : (
                                <p className="text-viet-text-light italic text-[10px]">{t('periodic_table.modal.applications.updating')}</p>
                              )}
                            </div>
                          </div>

                          <button className="w-full py-3 md:py-4 bg-viet-text text-white rounded-xl md:rounded-2xl text-[10px] md:text-[12px] font-black uppercase tracking-widest hover:bg-viet-green transition-all shadow-lg shadow-black/5" onClick={() => window.open(`https://${i18n.language === 'vi' ? 'vi' : 'en'}.wikipedia.org/wiki/${selectedElement.symbol === 'H' ? (i18n.language === 'vi' ? 'Hiđrô' : 'Hydrogen') : selectedElement.name}`, '_blank')}>
                            {t('periodic_table.modal.wiki_btn')}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PeriodicTable;
