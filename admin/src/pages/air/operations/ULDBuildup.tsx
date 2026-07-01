import React, { useState, useEffect } from 'react';
import { Box, Layers, ArrowDown, Plus } from 'lucide-react';

export default function ULDBuildup() {
  const [ulds, setUlds] = useState([]);

  useEffect(() => {
    fetch('/api/air/uld').then(r => r.json()).then(setUlds);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <Layers className="mr-3 text-sky-600" size={32} /> ULD Build-up Area
          </h1>
          <p className="text-gray-500 font-medium mt-1">Stuffing and packing cargo into Unit Load Devices.</p>
        </div>
        <button className="bg-sky-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-sky-700 transition flex items-center">
          <Plus size={20} className="mr-2" /> Create Manifest
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[600px] overflow-y-auto">
          <h2 className="font-bold text-gray-900 border-b pb-2 mb-4">Pending Cargo (Warehouse)</h2>
          <div className="space-y-3">
             {/* Mock loose cargo items waiting to be stuffed */}
             <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-move hover:border-sky-400">
               <div className="font-bold text-gray-800">1450.0 kg • 2.5 cbm</div>
               <div className="text-xs text-gray-500 mt-1">Electronic Parts (DGR)</div>
             </div>
             <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-move hover:border-sky-400">
               <div className="font-bold text-gray-800">500.0 kg • 1.2 cbm</div>
               <div className="text-xs text-gray-500 mt-1">Garments</div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {ulds.map((uld: any) => (
             <div key={uld.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <div className="flex justify-between items-center mb-4 border-b pb-2">
                 <div>
                   <h3 className="text-xl font-bold text-gray-900 flex items-center">
                     <Box className="mr-2 text-sky-600" size={24}/> {uld.uldNumber}
                   </h3>
                   <div className="text-sm text-gray-500">{uld.uldType?.iataCode} Container</div>
                 </div>
                 <div className="text-right">
                   <div className="font-black text-emerald-600 text-xl">{uld.netWeight} kg</div>
                   <div className="text-xs font-bold text-gray-400 text-right">Net Weight</div>
                 </div>
               </div>
               
               <div className="min-h-[120px] bg-sky-50/50 border-2 border-dashed border-sky-200 rounded-xl flex items-center justify-center p-4">
                 {uld.items?.length > 0 ? (
                   <div className="w-full space-y-2">
                     {uld.items.map((item: any) => (
                       <div key={item.id} className="bg-white p-2 rounded shadow-sm text-sm font-medium flex justify-between">
                         <span>{item.description}</span>
                         <span className="text-sky-600">{item.grossWeight} kg</span>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-center text-sky-400">
                     <ArrowDown size={32} className="mx-auto mb-2 opacity-50" />
                     <p className="font-bold">Drag loose cargo here to stuff ULD</p>
                   </div>
                 )}
               </div>
               
               <div className="mt-4 flex justify-end gap-3">
                 <button className="px-4 py-2 bg-gray-100 rounded-lg font-bold text-gray-600 text-sm">Print Manifest</button>
                 <button className="px-4 py-2 bg-emerald-600 rounded-lg font-bold text-white text-sm">Close ULD (Add Tare)</button>
               </div>
             </div>
          ))}
          {ulds.length === 0 && <div className="text-center p-12 text-gray-400 font-bold">No Active ULDs</div>}
        </div>
      </div>
    </div>
  );
}
