import React, { useState } from 'react';
import { Clock, Search, MapPin } from 'lucide-react';

export default function ShipmentTimeline() {
  const [bookingId, setBookingId] = useState('');
  const [events, setEvents] = useState([]);
  const [searched, setSearched] = useState(false);

  const fetchTimeline = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/ocean/tracking/timeline/${bookingId}`);
      if (res.ok) {
         setEvents(await res.json());
         setSearched(true);
      }
    } catch (e) {
      alert("Failed to load timeline.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
           <Clock size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipment Timeline</h1>
          <p className="text-gray-500 text-sm">End-to-end tracking of Bookings and Container milestones.</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-8">
         <input type="text" className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
                placeholder="Enter Booking UUID..." value={bookingId} onChange={e => setBookingId(e.target.value)} />
         <button onClick={fetchTimeline} className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-sm shadow-blue-200 hover:bg-blue-700">
            <Search size={18}/> <span>Track</span>
         </button>
      </div>

      {searched && (
         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            {events.length === 0 ? (
               <div className="text-center text-gray-500 py-8">No milestones found for this booking.</div>
            ) : (
               <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:to-blue-100">
                  {events.map((ev: any, idx: number) => (
                     <div key={ev.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                           <MapPin size={16} />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                           <div className="flex items-center justify-between space-x-2 mb-1">
                              <div className="font-bold text-gray-900">{ev.status}</div>
                              <time className="text-xs font-medium text-blue-600">{new Date(ev.createdAt).toLocaleDateString()}</time>
                           </div>
                           <div className="text-sm text-gray-600">{ev.description}</div>
                           <div className="text-xs text-gray-400 mt-2 font-medium">By: {ev.performedBy}</div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      )}
    </div>
  );
}
