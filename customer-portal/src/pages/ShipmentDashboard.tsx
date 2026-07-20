import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Package, Truck, Clock, MapPin, QrCode, ArrowLeft, Building2, User, Loader2 } from 'lucide-react';

const api = axios.create({ baseURL: 'http://localhost:5000/api/v1' });

export default function ShipmentDashboard() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: shipment, isLoading } = useQuery({
    queryKey: ['shipment', id],
    queryFn: () => api.get(`/shipments/${id}`).then(res => res.data.data),
    refetchInterval: 5000
  });

  const [newEvent, setNewEvent] = useState({ status: 'In Transit', location: '', description: '' });

  const eventMutation = useMutation({
    mutationFn: () => api.post(`/shipments/tracking/${shipment.tracking.id}/events`, newEvent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipment', id] });
      setNewEvent({ status: 'In Transit', location: '', description: '' });
    }
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  if (!shipment) return <div className="p-12 text-center text-red-500">Shipment not found.</div>;

  const tracking = shipment.tracking;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <Link to={`/booking/${shipment.bookingId}`} className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Booking
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{shipment.shipmentNumber}</h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
              {shipment.status}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-2">Reference: {shipment.shipmentReference}</p>
        </div>

        {tracking && (
          <div className="text-right flex items-center gap-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Master Tracking</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono font-bold text-lg">
                <QrCode className="w-5 h-5 text-blue-600" /> {tracking.trackingNumber}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Operations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tracking Status */}
          {tracking && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" /> Live Tracking
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Current Status</p>
                  <p className="font-semibold text-blue-600">{tracking.currentStatus}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Current Location</p>
                  <p className="font-semibold">{tracking.currentLocation || 'Unknown'}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Est. Delivery</p>
                  <p className="font-semibold">{tracking.estimatedDelivery ? new Date(tracking.estimatedDelivery).toLocaleDateString() : 'Pending'}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Origin</p>
                  <p className="font-semibold">{shipment.booking?.origin}</p>
                </div>
              </div>

              {/* Public Timeline */}
              <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700 space-y-8">
                {tracking.events?.map((ev: any) => (
                  <div key={ev.id} className="relative">
                    <span className="absolute -left-[33px] w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-slate-900"></span>
                    <p className="font-semibold text-slate-900 dark:text-white">{ev.status} <span className="text-sm font-normal text-slate-500">• {ev.location}</span></p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ev.description}</p>
                    <p className="text-xs text-slate-400 mt-2">{new Date(ev.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Action: Update Tracking */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
             <h3 className="text-sm font-semibold mb-4 text-slate-500 uppercase tracking-wider">Operator Action: Log Event</h3>
             <div className="flex gap-3">
               <input 
                 value={newEvent.status} 
                 onChange={e => setNewEvent({...newEvent, status: e.target.value})} 
                 placeholder="Status (e.g. Arrived at Sort Facility)" 
                 className="flex-1 px-3 py-2 border rounded-lg dark:bg-slate-950 text-sm" 
               />
               <input 
                 value={newEvent.location} 
                 onChange={e => setNewEvent({...newEvent, location: e.target.value})} 
                 placeholder="Location (e.g. London Hub)" 
                 className="flex-1 px-3 py-2 border rounded-lg dark:bg-slate-950 text-sm" 
               />
             </div>
             <input 
                value={newEvent.description} 
                onChange={e => setNewEvent({...newEvent, description: e.target.value})} 
                placeholder="Description" 
                className="w-full mt-3 px-3 py-2 border rounded-lg dark:bg-slate-950 text-sm" 
              />
             <button 
               onClick={() => eventMutation.mutate()} 
               className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700"
             >
               Post Tracking Event
             </button>
          </div>
        </div>

        {/* Right Col: Assignments & Logistics */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" /> Resource Allocations
            </h3>
            <div className="space-y-3">
              {shipment.allocations?.length === 0 ? (
                <p className="text-sm text-slate-500">No resources assigned yet.</p>
              ) : (
                shipment.allocations?.map((a: any) => (
                  <div key={a.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">{a.resourceType}</p>
                      <p className="text-sm font-medium">{a.resourceName || a.resourceId}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">{a.status}</span>
                  </div>
                ))
              )}
              <button className="w-full py-2 border-2 border-dashed border-slate-200 text-sm font-medium text-slate-500 rounded-xl hover:bg-slate-50 transition-colors">
                + Assign Resource
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" /> Schedules
            </h3>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 rounded-xl text-sm mb-3">
              <p className="font-semibold mb-1">Pickup Schedule</p>
              {shipment.pickups?.[0] ? (
                 <p>{new Date(shipment.pickups[0].pickupDate).toLocaleDateString()} - {shipment.pickups[0].pickupTeam}</p>
              ) : <p>Not Scheduled</p>}
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 rounded-xl text-sm">
              <p className="font-semibold mb-1">Delivery Schedule</p>
              {shipment.deliveries?.[0] ? (
                 <p>{new Date(shipment.deliveries[0].deliveryDate).toLocaleDateString()} - {shipment.deliveries[0].deliveryTeam}</p>
              ) : <p>Not Scheduled</p>}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
