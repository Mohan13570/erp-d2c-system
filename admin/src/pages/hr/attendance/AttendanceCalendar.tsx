import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function AttendanceCalendar() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Mock statuses: P=Present, A=Absent, L=Late, W=Weekend
  const getStatus = (day: number) => {
     if (day % 7 === 0 || day % 7 === 6) return 'W';
     if (day === 12 || day === 15) return 'A';
     if (day === 4 || day === 18) return 'L';
     return 'P';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Attendance Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">View your monthly attendance history and apply for corrections.</p>
        </div>
        <div className="flex space-x-3 items-center">
           <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><ChevronLeft size={16}/></button>
           <span className="font-bold text-gray-900 mx-2">July 2026</span>
           <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><ChevronRight size={16}/></button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
         {/* Legends */}
         <div className="flex space-x-6 mb-8 border-b border-gray-100 pb-6">
            <div className="flex items-center text-sm"><div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div> Present</div>
            <div className="flex items-center text-sm"><div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div> Absent</div>
            <div className="flex items-center text-sm"><div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div> Late Arrival</div>
            <div className="flex items-center text-sm"><div className="w-3 h-3 rounded-full bg-gray-200 mr-2"></div> Weekend / Holiday</div>
         </div>

         {/* Calendar Grid */}
         <div className="grid grid-cols-7 gap-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
               <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase mb-2">{day}</div>
            ))}
            
            {/* Empty slots for start of month alignment (assuming July 2026 starts on Wed) */}
            <div className="h-24 rounded-xl border border-transparent"></div>
            <div className="h-24 rounded-xl border border-transparent"></div>
            
            {days.map(day => {
               const status = getStatus(day);
               let bgColor = 'bg-gray-50 border-gray-100';
               let icon = null;

               if (status === 'P') { bgColor = 'bg-green-50 border-green-200 hover:border-green-400'; icon = <CheckCircle2 size={16} className="text-green-500"/>; }
               if (status === 'A') { bgColor = 'bg-red-50 border-red-200 hover:border-red-400'; icon = <XCircle size={16} className="text-red-500"/>; }
               if (status === 'L') { bgColor = 'bg-yellow-50 border-yellow-200 hover:border-yellow-400'; icon = <AlertCircle size={16} className="text-yellow-600"/>; }
               if (status === 'W') { bgColor = 'bg-gray-100 border-gray-200 opacity-50'; }

               return (
                  <div key={day} className={`h-24 rounded-xl border p-2 flex flex-col justify-between transition cursor-pointer group ${bgColor}`}>
                     <div className="flex justify-between items-start">
                        <span className={`text-sm font-bold ${status === 'W' ? 'text-gray-400' : 'text-gray-900'}`}>{day}</span>
                        {icon}
                     </div>
                     {status !== 'W' && (
                        <div className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition">
                           {status === 'P' ? '09:00 - 18:00' : (status === 'L' ? '09:45 - 18:00' : 'No Data')}
                        </div>
                     )}
                  </div>
               );
            })}
         </div>
      </div>
    </div>
  );
}
