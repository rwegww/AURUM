import React, { Suspense, useEffect, useRef, useState } from 'react';
import { PageTransition } from '@/components/common/MotionSystem';
import LoadingScreen from '@/components/common/LoadingScreen';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ManagementSidebar from '../navigation/ManagementSidebar';
import ManagementHeader from '../navigation/ManagementHeader';
import { LogOut, Bell } from 'lucide-react';
import { Menu, X } from 'lucide';
import MorphIcon from '@/components/common/MorphIcon';

const ManagementLayout = ({ menuItems, title }) => {
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };
    const closeOnOutsidePress = (event) => {
      if (
        !mobileMenuRef.current?.contains(event.target)
        && !mobileMenuButtonRef.current?.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsidePress);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsidePress);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1280px)');
    const closeMenuOnDesktop = (event) => {
      if (event.matches) setMobileMenuOpen(false);
    };

    desktopQuery.addEventListener?.('change', closeMenuOnDesktop);
    return () => desktopQuery.removeEventListener?.('change', closeMenuOnDesktop);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex">
      <a
        href="#management-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-bold focus:text-viet-green focus:shadow-xl"
      >
        Chuyển đến nội dung chính
      </a>

      <ManagementSidebar key={user?.id || user?.username || 'management'} menuItems={menuItems} title={title} />

      <header className="xl:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-viet-border z-50 flex items-center justify-between px-4">
        <Link
          to="/"
          className={`flex items-center gap-3 min-w-0`}
          aria-label="Về trang chủ AURUM"
        >
          <img src="/logo.png" alt="" aria-hidden="true" className="w-8 h-8 object-contain shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-black text-viet-text uppercase leading-none">AURUM</p>
            <p className="text-[10px] font-bold text-viet-text-light uppercase truncate">{title}</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {user?.role === 'teacher' && (
            <button type="button" className="w-11 h-11 shrink-0 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
              <Bell size={18} />
            </button>
          )}
          <button
            ref={mobileMenuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="w-11 h-11 shrink-0 rounded-xl border border-viet-border bg-white flex items-center justify-center text-viet-text"
            aria-label={mobileMenuOpen ? 'Đóng trình đơn' : 'Mở trình đơn'}
            aria-expanded={mobileMenuOpen}
            aria-controls="management-mobile-menu"
          >
            <MorphIcon icon={mobileMenuOpen ? X : Menu} size={20} />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="aurum-backdrop xl:hidden fixed inset-0 z-40 bg-black/30">
          <nav
            ref={mobileMenuRef}
            id="management-mobile-menu"
            aria-label={`Điều hướng ${title}`}
            className="aurum-panel absolute top-16 left-0 right-0 max-h-[calc(100dvh-4rem)] overflow-y-auto bg-white border-b border-viet-border shadow-xl p-4 space-y-2"
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
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 w-full hover:bg-red-50"
            >
              <LogOut size={18} />
              <span>Đăng xuất</span>
            </button>
          </nav>
        </div>
      )}
      
      {/* Main Content Area */}
      <main id="management-main-content" tabIndex="-1" className="xl:ml-[242px] min-w-0 flex-1 h-screen h-dvh overflow-y-auto pt-16 xl:pt-0 bg-[#f4f7fb] flex flex-col">
         <ManagementHeader title={title} />
         <div className="flex-1 pb-20">
            <Suspense fallback={<LoadingScreen inline />}>
              <PageTransition><Outlet /></PageTransition>
            </Suspense>
         </div>
      </main>
    </div>
  );
};

export default ManagementLayout;
