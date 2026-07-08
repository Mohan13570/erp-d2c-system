import React, { useState, useEffect } from 'react';
import { Box, Anchor, TrendingUp, AlertTriangle, Ship, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function YardDashboard() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ocean/port-ops/calls')
      .then(res => res.json())
      .then(data => {
        setCalls(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Anchor className="text-indigo-600" /> Port & Yard Operations
          </h1>
          <p className="text-gray-500 mt-1">Terminal overview, congestion, and berth schedules.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/ocean/ops/inventory" className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
            <Box size={18} /> <span>Container Inventory</span>
          </Link>
          <Link to="/ocean/ops/gate" className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center space-x-2">
            <span>Gate Operations</span> <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
           <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-3">
             <Box size={24} />
           </div>
           <div className="text-3xl font-bold text-gray-900">4,250</div>
           <div className="text-sm text-gray-500 font-medium">TEU in Yard</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
           <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-3">
             <TrendingUp size={24} />
           </div>
           <div className="text-3xl font-bold text-gray-900">85%</div>
           <div className="text-sm text-gray-500 font-medium">Yard Utilization</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
           <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-3">
             <Ship size={24} />
           </div>
           <div className="text-3xl font-bold text-gray-900">{calls.length}</div>
           <div className="text-sm text-gray-500 font-medium">Vessels at Berth</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
           <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-3">
             <AlertTriangle size={24} />
           </div>
           <div className="text-3xl font-bold text-gray-900">12</div>
           <div className="text-sm text-gray-500 font-medium">Damaged Units</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
         <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Active Port Calls & Berthing</h2>
         {loading ? (
            <p className="text-gray-500">Loading port schedules...</p>
         ) : (
           <table className="w-full text-left">
             <thead className="text-sm font-semibold text-gray-500">
               <tr>
                 <th className="pb-3">Vessel</th>
                 <th className="pb-3">Port</th>
                 <th className="pb-3">Terminal / Berth</th>
                 <th className="pb-3">ETA</th>
                 <th className="pb-3">Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
               {calls.length === 0 ? (
                 <tr><td colSpan={5} className="pt-4 text-center text-gray-500">No active calls.</td></tr>
               ) : calls.map((c: any) => (
                 <tr key={c.id}>
                   <td className="py-3 font-medium text-gray-900">{c.vessel?.name}</td>
                   <td className="py-3 text-sm text-gray-600">{c.port?.name}</td>
                   <td className="py-3 text-sm text-gray-600">{c.terminal?.name || 'Unassigned'} / {c.berth?.code || 'Unassigned'}</td>
                   <td className="py-3 text-sm text-gray-600">{c.eta ? new Date(c.eta).toLocaleString() : 'TBD'}</td>
                   <td className="py-3">
                     <span className={`px-2 py-1 rounded text-xs font-semibold ${c.status === 'Arrived' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                       {c.status}
                     </span>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         )}
      </div>
    </div>
  );
}
