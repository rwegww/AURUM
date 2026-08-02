import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hammer } from 'lucide-react';
import DiscoveryMap from '@/components/lab/DiscoveryMap';
import { useAuth } from '@/context/AuthContext';

const normalize = (formula) => {
  if (!formula) return '';
  const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  return formula.toString().replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (match) => subMap[match]).trim().toUpperCase();
};

const DiscoveryJournalPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const userId = user?.id;
  const userUnlockedChemicals = user?.unlockedChemicals;
  const [dbChemicals, setDbChemicals] = useState([]);
  const [dbReactions, setDbReactions] = useState([]);
  const [discoveredFormulas, setDiscoveredFormulas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [loadVersion, setLoadVersion] = useState(0);

  const handleClose = () => navigate('/lab');

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [chemsRes, rxsRes] = await Promise.all([
          fetch('/api/lab/chemicals', { headers, signal: controller.signal }),
          fetch('/api/lab/reactions', { headers, signal: controller.signal }),
        ]);
        if (!chemsRes.ok || !rxsRes.ok) throw new Error('Không thể tải dữ liệu sổ khám phá.');
        const chemsData = await chemsRes.json();
        const rxsData = await rxsRes.json();
        if (!Array.isArray(chemsData) || !Array.isArray(rxsData)) throw new Error('Dữ liệu sổ khám phá không hợp lệ.');

        const processedChems = [];
        const seenFormulas = new Set();

        chemsData.forEach((chemical) => {
          const formula = normalize(chemical.formula).replace(/:/g, '');
          const normalizedChemical = { ...chemical };
          if (formula === 'KMNO4') {
            normalizedChemical.state = 'liquid';
            normalizedChemical.color = '#800080';
            normalizedChemical.opacity = 0.9;
          }

          const key = normalize(normalizedChemical.formula);
          if (!seenFormulas.has(key)) {
            processedChems.push(normalizedChemical);
            seenFormulas.add(key);
          }
        });

        const starters = processedChems
          .filter((chemical) => chemical.is_starter || chemical.isStarter)
          .map((chemical) => chemical.formula);

        let initialDiscovered = starters;
        if (isLoggedIn) {
          initialDiscovered = Array.from(new Set([...starters, ...(userUnlockedChemicals || [])]));
        } else {
          const saved = localStorage.getItem('chem_odyssey_discovered:guest') || localStorage.getItem('chem_odyssey_discovered');
          if (saved) {
            try {
              initialDiscovered = Array.from(new Set([...starters, ...JSON.parse(saved)]));
            } catch {
              localStorage.removeItem('chem_odyssey_discovered:guest');
            }
          }
        }

        const canonicalFormulaByKey = new Map(processedChems.map(chemical => [normalize(chemical.formula), chemical.formula]));
        initialDiscovered = Array.from(new Set(initialDiscovered
          .map(item => canonicalFormulaByKey.get(normalize(item)))
          .filter(Boolean)));

        setDbChemicals(processedChems);
        setDbReactions(Array.isArray(rxsData) ? rxsData : []);
        setDiscoveredFormulas(initialDiscovered);
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Failed to fetch lab data:', error);
        setLoadError(error.message || 'Không thể tải sổ khám phá.');
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    if (isLoggedIn && !userId) return;
    fetchData();
    return () => controller.abort();
  }, [isLoggedIn, loadVersion, userId, userUnlockedChemicals]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-viet-bg text-viet-text">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mb-6 h-16 w-16 rounded-full border-4 border-viet-green border-t-transparent"
        />
        <h2 className="animate-pulse text-xl font-bold uppercase tracking-widest text-viet-text-light">Đang nạp sổ tay khám phá...</h2>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-viet-bg p-8 text-center text-viet-text">
        <h2 className="text-2xl font-black">Không thể mở sổ khám phá</h2>
        <p className="mt-2 text-sm font-semibold text-viet-text-light">{loadError}</p>
        <button type="button" onClick={() => setLoadVersion(version => version + 1)} className="viet-btn-green mt-6">Thử lại</button>
      </div>
    );
  }

  const discoveryPercent = Math.min(100, Math.round((discoveredFormulas.length / Math.max(1, dbChemicals.length)) * 100));

  return (
    <div className="flex min-h-screen flex-col bg-viet-bg pt-20 font-sans text-viet-text">
      <div className="relative z-20 flex shrink-0 flex-col gap-4 border-b border-viet-border bg-white/80 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between md:p-6">
        <div className="flex min-w-0 items-center gap-4 md:gap-12">
          <div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-viet-text">Từ Điển Vật Chất</h2>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-viet-text-light">Sổ tay vật chất & phản ứng</p>
          </div>

          <div className="hidden items-center gap-4 rounded-2xl border border-viet-border bg-white px-6 py-3 shadow-sm md:flex">
            <div className="flex w-48 flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">Tiến độ thu thập</span>
                <span className="text-[10px] font-black text-viet-green">{discoveryPercent}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full border border-viet-border bg-gray-100">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 to-viet-green"
                  initial={{ width: 0 }}
                  animate={{ width: `${discoveryPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
            <div className="flex flex-col items-end border-l border-viet-border pl-4">
              <span className="text-xl font-black italic text-viet-text">
                {discoveredFormulas.length} <span className="text-xs text-viet-text-light not-italic">/ {dbChemicals.length}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <button
            onClick={() => navigate('/lab/crafting')}
            className="flex items-center justify-center gap-2 viet-btn-green shadow-lg hover:shadow-xl text-xs py-3 !px-5"
          >
            <Hammer size={16} />
            Chế tạo
          </button>
          <button
            onClick={handleClose}
            className="flex items-center justify-center rounded-2xl border border-viet-border bg-white text-viet-text-light px-6 py-3 text-xs font-bold uppercase tracking-widest shadow-sm transition-all hover:bg-viet-bg hover:text-viet-text"
          >
            Đóng trang
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <DiscoveryMap chemicals={dbChemicals} reactions={dbReactions} discoveredFormulas={discoveredFormulas} />
      </div>
    </div>
  );
};

export default DiscoveryJournalPage;
