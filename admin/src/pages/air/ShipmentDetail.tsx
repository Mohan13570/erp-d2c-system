import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plane, FileText, CheckCircle2, Clock, MapPin, Truck, AlertTriangle } from 'lucide-react';

export default function ShipmentDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/air/bookings/${id}`).then(r => r.json()).then(setBooking);
  }, [id]);

  const generateAWB = async (type: string) => {
    const res = await fetch('/api/air/documents/waybill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: id, awbType: type })
    });
    if (res.ok) {
      window.location.reload();
    }
  };

  const updateMilestone = async (code: string, desc: string) => {
    await fetch(`/api/air/bookings/${id}/milestones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestoneCode: code, description: desc, location: booking.originAirport?.iataCode })
    });
    window.location.reload();
  };

  if (!booking) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900 flex items-center">
          <Plane className="mr-3 text-sky-600" /> Air Shipment: {booking.bookingNumber}
        </h1>
        <span className="bg-sky-100 text-sky-700 px-4 py-2 rounded-full font-bold">{booking.status}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="text-center">
              <div className="text-3xl font-black text-gray-900">{booking.originAirport?.iataCode}</div>
              <div className="text-sm font-bold text-gray-500">{booking.originAirport?.name}</div>
            </div>
            <div className="flex-1 flex flex-col items-center px-8 relative">
              <div className="w-full h-1 bg-gray-200 rounded-full relative">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-500 bg-white px-2">
                   <Plane size={24} />
                 </div>
              </div>
              <div className="text-xs font-bold text-gray-400 mt-4">Direct Flight</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-gray-900">{booking.destAirport?.iataCode}</div>
              <div className="text-sm font-bold text-gray-500">{booking.destAirport?.name}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Cargo Summary</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
               <div className="bg-gray-50 p-4 rounded-xl">
                 <div className="text-sm font-bold text-gray-500">Gross Weight</div>
                 <div className="text-xl font-black">{booking.totalGrossWeight} kg</div>
               </div>
               <div className="bg-gray-50 p-4 rounded-xl">
                 <div className="text-sm font-bold text-gray-500">Chargeable Weight</div>
                 <div className="text-xl font-black text-sky-600">{booking.totalChargeableWeight} kg</div>
               </div>
               <div className="bg-gray-50 p-4 rounded-xl">
                 <div className="text-sm font-bold text-gray-500">Total Volume</div>
                 <div className="text-xl font-black">{booking.totalVolume.toFixed(2)} cbm</div>
               </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-xl font-bold text-gray-900">Documents & AWBs</h2>
            </div>
            <div className="space-y-3">
              {booking.waybills.map((awb: any) => (
                <div key={awb.id} className="flex justify-between items-center p-3 border rounded-xl bg-gray-50">
                  <div className="flex items-center"><FileText className="mr-3 text-sky-600" /> <span className="font-bold">{awb.awbType}: {awb.awbNumber}</span></div>
                  <span className="text-sm font-bold text-emerald-600">Issued</span>
                </div>
              ))}
              
              <div className="flex gap-4 pt-2">
                <button onClick={() => generateAWB('HAWB')} className="flex-1 bg-gray-100 font-bold text-gray-700 py-2 rounded-xl hover:bg-gray-200">Generate HAWB</button>
                <button onClick={() => generateAWB('MAWB')} className="flex-1 bg-gray-100 font-bold text-gray-700 py-2 rounded-xl hover:bg-gray-200">Generate MAWB</button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Shipment Timeline</h2>
           <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
             {booking.milestones.map((m: any, i: number) => (
               <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                 <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-[.is-active]:bg-emerald-500 group-[.is-active]:text-emerald-50 group-[.is-active]:shadow-emerald-200">
                   <CheckCircle2 size={16} />
                 </div>
                 <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                   <div className="flex items-center justify-between space-x-2 mb-1">
                     <div className="font-bold text-slate-900">{m.description}</div>
                     <time className="text-xs font-medium text-amber-500">{new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</time>
                   </div>
                   <div className="text-xs text-slate-500">{m.milestoneCode} • {m.location || 'System'}</div>
                 </div>
               </div>
             ))}
           </div>
           
           <div className="mt-8 border-t pt-4 grid grid-cols-2 gap-2">
             <button onClick={() => updateMilestone('RCS', 'Cargo Received at Terminal')} className="text-xs bg-gray-100 p-2 rounded font-bold hover:bg-gray-200">Receive Cargo</button>
             <button onClick={() => updateMilestone('DEP', 'Flight Departed')} className="text-xs bg-gray-100 p-2 rounded font-bold hover:bg-gray-200">Depart Flight</button>
           </div>
        </div>
      </div>
    </div>
  );
}
