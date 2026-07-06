import React, { useState, useEffect } from 'react';
import { Building2, Package, Map, ListChecks, Plus } from 'lucide-react';

export default function Warehouse() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [picks, setPicks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'hubs' | 'picks'>('hubs');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const [wRes, pRes] = await Promise.all([
        fetch('/api/warehouse/master'), fetch('/api/warehouse/master/picks')
      ]);
      if (wRes.ok) setWarehouses(await wRes.json());
      if (pRes.ok) setPicks(await pRes.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/warehouse/master${activeTab === 'hubs' ? '' : '/picks'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) { setShowModal(false); fetchData(); }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col relative">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Warehouse Ops</h1>
          <p className="text-gray-500 font-medium mt-1">Inbound, Outbound, Racks, Bins, and Pick/Pack operations.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2">
          <Plus size={18} /><span>Add Record</span>
        </button>
      </div>

      <div className="bg-gray-100/80 p-1.5 rounded-2xl w-fit flex space-x-1 mb-6 shrink-0">
        <button onClick={() => setActiveTab('hubs')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'hubs' ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500'}`}>
          <Building2 size={18} className="mr-2" /> Locations & Racks
        </button>
        <button onClick={() => setActiveTab('picks')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'picks' ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500'}`}>
          <ListChecks size={18} className="mr-2" /> Pick Lists
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'hubs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {warehouses.map(w => (
               <div key={w.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-gray-900 text-xl">{w.name}</h3>
                   <span className="bg-slate-100 px-3 py-1 font-mono text-sm rounded-lg text-slate-600">{w.code}</span>
                 </div>
                 <div className="space-y-3">
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Internal Locations</h4>
                   {w.locations?.map((l:any) => (
                     <div key={l.id} className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-700">Zone {l.zone} / Rack {l.rack} / Bin {l.bin}</span>
                        <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-gray-200">{l.barcode}</span>
                     </div>
                   ))}
                   {!w.locations?.length && <p className="text-sm text-gray-500 italic">No locations configured.</p>}
                 </div>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'picks' && (
          <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
             <thead className="bg-gray-50"><tr>
               {['Pick ID', 'Order Ref', 'Assigned To', 'Status', 'Generated'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">{h}</th>)}
             </tr></thead>
             <tbody className="divide-y divide-gray-50">
               {picks.map(p => (
                 <tr key={p.id}>
                   <td className="px-6 py-4 font-mono text-xs text-gray-400">{p.id.split('-')[0]}</td>
                   <td className="px-6 py-4 font-bold text-gray-900">{p.orderRef}</td>
                   <td className="px-6 py-4 text-sm font-semibold text-violet-600">{p.assignedTo || 'Unassigned'}</td>
                   <td className="px-6 py-4"><span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg">{p.status}</span></td>
                   <td className="px-6 py-4 text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                 </tr>
               ))}
             </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Create Record</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               {activeTab === 'hubs' && (
                 <>
                   <input required placeholder="Warehouse Name" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, name: e.target.value})} />
                   <input required placeholder="Warehouse Code (e.g. WH-DXB)" className="w-full p-3 border border-gray-200 rounded-xl uppercase" onChange={e => setFormData({...formData, code: e.target.value})} />
                 </>
               )}
               {activeTab === 'picks' && (
                 <>
                   <input required placeholder="Order Reference (e.g. SO-9921)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, orderRef: e.target.value})} />
                   <input required placeholder="Assign to Employee ID" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, assignedTo: e.target.value})} />
                 </>
               )}
               <div className="pt-6 flex justify-end gap-3">
                 <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold">Cancel</button>
                 <button type="submit" className="px-5 py-2.5 bg-violet-600 text-white font-bold rounded-xl">Save</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
