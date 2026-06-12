import React, { useState, useEffect } from 'react';
import { Box, LogIn, LogOut, ArrowRightLeft, Plus } from 'lucide-react';

export default function ContainerMgmt() {
  const [statuses, setStatuses] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const res = await fetch('/api/containers');
      if (res.ok) setStatuses(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/containers', {
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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Container Management</h1>
          <p className="text-gray-500 font-medium mt-1">Track Stuffing, Destuffing, and Container returns.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2">
          <Plus size={18} /><span>Log Status</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
           <thead className="bg-gray-50"><tr>
             {['Container No', 'Status', 'Location', 'Timestamp'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">{h}</th>)}
           </tr></thead>
           <tbody className="divide-y divide-gray-50">
             {statuses.map(s => (
               <tr key={s.id}>
                 <td className="px-6 py-4 font-black text-gray-900">{s.containerNo}</td>
                 <td className="px-6 py-4">
                   <span className={`px-2 py-1 text-xs font-bold rounded-lg ${s.status === 'Stuffing' ? 'bg-green-50 text-green-700' : s.status === 'Destuffing' ? 'bg-orange-50 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                     {s.status}
                   </span>
                 </td>
                 <td className="px-6 py-4 text-sm font-semibold">{s.location}</td>
                 <td className="px-6 py-4 text-sm text-gray-500">{new Date(s.timestamp).toLocaleString()}</td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Log Container Status</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               <input required placeholder="Container Number (e.g. HLXU1234567)" className="w-full p-3 border border-gray-200 rounded-xl uppercase font-mono" onChange={e => setFormData({...formData, containerNo: e.target.value})} />
               <select required className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, status: e.target.value})}>
                 <option value="">Select Status</option>
                 <option value="Stuffing">Stuffing</option>
                 <option value="Destuffing">Destuffing</option>
                 <option value="Empty">Empty</option>
                 <option value="Returned">Returned</option>
               </select>
               <input required placeholder="Current Location (e.g. Warehouse A)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, location: e.target.value})} />
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
