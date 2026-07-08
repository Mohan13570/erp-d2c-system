import React, { useState, useEffect } from 'react';
import { TrendingUp, Ship, Box, AlertTriangle, Briefcase, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ExecutiveDashboard() {
  const [kpis, setKpis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ocean/analytics/executive-kpis')
      .then(res => res.json())
      .then(data => {
        setKpis(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading executive metrics...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="text-indigo-600" /> Executive Intelligence
          </h1>
          <p className="text-gray-500 mt-2">C-Level overview of Global Ocean Operations and Financials.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/ocean/executive/performance" className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium flex items-center space-x-2 shadow-sm">
            <Activity size={18} /> <span>Deep BI Analytics</span>
          </Link>
          <Link to="/ocean/tracking/map" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium shadow-sm shadow-indigo-200">
            Live Global Map
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-3xl text-white shadow-lg shadow-indigo-200">
           <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                 <Briefcase size={24} />
              </div>
           </div>
           <div className="text-indigo-100 font-medium mb-1">Total Gross Revenue</div>
           <div className="text-4xl font-bold">${kpis.finance.revenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
           <div className="mt-4 text-sm bg-white/20 px-3 py-1.5 rounded-lg inline-block backdrop-blur-sm">Net Profit: ${kpis.finance.profit.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                 <Ship size={24} />
              </div>
           </div>
           <div className="text-gray-500 font-medium mb-1">Active Vessels at Sea</div>
           <div className="text-4xl font-bold text-gray-900">{kpis.operations.activeVessels}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                 <Box size={24} />
              </div>
           </div>
           <div className="text-gray-500 font-medium mb-1">Containers In-Transit</div>
           <div className="text-4xl font-bold text-gray-900">{kpis.operations.activeContainers}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                 <AlertTriangle size={24} />
              </div>
           </div>
           <div className="text-gray-500 font-medium mb-1">Critical Delay Alerts</div>
           <div className="text-4xl font-bold text-gray-900">{kpis.alerts}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         <div className="col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex items-center justify-center text-gray-400 min-h-[400px]">
             {/* Note: Placeholder for Recharts implementation */}
             <div className="text-center">
                <Activity size={48} className="mx-auto mb-4 opacity-50" />
                <p className="font-medium text-lg">Financial Performance Chart Ready for Injection</p>
                <p className="text-sm mt-1">Requires Recharts library to render monthly gross margin splines.</p>
             </div>
         </div>
         <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Executive Briefing</h2>
            <div className="space-y-4">
               <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                  <div className="font-bold text-orange-900 mb-1">Port Congestion Warning</div>
                  <div className="text-sm text-orange-800">Long Beach terminal experiencing 48h delays due to crane shortages.</div>
               </div>
               <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="font-bold text-blue-900 mb-1">Vessel ETA Update</div>
                  <div className="text-sm text-blue-800">MSC Oliver expected to arrive 12 hours ahead of schedule.</div>
               </div>
               <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                  <div className="font-bold text-green-900 mb-1">Customs Clearance</div>
                  <div className="text-sm text-green-800">{kpis.operations.pendingCustoms} shipments currently pending customs examination.</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
