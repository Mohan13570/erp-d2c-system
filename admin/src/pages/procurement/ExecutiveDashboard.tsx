import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, TrendingDown, DollarSign, Users, Briefcase, Activity } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';

export default function ExecutiveDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/analytics/dashboard')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(console.error);
  }, []);

  if (!data) return <div className="p-8 text-gray-500">Loading Enterprise Analytics...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Target className="mr-3 text-indigo-600" size={32} />
            Procurement Executive Dashboard
          </h1>
          <p className="text-gray-500 mt-1">C-Suite level insights into global spend, risk, and vendor performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
          <p className="text-indigo-100 font-medium">Total Spend (YTD)</p>
          <h3 className="text-4xl font-bold mt-2">$ {(data.kpis.totalSpendThisYear || 0).toLocaleString()}</h3>
          <div className="mt-4 flex items-center text-sm font-medium text-indigo-200">
            <TrendingUp size={16} className="mr-1"/> +12.5% vs last year
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium flex items-center"><DollarSign size={16} className="mr-2 text-rose-500"/> Pending Payments</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">$ {(data.kpis.pendingPayments || 0).toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium flex items-center"><Activity size={16} className="mr-2 text-amber-500"/> Budget Utilization</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">{data.kpis.budgetUtilization}</h3>
          <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
            <div className="bg-amber-500 h-2 rounded-full" style={{width: data.kpis.budgetUtilization}}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium flex items-center"><Briefcase size={16} className="mr-2 text-emerald-500"/> Open Approvals</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">{data.kpis.openPRs} Requisitions</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Monthly Spend Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlySpend}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6"/>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tickFormatter={(val) => `M${val}`} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="spend" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center"><Users size={20} className="mr-2 text-gray-400"/> Top Vendors by Spend</h3>
          <div className="space-y-4">
            {data.topVendors.length > 0 ? data.topVendors.map((v: any, i: number) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                <span className="font-medium text-gray-800">{v.vendorName}</span>
                <span className="font-bold text-indigo-600 font-mono">$ {v.spend.toLocaleString()}</span>
              </div>
            )) : <p className="text-sm text-gray-500">No vendor spend data available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}