import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, BookOpen, Scale, Activity, Anchor, ArrowDownToLine, ArrowRightLeft, BarChart2, BarChart3, Box, BrainCircuit, Briefcase, Building2, Calendar, Car, CheckCircle, ChevronDown, ChevronRight, ClipboardCheck, ClipboardList, Command, Cpu, CreditCard, Crosshair, DollarSign, DownloadCloud, FileBarChart, FileText, FolderKanban, Globe, Handshake, History, Landmark, Layers, LayoutDashboard, LayoutGrid, LogOut, Map, MapPin, Megaphone, Navigation, Navigation2, Package, PackageOpen, PackageSearch, Plane, Plus, QrCode, ReceiptText, RefreshCcw, RotateCcw, Route, Send, Settings, Shield, ShieldCheck, Ship, ShoppingCart, Smartphone, Target, TerminalSquare, ThermometerSnowflake, TrendingUp, Truck, UserCheck, UserCircle, Users, UsersRound, Wrench, GitMerge, Workflow, Bell, FileCode2, Database, Table, KeyRound, Webhook, Link2, Key, FileCheck, Inbox, Bot, Code, Clock, UserCog, AlertCircle, Calculator, TrendingDown, Wallet } from 'lucide-react';
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
        name: 'Shipments', 
        icon: Truck,
        subItems: [
          { name: 'Ocean Freight', path: '/ocean/executive/dashboard', icon: Anchor },
          { name: 'Air Freight', path: '/air/hub', icon: Plane },
          { name: 'Road Transport', path: '/road/executive', icon: Truck },
        ]
      },
      { 
        name: 'Fleet Management', 
        icon: Car,
        subItems: [
          { name: 'Fleet Dashboard', path: '/maintenance-ops/executive', icon: LayoutDashboard },
          { name: 'Asset Master', path: '/maintenance/assets', icon: FileText },
          { name: 'Preventive Schedule', path: '/maintenance/preventive', icon: Calendar },
          { name: 'Workshop Desk', path: '/maintenance/workshop', icon: Settings },
          { name: 'Inspections', path: '/maintenance/inspections', icon: ShieldCheck },
          { name: 'Fuel & Tyres', path: '/maintenance-ops/fuel-tyres', icon: Map },
          { name: 'Trip Master', path: '/trips', icon: Navigation },
          { name: 'Advanced GIS Map', path: '/gps', icon: Map },
          { name: 'Geofence Studio', path: '/geofences', icon: ShieldCheck },
          { name: 'Route Optimizer', path: '/routes/plan', icon: Crosshair },
          { name: 'Real-Time Tracking', path: '/tracking', icon: Crosshair },
        ]
      },
      {
        name: 'Booking Details',
        icon: FileText,
        subItems: [
          { name: 'Booking Information', path: '/booking/wizard', icon: FileText },
          { name: 'Shipper (Sender) Details', path: '/booking/wizard', icon: Users },
          { name: 'Consignee (Receiver) Details', path: '/booking/wizard', icon: Users },
          { name: 'Notify Party', path: '/booking/wizard', icon: Bell },
          { name: 'Bill To Party', path: '/booking/wizard', icon: DollarSign },
          { name: 'Cargo Information', path: '/booking/wizard', icon: Box },
        ]
      },
      {
        name: 'Package Details',
        icon: Package,
        subItems: [
          { name: 'Package Calculator', path: '/package/calculator', icon: Calculator },
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
      { 
        name: 'HR & Payroll', 
        icon: Users,
        subItems: [
          { name: 'HR Dashboard', path: '/hr', icon: LayoutDashboard },
          { name: 'Employee Directory', path: '/hr/directory', icon: Users },
          { name: 'Organization Chart', path: '/hr/org-chart', icon: UsersRound },
          { name: 'Employee Onboarding', path: '/hr/register', icon: Briefcase },
          { name: 'My Profile', path: '/hr/profile/me', icon: UserCircle },
        ]
      },
      { 
        name: 'Time & Attendance', 
        icon: Clock,
        subItems: [
          { name: 'Live Check-In', path: '/hr/attendance/check-in', icon: MapPin },
          { name: 'WFM Dashboard', path: '/hr/attendance', icon: LayoutDashboard },
          { name: 'My Calendar', path: '/hr/attendance/calendar', icon: Calendar },
          { name: 'Shift Management', path: '/hr/attendance/shifts', icon: Clock },
          { name: 'Overtime Approvals', path: '/hr/attendance/overtime', icon: AlertCircle },
          { name: 'Timesheets', path: '/hr/attendance/timesheets', icon: FileBarChart },
        ]
      },
      { 
        name: 'Leave & Absences', 
        icon: Plane,
        subItems: [
          { name: 'Leave Dashboard', path: '/hr/leave', icon: LayoutDashboard },
          { name: 'Apply Leave', path: '/hr/leave/apply', icon: Plus },
          { name: 'My Balances', path: '/hr/leave/balance', icon: Briefcase },
          { name: 'Holiday Calendar', path: '/hr/leave/calendar', icon: Calendar },
          { name: 'Workforce Planning', path: '/hr/leave/workforce', icon: Users },
        ]
      },
      { 
        name: 'Finance & Billing', 
        icon: DollarSign,
        subItems: [
          { name: 'Billing Dashboard', path: '/finance/billing', icon: LayoutDashboard },
          { name: 'Invoices', path: '/finance/billing/invoices', icon: FileText },
          { name: 'Create Invoice', path: '/finance/billing/create', icon: Plus },
          { name: 'Rate Engine', path: '/finance/pricing', icon: DollarSign },
          { name: 'Live Quote', path: '/finance/pricing/calculator', icon: Calculator },
        ]
      },
      {
        name: 'Accounts Receivable',
        path: '/finance/ar',
        icon: TrendingDown,
        subItems: [
          { name: 'AR Dashboard', path: '/finance/ar', icon: BarChart3 },
          { name: 'Customer Ledgers', path: '/finance/ar/ledger', icon: FileText },
          { name: 'Payment Allocation', path: '/finance/ar/allocate', icon: DollarSign },
          { name: 'Collections', path: '/finance/ar/collections', icon: Users },
        ]
      },
      {
        name: 'Treasury & Payments',
        path: '/finance/payments',
        icon: Landmark,
        subItems: [
          { name: 'Payment Dashboard', path: '/finance/payments', icon: Wallet },
          { name: 'Receive Payment', path: '/finance/payments/receive', icon: CreditCard },
          { name: 'Bank Recon', path: '/finance/payments/reconciliation', icon: RefreshCcw },
          { name: 'Cash Book', path: '/finance/payments/cashbook', icon: FileText },
        ]
      },
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
          { name: 'Live Tracking Map', path: '/customer/tracking', icon: Map },
          { name: 'Warehouse Visibility', path: '/customer/tracking/warehouse', icon: Box },
          { name: 'Billing & Payments', path: '/customer/finance', icon: DollarSign },
          { name: 'Support Tickets', path: '/customer/support', icon: MessageSquare },
          { name: 'Enterprise Analytics', path: '/customer/analytics', icon: Activity },
          { name: 'AI Assistant', path: '/customer/ai', icon: Bot },
          { name: 'Developer API', path: '/customer/developer', icon: Code },
          { name: 'Settings & Profile', path: '/customer/settings', icon: Settings },
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
      { name: 'Employee Portal', path: '/hr-portal', icon: UsersRound },
      { name: 'Driver App', path: '/mobile/driver', icon: Smartphone },
      { name: 'Warehouse App', path: '/mobile/warehouse', icon: Smartphone },
    ]
  }
];

import { Hexagon } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (name: string) => {
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const hasPermission = (itemName: string) => {
    // TEMPORARY BYPASS: Show all modules to the user so they can see everything
    return true; 
  };

  return (
    <aside className="w-[280px] bg-[#0F172A] border-r border-slate-800 flex flex-col h-full shrink-0 text-slate-300">
      
      {/* LIZOME Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center space-x-3 text-white">
          <div className="relative flex items-center justify-center w-full">
            <img src="/admin/lizome-icon.svg" className="h-10 w-auto" alt="LIZOME" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-hide">
        {navSections
          .map(section => (
          <div key={section.label}>
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{section.label}</p>
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
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 font-medium text-sm ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'}`}
                         >
                            <div className="flex items-center space-x-3">
                               <item.icon size={17} className={isActive ? 'text-white' : 'text-slate-400'} />
                               <span>{item.name}</span>
                            </div>
                            {isOpen ? <ChevronDown size={14} className="text-slate-400"/> : <ChevronRight size={14} className="text-slate-400"/>}
                         </button>
                         {isOpen && (
                            <div className="pl-9 space-y-0.5 mt-1 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-slate-700">
                               {item.subItems.filter(sub => hasPermission(sub.name)).map(sub => {
                                  const isSubActive = location.pathname === sub.path;
                                  return (
                                     <Link key={sub.name} to={sub.path!} className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-150 font-medium text-sm ${isSubActive ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
                                        <sub.icon size={14} className={isSubActive ? 'text-blue-500' : 'text-slate-500'} />
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
                    className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-150 font-medium text-sm ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'}`}
                  >
                    <item.icon size={17} className={`mr-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-400 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut size={18} className="mr-3" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
