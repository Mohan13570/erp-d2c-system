import React from 'react';
import { ListChecks, Layers } from 'lucide-react';

export default function PickPlanner() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pick List Planner</h1>
          <p className="text-sm text-gray-500">Algorithmic Wave, Zone, and Batch Pick Generation</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700">
          <Layers className="w-5 h-5 mr-2" /> Generate Wave Pick
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[500px] flex items-center justify-center">
        <p className="text-gray-500">Active Pick Lists & Assignment Board will render here.</p>
      </div>
    </div>
  );
}
