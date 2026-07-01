import React, { useState, useEffect } from 'react';
import { Route, Search, MapPin, Truck, Ship, Anchor } from 'lucide-react';

export default function ContainerLifecycleTracker() {
  const [events, setEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('CSQU3054383');

  useEffect(() => {
    // Only load if a container ID is known, for now we leave it empty unless wired up
  }, [searchTerm]);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <Route className="mr-3 text-indigo-600" size={32} /> Lifecycle Tracker
          </h1>
          <p className="text-gray-500 font-medium mt-1">Audit trail of gate movements and status changes.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Enter Container No..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-64 font-mono uppercase"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative">
        <div className="absolute left-12 top-12 bottom-12 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-8 relative">
          
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-indigo-500 flex items-center justify-center relative z-10 -ml-4 mr-6 shrink-0">
              <Ship size={14} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 mb-1">Today, 10:45 AM</p>
              <h3 className="text-lg font-bold text-gray-900">Loaded on Vessel</h3>
              <p className="text-sm text-gray-500 font-medium mt-1">Vessel: CMA CGM JULES VERNE • Voyage: 098E</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center relative z-10 -ml-4 mr-6 shrink-0">
              <Anchor size={14} className="text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 mb-1">Yesterday, 18:20 PM</p>
              <h3 className="text-lg font-bold text-gray-900">At Port Terminal</h3>
              <p className="text-sm text-gray-500 font-medium mt-1">Location: Port of Rotterdam Terminal 3</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center relative z-10 -ml-4 mr-6 shrink-0">
              <Truck size={14} className="text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 mb-1">Yesterday, 14:15 PM</p>
              <h3 className="text-lg font-bold text-gray-900">Gate Out</h3>
              <p className="text-sm text-gray-500 font-medium mt-1">Released from Yard. Carrier: EuroLogistics</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
