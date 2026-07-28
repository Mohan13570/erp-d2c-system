import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, MapPin, Clock, CheckCircle, Truck, FileText } from 'lucide-react';

export default function PublicTracking() {
  const [searchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || '';
  
  const [trackingNumber, setTrackingNumber] = useState(initialRef);
  const [searched, setSearched] = useState(!!initialRef);

  // Mock data since we can't reliably fetch from a DB that might be empty right now
  const [shipmentData, setShipmentData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialRef) handleSearch(initialRef);
  }, [initialRef]);

  const handleSearch = (query: string) => {
    if (!query) return;
    setSearched(true);
    // Simulate API fetch delay
    setTimeout(() => {
      setShipmentData({
        trackingNumber: query,
        status: 'In Transit',
        origin: 'New York, USA',
        destination: 'Los Angeles, USA',
        expectedDelivery: '2026-07-24T14:00:00Z',
        cargo: [{ description: 'Electronics Pallet', packages: 12 }],
        timeline: [
          { status: 'In Transit', timestamp: '2026-07-21T09:00:00Z', location: 'Chicago, IL', remarks: 'Departed sorting facility' },
          { status: 'Picked Up', timestamp: '2026-07-20T10:00:00Z', location: 'New York, NY', remarks: 'Package picked up' },
          { status: 'Shipment Created', timestamp: '2026-07-19T09:00:00Z', location: 'Portal', remarks: 'Tracking number assigned' }
        ]
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* PUBLIC HEADER */}
      <header className="bg-slate-900 text-white py-6 px-8 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-2xl font-black tracking-tight">LIZOME <span className="text-blue-400">TRACKING</span></h1>
          <p className="text-sm font-medium text-slate-400">Public Customer Portal</p>
        </div>
      </header>

      {/* SEARCH BANNER */}
      <div className="bg-blue-600 text-white py-16 px-8 flex flex-col items-center">
        <h2 className="text-4xl font-black mb-6 text-center">Track Your Shipment</h2>
        <div className="w-full max-w-2xl flex bg-white rounded-2xl overflow-hidden shadow-xl border-4 border-blue-500/30 focus-within:border-white transition-colors">
          <input 
            type="text" 
            placeholder="Enter Tracking Number (e.g. TRK-90218-444)" 
            className="flex-1 px-6 py-4 text-slate-900 font-bold outline-none text-lg placeholder:font-medium placeholder:text-slate-400"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(trackingNumber)}
          />
          <button 
            onClick={() => handleSearch(trackingNumber)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 font-black flex items-center gap-2 transition-colors"
          >
            <Search className="w-5 h-5" /> TRACK
          </button>
        </div>
      </div>

      {/* RESULTS AREA */}
      <main className="flex-1 flex justify-center p-8">
        {!searched ? (
          <div className="flex flex-col items-center justify-center text-slate-400 mt-20">
            <Package className="w-24 h-24 mb-6 opacity-20" />
            <h3 className="text-2xl font-bold tracking-tight">Awaiting Tracking Number</h3>
            <p className="mt-2 text-center max-w-md">Enter your tracking number above to see live updates, estimated delivery, and documentation.</p>
          </div>
        ) : !shipmentData ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 font-bold text-slate-500 tracking-widest uppercase">Locating Shipment...</p>
          </div>
        ) : (
          <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            
            {/* Status Header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6 mb-6">
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Tracking Number</p>
                  <h2 className="text-3xl font-black text-slate-900 font-mono bg-slate-100 px-3 py-1 rounded inline-block">{shipmentData.trackingNumber}</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Current Status</p>
                  <h3 className="text-2xl font-black text-indigo-600 uppercase tracking-wider">{shipmentData.status}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col">
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-2"><MapPin className="w-4 h-4 text-blue-500" /> Origin</span>
                  <span className="font-bold text-slate-800">{shipmentData.origin}</span>
                </div>
                <div className="flex flex-col">
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-2"><MapPin className="w-4 h-4 text-emerald-500" /> Destination</span>
                  <span className="font-bold text-slate-800">{shipmentData.destination}</span>
                </div>
                <div className="flex flex-col border-l border-slate-100 pl-8">
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-2"><Clock className="w-4 h-4 text-amber-500" /> Estimated Delivery</span>
                  <span className="font-black text-lg text-slate-900">{new Date(shipmentData.expectedDelivery).toLocaleDateString()}</span>
                  <span className="font-bold text-slate-500 text-sm">{new Date(shipmentData.expectedDelivery).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Timeline */}
              <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Tracking History</h3>
                <div className="relative">
                  <div className="absolute top-4 bottom-4 left-3 w-0.5 bg-slate-200"></div>
                  <div className="space-y-6">
                    {shipmentData.timeline.map((event: any, i: number) => (
                      <div key={i} className="flex gap-6 relative">
                        <div className={\`w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center shrink-0 z-10 \${i === 0 ? 'bg-blue-600' : 'bg-slate-300'}\`}></div>
                        <div className="flex-1 pb-6">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={\`font-black text-lg \${i === 0 ? 'text-blue-600' : 'text-slate-700'}\`}>{event.status}</h4>
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{new Date(event.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-slate-600 text-sm mb-2">{event.remarks}</p>
                          <p className="text-xs font-bold text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm">
                  <h3 className="font-black tracking-tight mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-blue-400" /> Package Info</h3>
                  {shipmentData.cargo.map((c: any, i: number) => (
                    <div key={i} className="mb-3 last:mb-0">
                      <p className="text-slate-300 text-sm font-bold">{c.description}</p>
                      <p className="text-xs font-medium text-slate-500 mt-1">{c.packages} Packages</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col items-center text-center justify-center py-10">
                  <FileText className="w-12 h-12 text-slate-300 mb-4" />
                  <h3 className="font-black text-slate-900 mb-1">Proof of Delivery</h3>
                  <p className="text-sm font-medium text-slate-500 mb-4">Available once delivered.</p>
                  <button disabled className="bg-slate-100 text-slate-400 font-bold px-4 py-2 rounded-lg text-sm w-full cursor-not-allowed">
                    Download POD
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
