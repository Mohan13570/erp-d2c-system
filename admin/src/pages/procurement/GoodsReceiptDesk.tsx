import React, { useState, useEffect } from 'react';
import { Package, Search, ScanLine, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function GoodsReceiptDesk() {
  const [grns, setGrns] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/grn')
      .then(r => r.json())
      .then(data => setGrns(data))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Package className="mr-3 text-emerald-600" size={32} />
            Warehouse Receiving & GRN
          </h1>
          <p className="text-gray-500 mt-1">Scan, inspect, and receive goods against Purchase Orders.</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-emerald-700 transition">
          <ScanLine className="w-4 h-4 mr-2" /> Receive Goods
        </button>
      </div>

      <div className="bg-white rounded-2xl flex-1 border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Scan PO Barcode or type GRN Number..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl font-mono" />
          </div>
        </div>
        <div className="overflow-auto flex-1 p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">GRN Number</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">PO Reference</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Vendor</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Items Received</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">QC Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {grns.map((grn: any) => (
                <tr key={grn.id} className="hover:bg-emerald-50/30">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{grn.grnNumber}</p>
                    <p className="text-xs text-gray-500">{new Date(grn.receivedDate).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-600">{grn.purchaseOrder?.poNumber}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{grn.purchaseOrder?.vendor?.name}</td>
                  <td className="px-6 py-4 text-sm font-medium text-emerald-700">
                    {grn.items?.length || 0} Units Scanned
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <ShieldCheck size={12} className="mr-1" /> Inspected
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