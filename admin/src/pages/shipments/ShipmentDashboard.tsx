import React, { useState, useEffect } from 'react';
import { Ship, Plane, Truck, Anchor, PackageCheck, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

export default function ShipmentDashboard() {
  const [stats, setStats] = useState({ active: 142, delayed: 8, completed: 890, revenue: 1450000 });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Shipment Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1">Real-time overview of global logistics operations.</p>
        </div>
      </div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Active Shipments</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{stats.active}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Ship size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Delayed / Alerts</p>
            <h3 className="text-3xl font-black text-red-600 mt-1">{stats.delayed}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
            <AlertTriangle size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Completed YTD</p>
            <h3 className="text-3xl font-black text-emerald-600 mt-1">{stats.completed}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <PackageCheck size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Revenue YTD</p>
            <h3 className="text-3xl font-black text-indigo-600 mt-1">${(stats.revenue/1000000).toFixed(1)}M</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* Map Heatmap Placeholder */}
      <div className="bg-slate-900 rounded-3xl h-96 w-full relative overflow-hidden flex items-center justify-center shadow-lg">
         <div className="absolute inset-0 opacity-40 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
         <div className="z-10 text-center">
            <TrendingUp size={48} className="text-indigo-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white">Live Global Tracking Active</h3>
            <p className="text-slate-400 mt-2">142 active vessels and flights tracked globally via IoT.</p>
         </div>
      </div>

    </div>
  );
}
