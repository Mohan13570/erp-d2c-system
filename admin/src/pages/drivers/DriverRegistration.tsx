import React, { useState } from 'react';
import { UserPlus, ChevronRight, Save, HeartPulse, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DriverRegistration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    licenseNo: '',
    licenseExpiry: '',
    medicalCertExpiry: '',
    emergencyContact: '',
    emergencyPhone: '',
    bloodGroup: 'O+',
    payrollId: '',
    hourlyRate: 25.0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        navigate(`/drivers/${data.id}`);
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
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Onboard New Driver</h1>
        <p className="text-gray-500 font-medium mt-1">Add a new driver to the HR Master Database.</p>
      </div>

      <div className="flex-1 overflow-auto">
         <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
            {/* Basic Info & License */}
            <div>
               <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><UserPlus size={20} className="text-indigo-600"/> Identity & Licensing</h3>
               <div className="grid grid-cols-2 gap-6">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Legal Name</label>
                     <input required type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Commercial License Number</label>
                     <input required type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold uppercase" value={formData.licenseNo} onChange={e => setFormData({...formData, licenseNo: e.target.value.toUpperCase()})} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone Number</label>
                     <input type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">License Expiry Date</label>
                     <input type="date" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={formData.licenseExpiry} onChange={e => setFormData({...formData, licenseExpiry: e.target.value})} />
                  </div>
               </div>
            </div>

            <hr className="border-gray-100" />

            {/* Health & Emergency */}
            <div>
               <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><HeartPulse size={20} className="text-red-500"/> Health & Emergency</h3>
               <div className="grid grid-cols-3 gap-6">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Blood Group</label>
                     <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
                        <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                        <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Medical Cert Expiry</label>
                     <input type="date" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={formData.medicalCertExpiry} onChange={e => setFormData({...formData, medicalCertExpiry: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Emergency Contact Name</label>
                     <input type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={formData.emergencyContact} onChange={e => setFormData({...formData, emergencyContact: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Emergency Phone</label>
                     <input type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={formData.emergencyPhone} onChange={e => setFormData({...formData, emergencyPhone: e.target.value})} />
                  </div>
               </div>
            </div>

            <hr className="border-gray-100" />

            {/* Payroll */}
            <div>
               <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><CreditCard size={20} className="text-emerald-500"/> Payroll Integration</h3>
               <div className="grid grid-cols-2 gap-6">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Employee / Payroll ID</label>
                     <input type="text" placeholder="e.g. EMP-1042" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={formData.payrollId} onChange={e => setFormData({...formData, payrollId: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Hourly Rate ($)</label>
                     <input type="number" step="0.5" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: parseFloat(e.target.value)})} />
                  </div>
               </div>
            </div>

            <div className="flex justify-end pt-6">
               <button type="submit" disabled={loading} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg flex items-center gap-2 transition-all">
                  {loading ? 'Onboarding...' : <><Save size={20}/> Save Driver Profile <ChevronRight size={20}/></>}
               </button>
            </div>
         </form>
      </div>
    </div>
  );
}
