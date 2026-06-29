import React, { useState, useEffect } from 'react';
import { Search, Filter, Cpu, Wifi, Battery, AlertTriangle, Eye, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GPSDeviceList() {
  const [devices, setDevices] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/gps/devices').then(r => r.json()).then(setDevices).catch(console.error);
  }, []);

  const filtered = devices.filter(d => d.imei.includes(search) || (d.vehicle && d.vehicle.plateNumber.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Hardware & Trackers</h1>
          <p className="text-gray-500 font-medium mt-1">Manage GPS telemetry devices, SIM cards, and hardware health.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input type="text" placeholder="Search by IMEI or Vehicle Plate..." className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none font-medium transition-all" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="px-6 py-3 text-gray-600 bg-white border border-gray-200 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Filter size={18}/> Filters
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-left border-collapse">
            <thead className="text-gray-400 text-xs uppercase font-bold sticky top-0 bg-white z-10">
              <tr>
                <th className="px-6 py-4 border-b border-gray-100">IMEI & Status</th>
                <th className="px-6 py-4 border-b border-gray-100">SIM Details</th>
                <th className="px-6 py-4 border-b border-gray-100">Assigned Vehicle</th>
                <th className="px-6 py-4 border-b border-gray-100">Signal Strength</th>
                <th className="px-6 py-4 border-b border-gray-100">Battery Health</th>
                <th className="px-6 py-4 border-b border-gray-100 text-right">Diagnostics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-indigo-50/30 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className="relative">
                           <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center"><Cpu size={20}/></div>
                           <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${d.isOnline ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                        </div>
                        <div>
                           <p className="font-black text-gray-900 font-mono tracking-wider">{d.imei}</p>
                           <p className="text-xs font-bold text-gray-500 mt-0.5">FW: v{d.firmwareVersion}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <p className="font-bold text-gray-700">{d.simProvider || 'Unknown Network'}</p>
                     <p className="text-sm font-mono text-gray-500">{d.simNumber || 'No SIM'}</p>
                  </td>
                  <td className="px-6 py-4">
                     {d.vehicle ? (
                        <div>
                           <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md tracking-wider">{d.vehicle.plateNumber}</span>
                        </div>
                     ) : (
                        <span className="text-gray-400 font-medium italic">Unassigned</span>
                     )}
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        <Wifi size={16} className={d.signalStrength > 70 ? 'text-emerald-500' : d.signalStrength > 30 ? 'text-amber-500' : 'text-red-500'}/>
                        <span className="font-bold text-gray-900">{d.signalStrength}%</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        <Battery size={16} className={d.batteryHealth > 50 ? 'text-emerald-500' : 'text-red-500'}/>
                        <span className="font-bold text-gray-900">{d.batteryHealth}%</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/gps/devices/${d.id}`} className="text-indigo-600 hover:text-white p-2.5 bg-indigo-50 hover:bg-indigo-600 rounded-xl inline-flex transition-colors shadow-sm">
                      <Server size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-400 font-medium">No tracking devices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
