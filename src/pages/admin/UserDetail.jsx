import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Avatar from '@/components/common/Avatar';
import { FlaskConical, Beaker, TrendingUp, CheckCircle, Backpack, Swords, Shield, AlertTriangle, BookOpen, Users, RefreshCcw } from 'lucide-react';
import { craftableItems } from '@/data/labInventory';
import { RenderIcon } from '@/utils/IconMapper';

const toSafeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : fallback;
};

const formatDate = (value) => {
  if (!value) return 'Không rõ';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Không rõ' : date.toLocaleDateString('vi-VN');
};

const normalizeChemicalLabel = (item) => {
  if (typeof item === 'string' || typeof item === 'number') return String(item).trim();
  if (!item || typeof item !== 'object') return '';
  return String(item.formula || item.chemical_formula || item.cong_thuc || item.doi_tuong_id || '').trim();
};

const UserDetail = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserDetail = useCallback(async (signal) => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');

      const res = await fetch(`/api/admin/nguoi_dung/${encodeURIComponent(id)}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || 'Không thể tải thông tin người dùng.');
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Dữ liệu hồ sơ trả về không hợp lệ.');

      setStudent(data);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Lỗi tải chi tiết người dùng:', err);
      setError(err.message || 'Không thể tải thông tin người dùng.');
      setStudent(null);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => fetchUserDetail(controller.signal), 0);
    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [fetchUserDetail]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin mb-4" aria-hidden="true" />
      <p className="text-viet-text-light font-bold" role="status" aria-live="polite">Đang tải hồ sơ người dùng...</p>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-50 rounded-[32px] border border-red-100 max-w-2xl mx-auto my-12">
      <div className="mb-4 flex justify-center"><AlertTriangle className="w-10 h-10 text-red-500" /></div>
      <h2 className="text-xl font-bold text-red-600 mb-2">Đã có lỗi xảy ra</h2>
      <p className="text-red-500 mb-6">{error}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => fetchUserDetail()} className="inline-flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest">
          <RefreshCcw className="w-4 h-4" aria-hidden="true" /> Thử lại
        </button>
        <Link to="/admin/nguoi_dung" className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded-xl text-xs font-bold uppercase tracking-widest">Quay lại danh sách</Link>
      </div>
    </div>
  );

  if (!student) return null;

  const xp = toSafeNumber(student.xp);
  const level = Math.max(1, Math.floor(toSafeNumber(student.level, 1)));
  const levelProgress = (xp % 1000) / 10;
  const xpUntilNextLevel = 1000 - (xp % 1000);
  const unlockedLessons = Array.isArray(student.unlockedLessons) ? student.unlockedLessons : [];
  const unlockedChemicals = Array.from(new Set(
    (Array.isArray(student.unlockedChemicals) ? student.unlockedChemicals : [])
      .map(normalizeChemicalLabel)
      .filter(Boolean),
  ));
  const craftedItems = Array.isArray(student.inventory?.craftedItems) ? student.inventory.craftedItems : [];
  const ingredients = Array.isArray(student.inventory?.ingredients)
    ? student.inventory.ingredients.filter((item) => item && toSafeNumber(item.amount) > 0)
    : [];
  const teacherClasses = Array.isArray(student.teacherStats?.classes) ? student.teacherStats.classes : [];
  const teacherStudentCount = Math.floor(toSafeNumber(student.teacherStats?.totalStudents));
  const arenaTotal = toSafeNumber(student.arenaStats?.total);
  const arenaWins = Math.min(toSafeNumber(student.arenaStats?.wins), arenaTotal);
  const arenaWinRate = arenaTotal > 0 ? Math.round((arenaWins / arenaTotal) * 100) : 0;

  return (
    <div className="p-4 sm:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12">
           <Link to="/admin/nguoi_dung" className="text-viet-green font-bold text-xs mb-4 block hover:underline">← Quay lại Danh sách người dùng</Link>
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 min-w-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-viet-green/20 to-viet-green/5 p-1 border border-viet-border shadow-inner flex items-center justify-center overflow-hidden">
                   <Avatar seed={student.avatarSeed} size={80} className="scale-125 translate-y-2" />
                </div>
                <div className="min-w-0">
                   <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-2xl sm:text-3xl font-black text-viet-text tracking-tight uppercase font-sora italic break-all">{student.username || 'Không có tên'}</h1>
                      <span className="px-3 py-1 bg-viet-green text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-md shadow-viet-green/20">Lv {level}</span>
                   </div>
                   {student.email && <p className="text-viet-text-light mt-1 font-medium break-all">{student.email}</p>}
                   <p className="text-[10px] text-viet-text-light/60 font-black uppercase tracking-[2px] mt-2 italic">Gia nhập hệ thống: {formatDate(student.createdAt)}</p>
                </div>
              </div>
              
              {student.role === 'student' && (
                <div className="flex flex-wrap gap-4">
                   <div className="bg-white p-4 px-6 rounded-2xl border border-viet-border shadow-sm text-center min-w-[120px]">
                      <p className="text-[10px] font-black text-viet-text-light uppercase tracking-widest mb-1 opacity-40">Kinh nghiệm</p>
                      <p className="text-2xl font-black text-viet-green">{xp.toLocaleString('vi-VN')}</p>
                   </div>
                   <div className="bg-white p-4 px-6 rounded-2xl border border-viet-border shadow-sm text-center min-w-[120px]">
                      <p className="text-[10px] font-black text-viet-text-light uppercase tracking-widest mb-1 opacity-40">Bài đã học</p>
                      <p className="text-2xl font-black text-viet-text">{unlockedLessons.length}</p>
                   </div>
                </div>
              )}
           </div>
        </header>

        {/* Content Grid */}
        {student.role === 'student' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Progress Section */}
           <div className="lg:col-span-2 space-y-8">
              <section className="bg-white p-8 rounded-[40px] border border-viet-border shadow-sm">
                 <h2 className="text-xl font-bold text-viet-text mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-viet-green/10 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-viet-green" /></span>
                    Tiến độ Học tập
                 </h2>
                 
                 <div className="space-y-6">
                    <div className="relative pt-6">
                       <div className="flex justify-between items-end mb-2">
                          <p className="text-xs font-bold text-viet-text-light uppercase tracking-widest">Tiến trình cấp {level}</p>
                          <p className="text-xs font-black text-viet-green">{levelProgress.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%</p>
                       </div>
                       <div className="w-full h-3 bg-viet-bg rounded-full overflow-hidden border border-viet-border/50">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${levelProgress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-viet-green to-emerald-400 relative"
                            role="progressbar"
                            aria-label={`Tiến trình cấp ${level}`}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            aria-valuenow={levelProgress}
                          >
                             <div className="absolute inset-0 bg-white/20 animate-pulse" />
                          </motion.div>
                       </div>
                       <p className="text-[10px] font-medium text-viet-text-light/60 mt-2 italic text-right">Cần {xpUntilNextLevel.toLocaleString('vi-VN')} XP nữa để đạt cấp {level + 1}</p>
                    </div>

                    <div className="pt-8 border-t border-viet-border">
                       <h3 className="text-xs font-black text-viet-text-light uppercase tracking-[2px] mb-6">Nhiệm vụ đã hoàn thành ({unlockedLessons.length})</h3>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {unlockedLessons.length > 0 ? (
                            unlockedLessons.map((lessonId, i) => (
                              <motion.div 
                                key={lessonId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(i * 0.04, 0.3) }}
                                className="flex items-center gap-3 p-4 bg-viet-bg/20 rounded-2xl border border-viet-border/50 hover:bg-white transition-all group"
                              >
                                 <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center group-hover:bg-viet-green group-hover:text-white transition-colors duration-300">
                                   <CheckCircle className="w-4 h-4" />
                                 </div>
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
                    <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-sm"><FlaskConical className="w-4 h-4 text-orange-600" /></span>
                    Kho Vật chất Khám phá
                 </h2>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {unlockedChemicals.length > 0 ? (
                      unlockedChemicals.map((chem, i) => (
                        <div key={`${chem}-${i}`} className="aspect-square bg-white rounded-2xl border border-viet-border/50 flex flex-col items-center justify-center p-3 hover:border-viet-green/30 hover:shadow-lg hover:shadow-viet-green/5 transition-all group">
                           <div className="mb-2 flex justify-center group-hover:scale-110 transition-transform"><Beaker className="w-8 h-8 text-viet-green" /></div>
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
                    <span className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center"><Backpack className="w-4 h-4 text-purple-600" /></span>
                    Hành trang
                 </h2>
                 <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                       <p className="text-[10px] font-black text-viet-text-light uppercase tracking-widest mb-3 opacity-60">Vật phẩm đã chế tạo</p>
                       <div className="flex flex-wrap gap-2">
                          {craftedItems.length > 0 ? (
                            craftedItems.map((item, i) => {
                              const craftDef = craftableItems.find(c => c.id === item);
                              return (
                                <span key={`${String(item)}-${i}`} className="px-3 py-1 bg-white border border-viet-border rounded-lg text-[10px] font-bold text-viet-text shadow-sm flex items-center gap-1">
                                  {craftDef ? <>{craftDef.icon || <FlaskConical className="w-3 h-3 text-slate-400" />} {craftDef.name}</> : item}
                                </span>
                              );
                            })
                          ) : (
                            <p className="text-[10px] font-medium text-viet-text-light italic">Chưa có thành phẩm nào</p>
                          )}
                       </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-2xl">
                       <p className="text-[10px] font-black text-viet-text-light uppercase tracking-widest mb-3 opacity-60">Nguyên liệu hiện có</p>
                        <div className="flex flex-wrap gap-2">
                           {ingredients.length > 0 ? (
                             ingredients.map((item, i) => (
                               <span key={`${item.id || item.name || 'ingredient'}-${i}`} className="px-3 py-1 bg-white border border-viet-border rounded-lg text-[10px] font-bold text-viet-text shadow-sm flex items-center gap-1">
                                 <RenderIcon iconName={item.icon} className="w-3 h-3 text-slate-400" /> {item.name || 'Nguyên liệu'} <span className="text-viet-green">x{toSafeNumber(item.amount)}</span>
                               </span>
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
                    <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center"><Swords className="w-4 h-4 text-white" /></span>
                    Đấu Trường
                 </h2>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Tỉ lệ thắng</p>
                       <p className="text-2xl font-black">{arenaWinRate}%</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Điểm PK</p>
                       <p className="text-2xl font-black text-viet-green">{toSafeNumber(student.arenaStats?.points).toLocaleString('vi-VN')}</p>
                    </div>
                 </div>
                 <div className="mt-6 pt-6 border-t border-white/10 flex justify-between text-[11px] font-bold">
                    <span className="text-white/40">Tổng trận đấu:</span>
                    <span>{arenaTotal.toLocaleString('vi-VN')}</span>
                 </div>
              </section>
           </div>
         </div>
        ) : student.role === 'teacher' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
             <div className="bg-white p-8 rounded-[40px] border border-viet-border shadow-sm flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-6"><BookOpen className="w-8 h-8" /></div>
                 <p className="text-[10px] font-black text-viet-text-light uppercase tracking-widest mb-2 opacity-60">Tổng số Lớp học</p>
                 <p className="text-4xl font-black text-viet-text">{teacherClasses.length.toLocaleString('vi-VN')}</p>
             </div>
             <div className="bg-white p-8 rounded-[40px] border border-viet-border shadow-sm flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mb-6"><Users className="w-8 h-8" /></div>
                 <p className="text-[10px] font-black text-viet-text-light uppercase tracking-widest mb-2 opacity-60">Tổng số Học sinh</p>
                 <p className="text-4xl font-black text-viet-green">{teacherStudentCount.toLocaleString('vi-VN')}</p>
             </div>
             {teacherClasses.length > 0 ? (
               <div className="col-span-full bg-white p-8 rounded-[40px] border border-viet-border shadow-sm">
                  <h3 className="text-lg font-bold text-viet-text mb-6">Danh sách lớp đang quản lý</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     {teacherClasses.map(c => (
                        <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-viet-green/10 text-viet-green flex items-center justify-center font-black">
                             {c.gradeLevelId ?? '?'}
                           </div>
                           <div>
                             <p className="font-bold text-sm text-viet-text">{c.name || 'Lớp chưa đặt tên'}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
             ) : (
               <div className="col-span-full bg-white p-8 rounded-[40px] border border-dashed border-viet-border text-center">
                 <p className="text-sm font-bold text-viet-text-light">Giáo viên này chưa quản lý lớp học nào.</p>
               </div>
             )}
          </div>
        ) : (
          <div className="mt-8 text-center py-24 bg-white rounded-[40px] border border-viet-border shadow-sm">
             <div className="flex justify-center mb-6"><Shield className="w-16 h-16 text-slate-300" /></div>
             <h2 className="text-2xl font-black text-viet-text mb-2">Hồ sơ Quản trị viên</h2>
             <p className="text-viet-text-light font-medium">Tài khoản này có quyền quản trị tối cao. Các chỉ số được ẩn.</p>
          </div>
        )}
      </div>
    </div>
  );
};



export default UserDetail;

