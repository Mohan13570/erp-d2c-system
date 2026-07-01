import React, { useState, useEffect } from 'react';
import { LayoutDashboard, TrendingUp, AlertTriangle, ShieldCheck, Wrench, Settings } from 'lucide-react';

export default function MaintenanceExecutiveDashboard() {
  const [kpi, setKpi] = useState<any>({ fleetHealthScore: 100, vehiclesUnderMaintenance: 0, overdueServices: 0, openRepairs: 0, mtbfHours: 0, mttrHours: 0, ytdMaintenanceCost: 0 });

  useEffect(() => {
    fetch('/api/maintenance-ops/analytics/kpi')
      .then(res => res.json())
      .then(setKpi)
      .catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <LayoutDashboard className="mr-3 text-emerald-600" size={32} /> Maintenance Executive Dashboard
          </h1>
          <p className="text-gray-500 font-medium mt-1">High-level KPIs: Fleet Health, MTBF, MTTR, and Cost Analytics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck size={100} className="text-emerald-500" />
          </div>
          <h3 className="text-gray-500 font-bold mb-1">Fleet Health Score</h3>
          <p className="text-5xl font-black text-gray-900 mb-2">{kpi.fleetHealthScore}%</p>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-4">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${kpi.fleetHealthScore}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp size={100} className="text-indigo-500" />
          </div>
          <h3 className="text-gray-500 font-bold mb-1">MTBF (Mean Time Between Failures)</h3>
          <p className="text-4xl font-black text-gray-900 mb-2">{kpi.mtbfHours} <span className="text-xl text-gray-400">Hours</span></p>
          <p className="text-sm font-bold text-emerald-500 flex items-center mt-2">+12% vs last month</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wrench size={100} className="text-amber-500" />
          </div>
          <h3 className="text-gray-500 font-bold mb-1">MTTR (Mean Time To Repair)</h3>
          <p className="text-4xl font-black text-gray-900 mb-2">{kpi.mttrHours} <span className="text-xl text-gray-400">Hours</span></p>
          <p className="text-sm font-bold text-emerald-500 flex items-center mt-2">-1.5 hrs vs last month</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertTriangle size={100} className="text-rose-500" />
          </div>
          <h3 className="text-gray-500 font-bold mb-1">Critical Action Needed</h3>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-rose-600">Vehicles Down:</span>
              <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded">{kpi.vehiclesUnderMaintenance}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-amber-600">Overdue Services:</span>
              <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded">{kpi.overdueServices}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-96 flex flex-col items-center justify-center">
          <Settings size={48} className="text-gray-300 mb-4 animate-spin-slow" />
          <h3 className="text-xl font-bold text-gray-900">Cost Analytics Render Zone</h3>
          <p className="text-gray-500 text-sm mt-2">Recharts area mapping Maintenance Cost vs MTTR over time.</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-96 flex flex-col items-center justify-center">
          <Settings size={48} className="text-gray-300 mb-4 animate-spin-slow" />
          <h3 className="text-xl font-bold text-gray-900">Fleet Availability Render Zone</h3>
          <p className="text-gray-500 text-sm mt-2">Pie chart displaying Active vs Maintenance vs Retired.</p>
        </div>
      </div>
    </div>
  );
}
