import React from 'react';
import { Truck, Plus } from 'lucide-react';

export default function EquipmentManager() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipment & Asset Manager</h1>
          <p className="text-sm text-gray-500">Manage Forklifts, Pallet Jacks, and Loading Bays</p>
        </div>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-700">
          <Plus className="w-5 h-5 mr-2" /> Register Equipment
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500">Equipment tracking table will appear here.</p>
      </div>
    </div>
  );
}
