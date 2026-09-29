import React from 'react';
import ManagementLayout from './ManagementLayout';
import { LayoutDashboard, BookOpen, Users, MessageSquare, Map, ShieldCheck, FlaskConical, Trophy, Home } from 'lucide';
import MorphIcon from '@/components/common/MorphIcon';

const AdminLayout = () => {
  const adminMenu = [
    { label: 'Tổng quan', path: '/admin', icon: <MorphIcon icon={LayoutDashboard} size={20} /> },
    { label: 'Hành trình', path: '/admin/journey', icon: <MorphIcon icon={Map} size={20} /> },
    { label: 'Học liệu', path: '/admin/bai_hoc', icon: <MorphIcon icon={BookOpen} size={20} /> },
    { label: 'Người dùng', path: '/admin/nguoi_dung', icon: <MorphIcon icon={Users} size={20} /> },
    { label: 'Phản hồi', path: '/admin/feedback', icon: <MorphIcon icon={MessageSquare} size={20} /> },
    { label: 'Duyệt thay đổi', path: '/admin/approvals', icon: <MorphIcon icon={ShieldCheck} size={20} /> },
    { label: 'Trang học sinh', path: '/', icon: <MorphIcon icon={Home} size={20} /> },
    { label: 'Hành trình học', path: '/classroom', icon: <MorphIcon icon={Map} size={20} /> },
    { label: 'Lớp học tham gia', path: '/my-class', icon: <MorphIcon icon={Users} size={20} /> },
    { label: 'Phòng thí nghiệm', path: '/lab', icon: <MorphIcon icon={FlaskConical} size={20} /> },
    { label: 'Đấu trường', path: '/arena', icon: <MorphIcon icon={Trophy} size={20} /> },
    { label: 'Thư viện học sinh', path: '/library', icon: <MorphIcon icon={BookOpen} size={20} /> },
  ];

  return <ManagementLayout role="admin" menuItems={adminMenu} title="Quản trị hệ thống AURUM" />;
};

export default AdminLayout;
