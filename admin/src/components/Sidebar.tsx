import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCog, Settings, Package, Tags, Briefcase, Handshake, Mail, Map, Link as LinkIcon, Database, TrendingUp, Anchor, Plane, Truck, Globe, Car, Building2, ShieldCheck, FileText, Box, ShoppingCart, Landmark, ReceiptText, Shield, Crosshair, DollarSign, Command, RotateCcw, Megaphone, UserCheck, BarChart3, FolderKanban, Cpu, LogOut, Layers, UserCircle, UsersRound, BrainCircuit, Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navSections = [
  {
    label: 'Core',
    items: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'Analytics', path: '/analytics', icon: BarChart3 },
      { name: 'BI Dashboard', path: '/bi-dashboard', icon: TrendingUp },
      { name: 'AI Operations Hub', path: '/ai-hub', icon: BrainCircuit },
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
    <div className="w-72 bg-white border-r border-gray-100 flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 overflow-y-auto">
      <div className="p-6 flex items-center space-x-3 border-b border-gray-100">
        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-sm">
          <Command size={22} />
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900">Aura<span className="text-indigo-600">.</span></span>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-6">
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
          <div key={section.label}>
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{section.label}</p>
            <div className="space-y-0.5">
              {section.items
                .filter(item => user?.role === 'System Admin' || user?.role === 'Admin' || user?.permissions?.includes(item.name) || user?.permissions?.includes('All Modules'))
                .map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.name} to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-150 font-medium text-sm ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                    <item.icon size={17} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-5 border-t border-gray-100 flex flex-col space-y-4">
        <a href="http://localhost:3000" target="_blank" rel="noreferrer" className="flex items-center justify-center space-x-2 w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200">
          <ShoppingCart size={16} />
          <span>Open Customer Store</span>
        </a>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                {user?.firstName?.charAt(0) || 'A'}
            </div>
            <div><p className="text-sm font-semibold text-gray-900">{user?.firstName || 'Admin'} User</p><p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p></div>
          </div>
          <button onClick={handleLogout} title="Sign out" className="text-gray-400 hover:text-red-500 transition-colors p-1">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
