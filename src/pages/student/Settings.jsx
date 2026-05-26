import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import Avatar from '@/components/common/Avatar';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Bell, Mail, Target, Clock, BookOpen, Save, User, Lock, ArrowLeft, RefreshCw } from 'lucide-react';

const ReminderToggle = ({ enabled, onChange, title, icon, activeColor }) => {
  const colorClasses = {
    green: {
      border: 'border-viet-green bg-white shadow-sm',
      iconBg: 'bg-viet-green/10 text-viet-green',
      switchBg: 'bg-viet-green',
    },
    blue: {
      border: 'border-blue-500 bg-white shadow-sm',
      iconBg: 'bg-blue-500/10 text-blue-600',
      switchBg: 'bg-blue-500',
    }
  };

  const colors = enabled ? colorClasses[activeColor] : {
    border: 'border-viet-border bg-white/50 opacity-80 hover:opacity-100',
    iconBg: 'bg-slate-100 text-slate-400',
    switchBg: 'bg-slate-200'
  };

  return (
    <motion.div
      whileHover={{ y: -1 }}
      onClick={onChange}
      className={`relative p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${colors.border}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${colors.iconBg}`}>
          {icon}
        </div>
        <span className={`font-black text-[13px] ${enabled ? 'text-viet-text' : 'text-slate-500'}`}>
          {title}
        </span>
      </div>
      <div className="select-none">
        <div className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${colors.switchBg}`}>
          <motion.div 
            animate={{ x: enabled ? 18 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
          />
        </div>
      </div>
    </motion.div>
  );
};

const STUDY_PLAN_DEFAULTS = {
  studyTime: '00:00',
  dailyLessonTarget: 1,
  remindersEnabled: true,
  emailEnabled: false
};

const Settings = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [editableSeed, setEditableSeed] = useState(user?.avatarSeed || user?.username);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [isSavingPlan, setIsSavingPlan] = useState(false);
  const [planData, setPlanData] = useState(STUDY_PLAN_DEFAULTS);
  
  // Credentials edit state
  const [username, setUsername] = useState(user?.username || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loadingUsername, setLoadingUsername] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setEditableSeed(user.avatarSeed || user.username);
      setUsername(user.username || '');
      if (user.studyPlan) {
        setPlanData({ ...STUDY_PLAN_DEFAULTS, ...user.studyPlan });
      }
    }
  }, [user]);

  const handleRandomizeAvatar = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setEditableSeed(newSeed);
  };

  const handleSaveAvatar = async () => {
    setIsSavingAvatar(true);
    try {
      await updateUser({ avatarSeed: editableSeed });
      alert("Đã cập nhật Avatar thành công!");
    } catch (err) {
      console.error('Lỗi khi lưu ảnh đại diện:', err);
    } finally {
      setIsSavingAvatar(false);
    }
  };

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoadingUsername(true);
    setUsernameError('');
    try {
      const res = await updateUser({ username: username.trim() });
      if (res.success) {
        alert("Đã cập nhật tên tài khoản thành công!");
      } else {
        setUsernameError(res.message || 'Lỗi cập nhật tên tài khoản');
      }
    } catch (err) {
      setUsernameError(err.message);
    } finally {
      setLoadingUsername(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      setPasswordError("Vui lòng nhập mật khẩu mới");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp");
      return;
    }
    setLoadingPassword(true);
    setPasswordError('');
    try {
      const res = await updateUser({ password: newPassword });
      if (res.success) {
        alert("Đã cập nhật mật khẩu thành công!");
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(res.message || 'Lỗi cập nhật mật khẩu');
      }
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setLoadingPassword(false);
    }
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

  const handleToggleEmailReminder = () => {
    if (!planData.emailEnabled && !user?.email) {
      alert('Tài khoản này chưa có email, không thể bật nhắc nhở qua email.');
      return;
    }
    setPlanData({ ...planData, emailEnabled: !planData.emailEnabled });
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-viet-bg px-6">
        <div className="text-center">
          <h2 className="text-3xl font-black text-viet-text mb-6">Bạn chưa đăng nhập</h2>
          <Link to="/login" className="px-10 py-4 bg-viet-green text-white rounded-full font-black text-[15px] shadow-lg shadow-viet-green/20">Đến trang đăng nhập</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-viet-bg pt-[150px] pb-24">
      <div className="max-w-[1000px] mx-auto px-6">
        
        {/* Back navigation & Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-viet-text tracking-tight mb-2">Cài Đặt Tài Khoản</h1>
            <p className="text-viet-text-light/60 font-medium text-sm">Quản lý bảo mật, nhắc nhở học tập và thông tin cá nhân của bạn</p>
          </div>
          <Link 
            to="/profile" 
            className="flex items-center gap-2 px-5 py-3 border border-viet-border bg-white rounded-2xl text-[13px] font-black text-viet-text hover:bg-slate-50 transition-all uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại Hồ Sơ
          </Link>
        </div>

        {/* 2-Column Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Avatar modification */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-viet-border rounded-[32px] p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-viet-green/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              
              <h2 className="text-lg font-black text-viet-text mb-6 w-full text-left">Ảnh đại diện</h2>
              
              <div className="w-44 h-44 rounded-[40px] bg-white border border-viet-border relative flex items-center justify-center shadow-md p-1">
                <Avatar 
                  seed={editableSeed} 
                  size={160} 
                  streakCount={user.streakCount} 
                  level={user.level}
                  className="w-full h-full" 
                />
              </div>

              <div className="flex gap-3 mt-8 w-full">
                <button
                  onClick={handleRandomizeAvatar}
                  className="flex-1 py-3.5 bg-slate-50 border-2 border-slate-200 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} /> Ngẫu nhiên
                </button>
                
                {editableSeed !== (user.avatarSeed || user.username) && (
                  <button
                    onClick={handleSaveAvatar}
                    disabled={isSavingAvatar}
                    className="flex-1 py-3.5 bg-viet-green text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-viet-green/90 transition-all flex items-center justify-center"
                  >
                    {isSavingAvatar ? 'Đang lưu...' : 'Lưu'}
                  </button>
                )}
              </div>
            </div>

            {/* Google Linking in Left column */}
            <div className="bg-white border border-viet-border rounded-[32px] p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <h2 className="text-lg font-black text-viet-text mb-4">Tài khoản liên kết</h2>
              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-8 h-8" alt="Google" />
                  <div>
                    <div className="font-bold text-slate-800 text-sm">Google</div>
                    <div className="text-xs text-slate-500 font-medium">Đăng nhập nhanh</div>
                  </div>
                </div>
                {user.linkedAccounts?.google ? (
                  <span className="px-3 py-1.5 rounded-lg text-[10px] font-black bg-green-50 text-green-600 border border-green-200 uppercase tracking-widest">
                    Đã liên kết
                  </span>
                ) : (
                  <button 
                    onClick={handleLinkGoogle}
                    className="px-4 py-2 rounded-xl text-[11px] font-black bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-all uppercase tracking-widest"
                  >
                    Liên kết
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Forms */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Account Credentials Update */}
            <div className="bg-white border border-viet-border rounded-[32px] p-8 shadow-sm">
              <h2 className="text-xl font-black text-viet-text flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-viet-green" /> Thông tin tài khoản
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Username Form */}
                <form onSubmit={handleUpdateUsername} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-viet-text uppercase tracking-widest pl-1">Tên tài khoản</label>
                    <input 
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full h-12 bg-slate-50 border border-viet-border rounded-xl px-4 font-bold text-sm focus:border-viet-green focus:ring-2 focus:ring-viet-green/10 outline-none transition-all"
                      placeholder="Nhập tên mới..."
                      required
                    />
                    {usernameError && <p className="text-xs text-red-500 font-semibold pl-1">{usernameError}</p>}
                  </div>
                  {username.trim() !== user?.username && (
                    <button
                      type="submit"
                      disabled={loadingUsername}
                      className="w-full h-11 bg-viet-green hover:bg-viet-green/90 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center"
                    >
                      {loadingUsername ? 'Đang cập nhật...' : 'Cập nhật tên'}
                    </button>
                  )}
                </form>

                {/* Password Form */}
                <form onSubmit={handleUpdatePassword} className="space-y-4 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-viet-text uppercase tracking-widest pl-1 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-400" /> Đổi mật khẩu
                    </label>
                    <input 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-12 bg-slate-50 border border-viet-border rounded-xl px-4 font-bold text-sm focus:border-viet-green focus:ring-2 focus:ring-viet-green/10 outline-none transition-all"
                      placeholder="Mật khẩu mới..."
                      required
                    />
                    <input 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-12 bg-slate-50 border border-viet-border rounded-xl px-4 font-bold text-sm focus:border-viet-green focus:ring-2 focus:ring-viet-green/10 outline-none transition-all"
                      placeholder="Xác nhận mật khẩu mới..."
                      required
                    />
                    {passwordError && <p className="text-xs text-red-500 font-semibold pl-1">{passwordError}</p>}
                  </div>
                  {(newPassword || confirmPassword) && (
                    <button
                      type="submit"
                      disabled={loadingPassword}
                      className="w-full h-11 bg-viet-green hover:bg-viet-green/90 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center"
                    >
                      {loadingPassword ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                    </button>
                  )}
                </form>

              </div>
            </div>

            {/* 2. Study Plan & Reminders */}
            <div className="bg-white border border-viet-border rounded-[32px] p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-viet-green/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              
              <div className="relative z-10">
                <h2 className="text-xl font-black text-viet-text flex items-center gap-2 mb-6">
                  <Target className="w-5 h-5 text-viet-green" /> Kế hoạch học tập & Nhắc nhở
                </h2>

                <div className="grid grid-cols-1 gap-6 mb-6">

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-viet-text uppercase tracking-widest pl-2">Mục tiêu bài học/ngày</label>
                    <div className="relative">
                      <select 
                        value={planData.dailyLessonTarget || 1}
                        onChange={(e) => setPlanData({ ...planData, dailyLessonTarget: parseInt(e.target.value) })}
                        className="w-full h-12 bg-slate-50 border border-viet-border rounded-xl px-4 font-black text-sm focus:border-viet-green focus:ring-2 focus:ring-viet-green/10 outline-none appearance-none transition-all"
                      >
                        {[1, 2, 3, 5, 10].map(n => (
                          <option key={n} value={n}>{n} bài</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                        <BookOpen size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-slate-50/50 border border-viet-border rounded-[24px] p-6 mb-6">
                  <h3 className="text-[11px] font-black text-viet-text-light uppercase tracking-widest pl-1 flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-viet-green shrink-0" /> Thiết lập thông báo nhắc học
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ReminderToggle
                      enabled={planData.remindersEnabled}
                      onChange={() => setPlanData({ ...planData, remindersEnabled: !planData.remindersEnabled })}
                      title="Nhắc nhở học tập"
                      icon={<Bell size={16} />}
                      activeColor="green"
                    />

                    <ReminderToggle 
                      enabled={planData.emailEnabled}
                      onChange={handleToggleEmailReminder}
                      title="Nhắc nhở qua Email"
                      icon={<Mail size={16} />}
                      activeColor="blue"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveStudyPlan}
                    disabled={isSavingPlan}
                    className="w-full sm:w-auto px-8 py-3.5 bg-viet-green hover:bg-viet-green/90 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md shadow-viet-green/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSavingPlan ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Lưu kế hoạch
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
