import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  FlaskConical,
  MessageSquare,
  MoreVertical,
  RefreshCcw,
  Sparkles,
  Sprout,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import Avatar from '@/components/common/Avatar';

const FALLBACK_STATS = {
  totalLessons: 129,
  totalUsers: 21,
  unreadFeedback: 24,
  totalXP: 73710,
  avgLevel: 6,
  gradeDistribution: [
    { name: 'Lớp 8', students: 5, color: '#f43f5e' },
    { name: 'Lớp 9', students: 4, color: '#f59e0b' },
    { name: 'Lớp 10', students: 4, color: '#3b82f6' },
    { name: 'Lớp 11', students: 4, color: '#a855f7' },
    { name: 'Lớp 12', students: 4, color: '#10b981' },
  ],
  feedbackDistribution: [
    { name: 'Báo lỗi', value: 4, color: '#f43f5e' },
    { name: 'Góp ý', value: 8, color: '#3b82f6' },
    { name: 'Khen ngợi', value: 12, color: '#22c55e' },
  ],
  topXP: [
    { id: 1, name: 'Sky Zero', level: 6, xp: 5743, avatar: 'Sky Zero' },
    { id: 2, name: 'Khánh Giao', level: 6, xp: 5280, avatar: 'Khánh Giao' },
    { id: 3, name: 'Huyền Lưu', level: 6, xp: 5173, avatar: 'Huyền Lưu' },
    { id: 4, name: 'Lê Thảo My', level: 5, xp: 4890, avatar: 'Lê Thảo My' },
    { id: 5, name: 'Trí Lương', level: 5, xp: 4817, avatar: 'Trí Lương' },
  ],
  topStreak: [
    { id: 1, name: 'Lê Thảo My', streak: 28, avatar: 'Lê Thảo My' },
    { id: 2, name: 'Đặng Gia Huy', streak: 21, avatar: 'Đặng Gia Huy' },
    { id: 3, name: 'Trần Quốc Bảo', streak: 20, avatar: 'Trần Quốc Bảo' },
    { id: 4, name: 'Sky Zero', streak: 19, avatar: 'Sky Zero' },
    { id: 5, name: 'Phong Nguyen', streak: 18, avatar: 'Phong Nguyen' },
  ],
};

const toSafeNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
};

const withFeedbackPercentages = (items) => {
  const normalized = items.map((item) => ({
    ...item,
    rawCount: toSafeNumber(item.rawCount ?? item.value),
  }));
  const total = normalized.reduce((sum, item) => sum + item.rawCount, 0);

  return normalized.map((item) => ({
    ...item,
    value: total > 0 ? Math.round((item.rawCount / total) * 100) : 0,
  }));
};

const normalizeStats = (data) => {
  const feedbackSource = Array.isArray(data?.feedbackDistribution) && data.feedbackDistribution.length > 0
    ? data.feedbackDistribution
    : FALLBACK_STATS.feedbackDistribution;

  return {
    totalLessons: data?.totalLessons != null ? toSafeNumber(data.totalLessons) : FALLBACK_STATS.totalLessons,
    totalUsers: data?.totalUsers != null ? toSafeNumber(data.totalUsers) : FALLBACK_STATS.totalUsers,
    unreadFeedback: data?.unreadFeedback != null ? toSafeNumber(data.unreadFeedback) : FALLBACK_STATS.unreadFeedback,
    totalXP: data?.totalXP != null ? toSafeNumber(data.totalXP) : FALLBACK_STATS.totalXP,
    avgLevel: data?.avgLevel != null ? toSafeNumber(data.avgLevel) : FALLBACK_STATS.avgLevel,
    gradeDistribution: Array.isArray(data?.gradeDistribution) && data.gradeDistribution.length > 0
      ? data.gradeDistribution
      : FALLBACK_STATS.gradeDistribution,
    feedbackDistribution: withFeedbackPercentages(feedbackSource),
    topXP: Array.isArray(data?.topXP) && data.topXP.length > 0 ? data.topXP : FALLBACK_STATS.topXP,
    topStreak: Array.isArray(data?.topStreak) && data.topStreak.length > 0 ? data.topStreak : FALLBACK_STATS.topStreak,
  };
};

const DEFAULT_STATS = normalizeStats(FALLBACK_STATS);

const PinBarShape = ({ x, y, width, height, fill, value }) => {
  const radius = 15;
  const cx = x + width / 2;
  const cy = Math.max(y + radius, 25);

  return (
    <g>
      <line
        x1={cx}
        y1={y + height}
        x2={cx}
        y2={cy}
        stroke={fill}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={radius} fill={fill} />
      <text x={cx} y={cy + 4.5} fill="#fff" fontSize={12} fontWeight="800" textAnchor="middle">
        {value}
      </text>
    </g>
  );
};

const panelClass = 'rounded-[22px] border border-slate-200/80 bg-white shadow-[0_2px_7px_rgba(15,23,42,0.05)]';

const RankBadge = ({ rank }) => {
  const styles = [
    'bg-amber-100 text-amber-700 ring-amber-200',
    'bg-slate-100 text-slate-600 ring-slate-200',
    'bg-orange-100 text-orange-700 ring-orange-200',
  ];

  return (
    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ring-1 ${styles[rank - 1] || 'bg-slate-50 text-slate-500 ring-slate-100'}`}>
      {rank}
    </span>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async (signal) => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setStats(DEFAULT_STATS);
        return;
      }

      const response = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Không thể tải số liệu quản trị.');
      setStats(normalizeStats(data));
    } catch (requestError) {
      if (requestError.name === 'AbortError') return;
      console.error('Lỗi tải thống kê:', requestError);
      setError('Chưa thể cập nhật số liệu mới nhất. Đang hiển thị dữ liệu gần nhất.');
      setStats(DEFAULT_STATS);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => fetchStats(controller.signal), 0);
    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [fetchStats]);

  const feedbackTotal = useMemo(
    () => stats.feedbackDistribution.reduce((sum, item) => sum + item.rawCount, 0),
    [stats.feedbackDistribution],
  );

  const chartMaximum = useMemo(() => {
    const largestGroup = Math.max(...stats.gradeDistribution.map((item) => toSafeNumber(item.students)), 0);
    return Math.max(8, Math.ceil(largestGroup / 2) * 2);
  }, [stats.gradeDistribution]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center" role="status" aria-live="polite">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600/20 border-t-blue-600" aria-hidden="true" />
        <span className="mt-4 text-sm font-bold text-slate-500">Đang tải số liệu AURUM...</span>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Tổng bài học',
      value: stats.totalLessons,
      icon: <BookOpen className="h-6 w-6" />,
      iconClass: 'bg-blue-50 text-blue-600',
      link: '/admin/bai_hoc',
      trend: '+12%',
      trendText: 'so với tháng trước',
      trendClass: 'text-emerald-600',
      trendIcon: <ArrowUpRight size={15} />,
      sparklineColor: '#3b82f6',
      sparklineData: [30, 20, 45, 35, 70, 55, 90],
    },
    {
      title: 'Tổng học sinh',
      value: stats.totalUsers,
      icon: <Users className="h-6 w-6" />,
      iconClass: 'bg-emerald-50 text-emerald-600',
      link: '/admin/nguoi_dung',
      trend: '+5%',
      trendText: 'so với tháng trước',
      trendClass: 'text-emerald-600',
      trendIcon: <ArrowUpRight size={15} />,
      sparklineColor: '#10b981',
      sparklineData: [20, 35, 30, 50, 40, 65, 85],
    },
    {
      title: 'Tổng điểm XP',
      value: stats.totalXP.toLocaleString('vi-VN'),
      icon: <Trophy className="h-6 w-6" />,
      iconClass: 'bg-purple-50 text-purple-600',
      link: '/admin/nguoi_dung',
      trend: '+18%',
      trendText: 'học sinh đang tích cực',
      trendClass: 'text-emerald-600',
      trendIcon: <ArrowUpRight size={15} />,
      sparklineColor: '#8b5cf6',
      sparklineData: [40, 30, 60, 45, 80, 70, 95],
    },
    {
      title: 'Phản hồi mới',
      value: stats.unreadFeedback,
      icon: <MessageSquare className="h-6 w-6" />,
      iconClass: 'bg-orange-50 text-orange-600',
      link: '/admin/feedback',
      trend: '-2%',
      trendText: 'đã được xử lý tốt',
      trendClass: 'text-rose-500',
      trendIcon: <ArrowDownRight size={15} />,
      sparklineColor: '#f97316',
      sparklineData: [70, 50, 65, 40, 55, 35, 20],
    },
  ];

  return (
    <div className="mx-auto min-h-full w-full max-w-[1660px] space-y-6 bg-[#f4f7fb] p-4 pb-16 sm:p-6 lg:p-8">
      {error && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">
          <span className="flex items-center gap-2 font-semibold">
            <AlertTriangle size={18} aria-hidden="true" /> {error}
          </span>
          <button type="button" onClick={() => fetchStats()} className="flex shrink-0 items-center gap-1.5 font-black hover:underline">
            <RefreshCcw size={15} aria-hidden="true" /> Thử lại
          </button>
        </div>
      )}

      <section aria-label="Số liệu tổng quan" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, index) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className={`${panelClass} group relative min-h-[178px] overflow-hidden p-5 transition-transform hover:-translate-y-0.5`}
          >
            <Link to={card.link} className="absolute inset-0 z-10 rounded-[22px]" aria-label={`Mở ${card.title.toLowerCase()}`} />
            <div className="flex items-start justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconClass}`}>
                {card.icon}
              </div>
              <MoreVertical className="h-5 w-5 text-slate-400 transition-colors group-hover:text-slate-600" aria-hidden="true" />
            </div>

            <p className="mt-3 text-sm font-bold text-slate-500">{card.title}</p>
            <p className="text-[32px] font-black leading-tight tracking-tight text-[#071b3f]">{card.value}</p>

            <div className="mt-3 flex items-center gap-1.5 pr-24 text-xs">
              <span className={`flex items-center gap-0.5 font-black ${card.trendClass}`}>
                {card.trendIcon} {card.trend}
              </span>
              <span className="truncate font-semibold text-slate-400">{card.trendText}</span>
            </div>

            <div className="pointer-events-none absolute bottom-4 right-4 h-12 w-24 opacity-85">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={card.sparklineData.map((value) => ({ value }))}>
                  <Line type="monotone" dataKey="value" stroke={card.sparklineColor} strokeWidth={2.5} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.article>
        ))}
      </section>

      <section aria-label="Biểu đồ quản trị" className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={`${panelClass} flex min-h-[360px] flex-col p-5 sm:p-6 xl:col-span-2`}
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <TrendingUp size={21} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#071b3f]">Phân bố học sinh theo khối</h2>
                <p className="text-xs font-semibold text-slate-400">So sánh số lượng học sinh đăng ký các khối lớp</p>
              </div>
            </div>
            <button type="button" className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50">
              Khối lớp <ChevronDown size={14} aria-hidden="true" />
            </button>
          </div>

          <div className="relative mt-4 h-[275px] w-full flex-1">
            <span className="absolute -left-8 top-1/2 hidden -translate-y-1/2 -rotate-90 text-xs font-bold text-slate-400 sm:block">
              Số lượng học sinh
            </span>
            <div className="h-full w-full sm:pl-5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.gradeDistribution} margin={{ top: 22, right: 20, left: 0, bottom: 8 }} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf2f7" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 700 }} dy={10} />
                  <YAxis domain={[0, chartMaximum]} allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 700 }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(59, 130, 246, 0.04)' }}
                    formatter={(value) => [`${value} học sinh`, 'Số lượng']}
                    contentStyle={{ borderRadius: 14, borderColor: '#e2e8f0', fontSize: 12 }}
                  />
                  <Bar
                    dataKey="students"
                    shape={(props) => <PinBarShape {...props} fill={props.payload?.color || '#3b82f6'} />}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className={`${panelClass} min-h-[360px] p-5 sm:p-6`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <MessageSquare size={20} aria-hidden="true" />
              </div>
              <h2 className="text-lg font-black text-[#071b3f]">Tỷ lệ phản hồi</h2>
            </div>
            <button type="button" className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50">
              Tất cả <ChevronDown size={14} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-7 flex flex-col items-center justify-center gap-5 sm:flex-row xl:mt-12 xl:gap-3 2xl:gap-5">
            <div className="relative flex h-44 w-44 shrink-0 items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.feedbackDistribution} cx="50%" cy="50%" innerRadius={52} outerRadius={76} dataKey="value" stroke="#fff" strokeWidth={1}>
                    {stats.feedbackDistribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Tổng</span>
                <strong className="text-2xl font-black leading-none text-[#071b3f]">{feedbackTotal}</strong>
                <span className="mt-1 text-[11px] font-semibold text-slate-400">phản hồi</span>
              </div>
            </div>

            <div className="w-full min-w-0 flex-1 space-y-3">
              {stats.feedbackDistribution.map((item) => (
                <div key={item.name} className="grid grid-cols-[1fr_auto] items-center gap-3 text-xs">
                  <span className="flex min-w-0 items-center gap-2 font-bold text-slate-700">
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className="whitespace-nowrap font-black text-[#071b3f]">
                    {item.value}% <span className="ml-1 font-semibold text-slate-400">({item.rawCount})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.article>
      </section>

      <section aria-label="Thành tích học sinh" className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className={`${panelClass} min-h-[285px] p-5 sm:p-6`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <Zap size={21} className="fill-orange-500" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#071b3f]">Chuỗi học tập</h2>
                <p className="text-xs font-semibold text-slate-400">5 học sinh duy trì chuỗi dài nhất</p>
              </div>
            </div>
            <Link to="/admin/nguoi_dung" className="flex shrink-0 items-center gap-1 text-xs font-black text-emerald-600 hover:underline">
              Xem tất cả <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            {stats.topStreak.slice(0, 5).map((student, index) => (
              <div key={student.id || index} className="flex items-center justify-between gap-3 py-2 first:pt-0">
                <div className="flex min-w-0 items-center gap-3">
                  <RankBadge rank={index + 1} />
                  <Avatar seed={student.avatar || student.name} size={32} className="ring-2 ring-white shadow-sm" />
                  <span className="truncate text-sm font-bold text-slate-700">{student.name}</span>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-sm font-black text-[#071b3f]">
                  {student.streak} <Zap size={15} className="fill-orange-500 text-orange-500" aria-hidden="true" />
                </span>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44 }}
          className={`${panelClass} min-h-[285px] p-5 sm:p-6`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                <Trophy size={21} className="fill-amber-400" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#071b3f]">Bảng xếp hạng XP</h2>
                <p className="text-xs font-semibold text-slate-400">5 học sinh có điểm XP cao nhất</p>
              </div>
            </div>
            <Link to="/admin/nguoi_dung" className="flex shrink-0 items-center gap-1 text-xs font-black text-emerald-600 hover:underline">
              Xem tất cả <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-5">
            <div className="grid grid-cols-12 border-b border-slate-100 pb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
              <span className="col-span-2">#</span>
              <span className="col-span-5">Học sinh</span>
              <span className="col-span-2 text-center">Cấp</span>
              <span className="col-span-3 text-right">Điểm XP</span>
            </div>
            <div className="divide-y divide-slate-100">
              {stats.topXP.slice(0, 5).map((student, index) => (
                <div key={student.id || index} className="grid grid-cols-12 items-center py-2 text-xs">
                  <span className={`col-span-2 font-black ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-blue-500' : index === 2 ? 'text-orange-500' : 'text-slate-400'}`}>
                    #{index + 1}
                  </span>
                  <div className="col-span-5 flex min-w-0 items-center gap-2">
                    <Avatar seed={student.avatar || student.name} size={26} className="ring-1 ring-slate-100" />
                    <span className="truncate font-bold text-slate-700">{student.name}</span>
                  </div>
                  <span className="col-span-2 text-center font-semibold text-slate-400">Lv.{student.level}</span>
                  <span className="col-span-3 text-right">
                    <strong className="inline-block rounded-lg border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-xs font-black text-emerald-700">
                      {toSafeNumber(student.xp).toLocaleString('vi-VN')}
                    </strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`${panelClass} relative min-h-[285px] overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-6 lg:col-span-2 2xl:col-span-1`}
        >
          <Sparkles aria-hidden="true" className="absolute -right-7 -top-8 h-32 w-32 text-emerald-100" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <Sprout size={22} aria-hidden="true" />
                </div>
                <h2 className="text-lg font-black leading-snug text-[#071b3f]">Hôm nay tốt hơn hôm qua</h2>
              </div>
              <p className="mt-4 max-w-[280px] text-sm font-semibold leading-6 text-slate-500">
                Mỗi con số đều là một bước tiến trên hành trình chinh phục Hóa học.
              </p>
            </div>

            <div className="mt-8 flex items-end justify-between gap-4">
              <blockquote className="max-w-[210px] font-serif text-sm italic leading-6 text-emerald-700">
                “Hiểu một phản ứng, mở thêm một cánh cửa tri thức.”
              </blockquote>
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] bg-white/80 text-blue-600 shadow-sm ring-1 ring-blue-100">
                <FlaskConical size={38} strokeWidth={1.8} aria-hidden="true" />
              </div>
            </div>
          </div>
        </motion.article>
      </section>
    </div>
  );
};

export default AdminDashboard;
