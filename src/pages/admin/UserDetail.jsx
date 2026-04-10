import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Avatar from '@/components/common/Avatar';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/admin/users/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('Không thể tải thông tin học sinh');
        
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetail();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin mb-4" />
      <p className="text-viet-text-light font-bold">Đang tải hồ sơ học viên...</p>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-50 rounded-[32px] border border-red-100 max-w-2xl mx-auto my-12">
      <span className="text-4xl mb-4 block">🚨</span>
      <h2 className="text-xl font-bold text-red-600 mb-2">Đã có lỗi xảy ra</h2>
      <p className="text-red-500 mb-6">{error}</p>
      <Link to="/admin/users" className="px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest">Quay lại danh sách</Link>
    </div>
  );

  return (
    <div className="p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12">
           <Link to="/admin/users" className="text-viet-green font-bold text-xs mb-4 block hover:underline">← Quay lại Danh sách học sinh</Link>
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-viet-green/20 to-viet-green/5 p-1 border border-viet-border shadow-inner flex items-center justify-center overflow-hidden">
                   <Avatar seed={student.avatarSeed} size={80} className="scale-125 translate-y-2" />
                </div>
                <div>
                   <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-black text-viet-text tracking-tight uppercase font-sora italic">{student.username}</h1>
                      <span className="px-3 py-1 bg-viet-green text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-md shadow-viet-green/20">Lv {student.level}</span>
                   </div>
                   <p className="text-viet-text-light mt-1 font-medium">{student.email}</p>
                   <p className="text-[10px] text-viet-text-light/60 font-black uppercase tracking-[2px] mt-2 italic">GIA NHẬP HỌC VIỆN: {new Date(student.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                 <div className="bg-white p-4 px-6 rounded-2xl border border-viet-border shadow-sm text-center min-w-[120px]">
                    <p className="text-[10px] font-black text-viet-text-light uppercase tracking-widest mb-1 opacity-40">Kinh nghiệm</p>
                    <p className="text-2xl font-black text-viet-green">{student.xp.toLocaleString()}</p>
                 </div>
                 <div className="bg-white p-4 px-6 rounded-2xl border border-viet-border shadow-sm text-center min-w-[120px]">
                    <p className="text-[10px] font-black text-viet-text-light uppercase tracking-widest mb-1 opacity-40">Bài đã học</p>
                    <p className="text-2xl font-black text-viet-text">{student.unlockedLessons?.length || 0}</p>
                 </div>
              </div>
           </div>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Progress Section */}
           <div className="lg:col-span-2 space-y-8">
              <section className="bg-white p-8 rounded-[40px] border border-viet-border shadow-sm">
                 <h2 className="text-xl font-bold text-viet-text mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-viet-green/10 flex items-center justify-center text-sm">📈</span>
                    Tiến độ Học tập
                 </h2>
                 
                 <div className="space-y-6">
                    <div className="relative pt-6">
                       <div className="flex justify-between items-end mb-2">
                          <p className="text-xs font-bold text-viet-text-light uppercase tracking-widest">Tiến trình Level {student.level}</p>
                          <p className="text-xs font-black text-viet-green">{(student.xp % 1000) / 10}%</p>
                       </div>
                       <div className="w-full h-3 bg-viet-bg rounded-full overflow-hidden border border-viet-border/50">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(student.xp % 1000) / 10}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-viet-green to-emerald-400 relative"
                          >
                             <div className="absolute inset-0 bg-white/20 animate-pulse" />
                          </motion.div>
                       </div>
                       <p className="text-[10px] font-medium text-viet-text-light/50 mt-2 italic text-right">Cần {(1000 - (student.xp % 1000)).toLocaleString()} XP nữa để đạt Cấp độ {student.level + 1}</p>
                    </div>

                    <div className="pt-8 border-t border-viet-border">
                       <h3 className="text-xs font-black text-viet-text-light uppercase tracking-[2px] mb-6">Nhiệm vụ đã hoàn thành ({student.unlockedLessons?.length || 0})</h3>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {student.unlockedLessons && student.unlockedLessons.length > 0 ? (
                            student.unlockedLessons.map((lessonId, i) => (
                              <motion.div 
                                key={lessonId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-3 p-4 bg-viet-bg/20 rounded-2xl border border-viet-border/50 hover:bg-white transition-all group"
                              >
                                 <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[10px] group-hover:bg-viet-green group-hover:text-white transition-colors duration-300">✅</div>
                                 <span className="text-xs font-bold text-viet-text">{lessonId}</span>
                              </motion.div>
                            ))
                          ) : (
                            <div className="col-span-full py-8 text-center border-2 border-dashed border-viet-border rounded-2xl bg-viet-bg/10">
                               <p className="text-sm font-bold text-viet-text-light/40">Chưa có nhiệm vụ nào hoàn thành</p>
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
              </section>

              <section className="bg-white p-8 rounded-[40px] border border-viet-border shadow-sm">
                 <h2 className="text-xl font-bold text-viet-text mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-sm">🧪</span>
                    Kho Vật chất Khám phá
                 </h2>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {student.unlockedChemicals && student.unlockedChemicals.length > 0 ? (
                      student.unlockedChemicals.map((chem, i) => (
                        <div key={i} className="aspect-square bg-white rounded-2xl border border-viet-border/50 flex flex-col items-center justify-center p-3 hover:border-viet-green/30 hover:shadow-lg hover:shadow-viet-green/5 transition-all group">
                           <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚗️</div>
                           <span className="text-[10px] font-black text-viet-text uppercase tracking-widest text-center">{chem}</span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-8 text-center border-2 border-dashed border-viet-border rounded-2xl bg-viet-bg/10">
                         <p className="text-sm font-bold text-viet-text-light/40">Kho lưu trữ chưa có vật chất nào</p>
                      </div>
                    )}
                 </div>
              </section>
           </div>

           {/* Inventory & Other Stats */}
           <div className="space-y-8">
              <section className="bg-white p-8 rounded-[40px] border border-viet-border shadow-sm">
                 <h2 className="text-lg font-bold text-viet-text mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-sm">🎒</span>
                    Hành trang
                 </h2>
                 <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                       <p className="text-[10px] font-black text-viet-text-light uppercase tracking-widest mb-3 opacity-60">Vật phẩm đã chế tạo</p>
                       <div className="flex flex-wrap gap-2">
                          {student.inventory?.craftedItems?.length > 0 ? (
                            student.inventory.craftedItems.map((item, i) => (
                              <span key={i} className="px-3 py-1 bg-white border border-viet-border rounded-lg text-[10px] font-bold text-viet-text shadow-sm">{item}</span>
                            ))
                          ) : (
                            <p className="text-[10px] font-medium text-viet-text-light italic">Chưa có thành phẩm nào</p>
                          )}
                       </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-2xl">
                       <p className="text-[10px] font-black text-viet-text-light uppercase tracking-widest mb-3 opacity-60">Nguyên liệu hiện có</p>
                       <div className="flex flex-wrap gap-2">
                          {student.inventory?.ingredients?.length > 0 ? (
                            student.inventory.ingredients.map((item, i) => (
                              <span key={i} className="px-3 py-1 bg-white border border-viet-border rounded-lg text-[10px] font-bold text-viet-text shadow-sm">{item}</span>
                            ))
                          ) : (
                            <p className="text-[10px] font-medium text-viet-text-light italic">Kho nguyên liệu trống</p>
                          )}
                       </div>
                    </div>
                 </div>
              </section>

              <section className="bg-gradient-to-br from-viet-text to-slate-800 p-8 rounded-[40px] text-white shadow-xl shadow-slate-200">
                 <h2 className="text-lg font-bold mb-6 flex items-center gap-3 uppercase tracking-tighter italic">
                    <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm">⚔️</span>
                    Đấu Trường
                 </h2>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Tỉ lệ thắng</p>
                       <p className="text-2xl font-black">{student.arenaStats?.total > 0 ? Math.round((student.arenaStats.wins / student.arenaStats.total) * 100) : 0}%</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Điểm PK</p>
                       <p className="text-2xl font-black text-viet-green">{student.arenaStats?.points || 0}</p>
                    </div>
                 </div>
                 <div className="mt-6 pt-6 border-t border-white/10 flex justify-between text-[11px] font-bold">
                    <span className="text-white/40">Tổng trận đấu:</span>
                    <span>{student.arenaStats?.total || 0}</span>
                 </div>
              </section>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
