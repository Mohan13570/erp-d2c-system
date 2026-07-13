import React from 'react';
import { BrainCircuit, Users, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

export default function WorkforcePlanning() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Workforce Planning</h1>
          <p className="text-sm text-gray-500 mt-1">Predict capacity shortages based on upcoming approved leaves and historical data.</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10"><BrainCircuit size={150} /></div>
         <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/30">
               <BrainCircuit size={14} className="mr-2"/> AI Analysis Complete
            </div>
            <h2 className="text-3xl font-extrabold mb-4">Critical Shortage Predicted in Warehouse Ops</h2>
            <p className="text-indigo-100 mb-6 text-sm leading-relaxed">
               Based on upcoming approved leaves for the week of July 20th, the Warehouse Operations department will operate at <strong>12% below required capacity</strong>. We recommend initiating Shift Swaps or approving Overtime for Backup Staff immediately to prevent supply chain bottlenecks.
            </p>
            <button className="px-5 py-2.5 bg-white text-indigo-900 text-sm font-bold rounded-xl hover:bg-gray-100 shadow-md">
               Review AI Action Plan
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center"><TrendingDown className="mr-2 text-red-500"/> Departments at Risk (Next 14 Days)</h3>
            <div className="space-y-5">
               {[
                  { dept: 'Warehouse Ops', required: 150, actual: 132, deficit: 18, risk: 'High' },
                  { dept: 'Fleet Drivers', required: 80, actual: 75, deficit: 5, risk: 'Medium' },
               ].map((d, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                     <div>
                        <p className="font-bold text-sm text-gray-900">{d.dept}</p>
                        <p className="text-xs text-gray-500 mt-1">Required: {d.required} • Available: {d.actual}</p>
                     </div>
                     <div className="text-right">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1 ${d.risk === 'High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                           {d.risk} Risk
                        </span>
                        <p className="text-sm font-extrabold text-red-600">-{d.deficit} Staff</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center"><Users className="mr-2 text-indigo-500"/> Backup Recommendations</h3>
            <div className="space-y-4">
               {[
                  { absent: 'Michael Chang (Leave)', backup: 'John Smith', match: '98%', crossTrained: true },
                  { absent: 'Sarah Jenkins (Leave)', backup: 'Emma Wilson', match: '92%', crossTrained: false },
               ].map((r, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                     <div>
                        <p className="text-xs font-bold text-red-500 mb-1">Covering for: {r.absent}</p>
                        <p className="text-sm font-bold text-gray-900">{r.backup}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{r.crossTrained ? 'Cross-trained in identical role.' : 'Similar skill profile.'}</p>
                     </div>
                     <div className="text-center">
                        <div className="text-lg font-extrabold text-green-600">{r.match}</div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">AI Match</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
