import React, { useState, useEffect } from 'react';
import { Plane, GripHorizontal, CheckCircle } from 'lucide-react';

export default function AircraftLoadPlan() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch('/api/air/load-planning/flight-stub-id').then(r => r.json()).then(setPlans).catch(()=>setPlans([]));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <Plane className="mr-3 text-sky-600" size={32} /> Aircraft Loading Plan
          </h1>
          <p className="text-gray-500 font-medium mt-1">Weight & Balance and deck positioning.</p>
        </div>
        <button className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center">
          <CheckCircle size={20} className="mr-2" /> Finalize LIR
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
         <div className="relative h-64 bg-gray-100 rounded-[100px] border-4 border-gray-300 flex items-center px-12 overflow-hidden shadow-inner">
           {/* Mock Aircraft Shape */}
           <div className="absolute inset-y-0 left-0 w-32 bg-gray-200 rounded-r-full opacity-50 border-r-4 border-white"></div>
           <div className="absolute inset-y-0 right-0 w-32 bg-gray-200 rounded-l-full opacity-50 border-l-4 border-white"></div>
           
           <div className="w-full flex justify-between z-10 gap-4">
             
             <div className="flex-1 bg-white/80 p-4 rounded-xl border border-gray-300 min-h-[150px] shadow text-center">
               <h3 className="font-black text-gray-400 mb-2">FWD HOLD</h3>
               <div className="bg-sky-100 border border-sky-300 text-sky-800 p-2 rounded shadow-sm text-sm font-bold flex items-center justify-center">
                 <GripHorizontal className="mr-2 opacity-50"/> AKE12345EK (3200kg)
               </div>
             </div>

             <div className="flex-1 bg-white/80 p-4 rounded-xl border border-gray-300 min-h-[150px] shadow text-center">
               <h3 className="font-black text-gray-400 mb-2">CENTER</h3>
               <div className="bg-sky-100 border border-sky-300 text-sky-800 p-2 rounded shadow-sm text-sm font-bold flex items-center justify-center">
                 <GripHorizontal className="mr-2 opacity-50"/> PMC98765EK (4500kg)
               </div>
             </div>

             <div className="flex-1 bg-white/80 p-4 rounded-xl border border-gray-300 min-h-[150px] shadow text-center">
               <h3 className="font-black text-gray-400 mb-2">AFT HOLD</h3>
               <p className="text-gray-400 text-xs italic mt-8">Empty</p>
             </div>

             <div className="flex-1 bg-white/80 p-4 rounded-xl border border-gray-300 min-h-[150px] shadow text-center">
               <h3 className="font-black text-gray-400 mb-2">BULK</h3>
               <p className="text-gray-400 text-xs italic mt-8">Empty</p>
             </div>

           </div>
         </div>

         <div className="mt-8 grid grid-cols-4 gap-6 text-center">
           <div>
             <div className="text-gray-500 font-bold text-sm">Total Weight</div>
             <div className="text-2xl font-black">7,700 kg</div>
           </div>
           <div>
             <div className="text-gray-500 font-bold text-sm">Max Payload</div>
             <div className="text-2xl font-black">25,000 kg</div>
           </div>
           <div>
             <div className="text-gray-500 font-bold text-sm">CG MAC%</div>
             <div className="text-2xl font-black text-emerald-600">24.5%</div>
           </div>
           <div>
             <div className="text-gray-500 font-bold text-sm">Status</div>
             <div className="text-2xl font-black text-emerald-600">Within Limits</div>
           </div>
         </div>
      </div>
    </div>
  );
}
