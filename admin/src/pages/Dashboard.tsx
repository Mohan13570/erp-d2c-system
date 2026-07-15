import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, DollarSign, AlertTriangle, TrendingUp, RotateCcw, Layers, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Summary {
  totalOrders: number;
  totalRevenue: number;
  totalEmployees: number;
  totalItems: number;
  pendingPOs: number;
  openReturns: number;
  lowStockCount: number;
  topProducts: Array<{
    itemCode: string;
    itemName: string;
    totalQty: number;
    standardRate: number;
    totalSalesValue: number;
  }>;
}

export default function Dashboard() {
  const { token } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [lowStockAlerts, setLowStockAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    fetch('/api/finance/summary', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setSummary)
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetch('/api/inventory/low-stock', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLowStockAlerts(data);
        } else {
          setLowStockAlerts([]);
        }
      })
      .catch(() => setLowStockAlerts([]));
  }, [token]);

  const cards = [
    { 
      label: 'Total Revenue', 
      value: summary ? `$${summary.totalRevenue.toLocaleString('en', { minimumFractionDigits: 2 })}` : '...', 
      icon: DollarSign, 
      color: 'bg-indigo-50/60 text-indigo-600 border border-indigo-100/45', 
      change: '+12.5%',
      trend: [12, 18, 15, 25, 22, 35, 30, 48, 40, 55],
      strokeColor: '#6366f1'
    },
    { 
      label: 'Sales Orders', 
      value: summary?.totalOrders ?? '...', 
      icon: ShoppingCart, 
      color: 'bg-emerald-50/60 text-emerald-600 border border-emerald-100/45', 
      change: '+8.2%',
      trend: [18, 15, 22, 28, 20, 32, 28, 42, 35, 48],
      strokeColor: '#10b981'
    },
    { 
      label: 'Low Stock Alerts', 
      value: summary?.lowStockCount ?? '...', 
      icon: AlertTriangle, 
      color: summary?.lowStockCount && summary.lowStockCount > 0 
        ? 'bg-rose-50/60 text-rose-600 border border-rose-100/45'
        : 'bg-slate-50/60 text-slate-600 border border-slate-100/45',
      trend: [2, 3, 5, 4, 2, 1, 3, 2, 4, 3],
      strokeColor: '#f43f5e'
    },
    { 
      label: 'Active Items', 
      value: summary?.totalItems ?? '...', 
      icon: Package, 
      color: 'bg-purple-50/60 text-purple-600 border border-purple-100/45',
      trend: [15, 20, 18, 25, 22, 30, 28, 36, 32, 40],
      strokeColor: '#a855f7'
    },
    { 
      label: 'Pending POs', 
      value: summary?.pendingPOs ?? '...', 
      icon: Layers, 
      color: 'bg-sky-50/60 text-sky-600 border border-sky-100/45',
      trend: [10, 8, 11, 7, 9, 6, 5, 8, 4, 3],
      strokeColor: '#0ea5e9'
    },
    { 
      label: 'Open Returns', 
      value: summary?.openReturns ?? '...', 
      icon: RotateCcw, 
      color: 'bg-rose-50/60 text-rose-600 border border-rose-100/45',
      trend: [6, 8, 5, 9, 4, 7, 5, 3, 4, 2],
      strokeColor: '#f43f5e'
    },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">Overview</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Real-time control center snapshot of Aura ERP & D2C.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_30px_rgba(99,102,241,0.04)] hover:-translate-y-0.5 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl ${card.color}`}>
                <card.icon size={18} className="stroke-[2.5]" />
              </div>
              {card.change && (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center">
                  <TrendingUp size={11} className="mr-1 stroke-[2.5]" /> {card.change}
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{card.label}</p>
            <p className="text-3xl font-black text-slate-950 tracking-tight">{String(card.value)}</p>
            
            {/* Sparkline trend representation */}
            <div className="h-10 mt-6 w-full opacity-65 group-hover:opacity-100 transition-opacity">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`gradient-${card.label.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={card.strokeColor} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={card.strokeColor} stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0 30 ${card.trend.map((val, idx) => `L ${(idx / (card.trend.length - 1)) * 100} ${30 - val}`).join(' ')} L 100 30 Z`}
                  fill={`url(#gradient-${card.label.replace(/\s+/g, '-')})`}
                />
                <path
                  d={card.trend.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${(idx / (card.trend.length - 1)) * 100} ${30 - val}`).join(' ')}
                  fill="none"
                  stroke={card.strokeColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Top Products */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.01)]">
            <h2 className="font-extrabold text-slate-950 mb-6 text-sm tracking-widest uppercase text-slate-400">Top Selling Products</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <th className="pb-3">Product Name</th>
                    <th className="pb-3 text-center">SKU</th>
                    <th className="pb-3 text-center">Qty Sold</th>
                    <th className="pb-3 text-right">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-semibold text-slate-700">
                  {summary?.topProducts?.map((p: any) => (
                    <tr key={p.itemCode} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 font-bold text-slate-900">{p.itemName}</td>
                      <td className="py-3.5 text-center font-mono text-indigo-600">{p.itemCode}</td>
                      <td className="py-3.5 text-center text-indigo-600 font-extrabold">{p.totalQty}</td>
                      <td className="py-3.5 text-right text-emerald-600 font-extrabold">${p.totalSalesValue.toFixed(2)}</td>
                    </tr>
                  ))}
                  {(!summary?.topProducts || summary.topProducts.length === 0) && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400">No sales transactions logged.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Module Activity Progress bar */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.01)]">
            <h2 className="font-extrabold text-slate-950 mb-8 text-sm tracking-widest uppercase text-slate-400">System Modules & Activity</h2>
            <div className="space-y-6">
              {[
                { name: 'Sales & D2C Orders', count: summary?.totalOrders || 0, color: 'from-indigo-500 to-indigo-600', shadow: 'rgba(99, 102, 241, 0.2)' },
                { name: 'Active Employees', count: summary?.totalEmployees || 0, color: 'from-amber-500 to-amber-600', shadow: 'rgba(245, 158, 11, 0.2)' },
                { name: 'Inventory Items', count: summary?.totalItems || 0, color: 'from-emerald-500 to-emerald-600', shadow: 'rgba(16, 185, 129, 0.2)' },
              ].map(m => (
                <div key={m.name} className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">{m.name}</span>
                    <span className="text-slate-950 font-bold">{m.count} records</span>
                  </div>
                  <div className="h-3 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${m.color} rounded-full`} style={{ width: m.count > 0 ? '100%' : '5%', boxShadow: `0 0 10px ${m.shadow}` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* High Tech Alerts Feed */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.01)] h-fit">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-extrabold text-slate-950 text-xs tracking-widest uppercase text-slate-400">System Alerts</h2>
            <div className="bg-rose-50 text-rose-500 p-1.5 rounded-lg border border-rose-100 animate-pulse">
              <Bell size={14} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-3">
            {[
              { msg: 'System Online & Verified', color: 'text-emerald-700 bg-emerald-50/50 border-emerald-100/60' },
              ...(Array.isArray(lowStockAlerts) ? lowStockAlerts.map(alert => ({
                msg: `LOW STOCK: ${alert.item?.itemName || alert.itemCode} has ${alert.qtyAvailable} left in ${alert.warehouseName} (Min: ${alert.item?.minimum_stock})`,
                color: 'text-rose-700 bg-rose-50/50 border-rose-100/60'
              })) : []),
              { msg: `${summary?.pendingPOs || 0} POs awaiting approval`, color: 'text-amber-700 bg-amber-50/50 border-amber-100/60' },
              { msg: `${summary?.openReturns || 0} Return cases require review`, color: 'text-rose-700 bg-rose-50/50 border-rose-100/60' },
              { msg: `${summary?.totalOrders || 0} Total Orders completed`, color: 'text-indigo-700 bg-indigo-50/50 border-indigo-100/60' },
            ].map((a, i) => (
              <div key={i} className={`flex items-center space-x-3 p-3.5 rounded-2xl text-xs font-semibold border ${a.color}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current inline-block animate-pulse shrink-0"></span>
                <span className="line-clamp-1">{a.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
