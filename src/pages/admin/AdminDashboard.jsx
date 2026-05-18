import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Zap, Users, Layers } from 'lucide-react';

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
  const [stats, setStats] = useState({ lessons: 0, users: 0, uploads: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi tải thống kê:', err);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="h-full w-full flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin"></div>
    </div>;
  }

  const statCards = [
    { title: "Bài Học", value: stats.totalLessons, icon: "📚", color: "bg-blue-50 text-blue-600", link: "/admin/lessons" },
    { title: "Học Sinh", value: stats.totalUsers, icon: "👤", color: "bg-green-50 text-green-600", link: "/admin/users" },
    { title: "Phản Hồi", value: stats.unreadFeedback, icon: "💬", color: "bg-orange-50 text-orange-600", link: "/admin/feedback" },

  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
              Bảng Điều Khiển
            </span>
          </div>
          <h1 className="text-4xl font-bold text-viet-text tracking-tight">
            Xin chào, <span className="text-viet-green">{user?.username}</span> 👋
          </h1>
          <p className="text-viet-text-light mt-2 font-medium">Hệ thống quản trị Aurum.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-[30px] border border-viet-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 ${card.color}`}>
                {card.icon}
              </div>
              <h3 className="text-sm font-bold text-viet-text-light uppercase tracking-wider">{card.title}</h3>
              <p className="text-3xl font-black text-viet-text mt-1">{card.value}</p>
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
                <button onClick={() => alert('Chức năng Thêm bài học mới đang được hoàn thiện!')} className="flex flex-col items-center gap-3 p-6 bg-viet-bg rounded-2xl border border-transparent hover:border-viet-green/30 transition-all">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl">➕</div>
                  <span className="text-sm font-bold text-viet-text">Thêm bài học</span>
                </button>
                <div className="flex flex-col items-center gap-3 p-6 bg-viet-bg rounded-2xl border border-transparent hover:border-viet-green/30 transition-all opacity-50 cursor-not-allowed">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl">✉️</div>
                  <span className="text-sm font-bold text-viet-text">Gửi thông báo</span>
                </div>
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
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
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
                  {stats.feedbackDistribution && stats.feedbackDistribution.some(d => d.value > 0) ? (
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
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
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

          <aside className="bg-white rounded-[32px] border border-viet-border p-8 shadow-sm">
             <h2 className="text-xl font-bold text-viet-text mb-6">Trạng thái hệ thống</h2>
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <span className="text-sm font-bold text-viet-text-light">Trạng thái API</span>
                   <span className="px-2 py-1 bg-green-100 text-green-600 text-[10px] font-bold rounded-md">ĐANG HOẠT ĐỘNG</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-sm font-bold text-viet-text-light">Độ trễ DB</span>
                   <span className="text-sm font-black text-viet-text">~42ms</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-sm font-bold text-viet-text-light">Dịch vụ Media</span>
                   <span className="px-2 py-1 bg-green-100 text-green-600 text-[10px] font-bold rounded-md">ĐÃ KẾT NỐI</span>
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
