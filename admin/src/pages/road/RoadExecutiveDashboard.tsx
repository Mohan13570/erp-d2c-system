import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Truck, Users, DollarSign, Clock, ShieldCheck, MapPin, Activity } from 'lucide-react';

export default function RoadExecutiveDashboard() {
  const [kpi, setKpi] = useState<any>({ totalTrips: 0, activeVehicles: 0, activeDrivers: 0, openClaims: 0 });

  useEffect(() => {
    fetch('/api/road/analytics/kpi').then(res => res.json()).then(setKpi).catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center tracking-tight">
            <LayoutDashboard className="mr-3 text-indigo-600" size={32} /> Executive Command Center
          </h1>
          <p className="text-gray-500 font-medium mt-1">High-level overview of the entire Road Freight operation.</p>
        </div>
        <div className="flex space-x-3">
           <div className="flex flex-col text-right">
             <span className="text-xs font-bold text-gray-400 uppercase">System Status</span>
             <span className="text-sm font-black text-emerald-600 flex items-center justify-end"><Activity size={14} className="mr-1"/> All Systems Nominal</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center text-indigo-500 mb-2"><MapPin size={24} /></div>
          <p className="text-3xl font-black text-gray-900">{kpi.totalTrips}</p>
          <p className="text-sm font-bold text-gray-400 mt-1">Total Trips</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center text-emerald-500 mb-2"><Truck size={24} /></div>
          <p className="text-3xl font-black text-gray-900">{kpi.activeVehicles}</p>
          <p className="text-sm font-bold text-gray-400 mt-1">Vehicles Running</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center text-sky-500 mb-2"><Users size={24} /></div>
          <p className="text-3xl font-black text-gray-900">{kpi.activeDrivers}</p>
          <p className="text-sm font-bold text-gray-400 mt-1">Drivers on Duty</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center text-rose-500 mb-2"><ShieldCheck size={24} /></div>
          <p className="text-3xl font-black text-gray-900">{kpi.openClaims}</p>
          <p className="text-sm font-bold text-gray-400 mt-1">Open Claims</p>
        </div>
      </div>
    </div>
  );
}
