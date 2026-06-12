import React, { useState, useEffect } from 'react';
import { Truck, Users, Map, Plus, Navigation } from 'lucide-react';

export default function RoadTransport() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'vehicles' | 'drivers' | 'trips'>('trips');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const [vRes, dRes, tRes] = await Promise.all([
        fetch('/api/road/vehicles'), fetch('/api/road/drivers'), fetch('/api/road/trips')
      ]);
      if (vRes.ok) setVehicles(await vRes.json());
      if (dRes.ok) setDrivers(await dRes.json());
      if (tRes.ok) setTrips(await tRes.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/road/${activeTab}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        fetchData();
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col relative">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Road Transport Dispatch</h1>
          <p className="text-gray-500 font-medium mt-1">Vehicle assignment, Driver tracking, and GPS Trip routing.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2">
          <Plus size={18} /><span>Add {activeTab.slice(0, -1)}</span>
        </button>
      </div>

      <div className="bg-gray-100/80 p-1.5 rounded-2xl w-fit flex space-x-1 mb-6 shrink-0">
        <button onClick={() => setActiveTab('trips')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'trips' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'}`}>
          <Map size={18} className="mr-2" /> Dispatch & Trips
        </button>
        <button onClick={() => setActiveTab('vehicles')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'vehicles' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'}`}>
          <Truck size={18} className="mr-2" /> Fleet Vehicles
        </button>
        <button onClick={() => setActiveTab('drivers')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'drivers' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'}`}>
          <Users size={18} className="mr-2" /> Drivers
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'trips' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map(t => (
              <div key={t.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 font-black text-xs rounded-lg uppercase tracking-widest">{t.status}</span>
                  <Navigation className="text-emerald-500 opacity-50" size={20}/>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <p className="text-gray-400 text-xs font-bold uppercase">Origin</p>
                      <p className="font-bold text-gray-900">{t.origin}</p>
                    </div>
                    <div className="text-gray-300 font-light text-2xl">→</div>
                    <div className="text-sm text-right">
                      <p className="text-gray-400 text-xs font-bold uppercase">Destination</p>
                      <p className="font-bold text-gray-900">{t.destination}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between text-sm">
                     <div className="flex items-center text-gray-700"><Truck size={14} className="mr-2"/> {t.vehicle?.plateNumber}</div>
                     <div className="flex items-center text-gray-700"><Users size={14} className="mr-2"/> {t.driver?.name}</div>
                  </div>
                  <p className="text-xs text-gray-400 font-semibold mt-2">GPS Events: {t.events?.length || 0} logged</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'vehicles' && (
          <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <thead className="bg-gray-50"><tr>
              {['Plate Number', 'Vehicle Type', 'Capacity', 'Status', 'Active Trips'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {vehicles.map(v => (
                <tr key={v.id}>
                  <td className="px-6 py-4 font-black text-gray-900 tracking-wider bg-gray-50 w-fit">{v.plateNumber}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{v.type}</td>
                  <td className="px-6 py-4 text-sm">{v.capacity} tons</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg">{v.status}</span></td>
                  <td className="px-6 py-4 text-sm">{v.trips?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'drivers' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {drivers.map(d => (
              <div key={d.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xl">
                  {d.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{d.name}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">LIC: {d.licenseNo}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Create {activeTab.slice(0, -1)}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'vehicles' && (
                <>
                  <input required placeholder="Plate Number" className="w-full p-3 border border-gray-200 rounded-xl font-mono uppercase" onChange={e => setFormData({...formData, plateNumber: e.target.value})} />
                  <input required placeholder="Vehicle Type (e.g. 18-Wheeler)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, type: e.target.value})} />
                  <input required type="number" placeholder="Capacity (tons)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, capacity: parseFloat(e.target.value)})} />
                </>
              )}
              {activeTab === 'drivers' && (
                <>
                  <input required placeholder="Driver Full Name" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input required placeholder="Commercial License No." className="w-full p-3 border border-gray-200 rounded-xl font-mono uppercase" onChange={e => setFormData({...formData, licenseNo: e.target.value})} />
                  <input placeholder="Phone Number" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, phone: e.target.value})} />
                </>
              )}
              {activeTab === 'trips' && (
                <>
                  <select required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" onChange={e => setFormData({...formData, vehicleId: e.target.value})}>
                    <option value="">Assign Vehicle</option>
                    {vehicles.filter(v => v.status === 'Available').map(v => <option key={v.id} value={v.id}>{v.plateNumber} - {v.type}</option>)}
                  </select>
                  <select required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" onChange={e => setFormData({...formData, driverId: e.target.value})}>
                    <option value="">Assign Driver</option>
                    {drivers.filter(d => d.status === 'Active').map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <div className="flex gap-4">
                    <input required placeholder="Start Location" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, origin: e.target.value})} />
                    <input required placeholder="End Destination" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, destination: e.target.value})} />
                  </div>
                  <input type="datetime-local" className="w-full p-3 border border-gray-200 rounded-xl text-sm text-gray-500" onChange={e => setFormData({...formData, startTime: e.target.value})} title="Scheduled Start Time" />
                </>
              )}
              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
