import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Avatar from '@/components/common/Avatar';

const ChemistrySpark = ({ delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 0.6, 0], 
      scale: [0.5, 1, 0.5],
      y: [-20, -100],
      x: [0, Math.random() * 40 - 20]
    }}
    transition={{ duration: 4, repeat: Infinity, delay, ease: "linear" }}
    className="absolute text-viet-green/30 pointer-events-none"
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" strokeWidth="2" />
      <path d="M12 8v4l3 2" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </motion.div>
);

const FloatingIsland = ({ rank, user, delay }) => {
  const { t } = useTranslation();
  const isFirst = rank === 1;
  const isSecond = rank === 2;
  const isThird = rank === 3;

  const yOffset = isFirst ? -80 : isSecond ? -30 : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      whileInView={{ opacity: 1, y: yOffset, scale: 1 }}
      transition={{ duration: 1, delay, type: 'spring', bounce: 0.4 }}
      className="flex flex-col items-center relative"
    >
      {/* Platform Aura / Glow */}
      {isFirst && (
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-10 w-48 h-48 bg-amber-400/20 blur-[60px] rounded-full z-0" 
        />
      )}

      {/* Avatar Section */}
      <div className="relative mb-6 z-10">
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
          className={`w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-white shadow-2xl border-4 ${isFirst ? 'border-amber-400 shadow-amber-200/50' : 'border-white shadow-slate-200/50'} overflow-hidden relative p-1`}
        >
          <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center p-2">
            <Avatar seed={user?.avatarSeed || user?.username} size={110} className="w-full h-full object-cover scale-110 translate-y-1" />
          </div>
        </motion.div>
        
        {/* Badge / Rank Crown */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
          {isFirst ? (
             <motion.div
               animate={{ rotate: [0, 5, -5, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="text-5xl filter drop-shadow-lg"
             >
               👑
             </motion.div>
          ) : (
             <div className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-viet-border">
                <span className={`text-[16px] font-black ${isSecond ? 'text-slate-400' : 'text-amber-700'}`}>{rank}</span>
             </div>
          )}
        </div>
        
        {/* XP Tooltip-style Badge */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-30 bg-[#1a1a1a] text-white px-4 py-1.5 rounded-full text-[13px] font-black shadow-xl whitespace-nowrap border-2 border-white">
          {user?.xp || 0} XP
        </div>
      </div>

      {/* Detailed SVG Island */}
      <div className="relative w-44 h-28 mb-6 mt-4">
        <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
          {/* Main Island Body */}
          <path 
             d="M20,40 Q100,0 180,40 L160,100 Q100,120 40,100 Z" 
             fill="#5d4037" 
          />
          {/* Grass Layer */}
          <path 
             d="M20,40 Q100,0 180,40 L170,50 Q100,15 30,50 Z" 
             fill="#76c034" 
          />
          {/* Detail Cracks / Roots */}
          <path d="M60,105 l-5,10 M140,105 l5,10 M100,110 v10" stroke="#3e2723" strokeWidth="3" strokeLinecap="round" />
          <text 
            x="100" y="85" textAnchor="middle" 
            fill="white" fillOpacity="0.2" 
            fontSize="45" fontWeight="900" 
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {rank}
          </text>
        </svg>
      </div>

      <div className="text-center z-10">
        <h4 className="text-[18px] font-black text-viet-text">{user?.username || '---'}</h4>
        <div className="flex items-center justify-center gap-2 mt-1">
           <div className="flex items-center justify-center gap-1.5 bg-viet-green/10 px-3 py-1 rounded-full">
              <span className="text-[10px] font-black text-viet-green uppercase">{t('home.leaderboard.rank_master')}</span>
              <span className="text-[12px] font-black text-viet-green">{user?.level || 1}</span>
           </div>
           {/* Online Status Dot */}
           <div className={`w-2 h-2 rounded-full ${user?.isOnline || (user?.lastActiveAt && new Date(user.lastActiveAt) > new Date(Date.now() - 5*60*1000)) ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} title={user?.isOnline ? t('home.leaderboard.online') : t('home.leaderboard.offline')}></div>
        </div>
        {user?.activeMinutes > 0 && (
          <p className="text-[9px] font-bold text-viet-text-light/40 uppercase tracking-widest mt-2">
            ⏱️ {Math.floor(user.activeMinutes / 60)}h {user.activeMinutes % 60}m {t('home.leaderboard.active')}
          </p>
        )}
      </div>
    </motion.div>
  );
};

const LeaderboardSection = () => {
  const { t } = useTranslation();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await fetch('/api/user/leaderboard');
        const data = await res.json();
        if (Array.isArray(data)) setLeaders(data);
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  const topThree = [
    leaders.length > 1 ? leaders[1] : null, // 2nd
    leaders.length > 0 ? leaders[0] : null, // 1st
    leaders.length > 2 ? leaders[2] : null  // 3rd
  ];

  const others = leaders.slice(3, 5); // Only show Rank 4 & 5 to keep Top 5 total

  return (
    <section className="relative pt-48 pb-32 bg-viet-bg overflow-hidden">
      {/* Dynamic Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Sparks */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute" style={{ left: `${15 + i * 15}%`, top: `${70 + (i % 3) * 10}%` }}>
            <ChemistrySpark delay={i * 0.7} />
          </div>
        ))}
        
        {/* Large Decorative Cloud - Transparent Background per user request */}
        <motion.div 
          animate={{ x: [100, -100], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -right-40 w-[800px] h-[400px] bg-viet-green/10 rounded-full blur-[150px]" 
        />
      </div>

      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 border border-viet-green text-viet-green rounded-full text-[11px] font-black uppercase tracking-[3px] mb-6 shadow-sm"
          >
            <span className="text-lg">⚔️</span> {t('home.leaderboard.badge')}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-viet-text leading-tight"
          >
            {t('home.leaderboard.title_main')} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-viet-green to-blue-500">{t('home.leaderboard.title_highlight')}</span>
          </motion.h2>
        </div>

        {/* Top 3 Podium (The Islands) */}
        <div className="flex items-end justify-center gap-3 sm:gap-6 md:gap-14 pt-40 mb-32 w-full overflow-visible pb-8 px-4">
          <div className="shrink-0 scale-75 sm:scale-90 md:scale-100 origin-bottom">
            <FloatingIsland rank={2} user={topThree[0]} delay={0.2} />
          </div>
          <div className="shrink-0 scale-90 sm:scale-105 md:scale-110 origin-bottom z-20">
            <FloatingIsland rank={1} user={topThree[1]} delay={0.1} />
          </div>
          <div className="shrink-0 scale-75 sm:scale-90 md:scale-100 origin-bottom">
            <FloatingIsland rank={3} user={topThree[2]} delay={0.3} />
          </div>
        </div>

        {/* Ranking List (Premium Cards) */}
        <div className="max-w-[800px] mx-auto grid grid-cols-1 gap-4">
          <AnimatePresence>
            {others.map((u, idx) => {
              const rank = idx + 4;
              const isOnline = u.isOnline || (u.lastActiveAt && new Date(u.lastActiveAt) > new Date(Date.now() - 5*60*1000));
              const xpProgress = Math.min((u.xp % 1000) / 10, 100);
              
              return (
                <motion.div
                  key={u.username}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="flex items-center gap-6 p-5 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] shadow-sm hover:shadow-xl hover:bg-white/70 transition-all duration-300"
                >
                  <div className="w-12 h-12 flex items-center justify-center text-[24px] font-black text-viet-text/20 hover:text-viet-green transition-colors">
                    {rank}
                  </div>
                  
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-inner overflow-hidden flex-shrink-0 border-2 border-white flex items-center justify-center p-1">
                    <Avatar seed={u.avatarSeed || u.username} size={50} className="w-full h-full object-cover scale-125 translate-y-1" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="text-[17px] font-black text-viet-text">{u.username}</h5>
                      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} title={isOnline ? t('home.leaderboard.online') : t('home.leaderboard.offline')} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-viet-text-light/50 uppercase tracking-widest">
                        {t('home.leaderboard.level')} {u.level} • {u.activeMinutes > 0 ? `${t('home.leaderboard.activity')} ${Math.floor(u.activeMinutes / 60)}h ${u.activeMinutes % 60}m` : t('home.leaderboard.disciple')}
                      </span>
                      <div className="text-right">
                        <span className="text-[18px] font-black text-viet-text">{u.xp}</span>
                        <span className="text-[10px] font-black text-viet-green ml-1">XP</span>
                      </div>
                    </div>
                    
                    <div className="w-full h-2 bg-viet-text/5 rounded-full overflow-hidden mt-3">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${xpProgress}%` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-viet-green to-emerald-400"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {loading && (
            <div className="flex flex-col items-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin"></div>
              <p className="font-bold text-viet-text-light/60 uppercase tracking-widest text-[12px]">{t('home.leaderboard.transmitting')}</p>
            </div>
          )}

          {!loading && leaders.length === 0 && (
            <div className="text-center py-20 bg-white/30 backdrop-blur-sm rounded-[40px] border-2 border-dashed border-viet-border">
               <p className="text-viet-text-light/50 italic">{t('home.leaderboard.empty')}</p>
            </div>
          )}
        </div>

        <div className="mt-20 text-center">
          <Link to="/arena" className="group inline-flex items-center gap-4 px-10 py-5 bg-viet-text text-white rounded-full font-black text-[15px] hover:bg-viet-green transition-all shadow-xl hover:-translate-y-1">
            {t('home.leaderboard.conquer_btn')}
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-viet-green transition-all">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection;
