import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, Anchor, Truck, PackageCheck, AlertTriangle, Building2, MapPin } from 'lucide-react';

const mockEvents = [
  { id: 1, type: 'ORIGIN', title: 'Booking Confirmed', desc: 'Shipment booking processed and confirmed by system.', date: 'Oct 20, 2026 09:00 AM', icon: CheckCircle, color: 'bg-green-500' },
  { id: 2, type: 'PICKUP', title: 'Cargo Picked Up', desc: 'Driver secured cargo at factory location.', date: 'Oct 22, 2026 02:30 PM', icon: Truck, color: 'bg-blue-500' },
  { id: 3, type: 'PORT', title: 'Arrived at Port of Loading', desc: 'Container arrived at Shanghai Port gate.', date: 'Oct 23, 2026 11:15 AM', icon: Anchor, color: 'bg-blue-500' },
  { id: 4, type: 'TRANSIT', title: 'Loaded on Vessel', desc: 'Container loaded on Evergreen 1.', date: 'Oct 24, 2026 04:00 PM', icon: PackageCheck, color: 'bg-indigo-600', isCurrent: true },
  { id: 5, type: 'DESTINATION', title: 'Customs Clearance', desc: 'Pending arrival at Port of LA.', date: 'Expected: Oct 28', icon: Building2, color: 'bg-gray-300' },
  { id: 6, type: 'DELIVERY', title: 'Final Delivery', desc: 'To final destination.', date: 'Expected: Oct 29', icon: MapPin, color: 'bg-gray-300' },
];

export default function ShipmentTimeline() {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-end bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <Link to="/customer/tracking" className="text-indigo-600 text-sm font-medium hover:underline mb-2 inline-block">&larr; Back to Dashboard</Link>
          <h1 className="text-2xl font-bold text-gray-900">Shipment Timeline</h1>
          <p className="text-sm text-gray-500 mt-1">Detailed milestone events for Tracking ID: <span className="font-mono font-bold text-gray-700">{id || 'TRK-9901'}</span></p>
        </div>
        <div className="text-right">
           <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Current Status</p>
           <p className="text-lg font-bold text-indigo-600">In Transit (Ocean)</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="relative border-l-2 border-gray-100 ml-4 space-y-8">
          {mockEvents.map((event, idx) => {
            const isFuture = event.color === 'bg-gray-300';
            return (
              <div key={event.id} className="relative pl-8">
                {/* Timeline Node */}
                <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full ${event.color} flex items-center justify-center ring-4 ring-white shadow-sm ${event.isCurrent ? 'ring-indigo-100 animate-pulse' : ''}`}>
                  <event.icon size={14} className="text-white" />
                </div>
                
                {/* Content */}
                <div className={`bg-gray-50 p-4 rounded-xl border ${event.isCurrent ? 'border-indigo-200 shadow-sm' : 'border-gray-100'} ${isFuture ? 'opacity-60' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold ${isFuture ? 'text-gray-500' : 'text-gray-900'}`}>{event.title}</h3>
                    <span className="text-xs font-semibold text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">{event.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{event.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
