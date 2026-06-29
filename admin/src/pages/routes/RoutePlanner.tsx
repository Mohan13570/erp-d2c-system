import React, { useState } from 'react';
import { BrainCircuit, Navigation, MapPin, Truck, Maximize, Route as RouteIcon } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';

export default function RoutePlanner() {
  const [routeData, setRouteData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
     setLoading(true);
     // Simulate AI route generation latency
     setTimeout(() => {
        setRouteData({
           distance: 450,
           time: 5.2,
           waypoints: [
              [40.7128, -74.0060], // NY
              [39.9526, -75.1652], // Philly
              [38.9072, -77.0369]  // DC
           ]
        });
        setLoading(false);
     }, 1500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex gap-8">
       {/* Sidebar Controls */}
       <div className="w-1/3 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-6 bg-slate-900 text-white">
             <h2 className="text-2xl font-black flex items-center gap-2 tracking-tight"><BrainCircuit className="text-indigo-400"/> AI Route Optimizer</h2>
             <p className="text-slate-400 text-sm mt-1">Calculate shortest vs fastest paths avoiding tolls and restricted roads.</p>
          </div>
          
          <div className="p-6 space-y-6 flex-1 overflow-auto">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Origin</label>
                <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" defaultValue="New York, NY" />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Destination</label>
                <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" defaultValue="Washington, DC" />
             </div>
             
             <div className="pt-4 border-t">
                <button onClick={handleOptimize} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-lg hover:bg-indigo-700 transition-colors shadow-lg flex items-center justify-center gap-2">
                   {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <RouteIcon/>}
                   {loading ? 'Optimizing Matrix...' : 'Generate Route'}
                </button>
             </div>

             {routeData && (
                <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 animate-in fade-in zoom-in">
                   <h3 className="font-bold text-emerald-800 flex items-center gap-2 mb-2"><Navigation size={16}/> Optimal Route Found</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-xs text-emerald-600 font-bold uppercase">Distance</p><p className="font-black text-xl text-emerald-900">{routeData.distance} km</p></div>
                      <div><p className="text-xs text-emerald-600 font-bold uppercase">Est. Time</p><p className="font-black text-xl text-emerald-900">{routeData.time} hrs</p></div>
                   </div>
                </div>
             )}
          </div>
       </div>

       {/* Map View */}
       <div className="flex-1 bg-slate-100 rounded-3xl border border-gray-200 overflow-hidden relative">
          <MapContainer center={[39.8283, -75.5795]} zoom={6} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            {routeData && (
               <Polyline positions={routeData.waypoints} color="#4f46e5" weight={6} opacity={0.8} />
            )}
          </MapContainer>
       </div>
    </div>
  );
}
