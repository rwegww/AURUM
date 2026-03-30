import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  
  const lessonPath = isLoggedIn ? "/lessons/8/hoa8_kntt_bai1" : "/lessons";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fffbf0]/80 backdrop-blur-md border-b border-viet-border h-[70px] flex items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-viet-green flex items-center justify-center text-white text-xl shadow-lg shadow-viet-green/20 group-hover:rotate-12 transition-all">
            🎓
          </div>
          <span className="text-xl font-black text-viet-text italic tracking-tighter uppercase">
            Chemistry <span className="text-viet-green">Odyssey</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink to={lessonPath} className={({isActive}) => `nav-link ${isActive ? 'bg-viet-green/5 text-viet-green' : ''}`}>
            BÀI HỌC
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
          <div className="hidden sm:flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-viet-border">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-black text-[12px]">
              👤
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-viet-text leading-tight">nguyenthanhtien2120</span>
              <button 
                onClick={logout}
                className="text-[9px] font-bold text-viet-text-light hover:text-red-500 text-left transition-all"
              >
                Thoát
              </button>
            </div>
          </div>
          <button className="px-4 py-2 bg-viet-green text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">
             Bắt đầu ngay →
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
