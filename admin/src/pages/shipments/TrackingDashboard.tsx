import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Activity, AlertTriangle, Truck, CheckCircle, Package, Clock, Hash, User, MapPin, Target, Send, ShieldAlert
} from 'lucide-react';

// Static fallbacks for missing DB hookups in 6.1 demo
const DEMO_KPIS = {
  activeShipments: 142,
  delayedShipments: 3,
  todayDeliveries: 18,
  completed: 890,
  inTransit: 55,
  pickupPending: 24
};

const DEMO_CONTEXT = {
  trackingNumber: 'TRK-90218-444',
  bookingNumber: 'BKG-77123',
  customer: 'Acme Global Logistics',
  origin: 'WH-NY-01, New York, USA',
  destination: 'WH-CHI-01, Chicago, USA',
  status: 'In Transit',
  eta: '2026-07-23 14:00',
  currentLocation: 'I-80 W, Pennsylvania',
  driver: 'Sam Johnson',
  vehicle: 'TRK-990 (Volvo VNL)',
  transportMode: 'ROAD_FREIGHT',
  priority: 'High Priority'
};

export default function TrackingDashboard() {
  const { id } = useParams();
  const [kpis, setKpis] = useState(DEMO_KPIS);
  const [context, setContext] = useState(DEMO_CONTEXT);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-8">
      
      {/* 1. TOP HEADER & TITLE */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-600" /> Executive Tracking Dashboard
          </h1>
          <p className="text-slate-500 mt-1">High-level operational visibility for shipment tracking.</p>
        </div>
      </div>

      {/* 2. KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500 flex flex-col items-center text-center">
          <Truck className="w-6 h-6 text-blue-500 mb-2" />
          <h3 className="text-3xl font-black text-slate-900">{kpis.activeShipments}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Active</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-red-500 flex flex-col items-center text-center">
          <AlertTriangle className="w-6 h-6 text-red-500 mb-2" />
          <h3 className="text-3xl font-black text-slate-900">{kpis.delayedShipments}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Delayed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500 flex flex-col items-center text-center">
          <Clock className="w-6 h-6 text-amber-500 mb-2" />
          <h3 className="text-3xl font-black text-slate-900">{kpis.todayDeliveries}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Today's Del.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500 flex flex-col items-center text-center">
          <CheckCircle className="w-6 h-6 text-emerald-500 mb-2" />
          <h3 className="text-3xl font-black text-slate-900">{kpis.completed}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Completed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-indigo-500 flex flex-col items-center text-center">
          <Send className="w-6 h-6 text-indigo-500 mb-2" />
          <h3 className="text-3xl font-black text-slate-900">{kpis.inTransit}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">In Transit</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-purple-500 flex flex-col items-center text-center">
          <Package className="w-6 h-6 text-purple-500 mb-2" />
          <h3 className="text-3xl font-black text-slate-900">{kpis.pickupPending}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Pickup Pend.</p>
        </div>

      </div>

      {/* 3. INDIVIDUAL SHIPMENT CONTEXT */}
      <h2 className="text-xl font-black text-slate-900 tracking-tight mb-4">Focused Shipment Context</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative overflow-hidden">
        
        {/* Background Decorative Blob */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-50 opacity-50 blur-3xl pointer-events-none"></div>

        {/* Column 1: Core Identifiers */}
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2"><Hash className="w-3.5 h-3.5" /> Tracking Number</p>
            <p className="text-2xl font-black text-slate-900 font-mono bg-slate-100 px-3 py-1 rounded inline-block">{context.trackingNumber}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2"><Hash className="w-3.5 h-3.5" /> Booking Number</p>
            <p className="text-lg font-bold text-slate-700 font-mono">{context.bookingNumber}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2"><User className="w-3.5 h-3.5" /> Customer</p>
            <p className="text-sm font-bold text-blue-600">{context.customer}</p>
          </div>
        </div>

        {/* Column 2: Status & Geography */}
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2"><Activity className="w-3.5 h-3.5" /> Current Status</p>
            <p className="text-lg font-black text-indigo-600 uppercase tracking-wide">{context.status}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Origin</p>
            <p className="text-sm font-bold text-slate-700">{context.origin}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2"><Target className="w-3.5 h-3.5" /> Destination</p>
            <p className="text-sm font-bold text-slate-700">{context.destination}</p>
          </div>
        </div>

        {/* Column 3: Telemetry & Transport */}
        <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-slate-400" /> Expected Delivery (ETA)</p>
            <p className="text-lg font-black text-slate-900">{context.eta}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-blue-500" /> Live Current Location</p>
            <p className="text-sm font-bold text-slate-700">{context.currentLocation}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Assigned Driver</p>
              <p className="text-xs font-bold text-slate-700">{context.driver}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Assigned Vehicle</p>
              <p className="text-xs font-bold text-slate-700">{context.vehicle}</p>
            </div>
          </div>
          <div className="pt-2 flex gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded">{context.transportMode}</span>
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> {context.priority}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
