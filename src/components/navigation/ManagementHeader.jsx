import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Avatar from '../common/Avatar';
import { Bell, FileText, Hourglass, MessageCircle, School, X, Search, ChevronDown, Leaf } from 'lucide-react';

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

const formatCurrentDate = () => {
  const formatted = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
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

  return (
    <header className="hidden md:flex min-h-[112px] bg-white/95 backdrop-blur-md px-8 py-5 border-b border-slate-200/60 items-center justify-between sticky top-0 z-30">
      
      {/* Title & Greeting */}
      <div>
        <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-0.5">
          Xin chào, {user?.username || 'admin'} 👋
        </p>
        <h1 className="text-[26px] leading-tight font-black text-[#0b1f44] tracking-tight">{title}</h1>
        <p className="text-xs font-medium text-slate-400 mt-0.5">Cùng xây dựng môi trường học tập tốt hơn mỗi ngày</p>
      </div>
      
      {/* Right Controls */}
      <div className="flex items-center gap-4">
        
        {/* Date & Handwritten Quote Accent */}
        <div className="hidden lg:flex flex-col items-end relative">
          <time dateTime={new Date().toISOString().slice(0, 10)} className="text-[11px] font-bold text-slate-500">
            {formatCurrentDate()}
          </time>
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 italic font-serif">
            <Leaf size={12} className="text-emerald-500" /> Mỗi phản ứng mở ra một khám phá mới
          </div>
        </div>

      </div>
    </header>
  );
};

export default ManagementHeader;
