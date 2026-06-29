import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { Layers, Map as MapIcon, Maximize, PlayCircle, Truck, User } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix standard Leaflet Icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const truckIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3204/3204933.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const driverIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const THEMES = {
  street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
};

export default function AdvancedLiveMap() {
  const [theme, setTheme] = useState<'street' | 'satellite' | 'dark'>('street');
  const [assets, setAssets] = useState<any[]>([]);
  const [showTraffic, setShowTraffic] = useState(false);
  
  // Simulated playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  useEffect(() => {
    // Generate mock clustering data for demo
    const mockAssets = Array.from({ length: 50 }).map((_, i) => ({
      id: `asset-${i}`,
      type: Math.random() > 0.5 ? 'vehicle' : 'driver',
      lat: 39.8283 + (Math.random() - 0.5) * 10,
      lng: -98.5795 + (Math.random() - 0.5) * 20,
      name: Math.random() > 0.5 ? `Truck ${Math.floor(Math.random()*1000)}` : `Driver ${Math.floor(Math.random()*1000)}`
    }));
    setAssets(mockAssets);
  }, []);

  return (
    <div className="w-full h-[calc(100vh-4rem)] relative flex flex-col bg-slate-900">
      
      {/* Top GIS Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 border border-white/20">
         <div className="flex items-center gap-2 pr-6 border-r border-gray-200">
            <MapIcon size={20} className="text-indigo-600"/>
            <span className="font-black text-gray-900 tracking-tight">GIS Control</span>
         </div>
         <div className="flex gap-2">
            {(['street', 'satellite', 'dark'] as const).map(t => (
               <button 
                  key={t} 
                  onClick={() => setTheme(t)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize transition-all ${theme === t ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
               >
                  {t}
               </button>
            ))}
         </div>
      </div>

      <div className="flex-1 relative z-0">
         <MapContainer center={[39.8283, -98.5795]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer url={THEMES[theme]} />
            
            {/* Traffic Overlay (Simulated via OpenRailwayMap or similar if needed, keeping simple here) */}
            {showTraffic && <TileLayer url="https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png" opacity={0.5} />}

            {/* Clustering */}
            <MarkerClusterGroup chunkedLoading maxClusterRadius={60}>
               {assets.map(asset => (
                  <Marker 
                     key={asset.id} 
                     position={[asset.lat, asset.lng]} 
                     icon={asset.type === 'vehicle' ? truckIcon : driverIcon}
                  >
                     <Popup>
                        <div className="font-bold">{asset.name}</div>
                        <div className="text-sm text-gray-500 capitalize">{asset.type} • Active</div>
                     </Popup>
                  </Marker>
               ))}
            </MarkerClusterGroup>
         </MapContainer>
      </div>

      {/* Bottom Timeline Playback Scrubber */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-3/4 max-w-4xl bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-4 border border-white/20">
         <div className="flex items-center gap-4">
            <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-lg">
               <PlayCircle size={24} className={isPlaying ? 'animate-pulse' : ''} />
            </button>
            <div className="flex-1">
               <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                  <span>Replay Timeline: Oct 24, 08:00 AM</span>
                  <span>Playback Speed: 4x</span>
               </div>
               <input 
                  type="range" 
                  min="0" max="100" 
                  value={playbackTime} 
                  onChange={(e) => setPlaybackTime(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
               />
            </div>
         </div>
      </div>
    </div>
  );
}
