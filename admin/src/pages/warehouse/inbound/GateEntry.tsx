import React from 'react';
import { Truck, CheckCircle } from 'lucide-react';

export default function GateEntry() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gate Entry Check-In</h1>
          <p className="text-sm text-gray-500">Verify drivers and log incoming freight vehicles</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700">
          <CheckCircle className="w-5 h-5 mr-2" /> Log Arrival
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-96 flex items-center justify-center">
        <p className="text-gray-500">Gate Entry form and Active Trucks table will render here.</p>
      </div>
    </div>
  );
}
