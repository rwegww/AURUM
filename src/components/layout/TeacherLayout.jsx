import React from 'react';
import ManagementLayout from './ManagementLayout';

const TeacherLayout = () => {
  const teacherMenu = [
    { label: 'Tổng quan', path: '/teacher', icon: '🏫' },
    { label: 'Lớp học của tôi', path: '/teacher/classes', icon: '👥' },
    { label: 'Nhiệm vụ & Bài tập', path: '/teacher/assignments', icon: '📝' },
  ];

  return <ManagementLayout role="teacher" menuItems={teacherMenu} title="Cổng Giáo Viên" />;
};

export default TeacherLayout;
