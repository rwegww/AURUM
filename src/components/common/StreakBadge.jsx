import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const StreakBadge = () => {
  const { user, recoverStreak } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [error, setError] = useState(null);

  if (!user) return null;

  const streak = user.streakCount || 0;
  const isMaintainedToday = user.todayOnlineMinutes >= 10 || user.todayLessonCompleted;

  // Logic for broken streak (simplified for UI)
  const isBroken = streak > 0 && !isMaintainedToday && user.lastStreakAt && (new Date() - new Date(user.lastStreakAt) > 48 * 60 * 60 * 1000);

  const handleRecover = async () => {
    setRecovering(true);
    setError(null);
    const res = await recoverStreak(streak); // Recover the previous count
    if (!res.success) setError(res.message);
    setRecovering(false);
  };

  const milestones = [
    { days: 3, label: 'Tập sự', icon: '🌱' },
    { days: 7, label: 'Nhà hóa học', icon: '🧪' },
    { days: 14, label: 'Bậc thầy', icon: '⚗️' },
    { days: 30, label: 'Huyền thoại', icon: '🔥' },
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
        <motion.span
          animate={isMaintainedToday ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {isMaintainedToday ? '🔥' : '☁️'}
        </motion.span>
        <span className="font-bold text-sm">{streak}</span>
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
                  {isMaintainedToday ? '🔥' : '⏳'}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Chuỗi {streak} ngày!
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
                    <p className="text-red-500 text-sm mb-3">
                      Chuỗi của bạn đã bị nguội! Bạn có muốn dùng XP để khôi phục không?
                    </p>
                    <button
                      onClick={handleRecover}
                      disabled={recovering}
                      className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                    >
                      {recovering ? 'Đang khôi phục...' : `Khôi phục với ${100 + streak * 20} XP`}
                    </button>
                    {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                  </div>
                )}

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-bold transition-all"
                >
                  Đóng
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
