import React from 'react';
import { PackageSearch, Filter } from 'lucide-react';

export default function StockControl() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Stock Control</h1>
          <p className="text-sm text-gray-500">Monitor Available, Reserved, Blocked, and Damaged Inventory</p>
        </div>
        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-50">
          <Filter className="w-5 h-5 mr-2" /> Filter Stock
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[500px] flex items-center justify-center">
        <p className="text-gray-500">Comprehensive Stock Ledger Data Table will render here.</p>
      </div>
    </div>
  );
}
