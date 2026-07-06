import React from 'react';
import { Truck, CheckSquare } from 'lucide-react';

export default function DispatchManager() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Loading & Dispatch</h1>
          <p className="text-sm text-gray-500">Assign boxes to trucks and capture Proof of Dispatch</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700">
          <CheckSquare className="w-5 h-5 mr-2" /> Confirm Dispatch
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[500px] flex items-center justify-center">
        <p className="text-gray-500">Load Planning Grid & Driver POD Capture Form will render here.</p>
      </div>
    </div>
  );
}
