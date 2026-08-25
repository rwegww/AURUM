import React from 'react';
import ManagementLayout from './ManagementLayout';
import { BookOpen, ClipboardList, LayoutDashboard, Users } from 'lucide';
import MorphIcon from '@/components/common/MorphIcon';

const TeacherLayout = () => {
  const teacherMenu = [
    { label: 'Tổng quan', path: '/teacher', icon: <MorphIcon icon={LayoutDashboard} size={20} /> },
    { label: 'Lớp học của tôi', path: '/teacher/lop', icon: <MorphIcon icon={Users} size={20} /> },
    { label: 'Nhiệm vụ & Bài tập', path: '/teacher/assignments', icon: <MorphIcon icon={ClipboardList} size={20} /> },
    { label: 'Thư viện học liệu', path: '/teacher/library', icon: <MorphIcon icon={BookOpen} size={20} /> },
  ];

  return <ManagementLayout role="teacher" menuItems={teacherMenu} title="Cổng Giáo Viên" />;
};

export default TeacherLayout;
