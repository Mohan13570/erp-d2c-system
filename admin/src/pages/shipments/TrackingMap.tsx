import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { io } from 'socket.io-client';
import { Map, Navigation, ShieldAlert, Truck, SignalHigh } from 'lucide-react';

// Fix for default Leaflet marker icons in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Truck Icon for Live Tracking
const truckIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/711/711202.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Hardcoded route coordinates for 6.5 demo (Origin -> Destination)
const MOCK_ROUTE: [number, number][] = [
  [40.7128, -74.0060], // NY (Origin)
  [41.8781, -87.6298], // Chicago (Stop 1)
  [39.7392, -104.9903], // Denver (Stop 2)
  [34.0522, -118.2437] // LA (Destination)
];

export default function TrackingMap() {
  const { id } = useParams();
  
  // Track live truck location (start near Chicago for demo)
  const [liveLocation, setLiveLocation] = useState<[number, number]>([41.8781, -87.6298]);
  const [liveSpeed, setLiveSpeed] = useState(65);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect to Backend Socket.IO Server
    const socket = io('http://localhost:5000', {
      reconnectionDelayMax: 10000,
    });

    socket.on('connect', () => {
      setConnected(true);
      // Join the specific shipment room for targeted telemetry
      socket.emit('join_shipment', id || 'DEMO-ID');
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    // Listen for the telemetry_update emitted from 6.3 Live Tracking API
    socket.on('telemetry_update', (data: any) => {
      if (data.latitude && data.longitude) {
        setLiveLocation([data.latitude, data.longitude]);
        if (data.speed) setLiveSpeed(data.speed);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Map className="w-8 h-8 text-emerald-600" /> GPS & Live Telemetry
          </h1>
          <p className="text-slate-500 mt-1">Real-time geospatial monitoring for {id || 'TRK-90218-444'}.</p>
        </div>
        
        {/* Socket Connection Status */}
        <div className={\`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm \${connected ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}\`}>
          <SignalHigh className="w-4 h-4" />
          {connected ? 'LIVE TELEMETRY: CONNECTED' : 'LIVE TELEMETRY: OFFLINE'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Vehicle Telemetry</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Current Speed</p>
                <p className="text-3xl font-black text-slate-900">{liveSpeed} <span className="text-base text-slate-500">mph</span></p>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Coordinates</p>
                <p className="text-sm font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block">
                  {liveLocation[0].toFixed(4)}, {liveLocation[1].toFixed(4)}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Vehicle Status</p>
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <Truck className="w-4 h-4" /> ACTIVE - MOVING
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 border-l-4 border-l-indigo-500">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Navigation className="w-4 h-4 text-indigo-500"/> Route Logic</h3>
            <p className="text-xs text-slate-600 font-medium">Map displays the planned origin-destination polyline. The live vehicle marker updates autonomously via WebSockets when the mobile driver app pings the 6.3 Telemetry API.</p>
          </div>
        </div>

        {/* The Map */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative" style={{ minHeight: '600px' }}>
          <MapContainer 
            center={liveLocation} 
            zoom={5} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
          >
            {/* OpenStreetMap Tile Layer (Free, no API Key required) */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Origin & Destination Markers */}
            <Marker position={MOCK_ROUTE[0]}>
              <Popup><strong>Origin:</strong> New York Warehouse</Popup>
            </Marker>
            
            <Marker position={MOCK_ROUTE[MOCK_ROUTE.length - 1]}>
              <Popup><strong>Destination:</strong> Los Angeles Hub</Popup>
            </Marker>

            {/* Planned Route Polyline */}
            <Polyline 
              positions={MOCK_ROUTE} 
              pathOptions={{ color: '#4f46e5', weight: 4, opacity: 0.7, dashArray: '10, 10' }} 
            />

            {/* LIVE TRUCK MARKER */}
            <Marker position={liveLocation} icon={truckIcon}>
              <Popup>
                <div className="text-center">
                  <strong>Vehicle TRK-990</strong><br/>
                  Speed: {liveSpeed} mph<br/>
                  <span className="text-xs text-slate-500">Live GPS Ping</span>
                </div>
              </Popup>
            </Marker>

          </MapContainer>
        </div>

      </div>
    </div>
  );
}
