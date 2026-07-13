import React from 'react';
import { Calendar, Users, AlertCircle, Plane, Briefcase, FileClock, ChevronRight } from 'lucide-react';

export default function LeaveDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave & Absence Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Global view of employee availability, pending approvals, and upcoming holidays.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-sm flex items-center">
             <Plane size={16} className="mr-2" /> Apply for Leave
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 rounded-xl bg-orange-50 text-orange-600"><Users size={24} /></div>
             <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">Today</span>
          </div>
          <p className="text-sm font-medium text-gray-500">Employees on Leave</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">42</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600"><FileClock size={24} /></div>
             <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">Action Req</span>
          </div>
          <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">15</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 rounded-xl bg-green-50 text-green-600"><Briefcase size={24} /></div>
          </div>
          <p className="text-sm font-medium text-gray-500">Available Workforce</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">94%</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 rounded-xl bg-red-50 text-red-600"><Calendar size={24} /></div>
             <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">Next: 4 Days</span>
          </div>
          <p className="text-sm font-medium text-gray-500">Upcoming Holiday</p>
          <p className="text-lg font-extrabold text-gray-900 mt-1 truncate">Independence Day</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
               <h2 className="font-bold text-gray-900">Department Availability (Live)</h2>
            </div>
            <div className="p-5">
               <div className="space-y-6">
                  {[
                     { dept: 'Warehouse Operations', total: 450, leave: 25, color: 'bg-indigo-500' },
                     { dept: 'Customs & Compliance', total: 120, leave: 5, color: 'bg-blue-500' },
                     { dept: 'Fleet Drivers', total: 320, leave: 10, color: 'bg-green-500' },
                     { dept: 'Finance & Accounts', total: 85, leave: 2, color: 'bg-orange-500' },
                  ].map((d, i) => (
                     <div key={i}>
                        <div className="flex justify-between text-sm mb-2">
                           <span className="font-bold text-gray-700">{d.dept}</span>
                           <span className="text-gray-500"><span className="font-bold text-gray-900">{d.total - d.leave}</span> / {d.total} Available</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                           <div className={`h-2.5 rounded-full ${d.color}`} style={{ width: `${((d.total - d.leave) / d.total) * 100}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
               <h2 className="font-bold text-gray-900 flex items-center"><AlertCircle className="mr-2 text-indigo-600" size={20}/> Urgent Approvals</h2>
            </div>
            <div className="divide-y divide-gray-100">
               {[
                  { emp: 'David Miller', type: 'Sick Leave', duration: '2 Days', date: 'Jul 14 - Jul 15' },
                  { emp: 'Sarah Jenkins', type: 'Casual Leave', duration: '1 Day', date: 'Jul 18' },
                  { emp: 'Michael Chang', type: 'Annual Leave', duration: '5 Days', date: 'Jul 20 - Jul 25' },
               ].map((req, i) => (
                  <div key={i} className="p-4 hover:bg-gray-50 transition cursor-pointer group">
                     <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-bold text-gray-900">{req.emp}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">{req.type}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{req.date} ({req.duration})</span>
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-indigo-600"/>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
