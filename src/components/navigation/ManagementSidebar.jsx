import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  FlaskConical, LayoutDashboard, Users, BookOpen, FileCheck, MessageSquare,
  BarChart2, Settings, LogOut, Atom
} from 'lucide-react';

const ManagementSidebar = ({ menuItems, title }) => {
  const { logout } = useAuth();

  // Custom menu icon mapping if menuItems doesn't provide ideal icons
  const defaultIcons = {
    '/admin': <LayoutDashboard size={20} />,
    '/admin/nguoi_dung': <Users size={20} />,
    '/admin/bai_hoc': <BookOpen size={20} />,
    '/admin/assignments': <FileCheck size={20} />,
    '/admin/feedback': <MessageSquare size={20} />,
    '/admin/stats': <BarChart2 size={20} />,
    '/admin/settings': <Settings size={20} />,
  };

  return (
    <aside
      aria-label={`Thanh điều hướng ${title}`}
      className="hidden md:flex w-[242px] h-screen h-dvh fixed top-0 left-0 bg-white border-r border-slate-200/80 flex-col z-40"
    >
      {/* Brand Header */}
      <div className="h-[112px] flex items-center px-6 border-b border-slate-100 shrink-0">
        <NavLink to="/" className="flex items-center gap-3 group" aria-label="Về trang chủ AURUM">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 group-hover:-translate-y-0.5 transition-transform">
            <FlaskConical size={25} strokeWidth={2.25} />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[21px] font-black text-[#0b1f44] tracking-tight">
                AURUM
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 leading-none mt-1">
              Học Hóa thật trực quan
            </p>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav aria-label={`Các mục ${title}`} className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
        {menuItems.map((item, index) => {
          const icon = item.icon || defaultIcons[item.path] || <LayoutDashboard size={20} />;
          return (
            <NavLink
              key={item.path || item.label || index}
              to={item.path}
              end={item.path === '/admin' || item.path === '/teacher'}
              className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all relative font-bold text-sm ${
                isActive
                  ? 'text-blue-600 bg-blue-50 shadow-sm shadow-blue-500/5'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {({ isActive }) => (
                <>
                  <div aria-hidden="true" className={`shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                    {icon}
                  </div>
                  <span className="tracking-tight">{item.label}</span>
                  {isActive && (
                    <motion.div
                      aria-hidden="true"
                      layoutId="activeTabPill"
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 rounded-l-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Educational Promo Card */}
      <div className="px-4 mb-4 mt-auto shrink-0">
        <div className="bg-gradient-to-br from-blue-50 via-white to-emerald-50/70 p-4 rounded-3xl border border-blue-100 text-center relative overflow-hidden">
          <Atom aria-hidden="true" className="absolute -right-5 -top-5 h-20 w-20 text-blue-100" />
          <div className="w-12 h-12 mx-auto mb-2.5 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center relative">
            <FlaskConical size={27} />
          </div>
          <p className="text-xs font-black text-slate-800 uppercase tracking-tight mb-1">
            Hóa học khơi nguồn khám phá
          </p>
          <p className="text-[11px] text-slate-500 font-medium leading-snug">
            Hiểu bản chất, vững tương lai.
          </p>
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100 shrink-0">
        <button
          type="button"
          onClick={logout}
          className="flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-xl text-slate-500 font-bold text-xs hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={16} aria-hidden="true" /> Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default ManagementSidebar;
