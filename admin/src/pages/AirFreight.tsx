import React, { useState, useEffect } from 'react';
import { Plane, FileText, Package, Plus, Search } from 'lucide-react';

export default function AirFreight() {
  const [flights, setFlights] = useState<any[]>([]);
  const [awbs, setAwbs] = useState<any[]>([]);
  const [shipments, setShipments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'awbs' | 'flights' | 'shipments'>('awbs');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const [fRes, aRes, sRes] = await Promise.all([
        fetch('/api/air/flights'), fetch('/api/air/awbs'), fetch('/api/air/shipments')
      ]);
      if (fRes.ok) setFlights(await fRes.json());
      if (aRes.ok) setAwbs(await aRes.json());
      if (sRes.ok) setShipments(await sRes.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/air/${activeTab}`, {
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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Air Freight Network</h1>
          <p className="text-gray-500 font-medium mt-1">Manage AWBs, Flight Schedules, and Cargo manifesting.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2">
          <Plus size={18} /><span>Add {activeTab === 'awbs' ? 'AWB' : activeTab === 'flights' ? 'Flight' : 'Cargo'}</span>
        </button>
      </div>

      <div className="bg-gray-100/80 p-1.5 rounded-2xl w-fit flex space-x-1 mb-6 shrink-0">
        <button onClick={() => setActiveTab('awbs')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'awbs' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500'}`}>
          <FileText size={18} className="mr-2" /> Air Waybills
        </button>
        <button onClick={() => setActiveTab('flights')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'flights' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500'}`}>
          <Plane size={18} className="mr-2" /> Flight Schedules
        </button>
        <button onClick={() => setActiveTab('shipments')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'shipments' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500'}`}>
          <Package size={18} className="mr-2" /> Air Cargo
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'awbs' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {awbs.map(a => (
              <div key={a.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-sky-400">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-gray-900 tracking-wider font-mono">{a.awbNumber}</h3>
                  <span className="px-2 py-1 text-xs font-bold bg-sky-50 text-sky-700 rounded">{a.status}</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1 font-semibold">
                  <p>Route: {a.origin} → {a.destination}</p>
                  <p>Weight: {a.weight} kg</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-500 font-bold">
                  Attached Cargo: {a.shipments?.length || 0} pieces
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'flights' && (
          <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <thead className="bg-gray-50"><tr>
              {['Flight No', 'Airline', 'Routing', 'Departure', 'Arrival'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {flights.map(f => (
                <tr key={f.id}>
                  <td className="px-6 py-4 font-bold text-gray-900">{f.flightNo}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{f.airline}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{f.origin} → {f.destination}</td>
                  <td className="px-6 py-4 text-sm">{new Date(f.departure).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">{new Date(f.arrival).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'shipments' && (
          <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <thead className="bg-gray-50"><tr>
              {['Cargo Desc', 'Weight', 'Master AWB', 'Allocated Flight', 'Status'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {shipments.map(s => (
                <tr key={s.id}>
                  <td className="px-6 py-4 font-bold text-gray-900">{s.description}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{s.weight} kg</td>
                  <td className="px-6 py-4 text-sm font-bold text-sky-600">{s.awb?.awbNumber}</td>
                  <td className="px-6 py-4 text-sm">{s.flight?.flightNo || 'Pending'}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg">{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Create {activeTab.slice(0, -1)}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'awbs' && (
                <>
                  <input required placeholder="AWB Number (e.g. 176-12345678)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, awbNumber: e.target.value})} />
                  <div className="flex gap-4">
                    <input required placeholder="Origin Airport" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, origin: e.target.value})} />
                    <input required placeholder="Dest Airport" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, destination: e.target.value})} />
                  </div>
                  <input required type="number" placeholder="Total Weight (kg)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})} />
                </>
              )}
              {activeTab === 'flights' && (
                <>
                  <input required placeholder="Flight Number (e.g. EK98)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, flightNo: e.target.value})} />
                  <input required placeholder="Airline" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, airline: e.target.value})} />
                  <div className="flex gap-4">
                    <input required placeholder="Origin" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, origin: e.target.value})} />
                    <input required placeholder="Dest" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, destination: e.target.value})} />
                  </div>
                  <input required type="datetime-local" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, departure: e.target.value})} />
                  <input required type="datetime-local" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, arrival: e.target.value})} />
                </>
              )}
              {activeTab === 'shipments' && (
                <>
                  <input required placeholder="Cargo Description" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, description: e.target.value})} />
                  <input required type="number" placeholder="Weight (kg)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})} />
                  <select required className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, awbId: e.target.value})}>
                    <option value="">Attach to Master AWB</option>
                    {awbs.map(a => <option key={a.id} value={a.id}>{a.awbNumber}</option>)}
                  </select>
                  <select className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, flightId: e.target.value})}>
                    <option value="">Allocate to Flight (Optional)</option>
                    {flights.map(f => <option key={f.id} value={f.id}>{f.flightNo} - {f.airline}</option>)}
                  </select>
                </>
              )}
              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-sky-500 text-white font-bold rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
