import { dialogMotion } from '@/utils/motion';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpenCheck, Hammer, X } from 'lucide-react';
import DiscoveryMap from '@/components/lab/DiscoveryMap';
import { useAuth } from '@/context/AuthContext';

const EMPTY_DISCOVERIES = [];

const normalize = (formula) => {
  if (!formula) return '';
  const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  return formula.toString().replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (match) => subMap[match]).trim().toUpperCase();
};

const DiscoveryJournalModal = ({ open, onClose, onOpenCrafting, additionalDiscoveredFormulas = EMPTY_DISCOVERIES }) => {
  const { user, isLoggedIn } = useAuth();
  const closeButtonRef = useRef(null);
  const userId = user?.id;
  const userUnlockedChemicals = user?.unlockedChemicals;
  const [dbChemicals, setDbChemicals] = useState([]);
  const [dbReactions, setDbReactions] = useState([]);
  const [discoveredFormulas, setDiscoveredFormulas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [loadVersion, setLoadVersion] = useState(0);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  useEffect(() => {
    if (!open || (isLoggedIn && !userId)) return undefined;

    const controller = new AbortController();
    const fetchData = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const [chemicalsResponse, reactionsResponse] = await Promise.all([
          fetch('/api/lab/chemicals', { headers, signal: controller.signal }),
          fetch('/api/lab/reactions', { headers, signal: controller.signal }),
        ]);

        if (!chemicalsResponse.ok || !reactionsResponse.ok) {
          throw new Error('Không thể tải dữ liệu sổ tay.');
        }

        const [chemicalsData, reactionsData] = await Promise.all([
          chemicalsResponse.json(),
          reactionsResponse.json(),
        ]);

        if (!Array.isArray(chemicalsData) || !Array.isArray(reactionsData)) {
          throw new Error('Dữ liệu sổ tay không hợp lệ.');
        }

        const processedChemicals = [];
        const seenFormulas = new Set();
        chemicalsData.forEach((chemical) => {
          const formula = normalize(chemical.formula).replace(/:/g, '');
          const normalizedChemical = { ...chemical };

          if (formula === 'KMNO4') {
            normalizedChemical.state = 'liquid';
            normalizedChemical.color = '#800080';
            normalizedChemical.opacity = 0.9;
          }

          const key = normalize(normalizedChemical.formula);
          if (!seenFormulas.has(key)) {
            processedChemicals.push(normalizedChemical);
            seenFormulas.add(key);
          }
        });

        const starters = processedChemicals
          .filter((chemical) => chemical.is_starter || chemical.isStarter)
          .map((chemical) => chemical.formula);

        let savedDiscoveries = [];
        if (isLoggedIn) {
          savedDiscoveries = userUnlockedChemicals || [];
        } else {
          const saved = localStorage.getItem('chem_odyssey_discovered:guest') || localStorage.getItem('chem_odyssey_discovered');
          if (saved) {
            try {
              savedDiscoveries = JSON.parse(saved);
            } catch {
              localStorage.removeItem('chem_odyssey_discovered:guest');
            }
          }
        }

        const canonicalFormulaByKey = new Map(
          processedChemicals.map((chemical) => [normalize(chemical.formula), chemical.formula]),
        );
        const initialDiscovered = Array.from(new Set([
          ...starters,
          ...savedDiscoveries,
          ...additionalDiscoveredFormulas,
        ].map((item) => canonicalFormulaByKey.get(normalize(item))).filter(Boolean)));

        if (!controller.signal.aborted) {
          setDbChemicals(processedChemicals);
          setDbReactions(reactionsData);
          setDiscoveredFormulas(initialDiscovered);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Không thể tải sổ tay khám phá:', error);
          setLoadError(error.message || 'Không thể tải sổ tay khám phá.');
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [additionalDiscoveredFormulas, isLoggedIn, loadVersion, open, userId, userUnlockedChemicals]);

  const discoveryPercent = useMemo(() => (
    Math.min(100, Math.round((discoveredFormulas.length / Math.max(1, dbChemicals.length)) * 100))
  ), [dbChemicals.length, discoveredFormulas.length]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-0 sm:p-3 lg:p-5">
          <motion.button
            type="button"
            aria-label="Đóng sổ tay khám phá"
            className="absolute inset-0 cursor-default bg-slate-950/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="discovery-journal-title"
            {...dialogMotion}
            className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#f6f8fb] shadow-[0_30px_100px_rgba(2,6,23,0.45)] sm:h-[min(920px,calc(100dvh-1.5rem))] sm:max-w-[1480px] sm:rounded-[30px] sm:border sm:border-white/80"
          >
            <header className="relative shrink-0 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-[0_6px_0_#047857] sm:h-12 sm:w-12">
                    <BookOpenCheck size={23} />
                  </div>
                  <div className="min-w-0">
                    <p className="mb-0.5 text-[12px] font-black uppercase tracking-[0.16em] text-emerald-600">Phòng Lab · Bộ sưu tập</p>
                    <h2 id="discovery-journal-title" className="truncate text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Sổ tay khám phá</h2>
                    <p className="mt-1 hidden text-sm font-semibold text-slate-500 sm:block">Tra cứu vật chất đã thu thập và xem cách điều chế.</p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {onOpenCrafting && (
                    <button
                      type="button"
                      onClick={onOpenCrafting}
                      className="hidden h-11 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-black text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 md:flex"
                    >
                      <Hammer size={17} />
                      Khu chế tạo
                    </button>
                  )}
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={onClose}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                    aria-label="Đóng sổ tay khám phá"
                  >
                    <X size={21} />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 lg:absolute lg:right-[230px] lg:top-4 lg:mt-0 lg:w-[310px]">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-xs font-extrabold">
                    <span className="text-slate-600">Tiến độ khám phá</span>
                    <span className="text-emerald-700">{discoveredFormulas.length}/{dbChemicals.length || '—'}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${discoveryPercent}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    />
                  </div>
                </div>
                <span className="text-lg font-black text-slate-950">{discoveryPercent}%</span>
              </div>
            </header>

            <div className="min-h-0 flex-1">
              {isLoading ? (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    className="mb-5 h-12 w-12 rounded-full border-4 border-emerald-500 border-t-transparent"
                  />
                  <p className="text-lg font-black text-slate-900">Đang mở sổ tay...</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">Một chút nữa là bộ sưu tập sẵn sàng.</p>
                </div>
              ) : loadError ? (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-2xl">!</div>
                  <h3 className="text-xl font-black text-slate-950">Chưa thể mở sổ tay</h3>
                  <p className="mt-2 max-w-md text-sm font-semibold text-slate-500">{loadError}</p>
                  <button
                    type="button"
                    onClick={() => setLoadVersion((version) => version + 1)}
                    className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
                  >
                    Thử tải lại
                  </button>
                </div>
              ) : (
                <DiscoveryMap
                  chemicals={dbChemicals}
                  reactions={dbReactions}
                  discoveredFormulas={discoveredFormulas}
                />
              )}
            </div>
          </motion.section>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default DiscoveryJournalModal;
