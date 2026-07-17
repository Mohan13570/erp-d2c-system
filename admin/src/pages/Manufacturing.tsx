import { useState, useEffect } from 'react';
import { Cpu, Wrench, Plus } from 'lucide-react';

interface BOM { id: string; item: { itemName: string }; quantity: number; isActive: boolean; bomItems: { item: { itemName: string }; qty: number; uom: string }[]; }
interface WorkOrder { id: string; bom: { item: { itemName: string } }; plannedQty: number; producedQty: number; status: string; plannedStart: string; plannedEnd: string; }

export default function Manufacturing() {
  const [boms, setBOMs] = useState<BOM[]>([]);
  const [wos, setWOs] = useState<WorkOrder[]>([]);
  const [tab, setTab] = useState<'bom' | 'wo'>('wo');
  const [showWOModal, setShowWOModal] = useState(false);
  const [showBOMModal, setShowBOMModal] = useState(false);
  const [newWO, setNewWO] = useState({ bomId: '', plannedQty: 0, plannedStart: '', plannedEnd: '' });
  const [newBOM, setNewBOM] = useState({ itemCode: '', quantity: 0 });
  const [bomItems, setBomItems] = useState<{itemCode: string, qty: number, uom: string}[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);

  const fetchData = () => {
    fetch('/api/manufacturing/boms').then(r => r.json()).then(setBOMs);
    fetch('/api/manufacturing/work-orders').then(r => r.json()).then(setWOs);
    fetch('/api/inventory/items').then(r => r.json()).then(setInventory);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statusStyle = (s: string) => {
    if (s === 'Completed') return 'bg-emerald-100 text-emerald-700';
    if (s === 'In Process') return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-600';
  };

  const handleCreateBOM = async () => {
    if(!newBOM.itemCode || bomItems.length === 0) return alert('Select an item and components');
    const res = await fetch('/api/manufacturing/boms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newBOM, items: bomItems }) });
    if(res.ok) { setShowBOMModal(false); fetchData(); setBomItems([]); } else alert('Failed to create BOM');
  };

  const handleCreateWO = async () => {
    if(!newWO.bomId || newWO.plannedQty <= 0) return alert('Select BOM and valid quantity');
    const res = await fetch('/api/manufacturing/work-orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newWO) });
    if(res.ok) { setShowWOModal(false); fetchData(); } else alert('Failed to create Work Order');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manufacturing</h1>
          <p className="text-gray-500 mt-1">Manage Bills of Materials and production Work Orders.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => { setTab('bom'); setShowBOMModal(true); }} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-medium shadow-sm flex items-center">
            <Plus className="w-5 h-5 mr-2" /> New BOM
          </button>
          <button onClick={() => { setTab('wo'); setShowWOModal(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm flex items-center">
            <Plus className="w-5 h-5 mr-2" /> New Work Order
          </button>
        </div>
      </div>

      {showBOMModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Create Bill of Materials</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <select className="flex-1 p-3 border rounded-xl" onChange={e => setNewBOM({...newBOM, itemCode: e.target.value})}>
                  <option value="">Select Finished Good...</option>
                  {inventory.map(i => <option key={i.itemCode} value={i.itemCode}>{i.itemName}</option>)}
                </select>
                <input type="number" placeholder="Qty" className="w-24 p-3 border rounded-xl" value={newBOM.quantity} onChange={e => setNewBOM({...newBOM, quantity: Number(e.target.value)})} />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-semibold">Components</label>
                {bomItems.map((bi, idx) => (
                  <div key={idx} className="flex gap-3 items-center bg-gray-50 p-3 rounded-xl border">
                    <span className="flex-1 font-medium">{inventory.find(i => i.itemCode === bi.itemCode)?.itemName || bi.itemCode}</span>
                    <input type="number" className="w-24 p-2 border rounded-lg text-center" value={bi.qty} onChange={e => { const b = [...bomItems]; b[idx].qty = Number(e.target.value); setBomItems(b); }} />
                    <input type="text" className="w-20 p-2 border rounded-lg text-center" value={bi.uom} onChange={e => { const b = [...bomItems]; b[idx].uom = e.target.value; setBomItems(b); }} placeholder="UOM" />
                  </div>
                ))}
                <select className="w-full p-3 border rounded-xl bg-white" value="" onChange={e => { if(e.target.value) setBomItems([...bomItems, { itemCode: e.target.value, qty: 1, uom: 'Nos' }]); }}>
                  <option value="">+ Add Component...</option>
                  {inventory.map(item => <option key={item.itemCode} value={item.itemCode}>{item.itemName}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowBOMModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleCreateBOM} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md">Create BOM</button>
            </div>
          </div>
        </div>
      )}

      {showWOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Create Work Order</h2>
            <div className="space-y-4">
              <select className="w-full p-3 border rounded-xl" onChange={e => setNewWO({...newWO, bomId: e.target.value})}>
                <option value="">Select BOM...</option>
                {boms.map(b => <option key={b.id} value={b.id}>{b.item?.itemName}</option>)}
              </select>
              <input type="number" placeholder="Planned Qty" className="w-full p-3 border rounded-xl" onChange={e => setNewWO({...newWO, plannedQty: Number(e.target.value)})} />
              <div className="flex gap-4">
                <input type="date" className="w-full p-3 border rounded-xl text-gray-500" onChange={e => setNewWO({...newWO, plannedStart: e.target.value})} />
                <input type="date" className="w-full p-3 border rounded-xl text-gray-500" onChange={e => setNewWO({...newWO, plannedEnd: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowWOModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleCreateWO} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md">Create</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button onClick={() => setTab('wo')} className={`flex items-center px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'wo' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <Wrench size={16} className="mr-2" /> Work Orders
        </button>
        <button onClick={() => setTab('bom')} className={`flex items-center px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'bom' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <Cpu size={16} className="mr-2" /> Bill of Materials
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {tab === 'wo' && (
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50"><tr>
              {['Product', 'Planned Qty', 'Produced', 'Status', 'Planned Start', 'Planned End'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {wos.map(wo => (
                <tr key={wo.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{wo.bom.item.itemName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{wo.plannedQty}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{wo.producedQty}</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyle(wo.status)}`}>{wo.status}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{wo.plannedStart ? new Date(wo.plannedStart).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{wo.plannedEnd ? new Date(wo.plannedEnd).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === 'bom' && (
          <div className="p-6 space-y-4">
            {boms.map(bom => (
              <div key={bom.id} className="border border-gray-100 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-3">{bom.item.itemName} — Qty: {bom.quantity}</h3>
                <table className="w-full text-sm">
                  <thead><tr className="text-xs text-gray-500 uppercase"><th className="text-left pb-2">Component</th><th className="text-left pb-2">Qty</th><th className="text-left pb-2">UOM</th></tr></thead>
                  <tbody>
                    {bom.bomItems.map((bi, i) => <tr key={i} className="border-t border-gray-50">
                      <td className="py-2">{bi.item.itemName}</td><td className="py-2">{bi.qty}</td><td className="py-2">{bi.uom}</td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
