import React, { useState } from 'react';
import { Truck, AlertTriangle, ShieldCheck, Wrench, Settings2, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VehicleDashboard() {
  const stats = { active: 0, maintenance: 0, expiredDocs: 0, retired: 0 };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Fleet Management</h1>
          <p className="text-gray-500 font-medium mt-1">High-level overview of vehicle health, utilization, and compliance.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/vehicles/list" className="px-5 py-2.5 font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">View All Vehicles</Link>
          <Link to="/vehicles/register" className="px-5 py-2.5 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 flex items-center gap-2">
            <Truck size={18} /> Register Vehicle
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div><p className="text-sm font-bold text-gray-400 uppercase">Active Fleet</p><h3 className="text-3xl font-black text-gray-900 mt-1">{stats.active}</h3></div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center"><CheckCircle2 size={24}/></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div><p className="text-sm font-bold text-gray-400 uppercase">In Maintenance</p><h3 className="text-3xl font-black text-orange-600 mt-1">{stats.maintenance}</h3></div>
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center"><Wrench size={24}/></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div><p className="text-sm font-bold text-red-500 uppercase">Expired Docs</p><h3 className="text-3xl font-black text-red-600 mt-1">{stats.expiredDocs}</h3></div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center"><AlertTriangle size={24}/></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div><p className="text-sm font-bold text-gray-400 uppercase">Compliance Score</p><h3 className="text-3xl font-black text-emerald-600 mt-1">98%</h3></div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center"><ShieldCheck size={24}/></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         <div className="col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
             <Settings2 size={64} className="text-gray-200 mb-4" />
             <h2 className="text-xl font-bold text-gray-900">Fleet Utilization Heatmap</h2>
             <p className="text-gray-500 mt-2">Connect to BI module for advanced visual reporting.</p>
         </div>
         <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><FileText size={20}/> Compliance Alerts</h3>
            <div className="space-y-4">
               <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                  <div className="flex justify-between items-center mb-1">
                     <span className="font-bold text-red-400">RC Expiring Soon</span>
                     <span className="text-xs text-slate-400">3 Days</span>
                  </div>
                  <p className="text-sm text-slate-300">Vehicle KA-01-AB-1234 requires registration renewal.</p>
               </div>
               <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                  <div className="flex justify-between items-center mb-1">
                     <span className="font-bold text-orange-400">Insurance Renewal</span>
                     <span className="text-xs text-slate-400">12 Days</span>
                  </div>
                  <p className="text-sm text-slate-300">Vehicle MH-12-CD-5678 policy expires next week.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
