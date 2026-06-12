import { useState, useEffect } from 'react';
import { Truck, FileText, Package, Plus } from 'lucide-react';

interface PurchaseOrder { id: string; vendor: { name: string }; status: string; grandTotal: number; orderDate: string; expectedDate?: string; }
interface GRN { id: string; purchaseOrder: { vendor: { name: string } }; status: string; receivedDate: string; }
interface Vendor { id: string; name: string; country: string; paymentTerms: string; }

export default function SupplyChain() {
  const [pos, setPOs] = useState<PurchaseOrder[]>([]);
  const [grns, setGRNs] = useState<GRN[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [tab, setTab] = useState<'pos' | 'grns' | 'vendors'>('pos');
  const [showPOModal, setShowPOModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: '', country: '', paymentTerms: '', email: '', phone: '' });
  const [newPO, setNewPO] = useState({ vendorId: '', expectedDate: '' });
  const [poItems, setPoItems] = useState<{itemCode: string, qty: number, rate: number}[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);

  const fetchData = () => {
    fetch('/api/supply-chain/purchase-orders').then(r => r.json()).then(setPOs);
    fetch('/api/supply-chain/grns').then(r => r.json()).then(setGRNs);
    fetch('/api/supply-chain/vendors').then(r => r.json()).then(setVendors);
    fetch('/api/inventory/items').then(r => r.json()).then(setInventory);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statusStyle = (s: string) => {
    if (s === 'Submitted') return 'bg-indigo-100 text-indigo-700';
    if (s === 'Draft') return 'bg-gray-100 text-gray-700';
    return 'bg-emerald-100 text-emerald-700';
  };

  const handleCreateVendor = async () => {
    const res = await fetch('/api/supply-chain/vendors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newVendor) });
    if(res.ok) { setShowVendorModal(false); fetchData(); } else alert('Failed to create vendor');
  };

  const handleDeleteVendor = async (id: string) => {
    if(!window.confirm('Delete this vendor?')) return;
    const res = await fetch(`/api/supply-chain/vendors/${id}`, { method: 'DELETE' });
    if(res.ok) fetchData(); else { const data = await res.json(); alert(data.error); }
  };

  const handleCreatePO = async () => {
    if(!newPO.vendorId || poItems.length === 0) return alert('Vendor and items required');
    const res = await fetch('/api/supply-chain/purchase-orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newPO, items: poItems }) });
    if(res.ok) { setShowPOModal(false); fetchData(); } else alert('Failed to create PO');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Supply Chain</h1>
          <p className="text-gray-500 mt-1">Manage vendors, purchase orders, and goods receipts.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => { setTab('vendors'); setShowVendorModal(true); }} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-medium shadow-sm flex items-center">
            <Plus className="w-5 h-5 mr-2" /> New Vendor
          </button>
          <button onClick={() => { setTab('pos'); setShowPOModal(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm flex items-center">
            <Plus className="w-5 h-5 mr-2" /> New PO
          </button>
        </div>
      </div>

      {showVendorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Create Vendor</h2>
            <div className="space-y-4">
              <input placeholder="Vendor Name" className="w-full p-3 border rounded-xl" onChange={e => setNewVendor({...newVendor, name: e.target.value})} />
              <input placeholder="Country" className="w-full p-3 border rounded-xl" onChange={e => setNewVendor({...newVendor, country: e.target.value})} />
              <input placeholder="Payment Terms (e.g. Net 30)" className="w-full p-3 border rounded-xl" onChange={e => setNewVendor({...newVendor, paymentTerms: e.target.value})} />
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowVendorModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleCreateVendor} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md">Create</button>
            </div>
          </div>
        </div>
      )}

      {showPOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Create Purchase Order</h2>
            <div className="space-y-6">
              <select className="w-full p-3 border rounded-xl" onChange={e => setNewPO({...newPO, vendorId: e.target.value})}>
                <option value="">Select Vendor...</option>
                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
              <input type="date" className="w-full p-3 border rounded-xl" onChange={e => setNewPO({...newPO, expectedDate: e.target.value})} />
              
              <div className="space-y-3">
                <label className="block text-sm font-semibold">PO Items</label>
                {poItems.map((oi, idx) => {
                  const itemData = inventory.find(i => i.itemCode === oi.itemCode);
                  return (
                    <div key={idx} className="flex gap-3 items-center bg-gray-50 p-3 rounded-xl border">
                      <span className="flex-1 font-medium">{itemData?.itemName || oi.itemCode}</span>
                      <input type="number" className="w-24 p-2 border rounded-lg text-center" value={oi.qty} onChange={e => { const newI = [...poItems]; newI[idx].qty = parseInt(e.target.value)||1; setPoItems(newI); }} />
                      <input type="number" className="w-24 p-2 border rounded-lg text-center" value={oi.rate} onChange={e => { const newI = [...poItems]; newI[idx].rate = parseFloat(e.target.value)||0; setPoItems(newI); }} placeholder="Rate" />
                      <span className="font-bold w-24 text-right">${(oi.rate * oi.qty).toFixed(2)}</span>
                    </div>
                  );
                })}
                <select className="w-full p-3 border rounded-xl bg-white" value="" onChange={e => { if(e.target.value) setPoItems([...poItems, { itemCode: e.target.value, qty: 1, rate: inventory.find(i => i.itemCode === e.target.value)?.valuationRate || 0 }]); }}>
                  <option value="">+ Add an item to PO...</option>
                  {inventory.map(item => <option key={item.itemCode} value={item.itemCode}>{item.itemName}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowPOModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleCreatePO} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md">Create PO</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        {([['pos', 'Purchase Orders', FileText], ['grns', 'GRN', Truck], ['vendors', 'Vendors', Package]] as const).map(([key, label, Icon]) => (
          <button key={key} onClick={() => setTab(key)} className={`flex items-center px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <Icon size={16} className="mr-2" /> {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {tab === 'pos' && (
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50"><tr>
              {['PO ID', 'Vendor', 'Order Date', 'Expected', 'Status', 'Total', 'Action'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {pos.map(po => <tr key={po.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 text-sm font-semibold text-indigo-600">{po.id.substring(0, 8)}…</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{po.vendor.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(po.orderDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{po.expectedDate ? new Date(po.expectedDate).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4"><span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyle(po.status)}`}>{po.status}</span></td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">${po.grandTotal.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm">
                  {po.status !== 'Received' && (
                    <button onClick={async () => {
                      if(!window.confirm('Receive all items for this PO?')) return;
                      await fetch('/api/supply-chain/grns', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ purchaseOrderId: po.id }) });
                      fetchData();
                    }} className="text-indigo-600 font-bold hover:underline">Receive</button>
                  )}
                </td>
              </tr>)}
            </tbody>
          </table>
        )}
        {tab === 'grns' && (
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50"><tr>
              {['GRN ID', 'Vendor', 'Received Date', 'Status'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {grns.map(g => <tr key={g.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 text-sm font-semibold text-indigo-600">{g.id.substring(0, 8)}…</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{g.purchaseOrder.vendor.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(g.receivedDate).toLocaleDateString()}</td>
                <td className="px-6 py-4"><span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyle(g.status)}`}>{g.status}</span></td>
              </tr>)}
            </tbody>
          </table>
        )}
        {tab === 'vendors' && (
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50"><tr>
              {['Vendor Name', 'Country', 'Payment Terms', 'Action'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {vendors.map(v => <tr key={v.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{v.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{v.country}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{v.paymentTerms}</td>
                <td className="px-6 py-4 text-sm"><button onClick={() => handleDeleteVendor(v.id)} className="text-red-500 font-bold hover:underline">Delete</button></td>
              </tr>)}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
