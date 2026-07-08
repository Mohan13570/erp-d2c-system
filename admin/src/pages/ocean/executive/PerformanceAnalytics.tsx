import React, { useState, useEffect } from 'react';
import { Activity, BarChart2 } from 'lucide-react';

export default function PerformanceAnalytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/ocean/analytics/performance')
      .then(res => res.json())
      .then(d => setData(d));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
           <Activity size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deep BI Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Carrier reliability, transit time analysis, and port performance.</p>
        </div>
      </div>

      {data ? (
         <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
               <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
                  <BarChart2 className="text-gray-400" /> Carrier Reliability (ETA vs Actual)
               </h2>
               <div className="space-y-6">
                  {data.carrierPerformance.map((c: any) => (
                     <div key={c.name}>
                        <div className="flex justify-between text-sm font-medium mb-2">
                           <span className="text-gray-700">{c.name}</span>
                           <span className={c.onTime > 80 ? 'text-green-600' : 'text-orange-600'}>{c.onTime}% On-Time</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                           <div className={`h-2 rounded-full ${c.onTime > 80 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${c.onTime}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
                <Activity size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="font-bold text-gray-900 text-xl">Profitability Margin Spline</h3>
                <p className="text-gray-500 mt-2 max-w-sm">Requires charting library (Recharts/ChartJS) to render the Monthly Revenue vs Margin trend lines.</p>
            </div>
         </div>
      ) : (
         <div className="p-8 text-center text-gray-500">Loading BI Data...</div>
      )}
    </div>
  );
}
