import React from 'react';
import { Calendar, FileBarChart, DownloadCloud } from 'lucide-react';

export default function Timesheets() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly Timesheets</h1>
          <p className="text-sm text-gray-500 mt-1">Aggregated work hours for payroll processing.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 shadow-sm flex items-center">
           <DownloadCloud size={16} className="mr-2"/> Export Payroll CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
           <div className="flex items-center space-x-2 text-sm font-bold text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
              <Calendar size={16} className="text-indigo-600"/> <span>July 2026</span>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Employee</th>
                <th className="p-4 text-center">Present Days</th>
                <th className="p-4 text-center">Absent Days</th>
                <th className="p-4 text-center">Regular Hours</th>
                <th className="p-4 text-center">Overtime Hours</th>
                <th className="p-4 text-center">Total Paid Hours</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                 { emp: 'John Smith', p: 21, a: 1, rh: 168, ot: 12 },
                 { emp: 'Sarah Jenkins', p: 22, a: 0, rh: 176, ot: 4.5 },
                 { emp: 'Michael Chang', p: 18, a: 4, rh: 144, ot: 0 },
              ].map((ts, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-sm text-gray-900">{ts.emp}</td>
                  <td className="p-4 text-center text-sm font-medium text-gray-700">{ts.p}</td>
                  <td className="p-4 text-center text-sm font-medium text-red-600">{ts.a}</td>
                  <td className="p-4 text-center text-sm font-medium text-gray-700">{ts.rh}h</td>
                  <td className="p-4 text-center text-sm font-bold text-indigo-600">{ts.ot}h</td>
                  <td className="p-4 text-center text-sm font-bold text-green-600">{ts.rh + ts.ot}h</td>
                  <td className="p-4 text-center">
                     <button className="text-xs font-bold text-indigo-600 hover:underline flex items-center justify-center w-full">
                        <FileBarChart size={14} className="mr-1"/> Details
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
