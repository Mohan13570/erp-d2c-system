import React from 'react';
import { Calendar, Anchor } from 'lucide-react';

export default function PortPlanning() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
           <Calendar size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Berth & Crane Planning</h1>
          <p className="text-gray-500 text-sm">Gantt scheduling for incoming vessels and crane allocation.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
         <Anchor size={48} className="mx-auto text-gray-300 mb-4" />
         <h2 className="text-lg font-medium text-gray-900">Advanced Planning Timeline</h2>
         <p className="text-gray-500 max-w-md mx-auto mt-2">The interactive Gantt chart module for Berth and Crane assignment is ready for DHTMLX or similar library integration. Database API is active.</p>
      </div>
    </div>
  );
}
