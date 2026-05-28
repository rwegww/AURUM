import React from 'react';
import ManagementLayout from './ManagementLayout';
import { BookOpen, ClipboardList, LayoutDashboard, Users } from 'lucide-react';

const TeacherLayout = () => {
  const teacherMenu = [
    { label: 'Tá»•ng quan', path: '/teacher', icon: <LayoutDashboard size={20} /> },
    { label: 'Lá»›p há»c cá»§a tÃ´i', path: '/teacher/lop', icon: <Users size={20} /> },
    { label: 'Nhiá»‡m vá»¥ & BÃ i táº­p', path: '/teacher/assignments', icon: <ClipboardList size={20} /> },
    { label: 'ThÆ° viá»‡n há»c liá»‡u', path: '/teacher/library', icon: <BookOpen size={20} /> },
  ];

  return <ManagementLayout role="teacher" menuItems={teacherMenu} title="Cá»•ng GiÃ¡o ViÃªn" />;
};

export default TeacherLayout;

