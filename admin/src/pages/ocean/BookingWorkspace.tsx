import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Anchor, CheckCircle, FileText, Send, Clock, ShieldCheck, Printer } from 'lucide-react';

export default function BookingWorkspace() {
  const { id } = useParams();
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/ocean/bookings/${id}`)
      .then(res => res.json())
      .then(data => setBooking(data));
  }, [id]);

  const handleApprove = async () => {
    await fetch(`http://localhost:5000/api/ocean/bookings/${id}/approve`, { method: 'POST' });
    window.location.reload();
  };

  const generateMBL = async () => {
    await fetch(`http://localhost:5000/api/ocean/bookings/${id}/documents`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType: 'MBL', payload: { shipper: booking.shipper }})
    });
    window.location.reload();
  };

  if (!booking) return <div className="p-8">Loading booking details...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3">
             <h1 className="text-2xl font-bold text-gray-900">{booking.bookingNumber}</h1>
             <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">{booking.freightType}</span>
             <span className={`px-3 py-1 text-xs font-semibold rounded-full ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {booking.status}
             </span>
          </div>
          <p className="text-gray-500 mt-1">Shipper: {booking.shipper} → Consignee: {booking.consignee}</p>
        </div>
        {booking.status === 'Draft' && (
          <button onClick={handleApprove} className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 shadow-sm hover:bg-green-700">
             <CheckCircle size={18} /> <span>Approve Booking</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
           <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
             <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Routing Details</h2>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <div className="text-sm text-gray-500">Port of Loading (POL)</div>
                   <div className="font-medium text-gray-900">{booking.pol?.name || 'Not Set'}</div>
                </div>
                <div>
                   <div className="text-sm text-gray-500">Port of Discharge (POD)</div>
                   <div className="font-medium text-gray-900">{booking.pod?.name || 'Not Set'}</div>
                </div>
                <div>
                   <div className="text-sm text-gray-500">Carrier Vessel</div>
                   <div className="font-medium text-gray-900">{booking.vessel?.name || 'Pending Assignment'}</div>
                </div>
             </div>
           </div>

           <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
             <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Cargo Declarations</h2>
             {booking.cargos.map((cargo: any) => (
                <div key={cargo.id} className="p-4 bg-gray-50 rounded-xl mb-3 flex items-center justify-between">
                   <div>
                      <p className="font-medium text-gray-900">{cargo.description || 'General Cargo'}</p>
                      <p className="text-xs text-gray-500">Vol: {cargo.volumeCbm || 0} CBM | Wgt: {cargo.weightKg || 0} KG</p>
                   </div>
                   {cargo.isDangerousGoods && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full flex items-center space-x-1">
                         <ShieldCheck size={14} /> <span>HAZMAT</span>
                      </span>
                   )}
                </div>
             ))}
           </div>
        </div>

        <div className="col-span-1 space-y-6">
           <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
             <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2 flex items-center justify-between">
               <span>Document Center</span>
               <button onClick={generateMBL} className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs hover:bg-indigo-100 transition flex items-center gap-1">
                  <Plus size={12}/> Generate MBL
               </button>
             </h2>
             <div className="space-y-3">
                {booking.documents.length === 0 ? (
                   <p className="text-sm text-gray-500">No documents issued yet.</p>
                ) : booking.documents.map((doc: any) => (
                   <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                      <div className="flex items-center space-x-3">
                         <FileText className="text-blue-500" size={18} />
                         <div>
                            <p className="text-sm font-medium text-gray-900">{doc.documentType}</p>
                            <p className="text-xs text-gray-500">{doc.documentNumber}</p>
                         </div>
                      </div>
                      <Printer size={16} className="text-gray-400 hover:text-gray-900" />
                   </div>
                ))}
             </div>
           </div>

           <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
             <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Audit Timeline</h2>
             <div className="space-y-4">
                {booking.events.map((evt: any) => (
                   <div key={evt.id} className="flex space-x-3">
                      <div className="mt-1"><Clock size={14} className="text-gray-400" /></div>
                      <div>
                         <p className="text-sm font-medium text-gray-900">{evt.status}</p>
                         <p className="text-xs text-gray-500">{evt.description}</p>
                         <p className="text-[10px] text-gray-400 mt-0.5">{new Date(evt.createdAt).toLocaleString()} by {evt.performedBy}</p>
                      </div>
                   </div>
                ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
