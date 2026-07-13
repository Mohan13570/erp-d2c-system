import React from 'react';
import { UserCheck, UserX, Clock, Calendar, MapPin, AlertCircle, TrendingUp, Settings } from 'lucide-react';

export default function AttendanceDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workforce & Time Tracking</h1>
          <p className="text-sm text-gray-500 mt-1">Live overview of employee attendance, active shifts, and overtime.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-sm flex items-center">
             <Settings size={16} className="mr-2" /> Shift & Roster Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-green-50 text-green-600"><UserCheck size={24} /></div>
          <div><p className="text-sm font-medium text-gray-500">Present Today</p><p className="text-2xl font-bold text-gray-900">842</p></div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-red-50 text-red-600"><UserX size={24} /></div>
          <div><p className="text-sm font-medium text-gray-500">Absent / On Leave</p><p className="text-2xl font-bold text-gray-900">45</p></div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-yellow-50 text-yellow-600"><Clock size={24} /></div>
          <div><p className="text-sm font-medium text-gray-500">Late Arrivals</p><p className="text-2xl font-bold text-gray-900">12</p></div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><TrendingUp size={24} /></div>
          <div><p className="text-sm font-medium text-gray-500">Active Overtime (Hrs)</p><p className="text-2xl font-bold text-gray-900">124.5</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
               <h2 className="font-bold text-gray-900 flex items-center"><MapPin className="mr-2 text-indigo-600" size={20}/> Live Check-Ins (GPS Verified)</h2>
            </div>
            <div className="p-0">
               {/* Mock Map View */}
               <div className="h-[400px] w-full bg-blue-50/50 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  
                  {/* GeoFence Circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-indigo-300 bg-indigo-500/10"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center space-x-2 bg-white px-3 py-1.5 rounded-full shadow-md text-xs font-bold text-gray-700">
                     <Building2 size={14} className="text-indigo-600"/> <span>Global HQ (100m Radius)</span>
                  </div>

                  {/* Employees */}
                  <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_0_4px_rgba(34,197,94,0.2)]"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_0_4px_rgba(34,197,94,0.2)]"></div>
                  
                  {/* Outside Geofence Alert */}
                  <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_0_4px_rgba(239,68,68,0.2)] animate-pulse"></div>
                  <div className="absolute top-[22%] right-[22%] bg-white px-2 py-1 rounded shadow-lg text-[10px] font-bold text-red-600 flex items-center whitespace-nowrap">
                     <AlertCircle size={10} className="mr-1"/> Out of bounds
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
               <div className="p-5 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900 flex items-center"><AlertCircle className="mr-2 text-indigo-600" size={20}/> Action Required</h2>
               </div>
               <div className="divide-y divide-gray-100">
                  {[
                    { title: 'Missed Check-Out', desc: 'Sarah Jenkins (EMP-1046) missed check-out yesterday.', type: 'Correction' },
                    { title: 'Overtime Approval', desc: 'David Miller requested 3 hours overtime for weekend dispatch.', type: 'Overtime' },
                    { title: 'Shift Swap Request', desc: 'Michael Chang wants to swap Night Shift with John Smith.', type: 'Roster' },
                  ].map((alert, i) => (
                    <div key={i} className="p-4 hover:bg-gray-50 transition cursor-pointer">
                       <div className="flex justify-between mb-1">
                          <span className="text-sm font-bold text-gray-900">{alert.title}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase">{alert.type}</span>
                       </div>
                       <p className="text-xs text-gray-500">{alert.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
import { Building2 } from 'lucide-react';
