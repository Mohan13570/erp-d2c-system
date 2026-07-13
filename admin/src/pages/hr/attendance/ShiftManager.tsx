import React from 'react';
import { Clock, Users, ArrowRightLeft } from 'lucide-react';

export default function ShiftManager() {
  const shifts = [
     { id: 1, name: 'Morning Shift', time: '06:00 AM - 02:00 PM', color: 'bg-orange-50 text-orange-600 border-orange-200', count: 420 },
     { id: 2, name: 'General Shift', time: '09:00 AM - 06:00 PM', color: 'bg-indigo-50 text-indigo-600 border-indigo-200', count: 350 },
     { id: 3, name: 'Night Shift', time: '10:00 PM - 06:00 AM', color: 'bg-purple-50 text-purple-600 border-purple-200', count: 180 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shift & Roster Management</h1>
          <p className="text-sm text-gray-500 mt-1">Assign operating shifts to warehouses, ports, and corporate teams.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">Create Shift Profile</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {shifts.map(shift => (
            <div key={shift.id} className={`p-6 rounded-2xl border ${shift.color} relative overflow-hidden shadow-sm`}>
               <div className="absolute -right-6 -top-6 opacity-10">
                  <Clock size={100} />
               </div>
               <h3 className="text-lg font-bold mb-1 relative z-10">{shift.name}</h3>
               <p className="text-sm font-medium opacity-80 mb-6 relative z-10">{shift.time}</p>
               <div className="flex justify-between items-center relative z-10 bg-white/50 backdrop-blur-sm p-3 rounded-xl border border-white/40">
                  <div className="flex items-center text-sm font-bold"><Users size={16} className="mr-2"/> {shift.count} Emp</div>
                  <button className="text-xs font-bold px-3 py-1 bg-white rounded-lg shadow-sm hover:shadow">Manage</button>
               </div>
            </div>
         ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-8">
         <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-900 flex items-center"><ArrowRightLeft className="mr-2 text-indigo-600" size={20}/> Shift Rotation Requests</h2>
         </div>
         <div className="divide-y divide-gray-100">
            {[1, 2, 3].map(i => (
               <div key={i} className="p-5 flex justify-between items-center hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                     <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm">MC</div>
                     <div>
                        <p className="font-bold text-sm text-gray-900">Michael Chang</p>
                        <p className="text-xs text-gray-500 mt-0.5">Warehouse Operations</p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                     <span className="text-xs font-bold text-orange-600">Night Shift</span>
                     <ArrowRightLeft size={14} className="text-gray-400"/>
                     <span className="text-xs font-bold text-indigo-600">General Shift</span>
                  </div>
                  <div className="flex space-x-2">
                     <button className="px-4 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200 hover:bg-green-100">Approve</button>
                     <button className="px-4 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-200 hover:bg-red-100">Reject</button>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
