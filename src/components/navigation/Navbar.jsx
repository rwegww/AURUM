import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/common/Avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  
  const lessonPath = isLoggedIn ? "/lessons/8/hoa8_kntt_bai1" : "/lessons";
  const isAdmin = user?.role === 'admin' || user?.role === 'teacher';

  React.useEffect(() => {
    if (isLoggedIn) {
      fetchUnreadStats();
      const interval = setInterval(fetchUnreadStats, 30000); // Check every 30s
      
      window.addEventListener('classroom_read', fetchUnreadStats);
      return () => {
        clearInterval(interval);
        window.removeEventListener('classroom_read', fetchUnreadStats);
      };
    }
  }, [isLoggedIn]);

  const fetchUnreadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/classes/stats', { headers: { 'Authorization': `Bearer ${token}` }});
      if (res.ok) {
        const stats = await res.json();
        let total = 0;
        const lastReadData = JSON.parse(localStorage.getItem('classroom_last_read') || '{}');
        
        Object.keys(stats).forEach(classId => {
          const classStats = stats[classId];
          const lastReadAt = lastReadData[classId] || 0;
          if (new Date(classStats.latest) > new Date(lastReadAt)) {
             total += 1; 
          }
        });
        setUnreadCount(total);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent h-[90px] flex items-center px-6 lg:px-12">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-12 xl:gap-20">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 sm:w-16 sm:h-16 relative flex items-center justify-center shrink-0">
               <img src="/src/assets/logo.png" alt="Aurum Logo" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-2xl sm:text-3xl font-black text-viet-text leading-none tracking-tighter italic">
                AURUM
              </span>
              <span className="text-[8px] font-bold text-viet-green uppercase tracking-[3px] mt-1">Chemistry Currency</span>
            </div>
          </Link>

          {/* Logical Grouped Links */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12">
            {/* JOURNEY GROUP */}
            <div className="relative group/nav">
               <button className="text-[13px] font-black tracking-[1px] uppercase text-viet-text group-hover/nav:text-viet-green transition-all flex items-center gap-1.5 py-6">
                  {t('nav.journey')} <span className="text-[10px] opacity-30">▼</span>
               </button>
               <div className="absolute top-[80%] left-0 w-56 bg-white shadow-2xl rounded-2xl border border-viet-border p-2 opacity-0 translate-y-4 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:pointer-events-auto transition-all z-[110]">
                  <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent" />
                  <NavLink to="/lectures" className="flex items-center gap-3 p-3 rounded-xl hover:bg-viet-green/5 text-[12px] font-bold text-viet-text hover:text-viet-green transition-all group/item">
                     <svg className="w-4 h-4 text-viet-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> {t('nav.lectures')}
                  </NavLink>
                  <NavLink to="/classroom" className="flex items-center gap-3 p-3 rounded-xl hover:bg-viet-green/5 text-[12px] font-bold text-viet-text hover:text-viet-green transition-all group/item">
                     <svg className="w-4 h-4 text-viet-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> {t('nav.classroom')}
                  </NavLink>
                  {isLoggedIn && (
                    <NavLink to="/my-class" className="flex items-center gap-3 p-3 rounded-xl hover:bg-viet-green/5 text-[12px] font-bold text-viet-text hover:text-viet-green transition-all relative group/item">
                      <svg className="w-4 h-4 text-viet-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> {t('nav.my_class')}
                      {unreadCount > 0 && <span className="w-2 h-2 bg-red-500 rounded-full animate-ping absolute top-3 right-3" />}
                    </NavLink>
                  )}
               </div>
            </div>

            {/* VAULT GROUP */}
            <div className="relative group/nav">
               <button className="text-[13px] font-black tracking-[1px] uppercase text-viet-text group-hover/nav:text-viet-green transition-all flex items-center gap-1.5 py-6">
                  {t('nav.vault')} <span className="text-[10px] opacity-30">▼</span>
               </button>
               <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-56 bg-white shadow-2xl rounded-2xl border border-viet-border p-2 opacity-0 translate-y-4 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:pointer-events-auto transition-all z-[110]">
                  <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent" />
                  <NavLink to="/periodic-table" className="flex items-center gap-3 p-3 rounded-xl hover:bg-viet-green/5 text-[12px] font-bold text-viet-text hover:text-viet-green transition-all group/item">
                     <svg className="w-4 h-4 text-viet-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)"/></svg> {t('nav.periodic_table')}
                  </NavLink>
                  <NavLink to="/library" className="flex items-center gap-3 p-3 rounded-xl hover:bg-viet-green/5 text-[12px] font-bold text-viet-text hover:text-viet-green transition-all group/item">
                     <svg className="w-4 h-4 text-viet-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg> {t('nav.library')}
                  </NavLink>
               </div>
            </div>

            {/* ARENA GROUP */}
            <div className="relative group/nav">
               <button className="text-[13px] font-black tracking-[1px] uppercase text-viet-text group-hover/nav:text-viet-green transition-all flex items-center gap-1.5 py-6">
                  {t('nav.arena')} <span className="text-[10px] opacity-30">▼</span>
               </button>
               <div className="absolute top-[80%] right-0 w-56 bg-white shadow-2xl rounded-2xl border border-viet-border p-2 opacity-0 translate-y-4 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:pointer-events-auto transition-all z-[110]">
                  <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent" />
                  <NavLink to="/lab" className="flex items-center gap-3 p-3 rounded-xl hover:bg-viet-green/5 text-[12px] font-bold text-viet-text hover:text-viet-green transition-all group/item">
                     <svg className="w-4 h-4 text-viet-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 2v7.5"/><path d="M14 2v7.5"/><path d="M8.5 2h7"/><path d="M14 9.32a4 4 0 1 1-4 0"/><path d="M8.5 15h7"/></svg> {t('nav.lab')}
                  </NavLink>
                  <NavLink to="/arena" className="flex items-center gap-3 p-3 rounded-xl hover:bg-viet-green/5 text-[12px] font-bold text-viet-text hover:text-viet-green transition-all group/item">
                     <svg className="w-4 h-4 text-viet-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.5 17.5 3 6 3 3 6 3 17.5 14.5M13 19 19 13M16 16 20 20M19 21 21 19"/></svg> {t('nav.arena_link')}
                  </NavLink>
                  <NavLink to="/missions" className="flex items-center gap-3 p-3 rounded-xl hover:bg-viet-green/5 text-[12px] font-bold text-viet-text hover:text-viet-green transition-all group/item">
                     <svg className="w-4 h-4 text-viet-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> {t('nav.missions')}
                  </NavLink>
               </div>
            </div>

            {isAdmin && (
              <NavLink to="/admin" className={({isActive}) => `nav-link !text-red-500 hover:!text-red-600 ${isActive ? 'bg-red-50' : ''}`}>
                ADMIN
              </NavLink>
            )}
          </div>
        </div>

        {/* User Info, Language & Mobile Toggle */}
        <div className="flex items-center gap-4 xl:gap-6 shrink-0">
          <LanguageSwitcher />
          
          {isLoggedIn ? (
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-2 bg-viet-green px-3 py-1.5 rounded-full shadow-md shadow-viet-green/20 group animate-fade-in transition-all whitespace-nowrap">
                <Link to="/profile" className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/30 group-hover:rotate-12 transition-transform shrink-0">
                  <Avatar seed={user.avatarSeed || user.username} size={28} className="w-full h-full object-cover scale-125 translate-y-0.5" />
                </Link>
                <Link to="/profile" className="flex items-center group/user max-w-[150px]">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest leading-tight block truncate group-hover/user:underline">
                    {user?.username}
                  </span>
                </Link>
                <div className="w-px h-3 bg-white/30 mx-1"></div>
                <button 
                  onClick={logout}
                  className="text-[10px] font-black text-white/80 hover:text-white transition-all uppercase tracking-widest px-1"
                  title={t('nav.logout')}
                >
                  {t('nav.logout')}
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:block px-6 py-2.5 border border-viet-border bg-white/50 backdrop-blur-sm text-viet-text text-[12px] font-bold uppercase tracking-widest rounded-full hover:bg-white hover:shadow-sm transition-all whitespace-nowrap">
               {t('nav.login')}
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5 bg-white rounded-2xl shadow-sm border border-viet-border relative z-[100]"
          >
            <motion.span 
              animate={isMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-viet-text rounded-full"
            />
            <motion.span 
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-viet-text rounded-full"
            />
            <motion.span 
              animate={isMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-viet-text rounded-full"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-viet-text/40 backdrop-blur-sm z-[80] lg:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-white z-[90] lg:hidden shadow-2xl overflow-y-auto"
            >
              <div className="flex flex-col h-full p-8 pt-24">
                <div className="flex flex-col gap-4 mb-auto">
                  {[
                    { path: "/lectures", label: "BÀI GIẢNG", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
                    { path: "/classroom", label: "LỚP HỌC", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
                    { path: "/my-class", label: "LỚP CỦA TÔI", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, requiresAuth: true },
                    { path: "/periodic-table", label: "BẢNG TUẦN HOÀN", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)"/></svg> },
                    { path: "/library", label: "THƯ VIỆN", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg> },
                    { path: "/lab", label: "PHÒNG LAB", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 2v7.5"/><path d="M14 2v7.5"/><path d="M8.5 2h7"/><path d="M14 9.32a4 4 0 1 1-4 0"/><path d="M8.5 15h7"/></svg> },
                    { path: "/arena", label: "ĐẤU TRƯỜNG", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.5 17.5 3 6 3 3 6 3 17.5 14.5M13 19 19 13M16 16 20 20M19 21 21 19"/></svg> },
                    { path: "/missions", label: "NHIỆM VỤ", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> },
                  ].filter(item => !item.requiresAuth || isLoggedIn).map((item) => (
                      <NavLink 
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={({isActive}) => `flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive ? 'bg-viet-green/10 text-viet-green' : 'text-viet-text hover:bg-slate-50'}`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-[13px] font-black tracking-widest uppercase relative">{item.label}
                          {item.path === '/my-class' && unreadCount > 0 && (
                            <span className="absolute -top-1 -right-4 min-w-[16px] h-[16px] bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full px-1 shadow-sm">
                              {unreadCount}
                            </span>
                          )}
                        </span>
                      </NavLink>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-viet-border space-y-4">
                  {isLoggedIn ? (
                    <div className="space-y-4">
                      <Link 
                        to="/profile" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-viet-green p-0.5 bg-white">
                          <Avatar seed={user.avatarSeed || user.username} size={40} className="w-full h-full object-cover scale-150 translate-y-1" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-black text-viet-text leading-tight">{user.username}</span>
                          <span className="text-[10px] font-bold text-viet-green uppercase tracking-widest">Hồ sơ cá nhân</span>
                        </div>
                      </Link>
                      <button 
                        onClick={() => { logout(); setIsMenuOpen(false); }}
                        className="w-full py-4 text-center text-red-500 font-extrabold text-[12px] uppercase tracking-widest hover:bg-red-50 rounded-xl transition-all"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  ) : (
                    <Link 
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full py-5 bg-viet-text text-white text-center font-black text-[13px] uppercase tracking-[3px] rounded-2xl shadow-xl shadow-viet-text/20"
                    >
                      Đăng nhập ngay
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
