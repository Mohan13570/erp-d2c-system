import React from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function OvertimeApprovals() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overtime Approvals</h1>
          <p className="text-sm text-gray-500 mt-1">Review and approve extra productive hours claimed by employees.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Employee</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Requested Hours</th>
                <th className="p-4">Reason</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                 { emp: 'David Miller', date: 'July 12, 2026', hours: '3.5 Hrs', reason: 'Weekend container dispatch backlog clearance at Port A.' },
                 { emp: 'Sarah Jenkins', date: 'July 11, 2026', hours: '2.0 Hrs', reason: 'Extended shift for emergency customs document filing.' },
                 { emp: 'John Smith', date: 'July 10, 2026', hours: '4.0 Hrs', reason: 'Quarterly warehouse inventory cycle count.' },
              ].map((ot, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-sm text-gray-900">{ot.emp}</td>
                  <td className="p-4 text-sm text-gray-600">{ot.date}</td>
                  <td className="p-4 text-center">
                     <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <Clock size={12} className="mr-1"/> {ot.hours}
                     </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500 max-w-xs truncate">{ot.reason}</td>
                  <td className="p-4 text-center">
                     <div className="flex justify-center space-x-2">
                        <button className="p-1.5 text-green-600 bg-green-50 rounded hover:bg-green-100 transition"><CheckCircle2 size={18}/></button>
                        <button className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100 transition"><XCircle size={18}/></button>
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
