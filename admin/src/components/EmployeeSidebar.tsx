import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Clock, 
  Calendar, 
  Wallet, 
  UserCircle, 
  HeadphonesIcon, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EmployeeSidebar() {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/hr-portal', icon: LayoutDashboard },
    { name: 'Attendance', path: '/hr-portal/attendance', icon: Clock },
    { name: 'Leave Management', path: '/hr-portal/leave', icon: Calendar },
    { name: 'My Payslips', path: '/hr-portal/payroll', icon: Wallet },
    { name: 'My Profile', path: '/hr-portal/profile', icon: UserCircle },
    { name: 'Documents & Policies', path: '/hr-portal/documents', icon: HeadphonesIcon },
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300">
      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-3">
        <img src="/lizome-icon.svg" className="h-8 w-auto" alt="LIZOME" />
        <div>
          <p className="text-sm font-bold text-white tracking-wide">Lizome ERP</p>
          <p className="text-[10px] text-teal-400 font-medium uppercase tracking-widest">Employee Workspace</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                  : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-sm font-bold uppercase">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-slate-500 truncate">{user?.role || 'Employee'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all font-semibold"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
