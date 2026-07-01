import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Package, FileText, Activity, AlertCircle, Calendar, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RoadTransportHub() {
  const [stats, setStats] = useState({ activeTrips: 0, pendingBookings: 0, availableTrucks: 0 });

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col relative space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center">
            <Truck className="mr-3 text-emerald-600" size={40} />
            Road Transport Hub
          </h1>
          <p className="text-gray-500 font-medium mt-2 text-lg">Foundation, Planning, and FTL/LTL Bookings.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/road/bookings/new" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2 shadow-sm transition-all">
            <Plus size={18} /><span>New FTL/LTL Booking</span>
          </Link>
          <Link to="/road/planning" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2 shadow-sm transition-all">
            <MapPin size={18} /><span>Trip Planner</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl mr-4"><Truck size={24} /></div>
          <div>
            <p className="text-sm font-bold text-gray-400">Active Trips</p>
            <p className="text-2xl font-black text-gray-900">12</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl mr-4"><FileText size={24} /></div>
          <div>
            <p className="text-sm font-bold text-gray-400">Pending Bookings</p>
            <p className="text-2xl font-black text-gray-900">45</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl mr-4"><Package size={24} /></div>
          <div>
            <p className="text-sm font-bold text-gray-400">Cross-Dock Items</p>
            <p className="text-2xl font-black text-gray-900">89</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl mr-4"><Activity size={24} /></div>
          <div>
            <p className="text-sm font-bold text-gray-400">Available Vehicles</p>
            <p className="text-2xl font-black text-gray-900">8</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Live Trip Planning Queue</h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center font-black text-gray-400">T{i}</div>
                  <div>
                    <p className="font-bold text-gray-900">Trip TRP-00{i}</p>
                    <p className="text-sm font-medium text-gray-500">DXB → AUH (2 stops)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">75% Load</p>
                    <p className="text-xs text-emerald-600 font-bold">Optimal</p>
                  </div>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg uppercase tracking-wider">Planned</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Alerts</h2>
          <div className="space-y-4 flex-1 overflow-y-auto">
            <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-xl">
              <AlertCircle className="text-amber-600 mt-0.5" size={18} shrink-0 />
              <div>
                <p className="text-sm font-bold text-amber-900">Heavy Traffic on E11</p>
                <p className="text-xs text-amber-700 font-medium">Affecting Trip TRP-002 ETA</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-rose-50 rounded-xl">
              <Calendar className="text-rose-600 mt-0.5" size={18} shrink-0 />
              <div>
                <p className="text-sm font-bold text-rose-900">Maintenance Overdue</p>
                <p className="text-xs text-rose-700 font-medium">Vehicle DXB-78901 requires service</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
