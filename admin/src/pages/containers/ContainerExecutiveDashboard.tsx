import React from 'react';
import { LayoutDashboard, Box, AlertTriangle, TrendingUp, Anchor } from 'lucide-react';

export default function ContainerExecutiveDashboard() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <LayoutDashboard className="mr-3 text-cyan-600" size={32} /> Container Executive Dashboard
          </h1>
          <p className="text-gray-500 font-medium mt-1">High-level KPIs for Fleet Utilization, Dwell Times, and Ownership splits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Box size={100} className="text-cyan-500" />
          </div>
          <h3 className="text-gray-500 font-bold mb-1">Total Fleet Size</h3>
          <p className="text-5xl font-black text-gray-900 mb-2">1,248</p>
          <p className="text-sm font-bold text-emerald-500 flex items-center mt-2">+45 this year</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp size={100} className="text-indigo-500" />
          </div>
          <h3 className="text-gray-500 font-bold mb-1">Utilization Rate</h3>
          <p className="text-5xl font-black text-gray-900 mb-2">84%</p>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-4">
            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `84%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertTriangle size={100} className="text-amber-500" />
          </div>
          <h3 className="text-gray-500 font-bold mb-1">Avg Dwell Time</h3>
          <p className="text-4xl font-black text-gray-900 mb-2">4.2 <span className="text-xl text-gray-400">Days</span></p>
          <p className="text-sm font-bold text-amber-500 flex items-center mt-2">At Port/Yard</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Anchor size={100} className="text-slate-500" />
          </div>
          <h3 className="text-gray-500 font-bold mb-1">Ownership Split</h3>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-slate-600">Owned:</span>
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">840 (67%)</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-blue-600">Leased:</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">408 (33%)</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
