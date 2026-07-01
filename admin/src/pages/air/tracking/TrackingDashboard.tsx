import React, { useState, useEffect } from 'react';
import { Activity, Map, Navigation, Plane, AlertTriangle } from 'lucide-react';
import { io } from 'socket.io-client';

export default function TrackingDashboard() {
  const [liveFlights, setLiveFlights] = useState([
    { flightNo: 'EK987', from: 'DXB', to: 'JFK', status: 'In-Air', lat: 48.8566, lng: 2.3522, altitude: 34000, speed: 520, heading: 290 },
    { flightNo: 'QR102', from: 'DOH', to: 'LHR', status: 'In-Air', lat: 51.5074, lng: -0.1278, altitude: 36000, speed: 540, heading: 320 }
  ]);

  useEffect(() => {
    // Attempt to connect to local socket.io instance
    const socket = io('http://localhost:5000');
    socket.on('air_flight_update', (ping) => {
       console.log("WebSocket Flight Ping received:", ping);
       // We'd update liveFlights here in a real scenario
    });
    return () => { socket.disconnect(); };
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 h-screen flex flex-col">
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <Activity className="mr-3 text-purple-600" size={32} /> Live Tracking Map
          </h1>
          <p className="text-gray-500 font-medium mt-1">Real-time GPS aircraft telemetry and milestone tracking.</p>
        </div>
        <div className="flex items-center space-x-2">
           <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-sm text-gray-600">WebSocket Connected</span>
        </div>
      </div>

      <div className="flex-1 bg-gray-100 rounded-3xl border border-gray-200 overflow-hidden relative shadow-inner">
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg')] bg-cover bg-center opacity-40 mix-blend-multiply"></div>
        
        {/* Mock Flight Ping Render */}
        {liveFlights.map((f, i) => (
          <div key={i} className="absolute transition-all duration-1000 ease-linear" style={{ top: `${50 - (f.lat / 90) * 50}%`, left: `${50 + (f.lng / 180) * 50}%` }}>
             <Plane size={24} className="text-sky-600 drop-shadow-md" style={{ transform: `rotate(${f.heading - 45}deg)` }} />
             <div className="mt-1 bg-white/90 backdrop-blur px-2 py-1 rounded shadow text-xs font-bold whitespace-nowrap">
               {f.flightNo} • {f.altitude}ft
             </div>
          </div>
        ))}

        <div className="absolute bottom-6 left-6 right-6 flex space-x-6">
           <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-lg border border-gray-200 flex-1">
             <h3 className="font-black text-gray-900 flex items-center"><Navigation size={18} className="mr-2 text-sky-600" /> Active Flights</h3>
             <div className="mt-3 space-y-2">
               {liveFlights.map((f,i) => (
                 <div key={i} className="flex justify-between items-center text-sm font-bold bg-gray-50 p-2 rounded-lg">
                   <span className="text-gray-900">{f.flightNo} <span className="text-gray-400 mx-1">|</span> {f.from} &rarr; {f.to}</span>
                   <span className="text-sky-600">{f.speed} kts</span>
                 </div>
               ))}
             </div>
           </div>

           <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-lg border border-amber-200 flex-1">
             <h3 className="font-black text-gray-900 flex items-center"><AlertTriangle size={18} className="mr-2 text-amber-500" /> Weather Alerts</h3>
             <div className="mt-3 text-sm font-bold bg-amber-50 text-amber-800 p-2 rounded-lg">
               Severe Thunderstorm Warning at JFK • Minor Delays Expected
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
