import React from 'react';
import { QrCode, ScanLine } from 'lucide-react';

export default function Traceability() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Traceability & Serialization</h1>
          <p className="text-sm text-gray-500">Track Batches, Serial Numbers, Lot Expiries, and RFID data</p>
        </div>
        <button className="bg-violet-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-violet-700">
          <ScanLine className="w-5 h-5 mr-2" /> Scan Barcode
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-96 flex items-center justify-center">
        <p className="text-gray-500">Batch Expiry and Serial Tracking Lifecycle will render here.</p>
      </div>
    </div>
  );
}
