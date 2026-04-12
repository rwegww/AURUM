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
  '#a855f7', '#06b6d4', '#22c55e', '#f97316',
  '#ec4899', '#3b82f6', '#eab308', '#ef4444',
];

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
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full opacity-20"
        style={{
          width: Math.random() * 4 + 2,
          height: Math.random() * 4 + 2,
          background: AURA_COLORS[i % AURA_COLORS.length],
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{ y: [-20, 20, -20], opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 2 }}
      />
    ))}
  </div>
);

// ─── CHARACTER PANEL ──────────────────────────────────────────────────────────
const CharacterPanel = ({ user, selectedAvatar, setSelectedAvatar, avatarSeed, setAvatarSeed, selectedAura, setSelectedAura }) => {
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
    <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col gap-5">
      <div className="bg-white rounded-[32px] p-6 border border-viet-border relative overflow-hidden shadow-sm">
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full blur-[80px] opacity-[0.08] pointer-events-none" style={{ background: selectedAura }} />
        <p className="text-[10px] font-black uppercase tracking-[3px] text-viet-green mb-4 flex items-center gap-1">
          <span>✦</span> {t('arena.character.badge')}
        </p>
        <div className="flex flex-col items-center mb-6">
          <motion.div whileHover={{ scale: 1.05, rotate: 2 }} className="w-28 h-28 rounded-3xl mb-4 shadow-xl cursor-pointer select-none overflow-hidden relative" style={{ background: `linear-gradient(135deg, ${selectedAura}20, ${selectedAura}05)`, border: `2px solid ${selectedAura}30` }}>
            <img src={currentAvatarUrl} alt={currentSeed} className="w-full h-full object-contain p-1" />
          </motion.div>
          <div className="px-6 py-2 rounded-2xl font-black text-viet-text text-[13px] bg-viet-green/5 border border-viet-green/10">
            {displayName}
          </div>
        </div>
        <div className="mb-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-viet-text-light/40 mb-2 px-1">{t('arena.character.name_label')}</p>
          <div className="flex gap-2">
            <input type="text" value={customInput} onChange={(e) => setCustomInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && applyCustomSeed()} placeholder={currentSeed} className="flex-1 px-4 py-2.5 rounded-2xl text-[12px] font-bold text-viet-text placeholder-viet-text/20 outline-none border border-viet-border focus:border-viet-green transition-all bg-viet-bg" />
            <motion.button whileTap={{ scale: 0.9 }} onClick={applyCustomSeed} className="px-4 py-2.5 rounded-2xl font-black text-xs text-white bg-viet-green shadow-sm hover:brightness-105">✓</motion.button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2.5 mb-3">
          {visiblePresets.map((av) => {
            const presetUrl = getSvgDataUrl(av.seed);
            const isSelected = avatarSeed === av.seed;
            return (
              <motion.button key={av.id} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => setAvatarSeed(av.seed)} className="w-full aspect-square rounded-2xl overflow-hidden p-1.5 transition-all bg-viet-bg border-2" style={{ borderColor: isSelected ? selectedAura : 'transparent', background: isSelected ? `${selectedAura}10` : 'var(--color-viet-bg)', boxShadow: isSelected ? `0 4px 12px ${selectedAura}25` : 'none' }}>
                <img src={presetUrl} alt={av.label} className="w-full h-full object-contain" />
              </motion.button>
            );
          })}
        </div>
        <button onClick={() => setShowMore(!showMore)} className="text-[10px] font-black uppercase tracking-widest text-viet-green/60 hover:text-viet-green transition-all mb-4 w-full text-center">
          {showMore ? t('arena.character.collapse') : t('arena.character.expand', { count: AVATAR_PRESETS.length - 8 })}
        </button>
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-viet-text-light/40 mb-3 px-1">{t('arena.character.aura_label')}</p>
          <div className="flex gap-2.5 flex-wrap">
            {AURA_COLORS.map((c) => (
              <motion.button key={c} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }} onClick={() => setSelectedAura(c)} className="w-6 h-6 rounded-full transition-all border border-black/5" style={{ background: c, boxShadow: selectedAura === c ? `0 0 10px ${c}80` : 'none', outline: selectedAura === c ? `2px solid ${c}` : 'none', outlineOffset: '2px' }} />
            ))}
          </div>
        </div>
      </div>
      <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => { const randomPreset = AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)]; setAvatarSeed(randomPreset.seed); setSelectedAvatar(0); setSelectedAura(AURA_COLORS[Math.floor(Math.random() * AURA_COLORS.length)]); }} className="w-full py-4 rounded-[24px] font-black text-[12px] uppercase tracking-[2px] text-white flex items-center justify-center gap-3 bg-viet-text shadow-lg shadow-black/10 transition-all hover:bg-black">
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
    <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col gap-5">
      <div className="bg-white rounded-[32px] p-6 border border-viet-border relative overflow-hidden shadow-sm">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[80px] opacity-[0.05] pointer-events-none" style={{ background: rank.color }} />
        <p className="text-[10px] font-black uppercase tracking-[3px] text-viet-green mb-4 flex items-center gap-1">
          <span>📊</span> {t('arena.stats.badge')}
        </p>
        <div className="space-y-1 mb-6">
          {rows.map(({ label, value, color }) => (
            <div key={label} className="flex justify-between items-center py-2.5 border-b border-viet-border last:border-0">
              <span className="text-viet-text-light text-[13px] font-bold">{label}</span>
              <span className={`font-black text-[13px] ${color}`}>{value}</span>
            </div>
          ))}
        </div>
        <div className="rounded-2xl p-4 flex items-center gap-4 transition-all" style={{ background: `linear-gradient(135deg, ${rank.color}10, ${rank.color}03)`, border: `1px solid ${rank.color}20` }}>
          <span className="text-4xl drop-shadow-sm">{rank.icon}</span>
          <div>
            <p className="font-black text-lg" style={{ color: rank.color }}>{rank.name}</p>
            <p className="text-viet-text-light/40 text-[9px] font-black uppercase tracking-widest">{t('arena.stats.rank_label')}</p>
          </div>
        </div>
      </div>
      <motion.button whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }} onClick={() => setShowLeaderboard(v => !v)} className="w-full py-4 rounded-[24px] font-black text-[12px] uppercase tracking-[2px] text-viet-text-light flex items-center justify-between px-6 bg-white border border-viet-border hover:border-viet-green/30 transition-all shadow-sm">
        <span>🏆 {t('arena.stats.leaderboard_btn')}</span>
        <span className="text-[14px]">{showLeaderboard ? '↑' : '↓'}</span>
      </motion.button>
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-[32px] border border-viet-border overflow-hidden shadow-sm">
            <div className="p-6">
              <p className="text-[10px] font-black uppercase tracking-[3px] text-viet-green mb-4">🥇 {t('arena.stats.leaderboard_title')}</p>
              {loading ? (
                <div className="flex justify-center py-6">
                  <div className="w-6 h-6 border-2 border-viet-green border-t-transparent rounded-full animate-spin" />
                </div>
              ) : leaderboard.length === 0 ? (
                <p className="text-viet-text-light/40 text-[11px] text-center py-6 italic">{t('arena.stats.empty_leaderboard')}</p>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 py-1.5 px-2 rounded-xl hover:bg-viet-bg transition-colors">
                      <span className={`w-6 text-center font-black text-[13px] ${RANK_COLORS[i] || 'text-viet-text-light/30'}`}>{i + 1}</span>
                      <img src={getSvgDataUrl(p.avatarSeed)} alt={p.name} className="w-8 h-8 rounded-lg object-contain shadow-sm" style={{ background: `${p.aura}10`, border: `1px solid ${p.aura}15` }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-viet-text font-black text-[13px] truncate">{p.name}</p>
                        <p className="text-viet-text-light/40 text-[10px] font-bold">{p.wins} {t('arena.stats.wins')} - {p.total - p.wins} {t('arena.stats.losses')}</p>
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
      <div className="bg-white rounded-[32px] p-6 border border-viet-border shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-[3px] text-viet-green mb-4">⚡ {t('arena.stats.history')}</p>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="w-5 h-5 border-2 border-viet-green border-t-transparent rounded-full animate-spin" />
          </div>
        ) : battles.length === 0 ? (
          <p className="text-viet-text-light/40 text-[11px] text-center py-6 italic">{t('arena.stats.empty_history')}</p>
        ) : (
          <div className="space-y-3">
            {battles.map((b, i) => (
              <div key={i} className="flex items-center gap-3 py-2 px-1 hover:bg-viet-bg rounded-xl transition-all">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-[11px] border ${b.result === 'win' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : b.result === 'lose' ? 'bg-red-50 border-red-100 text-red-500' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                  {b.result === 'win' ? 'W' : b.result === 'lose' ? 'L' : 'D'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-viet-text font-black text-[12px] truncate">{b.opponent_name}</p>
                  <p className="text-viet-text-light/30 text-[10px] font-bold uppercase">{timeAgo(t, b.played_at)}</p>
                </div>
                <span className={`font-black text-[12px] ${b.pts_change > 0 ? 'text-emerald-600' : b.pts_change < 0 ? 'text-red-500' : 'text-viet-text-light/30'}`}>
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
const ActionCenter = ({ onFindMatch, isSearching, onCreateRoom, onJoinRoom, onOpenBrowser, selectedAvatar, selectedAura }) => {
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
    const interval = setInterval(fetchOnlineCount, 30000); // 30s polling
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center gap-8 py-4">
      <div className="relative mb-2">
        <motion.div animate={{ rotate: [0, 3, -3, 0] }} transition={{ duration: 5, repeat: Infinity }} className="w-36 h-36 rounded-full flex items-center justify-center text-7xl relative z-10 bg-white shadow-2xl border border-viet-border" style={{ boxShadow: `0 20px 40px ${selectedAura}15, 0 0 0 8px white` }}>
          <div className="absolute inset-2 rounded-full opacity-[0.08]" style={{ background: selectedAura }} />
          ⚔️
        </motion.div>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border border-dashed border-viet-green/20" style={{ margin: '-12px' }} />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border border-solid border-viet-green/10" style={{ margin: '-28px' }} />
        <div className="absolute inset-0 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: selectedAura, margin: '-20px' }} />
      </div>
      <div className="text-center">
        <h2 className="text-3xl font-black text-viet-text uppercase tracking-[5px] mb-2 font-sora">
          <Trans i18nKey="arena.title">
            ĐẤU TRƯỜNG <span className="text-viet-green">HÓA HỌC</span>
          </Trans>
        </h2>
        <p className="text-viet-text-light/40 text-[11px] font-black tracking-[4px] uppercase">{t('arena.subtitle')}</p>
      </div>
      <div className="w-full max-w-[420px] space-y-4">
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => onFindMatch(findMode)} className="flex-1 py-5 rounded-[24px] font-black text-white text-[15px] uppercase tracking-widest flex items-center justify-center gap-3 relative overflow-hidden group shadow-lg shadow-emerald-500/20 transition-all" style={{ background: isSearching ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #76c034, #64a32b)' }}>
            {isSearching ? <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="text-lg">⟳</motion.span> {t('arena.actions.cancel_find')}</> : <><span className="text-lg">⚔️</span> {t('arena.actions.find_match')}</>}
          </motion.button>
          <div className="relative">
            <select value={findMode} onChange={(e) => setFindMode(e.target.value)} disabled={isSearching} className="w-32 py-5 px-3 rounded-[24px] font-black text-viet-text text-[11px] uppercase tracking-widest text-center outline-none border border-viet-border bg-white hover:border-viet-green transition-all appearance-none cursor-pointer disabled:opacity-50 shadow-sm">
              <option value="solo">{t('arena_modes.solo_short')}</option>
              <option value="3vs3">{t('arena_modes.3vs3_short')}</option>
              <option value="5vs5">{t('arena_modes.5vs5_short')}</option>
              <option value="1vs100">{t('arena_modes.br_short')}</option>
            </select>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={onCreateRoom} className="w-full py-5 rounded-[24px] font-black text-white text-[15px] uppercase tracking-widest flex items-center justify-center gap-3 relative overflow-hidden shadow-lg shadow-purple-500/20 transition-all mt-2" style={{ background: 'linear-gradient(135deg, #a855f7, #8b5cf6)' }}>
          <span>🏟️</span> {t('arena.actions.create_room')}
        </motion.button>
        <AnimatePresence mode="wait">
          {!showJoinInput ? (
            <div className="flex gap-4">
              <motion.button key="join-btn" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => setShowJoinInput(true)} className="flex-1 py-5 rounded-[24px] font-black text-white text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 relative overflow-hidden shadow-lg shadow-orange-500/20 transition-all" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                <span>🚪</span> {t('arena.actions.join_pin')}
              </motion.button>
              <motion.button key="browser-btn" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={onOpenBrowser} className="flex-1 py-5 rounded-[24px] font-black text-white text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 relative overflow-hidden shadow-lg shadow-blue-500/20 transition-all" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                <span>🌐</span> {t('arena.actions.lobby')}
              </motion.button>
            </div>
          ) : (
            <motion.div key="join-input" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-3 p-4 bg-white border border-viet-border rounded-[28px] shadow-sm">
              <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder={t('arena.actions.pin_placeholder')} autoFocus className="w-full py-4 px-6 rounded-2xl font-black text-viet-text text-center text-xl placeholder-viet-text/10 outline-none border border-viet-border focus:border-orange-400 transition-all bg-viet-bg" style={{ letterSpacing: '0.4em' }} onKeyDown={(e) => { if (e.key === 'Enter' && joinCode.trim()) onJoinRoom(joinCode.trim()); }} />
              <div className="flex gap-3">
                <button onClick={() => setShowJoinInput(false)} className="flex-1 py-3 rounded-2xl font-black text-viet-text-light/50 text-[11px] uppercase tracking-widest border border-viet-border hover:bg-gray-50 transition-all">{t('arena.actions.close')}</button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => joinCode.trim() && onJoinRoom(joinCode.trim())} disabled={!joinCode.trim()} className="flex-[2] py-3 rounded-2xl font-black text-white text-[11px] uppercase tracking-widest disabled:opacity-40 transition-all bg-orange-500 shadow-sm">{t('arena.actions.enter')}</motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-6 text-viet-text-light/30 text-[9px] font-black uppercase tracking-[3px] mt-2">
        <span>⊙ {t('arena.actions.footer_info.summary')}</span>
        <span>⊙ {t('arena.actions.footer_info.questions')}</span>
        <span>⊙ {t('arena.actions.footer_info.time')}</span>
        <span>⊙ 1 vs 1</span>
      </div>
      <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-viet-border shadow-sm text-viet-text-light/50 text-[11px] font-bold">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>{t('arena.online_count', { count: onlineCount.toLocaleString() })}</span>
      </div>
    </motion.div>
  );
};


// ─── CREATE ROOM MODAL ────────────────────────────────────────────────────────
const CreateRoomModal = ({ isOpen, onClose, user, onConfirm }) => {
  const { t } = useTranslation();
  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';
  const difficulties = [
    { id: 'easy',   label: t('arena.difficulties.easy'),   color: '#22c55e' },
    { id: 'medium', label: t('arena.difficulties.medium'), color: '#eab308' },
    { id: 'hard',   label: t('arena.difficulties.hard'),   color: '#f97316' },
    { id: 'super',  label: t('arena.difficulties.super'),  color: '#ef4444' },
  ];
  const [formData, setFormData] = useState({
    name: '',
    mode: 'solo',
    difficulty: isTeacherOrAdmin ? 'easy' : 'auto',
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md" onClick={onClose}>
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white rounded-[40px] p-8 relative border border-viet-border shadow-2xl">
          <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-2xl flex items-center justify-center text-viet-text-light/30 hover:text-red-500 hover:bg-red-50 transition-all font-black text-xl">✕</button>
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-4xl mb-6 bg-viet-green/10 text-viet-green">🏟️</div>
          <h2 className="text-2xl font-black text-viet-text mb-6 uppercase tracking-wider font-sora">
            <Trans i18nKey="arena.create_room.title">
              MỞ SẢNH <span className="text-viet-green">THI ĐẤU</span>
            </Trans>
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[3px] text-viet-text-light/40 mb-3 px-1">{t('arena.create_room.name_label')}</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder={t('arena.create_room.name_placeholder')} className="w-full py-4 px-5 rounded-2xl font-bold text-viet-text placeholder-viet-text/20 outline-none border border-viet-border focus:border-viet-green transition-all bg-viet-bg" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[3px] text-viet-text-light/40 mb-3 px-1">{t('arena.create_room.mode_label')}</label>
              <select value={formData.mode} onChange={(e) => setFormData({ ...formData, mode: e.target.value })} className="w-full py-4 px-5 rounded-2xl font-bold text-viet-text outline-none border border-viet-border focus:border-viet-green transition-all bg-viet-bg appearance-none cursor-pointer">
                <option value="solo">{t('arena_modes.solo')}</option>
                <option value="3vs3">{t('arena_modes.3vs3')}</option>
                <option value="5vs5">{t('arena_modes.5vs5')}</option>
                <option value="1vs100">{t('arena_modes.1vs100')}</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[3px] text-viet-text-light/40 mb-3 px-1">
                {t('arena.create_room.difficulty_label')}
                {isTeacherOrAdmin && <span className="ml-3 bg-viet-green/10 text-viet-green px-2 py-0.5 rounded-lg text-[9px] font-black border border-viet-green/20">{t('arena.create_room.admin_badge')}</span>}
              </label>
              {isTeacherOrAdmin ? (
                <div className="grid grid-cols-2 gap-3">
                  {difficulties.map((d) => (
                    <button key={d.id} onClick={() => setFormData({ ...formData, difficulty: d.id })} className="py-4 rounded-2xl font-black text-[12px] transition-all border-2" style={{ background: formData.difficulty === d.id ? `${d.color}10` : 'var(--color-viet-bg)', borderColor: formData.difficulty === d.id ? d.color : 'transparent', color: formData.difficulty === d.id ? d.color : 'var(--color-viet-text-light)', opacity: formData.difficulty === d.id ? 1 : 0.6 }}>
                      {d.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="w-full py-4 px-5 rounded-2xl flex items-center justify-between bg-viet-bg border border-viet-border">
                  <span className="font-bold text-viet-text-light/50 flex items-center gap-2 text-[13px]">
                    <span>🎓</span> {t('arena.create_room.auto_grade', { grade: user?.grade || '8' })}
                  </span>
                  <span className="text-viet-text-light/30">🔒</span>
                </div>
              )}
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onConfirm(formData)} disabled={!formData.name} className="w-full py-5 rounded-[24px] font-black text-white text-base uppercase tracking-widest disabled:opacity-40 transition-all bg-viet-green shadow-xl shadow-emerald-500/20 mt-2">
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md" onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-white rounded-[40px] p-8 relative border border-viet-border shadow-2xl max-h-[85vh] flex flex-col">
          <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-2xl flex items-center justify-center text-viet-text-light/30 hover:text-red-500 hover:bg-red-50 transition-all font-black text-xl">✕</button>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-viet-text uppercase tracking-wider font-sora">
              <Trans i18nKey="arena.browser.title">
                SẢNH CHỜ <span className="text-viet-green">TRỰC TUYẾN</span>
              </Trans>
            </h2>
            <button onClick={fetchRooms} className="px-4 py-2 rounded-xl bg-viet-green/10 text-viet-green text-[11px] font-black uppercase tracking-widest hover:bg-viet-green/20 transition-all">⟳ {t('arena.browser.refresh')}</button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-viet-green border-t-transparent rounded-full animate-spin" />
                <p className="text-viet-text-light/40 font-bold uppercase tracking-widest text-[11px]">{t('arena.browser.scanning')}</p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-6xl mb-4 opacity-20">🏜️</span>
                <p className="text-viet-text font-black text-lg">{t('arena.browser.empty_title')}</p>
                <p className="text-viet-text-light/50 text-[11px] font-bold">{t('arena.browser.empty_desc')}</p>
              </div>
            ) : (
              rooms.map((room) => (
                <div key={room.id} className="bg-viet-bg border border-viet-border rounded-3xl p-5 flex items-center gap-6 hover:border-viet-green/40 transition-all group">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-viet-border overflow-hidden flex-shrink-0 relative group-hover:scale-105 transition-all">
                    <img src={getSvgDataUrl(room.host_avatar?.seed || 'host')} className="w-full h-full object-contain p-1" alt="host" />
                    <div className="absolute inset-0 bg-viet-green/5 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-viet-text font-black text-[15px] truncate">{room.name}</h3>
                      <span className="px-2 py-0.5 rounded-lg bg-white border border-viet-border text-[9px] font-black text-viet-text-light/50 uppercase tracking-widest">#{room.id}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-viet-text-light/40 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><span className="text-xs">👤</span> {room.host_name}</span>
                      <span className="flex items-center gap-1.5"><span className="text-xs">🎮</span> {room.mode}</span>
                      <span className="flex items-center gap-1.5"><span className="text-xs">🎯</span> {room.difficulty}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-[11px] font-black text-viet-text-light/40">
                      <span className="text-viet-green">{room.current_players}</span>/{room.max_players}
                    </div>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onJoin(room.id)} disabled={room.current_players >= room.max_players} className="px-6 py-2.5 rounded-2xl font-black text-white text-[11px] uppercase tracking-widest bg-viet-text hover:bg-black transition-all disabled:opacity-30">
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
const PlayerRoom = ({ room, onLeave, onMatchEnd }) => {
  const { t } = useTranslation();
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

  const padIcons = ['▲', '◆', '●', '■'];

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
      <div className="min-h-screen bg-viet-bg flex flex-col items-center justify-center p-8">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="text-3xl mb-4">⟳</motion.div>
        <p className="text-viet-text-light/40 font-black uppercase tracking-widest text-[11px]">{t('arena.room.loading')}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-viet-bg flex flex-col items-center justify-center p-8 text-center">
        <span className="text-6xl mb-6">🏜️</span>
        <button onClick={onLeave} className="px-10 py-4 rounded-2xl font-black text-white bg-viet-text uppercase text-[11px] tracking-widest shadow-xl">{t('arena.room.back_btn')}</button>
      </div>
    );
  }

  if (isWaiting) {
    return (
      <div className="min-h-screen bg-viet-bg flex flex-col items-center justify-center p-8 relative font-inter">
        <Particles />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg bg-white border border-viet-border rounded-[40px] p-10 relative z-10 text-center shadow-xl shadow-black/5">
          <h2 className="text-2xl font-black text-viet-text uppercase tracking-widest mb-2 font-sora">{t('arena.room.waiting.title')}</h2>
          <div className="text-[5.5rem] font-black text-viet-text tracking-[16px] py-6 rounded-[32px] bg-viet-bg border border-viet-border mb-10 leading-none">{room.id}</div>
          <div className="flex justify-center items-center gap-6 mb-10">
            <div className="text-center"><p className="text-[9px] font-black text-viet-text-light/30 uppercase tracking-widest mb-1">{t('arena.room.waiting.mode')}</p><p className="text-viet-green font-black uppercase text-[11px] tracking-widest">{room.mode || '1 VS 1'}</p></div>
            <div className="w-px h-8 bg-viet-border" />
            <div className="text-center"><p className="text-[9px] font-black text-viet-text-light/30 uppercase tracking-widest mb-1">{t('arena.room.waiting.difficulty')}</p><p className="text-orange-500 font-black uppercase text-[11px] tracking-widest">{room.difficulty === 'hard' ? t('arena.difficulties.hard') : room.difficulty === 'medium' ? t('arena.difficulties.medium') : t('arena.difficulties.easy')}</p></div>
          </div>
          <div className="mb-10 text-left px-4">
             <div className="flex justify-between items-center mb-3">
               <p className="text-viet-text-light/40 font-black uppercase tracking-widest text-[9px]">{t('arena.room.waiting.players')}: <span className="text-viet-text">{currentPlayers}/{room.max_players || 2}</span></p>
             </div>
             <div className="w-full bg-viet-bg border border-viet-border rounded-full h-3 overflow-hidden relative">
               <motion.div className="absolute inset-y-0 left-0 bg-viet-green" initial={{ width: 0 }} animate={{ width: `${(currentPlayers / (room.max_players || 2)) * 100}%` }} />
             </div>
          </div>
          <div className="flex gap-4">
            <button onClick={onLeave} className="flex-1 py-4 rounded-2xl font-black text-viet-text-light/40 border border-viet-border hover:bg-gray-50 transition-all uppercase text-[11px] tracking-widest">{t('arena.room.waiting.exit_btn')}</button>
            <button onClick={() => setIsWaiting(false)} disabled={currentPlayers < (room.max_players || 2)} className="flex-1 py-4 rounded-2xl font-black text-white uppercase text-[11px] tracking-widest transition-all bg-viet-text shadow-xl disabled:opacity-20">{t('arena.room.waiting.start_btn')}</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-viet-bg flex flex-col items-center px-6 py-10 relative font-inter overflow-hidden">
      <Particles />
      <div className="w-full max-w-4xl flex justify-between items-center mb-10 relative z-10">
        <div className="flex items-center gap-6">
          <button onClick={onLeave} className="w-10 h-10 rounded-xl bg-white border border-viet-border flex items-center justify-center text-viet-text-light/40 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm">✕</button>
          <div className="px-5 py-2.5 rounded-2xl bg-white border border-viet-border shadow-sm flex items-center gap-4">
            <span className="text-[11px] font-black text-viet-text-light/30 uppercase tracking-widest">{t('arena.room.battle.question', { current: currentQIndex + 1, total: questions.length })}</span>
            <div className="w-px h-4 bg-viet-border" />
            <span className="text-[11px] font-black text-viet-green uppercase tracking-[2px]">{room.mode}</span>
          </div>
        </div>
        <div className="px-6 py-2.5 rounded-2xl bg-white border border-viet-border shadow-sm flex items-center gap-3">
          <span className="text-[11px] font-black text-viet-text-light/30 uppercase tracking-widest">{t('arena.room.battle.score')}</span>
          <span className="text-lg font-black text-viet-text">{score}</span>
        </div>
      </div>
      <div className="w-full max-w-4xl flex-1 flex flex-col gap-8 relative z-10">
        <motion.div key={currentQIndex} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white border-2 border-viet-border rounded-[40px] p-10 text-center relative shadow-xl shadow-black/5 min-h-[220px] flex flex-col justify-center overflow-hidden">
          <div className="absolute -top-1 px-4 py-1.5 left-1/2 -translate-x-1/2 rounded-b-2xl bg-viet-text text-white text-[11px] font-black tracking-widest flex items-center gap-2">
            <span className="opacity-40">{t('arena.room.battle.time')}</span><span className={timeLeft <= 5 ? 'text-red-400' : ''}>{timeLeft}S</span>
          </div>
          <p className="text-xl md:text-2xl font-black text-viet-text leading-tight mt-4">{currentQ.question}</p>
          <div className="absolute bottom-0 left-0 h-1.5 bg-viet-green transition-all" style={{ width: `${timerPct}%` }} />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {(currentQ.options || []).map((opt, i) => {
            let stateStyle = "bg-white border-viet-border text-viet-text";
            if (answered !== null) {
              if (i === currentQ.correct) stateStyle = "bg-viet-green text-white border-viet-green";
              else if (answered === i) stateStyle = "bg-red-500 text-white border-red-500";
              else stateStyle = "opacity-40 bg-white border-viet-border";
            }
            return (
              <motion.button key={i} whileHover={answered === null ? { scale: 1.02, y: -2 } : {}} whileTap={answered === null ? { scale: 0.98 } : {}} onClick={() => handleAnswer(i)} disabled={answered !== null} className={`p-6 rounded-[32px] border-2 text-left flex items-center gap-5 transition-all shadow-sm ${stateStyle}`}>
                <div className={`w-12 h-12 rounded-[20px] flex items-center justify-center font-black text-lg ${answered !== null && i === currentQ.correct ? 'bg-white/20' : 'bg-viet-bg'}`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="text-[15px] font-bold flex-1">{opt}</span>
                {answered !== null && i === currentQ.correct && <span className="text-2xl">✓</span>}
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
  const [selectedAura, setSelectedAura] = useState(
    user?.arenaAvatar?.aura || '#a855f7'
  );
  const saveTimerRef = useRef(null);

  // Sync from user when profile loads
  useEffect(() => {
    if (user?.arenaAvatar?.seed) setAvatarSeed(user.arenaAvatar.seed);
    if (user?.arenaAvatar?.aura) setSelectedAura(user.arenaAvatar.aura);
  }, [user?.id]);

  // Auto-save avatar + aura to DB with 1.5s debounce
  useEffect(() => {
    if (!user?.id) return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      apiCall('/api/arena/save-avatar', {
        method: 'PATCH',
        body: JSON.stringify({ seed: avatarSeed, aura: selectedAura }),
      }).catch(() => {}); // silent fail
    }, 1500);
    return () => clearTimeout(saveTimerRef.current);
  }, [avatarSeed, selectedAura, user?.id]);

  return (
    <div className="min-h-screen pt-[110px] bg-viet-bg relative overflow-hidden font-inter">
      <Particles />

      {/* Decorative BG blobs - softer for light theme */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.03] pointer-events-none"
        style={{ background: selectedAura }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.03] pointer-events-none"
        style={{ background: '#76c034' }} />

      {/* Main 3-column layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-10 items-start">
        {/* Left: Character */}
        <CharacterPanel
          user={user}
          selectedAvatar={selectedAvatar}
          setSelectedAvatar={setSelectedAvatar}
          avatarSeed={avatarSeed}
          setAvatarSeed={setAvatarSeed}
          selectedAura={selectedAura}
          setSelectedAura={setSelectedAura}
        />

        {/* Center: Actions */}
        <ActionCenter
          onFindMatch={onFindMatch}
          isSearching={isSearching}
          onCreateRoom={onCreateRoom}
          onJoinRoom={onJoinRoom}
          onOpenBrowser={onOpenBrowser}
          selectedAvatar={selectedAvatar}
          selectedAura={selectedAura}
        />

        {/* Right: Stats */}
        <StatsPanel user={user} />
      </div>
    </div>
  );
};


// ─── MATCH RESULT SCREEN ──────────────────────────────────────────────────────
const MatchResultScreen = ({ result, score, ptsChange, onClose }) => {
  const { t } = useTranslation();
  const isWin = result === 'win';
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/60 backdrop-blur-xl">
      <div className="w-full max-sm text-center">
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 12, delay: 0.1 }} className="text-[120px] mb-6 leading-none select-none">{isWin ? '🏆' : '🕯️'}</motion.div>
        <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-4xl font-black uppercase mb-2 font-sora tracking-tighter" style={{ color: isWin ? '#76c034' : '#1a1a1a' }}>{isWin ? t('arena.result.win') : t('arena.result.lose')}</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-viet-text-light/50 text-[11px] font-black uppercase tracking-[4px] mb-8">{isWin ? t('arena.result.win_desc') : t('arena.result.lose_desc')}</motion.p>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="bg-viet-bg rounded-[32px] p-8 border border-viet-border flex items-center justify-center gap-10 mb-10 shadow-sm">
          <div className="text-center">
            <p className="text-viet-text-light/40 text-[9px] font-black uppercase tracking-widest mb-2">{t('arena.result.score')}</p>
            <p className="text-3xl font-black text-viet-text">{score}</p>
          </div>
          <div className="w-px h-12 bg-viet-border" />
          <div className="text-center">
            <p className="text-viet-text-light/40 text-[9px] font-black uppercase tracking-widest mb-2">{t('arena.result.rank')}</p>
            <p className={`text-3xl font-black ${ptsChange >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{ptsChange > 0 ? '+' : ''}{ptsChange}</p>
          </div>
        </motion.div>
        <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="w-full py-5 rounded-[24px] font-black text-white text-base uppercase tracking-widest bg-viet-text shadow-xl shadow-black/10 transition-all hover:bg-black">{t('arena.result.continue_btn')}</motion.button>
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
    return <PlayerRoom room={activeRoom} onLeave={handleLeaveRoom} onMatchEnd={handleMatchEnd} />;
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
