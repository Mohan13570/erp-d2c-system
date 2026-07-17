import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Package, Anchor, Plane, Truck, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export default function EnterpriseBookingDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Use internal api proxy if applicable or absolute url
      const res = await fetch(`http://localhost:5000/api/logistics/booking`);
      const json = await res.json();
      if (json.success) {
        setBookings(json.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'Ocean Freight': return <Anchor className="text-blue-500" size={18} />;
      case 'Air Freight': return <Plane className="text-sky-500" size={18} />;
      case 'Road Transport': return <Truck className="text-emerald-500" size={18} />;
      default: return <Package className="text-gray-500" size={18} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'Draft': 'bg-gray-100 text-gray-700 border-gray-200',
      'Confirmed': 'bg-blue-50 text-blue-700 border-blue-200',
      'In-Transit': 'bg-amber-50 text-amber-700 border-amber-200',
      'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Cancelled': 'bg-red-50 text-red-700 border-red-200',
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status] || styles['Draft']}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Booking Details</h1>
          <p className="text-sm text-gray-500 mt-1">Manage global enterprise freight bookings and consignments</p>
        </div>
        <Link 
          to="/logistics/bookings/create"
          className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium text-sm"
        >
          <Plus size={18} />
          <span>Create Booking</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by BKG number, customer, or origin..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto justify-center">
            <Filter size={16} />
            <span>Advanced Filters</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-gray-700 font-semibold border-b border-gray-100 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Booking Info</th>
                <th className="px-6 py-4">Service & Route</th>
                <th className="px-6 py-4">Sender</th>
                <th className="px-6 py-4">Receiver</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-gray-500 font-medium">Loading Bookings...</p>
                    </div>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                        <Package className="text-gray-400" size={32} />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">No Bookings Found</h3>
                      <p className="mt-1 text-gray-500">There are no freight bookings currently recorded.</p>
                      <Link to="/logistics/bookings/create" className="mt-4 text-indigo-600 font-medium hover:text-indigo-700">Create the first booking &rarr;</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.filter(b => b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  (b.sender?.companyName || '').toLowerCase().includes(searchQuery.toLowerCase())).map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                          {getServiceIcon(booking.serviceType)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{booking.bookingNumber}</div>
                          <div className="text-xs text-gray-500 mt-0.5 uppercase tracking-wide">{booking.bookingType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{booking.serviceType}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{booking.tradeType}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 max-w-[150px] truncate">{booking.sender?.companyName || 'N/A'}</div>
                      <div className="text-xs text-gray-500 mt-0.5 flex items-center"><MapPin size={10} className="mr-1"/> {booking.sender?.city || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 max-w-[150px] truncate">{booking.receiver?.companyName || 'N/A'}</div>
                      <div className="text-xs text-gray-500 mt-0.5 flex items-center"><MapPin size={10} className="mr-1"/> {booking.receiver?.city || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-700">
                        {booking.expectedPickup ? format(new Date(booking.expectedPickup), 'dd MMM yyyy') : 'TBD'}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center mt-0.5">
                        <Calendar size={10} className="mr-1"/> Pickup Date
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(booking.bookingStatus)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && bookings.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/30">
            <div>Showing 1 to {bookings.length} of {bookings.length} entries</div>
            <div className="flex space-x-1">
              <button className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-50" disabled>Prev</button>
              <button className="px-3 py-1 border border-gray-200 rounded bg-indigo-50 text-indigo-600 font-medium">1</button>
              <button className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
