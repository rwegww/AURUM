import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Clock3, Loader2, Trash2 } from 'lucide-react';
import { activityService } from '@/services/ActivityService';
import { RenderIcon } from '@/utils/IconMapper';

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
    <section className="rounded-[32px] border-2 border-[#dfe3db] border-b-[6px] bg-white p-6 sm:p-8">
      <div className="mb-7 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#eef6e8] text-[#43752f]" aria-hidden="true">
            <Clock3 size={19} />
          </span>
          <div className="min-w-0">
            <h3 className="text-xl font-black leading-tight text-viet-text sm:text-2xl">{t('profile.history_title')}</h3>
            <p className="mt-1 text-xs font-semibold text-viet-text-light/70">{t('profile.history_subtitle')}</p>
          </div>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 text-[10px] font-black uppercase tracking-wider text-red-600 transition-colors hover:border-red-200 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <Trash2 size={14} aria-hidden="true" />
            <span className="hidden sm:inline">{t('profile.history_clear')}</span>
          </button>
        )}
      </div>

      <div className="max-h-[500px] space-y-5 overflow-y-auto pr-2 custom-scrollbar sm:pr-4">
        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-[22px] border border-dashed border-[#dfe3db] bg-[#f9faf7] py-14" role="status" aria-live="polite">
            <Loader2 className="h-5 w-5 animate-spin text-viet-green motion-reduce:animate-none" aria-hidden="true" />
            <span className="text-sm font-bold text-viet-text-light">{t('profile.history_loading')}</span>
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
                  className="group relative flex gap-4 border-b border-viet-border pb-5 last:border-0 last:pb-0 sm:gap-5"
                >
                  <div className={`w-14 h-14 shrink-0 rounded-2xl border flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${getIconBg(item.type)}`}>
                    <RenderIcon iconName={item.icon || item.type} className="w-7 h-7" />
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
              <div className="flex flex-col items-center justify-center rounded-[22px] border border-dashed border-[#dfe3db] bg-[#f9faf7] px-5 py-12 text-center">
                <Clock3 className="mb-4 h-9 w-9 text-viet-text-light/30" aria-hidden="true" />
                <p className="max-w-sm text-sm font-bold leading-6 text-viet-text-light/70">{t('profile.history_empty')}</p>
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
    </section>
  );
};

export default UserActivityHistory;
