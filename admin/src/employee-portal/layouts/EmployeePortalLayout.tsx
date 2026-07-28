import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import { employeePortalService } from '../services/employeeApi';
import {
  LayoutDashboard, User, Clock, CalendarDays, Wallet,
  FolderOpen, Megaphone, Users, HeadphonesIcon, Bell, LogOut,
  ChevronRight, Shield, Search, Clock3, Calendar, ChevronDown, X, Truck, FileText, ShieldAlert, RotateCcw
} from 'lucide-react';

export default function EmployeePortalLayout() {
  const { user, logout } = useEmployeeAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [clockedIn, setClockedIn] = useState(false);
  const [clocking, setClocking] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    employeePortalService.getDashboardSummary()
      .then(res => {
        if (res.data.success) {
          setClockedIn(res.data.data.clockedIn);
        }
      })
      .catch(() => {});

    employeePortalService.getNotifications()
      .then(res => {
        if (res.data.success) setNotifications(res.data.data);
      })
      .catch(() => {});
  }, []);

  const handleClockToggle = async () => {
    setClocking(true);
    try {
      if (clockedIn) {
        await employeePortalService.clockOut();
        setClockedIn(false);
      } else {
        await employeePortalService.clockIn({ address: 'Web Portal' });
        setClockedIn(true);
      }
    } catch (err: any) {
      alert(err.message || 'Clock toggle failed');
    } finally {
      setClocking(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/hr-portal/login', { replace: true });
  };

  const isManager = user?.role === 'manager' || user?.role === 'hr_admin';
  const isHRAdmin = user?.role === 'hr_admin';

  const navSections = [
    {
      label: 'Core Workspace',
      items: [
        { to: '/hr-portal', label: 'Dashboard', icon: LayoutDashboard, end: true },
        { to: '/hr-portal/shipments', label: 'Shipment Management', icon: Truck },
        { to: '/hr-portal/quotes', label: 'Quotation Management', icon: FileText },
        { to: '/hr-portal/billing', label: 'Billing & Credit Control', icon: Wallet },
        { to: '/hr-portal/claims', label: 'Claims & Insurance', icon: ShieldAlert },
        { to: '/hr-portal/returns', label: 'Reverse Logistics & Returns', icon: RotateCcw },
        { to: '/hr-portal/support', label: 'Support & Tickets Desk', icon: HeadphonesIcon },
        { to: '/hr-portal/profile', label: 'My Profile', icon: User },
        { to: '/hr-portal/payroll', label: 'My Payslips', icon: Wallet },
      ]
    },
    {
      label: 'Company & Resources',
      items: [
        { to: '/hr-portal/documents', label: 'Documents & Policies', icon: FolderOpen },
        { to: '/hr-portal/announcements', label: 'Announcements', icon: Megaphone },
        { to: '/hr-portal/directory', label: 'Employee Directory', icon: Users },
        { to: '/hr-portal/settings', label: 'Settings & Preferences', icon: Shield },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      
      {/* ── SIDEBAR (Matching Admin ERP #0F172A Aesthetic) ───────────────── */}
      <aside className="w-[280px] bg-[#0F172A] border-r border-slate-800 flex flex-col h-full shrink-0 text-slate-300">
        
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center space-x-3 text-white">
            <div className="relative flex items-center justify-center w-full">
              <img src="/lizome-icon.svg" className="h-10 w-auto" alt="LIZOME" />
            </div>
          </div>
        </div>

        {/* Role Badge Indicator */}
        <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Workspace Scope</span>
          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
            isHRAdmin
              ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
              : isManager
              ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
          }`}>
            {user?.role === 'hr_admin' ? 'HR Admin' : user?.role === 'manager' ? 'Manager' : 'CUSTOMER'}
          </span>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-hide">
          {navSections.map(section => (
            <div key={section.label}>
              <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map(({ to, label, icon: Icon, end }) => {
                  const isActive = end ? location.pathname === to : location.pathname.startsWith(to);
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      end={end}
                      className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-150 font-medium text-sm ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <Icon size={17} className={`mr-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Sign Out */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-400 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── MAIN WORKSPACE CONTAINER ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header (Matching White Clean Admin ERP Aesthetic) */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
          
          {/* Search Bar */}
          <div className="flex items-center flex-1">
            <div className="relative w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-xs font-medium transition-colors"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-5">

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative text-gray-500 hover:text-gray-700 transition-colors p-1"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-900">Notifications</span>
                    <button onClick={() => setNotificationsOpen(false)} className="text-gray-400 hover:text-gray-600">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1">
                        <div className="flex items-center justify-between text-gray-900 font-bold">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-gray-400">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-gray-600">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Calendar Icon */}
            <button className="text-gray-500 hover:text-gray-700 transition-colors p-1">
              <Calendar className="h-5 w-5" />
            </button>

            {/* User Profile Avatar Dropdown */}
            <div
              onClick={() => navigate('/hr-portal/settings')}
              className="flex items-center space-x-2.5 border-l border-gray-200 pl-4 cursor-pointer hover:opacity-80 transition-opacity"
              title="Go to User Settings"
            >
              {user?.avatarUrl || user?.photo ? (
                <img
                  src={user.avatarUrl || user.photo}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center border border-slate-200">
                  {user?.firstName?.[0] || 'A'}{user?.lastName?.[0] || 'U'}
                </div>
              )}
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-gray-800 leading-none">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Admin User'}
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5 leading-none">
                  {user?.email || 'admin@aura.com'}
                </span>
              </div>
            </div>

          </div>
        </header>

        {/* Main Content Workspace (Light Gray #F8FAFC Background) */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-[#F8FAFC]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
