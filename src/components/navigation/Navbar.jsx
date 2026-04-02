import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  
  const lessonPath = isLoggedIn ? "/lessons/8/hoa8_kntt_bai1" : "/lessons";
  const isAdmin = user?.role === 'admin' || user?.role === 'teacher';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fffbf0]/80 backdrop-blur-md border-b border-viet-border h-[70px] flex items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-viet-green flex items-center justify-center text-white text-base sm:text-xl shadow-lg shadow-viet-green/20 group-hover:rotate-12 transition-all">
            🎓
          </div>
          <span className="text-base sm:text-xl font-black text-viet-text italic tracking-tighter uppercase">
            Chemistry <span className="text-viet-green">Odyssey</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-2">
          {isAdmin && (
            <NavLink to="/admin" className={({isActive}) => `nav-link ${isActive ? 'bg-red-50 text-red-600' : 'text-red-500 font-black'}`}>
              QUẢN TRỊ
            </NavLink>
          )}
          <NavLink to="/lectures" className={({isActive}) => `nav-link ${isActive ? 'bg-viet-green/5 text-viet-green' : ''}`}>
            BÀI GIẢNG
          </NavLink>
          <NavLink to="/classroom" className={({isActive}) => `nav-link ${isActive ? 'bg-viet-green/5 text-viet-green' : ''}`}>
            LỚP HỌC
          </NavLink>
          <NavLink to="/periodic-table" className={({isActive}) => `nav-link ${isActive ? 'bg-viet-green/5 text-viet-green' : ''}`}>
            BẢNG TUẦN HOÀN
          </NavLink>
          <NavLink to="/lab" className={({isActive}) => `nav-link ${isActive ? 'bg-viet-green/5 text-viet-green' : ''}`}>
            PHÒNG LAB
          </NavLink>
          <NavLink to="/arena" className={({isActive}) => `nav-link ${isActive ? 'bg-viet-green/5 text-viet-green' : ''}`}>
             ĐẤU TRƯỜNG
          </NavLink>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3 bg-viet-green px-5 py-2 rounded-full shadow-lg shadow-viet-green/20 group animate-fade-in transition-all">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-[10px] border border-white/30 group-hover:rotate-12 transition-transform">
                  {user?.username?.charAt(0).toUpperCase() || '👤'}
                </div>
                <span className="text-[11px] font-black text-white uppercase tracking-widest leading-tight">
                  {user?.username}
                </span>
                <div className="w-px h-3 bg-white/20 mx-1"></div>
                <button 
                  onClick={logout}
                  className="text-[10px] font-black text-white/70 hover:text-white transition-all uppercase tracking-widest px-1"
                  title="Đăng xuất"
                >
                  Thoát
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="px-4 sm:px-6 py-2 bg-viet-green text-white text-[10px] sm:text-[11px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-lg shadow-viet-green/10">
               Đăng nhập ngay →
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
