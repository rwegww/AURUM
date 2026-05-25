import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { activityService } from '@/services/ActivityService';

const UserActivityHistory = () => {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async (isCancelled = () => false) => {
    const data = await activityService.getHistory();
    if (isCancelled()) return;
    setHistory(data);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    activityService.getHistory().then((data) => {
      if (cancelled) return;
      setHistory(data);
      setLoading(false);
    });

    const handleUpdate = () => fetchHistory();

    window.addEventListener('aurum_activity_logged', handleUpdate);
    window.addEventListener('aurum_activity_cleared', handleUpdate);

    return () => {
      cancelled = true;
      window.removeEventListener('aurum_activity_logged', handleUpdate);
      window.removeEventListener('aurum_activity_cleared', handleUpdate);
    };
  }, []);

  const handleClear = async () => {
    if (window.confirm(t('profile.history_clear') + '?')) {
      await activityService.clear();
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'calculation': return 'bg-pink-500/10 text-pink-500 border-pink-200/50';
      case 'lab': return 'bg-purple-500/10 text-purple-500 border-purple-200/50';
      case 'periodic_table': return 'bg-blue-500/10 text-blue-500 border-blue-200/50';
      case 'lesson': return 'bg-emerald-500/10 text-emerald-500 border-emerald-200/50';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-[40px] p-8 md:p-10 border border-viet-border shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-2xl font-black text-viet-text leading-none">{t('profile.history_title')}</h3>
          <p className="text-[10px] font-black text-viet-text-light/40 uppercase tracking-[3px] mt-2 italic">Dữ liệu hoạt động Alpha</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={handleClear}
            className="text-[11px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors px-4 py-2 hover:bg-red-50 rounded-xl"
          >
            {t('profile.history_clear')}
          </button>
        )}
      </div>

      <div className="flex-1 space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin"></div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {history.length > 0 ? (
              history.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative flex gap-6 pb-6 border-b border-viet-border last:border-0 last:pb-0"
                >
                  <div className={`w-14 h-14 shrink-0 rounded-2xl border flex items-center justify-center text-2xl shadow-sm transition-transform group-hover:scale-110 ${getIconBg(item.type)}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-[15px] font-black text-viet-text group-hover:text-viet-green transition-colors">{item.label}</h4>
                      <span className="text-[10px] font-bold text-viet-text-light/40 uppercase tracking-widest">{activityService.formatTimeAgo(item.timestamp)}</span>
                    </div>
                    <p className="text-[13px] font-medium text-viet-text-light/70 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-30">
                <div className="text-5xl mb-6 grayscale">⏳</div>
                <p className="text-sm font-bold uppercase tracking-widest">{t('profile.history_empty')}</p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>

      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default UserActivityHistory;
