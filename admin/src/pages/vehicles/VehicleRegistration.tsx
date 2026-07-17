import React, { useState } from 'react';
import { Truck, Check, ChevronRight, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VehicleRegistration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: '',
    category: 'Heavy Truck',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'Flatbed',
    capacity: 0,
    fuelType: 'Diesel',
    ownershipType: 'Owned'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           ...formData, 
           year: parseInt(formData.year as any), 
           capacity: parseFloat(formData.capacity as any)
        })
      });
      if (res.ok) {
        const data = await res.json();
        navigate(`/vehicles/${data.id}`);
      } else {
        const err = await res.json();
        alert('Error: ' + err.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Register New Vehicle</h1>
        <p className="text-gray-500 font-medium mt-1">Add a new asset to the fleet master database.</p>
      </div>

      <div className="flex-1 overflow-auto">
         <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
            {/* Basic Identity */}
            <div>
               <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><Truck size={20} className="text-indigo-600"/> Identity & Registration</h3>
               <div className="grid grid-cols-2 gap-6">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Plate Number (Required)</label>
                     <input required type="text" placeholder="e.g. KA-01-EQ-1234" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold uppercase" value={formData.plateNumber} onChange={e => setFormData({...formData, plateNumber: e.target.value.toUpperCase()})} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ownership Type</label>
                     <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={formData.ownershipType} onChange={e => setFormData({...formData, ownershipType: e.target.value})}>
                        <option>Owned</option>
                        <option>Leased</option>
                        <option>Rented</option>
                     </select>
                  </div>
               </div>
            </div>

            <hr className="border-gray-100" />

            {/* Make & Specs */}
            <div>
               <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><Settings2Icon className="text-indigo-600"/> Specifications</h3>
               <div className="grid grid-cols-3 gap-6">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Make</label>
                     <input type="text" placeholder="e.g. Volvo" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Model</label>
                     <input type="text" placeholder="e.g. FH16" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mfg Year</label>
                     <input type="number" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value as any})} />
                  </div>
                  
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                     <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option>Heavy Truck</option>
                        <option>Medium Truck</option>
                        <option>Light Commercial</option>
                        <option>Van</option>
                        <option>Car</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Body Type</label>
                     <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                        <option>Flatbed</option>
                        <option>Reefer (Refrigerated)</option>
                        <option>Box Truck</option>
                        <option>Tanker</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Load Cap (KG)</label>
                     <input type="number" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value as any})} />
                  </div>
               </div>
            </div>

            <div className="flex justify-end pt-6">
               <button type="submit" disabled={loading} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg flex items-center gap-2 transition-all">
                  {loading ? 'Registering...' : <><Save size={20}/> Save & Proceed to Documents <ChevronRight size={20}/></>}
               </button>
            </div>
         </form>
      </div>
    </div>
  );
}

// Inline icon since it was imported wrong above
function Settings2Icon({ className }: { className?: string }) {
   return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
}
