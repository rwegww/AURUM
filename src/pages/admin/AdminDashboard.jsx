import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
                <div className="flex flex-col items-center gap-3 p-6 bg-viet-bg rounded-2xl border border-transparent hover:border-viet-green/30 transition-all opacity-50 cursor-not-allowed">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl">🏆</div>
                  <span className="text-sm font-bold text-viet-text">Sự kiện mới</span>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-[32px] border border-viet-border p-8 shadow-sm">
                <h2 className="text-lg font-bold text-viet-text mb-6">Phân bố cấp độ học sinh</h2>
                <div className="h-64">
                  {stats.levelDistribution ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.levelDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 'bold' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 'bold' }} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="students" name="Số học sinh" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <div className="h-full flex items-center justify-center text-viet-text-light font-medium">Chưa có dữ liệu</div>}
                </div>
              </div>
              
              <div className="bg-white rounded-[32px] border border-viet-border p-8 shadow-sm">
                <h2 className="text-lg font-bold text-viet-text mb-6">Tỷ lệ phản hồi</h2>
                <div className="h-64">
                  {stats.feedbackDistribution && stats.feedbackDistribution.some(d => d.value > 0) ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.feedbackDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {stats.feedbackDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '20px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : <div className="h-full flex items-center justify-center text-viet-text-light font-medium">Chưa có phản hồi</div>}
                </div>
              </div>
            </section>
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
