import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCog, Settings, Package, Tags, Briefcase, Handshake, Mail, Map, Link as LinkIcon, Database, TrendingUp, Anchor, Plane, Truck, Globe, Car, Building2, ShieldCheck, FileText, Box, ShoppingCart, Landmark, ReceiptText, Shield, Crosshair, DollarSign, Command, RotateCcw, Megaphone, UserCheck, BarChart3, FolderKanban, Cpu, LogOut, Layers, UserCircle, UsersRound, BrainCircuit, Smartphone, Bell, LineChart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navSections = [
  {
    label: 'Core',
    items: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'Analytics', path: '/analytics', icon: BarChart3 },
      { name: 'BI Dashboard', path: '/bi-dashboard', icon: TrendingUp },
      { name: 'Reports', path: '/reports', icon: FileText },
      { name: 'AI Operations Hub', path: '/ai-hub', icon: BrainCircuit },
      { name: 'AI Forecast', path: '/ai-forecast', icon: LineChart },
      { name: 'AI Notifications', path: '/ai-notifications', icon: Bell },
      { name: 'CRM & Sales', path: '/crm', icon: Users },
      { name: 'Quotations', path: '/quotations', icon: FolderKanban },
    ]
  },
  {
    label: 'Logistics & Freight',
    items: [
      { name: 'Shipments', path: '/shipments', icon: Globe },
      { name: 'Ocean Freight', path: '/ocean-freight', icon: Anchor },
      { name: 'Air Freight', path: '/air-freight', icon: Plane },
      { name: 'Road Transport', path: '/road-transport', icon: Truck },
      { name: 'Fleet Maintenance', path: '/fleet-management', icon: Car },
      { name: 'Container Management', path: '/containers', icon: Box },
      { name: 'Real-Time Tracking', path: '/tracking', icon: Crosshair },
    ]
  },
  {
    label: 'Operations',
    items: [
      { name: 'Procurement', path: '/procurement', icon: ShoppingCart },
      { name: 'Warehouse', path: '/warehouse', icon: Building2 },
      { name: 'Customs Clearance', path: '/customs', icon: ShieldCheck },
      { name: 'Document Center', path: '/documents', icon: FileText },
    ]
  },
  {
    label: 'Finance',
    items: [
      { name: 'Accounting', path: '/finance', icon: Landmark },
      { name: 'Billing & Invoicing', path: '/billing', icon: ReceiptText },
      { name: 'Insurance & Claims', path: '/insurance', icon: Shield },
    ]
  },
  {
    label: 'ERP Modules',
    items: [
      { name: 'Inventory', path: '/inventory', icon: Package },
      { name: 'Sales Orders', path: '/orders', icon: ShoppingCart },
      { name: 'Supply Chain', path: '/supply-chain', icon: Truck },
      { name: 'Manufacturing', path: '/manufacturing', icon: Cpu },
      { name: 'Projects', path: '/projects', icon: FolderKanban },
      { name: 'Assets', path: '/assets', icon: Layers },
    ]
  },
  {
    label: 'People & Finance',
    items: [
      { name: 'HR & Payroll', path: '/hr', icon: Users },
      { name: 'Finance', path: '/finance', icon: DollarSign },
      { name: 'Company Stock', path: '/stock', icon: Briefcase },
    ]
  },
  {
    label: 'D2C',
    items: [
      { name: 'Marketing', path: '/marketing', icon: Megaphone },
      { name: 'Returns', path: '/returns', icon: RotateCcw },
    ]
  },
  {
    label: 'System',
    items: [
      { name: 'Company Master', path: '/company-management', icon: Building2 },
      { name: 'Auth & RBAC', path: '/rbac', icon: ShieldCheck },
      { name: 'User Access', path: '/access', icon: UserCheck },
    ]
  },
  {
    label: 'Portals & Apps',
    items: [
      { name: 'Customer Portal', path: '/customer-portal', icon: UserCircle },
      { name: 'Vendor Portal', path: '/vendor-portal', icon: Handshake },
      { name: 'Employee Portal', path: '/hr-portal', icon: UsersRound },
      { name: 'Driver App', path: '/mobile/driver', icon: Smartphone },
      { name: 'Warehouse App', path: '/mobile/warehouse', icon: Smartphone },
    ]
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('erp_user');
    logout();
    navigate('/login');
  };

  return (
    <div className="w-72 bg-slate-950 text-slate-400 flex flex-col h-full border-r border-slate-900/60 z-20 overflow-y-auto">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-900/60">
        <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2.5 rounded-xl text-white shadow-[0_4px_20px_rgba(99,102,241,0.25)]">
          <Command size={18} className="stroke-[2.5]" />
        </div>
        <span className="text-xl font-black tracking-tight text-white">Aura<span className="text-indigo-500 font-extrabold">.</span></span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-6">
        {navSections
          .filter(section => {
            if (user?.role === 'System Admin' || user?.role === 'Admin') return true;
            if (!user?.permissions) return section.label === 'Core';
            
            // Check if user has permission for ANY item in this section
            const hasPermission = section.items.some(item => 
              user.permissions?.includes(item.name) || user.permissions?.includes('All Modules')
            );
            return hasPermission;
          })
          .map(section => (
          <div key={section.label} className="space-y-1.5">
            <p className="px-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">{section.label}</p>
            <div className="space-y-1">
              {section.items
                .filter(item => user?.role === 'System Admin' || user?.role === 'Admin' || user?.permissions?.includes(item.name) || user?.permissions?.includes('All Modules'))
                .map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.name} to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-semibold text-xs relative group ${isActive ? 'bg-indigo-600/15 text-white border border-indigo-500/25 shadow-[0_4px_20px_rgba(99,102,241,0.03)]' : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'}`}>
                    <item.icon size={15} className={`transition-colors ${isActive ? 'text-indigo-400 stroke-[2.5]' : 'text-slate-500 group-hover:text-slate-400'}`} />
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-5 border-t border-slate-900/60 flex flex-col space-y-4">
        <a href="http://localhost:3000" target="_blank" rel="noreferrer" className="flex items-center justify-center space-x-2 w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-800/80 shadow-inner">
          <ShoppingCart size={14} className="text-slate-400" />
          <span>Open Customer Store</span>
        </a>
        <div className="flex items-center justify-between bg-slate-900/40 border border-slate-900/30 p-3 rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xs shadow-md">
                {user?.firstName?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-none mb-1">{user?.firstName || 'Admin'} User</p>
              <p className="text-[10px] text-slate-500 font-semibold">{user?.role || 'Administrator'}</p>
            </div>
          </div>
          <button onClick={handleLogout} title="Sign out" className="text-slate-500 hover:text-red-400 transition-colors p-1.5 bg-slate-900/40 hover:bg-slate-900 rounded-lg">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
