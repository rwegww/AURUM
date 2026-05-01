import React from 'react';
import ManagementLayout from './ManagementLayout';
import { LayoutDashboard, BookOpen, Users, MessageSquare, Settings } from 'lucide-react';

const AdminLayout = () => {
  const adminMenu = [
    { label: 'Bảng điều khiển', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { label: 'Học liệu', path: '/admin/lessons', icon: <BookOpen size={20} /> },
    { label: 'Người dùng', path: '/admin/users', icon: <Users size={20} /> },
    { label: 'Phản hồi', path: '/admin/feedback', icon: <MessageSquare size={20} /> },
    { label: 'Cài đặt (Sớm có)', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return <ManagementLayout role="admin" menuItems={adminMenu} title="Quản Trị Hệ Thống" />;
};

export default AdminLayout;
