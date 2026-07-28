import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';

export default function EmployeePortalGuard() {
  const { isAuthenticated, isInitializing } = useEmployeeAuth();

  if (isInitializing) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0F172A]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
          <p className="text-teal-400 text-xs font-bold tracking-widest uppercase animate-pulse">
            Loading Employee Portal...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/hr-portal/login" replace />;
  }

  return <Outlet />;
}
