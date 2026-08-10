import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getPostLoginPath } from '@/utils/authNavigation';
import LoadingScreen from '@/components/common/LoadingScreen';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen label="Đang xác thực thông tin…" />;
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
