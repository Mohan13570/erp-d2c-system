import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Search, FileText, CheckCircle2, XCircle } from 'lucide-react';

export default function InspectionDesk() {
  const [inspections, setInspections] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/maintenance/inspections')
      .then(res => res.json())
      .then(setInspections)
      .catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <ClipboardCheck className="mr-3 text-cyan-600" size={32} /> Safety & Inspections
          </h1>
          <p className="text-gray-500 font-medium mt-1">Review Pre-Trip, Post-Trip, and Routine Pre-Service inspection logs.</p>
        </div>
        <button className="px-4 py-2 bg-cyan-50 text-cyan-700 font-bold rounded-xl hover:bg-cyan-100 transition-colors">
          Export Log
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-bold text-gray-700 text-sm uppercase tracking-wider">Date</th>
              <th className="p-4 font-bold text-gray-700 text-sm uppercase tracking-wider">Vehicle</th>
              <th className="p-4 font-bold text-gray-700 text-sm uppercase tracking-wider">Type</th>
              <th className="p-4 font-bold text-gray-700 text-sm uppercase tracking-wider">Result</th>
              <th className="p-4 font-bold text-gray-700 text-sm uppercase tracking-wider">Notes / Checklist</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inspections.map(inspection => (
              <tr key={inspection.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm font-medium text-gray-500 whitespace-nowrap">
                  {new Date(inspection.timestamp).toLocaleString()}
                </td>
                <td className="p-4 font-bold text-gray-900">
                  {inspection.vehicle?.registrationNo}
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                    {inspection.type}
                  </span>
                </td>
                <td className="p-4">
                  {inspection.isPassed ? (
                    <span className="flex items-center text-emerald-600 text-sm font-bold">
                      <CheckCircle2 size={16} className="mr-1" /> Passed
                    </span>
                  ) : (
                    <span className="flex items-center text-rose-500 text-sm font-bold">
                      <XCircle size={16} className="mr-1" /> Failed
                    </span>
                  )}
                </td>
                <td className="p-4">
                  {inspection.checklistJson ? (
                    <button className="flex items-center text-cyan-600 font-bold text-sm hover:underline">
                      <FileText size={16} className="mr-1" /> View Checklist
                    </button>
                  ) : (
                    <span className="text-gray-500 text-sm italic">{inspection.notes || 'No notes'}</span>
                  )}
                </td>
              </tr>
            ))}
            {inspections.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400 font-medium">
                  No inspections recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
