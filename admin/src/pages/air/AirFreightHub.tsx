import React, { useState, useEffect } from 'react';
import { Plane, Box, ShieldCheck, DollarSign, Activity, FileText, LayoutDashboard, Navigation, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AirFreightHub() {
  const [kpi, setKpi] = useState({ revenueMTD: 0, profitMTD: 0, activeShipments: 0, avgUldUtilization: 0 });

  const modules = [
    { name: 'Bookings & HAWB', path: '/air/bookings', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100', desc: 'Create bookings and generate AWBs.' },
    { name: 'Cargo Acceptance', path: '/air/operations/acceptance', icon: Box, color: 'text-amber-600', bg: 'bg-amber-100', desc: 'Scan and accept cargo into the warehouse.' },
    { name: 'ULD Build-up', path: '/air/operations/uld', icon: Box, color: 'text-indigo-600', bg: 'bg-indigo-100', desc: 'Stuff cargo into containers and pallets.' },
    { name: 'Load Planning', path: '/air/operations/load-plan', icon: Plane, color: 'text-rose-600', bg: 'bg-rose-100', desc: 'Aircraft weight and balance.' },
    { name: 'Ramp Operations', path: '/air/operations/ramp', icon: Navigation, color: 'text-sky-600', bg: 'bg-sky-100', desc: 'Tarmac mobile view for ground handlers.' },
    { name: 'Customs Clearance', path: '/air/customs', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-100', desc: 'Import/Export declarations.' },
    { name: 'Financials & Costing', path: '/air/finance', icon: DollarSign, color: 'text-emerald-700', bg: 'bg-emerald-200', desc: 'Surcharges, billing, and AP/AR.' },
    { name: 'Live Tracking', path: '/air/tracking', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100', desc: 'Real-time flight and milestone tracking.' },
    { name: 'Analytics & Reports', path: '/air/analytics', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100', desc: 'KPIs, yield management, and delay analysis.' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center">
            <Plane className="mr-3 text-sky-600" size={40} /> Air Freight Hub
          </h1>
          <p className="text-gray-500 font-medium mt-2 text-lg">Central Executive Dashboard for Air Operations</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-lg border border-gray-800">
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Revenue (MTD)</div>
          <div className="text-4xl font-black">${(kpi.revenueMTD / 1000).toFixed(1)}k</div>
        </div>
        <div className="bg-emerald-500 text-white p-6 rounded-3xl shadow-lg shadow-emerald-200">
          <div className="text-sm font-bold text-emerald-100 uppercase tracking-wider mb-2">Profit (MTD)</div>
          <div className="text-4xl font-black">${(kpi.profitMTD / 1000).toFixed(1)}k</div>
          <div className="text-xs font-bold mt-2 bg-emerald-600 inline-block px-2 py-1 rounded-full text-emerald-50">31.05% Margin</div>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Active Shipments</div>
          <div className="text-4xl font-black text-gray-900">{kpi.activeShipments}</div>
        </div>
        <div className="bg-sky-50 border border-sky-100 p-6 rounded-3xl shadow-sm">
          <div className="text-sm font-bold text-sky-600 uppercase tracking-wider mb-2">Avg ULD Util.</div>
          <div className="text-4xl font-black text-sky-700">{kpi.avgUldUtilization}%</div>
        </div>
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
          <LayoutDashboard className="mr-2 text-gray-400" /> Operational Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((m, i) => (
            <Link key={i} to={m.path} className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition group">
              <div className={`p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 ${m.bg} ${m.color}`}>
                <m.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-sky-600 transition">{m.name}</h3>
              <p className="text-gray-500 font-medium text-sm mt-2">{m.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
