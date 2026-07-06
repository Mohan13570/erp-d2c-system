import React from 'react';
import { Layers, Plus } from 'lucide-react';

export default function SpatialManager() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Spatial Hierarchy Manager</h1>
          <p className="text-sm text-gray-500">Configure Zones, Blocks, Aisles, Racks, and Bins</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700">
          <Plus className="w-5 h-5 mr-2" /> Add Zone
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500">Hierarchical layout tree will appear here.</p>
      </div>
    </div>
  );
}
