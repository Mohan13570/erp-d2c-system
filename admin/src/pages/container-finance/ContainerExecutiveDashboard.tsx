import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ContainerExecutiveDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/container-finance/analytics')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <div className="p-8 text-center text-gray-500 font-bold">Loading Dashboard...</div>;

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <BarChart3 className="mr-3 text-fuchsia-600" size={32} /> Executive Dashboard
          </h1>
          <p className="text-gray-500 font-medium mt-1">High-level financial KPIs, fleet utilization, and revenue analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-10 text-emerald-500"><DollarSign size={120} /></div>
          <h3 className="text-gray-500 font-bold mb-1">Total Revenue</h3>
          <p className="text-4xl font-black text-gray-900">${data.revenue.toLocaleString()}</p>
          <div className="mt-4 flex items-center text-sm font-bold text-emerald-600">
            <TrendingUp size={16} className="mr-1" /> +12.4% vs Last Month
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <h3 className="text-gray-500 font-bold mb-1">Total Profit</h3>
          <p className="text-4xl font-black text-gray-900">${data.profit.toLocaleString()}</p>
          <div className="mt-4 flex items-center text-sm font-bold text-emerald-600">
            <TrendingUp size={16} className="mr-1" /> +8.1% vs Last Month
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <h3 className="text-gray-500 font-bold mb-1">Fleet Utilization</h3>
          <p className="text-4xl font-black text-gray-900">{Math.round((data.inTransit / data.totalContainers) * 100)}%</p>
          <div className="mt-4 flex items-center text-sm font-bold text-rose-600">
            <TrendingDown size={16} className="mr-1" /> -2.4% vs Last Month
          </div>
        </div>
        <div className="bg-gradient-to-br from-fuchsia-600 to-fuchsia-900 p-6 rounded-3xl shadow-sm relative overflow-hidden text-white">
          <h3 className="text-fuchsia-200 font-bold mb-1">Fleet Ownership</h3>
          <div className="mt-2 flex justify-between items-end">
            <div>
              <p className="text-3xl font-black">{data.owned}</p>
              <span className="text-xs font-bold text-fuchsia-300 uppercase tracking-widest">Owned</span>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black">{data.leased}</p>
              <span className="text-xs font-bold text-fuchsia-300 uppercase tracking-widest">Leased</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue vs Profit Trend</h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} tickFormatter={(value) => `$${value/1000}k`} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#c026d3" fill="#e879f9" strokeWidth={4} />
              <Area type="monotone" dataKey="profit" stackId="2" stroke="#10b981" fill="#34d399" strokeWidth={4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
