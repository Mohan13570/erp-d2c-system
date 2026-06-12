import React, { useState, useEffect } from 'react';
import { Landmark, FileSpreadsheet, Plus } from 'lucide-react';

export default function Finance() {
  const [coa, setCoa] = useState<any[]>([]);
  const [journals, setJournals] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'coa' | 'journals'>('coa');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const [cRes, jRes] = await Promise.all([fetch('/api/finance/coa'), fetch('/api/finance/journals')]);
      if (cRes.ok) setCoa(await cRes.json());
      if (jRes.ok) setJournals(await jRes.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/finance/${activeTab}`, {
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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Finance & Accounting</h1>
          <p className="text-gray-500 font-medium mt-1">Chart of Accounts and Journal Entries.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2">
          <Plus size={18} /><span>Add Record</span>
        </button>
      </div>

      <div className="bg-gray-100/80 p-1.5 rounded-2xl w-fit flex space-x-1 mb-6 shrink-0">
        <button onClick={() => setActiveTab('coa')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'coa' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500'}`}>
          <Landmark size={18} className="mr-2" /> Chart of Accounts
        </button>
        <button onClick={() => setActiveTab('journals')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'journals' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500'}`}>
          <FileSpreadsheet size={18} className="mr-2" /> Journal Entries
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'coa' && (
          <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
             <thead className="bg-gray-50"><tr>
               {['Code', 'Name', 'Type', 'Balance'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">{h}</th>)}
             </tr></thead>
             <tbody className="divide-y divide-gray-50">
               {coa.map(c => (
                 <tr key={c.id}>
                   <td className="px-6 py-4 font-black text-indigo-900">{c.code}</td>
                   <td className="px-6 py-4 font-bold text-gray-900">{c.name}</td>
                   <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg">{c.type}</span></td>
                   <td className="px-6 py-4 text-sm font-black text-emerald-600">${c.balance}</td>
                 </tr>
               ))}
             </tbody>
          </table>
        )}
        {activeTab === 'journals' && (
          <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
             <thead className="bg-gray-50"><tr>
               {['Date', 'Description', 'Debit', 'Credit'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">{h}</th>)}
             </tr></thead>
             <tbody className="divide-y divide-gray-50">
               {journals.map(j => (
                 <tr key={j.id}>
                   <td className="px-6 py-4 text-sm text-gray-500">{new Date(j.date).toLocaleDateString()}</td>
                   <td className="px-6 py-4 font-bold text-gray-900">{j.description}</td>
                   <td className="px-6 py-4 text-sm font-black text-emerald-600">${j.debit}</td>
                   <td className="px-6 py-4 text-sm font-black text-red-600">${j.credit}</td>
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
               {activeTab === 'coa' && (
                 <>
                   <input required placeholder="Account Code (e.g. 1000)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, code: e.target.value})} />
                   <input required placeholder="Account Name" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, name: e.target.value})} />
                   <select required className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, type: e.target.value})}>
                     <option value="">Account Type</option>
                     <option value="Asset">Asset</option>
                     <option value="Liability">Liability</option>
                     <option value="Equity">Equity</option>
                     <option value="Revenue">Revenue</option>
                     <option value="Expense">Expense</option>
                   </select>
                 </>
               )}
               {activeTab === 'journals' && (
                 <>
                   <input required placeholder="Description" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, description: e.target.value})} />
                   <div className="flex gap-4">
                     <input required type="number" placeholder="Debit Amount" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, debit: parseFloat(e.target.value)})} />
                     <input required type="number" placeholder="Credit Amount" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, credit: parseFloat(e.target.value)})} />
                   </div>
                 </>
               )}
               <div className="pt-6 flex justify-end gap-3">
                 <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold">Cancel</button>
                 <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl">Save</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
