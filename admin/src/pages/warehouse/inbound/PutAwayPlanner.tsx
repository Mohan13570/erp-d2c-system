import React from 'react';
import { ArrowDownToLine, MapPin } from 'lucide-react';

export default function PutAwayPlanner() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Put-Away Planner</h1>
          <p className="text-sm text-gray-500">Algorithmically assign bins and direct forklift routing</p>
        </div>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-700">
          <MapPin className="w-5 h-5 mr-2" /> Auto-Allocate Bins
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[500px] flex items-center justify-center">
        <p className="text-gray-500">Put-Away task list mapping Items to Zones/Racks/Bins will appear here.</p>
      </div>
    </div>
  );
}
