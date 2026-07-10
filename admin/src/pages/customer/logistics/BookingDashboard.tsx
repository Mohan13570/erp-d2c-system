import React, { useState } from 'react';
import { Package, Navigation, Search, Filter, Plus, FileText, Anchor, Truck, Plane, MapPin, Calendar, Clock, ArrowRight, DollarSign, Target, Briefcase, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', bookings: 4, quotes: 2 },
  { name: 'Tue', bookings: 7, quotes: 5 },
  { name: 'Wed', bookings: 5, quotes: 3 },
  { name: 'Thu', bookings: 12, quotes: 8 },
  { name: 'Fri', bookings: 9, quotes: 4 },
  { name: 'Sat', bookings: 3, quotes: 1 },
  { name: 'Sun', bookings: 2, quotes: 0 },
];

const mockBookings = [
  { id: 'BKG-772910', origin: 'Shanghai, CN', destination: 'Los Angeles, US', mode: 'Ocean', status: 'Pending', date: 'Oct 24, 2026' },
  { id: 'BKG-881023', origin: 'Frankfurt, DE', destination: 'New York, US', mode: 'Air', status: 'Confirmed', date: 'Oct 25, 2026' },
  { id: 'BKG-992011', origin: 'Mumbai, IN', destination: 'Dubai, AE', mode: 'Ocean', status: 'Draft', date: 'Oct 26, 2026' }
];

export default function BookingDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logistics Control Tower</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all your global shipments, RFQs, and tracking</p>
        </div>
        <Link to="/customer/logistics/booking/new" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center space-x-2 shadow-sm shadow-indigo-200 transition-all">
          <Plus size={18} />
          <span>New Booking</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Bookings', value: '24', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending RFQs', value: '7', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Upcoming Pickups', value: '3', icon: Truck, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Awaiting Approval', value: '2', icon: Clock, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Shipment Volume Trend</h2>
            <select className="text-sm border-gray-200 rounded-lg text-gray-600 focus:ring-indigo-500 focus:border-indigo-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorQuotes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="bookings" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" name="Bookings" />
                <Area type="monotone" dataKey="quotes" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorQuotes)" name="Quotes" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
            <Link to="/customer/logistics/bookings" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</Link>
          </div>
          <div className="space-y-4">
            {mockBookings.map((bkg, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all group cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    {bkg.mode === 'Ocean' ? <Anchor size={16} className="text-blue-500" /> : <Plane size={16} className="text-sky-500" />}
                    <span className="font-semibold text-gray-900">{bkg.id}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    bkg.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                    bkg.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {bkg.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                  <span className="truncate w-24">{bkg.origin}</span>
                  <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />
                  <span className="truncate w-24">{bkg.destination}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
