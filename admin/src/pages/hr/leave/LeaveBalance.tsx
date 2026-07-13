import React from 'react';
import { History, FileText, ChevronRight } from 'lucide-react';

export default function LeaveBalance() {
  const balances = [
     { type: 'Casual Leave', total: 15, used: 2.5, remaining: 12.5, color: 'bg-blue-500', bg: 'bg-blue-50' },
     { type: 'Sick Leave', total: 10, used: 8, remaining: 2, color: 'bg-red-500', bg: 'bg-red-50' },
     { type: 'Earned Leave', total: 24, used: 0, remaining: 24, color: 'bg-green-500', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Leave Balances</h1>
          <p className="text-sm text-gray-500 mt-1">Track your accrued, used, and remaining time off for the year.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {balances.map((b, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
               <h3 className="text-lg font-bold text-gray-900 mb-1">{b.type}</h3>
               <p className="text-xs text-gray-500 mb-6">Valid until Dec 31, 2026</p>
               
               <div className="flex items-end space-x-2 mb-4">
                  <span className="text-4xl font-extrabold text-gray-900">{b.remaining}</span>
                  <span className="text-sm font-medium text-gray-500 mb-1">/ {b.total} Days Left</span>
               </div>

               <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className={`h-3 rounded-full ${b.color}`} style={{ width: `${(b.remaining / b.total) * 100}%` }}></div>
               </div>
            </div>
         ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-8">
         <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center"><History className="mr-2 text-indigo-600" size={20}/> Leave Ledger History</h2>
         </div>
         <div className="divide-y divide-gray-100">
            {[
               { date: 'Jun 10, 2026', desc: 'Sick Leave deduction for medical emergency', type: 'DEDUCTION', amt: '-2.0', label: 'Sick Leave' },
               { date: 'Jan 01, 2026', desc: 'Annual Accrual Credit', type: 'ACCRUAL', amt: '+15.0', label: 'Casual Leave' },
               { date: 'Jan 01, 2026', desc: 'Annual Accrual Credit', type: 'ACCRUAL', amt: '+10.0', label: 'Sick Leave' },
            ].map((log, i) => (
               <div key={i} className="p-5 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer">
                  <div className="flex items-center space-x-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center ${log.type === 'ACCRUAL' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        <FileText size={18} />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-gray-900">{log.desc}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{log.date} • {log.label}</p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-4">
                     <span className={`text-lg font-bold ${log.type === 'ACCRUAL' ? 'text-green-600' : 'text-red-600'}`}>{log.amt}</span>
                     <ChevronRight size={16} className="text-gray-300"/>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
