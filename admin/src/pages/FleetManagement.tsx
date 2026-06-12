import React, { useState, useEffect } from 'react';
import { Truck, PenTool, Fuel, Star, ShieldCheck, Plus } from 'lucide-react';

export default function FleetManagement() {
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [fuel, setFuel] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'maintenance' | 'fuel' | 'performance'>('maintenance');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const [mRes, fRes, pRes] = await Promise.all([
        fetch('/api/fleet-extended/maintenance'),
        fetch('/api/fleet-extended/fuel'),
        fetch('/api/fleet-extended/performance')
      ]);
      if (mRes.ok) setMaintenance(await mRes.json());
      if (fRes.ok) setFuel(await fRes.json());
      if (pRes.ok) setPerformance(await pRes.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/fleet-extended/${activeTab}`, {
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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Extended Fleet Management</h1>
          <p className="text-gray-500 font-medium mt-1">Maintenance, Fuel Logs, and Driver Performance Tracking.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2">
          <Plus size={18} /><span>Add Record</span>
        </button>
      </div>

      <div className="bg-gray-100/80 p-1.5 rounded-2xl w-fit flex space-x-1 mb-6 shrink-0">
        <button onClick={() => setActiveTab('maintenance')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'maintenance' ? 'bg-white text-orange-700 shadow-sm' : 'text-gray-500'}`}>
          <PenTool size={18} className="mr-2" /> Maintenance
        </button>
        <button onClick={() => setActiveTab('fuel')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'fuel' ? 'bg-white text-orange-700 shadow-sm' : 'text-gray-500'}`}>
          <Fuel size={18} className="mr-2" /> Fuel Logs
        </button>
        <button onClick={() => setActiveTab('performance')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'performance' ? 'bg-white text-orange-700 shadow-sm' : 'text-gray-500'}`}>
          <Star size={18} className="mr-2" /> Driver Performance
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'maintenance' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {maintenance.map(m => (
              <div key={m.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-orange-500">
                <h3 className="font-bold text-gray-900 mb-2">{m.description}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Vehicle ID: {m.vehicleId}</p>
                  <p>Cost: <span className="font-bold text-red-600">${m.cost}</span></p>
                  <p>Date: {new Date(m.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'fuel' && (
          <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
             <thead className="bg-gray-50"><tr>
               {['Vehicle ID', 'Date', 'Liters', 'Cost'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">{h}</th>)}
             </tr></thead>
             <tbody className="divide-y divide-gray-50">
               {fuel.map(f => (
                 <tr key={f.id}>
                   <td className="px-6 py-4 font-mono text-gray-900">{f.vehicleId}</td>
                   <td className="px-6 py-4 text-sm">{new Date(f.date).toLocaleDateString()}</td>
                   <td className="px-6 py-4 text-sm font-bold text-sky-600">{f.liters} L</td>
                   <td className="px-6 py-4 text-sm font-bold text-red-600">${f.cost}</td>
                 </tr>
               ))}
             </tbody>
          </table>
        )}

        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {performance.map(p => (
               <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold text-gray-900">{p.driverId}</h3>
                   <span className="flex text-amber-500 font-bold items-center"><Star size={16} className="mr-1 fill-amber-500"/> {p.rating}/5</span>
                 </div>
                 <p className="text-sm text-gray-500 italic">"{p.comments}"</p>
                 <p className="text-xs text-gray-400 mt-4">{new Date(p.date).toLocaleDateString()}</p>
               </div>
             ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Log {activeTab}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               {activeTab === 'maintenance' && (
                 <>
                   <input required placeholder="Vehicle ID" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, vehicleId: e.target.value})} />
                   <input required placeholder="Service Description" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, description: e.target.value})} />
                   <input required type="number" placeholder="Cost ($)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, cost: parseFloat(e.target.value)})} />
                 </>
               )}
               {activeTab === 'fuel' && (
                 <>
                   <input required placeholder="Vehicle ID" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, vehicleId: e.target.value})} />
                   <input required type="number" placeholder="Liters Pumped" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, liters: parseFloat(e.target.value)})} />
                   <input required type="number" placeholder="Total Cost ($)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, cost: parseFloat(e.target.value)})} />
                 </>
               )}
               {activeTab === 'performance' && (
                 <>
                   <input required placeholder="Driver ID" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, driverId: e.target.value})} />
                   <select required className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}>
                     <option value="">Rating (1-5)</option>
                     {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                   </select>
                   <textarea placeholder="Comments / Feedback" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, comments: e.target.value})} />
                 </>
               )}
               <div className="pt-6 flex justify-end gap-3">
                 <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold">Cancel</button>
                 <button type="submit" className="px-5 py-2.5 bg-orange-600 text-white font-bold rounded-xl">Save</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
