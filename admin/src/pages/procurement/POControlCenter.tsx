import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, ExternalLink, Printer } from 'lucide-react';

export default function POControlCenter() {
  const [pos, setPos] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/po')
      .then(r => r.json())
      .then(data => setPos(data))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="mr-3 text-indigo-600" size={32} />
            Purchase Order Control Center
          </h1>
          <p className="text-gray-500 mt-1">Manage vendor dispatch, blanket orders, and partial fulfillments.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition">
          <Plus className="w-4 h-4 mr-2" /> Create PO
        </button>
      </div>

      <div className="bg-white rounded-2xl flex-1 border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search PO Number, Vendor, or Status..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl" />
          </div>
        </div>
        <div className="overflow-auto flex-1 p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">PO Number</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Vendor</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Order Date</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Grand Total</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pos.map((po: any) => (
                <tr key={po.id} className="hover:bg-indigo-50/30">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{po.poNumber}</p>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded mt-1 inline-block">{po.type}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{po.vendor?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(po.orderDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">{po.currency} {po.grandTotal?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      po.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                      po.status === 'Partial_Receipt' ? 'bg-amber-100 text-amber-800' :
                      po.status === 'Closed' ? 'bg-gray-200 text-gray-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>{po.status.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 text-gray-400">
                      <button className="hover:text-indigo-600"><Printer size={18} /></button>
                      <button className="hover:text-indigo-600"><ExternalLink size={18} /></button>
                    </div>
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