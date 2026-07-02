import React, { useState, useEffect } from 'react';
import { RefreshCcw, Search, Plus } from 'lucide-react';

export default function PurchaseReturns() {
  const [returns, setReturns] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/returns')
      .then(r => r.json())
      .then(data => setReturns(data))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <RefreshCcw className="mr-3 text-orange-600" size={32} />
            Purchase Returns (RTV)
          </h1>
          <p className="text-gray-500 mt-1">Manage Return to Vendor logistics, replacements, and credit notes.</p>
        </div>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-700 transition">
          <Plus className="w-4 h-4 mr-2" /> New Return
        </button>
      </div>

      <div className="bg-white rounded-2xl flex-1 border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search Return ID..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl" />
          </div>
        </div>
        <div className="overflow-auto flex-1 p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">RTV Number</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">PO Reference</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Reason</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Items</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {returns.map((ret: any) => (
                <tr key={ret.id} className="hover:bg-orange-50/30">
                  <td className="px-6 py-4 font-bold text-gray-900">{ret.returnNumber}</td>
                  <td className="px-6 py-4 font-mono text-gray-600">{ret.purchaseOrder?.poNumber}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{ret.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ret.items?.length || 0} items</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {ret.status}
                    </span>
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