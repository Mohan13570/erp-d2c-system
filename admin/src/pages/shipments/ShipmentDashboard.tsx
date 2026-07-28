import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Package, Truck, Anchor, Plane, Search, Bell, 
  Settings, Download, Plus, Filter, RefreshCw, 
  ChevronDown, Calendar, AlertCircle, Clock, 
  CheckCircle, MoreVertical, DollarSign, Activity, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const KPICard = ({ title, value, icon: Icon, colorClass, subtitle }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-semibold text-slate-500 mb-1 tracking-wide uppercase">{title}</p>
      <h3 className="text-3xl font-black text-slate-900">{value}</h3>
      {subtitle && <p className="text-xs text-slate-400 mt-2 font-medium">{subtitle}</p>}
    </div>
    <div className={`p-4 rounded-xl ${colorClass} group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

export default function ShipmentDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch Dashboard KPIs using TanStack Query
  const { data: kpis, isLoading, refetch } = useQuery({
    queryKey: ['shipmentKPIs'],
    queryFn: async () => {
      const res = await fetch('/api/v1/shipments/dashboard');
      if (!res.ok) throw new Error('Failed to fetch KPIs');
      return res.json();
    }
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      {/* 1. TOP STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 shrink-0 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Shipments</h1>
          </div>
          
          <div className="relative w-96 hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search tracking, booking, or customer..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handleRefresh} className={`p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors ${isRefreshing ? 'animate-spin text-blue-600' : ''}`}>
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          <Link to="/shipments/create" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm shadow-blue-200">
            <Plus className="w-4 h-4" />
            Quick Create
          </Link>
        </div>
      </header>

      {/* 2. STICKY FILTER BAR */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 h-14 shrink-0 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-semibold transition-colors">
            <Filter className="w-4 h-4" /> All Views
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 text-slate-600 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
            Status: Active <ChevronDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 text-slate-600 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
            Mode: All <ChevronDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 text-slate-600 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
            Date: Last 7 Days <ChevronDown className="w-3 h-3" />
          </button>
        </div>
        <div>
          <Link to="/shipments/list" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View List Mode <ChevronDown className="w-4 h-4 -rotate-90" />
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* 3. MAIN DASHBOARD SCROLLABLE */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Enterprise Overview</h2>
            <p className="text-sm text-slate-500 font-medium">Data updated {new Date().toLocaleTimeString()}</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="bg-white p-5 rounded-2xl h-32 border border-slate-200"></div>
              ))}
            </div>
          ) : (
            <>
              {/* Financial & Core KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPICard title="Total Shipments" value={kpis?.totalShipments || 0} icon={Package} colorClass="bg-blue-50 text-blue-600" subtitle="All time records" />
                <KPICard title="Today's Shipments" value={kpis?.todayShipments || 0} icon={Activity} colorClass="bg-indigo-50 text-indigo-600" subtitle="Created today" />
                <KPICard title="Est. Revenue" value={`$${(kpis?.revenue || 0).toLocaleString()}`} icon={DollarSign} colorClass="bg-emerald-50 text-emerald-600" subtitle="Total unbilled & billed" />
                <KPICard title="Est. Profit" value={`$${(kpis?.profit || 0).toLocaleString()}`} icon={Activity} colorClass="bg-cyan-50 text-cyan-600" subtitle="Margin calculation" />
              </div>

              {/* Status KPIs */}
              <h2 className="text-lg font-bold text-slate-900 mb-6">Operational Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                <KPICard title="Pending Pickup" value={kpis?.pendingPickup || 0} icon={Clock} colorClass="bg-amber-50 text-amber-600" />
                <KPICard title="In Warehouse" value={kpis?.warehouse || 0} icon={Package} colorClass="bg-purple-50 text-purple-600" />
                <KPICard title="In Transit" value={kpis?.inTransit || 0} icon={Truck} colorClass="bg-blue-50 text-blue-600" />
                <KPICard title="Customs" value={kpis?.customsClearance || 0} icon={FileText} colorClass="bg-orange-50 text-orange-600" />
                
                <KPICard title="Out for Delivery" value={kpis?.outForDelivery || 0} icon={Truck} colorClass="bg-sky-50 text-sky-600" />
                <KPICard title="Delivered" value={kpis?.delivered || 0} icon={CheckCircle} colorClass="bg-emerald-50 text-emerald-600" />
                <KPICard title="Delayed" value={kpis?.delayed || 0} icon={AlertCircle} colorClass="bg-red-50 text-red-600" />
                <KPICard title="Cancelled" value={kpis?.cancelled || 0} icon={AlertCircle} colorClass="bg-slate-100 text-slate-600" />
              </div>
              
              {/* Additional Charts/Tables can go here */}
              <div className="h-64 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 border border-slate-200 flex items-center justify-center">
                 <p className="text-slate-500 font-semibold flex items-center gap-2"><Activity className="w-5 h-5"/> Revenue Trend Chart Placeholder</p>
              </div>
            </>
          )}
        </main>

        {/* 4. STICKY RIGHT SIDEBAR */}
        <aside className="w-80 bg-white border-l border-slate-200 shrink-0 overflow-y-auto no-scrollbar shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)]">
          <div className="p-6">
            <h3 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Action Center</h3>
            
            <div className="space-y-6">
              {/* Today's Tasks */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-blue-600"/> Today's Tasks
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-slate-600 font-medium">Dispatch TRK-4920</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-slate-600 font-medium">Verify Customs for SHP-882</span>
                  </div>
                </div>
              </div>

              {/* Delayed Alerts */}
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <h4 className="font-bold text-red-800 flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-red-600"/> Delayed Shipments
                </h4>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-red-700 bg-white/60 p-2 rounded-lg border border-red-100">TRK-9921 <span className="text-red-500 text-xs font-normal block">Stuck at Origin Port</span></div>
                  <div className="text-sm font-semibold text-red-700 bg-white/60 p-2 rounded-lg border border-red-100">TRK-1022 <span className="text-red-500 text-xs font-normal block">Awaiting Documentation</span></div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-bold text-slate-800 mb-3 text-sm">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">Import Shipments (CSV)</button>
                  <button className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">Generate Manifests</button>
                  <button className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">Print Bulk Labels</button>
                </div>
              </div>

            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
