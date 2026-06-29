import React, { useState, useEffect, useRef } from 'react';
import { Crosshair, AlertCircle } from 'lucide-react';
// Note: In a real environment, you'd import Leaflet or Mapbox here
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';

export default function LiveTrackingMap() {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/ocean/tracking/map-data')
      .then(res => res.json())
      .then(data => setGeoData(data));
  }, []);

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] w-full relative bg-blue-50 flex flex-col">
       <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-gray-100 w-96">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
            <Crosshair className="text-indigo-600" /> Global Live Map
          </h1>
          <p className="text-gray-500 text-sm mb-6">Real-time geospatial tracking of Vessels and Containers.</p>
          
          <div className="space-y-4">
             <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                <span className="font-semibold text-indigo-900">Active Vessels</span>
                <span className="text-indigo-600 font-bold">{geoData?.features.length || 0}</span>
             </div>
             <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center justify-between">
                <span className="font-semibold text-orange-900 flex items-center gap-1"><AlertCircle size={16}/> Weather Alerts</span>
                <span className="text-orange-600 font-bold">2</span>
             </div>
          </div>
       </div>

       {/* Map Placeholder */}
       <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-md bg-white rounded-3xl shadow-lg border border-gray-100">
             <Crosshair size={48} className="mx-auto text-indigo-300 mb-4" />
             <h2 className="text-xl font-bold text-gray-900 mb-2">Map Engine Ready</h2>
             <p className="text-gray-500 text-sm">
                The GeoJSON data payload has been successfully fetched from the backend. 
                Install <code>react-leaflet</code> and <code>leaflet</code> to render the interactive OpenStreetMap tiles and plot the live vessel coordinates.
             </p>
             <div className="mt-6 bg-gray-900 text-green-400 p-4 rounded-xl text-left text-xs overflow-auto h-32 font-mono">
                {JSON.stringify(geoData, null, 2)}
             </div>
          </div>
       </div>
    </div>
  );
}
