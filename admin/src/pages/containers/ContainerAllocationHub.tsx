import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle2, Lock } from 'lucide-react';

export default function ContainerAllocationHub() {
  const [allocations, setAllocations] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/containers/allocation')
      .then(res => res.json())
      .then(setAllocations)
      .catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <Layers className="mr-3 text-amber-500" size={32} /> Allocation Hub
          </h1>
          <p className="text-gray-500 font-medium mt-1">Assign containers to Bookings and Vehicles with Seal Numbers.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Container No</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Assigned To</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Seal No</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Allocated Date</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allocations.map(alloc => (
              <tr key={alloc.id} className="hover:bg-gray-50">
                <td className="p-4 text-sm font-black text-gray-900 font-mono">{alloc.container?.containerNo}</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">{alloc.allocationType}</span>
                  <div className="text-xs text-gray-500 font-medium mt-1">Ref: {alloc.referenceId}</div>
                </td>
                <td className="p-4">
                  {alloc.sealNumber ? (
                    <span className="flex items-center text-sm font-bold text-slate-700 font-mono"><Lock size={14} className="mr-1" /> {alloc.sealNumber}</span>
                  ) : (
                    <span className="text-xs italic text-gray-400">Unsealed</span>
                  )}
                </td>
                <td className="p-4 text-sm font-medium text-gray-500">
                  {new Date(alloc.allocatedAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <button className="text-rose-500 text-sm font-bold hover:underline flex items-center">
                    <CheckCircle2 size={16} className="mr-1" /> Release
                  </button>
                </td>
              </tr>
            ))}
            {allocations.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-medium">No active allocations.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
