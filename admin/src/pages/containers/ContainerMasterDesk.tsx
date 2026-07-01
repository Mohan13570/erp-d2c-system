import React, { useState, useEffect } from 'react';
import { Box, Search, Plus, Download, Filter } from 'lucide-react';

export default function ContainerMasterDesk() {
  const [containers, setContainers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/containers/master')
      .then(res => res.json())
      .then(setContainers)
      .catch(console.error);
  }, []);

  const handleAddDemoContainer = async () => {
    setErrorMsg('');
    const res = await fetch('/api/containers/master', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        containerNo: 'CSQU3054383', // valid ISO 6346
        type: '40HC',
        maxGrossWeight: 32500,
        tareWeight: 3900,
        payloadCapacity: 28600,
        volume: 76.4
      })
    });
    const data = await res.json();
    if (res.ok) {
      setContainers([data, ...containers]);
    } else {
      setErrorMsg(data.error);
    }
  };

  const filtered = containers.filter(c => c.containerNo.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <Box className="mr-3 text-blue-600" size={32} /> Container Master
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage physical container assets with ISO 6346 validation.</p>
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search container..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={handleAddDemoContainer} className="flex items-center px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            <Plus size={18} className="mr-2" /> Register Container
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 font-bold">
          Error: {errorMsg}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Container No</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Type / Ownership</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Payload (KG)</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Status</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(container => (
              <tr key={container.id} className="hover:bg-gray-50">
                <td className="p-4 text-sm font-black text-gray-900 font-mono tracking-wider">{container.containerNo}</td>
                <td className="p-4">
                  <div className="font-bold text-gray-900">{container.type}</div>
                  <div className="text-xs text-gray-500 font-medium">{container.ownershipType}</div>
                </td>
                <td className="p-4 text-sm font-bold text-gray-700">{container.payloadCapacity.toLocaleString()} kg</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">{container.status}</span>
                </td>
                <td className="p-4">
                  <button className="text-blue-600 text-sm font-bold hover:underline">View Details</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-medium">No containers registered.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
