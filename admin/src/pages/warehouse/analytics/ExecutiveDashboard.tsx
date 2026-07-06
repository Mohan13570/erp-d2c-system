import React from 'react';
import { BarChart3, TrendingUp, Users, Target } from 'lucide-react';

export default function ExecutiveDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">WMS Executive Dashboard</h1>
          <p className="text-sm text-gray-500">Strategic KPIs, Space Utilization, and Predictive Heat Maps</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Space Utilization', value: '82%', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Picking Accuracy', value: '99.4%', icon: Target, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Labour Productivity', value: '+14%', icon: Users, color: 'text-violet-600', bg: 'bg-violet-100' },
          { label: 'Inventory Turnover', value: '4.2x', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-80 flex items-center justify-center">
          <p className="text-gray-500">Warehouse Activity Heat Map (ABC Analysis)</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-80 flex items-center justify-center">
          <p className="text-gray-500">Inbound vs Outbound Velocity Chart</p>
        </div>
      </div>
    </div>
  );
}
