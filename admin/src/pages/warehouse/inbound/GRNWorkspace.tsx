import React from 'react';
import { ClipboardCheck, ScanLine } from 'lucide-react';

export default function GRNWorkspace() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GRN & Quality Inspection</h1>
          <p className="text-sm text-gray-500">Receive goods, scan barcodes, and perform QA checks</p>
        </div>
        <button className="bg-violet-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-violet-700">
          <ScanLine className="w-5 h-5 mr-2" /> Start Scan
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[500px] flex items-center justify-center">
        <p className="text-gray-500">GRN receiving grid with QA checklist will appear here.</p>
      </div>
    </div>
  );
}
