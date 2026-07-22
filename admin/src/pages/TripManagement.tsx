import React, { useState, useEffect } from 'react';
import { Navigation, Truck, MapPin, Users, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TripManagement() {
  const { token } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/road/trips', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setTrips(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [token]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/road/trips/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchTrips(); // Refresh
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planned': return 'bg-gray-100 text-gray-700';
      case 'Assigned': return 'bg-amber-100 text-amber-700';
      case 'In Transit': return 'bg-blue-100 text-blue-700';
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      case 'Cancelled': return 'bg-rose-100 text-rose-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
          <Truck className="mr-3 text-indigo-600"/> Trip Management
        </h1>
        <p className="text-gray-500 font-medium mt-1">Track and update active transport trips.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500 font-semibold">Loading trips...</div>
      ) : trips.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 text-center text-gray-500">No trips found.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trips.map(trip => (
            <div key={trip.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`px-3 py-1 font-black text-xs rounded-lg uppercase tracking-widest ${getStatusColor(trip.status)}`}>
                    {trip.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-2 font-mono">ID: {trip.id}</p>
                </div>
                
                <select 
                  className="p-2 text-sm border border-gray-200 rounded-lg bg-gray-50 font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={trip.status}
                  onChange={(e) => updateStatus(trip.id, e.target.value)}
                >
                  <option value="Planned">Planned</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm flex-1">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1 flex items-center"><MapPin size={12} className="mr-1"/> Origin</p>
                    <p className="font-bold text-gray-900 truncate">{trip.origin}</p>
                  </div>
                  <div className="px-4 text-gray-300 font-light text-xl">➔</div>
                  <div className="text-sm text-right flex-1">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1 flex items-center justify-end"><Navigation size={12} className="mr-1"/> Destination</p>
                    <p className="font-bold text-gray-900 truncate">{trip.destination}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl flex flex-wrap gap-4 text-sm">
                <div className="flex items-center text-gray-700 font-medium">
                  <Truck size={16} className="mr-2 text-indigo-500"/> {trip.vehicle?.plateNumber || 'Unassigned'}
                </div>
                <div className="flex items-center text-gray-700 font-medium">
                  <Users size={16} className="mr-2 text-indigo-500"/> {trip.driver?.name || 'Unassigned'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
