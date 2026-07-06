import React from 'react';
import { ArrowDownToLine, Clock, Truck, ClipboardCheck } from 'lucide-react';

export default function InboundDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inbound Operations Dashboard</h1>
          <p className="text-sm text-gray-500">Real-time metrics for ASN, Gate Entry, and Put-Away operations</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Expected ASN', value: 12, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Docked Trucks', value: 3, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'Pending GRN', value: 5, icon: ClipboardCheck, color: 'text-violet-600', bg: 'bg-violet-100' },
          { label: 'Pending Put-Away', value: 8, icon: ArrowDownToLine, color: 'text-green-600', bg: 'bg-green-100' }
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
        <p className="text-gray-500">Inbound Timeline Chart will appear here.</p>
      </div>
    </div>
  );
}
