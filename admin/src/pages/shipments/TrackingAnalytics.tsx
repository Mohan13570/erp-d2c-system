import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { TrendingUp, Clock, AlertTriangle, ShieldCheck, UserCheck } from 'lucide-react';

const MOCK_ANALYTICS = {
  kpis: {
    avgTransitTime: '48.5 hours',
    avgDelay: '42 mins',
    successRate: '98.4%',
    vehicleUtilization: '85%'
  },
  transitPerformance: [
    { month: 'Jan', onTime: 95, delayed: 5 },
    { month: 'Feb', onTime: 92, delayed: 8 },
    { month: 'Mar', onTime: 98, delayed: 2 },
    { month: 'Apr', onTime: 90, delayed: 10 },
    { month: 'May', onTime: 96, delayed: 4 },
    { month: 'Jun', onTime: 99, delayed: 1 },
  ],
  driverPerformance: [
    { name: 'Sam J.', score: 98, deliveries: 145 },
    { name: 'Mike D.', score: 92, deliveries: 112 },
    { name: 'Sarah C.', score: 95, deliveries: 130 },
  ]
};

export default function TrackingAnalytics() {
  const [data] = useState(MOCK_ANALYTICS);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-blue-600" /> Tracking Analytics Engine
        </h1>
        <p className="text-slate-500 mt-1">Macro-level performance matrices and historical tracking aggregations.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <Clock className="w-6 h-6 text-indigo-500 mb-2" />
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Avg Transit Time</h3>
          <p className="text-3xl font-black text-slate-900">{data.kpis.avgTransitTime}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <AlertTriangle className="w-6 h-6 text-amber-500 mb-2" />
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Average Delay</h3>
          <p className="text-3xl font-black text-slate-900">{data.kpis.avgDelay}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <ShieldCheck className="w-6 h-6 text-emerald-500 mb-2" />
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Delivery Success</h3>
          <p className="text-3xl font-black text-slate-900">{data.kpis.successRate}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <Truck className="w-6 h-6 text-blue-500 mb-2" />
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Fleet Utilization</h3>
          <p className="text-3xl font-black text-slate-900">{data.kpis.vehicleUtilization}</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        
        {/* On Time vs Delayed */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-black text-slate-900 mb-6">Transit Performance Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.transitPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '12px', fontWeight: 'bold'}} />
                <Bar dataKey="onTime" name="On Time Delivery" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="delayed" name="Delayed Delivery" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Driver Performance Matrix */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-black text-slate-900 mb-6">Driver Success Matrix</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.driverPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                <RechartsTooltip cursor={{stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '5 5'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '12px', fontWeight: 'bold'}} />
                <Line yAxisId="left" type="monotone" dataKey="score" name="Success Score" stroke="#3b82f6" strokeWidth={4} dot={{r: 6, strokeWidth: 2}} activeDot={{r: 8}} />
                <Line yAxisId="right" type="monotone" dataKey="deliveries" name="Total Deliveries" stroke="#8b5cf6" strokeWidth={4} dot={{r: 6, strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}

// Temporary icon mapping for missing imports
import { Truck } from 'lucide-react';
