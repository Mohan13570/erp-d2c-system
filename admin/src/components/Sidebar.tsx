import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, BookOpen, Scale, Activity, Anchor, ArrowDownToLine, ArrowRightLeft, BarChart2, BarChart3, Box, BrainCircuit, Briefcase, Building2, Calendar, Car, CheckCircle, ChevronDown, ChevronRight, ClipboardCheck, ClipboardList, Command, Cpu, CreditCard, Crosshair, DollarSign, DownloadCloud, FileBarChart, FileText, FolderKanban, Globe, Handshake, History, Landmark, Layers, LayoutDashboard, LayoutGrid, LogOut, Map, MapPin, Megaphone, Navigation, Navigation2, Package, PackageOpen, PackageSearch, Plane, Plus, QrCode, ReceiptText, RefreshCcw, RotateCcw, Route, Send, Settings, Shield, ShieldCheck, Ship, ShoppingCart, Smartphone, Target, TerminalSquare, ThermometerSnowflake, TrendingUp, Truck, UserCheck, UserCircle, Users, UsersRound, Wrench, GitMerge, Workflow, Bell, FileCode2, Database, Table, KeyRound, Webhook, Link2, Key, FileCheck, Inbox } from 'lucide-react';
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
      { name: 'Driver Master', path: '/drivers', icon: Users },
      { name: 'Vehicle Master', path: '/vehicles', icon: Car },
      { name: 'Shipment Dashboard', path: '/shipments', icon: LayoutDashboard },
      { name: 'Shipment List', path: '/shipments/list', icon: Globe },
      { name: 'Create Shipment', path: '/shipments/create', icon: Plus },
      { 
        name: 'CRM & Sales',
        icon: Users,
        subItems: [
          { name: 'Customer Dashboard', path: '/customer/dashboard', icon: BarChart3 },
          { name: 'Customer Directory', path: '/customer/directory', icon: Users },
          { name: 'Customer Onboarding', path: '/customer/register', icon: Briefcase },
          { name: 'Sales Pipeline', path: '/sales', icon: Target },
          { name: 'Quotations & Invoices', path: '/invoices', icon: DollarSign },
        ]
      },
      { 
        name: 'GPS Controller', 
        icon: Map,
        subItems: [
          { name: 'Trip Master', path: '/trips', icon: Navigation },
          { name: 'Advanced GIS Map', path: '/gps', icon: Map },
          { name: 'Geofence Studio', path: '/geofences', icon: ShieldCheck },
          { name: 'Route Optimizer', path: '/routes/plan', icon: Crosshair },
          { name: 'Alert Center', path: '/alerts', icon: Megaphone },
          { name: 'GPS Hardware', path: '/gps/devices', icon: Cpu },
          { name: 'BI Reports', path: '/reports/bi', icon: BarChart3 },
          { name: 'Real-Time Tracking', path: '/tracking', icon: Crosshair },
        ]
      },
      { 
        name: 'Ocean Freight', 
        icon: Anchor,
        subItems: [
          { name: 'Executive Dashboard', path: '/ocean/executive/dashboard', icon: Activity },
          { name: 'Global Map Tracking', path: '/ocean/tracking/map', icon: Crosshair },
          { name: 'Ocean Bookings', path: '/ocean/bookings', icon: Anchor },
          { name: 'Port Operations', path: '/ocean/ops/yard', icon: Box },
          { name: 'Finance & Billing', path: '/ocean/finance/billing', icon: DollarSign },
          { name: 'Customs Clearance', path: '/ocean/customs', icon: ShieldCheck },
        ]
      },
      { name: 'Air Freight', path: '/air/hub', icon: Plane },
      { 
        name: 'Road Transport', 
        icon: Truck,
        subItems: [
          { name: 'Executive Dashboard', path: '/road/executive', icon: LayoutDashboard },
          { name: 'Planning Hub', path: '/road/hub', icon: MapPin },
          { name: 'Dispatch Console', path: '/road/dispatch', icon: Navigation2 },
          { name: 'Vehicle Ops', path: '/road/vehicle-ops', icon: Settings },
          { name: 'Driver Ops', path: '/road/driver-ops', icon: Users },
          { name: 'Billing & Costing', path: '/road/billing', icon: DollarSign },
          { name: 'Claims & POD', path: '/road/claims', icon: ShieldCheck },
          { name: 'Analytics', path: '/road/analytics', icon: BarChart2 }
        ]
      },
      { 
        name: 'Fleet Maintenance', 
        icon: Car,
        subItems: [
          { name: 'Executive Dashboard', path: '/maintenance-ops/executive', icon: LayoutDashboard },
          { name: 'Asset Master', path: '/maintenance/assets', icon: FileText },
          { name: 'Preventive Schedule', path: '/maintenance/preventive', icon: Calendar },
          { name: 'Workshop Desk', path: '/maintenance/workshop', icon: Settings },
          { name: 'Inspections', path: '/maintenance/inspections', icon: ShieldCheck },
          { name: 'Spare Parts', path: '/maintenance-ops/inventory', icon: Package },
          { name: 'Fuel & Tyres', path: '/maintenance-ops/fuel-tyres', icon: Map },
          { name: 'Vendor Hub', path: '/maintenance-ops/vendors', icon: Building2 }
        ]
      },
      { 
        name: 'Container Management', 
        icon: Box,
        subItems: [
          { name: 'Executive Dashboard', path: '/containers/executive', icon: LayoutDashboard },
          { name: 'Container Master', path: '/containers/master', icon: Box },
          { name: 'Lifecycle Tracker', path: '/containers/lifecycle', icon: Route },
          { name: 'Allocation Hub', path: '/containers/allocations', icon: Layers }
        ]
      },
      { 
        name: 'Container Operations', 
        icon: TerminalSquare,
        subItems: [
          { name: 'Yard Management', path: '/container-ops/yard', icon: LayoutGrid },
          { name: 'Operations Desk', path: '/container-ops/desk', icon: TerminalSquare },
          { name: 'Cargo & Port Terminal', path: '/container-ops/cargo', icon: Ship },
          { name: 'Movement History', path: '/container-ops/history', icon: History }
        ]
      },
      { 
        name: 'Tracking & Compliance', 
        icon: Activity,
        subItems: [
          { name: 'Live Tracking Map', path: '/container-tracking/map', icon: MapPin },
          { name: 'Reefer Telemetry', path: '/container-tracking/reefer', icon: ThermometerSnowflake },
          { name: 'Health & Compliance', path: '/container-tracking/compliance', icon: ShieldCheck },
          { name: 'Repair Workshop', path: '/container-tracking/repair', icon: Wrench }
        ]
      },
      { 
        name: 'Financial Analytics', 
        icon: TrendingUp,
        subItems: [
          { name: 'Executive Dashboard', path: '/container-finance/dashboard', icon: BarChart3 },
          { name: 'Billing & AR/AP', path: '/container-finance/billing', icon: DollarSign },
          { name: 'Deep Analytics', path: '/container-finance/analytics', icon: Activity },
          { name: 'Reports Engine', path: '/container-finance/reports', icon: DownloadCloud }
        ]
      },
      { 
        name: 'Procurement & Sourcing', 
        icon: Building2,
        subItems: [
          { name: 'Procurement Hub', path: '/procurement/hub', icon: LayoutDashboard },
          { name: 'Vendor Master', path: '/procurement/vendors', icon: Users },
          { name: 'RFQ Sourcing', path: '/procurement/rfq', icon: Target },
          { name: 'Contract Manager', path: '/procurement/contracts', icon: FileText },
          { name: 'Approval Queue', path: '/procurement/approvals', icon: CheckCircle }
        ]
      },
      { 
        name: 'Purchasing Operations', 
        icon: ShoppingCart,
        subItems: [
          { name: 'Purchasing Dashboard', path: '/purchasing/dashboard', icon: LayoutDashboard },
          { name: 'PR Manager', path: '/purchasing/pr', icon: FileText },
          { name: 'PO Control Center', path: '/purchasing/po', icon: ShoppingCart },
          { name: 'Goods Receipt (GRN)', path: '/purchasing/grn', icon: Package },
          { name: 'Invoice Matcher', path: '/purchasing/invoices', icon: ReceiptText },
          { name: 'Purchase Returns', path: '/purchasing/returns', icon: RefreshCcw }
        ]
      },
      { 
        name: 'Finance & Analytics', 
        icon: TrendingUp,
        subItems: [
          { name: 'Executive Dashboard', path: '/finance/executive-dashboard', icon: Target },
          { name: 'Spend Analytics', path: '/finance/analytics', icon: TrendingUp },
          { name: 'Vendor Billing (AP)', path: '/finance/bills', icon: FileText },
          { name: 'Payment Gateway', path: '/finance/payments', icon: CreditCard },
          { name: 'Budget Control', path: '/finance/budgets', icon: Activity }
        ]
      },
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
      { 
        name: 'Enterprise Finance', 
        icon: Landmark,
        subItems: [
          { name: 'Finance Dashboard', path: '/finance/dashboard', icon: BarChart3 },
          { name: 'General Ledger', path: '/finance/gl', icon: BookOpen },
          { name: 'Chart of Accounts', path: '/finance/coa', icon: Layers },
          { name: 'Trial Balance', path: '/finance/trial-balance', icon: Scale },
          { name: 'Bank Reconciliation', path: '/finance/bank-reconciliation', icon: ArrowRightLeft },
          { name: 'Enterprise Billing', path: '/finance/billing', icon: ReceiptText },
          { name: 'Accounts Payable', path: '/finance/ap', icon: ShieldCheck },
          { name: 'Accounts Receivable', path: '/finance/ar', icon: FileText },
          { name: 'Tax & Compliance', path: '/finance/tax', icon: ShieldCheck },
          { name: 'Profitability Analysis', path: '/finance/profitability', icon: TrendingUp },
          { name: 'Finance Settings', path: '/finance/settings', icon: Settings },
        ]
      },
      { name: 'Insurance & Claims', path: '/insurance', icon: Shield },
    ]
  },
  {
    label: 'ERP Modules',
    items: [
      { 
        name: 'Warehouse Operations', 
        icon: Box,
        subItems: [
          { name: 'Master Setup', path: '/warehouse/master', icon: Building2 },
          { name: 'Spatial Layout', path: '/warehouse/spatial', icon: Layers },
          { name: 'Equipment Track', path: '/warehouse/equipment', icon: Truck },
          { name: 'WMS Settings', path: '/warehouse/settings', icon: Settings }
        ]
      },
      {
        name: 'Warehouse Inbound',
        icon: ArrowDownToLine,
        subItems: [
          { name: 'Inbound Dashboard', path: '/warehouse/inbound/dashboard', icon: LayoutDashboard },
          { name: 'ASN & Docking', path: '/warehouse/inbound/asn', icon: Calendar },
          { name: 'Gate Entry', path: '/warehouse/inbound/gate-entry', icon: Truck },
          { name: 'GRN & QA', path: '/warehouse/inbound/grn', icon: ClipboardCheck },
          { name: 'Put-Away Planner', path: '/warehouse/inbound/put-away', icon: MapPin }
        ]
      },
      {
        name: 'Warehouse Outbound',
        icon: Send,
        subItems: [
          { name: 'Outbound Hub', path: '/warehouse/outbound/dashboard', icon: LayoutDashboard },
          { name: 'Pick Planner', path: '/warehouse/outbound/picking', icon: Layers },
          { name: 'Packing Station', path: '/warehouse/outbound/packing', icon: PackageOpen },
          { name: 'Dispatch Manager', path: '/warehouse/outbound/dispatch', icon: Truck }
        ]
      },
      {
        name: 'WMS Analytics',
        icon: BarChart3,
        subItems: [
          { name: 'Exec Dashboard', path: '/warehouse/analytics/dashboard', icon: LayoutDashboard },
          { name: 'Reports Builder', path: '/warehouse/analytics/reports', icon: FileBarChart }
        ]
      },
      { 
        name: 'Inventory Control', 
        icon: Package,
        subItems: [
          { name: 'Inventory Dashboard', path: '/inventory/dashboard', icon: TrendingUp },
          { name: 'Stock Control', path: '/inventory/stock-control', icon: PackageSearch },
          { name: 'Traceability', path: '/inventory/traceability', icon: QrCode },
          { name: 'Movements & Transfers', path: '/inventory/movements', icon: ArrowRightLeft },
          { name: 'Cycle Counts', path: '/inventory/cycle-counts', icon: ClipboardList },
          { name: 'Inventory Reports', path: '/inventory/reports', icon: FileText }
        ]
      },
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
    label: 'Enterprise Core',
    items: [
      { 
        name: 'System Administration', 
        icon: Cpu,
        subItems: [
          { name: 'Control Tower', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'System Logs', path: '/admin/logs', icon: FileText },
        ]
      },
      {
        name: 'Integration Hub',
        icon: Webhook,
        subItems: [
          { name: 'Connectors', path: '/integration/dashboard', icon: Link2 },
          { name: 'API Gateway', path: '/integration/gateway', icon: Key },
        ]
      },
      {
        name: 'AI Platform',
        icon: BrainCircuit,
        subItems: [
          { name: 'AI Control Center', path: '/ai/dashboard', icon: Activity },
          { name: 'Prompt Library', path: '/ai/prompts', icon: FileText },
        ]
      },
      {
        name: 'Vendor Portal',
        icon: Building2,
        subItems: [
          { name: 'Vendor Directory', path: '/vendor/list', icon: Users },
          { name: 'Self Registration', path: '/vendor/registration', icon: FileCheck },
          { name: 'External Portal', path: '/vendor/portal', icon: ShieldCheck },
          { name: 'Procurement Collab', path: '/vendor/procurement', icon: ShoppingCart },
          { name: 'RFQs & Quotes', path: '/vendor/rfqs', icon: FileText },
          { name: 'Purchase Orders', path: '/vendor/pos', icon: Inbox },
          { name: 'Logistics Collab', path: '/vendor/logistics', icon: Truck },
          { name: 'Active ASNs', path: '/vendor/asns', icon: Package },
          { name: 'Dock Booking', path: '/vendor/docks', icon: MapPin },
          { name: 'Finance & Billing', path: '/vendor/finance', icon: DollarSign },
          { name: 'Invoices', path: '/vendor/invoices', icon: ReceiptText },
          { name: 'Account Ledger', path: '/vendor/ledger', icon: FileBarChart },
        ]
      },
      {
        name: 'Vendor Support & Comms',
        icon: MessageSquare,
        subItems: [
          { name: 'Help Desk', path: '/vendor/support', icon: ShieldCheck },
          { name: 'Live Chat', path: '/vendor/chat', icon: MessageSquare },
          { name: 'Performance Analytics', path: '/vendor/performance', icon: Activity },
          { name: 'Knowledge Base', path: '/vendor/knowledge-base', icon: BookOpen },
        ]
      },
      { 
        name: 'Organization', 
        icon: Building2,
        subItems: [
          { name: 'Company Master', path: '/company/master', icon: Building2 },
          { name: 'Org Chart', path: '/company/organization-chart', icon: Users },
        ]
      },
      { 
        name: 'Identity & Security', 
        icon: ShieldCheck,
        subItems: [
          { name: 'User Directory', path: '/users/dashboard', icon: UsersRound },
          { name: 'Security Dashboard', path: '/security/dashboard', icon: Shield },
          { name: 'Role Management', path: '/security/roles', icon: KeyRound },
        ]
      },
      { 
        name: 'Workflows & Approvals', 
        icon: GitMerge,
        subItems: [
          { name: 'Approval Inbox', path: '/workflow/inbox', icon: CheckCircle },
          { name: 'Visual Builder', path: '/workflow/builder', icon: Workflow },
          { name: 'Workflow Dashboard', path: '/workflow/dashboard', icon: LayoutDashboard },
        ]
      },
      { 
        name: 'Communications', 
        icon: Megaphone,
        subItems: [
          { name: 'Notification Hub', path: '/notifications/dashboard', icon: Bell },
          { name: 'Template Builder', path: '/notifications/templates', icon: FileCode2 },
          { name: 'Announcements', path: '/notifications/announcements', icon: Megaphone },
        ]
      },
      { 
        name: 'Master Data (MDM)', 
        icon: Database,
        subItems: [
          { name: 'MDM Control Tower', path: '/mdm/dashboard', icon: Database },
          { name: 'HS Codes Grid', path: '/mdm/HSC', icon: Table },
        ]
      },
    ]
  },
  {
    label: 'Portals & Apps',
    items: [
      { 
        name: 'Customer Portal', 
        icon: UserCircle,
        subItems: [
          { name: 'Dashboard', path: '/customer-portal', icon: LayoutDashboard },
          { name: 'Logistics & Bookings', path: '/customer/logistics', icon: Truck },
          { name: 'Active RFQs', path: '/customer/logistics/rfqs', icon: FileText },
        ]
      },
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
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (menuName: string) => {
    setOpenMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const handleLogout = () => {
    localStorage.removeItem('erp_user');
    logout();
    navigate('/login');
  };

  const hasPermission = (itemName: string) => {
    if (user?.role === 'System Admin' || user?.role === 'Admin') return true;
    return user?.permissions?.includes(itemName) || user?.permissions?.includes('All Modules');
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
            
            // Check if user has permission for ANY item in this section (including subitems)
            return section.items.some(item => 
              hasPermission(item.name) || (item.subItems && item.subItems.some(sub => hasPermission(sub.name)))
            );
          })
          .map(section => (
          <div key={section.label}>
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{section.label}</p>
            <div className="space-y-0.5">
              {section.items
                .filter(item => hasPermission(item.name) || (item.subItems && item.subItems.some(sub => hasPermission(sub.name))))
                .map(item => {
                if (!item.icon) { console.error('MISSING ICON FOR ITEM:', item.name); }
                if (item.subItems) {
                   item.subItems.forEach(sub => {
                     if (!sub.icon) console.error('MISSING ICON FOR SUBITEM:', sub.name, 'IN', item.name);
                   });
                   const isOpen = openMenus[item.name];
                   const isActive = item.subItems.some(sub => location.pathname === sub.path);
                   return (
                      <div key={item.name} className="space-y-0.5">
                         <button 
                            onClick={() => toggleMenu(item.name)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 font-medium text-sm ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                         >
                            <div className="flex items-center space-x-3">
                               <item.icon size={17} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                               <span>{item.name}</span>
                            </div>
                            {isOpen ? <ChevronDown size={14} className="text-gray-400"/> : <ChevronRight size={14} className="text-gray-400"/>}
                         </button>
                         {isOpen && (
                            <div className="pl-9 space-y-0.5 mt-1 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-gray-200">
                               {item.subItems.filter(sub => hasPermission(sub.name)).map(sub => {
                                  const isSubActive = location.pathname === sub.path;
                                  return (
                                     <Link key={sub.name} to={sub.path!} className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-150 font-medium text-sm ${isSubActive ? 'text-indigo-600 bg-white shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                                        <sub.icon size={14} className={isSubActive ? 'text-indigo-600' : 'text-gray-400'} />
                                        <span>{sub.name}</span>
                                     </Link>
                                  );
                               })}
                            </div>
                         )}
                      </div>
                   );
                }

                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.name} to={item.path!}
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
