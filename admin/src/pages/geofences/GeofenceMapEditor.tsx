import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ShieldAlert, Trash2, Map, Plus } from 'lucide-react';

export default function GeofenceMapEditor() {
  const [fences, setFences] = useState<any[]>([]);

  const fetchFences = () => {
    fetch('/api/geofences').then(r => r.json()).then(setFences).catch(console.error);
  };

  useEffect(() => {
    fetchFences();
  }, []);

  const handleCreateMock = async () => {
     // Simulating drawing a polygon for demo since leaflet-draw requires heavy setup
     const mockCoords = [ [39.8, -98.6], [39.9, -98.6], [39.9, -98.5], [39.8, -98.5] ];
     await fetch('/api/geofences', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New Central Hub', category: 'Warehouse', type: 'Polygon', coordinates: mockCoords, color: '#f59e0b' })
     });
     fetchFences();
  };

  const handleDelete = async (id: string) => {
     await fetch(`/api/geofences/${id}`, { method: 'DELETE' });
     fetchFences();
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] relative flex flex-col bg-slate-900">
      
      {/* Top Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 border border-white/20">
         <div className="flex items-center gap-2 pr-6 border-r border-gray-200">
            <ShieldAlert size={20} className="text-orange-500"/>
            <span className="font-black text-gray-900 tracking-tight">Geofence Studio</span>
         </div>
         <div className="flex gap-2">
            <button onClick={handleCreateMock} className="px-4 py-1.5 rounded-full text-sm font-bold bg-indigo-600 text-white shadow-md flex items-center gap-1 hover:bg-indigo-700">
               <Plus size={16}/> Draw Zone
            </button>
         </div>
      </div>

      <div className="flex-1 relative z-0">
         <MapContainer center={[39.8283, -98.5795]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {fences.map(f => {
               if(f.type === 'Polygon') {
                  const positions = JSON.parse(f.coordinates);
                  return (
                     <Polygon key={f.id} positions={positions} pathOptions={{ color: f.color, fillColor: f.color, fillOpacity: 0.3 }}>
                        <Popup>
                           <div className="font-bold">{f.name}</div>
                           <div className="text-xs text-gray-500">{f.category}</div>
                           <button onClick={() => handleDelete(f.id)} className="mt-2 text-red-500 flex items-center gap-1 text-xs font-bold hover:bg-red-50 p-1 rounded"><Trash2 size={12}/> Delete</button>
                        </Popup>
                     </Polygon>
                  );
               }
               return null;
            })}
         </MapContainer>
      </div>
    </div>
  );
}
