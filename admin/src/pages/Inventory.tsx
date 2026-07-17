import { useState, useEffect } from 'react';
import { Package, Layers, FileText, ArrowUpRight, ArrowDownRight, Search, Plus, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Item { itemCode: string; itemName: string; itemGroup: string; standardRate: number; valuationRate: number; }
interface StockLevel { id: string; item: Item; warehouse: { warehouseName: string }; qtyOnHand: number; qtyReserved: number; qtyAvailable: number; }
interface StockLedger { id: string; item: Item; warehouseRef: { warehouseName: string }; postingDate: string; voucherType: string; voucherNo: string; qty: number; }

export default function Inventory() {
  const [items, setItems] = useState<Item[]>([]);
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [ledgers, setLedgers] = useState<StockLedger[]>([]);
  const [tab, setTab] = useState<'catalog' | 'levels' | 'ledger'>('catalog');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newItem, setNewItem] = useState({ itemCode: '', itemName: '', standardRate: 0, valuationRate: 0, initialStock: 0, warehouseName: 'Lizome Main Warehouse', imageBase64: '' });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem(prev => ({ ...prev, imageBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/inventory/items').then(r => r.json()),
      fetch('/api/inventory/stock-levels').then(r => r.json()),
      fetch('/api/inventory/stock-ledgers').then(r => r.json())
    ]).then(([i, sl, slg]) => {
      setItems(i); setStockLevels(sl); setLedgers(slg); setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateItem = async () => {
    try {
      const res = await fetch('/api/inventory/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (res.ok) {
        setShowModal(false);
        setNewItem({ itemCode: '', itemName: '', standardRate: 0, valuationRate: 0, initialStock: 0, warehouseName: 'Lizome Main Warehouse', imageBase64: '' });
        fetchData();
      } else {
        alert('Failed to create item');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (itemCode: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete item ${itemCode}?`)) return;
    try {
      const res = await fetch(`/api/inventory/items/${itemCode}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to delete item');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalValue = stockLevels.reduce((sum, sl) => sum + ((sl.qtyOnHand || 0) * (sl.item?.valuationRate || 0)), 0);
  const lowStockCount = stockLevels.filter(sl => (sl.qtyOnHand || 0) < 50).length;
  
  const filteredItems = items.filter(item => 
    (item.itemName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (item.itemCode || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header section with glass blur */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Inventory Intelligence</h1>
          <p className="text-gray-500 font-medium mt-1">Real-time stock valuation and tracking.</p>
        </div>
        <div className="flex space-x-3 items-center">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5 flex items-center transition-all">
            <Plus size={18} className="mr-2" /> New Item
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Create New Item</h2>
            <div className="space-y-4">
              <input placeholder="Item Code (e.g. ITEM-001)" className="w-full p-3 border rounded-xl" onChange={e => setNewItem({...newItem, itemCode: e.target.value})} />
              <input placeholder="Item Name" className="w-full p-3 border rounded-xl" onChange={e => setNewItem({...newItem, itemName: e.target.value})} />
              <div className="flex gap-4">
                <input type="number" placeholder="Selling Price ($)" className="w-full p-3 border rounded-xl" onChange={e => setNewItem({...newItem, standardRate: Number(e.target.value)})} />
                <input type="number" placeholder="Cost/Valuation ($)" className="w-full p-3 border rounded-xl" onChange={e => setNewItem({...newItem, valuationRate: Number(e.target.value)})} />
              </div>
              <div className="flex gap-4">
                <input type="number" placeholder="Initial Stock Qty" className="w-full p-3 border rounded-xl" onChange={e => setNewItem({...newItem, initialStock: Number(e.target.value)})} />
                <input placeholder="Warehouse Name" value={newItem.warehouseName} className="w-full p-3 border rounded-xl" onChange={e => setNewItem({...newItem, warehouseName: e.target.value})} />
              </div>
              
              <div className="border border-gray-200 p-4 rounded-xl mt-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Image (D2C Store)</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
                {newItem.imageBase64 && <div className="mt-3 w-16 h-16 rounded-xl border border-gray-100 overflow-hidden"><img src={newItem.imageBase64} alt="Preview" className="w-full h-full object-cover" /></div>}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="d2c-vis" className="rounded text-indigo-600 focus:ring-indigo-500 w-5 h-5 cursor-pointer" checked={(newItem as any).isD2cVisible ?? true} onChange={e => setNewItem({...newItem, isD2cVisible: e.target.checked} as any)} />
                <label htmlFor="d2c-vis" className="text-sm font-bold text-gray-700 cursor-pointer">Publish to D2C Storefront</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleCreateItem} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-8 rounded-3xl shadow-lg shadow-indigo-500/20 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform"><Layers size={80} /></div>
          <p className="font-medium text-indigo-100 mb-2 relative z-10">Total Inventory Value</p>
          <p className="text-4xl font-black tracking-tight relative z-10">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 text-gray-900"><Package size={80} /></div>
          <p className="font-medium text-gray-500 mb-2">Total Unique SKUs</p>
          <p className="text-4xl font-black text-gray-900 tracking-tight">{items.length}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 text-rose-500"><AlertCircle size={80} /></div>
          <p className="font-medium text-gray-500 mb-2">Low Stock Alerts</p>
          <div className="flex items-center space-x-3">
            <p className="text-4xl font-black text-rose-600 tracking-tight">{lowStockCount}</p>
            {lowStockCount > 0 && <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">Requires Action</span>}
          </div>
        </div>
      </div>

      {/* Premium Tab Navigation */}
      <div className="bg-gray-100/80 backdrop-blur-md p-1.5 rounded-2xl w-fit flex space-x-1 border border-white/50 shadow-inner">
        {[
          { id: 'catalog', label: 'Item Catalog', icon: FileText },
          { id: 'levels', label: 'Stock Levels', icon: Layers },
          { id: 'ledger', label: 'Stock Ledger', icon: FileText }
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${tab === t.id ? 'bg-white text-indigo-700 shadow-sm scale-100' : 'text-gray-500 hover:text-gray-800 scale-95 hover:scale-100'}`}>
            <t.icon size={18} className="mr-2" /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content Areas */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative min-h-[400px]">
        {loading && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}
        
        {/* CATALOG TAB */}
        {tab === 'catalog' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-50">
              <thead className="bg-gray-50/80 backdrop-blur-sm"><tr>
                {['Item Code', 'Product Name', 'Category', 'Selling Price', 'Valuation Rate', ''].map(h => <th key={h} className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map(item => (
                  <tr key={item.itemCode} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                    <td className="px-8 py-5 text-sm font-bold text-indigo-600">{item.itemCode}</td>
                    <td className="px-8 py-5 text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{item.itemName}</td>
                    <td className="px-8 py-5"><span className="px-3 py-1 text-xs font-bold rounded-lg bg-gray-100 text-gray-600">{item.itemGroup}</span></td>
                    <td className="px-8 py-5 text-sm font-black text-gray-900">${item.standardRate.toFixed(2)}</td>
                    <td className="px-8 py-5 text-sm font-medium text-gray-500">${item.valuationRate.toFixed(2)}</td>
                    <td className="px-8 py-5 text-right">
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.itemCode); }} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* STOCK LEVELS TAB */}
        {tab === 'levels' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {stockLevels.map(sl => (
              <div key={sl.id} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow bg-gradient-to-b from-white to-gray-50/50">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{sl.item.itemName}</h3>
                    <p className="text-sm font-medium text-gray-500">{sl.warehouse.warehouseName}</p>
                  </div>
                  {sl.qtyOnHand > 50 ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-rose-500" />}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">In Stock</p>
                    <p className={`text-2xl font-black ${sl.qtyOnHand > 50 ? 'text-gray-900' : 'text-rose-600'}`}>{sl.qtyOnHand}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Reserved</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-black text-amber-600">{sl.qtyReserved}</p>
                      <button onClick={() => {
                        const val = prompt('Enter new reserved quantity:', sl.qtyReserved.toString());
                        if(val !== null && !isNaN(Number(val))) {
                          fetch(`/api/inventory/stock-levels/${sl.id}/reserve`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ qtyReserved: Number(val) })
                          }).then(() => fetchData());
                        }
                      }} className="text-xs text-indigo-600 hover:underline">Edit</button>
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Available</p>
                    <p className="text-2xl font-black text-indigo-700">{sl.qtyAvailable}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STOCK LEDGER TAB */}
        {tab === 'ledger' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-50">
              <thead className="bg-gray-50/80 backdrop-blur-sm"><tr>
                {['Date', 'Item', 'Warehouse', 'Voucher', 'Qty Change'].map(h => <th key={h} className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {ledgers.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5 text-sm font-medium text-gray-500">{new Date(l.postingDate).toLocaleDateString()}</td>
                    <td className="px-8 py-5 text-sm font-bold text-gray-900">{l.item?.itemName}</td>
                    <td className="px-8 py-5 text-sm text-gray-600 font-medium">{l.warehouseRef?.warehouseName}</td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-gray-900">{l.voucherNo}</div>
                      <div className="text-xs font-medium text-gray-500">{l.voucherType}</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold ${l.qty > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {l.qty > 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                        {Math.abs(l.qty)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
