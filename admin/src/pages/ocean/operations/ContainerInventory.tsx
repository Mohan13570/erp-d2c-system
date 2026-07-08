import React, { useState, useEffect } from 'react';
import { Box, QrCode, PenTool, AlertCircle } from 'lucide-react';

export default function ContainerInventory() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ocean/assets')
      .then(res => res.json())
      .then(data => {
        setAssets(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Box className="text-indigo-600" /> Container Asset Inventory
          </h1>
          <p className="text-gray-500 mt-1">Manage physical steel containers, QR codes, and damages.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm font-semibold">
              <tr>
                <th className="p-4">Container No.</th>
                <th className="p-4">Type / Size</th>
                <th className="p-4">Status</th>
                <th className="p-4">Condition</th>
                <th className="p-4">Current Location</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading assets...</td></tr>
              ) : assets.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No container assets in fleet.</td></tr>
              ) : assets.map((a: any) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-900">{a.containerNumber}</td>
                  <td className="p-4 text-sm text-gray-600">{a.containerType?.name} {a.containerSize?.code}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded text-xs font-semibold ${a.status === 'Available' ? 'bg-green-100 text-green-800' : a.status === 'Stuffed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {a.status}
                     </span>
                  </td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded text-xs font-semibold flex w-max items-center gap-1 ${a.condition === 'Sound' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-800'}`}>
                        {a.condition !== 'Sound' && <AlertCircle size={12}/>} {a.condition}
                     </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                     {a.currentPort ? a.currentPort.name : 'Unknown'}
                  </td>
                  <td className="p-4 flex items-center space-x-2">
                     <button className="p-1.5 text-gray-400 hover:text-indigo-600 rounded bg-gray-100 hover:bg-indigo-50 transition" title="View QR Code">
                        <QrCode size={16} />
                     </button>
                     <button className="p-1.5 text-gray-400 hover:text-orange-600 rounded bg-gray-100 hover:bg-orange-50 transition" title="Log Repair">
                        <PenTool size={16} />
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
