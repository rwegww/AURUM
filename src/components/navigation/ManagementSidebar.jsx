import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Avatar from '../common/Avatar';
import { Bell, FileText, Hourglass, LogOut, MessageCircle, School, X } from 'lucide-react';

const READ_NOTIFICATION_STORAGE_PREFIX = 'teacher_read_notification_ids';

const normalizeReadIds = (ids) => (
  Array.isArray(ids)
    ? Array.from(new Set(ids.filter((id) => typeof id === 'string'))).slice(-500)
    : []
);

const loadReadIds = (storageKey) => {
  if (typeof window === 'undefined') return [];

  try {
    return normalizeReadIds(JSON.parse(window.localStorage.getItem(storageKey) || '[]'));
  } catch {
    return [];
  }
};

const getNotificationIcon = (type) => {
  switch (type) {
    case 'student_join': return <School size={17} aria-hidden="true" />;
    case 'message': return <MessageCircle size={17} aria-hidden="true" />;
    case 'submission': return <FileText size={17} aria-hidden="true" />;
    case 'due_soon': return <Hourglass size={17} aria-hidden="true" />;
    default: return <Bell size={17} aria-hidden="true" />;
  }
};

const getRelativeTime = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return 'Không rõ thời gian';

  const diffMs = now - date;
  if (diffMs < 0) {
    const diffSec = Math.floor(Math.abs(diffMs) / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'Còn dưới 1 phút';
    if (diffMin < 60) return `Còn ${diffMin} phút`;
    if (diffHr < 24) return `Còn ${diffHr} giờ`;
    return `Còn ${diffDay} ngày`;
  }

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHr < 24) return `${diffHr} giờ trước`;
  if (diffDay === 1) return 'Hôm qua';
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
};

export const NotificationPanel = ({
  id,
  className,
  notifications,
  readIds,
  unreadCount,
  onClose,
  onMarkAllAsRead,
  onOpenNotification,
  onToggleReadStatus,
  panelRef,
}) => (
  <motion.section
    ref={panelRef}
    id={id}
    role="region"
    aria-labelledby={`${id}-title`}
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    className={`${className} bg-white/95 backdrop-blur-md border border-viet-border rounded-3xl shadow-xl flex flex-col overflow-hidden`}
  >
    <div className="p-4 border-b border-viet-border flex justify-between items-center gap-3 bg-slate-50/50">
      <span id={`${id}-title`} className="text-xs font-black text-viet-text uppercase tracking-wider">
        Thông báo
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMarkAllAsRead}
          disabled={unreadCount === 0}
          className="text-[10px] font-bold text-viet-green hover:underline uppercase disabled:cursor-default disabled:text-slate-400 disabled:no-underline"
        >
          Đánh dấu đã đọc
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-viet-text"
          aria-label="Đóng thông báo"
        >
          <X size={17} aria-hidden="true" />
        </button>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
      {notifications.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <Bell size={28} aria-hidden="true" className="mx-auto mb-2" />
          <p className="text-xs font-medium">Chưa có thông báo nào</p>
        </div>
      ) : (
        notifications.map((notification) => {
          const isUnread = !readIds.includes(notification.id);
          const destination = typeof notification.link === 'string' && notification.link.startsWith('/')
            ? notification.link
            : '/teacher';

          return (
            <div
              key={notification.id}
              className={`relative hover:bg-slate-50/80 transition-colors ${isUnread ? 'bg-viet-green/5' : ''}`}
            >
              <NavLink
                to={destination}
                onClick={() => onOpenNotification(notification.id)}
                className="p-4 pr-12 block"
              >
                <div className="flex gap-2 items-start">
                  <span className="text-viet-green shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-snug ${isUnread ? 'font-black text-viet-text' : 'font-bold text-slate-700'}`}>
                      {notification.title || 'Thông báo mới'}
                    </p>
                    {notification.message && (
                      <p className="text-[11px] text-viet-text-light mt-1 font-medium leading-relaxed break-words">
                        {notification.message}
                      </p>
                    )}
                    <p className="text-[9px] text-slate-400 mt-1 font-bold uppercase tracking-wider">
                      {getRelativeTime(notification.timestamp)}
                    </p>
                  </div>
                </div>
              </NavLink>

              <button
                type="button"
                onClick={() => onToggleReadStatus(notification.id)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
                title={isUnread ? 'Đánh dấu là đã đọc' : 'Đánh dấu là chưa đọc'}
                aria-label={isUnread ? 'Đánh dấu là đã đọc' : 'Đánh dấu là chưa đọc'}
              >
                <span className={`w-2.5 h-2.5 rounded-full transition-all ${
                  isUnread
                    ? 'bg-viet-green scale-110 shadow-sm shadow-viet-green/20'
                    : 'border-2 border-slate-300 bg-transparent hover:bg-slate-400'
                }`} />
              </button>
            </div>
          );
        })
      )}
    </div>
  </motion.section>
);

const ManagementSidebar = ({ menuItems, title }) => {
  const { user, logout } = useAuth();
  const storageKey = `${READ_NOTIFICATION_STORAGE_PREFIX}:${user?.id || user?.username || 'unknown'}`;
  const desktopNotificationRef = useRef(null);
  const desktopNotificationButtonRef = useRef(null);
  const mobileNotificationRef = useRef(null);
  const mobileNotificationButtonRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState(() => loadReadIds(storageKey));

  const saveReadIds = useCallback((ids) => {
    const normalizedIds = normalizeReadIds(ids);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(normalizedIds));
    } catch (err) {
      console.warn('Không thể lưu trạng thái thông báo đã đọc:', err);
    }
    setReadIds(normalizedIds);
  }, [storageKey]);

  const fetchNotifications = useCallback(async (signal) => {
    try {
      const token = window.localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/classes/teacher/notifications', {
        headers: { 'Authorization': `Bearer ${token}` },
        signal,
      });
      if (res.ok) {
        const data = await res.json();
        const validNotifications = Array.isArray(data)
          ? Array.from(new Map(
            data
              .filter((notification) => notification && typeof notification.id === 'string')
              .map((notification) => [notification.id, notification]),
          ).values())
          : [];
        setNotifications(validNotifications);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Lỗi tải thông báo:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (user?.role !== 'teacher') return undefined;

    const controller = new AbortController();
    let nextPoll;
    const poll = async () => {
      await fetchNotifications(controller.signal);
      if (!controller.signal.aborted) {
        nextPoll = window.setTimeout(poll, 30000);
      }
    };

    poll();
    return () => {
      controller.abort();
      window.clearTimeout(nextPoll);
    };
  }, [user?.id, user?.role, fetchNotifications]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const focusVisibleTrigger = () => {
      const mobileButton = mobileNotificationButtonRef.current;
      const trigger = mobileButton?.offsetParent !== null
        ? mobileButton
        : desktopNotificationButtonRef.current;
      trigger?.focus();
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        focusVisibleTrigger();
      }
    };
    const closeOnOutsidePress = (event) => {
      if (
        !desktopNotificationRef.current?.contains(event.target)
        && !mobileNotificationRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsidePress);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsidePress);
    };
  }, [isOpen]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !readIds.includes(n.id)).length;
  }, [notifications, readIds]);

  const markAsRead = (id) => {
    if (!readIds.includes(id)) {
      saveReadIds([...readIds, id]);
    }
  };

  const toggleReadStatus = (id) => {
    if (readIds.includes(id)) {
      saveReadIds(readIds.filter((readId) => readId !== id));
    } else {
      saveReadIds([...readIds, id]);
    }
  };

  const markAllAsRead = () => {
    saveReadIds([...readIds, ...notifications.map((notification) => notification.id)]);
  };

  const toggleNotifications = () => {
    setIsOpen((open) => !open);
  };

  const closeNotifications = () => {
    setIsOpen(false);
    window.requestAnimationFrame(() => {
      const mobileButton = mobileNotificationButtonRef.current;
      const trigger = mobileButton?.offsetParent !== null
        ? mobileButton
        : desktopNotificationButtonRef.current;
      trigger?.focus();
    });
  };

  return (
    <>
      {user?.role === 'teacher' && (
        <div ref={mobileNotificationRef} className="md:hidden fixed top-3 right-[4.25rem] z-[60]">
          <button
            ref={mobileNotificationButtonRef}
            type="button"
            onClick={toggleNotifications}
            aria-label={isOpen ? 'Đóng thông báo' : `Mở thông báo${unreadCount ? `, ${unreadCount} chưa đọc` : ''}`}
            aria-expanded={isOpen}
            aria-controls="teacher-notifications-mobile"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isOpen
                ? 'bg-viet-green/10 text-viet-green border border-viet-green/20'
                : 'bg-white text-slate-500 border border-viet-border'
            }`}
          >
            <Bell size={18} aria-hidden="true" />
          </button>
          {unreadCount > 0 && (
            <span aria-hidden="true" className="pointer-events-none absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-[9px] border-2 border-white">
              {unreadCount}
            </span>
          )}
          <span className="sr-only" aria-live="polite">
            {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Không có thông báo chưa đọc'}
          </span>

          <AnimatePresence>
            {isOpen && (
              <NotificationPanel
                id="teacher-notifications-mobile"
                className="fixed left-3 right-3 top-[4.5rem] z-[70] max-h-[calc(100dvh-5.5rem)]"
                notifications={notifications}
                readIds={readIds}
                unreadCount={unreadCount}
                onClose={closeNotifications}
                onMarkAllAsRead={markAllAsRead}
                onOpenNotification={(id) => {
                  markAsRead(id);
                  setIsOpen(false);
                }}
                onToggleReadStatus={toggleReadStatus}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      <aside
        aria-label={`Thanh điều hướng ${title}`}
        className="hidden md:flex w-64 h-screen h-dvh fixed top-0 left-0 bg-white border-r border-viet-border flex-col z-40"
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-viet-border">
          <NavLink to="/" className="flex items-center gap-2 group" aria-label="Về trang chủ AURUM">
            <div className="w-8 h-8 relative flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="" aria-hidden="true" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-black text-viet-text group-hover:text-viet-green transition-colors italic uppercase tracking-tighter">
              AURUM
            </span>
          </NavLink>
        </div>

        {/* Role / Context Title */}
        <div className="px-6 py-5 border-b border-viet-border/50 bg-slate-50/50 relative">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-viet-text-light/60 block mb-3">
            {title}
          </span>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 overflow-hidden">
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

            {/* Notification Bell */}
            {user?.role === 'teacher' && (
              <div ref={desktopNotificationRef} className="relative shrink-0">
                <button
                  ref={desktopNotificationButtonRef}
                  type="button"
                  onClick={toggleNotifications}
                  aria-label={isOpen ? 'Đóng thông báo' : `Mở thông báo${unreadCount ? `, ${unreadCount} chưa đọc` : ''}`}
                  aria-expanded={isOpen}
                  aria-controls="teacher-notifications-desktop"
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    isOpen
                      ? 'bg-viet-green/10 text-viet-green'
                      : 'bg-white hover:bg-slate-100 text-slate-500 border border-viet-border hover:text-slate-800'
                  }`}
                >
                  <Bell size={18} aria-hidden="true" />
                </button>
                {unreadCount > 0 && (
                  <span aria-hidden="true" className="pointer-events-none absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-[9px] border-2 border-white">
                    {unreadCount}
                  </span>
                )}
                <span className="sr-only" aria-live="polite">
                  {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Không có thông báo chưa đọc'}
                </span>

                <AnimatePresence>
                  {isOpen && (
                    <NotificationPanel
                      id="teacher-notifications-desktop"
                      className="fixed left-[16.5rem] top-20 z-50 w-80 max-h-[calc(100dvh-6rem)]"
                      notifications={notifications}
                      readIds={readIds}
                      unreadCount={unreadCount}
                      onClose={closeNotifications}
                      onMarkAllAsRead={markAllAsRead}
                      onOpenNotification={(id) => {
                        markAsRead(id);
                        setIsOpen(false);
                      }}
                      onToggleReadStatus={toggleReadStatus}
                    />
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav aria-label={`Các mục ${title}`} className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
          {menuItems.map((item, index) => (
            <NavLink
              key={item.path || item.label || index}
              to={item.path}
              end={item.path === '/admin' || item.path === '/teacher'}
              className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all relative group ${
                isActive
                  ? 'text-viet-green bg-viet-green/5 font-bold shadow-sm shadow-viet-green/5'
                  : 'text-viet-text-light font-medium hover:bg-slate-50 hover:text-viet-text'
              }`}
            >
              {({ isActive }) => (
                <>
                  <div aria-hidden="true" className={`shrink-0 transition-colors ${isActive ? 'text-viet-green' : 'text-slate-400 group-hover:text-viet-text'}`}>
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

        {/* Footer */}
        <div className="p-4 border-t border-viet-border bg-slate-50/30">
          <button
            type="button"
            onClick={logout}
            className="flex items-center justify-center w-full gap-2 px-4 py-3 rounded-xl text-red-500 font-bold text-[13px] hover:bg-red-50 transition-all active:scale-95"
          >
            <LogOut size={18} aria-hidden="true" /> Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
};

export default ManagementSidebar;

