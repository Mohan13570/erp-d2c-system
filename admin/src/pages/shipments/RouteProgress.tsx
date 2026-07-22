import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Route, Navigation, Clock, Goal, Ruler } from 'lucide-react';

const DEMO_ROUTE = {
  origin: 'WH-NY-01, New York, USA',
  destination: 'WH-LA-01, Los Angeles, USA',
  intermediateStops: ['Chicago, IL', 'Denver, CO'],
  distanceCovered: 1250,
  distanceRemaining: 1530,
  estimatedArrival: '2026-07-24T14:00:00Z',
  actualArrival: null,
  delayMinutes: 45
};

export default function RouteProgress() {
  const { id } = useParams();
  const [route, setRoute] = useState(DEMO_ROUTE);

  const totalDistance = route.distanceCovered + route.distanceRemaining;
  const progressPercent = totalDistance > 0 ? (route.distanceCovered / totalDistance) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Route className="w-8 h-8 text-indigo-600" /> Route Progress
          </h1>
          <p className="text-slate-500 mt-1">Live distance calculations and stop monitoring for {id || 'TRK-90218-444'}.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* DISTANCE COVERED */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Ruler className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Distance Covered</h3>
          </div>
          <p className="text-3xl font-black text-slate-900">{route.distanceCovered.toLocaleString()} <span className="text-lg text-slate-500 font-bold">miles</span></p>
        </div>

        {/* DISTANCE REMAINING */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Goal className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Distance Remaining</h3>
          </div>
          <p className="text-3xl font-black text-slate-900">{route.distanceRemaining.toLocaleString()} <span className="text-lg text-slate-500 font-bold">miles</span></p>
        </div>

        {/* ETA & DELAY */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">ETA & Delays</h3>
          </div>
          <p className="text-lg font-black text-slate-900">{new Date(route.estimatedArrival).toLocaleString()}</p>
          {route.delayMinutes > 0 && (
            <p className="text-xs font-bold text-red-500 mt-1 uppercase tracking-wider">Delayed by {route.delayMinutes} mins</p>
          )}
        </div>
      </div>

      {/* PROGRESS BAR & STOPS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Journey Progress</h2>
        
        {/* Progress Bar Container */}
        <div className="relative pt-8 pb-12 px-4">
          
          {/* Background Line */}
          <div className="absolute top-10 left-4 right-4 h-2 bg-slate-100 rounded-full"></div>
          
          {/* Active Fill Line */}
          <div 
            className="absolute top-10 left-4 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-in-out"
            style={{ width: \`\${progressPercent}%\` }}
          ></div>

          {/* Markers */}
          <div className="relative flex justify-between items-center w-full z-10">
            
            {/* Origin */}
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-blue-600 border-4 border-white shadow flex items-center justify-center -mt-2"></div>
              <p className="text-xs font-bold text-slate-500 mt-3 uppercase tracking-wider">Origin</p>
              <p className="text-sm font-bold text-slate-900 max-w-[120px] text-center mt-1">{route.origin}</p>
            </div>

            {/* Intermediate Stops */}
            {route.intermediateStops.map((stop, i) => {
              // Distribute evenly for UI demo
              const position = ((i + 1) / (route.intermediateStops.length + 1)) * 100;
              const isPassed = progressPercent >= position;
              return (
                <div key={i} className="flex flex-col items-center absolute" style={{ left: \`\${position}%\`, transform: 'translateX(-50%)' }}>
                  <div className={\`w-5 h-5 rounded-full border-4 border-white shadow flex items-center justify-center -mt-1.5 \${isPassed ? 'bg-indigo-500' : 'bg-slate-300'}\`}></div>
                  <p className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-wider">Stop {i + 1}</p>
                  <p className="text-xs font-bold text-slate-700 max-w-[100px] text-center mt-1">{stop}</p>
                </div>
              );
            })}

            {/* Destination */}
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-slate-300 border-4 border-white shadow flex items-center justify-center -mt-2">
                <MapPin className="w-3 h-3 text-white absolute -mt-6" />
              </div>
              <p className="text-xs font-bold text-slate-500 mt-3 uppercase tracking-wider">Destination</p>
              <p className="text-sm font-bold text-slate-900 max-w-[120px] text-center mt-1">{route.destination}</p>
            </div>

          </div>
          
        </div>
      </div>

    </div>
  );
}
