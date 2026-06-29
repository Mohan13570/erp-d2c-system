import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BarChart3, TrendingUp, DownloadCloud } from 'lucide-react';

export default function BIReports() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/reports/fleet').then(r => r.json()).then(setData).catch(console.error);
  }, []);

  if (!data) return <div className="p-8 text-center font-bold text-gray-500 animate-pulse">Aggregating Data Warehouses...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
             <BarChart3 className="text-indigo-600"/> BI Reporting Suite
          </h1>
          <p className="text-gray-500 font-medium mt-1">Deep analytics across Fleet, Fuel, and Financial utilization.</p>
        </div>
        <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-colors" onClick={() => window.print()}>
           <DownloadCloud size={18}/> Export PDF Report
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"><p className="text-sm font-bold text-gray-500 uppercase">Gross Revenue</p><h2 className="text-3xl font-black mt-2">${data.kpi.totalRevenue.toLocaleString()}</h2></div>
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"><p className="text-sm font-bold text-gray-500 uppercase">Fuel Burn</p><h2 className="text-3xl font-black mt-2 text-red-500">${data.kpi.totalFuel.toLocaleString()}</h2></div>
         <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl"><p className="text-sm font-bold text-slate-400 uppercase">Net Margin</p><h2 className="text-3xl font-black mt-2 text-emerald-400">${data.kpi.netProfit.toLocaleString()}</h2></div>
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"><p className="text-sm font-bold text-gray-500 uppercase">Total Distance Driven</p><h2 className="text-3xl font-black mt-2 text-indigo-600">{data.kpi.totalDistance.toLocaleString()} km</h2></div>
      </div>

      <div className="grid grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-96">
            <h3 className="font-bold text-lg mb-6">Financial Growth (Revenue vs Profit)</h3>
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={data.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} dot={{r: 4}} activeDot={{r: 8}} />
                  <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={4} dot={{r: 4}} activeDot={{r: 8}} />
               </LineChart>
            </ResponsiveContainer>
         </div>

         <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-96">
            <h3 className="font-bold text-lg mb-6">Cost Center Analysis</h3>
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={[{name: 'Operating Costs', Fuel: data.kpi.totalFuel, Tolls: data.kpi.totalTolls}]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Legend />
                  <Bar dataKey="Fuel" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Tolls" fill="#f59e0b" radius={[4, 4, 0, 0]} />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
}
