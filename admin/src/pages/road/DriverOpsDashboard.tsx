import React from 'react';
import { Users, Clock, ShieldAlert, Activity } from 'lucide-react';

export default function DriverOpsDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 flex items-center">
          <Users className="mr-3 text-sky-600" size={32} /> Driver Operations & Compliance
        </h1>
        <p className="text-gray-500 font-medium mt-1">Monitor shifts, duty hours, fatigue limits, and violations.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-400 mb-1">Active Shifts</p>
          <p className="text-3xl font-black text-sky-600">42</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-400 mb-1">Fatigue Warnings</p>
          <p className="text-3xl font-black text-rose-600">3</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Clock className="mr-2 text-sky-500" size={20} /> Duty Hours Monitor
        </h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="pb-3">Driver</th>
              <th className="pb-3">Shift Started</th>
              <th className="pb-3">Driving Hours</th>
              <th className="pb-3">Break Hours</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr>
              <td className="py-4 font-bold text-gray-900">John Doe (L-9281)</td>
              <td className="py-4 text-sm text-gray-500">Today, 06:00 AM</td>
              <td className="py-4 font-bold text-sky-600">4.5 hrs</td>
              <td className="py-4 text-sm">0.5 hrs</td>
              <td className="py-4"><span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded">Compliant</span></td>
            </tr>
            <tr>
              <td className="py-4 font-bold text-gray-900">Alex Smith (L-4412)</td>
              <td className="py-4 text-sm text-gray-500">Today, 04:30 AM</td>
              <td className="py-4 font-bold text-rose-600">7.5 hrs</td>
              <td className="py-4 text-sm">0.5 hrs</td>
              <td className="py-4"><span className="px-2 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded">Fatigue Warning</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
