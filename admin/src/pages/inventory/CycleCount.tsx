import React from 'react';
import { ClipboardList, CheckCircle } from 'lucide-react';

export default function CycleCount() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cycle Counting & Audits</h1>
          <p className="text-sm text-gray-500">Manage physical counting workflows and inventory reconciliation</p>
        </div>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-teal-700">
          <ClipboardList className="w-5 h-5 mr-2" /> Schedule Count
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[500px] flex items-center justify-center">
        <p className="text-gray-500">Active Cycle Count tasks and Variance Reports will appear here.</p>
      </div>
    </div>
  );
}
