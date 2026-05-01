import React from 'react';
import ManagementLayout from './ManagementLayout';
import { LayoutDashboard, Users, ClipboardList } from 'lucide-react';

const TeacherLayout = () => {
  const teacherMenu = [
    { label: 'Tổng quan', path: '/teacher', icon: <LayoutDashboard size={20} /> },
    { label: 'Lớp học của tôi', path: '/teacher/classes', icon: <Users size={20} /> },
    { label: 'Nhiệm vụ & Bài tập', path: '/teacher/assignments', icon: <ClipboardList size={20} /> },
  ];

  return <ManagementLayout role="teacher" menuItems={teacherMenu} title="Cổng Giáo Viên" />;
};

export default TeacherLayout;
