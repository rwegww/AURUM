import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import Avatar from '@/components/common/Avatar';
import { useTranslation, Trans } from 'react-i18next';
import UserActivityHistory from '@/components/profile/UserActivityHistory';
import StudyCalendar from '@/components/profile/StudyCalendar';
import { supabase } from '@/lib/supabase';
import { Bell, Mail, CalendarRange, Activity, Target, Clock, BookOpen, Lightbulb, Save } from 'lucide-react';

const ReminderToggle = ({ enabled, onChange, title, description, icon, activeColor }) => {
  const colorClasses = {
    green: {
      border: 'border-viet-green bg-white shadow-[0_8px_30px_rgba(118,192,52,0.06)]',
      iconBg: 'bg-viet-green/10 text-viet-green',
      switchBg: 'bg-viet-green',
    },
    blue: {
      border: 'border-blue-500 bg-white shadow-[0_8px_30px_rgba(59,130,246,0.06)]',
      iconBg: 'bg-blue-500/10 text-blue-600',
      switchBg: 'bg-blue-500',
    },
    purple: {
      border: 'border-purple-500 bg-white shadow-[0_8px_30px_rgba(168,85,247,0.06)]',
      iconBg: 'bg-purple-500/10 text-purple-600',
      switchBg: 'bg-purple-500',
    }
  };

  const colors = enabled ? colorClasses[activeColor] : {
    border: 'border-viet-border bg-slate-50/30 opacity-70 hover:opacity-100 hover:bg-white',
    iconBg: 'bg-slate-100 text-slate-400',
    switchBg: 'bg-slate-300'
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onChange}
      className={`relative p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex items-start gap-4 ${colors.border}`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${colors.iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <h4 className={`font-black text-[15px] leading-tight ${enabled ? 'text-viet-text' : 'text-slate-500'}`}>
          {title}
        </h4>
        <p className="text-[12px] font-medium text-slate-400 mt-1.5 leading-snug">
          {description}
        </p>
      </div>
      <div className="pt-1 select-none">
        <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${colors.switchBg}`}>
          <motion.div 
            animate={{ x: enabled ? 20 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
          />
        </div>
      </div>
    </motion.div>
  );
};


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

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser, linkAccount } = useAuth();
  const [editableSeed, setEditableSeed] = useState(user?.avatarSeed || user?.username);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPlan, setIsSavingPlan] = useState(false);
  const [planData, setPlanData] = useState({ 
    studyTime: '20:00', 
    dailyLessonTarget: 1, 
    remindersEnabled: true,
    emailEnabled: false,
    calendarEnabled: false
  });

  React.useEffect(() => {
    if (user) {
      setEditableSeed(user.avatarSeed || user.username);
      if (user.studyPlan) {
        setPlanData(user.studyPlan);
      }
    }
  }, [user]);

  const handleRandomizeAvatar = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setEditableSeed(newSeed);
  };

  const handleSaveStudyPlan = async () => {
    setIsSavingPlan(true);
    try {
      await updateUser({ studyPlan: planData });
      alert(t('profile.study_plan.success'));
    } catch (err) {
      console.error('Lỗi khi lưu kế hoạch:', err);
    } finally {
      setIsSavingPlan(false);
    }
  };

  const handleLinkGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile?linking_google=true`,
          queryParams: {
            prompt: 'select_account'
          }
        }
      });
      if (error) throw error;
    } catch (err) {
      alert('Lỗi liên kết Google: ' + err.message);
    }
  };

  React.useEffect(() => {
    const checkGoogleLink = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('linking_google') === 'true') {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          const uid = data.session.user.id;
          const email = data.session.user.email;
          const res = await linkAccount('google', uid, email);
          if (res.success) {
            alert('Liên kết Google thành công!');
          } else {
            alert(res.message);
          }
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };
    checkGoogleLink();
  }, [linkAccount]);

  const handleSaveAvatar = async () => {
    setIsSaving(true);
    try {
      await updateUser({ avatarSeed: editableSeed });
    } catch (err) {
      console.error('Lỗi khi lưu ảnh đại diện:', err);
    } finally {
      setIsSaving(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-viet-bg pt-[180px] pb-24">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Header Hero */}
        <div className="relative mb-16 px-10 py-16 bg-viet-text rounded-[40px] overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-viet-green/20 to-transparent" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="group relative">
              <div className="w-40 h-40 rounded-[40px] bg-white shadow-2xl relative flex items-center justify-center">
                <Avatar 
                  seed={editableSeed} 
                  size={160} 
                  streakCount={user.streakCount} 
                  level={user.level}
                  className="w-full h-full" 
                />
              </div>

              {/* Avatar Controls */}
              <div className="absolute -right-16 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleRandomizeAvatar}
                  className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-xl hover:scale-110 transition-transform"
                  title={t('profile.change_avatar')}
                >
                  🎲
                </button>
                {editableSeed !== (user.avatarSeed || user.username) && (
                  <button
                    onClick={handleSaveAvatar}
                    disabled={isSaving}
                    className="w-12 h-12 bg-viet-green text-white rounded-2xl shadow-xl flex items-center justify-center text-xl hover:scale-110 transition-transform disabled:opacity-50"
                    title={t('profile.save_changes')}
                  >
                    {isSaving ? '...' : '✓'}
                  </button>
                )}
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                    <h1 className="text-4xl md:text-5xl font-black text-white">{user.username}</h1>
                    <span className="px-3 py-1 bg-white/10 text-white rounded-full text-[11px] font-black uppercase tracking-widest border border-white/20">{t('profile.member_role')}</span>
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
                  <div className="text-5xl animate-bounce">🔥</div>
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
                  <span className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></span>
                  <span className="text-[13px] font-bold text-white/80">{t('profile.online_status')}</span>
                </div>

              </div>
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
            value={user.unlockedChemicals?.length || 0}
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

        {/* Study Plan Section */}
        <div className="bg-white rounded-[40px] p-10 border border-viet-border shadow-xl overflow-hidden relative mb-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-viet-green/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="text-3xl font-black text-viet-text mb-2">{t('profile.study_plan.title')}</h2>
                <p className="text-viet-text-light/60 font-medium">{t('profile.study_plan.subtitle')}</p>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-viet-green/10 rounded-2xl border border-viet-green/20">
                <Activity className="w-6 h-6 text-viet-green shrink-0 animate-pulse" />
                <div>
                  <div className="text-[11px] font-black text-viet-green uppercase tracking-widest leading-none mb-1">Tiến độ hôm nay</div>
                  <div className="text-lg font-black text-viet-text leading-none">
                    {user.todayLessonCompleted ? 'Hoàn thành' : 'Chưa hoàn thành'}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left Side: Targets & Tip */}
              <div className="lg:col-span-2 space-y-8 pr-0 lg:pr-6 border-r-0 lg:border-r border-slate-100">
                <h3 className="text-xl font-black text-viet-text mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5 text-viet-green shrink-0" /> Thiết lập mục tiêu học tập
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[13px] font-black text-viet-text uppercase tracking-widest pl-2">{t('profile.study_plan.time_label')}</label>
                    <div className="relative">
                      <input 
                        type="time" 
                        value={planData.studyTime || '20:00'}
                        onChange={(e) => setPlanData({ ...planData, studyTime: e.target.value })}
                        className="w-full h-16 bg-slate-50 border border-viet-border rounded-2xl px-6 font-black text-lg focus:border-viet-green focus:ring-4 focus:ring-viet-green/10 outline-none transition-all"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-40">
                        <Clock size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[13px] font-black text-viet-text uppercase tracking-widest pl-2">{t('profile.study_plan.target_label')}</label>
                    <div className="relative">
                      <select 
                        value={planData.dailyLessonTarget || 1}
                        onChange={(e) => setPlanData({ ...planData, dailyLessonTarget: parseInt(e.target.value) })}
                        className="w-full h-16 bg-slate-50 border border-viet-border rounded-2xl px-6 font-black text-lg focus:border-viet-green focus:ring-4 focus:ring-viet-green/10 outline-none appearance-none transition-all"
                      >
                        {[1, 2, 3, 5, 10].map(n => (
                          <option key={n} value={n}>{n} {t('common.lesson_count', { count: n })}</option>
                        ))}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                        <BookOpen size={20} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-start gap-4">
                  <Lightbulb className="w-6 h-6 text-amber-500 shrink-0" />
                  <div className="text-sm font-medium text-slate-500 leading-relaxed">
                    <p className="font-bold text-[#1a1a1a] mb-1">Mẹo duy trì thói quen học:</p>
                    Học cùng một thời điểm mỗi ngày giúp tạo phản xạ tự nhiên. Đặt mục tiêu nhỏ (1-2 bài) giúp bạn dễ dàng hoàn thành và không bị nản lòng.
                  </div>
                </div>
              </div>

              {/* Right Side: Reminders (Sleek cards) */}
              <div className="space-y-6">
                <h3 className="text-xl font-black text-viet-text flex items-center gap-2">
                  <Bell className="w-5 h-5 text-viet-green shrink-0" /> Nhắc nhở & Thông báo
                </h3>
                <div className="flex flex-col gap-4">
                  <ReminderToggle 
                    enabled={planData.remindersEnabled}
                    onChange={() => setPlanData({ ...planData, remindersEnabled: !planData.remindersEnabled })}
                    title="Nhắc nhở học tập"
                    description="Nhận thông báo nhắc nhở trực tiếp ngay trên trang web khi bạn đang trực tuyến."
                    icon={<Bell size={24} />}
                    activeColor="green"
                  />

                  <ReminderToggle 
                    enabled={planData.emailEnabled}
                    onChange={() => setPlanData({ ...planData, emailEnabled: !planData.emailEnabled })}
                    title="Nhắc nhở qua Email"
                    description="Tự động nhận email nhắc học nếu hôm nay bạn chưa hoàn thành mục tiêu học tập."
                    icon={<Mail size={24} />}
                    activeColor="blue"
                  />

                  <ReminderToggle 
                    enabled={planData.calendarEnabled}
                    onChange={() => setPlanData({ ...planData, calendarEnabled: !planData.calendarEnabled })}
                    title="Lịch học tùy chỉnh"
                    description="Cho phép bạn đặt lịch học cụ thể cho từng ngày riêng lẻ trên lịch học cá nhân."
                    icon={<CalendarRange size={24} />}
                    activeColor="purple"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleSaveStudyPlan}
                disabled={isSavingPlan}
                className="px-12 py-4 bg-viet-green hover:bg-viet-green/90 text-white rounded-2xl font-black text-md shadow-lg shadow-viet-green/20 hover:shadow-xl hover:shadow-viet-green/30 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 flex items-center gap-3"
              >
                {isSavingPlan ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    {t('profile.study_plan.saving')}
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {t('profile.study_plan.save_btn')}
                  </>
                )}
              </button>
            </div>

            <StudyCalendar planData={planData} onPlanDataChange={setPlanData} />
          </div>
        </div>

        {/* Linked Accounts Section */}
        <div className="bg-white rounded-[40px] p-10 border border-viet-border shadow-xl overflow-hidden relative mb-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-viet-text mb-2">Liên kết tài khoản</h2>
            <p className="text-viet-text-light/60 font-medium mb-10">Liên kết tài khoản Google để đăng nhập nhanh chóng và an toàn hơn</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="flex items-center justify-between p-6 rounded-3xl border-2 border-slate-100 bg-slate-50 hover:border-blue-200 transition-all">
                  <div className="flex items-center gap-4">
                     <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-10 h-10" alt="Google" />
                     <div>
                       <div className="font-bold text-slate-800 text-lg">Google</div>
                       <div className="text-sm text-slate-500 font-medium">Đăng nhập nhanh bằng Google</div>
                     </div>
                  </div>
                  {user?.linkedAccounts?.google ? (
                    <div className="px-5 py-2.5 rounded-xl text-[13px] font-black bg-green-50 text-green-600 border border-green-200 uppercase tracking-widest">
                      Đã liên kết
                    </div>
                  ) : (
                    <button 
                      onClick={handleLinkGoogle}
                      className="px-6 py-3 rounded-2xl text-[14px] font-black bg-white border-2 border-slate-200 shadow-sm text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-all uppercase tracking-widest"
                    >
                      Liên kết
                    </button>
                  )}
               </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Activity History */}
          <div className="lg:col-span-2">
            <UserActivityHistory />
          </div>

          {/* Arena Performance */}
          <div className="space-y-6 h-full flex flex-col">
            <h2 className="text-2xl font-black text-viet-text px-2">{t('profile.arena_stats.title')}</h2>
            <div className="bg-viet-text text-white rounded-[32px] p-8 shadow-xl relative overflow-hidden flex-1">
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
              {t('profile.collection.unlocked_count', { current: user.unlockedChemicals?.length || 0, total: 118 })}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {user.unlockedChemicals && user.unlockedChemicals.length > 0 ? (
              user.unlockedChemicals.map((formula, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white p-6 rounded-3xl border border-viet-border flex flex-col items-center gap-3 hover:border-viet-green transition-all shadow-sm"
                >
                  <div className="w-12 h-12 bg-viet-green/10 rounded-2xl flex items-center justify-center">
                    <span className="text-xl font-black text-viet-green">{formula}</span>
                  </div>
                  <span className="text-[11px] font-black text-viet-text-light/50 uppercase tracking-widest leading-none">{t('profile.collection.status')}</span>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-white rounded-[40px] border-2 border-dashed border-viet-border flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl">🧪</div>
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
