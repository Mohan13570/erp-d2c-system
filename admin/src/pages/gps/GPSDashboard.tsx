import React, { useState } from 'react';
import { Activity, Car, CheckCircle, AlertTriangle, ShieldAlert, Route } from 'lucide-react';
import LiveMap from './LiveMap';

export default function GPSDashboard() {
  const [activeTab, setActiveTab] = useState('live_map');
  const stats = { total: 0, moving: 0, idle: 0, offline: 0, alerts: 0 };

  return (
    <div className="p-8 max-w-[1400px] mx-auto h-[calc(100vh-4rem)] flex flex-col relative">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">GPS Tracking Fleet Command</h1>
          <p className="text-gray-500 font-medium mt-1">Real-time WebSocket telemetry for all active fleet and cargo units.</p>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
           <button onClick={() => setActiveTab('live_map')} className={`px-4 py-2 font-bold rounded-lg ${activeTab === 'live_map' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}>Live Map</button>
           <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2 font-bold rounded-lg ${activeTab === 'analytics' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}>Analytics</button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6 mb-6 shrink-0">
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
           <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Fleet</p><h3 className="text-2xl font-black text-gray-900 mt-1">{stats.total}</h3></div>
           <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center"><Car size={20}/></div>
         </div>
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
           <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Moving</p><h3 className="text-2xl font-black text-emerald-600 mt-1">{stats.moving}</h3></div>
           <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center"><Activity size={20}/></div>
         </div>
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
           <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Idle / Stopped</p><h3 className="text-2xl font-black text-orange-600 mt-1">{stats.idle}</h3></div>
           <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center"><CheckCircle size={20}/></div>
         </div>
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
           <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Offline</p><h3 className="text-2xl font-black text-gray-400 mt-1">{stats.offline}</h3></div>
           <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center"><AlertTriangle size={20}/></div>
         </div>
         <div className="bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-800 flex items-center justify-between">
           <div><p className="text-xs font-bold text-red-400 uppercase tracking-wider">Geofence / Speed Alerts</p><h3 className="text-2xl font-black text-white mt-1">{stats.alerts}</h3></div>
           <div className="w-10 h-10 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center"><ShieldAlert size={20}/></div>
         </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden relative">
         {activeTab === 'live_map' ? (
           <LiveMap />
         ) : (
           <div className="flex flex-col items-center justify-center h-full">
             <Route size={48} className="text-gray-300 mb-4" />
             <h2 className="text-xl font-bold text-gray-900">Historical Tracking Analytics</h2>
             <p className="text-gray-500 mt-2">Trip replays and fuel analytics graphs load here.</p>
           </div>
         )}
      </div>
    </div>
  );
}
