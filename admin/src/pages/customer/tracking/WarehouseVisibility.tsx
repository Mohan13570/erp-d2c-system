import React from 'react';
import { Box, Layers, Archive, Search, Filter } from 'lucide-react';

const mockInventory = [
  { sku: 'ITEM-101', name: 'Industrial Motors', qty: 45, status: 'Received', location: 'Rack A-12', date: 'Oct 24, 2026' },
  { sku: 'ITEM-102', name: 'Steel Bearings', qty: 1200, status: 'Inspected', location: 'Rack B-04', date: 'Oct 23, 2026' },
  { sku: 'ITEM-103', name: 'Control Panels', qty: 15, status: 'Dispatch Ready', location: 'Staging Area 2', date: 'Oct 25, 2026' },
];

export default function WarehouseVisibility() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouse & Inventory Visibility</h1>
          <p className="text-sm text-gray-500 mt-1">Live overview of your assets currently stored in our logistics facilities.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
           <div className="flex items-center space-x-3 mb-4">
              <Box className="text-indigo-200" />
              <h3 className="font-bold text-lg">Total Items</h3>
           </div>
           <p className="text-4xl font-extrabold">1,260</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
           <div className="flex items-center space-x-3 mb-4">
              <Layers className="text-blue-500" />
              <h3 className="font-bold text-lg text-gray-700">Pallet Spots Used</h3>
           </div>
           <p className="text-4xl font-extrabold text-gray-900">24 / <span className="text-2xl text-gray-400">50</span></p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
           <div className="flex items-center space-x-3 mb-4">
              <Archive className="text-green-500" />
              <h3 className="font-bold text-lg text-gray-700">Ready for Dispatch</h3>
           </div>
           <p className="text-4xl font-extrabold text-gray-900">15</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search SKU or Name..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 w-64" />
            </div>
          </div>
          <button className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700">
            <Filter size={16} /><span>Filter Status</span>
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="p-4">SKU / Item</th>
              <th className="p-4">Quantity</th>
              <th className="p-4">Status</th>
              <th className="p-4">Warehouse Location</th>
              <th className="p-4">Received Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockInventory.map((inv, idx) => (
              <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                <td className="p-4">
                  <span className="font-bold text-gray-900 block">{inv.sku}</span>
                  <span className="text-sm text-gray-500">{inv.name}</span>
                </td>
                <td className="p-4 text-sm font-bold text-gray-700">{inv.qty}</td>
                <td className="p-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                     inv.status === 'Dispatch Ready' ? 'bg-green-100 text-green-700' :
                     inv.status === 'Inspected' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>{inv.status}</span>
                </td>
                <td className="p-4 text-sm text-gray-600 font-medium">
                  {inv.location}
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {inv.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
