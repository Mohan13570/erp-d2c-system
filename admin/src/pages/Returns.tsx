import { useState, useEffect } from 'react';
import { RotateCcw, Plus } from 'lucide-react';

interface ReturnItem { itemCode: string; qty: number; condition: string; }
interface Return { id: string; salesOrder: { id: string }; status: string; reason: string; resolution: string; refundAmount: number; createdAt: string; items: ReturnItem[]; }

export default function Returns() {
  const [returns, setReturns] = useState<Return[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newReturn, setNewReturn] = useState({ salesOrderId: '', reason: 'Defective', items: [{ itemCode: '', qty: 1, condition: 'Damaged' }] });
  const [salesOrders, setSalesOrders] = useState<any[]>([]);

  const fetchData = () => {
    fetch('/api/returns/returns').then(r => r.json()).then(data => setReturns(Array.isArray(data) ? data : []));
    fetch('/api/orders').then(r => r.json()).then(data => setSalesOrders(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statusStyle = (s: string) => {
    if (s === 'Approved') return 'bg-emerald-100 text-emerald-700';
    if (s === 'Rejected') return 'bg-red-100 text-red-700';
    return 'bg-amber-100 text-amber-700';
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/returns/returns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReturn)
    });
    setShowModal(false);
    fetchData();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Returns</h1>
          <p className="text-gray-500 mt-1">Process return requests and manage refunds.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm flex items-center">
          <Plus className="w-5 h-5 mr-2" /> Initiate Return
        </button>
      </div>

      {returns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <RotateCcw size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No return requests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {returns.map(ret => (
            <div key={ret.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-widest">Return ID: {ret.id.substring(0, 8)}</p>
                  <p className="font-black text-gray-900 text-lg">Order #{ret.salesOrder?.id?.substring(0,8) || 'N/A'}</p>
                  <p className="font-medium text-gray-600 mt-1">Reason: {ret.reason}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full ${statusStyle(ret.status)}`}>{ret.status}</span>
                  <p className="text-xs text-gray-400 font-bold mt-3">{new Date(ret.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Resolution</p><p className="font-bold text-gray-900">{ret.resolution || 'Pending'}</p></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Refund Amount</p><p className="font-black text-indigo-600">${ret.refundAmount.toFixed(2)}</p></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Items</p>
                  <p className="font-medium text-gray-700">{ret.items.map(i => `${i.itemCode} (${i.qty})`).join(', ') || '0 item(s)'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center"><RotateCcw className="mr-2" /> Initiate Return</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <select required className="w-full p-3 border rounded-xl font-medium text-gray-700" onChange={e => setNewReturn({...newReturn, salesOrderId: e.target.value})}>
                <option value="">Select Sales Order...</option>
                {salesOrders.map(so => (
                  <option key={so.id} value={so.id}>Order #{so.id.substring(0,8)} - ${so.grandTotal}</option>
                ))}
              </select>
              
              <input required placeholder="Reason for Return" className="w-full p-3 border rounded-xl" onChange={e => setNewReturn({...newReturn, reason: e.target.value})} value={newReturn.reason} />

              <div className="space-y-2 mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Return Items</label>
                {newReturn.items.map((it, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input required placeholder="Item Code" className="flex-1 p-2 border rounded-xl text-sm" value={it.itemCode} onChange={e => { const items = [...newReturn.items]; items[idx].itemCode = e.target.value; setNewReturn({...newReturn, items}); }} />
                    <input required type="number" placeholder="Qty" className="w-20 p-2 border rounded-xl text-sm" value={it.qty || ''} onChange={e => { const items = [...newReturn.items]; items[idx].qty = Number(e.target.value); setNewReturn({...newReturn, items}); }} />
                    <select className="w-32 p-2 border rounded-xl text-sm" value={it.condition} onChange={e => { const items = [...newReturn.items]; items[idx].condition = e.target.value; setNewReturn({...newReturn, items}); }}>
                      <option>Damaged</option>
                      <option>Good</option>
                      <option>Defective</option>
                    </select>
                  </div>
                ))}
                <button type="button" onClick={() => setNewReturn({...newReturn, items: [...newReturn.items, { itemCode: '', qty: 1, condition: 'Damaged' }]})} className="text-indigo-600 text-sm font-bold mt-2">+ Add Item</button>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg">Submit Return</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
