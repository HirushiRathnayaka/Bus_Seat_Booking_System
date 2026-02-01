import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAdminLoggedIn } from "../api/adminAuth";


export default function AdminRoute({ children }) {
  return isAdminLoggedIn() ? children : <Navigate to="/admin/login" replace />;
}