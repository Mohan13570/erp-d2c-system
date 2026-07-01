import React, { useState, useEffect } from 'react';
import { LayoutGrid, Box, AlertTriangle } from 'lucide-react';

export default function YardManagementConsole() {
  const [zones, setZones] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/container-ops/yard/zones')
      .then(res => res.json())
      .then(setZones)
      .catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <LayoutGrid className="mr-3 text-indigo-600" size={32} /> Yard Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage 3D Yard geometry (Zones, Blocks, Rows, Tiers) and capacity limits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {zones.map(zone => {
          const utilPct = (zone.occupied / zone.capacity) * 100;
          return (
            <div key={zone.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{zone.name}</h3>
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full mt-2">
                    {zone.type}
                  </span>
                </div>
                {utilPct > 90 && <AlertTriangle className="text-rose-500" size={24} />}
              </div>

              <div className="space-y-2 mt-6">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-500">Occupancy</span>
                  <span className="text-gray-900">{zone.occupied} / {zone.capacity} TEU</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className={`h-3 rounded-full ${utilPct > 90 ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                    style={{ width: `${utilPct}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-6">
                <h4 className="text-sm font-bold text-gray-500 mb-4">Live Stack Matrix (Row A)</h4>
                <div className="grid grid-cols-4 gap-2">
                  {[1,2,3,4,5,6,7,8].map((slot, i) => (
                    <div key={i} className={`h-12 rounded-lg flex items-center justify-center border-2 ${i < 3 ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-dashed border-gray-200'}`}>
                      {i < 3 ? <Box className="text-indigo-500" size={16} /> : <span className="text-xs text-gray-400">Empty</span>}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
        {zones.length === 0 && (
          <div className="col-span-full p-12 text-center text-gray-400 font-bold bg-white rounded-3xl border border-gray-100">
            No Yard Zones configured yet.
          </div>
        )}
      </div>
    </div>
  );
}
