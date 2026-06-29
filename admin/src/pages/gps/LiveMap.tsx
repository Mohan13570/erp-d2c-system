import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import io from 'socket.io-client';
import { Truck } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const carIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3204/3204933.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

export default function LiveMap() {
  const [vehicles, setVehicles] = useState<{ [id: string]: any }>({});
  const [history, setHistory] = useState<{ [id: string]: [number, number][] }>({});

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('live_tracking_broadcast', (telemetry: any) => {
      setVehicles(prev => ({
         ...prev,
         [telemetry.deviceId]: telemetry
      }));
      
      setHistory(prev => {
         const currentPath = prev[telemetry.deviceId] || [];
         const newPath = [...currentPath, [telemetry.latitude, telemetry.longitude] as [number, number]];
         if (newPath.length > 50) newPath.shift(); // Keep buffer small for memory
         return { ...prev, [telemetry.deviceId]: newPath };
      });
    });

    // Also support the old simulated telemetry format to keep dashboard alive if testing
    socket.on('telemetry', (data: any[]) => {
       const vMap: any = {};
       data.forEach(d => { vMap[d.id] = { ...d, latitude: d.lat, longitude: d.lng }; });
       setVehicles(prev => ({ ...prev, ...vMap }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {Object.values(vehicles).map(v => (
          <React.Fragment key={v.deviceId || v.id}>
             <Marker position={[v.latitude, v.longitude]} icon={carIcon}>
               <Popup>
                 <div className="p-1 min-w-[200px]">
                   <h3 className="font-black text-indigo-900 border-b border-indigo-100 pb-2 mb-2 flex items-center gap-2"><Truck size={16}/> Device: {v.deviceId || v.id}</h3>
                   <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                      <div><span className="font-bold text-gray-400">Speed</span><br/>{v.speed?.toFixed(1)} km/h</div>
                      <div><span className="font-bold text-gray-400">Heading</span><br/>{v.heading?.toFixed(0)}°</div>
                   </div>
                   {v.estimatedETA && (
                      <div className="mt-3 bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                         <p className="text-xs font-bold text-indigo-400 uppercase">Est. Arrival (ETA)</p>
                         <p className="font-bold text-indigo-900">{new Date(v.estimatedETA).toLocaleTimeString()}</p>
                         <p className="text-xs text-indigo-500">{v.distanceToDestKm?.toFixed(1)} km remaining</p>
                      </div>
                   )}
                   <div className="mt-3 px-2 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded border border-emerald-200 inline-block w-full text-center">
                     Engine ON (Tracking Active)
                   </div>
                 </div>
               </Popup>
             </Marker>
             
             {history[v.deviceId || v.id] && (
                <Polyline positions={history[v.deviceId || v.id]} color="#6366f1" weight={4} opacity={0.6} dashArray="5, 10" />
             )}
          </React.Fragment>
        ))}
      </MapContainer>
      
      <div className="absolute bottom-6 right-6 z-[10] bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 animate-in slide-in-from-bottom-4">
         <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
         <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">WebSocket Engine</p>
            <p className="text-sm font-black text-gray-900">Compression Active • Buffer Size: 50</p>
         </div>
      </div>
    </div>
  );
}
