import React, { useState, useEffect } from 'react';
import { MapPin, QrCode, ScanFace, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function LiveCheckIn() {
  const [time, setTime] = useState(new Date());
  const [checkingIn, setCheckingIn] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
     setCheckingIn(true);
     setTimeout(() => {
        setCheckingIn(false);
        setSuccess(true);
     }, 2000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden relative">
         <div className="h-32 bg-indigo-600 p-8 flex flex-col items-center justify-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_100%)]"></div>
            <h1 className="text-4xl font-extrabold tracking-tight relative z-10">
               {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </h1>
            <p className="text-indigo-100 text-sm font-medium relative z-10 mt-1">
               {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
         </div>

         <div className="p-8 pb-10 text-center">
            {!success ? (
               <>
                  <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden border-4 border-white shadow-md -mt-16 relative z-20">
                     <div className="w-full h-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-3xl font-extrabold">JS</div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">John Smith</h2>
                  <p className="text-sm text-gray-500 mb-6">EMP-1045 • Operations Dept</p>

                  <div className="bg-blue-50 text-blue-700 p-3 rounded-xl text-xs font-medium flex items-center justify-center mb-8 border border-blue-100">
                     <MapPin size={14} className="mr-1.5"/> Validated: HQ GeoFence (Acc: 4m)
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <button 
                        onClick={handleCheckIn}
                        disabled={checkingIn}
                        className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-100 rounded-2xl transition group relative overflow-hidden"
                     >
                        {checkingIn ? (
                           <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-2"></div>
                        ) : (
                           <MapPin size={32} className="mb-2 text-gray-400 group-hover:text-indigo-500 transition"/>
                        )}
                        <span className="text-sm font-bold">{checkingIn ? 'Validating...' : 'GPS Check-In'}</span>
                     </button>

                     <button className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-100 rounded-2xl transition group relative overflow-hidden">
                        <QrCode size={32} className="mb-2 text-gray-400 group-hover:text-indigo-500 transition"/>
                        <span className="text-sm font-bold">Scan QR</span>
                     </button>
                  </div>
               </>
            ) : (
               <div className="py-8 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_0_10px_rgba(34,197,94,0.1)]">
                     <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Checked In Successfully!</h2>
                  <p className="text-gray-500 text-sm mb-8">Have a great productive day at work.</p>
                  
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 inline-block text-left w-full mb-6">
                     <div className="flex justify-between items-center mb-2"><span className="text-xs text-gray-500">Time:</span> <span className="font-bold text-sm">09:00 AM</span></div>
                     <div className="flex justify-between items-center mb-2"><span className="text-xs text-gray-500">Location:</span> <span className="font-bold text-sm">Global HQ Yard A</span></div>
                     <div className="flex justify-between items-center"><span className="text-xs text-gray-500">Shift:</span> <span className="font-bold text-sm text-indigo-600">Morning (09:00-18:00)</span></div>
                  </div>

                  <button onClick={() => setSuccess(false)} className="text-sm text-indigo-600 font-bold hover:underline">View Dashboard</button>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
