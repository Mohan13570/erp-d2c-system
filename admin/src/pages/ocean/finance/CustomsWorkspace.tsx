import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Search, FileSignature } from 'lucide-react';

export default function CustomsWorkspace() {
  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/ocean/customs/declarations')
      .then(res => res.json())
      .then(data => {
        setDeclarations(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="text-indigo-600" /> Customs Clearance Gateway
          </h1>
          <p className="text-gray-500 mt-1">Manage Bills of Entry, HS Codes, Duties, and legal clearance.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-indigo-700 transition">
          <Plus size={18} />
          <span>File New Declaration</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center space-x-4">
           <div className="relative flex-1 max-w-md">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input type="text" placeholder="Search Bill of Entry or Booking Ref..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm font-semibold">
              <tr>
                <th className="p-4">Declaration ID</th>
                <th className="p-4">Booking Ref</th>
                <th className="p-4">Status</th>
                <th className="p-4">Port of Clearance</th>
                <th className="p-4">Total Duty</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading customs data...</td></tr>
              ) : declarations.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No customs declarations filed.</td></tr>
              ) : declarations.map((d: any) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-indigo-600">{d.billOfEntryNo || d.id.substring(0,8)}</td>
                  <td className="p-4 text-sm text-gray-600">{d.booking?.bookingNumber}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded text-xs font-semibold ${d.status === 'Cleared' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {d.status}
                     </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{d.portOfClearance?.name || 'Pending'}</td>
                  <td className="p-4 text-sm font-semibold text-gray-900">${d.totalDutyAmount.toFixed(2)}</td>
                  <td className="p-4 flex items-center space-x-2">
                     <button className="p-1.5 text-gray-400 hover:text-indigo-600 rounded bg-gray-100 hover:bg-indigo-50 transition" title="Examine">
                        <FileSignature size={16} />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
