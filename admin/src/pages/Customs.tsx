import React, { useState, useEffect } from 'react';
import { ShieldCheck, Scale, Globe, Plus } from 'lucide-react';

export default function Customs() {
  const [declarations, setDeclarations] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'decls' | 'rules'>('decls');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const [dRes, rRes] = await Promise.all([
        fetch('/api/customs/declarations'), fetch('/api/customs/rules')
      ]);
      if (dRes.ok) setDeclarations(await dRes.json());
      if (rRes.ok) setRules(await rRes.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/customs/${activeTab === 'decls' ? 'declarations' : 'rules'}`, {
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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Customs Clearance</h1>
          <p className="text-gray-500 font-medium mt-1">Import/Export declarations, duties, and compliance rules.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2">
          <Plus size={18} /><span>Add Record</span>
        </button>
      </div>

      <div className="bg-gray-100/80 p-1.5 rounded-2xl w-fit flex space-x-1 mb-6 shrink-0">
        <button onClick={() => setActiveTab('decls')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'decls' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-500'}`}>
          <Globe size={18} className="mr-2" /> Declarations
        </button>
        <button onClick={() => setActiveTab('rules')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'rules' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-500'}`}>
          <Scale size={18} className="mr-2" /> Compliance Rules
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'decls' && (
          <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
             <thead className="bg-gray-50"><tr>
               {['Ref No', 'Type', 'Status', 'Submitted', 'Duties'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">{h}</th>)}
             </tr></thead>
             <tbody className="divide-y divide-gray-50">
               {declarations.map(d => (
                 <tr key={d.id}>
                   <td className="px-6 py-4 font-bold text-gray-900">{d.referenceNo}</td>
                   <td className="px-6 py-4 text-sm font-semibold">{d.type}</td>
                   <td className="px-6 py-4"><span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg">{d.status}</span></td>
                   <td className="px-6 py-4 text-sm text-gray-500">{new Date(d.submissionDate).toLocaleDateString()}</td>
                   <td className="px-6 py-4 text-sm font-bold text-red-600">{d.duties?.length || 0} Unpaid</td>
                 </tr>
               ))}
             </tbody>
          </table>
        )}

        {activeTab === 'rules' && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {rules.map(r => (
               <div key={r.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-red-500">
                 <div className="flex justify-between items-center mb-3">
                   <h3 className="font-black text-gray-900 text-lg">{r.countryCode}</h3>
                   <span className="bg-green-100 text-green-700 px-2 py-1 text-xs font-bold rounded">Active</span>
                 </div>
                 <h4 className="text-sm font-bold text-red-600 mb-2">{r.ruleType}</h4>
                 <p className="text-sm text-gray-600">{r.description}</p>
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
               {activeTab === 'decls' && (
                 <>
                   <input required placeholder="Declaration Reference No." className="w-full p-3 border border-gray-200 rounded-xl font-mono" onChange={e => setFormData({...formData, referenceNo: e.target.value})} />
                   <select required className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, type: e.target.value})}>
                     <option value="">Type</option>
                     <option value="Import">Import</option>
                     <option value="Export">Export</option>
                   </select>
                 </>
               )}
               {activeTab === 'rules' && (
                 <>
                   <input required placeholder="Country Code (e.g. US, AE, IN)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, countryCode: e.target.value})} />
                   <input required placeholder="Rule Type (e.g. HS Code Restriction)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, ruleType: e.target.value})} />
                   <textarea required placeholder="Rule Description" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, description: e.target.value})} />
                 </>
               )}
               <div className="pt-6 flex justify-end gap-3">
                 <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold">Cancel</button>
                 <button type="submit" className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl">Save</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
