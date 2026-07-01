import React from 'react';
import { BarChart2, PieChart as PieChartIcon, Map, Download, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function RoadAnalytics() {
  const costData = [
    { month: 'Jan', revenue: 4000, cost: 2400, fuel: 1000 },
    { month: 'Feb', revenue: 3000, cost: 1398, fuel: 800 },
    { month: 'Mar', revenue: 2000, cost: 9800, fuel: 2400 },
    { month: 'Apr', revenue: 2780, cost: 3908, fuel: 1800 },
    { month: 'May', revenue: 1890, cost: 4800, fuel: 1900 },
    { month: 'Jun', revenue: 2390, cost: 3800, fuel: 2100 },
    { month: 'Jul', revenue: 3490, cost: 4300, fuel: 1700 },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <BarChart2 className="mr-3 text-indigo-600" size={32} /> Road Logistics Analytics
          </h1>
          <p className="text-gray-500 font-medium mt-1">Fleet KPIs, Cost Per KM, and profitability reports.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors">
          <Download size={18} className="mr-2" /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-96 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="mr-2 text-emerald-500" size={20} /> Revenue vs Operating Costs
          </h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                <Area type="monotone" dataKey="cost" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-96 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <PieChartIcon className="mr-2 text-indigo-500" size={20} /> Fuel Cost Analysis
          </h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="fuel" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

