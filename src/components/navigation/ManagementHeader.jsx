import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Avatar from '../common/Avatar';
import { Bell, FileText, Hourglass, MessageCircle, School, X, Search, ChevronDown } from 'lucide-react';

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
    className={`${className} bg-white border border-viet-border rounded-3xl shadow-xl flex flex-col overflow-hidden z-50`}
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

const ManagementHeader = ({ title }) => {
  const { user } = useAuth();
  const storageKey = `${READ_NOTIFICATION_STORAGE_PREFIX}:${user?.id || user?.username || 'unknown'}`;
  const desktopNotificationRef = useRef(null);
  const desktopNotificationButtonRef = useRef(null);
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
      desktopNotificationButtonRef.current?.focus();
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        focusVisibleTrigger();
      }
    };
    const closeOnOutsidePress = (event) => {
      if (!desktopNotificationRef.current?.contains(event.target)) {
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
      desktopNotificationButtonRef.current?.focus();
    });
  };

  return (
    <header className="hidden md:flex h-20 bg-white border-b border-viet-border px-8 items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-viet-text">{title}</h1>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Search Bar (Mock) */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm học sinh, bài tập..."
            className="w-64 pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-viet-green/50 focus:border-viet-green focus:bg-white transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-slate-200 rounded text-[10px] font-bold text-slate-500">
            ⌘K
          </div>
        </div>

        <div className="hidden lg:block w-px h-6 bg-slate-200" />

        {/* Notifications */}
        {user?.role === 'teacher' && (
          <div ref={desktopNotificationRef} className="relative shrink-0">
            <button
              ref={desktopNotificationButtonRef}
              type="button"
              onClick={toggleNotifications}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isOpen ? 'bg-viet-green/10 text-viet-green' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-sm'
              }`}
            >
              <Bell size={18} aria-hidden="true" />
            </button>
            {unreadCount > 0 && (
              <span aria-hidden="true" className="pointer-events-none absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-[10px] border-2 border-white shadow-sm">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}

            <AnimatePresence>
              {isOpen && (
                <NotificationPanel
                  id="teacher-notifications-desktop"
                  className="absolute right-0 mt-3 w-[340px] max-h-[400px]"
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

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-1 pr-3 py-1 bg-slate-50 rounded-full border border-slate-200 shadow-sm cursor-pointer hover:border-viet-green/50 hover:bg-white transition-colors group">
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200">
            <Avatar seed={user?.avatarSeed || user?.username} size={32} streakCount={user?.streakCount} level={user?.level} className="w-full h-full" />
          </div>
          <div className="flex flex-col py-1">
            <span className="text-sm font-bold text-slate-800 leading-none group-hover:text-viet-green transition-colors">{user?.username || 'Người dùng'}</span>
            <span className="text-[10px] font-bold text-slate-500 mt-0.5 leading-none">
              {user?.role === 'admin' ? 'Quản trị viên' : user?.role === 'teacher' ? 'Giáo viên' : user?.role}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 ml-1 group-hover:text-viet-green transition-colors" />
        </div>
      </div>
    </header>
  );
};

export default ManagementHeader;
