import React from 'react';
import { Users, AlertTriangle, ShieldCheck, Activity, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DriverDashboard() {
  const stats = { active: 0, onLeave: 0, expiredDocs: 0, suspended: 0 };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Driver & HR Command</h1>
          <p className="text-gray-500 font-medium mt-1">Manage workforce availability, compliance, and safety ratings.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/drivers/list" className="px-5 py-2.5 font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">View Roster</Link>
          <Link to="/drivers/register" className="px-5 py-2.5 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 flex items-center gap-2">
            <Users size={18} /> Onboard Driver
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div><p className="text-sm font-bold text-gray-400 uppercase">Active Drivers</p><h3 className="text-3xl font-black text-gray-900 mt-1">{stats.active}</h3></div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center"><CheckCircle2 size={24}/></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div><p className="text-sm font-bold text-gray-400 uppercase">On Leave</p><h3 className="text-3xl font-black text-blue-600 mt-1">{stats.onLeave}</h3></div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><Activity size={24}/></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div><p className="text-sm font-bold text-red-500 uppercase">Expired Docs</p><h3 className="text-3xl font-black text-red-600 mt-1">{stats.expiredDocs}</h3></div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center"><AlertTriangle size={24}/></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div><p className="text-sm font-bold text-gray-400 uppercase">Safety Rating</p><h3 className="text-3xl font-black text-emerald-600 mt-1">4.8/5</h3></div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center"><ShieldCheck size={24}/></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         <div className="col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm min-h-[400px]">
             <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Violations & Penalties</h2>
             <table className="w-full text-left">
                <thead className="text-gray-400 text-xs uppercase font-bold border-b border-gray-100">
                   <tr>
                      <th className="pb-3">Driver</th>
                      <th className="pb-3">Violation</th>
                      <th className="pb-3">Penalty</th>
                      <th className="pb-3">Date</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   <tr>
                      <td className="py-4 font-bold text-gray-900">John Doe</td>
                      <td className="py-4 text-orange-600 font-bold">Harsh Braking</td>
                      <td className="py-4 text-gray-500">Warning</td>
                      <td className="py-4 text-gray-500">Today, 10:30 AM</td>
                   </tr>
                   <tr>
                      <td className="py-4 font-bold text-gray-900">Michael Smith</td>
                      <td className="py-4 text-red-600 font-bold">Overspeeding</td>
                      <td className="py-4 text-red-600 font-bold">-$0.00</td>
                      <td className="py-4 text-gray-500">Yesterday</td>
                   </tr>
                </tbody>
             </table>
         </div>
         <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><FileText size={20}/> Action Required</h3>
            <div className="space-y-4">
               <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                  <div className="flex justify-between items-center mb-1">
                     <span className="font-bold text-red-400">License Expiring</span>
                     <span className="text-xs text-slate-400">2 Days</span>
                  </div>
                  <p className="text-sm text-slate-300">Driver David Miller's commercial license is expiring.</p>
               </div>
               <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                  <div className="flex justify-between items-center mb-1">
                     <span className="font-bold text-orange-400">Medical Pending</span>
                     <span className="text-xs text-slate-400">Next Week</span>
                  </div>
                  <p className="text-sm text-slate-300">Sarah Jenkins needs to submit her annual medical fitness certificate.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
