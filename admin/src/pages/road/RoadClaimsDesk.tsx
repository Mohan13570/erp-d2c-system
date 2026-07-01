import React, { useState, useEffect } from 'react';
import { ShieldAlert, Image, CheckCircle, XCircle } from 'lucide-react';

export default function RoadClaimsDesk() {
  const [claims, setClaims] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/road/claims').then(res => res.json()).then(setClaims).catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 flex items-center">
          <ShieldAlert className="mr-3 text-rose-600" size={32} /> Claims & POD Desk
        </h1>
        <p className="text-gray-500 font-medium mt-1">Review Proof of Deliveries, cargo damages, and insurance claims.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center border-b border-gray-100 pb-4">
           Active Claims Registry
        </h2>
        
        <div className="space-y-4">
          {claims.map((c) => (
            <div key={c.id} className="flex gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-bold rounded uppercase tracking-wider ${
                    c.type === 'DAMAGE' ? 'bg-rose-100 text-rose-700' : 
                    c.type === 'MISSING' ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {c.type}
                  </span>
                  <span className="text-sm font-mono font-bold text-gray-500">Booking: {c.booking?.bookingNumber}</span>
                </div>
                <p className="font-medium text-gray-900">{c.description}</p>
                <p className="text-sm text-gray-500 font-bold">Claimed Amount: ${c.claimAmount} {c.currency}</p>
              </div>
              <div className="flex flex-col space-y-2 justify-center shrink-0 border-l border-gray-200 pl-6">
                <span className="text-xs font-bold text-gray-400 uppercase text-center mb-1">Status</span>
                <span className={`px-4 py-2 text-sm font-black rounded-xl uppercase tracking-wider text-center ${
                  c.status === 'OPEN' ? 'bg-blue-100 text-blue-700' :
                  c.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                  c.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-gray-200 text-gray-700'
                }`}>
                  {c.status}
                </span>
                {c.status === 'OPEN' && (
                  <div className="flex space-x-2 mt-2">
                    <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"><CheckCircle size={18} /></button>
                    <button className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100"><XCircle size={18} /></button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {claims.length === 0 && <p className="text-gray-400 text-sm font-medium italic text-center p-8">No active claims found.</p>}
        </div>
      </div>
    </div>
  );
}
