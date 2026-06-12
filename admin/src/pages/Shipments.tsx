import React, { useState, useEffect } from 'react';
import { Package, Plus, MapPin, Search, Calendar, Ship, Plane, Truck } from 'lucide-react';

export default function Shipments() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const res = await fetch('/api/shipments');
      if (res.ok) setShipments(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData, trackingNumber: `TRK-${Math.floor(Math.random()*100000)}`})
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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Shipment Workflow Engine</h1>
          <p className="text-gray-500 font-medium mt-1">Manage Import/Export, Door-to-Door, and Port-to-Port shipments.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2">
          <Plus size={18} /><span>Create Shipment</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shipments.map(s => (
            <div key={s.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                    {s.freightType === 'Ocean' ? <Ship size={20}/> : s.freightType === 'Air' ? <Plane size={20}/> : <Truck size={20}/>}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{s.trackingNumber}</h3>
                    <p className="text-xs text-gray-500">{s.freightType} Freight</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">{s.status}</span>
              </div>
              <div className="space-y-3 mt-4 pt-4 border-t border-gray-50">
                <div className="flex items-center text-sm text-gray-600"><MapPin size={14} className="mr-2 text-gray-400"/> {s.origin} → {s.destination}</div>
                <div className="flex items-center text-sm text-gray-600"><Calendar size={14} className="mr-2 text-gray-400"/> DEP: {new Date(s.departureDate || Date.now()).toLocaleDateString()}</div>
              </div>
              <div className="mt-4 flex gap-2">
                 <div className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded">Milestones: {s.milestones?.length || 0}</div>
                 <div className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded">Statuses: {s.statuses?.length || 0}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Create New Shipment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select required className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, freightType: e.target.value})}>
                <option value="">Select Routing Type</option>
                <option value="Ocean">Port-to-Port (Ocean)</option>
                <option value="Air">Door-to-Door (Air)</option>
                <option value="Road">Domestic (Road)</option>
                <option value="Rail">Cross Border (Rail)</option>
              </select>
              <div className="flex gap-4">
                <input required placeholder="Origin" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, origin: e.target.value})} />
                <input required placeholder="Destination" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, destination: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <input type="date" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, departureDate: e.target.value})} />
              </div>
              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl">Generate Shipment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
