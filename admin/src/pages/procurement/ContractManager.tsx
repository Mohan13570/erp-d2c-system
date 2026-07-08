import React, { useState, useEffect } from 'react';
import { FileText, Search, Plus, Filter, AlertTriangle, Shield, CheckCircle } from 'lucide-react';

export default function ContractManager() {
  const [contracts, setContracts] = useState([]);
  
  useEffect(() => {
    fetch('/api/procurement/contracts')
      .then(r => r.json())
      .then(data => setContracts(data))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="mr-3 text-indigo-600" size={32} />
            Contract Lifecycle Manager
          </h1>
          <p className="text-gray-500 mt-1">Digital agreements, rate contracts, and compliance expiry tracking</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition">
          <Plus className="w-4 h-4 mr-2" /> New Contract
        </button>
      </div>

      <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search Contract ID or Vendor..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl" />
          </div>
        </div>
        <div className="overflow-auto flex-1 p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Contract ID</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Vendor</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Type</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Validity</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Value</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {contracts.length === 0 ? (
                 <tr><td colSpan={6} className="text-center py-8 text-gray-500">No active contracts found.</td></tr>
               ) : contracts.map((c: any) => (
                 <tr key={c.id} className="hover:bg-indigo-50/30">
                   <td className="px-6 py-4">
                     <p className="font-bold text-gray-900">{c.contractNo}</p>
                     <p className="text-sm text-gray-500">{c.title}</p>
                   </td>
                   <td className="px-6 py-4">
                     <span className="font-medium text-gray-800">{c.vendor?.name}</span>
                   </td>
                   <td className="px-6 py-4">
                     <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                       {c.type}
                     </span>
                   </td>
                   <td className="px-6 py-4 text-sm">
                      <p className="text-gray-900">{new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}</p>
                   </td>
                   <td className="px-6 py-4 font-mono font-medium text-gray-700">
                     {c.currency} {c.value?.toLocaleString() || 'N/A'}
                   </td>
                   <td className="px-6 py-4">
                      {c.status === 'Active' ? (
                        <span className="inline-flex items-center text-emerald-600 font-medium text-sm"><CheckCircle size={16} className="mr-1"/> Active</span>
                      ) : (
                        <span className="inline-flex items-center text-amber-600 font-medium text-sm"><AlertTriangle size={16} className="mr-1"/> Expiring</span>
                      )}
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