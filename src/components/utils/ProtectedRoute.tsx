// components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import  isTokenExpired  from './TokenExpiration';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
