import React from 'react';
import ManagementLayout from './ManagementLayout';

const IconOverview = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2.5">
    <path d="M3 12h18M3 6h18M3 18h11" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconClasses = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2.5">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconAssignments = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 20h9M12 4h9M3 4h6M3 12h6M3 20h6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TeacherLayout = () => {
  const teacherMenu = [
    { label: 'Tổng quan', path: '/teacher', icon: <IconOverview /> },
    { label: 'Lớp học của tôi', path: '/teacher/classes', icon: <IconClasses /> },
    { label: 'Nhiệm vụ & Bài tập', path: '/teacher/assignments', icon: <IconAssignments /> },
  ];

  return <ManagementLayout role="teacher" menuItems={teacherMenu} title="Cổng Giáo Viên" />;
};

export default TeacherLayout;
