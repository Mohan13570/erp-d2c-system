import React from 'react';
import { PackageOpen, Printer } from 'lucide-react';

export default function PackingStation() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Packing Station</h1>
          <p className="text-sm text-gray-500">Scan items, allocate packing materials, and generate shipping labels</p>
        </div>
        <button className="bg-violet-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-violet-700">
          <Printer className="w-5 h-5 mr-2" /> Print Box Label
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[500px] flex items-center justify-center">
        <p className="text-gray-500">Barcode Scanning Workspace and Box Validation will render here.</p>
      </div>
    </div>
  );
}
