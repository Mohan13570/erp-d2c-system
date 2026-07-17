import React, { useState, useEffect } from 'react';
import { TrendingUp, Truck, DollarSign, Calendar, Navigation, Clock, Activity, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TripDashboard() {
  const [trips, setTrips] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/api/trips').then(r => r.json()).then(setTrips).catch(console.error);
  }, []);

  const activeTrips = trips.filter(t => t.status === 'Dispatched' || t.status === 'InTransit').length;
  
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Trip Master Dashboard</h1>
        <p className="text-gray-500 font-medium mt-1">Financial performance and active dispatch center.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4"><Navigation size={24}/></div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Active Trips</p>
          <h2 className="text-4xl font-black text-gray-900">{activeTrips}</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8">
         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-black text-xl text-gray-900">Recent Dispatches</h3>
               <Link to="/trips/list" className="text-indigo-600 font-bold hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
               {trips.slice(0, 5).map(t => (
                  <div key={t.id} className="flex gap-4 p-4 border rounded-2xl items-center hover:shadow-md transition-shadow bg-gray-50/50">
                     <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        {t.tripNumber?.split('-')[0].toUpperCase()}
                     </div>
                     <div className="flex-1">
                        <p className="font-bold text-gray-900">{t.origin} ➔ {t.destination}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                           <Truck size={14}/> {t.vehicle?.plateNumber} • <span className={`px-2 py-0.5 rounded text-xs font-bold ${t.status==='Completed'?'bg-emerald-100 text-emerald-700':'bg-indigo-100 text-indigo-700'}`}>{t.status}</span>
                        </p>
                     </div>
                     <Link to={`/trips/${t.id}`} className="px-4 py-2 bg-white border rounded-lg font-bold text-indigo-600 hover:bg-gray-50">Manage</Link>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
