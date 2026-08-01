import React, { useEffect, useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ManagementSidebar from '../navigation/ManagementSidebar';
import { Menu, X, LogOut } from 'lucide-react';

const ManagementLayout = ({ menuItems, title }) => {
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-viet-bg flex">
      <ManagementSidebar menuItems={menuItems} title={title} />

      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-viet-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3 min-w-0">
          <img src="/logo.png" alt="AURUM" className="w-8 h-8 object-contain shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-black text-viet-text uppercase leading-none">AURUM</p>
            <p className="text-[10px] font-bold text-viet-text-light uppercase truncate">{title}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((value) => !value)}
          className="w-10 h-10 rounded-xl border border-viet-border bg-white flex items-center justify-center text-viet-text"
          aria-label={mobileMenuOpen ? 'Đóng trình đơn' : 'Mở trình đơn'}
          aria-expanded={mobileMenuOpen}
          aria-controls="management-mobile-menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setMobileMenuOpen(false)}>
          <nav
            id="management-mobile-menu"
            aria-label="Điều hướng quản lý"
            className="absolute top-16 left-0 right-0 bg-white border-b border-viet-border shadow-xl p-4 space-y-2"
            onClick={(event) => event.stopPropagation()}
          >
            {menuItems.map((item, index) => (
              <NavLink
                key={item.path || index}
                to={item.path}
                end={item.path === '/admin' || item.path === '/teacher'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${isActive ? 'bg-viet-green/10 text-viet-green' : 'text-viet-text-light hover:bg-slate-50'}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 w-full"
            >
              <LogOut size={18} />
              <span>Đăng xuất</span>
            </button>
          </nav>
        </div>
      )}
      
      {/* Main Content Area */}
      <main className="md:ml-64 min-w-0 flex-1 h-screen overflow-y-auto pt-16 md:pt-0">
         <div className="pb-20">
            <Outlet />
         </div>
      </main>
    </div>
  );
};

export default ManagementLayout;
