import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  CheckCircle, Clock, Truck, Package, Anchor, AlertTriangle, User, MapPin, Search
} from 'lucide-react';

const ICONS: Record<string, React.ReactNode> = {
  'Booking Created': <Clock className="w-5 h-5 text-slate-500" />,
  'Booking Approved': <CheckCircle className="w-5 h-5 text-emerald-500" />,
  'Shipment Created': <Package className="w-5 h-5 text-blue-500" />,
  'Vehicle Assigned': <Truck className="w-5 h-5 text-indigo-500" />,
  'Driver Assigned': <User className="w-5 h-5 text-purple-500" />,
  'Picked Up': <Package className="w-5 h-5 text-emerald-600" />,
  'In Transit': <Anchor className="w-5 h-5 text-blue-600" />,
  'Customs Clearance': <AlertTriangle className="w-5 h-5 text-amber-500" />,
  'Out For Delivery': <Truck className="w-5 h-5 text-purple-600" />,
  'Delivered': <CheckCircle className="w-5 h-5 text-emerald-600" />,
};

// Simulated mock data for 6.2 visual demonstration without hitting a blank DB
const MOCK_EVENTS = [
  { id: '1', status: 'Delivered', timestamp: '2026-07-22T14:30:00Z', remarks: 'POD Signed by John Doe', location: 'Warehouse 4, Destination', updatedBy: 'Driver Sam' },
  { id: '2', status: 'Out For Delivery', timestamp: '2026-07-22T08:15:00Z', remarks: 'Loaded onto final delivery truck', location: 'Distribution Center Hub', updatedBy: 'Dispatcher Mike' },
  { id: '3', status: 'In Transit', timestamp: '2026-07-21T09:00:00Z', remarks: 'Departed Origin Port', location: 'Origin Port', updatedBy: 'System' },
  { id: '4', status: 'Customs Clearance', timestamp: '2026-07-20T16:45:00Z', remarks: 'Cleared Customs - No issues', location: 'Customs Office', updatedBy: 'Agent Smith' },
  { id: '5', status: 'Picked Up', timestamp: '2026-07-20T10:00:00Z', remarks: 'Cargo collected from shipper', location: 'Shipper HQ', updatedBy: 'Driver Sam' },
  { id: '6', status: 'Vehicle Assigned', timestamp: '2026-07-19T14:20:00Z', remarks: 'Truck TRK-990 Assigned', location: 'HQ', updatedBy: 'System' },
  { id: '7', status: 'Booking Created', timestamp: '2026-07-19T09:00:00Z', remarks: 'Initial Booking Request', location: 'Portal', updatedBy: 'Customer Portal' },
];

export default function ShipmentTimeline() {
  const { id } = useParams();
  const [events, setEvents] = useState(MOCK_EVENTS);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-slate-900 px-8 py-6 flex items-center justify-between sticky top-0 z-10 shadow-md">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-400" /> Enterprise Audit Timeline
            </h1>
            <p className="text-slate-400 text-sm mt-1">Full historical trace for Shipment <span className="font-mono text-blue-300 font-bold">{id || 'TRK-90218-444'}</span></p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
            <Search className="w-4 h-4" /> Filter Events
          </button>
        </div>

        {/* TIMELINE LIST */}
        <div className="p-8 relative">
          <div className="absolute top-8 bottom-8 left-[3.25rem] w-0.5 bg-slate-200"></div>
          
          <div className="space-y-8">
            {events.map((event, index) => (
              <div key={event.id} className="flex gap-6 relative group">
                
                {/* ICON INDICATOR */}
                <div className="relative z-10 w-10 h-10 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shrink-0 group-hover:border-blue-500 transition-colors shadow-sm">
                  {ICONS[event.status] || <Clock className="w-5 h-5 text-slate-400" />}
                </div>

                {/* EVENT CARD */}
                <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group-hover:border-blue-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black text-slate-900">{event.status}</h3>
                    <span className="text-sm font-mono text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">{event.remarks}</p>
                  
                  <div className="flex items-center gap-6 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      {event.location || 'Unknown Location'}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                      <User className="w-3.5 h-3.5 text-purple-500" />
                      Updated By: <span className="text-slate-700">{event.updatedBy}</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
