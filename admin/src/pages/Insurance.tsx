import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Plus } from 'lucide-react';

export default function Insurance() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'policies' | 'claims'>('policies');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([fetch('/api/insurance/policies'), fetch('/api/insurance/claims')]);
      if (pRes.ok) setPolicies(await pRes.json());
      if (cRes.ok) setClaims(await cRes.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/insurance/${activeTab}`, {
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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Insurance Manager</h1>
          <p className="text-gray-500 font-medium mt-1">Cargo & Vehicle Policies and Active Claims.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2">
          <Plus size={18} /><span>Add Record</span>
        </button>
      </div>

      <div className="bg-gray-100/80 p-1.5 rounded-2xl w-fit flex space-x-1 mb-6 shrink-0">
        <button onClick={() => setActiveTab('policies')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'policies' ? 'bg-white text-cyan-700 shadow-sm' : 'text-gray-500'}`}>
          <Shield size={18} className="mr-2" /> Active Policies
        </button>
        <button onClick={() => setActiveTab('claims')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'claims' ? 'bg-white text-cyan-700 shadow-sm' : 'text-gray-500'}`}>
          <ShieldAlert size={18} className="mr-2" /> Insurance Claims
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'policies' && (
          <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
             <thead className="bg-gray-50"><tr>
               {['Policy No', 'Provider', 'Coverage', 'Premium', 'Valid Until'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">{h}</th>)}
             </tr></thead>
             <tbody className="divide-y divide-gray-50">
               {policies.map(p => (
                 <tr key={p.id}>
                   <td className="px-6 py-4 font-black text-cyan-900">{p.policyNo}</td>
                   <td className="px-6 py-4 font-bold text-gray-900">{p.provider}</td>
                   <td className="px-6 py-4 text-sm font-semibold">${p.coverage}</td>
                   <td className="px-6 py-4 text-sm font-black text-red-500">${p.premium}</td>
                   <td className="px-6 py-4 text-sm text-gray-500">{new Date(p.validUntil).toLocaleDateString()}</td>
                 </tr>
               ))}
             </tbody>
          </table>
        )}
        {activeTab === 'claims' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {claims.map(c => (
               <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-gray-900 text-lg">Claim ${c.amount}</h3>
                   <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg">{c.status}</span>
                 </div>
                 <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                   <p className="font-semibold mb-1">Policy: <span className="font-mono text-cyan-700">{c.policy?.policyNo}</span></p>
                   <p className="text-xs text-gray-400">Filed: {new Date(c.claimDate).toLocaleDateString()}</p>
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Create Record</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               {activeTab === 'policies' && (
                 <>
                   <input required placeholder="Policy Number" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, policyNo: e.target.value})} />
                   <input required placeholder="Insurance Provider" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, provider: e.target.value})} />
                   <div className="flex gap-4">
                     <input required type="number" placeholder="Coverage ($)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, coverage: parseFloat(e.target.value)})} />
                     <input required type="number" placeholder="Premium ($)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, premium: parseFloat(e.target.value)})} />
                   </div>
                   <input required type="date" title="Valid Until" className="w-full p-3 border border-gray-200 rounded-xl text-sm text-gray-500" onChange={e => setFormData({...formData, validUntil: e.target.value})} />
                 </>
               )}
               {activeTab === 'claims' && (
                 <>
                   <select required className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, policyId: e.target.value})}>
                     <option value="">Select Policy</option>
                     {policies.map(p => <option key={p.id} value={p.id}>{p.policyNo}</option>)}
                   </select>
                   <input required type="number" placeholder="Claim Amount ($)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} />
                 </>
               )}
               <div className="pt-6 flex justify-end gap-3">
                 <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold">Cancel</button>
                 <button type="submit" className="px-5 py-2.5 bg-cyan-600 text-white font-bold rounded-xl">Save</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
