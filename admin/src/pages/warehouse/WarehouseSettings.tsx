import React from 'react';
import { Settings, Save } from 'lucide-react';

export default function WarehouseSettings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouse Rules & Settings</h1>
          <p className="text-sm text-gray-500">Configure FIFO/LIFO, Barcodes, and Stock Rules</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700">
          <Save className="w-5 h-5 mr-2" /> Save Config
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500">Form for picking/packing rules will appear here.</p>
      </div>
    </div>
  );
}
