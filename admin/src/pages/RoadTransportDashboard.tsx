import React, { useState, useEffect } from 'react';
import { Truck, Package, Clock, DollarSign, Activity, CalendarDays, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RoadTransportDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/road/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setData(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  if (loading) return <div className="p-8">Loading dashboard data...</div>;
  if (!data) return <div className="p-8 text-rose-500">Failed to load dashboard data.</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Road Transport Dashboard</h1>
        <p className="text-gray-500 font-medium mt-1">Real-time overview of fleet and transport operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
             <Activity className="text-emerald-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Active Trips</p>
            <p className="text-2xl font-black text-gray-900">{data.activeTrips}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
             <Package className="text-amber-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Pending Deliveries</p>
            <p className="text-2xl font-black text-gray-900">{data.pendingDeliveries}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
             <Truck className="text-indigo-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Vehicle Utilization</p>
            <p className="text-2xl font-black text-gray-900">{data.vehicleUtilization}%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mr-4">
             <Clock className="text-rose-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Delayed Trips</p>
            <p className="text-2xl font-black text-gray-900">{data.delayedTrips}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
             <CheckCircle2 className="text-blue-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Completed Trips</p>
            <p className="text-2xl font-black text-gray-900">{data.completedTrips}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
             <DollarSign className="text-purple-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Transport Cost</p>
            <p className="text-2xl font-black text-gray-900">${data.transportCost.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
