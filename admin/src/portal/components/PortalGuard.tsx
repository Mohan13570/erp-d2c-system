import { Navigate, Outlet } from 'react-router-dom';
import { usePortalAuth } from '../context/PortalAuthContext';

/**
 * PortalGuard — protects every route inside /portal/*
 *
 * Shows a spinner while the auth state initialises from localStorage,
 * then redirects to /portal/login if unauthenticated.
 *
 * Does NOT import or depend on the admin RequireAuth guard.
 */
export default function PortalGuard() {
  const { isAuthenticated, isInitializing } = usePortalAuth();

  if (isInitializing) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0f172a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-sky-500 border-t-transparent animate-spin" />
          <p className="text-sky-400 text-sm tracking-widest animate-pulse">LOADING PORTAL</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/portal/login" replace />;
  }

  return <Outlet />;
}
