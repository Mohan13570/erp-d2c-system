import React from 'react';
import { FileBarChart, Download } from 'lucide-react';

export default function WarehouseReports() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-sm text-gray-500">Generate PDF/Excel extracts for Labour, Equipment, and Stock Ageing</p>
        </div>
        <button className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center hover:bg-slate-900">
          <Download className="w-5 h-5 mr-2" /> Export Bundle
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[500px] flex items-center justify-center">
        <p className="text-gray-500">Parameterized Report Builder interface will render here.</p>
      </div>
    </div>
  );
}
