import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Search, Play, Pause, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DispatchConsole() {
  const [trips, setTrips] = useState<any[]>([]);

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/road/planning/trips');
      if (res.ok) setTrips(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchTrips(); }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Dispatched': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'In-Transit': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Paused': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-sky-100 text-sky-700 border-sky-200'; // Planned
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col relative space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center">
            <Truck className="mr-3 text-indigo-600" size={40} />
            Live Dispatch Console
          </h1>
          <p className="text-gray-500 font-medium mt-2 text-lg">Monitor live telematics, driver status, and trip execution.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input placeholder="Search by Trip No, Driver, or Vehicle..." className="w-full bg-gray-50 pl-12 pr-4 py-3 rounded-xl border border-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <select className="bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-700">
          <option>All Statuses</option>
          <option>Planned</option>
          <option>In-Transit</option>
          <option>Paused</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {trips.map(t => (
          <div key={t.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-colors">
            <div className="flex items-center space-x-6">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center min-w-[120px]">
                <p className="text-sm font-bold text-gray-400">TRIP</p>
                <p className="text-xl font-black text-gray-900">{t.tripNumber}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 mb-1">Driver & Vehicle</p>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900">{t.driver?.name || 'Unassigned'}</span>
                  <span className="text-gray-300">•</span>
                  <span className="font-bold text-gray-900">{t.vehicle?.registrationNo || 'Unassigned'}</span>
                </div>
              </div>
              <div className="hidden md:block border-l border-gray-100 pl-6">
                <p className="text-sm font-bold text-gray-500 mb-1">Route summary</p>
                <p className="font-medium text-gray-900">{t.stops?.length || 0} stops configured</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className={`px-4 py-2 border rounded-xl font-black text-sm uppercase tracking-wider ${getStatusColor(t.status)}`}>
                {t.status}
              </div>
              <Link to={`/road/execution/${t.id}`} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm">
                Open Trip Workspace
              </Link>
            </div>
          </div>
        ))}
        {trips.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <MapPin size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium text-lg">No active trips found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
