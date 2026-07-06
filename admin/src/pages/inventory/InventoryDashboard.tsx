import React from 'react';
import { Package, AlertCircle, TrendingUp, Activity } from 'lucide-react';

export default function InventoryDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h1>
          <p className="text-sm text-gray-500">Real-time stock valuation and ageing analysis</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Valuation', value: '$1.4M', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Low Stock Alerts', value: 12, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100' },
          { label: 'Active Batches', value: 340, icon: Package, color: 'text-violet-600', bg: 'bg-violet-100' },
          { label: 'Pending Transfers', value: 8, icon: Activity, color: 'text-amber-600', bg: 'bg-amber-100' }
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-96 flex items-center justify-center">
        <p className="text-gray-500">Inventory Forecasting & Ageing Chart will appear here.</p>
      </div>
    </div>
  );
}
