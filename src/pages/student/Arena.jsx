import React, { useState, useEffect, useMemo, useRef } from 'react';
import multiavatar from '@multiavatar/multiavatar/esm';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTranslation, Trans } from 'react-i18next';

// ─── AVATAR DATA ──────────────────────────────────────────────────────────────
// Preset avatar seeds for quick selection
const getAvatarPresets = (t) => [
  { id: 1, seed: 'Chem Master',   label: t('arena.character.presets.chem_master') },
  { id: 2, seed: 'Lab Wizard',    label: t('arena.character.presets.lab_wizard') },
  { id: 3, seed: 'Science Hero',  label: t('arena.character.presets.science_hero') },
  { id: 4, seed: 'Atom Breaker',  label: t('arena.character.presets.atom_breaker') },
  { id: 5, seed: 'DNA Explorer',  label: t('arena.character.presets.dna_explorer') },
  { id: 6, seed: 'Ion Storm',     label: t('arena.character.presets.ion_storm') },
  { id: 7, seed: 'Thermo King',   label: t('arena.character.presets.thermo_king') },
  { id: 8, seed: 'Crystal Lord',  label: t('arena.character.presets.crystal_lord') },
  { id: 9, seed: 'Proton Rush',   label: t('arena.character.presets.proton_rush') },
  { id: 10, seed: 'Quark Force',  label: t('arena.character.presets.quark_force') },
  { id: 11, seed: 'Neutron Star', label: t('arena.character.presets.neutron_star') },
  { id: 12, seed: 'Plasma Wave',  label: t('arena.character.presets.plasma_wave') },
];

// Helper: generate multiavatar SVG and return as data URL
const getSvgDataUrl = (seed) => {
  const svgCode = multiavatar(seed || 'default');
  const encoded = btoa(unescape(encodeURIComponent(svgCode)));
  return `data:image/svg+xml;base64,${encoded}`;
};

const AURA_COLORS = [
  '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b',
  '#ec4899', '#3b82f6', '#eab308', '#ef4444',
];

const MODERN_STYLES = {
  glass: "bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)]",
  card: "bg-white border border-black/[0.03] shadow-[0_4px_20px_rgba(0,0,0,0.02)]",
  button: "transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
  radius: "rounded-3xl",
};

const MODERN_COLORS = {
  bg: 'oklch(0.99 0.005 100)',
  card: 'rgba(255, 255, 255, 0.8)',
  border: 'rgba(255, 255, 255, 0.4)',
  accent: '#76c034',
  text: '#1a1a1a',
  textLight: '#666666',
};

const getRank = (t, pts = 0) => {
  const RANKS = [
    { name: t('arena.ranks.bronze'), min: 0,    color: '#cd7f32', glow: 'shadow-[0_0_20px_#cd7f3260]', icon: '🥉' },
    { name: t('arena.ranks.silver'), min: 500,  color: '#c0c0c0', glow: 'shadow-[0_0_20px_#c0c0c060]', icon: '🥈' },
    { name: t('arena.ranks.gold'),   min: 1500, color: '#ffd700', glow: 'shadow-[0_0_20px_#ffd70060]', icon: '🥇' },
    { name: t('arena.ranks.diamond'),min: 3000, color: '#00e5ff', glow: 'shadow-[0_0_20px_#00e5ff60]', icon: '💎' },
    { name: t('arena.ranks.master'), min: 6000, color: '#a855f7', glow: 'shadow-[0_0_20px_#a855f760]', icon: '👑' },
  ];
  return [...RANKS].reverse().find(r => pts >= r.min) || RANKS[0];
};

// ─── FLOATING PARTICLES ───────────────────────────────────────────────────────
const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 25 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: Math.random() * 3 + 1,
          height: Math.random() * 3 + 1,
          background: AURA_COLORS[i % AURA_COLORS.length],
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: 0.1,
        }}
        animate={{ 
          y: [0, -30, 0], 
          x: [0, Math.random() * 20 - 10, 0],
          opacity: [0.05, 0.15, 0.05] 
        }}
        transition={{ 
          duration: 5 + Math.random() * 5, 
          repeat: Infinity, 
          ease: "linear",
          delay: Math.random() * 5 
        }}
      />
    ))}
  </div>
);

// ─── CHARACTER PANEL ──────────────────────────────────────────────────────────
const CharacterPanel = ({ user, selectedAvatar, setSelectedAvatar, avatarSeed, setAvatarSeed }) => {
  const { t } = useTranslation();
  const AVATAR_PRESETS = getAvatarPresets(t);
  const displayName = user?.username || user?.full_name || t('common.guest', { defaultValue: 'Khách' });
  const [customInput, setCustomInput] = useState('');
  const [showMore, setShowMore] = useState(false);

  const currentSeed = avatarSeed || displayName;
  const currentAvatarUrl = useMemo(() => getSvgDataUrl(currentSeed), [currentSeed]);
  const visiblePresets = showMore ? AVATAR_PRESETS : AVATAR_PRESETS.slice(0, 8);

  const applyCustomSeed = () => {
    const trimmed = customInput.trim();
    if (trimmed) setAvatarSeed(trimmed);
  };

  return (
    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="flex flex-col gap-6">
      <div className={`${MODERN_STYLES.glass} ${MODERN_STYLES.radius} p-8 group transition-all duration-500`}>
        <div className="flex items-center justify-between mb-8">
           <span className="text-[10px] font-bold uppercase tracking-[2px] text-viet-text/40">{t('arena.character.badge')}</span>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full animate-pulse bg-viet-green" />
             <span className="text-[10px] font-bold text-viet-text/20 uppercase tracking-widest">LIVE</span>
           </div>
        </div>

        <div className="flex flex-col items-center mb-6">
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            className="w-40 h-40 rounded-3xl mb-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative overflow-hidden flex items-center justify-center bg-white p-4 border border-black/[0.03]"
          >
            <div className="absolute inset-0 opacity-5 bg-viet-green" />
            <img src={currentAvatarUrl} alt={currentSeed} className="w-full h-full object-contain relative z-10" />
          </motion.div>
          <h3 className="text-2xl font-black text-viet-text tracking-tight">{displayName}</h3>
          <p className="text-[12px] font-medium text-viet-text/40 uppercase tracking-widest mt-1">CHEMISTRY EXPLORER</p>
        </div>

        <div className="pt-6 border-t border-black/[0.03]">
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-viet-text/30">{t('arena.character.presets_label') || 'PHONG CÁCH'}</p>
            <button onClick={() => setShowMore(!showMore)} className="text-[10px] font-bold text-viet-green/60 hover:text-viet-green transition-all">
              {showMore ? t('common.less', { defaultValue: 'THU GỌN' }) : t('common.more', { defaultValue: 'XEM THÊM' })}
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {visiblePresets.map((av) => (
              <motion.button 
                key={av.id} 
                whileHover={{ scale: 1.1, y: -2 }} 
                whileTap={{ scale: 0.9 }} 
                onClick={() => setAvatarSeed(av.seed)} 
                className={`aspect-square rounded-2xl overflow-hidden p-1.5 transition-all border-2 ${avatarSeed === av.seed ? 'border-viet-green bg-viet-green/5' : 'border-transparent bg-black/[0.02] hover:bg-black/[0.04]'}`}
              >
                <img src={getSvgDataUrl(av.seed)} alt={av.label} className="w-full h-full object-contain" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      
      <motion.button 
        whileHover={{ scale: 1.02, backgroundColor: '#1a1a1a', color: '#fff' }} 
        whileTap={{ scale: 0.98 }} 
        onClick={() => { 
          const randomPreset = AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)]; 
          setAvatarSeed(randomPreset.seed); 
          setSelectedAvatar(0); 
        }} 
        className={`w-full py-5 ${MODERN_STYLES.radius} bg-white border border-black/[0.05] text-[11px] font-black uppercase tracking-widest text-viet-text shadow-sm transition-all flex items-center justify-center gap-3`}
      >
        <span>🎲</span> {t('arena.character.random_btn')}
      </motion.button>
    </motion.div>
  );
};


// ─── HELPERS ──────────────────────────────────────────────────────────────────
const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Lỗi server');
  return data;
};

const timeAgo = (t, iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return t('arena.stats.history_item.just_now');
  if (m < 60) return t('arena.stats.history_item.minutes_ago', { count: m });
  const h = Math.floor(m / 60);
  if (h < 24) return t('arena.stats.history_item.hours_ago', { count: h });
  return t('arena.stats.history_item.days_ago', { count: Math.floor(h / 24) });
};

// ─── STATS PANEL ─────────────────────────────────────────────────────────────
const StatsPanel = ({ user }) => {
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState([]);
  const [battles, setBattles] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [loading, setLoading] = useState(true);

  const stats = user?.arenaStats || { total: 0, wins: 0, losses: 0, points: 0 };
  const rank = getRank(t, stats.points);
  const winRate = stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    const fetchData = async () => {
      setLoading(true);
      try {
        const lbData = await apiCall('/api/arena/leaderboard');
        setLeaderboard(lbData.leaderboard || []);
        const token = localStorage.getItem('token');
        if (token) {
          const battleData = await apiCall('/api/arena/my-battles');
          setBattles(battleData.battles || []);
        }
      } catch (e) { console.warn('LB error:', e.message); } finally { setLoading(false); }
    };
    fetchData();
  }, [user?.id]);

  const rows = [
    { label: t('arena.stats.total_matches'), value: stats.total, color: 'text-viet-text' },
    { label: t('arena.stats.wins'),         value: stats.wins,  color: 'text-emerald-600' },
    { label: t('arena.stats.losses'),       value: stats.losses, color: 'text-red-500' },
    { label: t('arena.stats.win_rate'),     value: `${winRate}%`, color: 'text-blue-600' },
    { label: t('arena.stats.total_points'), value: stats.points, color: 'text-amber-500' },
  ];

  const RANK_COLORS = ['text-amber-500', 'text-slate-400', 'text-orange-600'];

  return (
    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col gap-6">
      <div className={`${MODERN_STYLES.glass} ${MODERN_STYLES.radius} p-8`}>
        <div className="flex items-center justify-between mb-8">
           <span className="text-[10px] font-bold uppercase tracking-[2px] text-viet-text/40">{t('arena.stats.badge')}</span>
           <span className="text-lg opacity-40">📊</span>
        </div>

        <div className="space-y-5 mb-10 px-1">
          {rows.map(({ label, value, color }) => (
            <div key={label} className="flex justify-between items-center group/stat">
              <span className="text-viet-text/40 text-[12px] font-bold group-hover/stat:text-viet-text/60 transition-colors">{label}</span>
              <span className={`font-black text-[13px] tracking-tight ${color}`}>{value}</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-5 flex items-center gap-5 transition-all bg-black/[0.02] border border-black/[0.03] group hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-500">
          <span className="text-4xl drop-shadow-xl group-hover:scale-110 transition-transform duration-500">{rank.icon}</span>
          <div>
            <p className="font-black text-lg text-viet-text leading-tight mb-1">{rank.name}</p>
            <p className="text-viet-text/30 text-[9px] font-black uppercase tracking-widest">{t('arena.stats.rank_label')}</p>
          </div>
        </div>
      </div>

      <motion.button 
        whileHover={{ x: 4, backgroundColor: '#1a1a1a', color: '#fff' }} 
        whileTap={{ scale: 0.98 }} 
        onClick={() => setShowLeaderboard(v => !v)} 
        className={`w-full py-5 ${MODERN_STYLES.radius} bg-white border border-black/[0.05] text-[11px] font-black uppercase tracking-widest text-viet-text shadow-sm transition-all flex items-center justify-between px-8`}
      >
        <span>🏆 {t('arena.stats.leaderboard_btn')}</span>
        <span className="text-[14px] opacity-40">{showLeaderboard ? '−' : '+'}</span>
      </motion.button>

      <AnimatePresence>
        {showLeaderboard && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            className={`${MODERN_STYLES.glass} rounded-3xl overflow-hidden shadow-2xl`}
          >
            <div className="p-7">
              <p className="text-[10px] font-black uppercase tracking-[3px] text-viet-green mb-6">🥇 {t('arena.stats.leaderboard_title')}</p>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-viet-green border-t-transparent rounded-full animate-spin" />
                </div>
              ) : leaderboard.length === 0 ? (
                <p className="text-viet-text/30 text-[11px] text-center py-8 italic">{t('arena.stats.empty_leaderboard')}</p>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((p, i) => (
                    <div key={i} className="flex items-center gap-4 py-3 px-3 rounded-2xl hover:bg-white transition-all shadow-sm shadow-transparent hover:shadow-black/5">
                      <span className={`w-5 text-center font-black text-[12px] ${RANK_COLORS[i] || 'text-viet-text/20'}`}>{i + 1}</span>
                      <div className="w-10 h-10 rounded-xl flex-shrink-0 bg-white shadow-sm border border-black/[0.03] p-1.5">
                        <img src={getSvgDataUrl(p.avatarSeed)} alt={p.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-viet-text font-black text-[13px] truncate">{p.name}</p>
                        <p className="text-viet-text/30 text-[10px] font-bold uppercase tracking-tighter">{p.wins} {t('arena.stats.wins')}</p>
                      </div>
                      <span className="font-black text-[13px] text-amber-500">{p.points}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`${MODERN_STYLES.glass} ${MODERN_STYLES.radius} p-8`}>
        <p className="text-[10px] font-black uppercase tracking-[2px] text-viet-green mb-6">⚡ {t('arena.stats.history')}</p>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="w-5 h-5 border-2 border-viet-green border-t-transparent rounded-full animate-spin" />
          </div>
        ) : battles.length === 0 ? (
          <p className="text-viet-text/30 text-[11px] text-center py-8 italic">{t('arena.stats.empty_history')}</p>
        ) : (
          <div className="space-y-4">
            {battles.map((b, i) => (
              <div key={i} className="flex items-center gap-4 group/history cursor-pointer">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[12px] border transition-all ${b.result === 'win' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : b.result === 'lose' ? 'bg-red-50 border-red-100 text-red-500' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                  {b.result === 'win' ? 'W' : b.result === 'lose' ? 'L' : 'D'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-viet-text font-bold text-[13px] truncate group-hover/history:text-viet-green transition-colors">{b.opponent_name}</p>
                  <p className="text-viet-text/20 text-[10px] font-black uppercase tracking-tighter">{timeAgo(t, b.played_at)}</p>
                </div>
                <span className={`font-black text-[13px] ${b.pts_change > 0 ? 'text-emerald-600' : b.pts_change < 0 ? 'text-red-500' : 'text-viet-text/20'}`}>
                  {b.pts_change > 0 ? '+' : ''}{b.pts_change}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};


// ─── CENTER ACTION PANEL ───────────────────────────────────────────────────────
const ActionCenter = ({ onFindMatch, isSearching, onCreateRoom, onJoinRoom, onOpenBrowser, selectedAvatar }) => {
  const { t } = useTranslation();
  const [joinCode, setJoinCode] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [findMode, setFindMode] = useState('solo');
  const [onlineCount, setOnlineCount] = useState(1248);

  useEffect(() => {
    const fetchOnlineCount = async () => {
      try {
        const res = await fetch('/api/user/online-count');
        const data = await res.json();
        if (data.count) setOnlineCount(data.count);
      } catch (err) {
        console.error('Failed to fetch online count:', err);
      }
    };
    
    fetchOnlineCount();
    const interval = setInterval(fetchOnlineCount, 30000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col items-center gap-10 py-4">
      <div className="relative group">
        <motion.div 
          animate={{ y: [0, -8, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className={`w-52 h-52 ${MODERN_STYLES.radius} flex items-center justify-center text-[84px] relative z-10 bg-white border border-black/[0.03] shadow-[0_40px_100px_rgba(0,0,0,0.06)] transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_50px_120px_rgba(0,0,0,0.08)]`}
        >
          <div className="absolute inset-6 rounded-[32px] opacity-10 animate-pulse bg-viet-green" />
          <span className="relative z-10 drop-shadow-2xl grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500">⚔️</span>
          
          {/* Decorative glass elements */}
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 flex items-center justify-center text-lg shadow-sm">✨</div>
          <div className="absolute -bottom-2 -left-6 w-10 h-10 bg-white/40 backdrop-blur-md rounded-xl border border-white/60 flex items-center justify-center text-sm shadow-sm">⚗️</div>
        </motion.div>
        
        {/* Modern decorative rings */}
        <div className="absolute -inset-8 border border-black/[0.015] rounded-full pointer-events-none animate-[spin_40s_linear_infinite]" />
        <div className="absolute -inset-16 border border-dashed border-black/[0.01] rounded-full pointer-events-none animate-[spin_60s_linear_infinite_reverse]" />
        <div className="absolute inset-0 blur-[120px] opacity-[0.05] pointer-events-none bg-viet-green" />
      </div>

      <div className="text-center space-y-4">
        {/* Room Metadata Labels */}
        <div className="flex items-center justify-center gap-10 mb-1 opacity-20 pointer-events-none">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[4px]">
            <span>⚙️</span> {t('arena_modes.all', { defaultValue: 'TỔNG HỢP' })}
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[4px]">
            <span>📄</span> {t('arena_modes.questions', { defaultValue: '10 CÂU' })}
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[4px]">
            <span>⏱️</span> {t('arena_modes.time', { defaultValue: '30 GIÂY' })}
          </div>
        </div>

        <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-4 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
           <div className="flex items-center gap-3">
             <span className="w-2.5 h-2.5 rounded-full bg-viet-green animate-pulse shadow-[0_0_10px_rgba(118,192,52,0.4)]" />
             <span className="text-[13px] font-bold text-viet-text/50">
               {onlineCount.toLocaleString('vi-VN')} {t('arena.online_students', { defaultValue: 'học sinh đang trực tuyến' })}
             </span>
           </div>
           <div className="w-[1px] h-4 bg-black/[0.08]" />
           <span className="text-[11px] font-black text-viet-text/30 uppercase tracking-[2px]">
             {findMode === 'solo' ? '1 VS 1' : findMode} MODE
           </span>
        </div>
        <h2 className="text-6xl font-black text-viet-text tracking-tighter leading-tight">
          <Trans i18nKey="arena.title">
            ARENA <span className="text-viet-green font-outline-2">ODYSSEY</span>
          </Trans>
        </h2>
        <p className="text-viet-text/40 text-[11px] font-bold tracking-[8px] uppercase px-4 max-w-[400px] mx-auto">{t('arena.subtitle')}</p>
      </div>

      <div className="w-full max-w-[520px] space-y-5 mt-4">
        <div className="flex flex-col md:flex-row items-stretch gap-4">
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }} 
            whileTap={{ scale: 0.98 }} 
            onClick={() => onFindMatch(findMode)} 
            className={`flex-[2.5] py-5.5 rounded-2xl font-black text-white text-[15px] uppercase tracking-[3px] flex items-center justify-center gap-4 transition-all shadow-2xl ${isSearching ? 'bg-red-500 shadow-red-500/20' : 'bg-viet-green shadow-emerald-500/20 hover:brightness-105'}`}
          >
            {isSearching ? <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="text-xl">⟳</motion.span> {t('arena.actions.cancel_find')}</> : <><span className="text-xl">⚡</span> {t('arena.actions.find_match')}</>}
          </motion.button>
          
          <div className="flex-1 relative group">
            <select 
              value={findMode} 
              onChange={(e) => setFindMode(e.target.value)} 
              disabled={isSearching} 
              className="w-full h-full py-5.5 px-6 rounded-2xl font-black text-viet-text text-[11px] uppercase tracking-widest outline-none border border-black/[0.05] bg-white hover:bg-black hover:text-white transition-all appearance-none cursor-pointer disabled:opacity-50 text-center shadow-sm"
            >
              <option value="solo">{t('arena_modes.solo_short')}</option>
              <option value="3vs3">{t('arena_modes.3vs3_short')}</option>
              <option value="5vs5">{t('arena_modes.5vs5_short')}</option>
              <option value="1vs100">{t('arena_modes.br_short')}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button 
            whileHover={{ y: -3, backgroundColor: '#f9f9f9' }} 
            whileTap={{ scale: 0.98 }} 
            onClick={onCreateRoom} 
            className="py-5 rounded-2xl font-bold text-viet-text text-[13px] uppercase tracking-widest flex items-center justify-center gap-3 bg-white border border-black/[0.05] shadow-sm transition-all"
          >
            <span className="text-xl">🏟️</span> {t('arena.actions.create_room')}
          </motion.button>

          <AnimatePresence mode="wait">
            {!showJoinInput ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <motion.button 
                  whileHover={{ y: -3, backgroundColor: '#f9f9f9' }} 
                  whileTap={{ scale: 0.98 }} 
                  onClick={() => setShowJoinInput(true)} 
                  className="flex-1 py-5 rounded-2xl font-bold text-viet-text text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 bg-white border border-black/[0.05] shadow-sm transition-all"
                >
                  <span>🚪</span> {t('arena.actions.join_pin')}
                </motion.button>
                <motion.button 
                  whileHover={{ y: -3, scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  onClick={onOpenBrowser} 
                  className="flex-1 py-5 rounded-2xl font-bold text-white text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 bg-blue-600 shadow-blue-500/20 hover:brightness-110 transition-all"
                >
                  <span>🌐</span> {t('arena.actions.lobby')}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }} 
                className={`col-span-full space-y-4 p-8 bg-white border border-black/[0.05] ${MODERN_STYLES.radius} shadow-[0_32px_64px_rgba(0,0,0,0.1)]`}
              >
                <input 
                  type="text" 
                  value={joinCode} 
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())} 
                  placeholder={t('arena.actions.pin_placeholder')} 
                  autoFocus 
                  className="w-full py-5 px-6 rounded-2xl font-black text-viet-text text-center text-3xl placeholder-viet-text/10 outline-none border-b-2 border-transparent focus:border-viet-green transition-all bg-black/[0.02]" 
                  style={{ letterSpacing: '0.4em' }} 
                  onKeyDown={(e) => { if (e.key === 'Enter' && joinCode.trim()) onJoinRoom(joinCode.trim()); }} 
                />
                <div className="flex gap-4">
                  <button onClick={() => setShowJoinInput(false)} className="flex-1 py-4.5 rounded-xl font-black text-viet-text/30 text-[11px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all">{t('arena.actions.close')}</button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.97 }} 
                    onClick={() => joinCode.trim() && onJoinRoom(joinCode.trim())} 
                    disabled={!joinCode.trim()} 
                    className="flex-[2] py-4.5 rounded-xl font-black text-white text-[12px] uppercase tracking-widest disabled:opacity-40 transition-all bg-viet-text shadow-xl shadow-black/10"
                  >
                    {t('arena.actions.enter')}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 mt-8">
        <div className="flex items-center gap-8 text-viet-text/20 text-[9px] font-black uppercase tracking-[4px]">
          <span>⊙ {t('arena.actions.footer_info.summary')}</span>
          <span>⊙ {t('arena.actions.footer_info.questions')}</span>
          <span>⊙ {t('arena.actions.footer_info.time')}</span>
        </div>
        <div className="flex items-center gap-5 px-8 py-4 rounded-full bg-white border border-black/[0.03] shadow-[0_8px_40px_rgba(0,0,0,0.03)] text-viet-text/40 text-[12px] font-bold">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
            <span>{t('arena.online_count', { count: onlineCount.toLocaleString() })}</span>
          </div>
          <div className="w-px h-4 bg-black/[0.05]" />
          <span className="tracking-widest">1 VS 1 MODE</span>
        </div>
      </div>
    </motion.div>
  );
};


// ─── CREATE ROOM MODAL ────────────────────────────────────────────────────────
const CreateRoomModal = ({ isOpen, onClose, user, onConfirm }) => {
  const { t } = useTranslation();
  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';
  const difficulties = [
    { id: 'easy',   label: t('arena.difficulties.easy'),   color: '#10b981' },
    { id: 'medium', label: t('arena.difficulties.medium'), color: '#f59e0b' },
    { id: 'hard',   label: t('arena.difficulties.hard'),   color: '#ef4444' },
    { id: 'super',  label: t('arena.difficulties.super'),  color: '#8b5cf6' },
  ];
  const [formData, setFormData] = useState({
    name: '',
    mode: 'solo',
    difficulty: isTeacherOrAdmin ? 'easy' : 'auto',
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/5 backdrop-blur-2xl" onClick={onClose}>
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white/90 backdrop-blur-3xl rounded-[60px] p-10 relative border border-black/[0.03] shadow-[0_40px_100px_rgba(0,0,0,0.1)]">
          <button onClick={onClose} className="absolute top-8 right-8 w-12 h-12 rounded-2xl flex items-center justify-center text-viet-text-light/20 hover:text-red-500 hover:bg-red-50 transition-all font-black text-xl">✕</button>
          
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 rounded-[32px] flex items-center justify-center text-4xl mb-6 bg-viet-green/10 text-viet-green shadow-xl shadow-emerald-500/10">🏟️</div>
            <h2 className="text-3xl font-black text-viet-text uppercase tracking-tight">
              <Trans i18nKey="arena.create_room.title">
                MỞ SẢNH <span className="text-viet-green">THI ĐẤU</span>
              </Trans>
            </h2>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[3px] text-viet-text-light/40 px-1">{t('arena.create_room.name_label')}</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                placeholder={t('arena.create_room.name_placeholder')} 
                className="w-full py-4 px-6 rounded-2xl font-bold text-viet-text placeholder-viet-text/20 outline-none border border-black/[0.05] focus:border-viet-green transition-all bg-black/[0.02] focus:bg-white" 
              />
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[3px] text-viet-text-light/40 px-1">{t('arena.create_room.mode_label')}</label>
              <select 
                value={formData.mode} 
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })} 
                className="w-full py-4 px-6 rounded-2xl font-bold text-viet-text outline-none border border-black/[0.05] focus:border-viet-green transition-all bg-black/[0.02] appearance-none cursor-pointer"
              >
                <option value="solo">{t('arena_modes.solo')}</option>
                <option value="3vs3">{t('arena_modes.3vs3')}</option>
                <option value="5vs5">{t('arena_modes.5vs5')}</option>
                <option value="1vs100">{t('arena_modes.1vs100')}</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[3px] text-viet-text-light/40 px-1">
                {t('arena.create_room.difficulty_label')}
                {isTeacherOrAdmin && <span className="ml-3 bg-viet-green/10 text-viet-green px-2 py-0.5 rounded-lg text-[9px] font-black border border-viet-green/20">{t('arena.create_room.admin_badge')}</span>}
              </label>
              {isTeacherOrAdmin ? (
                <div className="grid grid-cols-2 gap-3">
                  {difficulties.map((d) => (
                    <button 
                      key={d.id} 
                      onClick={() => setFormData({ ...formData, difficulty: d.id })} 
                      className={`py-4 rounded-2xl font-black text-[12px] transition-all border-2 ${formData.difficulty === d.id ? 'bg-white shadow-xl scale-[1.02]' : 'bg-black/[0.02] border-transparent opacity-50 hover:opacity-80'}`}
                      style={{ borderColor: formData.difficulty === d.id ? d.color : 'transparent', color: formData.difficulty === d.id ? d.color : 'inherit' }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="w-full py-4 px-6 rounded-2xl flex items-center justify-between bg-black/[0.02] border border-black/[0.03]">
                  <span className="font-bold text-viet-text-light/40 flex items-center gap-3 text-[13px]">
                    <span>🎓</span> {t('arena.create_room.auto_grade', { grade: user?.grade || '8' })}
                  </span>
                  <span className="text-viet-text-light/20">🔒</span>
                </div>
              )}
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={() => onConfirm(formData)} 
              disabled={!formData.name} 
              className="w-full py-5 rounded-[28px] font-black text-white text-base uppercase tracking-widest disabled:opacity-40 transition-all bg-viet-green shadow-xl shadow-emerald-500/20 mt-4 hover:brightness-110"
            >
              {t('arena.create_room.submit_btn')}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── ROOM BROWSER MODAL ───────────────────────────────────────────────────────
const RoomBrowserModal = ({ isOpen, onClose, onJoin }) => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/arena/rooms');
      if (data.success) setRooms(data.rooms);
    } catch (e) {
      console.error('Room browser error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchRooms();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/5 backdrop-blur-2xl" onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-white/90 backdrop-blur-3xl rounded-[60px] p-10 relative border border-black/[0.03] shadow-[0_40px_100px_rgba(0,0,0,0.1)] max-h-[85vh] flex flex-col">
          <button onClick={onClose} className="absolute top-8 right-8 w-12 h-12 rounded-2xl flex items-center justify-center text-viet-text-light/20 hover:text-red-500 hover:bg-red-50 transition-all font-black text-xl">✕</button>
          
          <div className="flex items-center justify-between mb-10 pr-12">
            <h2 className="text-3xl font-black text-viet-text uppercase tracking-tight pr-4">
              <Trans i18nKey="arena.browser.title">
                SẢNH CHỜ <span className="text-viet-green">TRỰC TUYẾN</span>
              </Trans>
            </h2>
            <button onClick={fetchRooms} className="flex-shrink-0 px-5 py-2.5 rounded-2xl bg-black text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg">⟳ {t('arena.browser.refresh')}</button>
          </div>

          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-6">
                <div className="w-12 h-12 border-4 border-viet-green border-t-transparent rounded-full animate-spin" />
                <p className="text-viet-text-light/30 font-black uppercase tracking-[4px] text-[10px]">{t('arena.browser.scanning')}</p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="text-7xl mb-6 opacity-10">🏜️</span>
                <p className="text-viet-text font-black text-xl mb-2">{t('arena.browser.empty_title')}</p>
                <p className="text-viet-text-light/40 text-[12px] font-medium max-w-[280px] mx-auto leading-relaxed">{t('arena.browser.empty_desc')}</p>
              </div>
            ) : (
              rooms.map((room) => (
                <div key={room.id} className="bg-white border border-black/[0.03] rounded-[32px] p-6 flex items-center gap-6 hover:shadow-xl hover:border-viet-green/20 transition-all group">
                  <div className="w-20 h-20 rounded-3xl bg-black/[0.02] overflow-hidden flex-shrink-0 relative group-hover:scale-105 transition-all">
                    <img src={getSvgDataUrl(room.host_avatar?.seed || 'host')} className="w-full h-full object-contain p-2" alt="host" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-viet-text font-black text-lg truncate leading-tight">{room.name}</h3>
                      <span className="px-2.5 py-1 rounded-xl bg-black/[0.03] text-[9px] font-black text-viet-text-light/40 uppercase tracking-widest">#{room.id}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-5 text-[10px] font-bold text-viet-text-light/30 uppercase tracking-widest">
                      <span className="flex items-center gap-2">👤 {room.host_name}</span>
                      <span className="flex items-center gap-2">🎮 {room.mode}</span>
                      <span className="flex items-center gap-2">🎯 {room.difficulty}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-[14px] font-black text-viet-text">
                      <span className="text-viet-green">{room.current_players}</span><span className="text-black/10 mx-0.5">/</span>{room.max_players}
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }} 
                      onClick={() => onJoin(room.id)} 
                      disabled={room.current_players >= room.max_players} 
                      className="px-8 py-3 rounded-2xl font-black text-white text-[11px] uppercase tracking-widest bg-viet-text hover:bg-viet-green transition-all disabled:opacity-20 shadow-lg shadow-black/10"
                    >
                      {t('arena.browser.enter_btn')}
                    </motion.button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


// ─── PLAYER ROOM ──────────────────────────────────────────────────────────────
const PlayerRoom = ({ user, room, onLeave, onMatchEnd }) => {
  const { t, i18n } = useTranslation();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answered, setAnswered] = useState(null);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loadingQ, setLoadingQ] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const [currentPlayers, setCurrentPlayers] = useState(room.current_players || 1);
  const correctCountRef = useRef(0);

  useEffect(() => {
    if (!isWaiting) return;
    const modeMap = { solo: 2, '3vs3': 6, '5vs5': 10, '1vs100': 100 };
    const expectedMax = room.max_players || modeMap[room.mode] || 2;
    const interval = setInterval(async () => {
      try {
        const data = await apiCall(`/api/arena/room/${room.id}`);
        if (data.success && data.room) {
          setCurrentPlayers(data.room.current_players);
          if (data.room.current_players >= expectedMax) setIsWaiting(false);
        }
      } catch (err) {}
    }, 3000);
    return () => clearInterval(interval);
  }, [isWaiting, room.id, room.mode, room.max_players]);

  useEffect(() => {
    const fetchQ = async () => {
      setLoadingQ(true);
      try {
        const data = await apiCall(`/api/arena/questions/${room.difficulty || 'easy'}`);
        if (data.success && data.questions.length > 0) setQuestions(data.questions);
      } catch (e) {} finally { setLoadingQ(false); }
    };
    fetchQ();
  }, [room.difficulty]);

  useEffect(() => {
    if (isWaiting || answered !== null || gameOver || questions.length === 0 || loadingQ) return;
    const timer = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { clearInterval(timer); handleAnswer(-1); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isWaiting, currentQIndex, answered, gameOver, questions.length, loadingQ]);

  const currentQ = questions[currentQIndex];

  const handleAnswer = (i) => {
    if (answered !== null || !currentQ) return;
    setAnswered(i);
    const isCorrect = i === currentQ.correct;
    if (isCorrect) {
      correctCountRef.current += 1;
      setScore(s => s + Math.max(100, timeLeft * 10));
    }
    setTimeout(() => {
      const nextIdx = currentQIndex + 1;
      if (nextIdx < questions.length) {
        setCurrentQIndex(nextIdx);
        setTimeLeft(30);
        setAnswered(null);
      } else {
        const result = correctCountRef.current >= Math.ceil(questions.length / 2) ? 'win' : 'lose';
        setGameOver(true);
        onMatchEnd?.({ result, score: score + (isCorrect ? Math.max(100, timeLeft * 10) : 0), room_id: room.id });
      }
    }, 1500);
  };

  const timerPct = (timeLeft / 30) * 100;

  if (loadingQ) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center p-8">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} 
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-6"
        />
        <p className="text-blue-400 font-black uppercase tracking-[4px] text-[12px] animate-pulse">{t('arena.room.loading')}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center p-8 text-center text-white">
        <span className="text-8xl mb-8 filter drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">🏜️</span>
        <h2 className="text-2xl font-black mb-4 uppercase tracking-[5px]">TRẬN ĐẤU KHÔNG SẴN SÀNG</h2>
        <button onClick={onLeave} className="px-12 py-5 rounded-full font-black bg-blue-600 hover:bg-blue-500 transition-all uppercase text-[12px] tracking-widest shadow-2xl">{t('arena.room.back_btn')}</button>
      </div>
    );
  }

  if (isWaiting) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center p-8 relative font-inter overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
        <Particles />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[50px] p-12 relative z-10 text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-600/30 blur-[80px] rounded-full pointer-events-none" />
          
          <h2 className="text-3xl font-black text-white uppercase tracking-[8px] mb-8 font-sora">{t('arena.room.waiting.title')}</h2>
          <div className="text-[6.5rem] font-black text-blue-400 tracking-[20px] py-10 rounded-[40px] bg-black/40 border border-white/5 mb-10 leading-none shadow-inner select-all">
            {room.id}
          </div>
          
          <div className="flex justify-center items-center gap-10 mb-12">
            <div className="text-center">
              <p className="text-[10px] font-black text-blue-400/40 uppercase tracking-widest mb-2 font-sora">PHÂN LOẠI</p>
              <p className="text-white font-black uppercase text-[13px] tracking-[2px]">{room.mode || '1 VS 1'}</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className="text-[10px] font-black text-blue-400/40 uppercase tracking-widest mb-2 font-sora">CẤP ĐỘ</p>
              <p className="text-orange-500 font-black uppercase text-[13px] tracking-[2px]">
                {room.difficulty === 'hard' ? t('arena.difficulties.hard') : room.difficulty === 'medium' ? t('arena.difficulties.medium') : t('arena.difficulties.easy')}
              </p>
            </div>
          </div>

          <div className="mb-12 text-left px-4">
             <div className="flex justify-between items-center mb-4">
               <p className="text-blue-400/40 font-black uppercase tracking-widest text-[10px] font-sora">
                 NGƯỜI CHƠI SẴN SÀNG: <span className="text-white ml-2">{currentPlayers}/{room.max_players || 2}</span>
               </p>
             </div>
             <div className="w-full bg-black/40 border border-white/5 rounded-full h-4 overflow-hidden relative p-1 shadow-inner">
               <motion.div 
                 className="absolute inset-y-1 left-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" 
                 initial={{ width: 0 }} 
                 animate={{ width: `calc(${(currentPlayers / (room.max_players || 2)) * 100}% - 8px)` }} 
               />
             </div>
          </div>

          <div className="flex gap-5">
            <button onClick={onLeave} className="flex-1 py-5 rounded-[24px] font-black text-white/50 border border-white/10 hover:bg-white/5 transition-all uppercase text-[12px] tracking-widest">{t('arena.room.waiting.exit_btn')}</button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsWaiting(false)} 
              disabled={currentPlayers < (room.max_players || 2)} 
              className="flex-1 py-5 rounded-[24px] font-black text-white uppercase text-[12px] tracking-[3px] transition-all bg-blue-600 shadow-[0_20px_40px_rgba(37,99,235,0.3)] disabled:opacity-20 disabled:grayscale"
            >
              {t('arena.room.waiting.start_btn')}
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-[#0a0a0a] flex flex-col items-center px-6 py-8 relative font-inter overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />
      <Particles />

      {/* PREMIUM HUD HEADER */}
      <div className="w-full max-w-7xl flex justify-between items-center mb-12 relative z-10">
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onLeave} 
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all shadow-xl"
          >
            <span className="text-xl">✕</span>
          </motion.button>
          
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-3xl border border-white/10 px-6 py-3 rounded-3xl shadow-2xl">
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-blue-400/50 uppercase tracking-[2px] mb-0.5 font-sora">TIẾN TRÌNH</span>
               <div className="flex items-center gap-3">
                  <span className="text-[14px] font-black text-white uppercase tracking-widest">{t('arena.room.battle.question', { current: currentQIndex + 1, total: questions.length })}</span>
                  <div className="w-px h-5 bg-white/10" />
                  <span className="text-[14px] font-black text-blue-400 uppercase tracking-[2px]">{room.mode}</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Switcher HUD */}
          <div className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-3xl border border-white/10 p-1.5 rounded-2xl">
            {['VI', 'EN'].map((lang) => (
              <button
                key={lang}
                onClick={() => i18n.changeLanguage(lang.toLowerCase())}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${i18n.language.toUpperCase() === lang ? 'bg-blue-600 text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}
              >
                {lang}
              </button>
            ))}
          </div>

          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 px-8 py-3 rounded-3xl shadow-2xl flex flex-col items-end">
            <span className="text-[10px] font-black text-blue-400/50 uppercase tracking-[2px] mb-0.5 font-sora">{t('arena.room.battle.score')}</span>
            <span className="text-[22px] font-black text-white leading-none font-sora animate-pulse">{score}</span>
          </div>

          {/* User Profile HUD */}
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-3xl border border-white/10 pl-5 pr-3 py-1.5 rounded-[32px] shadow-2xl group cursor-pointer hover:bg-white/10 transition-all">
             <div className="flex flex-col items-end">
                <span className="text-[11px] font-black text-white uppercase tracking-widest truncate max-w-[120px]">{user?.username}</span>
                <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">TOP PLAYER</span>
             </div>
             <div className="w-10 h-10 rounded-2xl overflow-hidden border border-white/20 bg-white/10 shadow-lg group-hover:scale-105 transition-all">
                <img src={getSvgDataUrl(user?.avatarSeed || user?.username)} className="w-full h-full object-cover scale-125 translate-y-0.5" alt="profile" />
             </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl flex-1 flex flex-col gap-10 relative z-10 pt-10">
        {/* QUESTION CARD */}
        <motion.div 
          key={currentQIndex} 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[60px] p-16 text-center relative shadow-[0_64px_96px_-32px_rgba(0,0,0,0.8)] min-h-[320px] flex flex-col justify-center overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-10 py-3 rounded-b-[30px] shadow-lg shadow-blue-600/30 z-20">
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-black uppercase tracking-[4px] opacity-60 font-sora">{t('arena.room.battle.time')}</span>
              <span className={`text-[20px] font-black font-sora w-12 text-center ${timeLeft <= 5 ? 'text-red-400 animate-bounce' : ''}`}>{timeLeft}S</span>
            </div>
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none select-none">
             <span className="text-[200px] font-black text-white flex items-center justify-center h-full">?</span>
          </div>

          <p className="text-3xl md:text-4xl font-black text-white leading-tight mt-8 font-sora relative z-10 px-4">{currentQ.question}</p>
          
          <div className="absolute bottom-0 left-0 w-full h-2 bg-white/5 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_20px_rgba(37,99,235,0.6)]" 
              initial={{ width: '100%' }} 
              animate={{ width: `${timerPct}%` }} 
              transition={{ duration: 1, ease: 'linear' }}
            />
          </div>
        </motion.div>

        {/* OPTIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {(currentQ.options || []).map((opt, i) => {
            let stateStyle = "bg-white/5 border-white/5 text-white/80 hover:bg-white/10 hover:border-white/20";
            let iconColor = "bg-white/10 text-white/50";
            
            if (answered !== null) {
              if (i === currentQ.correct) {
                stateStyle = "bg-blue-600 text-white border-blue-400 shadow-[0_0_40px_rgba(37,99,235,0.4)] z-10 scale-[1.02]";
                iconColor = "bg-white/20 text-white";
              }
              else if (answered === i) {
                stateStyle = "bg-red-500/80 text-white border-red-400 opacity-100 z-10";
                iconColor = "bg-white/20 text-white";
              }
              else {
                stateStyle = "opacity-20 grayscale bg-white/5 border-white/10 text-white/30";
                iconColor = "bg-white/5 text-transparent";
              }
            }

            return (
              <motion.button 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={answered === null ? { scale: 1.03, y: -4, x: i % 2 === 0 ? -2 : 2 } : {}} 
                whileTap={answered === null ? { scale: 0.97 } : {}} 
                onClick={() => handleAnswer(i)} 
                disabled={answered !== null} 
                className={`p-8 rounded-[40px] border-2 text-left flex items-center gap-6 transition-all shadow-2xl group ${stateStyle}`}
              >
                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center font-black text-xl flex-shrink-0 transition-all ${iconColor}`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="text-[17px] md:text-[19px] font-extrabold flex-1 leading-snug font-sora">{opt}</span>
                {answered !== null && i === currentQ.correct && (
                   <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl">✓</motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};


// ─── MODERATOR DASHBOARD ──────────────────────────────────────────────────────
const ModeratorDashboard = ({ room, onLeave }) => {
  const { t } = useTranslation();
  const leaderboardData = [
    { name: 'Minh Tuấn (K10)', pts: 4850, color: '#76c034' },
    { name: 'Hải Đăng', pts: 4120, color: '#3b82f6' },
    { name: 'Lan Anh Pro', pts: 3900, color: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen bg-viet-bg flex flex-col items-center justify-center p-8 font-inter">
      <Particles />
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-2xl bg-white border border-viet-border rounded-[40px] p-10 relative z-10 shadow-xl shadow-black/5">
        <div className="text-center mb-8">
          <p className="text-viet-text-light/40 font-black uppercase tracking-[4px] text-[10px] mb-3">
            <Trans i18nKey="arena.moderator.instruction">
              THAM GIA TẠI <span className="text-viet-green">AURUM-APPS.COM</span> VỚI MÃ PIN:
            </Trans>
          </p>
          <div className="inline-block px-10 py-6 rounded-[24px] bg-viet-bg border border-viet-border">
            <span className="text-7xl font-black text-viet-text tracking-[16px] select-all">{room.id}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-viet-text font-black uppercase tracking-wider text-[13px] flex items-center gap-2 font-sora">
            🏆 {t('arena.moderator.leaderboard_title')}
          </h3>
          <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {t('arena.moderator.live_badge')}
          </div>
        </div>
        <div className="space-y-4 mb-10 min-h-[200px]">
          {leaderboardData.map((p, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-8 text-center font-black text-viet-text-light/20 text-xl">{i + 1}</span>
              <div className="flex-1 h-14 rounded-2xl bg-viet-bg border border-viet-border relative overflow-hidden">
                <motion.div className="absolute inset-y-0 left-0" style={{ background: `${p.color}20` }} initial={{ width: 0 }} animate={{ width: `${(p.pts / 5000) * 100}%` }} transition={{ duration: 1.5, type: 'spring', damping: 15 }} />
                <div className="absolute inset-0 flex items-center justify-between px-6">
                  <span className="text-viet-text font-black text-[14px] z-10">{p.name}</span>
                  <span className="font-black text-base z-10" style={{ color: p.color }}>{p.pts}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-viet-border flex justify-between items-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-viet-bg border border-viet-border text-[10px] font-black text-viet-text-light/40 uppercase tracking-widest">
            🖥️ {t('arena.moderator.server_status')}
          </div>
          <button onClick={onLeave} className="px-6 py-2.5 rounded-2xl font-black text-red-500 text-[11px] uppercase tracking-widest hover:bg-red-50 transition-all border border-transparent hover:border-red-100">{t('arena.moderator.close_btn')}</button>
        </div>
      </motion.div>
    </div>
  );
};


// ─── LOBBY ────────────────────────────────────────────────────────────────────
const ArenaLobby = ({ user, onFindMatch, isSearching, onCreateRoom, onJoinRoom, onOpenBrowser }) => {
  const { t } = useTranslation();
  const AVATAR_PRESETS = getAvatarPresets(t);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [avatarSeed, setAvatarSeed] = useState(
    user?.arenaAvatar?.seed || AVATAR_PRESETS[0].seed
  );
  const saveTimerRef = useRef(null);

  // Sync from user when profile loads
  useEffect(() => {
    if (user?.arenaAvatar?.seed) setAvatarSeed(user.arenaAvatar.seed);
  }, [user?.id]);

  // Auto-save avatar to DB with 1.5s debounce
  useEffect(() => {
    if (!user?.id) return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      apiCall('/api/arena/save-avatar', {
        method: 'PATCH',
        body: JSON.stringify({ seed: avatarSeed }),
      }).catch(() => {}); // silent fail
    }, 1500);
    return () => clearTimeout(saveTimerRef.current);
  }, [avatarSeed, user?.id]);

  return (
    <div className="min-h-screen pt-[120px] bg-[#fdfdfd] relative overflow-hidden font-inter selection:bg-viet-green selection:text-white">
      {/* Refined modern background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,oklch(0.98_0.01_135)_0%,transparent_100%)]" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] opacity-[0.03] pointer-events-none bg-viet-green" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] opacity-[0.03] pointer-events-none bg-viet-green" />
      
      <Particles />

      <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-[340px_1fr_340px] gap-8 xl:gap-14 items-start">
        {/* Left: Character */}
        <CharacterPanel
          user={user}
          selectedAvatar={selectedAvatar}
          setSelectedAvatar={setSelectedAvatar}
          avatarSeed={avatarSeed}
          setAvatarSeed={setAvatarSeed}
        />

        {/* Center: Actions */}
        <ActionCenter
          onFindMatch={onFindMatch}
          isSearching={isSearching}
          onCreateRoom={onCreateRoom}
          onJoinRoom={onJoinRoom}
          onOpenBrowser={onOpenBrowser}
          selectedAvatar={selectedAvatar}
        />

        {/* Right: Stats */}
        <StatsPanel user={user} />
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};


// ─── MATCH RESULT SCREEN ──────────────────────────────────────────────────────
const MatchResultScreen = ({ result, score, ptsChange, onClose }) => {
  const { t } = useTranslation();
  const isWin = result === 'win';
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/40 backdrop-blur-3xl">
      <div className="w-full max-w-sm text-center">
        <motion.div 
          initial={{ scale: 0, rotate: -20 }} 
          animate={{ scale: 1, rotate: 0 }} 
          transition={{ type: 'spring', damping: 12, delay: 0.1 }} 
          className="text-[140px] mb-8 leading-none select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
        >
          {isWin ? '🏆' : '🕯️'}
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-2 mb-10">
          <h2 className="text-5xl font-black uppercase tracking-tighter" style={{ color: isWin ? '#10b981' : '#1a1a1a' }}>
            {isWin ? t('arena.result.win') : t('arena.result.lose')}
          </h2>
          <p className="text-viet-text-light/40 text-[10px] font-black uppercase tracking-[6px]">{isWin ? t('arena.result.win_desc') : t('arena.result.lose_desc')}</p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.5 }} 
          className="bg-white/50 backdrop-blur-xl rounded-[40px] p-10 border border-black/[0.03] flex items-center justify-center gap-12 mb-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)]"
        >
          <div className="text-center">
            <p className="text-viet-text-light/30 text-[9px] font-black uppercase tracking-widest mb-3">{t('arena.result.score')}</p>
            <p className="text-4xl font-black text-viet-text tracking-tight">{score}</p>
          </div>
          <div className="w-px h-16 bg-black/[0.05]" />
          <div className="text-center">
            <p className="text-viet-text-light/30 text-[9px] font-black uppercase tracking-widest mb-3">{t('arena.result.rank')}</p>
            <p className={`text-4xl font-black tracking-tight ${ptsChange >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {ptsChange > 0 ? '+' : ''}{ptsChange}
            </p>
          </div>
        </motion.div>

        <motion.button 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.6 }} 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={onClose} 
          className="w-full py-6 rounded-[32px] font-black text-white text-[15px] uppercase tracking-[4px] bg-black shadow-2xl shadow-black/20 transition-all hover:bg-viet-green hover:shadow-emerald-500/30"
        >
          {t('arena.result.continue_btn')}
        </motion.button>
      </div>
    </motion.div>
  );
};


// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const Arena = () => {
  const { user, refreshUser } = useAuth();
  const [activeRoom, setActiveRoom] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [matchResult, setMatchResult] = useState(null); // { result, score, ptsChange }
  const [isSearchingMatch, setIsSearchingMatch] = useState(false);
  const searchInterval = useRef(null);

  useEffect(() => {
    return () => {
      if (searchInterval.current) clearInterval(searchInterval.current);
    };
  }, []);

  // ── Create room via API
  const handleCreateRoom = async (formData) => {
    try {
      const modeMap = { solo: 2, '3vs3': 6, '5vs5': 10, '1vs100': 100 };
      const max_players = modeMap[formData.mode] || 2;
      const data = await apiCall('/api/arena/create', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          mode: formData.mode,
          difficulty: formData.difficulty,
          max_players,
        }),
      });
      const isModerator = user?.role === 'admin' || user?.role === 'teacher';
      setActiveRoom({ ...data.room, asModerator: isModerator });
      setIsCreateModalOpen(false);
    } catch (e) {
      // Fallback: local room (no DB) for non-logged-in users
      console.warn('Không thể tạo phòng qua API:', e.message);
      const isModerator = user?.role === 'admin' || user?.role === 'teacher';
      setActiveRoom({
        ...formData,
        id: Math.floor(Math.random() * 900000 + 100000).toString(),
        asModerator: isModerator,
      });
      setIsCreateModalOpen(false);
    }
  };

  // ── Smart Find Match (Polling until someone creates a room)
  const [searchModeParams, setSearchModeParams] = useState(null);

  const handleFindMatch = (modeParam) => {
    if (isSearchingMatch) {
      // Hủy tìm
      clearInterval(searchInterval.current);
      searchInterval.current = null;
      setIsSearchingMatch(false);
      setSearchModeParams(null);
      return;
    }

    setIsSearchingMatch(true);
    setSearchModeParams(modeParam);

    const checkMatch = async () => {
      try {
        const payload = modeParam ? { mode: modeParam } : {};
        const data = await apiCall('/api/arena/find-match', { 
          method: 'POST',
          body: JSON.stringify(payload)
        });
        if (data.found) {
          setIsSearchingMatch(false);
          setSearchModeParams(null);
          if (searchInterval.current) {
            clearInterval(searchInterval.current);
            searchInterval.current = null;
          }
          setActiveRoom({ ...data.room, asModerator: false });
        }
      } catch (err) {
        console.warn('Lỗi tìm trận:', err.message);
      }
    };

    // Kiểm tra ngay lần đầu
    checkMatch();
    // Sau đó lặp lại mỗi 3 giây
    searchInterval.current = setInterval(checkMatch, 3000);
  };

  // ── Join room via API (validates PIN)
  const handleJoinRoom = async (code) => {
    try {
      const data = await apiCall('/api/arena/join', {
        method: 'POST',
        body: JSON.stringify({ room_id: code }),
      });
      setActiveRoom({ ...data.room, asModerator: false });
      setIsBrowserOpen(false);
    } catch (e) {
      alert(e.message || t('arena.room.join_error', { defaultValue: 'Không thể tham gia phòng này' }));
    }
  };


  // ── Rời phòng (Active cleanup)
  const handleLeaveRoom = async () => {
    if (!activeRoom) return;
    const roomId = activeRoom.id;
    setActiveRoom(null); // Clear state immediately
    try {
      await apiCall('/api/arena/leave', {
        method: 'POST',
        body: JSON.stringify({ room_id: roomId })
      });
      console.log(`[ARENA] Đã rời phòng: ${roomId}`);
    } catch (e) {
      // 404 = phòng đã được xóa rồi (bình thường sau khi kết thúc trận)
      if (!e.message?.includes('không tồn tại') && !e.message?.includes('404')) {
        console.warn('Lỗi khi rời phòng:', e.message);
      }
    }
  };

  // ── Lifecycle: Emergency cleanup on tab close
  useEffect(() => {
    const handleUnload = () => {
      if (activeRoom) {
        // Use navigator.sendBeacon for reliable delivery on unload
        const token = localStorage.getItem('token');
        const url = `${window.location.protocol}//${window.location.host}/api/arena/leave`;
        const data = JSON.stringify({ room_id: activeRoom.id });
        
        // Note: fetch with keepalive is also an option, but sendBeacon is more classic
        // However, we need headers for auth, which sendBeacon doesn't support well
        // We'll use fetch with keepalive if possible
        fetch(url, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: data,
          keepalive: true
        });
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [activeRoom]);

  // ── Match finished → save result to DB
  const handleMatchEnd = async ({ result, score, room_id }) => {
    try {
      // If we joined a room, the host_name is our opponent
      const opponentName = activeRoom?.host_name || t('arena.result.opponent_default', { defaultValue: 'Đối thủ' });
      
      const data = await apiCall('/api/arena/match-result', {
        method: 'POST',
        body: JSON.stringify({
          room_id,
          result,
          score,
          opponent_name: opponentName,
        }),
      });
      setMatchResult({ result, score, ptsChange: data.ptsChange || 0 });
      await refreshUser(); // sync profile stats
    } catch (e) {
      console.warn('Match save error:', e.message);
      setMatchResult({ result, score, ptsChange: 0 });
    }
    // Sau khi kết thúc trận, thực hiện rời phòng để giảm count/xóa phòng
    await handleLeaveRoom();
  };

  // ── Match result shown → close
  const handleCloseResult = () => {
    setMatchResult(null);
  };

  // If in battle, show battle UI full-screen
  if (activeRoom) {
    if (activeRoom.asModerator) {
      return <ModeratorDashboard room={activeRoom} onLeave={handleLeaveRoom} />;
    }
    return <PlayerRoom user={user} room={activeRoom} onLeave={handleLeaveRoom} onMatchEnd={handleMatchEnd} />;
  }

  return (
    <>
      {/* Match result overlay */}
      <AnimatePresence>
        {matchResult && (
          <MatchResultScreen
            result={matchResult.result}
            score={matchResult.score}
            ptsChange={matchResult.ptsChange}
            onClose={handleCloseResult}
          />
        )}
      </AnimatePresence>

      <ArenaLobby
        user={user}
        onFindMatch={handleFindMatch}
        isSearching={isSearchingMatch}
        onCreateRoom={() => setIsCreateModalOpen(true)}
        onJoinRoom={handleJoinRoom}
        onOpenBrowser={() => setIsBrowserOpen(true)}
      />

      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateRoomModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            user={user}
            onConfirm={handleCreateRoom}
          />
        )}
        {isBrowserOpen && (
          <RoomBrowserModal
            isOpen={isBrowserOpen}
            onClose={() => setIsBrowserOpen(false)}
            onJoin={handleJoinRoom}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Arena;
