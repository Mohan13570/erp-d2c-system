import { useState, useEffect } from 'react';
import { Plus, Eye, X, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SalesOrderItem { id: string; itemCode: string; qty: number; rate: number; amount: number; item: { itemName: string }; }
interface SalesOrder { id: string; customer: { customerName: string } | null; d2cCustomer: { firstName: string; lastName: string } | null; status: string; grandTotal: number; transactionDate: string; channel: string; items: SalesOrderItem[]; }
interface InventoryItem { itemCode: string; itemName: string; standardRate: number; }

export default function SalesOrders() {
  const { token } = useAuth();
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SalesOrder | null>(null);
  
  // Search, Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [channelFilter, setChannelFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [orderItems, setOrderItems] = useState<{itemCode: string, qty: number}[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrders = () => {
    if (!token) return;
    setLoading(true);
    fetch(`/api/orders?paginate=true&page=${page}&search=${search}&status=${statusFilter}&channel=${channelFilter}`, { headers })
      .then(r => r.json())
      .then(data => { 
        setOrders(data.orders || []); 
        setTotalPages(data.pagination?.totalPages || 1);
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [page, search, statusFilter, channelFilter, token]);

  useEffect(() => {
    if (showModal && token) {
      fetch('/api/inventory/items', { headers })
        .then(r => r.json())
        .then(data => setInventory(data))
        .catch(console.error);
    }
  }, [showModal, token]);

  const handleCreateOrder = async () => {
    setErrorMsg('');
    if (!customerName.trim()) {
      setErrorMsg('Customer name is required.');
      return;
    }
    if (orderItems.length === 0) {
      setErrorMsg('Please add at least one item to the order.');
      return;
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({ customerName, items: orderItems, channel: 'B2B' })
      });
      if (res.ok) {
        setShowModal(false);
        setCustomerName('');
        setOrderItems([]);
        setPage(1);
        fetchOrders();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to create order');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error occurred.');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this order?")) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE', headers });
      if (res.ok) {
        setSelected(null);
        fetchOrders();
      } else {
        alert('Failed to delete order');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusStyle = (s: string) => {
    if (s === 'Completed' || s === 'Delivered') return 'bg-emerald-100 text-emerald-700';
    if (s === 'Cancelled' || s === 'Returned') return 'bg-red-100 text-red-700';
    if (s === 'Pending' || s === 'Draft') return 'bg-gray-100 text-gray-600';
    if (s === 'Confirmed' || s === 'Packed' || s === 'Shipped') return 'bg-indigo-100 text-indigo-700';
    return 'bg-amber-100 text-amber-700';
  };

  const getChannelStyle = (c: string) => c === 'D2C' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700';

  const getCustomerName = (order: SalesOrder) => {
    if (order.customer) return order.customer.customerName;
    if (order.d2cCustomer) return `${order.d2cCustomer.firstName} ${order.d2cCustomer.lastName}`;
    return 'Guest';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/40 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Sales Orders</h1>
          <p className="text-gray-500 mt-1">Track and fulfill customer orders from all channels.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm flex items-center transition-all">
          <Plus className="w-5 h-5 mr-2" /> Create Order
        </button>
      </div>

      {/* Global Filters and Search controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm w-full md:w-64 bg-white font-medium"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select 
            className="p-2.5 border rounded-xl text-sm bg-white font-bold text-gray-700 outline-none flex-1 md:flex-initial"
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Returned">Returned</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select 
            className="p-2.5 border rounded-xl text-sm bg-white font-bold text-gray-700 outline-none flex-1 md:flex-initial"
            value={channelFilter}
            onChange={e => { setChannelFilter(e.target.value); setPage(1); }}
          >
            <option value="All">All Channels</option>
            <option value="D2C">D2C</option>
            <option value="B2B">B2B</option>
          </select>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create B2B Order</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Acme Corp" 
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={customerName} 
                  onChange={e => setCustomerName(e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Order Items</label>
                <div className="space-y-3 mb-4">
                  {orderItems.map((oi, idx) => {
                    const itemData = inventory.find(i => i.itemCode === oi.itemCode);
                    return (
                      <div key={idx} className="flex gap-3 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span className="flex-1 font-medium">{itemData?.itemName || oi.itemCode}</span>
                        <input 
                          type="number" 
                          min="1" 
                          className="w-24 p-2 border rounded-lg text-center font-bold" 
                          value={oi.qty} 
                          onChange={e => {
                            const newItems = [...orderItems];
                            newItems[idx].qty = parseInt(e.target.value) || 1;
                            setOrderItems(newItems);
                          }} 
                        />
                        <span className="font-bold w-24 text-right">${((itemData?.standardRate || 0) * oi.qty).toFixed(2)}</span>
                        <button onClick={() => setOrderItems(orderItems.filter((_, i) => i !== idx))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    );
                  })}
                </div>

                <select 
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value=""
                  onChange={e => {
                    if(e.target.value) {
                      setOrderItems([...orderItems, { itemCode: e.target.value, qty: 1 }]);
                    }
                  }}
                >
                  <option value="">+ Add an item to order...</option>
                  {inventory.filter(inv => !orderItems.find(oi => oi.itemCode === inv.itemCode)).map(item => (
                    <option key={item.itemCode} value={item.itemCode}>{item.itemName} (${item.standardRate.toFixed(2)})</option>
                  ))}
                </select>
              </div>
            </div>

            {errorMsg && <p className="text-red-600 mt-6 font-medium text-sm">{errorMsg}</p>}
            
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
              <button onClick={() => { setShowModal(false); setErrorMsg(''); }} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleCreateOrder} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-colors">Submit Order</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Table */}
        <div className={`${selected ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between min-h-[400px]`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  {['Order ID', 'Customer', 'Channel', 'Date', 'Status', 'Total', ''].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-bold">No orders found.</td></tr>
                ) : orders.map(order => (
                  <tr key={order.id} className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${selected?.id === order.id ? 'bg-indigo-55' : ''}`} onClick={() => setSelected(selected?.id === order.id ? null : order)}>
                    <td className="px-5 py-4 text-sm font-mono font-semibold text-indigo-600">{order.id.substring(0, 8).toUpperCase()}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">{getCustomerName(order)}</td>
                    <td className="px-5 py-4"><span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${getChannelStyle(order.channel)}`}>{order.channel}</span></td>
                    <td className="px-5 py-4 text-sm text-gray-500 font-semibold">{new Date(order.transactionDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td className="px-5 py-4"><span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${getStatusStyle(order.status)}`}>{order.status}</span></td>
                    <td className="px-5 py-4 text-sm font-black text-gray-900">${order.grandTotal.toFixed(2)}</td>
                    <td className="px-5 py-4"><Eye size={16} className="text-gray-400" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t flex justify-end items-center space-x-3 bg-gray-50/50">
              <button 
                disabled={page === 1}
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                className="p-2 border rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-bold text-gray-500">Page {page} of {totalPages}</span>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                className="p-2 border rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Order Detail Drawer */}
        {selected && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6 animate-in slide-in-from-right-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-gray-900 text-lg">Order Detail</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => handleDeleteOrder(selected.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={18} /></button>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"><X size={20}/></button>
              </div>
            </div>
            
            {/* Status Workflow Selector */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Fulfillment Stage</label>
              <select 
                className="w-full p-2.5 border rounded-xl bg-white text-xs font-bold text-slate-700 outline-none cursor-pointer"
                value={selected.status}
                onChange={async (e) => {
                  const nextStatus = e.target.value;
                  try {
                    const res = await fetch(`/api/orders/${selected.id}/status`, {
                      method: 'PATCH',
                      headers,
                      body: JSON.stringify({ status: nextStatus })
                    });
                    if (res.ok) {
                      const updated = await res.json();
                      setSelected(updated);
                      fetchOrders();
                    } else {
                      alert('Failed to update status workflow');
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Returned">Returned</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex justify-between"><span className="text-gray-500 font-semibold">Order ID</span><span className="font-mono font-bold text-indigo-600">{selected.id.substring(0, 8).toUpperCase()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-semibold">Customer</span><span className="font-bold text-gray-900">{getCustomerName(selected)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-semibold">Channel</span><span className="font-bold text-indigo-600">{selected.channel}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-semibold">Status</span><span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-lg ${getStatusStyle(selected.status)}`}>{selected.status}</span></div>
            </div>
            <div className="pt-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Line Items</p>
              <div className="space-y-3">
                {selected.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-gray-900 text-xs">{item.item?.itemName || item.itemCode}</p>
                      <p className="text-gray-400 font-bold text-[10px] mt-0.5">Qty: {item.qty} × ${item.rate.toFixed(2)}</p>
                    </div>
                    <span className="font-black text-gray-900 text-xs">${item.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-black text-lg text-gray-900 mt-6 pt-4 border-t border-gray-200">
                <span>Grand Total</span>
                <span className="text-indigo-600">${selected.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
