import React from 'react';
import { ShoppingCart, Package, FileText, CheckCircle, TrendingUp, AlertCircle, RefreshCcw, DollarSign } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function PurchaseDashboard() {
  const data = [
    { name: 'Week 1', spend: 4000, items: 240 },
    { name: 'Week 2', spend: 3000, items: 139 },
    { name: 'Week 3', spend: 2000, items: 980 },
    { name: 'Week 4', spend: 2780, items: 390 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="mr-3 text-emerald-600" size={32} />
            Purchasing Operations Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Real-time overview of PRs, POs, Receipts, and Returns.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Pending PRs', value: '45', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Active POs', value: '112', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending GRNs', value: '18', icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Returns (MTD)', value: '6', icon: RefreshCcw, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 w-full h-1 ${stat.bg}`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="mr-2 text-gray-400" size={20} /> Purchasing Spend Trend
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="spend" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <AlertCircle className="mr-2 text-amber-500" size={20} /> Pending Actions
          </h3>
          <div className="space-y-4">
             {[
               { title: 'Budget Approval Required', desc: 'PR-2026-00104 exceeds department budget by 15%', time: '2 hours ago', icon: DollarSign, color: 'text-amber-500' },
               { title: 'Quality Inspection Pending', desc: 'GRN-2026-00042 arrived with 2 damaged boxes', time: '5 hours ago', icon: CheckCircle, color: 'text-blue-500' },
               { title: 'Invoice Discrepancy', desc: 'INV-7738 value is 10% higher than PO grand total', time: '1 day ago', icon: AlertCircle, color: 'text-rose-500' },
             ].map((alert, i) => (
                <div key={i} className="flex items-start p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                   <div className={`p-2 rounded-lg bg-white mr-4 shadow-sm ${alert.color}`}>
                     <alert.icon size={20} />
                   </div>
                   <div>
                     <h4 className="font-bold text-gray-900 text-sm">{alert.title}</h4>
                     <p className="text-sm text-gray-500 mt-1">{alert.desc}</p>
                   </div>
                   <span className="ml-auto text-xs text-gray-400">{alert.time}</span>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}