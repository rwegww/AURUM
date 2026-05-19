import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Avatar from '../common/Avatar';
import { LogOut, Bell } from 'lucide-react';

const ManagementSidebar = ({ menuItems, title }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('teacher_read_notification_ids') || '[]');
    } catch {
      return [];
    }
  });

  const saveReadIds = (ids) => {
    localStorage.setItem('teacher_read_notification_ids', JSON.stringify(ids));
    setReadIds(ids);
  };

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/classes/teacher/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Lỗi tải thông báo:', err);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'teacher' || user?.role === 'admin') {
      const timeout = setTimeout(fetchNotifications, 0);
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, [user, fetchNotifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !readIds.includes(n.id)).length;
  }, [notifications, readIds]);

  const markAsRead = (id) => {
    if (!readIds.includes(id)) {
      const newReadIds = [...readIds, id];
      saveReadIds(newReadIds);
    }
  };

  const toggleReadStatus = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (readIds.includes(id)) {
      const newReadIds = readIds.filter(x => x !== id);
      saveReadIds(newReadIds);
    } else {
      const newReadIds = [...readIds, id];
      saveReadIds(newReadIds);
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    const newReadIds = Array.from(new Set([...readIds, ...allIds]));
    saveReadIds(newReadIds);
  };

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'student_join': return '🏫';
      case 'message': return '💬';
      case 'submission': return '📝';
      case 'due_soon': return '⏳';
      default: return '🔔';
    }
  };

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;

    if (diffMs < 0) {
      const absDiff = Math.abs(diffMs);
      const diffSec = Math.floor(absDiff / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHr = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHr / 24);
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

  return (
    <div className="hidden md:flex w-64 h-screen fixed top-0 left-0 bg-white border-r border-viet-border flex-col z-40">
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
          {(user?.role === 'teacher' || user?.role === 'admin') && (
            <div className="relative shrink-0">
              <button
                onClick={toggleNotifications}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isOpen 
                    ? 'bg-viet-green/10 text-viet-green' 
                    : 'bg-white hover:bg-slate-100 text-slate-500 border border-viet-border hover:text-slate-800'
                }`}
              >
                <Bell size={18} />
              </button>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-[9px] border-2 border-white animate-bounce">
                  {unreadCount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notification Flyout */}
      <AnimatePresence>
        {isOpen && (user?.role === 'teacher' || user?.role === 'admin') && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute left-64 top-20 ml-2 w-80 bg-white/90 backdrop-blur-md border border-viet-border rounded-3xl shadow-xl z-50 flex flex-col max-h-[500px] overflow-hidden"
          >
            <div className="p-4 border-b border-viet-border flex justify-between items-center bg-slate-50/50">
              <span className="text-xs font-black text-viet-text uppercase tracking-wider">Thông báo</span>
              <button 
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-viet-green hover:underline uppercase"
              >
                Đánh dấu đã đọc
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <span className="text-2xl block mb-2">🔔</span>
                  <p className="text-xs font-medium">Chưa có thông báo nào</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const isUnread = !readIds.includes(notif.id);
                  return (
                    <NavLink
                      key={notif.id}
                      to={notif.link}
                      onClick={() => {
                        markAsRead(notif.id);
                        setIsOpen(false);
                      }}
                      className={`p-4 block hover:bg-slate-50/80 transition-colors relative ${
                        isUnread ? 'bg-viet-green/5' : ''
                      }`}
                    >
                      <div className="flex gap-2 items-start justify-between">
                        <div className="flex gap-2 flex-1 min-w-0">
                          <span className="text-base shrink-0 mt-0.5">{getNotificationIcon(notif.type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs leading-snug ${isUnread ? 'font-black text-viet-text' : 'font-bold text-slate-700'}`}>{notif.title}</p>
                            <p className="text-[11px] text-viet-text-light mt-1 font-medium leading-relaxed break-words">
                              {notif.message}
                            </p>
                            <p className="text-[9px] text-slate-400 mt-1 font-bold uppercase tracking-wider">
                              {getRelativeTime(notif.timestamp)}
                            </p>
                          </div>
                        </div>

                        {/* Interactive Read/Unread Toggle Button */}
                        <button
                          onClick={(e) => toggleReadStatus(e, notif.id)}
                          className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all self-center ml-1"
                          title={isUnread ? "Đánh dấu là đã đọc" : "Đánh dấu là chưa đọc"}
                        >
                          <div className={`w-2.5 h-2.5 rounded-full transition-all ${
                            isUnread 
                              ? 'bg-viet-green scale-110 shadow-sm shadow-viet-green/20'
                              : 'border-2 border-slate-300 bg-transparent hover:bg-slate-400' 
                          }`} />
                        </button>
                      </div>
                    </NavLink>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
