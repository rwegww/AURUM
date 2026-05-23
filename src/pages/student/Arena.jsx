import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import {
  Award,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  ClipboardList,
  Clock3,
  DoorOpen,
  FlaskConical,
  Gamepad2,
  History,
  Loader2,
  LogOut,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Swords,
  Trophy,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/common/Avatar';

const MODE_CONFIG = {
  solo: { maxPlayers: 2, icon: Swords, accent: 'text-viet-green', bg: 'bg-viet-green/10' },
  '3vs3': { maxPlayers: 6, icon: Shield, accent: 'text-blue-600', bg: 'bg-blue-50' },
  '5vs5': { maxPlayers: 10, icon: Users, accent: 'text-amber-600', bg: 'bg-amber-50' },
  '1vs100': { maxPlayers: 100, icon: Trophy, accent: 'text-rose-600', bg: 'bg-rose-50' },
};

const MODE_KEYS = Object.keys(MODE_CONFIG);
const DIFFICULTY_KEYS = ['easy', 'medium', 'hard', 'super'];

const RANKS = [
  { key: 'bronze', min: 0, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  { key: 'silver', min: 500, color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' },
  { key: 'gold', min: 1500, color: 'text-amber-500', bg: 'bg-amber-100', border: 'border-amber-200' },
  { key: 'diamond', min: 3000, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { key: 'master', min: 6000, color: 'text-viet-green', bg: 'bg-viet-green/10', border: 'border-viet-green/30' },
];

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
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Server error');
  return data;
};

const getStats = (user) => user?.arenaStats || { total: 0, wins: 0, losses: 0, points: 0 };

const getRank = (points = 0) => {
  const current = [...RANKS].reverse().find((rank) => points >= rank.min) || RANKS[0];
  const next = RANKS.find((rank) => rank.min > points) || null;
  return { current, next };
};

const getModeLabel = (t, mode) => (MODE_CONFIG[mode] ? t(`arena_modes.${mode}`) : mode || t('arena_modes.solo'));
const getModeShortLabel = (t, mode) => (MODE_CONFIG[mode] ? t(`arena_modes.${mode}_short`) : getModeLabel(t, mode));
const getDifficultyLabel = (t, difficulty) => {
  if (difficulty === 'auto') return t('arena.ui.difficulty_auto');
  return DIFFICULTY_KEYS.includes(difficulty) ? t(`arena.difficulties.${difficulty}`) : t('arena.ui.difficulty_auto');
};

const timeAgo = (t, iso) => {
  if (!iso) return t('arena.stats.history_item.just_now');
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return t('arena.stats.history_item.just_now');
  if (m < 60) return t('arena.stats.history_item.minutes_ago', { count: m });
  const h = Math.floor(m / 60);
  if (h < 24) return t('arena.stats.history_item.hours_ago', { count: h });
  return t('arena.stats.history_item.days_ago', { count: Math.floor(h / 24) });
};

const Panel = ({ children, className = '' }) => (
  <section className={`bg-white border border-viet-border rounded-lg shadow-sm ${className}`}>
    {children}
  </section>
);

const IconButton = ({ children, className = '', ...props }) => (
  <button
    type="button"
    className={`inline-flex items-center justify-center gap-2 rounded-lg font-black transition-all disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const ProfilePanel = ({ user }) => {
  const { t } = useTranslation();
  const stats = getStats(user);
  const avatarSeed = user?.avatarSeed || user?.username || 'Aurum';

  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between gap-3 border-b border-viet-border pb-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-viet-text-light/60">
            {t('arena.ui.profile_panel_title')}
          </p>
          <h2 className="mt-1 truncate text-2xl font-black text-viet-text">{user?.username}</h2>
        </div>
        <Link
          to="/settings"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-viet-border text-viet-text-light transition-all hover:border-viet-green hover:text-viet-green"
          title={t('arena.ui.edit_profile')}
        >
          <Settings className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex flex-col items-center py-6 text-center">
        <Avatar
          seed={avatarSeed}
          size={132}
          streakCount={user?.streakCount}
          level={user?.level}
        />
        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-viet-green/10 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-viet-green">
          <CheckCircle2 className="h-4 w-4" />
          {t('arena.ui.avatar_synced')}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-viet-border p-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light/50">{t('arena.ui.level_label')}</p>
          <p className="mt-1 text-xl font-black text-viet-text">{user?.level || 1}</p>
        </div>
        <div className="rounded-lg border border-viet-border p-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light/50">{t('arena.ui.grade_label')}</p>
          <p className="mt-1 text-xl font-black text-viet-text">{user?.grade || t('arena.ui.no_grade')}</p>
        </div>
        <div className="rounded-lg border border-viet-border p-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light/50">{t('arena.ui.streak_label')}</p>
          <p className="mt-1 text-xl font-black text-orange-500">{user?.streakCount || 0}</p>
        </div>
        <div className="rounded-lg border border-viet-border p-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light/50">{t('arena.ui.points_label')}</p>
          <p className="mt-1 text-xl font-black text-viet-green">{stats.points || 0}</p>
        </div>
      </div>
    </Panel>
  );
};

const RankSummary = ({ user }) => {
  const { t } = useTranslation();
  const stats = getStats(user);
  const { current, next } = getRank(stats.points || 0);
  const currentLabel = t(`arena.ranks.${current.key}`);
  const nextPoints = next ? next.min - stats.points : 0;
  const previousMin = current.min;
  const nextMin = next?.min || current.min;
  const rankProgress = next ? Math.min(((stats.points - previousMin) / (nextMin - previousMin)) * 100, 100) : 100;

  return (
    <div className={`rounded-lg border ${current.border} ${current.bg} p-4`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg bg-white ${current.color}`}>
          <Award className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light/60">{t('arena.ui.current_rank')}</p>
          <p className={`truncate text-lg font-black ${current.color}`}>{currentLabel}</p>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-viet-green" style={{ width: `${rankProgress}%` }} />
      </div>
      <p className="mt-3 text-[11px] font-bold text-viet-text-light">
        {next ? t('arena.ui.next_rank', { count: nextPoints }) : t('arena.ui.max_rank')}
      </p>
    </div>
  );
};

const StatsPanel = ({ user }) => {
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState([]);
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const stats = getStats(user);
  const winRate = stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const lbData = await apiCall('/api/arena/leaderboard');
        const battleData = user?.id ? await apiCall('/api/arena/my-battles') : { battles: [] };
        if (active) {
          setLeaderboard(lbData.leaderboard || []);
          setBattles(battleData.battles || []);
        }
      } catch (err) {
        console.warn('Arena stats load error:', err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const statRows = [
    { label: t('arena.stats.total_matches'), value: stats.total || 0, icon: ClipboardList },
    { label: t('arena.stats.wins'), value: stats.wins || 0, icon: Trophy },
    { label: t('arena.stats.losses'), value: stats.losses || 0, icon: Shield },
    { label: t('arena.stats.win_rate'), value: `${winRate}%`, icon: BarChart3 },
  ];

  return (
    <div className="space-y-5">
      <Panel className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-black text-viet-text">{t('arena.ui.stats_panel_title')}</h3>
          <BarChart3 className="h-5 w-5 text-viet-green" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {statRows.map(({ label, value, icon }) => (
            <div key={label} className="rounded-lg border border-viet-border p-3">
              {React.createElement(icon, { className: 'mb-3 h-4 w-4 text-viet-text-light' })}
              <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light/50">{label}</p>
              <p className="mt-1 text-xl font-black text-viet-text">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <RankSummary user={user} />
        </div>
      </Panel>

      <Panel className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-black text-viet-text">{t('arena.ui.leaderboard_panel_title')}</h3>
          <Trophy className="h-5 w-5 text-amber-500" />
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-viet-green" />
          </div>
        ) : leaderboard.length === 0 ? (
          <p className="py-6 text-center text-sm font-bold text-viet-text-light/60">{t('arena.stats.empty_leaderboard')}</p>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((player) => (
              <div key={`${player.rank}-${player.name}`} className="flex items-center gap-3 rounded-lg border border-viet-border p-3">
                <span className="w-5 text-center text-sm font-black text-viet-text-light">{player.rank}</span>
                <Avatar
                  seed={player.avatarSeed || player.name}
                  size={40}
                  streakCount={player.streakCount}
                  level={player.level}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-viet-text">{player.name}</p>
                  <p className="text-[11px] font-bold text-viet-text-light/60">{player.wins} {t('arena.stats.wins')}</p>
                </div>
                <span className="text-sm font-black text-viet-green">{player.points}</span>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-black text-viet-text">{t('arena.ui.recent_panel_title')}</h3>
          <History className="h-5 w-5 text-blue-600" />
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-viet-green" />
          </div>
        ) : battles.length === 0 ? (
          <p className="py-6 text-center text-sm font-bold text-viet-text-light/60">{t('arena.stats.empty_history')}</p>
        ) : (
          <div className="space-y-3">
            {battles.map((battle, index) => {
              const isWin = battle.result === 'win';
              const isLose = battle.result === 'lose';
              return (
                <div key={`${battle.played_at}-${index}`} className="flex items-center gap-3 rounded-lg border border-viet-border p-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg font-black ${isWin ? 'bg-viet-green/10 text-viet-green' : isLose ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>
                    {isWin ? <Trophy className="h-4 w-4" /> : isLose ? <Shield className="h-4 w-4" /> : <Award className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-viet-text">{battle.opponent_name}</p>
                    <p className="text-[11px] font-bold text-viet-text-light/60">{timeAgo(t, battle.played_at)}</p>
                  </div>
                  <span className={`text-sm font-black ${battle.pts_change > 0 ? 'text-viet-green' : battle.pts_change < 0 ? 'text-red-500' : 'text-viet-text-light'}`}>
                    {battle.pts_change > 0 ? '+' : ''}{battle.pts_change}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
};

const ModeSelector = ({ value, onChange, disabled = false }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {MODE_KEYS.map((mode) => {
        const config = MODE_CONFIG[mode];
        const Icon = config.icon;
        const active = value === mode;
        return (
          <button
            key={mode}
            type="button"
            disabled={disabled}
            onClick={() => onChange(mode)}
            className={`rounded-lg border p-3 text-left transition-all disabled:opacity-50 ${active ? 'border-viet-green bg-viet-green/10 shadow-sm' : 'border-viet-border bg-white hover:border-viet-green/40'}`}
          >
            <Icon className={`mb-3 h-5 w-5 ${active ? 'text-viet-green' : 'text-viet-text-light'}`} />
            <p className="text-sm font-black text-viet-text">{getModeShortLabel(t, mode)}</p>
            <p className="mt-1 text-[11px] font-bold text-viet-text-light/60">
              {MODE_CONFIG[mode].maxPlayers} {t('arena.ui.player_count')}
            </p>
          </button>
        );
      })}
    </div>
  );
};

const ActionCenter = ({ onFindMatch, isSearching, onCreateRoom, onJoinRoom, onOpenBrowser }) => {
  const { t, i18n } = useTranslation();
  const [joinCode, setJoinCode] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [findMode, setFindMode] = useState('solo');
  const [onlineCount, setOnlineCount] = useState(1);

  useEffect(() => {
    let active = true;
    const fetchOnlineCount = async () => {
      try {
        const res = await fetch('/api/user/online-count');
        const data = await res.json();
        if (active && data.count) setOnlineCount(data.count);
      } catch (err) {
        console.warn('Failed to fetch online count:', err.message);
      }
    };

    fetchOnlineCount();
    const interval = setInterval(fetchOnlineCount, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const handleJoin = () => {
    const code = joinCode.trim();
    if (code) onJoinRoom(code);
  };

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-lg border border-viet-border bg-white shadow-sm">
        <img
          src="/assets/images/home-viet-arena.png"
          alt={t('arena.ui.arena_image_alt')}
          className="h-56 w-full object-cover sm:h-64"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
          <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[11px] font-black uppercase tracking-widest text-viet-green">
            <Zap className="h-4 w-4" />
            {t('arena.badge')}
          </div>
          <h1 className="max-w-2xl text-4xl font-black leading-tight text-white sm:text-5xl">
            <Trans i18nKey="arena.title">
              Chemistry <span className="text-viet-green">Arena</span>
            </Trans>
          </h1>
          <p className="mt-2 max-w-xl text-sm font-bold text-white/80 sm:text-base">{t('arena.subtitle')}</p>
        </div>
      </section>

      <Panel className="p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-viet-text-light/60">{t('arena.ui.quick_match')}</p>
            <h2 className="mt-1 text-2xl font-black text-viet-text">{t('arena.actions.find_match')}</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-viet-border px-3 py-2 text-sm font-black text-viet-text">
            <span className="h-2 w-2 rounded-full bg-viet-green" />
            {onlineCount.toLocaleString(i18n.language === 'vi' ? 'vi-VN' : 'en-US')} {t('arena.ui.online_students')}
          </div>
        </div>

        <div className="mb-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[11px] font-black uppercase tracking-widest text-viet-text-light/60">{t('arena.ui.choose_mode')}</p>
            <div className="hidden items-center gap-3 text-[11px] font-black uppercase tracking-widest text-viet-text-light sm:flex">
              <span className="inline-flex items-center gap-1"><BookOpenCheck className="h-3.5 w-3.5" />{t('arena.ui.question_count')}</span>
              <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{t('arena.ui.time_limit')}</span>
            </div>
          </div>
          <ModeSelector value={findMode} onChange={setFindMode} disabled={isSearching} />
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <IconButton
            onClick={() => onFindMatch(findMode)}
            className={`min-h-12 px-5 text-sm uppercase tracking-widest text-white ${isSearching ? 'bg-red-500 hover:bg-red-600' : 'bg-viet-green hover:brightness-105'}`}
          >
            {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
            {isSearching ? t('arena.actions.cancel_find') : t('arena.actions.find_match')}
          </IconButton>
          <IconButton
            onClick={onCreateRoom}
            className="min-h-12 border border-viet-border bg-white px-5 text-sm uppercase tracking-widest text-viet-text hover:border-viet-green hover:text-viet-green"
          >
            <Plus className="h-5 w-5" />
            {t('arena.actions.create_room')}
          </IconButton>
        </div>
      </Panel>

      <Panel className="p-5 sm:p-6">
        <div className="grid gap-3 md:grid-cols-2">
          <IconButton
            onClick={() => setShowJoinInput((value) => !value)}
            className="min-h-12 border border-viet-border bg-white px-5 text-sm uppercase tracking-widest text-viet-text hover:border-blue-400 hover:text-blue-600"
          >
            <DoorOpen className="h-5 w-5" />
            {t('arena.actions.join_pin')}
          </IconButton>
          <IconButton
            onClick={onOpenBrowser}
            className="min-h-12 bg-blue-600 px-5 text-sm uppercase tracking-widest text-white hover:bg-blue-700"
          >
            <Gamepad2 className="h-5 w-5" />
            {t('arena.ui.open_room_browser')}
          </IconButton>
        </div>

        <AnimatePresence>
          {showJoinInput && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 grid gap-3 rounded-lg border border-viet-border bg-slate-50 p-4 sm:grid-cols-[minmax(0,1fr)_auto]"
            >
              <div>
                <label htmlFor="arena-pin" className="mb-2 block text-[11px] font-black uppercase tracking-widest text-viet-text-light">
                  {t('arena.ui.join_code_title')}
                </label>
                <input
                  id="arena-pin"
                  type="text"
                  value={joinCode}
                  onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handleJoin();
                  }}
                  placeholder={t('arena.actions.pin_placeholder')}
                  className="w-full rounded-lg border border-viet-border bg-white px-4 py-3 text-center text-xl font-black tracking-[0.4em] text-viet-text outline-none transition-all focus:border-viet-green"
                />
              </div>
              <div className="flex items-end gap-2">
                <IconButton
                  onClick={() => setShowJoinInput(false)}
                  className="h-12 border border-viet-border bg-white px-4 text-viet-text-light hover:text-red-500"
                >
                  <X className="h-5 w-5" />
                </IconButton>
                <IconButton
                  onClick={handleJoin}
                  disabled={!joinCode.trim()}
                  className="h-12 bg-viet-text px-5 text-sm uppercase tracking-widest text-white hover:bg-viet-green"
                >
                  <Play className="h-5 w-5" />
                  {t('arena.actions.enter')}
                </IconButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Panel>
    </div>
  );
};

const CreateRoomModal = ({ isOpen, onClose, user, onConfirm }) => {
  const { t } = useTranslation();
  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';
  const [formData, setFormData] = useState({
    name: '',
    mode: 'solo',
    difficulty: isTeacherOrAdmin ? 'easy' : 'auto',
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[140] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          onClick={(event) => event.stopPropagation()}
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-5 shadow-2xl sm:p-6"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-viet-green">{t('arena.ui.create_room_subtitle')}</p>
              <h2 className="mt-1 text-3xl font-black text-viet-text">
                <Trans i18nKey="arena.create_room.title">
                  Create <span className="text-viet-green">Room</span>
                </Trans>
              </h2>
            </div>
            <IconButton onClick={onClose} className="h-10 w-10 border border-viet-border text-viet-text-light hover:text-red-500">
              <X className="h-5 w-5" />
            </IconButton>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-viet-text-light">
                {t('arena.create_room.name_label')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                placeholder={t('arena.create_room.name_placeholder')}
                className="w-full rounded-lg border border-viet-border px-4 py-3 font-bold text-viet-text outline-none transition-all focus:border-viet-green"
              />
            </div>

            <div>
              <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-viet-text-light">{t('arena.create_room.mode_label')}</p>
              <ModeSelector value={formData.mode} onChange={(mode) => setFormData({ ...formData, mode })} />
            </div>

            <div>
              <div className="mb-3 flex items-center gap-3">
                <p className="text-[11px] font-black uppercase tracking-widest text-viet-text-light">{t('arena.create_room.difficulty_label')}</p>
                {isTeacherOrAdmin && (
                  <span className="rounded-lg bg-viet-green/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-viet-green">
                    {t('arena.create_room.admin_badge')}
                  </span>
                )}
              </div>
              {isTeacherOrAdmin ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {DIFFICULTY_KEYS.map((difficulty) => (
                    <button
                      type="button"
                      key={difficulty}
                      onClick={() => setFormData({ ...formData, difficulty })}
                      className={`rounded-lg border px-3 py-4 text-left transition-all ${formData.difficulty === difficulty ? 'border-viet-green bg-viet-green/10' : 'border-viet-border bg-white hover:border-viet-green/40'}`}
                    >
                      <p className="text-sm font-black text-viet-text">{getDifficultyLabel(t, difficulty)}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-lg border border-viet-border bg-slate-50 px-4 py-3">
                  <span className="font-black text-viet-text">
                    {t('arena.create_room.auto_grade', { grade: user?.grade || '8' })}
                  </span>
                  <Shield className="h-5 w-5 text-viet-text-light" />
                </div>
              )}
            </div>

            <IconButton
              onClick={() => onConfirm(formData)}
              disabled={!formData.name.trim()}
              className="min-h-12 w-full bg-viet-green px-5 text-sm uppercase tracking-widest text-white hover:brightness-105"
            >
              <Plus className="h-5 w-5" />
              {t('arena.create_room.submit_btn')}
            </IconButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const RoomBrowserModal = ({ isOpen, onClose, onJoin }) => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/arena/rooms');
      setRooms(data.rooms || []);
    } catch (err) {
      console.error('Room browser error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchRooms();
  }, [fetchRooms, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[140] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          onClick={(event) => event.stopPropagation()}
          className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white p-5 shadow-2xl sm:p-6"
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-viet-text">
                <Trans i18nKey="arena.browser.title">
                  Online <span className="text-viet-green">Rooms</span>
                </Trans>
              </h2>
              <p className="mt-1 text-sm font-bold text-viet-text-light">{t('arena.ui.room_browser_subtitle')}</p>
            </div>
            <div className="flex gap-2">
              <IconButton onClick={fetchRooms} className="h-10 border border-viet-border px-3 text-viet-text hover:border-viet-green hover:text-viet-green">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{t('arena.browser.refresh')}</span>
              </IconButton>
              <IconButton onClick={onClose} className="h-10 w-10 border border-viet-border text-viet-text-light hover:text-red-500">
                <X className="h-5 w-5" />
              </IconButton>
            </div>
          </div>

          <div className="min-h-[280px] flex-1 overflow-y-auto pr-1">
            {loading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-4 text-viet-text-light">
                <Loader2 className="h-8 w-8 animate-spin text-viet-green" />
                <p className="text-sm font-black uppercase tracking-widest">{t('arena.browser.scanning')}</p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-center">
                <Gamepad2 className="mb-4 h-12 w-12 text-viet-text-light/30" />
                <h3 className="text-xl font-black text-viet-text">{t('arena.browser.empty_title')}</h3>
                <p className="mt-2 max-w-sm text-sm font-bold text-viet-text-light/70">{t('arena.browser.empty_desc')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rooms.map((room) => {
                  const isFull = room.current_players >= room.max_players;
                  return (
                    <div key={room.id} className="grid gap-4 rounded-lg border border-viet-border p-4 transition-all hover:border-viet-green/40 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
                      <Avatar
                        seed={room.host_avatar?.seed || room.host_name || 'Aurum'}
                        size={56}
                        streakCount={room.host_avatar?.streakCount}
                        level={room.host_avatar?.level}
                      />
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-lg font-black text-viet-text">{room.name}</h3>
                          <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-viet-text-light">
                            {t('arena.ui.room_id', { id: room.id })}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[12px] font-black uppercase tracking-widest text-viet-text-light">
                          <span>{t('arena.ui.host_label')}: {room.host_name}</span>
                          <span>{getModeLabel(t, room.mode)}</span>
                          <span>{getDifficultyLabel(t, room.difficulty)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4 md:justify-end">
                        <div className="text-right">
                          <p className="text-lg font-black text-viet-text">
                            <span className="text-viet-green">{room.current_players}</span>/{room.max_players}
                          </p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">{t('arena.ui.player_count')}</p>
                        </div>
                        <IconButton
                          onClick={() => onJoin(room.id)}
                          disabled={isFull}
                          className="h-11 bg-viet-text px-4 text-xs uppercase tracking-widest text-white hover:bg-viet-green"
                        >
                          <Play className="h-4 w-4" />
                          {isFull ? t('arena.ui.full_room') : t('arena.browser.enter_btn')}
                        </IconButton>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

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
  const timeLeftRef = useRef(30);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    if (!isWaiting) return;
    const expectedMax = room.max_players || MODE_CONFIG[room.mode]?.maxPlayers || 2;
    const interval = setInterval(async () => {
      try {
        const data = await apiCall(`/api/arena/room/${room.id}`);
        if (data.success && data.room) {
          setCurrentPlayers(data.room.current_players);
          if (data.room.current_players >= expectedMax) setIsWaiting(false);
        }
      } catch (err) {
        console.warn('Room polling error:', err.message);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isWaiting, room.id, room.max_players, room.mode]);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoadingQ(true);
      try {
        const data = await apiCall(`/api/arena/questions/${room.difficulty || 'easy'}`);
        if (data.success) setQuestions(data.questions || []);
      } catch (err) {
        console.warn('Question load error:', err.message);
      } finally {
        setLoadingQ(false);
      }
    };
    fetchQuestions();
  }, [room.difficulty]);

  const currentQ = questions[currentQIndex];
  const timerPct = (timeLeft / 30) * 100;
  const expectedMax = room.max_players || MODE_CONFIG[room.mode]?.maxPlayers || 2;
  const canStart = currentPlayers >= expectedMax;

  const handleAnswer = useCallback((index) => {
    if (answered !== null || !currentQ || gameOver) return;
    setAnswered(index);

    const remainingTime = timeLeftRef.current;
    const isCorrect = index === currentQ.correct;
    const gained = isCorrect ? Math.max(100, remainingTime * 10) : 0;
    const finalScore = score + gained;

    if (isCorrect) {
      correctCountRef.current += 1;
      setScore(finalScore);
    }

    setTimeout(() => {
      const nextIndex = currentQIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentQIndex(nextIndex);
        setTimeLeft(30);
        setAnswered(null);
      } else {
        const result = correctCountRef.current >= Math.ceil(questions.length / 2) ? 'win' : 'lose';
        setGameOver(true);
        onMatchEnd?.({ result, score: finalScore, room_id: room.id });
      }
    }, 1200);
  }, [answered, currentQ, currentQIndex, gameOver, onMatchEnd, questions.length, room.id, score]);

  useEffect(() => {
    if (isWaiting || answered !== null || gameOver || questions.length === 0 || loadingQ) return;
    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          handleAnswer(-1);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [answered, gameOver, handleAnswer, isWaiting, loadingQ, questions.length]);

  if (loadingQ) {
    return (
      <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-slate-950 p-6 text-white">
        <Loader2 className="mb-5 h-10 w-10 animate-spin text-viet-green" />
        <p className="text-sm font-black uppercase tracking-widest text-white/70">{t('arena.room.loading')}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-slate-950 p-6 text-center text-white">
        <FlaskConical className="mb-5 h-14 w-14 text-viet-green" />
        <h2 className="text-2xl font-black">{t('arena.ui.battle_unavailable_title')}</h2>
        <p className="mt-3 max-w-md text-sm font-bold text-white/60">{t('arena.ui.battle_unavailable_desc')}</p>
        <IconButton onClick={onLeave} className="mt-8 bg-viet-green px-6 py-3 text-sm uppercase tracking-widest text-white">
          <LogOut className="h-5 w-5" />
          {t('arena.room.back_btn')}
        </IconButton>
      </div>
    );
  }

  if (isWaiting) {
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#f8faf7] p-4">
        <Panel className="w-full max-w-2xl p-5 text-center sm:p-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Users className="h-7 w-7" />
          </div>
          <p className="text-[11px] font-black uppercase tracking-widest text-viet-text-light">{t('arena.room.waiting.title')}</p>
          <h2 className="mt-2 text-4xl font-black tracking-widest text-viet-text sm:text-6xl">{room.id}</h2>
          <p className="mt-3 text-sm font-bold text-viet-text-light">{t('arena.ui.waiting_share')}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-viet-border p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">{t('arena.room.waiting.mode')}</p>
              <p className="mt-2 font-black text-viet-text">{getModeLabel(t, room.mode)}</p>
            </div>
            <div className="rounded-lg border border-viet-border p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">{t('arena.room.waiting.difficulty')}</p>
              <p className="mt-2 font-black text-viet-text">{getDifficultyLabel(t, room.difficulty)}</p>
            </div>
            <div className="rounded-lg border border-viet-border p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">{t('arena.room.waiting.players')}</p>
              <p className="mt-2 font-black text-viet-text">{currentPlayers}/{expectedMax}</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-2 flex justify-between text-[11px] font-black uppercase tracking-widest text-viet-text-light">
              <span>{t('arena.ui.ready_count')}</span>
              <span>{Math.round((currentPlayers / expectedMax) * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-viet-green" style={{ width: `${Math.min((currentPlayers / expectedMax) * 100, 100)}%` }} />
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <IconButton onClick={onLeave} className="min-h-12 border border-viet-border bg-white px-5 text-sm uppercase tracking-widest text-viet-text-light hover:text-red-500">
              <LogOut className="h-5 w-5" />
              {t('arena.room.waiting.exit_btn')}
            </IconButton>
            <IconButton
              onClick={() => setIsWaiting(false)}
              disabled={!canStart}
              className="min-h-12 bg-viet-green px-5 text-sm uppercase tracking-widest text-white hover:brightness-105"
            >
              <Play className="h-5 w-5" />
              {canStart ? t('arena.room.waiting.start_btn') : t('arena.ui.start_locked')}
            </IconButton>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-slate-950 p-4 text-white sm:p-6">
      <div className="mx-auto flex min-h-full max-w-6xl flex-col">
        <header className="mb-6 grid gap-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
          <div className="flex items-center gap-3">
            <IconButton onClick={onLeave} className="h-11 w-11 border border-white/10 bg-white/5 text-white/70 hover:text-red-300">
              <X className="h-5 w-5" />
            </IconButton>
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('arena.ui.progress_label')}</p>
              <p className="font-black">{t('arena.room.battle.question', { current: currentQIndex + 1, total: questions.length })}</p>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
              <span>{t('arena.room.battle.time')}</span>
              <span className={timeLeft <= 5 ? 'text-red-300' : 'text-viet-green'}>{timeLeft}s</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className={`h-full rounded-full ${timeLeft <= 5 ? 'bg-red-400' : 'bg-viet-green'}`}
                animate={{ width: `${timerPct}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('arena.room.battle.score')}</p>
              <p className="text-xl font-black text-white">{score}</p>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-2">
              <div className="hidden text-right sm:block">
                <p className="max-w-[120px] truncate text-sm font-black">{user?.username}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-viet-green">{t('arena.ui.avatar_synced')}</p>
              </div>
              <Avatar
                seed={user?.avatarSeed || user?.username || 'Aurum'}
                size={44}
                streakCount={user?.streakCount}
                level={user?.level}
              />
            </div>
            <div className="hidden rounded-lg border border-white/10 bg-white/5 p-1 lg:flex">
              {['vi', 'en'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => i18n.changeLanguage(lang)}
                  className={`rounded-md px-3 py-2 text-[10px] font-black uppercase ${i18n.language.startsWith(lang) ? 'bg-viet-green text-white' : 'text-white/40 hover:text-white'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center gap-5">
          <motion.section
            key={currentQIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-white/10 bg-white p-5 text-viet-text shadow-2xl sm:p-8"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="rounded-lg bg-viet-green/10 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-viet-green">
                {getDifficultyLabel(t, currentQ.difficulty || room.difficulty)}
              </span>
              <span className="text-[11px] font-black uppercase tracking-widest text-viet-text-light">
                {getModeLabel(t, room.mode)}
              </span>
            </div>
            <h2 className="text-2xl font-black leading-snug sm:text-3xl">{currentQ.question}</h2>
          </motion.section>

          <section className="grid gap-3 md:grid-cols-2">
            {(currentQ.options || []).map((option, index) => {
              const isCorrect = index === currentQ.correct;
              const isChosen = answered === index;
              let stateClass = 'border-white/10 bg-white/5 text-white hover:border-viet-green hover:bg-white/10';
              if (answered !== null && isCorrect) stateClass = 'border-viet-green bg-viet-green text-white';
              else if (answered !== null && isChosen) stateClass = 'border-red-400 bg-red-500 text-white';
              else if (answered !== null) stateClass = 'border-white/5 bg-white/5 text-white/30';

              return (
                <motion.button
                  key={`${currentQ.id || currentQIndex}-${index}`}
                  type="button"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={answered === null ? { y: -2 } : {}}
                  onClick={() => handleAnswer(index)}
                  disabled={answered !== null}
                  className={`min-h-[92px] rounded-lg border p-4 text-left transition-all ${stateClass}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm font-black">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-base font-black leading-snug">{option}</span>
                    {answered !== null && isCorrect && <CheckCircle2 className="ml-auto h-5 w-5 shrink-0" />}
                  </div>
                </motion.button>
              );
            })}
          </section>
        </main>
      </div>
    </div>
  );
};

const ModeratorDashboard = ({ room, onLeave }) => {
  const { t } = useTranslation();
  const currentPlayers = room.current_players || 1;
  const maxPlayers = room.max_players || MODE_CONFIG[room.mode]?.maxPlayers || 2;

  return (
    <div className="min-h-screen bg-[#f8faf7] px-4 pt-[120px] pb-12">
      <div className="mx-auto max-w-4xl">
        <Panel className="p-5 sm:p-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-viet-green">{t('arena.ui.moderator_title')}</p>
              <h1 className="mt-2 text-3xl font-black text-viet-text">{room.name || t('arena.moderator.leaderboard_title')}</h1>
              <p className="mt-2 text-sm font-bold text-viet-text-light">{t('arena.ui.moderator_subtitle')}</p>
            </div>
            <IconButton onClick={onLeave} className="h-11 border border-viet-border px-4 text-sm uppercase tracking-widest text-red-500 hover:bg-red-50">
              <LogOut className="h-5 w-5" />
              {t('arena.moderator.close_btn')}
            </IconButton>
          </div>

          <div className="rounded-lg border border-viet-border bg-slate-50 p-5 text-center">
            <p className="text-[11px] font-black uppercase tracking-widest text-viet-text-light">
              <Trans i18nKey="arena.moderator.instruction">
                Join with <span className="text-viet-green">PIN</span>
              </Trans>
            </p>
            <p className="mt-4 text-5xl font-black tracking-[0.25em] text-viet-text sm:text-7xl">{room.id}</p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-viet-border p-4">
              <Gamepad2 className="mb-3 h-5 w-5 text-blue-600" />
              <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">{t('arena.room.waiting.mode')}</p>
              <p className="mt-2 font-black text-viet-text">{getModeLabel(t, room.mode)}</p>
            </div>
            <div className="rounded-lg border border-viet-border p-4">
              <FlaskConical className="mb-3 h-5 w-5 text-viet-green" />
              <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">{t('arena.room.waiting.difficulty')}</p>
              <p className="mt-2 font-black text-viet-text">{getDifficultyLabel(t, room.difficulty)}</p>
            </div>
            <div className="rounded-lg border border-viet-border p-4">
              <Users className="mb-3 h-5 w-5 text-amber-600" />
              <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">{t('arena.room.waiting.players')}</p>
              <p className="mt-2 font-black text-viet-text">{currentPlayers}/{maxPlayers}</p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-viet-border p-4">
            <div className="mb-3 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-viet-text-light">
              <span>{t('arena.ui.participant_status')}</span>
              <span>{currentPlayers >= maxPlayers ? t('arena.ui.room_ready') : t('arena.ui.room_waiting')}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-viet-green" style={{ width: `${Math.min((currentPlayers / maxPlayers) * 100, 100)}%` }} />
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};

const MatchResultScreen = ({ result, score, ptsChange, onClose }) => {
  const { t } = useTranslation();
  const isWin = result === 'win';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-2xl"
      >
        <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-lg ${isWin ? 'bg-viet-green/10 text-viet-green' : 'bg-amber-50 text-amber-600'}`}>
          {isWin ? <Trophy className="h-8 w-8" /> : <RefreshCw className="h-8 w-8" />}
        </div>
        <h2 className="text-3xl font-black text-viet-text">{isWin ? t('arena.result.win') : t('arena.result.lose')}</h2>
        <p className="mt-2 text-sm font-bold text-viet-text-light">{isWin ? t('arena.result.win_desc') : t('arena.result.lose_desc')}</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-viet-border p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">{t('arena.result.score')}</p>
            <p className="mt-2 text-2xl font-black text-viet-text">{score}</p>
          </div>
          <div className="rounded-lg border border-viet-border p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">{t('arena.ui.points_change')}</p>
            <p className={`mt-2 text-2xl font-black ${ptsChange >= 0 ? 'text-viet-green' : 'text-red-500'}`}>
              {ptsChange > 0 ? '+' : ''}{ptsChange}
            </p>
          </div>
        </div>

        <IconButton onClick={onClose} className="mt-6 min-h-12 w-full bg-viet-green px-5 text-sm uppercase tracking-widest text-white hover:brightness-105">
          <Play className="h-5 w-5" />
          {t('arena.result.continue_btn')}
        </IconButton>
      </motion.div>
    </motion.div>
  );
};

const ArenaLobby = ({ user, onFindMatch, isSearching, onCreateRoom, onJoinRoom, onOpenBrowser }) => (
  <div className="min-h-screen bg-[#f8faf7] pt-[112px] pb-12">
    <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(26,26,26,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(26,26,26,0.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
    <div className="relative mx-auto grid max-w-[1380px] grid-cols-1 gap-5 px-4 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)_340px] lg:px-8">
      <ProfilePanel user={user} />
      <ActionCenter
        onFindMatch={onFindMatch}
        isSearching={isSearching}
        onCreateRoom={onCreateRoom}
        onJoinRoom={onJoinRoom}
        onOpenBrowser={onOpenBrowser}
      />
      <StatsPanel user={user} />
    </div>
  </div>
);

const Arena = () => {
  const { user, refreshUser } = useAuth();
  const { t } = useTranslation();
  const [activeRoom, setActiveRoom] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [isSearchingMatch, setIsSearchingMatch] = useState(false);
  const searchInterval = useRef(null);

  useEffect(() => {
    return () => {
      if (searchInterval.current) clearInterval(searchInterval.current);
    };
  }, []);

  const handleCreateRoom = async (formData) => {
    try {
      const max_players = MODE_CONFIG[formData.mode]?.maxPlayers || 2;
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
      setActiveRoom({ ...data.room, max_players, asModerator: isModerator });
      setIsCreateModalOpen(false);
    } catch (err) {
      console.warn('Không thể tạo phòng qua API:', err.message);
      const isModerator = user?.role === 'admin' || user?.role === 'teacher';
      setActiveRoom({
        ...formData,
        id: Math.floor(Math.random() * 900000 + 100000).toString(),
        current_players: 1,
        max_players: MODE_CONFIG[formData.mode]?.maxPlayers || 2,
        asModerator: isModerator,
      });
      setIsCreateModalOpen(false);
    }
  };

  const handleFindMatch = (modeParam) => {
    if (isSearchingMatch) {
      clearInterval(searchInterval.current);
      searchInterval.current = null;
      setIsSearchingMatch(false);
      return;
    }

    setIsSearchingMatch(true);

    const checkMatch = async () => {
      try {
        const data = await apiCall('/api/arena/find-match', {
          method: 'POST',
          body: JSON.stringify(modeParam ? { mode: modeParam } : {}),
        });
        if (data.found) {
          setIsSearchingMatch(false);
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

    checkMatch();
    searchInterval.current = setInterval(checkMatch, 3000);
  };

  const handleJoinRoom = async (code) => {
    try {
      const data = await apiCall('/api/arena/join', {
        method: 'POST',
        body: JSON.stringify({ room_id: code }),
      });
      setActiveRoom({ ...data.room, asModerator: false });
      setIsBrowserOpen(false);
    } catch (err) {
      alert(err.message || t('arena.room.join_error'));
    }
  };

  const handleLeaveRoom = useCallback(async () => {
    if (!activeRoom) return;
    const roomId = activeRoom.id;
    setActiveRoom(null);
    try {
      await apiCall('/api/arena/leave', {
        method: 'POST',
        body: JSON.stringify({ room_id: roomId }),
      });
    } catch (err) {
      if (!err.message?.includes('không tồn tại') && !err.message?.includes('404')) {
        console.warn('Lỗi khi rời phòng:', err.message);
      }
    }
  }, [activeRoom]);

  useEffect(() => {
    const handleUnload = () => {
      if (!activeRoom) return;
      const token = localStorage.getItem('token');
      const url = `${window.location.protocol}//${window.location.host}/api/arena/leave`;
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ room_id: activeRoom.id }),
        keepalive: true,
      });
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [activeRoom]);

  const handleMatchEnd = async ({ result, score, room_id }) => {
    try {
      const opponentName = activeRoom?.host_name || t('arena.result.opponent_default');
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
      await refreshUser();
    } catch (err) {
      console.warn('Match save error:', err.message);
      setMatchResult({ result, score, ptsChange: 0 });
    }
    await handleLeaveRoom();
  };

  if (activeRoom) {
    if (activeRoom.asModerator) {
      return <ModeratorDashboard room={activeRoom} onLeave={handleLeaveRoom} />;
    }
    return <PlayerRoom user={user} room={activeRoom} onLeave={handleLeaveRoom} onMatchEnd={handleMatchEnd} />;
  }

  return (
    <>
      <AnimatePresence>
        {matchResult && (
          <MatchResultScreen
            result={matchResult.result}
            score={matchResult.score}
            ptsChange={matchResult.ptsChange}
            onClose={() => setMatchResult(null)}
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
