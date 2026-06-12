import React, { useState } from 'react';
import { MapPin, Navigation, Camera, CheckCircle2 } from 'lucide-react';

export default function DriverApp() {
  const [status, setStatus] = useState('In Transit');

  return (
    <div className="h-screen w-full bg-gray-900 text-white flex flex-col font-sans sm:hidden">
      {/* Mobile-only view enforcement using Tailwind 'sm:hidden' above means it will look like a full app on mobile screens */}
      <div className="p-6 bg-gray-800 shadow-md">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Active Trip • TRP-9021</p>
        <h1 className="text-2xl font-black">NY to Boston</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
        {/* Simulated Map Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #4F46E5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="relative bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-xl">
          <div className="flex justify-between items-center mb-6">
             <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">{status}</span>
             <span className="text-gray-400 text-sm">ETA: 45m</span>
          </div>

          <div className="relative pl-6 border-l-2 border-gray-700 space-y-8">
             <div className="relative">
               <div className="absolute -left-[31px] bg-emerald-500 rounded-full p-1"><CheckCircle2 size={14} className="text-white"/></div>
               <p className="text-sm text-gray-400">Pickup</p>
               <p className="font-bold text-lg">Brooklyn Warehouse</p>
             </div>
             <div className="relative">
               <div className="absolute -left-[31px] bg-indigo-500 rounded-full p-1 animate-pulse"><Navigation size={14} className="text-white"/></div>
               <p className="text-sm text-gray-400">Current Location</p>
               <p className="font-bold text-lg text-indigo-400">I-95 Northbound</p>
             </div>
             <div className="relative">
               <div className="absolute -left-[27px] w-3 h-3 bg-gray-700 rounded-full"></div>
               <p className="text-sm text-gray-400">Destination</p>
               <p className="font-bold text-lg">Boston Distribution Center</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 relative">
          <button className="bg-gray-800 hover:bg-gray-700 p-4 rounded-2xl border border-gray-700 flex flex-col items-center justify-center space-y-2 transition-colors">
             <MapPin className="text-indigo-400" />
             <span className="text-sm font-bold">Update GPS</span>
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 p-4 rounded-2xl border border-gray-700 flex flex-col items-center justify-center space-y-2 transition-colors">
             <Camera className="text-orange-400" />
             <span className="text-sm font-bold">Upload POD</span>
          </button>
        </div>
      </div>

      <div className="p-6 bg-gray-800 border-t border-gray-700">
         <button onClick={() => setStatus('Delivered')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg py-4 rounded-2xl shadow-lg transition-colors">
            Mark as Delivered
         </button>
      </div>
    </div>
  );
}
