import React from 'react';
import { TrendingUp, BarChart2, PieChart, Download } from 'lucide-react';

export default function AnalyticsDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <TrendingUp className="mr-3 text-orange-600" size={32} /> Analytics & Reports
          </h1>
          <p className="text-gray-500 font-medium mt-1">Deep dive into yield management, transit times, and delay analysis.</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-200 transition flex items-center">
            <Download size={18} className="mr-2" /> Export PDF
          </button>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center shadow-md">
            <Download size={18} className="mr-2" /> Export Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart Mock */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center"><BarChart2 className="mr-2 text-sky-600" /> Revenue vs Cost Trend</h2>
          <div className="h-64 flex items-end justify-between px-4 space-x-2">
            {[45, 52, 48, 61, 59, 30, 25].map((rev, i) => (
              <div key={i} className="w-1/7 flex flex-col items-center justify-end h-full">
                <div className="w-8 bg-sky-500 rounded-t-sm" style={{ height: `${rev}%` }}></div>
                <div className="w-8 bg-red-400 rounded-b-sm" style={{ height: `${rev * 0.7}%` }}></div>
                <div className="mt-2 text-xs font-bold text-gray-400 uppercase">Day {i+1}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Delay Analysis Pie Chart Mock */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center"><PieChart className="mr-2 text-amber-500" /> Delay Analysis</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border-[20px] border-amber-400 relative flex items-center justify-center">
              <div className="absolute inset-0 border-[20px] border-emerald-500 rounded-full" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 50%)' }}></div>
              <div className="text-center bg-white w-32 h-32 rounded-full flex flex-col items-center justify-center absolute">
                <div className="text-2xl font-black text-gray-900">12%</div>
                <div className="text-xs font-bold text-gray-500">Delayed Flights</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-6 mt-4 text-sm font-bold">
            <div className="flex items-center text-emerald-600"><span className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></span> On Time (88%)</div>
            <div className="flex items-center text-amber-600"><span className="w-3 h-3 bg-amber-400 rounded-full mr-2"></span> Weather / Ops (12%)</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
         <h2 className="text-xl font-black text-gray-900 mb-6">Top Performing Air Routes (Profitability)</h2>
         <table className="w-full text-left">
           <thead>
             <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b">
               <th className="pb-4">Origin &rarr; Dest</th>
               <th className="pb-4">Airline</th>
               <th className="pb-4 text-right">Vol (kg)</th>
               <th className="pb-4 text-right">Revenue</th>
               <th className="pb-4 text-right">Margin</th>
             </tr>
           </thead>
           <tbody className="text-sm font-bold">
             <tr className="border-b border-gray-50">
               <td className="py-4 text-sky-600">DXB &rarr; JFK</td>
               <td className="py-4">Emirates SkyCargo</td>
               <td className="py-4 text-right text-gray-600">45,200</td>
               <td className="py-4 text-right text-gray-900">$180,500</td>
               <td className="py-4 text-right text-emerald-600">32.4%</td>
             </tr>
             <tr className="border-b border-gray-50">
               <td className="py-4 text-sky-600">HKG &rarr; FRA</td>
               <td className="py-4">Lufthansa Cargo</td>
               <td className="py-4 text-right text-gray-600">38,900</td>
               <td className="py-4 text-right text-gray-900">$150,200</td>
               <td className="py-4 text-right text-emerald-600">28.1%</td>
             </tr>
           </tbody>
         </table>
      </div>
    </div>
  );
}
