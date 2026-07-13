import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, DownloadCloud, AlertCircle } from 'lucide-react';

export default function LeaveCalendar() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Leave & Holiday Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">View official public holidays and team unavailability.</p>
        </div>
        <div className="flex space-x-3 items-center">
           <button className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center">
             <DownloadCloud size={16} className="mr-2" /> Export to Outlook/Google
           </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="flex space-x-4">
               <div className="flex items-center text-sm font-medium text-gray-700"><div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div> National Holiday</div>
               <div className="flex items-center text-sm font-medium text-gray-700"><div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div> Approved Leave</div>
               <div className="flex items-center text-sm font-medium text-gray-700"><div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div> Pending Request</div>
            </div>
            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
               <button className="p-1.5 hover:bg-gray-50 rounded"><ChevronLeft size={18} className="text-gray-600"/></button>
               <span className="px-4 font-bold text-gray-800">July 2026</span>
               <button className="p-1.5 hover:bg-gray-50 rounded"><ChevronRight size={18} className="text-gray-600"/></button>
            </div>
         </div>

         <div className="p-6">
            <div className="grid grid-cols-7 gap-4">
               {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                  <div key={d} className="text-center font-bold text-xs uppercase text-gray-400 mb-2">{d}</div>
               ))}
               
               <div className="h-32 border border-transparent"></div>
               <div className="h-32 border border-transparent"></div>

               {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                  const isHoliday = day === 4;
                  const isLeave = day >= 14 && day <= 16;
                  
                  return (
                     <div key={day} className={`h-32 border rounded-xl p-2 flex flex-col transition ${isHoliday ? 'bg-red-50 border-red-200' : 'bg-white hover:border-indigo-300'}`}>
                        <span className={`text-sm font-bold ${isHoliday ? 'text-red-700' : 'text-gray-700'}`}>{day}</span>
                        
                        <div className="mt-auto space-y-1">
                           {isHoliday && (
                              <div className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded truncate">
                                 Independence Day
                              </div>
                           )}
                           {isLeave && (
                              <div className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded truncate">
                                 Sarah J. (Sick)
                              </div>
                           )}
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
      </div>
    </div>
  );
}
