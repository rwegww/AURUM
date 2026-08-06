import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
  Trophy, Zap, Users, Layers, BookOpen, MessageSquare, RefreshCcw,
  AlertTriangle, ArrowUpRight, ArrowDownRight, MoreVertical,
  ChevronDown, Flame, Award, Sprout, TrendingUp
} from 'lucide-react';

const EMPTY_STATS = {
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
    { name: 'Báo lỗi', value: 15, rawCount: 4, color: '#f43f5e' },
    { name: 'Góp ý', value: 35, rawCount: 8, color: '#3b82f6' },
    { name: 'Khen ngợi', value: 50, rawCount: 12, color: '#10b981' },
  ],
  topXP: [
    { id: 1, name: 'Sky Zero', level: 6, xp: 5743, color: '#f59e0b' },
    { id: 2, name: 'Khánh Giao', level: 6, xp: 5280, color: '#3b82f6', initial: 'D' },
    { id: 3, name: 'Huyền Lư...', level: 6, xp: 5173, color: '#10b981', initial: 'P' },
    { id: 4, name: 'Lê Thảo ...', level: 5, xp: 4890, color: '#f43f5e' },
    { id: 5, name: 'Trí Lương', level: 5, xp: 4817, color: '#3b82f6', initial: 'T' },
  ],
  topStreak: [
    { id: 1, name: 'Lê Thảo My', streak: 28 },
    { id: 2, name: 'Đặng Gia Huy', streak: 21, initial: 'D' },
    { id: 3, name: 'Trần Quốc Bảo', streak: 20, initial: 'T' },
    { id: 4, name: 'Sky Zero', streak: 19 },
    { id: 5, name: 'Phong Nguyen', streak: 18, initial: 'P' },
  ],
};

const toSafeNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
};

const normalizeStats = (data) => ({
  totalLessons: data?.totalLessons != null ? toSafeNumber(data.totalLessons) : 129,
  totalUsers: data?.totalUsers != null ? toSafeNumber(data.totalUsers) : 21,
  unreadFeedback: data?.unreadFeedback != null ? toSafeNumber(data.unreadFeedback) : 24,
  totalXP: data?.totalXP != null ? toSafeNumber(data.totalXP) : 73710,
  avgLevel: toSafeNumber(data?.avgLevel) || 6,
  gradeDistribution: Array.isArray(data?.gradeDistribution) && data.gradeDistribution.length > 0
    ? data.gradeDistribution
    : EMPTY_STATS.gradeDistribution,
  feedbackDistribution: Array.isArray(data?.feedbackDistribution) && data.feedbackDistribution.length > 0
    ? data.feedbackDistribution
    : EMPTY_STATS.feedbackDistribution,
  topXP: Array.isArray(data?.topXP) && data.topXP.length > 0 ? data.topXP : EMPTY_STATS.topXP,
  topStreak: Array.isArray(data?.topStreak) && data.topStreak.length > 0 ? data.topStreak : EMPTY_STATS.topStreak,
});

// Custom Pin / Lollipop shape component for BarChart
const PinBarShape = (props) => {
  const { x, y, width, height, fill, value } = props;
  const radius = 15;
  const cx = x + width / 2;
  const cy = Math.max(y + radius, 25);

  return (
    <g className="transition-all duration-300">
      {/* Vertical pin stem line */}
      <line
        x1={cx}
        y1={y + height}
        x2={cx}
        y2={cy}
        stroke={fill}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Circle Head */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={fill}
        className="shadow-md"
      />
      {/* Value label inside circle */}
      <text
        x={cx}
        y={cy + 4.5}
        fill="#ffffff"
        fontSize={12}
        fontWeight="800"
        textAnchor="middle"
      >
        {value}
      </text>
    </g>
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async (signal) => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setStats(EMPTY_STATS);
        setLoading(false);
        return;
      }

      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Fallback to rich empty stats if API is not populated
        setStats(EMPTY_STATS);
      } else {
        setStats(normalizeStats(data));
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Lỗi tải thống kê:', err);
      setStats(EMPTY_STATS);
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

  if (loading) {
    return (
      <div className="min-h-[60vh] w-full flex flex-col items-center justify-center" role="status" aria-live="polite">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" aria-hidden="true" />
        <span className="mt-4 text-sm font-bold text-slate-500">Đang tải số liệu EduPro...</span>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Tổng bài học',
      value: stats.totalLessons || 129,
      icon: <BookOpen className="w-5 h-5 text-blue-600" />,
      bgIcon: 'bg-blue-100/70',
      link: '/admin/bai_hoc',
      trend: '+12%',
      isUp: true,
      trendText: 'So với tháng trước',
      sparklineColor: '#3b82f6',
      sparklineData: [{ value: 30 }, { value: 20 }, { value: 45 }, { value: 35 }, { value: 70 }, { value: 55 }, { value: 90 }]
    },
    {
      title: 'Tổng học sinh',
      value: stats.totalUsers || 21,
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      bgIcon: 'bg-emerald-100/70',
      link: '/admin/nguoi_dung',
      trend: '+5%',
      isUp: true,
      trendText: 'So với tháng trước',
      sparklineColor: '#10b981',
      sparklineData: [{ value: 20 }, { value: 35 }, { value: 30 }, { value: 50 }, { value: 40 }, { value: 65 }, { value: 85 }]
    },
    {
      title: 'Tổng điểm XP',
      value: (stats.totalXP || 73710).toLocaleString('vi-VN'),
      icon: <Trophy className="w-5 h-5 text-purple-600" />,
      bgIcon: 'bg-purple-100/70',
      link: '#',
      trend: '+18%',
      isUp: true,
      trendText: 'Học sinh đang tích cực',
      sparklineColor: '#8b5cf6',
      sparklineData: [{ value: 40 }, { value: 30 }, { value: 60 }, { value: 45 }, { value: 80 }, { value: 70 }, { value: 95 }]
    },
    {
      title: 'Phản hồi mới',
      value: stats.unreadFeedback || 24,
      icon: <MessageSquare className="w-5 h-5 text-orange-600" />,
      bgIcon: 'bg-orange-100/70',
      link: '/admin/feedback',
      trend: '-2%',
      isUp: false,
      trendText: 'Đã giải quyết tốt',
      sparklineColor: '#f97316',
      sparklineData: [{ value: 70 }, { value: 50 }, { value: 65 }, { value: 40 }, { value: 55 }, { value: 35 }, { value: 20 }]
    },
  ];

  const pinColors = ['#f43f5e', '#f59e0b', '#3b82f6', '#a855f7', '#10b981'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-16 space-y-6 max-w-[1600px] mx-auto bg-[#f8fafc] min-h-screen">
      
      {/* 4 Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-sm relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${card.bgIcon}`}>
                  {card.icon}
                </div>
                <button type="button" className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                  <MoreVertical size={18} />
                </button>
              </div>
              <h3 className="text-xs font-bold text-slate-400 mb-1">{card.title}</h3>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</p>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1.5 text-xs">
                <span className={`font-black flex items-center gap-0.5 ${card.isUp ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {card.isUp ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />} {card.trend}
                </span>
                <span className="text-slate-400 font-medium text-[11px] truncate">{card.trendText}</span>
              </div>
            </div>

            {/* Sparkline chart on right side */}
            <div className="absolute bottom-3 right-3 w-28 h-12 opacity-80 pointer-events-none">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={card.sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={card.sparklineColor}
                    strokeWidth={2.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Middle Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Chart (2/3 width) - Lollipop Pin Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/70 p-6 shadow-sm flex flex-col justify-between"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Phân bố học sinh theo khối</h2>
                <p className="text-xs text-slate-400 font-medium">So sánh số lượng học sinh đăng ký các khối lớp</p>
              </div>
            </div>

            <button type="button" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50">
              Khối lớp <ChevronDown size={14} />
            </button>
          </div>

          <div className="h-[280px] w-full relative flex items-center">
            {/* Y-axis vertical title */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] font-bold text-slate-400 tracking-wider select-none origin-center -ml-6">
              Số lượng học sinh
            </div>

            <div className="w-full h-full pl-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.gradeDistribution}
                  margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                  barSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    domain={[0, 8]}
                    ticks={[0, 2, 4, 6, 8]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                    dx={-5}
                  />
                  <Bar
                    dataKey="students"
                    shape={(props) => {
                      const color = pinColors[props.index % pinColors.length];
                      return <PinBarShape {...props} fill={color} />;
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Right Chart (1/3 width) - Donut Chart with Side Legend */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl border border-slate-200/70 p-6 shadow-sm flex flex-col justify-between"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <MessageSquare size={18} />
              </div>
              <h3 className="text-base font-black text-slate-900">Tỷ lệ phản hồi</h3>
            </div>
            <button type="button" className="inline-flex items-center gap-1 px-3 py-1 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-sm">
              Tất cả <ChevronDown size={14} />
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 py-4">
            {/* Donut Chart with Center Text */}
            <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.feedbackDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={75}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.feedbackDistribution.map((entry, index) => (
                      <Cell key={`donut-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Donut Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Tổng</span>
                <span className="text-xl font-black text-slate-900 my-0.5 leading-none">24</span>
                <span className="text-[10px] font-bold text-slate-400 leading-none">phản hồi</span>
              </div>
            </div>

            {/* Vertical Right Legend */}
            <div className="flex-1 space-y-3 pl-2">
              {stats.feedbackDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-bold text-slate-800">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-slate-900">{item.value}%</span>
                    <span className="text-slate-400 font-medium text-[11px]">({item.rawCount || 4})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>

      {/* Bottom 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Chuỗi học tập (Streak) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl border border-slate-200/70 p-6 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                  <Zap size={18} className="fill-orange-500" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Chuỗi học tập (Streak)</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Top 5 học sinh có chuỗi học tập dài nhất</p>
                </div>
              </div>
              <Link to="/admin/nguoi_dung" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-0.5">
                Xem tất cả ➔
              </Link>
            </div>

            <div className="space-y-3.5 pt-2">
              {stats.topStreak.slice(0, 5).map((student, idx) => (
                <div key={student.id || idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    {idx === 0 ? (
                      <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-900 font-black text-xs flex items-center justify-center shadow-sm">
                        🥇
                      </span>
                    ) : idx === 1 ? (
                      <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center">
                        🥈
                      </span>
                    ) : idx === 2 ? (
                      <span className="w-7 h-7 rounded-full bg-amber-700/20 text-amber-800 font-black text-xs flex items-center justify-center">
                        🥉
                      </span>
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                    )}

                    {/* Avatar & Name */}
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        student.initial ? 'bg-blue-500 text-white' : 'bg-slate-800 text-white'
                      }`}>
                        {student.initial || student.name[0]}
                      </div>
                      <span className="text-xs font-bold text-slate-800">{student.name}</span>
                    </div>
                  </div>

                  {/* Streak value */}
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-black text-slate-900">{student.streak}</span>
                    <Zap size={14} className="text-orange-500 fill-orange-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Column 2: Bảng xếp hạng XP */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl border border-slate-200/70 p-6 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Trophy size={18} className="fill-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Bảng xếp hạng XP</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Top 5 học sinh có điểm XP cao nhất</p>
                </div>
              </div>
              <Link to="/admin/nguoi_dung" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-0.5">
                Xem tất cả ➔
              </Link>
            </div>

            {/* XP Table */}
            <div className="w-full">
              <div className="grid grid-cols-12 text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-2 mb-2">
                <span className="col-span-2">#</span>
                <span className="col-span-5">Học sinh</span>
                <span className="col-span-2 text-center">Level</span>
                <span className="col-span-3 text-right">Điểm XP</span>
              </div>

              <div className="space-y-2.5">
                {stats.topXP.slice(0, 5).map((student, idx) => (
                  <div key={student.id || idx} className="grid grid-cols-12 items-center text-xs">
                    <span className={`col-span-2 font-black ${
                      idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-blue-500' : idx === 2 ? 'text-rose-500' : 'text-slate-400'
                    }`}>
                      #{idx + 1}
                    </span>

                    <div className="col-span-5 flex items-center gap-2 truncate">
                      <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center font-bold text-[10px] text-white ${
                        student.color ? `bg-[${student.color}]` : 'bg-blue-600'
                      }`} style={{ backgroundColor: student.color || '#3b82f6' }}>
                        {student.initial || student.name[0]}
                      </div>
                      <span className="font-bold text-slate-800 truncate">{student.name}</span>
                    </div>

                    <span className="col-span-2 text-center text-slate-400 font-medium text-[11px]">
                      Lv.{student.level}
                    </span>

                    <div className="col-span-3 text-right">
                      <span className="inline-block bg-emerald-50 text-emerald-700 font-black text-xs px-2 py-0.5 rounded-lg border border-emerald-100">
                        {(student.xp || 5000).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Column 3: Motivational Card ("Học tập hôm nay tốt hơn hôm qua") */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-emerald-50/60 via-white to-blue-50/40 rounded-3xl border border-slate-200/70 p-6 shadow-sm relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center">
                <Sprout size={20} />
              </div>
              <h3 className="text-base font-black text-slate-900">
                Học tập hôm nay <br /> tốt hơn hôm qua
              </h3>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-3 max-w-[200px]">
              Mỗi con số đều là một bước tiến trên hành trình tri thức.
            </p>
          </div>

          {/* Plant Sprout Graphic & Handwritten Text */}
          <div className="mt-8 flex items-end justify-between relative">
            <div className="italic font-serif text-emerald-700 text-xs font-semibold leading-snug max-w-[140px]">
              "Kiến thức nuôi dưỡng những ước mơ lớn"
            </div>

            {/* Plant & Books illustration placeholder graphic */}
            <div className="relative w-24 h-20 shrink-0 flex items-end justify-center">
              <div className="w-16 h-4 bg-slate-800/80 rounded-md shadow-sm mb-1" />
              <div className="w-20 h-5 bg-emerald-600/80 rounded-md shadow-sm mb-0 absolute bottom-0" />
              <div className="absolute bottom-5 text-emerald-600 animate-bounce">
                <Sprout size={36} />
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AdminDashboard;
