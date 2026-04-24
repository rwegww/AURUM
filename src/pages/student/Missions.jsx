import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTranslation, Trans } from 'react-i18next';
import Avatar from '@/components/common/Avatar';

const Missions = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('daily');
  const [claimingId, setClaimingId] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Calculate time until next midnight
    const timer = setInterval(() => {
      const now = new Date();
      const resetTime = new Date();
      resetTime.setHours(24, 0, 0, 0);
      
      const diff = resetTime - now;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);

    if (!authLoading && !user) {
      window.location.href = '/login';
      return;
    }
    fetchMissions();

    return () => clearInterval(timer);
  }, [user, authLoading]);

  const fetchMissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/missions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setMissions(data);
    } catch (error) {
      console.error('Failed to fetch missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (missionId) => {
    setClaimingId(missionId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/missions/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ missionId })
      });
      const data = await res.json();
      if (data.success) {
        fetchMissions();
      }
    } catch (error) {
      console.error('Failed to claim reward:', error);
    } finally {
      setClaimingId(null);
    }
  };

  const filteredMissions = missions.filter(m => m.type === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffbf0] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-viet-green border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffbf0] pb-24 pt-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-12"
        >
          <div className="inline-block px-4 py-1.5 bg-viet-green/10 rounded-full mb-4">
            <span className="text-viet-green font-black text-xs uppercase tracking-widest italic">
              {t('missions.badge')}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-viet-text italic tracking-tighter uppercase mb-2">
            <Trans i18nKey="missions.title">
              Hệ thống <span className="text-viet-green">Nhiệm vụ</span>
            </Trans>
          </h1>
          <p className="text-viet-text-light font-bold">{t('missions.subtitle')}</p>
        </motion.div>

        {/* User Stats Card */}
        <div className="bg-white rounded-[40px] border-2 border-viet-border p-8 mb-8 shadow-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-viet-green/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-viet-green/10 transition-colors" />
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                 <div className="w-24 h-24 flex items-center justify-center shrink-0">
                   <Avatar seed={user?.avatarSeed || user?.username} size={96} streakCount={user?.streakCount} level={user?.level} />
                 </div>
                 <div>
                   <p className="text-[11px] font-black text-viet-text-light/40 uppercase tracking-widest mb-1">{user?.username}</p>
                   <h2 className="text-3xl font-black text-viet-text italic tracking-tighter uppercase mb-2">
                     <Trans i18nKey="missions.level_val" values={{ level: user?.level || 1 }}>
                       Cấp <span className="text-viet-green">{{level: user?.level || 1}}</span>
                     </Trans>
                   </h2>
                   <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-viet-green/10 rounded-full text-[10px] font-black text-viet-green uppercase tracking-widest border border-viet-green/20">
                        {user?.xp || 0} XP
                      </div>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   </div>
                 </div>
              </div>

              {/* Streak Pulse Area */}
              <div className="flex items-center gap-8 bg-viet-bg/50 px-8 py-6 rounded-[32px] border border-viet-border/50 backdrop-blur-sm">
                 <div className="text-center">
                    <p className="text-[10px] font-black text-viet-text-light/40 uppercase tracking-widest mb-2">Chuỗi hiện tại</p>
                    <div className="flex items-center gap-2 justify-center">
                       <span className="text-3xl font-black text-viet-text">{user?.streakCount || 0}</span>
                       <span className="text-2xl animate-bounce">🔥</span>
                    </div>
                 </div>
                 <div className="w-[1px] h-12 bg-viet-border" />
                 <div className="space-y-3">
                    <div className="flex items-center gap-3">
                       <div className={`w-3 h-3 rounded-full ${user?.todayOnlineMinutes >= 10 ? 'bg-viet-green shadow-[0_0_8px_#76c034]' : 'bg-slate-200'}`} />
                       <span className={`text-[11px] font-bold ${user?.todayOnlineMinutes >= 10 ? 'text-viet-green' : 'text-viet-text-light/60'}`}>
                         Online 10 phút ({user?.todayOnlineMinutes}/10)
                       </span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className={`w-3 h-3 rounded-full ${user?.todayLessonCompleted ? 'bg-viet-green shadow-[0_0_8px_#76c034]' : 'bg-slate-200'}`} />
                       <span className={`text-[11px] font-bold ${user?.todayLessonCompleted ? 'text-viet-green' : 'text-viet-text-light/60'}`}>
                         Hoàn thành bài học
                       </span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Daily Reset Countdown */}
        {activeTab === 'daily' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <span className="text-amber-500 animate-pulse">⏳</span>
            <p className="text-[10px] font-black uppercase tracking-[3px] text-viet-text-light">
              <Trans i18nKey="missions.reset_in" values={{ time: timeLeft }}>
                Làm mới sau: <span className="text-viet-text">{timeLeft}</span>
              </Trans>
            </p>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {[
            { id: 'daily', label: t('missions.tabs.daily'), icon: '📅' },
            { id: 'achievement', label: t('missions.tabs.achievement'), icon: '🏆' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all border-2 ${
                activeTab === tab.id 
                ? 'bg-viet-text border-viet-text text-white shadow-xl translate-y-[-2px]' 
                : 'bg-white border-viet-border text-viet-text-light hover:border-viet-green/30'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Mission List */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {filteredMissions.length > 0 ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {filteredMissions.map((mission) => {
                  const progress = Math.min(100, (mission.currentCount / mission.target_count) * 100);
                  const isClaimable = mission.isCompleted && !mission.isClaimed;
                  
                  return (
                    <div 
                      key={mission.id}
                      className={`relative group bg-white border-2 rounded-[32px] p-6 transition-all ${
                        mission.isClaimed ? 'opacity-60 grayscale-[0.5]' : 'hover:border-viet-green'
                      } ${isClaimable ? 'border-viet-green ring-4 ring-viet-green/5' : 'border-viet-border'}`}
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border-2 ${
                            isClaimable ? 'bg-viet-green/10 border-viet-green text-viet-green' : 'bg-viet-bg border-viet-border'
                          }`}>
                            {mission.icon || '🎯'}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-black text-viet-text uppercase tracking-tighter italic mb-1">{mission.title}</h3>
                            <p className="text-sm font-bold text-viet-text-light leading-relaxed mb-4">{mission.description}</p>
                            
                            {/* Progress Bar */}
                            <div className="relative">
                              <div className="flex justify-between items-center mb-1.5 px-1">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isClaimable ? 'text-viet-green' : 'text-viet-text-light/50'}`}>
                                  {t('missions.card.status')}: {mission.isClaimed ? t('missions.card.claimed') : mission.isCompleted ? t('missions.card.completed') : t('missions.card.in_progress')}
                                </span>
                                <span className="text-[10px] font-black text-viet-text tracking-widest">
                                  {mission.currentCount}/{mission.target_count}
                                </span>
                              </div>
                              <div className="h-3 bg-viet-bg rounded-full border border-viet-border overflow-hidden p-0.5">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress}%` }}
                                  className={`h-full rounded-full ${
                                    mission.isCompleted ? 'bg-viet-green' : 'bg-amber-500'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <div className="px-4 py-2 bg-viet-green shadow-lg shadow-viet-green/20 rounded-xl text-center">
                            <p className="text-[9px] font-black text-white/50 uppercase tracking-widest leading-none mb-0.5">{t('missions.card.reward')}</p>
                            <p className="text-sm font-black text-white leading-none">+{mission.xp_reward} XP</p>
                          </div>

                          {isClaimable ? (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => claimReward(mission.id)}
                              disabled={claimingId === mission.id}
                              className="px-6 py-3 bg-viet-text text-white rounded-2xl font-black text-xs uppercase tracking-[2px] shadow-xl hover:bg-black transition-all"
                            >
                              {claimingId === mission.id ? t('missions.card.claiming') : t('missions.card.claim_btn')}
                            </motion.button>
                          ) : mission.isClaimed ? (
                            <div className="px-6 py-3 bg-viet-bg text-viet-text-light/30 rounded-2xl font-black text-xs uppercase tracking-[2px] border border-viet-border">
                              {t('missions.card.claimed')} ✓
                            </div>
                          ) : (
                            <div className="px-6 py-3 bg-white text-viet-text-light/40 rounded-2xl font-black text-xs uppercase tracking-[2px] border-2 border-dashed border-viet-border">
                              {t('missions.card.not_reached')}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sparkle background for claimable */}
                      {isClaimable && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[32px]">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-viet-green/5 blur-3xl animate-pulse" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="bg-white border-2 border-dashed border-viet-border rounded-[32px] p-20 text-center">
                <span className="text-4xl mb-4 block">💤</span>
                <p className="text-viet-text-light font-bold">{t('missions.empty')}</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Decoration */}
        <div className="mt-20 text-center">
          <p className="text-[10px] font-black text-viet-text-light/30 uppercase tracking-[10px]">AURUM CORE v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Missions;
