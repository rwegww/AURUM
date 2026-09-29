import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import Avatar from '@/components/common/Avatar';
import { useTranslation, Trans } from 'react-i18next';
import UserActivityHistory from '@/components/profile/UserActivityHistory';
import { Settings as SettingsIcon, Flame, FlaskConical, Droplet, Wind, Hexagon, GraduationCap, School } from 'lucide-react';
import { chemicals } from '@/data/reactions/chemicals';

const ProfileCard = ({ title, value, icon, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-[32px] p-8 border border-viet-border shadow-sm flex flex-col items-center justify-center text-center group transition-all hover:border-viet-green/20"
  >
    <div className={`w-16 h-16 rounded-3xl ${color} flex items-center justify-center text-white mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <span className="text-[14px] font-black text-viet-text-light/50 uppercase tracking-widest mb-2">{title}</span>
    <h3 className="text-3xl font-black text-viet-text">{value}</h3>
  </motion.div>
);

const normalizeChemicalLabel = (item) => {
  if (typeof item === 'string' || typeof item === 'number') return String(item).trim();
  if (!item || typeof item !== 'object') return '';
  return String(item.formula || item.chemical_formula || item.cong_thuc || item.doi_tuong_id || '').trim();
};

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [enrolledClasses, setEnrolledClasses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;
    fetch('/api/classes?view=student', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setEnrolledClasses(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-viet-bg px-6">
        <div className="text-center">
          <h2 className="text-3xl font-black text-viet-text mb-6">{t('profile.not_logged_in')}</h2>
          <Link to="/login" className="px-10 py-4 bg-viet-green text-white rounded-full font-black text-[15px] shadow-lg shadow-viet-green/20">{t('profile.login_to_view')}</Link>
        </div>
      </div>
    );
  }

  const studentGrade = user.grade 
    || user.studyPlan?.grade 
    || user.balancingProgress?.placement?.assignedGrade 
    || null;

  const unlockedChemicals = (user.unlockedChemicals || [])
    .map(normalizeChemicalLabel)
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-viet-bg pt-[180px] pb-24">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Header Hero */}
        <div className="relative mb-16 px-10 py-16 bg-viet-text rounded-[40px] overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-viet-green/20 to-transparent" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-40 h-40 rounded-[40px] bg-white shadow-2xl relative flex items-center justify-center overflow-hidden shrink-0">
              <Avatar 
                seed={user.avatarSeed || user.username} 
                src={user.avatarUrl}
                size={160} 
                streakCount={user.streakCount} 
                level={user.level}
                className="w-full h-full" 
              />
            </div>

            <div className="text-center md:text-left flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
                    <h1 className="text-4xl md:text-5xl font-black text-white">{user.username}</h1>
                    <span className="px-3 py-1 bg-white/10 text-white rounded-full text-[11px] font-black uppercase tracking-widest border border-white/20">{t('profile.member_role')}</span>
                    
                    {studentGrade && (
                      <span className="px-3 py-1 bg-viet-green/20 text-viet-green rounded-full text-[11px] font-black uppercase tracking-widest border border-viet-green/40 flex items-center gap-1.5 shadow-sm">
                        <GraduationCap className="w-3.5 h-3.5" />
                        Khối {studentGrade}
                      </span>
                    )}

                    {enrolledClasses.map(cls => (
                      <span key={cls.id} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-[11px] font-black uppercase tracking-widest border border-blue-400/30 flex items-center gap-1.5 shadow-sm">
                        <School className="w-3.5 h-3.5" />
                        Lớp {cls.name}
                      </span>
                    ))}

                    <Link 
                      to="/settings" 
                      className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl transition-all flex items-center justify-center" 
                      title="Cài đặt"
                    >
                      <SettingsIcon className="w-4 h-4" />
                    </Link>
                  </div>
                  <p className="text-white/60 font-medium text-lg leading-relaxed mb-6">
                    <Trans
                      i18nKey="profile.member_since"
                      values={{
                        date: user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US')
                          : (i18n.language === 'vi' ? 'Sớm hơn' : 'Earlier')
                      }}
                    >
                      Thành viên ưu tú của Học viện Hóa học Aurum.<br />Đã đồng hành từ {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US')
                        : (i18n.language === 'vi' ? 'Thời gian dài' : 'a long time')}
                    </Trans>
                  </p>
                </div>

                {/* Streak Callout */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px] p-6 flex items-center gap-6 self-center md:self-auto min-w-[280px]">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-400/10 text-orange-400">
                    <Flame className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="text-3xl font-black text-white mb-1">{user.streakCount} Ngày</div>
                    <div className="text-[11px] font-black text-orange-400 uppercase tracking-widest">Chuỗi hiện tại</div>
                    <div className="mt-3 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                        style={{ width: `${Math.min((user.streakCount / 30) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-6">
                <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-viet-green animate-pulse"></span>
                  <span className="text-[13px] font-bold text-white/80">{t('profile.online_status')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Thông tin Lớp học & Khối học */}
        <div className="mb-16 bg-white rounded-[32px] p-8 border border-viet-border shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-viet-green/10 text-viet-green flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-viet-text">Thông tin Lớp học & Khối học</h3>
                <p className="text-xs font-bold text-viet-text-light">Khối trình độ và danh sách lớp học chính thức của học sinh</p>
              </div>
            </div>
            <Link to="/my-class" className="px-5 py-2.5 bg-viet-green/10 hover:bg-viet-green text-viet-green hover:text-white rounded-2xl font-black text-xs transition-all flex items-center gap-2 shrink-0">
              <School className="w-4 h-4" />
              Vào Lớp học →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card Khối học */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-viet-text-light/60">Khối trình độ học tập</span>
                <h4 className="text-2xl font-black text-viet-text mt-1">
                  {studentGrade ? `Khối ${studentGrade}` : 'Chưa phân khối'}
                </h4>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  {studentGrade ? `Đang học theo lộ trình Hóa học Lớp ${studentGrade}` : 'Chưa chọn hoặc kiểm tra phân lớp ban đầu'}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-xl shrink-0">
                {studentGrade ? `${studentGrade}` : '?'}
              </div>
            </div>

            {/* Card Lớp tham gia */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-black uppercase tracking-widest text-viet-text-light/60">Lớp học từ Giáo viên</span>
              {enrolledClasses.length > 0 ? (
                <div className="space-y-3 mt-3">
                  {enrolledClasses.map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                      <div>
                        <span className="font-black text-sm text-viet-text">{cls.name}</span>
                        {cls.teacher?.username && (
                          <span className="text-xs font-medium text-slate-500 block">GV: {cls.teacher.username}</span>
                        )}
                      </div>
                      <span className="px-3 py-1 bg-viet-green/10 text-viet-green text-xs font-black rounded-lg">
                        Mã: {cls.code}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3">
                  <p className="text-xs font-medium text-slate-500 mb-3">Chưa gia nhập lớp học nào từ Giáo viên.</p>
                  <Link to="/my-class" className="inline-block text-xs font-black text-viet-green hover:underline">
                    + Nhập mã gia nhập lớp ngay
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <ProfileCard
            title={t('profile.stats.xp')}
            value={user.xp || 0}
            color="bg-amber-500"
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>}
          />
          <ProfileCard
            title={t('profile.stats.level_title')}
            value={user.level || 1}
            color="bg-viet-green"
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          />
          <ProfileCard
            title={t('profile.stats.chemicals')}
            value={unlockedChemicals.length}
            color="bg-blue-500"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M10 2v7.5" /><path d="M14 2v7.5" /><path d="M8.5 2h7" /><path d="M14 9.32a4 4 0 1 1-4 0" /><path d="M8.5 15h7" />
              </svg>
            }
          />
          <ProfileCard
            title={t('profile.stats.arena_points')}
            value={user.arenaStats?.points || 0}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M14.5 17.5 3 6 3 3 6 3 17.5 14.5M13 19 19 13M16 16 20 20M19 21 21 19" />
              </svg>
            }
            color="bg-purple-500"
          />
        </div>

        {/* Detailed Sections */}
        <div className="mb-16 grid grid-cols-1 items-start gap-12 lg:grid-cols-3">
          {/* Activity History */}
          <div className="lg:col-span-2">
            <UserActivityHistory />
          </div>

          {/* Arena Performance */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-viet-text px-2">{t('profile.arena_stats.title')}</h2>
            <div className="relative overflow-hidden rounded-[32px] bg-viet-text p-8 text-white shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-white/60 font-bold uppercase text-[11px] tracking-widest">{t('profile.arena_stats.total_matches')}</span>
                  <span className="text-2xl font-black">{user.arenaStats?.total || 0}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-white/60 font-bold uppercase text-[11px] tracking-widest">{t('profile.arena_stats.wins')}</span>
                  <span className="text-2xl font-black text-viet-green">{user.arenaStats?.wins || 0}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-white/60 font-bold uppercase text-[11px] tracking-widest">{t('profile.arena_stats.losses')}</span>
                  <span className="text-2xl font-black text-red-400">{user.arenaStats?.losses || 0}</span>
                </div>
                <div className="pt-4">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-white/40 mb-3">
                    <span>{t('profile.arena_stats.win_rate')}</span>
                    <span>{user.arenaStats?.total > 0 ? Math.round((user.arenaStats.wins / user.arenaStats.total) * 100) : 0}%</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-viet-green rounded-full shadow-[0_0_10px_rgba(118,192,52,0.5)]"
                      style={{ width: `${user.arenaStats?.total > 0 ? (user.arenaStats.wins / user.arenaStats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Link to="/arena" className="block w-full text-center py-4 bg-viet-green/10 text-viet-green rounded-2xl font-black text-[14px] border border-viet-green/20 hover:bg-viet-green hover:text-white transition-all">
              {t('profile.arena_stats.challenge_now')}
            </Link>
          </div>
        </div>

        {/* Unlocked Chemicals */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-viet-text">{t('profile.collection.title')}</h3>
            <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[12px] font-black text-viet-text-light uppercase tracking-widest">
              {t('profile.collection.unlocked_count', { current: unlockedChemicals.length, total: 118 })}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {unlockedChemicals.length > 0 ? (
              unlockedChemicals.map((formula, i) => {
                const chemData = chemicals.find(c => c.id.toUpperCase() === formula.toUpperCase() || c.formula.toUpperCase() === formula.toUpperCase());
                
                const chemColor = chemData?.color || '#76c034';
                const IconComponent = chemData?.state === 'gas' ? Wind : chemData?.state === 'liquid' ? Droplet : Hexagon;
                
                return (
                  <motion.div
                    key={`${formula}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5, scale: 1.05 }}
                    transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 20 }}
                    className="relative bg-white p-5 rounded-[24px] border border-slate-100 flex flex-col items-center gap-4 transition-all overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg hover:border-slate-200"
                    style={{
                      boxShadow: `0 4px 20px -5px ${chemColor}30`
                    }}
                  >
                    {/* Background Glow */}
                    <div 
                      className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: `radial-gradient(circle at 50% 0%, ${chemColor}15, transparent 70%)` }}
                    />
                    
                    <div 
                      className="w-14 h-14 rounded-[20px] flex items-center justify-center relative z-10 shadow-sm border border-white/50 group-hover:rotate-12 transition-transform duration-300"
                      style={{ background: `linear-gradient(135deg, ${chemColor}20, ${chemColor}40)` }}
                    >
                      <IconComponent className="w-7 h-7 text-slate-700" strokeWidth={1.5} />
                    </div>
                    
                    <div className="text-center relative z-10 w-full">
                      <h4 className="text-lg font-black text-slate-800 leading-tight tracking-tight mb-1 truncate px-1">
                        {chemData?.formula || formula}
                      </h4>
                      <p 
                        className="text-[9px] font-black uppercase tracking-widest truncate w-full px-2"
                        style={{ color: chemData?.color && chemData.color !== '#ffffff' ? chemData.color : '#94a3b8' }}
                      >
                        {chemData?.name || t('profile.collection.status')}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center bg-white rounded-[40px] border-2 border-dashed border-viet-border flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl"><FlaskConical className="w-10 h-10 text-slate-400" /></div>
                <p className="text-viet-text-light font-medium">{t('profile.collection.empty')}</p>
                <Link to="/lab" className="text-viet-green font-black text-sm uppercase tracking-widest hover:underline">{t('profile.collection.go_to_lab')}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
