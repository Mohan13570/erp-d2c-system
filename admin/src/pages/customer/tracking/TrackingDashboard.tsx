import React from 'react';
import { Package, Truck, Clock, AlertTriangle, Map, Box, CheckCircle, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockShipments = [
  { id: 'TRK-9901', ref: 'BKG-772910', status: 'In Transit', progress: 65, eta: 'Oct 28, 2026', location: 'Pacific Ocean (Lat: 34.05, Lng: -118.24)' },
  { id: 'TRK-9902', ref: 'BKG-881023', status: 'Delayed', progress: 40, eta: 'Oct 29, 2026', location: 'Customs Hold - JFK' },
  { id: 'TRK-9903', ref: 'BKG-112044', status: 'Out for Delivery', progress: 90, eta: 'Today', location: 'Local Distribution Center' }
];

export default function TrackingDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipment Tracking & Visibility</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time GPS tracking, status milestones, and warehouse visibility</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Shipments', value: '45', icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'In Transit', value: '28', icon: Navigation, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Exceptions / Delayed', value: '3', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Delivered (Last 7d)', value: '14', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
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
            <h2 className="text-lg font-bold text-gray-900">Active Shipments Overview</h2>
          </div>
          <div className="space-y-6">
            {mockShipments.map(shipment => (
              <div key={shipment.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Link to={`/customer/tracking/timeline/${shipment.id}`} className="text-lg font-bold text-indigo-600 hover:underline">{shipment.id}</Link>
                    <p className="text-sm text-gray-500">Ref: {shipment.ref}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    shipment.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                    shipment.status === 'Delayed' ? 'bg-red-100 text-red-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {shipment.status}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1 text-gray-500">
                    <span>Progress</span>
                    <span>{shipment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${shipment.status === 'Delayed' ? 'bg-red-500' : 'bg-indigo-600'}`} style={{ width: `${shipment.progress}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center text-gray-700">
                    <Map size={16} className="mr-2 text-gray-400" />
                    <span className="truncate" title={shipment.location}>{shipment.location}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock size={16} className="mr-2 text-gray-400" />
                    ETA: <span className="font-semibold ml-1 text-gray-900">{shipment.eta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Tools</h2>
            <div className="grid grid-cols-1 gap-3">
              <Link to="/customer/tracking/map" className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-colors">
                <div className="flex items-center space-x-3 text-indigo-700">
                  <Map size={20} />
                  <span className="font-semibold text-sm">Live GPS Map View</span>
                </div>
              </Link>
              <Link to="/customer/tracking/warehouse" className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Box size={20} />
                  <span className="font-semibold text-sm">Warehouse Visibility</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
