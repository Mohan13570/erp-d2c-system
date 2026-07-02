import React, { useEffect, useState } from 'react';
import { Building2, Users, FileText, Target, TrendingUp, AlertTriangle, CheckCircle, BarChart3, Search, Activity, ShieldCheck, DollarSign } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';

export default function ProcurementHub() {
  const data = [
    { name: 'Jan', requests: 45, spend: 120000 },
    { name: 'Feb', requests: 52, spend: 145000 },
    { name: 'Mar', requests: 38, spend: 98000 },
    { name: 'Apr', requests: 65, spend: 180000 },
    { name: 'May', requests: 48, spend: 135000 },
    { name: 'Jun', requests: 70, spend: 210000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Building2 className="mr-3 text-indigo-600" size={32} />
            Procurement Executive Hub
          </h1>
          <p className="text-gray-500 mt-1">Enterprise Sourcing, Vendor Management & Contracts</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition">
          <Target className="w-4 h-4 mr-2" /> Quick Source RFQ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Active Vendors', value: '1,248', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Open RFQs', value: '34', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Contracts Expiring (<30d)', value: '12', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Pending Approvals', value: '8', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 w-full h-1 ${stat.bg}`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="mr-2 text-gray-400" size={20} /> Monthly Spend vs Requests
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" orientation="left" stroke="#4F46E5" />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar yAxisId="left" dataKey="spend" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Spend ($)" />
                <Line yAxisId="right" type="monotone" dataKey="requests" stroke="#10B981" strokeWidth={3} name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <Activity className="mr-2 text-gray-400" size={20} /> Vendor Risk Distribution
          </h3>
          <div className="space-y-6 mt-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-emerald-700">Low Risk Vendors</span>
                <span className="text-gray-500">84%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-amber-700">Medium Risk Vendors</span>
                <span className="text-gray-500">12%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-rose-700">High Risk (Requires Audit)</span>
                <span className="text-gray-500">4%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: '4%' }}></div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-amber-50 rounded-xl flex items-start">
               <ShieldCheck className="text-amber-600 mt-1 mr-3 flex-shrink-0" size={20} />
               <div>
                 <p className="text-sm font-bold text-amber-800">Compliance Action Required</p>
                 <p className="text-xs text-amber-700 mt-1">14 Vendors have ISO certifications expiring in the next 15 days. Auto-reminders have been dispatched.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}