import React from 'react';
import ManagementLayout from './ManagementLayout';
import { LayoutDashboard, BookOpen, Users, MessageSquare, Map, ShieldCheck } from 'lucide';
import MorphIcon from '@/components/common/MorphIcon';

const AdminLayout = () => {
  const adminMenu = [
    { label: 'Tổng quan', path: '/admin', icon: <MorphIcon icon={LayoutDashboard} size={20} /> },
    { label: 'Hành trình', path: '/admin/journey', icon: <MorphIcon icon={Map} size={20} /> },
    { label: 'Học liệu', path: '/admin/bai_hoc', icon: <MorphIcon icon={BookOpen} size={20} /> },
    { label: 'Người dùng', path: '/admin/nguoi_dung', icon: <MorphIcon icon={Users} size={20} /> },
    { label: 'Phản hồi', path: '/admin/feedback', icon: <MorphIcon icon={MessageSquare} size={20} /> },
    { label: 'Duyệt thay đổi', path: '/admin/approvals', icon: <MorphIcon icon={ShieldCheck} size={20} /> },
  ];

  return <ManagementLayout role="admin" menuItems={adminMenu} title="Quản trị hệ thống AURUM" />;
};

export default AdminLayout;
