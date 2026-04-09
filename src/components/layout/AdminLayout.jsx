import React from 'react';
import ManagementLayout from './ManagementLayout';

const AdminLayout = () => {
  const adminMenu = [
    { label: 'Dashboard', path: '/admin', icon: '📊' },
    { label: 'Học liệu', path: '/admin/lessons', icon: '📚' },
    { label: 'Người dùng', path: '/admin/users', icon: '👤' },
    { label: 'Phản hồi', path: '/admin/feedback', icon: '💬' },
    { label: 'Cài đặt (Sớm có)', path: '/admin/settings', icon: '⚙️' },
  ];

  return <ManagementLayout role="admin" menuItems={adminMenu} title="Quản Trị Hệ Thống" />;
};

export default AdminLayout;
