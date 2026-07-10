import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { Map, Settings, Filter, ArrowLeft } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icons issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const routeCoords: [number, number][] = [
  [34.0522, -118.2437], // LA
  [36.7783, -119.4179], // Mid CA
  [37.7749, -122.4194]  // SF
];

export default function LiveMap() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm z-10 relative">
        <div className="flex items-center space-x-4">
          <Link to="/customer/tracking" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Live GPS Telemetry</h1>
            <p className="text-sm text-gray-500">Real-time geographical tracking for active shipments</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white shadow-sm hover:bg-gray-50">
            <Filter size={16} className="mr-2" /> Filter
          </button>
        </div>
      </div>

      <div className="flex-1 bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden relative shadow-inner">
        <MapContainer 
          center={[36.7783, -119.4179]} 
          zoom={6} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker position={[34.0522, -118.2437]}>
            <Popup>
              <div className="font-bold text-sm">Origin: Port of Los Angeles</div>
              <div className="text-xs text-gray-500">Departed: Oct 24, 2026</div>
            </Popup>
          </Marker>

          <Marker position={[37.7749, -122.4194]}>
            <Popup>
              <div className="font-bold text-sm">Destination: San Francisco Hub</div>
              <div className="text-xs text-gray-500">ETA: Oct 26, 2026</div>
            </Popup>
          </Marker>

          {/* Current GPS Ping */}
          <Marker position={[36.7783, -119.4179]}>
            <Popup>
              <div className="p-1">
                 <div className="font-bold text-sm text-indigo-700">TRK-9901 (Live)</div>
                 <div className="text-xs text-gray-500 mt-1">Speed: 65 km/h</div>
                 <div className="text-xs text-gray-500">Heading: North-West</div>
                 <div className="text-xs text-gray-400 mt-2">Ping: Just now</div>
              </div>
            </Popup>
          </Marker>

          <Polyline pathOptions={{ color: '#4f46e5', weight: 4, dashArray: '5, 10' }} positions={routeCoords} />
        </MapContainer>
        
        {/* Overlay Telemetry Panel */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200 w-72 z-[1000]">
           <h3 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Active Vehicles</h3>
           <div className="space-y-3">
              <div className="bg-indigo-50 border border-indigo-100 p-2 rounded-lg">
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-indigo-900">TRK-9901</span>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                 </div>
                 <p className="text-xs text-indigo-700 mt-1">Moving • 65 km/h</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
