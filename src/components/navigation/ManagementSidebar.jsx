import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

const ManagementSidebar = ({ menuItems, title }) => {
  const { logout } = useAuth();

  return (
    <aside
      aria-label={`Thanh điều hướng ${title}`}
      className="hidden md:flex w-64 h-screen h-dvh fixed top-0 left-0 bg-[#121826] border-r border-[#1e293b] flex-col z-40"
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-[#1e293b] shrink-0">
        <NavLink to="/" className="flex items-center gap-2 group" aria-label="Về trang chủ AURUM">
          <div className="w-8 h-8 relative flex items-center justify-center shrink-0 bg-white/10 rounded-lg p-1">
            <img src="/logo.png" alt="" aria-hidden="true" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-black text-white group-hover:text-viet-green transition-colors italic uppercase tracking-tighter">
            AURUM
          </span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav aria-label={`Các mục ${title}`} className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-4 mb-4">
          Bảng điều khiển
        </div>
        {menuItems.map((item, index) => (
          <NavLink
            key={item.path || item.label || index}
            to={item.path}
            end={item.path === '/admin' || item.path === '/teacher'}
            className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all relative group ${
              isActive
                ? 'text-viet-green bg-viet-green/10 font-bold'
                : 'text-slate-400 font-medium hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            {({ isActive }) => (
              <>
                <div aria-hidden="true" className={`shrink-0 transition-colors ${isActive ? 'text-viet-green' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {item.icon}
                </div>
                <span className="text-[13.5px] tracking-tight">{item.label}</span>
                {isActive && (
                  <motion.div
                    aria-hidden="true"
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-viet-green rounded-r-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Promo Box */}
      <div className="px-4 mb-4 mt-auto shrink-0">
        <div className="bg-gradient-to-br from-viet-green/20 to-transparent p-4 rounded-2xl border border-viet-green/20 text-center">
          <img src="/logo.png" alt="" className="w-12 h-12 mx-auto mb-3 opacity-80 mix-blend-screen" />
          <p className="text-sm font-black text-white leading-tight uppercase mb-1">Giáo dục kết nối</p>
          <p className="text-[10px] text-slate-400 font-medium">Khơi nguồn sáng tạo tương lai</p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#1e293b] shrink-0">
        <button
          type="button"
          onClick={logout}
          className="flex items-center justify-center w-full gap-2 px-4 py-3 rounded-xl text-slate-400 font-bold text-[13px] hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-95"
        >
          <LogOut size={18} aria-hidden="true" /> Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default ManagementSidebar;
