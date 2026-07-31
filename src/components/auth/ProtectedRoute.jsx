import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getPostLoginPath } from '@/utils/authNavigation';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-viet-bg">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin"></div>
          <p className="text-viet-text font-black text-sm uppercase tracking-widest animate-pulse">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    // Redirect to login but save the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getPostLoginPath(user)} replace />;
  }

  return children;
};

export default ProtectedRoute;
