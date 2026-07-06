import React from 'react';
import { Calendar, Plus } from 'lucide-react';

export default function ASNManager() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ASN & Dock Scheduling</h1>
          <p className="text-sm text-gray-500">Manage Advance Shipment Notices and assign Loading Bays</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700">
          <Plus className="w-5 h-5 mr-2" /> Create ASN
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[500px] flex items-center justify-center">
        <p className="text-gray-500">Dock Calendar and ASN list will render here.</p>
      </div>
    </div>
  );
}
