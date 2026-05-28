import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Leaf, FlaskConical, Beaker, Flame } from 'lucide-react';

const StreakBadge = () => {
  const { user, recoverStreak, resetStreak } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (!user) return;
    const streak = user.streakCount || 0;
    const isMaintainedToday = user.todayOnlineMinutes >= 10 || user.todayLessonCompleted;
    const isBroken = streak > 0 && !isMaintainedToday && user.lastStreakAt && (new Date() - new Date(user.lastStreakAt) > 48 * 60 * 60 * 1000);

    if (isBroken) {
      const today = new Date().toISOString().split('T')[0];
      const seenDate = localStorage.getItem(`streak_broken_seen_${user.id}`);
      
      if (!seenDate) {
        // First time seeing it broken
        localStorage.setItem(`streak_broken_seen_${user.id}`, today);
        setShowModal(true); // Auto show modal
      } else if (seenDate !== today) {
        // Second login (next day) and still not recovered -> Permanent loss
        resetStreak();
        localStorage.removeItem(`streak_broken_seen_${user.id}`);
      }
    } else {
      // Clean up if maintained or recovered
      localStorage.removeItem(`streak_broken_seen_${user.id}`);
    }
  }, [user, resetStreak]);

  if (!user) return null;

  const streak = user.streakCount || 0;
  const isMaintainedToday = user.todayOnlineMinutes >= 10 || user.todayLessonCompleted;
  const isBroken = streak > 0 && !isMaintainedToday && user.lastStreakAt && (new Date() - new Date(user.lastStreakAt) > 48 * 60 * 60 * 1000);

  const handleRecover = async () => {
    setRecovering(true);
    setError(null);
    const res = await recoverStreak(streak); // Recover the previous count
    if (!res.success) setError(res.message);
    setRecovering(false);
  };

  const handleAcceptLoss = async () => {
    setRecovering(true);
    const res = await resetStreak();
    if (res.success) {
      setShowModal(false);
    } else {
      setError(res.message);
    }
    setRecovering(false);
  };

  const milestones = [
    { days: 3, label: 'Táº­p sá»±', icon: <Leaf className="w-8 h-8 text-green-500" /> },
    { days: 7, label: 'NhÃ  hÃ³a há»c', icon: <FlaskConical className="w-8 h-8 text-emerald-500" /> },
    { days: 14, label: 'Báº­c tháº§y', icon: <Beaker className="w-8 h-8 text-amber-500" /> },
    { days: 30, label: 'Huyá»n thoáº¡i', icon: <Flame className="w-8 h-8 text-orange-500" /> },
  ];

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-300 ${isMaintainedToday
          ? 'bg-orange-500/20 border border-orange-500/50 text-orange-500'
          : 'bg-gray-500/10 border border-gray-500/30 text-gray-400'
          }`}
      >
        <span className="font-bold text-sm">ðŸ”¥ {streak}</span>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 text-center">
                <div className="text-6xl mb-4">
                  {isMaintainedToday ? 'ðŸ”¥' : 'â³'}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Chuá»—i {streak} ngÃ y!
                </h2>


                <div className="grid grid-cols-4 gap-2 mb-8">
                  {milestones.map((m) => (
                    <div
                      key={m.days}
                      className={`p-3 rounded-2xl border text-center transition-all ${streak >= m.days
                        ? 'bg-orange-500/20 border-orange-500 text-orange-500'
                        : 'bg-zinc-800/50 border-zinc-700 text-zinc-500 opacity-50'
                        }`}
                    >
                      <div className="text-xl mb-1">{m.icon}</div>
                      <div className="text-[10px] font-bold uppercase">{m.days}N</div>
                    </div>
                  ))}
                </div>

                {isBroken && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6">
                    <p className="text-red-500 text-sm font-bold mb-1">
                      Chuá»—i cá»§a báº¡n Ä‘Ã£ bá»‹ nguá»™i!
                    </p>
                    <p className="text-red-400 text-xs mb-4">
                      Báº¡n cÃ³ thá»ƒ dÃ¹ng XP Ä‘á»ƒ khÃ´i phá»¥c hoáº·c cháº¥p nháº­n máº¥t. Náº¿u khÃ´ng khÃ´i phá»¥c, chuá»—i sáº½ máº¥t vÄ©nh viá»…n vÃ o ngÃ y mai.
                    </p>
                    <button
                      onClick={handleRecover}
                      disabled={recovering}
                      className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                    >
                      {recovering ? 'Äang xá»­ lÃ½...' : `KhÃ´i phá»¥c vá»›i ${100 + streak * 20} XP`}
                    </button>
                    <button
                      onClick={handleAcceptLoss}
                      disabled={recovering}
                      className="w-full mt-2 py-2 bg-transparent border border-red-500/50 hover:bg-red-500/10 text-red-400 rounded-xl font-bold transition-all disabled:opacity-50"
                    >
                      Cháº¥p nháº­n máº¥t chuá»—i
                    </button>
                    {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                  </div>
                )}

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-bold transition-all"
                >
                  ÄÃ³ng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StreakBadge;

