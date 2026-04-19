import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Info, Beaker, ArrowRight, X, Sparkles } from 'lucide-react';
import debounce from 'lodash/debounce';

const LabSolverPage = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchEquations = async (q) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/lab/balancing/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const debouncedSearch = useCallback(
    debounce((q) => searchEquations(q), 500),
    []
  );

  useEffect(() => {
    if (query) {
      debouncedSearch(query);
    } else {
      setResults([]);
      setSearched(false);
    }
  }, [query, debouncedSearch]);

  const formatFormula = (formula) => {
    return formula.split('').map((char, i) => {
      if (!isNaN(char) && i > 0) {
        return <sub key={i} className="text-[0.7em] bottom-[-0.2em]">{char}</sub>;
      }
      return char;
    });
  };

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.02_135)] pb-24 pt-32 selection:bg-viet-green selection:text-white">
      <div className="max-w-[1000px] mx-auto px-6 relative">
        
        {/* Background Decorations */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-viet-green/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-40 -right-20 w-80 h-80 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Header */}
        <header className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link to="/lab" className="viet-btn-pill inline-flex items-center gap-2 px-6 py-2 mb-8 bg-white shadow-sm border-2 border-duo-border border-b-4 hover:translate-y-1 transition-all">
              <span className="text-lg">←</span> {t('common.back')}
            </Link>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-purple-100 text-purple-600 rounded-full mb-6 border border-purple-200">
               <Sparkles size={14} className="animate-pulse" />
               <span className="text-[11px] font-black uppercase tracking-[3px]">Intelligent Assistant</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-[#1a1a1a] uppercase italic tracking-tighter leading-none mb-4">
              Hỗ trợ <span className="text-viet-green">Cân bằng</span>
            </h1>
            <p className="text-[#1a1a1a]/60 font-bold max-w-xl mx-auto">
              Nhập các chất tham gia hoặc sản phẩm để tìm kiếm phương trình hóa học đã được cân bằng chính xác từ cơ sở dữ liệu.
            </p>
          </motion.div>
        </header>

        {/* Search Bar Container */}
        <div className="relative mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10"
          >
            <div className="relative group">
              <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-[#1a1a1a]/30 group-focus-within:text-viet-green transition-colors">
                <Search size={24} strokeWidth={3} />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ví dụ: H2 + O2, Fe, Al, C2H6..."
                className="w-full h-24 pl-20 pr-32 bg-white border-2 border-duo-border border-b-8 rounded-[2.5rem] text-xl font-black text-[#1a1a1a] placeholder:text-[#1a1a1a]/20 focus:outline-none focus:border-viet-green transition-all shadow-xl"
              />
              <div className="absolute inset-y-0 right-6 flex items-center">
                {query && (
                  <button 
                    onClick={() => setQuery('')}
                    className="p-3 rounded-2xl hover:bg-red-50 text-red-400 transition-colors"
                  >
                    <X size={24} strokeWidth={3} />
                  </button>
                )}
                {loading && (
                   <div className="w-8 h-8 border-4 border-viet-green border-t-transparent rounded-full animate-spin ml-2" />
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Results Area */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {results.length > 0 ? (
              results.map((eq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="card-tactile p-8 bg-white hover:border-viet-green transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                         <span className="px-3 py-1 bg-gray-100 text-[#1a1a1a]/50 text-[10px] font-black rounded-lg uppercase tracking-widest border border-gray-200">
                           Verified Result
                         </span>
                         {eq.answer.some(c => c > 10) && (
                            <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-amber-200">
                               Complex
                            </span>
                         )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-2xl md:text-3xl font-black text-[#1a1a1a] leading-relaxed">
                        {eq.reactants.map((r, i) => (
                          <React.Fragment key={`r-${i}`}>
                            <div className="flex items-center">
                              {eq.answer[i] > 1 && <span className="text-viet-green mr-1">{eq.answer[i]}</span>}
                              <span>{formatFormula(r)}</span>
                            </div>
                            {i < eq.reactants.length - 1 && <span className="text-[#1a1a1a]/20">+</span>}
                          </React.Fragment>
                        ))}
                        <ArrowRight className="text-viet-green shrink-0 mx-2" strokeWidth={4} />
                        {eq.products.map((p, i) => {
                          const pIdx = i + eq.reactants.length;
                          return (
                            <React.Fragment key={`p-${i}`}>
                              <div className="flex items-center">
                                {eq.answer[pIdx] > 1 && <span className="text-blue-500 mr-1">{eq.answer[pIdx]}</span>}
                                <span>{formatFormula(p)}</span>
                              </div>
                              {i < eq.products.length - 1 && <span className="text-[#1a1a1a]/20">+</span>}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                    
                    <button 
                      className="viet-btn-green py-4 px-8 shadow-md group-hover:shadow-xl transition-all"
                      onClick={() => {
                        // Could copy to clipboard or open detail
                        navigator.clipboard.writeText(eq.equation_string);
                        alert('Đã sao chép phương trình!');
                      }}
                    >
                      Sao chép
                    </button>
                  </div>
                </motion.div>
              ))
            ) : searched && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white/50 border-2 border-dashed border-duo-border rounded-[2.5rem]"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                   <Beaker size={40} />
                </div>
                <h3 className="text-xl font-black text-[#1a1a1a] mb-2 uppercase">Không tìm thấy phương trình</h3>
                <p className="text-[#1a1a1a]/50 font-bold">Thử tìm kiếm với tên chất cụ thể hơn (ví dụ: Na, KMnO4...)</p>
              </motion.div>
            )}

            {!searched && !loading && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                  {[
                    { title: "Hóa hợp", desc: "A + B -> AB", icon: "💎", color: "bg-blue-50" },
                    { title: "Phân hủy", desc: "AB -> A + B", icon: "💥", color: "bg-red-50" },
                    { title: "Trao đổi", desc: "AB + CD -> AD + CB", icon: "↔️", color: "bg-emerald-50" },
                    { title: "Oxi hóa khử", desc: "Thay đổi số oxi hóa", icon: "⚡", color: "bg-amber-50" }
                  ].map((tip, i) => (
                    <div key={i} className={`${tip.color} p-6 rounded-3xl border-2 border-duo-border border-b-4 flex items-center gap-6`}>
                       <div className="text-4xl">{tip.icon}</div>
                       <div>
                          <h4 className="font-black text-[#1a1a1a] uppercase text-sm mb-1">{tip.title}</h4>
                          <p className="text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest">{tip.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <footer className="mt-20 flex flex-col items-center gap-6">
           <div className="flex items-center gap-4 text-[#1a1a1a]/40">
              <div className="h-px w-12 bg-current" />
              <Info size={16} />
              <span className="text-[10px] font-black uppercase tracking-[4px]">Powered by Aurum Intelligence</span>
              <div className="h-px w-12 bg-current" />
           </div>
           <p className="text-[13px] font-bold text-[#1a1a1a]/50 text-center max-w-lg">
              Cơ sở dữ liệu chứa hơn 3,000 phương trình hóa học phổ biến. Nếu không tìm thấy, vui lòng liên hệ đội ngũ giáo viên để được hỗ trợ.
           </p>
        </footer>
      </div>
    </div>
  );
};

export default LabSolverPage;
