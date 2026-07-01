import React, { useState, useEffect } from 'react';
import { Plane, Plus, Search, Filter, Box, ArrowRight, CheckCircle2, AlertTriangle, Snowflake, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/air/bookings')
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <Plane className="mr-3 text-sky-600" size={32} /> Air Freight Bookings
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage air cargo shipments, MAWB/HAWBs, and flight routing.</p>
        </div>
        <Link to="/air/bookings/create" className="bg-sky-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-sky-700 transition flex items-center">
          <Plus size={20} className="mr-2" /> New Booking
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm">
              <th className="p-4 font-bold border-b border-gray-100">Booking #</th>
              <th className="p-4 font-bold border-b border-gray-100">Routing</th>
              <th className="p-4 font-bold border-b border-gray-100">Cargo Details</th>
              <th className="p-4 font-bold border-b border-gray-100">Status</th>
              <th className="p-4 font-bold border-b border-gray-100 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">No bookings found.</td></tr>
            ) : bookings.map((b: any) => (
              <tr key={b.id} className="hover:bg-gray-50/50 transition border-b border-gray-50">
                <td className="p-4">
                  <div className="font-bold text-gray-900">{b.bookingNumber}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(b.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2 text-sm font-semibold">
                    <span className="bg-gray-100 px-2 py-1 rounded-md">{b.originAirport?.iataCode || 'N/A'}</span>
                    <ArrowRight size={14} className="text-gray-400" />
                    <span className="bg-gray-100 px-2 py-1 rounded-md">{b.destAirport?.iataCode || 'N/A'}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-bold text-gray-700">{b.totalChargeableWeight} kg <span className="text-gray-400 font-normal">chargeable</span></div>
                  <div className="flex gap-2 mt-2">
                    {b.isDangerousGoods && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold flex items-center"><AlertTriangle size={10} className="mr-1"/>DGR</span>}
                    {b.isPerishable && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold flex items-center"><Snowflake size={10} className="mr-1"/>PER</span>}
                    {b.isValuable && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold flex items-center"><DollarSign size={10} className="mr-1"/>VAL</span>}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    b.status === 'Requested' ? 'bg-amber-100 text-amber-700' :
                    b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-sky-100 text-sky-700'
                  }`}>
                    {b.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link to={`/air/bookings/${b.id}`} className="text-sky-600 font-bold hover:text-sky-800 text-sm">
                    View Details &rarr;
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
