import React from 'react';
import { FileText, Download } from 'lucide-react';

export default function InventoryReports() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Reports</h1>
          <p className="text-sm text-gray-500">Valuation, Ageing, Expiry, and Movement Reporting</p>
        </div>
        <button className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-900">
          <Download className="w-5 h-5 mr-2" /> Export PDF
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[500px] flex items-center justify-center">
        <p className="text-gray-500">Interactive Reporting BI Widgets will appear here.</p>
      </div>
    </div>
  );
}
