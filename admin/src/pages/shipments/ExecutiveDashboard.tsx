import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, Download, Filter, FileText, AlertTriangle, Users, Truck, 
  Map, Activity, Package, DollarSign, Clock, Settings, Sparkles, RefreshCw
} from 'lucide-react';

const MOCK_API = {
  kpis: {
    totalShipments: 12450, activeShipments: 842, completedShipments: 11400, delayedShipments: 180, cancelledShipments: 28,
    onTimeDeliveryPct: 94.5, avgTransitTimeDays: 3.2,
    totalRevenue: 4500000, totalCost: 3100000, grossProfit: 1400000, netProfit: 1150000
  },
  statusChart: [
    { name: 'Jan', completed: 800, delayed: 20 }, { name: 'Feb', completed: 950, delayed: 25 },
    { name: 'Mar', completed: 1100, delayed: 40 }, { name: 'Apr', completed: 1200, delayed: 15 },
    { name: 'May', completed: 1350, delayed: 30 }, { name: 'Jun', completed: 1500, delayed: 50 }
  ],
  transportChart: [
    { name: 'Road', value: 4500 }, { name: 'Ocean', value: 3800 }, { name: 'Air', value: 2100 }, { name: 'Rail', value: 2050 }
  ],
  exceptions: [
    { name: 'Traffic Delay', count: 80 }, { name: 'Weather Delay', count: 40 }, 
    { name: 'Breakdown', count: 15 }, { name: 'Missing Docs', count: 45 }
  ]
};

const COLORS = ['#4f46e5', '#06b6d4', '#f59e0b', '#10b981', '#f43f5e'];

export default function ExecutiveDashboard() {
  const [data, setData] = useState(MOCK_API);
  const [isExporting, setIsExporting] = useState(false);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 }).format(val);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 px-8 py-4 flex justify-between items-center shadow-2xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Activity className="w-7 h-7 text-indigo-400" /> 
            Executive Command Center
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1">Live Global Business Intelligence</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-slate-800 rounded-xl p-1">
            {/* SECTION 12: FILTERS (Top Bar) */}
            <button className="text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
              <Filter className="w-4 h-4"/> YTD 2026
            </button>
            <button className="text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
              Global (All Branches)
            </button>
          </div>
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          {/* SECTION 11: EXPORT (Top Bar) */}
          <button 
            onClick={handleExport}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" /> 
            {isExporting ? 'Generating PDF...' : 'Export Board Report'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* MAIN SCROLLABLE CONTENT (SECTIONS 1-10) */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth pb-20">
          
          {/* SECTION 1: EXECUTIVE KPI CARDS */}
          <section id="kpis" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Revenue</p>
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><TrendingUp className="w-4 h-4"/></div>
              </div>
              <h3 className="text-3xl font-black text-slate-900">{formatCurrency(data.kpis.totalRevenue)}</h3>
              <p className="text-sm font-medium text-emerald-600 mt-2">+12.5% vs last year</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Net Profit</p>
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><DollarSign className="w-4 h-4"/></div>
              </div>
              <h3 className="text-3xl font-black text-slate-900">{formatCurrency(data.kpis.netProfit)}</h3>
              <p className="text-sm font-medium text-indigo-600 mt-2">25.5% Margin</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">On-Time Delivery</p>
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Clock className="w-4 h-4"/></div>
              </div>
              <h3 className="text-3xl font-black text-slate-900">{data.kpis.onTimeDeliveryPct}%</h3>
              <p className="text-sm font-medium text-blue-600 mt-2">Avg {data.kpis.avgTransitTimeDays} days transit</p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
              <div className="absolute -right-6 -top-6 opacity-10"><Package className="w-32 h-32" /></div>
              <div className="relative z-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Active Shipments</p>
                <h3 className="text-4xl font-black">{data.kpis.activeShipments.toLocaleString()}</h3>
                <p className="text-sm font-medium text-indigo-400 mt-2">Across 12 Global Branches</p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* SECTION 2: SHIPMENT STATUS ANALYTICS */}
            <section id="status-analytics" className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600"/> Shipment Trajectory
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.statusChart} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                    <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Legend iconType="circle" wrapperStyle={{fontSize: '12px', fontWeight: 'bold'}} />
                    <Bar dataKey="completed" name="Completed" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} />
                    <Bar dataKey="delayed" name="Delayed" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* SECTION 4: TRANSPORT ANALYTICS */}
            <section id="transport-analytics" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
              <h2 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-600"/> Transport Modality
              </h2>
              <div className="flex-1 flex items-center justify-center min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.transportChart} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {data.transportChart.map((entry, index) => (
                        <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Legend iconType="circle" wrapperStyle={{fontSize: '12px', fontWeight: 'bold'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SECTION 3: CUSTOMER ANALYTICS */}
            <section id="customer-analytics" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600"/> Top Tier Customers
              </h2>
              <div className="space-y-4">
                {['Acme Corp', 'Stark Industries', 'Wayne Enterprises', 'Globex'].map((company, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-sm text-slate-800">{company}</span>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">{formatCurrency(450000 - (i * 80000))}</p>
                      <p className="text-xs font-bold text-slate-500">{(200 - i * 30)} Shipments</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 9: EXCEPTION ANALYTICS */}
            <section id="exception-analytics" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-rose-500">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600"/> Exception Radar
              </h2>
              <div className="space-y-4">
                {data.exceptions.map((exc, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="w-28 text-sm font-bold text-slate-700 truncate">{exc.name}</span>
                    <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: \`\${(exc.count / 100) * 100}%\` }}></div>
                    </div>
                    <span className="text-sm font-black text-slate-900 w-8 text-right">{exc.count}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* SECTION 5: ROUTE ANALYTICS */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest"><Map className="w-4 h-4 text-blue-600"/> Route Stats</h2>
              <div className="text-3xl font-black text-slate-900 mb-1">NYC → LAX</div>
              <p className="text-xs font-bold text-slate-500">Highest Volume Route (1,245 trips)</p>
            </section>
            
            {/* SECTION 6: VEHICLE ANALYTICS */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest"><Truck className="w-4 h-4 text-amber-600"/> Fleet Util.</h2>
              <div className="text-3xl font-black text-slate-900 mb-1">87.5%</div>
              <p className="text-xs font-bold text-slate-500">Global Active Utilization Rate</p>
            </section>

            {/* SECTION 8: WAREHOUSE ANALYTICS */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest"><Package className="w-4 h-4 text-purple-600"/> Hub Capacity</h2>
              <div className="text-3xl font-black text-slate-900 mb-1">92.0%</div>
              <p className="text-xs font-bold text-rose-500">Critical: Near Max Storage Limit</p>
            </section>
          </div>

          {/* SECTION 10: REPORT CENTER */}
          <section id="report-center" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-600"/> Automated Report Center
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Executive Summary', 'Revenue Audit', 'Exception Log', 'Fleet Performance'].map((report, i) => (
                <button key={i} className="flex flex-col items-center justify-center p-6 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors gap-3">
                  <FileText className="w-8 h-8 text-indigo-500" />
                  <span className="text-sm font-bold text-slate-800 text-center">{report}</span>
                </button>
              ))}
            </div>
          </section>

        </div>

        {/* SECTION 13: STICKY RIGHT SIDEBAR */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 sticky top-0 overflow-y-auto z-10 shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.05)]">
          <div className="p-6 bg-indigo-50 border-b border-indigo-100">
            <h3 className="text-xs font-black text-indigo-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4"/> AI Executive Insights
            </h3>
            <p className="text-sm font-medium text-indigo-900 leading-relaxed">
              Revenue is tracking <span className="font-bold">12.5% higher</span> than projected. However, warehouse capacity at the central hub is critical (92%). Consider rerouting incoming ocean freight to the auxiliary facility to prevent unloading delays.
            </p>
          </div>

          <div className="p-6 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Today's Pulse</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400">Shipments Dispatched</p>
                <p className="text-xl font-black text-slate-900">142</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">Exceptions Raised</p>
                <p className="text-xl font-black text-rose-600">8 <span className="text-xs text-rose-400 ml-1">Action Required</span></p>
              </div>
            </div>
          </div>
          
          <div className="p-6 flex-1">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors">
                <FileText className="w-4 h-4"/> Schedule Daily PDF
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors">
                <Settings className="w-4 h-4"/> Dashboard Settings
              </button>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
