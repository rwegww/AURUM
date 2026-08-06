import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Trophy, Zap, Users, Layers, Mail, Plus, BookOpen, MessageSquare, Hand, RefreshCcw, AlertTriangle, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

const EMPTY_STATS = {
  totalLessons: 0,
  totalUsers: 0,
  unreadFeedback: 0,
  totalXP: 0,
  avgLevel: 0,
  gradeDistribution: [],
  feedbackDistribution: [],
  topXP: [],
  topStreak: [],
};

const toSafeNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
};

const normalizeStats = (data) => ({
  totalLessons: toSafeNumber(data?.totalLessons),
  totalUsers: toSafeNumber(data?.totalUsers),
  unreadFeedback: toSafeNumber(data?.unreadFeedback),
  totalXP: toSafeNumber(data?.totalXP),
  avgLevel: toSafeNumber(data?.avgLevel),
  gradeDistribution: Array.isArray(data?.gradeDistribution) ? data.gradeDistribution : [],
  feedbackDistribution: Array.isArray(data?.feedbackDistribution) ? data.feedbackDistribution : [],
  topXP: Array.isArray(data?.topXP) ? data.topXP : [],
  topStreak: Array.isArray(data?.topStreak) ? data.topStreak : [],
});

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-2xl text-white">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <p className="text-base font-black text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: payload[0].fill || payload[0].color || '#10b981' }} />
          {payload[0].value} <span className="text-xs font-bold text-slate-400">học sinh</span>
        </p>
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-2xl text-white">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{data.name}</p>
        <p className="text-base font-black text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color || '#3b82f6' }} />
          {data.value} <span className="text-xs font-bold text-slate-400">phản hồi</span>
        </p>
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const fetchStats = useCallback(async (signal) => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');

      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || 'Không thể tải thống kê quản trị.');

      setStats(normalizeStats(data));
      setLastUpdatedAt(new Date());
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Lỗi tải thống kê:', err);
      setError(err.message || 'Không thể tải thống kê quản trị.');
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
    return <div className="min-h-[60vh] w-full flex flex-col items-center justify-center" role="status" aria-live="polite">
      <div className="w-12 h-12 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin" aria-hidden="true" />
      <span className="mt-4 text-sm font-bold text-viet-text-light">Đang tải số liệu quản trị...</span>
    </div>;
  }

  if (error) {
    return (
      <div className="min-h-[60vh] p-4 flex items-center justify-center">
        <div className="w-full max-w-xl rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-sm" role="alert">
          <AlertTriangle className="w-11 h-11 text-red-500 mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-xl font-black text-viet-text">Không thể tải bảng điều khiển</h1>
          <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => fetchStats()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-viet-green px-5 py-2.5 text-sm font-bold text-white hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-viet-green"
          >
            <RefreshCcw size={16} aria-hidden="true" /> Thử lại
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Tổng bài học', value: stats.totalLessons, icon: <BookOpen className="w-5 h-5 text-blue-600" />, bgIcon: 'bg-blue-100', link: '/admin/bai_hoc', trend: '+12%', isUp: true, trendText: 'So với tháng trước', sparklineColor: '#3b82f6' },
    { title: 'Tổng học sinh', value: stats.totalUsers, icon: <Users className="w-5 h-5 text-green-600" />, bgIcon: 'bg-green-100', link: '/admin/nguoi_dung', trend: '+5%', isUp: true, trendText: 'So với tháng trước', sparklineColor: '#10b981' },
    { title: 'Tổng điểm XP', value: stats.totalXP, icon: <Trophy className="w-5 h-5 text-purple-600" />, bgIcon: 'bg-purple-100', link: '#', trend: '+18%', isUp: true, trendText: 'Học sinh đang tích cực', sparklineColor: '#8b5cf6' },
    { title: 'Phản hồi mới', value: stats.unreadFeedback, icon: <MessageSquare className="w-5 h-5 text-orange-600" />, bgIcon: 'bg-orange-100', link: '/admin/feedback', trend: '-2%', isUp: false, trendText: 'Đã giải quyết tốt', sparklineColor: '#f97316' },
  ];

  // Mock sparkline data for cards
  const sparklineData = Array(7).fill(0).map(() => ({ value: Math.floor(Math.random() * 100) + 50 }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-12 space-y-6">
      
      {/* 4 Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bgIcon}`}>
                {card.icon}
              </div>
              <Link to={card.link} className="text-xs font-bold text-slate-400 hover:text-viet-green">Chi tiết</Link>
            </div>
            <h3 className="text-sm font-bold text-slate-500 mb-1">{card.title}</h3>
            <p className="text-3xl font-black text-slate-800">{card.value.toLocaleString('vi-VN')}</p>
            
            <div className="flex items-center gap-2 mt-4 text-xs">
              <span className={`font-bold flex items-center gap-0.5 ${card.isUp ? 'text-green-500' : 'text-red-500'}`}>
                {card.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {card.trend}
              </span>
              <span className="text-slate-400 font-medium">{card.trendText}</span>
            </div>

            <div className="absolute -bottom-2 -right-4 w-32 h-16 opacity-30 pointer-events-none">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line type="monotone" dataKey="value" stroke={card.sparklineColor} strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-viet-green" /> Phân bổ học sinh theo khối
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">So sánh số lượng học sinh đăng ký các khối lớp</p>
          </div>
          <div className="flex bg-slate-100 rounded-lg p-1 text-xs font-bold">
            <button className="px-3 py-1.5 rounded-md bg-white text-slate-800 shadow-sm">Khối lớp</button>
            <button className="px-3 py-1.5 rounded-md text-slate-500 hover:text-slate-800">Tùy chỉnh</button>
          </div>
        </div>

        <div className="h-[300px]">
          {stats.gradeDistribution && stats.gradeDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.gradeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dy={10} />
                <YAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
                <Bar dataKey="students" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {stats.gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Layers className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm font-medium">Chưa có dữ liệu khối lớp</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Bottom 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tỷ lệ phản hồi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-800">Tỷ lệ phản hồi</h3>
            <select className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none">
              <option>Tất cả</option>
            </select>
          </div>
          <div className="h-48 flex-1">
            {stats.feedbackDistribution.some(d => toSafeNumber(d.value) > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.feedbackDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.feedbackDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <MessageSquare className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm font-medium">Chưa có phản hồi nào</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" /> Chuỗi học tập (Streak)
            </h3>
            <button className="text-xs font-bold text-viet-green hover:underline">Xem tất cả ➔</button>
          </div>
          <div className="space-y-4">
            {stats.topStreak && stats.topStreak.length > 0 ? stats.topStreak.slice(0, 5).map((student, idx) => (
              <div key={student.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-500 bg-slate-100 rounded-full">{idx + 1}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{student.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-sm font-black text-slate-800">{student.streak}</p>
                  <Zap className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                </div>
              </div>
            )) : <p className="text-sm text-slate-400 text-center py-4">Chưa có dữ liệu</p>}
          </div>
        </motion.div>

        {/* Top XP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" /> Bảng xếp hạng XP
            </h3>
            <button className="text-xs font-bold text-viet-green hover:underline">Xem tất cả ➔</button>
          </div>
          <div className="space-y-4">
            {stats.topXP && stats.topXP.length > 0 ? stats.topXP.slice(0, 5).map((student, idx) => (
              <div key={student.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-24">
                     <span className={`text-xs font-black ${idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-700' : 'text-slate-400'}`}>#{idx + 1}</span>
                     <p className="text-sm font-bold text-slate-800 truncate">{student.name}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium">Lv.{student.level}</p>
                <div className="text-right">
                  <span className="text-sm font-black text-viet-green bg-viet-green/10 px-2 py-0.5 rounded-md">{student.xp.toLocaleString()}</span>
                </div>
              </div>
            )) : <p className="text-sm text-slate-400 text-center py-4">Chưa có dữ liệu</p>}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AdminDashboard;
