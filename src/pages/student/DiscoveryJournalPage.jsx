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
    <div className="h-screen bg-[#0d0e12] flex flex-col font-sans text-white pt-20">
      <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-black/40 shrink-0">
        <div className="flex items-center gap-12">
          <div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Synthesis Nexus</h2>
            <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Sổ tay vật chất & Phản ứng</p>
          </div>
          
          {/* Progress Bar in Header */}
          <div className="hidden md:flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
              <div className="flex flex-col gap-1 w-48">
                  <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Tiến độ thu thập</span>
                      <span className="text-[10px] text-viet-green font-black">{Math.round((discoveredFormulas.length / Math.max(1, dbChemicals.length)) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-blue-500 to-viet-green"
                        initial={{ width: 0 }}
                        animate={{ width: `${(discoveredFormulas.length / Math.max(1, dbChemicals.length)) * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                  </div>
              </div>
              <div className="flex flex-col items-end pl-4 border-l border-white/10">
                  <span className="text-xl font-black italic">{discoveredFormulas.length} <span className="text-xs text-white/40 not-italic">/ {dbChemicals.length}</span></span>
              </div>
          </div>
        </div>

        <button onClick={() => window.close()} className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all text-xs font-bold uppercase tracking-widest border border-white/10 shadow-lg">
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
