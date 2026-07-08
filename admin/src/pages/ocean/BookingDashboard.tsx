import React, { useState, useEffect } from 'react';
import { Anchor, Plus, Search, Filter, Ship, MoreVertical, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OceanBooking {
  id: string;
  bookingNumber: string;
  status: string;
  freightType: string;
  shipper: string;
  consignee: string;
  pol: { name: string; code: string } | null;
  pod: { name: string; code: string } | null;
  vessel: { name: string } | null;
  expectedDeparture: string;
}

export default function BookingDashboard() {
  const [bookings, setBookings] = useState<OceanBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ocean/bookings')
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setIsLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Draft': return 'bg-gray-100 text-gray-700';
      case 'Pending Approval': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Loaded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Anchor className="text-indigo-600" /> Ocean Freight Control Tower
          </h1>
          <p className="text-gray-500 mt-1">Manage global maritime bookings and container allocations.</p>
        </div>
        <Link to="/ocean/bookings/new" className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-indigo-700 transition">
          <Plus size={18} />
          <span>New Ocean Booking</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center space-x-4">
           <div className="relative flex-1 max-w-md">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input type="text" placeholder="Search booking, vessel, or shipper..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
           </div>
           <button className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 flex items-center space-x-2">
             <Filter size={18} /> <span>Filters</span>
           </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm font-semibold">
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Status</th>
                <th className="p-4">Route (POL → POD)</th>
                <th className="p-4">Vessel</th>
                <th className="p-4">Shipper / Consignee</th>
                <th className="p-4">ETD</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Loading bookings...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">No active bookings.</td></tr>
              ) : bookings.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 transition group">
                  <td className="p-4">
                    <Link to={`/ocean/bookings/${b.id}`} className="font-semibold text-indigo-600 hover:underline">{b.bookingNumber}</Link>
                    <div className="text-xs text-gray-500 mt-0.5">{b.freightType}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2 text-sm font-medium text-gray-900">
                       <span>{b.pol?.code || 'TBA'}</span>
                       <Ship size={14} className="text-gray-400" />
                       <span>{b.pod?.code || 'TBA'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{b.vessel?.name || 'Unassigned'}</td>
                  <td className="p-4">
                     <div className="text-sm font-medium text-gray-900">{b.shipper || 'N/A'}</div>
                     <div className="text-xs text-gray-500">{b.consignee || 'N/A'}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{b.expectedDeparture ? new Date(b.expectedDeparture).toLocaleDateString() : 'TBD'}</td>
                  <td className="p-4">
                     <button className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition">
                       <MoreVertical size={18} />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
