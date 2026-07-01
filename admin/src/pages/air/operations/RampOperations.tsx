import React, { useState } from 'react';
import { Truck, Navigation, ScanLine, Check, AlertOctagon } from 'lucide-react';

export default function RampOperations() {
  const [scannedUld, setScannedUld] = useState('');

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-20 sm:max-w-4xl">
      {/* Mobile-first App Header */}
      <div className="bg-sky-900 text-white p-6 shadow-md rounded-b-3xl">
        <h1 className="text-2xl font-black flex items-center">
          <Navigation className="mr-3 text-sky-400" /> Tarmac / Ramp Ops
        </h1>
        <p className="text-sky-200 text-sm mt-1 font-medium">Gate A42 • Flight EK987</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Loading</div>
            <div className="text-xl font-black text-gray-900">Boeing 777F</div>
          </div>
          <div className="text-right">
             <div className="text-2xl font-black text-sky-600">2 / 14</div>
             <div className="text-xs font-bold text-gray-400">ULDs Loaded</div>
          </div>
        </div>

        <div className="bg-sky-600 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
          <ScanLine size={120} className="absolute -right-6 -top-6 opacity-10" />
          <h2 className="text-xl font-black mb-2 flex items-center"><ScanLine className="mr-2" /> Scan ULD Tag</h2>
          <p className="text-sky-100 text-sm font-medium mb-6">Tap to open scanner and log ULD onto the aircraft deck.</p>
          <div className="bg-sky-800/50 p-4 rounded-xl flex items-center font-bold font-mono text-lg">
             {scannedUld || 'WAITING FOR SCAN...'}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 px-2">Manifest Queue</h3>
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-emerald-500 flex items-center justify-between opacity-60">
            <div>
              <div className="font-bold text-gray-900">AKE12345EK</div>
              <div className="text-xs text-gray-500">FWD HOLD • 3200 kg</div>
            </div>
            <Check className="text-emerald-500" />
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-sky-500 flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 bg-sky-50 w-1/3 z-0"></div>
            <div className="z-10">
              <div className="font-black text-gray-900">PMC98765EK</div>
              <div className="text-xs font-bold text-gray-500 mt-1">CENTER DECK • 4500 kg</div>
            </div>
            <button className="z-10 bg-sky-100 text-sky-700 px-4 py-2 rounded-xl font-bold text-sm flex items-center">
              Load Now
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
