import React, { useState, useEffect } from 'react';
import DiscoveryMap from '@/components/lab/DiscoveryMap';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

const normalize = (f) => {
  if (!f) return "";
  const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  return f.toString().replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => subMap[m]).trim().toUpperCase();
};

const DiscoveryJournalPage = () => {
  const { user, isLoggedIn } = useAuth();
  const [dbChemicals, setDbChemicals] = useState([]);
  const [dbReactions, setDbReactions] = useState([]);
  const [discoveredFormulas, setDiscoveredFormulas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const [chemsRes, rxsRes] = await Promise.all([
          fetch('/api/lab/chemicals', { headers }),
          fetch('/api/lab/reactions', { headers })
        ]);
        const chemsData = await chemsRes.json();
        const rxsData = await rxsRes.json();
        
        const processedChems = [];
        const seenFormulas = new Set();
        
        chemsData.forEach(c => {
          const formula = normalize(c.formula).replace(/:/g, '');
          if (formula === 'KMNO4') {
            c.state = 'liquid';
            c.color = '#800080';
            c.opacity = 0.9;
          }
          if (!seenFormulas.has(c.formula + c.name)) {
            processedChems.push(c);
            seenFormulas.add(c.formula + c.name);
          }
        });

        setDbChemicals(processedChems);
        setDbReactions(rxsData);
        
        const starters = processedChems.filter(c => c.is_starter || c.isStarter).map(c => c.formula);
        const saved = localStorage.getItem('chem_odyssey_discovered');
        let initialDiscovered = starters;
        
        if (saved) {
          try {
            initialDiscovered = Array.from(new Set([...starters, ...JSON.parse(saved)]));
          } catch (e) { console.error("Stored data corrupted"); }
        }
        
        if (isLoggedIn && user && user.unlockedChemicals) {
            initialDiscovered = Array.from(new Set([...initialDiscovered, ...user.unlockedChemicals]));
        }

        setDiscoveredFormulas(initialDiscovered);
        
      } catch (err) {
        console.error("Failed to fetch lab data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Check if user object is fully loaded if logged in
    if (isLoggedIn && !user) return; // wait for user
    
    fetchData();
  }, [isLoggedIn, user]);

  if (isLoading) return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0f] text-white min-h-screen">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-6" />
      <h2 className="text-xl font-bold uppercase tracking-widest animate-pulse">Đang nạp Sổ Tay Khám Phá...</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0e12] flex flex-col font-sans text-white">
      <div className="p-8 border-b border-white/10 flex justify-between items-center bg-black/40">
        <div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Synthesis Nexus</h2>
          <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Bản đồ tiến trình khám phá hóa học của bạn</p>
        </div>
        <button onClick={() => window.close()} className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all text-xs font-bold uppercase tracking-widest">
          Đóng trang
        </button>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <DiscoveryMap chemicals={dbChemicals} reactions={dbReactions} discoveredFormulas={discoveredFormulas} />
      </div>
    </div>
  );
};

export default DiscoveryJournalPage;
