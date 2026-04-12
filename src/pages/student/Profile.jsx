import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import Avatar from '@/components/common/Avatar';
import { useTranslation, Trans } from 'react-i18next';

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
  const { user, updateUser } = useAuth();
  const [editableSeed, setEditableSeed] = useState(user?.avatarSeed || user?.username);
  const [isSaving, setIsSaving] = useState(false);

  const handleRandomizeAvatar = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setEditableSeed(newSeed);
  };

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
              <div className="w-40 h-40 rounded-[40px] bg-white border-4 border-viet-green p-1 shadow-2xl relative overflow-hidden">
                <Avatar seed={editableSeed} size={160} className="w-full h-full rounded-[35px] object-cover scale-110" />
                <div className="absolute -bottom-4 -right-4 bg-viet-green text-white w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg z-20">
                  {user.level}
                </div>
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

            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                 <h1 className="text-4xl md:text-5xl font-black text-white">{user.username}</h1>
                 <span className="px-3 py-1 bg-white/10 text-white rounded-full text-[11px] font-black uppercase tracking-widest border border-white/20">{t('profile.member_role')}</span>
              </div>
              <p className="text-white/60 font-medium text-lg leading-relaxed mb-6">
                <Trans 
                  i18nKey="profile.member_since" 
                  values={{ date: new Date(user.createdAt).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US') }}
                >
                   Thành viên ưu tú của Học viện Hóa học Aurum. <br/>Đã đồng hành từ {new Date(user.createdAt).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US')}
                </Trans>
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
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
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>}
          />
          <ProfileCard 
            title={t('profile.stats.level_title')} 
            value={user.level || 1} 
            color="bg-viet-green" 
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
          />
          <ProfileCard 
            title={t('profile.stats.chemicals')} 
            value={user.unlockedChemicals?.length || 0} 
            color="bg-blue-500" 
            icon={<Avatar seed="lab" size={40} className="scale-150" />}
          />
          <ProfileCard 
            title={t('profile.stats.arena_points')} 
            value={user.arenaStats?.points || 0} 
            icon={<Avatar seed="arena" size={40} className="scale-150 rotate-45" />}
            color="bg-purple-500"
          />
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Unlocked Chemicals */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-black text-viet-text">{t('profile.collection.title')}</h3>
               <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[12px] font-black text-viet-text-light uppercase tracking-widest">
                 {t('profile.collection.unlocked_count', { current: user.unlockedChemicals?.length || 0, total: 118 })}
               </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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

          {/* Arena Performance */}
          <div className="space-y-6">
             <h2 className="text-2xl font-black text-viet-text px-2">{t('profile.arena_stats.title')}</h2>
             <div className="bg-viet-text text-white rounded-[32px] p-8 shadow-xl relative overflow-hidden">
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
      </div>
    </div>
  );
};

export default Profile;
