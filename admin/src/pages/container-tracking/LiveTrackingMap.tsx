import React, { useState, useEffect } from 'react';
import { Map, Navigation, Activity } from 'lucide-react';

export default function LiveTrackingMap() {
  const [telemetry, setTelemetry] = useState<any>({ gps: [], reefer: [] });
  const [containerId, setContainerId] = useState('demo-id');

  useEffect(() => {
    // In a real app, this would fetch the last known locations for all active containers.
    // We are simulating the UI layout for the Live Tracking Map.
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <Map className="mr-3 text-emerald-600" size={32} /> Live Container Tracking
          </h1>
          <p className="text-gray-500 font-medium mt-1">Real-time GPS coordinates, ETA predictions, and route playback.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-100 rounded-3xl shadow-inner border border-gray-200 h-[600px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="text-center relative z-10">
            <Map size={64} className="mx-auto text-slate-400 mb-4" />
            <h2 className="text-2xl font-black text-slate-700">Map Interface</h2>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">This area would integrate with Google Maps, Mapbox, or Leaflet to render live IoT telemetry coordinates.</p>
          </div>
          
          {/* Simulated Map Marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex h-6 w-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-6 w-6 bg-emerald-500 border-2 border-white shadow-lg"></span>
            </div>
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow-lg border border-gray-100 text-xs font-bold text-gray-700 whitespace-nowrap">
              CSQU3054383
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 flex items-center mb-4">
              <Navigation className="mr-2 text-indigo-500" size={20} /> Active Routes
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-indigo-900 font-mono">CSQU3054383</span>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">In Transit</span>
                </div>
                <div className="text-sm font-medium text-indigo-700">Rotterdam → Felixstowe</div>
                <div className="mt-3 flex items-center text-xs text-indigo-600 font-bold">
                  <Activity size={14} className="mr-1" /> ETA: 14 hrs (On Time)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
