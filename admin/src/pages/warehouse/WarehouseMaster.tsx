import React from 'react';
import { Building2, Plus, MapPin } from 'lucide-react';

export default function WarehouseMaster() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouse Master Setup</h1>
          <p className="text-sm text-gray-500">Configure core warehouse properties and types</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700">
          <Plus className="w-5 h-5 mr-2" /> Add Warehouse
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500">Master configurations will appear here.</p>
      </div>
    </div>
  );
}
