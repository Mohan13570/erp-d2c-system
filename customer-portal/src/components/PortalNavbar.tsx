import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, Bell, LogOut, Settings, LayoutDashboard, PlusCircle, User, FileText } from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { Button } from './ui/button';

export default function PortalNavbar() {
  const { user, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/portal/login');
  };

  const navItems = [
    { to: '/portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/portal/bookings/new', label: 'New Freight Booking', icon: PlusCircle },
    { to: '/portal/documents', label: 'Documents', icon: FileText },
    { to: '/portal/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/portal/dashboard')}>
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <Package className="text-white w-5 h-5" />
          </div>
          <img src="/lizome-logo.png" alt="LIZOME" className="h-8 object-contain" />
        </div>

        {/* Main Navigation Bar */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 transition-colors py-1 ${
                  isActive
                    ? 'text-blue-600 font-bold border-b-2 border-blue-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Session Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/portal/settings')}
            className={`text-slate-500 hover:text-blue-600 ${location.pathname === '/portal/settings' ? 'text-blue-600 bg-blue-50 dark:bg-slate-800' : ''}`}
            title="Account Settings"
          >
            <Settings className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon" className="text-slate-500" title="Notifications">
            <Bell className="w-5 h-5" />
          </Button>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

          <Link to="/portal/settings" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold leading-none text-slate-900 dark:text-white">
                {user?.displayName || 'Acme Corp'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {user?.email || 'admin@acme.com'}
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
          </Link>

          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-500 hover:text-rose-600 ml-1" title="Sign Out">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

      </div>
    </header>
  );
}
