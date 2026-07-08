import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Anchor, ShieldAlert, Box, Ship, Save, ArrowRight } from 'lucide-react';

export default function CreateBookingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    freightType: 'FCL',
    isNvocc: false,
    shipper: '',
    consignee: '',
    polId: '',
    podId: '',
    vesselId: '',
    expectedDeparture: ''
  });
  
  const [cargo, setCargo] = useState({ description: '', isDangerousGoods: false, weightKg: 0 });
  
  const [masterData, setMasterData] = useState<any>(null);

  useEffect(() => {
    // Parallel fetching of lookup data
    Promise.all([
      fetch('/api/ocean/ports').then(r => r.json()),
      fetch('/api/ocean/vessels').then(r => r.json()),
    ]).then(([ports, vessels]) => {
      setMasterData({ ports, vessels });
    });
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/ocean/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           ...formData,
           cargos: [cargo]
        })
      });
      const data = await res.json();
      if (res.ok) {
         navigate(`/ocean/bookings/${data.id}`);
      }
    } catch (err) {
      alert("Failed to create booking.");
    }
  };

  if (!masterData) return <div className="p-8">Loading booking wizard...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
           <Anchor size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Ocean Booking</h1>
          <p className="text-gray-500 text-sm">Step {step} of 3 - Master Bill of Lading Request</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Routing & Parties</h2>
            <div className="grid grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Freight Type</label>
                  <select 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.freightType}
                    onChange={e => setFormData({...formData, freightType: e.target.value})}
                  >
                     <option>FCL</option>
                     <option>LCL</option>
                     <option>BreakBulk</option>
                     <option>RORO</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.isNvocc ? 'NVOCC' : 'Direct'}
                    onChange={e => setFormData({...formData, isNvocc: e.target.value === 'NVOCC'})}
                  >
                     <option>Direct Carrier Booking</option>
                     <option>NVOCC (House B/L)</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipper</label>
                  <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" 
                         value={formData.shipper} onChange={e => setFormData({...formData, shipper: e.target.value})} />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consignee</label>
                  <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" 
                         value={formData.consignee} onChange={e => setFormData({...formData, consignee: e.target.value})} />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Port of Loading (POL)</label>
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                          value={formData.polId} onChange={e => setFormData({...formData, polId: e.target.value})}>
                     <option value="">Select POL...</option>
                     {masterData.ports.map((p: any) => <option key={p.id} value={p.id}>{p.code} - {p.name}</option>)}
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Port of Discharge (POD)</label>
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                          value={formData.podId} onChange={e => setFormData({...formData, podId: e.target.value})}>
                     <option value="">Select POD...</option>
                     {masterData.ports.map((p: any) => <option key={p.id} value={p.id}>{p.code} - {p.name}</option>)}
                  </select>
               </div>
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={() => setStep(2)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl flex items-center space-x-2">
                 <span>Next: Cargo Details</span> <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Cargo & Hazard Specifications</h2>
            <div className="grid grid-cols-1 gap-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Commodity Description</label>
                  <textarea rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            value={cargo.description} onChange={e => setCargo({...cargo, description: e.target.value})} />
               </div>
               <div className="flex items-center space-x-4 p-4 bg-red-50 border border-red-100 rounded-xl">
                  <ShieldAlert className="text-red-600" />
                  <div className="flex-1">
                     <div className="font-medium text-red-900">Dangerous Goods (HAZMAT)</div>
                     <div className="text-xs text-red-700">Does this cargo contain regulated materials?</div>
                  </div>
                  <input type="checkbox" className="w-5 h-5 text-red-600 rounded" 
                         checked={cargo.isDangerousGoods} onChange={e => setCargo({...cargo, isDangerousGoods: e.target.checked})} />
               </div>
            </div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(1)} className="text-gray-600 px-6 py-2 rounded-xl border border-gray-200">Back</button>
              <button onClick={() => setStep(3)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl flex items-center space-x-2">
                 <span>Next: Execution Review</span> <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Vessel Allocation & Review</h2>
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign Vessel (Optional)</label>
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                          value={formData.vesselId} onChange={e => setFormData({...formData, vesselId: e.target.value})}>
                     <option value="">Select Carrier Vessel...</option>
                     {masterData.vessels.map((v: any) => <option key={v.id} value={v.id}>{v.name} (IMO: {v.imoNo})</option>)}
                  </select>
               </div>
            </div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(2)} className="text-gray-600 px-6 py-2 rounded-xl border border-gray-200">Back</button>
              <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2 rounded-xl flex items-center space-x-2 hover:bg-green-700">
                 <Save size={16} /> <span>Submit Booking Request</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
