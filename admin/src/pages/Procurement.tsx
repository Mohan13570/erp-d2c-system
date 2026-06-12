import React, { useState, useEffect } from 'react';
import { ShoppingCart, Users, Receipt, Plus } from 'lucide-react';

export default function Procurement() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [pos, setPos] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'vendors' | 'pos'>('pos');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const [vRes, pRes] = await Promise.all([fetch('/api/procurement/vendors'), fetch('/api/procurement/pos')]);
      if (vRes.ok) setVendors(await vRes.json());
      if (pRes.ok) setPos(await pRes.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/procurement/${activeTab}`, {
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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Procurement</h1>
          <p className="text-gray-500 font-medium mt-1">Vendor Management and Purchase Orders.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2">
          <Plus size={18} /><span>Add Record</span>
        </button>
      </div>

      <div className="bg-gray-100/80 p-1.5 rounded-2xl w-fit flex space-x-1 mb-6 shrink-0">
        <button onClick={() => setActiveTab('pos')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'pos' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500'}`}>
          <ShoppingCart size={18} className="mr-2" /> Purchase Orders
        </button>
        <button onClick={() => setActiveTab('vendors')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'vendors' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500'}`}>
          <Users size={18} className="mr-2" /> Vendors
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'vendors' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vendors.map(v => (
              <div key={v.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg mb-2">{v.name}</h3>
                <div className="text-sm text-gray-600"><p>{v.email}</p><p>{v.phone}</p></div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'pos' && (
          <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
             <thead className="bg-gray-50"><tr>
               {['PO ID', 'Vendor', 'Total', 'Status', 'Date'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">{h}</th>)}
             </tr></thead>
             <tbody className="divide-y divide-gray-50">
               {pos.map(p => (
                 <tr key={p.id}>
                   <td className="px-6 py-4 font-mono text-xs text-gray-400">{p.id.slice(0,8)}</td>
                   <td className="px-6 py-4 font-bold text-gray-900">{p.vendor?.name}</td>
                   <td className="px-6 py-4 text-sm font-black text-teal-600">${p.total}</td>
                   <td className="px-6 py-4"><span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg">{p.status}</span></td>
                   <td className="px-6 py-4 text-sm text-gray-500">{new Date(p.orderDate).toLocaleDateString()}</td>
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
               {activeTab === 'vendors' && (
                 <>
                   <input required placeholder="Vendor Name" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, name: e.target.value})} />
                   <input type="email" placeholder="Email" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, email: e.target.value})} />
                   <input placeholder="Phone" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, phone: e.target.value})} />
                 </>
               )}
               {activeTab === 'pos' && (
                 <>
                   <select required className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, vendorId: e.target.value})}>
                     <option value="">Select Vendor</option>
                     {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                   </select>
                   <input required type="number" placeholder="Total Amount ($)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, total: parseFloat(e.target.value)})} />
                 </>
               )}
               <div className="pt-6 flex justify-end gap-3">
                 <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold">Cancel</button>
                 <button type="submit" className="px-5 py-2.5 bg-teal-600 text-white font-bold rounded-xl">Save</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
