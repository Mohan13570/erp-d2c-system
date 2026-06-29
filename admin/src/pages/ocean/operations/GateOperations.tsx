import React, { useState } from 'react';
import { ArrowRightLeft, Camera, Check } from 'lucide-react';

export default function GateOperations() {
  const [formData, setFormData] = useState({
    containerId: '',
    eventType: 'Gate In',
    sealNumber: '',
    description: '',
    performedBy: 'Gate Agent'
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/ocean/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
         setSuccess(true);
         setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      alert("Gate logging failed.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
           <ArrowRightLeft size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gate & Terminal Operations</h1>
          <p className="text-gray-500 text-sm">Log physical movements, seal numbers, and damage.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
         {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-center gap-2">
               <Check size={18} /> Event successfully recorded in Blockchain/Audit timeline!
            </div>
         )}
         <div className="grid grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
               <select className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                       value={formData.eventType} onChange={e => setFormData({...formData, eventType: e.target.value})}>
                  <option>Gate In</option>
                  <option>Gate Out</option>
                  <option>Stuffing</option>
                  <option>Destuffing</option>
                  <option>Damage Inspected</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Container System ID / Scan</label>
               <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" 
                      placeholder="Scan QR or enter ID" value={formData.containerId} onChange={e => setFormData({...formData, containerId: e.target.value})} />
            </div>
            {(formData.eventType === 'Gate In' || formData.eventType === 'Stuffing') && (
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seal Number (Security)</label>
                  <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" 
                         value={formData.sealNumber} onChange={e => setFormData({...formData, sealNumber: e.target.value})} />
               </div>
            )}
            <div className="col-span-2">
               <label className="block text-sm font-medium text-gray-700 mb-2">Inspector Notes</label>
               <textarea rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                         value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
         </div>
         <div className="flex justify-end pt-4 space-x-3">
            <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl flex items-center space-x-2">
               <Camera size={18}/> <span>Capture Image</span>
            </button>
            <button onClick={handleSubmit} className="bg-indigo-600 text-white px-6 py-2 rounded-xl">
               Log Container Event
            </button>
         </div>
      </div>
    </div>
  );
}
