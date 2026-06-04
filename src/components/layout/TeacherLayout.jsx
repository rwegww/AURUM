import React from 'react';
import ManagementLayout from './ManagementLayout';
import { BookOpen, ClipboardList, LayoutDashboard, Users } from 'lucide-react';

const TeacherLayout = () => {
  const teacherMenu = [
    { label: 'Tổng quan', path: '/teacher', icon: <LayoutDashboard size={20} /> },
    { label: 'Lớp học của tôi', path: '/teacher/lop', icon: <Users size={20} /> },
    { label: 'Nhiệm vụ & Bài tập', path: '/teacher/assignments', icon: <ClipboardList size={20} /> },
    { label: 'Thư viện học liệu', path: '/teacher/library', icon: <BookOpen size={20} /> },
  ];

  return <ManagementLayout role="teacher" menuItems={teacherMenu} title="Cổng Giáo Viên" />;
};

export default TeacherLayout;

