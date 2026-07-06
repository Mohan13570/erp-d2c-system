import React from 'react';
import { ArrowRightLeft, PenTool } from 'lucide-react';

export default function StockMovements() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Movements & Adjustments</h1>
          <p className="text-sm text-gray-500">Process Warehouse Transfers and Manual Stock Adjustments</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700">
            <ArrowRightLeft className="w-5 h-5 mr-2" /> New Transfer
          </button>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-700">
            <PenTool className="w-5 h-5 mr-2" /> Adjust Stock
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[500px] flex items-center justify-center">
        <p className="text-gray-500">Stock Transfer History and Adjustments Log will appear here.</p>
      </div>
    </div>
  );
}
