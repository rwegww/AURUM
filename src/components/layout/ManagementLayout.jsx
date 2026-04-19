import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ManagementSidebar from '../navigation/ManagementSidebar';

const ManagementLayout = ({ role, menuItems, title }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else if (role === 'admin' && user.role !== 'admin') {
        navigate('/');
      } else if (role === 'teacher' && user.role !== 'teacher' && user.role !== 'admin') {
        // Admins can also view teacher panels
        navigate('/');
      }
    }
  }, [user, loading, navigate, role]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-viet-bg">
        <div className="w-16 h-16 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin"></div>
      </div>
    );
  }

  // Double check before rendering
  if (role === 'admin' && user.role !== 'admin') return null;
  if (role === 'teacher' && user.role !== 'teacher' && user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-viet-bg flex">
      <ManagementSidebar menuItems={menuItems} title={title} />
      
      {/* Main Content Area */}
      <main className="ml-64 flex-1 h-screen overflow-y-auto">
         <div className="pb-20">
            <Outlet />
         </div>
      </main>
    </div>
  );
};

export default ManagementLayout;
