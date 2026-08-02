import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Beaker,
  Check,
  ChevronLeft,
  Clipboard,
  Copy,
  Database,
  FlaskConical,
  Search,
  Sparkles,
  X,
} from 'lucide-react';

const EXAMPLES = [
  'H2 + O2 -> H2O',
  'Fe + O2 -> Fe2O3',
  'C2H5OH + O2 -> CO2 + H2O',
  'KMnO4 + HCl -> KCl + MnCl2 + Cl2 + H2O',
  'Al2(SO4)3 + Ca(OH)2 -> Al(OH)3 + CaSO4',
  'Fe^2+ -> Fe^3+ + e-',
];

const formatFormula = (formula) => {
  const [base, charge] = String(formula || '').split('^');
  return <>{base.split('').map((char, index) => {
    if (/\d/.test(char) && index > 0) {
      return <sub key={`${char}-${index}`} className="text-[0.65em] leading-none">{char}</sub>;
    }
    return <React.Fragment key={`${char}-${index}`}>{char}</React.Fragment>;
  })}{charge && <sup className="text-[0.6em] leading-none">{charge}</sup>}</>;
};

const formatEquationForCopy = (eq) => {
  if (!eq) return '';
  const reactants = eq.reactants.map((formula, index) => `${eq.coefficients[index] > 1 ? eq.coefficients[index] : ''}${formula}`);
  const products = eq.products.map((formula, index) => {
      const coeff = eq.coefficients[eq.reactants.length + index];
      return `${coeff > 1 ? coeff : ''}${formula}`;
    });
  return `${reactants.join(' + ')} → ${products.join(' + ')}`;
};

const EquationDisplay = ({ result, compact = false }) => {
  if (!result?.balanced) return null;

  return (
    <div className={`flex flex-wrap items-center ${compact ? 'gap-x-3 gap-y-2 text-xl' : 'gap-x-4 gap-y-3 text-2xl md:text-4xl'} font-black text-slate-900`}>
      {result.reactants.map((formula, index) => (
        <React.Fragment key={`reactant-${formula}-${index}`}>
          {index > 0 && <span className="text-slate-300">+</span>}
          <span className="inline-flex items-baseline">
            {result.coefficients[index] > 1 && <span className="mr-1.5 text-emerald-600">{result.coefficients[index]}</span>}
            <span>{formatFormula(formula)}</span>
          </span>
        </React.Fragment>
      ))}
      <ArrowRight className="text-emerald-500" size={compact ? 22 : 30} strokeWidth={3} />
      {result.products.map((formula, index) => {
        const coeffIndex = result.reactants.length + index;
        return (
          <React.Fragment key={`product-${formula}-${index}`}>
            {index > 0 && <span className="text-slate-300">+</span>}
            <span className="inline-flex items-baseline">
              {result.coefficients[coeffIndex] > 1 && <span className="mr-1.5 text-blue-600">{result.coefficients[coeffIndex]}</span>}
              <span>{formatFormula(formula)}</span>
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const LabSolverPage = () => {
  const [equationInput, setEquationInput] = useState(EXAMPLES[0]);
  const [solveResult, setSolveResult] = useState(null);
  const [solveError, setSolveError] = useState('');
  const [solving, setSolving] = useState(false);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [copiedText, setCopiedText] = useState('');

  const canSolve = equationInput.trim().length > 0;

  useEffect(() => {
    if (!query.trim()) {
      const resetId = window.setTimeout(() => {
        setResults([]);
        setSearched(false);
        setSearchError('');
      }, 0);
      return () => window.clearTimeout(resetId);
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setLoadingSearch(true);
      setSearchError('');
      try {
        const res = await fetch(`/api/lab/balancing/search?q=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Không thể tìm trong kho phương trình.');
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Search error:', error);
          setResults([]);
          setSearchError(error.message || 'Mất kết nối khi tìm phương trình.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingSearch(false);
          setSearched(true);
        }
      }
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  const coefficientSummary = useMemo(() => {
    if (!solveResult?.balanced) return '';
    return solveResult.coefficients.join(' : ');
  }, [solveResult]);

  const handleCopy = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      window.setTimeout(() => setCopiedText(''), 1600);
    } catch {
      setSolveError('Trình duyệt không cho phép sao chép tự động. Hãy chọn và sao chép thủ công.');
    }
  };

  const solveEquation = async () => {
    if (!canSolve) return;
    setSolving(true);
    setSolveError('');
    setSolveResult(null);

    try {
      const res = await fetch('/api/lab/balancing/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equation: equationInput.trim() }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.balanced) {
        setSolveError(data.error || data.message || 'Chưa thể cân bằng phương trình này.');
        setSolveResult(data);
        return;
      }

      setSolveResult(data);
    } catch (error) {
      setSolveError(error.message || 'Không thể kết nối máy chủ cân bằng.');
    } finally {
      setSolving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          to="/lab"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-500 shadow-sm transition-colors hover:text-emerald-600"
        >
          <ChevronLeft size={16} />
          Quay lại phòng thí nghiệm
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
                  <Sparkles size={14} />
                  Solver tuyến tính
                </div>
                <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                  Cân bằng phương trình tự do
                </h1>
              </div>
              <div className="hidden rounded-2xl bg-slate-900 p-3 text-white sm:block">
                <FlaskConical size={28} />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <Clipboard className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    value={equationInput}
                    onChange={(event) => setEquationInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') solveEquation();
                    }}
                    placeholder="Fe + O2 -> Fe2O3"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-base font-bold text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
                <button
                  onClick={solveEquation}
                  disabled={!canSolve || solving}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 text-sm font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  {solving ? 'Đang giải' : 'Cân bằng'}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {EXAMPLES.map((example) => (
                  <button
                    key={example}
                    onClick={() => setEquationInput(example)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:border-emerald-300 hover:text-emerald-700"
                  >
                    {example}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs font-semibold text-slate-500">
                Với ion, viết điện tích bằng dấu <strong>^</strong>, ví dụ Fe^2+, SO4^2-; electron viết e-.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {solveError && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm font-bold text-rose-700"
                >
                  {solveError}
                </motion.div>
              )}

              {solveResult?.balanced && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-6 rounded-[28px] border border-emerald-200 bg-emerald-50/70 p-5 md:p-6"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700 shadow-sm">
                      <Check size={14} strokeWidth={3} />
                      Đã cân bằng
                    </div>
                    <button
                      onClick={() => handleCopy(solveResult.equation)}
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-widest text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                    >
                      {copiedText === solveResult.equation ? <Check size={16} /> : <Copy size={16} />}
                      {copiedText === solveResult.equation ? 'Đã chép' : 'Sao chép'}
                    </button>
                  </div>

                  <EquationDisplay result={solveResult} />

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-white bg-white/80 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Tỉ lệ hệ số</p>
                      <p className="mt-1 text-2xl font-black text-slate-900">{coefficientSummary}</p>
                    </div>
                    <div className="rounded-2xl border border-white bg-white/80 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Phương pháp</p>
                      <p className="mt-1 text-sm font-black uppercase tracking-widest text-slate-700">Ma trận nguyên tố và điện tích</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                <Beaker size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Kiểm toán nguyên tố</p>
                <h2 className="text-xl font-black">Hai vế sau cân bằng</h2>
              </div>
            </div>

            {solveResult?.balanced ? (
              <div className="space-y-3">
                {solveResult.elements.map((item) => (
                  <div key={item.element} className="grid grid-cols-[52px_1fr_1fr] items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-black text-slate-900 shadow-sm">
                      {item.element}
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Chất tham gia</p>
                      <p className="text-lg font-black text-emerald-700">{item.reactants}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Sản phẩm</p>
                      <p className="text-lg font-black text-blue-700">{item.products}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-center">
                <Database className="mb-3 text-slate-300" size={36} />
                <p className="max-w-xs text-sm font-bold leading-relaxed text-slate-500">
                  Kết quả kiểm toán sẽ xuất hiện sau khi phương trình được cân bằng.
                </p>
              </div>
            )}
          </motion.aside>
        </div>

        <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-indigo-700">
                <Database size={14} />
                Kho phương trình
              </div>
              <h2 className="text-2xl font-black tracking-tight">Tra cứu phương trình đã xác thực</h2>
            </div>
            <div className="relative w-full md:w-[360px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Na, KMnO4, HCl..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-sm font-bold outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {loadingSearch && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm font-bold text-slate-500">
                Đang tìm trong kho dữ liệu...
              </div>
            )}

            {!loadingSearch && searchError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-bold text-rose-700">
                {searchError}
              </div>
            )}

            {!loadingSearch && results.map((eq, index) => {
              const normalized = {
                balanced: true,
                reactants: eq.reactants || [],
                products: eq.products || [],
                coefficients: eq.answer || [],
              };
              const copyText = eq.equation_string || formatEquationForCopy(normalized);

              return (
                <motion.div
                  key={`${copyText}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <EquationDisplay result={normalized} compact />
                  <button
                    onClick={() => handleCopy(copyText)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-slate-700"
                  >
                    {copiedText === copyText ? <Check size={16} /> : <Copy size={16} />}
                    {copiedText === copyText ? 'Đã chép' : 'Sao chép'}
                  </button>
                </motion.div>
              );
            })}

            {!loadingSearch && !searchError && searched && results.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                <p className="text-sm font-bold text-slate-500">Không tìm thấy phương trình phù hợp trong kho dữ liệu.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LabSolverPage;
