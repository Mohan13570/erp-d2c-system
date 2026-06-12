import React, { useState, useEffect } from 'react';
import { Anchor, Ship, Box, Plus, MapPin } from 'lucide-react';

export default function OceanFreight() {
  const [vessels, setVessels] = useState<any[]>([]);
  const [voyages, setVoyages] = useState<any[]>([]);
  const [containers, setContainers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'vessels' | 'voyages' | 'containers'>('vessels');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const [vRes, voyRes, cRes] = await Promise.all([
        fetch('/api/ocean/vessels'), fetch('/api/ocean/voyages'), fetch('/api/ocean/containers')
      ]);
      if (vRes.ok) setVessels(await vRes.json());
      if (voyRes.ok) setVoyages(await voyRes.json());
      if (cRes.ok) setContainers(await cRes.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/ocean/${activeTab}`, {
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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Ocean Freight Management</h1>
          <p className="text-gray-500 font-medium mt-1">Vessel tracking, Voyage scheduling, and Container operations.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2">
          <Plus size={18} /><span>Add {activeTab.slice(0, -1)}</span>
        </button>
      </div>

      <div className="bg-gray-100/80 p-1.5 rounded-2xl w-fit flex space-x-1 mb-6 shrink-0">
        <button onClick={() => setActiveTab('vessels')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'vessels' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}>
          <Anchor size={18} className="mr-2" /> Vessels
        </button>
        <button onClick={() => setActiveTab('voyages')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'voyages' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}>
          <Ship size={18} className="mr-2" /> Voyages
        </button>
        <button onClick={() => setActiveTab('containers')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'containers' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}>
          <Box size={18} className="mr-2" /> Containers
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'vessels' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vessels.map(v => (
              <div key={v.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Ship size={24}/></div>
                  <div>
                    <h3 className="font-bold text-gray-900">{v.name}</h3>
                    <p className="text-sm font-semibold text-gray-500">IMO: {v.imoNo}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 font-bold">Capacity: {v.capacity} TEU</div>
                <div className="mt-4 text-xs bg-gray-50 px-3 py-2 rounded-lg text-gray-500 font-semibold">Active Voyages: {v.voyages?.length || 0}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'voyages' && (
          <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <thead className="bg-gray-50"><tr>
              {['Voyage No', 'Vessel', 'Routing', 'ETD', 'ETA'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {voyages.map(v => (
                <tr key={v.id}>
                  <td className="px-6 py-4 font-bold text-gray-900">{v.voyageNo}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-blue-700">{v.vessel?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 flex items-center"><MapPin size={14} className="mr-1 text-gray-400"/> {v.origin} → {v.destination}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{v.etd ? new Date(v.etd).toLocaleDateString() : 'TBD'}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{v.eta ? new Date(v.eta).toLocaleDateString() : 'TBD'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'containers' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {containers.map(c => (
              <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-slate-50 p-2 rounded-lg"><Box size={20} className="text-slate-600"/></div>
                  <span className="px-2 py-1 text-xs font-bold bg-amber-50 text-amber-700 rounded">{c.status}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{c.containerNo}</h3>
                <p className="text-xs font-bold text-gray-400">Type: {c.type}</p>
                <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-500 font-semibold">
                  Movements Logged: {c.movements?.length || 0}
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
              {activeTab === 'vessels' && (
                <>
                  <input required placeholder="Vessel Name" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input required placeholder="IMO Number" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, imoNo: e.target.value})} />
                  <input required type="number" placeholder="Capacity (TEU)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} />
                </>
              )}
              {activeTab === 'voyages' && (
                <>
                  <select required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" onChange={e => setFormData({...formData, vesselId: e.target.value})}>
                    <option value="">Select Vessel</option>
                    {vessels.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                  <input required placeholder="Voyage Number" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, voyageNo: e.target.value})} />
                  <div className="flex gap-4">
                    <input required placeholder="Origin Port" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, origin: e.target.value})} />
                    <input required placeholder="Destination Port" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, destination: e.target.value})} />
                  </div>
                  <div className="flex gap-4">
                    <input type="date" className="w-full p-3 border border-gray-200 rounded-xl text-sm" onChange={e => setFormData({...formData, etd: e.target.value})} title="ETD" />
                    <input type="date" className="w-full p-3 border border-gray-200 rounded-xl text-sm" onChange={e => setFormData({...formData, eta: e.target.value})} title="ETA" />
                  </div>
                </>
              )}
              {activeTab === 'containers' && (
                <>
                  <input required placeholder="Container Number (e.g. HLXU1234567)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, containerNo: e.target.value})} />
                  <select required className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="">Select Type</option>
                    <option value="20GP">20' General Purpose</option>
                    <option value="40HC">40' High Cube</option>
                    <option value="40RF">40' Reefer</option>
                  </select>
                </>
              )}
              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
