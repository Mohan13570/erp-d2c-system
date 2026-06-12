import React, { useState, useEffect } from 'react';
import { ReceiptText, CreditCard, Banknote, Plus } from 'lucide-react';

export default function Billing() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'invoices' | 'notes'>('invoices');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const [iRes, nRes] = await Promise.all([fetch('/api/billing/invoices'), fetch('/api/billing/notes')]);
      if (iRes.ok) setInvoices(await iRes.json());
      if (nRes.ok) setNotes(await nRes.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/billing/${activeTab}`, {
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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Billing & Invoicing</h1>
          <p className="text-gray-500 font-medium mt-1">Customer/Vendor Invoices and Credit/Debit Notes.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2">
          <Plus size={18} /><span>Create Record</span>
        </button>
      </div>

      <div className="bg-gray-100/80 p-1.5 rounded-2xl w-fit flex space-x-1 mb-6 shrink-0">
        <button onClick={() => setActiveTab('invoices')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'invoices' ? 'bg-white text-pink-700 shadow-sm' : 'text-gray-500'}`}>
          <ReceiptText size={18} className="mr-2" /> Invoices
        </button>
        <button onClick={() => setActiveTab('notes')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'notes' ? 'bg-white text-pink-700 shadow-sm' : 'text-gray-500'}`}>
          <Banknote size={18} className="mr-2" /> Credit/Debit Notes
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'invoices' && (
          <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
             <thead className="bg-gray-50"><tr>
               {['ID', 'Type', 'Entity Name', 'Amount', 'Status', 'Due Date'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">{h}</th>)}
             </tr></thead>
             <tbody className="divide-y divide-gray-50">
               {invoices.map(i => (
                 <tr key={i.id}>
                   <td className="px-6 py-4 font-mono text-xs text-gray-400">{i.id.slice(0,8)}</td>
                   <td className="px-6 py-4 font-bold text-gray-900">{i.type}</td>
                   <td className="px-6 py-4 text-sm font-semibold text-pink-700">{i.entityName}</td>
                   <td className="px-6 py-4 text-sm font-black text-emerald-600">${i.amount}</td>
                   <td className="px-6 py-4"><span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg">{i.status}</span></td>
                   <td className="px-6 py-4 text-sm text-gray-500">{new Date(i.dueDate).toLocaleDateString()}</td>
                 </tr>
               ))}
             </tbody>
          </table>
        )}

        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {notes.map(n => (
               <div key={n.id} className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 ${n.type === 'Credit' ? 'border-l-green-500' : 'border-l-red-500'}`}>
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-gray-900 text-lg">{n.type} Note</h3>
                   <span className="font-mono text-xs text-gray-400">Inv: {n.invoiceId.slice(0,8)}</span>
                 </div>
                 <p className="text-3xl font-black mb-2">${n.amount}</p>
                 <p className="text-sm text-gray-600">{n.reason}</p>
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
               {activeTab === 'invoices' && (
                 <>
                   <select required className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, type: e.target.value})}>
                     <option value="">Invoice Type</option>
                     <option value="Customer">Customer</option>
                     <option value="Vendor">Vendor</option>
                   </select>
                   <input required placeholder="Entity Name (Customer/Vendor)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, entityName: e.target.value})} />
                   <input required type="number" placeholder="Amount ($)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} />
                   <input required type="date" title="Due Date" className="w-full p-3 border border-gray-200 rounded-xl text-gray-500 text-sm" onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                 </>
               )}
               {activeTab === 'notes' && (
                 <>
                   <select required className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, type: e.target.value})}>
                     <option value="">Note Type</option>
                     <option value="Credit">Credit Note</option>
                     <option value="Debit">Debit Note</option>
                   </select>
                   <input required placeholder="Original Invoice ID" className="w-full p-3 border border-gray-200 rounded-xl font-mono" onChange={e => setFormData({...formData, invoiceId: e.target.value})} />
                   <input required type="number" placeholder="Adjustment Amount ($)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} />
                   <input required placeholder="Reason for adjustment" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, reason: e.target.value})} />
                 </>
               )}
               <div className="pt-6 flex justify-end gap-3">
                 <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold">Cancel</button>
                 <button type="submit" className="px-5 py-2.5 bg-pink-600 text-white font-bold rounded-xl">Save</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
