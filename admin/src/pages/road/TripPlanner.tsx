import React, { useState, useEffect } from 'react';
import { Map, List, Truck, Users, Clock, Route as RouteIcon, Save, Plus } from 'lucide-react';

export default function TripPlanner() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTrip, setNewTrip] = useState({ tripNumber: `TRP-${Math.floor(1000+Math.random()*9000)}`, driverId: '', vehicleId: '', stops: [] as any[] });

  const fetchData = async () => {
    try {
      const [bRes, tRes, dRes, vRes] = await Promise.all([
        fetch('/api/road/bookings'),
        fetch('/api/road/planning/trips'),
        fetch('/api/road/master-data/drivers'),
        fetch('/api/road/master-data/vehicles')
      ]);
      if (bRes.ok) setBookings(await bRes.json());
      if (tRes.ok) setTrips(await tRes.json());
      if (dRes.ok) setDrivers(await dRes.json());
      if (vRes.ok) setVehicles(await vRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const addStop = () => {
    setNewTrip({ ...newTrip, stops: [...newTrip.stops, { type: 'Pickup', locationName: '', locationAddress: '', bookingId: '' }] });
  };

  const handleSaveTrip = async () => {
    try {
      const res = await fetch('/api/road/planning/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrip)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col relative">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <RouteIcon className="mr-3 text-indigo-600" size={32} /> Trip Planner & Routing
          </h1>
          <p className="text-gray-500 font-medium mt-1">Assign drivers, sequence stops, and dispatch trips.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2 shadow-sm transition-all">
          <Plus size={18} /><span>Create Trip</span>
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="w-1/3 bg-white border border-gray-100 rounded-3xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 bg-gray-50 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 flex items-center"><List size={18} className="mr-2 text-indigo-500" /> Pending Bookings</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {bookings.map(b => (
              <div key={b.id} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-indigo-200 transition-colors cursor-grab active:cursor-grabbing">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-gray-900 text-sm font-mono">{b.bookingNumber}</span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded uppercase tracking-wide">{b.loadType}</span>
                </div>
                <div className="text-xs text-gray-500 font-medium space-y-1">
                  <p>Gross: {b.totalGrossWeight} kg | Vol: {b.totalVolume} cbm</p>
                  <p>{b.items?.length || 0} cargo items</p>
                </div>
              </div>
            ))}
            {bookings.length === 0 && <p className="text-center text-gray-400 text-sm mt-8 font-medium">No pending bookings.</p>}
          </div>
        </div>

        <div className="w-2/3 bg-white border border-gray-100 rounded-3xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-900 flex items-center"><Map size={18} className="mr-2 text-indigo-500" /> Planned Trips</h2>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600">Today</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {trips.map(t => (
              <div key={t.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-600 text-white p-2 rounded-lg"><Truck size={20} /></div>
                    <div>
                      <h3 className="font-black text-gray-900 text-lg">{t.tripNumber}</h3>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-bold text-gray-700">Driver: {t.driver?.name || 'Unassigned'}</p>
                     <p className="text-xs font-medium text-gray-500">Vehicle: {t.vehicle?.registrationNo || 'Unassigned'}</p>
                  </div>
                </div>
                <div className="relative pl-4 border-l-2 border-dashed border-gray-300 ml-2 space-y-6">
                  {t.stops?.map((s: any, idx: number) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-white border-2 border-indigo-600"></div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm ml-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className={`text-xs font-black uppercase tracking-wider ${s.type === 'Pickup' ? 'text-emerald-600' : 'text-rose-600'}`}>{s.type}</span>
                            <p className="font-bold text-gray-900 mt-1">{s.locationName}</p>
                            <p className="text-xs text-gray-500 mt-1">{s.locationAddress}</p>
                          </div>
                          {s.booking && <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">{s.booking.bookingNumber}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {trips.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <RouteIcon size={48} className="mb-4 opacity-20" />
                <p className="font-medium text-lg">No trips planned yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Dispatch New Trip</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Trip Number</label>
                  <input value={newTrip.tripNumber} readOnly className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 font-mono text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Planned Start Date</label>
                  <input type="datetime-local" className="w-full bg-white p-3 rounded-xl border border-gray-200 font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Assign Driver</label>
                  <select className="w-full bg-white p-3 rounded-xl border border-gray-200 font-medium" value={newTrip.driverId} onChange={e => setNewTrip({...newTrip, driverId: e.target.value})}>
                     <option value="">Select Driver...</option>
                     {drivers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.licenseNo})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Assign Vehicle</label>
                  <select className="w-full bg-white p-3 rounded-xl border border-gray-200 font-medium" value={newTrip.vehicleId} onChange={e => setNewTrip({...newTrip, vehicleId: e.target.value})}>
                     <option value="">Select Vehicle...</option>
                     {vehicles.map(v => <option key={v.id} value={v.id}>{v.registrationNo} - {v.type}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-bold text-gray-700">Sequence Stops</label>
                  <button onClick={addStop} className="text-indigo-600 font-bold text-sm flex items-center hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"><Plus size={16} className="mr-1"/> Add Stop</button>
                </div>
                <div className="space-y-3">
                  {newTrip.stops.map((stop, i) => (
                    <div key={i} className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <select className="bg-white p-2.5 rounded-lg border border-gray-200 font-bold text-sm w-32" value={stop.type} onChange={(e) => { const s = [...newTrip.stops]; s[i].type = e.target.value; setNewTrip({ ...newTrip, stops: s }); }}>
                        <option>Pickup</option><option>Delivery</option><option>CrossDock</option>
                      </select>
                      <div className="flex-1 space-y-3">
                        <input placeholder="Location Name (e.g. Dubai Main Hub)" className="w-full bg-white p-2.5 rounded-lg border border-gray-200 text-sm" value={stop.locationName} onChange={(e) => { const s = [...newTrip.stops]; s[i].locationName = e.target.value; setNewTrip({ ...newTrip, stops: s }); }} />
                        <input placeholder="Address Details" className="w-full bg-white p-2.5 rounded-lg border border-gray-200 text-sm" value={stop.locationAddress} onChange={(e) => { const s = [...newTrip.stops]; s[i].locationAddress = e.target.value; setNewTrip({ ...newTrip, stops: s }); }} />
                      </div>
                      <select className="bg-white p-2.5 rounded-lg border border-gray-200 font-bold text-sm w-48" value={stop.bookingId} onChange={(e) => { const s = [...newTrip.stops]; s[i].bookingId = e.target.value; setNewTrip({ ...newTrip, stops: s }); }}>
                        <option value="">Attach Booking...</option>
                        {bookings.map(b => <option key={b.id} value={b.id}>{b.bookingNumber}</option>)}
                      </select>
                    </div>
                  ))}
                  {newTrip.stops.length === 0 && <p className="text-xs text-gray-400 font-medium italic p-4 text-center border-2 border-dashed border-gray-100 rounded-xl">No stops added. Add a stop to build the routing sequence.</p>}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleSaveTrip} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors flex items-center"><Save size={18} className="mr-2"/> Save Trip</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
