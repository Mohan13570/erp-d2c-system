import { useState, useEffect } from 'react';
import { Package, Layers, FileText, ArrowUpRight, ArrowDownRight, Search, Plus, Filter, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Item { itemCode: string; itemName: string; itemGroup: string; standardRate: number; valuationRate: number; minimum_stock: number; }
interface StockLevel { id: string; itemCode: string; item: Item; warehouseName: string; qtyOnHand: number; qtyReserved: number; qtyAvailable: number; }
interface StockLedger { id: string; itemCode: string; item: Item; warehouse: string; postingDate: string; voucherType: string; voucherNo: string; qty: number; }
interface Warehouse { name: string; }

export default function Inventory() {
  const { token } = useAuth();
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  // Tab State
  const [tab, setTab] = useState<'catalog' | 'levels' | 'ledger'>('catalog');
  const [loading, setLoading] = useState(true);

  // Modals
  const [showItemModal, setShowItemModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  // Catalog State
  const [items, setItems] = useState<Item[]>([]);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogGroup, setCatalogGroup] = useState('All');
  const [catalogPage, setCatalogPage] = useState(1);
  const [catalogTotalPages, setCatalogTotalPages] = useState(1);
  const [newItem, setNewItem] = useState({ itemCode: '', itemName: '', standardRate: 0, valuationRate: 0, initialStock: 0, warehouseName: 'Aura Main Warehouse', imageBase64: '', minimum_stock: 0 });

  // Stock Levels State
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [adjustStock, setAdjustStock] = useState({ itemCode: '', warehouseName: 'Aura Main Warehouse', qtyChange: 0, reason: 'Physical Count' });

  // Ledger State
  const [ledgers, setLedgers] = useState<StockLedger[]>([]);
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerWarehouse, setLedgerWarehouse] = useState('All');
  const [ledgerPage, setLedgerPage] = useState(1);
  const [ledgerTotalPages, setLedgerTotalPages] = useState(1);

  // Warehouses list for dropdowns
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  // Fetch static warehouses once
  useEffect(() => {
    if (!token) return;
    fetch('/api/inventory/warehouses', { headers })
      .then(r => r.json())
      .then(setWarehouses)
      .catch(console.error);
  }, [token]);

  // Fetch Catalog
  const fetchCatalog = () => {
    if (!token) return;
    setLoading(true);
    fetch(`/api/inventory/items?paginate=true&page=${catalogPage}&search=${catalogSearch}&itemGroup=${catalogGroup}`, { headers })
      .then(r => r.json())
      .then(data => {
        setItems(data.items || []);
        setCatalogTotalPages(data.pagination?.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Fetch Stock Levels
  const fetchLevels = () => {
    if (!token) return;
    setLoading(true);
    fetch('/api/inventory/stock-levels', { headers })
      .then(r => r.json())
      .then(data => {
        setStockLevels(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Fetch Ledgers
  const fetchLedgers = () => {
    if (!token) return;
    setLoading(true);
    fetch(`/api/inventory/stock-ledgers?paginate=true&page=${ledgerPage}&search=${ledgerSearch}&warehouse=${ledgerWarehouse}`, { headers })
      .then(r => r.json())
      .then(data => {
        setLedgers(data.ledgers || []);
        setLedgerTotalPages(data.pagination?.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Trigger fetches on tab/filters change
  useEffect(() => {
    if (tab === 'catalog') fetchCatalog();
    if (tab === 'levels') fetchLevels();
    if (tab === 'ledger') fetchLedgers();
  }, [tab, catalogPage, catalogSearch, catalogGroup, ledgerPage, ledgerSearch, ledgerWarehouse, token]);

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

  const handleCreateItem = async () => {
    if (!newItem.itemCode || !newItem.itemName) {
      alert('Please fill in Item Code and Item Name');
      return;
    }
    try {
      const res = await fetch('/api/inventory/items', {
        method: 'POST',
        headers,
        body: JSON.stringify(newItem)
      });
      if (res.ok) {
        setShowItemModal(false);
        setNewItem({ itemCode: '', itemName: '', standardRate: 0, valuationRate: 0, initialStock: 0, warehouseName: 'Aura Main Warehouse', imageBase64: '', minimum_stock: 0 });
        setCatalogPage(1);
        fetchCatalog();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create item');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (itemCode: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete item ${itemCode}?`)) return;
    try {
      const res = await fetch(`/api/inventory/items/${itemCode}`, { method: 'DELETE', headers });
      if (res.ok) {
        fetchCatalog();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete item');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdjustStock = async () => {
    if (!adjustStock.itemCode || !adjustStock.warehouseName || adjustStock.qtyChange === 0) {
      alert('Please select a product, warehouse and specify a non-zero adjustment.');
      return;
    }
    try {
      const res = await fetch('/api/inventory/stock-levels/adjust', {
        method: 'POST',
        headers,
        body: JSON.stringify(adjustStock)
      });
      if (res.ok) {
        setShowAdjustModal(false);
        setAdjustStock({ itemCode: '', warehouseName: warehouses[0]?.name || 'Aura Main Warehouse', qtyChange: 0, reason: 'Physical Count' });
        if (tab === 'levels') fetchLevels();
        else if (tab === 'ledger') fetchLedgers();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to adjust stock');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // KPI Calculations
  const totalValue = stockLevels.reduce((sum, sl) => sum + ((sl.qtyOnHand || 0) * (sl.item?.valuationRate || 0)), 0);
  const lowStockCount = stockLevels.filter(sl => sl.item?.minimum_stock > 0 && (sl.qtyAvailable || 0) < sl.item.minimum_stock).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header section with glass blur */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Inventory Intelligence</h1>
          <p className="text-gray-500 font-medium mt-1">Real-time stock valuation and tracking.</p>
        </div>
        <div className="flex space-x-3 items-center">
          <button onClick={() => {
            setAdjustStock({ itemCode: '', warehouseName: warehouses[0]?.name || 'Aura Main Warehouse', qtyChange: 0, reason: 'Physical Count' });
            setShowAdjustModal(true);
          }} className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-gray-50 flex items-center transition-all">
            Adjust Stock
          </button>
          <button onClick={() => setShowItemModal(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5 flex items-center transition-all">
            <Plus size={18} className="mr-2" /> New Item
          </button>
        </div>
      </div>

      {/* CREATE ITEM MODAL */}
      {showItemModal && (
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
                <input type="number" placeholder="Min Stock Alert Level" className="w-full p-3 border rounded-xl" onChange={e => setNewItem({...newItem, minimum_stock: Number(e.target.value)})} />
              </div>
              <input placeholder="Warehouse Name" value={newItem.warehouseName} className="w-full p-3 border rounded-xl" onChange={e => setNewItem({...newItem, warehouseName: e.target.value})} />
              
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
              <button onClick={() => setShowItemModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleCreateItem} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* ADJUST STOCK MODAL */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Adjust Stock Level</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Item Code / SKU</label>
                <input 
                  type="text" 
                  placeholder="e.g. ITEM-001" 
                  className="w-full p-3 border rounded-xl uppercase font-mono font-bold" 
                  value={adjustStock.itemCode}
                  onChange={e => setAdjustStock({...adjustStock, itemCode: e.target.value})} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Warehouse</label>
                <select 
                  className="w-full p-3 border rounded-xl bg-white font-semibold"
                  value={adjustStock.warehouseName}
                  onChange={e => setAdjustStock({...adjustStock, warehouseName: e.target.value})}
                >
                  {warehouses.map(w => <option key={w.name} value={w.name}>{w.name}</option>)}
                  {warehouses.length === 0 && <option value="Aura Main Warehouse">Aura Main Warehouse</option>}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Qty Change</label>
                  <input 
                    type="number" 
                    placeholder="e.g. -10 or 15" 
                    className="w-full p-3 border rounded-xl text-center font-bold" 
                    onChange={e => setAdjustStock({...adjustStock, qtyChange: Number(e.target.value)})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Reason</label>
                  <select 
                    className="w-full p-3 border rounded-xl bg-white font-semibold"
                    value={adjustStock.reason}
                    onChange={e => setAdjustStock({...adjustStock, reason: e.target.value})}
                  >
                    <option value="Physical Count">Physical Count</option>
                    <option value="Damage">Damage</option>
                    <option value="Promo Giveaway">Promo Giveaway</option>
                    <option value="Supplier Receipt">Supplier Receipt</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowAdjustModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleAdjustStock} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700">Submit Adjustment</button>
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
          <p className="text-4xl font-black text-gray-900 tracking-tight">{stockLevels.length || items.length}</p>
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

      {/* Tabs Navigation & Search controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="bg-gray-100/80 backdrop-blur-md p-1.5 rounded-2xl w-fit flex space-x-1 border border-white/50 shadow-inner">
          {[
            { id: 'catalog', icon: Package, label: 'Item Catalog' },
            { id: 'levels', icon: Layers, label: 'Stock Levels' },
            { id: 'ledger', icon: FileText, label: 'Stock Ledger' }
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${tab === t.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
              <t.icon size={18} className="mr-2" /> {t.label}
            </button>
          ))}
        </div>

        {/* Global Search and Filter Elements relative to active tab */}
        {tab === 'catalog' && (
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search catalog..." 
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm w-full md:w-64 bg-white font-medium"
                value={catalogSearch}
                onChange={(e) => { setCatalogSearch(e.target.value); setCatalogPage(1); }}
              />
            </div>
            <select 
              className="p-2.5 border rounded-xl text-sm bg-white font-bold text-gray-700 outline-none"
              value={catalogGroup}
              onChange={e => { setCatalogGroup(e.target.value); setCatalogPage(1); }}
            >
              <option value="All">All Groups</option>
              <option value="Products">Products</option>
              <option value="Raw Materials">Raw Materials</option>
              <option value="Services">Services</option>
            </select>
          </div>
        )}

        {tab === 'ledger' && (
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search ledger..." 
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm w-full md:w-64 bg-white font-medium"
                value={ledgerSearch}
                onChange={(e) => { setLedgerSearch(e.target.value); setLedgerPage(1); }}
              />
            </div>
            <select 
              className="p-2.5 border rounded-xl text-sm bg-white font-bold text-gray-700 outline-none"
              value={ledgerWarehouse}
              onChange={e => { setLedgerWarehouse(e.target.value); setLedgerPage(1); }}
            >
              <option value="All">All Warehouses</option>
              {warehouses.map(w => <option key={w.name} value={w.name}>{w.name}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Tab Content Areas */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative min-h-[400px] flex flex-col justify-between">
        {loading && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}
        
        {/* CATALOG TAB */}
        {tab === 'catalog' && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-50">
                <thead className="bg-gray-50/80">
                  <tr>
                    {['Item Code', 'Product Name', 'Category', 'Selling Price', 'Valuation Rate', 'Min Stock', ''].map(h => <th key={h} className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {items.length === 0 ? (
                    <tr><td colSpan={6} className="px-8 py-12 text-center text-gray-400 font-semibold">No catalog items matching filters.</td></tr>
                  ) : items.map(item => (
                    <tr key={item.itemCode} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                      <td className="px-8 py-5 text-sm font-bold text-indigo-600">{item.itemCode}</td>
                      <td className="px-8 py-5 text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{item.itemName}</td>
                      <td className="px-8 py-5"><span className="px-3 py-1 text-xs font-bold rounded-lg bg-gray-100 text-gray-600">{item.itemGroup}</span></td>
                      <td className="px-8 py-5 text-sm font-black text-gray-900">${item.standardRate.toFixed(2)}</td>
                      <td className="px-8 py-5 text-sm font-medium text-gray-500">${item.valuationRate.toFixed(2)}</td>
                      <td className="px-8 py-5 text-sm font-bold">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900">{item.minimum_stock ?? 0}</span>
                          <button onClick={async (e) => {
                            e.stopPropagation();
                            const val = prompt(`Enter new minimum stock level for ${item.itemCode}:`, (item.minimum_stock ?? 0).toString());
                            if (val !== null && !isNaN(Number(val))) {
                              try {
                                const res = await fetch(`/api/inventory/items/${item.itemCode}`, {
                                  method: 'PATCH',
                                  headers,
                                  body: JSON.stringify({ minimum_stock: Number(val) })
                                });
                                if (res.ok) fetchCatalog();
                                else alert('Failed to update minimum stock');
                              } catch (err) {
                                console.error(err);
                              }
                            }
                          }} className="text-[10px] text-indigo-600 hover:underline">Edit</button>
                        </div>
                      </td>
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

            {/* Pagination Catalog */}
            {catalogTotalPages > 1 && (
              <div className="p-5 border-t flex justify-end items-center space-x-3 bg-gray-50/50">
                <button 
                  disabled={catalogPage === 1}
                  onClick={() => setCatalogPage(prev => Math.max(prev - 1, 1))}
                  className="p-2 border rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold text-gray-500">Page {catalogPage} of {catalogTotalPages}</span>
                <button 
                  disabled={catalogPage === catalogTotalPages}
                  onClick={() => setCatalogPage(prev => Math.min(prev + 1, catalogTotalPages))}
                  className="p-2 border rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STOCK LEVELS TAB */}
        {tab === 'levels' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {stockLevels.length === 0 ? (
              <p className="col-span-2 text-center py-12 text-gray-400 font-bold">No stock levels found.</p>
            ) : stockLevels.map(sl => (
              <div key={sl.id} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow bg-gradient-to-b from-white to-gray-50/50">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{sl.item?.itemName || sl.itemCode}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-semibold text-gray-500">{sl.warehouseName}</p>
                      {sl.item?.minimum_stock > 0 && (
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-md">
                          Min: {sl.item.minimum_stock}
                        </span>
                      )}
                    </div>
                  </div>
                  {sl.item?.minimum_stock > 0 && sl.qtyAvailable < sl.item.minimum_stock ? (
                    <AlertCircle className="text-rose-500 animate-pulse" />
                  ) : (
                    <CheckCircle2 className="text-emerald-500" />
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">In Stock</p>
                    <p className={`text-2xl font-black ${sl.item?.minimum_stock > 0 && sl.qtyAvailable < sl.item.minimum_stock ? 'text-rose-600' : 'text-gray-900'}`}>{sl.qtyOnHand}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Reserved</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-2xl font-black text-amber-600">{sl.qtyReserved}</p>
                      <button onClick={() => {
                        const val = prompt('Enter new reserved quantity:', sl.qtyReserved.toString());
                        if(val !== null && !isNaN(Number(val))) {
                          fetch(`/api/inventory/stock-levels/${sl.id}/reserve`, {
                            method: 'PATCH',
                            headers,
                            body: JSON.stringify({ qtyReserved: Number(val) })
                          }).then(() => fetchLevels());
                        }
                      }} className="text-[10px] font-bold text-indigo-600 hover:underline">Edit</button>
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex flex-col justify-between">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-wider mb-1">Available</p>
                    <div className="flex justify-between items-baseline">
                      <p className="text-2xl font-black text-indigo-700">{sl.qtyAvailable}</p>
                      <button onClick={() => {
                        setAdjustStock({ itemCode: sl.itemCode, warehouseName: sl.warehouseName, qtyChange: 0, reason: 'Physical Count' });
                        setShowAdjustModal(true);
                      }} className="text-[10px] font-bold text-indigo-700 hover:underline">Adjust</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STOCK LEDGER TAB */}
        {tab === 'ledger' && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-50">
                <thead className="bg-gray-50/80">
                  <tr>
                    {['Date', 'Item Name', 'Warehouse', 'Voucher', 'Qty Change'].map(h => <th key={h} className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {ledgers.length === 0 ? (
                    <tr><td colSpan={5} className="px-8 py-12 text-center text-gray-400 font-semibold">No stock movements logged.</td></tr>
                  ) : ledgers.map(l => (
                    <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 text-sm font-semibold text-gray-500">{new Date(l.postingDate).toLocaleDateString()}</td>
                      <td className="px-8 py-5">
                        <div className="text-sm font-bold text-gray-900">{l.item?.itemName}</div>
                        <div className="text-xs font-semibold text-gray-400 font-mono mt-0.5">{l.itemCode}</div>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-600 font-bold">{l.warehouse}</td>
                      <td className="px-8 py-5">
                        <div className="text-sm font-bold text-gray-900">{l.voucherNo}</div>
                        <div className="text-xs font-semibold text-gray-400 mt-0.5">{l.voucherType}</div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-black ${l.qty > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                          {l.qty > 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                          {Math.abs(l.qty)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Ledger */}
            {ledgerTotalPages > 1 && (
              <div className="p-5 border-t flex justify-end items-center space-x-3 bg-gray-50/50">
                <button 
                  disabled={ledgerPage === 1}
                  onClick={() => setLedgerPage(prev => Math.max(prev - 1, 1))}
                  className="p-2 border rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold text-gray-500">Page {ledgerPage} of {ledgerTotalPages}</span>
                <button 
                  disabled={ledgerPage === ledgerTotalPages}
                  onClick={() => setLedgerPage(prev => Math.min(prev + 1, ledgerTotalPages))}
                  className="p-2 border rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
