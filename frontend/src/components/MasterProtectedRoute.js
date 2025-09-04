// components/MasterProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const MasterProtectedRoute = ({ children }) => {
  const adminData = localStorage.getItem('adminData');
  
  if (!adminData) {
    return <Navigate to="/admin-login" replace />;
  }
  
  const admin = JSON.parse(adminData);
  if (!admin.isMaster) {
    return <Navigate to="/admin-dashboard" replace />;
  }
  
  return children;
};

export default MasterProtectedRoute;