import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Zap, Users, Layers, Mail, Plus, BookOpen, MessageSquare, Hand, RefreshCcw, AlertTriangle } from 'lucide-react';

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
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: payload[0].fill || payload[0].payload.color || '#10b981' }} />
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
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-viet-green px-5 py-2.5 text-sm font-bold text-white hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-viet-green focus-visible:ring-offset-2"
          >
            <RefreshCcw size={16} aria-hidden="true" /> Thử lại
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Bài học', value: stats.totalLessons, icon: <BookOpen className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600', link: '/admin/bai_hoc' },
    { title: 'Học sinh', value: stats.totalUsers, icon: <Users className="w-6 h-6" />, color: 'bg-green-50 text-green-600', link: '/admin/nguoi_dung' },
    { title: 'Phản hồi chưa xử lý', value: stats.unreadFeedback, icon: <MessageSquare className="w-6 h-6" />, color: 'bg-orange-50 text-orange-600', link: '/admin/feedback' },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-4 sm:p-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
              Bảng Điều Khiển
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-viet-text tracking-tight flex flex-wrap items-center gap-x-3 gap-y-1">
            Xin chào, <span className="text-viet-green break-all">{user?.username || 'Quản trị viên'}</span> <Hand className="w-8 h-8 text-yellow-500 origin-bottom-right rotate-12 shrink-0" aria-hidden="true" />
          </h1>
          <p className="text-viet-text-light mt-2 font-medium">Hệ thống quản trị Aurum.</p>
          </div>
          <button
            type="button"
            onClick={() => fetchStats()}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-viet-border bg-white px-4 py-2.5 text-xs font-black text-viet-text hover:text-viet-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-viet-green"
          >
            <RefreshCcw size={15} aria-hidden="true" /> Làm mới
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {statCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-[30px] border border-viet-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 ${card.color}`}>
                {card.icon}
              </div>
              <h3 className="text-sm font-bold text-viet-text-light uppercase tracking-wider">{card.title}</h3>
              <p className="text-3xl font-black text-viet-text mt-1">{card.value.toLocaleString('vi-VN')}</p>
              <Link 
                to={card.link}
                className="mt-4 flex items-center gap-2 text-xs font-bold text-viet-green hover:underline"
              >
                Chi tiết ➔
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[32px] border border-viet-border p-8 shadow-sm">
              <h2 className="text-xl font-bold text-viet-text mb-6">Thao tác nhanh</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Link to="/admin/bai_hoc" className="flex flex-col items-center gap-3 p-6 bg-viet-bg rounded-2xl border border-transparent hover:border-viet-green/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-viet-green">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl"><Plus className="w-6 h-6 text-viet-green" /></div>
                  <span className="text-sm font-bold text-viet-text text-center">Quản lý bài học</span>
                </Link>
                <button type="button" disabled className="flex flex-col items-center gap-3 p-6 bg-viet-bg rounded-2xl border border-transparent opacity-50 cursor-not-allowed" title="Chức năng đang được phát triển">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl"><Mail className="w-6 h-6 text-slate-500" /></div>
                  <span className="text-sm font-bold text-viet-text">Gửi thông báo</span>
                </button>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div variants={itemVariants} className="bg-white p-8 rounded-[32px] border border-viet-border shadow-sm">
                <h3 className="text-lg font-bold text-viet-text mb-6">Phân bổ khối lớp</h3>
                {stats.gradeDistribution && stats.gradeDistribution.length > 0 ? (
                  <div className="h-48 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.gradeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dx={-10} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
                        <Bar dataKey="students" radius={[0, 4, 4, 0]} maxBarSize={20}>
                          {stats.gradeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 mt-4 text-slate-400">
                    <Layers className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-sm font-medium">Chưa có dữ liệu khối lớp</p>
                  </div>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white p-8 rounded-[32px] border border-viet-border shadow-sm">
                <h2 className="text-lg font-bold text-viet-text mb-6">Tỷ lệ phản hồi</h2>
                <div className="h-48">
                  {stats.feedbackDistribution.some(d => toSafeNumber(d.value) > 0) ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.feedbackDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {stats.feedbackDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<PieTooltip />} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 mt-4 text-slate-400">
                      <Users className="w-8 h-8 mb-2 opacity-20" />
                      <p className="text-sm font-medium">Chưa có phản hồi nào</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="bg-white p-6 rounded-[32px] shadow-sm border border-viet-border">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Học sinh Xuất sắc (Top XP)
                </h3>
                <div className="space-y-3">
                  {stats.topXP && stats.topXP.length > 0 ? stats.topXP.map((student, idx) => (
                    <div key={student.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-slate-300' : idx === 2 ? 'bg-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{student.name}</p>
                          <p className="text-xs text-slate-500 font-medium">Cấp độ {student.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-viet-green">{student.xp}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">XP</p>
                      </div>
                    </div>
                  )) : <p className="text-sm text-slate-400 text-center py-4">Chưa có dữ liệu</p>}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white p-6 rounded-[32px] shadow-sm border border-viet-border">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  Học sinh Tích cực (Top Streak)
                </h3>
                <div className="space-y-3">
                  {stats.topStreak && stats.topStreak.length > 0 ? stats.topStreak.map((student, idx) => (
                    <div key={student.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${idx === 0 ? 'bg-orange-500' : idx === 1 ? 'bg-orange-400' : idx === 2 ? 'bg-orange-300' : 'bg-slate-200 text-slate-500'}`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{student.name}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-lg">
                        <p className="text-sm font-black text-orange-600">{student.streak}</p>
                        <Zap className="w-3 h-3 text-orange-500" />
                      </div>
                    </div>
                  )) : <p className="text-sm text-slate-400 text-center py-4">Chưa có dữ liệu</p>}
                </div>
              </motion.div>
            </div>
          </div>

          <aside className="bg-white rounded-[32px] border border-viet-border p-6 sm:p-8 shadow-sm h-fit">
             <h2 className="text-xl font-bold text-viet-text mb-6">Tổng quan hệ thống</h2>
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <span className="text-sm font-bold text-viet-text-light">API quản trị</span>
                   <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-md">ĐÃ KẾT NỐI</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-sm font-bold text-viet-text-light">Tổng XP học sinh</span>
                   <span className="text-sm font-black text-viet-text">{stats.totalXP.toLocaleString('vi-VN')}</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-sm font-bold text-viet-text-light">Cấp độ trung bình</span>
                   <span className="text-sm font-black text-viet-text">{stats.avgLevel.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}</span>
                </div>
                <div className="pt-5 border-t border-viet-border">
                   <p className="text-[10px] font-bold uppercase tracking-wider text-viet-text-light">Cập nhật gần nhất</p>
                   <p className="text-xs font-black text-viet-text mt-1">
                     {lastUpdatedAt?.toLocaleString('vi-VN') || 'Chưa xác định'}
                   </p>
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

