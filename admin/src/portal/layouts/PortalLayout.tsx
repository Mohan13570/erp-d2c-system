import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { usePortalAuth } from '../context/PortalAuthContext';
import {
  LayoutDashboard, Package, FileText, FolderOpen,
  CreditCard, ShieldCheck, RotateCcw, HeadphonesIcon, User, LogOut, ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/portal',            label: 'Dashboard',      icon: LayoutDashboard,  end: true },
  { to: '/portal/shipments',  label: 'My Shipments',   icon: Package },
  { to: '/portal/quotations', label: 'Quotations',     icon: FileText },
  { to: '/portal/documents',  label: 'Documents',      icon: FolderOpen },
  { to: '/portal/billing',    label: 'Billing',        icon: CreditCard },
  { to: '/portal/claims',     label: 'Claims',         icon: ShieldCheck },
  { to: '/portal/returns',    label: 'Returns',        icon: RotateCcw },
  { to: '/portal/support',    label: 'Support',        icon: HeadphonesIcon },
  { to: '/portal/profile',    label: 'Profile',        icon: User },
];

/**
 * PortalLayout — the persistent shell for all authenticated /portal/* pages.
 *
 * Renders a dark sidebar + top bar + <Outlet /> for child pages.
 * Completely independent of the admin Sidebar and Header components.
 */
export default function PortalLayout() {
  const { user, logout } = usePortalAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/portal/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-white font-sans overflow-hidden">

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside className="w-64 shrink-0 flex flex-col bg-[#0f172a] border-r border-white/5">

        {/* Brand */}
        <div className="px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Package size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-wide">Lizome</p>
              <p className="text-[10px] text-sky-400 font-medium uppercase tracking-widest">Customer Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={16} className={isActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-300'} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight size={12} className="text-sky-400/60" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-xs font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-slate-500 truncate">{user?.companyName}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="h-14 shrink-0 flex items-center px-6 border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-md">
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-slate-400 font-medium">Live</span>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
