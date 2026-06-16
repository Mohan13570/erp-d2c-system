import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart2, PieChart, Activity, DollarSign } from 'lucide-react';

export default function BIDashboard() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/bi/dashboard')
      .then(r => r.json())
      .then(d => {
        if(d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError('Failed to connect to BI Engine'));
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col relative bg-[#F8F9FA]">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center"><TrendingUp className="mr-3 text-indigo-600"/> Business Intelligence</h1>
        <p className="text-gray-500 font-medium mt-1">Real-time KPI and financial aggregation engine.</p>
      </div>

      {error ? (
         <div className="flex-1 flex justify-center items-center flex-col">
            <p className="text-rose-500 font-bold text-xl">System Error</p>
            <p className="text-gray-500">{error}</p>
         </div>
      ) : !data ? (
        <div className="flex-1 flex justify-center items-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="bg-white p-6 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-center">
                <p className="text-gray-500 font-semibold mb-1 flex items-center"><DollarSign size={16} className="mr-1"/> Net Revenue</p>
                <p className="text-4xl font-black text-emerald-600">${data.kpis.revenue.toLocaleString()}</p>
             </div>
             <div className="bg-white p-6 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-center">
                <p className="text-gray-500 font-semibold mb-1 flex items-center"><Activity size={16} className="mr-1"/> Expenses</p>
                <p className="text-4xl font-black text-rose-500">${data.kpis.expenses.toLocaleString()}</p>
             </div>
             <div className="bg-white p-6 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-center">
                <p className="text-gray-500 font-semibold mb-1 flex items-center"><PieChart size={16} className="mr-1"/> Active Shipments</p>
                <p className="text-4xl font-black text-indigo-600">{data.kpis.activeShipments}</p>
             </div>
             <div className="bg-white p-6 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-center">
                <p className="text-gray-500 font-semibold mb-1 flex items-center"><BarChart2 size={16} className="mr-1"/> Total Sales</p>
                <p className="text-4xl font-black text-gray-900">{data.kpis.totalSales}</p>
             </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100">
            <h3 className="text-lg font-bold mb-6 text-gray-800">6-Month Revenue Forecast</h3>
            <div className="h-64 flex items-end space-x-2 justify-between">
              {data.revenueForecast.length === 0 || data.revenueForecast.every((i: any) => i.revenue === 0) ? (
                 <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
                   <p className="text-gray-400 font-bold">No active financial records to forecast.</p>
                 </div>
              ) : (
                data.revenueForecast.map((item: any) => {
                  const maxVal = Math.max(80000, ...data.revenueForecast.map((i:any) => i.revenue));
                  const heightPct = Math.max(5, (item.revenue / maxVal) * 100);
                  return (
                    <div key={item.month} className="flex flex-col items-center w-full group">
                      <div className="w-full bg-indigo-100 rounded-t-xl relative overflow-hidden transition-all duration-300 group-hover:bg-indigo-200" style={{ height: `${heightPct}%` }}>
                        <div className="absolute inset-x-0 bottom-0 bg-indigo-600 rounded-t-xl" style={{ height: '10%' }}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-400 mt-3">{item.month}</span>
                      <span className="text-xs font-bold text-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity absolute -mt-8">${(item.revenue/1000).toFixed(0)}k</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
