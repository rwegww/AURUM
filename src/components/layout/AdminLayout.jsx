import React from 'react';
import ManagementLayout from './ManagementLayout';
import { LayoutDashboard, BookOpen, Users, MessageSquare, Settings, Map } from 'lucide-react';

const AdminLayout = () => {
  const adminMenu = [
    { label: 'Báº£ng Ä‘iá»u khiá»ƒn', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { label: 'HÃ nh trÃ¬nh', path: '/admin/journey', icon: <Map size={20} /> },
    { label: 'Há»c liá»‡u', path: '/admin/bai_hoc', icon: <BookOpen size={20} /> },
    { label: 'NgÆ°á»i dÃ¹ng', path: '/admin/nguoi_dung', icon: <Users size={20} /> },
    { label: 'Pháº£n há»“i', path: '/admin/feedback', icon: <MessageSquare size={20} /> },
    { label: 'CÃ i Ä‘áº·t (Sá»›m cÃ³)', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return <ManagementLayout role="admin" menuItems={adminMenu} title="Quáº£n Trá»‹ Há»‡ Thá»‘ng" />;
};

export default AdminLayout;

