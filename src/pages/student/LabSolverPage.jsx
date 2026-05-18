import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Info, Beaker, ArrowRight, X, Sparkles, ChevronLeft, Layers, Activity, RefreshCcw, Zap, Copy, Check } from 'lucide-react';
import debounce from 'lodash/debounce';

const LabSolverPage = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const searchEquations = useCallback(async (q) => {
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
  }, []);

  const debouncedSearch = useMemo(() => debounce(searchEquations, 500), [searchEquations]);

  useEffect(() => {
    if (query) {
      debouncedSearch(query);
    } else {
      setResults([]);
      setSearched(false);
    }
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatFormula = (formula) => {
    return formula.split('').map((char, i) => {
      if (!isNaN(char) && i > 0) {
        return <sub key={i} className="text-[0.7em] bottom-[-0.2em] text-slate-500">{char}</sub>;
      }
      return char;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-24 selection:bg-emerald-200 selection:text-emerald-900 overflow-hidden relative">
      {/* Abstract Elegant Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-400/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] rounded-full bg-purple-400/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-400/5 blur-[150px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Navigation */}
        <Link 
          to="/lab" 
          className="group inline-flex items-center gap-2 px-4 py-2 mb-12 text-sm font-medium text-slate-500 hover:text-slate-900 bg-white/50 hover:bg-white rounded-full transition-all border border-slate-200 shadow-sm hover:shadow"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {t('common.back')}
        </Link>

        {/* Header Section */}
        <header className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 text-purple-700 rounded-full mb-6 shadow-sm backdrop-blur-sm">
               <Sparkles size={14} className="animate-pulse" />
               <span className="text-xs font-bold tracking-wide">INTELLIGENT ASSISTANT</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
              Hỗ trợ <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Cân bằng</span>
            </h1>
            
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Nhập các chất tham gia hoặc sản phẩm để tìm kiếm phương trình hóa học đã được cân bằng chính xác từ cơ sở dữ liệu chuyên sâu.
            </p>
          </motion.div>
        </header>

        {/* Search Input Container */}
        <div className="relative mb-16 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="relative z-10 group"
          >
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
              <Search size={24} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ví dụ: H2 + O2, Fe, Al, C2H6..."
              className="w-full h-20 pl-16 pr-24 bg-white/80 backdrop-blur-xl border border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-full text-xl font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all hover:bg-white/95"
            />
            <div className="absolute inset-y-0 right-4 flex items-center gap-2">
              <AnimatePresence>
                {query && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setQuery('')}
                    className="p-2.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={20} strokeWidth={2.5} />
                  </motion.button>
                )}
              </AnimatePresence>
              {loading && (
                 <div className="w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mr-4" />
              )}
            </div>
          </motion.div>
        </div>

        {/* Content Area */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <AnimatePresence mode="popLayout">
            {results.length > 0 ? (
              results.map((eq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  className="p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col md:flex-row md:items-center justify-between gap-8"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-5">
                       <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-full uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5">
                         <Check size={12} strokeWidth={3} />
                         Đã xác thực
                       </span>
                       {eq.answer.some(c => c > 10) && (
                          <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[11px] font-bold rounded-full uppercase tracking-widest border border-amber-100">
                             Phức tạp
                          </span>
                       )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-2xl md:text-3xl font-bold text-slate-800 leading-relaxed">
                      {eq.reactants.map((r, i) => (
                        <React.Fragment key={`r-${i}`}>
                          <div className="flex items-baseline">
                            {eq.answer[i] > 1 && <span className="text-emerald-500 mr-1.5 font-black">{eq.answer[i]}</span>}
                            <span>{formatFormula(r)}</span>
                          </div>
                          {i < eq.reactants.length - 1 && <span className="text-slate-300 font-normal">+</span>}
                        </React.Fragment>
                      ))}
                      <ArrowRight className="text-emerald-400 shrink-0 mx-2" strokeWidth={3} />
                      {eq.products.map((p, i) => {
                        const pIdx = i + eq.reactants.length;
                        return (
                          <React.Fragment key={`p-${i}`}>
                            <div className="flex items-baseline">
                              {eq.answer[pIdx] > 1 && <span className="text-blue-500 mr-1.5 font-black">{eq.answer[pIdx]}</span>}
                              <span>{formatFormula(p)}</span>
                            </div>
                            {i < eq.products.length - 1 && <span className="text-slate-300 font-normal">+</span>}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                  
                  <button 
                    className={`shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold transition-all ${
                      copiedIndex === idx 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-xl hover:-translate-y-0.5'
                    }`}
                    onClick={() => handleCopy(eq.equation_string, idx)}
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check size={18} strokeWidth={2.5} />
                        Đã chép
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        Sao chép
                      </>
                    )}
                  </button>
                </motion.div>
              ))
            ) : searched && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white/40 border border-slate-200 border-dashed rounded-[2.5rem] backdrop-blur-sm"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-slate-400">
                   <Beaker size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy phương trình</h3>
                <p className="text-slate-500 font-medium">Thử tìm kiếm với tên chất cụ thể hơn (ví dụ: Na, KMnO4...)</p>
              </motion.div>
            )}

            {!searched && !loading && (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: 0.2 }}
                 className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12"
               >
                  {[
                    { title: "Hóa hợp", desc: "A + B → AB", icon: <Layers size={24} strokeWidth={1.5} />, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
                    { title: "Phân hủy", desc: "AB → A + B", icon: <Activity size={24} strokeWidth={1.5} />, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
                    { title: "Trao đổi", desc: "AB + CD → AD + CB", icon: <RefreshCcw size={24} strokeWidth={1.5} />, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
                    { title: "Oxi hóa khử", desc: "Thay đổi số oxi hóa", icon: <Zap size={24} strokeWidth={1.5} />, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" }
                  ].map((tip, i) => (
                    <div 
                      key={i} 
                      className="group p-6 rounded-3xl bg-white/60 backdrop-blur-sm border border-slate-200/60 hover:bg-white hover:shadow-md hover:border-slate-300 transition-all cursor-default flex items-center gap-5"
                    >
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tip.bg} ${tip.color} ${tip.border} border transition-transform group-hover:scale-110`}>
                         {tip.icon}
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-800 text-sm mb-1">{tip.title}</h4>
                          <p className="text-xs font-medium text-slate-500 tracking-wide">{tip.desc}</p>
                       </div>
                    </div>
                  ))}
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <footer className="mt-24 pb-8 flex flex-col items-center gap-6">
           <div className="flex items-center gap-4 text-slate-400">
              <div className="h-px w-8 bg-slate-300" />
              <Info size={14} />
              <span className="text-[10px] font-bold uppercase tracking-[3px]">Powered by Aurum Intelligence</span>
              <div className="h-px w-8 bg-slate-300" />
           </div>
           <p className="text-sm font-medium text-slate-500 text-center max-w-lg">
              Cơ sở dữ liệu chứa hơn 3,000 phương trình hóa học phổ biến. Nếu không tìm thấy, vui lòng liên hệ đội ngũ giáo viên để được hỗ trợ.
           </p>
        </footer>
      </div>
    </div>
  );
};

export default LabSolverPage;
