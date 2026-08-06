import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Avatar from '../common/Avatar';
import { Bell, FileText, Hourglass, MessageCircle, School, X, Search, ChevronDown, Leaf } from 'lucide-react';

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
  if (diffMs < 0) return 'Vừa xong';
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

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
    className={`${className} bg-white border border-slate-200/80 rounded-3xl shadow-xl flex flex-col overflow-hidden z-50`}
  >
    <div className="p-4 border-b border-slate-100 flex justify-between items-center gap-3 bg-slate-50/50">
      <span id={`${id}-title`} className="text-xs font-black text-slate-800 uppercase tracking-wider">
        Thông báo
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMarkAllAsRead}
          disabled={unreadCount === 0}
          className="text-[10px] font-bold text-blue-600 hover:underline uppercase disabled:cursor-default disabled:text-slate-400 disabled:no-underline"
        >
          Đánh dấu đã đọc
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100"
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
              className={`relative hover:bg-slate-50/80 transition-colors ${isUnread ? 'bg-blue-50/30' : ''}`}
            >
              <NavLink
                to={destination}
                onClick={() => onOpenNotification(notification.id)}
                className="p-4 pr-12 block"
              >
                <div className="flex gap-2 items-start">
                  <span className="text-blue-600 shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-snug ${isUnread ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                      {notification.title || 'Thông báo mới'}
                    </p>
                    {notification.message && (
                      <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed break-words">
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
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400"
                title={isUnread ? 'Đánh dấu là đã đọc' : 'Đánh dấu là chưa đọc'}
                aria-label={isUnread ? 'Đánh dấu là đã đọc' : 'Đánh dấu là chưa đọc'}
              >
                <span className={`w-2.5 h-2.5 rounded-full transition-all ${
                  isUnread
                    ? 'bg-blue-600 scale-110 shadow-sm shadow-blue-500/20'
                    : 'border-2 border-slate-300 bg-transparent'
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
      window.localStorage.getItem(storageKey);
      window.localStorage.setItem(storageKey, JSON.stringify(normalizedIds));
    } catch (err) {
      console.warn('Lỗi lưu trạng thái thông báo:', err);
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

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !readIds.includes(n.id)).length;
  }, [notifications, readIds]);

  const markAsRead = (id) => {
    if (!readIds.includes(id)) saveReadIds([...readIds, id]);
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
  };

  return (
    <header className="hidden md:flex bg-white/90 backdrop-blur-md px-8 py-5 border-b border-slate-200/60 items-center justify-between sticky top-0 z-30">
      
      {/* Title & Greeting */}
      <div>
        <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-0.5">
          Xin chào, {user?.username || 'admin'} 👋
        </p>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
        <p className="text-xs font-medium text-slate-400 mt-0.5">Cùng xây dựng môi trường học tập tốt hơn mỗi ngày</p>
      </div>
      
      {/* Right Controls */}
      <div className="flex items-center gap-4">
        
        {/* Search Input */}
        <div className="relative hidden xl:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm học sinh, bài tập..."
            className="w-64 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white transition-all shadow-sm"
          />
        </div>

        {/* Notification Bell */}
        <div ref={desktopNotificationRef} className="relative shrink-0">
          <button
            ref={desktopNotificationButtonRef}
            type="button"
            onClick={toggleNotifications}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all bg-white border border-slate-200/80 shadow-sm hover:border-blue-500 ${
              isOpen ? 'ring-2 ring-blue-500/40 text-blue-600' : 'text-slate-600'
            }`}
          >
            <Bell size={18} aria-hidden="true" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

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

        {/* User Badge */}
        <div className="flex items-center gap-3 px-3 py-1.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm cursor-pointer hover:border-blue-500 transition-all">
          <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-slate-100">
            <Avatar seed={user?.avatarSeed || user?.username || 'admin'} size={32} className="w-full h-full" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-black text-slate-800 leading-none">{user?.username || 'admin'}</span>
            <span className="text-[10px] font-bold text-slate-400 mt-1 leading-none">
              {user?.role === 'admin' ? 'Quản trị viên' : user?.role === 'teacher' ? 'Giáo viên' : 'Quản trị viên'}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </div>

        {/* Date & Handwritten Quote Accent */}
        <div className="hidden lg:flex flex-col items-end pl-2 border-l border-slate-200/60 ml-2 relative">
          <span className="text-[11px] font-bold text-slate-400">Thứ Ba, 01 Tháng 4, 2025</span>
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 italic font-serif">
            <Leaf size={12} className="text-emerald-500" /> Tri thức Tạo nên những cơ hội mới
          </div>
        </div>

      </div>
    </header>
  );
};

export default ManagementHeader;
