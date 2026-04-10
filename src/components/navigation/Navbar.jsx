import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/common/Avatar';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
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
             // In a real app, we might want to store exact read IDs, 
             // but here we just flag if the latest is newer.
             // Let's assume there's at least 1 new if latest > lastReadAt
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
      <div className="w-full flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 relative flex items-center justify-center shrink-0">
            {/* Styled $ Logo */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-viet-green group-hover:scale-110 transition-transform duration-500">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="animate-spin-slow" />
              <text x="50" y="65" textAnchor="middle" className="fill-current font-black text-5xl" style={{ fontFamily: 'serif' }}>$</text>
              <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" />
            </svg>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-2xl sm:text-3xl font-black text-viet-text leading-none tracking-tighter italic">
              AURUM
            </span>
            <span className="text-[8px] font-bold text-viet-green uppercase tracking-[3px] mt-1">Chemistry Currency</span>
          </div>
        </Link>

        {/* Logical Grouped Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-10">
          {/* JOURNEY GROUP */}
          <div className="relative group/nav">
             <button className="text-[11px] font-black tracking-[2px] uppercase text-viet-text group-hover/nav:text-viet-green transition-all flex items-center gap-1.5 py-4">
                JOURNEY <span className="text-[8px] opacity-30">▼</span>
             </button>
             <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-2xl border border-viet-border p-2 opacity-0 translate-y-2 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:translate-y-0 transition-all z-[110]">
                <NavLink to="/lectures" className="flex items-center gap-3 p-3 rounded-xl hover:bg-viet-green/5 text-[12px] font-bold text-viet-text hover:text-viet-green transition-all">
                   <span className="text-lg">📚</span> BÀI GIẢNG
                </NavLink>
                <NavLink to="/classroom" className="flex items-center gap-3 p-3 rounded-xl hover:bg-viet-green/5 text-[12px] font-bold text-viet-text hover:text-viet-green transition-all">
                   <span className="text-lg">🏫</span> LỚP HỌC
                </NavLink>
                {isLoggedIn && (
                  <NavLink to="/my-class" className="flex items-center gap-3 p-3 rounded-xl hover:bg-viet-green/5 text-[12px] font-bold text-viet-text hover:text-viet-green transition-all relative">
                    <span className="text-lg">👥</span> LỚP CỦA TÔI
                    {unreadCount > 0 && <span className="w-2 h-2 bg-red-500 rounded-full animate-ping absolute top-3 right-3" />}
                  </NavLink>
                )}
             </div>
          </div>

          {/* VAULT GROUP */}
          <div className="relative group/nav">
             <button className="text-[11px] font-black tracking-[2px] uppercase text-viet-text group-hover/nav:text-viet-green transition-all flex items-center gap-1.5 py-4">
                VAULT <span className="text-[8px] opacity-30">▼</span>
             </button>
             <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white shadow-xl rounded-2xl border border-viet-border p-2 opacity-0 translate-y-2 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:translate-y-0 transition-all z-[110]">
                <NavLink to="/periodic-table" className="flex items-center gap-3 p-3 rounded-xl hover:bg-viet-green/5 text-[12px] font-bold text-viet-text hover:text-viet-green transition-all">
                   <span className="text-lg">⚛️</span> BẢNG TUẦN HOÀN
                </NavLink>
                <NavLink to="/library" className="flex items-center gap-3 p-3 rounded-xl hover:bg-viet-green/5 text-[12px] font-bold text-viet-text hover:text-viet-green transition-all">
                   <span className="text-lg">📖</span> THƯ VIỆN
                </NavLink>
             </div>
          </div>

          {/* ARENA GROUP */}
          <div className="relative group/nav">
             <button className="text-[11px] font-black tracking-[2px] uppercase text-viet-text group-hover/nav:text-viet-green transition-all flex items-center gap-1.5 py-4">
                ARENA <span className="text-[8px] opacity-30">▼</span>
             </button>
             <div className="absolute top-full right-0 w-48 bg-white shadow-xl rounded-2xl border border-viet-border p-2 opacity-0 translate-y-2 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:translate-y-0 transition-all z-[110]">
                <NavLink to="/lab" className="flex items-center gap-3 p-3 rounded-xl hover:bg-viet-green/5 text-[12px] font-bold text-viet-text hover:text-viet-green transition-all">
                   <span className="text-lg">🧪</span> PHÒNG LAB
                </NavLink>
                <NavLink to="/arena" className="flex items-center gap-3 p-3 rounded-xl hover:bg-viet-green/5 text-[12px] font-bold text-viet-text hover:text-viet-green transition-all">
                   <span className="text-lg">⚔️</span> ĐẤU TRƯỜNG
                </NavLink>
                <NavLink to="/missions" className="flex items-center gap-3 p-3 rounded-xl hover:bg-viet-green/5 text-[12px] font-bold text-viet-text hover:text-viet-green transition-all">
                   <span className="text-lg">🎯</span> NHIỆM VỤ
                </NavLink>
             </div>
          </div>

          {isAdmin && (
            <NavLink to="/admin" className={({isActive}) => `nav-link !text-red-500 hover:!text-red-600 ${isActive ? 'bg-red-50' : ''}`}>
              ADMIN
            </NavLink>
          )}
        </div>

        {/* User Info & Mobile Toggle */}
        <div className="flex items-center gap-4 shrink-0">
          {isLoggedIn ? (
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-viet-green px-2 py-1 rounded-full shadow-sm shadow-viet-green/20 group animate-fade-in transition-all whitespace-nowrap">
                <Link to="/profile" className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/30 group-hover:rotate-12 transition-transform shrink-0">
                  <Avatar seed={user.avatarSeed || user.username} size={20} className="w-full h-full object-cover scale-125 translate-y-0.5" />
                </Link>
                <Link to="/profile" className="flex items-center group/user max-w-[100px]">
                  <span className="text-[8px] font-black text-white uppercase tracking-wider leading-tight block truncate group-hover/user:underline">
                    {user?.username}
                  </span>
                </Link>
                <div className="w-px h-2 bg-white/30 mx-0.5"></div>
                <button 
                  onClick={logout}
                  className="text-[8px] font-black text-white/80 hover:text-white transition-all uppercase tracking-widest px-0.5"
                  title="Đăng xuất"
                >
                  Thoát
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:block px-6 py-2.5 border border-viet-border bg-white/50 backdrop-blur-sm text-viet-text text-[12px] font-bold uppercase tracking-widest rounded-full hover:bg-white hover:shadow-sm transition-all whitespace-nowrap">
               Đăng nhập
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
                    { path: "/lectures", label: "BÀI GIẢNG", icon: "📚" },
                    { path: "/classroom", label: "LỚP HỌC", icon: "🏫" },
                    { path: "/my-class", label: "LỚP CỦA TÔI", icon: "👥", requiresAuth: true },
                    { path: "/periodic-table", label: "BẢNG TUẦN HOÀN", icon: "⚛️" },
                    { path: "/library", label: "THƯ VIỆN", icon: "📖" },
                    { path: "/lab", label: "PHÒNG LAB", icon: "🧪" },
                    { path: "/arena", label: "ĐẤU TRƯỜNG", icon: "⚔️" },
                    { path: "/missions", label: "NHIỆM VỤ", icon: "🎯" },
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
