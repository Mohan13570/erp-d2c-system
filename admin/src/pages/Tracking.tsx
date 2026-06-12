import React, { useState, useEffect } from 'react';
import { Crosshair, MapPin, Activity, Plus } from 'lucide-react';

export default function Tracking() {
  const [devices, setDevices] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const res = await fetch('/api/tracking/devices');
      if (res.ok) setDevices(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tracking/devices', {
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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Real-Time Tracking Engine</h1>
          <p className="text-gray-500 font-medium mt-1">Manage IoT and GPS hardware assigned to shipments.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-lime-600 hover:bg-lime-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2">
          <Plus size={18} /><span>Register Device</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {devices.map(d => (
             <div key={d.id} className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 text-lime-500/10"><Crosshair size={120}/></div>
               <div className="flex justify-between items-start mb-4 relative z-10">
                 <div className="bg-slate-800 p-3 rounded-xl"><MapPin size={24} className="text-lime-400"/></div>
                 <div className="flex items-center text-xs font-bold text-lime-400 bg-lime-400/10 px-2 py-1 rounded">
                   <Activity size={12} className="mr-1 animate-pulse"/> {d.status}
                 </div>
               </div>
               <h3 className="font-bold text-xl mb-1 relative z-10">{d.type} Tracker</h3>
               <p className="font-mono text-sm text-slate-400 mb-4 relative z-10">{d.deviceId}</p>
               <div className="border-t border-slate-700 pt-4 mt-4 relative z-10">
                 <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Attached To</p>
                 <p className="font-bold">{d.attachedTo}</p>
               </div>
             </div>
           ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Register GPS/IoT Device</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               <input required placeholder="Hardware Device ID (MAC or Serial)" className="w-full p-3 border border-gray-200 rounded-xl font-mono uppercase" onChange={e => setFormData({...formData, deviceId: e.target.value})} />
               <select required className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, type: e.target.value})}>
                 <option value="">Device Type</option>
                 <option value="GPS">GPS Satellite</option>
                 <option value="IoT">IoT Cellular</option>
                 <option value="RFID">RFID Tag</option>
               </select>
               <input required placeholder="Attach to (Vehicle Plate or Container No)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, attachedTo: e.target.value})} />
               <div className="pt-6 flex justify-end gap-3">
                 <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold">Cancel</button>
                 <button type="submit" className="px-5 py-2.5 bg-lime-600 text-white font-bold rounded-xl">Register</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
