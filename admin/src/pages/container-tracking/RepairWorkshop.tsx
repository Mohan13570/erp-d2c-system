import React, { useState, useEffect } from 'react';
import { Wrench, CheckCircle2, Clock } from 'lucide-react';

export default function RepairWorkshop() {
  const [repairs, setRepairs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/container-tracking/repair')
      .then(res => res.json())
      .then(setRepairs)
      .catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <Wrench className="mr-3 text-orange-600" size={32} /> Repair Workshop
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage container damage reports, workshop assignments, and repair costs.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Container No</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Damage Description</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Workshop</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Est. Cost</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {repairs.map(repair => (
              <tr key={repair.id} className="hover:bg-gray-50">
                <td className="p-4 text-sm font-black text-gray-900 font-mono tracking-wider">{repair.container?.containerNo}</td>
                <td className="p-4 text-sm font-medium text-gray-700">{repair.damageDescription}</td>
                <td className="p-4 text-sm font-bold text-gray-500">{repair.workshopName || 'Unassigned'}</td>
                <td className="p-4 text-sm font-bold text-gray-900">{repair.estimatedCost ? `$${repair.estimatedCost}` : 'Pending'}</td>
                <td className="p-4">
                  {repair.repairStatus === 'Completed' ? (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center inline-flex">
                      <CheckCircle2 size={12} className="mr-1" /> Completed
                    </span>
                  ) : repair.repairStatus === 'InProgress' ? (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center inline-flex">
                      <Clock size={12} className="mr-1" /> In Progress
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">Requested</span>
                  )}
                </td>
              </tr>
            ))}
            {repairs.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-medium">No active repair requests.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
