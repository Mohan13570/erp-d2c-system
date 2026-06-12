import React, { useState, useEffect } from 'react';
import { Truck, Ship, Plane, Navigation, Plus, Bookmark } from 'lucide-react';

export default function Fleet() {
  const [carriers, setCarriers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'carriers' | 'bookings'>('carriers');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const [carRes, bkRes] = await Promise.all([
        fetch('/api/fleet/carriers'),
        fetch('/api/fleet/bookings')
      ]);
      if (carRes.ok) setCarriers(await carRes.json());
      if (bkRes.ok) setBookings(await bkRes.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = activeTab === 'carriers' ? 'carriers' : 'bookings';
    try {
      const payload = { ...formData };
      if (activeTab === 'bookings') payload.bookingRef = `BKG-${Math.floor(Math.random()*10000)}`;

      const res = await fetch(`/api/fleet/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Freight Operations</h1>
          <p className="text-gray-500 font-medium mt-1">Carrier Management, Multimodal Bookings, and Space Allocation.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2">
          <Plus size={18} /><span>Add {activeTab === 'carriers' ? 'Carrier' : 'Booking'}</span>
        </button>
      </div>

      <div className="bg-gray-100/80 p-1.5 rounded-2xl w-fit flex space-x-1 mb-6 shrink-0">
        <button onClick={() => setActiveTab('carriers')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'carriers' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500'}`}>
          <Truck size={18} className="mr-2" /> Carrier Profiles
        </button>
        <button onClick={() => setActiveTab('bookings')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'bookings' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500'}`}>
          <Bookmark size={18} className="mr-2" /> Booking Allocations
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'carriers' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {carriers.map(c => (
              <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-slate-50 p-3 rounded-full text-slate-700">
                    {c.carrierType.includes('Ocean') ? <Ship size={24}/> : c.carrierType.includes('Air') ? <Plane size={24}/> : <Truck size={24}/>}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{c.name}</h3>
                    <p className="text-sm font-semibold text-indigo-600">{c.carrierType}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Email: {c.contactEmail || 'N/A'}</p>
                  <p>Phone: {c.contactPhone || 'N/A'}</p>
                  <div className="mt-4 pt-4 border-t border-gray-50 font-bold text-gray-400">
                    Active Contracts: {c.contracts?.length || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'bookings' && (
          <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <thead className="bg-gray-50"><tr>
              {['Booking Ref', 'Carrier', 'Vessel/Flight', 'Status', 'Allocated Items'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map(b => (
                <tr key={b.id}>
                  <td className="px-6 py-4 font-bold text-gray-900">{b.bookingRef}</td>
                  <td className="px-6 py-4 font-semibold text-gray-700">{b.carrier?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.vesselName || b.flightNo || 'TBD'}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg">{b.status}</span></td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-500">{b.items?.length || 0} Items</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Create {activeTab === 'carriers' ? 'Carrier' : 'Allocation'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'carriers' ? (
                <>
                  <input required placeholder="Carrier Name" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, name: e.target.value})} />
                  <select required className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, carrierType: e.target.value})}>
                    <option value="">Select Transport Type</option>
                    <option value="Ocean Line">Ocean Line</option>
                    <option value="Airline">Airline</option>
                    <option value="Trucking">Trucking Company</option>
                  </select>
                  <input placeholder="Email" type="email" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
                </>
              ) : (
                <>
                  <select required className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, carrierId: e.target.value})}>
                    <option value="">Select Carrier</option>
                    {carriers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <input placeholder="Vessel / Flight No." className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, vesselName: e.target.value})} />
                  <select className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending Space</option>
                    <option value="Waitlisted">Waitlisted</option>
                  </select>
                </>
              )}
              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
