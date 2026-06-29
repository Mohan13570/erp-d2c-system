import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, QrCode, Truck, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VehicleList() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/vehicles').then(r => r.json()).then(setVehicles).catch(console.error);
  }, []);

  const filtered = vehicles.filter(v => v.plateNumber.toLowerCase().includes(search.toLowerCase()) || v.type.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Vehicle Roster</h1>
          <p className="text-gray-500 font-medium mt-1">Manage all active, retired, and assigned fleet vehicles.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input type="text" placeholder="Search by Plate Number, Make, or Type..." className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none font-medium transition-all" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="px-6 py-3 text-gray-600 bg-white border border-gray-200 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Filter size={18}/> Filters
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-left border-collapse">
            <thead className="text-gray-400 text-xs uppercase font-bold sticky top-0 bg-white z-10">
              <tr>
                <th className="px-6 py-4 border-b border-gray-100">Plate Number</th>
                <th className="px-6 py-4 border-b border-gray-100">Category / Type</th>
                <th className="px-6 py-4 border-b border-gray-100">Make & Model</th>
                <th className="px-6 py-4 border-b border-gray-100">Status</th>
                <th className="px-6 py-4 border-b border-gray-100">Assigned Driver</th>
                <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(v => (
                <tr key={v.id} className="hover:bg-indigo-50/30 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500"><Truck size={18}/></div>
                        <div>
                           <p className="font-black text-gray-900 tracking-wide">{v.plateNumber}</p>
                           <p className="text-xs font-bold text-gray-400 mt-0.5 flex items-center gap-1"><QrCode size={12}/> {v.qrCode}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <p className="font-bold text-gray-700">{v.category || 'N/A'}</p>
                     <p className="text-sm text-gray-500">{v.type}</p>
                  </td>
                  <td className="px-6 py-4">
                     <p className="font-bold text-gray-700">{v.make || 'Unknown'}</p>
                     <p className="text-sm text-gray-500">{v.model || 'Unknown'} • {v.year || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${v.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                       {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {v.assignedDriver ? (
                       <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">{v.assignedDriver.name.charAt(0)}</div>
                          <span className="font-bold text-gray-700">{v.assignedDriver.name}</span>
                       </div>
                    ) : (
                       <span className="text-gray-400 font-medium italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/vehicles/${v.id}`} className="text-indigo-600 hover:text-white p-2.5 bg-indigo-50 hover:bg-indigo-600 rounded-xl inline-flex transition-colors">
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-400 font-medium">No vehicles found matching criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
