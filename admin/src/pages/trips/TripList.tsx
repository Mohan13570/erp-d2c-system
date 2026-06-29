import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Route, MapPin, Truck, CheckCircle2, Navigation, DollarSign, Plus } from 'lucide-react';

export default function TripList() {
  const [trips, setTrips] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/trips').then(r => r.json()).then(setTrips).catch(console.error);
  }, []);

  const filtered = trips.filter(t => t.tripNumber?.includes(search) || t.origin.toLowerCase().includes(search.toLowerCase()) || t.destination.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
             <Navigation className="text-indigo-600"/> Trip Master
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage all active dispatches, route planning, and financials.</p>
        </div>
        <Link to="/trips/plan" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
           <Plus size={20}/> Plan New Trip
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input type="text" placeholder="Search by Trip # or Locations..." className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none font-medium transition-all" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="px-6 py-3 text-gray-600 bg-white border border-gray-200 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Filter size={18}/> Filters
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-left border-collapse">
            <thead className="text-gray-400 text-xs uppercase font-bold sticky top-0 bg-white z-10">
              <tr>
                <th className="px-6 py-4 border-b border-gray-100">Trip Info</th>
                <th className="px-6 py-4 border-b border-gray-100">Route</th>
                <th className="px-6 py-4 border-b border-gray-100">Assigned Asset</th>
                <th className="px-6 py-4 border-b border-gray-100">Financials</th>
                <th className="px-6 py-4 border-b border-gray-100">Status</th>
                <th className="px-6 py-4 border-b border-gray-100"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-4">
                     <p className="font-black text-gray-900 font-mono tracking-wider">{t.tripNumber?.split('-')[0].toUpperCase()}</p>
                     <p className="text-xs font-bold text-gray-500 mt-0.5">{t.totalDistanceKm} km • {t.estimatedHours} hrs</p>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-emerald-500"/> <span className="font-bold text-gray-700">{t.origin}</span>
                     </div>
                     <div className="flex items-center gap-2 mt-1">
                        <MapPin size={16} className="text-red-500"/> <span className="font-bold text-gray-700">{t.destination}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     {t.vehicle && t.driver ? (
                        <>
                           <p className="font-bold text-gray-900 flex items-center gap-1.5"><Truck size={14} className="text-indigo-500"/> {t.vehicle.plateNumber}</p>
                           <p className="text-sm text-gray-500 mt-1">{t.driver.firstName} {t.driver.lastName}</p>
                        </>
                     ) : <span className="text-orange-500 font-bold text-sm bg-orange-50 px-2 py-1 rounded">Unassigned</span>}
                  </td>
                  <td className="px-6 py-4">
                     <p className="font-bold text-emerald-600 flex items-center gap-1"><DollarSign size={14}/>{t.revenue}</p>
                     <p className="text-xs font-bold text-red-500 mt-0.5 flex items-center gap-1"><DollarSign size={12}/>{(t.fuelCost + t.tollExpenses + t.otherExpenses).toFixed(2)} exp</p>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        t.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                        t.status === 'InTransit' ? 'bg-blue-50 text-blue-700' :
                        t.status === 'Dispatched' ? 'bg-indigo-50 text-indigo-700' :
                        'bg-gray-100 text-gray-600'
                     }`}>
                        {t.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <Link to={`/trips/${t.id}`} className="text-indigo-600 hover:text-white px-4 py-2 bg-indigo-50 hover:bg-indigo-600 rounded-lg font-bold transition-colors">Manage</Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-400 font-medium">No trips found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
