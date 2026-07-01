import React, { useState } from 'react';
import { ShieldCheck, Search, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export default function CustomsClearanceDesk() {
  const [declarations] = useState([
    { id: 'CUS-10293', awb: 'EK-920192', type: 'Export', status: 'Cleared', duty: 0, hsCode: '8517.12.00' },
    { id: 'CUS-55912', awb: 'QR-551021', type: 'Import', status: 'Pending', duty: 1250, hsCode: '6109.10.00' },
    { id: 'CUS-88192', awb: 'LH-110293', type: 'Import', status: 'Under Inspection', duty: 3400, hsCode: '9018.90.99' }
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <ShieldCheck className="mr-3 text-sky-600" size={32} /> Customs Clearance Desk
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage Import/Export declarations, duty calculations, and exams.</p>
        </div>
        <button className="bg-sky-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-sky-700 transition flex items-center">
          <FileText size={20} className="mr-2" /> File Declaration
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
            <input type="text" placeholder="Search by AWB, Dec No, or HS Code..." className="w-full pl-10 pr-4 py-2 border rounded-xl focus:border-sky-500 outline-none" />
          </div>
          <select className="border rounded-xl px-4 py-2 bg-white font-bold text-gray-700">
            <option>All Types</option>
            <option>Import</option>
            <option>Export</option>
          </select>
          <select className="border rounded-xl px-4 py-2 bg-white font-bold text-gray-700">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Cleared</option>
            <option>Inspection</option>
          </select>
        </div>
        
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white text-xs font-bold text-gray-400 uppercase tracking-wider border-b">
              <th className="p-4">Declaration #</th>
              <th className="p-4">AWB / Booking</th>
              <th className="p-4">HS Code</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-right">Est. Duty</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {declarations.map((d, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="p-4 font-black text-gray-900">{d.id}</td>
                <td className="p-4 font-bold text-sky-600">{d.awb}</td>
                <td className="p-4 font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block mt-3 ml-4">{d.hsCode}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${d.type === 'Import' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                    {d.type}
                  </span>
                </td>
                <td className="p-4 text-right font-black text-gray-900">
                  ${d.duty.toFixed(2)}
                </td>
                <td className="p-4">
                  <span className={`flex items-center text-xs font-bold ${
                    d.status === 'Cleared' ? 'text-emerald-600' : 
                    d.status === 'Under Inspection' ? 'text-amber-600' : 
                    'text-gray-500'
                  }`}>
                    {d.status === 'Cleared' && <CheckCircle size={14} className="mr-1"/>}
                    {d.status === 'Under Inspection' && <AlertTriangle size={14} className="mr-1"/>}
                    {d.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-sky-600 font-bold text-sm hover:underline">Review &rarr;</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
