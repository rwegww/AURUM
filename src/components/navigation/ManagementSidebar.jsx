import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Avatar from '../common/Avatar';

import { LogOut } from 'lucide-react';

const ManagementSidebar = ({ menuItems, title }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="w-64 h-screen fixed top-0 left-0 bg-white border-r border-viet-border flex flex-col z-40">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-viet-border">
        <div className="flex items-center gap-2 group cursor-default">
          {/* Styled Logo Small */}
          <div className="w-8 h-8 relative flex items-center justify-center shrink-0">
             <img src="/logo.png" alt="Admin" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-black text-viet-text group-hover:text-viet-green transition-colors italic uppercase tracking-tighter">
            AURUM
          </span>
        </div>
      </div>

      {/* Role / Context Title */}
      <div className="px-6 py-5 border-b border-viet-border/50 bg-slate-50/50">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-viet-text-light/60 block mb-3">
          {title}
        </span>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <Avatar seed={user?.avatarSeed || user?.username} size={38} streakCount={user?.streakCount} level={user?.level} className="w-full h-full" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-viet-text leading-none mb-1 truncate">{user?.username}</p>
            <p className="text-[11px] text-viet-green font-bold capitalize">
              {user?.role === 'admin' ? 'Quản trị viên' : user?.role === 'teacher' ? 'Giáo viên' : user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path || (item.path !== '/admin' && item.path !== '/teacher' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={index}
              to={item.path}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all relative group ${isActive
                  ? 'text-viet-green bg-viet-green/5 font-bold shadow-sm shadow-viet-green/5'
                  : 'text-viet-text-light font-medium hover:bg-slate-50 hover:text-viet-text'
                }`}
            >
              <div className={`shrink-0 transition-colors ${isActive ? 'text-viet-green' : 'text-slate-400 group-hover:text-viet-text'}`}>
                {item.icon}
              </div>
              <span className="text-[13.5px] tracking-tight">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-viet-green rounded-r-full"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-viet-border bg-slate-50/30">
        <button
          onClick={logout}
          className="flex items-center justify-center w-full gap-2 px-4 py-3 rounded-xl text-red-500 font-bold text-[13px] hover:bg-red-50 transition-all active:scale-95"
        >
          <LogOut size={18} /> Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default ManagementSidebar;
