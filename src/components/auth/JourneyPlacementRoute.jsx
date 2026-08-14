import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { canAccessJourneyGrade } from '@/utils/studentPlacement';

const JourneyPlacementRoute = ({ children }) => {
  const { grade } = useParams();
  const { user } = useAuth();

  if (!canAccessJourneyGrade(user, grade)) {
    return <Navigate to="/classroom" replace />;
  }

  return children;
};

export default JourneyPlacementRoute;

