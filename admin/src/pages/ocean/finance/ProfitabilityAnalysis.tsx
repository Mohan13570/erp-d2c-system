import React, { useState } from 'react';
import { Briefcase, Search, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export default function ProfitabilityAnalysis() {
  const [bookingId, setBookingId] = useState('');
  const [result, setResult] = useState<any>(null);

  const analyze = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/ocean/finance/profitability/${bookingId}`);
      if (res.ok) {
         setResult(await res.json());
      }
    } catch (e) {
      alert("Analysis failed.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
           <Briefcase size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profitability & Margin Analysis</h1>
          <p className="text-gray-500 text-sm">Calculate absolute net margin per ocean booking (Revenue vs Cost).</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
         <div className="flex items-center space-x-4">
            <input type="text" className="flex-1 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" 
                   placeholder="Enter Booking UUID..." value={bookingId} onChange={e => setBookingId(e.target.value)} />
            <button onClick={analyze} className="bg-indigo-600 text-white px-6 py-2 rounded-xl flex items-center space-x-2">
               <Search size={18}/> <span>Analyze Margin</span>
            </button>
         </div>

         {result && (
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100 animate-in fade-in">
               <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-center">
                  <div className="flex justify-center mb-2 text-emerald-600"><ArrowUpRight size={24}/></div>
                  <div className="text-sm font-medium text-emerald-800">Total Revenue (AR)</div>
                  <div className="text-2xl font-bold text-emerald-900 mt-1">${result.revenue.toFixed(2)}</div>
               </div>
               <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 text-center">
                  <div className="flex justify-center mb-2 text-rose-600"><ArrowDownRight size={24}/></div>
                  <div className="text-sm font-medium text-rose-800">Total Costs (AP)</div>
                  <div className="text-2xl font-bold text-rose-900 mt-1">${result.cost.toFixed(2)}</div>
               </div>
               <div className={`p-6 rounded-2xl border text-center ${result.margin > 0 ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'}`}>
                  <div className={`flex justify-center mb-2 ${result.margin > 0 ? 'text-blue-600' : 'text-red-600'}`}><Activity size={24}/></div>
                  <div className={`text-sm font-medium ${result.margin > 0 ? 'text-blue-800' : 'text-red-800'}`}>Net Margin</div>
                  <div className={`text-2xl font-bold mt-1 ${result.margin > 0 ? 'text-blue-900' : 'text-red-900'}`}>
                     ${result.margin.toFixed(2)} ({result.marginPercentage.toFixed(1)}%)
                  </div>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}
