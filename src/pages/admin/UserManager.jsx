import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const UserManager = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Lỗi tải danh sách học sinh:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link to="/admin" className="text-viet-green font-bold text-xs mb-2 block hover:underline">← Quay lại Bảng điều khiển</Link>
            <h1 className="text-3xl font-bold text-viet-text tracking-tight">Thống kê <span className="text-viet-green">Học sinh</span></h1>
            <p className="text-viet-text-light mt-1 font-medium italic">Theo dõi quá trình rèn luyện và tiến độ của học viên.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Tìm kiếm tên học sinh..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 px-12 rounded-2xl border border-viet-border bg-white text-sm font-bold focus:border-viet-green focus:shadow-lg shadow-viet-green/5 transition-all outline-none"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-viet-text-light">🔍</span>
          </div>
        </header>

        {loading ? (
           <div className="flex justify-center py-24">
              <div className="w-12 h-12 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin" />
           </div>
        ) : (
          <div className="bg-white rounded-[32px] border border-viet-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-viet-bg/30 border-b border-viet-border">
                  <tr>
                    <th className="px-8 py-5 text-[11px] font-black text-viet-text-light uppercase tracking-widest">Người dùng</th>
                    <th className="px-8 py-5 text-[11px] font-black text-viet-text-light uppercase tracking-widest text-center">Trạng thái</th>
                    <th className="px-8 py-5 text-[11px] font-black text-viet-text-light uppercase tracking-widest text-center">Hoạt động</th>
                    <th className="px-8 py-5 text-[11px] font-black text-viet-text-light uppercase tracking-widest text-center">Tiến trình</th>
                    <th className="px-8 py-5 text-[11px] font-black text-viet-text-light uppercase tracking-widest text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-viet-border">
                  {filteredUsers.map((u, i) => (
                    <motion.tr 
                      key={u.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`hover:bg-viet-bg/10 transition-colors ${u.is_locked ? 'bg-red-50/30 opacity-80' : ''}`}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-viet-text font-black border border-viet-border">
                              {u.username.charAt(0).toUpperCase()}
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${u.isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-viet-text flex items-center gap-2">
                              {u.username}
                              {u.role === 'teacher' && <span className="bg-blue-100 text-blue-600 text-[8px] px-1.5 py-0.5 rounded font-black uppercase">Giáo viên</span>}
                              {u.is_locked && <span className="bg-red-100 text-red-600 text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest">ĐÃ KHÓA</span>}
                            </p>
                            <p className="text-[10px] text-viet-text-light font-medium uppercase mt-0.5">Tham gia: {new Date(u.createdAt).toLocaleDateString('vi-VN')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <div className="flex flex-col items-center">
                           <span className={`px-3 py-1 rounded-lg text-xs font-black ring-1 ${u.is_locked ? 'bg-red-50 text-red-500 ring-red-200' : 'bg-yellow-50 text-yellow-600 ring-yellow-200'}`}>Lv {u.level}</span>
                           <span className="text-[10px] font-bold text-viet-text-light/50 mt-1 uppercase tracking-tighter">{u.xp.toLocaleString()} XP</span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-black text-viet-text">
                            {u.active_minutes ? `${Math.floor(u.active_minutes / 60)}h ${u.active_minutes % 60}m` : '0m'}
                          </span>
                          <span className="text-[10px] font-bold text-viet-text-light/50 uppercase tracking-tighter">Tổng thời gian</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="max-w-[120px] mx-auto">
                            <div className="flex justify-between text-[10px] font-bold text-viet-text-light mb-1.5 uppercase tracking-tighter">
                               <span>Tiến trình</span>
                               <span>{(u.xp % 1000) / 10}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-viet-bg rounded-full overflow-hidden">
                               <div className="h-full bg-viet-green" style={{ width: `${(u.xp % 1000) / 10}%` }} />
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex items-center justify-end gap-3">
                           <button 
                             onClick={async () => {
                               if (!window.confirm(`Bạn có chắc muốn ${u.is_locked ? 'mở khóa' : 'khóa'} tài khoản ${u.username}?`)) return;
                               try {
                                 const token = localStorage.getItem('token');
                                 const res = await fetch(`/api/admin/users/${u.id}/lock`, {
                                   method: 'PATCH',
                                   headers: { 
                                     'Content-Type': 'application/json',
                                     'Authorization': `Bearer ${token}`
                                   },
                                   body: JSON.stringify({ isLocked: !u.is_locked })
                                 });
                                 if (res.ok) fetchUsers();
                               } catch (err) { console.error(err); }
                             }}
                             className={`px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all ${
                               u.is_locked 
                               ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50' 
                               : 'border-red-200 text-red-500 hover:bg-red-50'
                             }`}
                           >
                             {u.is_locked ? '🔓 Mở khóa' : '🔒 Khóa'}
                           </button>
                           <Link 
                             to={`/admin/users/${u.id}`}
                             className="p-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white transition-all shadow-sm"
                             title="Chi tiết"
                           >
                             👁️
                           </Link>
                         </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 && (
               <div className="py-24 text-center">
                  <span className="text-4xl mb-4 block">🔍</span>
                  <p className="text-viet-text-light font-bold">Không tìm thấy người dùng nào khớp với từ khóa</p>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManager;
