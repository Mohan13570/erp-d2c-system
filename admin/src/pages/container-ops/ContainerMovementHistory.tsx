import React from 'react';
import { History, Search } from 'lucide-react';

export default function ContainerMovementHistory() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <History className="mr-3 text-violet-600" size={32} /> Movement History
          </h1>
          <p className="text-gray-500 font-medium mt-1">Aggregated timeline of Yard, Ops, Cargo, and Port Terminal movements.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search ISO Number..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none w-64 uppercase font-mono font-bold"
          />
        </div>
      </div>

      <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm">
        <History size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-bold text-gray-900">Enter a Container Number</h3>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Scan or type an ISO 6346 container number to retrieve its entire movement and operation history across the global network.
        </p>
      </div>
    </div>
  );
}
