import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Ship, Plane, Truck, Train, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ShipmentList() {
  const [shipments, setShipments] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/shipments').then(r => r.json()).then(setShipments).catch(console.error);
  }, []);

  const getIcon = (type: string) => {
    if (type === 'Air') return <Plane size={18} />;
    if (type === 'Road') return <Truck size={18} />;
    if (type === 'Rail') return <Train size={18} />;
    return <Ship size={18} />;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">All Shipments</h1>
          <p className="text-gray-500 font-medium mt-1">Manage and track your global logistics pipeline.</p>
        </div>
        <Link to="/shipments/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2">
          <Plus size={18} /><span>Create Shipment</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="text" placeholder="Search by tracking number, consignee, or origin..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none" />
          </div>
          <button className="px-4 py-2.5 text-gray-600 bg-gray-50 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-100">
            <Filter size={18}/> Filters
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold sticky top-0">
              <tr>
                <th className="px-6 py-4">Tracking Number</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {shipments.map(s => (
                <tr key={s.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-indigo-900">{s.trackingNumber}</td>
                  <td className="px-6 py-4">
                     {s.locations?.[0]?.address || 'Origin'} <span className="text-gray-400 mx-2">→</span> {s.locations?.[1]?.address || 'Destination'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                      {getIcon(s.freightType)} {s.freightType}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">{s.status}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{s.customer?.customerName || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <Link to={`/shipments/${s.id}`} className="text-indigo-600 hover:text-indigo-800 p-2 bg-indigo-50 rounded-lg inline-flex">
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
              {shipments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">No shipments found. Create one to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
