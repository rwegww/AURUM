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
  const [dbChemicals, setDbChemicals] = useState([]);
  const [dbReactions, setDbReactions] = useState([]);
  const [discoveredFormulas, setDiscoveredFormulas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleClose = () => {
    if (window.opener) {
      window.close();
      setTimeout(() => {
        if (!window.closed) {
          navigate('/lab');
        }
      }, 100);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/lab');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [chemsRes, rxsRes] = await Promise.all([
          fetch('/api/lab/chemicals', { headers }),
          fetch('/api/lab/reactions', { headers }),
        ]);
        const chemsData = await chemsRes.json();
        const rxsData = await rxsRes.json();

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

          const key = `${normalizedChemical.formula}:${normalizedChemical.name}`;
          if (!seenFormulas.has(key)) {
            processedChems.push(normalizedChemical);
            seenFormulas.add(key);
          }
        });

        const starters = processedChems
          .filter((chemical) => chemical.is_starter || chemical.isStarter)
          .map((chemical) => chemical.formula);

        let initialDiscovered = starters;
        const saved = localStorage.getItem('chem_odyssey_discovered');
        if (saved) {
          try {
            initialDiscovered = Array.from(new Set([...starters, ...JSON.parse(saved)]));
          } catch (error) {
            console.error('Stored discovery data is corrupted:', error);
          }
        }

        if (isLoggedIn && user?.unlockedChemicals) {
          initialDiscovered = Array.from(new Set([...initialDiscovered, ...user.unlockedChemicals]));
        }

        setDbChemicals(processedChems);
        setDbReactions(Array.isArray(rxsData) ? rxsData : []);
        setDiscoveredFormulas(initialDiscovered);
      } catch (error) {
        console.error('Failed to fetch lab data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn && !user) return;
    fetchData();
  }, [isLoggedIn, user]);

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

  const discoveryPercent = Math.round((discoveredFormulas.length / Math.max(1, dbChemicals.length)) * 100);

  return (
    <div className="flex h-screen flex-col bg-viet-bg font-sans text-viet-text">
      <div className="flex shrink-0 items-center justify-between border-b border-viet-border bg-white/80 backdrop-blur shadow-sm p-6 md:p-8 z-20 relative">
        <div className="flex items-center gap-12">
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

        <div className="flex items-center gap-3">
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
