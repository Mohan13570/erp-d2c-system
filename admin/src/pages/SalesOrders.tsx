import { useState, useEffect } from 'react';
import { Plus, Eye, X, Trash2 } from 'lucide-react';

interface SalesOrderItem { id: string; itemCode: string; qty: number; rate: number; amount: number; item: { itemName: string }; }
interface SalesOrder { id: string; customer: { customerName: string } | null; d2cCustomer: { firstName: string; lastName: string } | null; status: string; grandTotal: number; transactionDate: string; channel: string; items: SalesOrderItem[]; }
interface InventoryItem { itemCode: string; itemName: string; standardRate: number; }

export default function SalesOrders() {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SalesOrder | null>(null);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [orderItems, setOrderItems] = useState<{itemCode: string, qty: number}[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (showModal) {
      fetch('/api/inventory/items')
        .then(r => r.json())
        .then(data => setInventory(data))
        .catch(console.error);
    }
  }, [showModal]);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName, items: orderItems })
      });
      if (res.ok) {
        setShowModal(false);
        setCustomerName('');
        setOrderItems([]);
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
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
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
    if (s === 'Completed') return 'bg-emerald-100 text-emerald-700';
    if (s === 'Cancelled') return 'bg-red-100 text-red-700';
    if (s === 'To Deliver and Bill') return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-600';
  };

  const getChannelStyle = (c: string) => c === 'D2C' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700';

  const getCustomerName = (order: SalesOrder) => {
    if (order.customer) return order.customer.customerName;
    if (order.d2cCustomer) return `${order.d2cCustomer.firstName} ${order.d2cCustomer.lastName}`;
    return 'Guest';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Sales Orders</h1>
          <p className="text-gray-500 mt-1">Track and fulfill customer orders from all channels.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm flex items-center transition-all">
          <Plus className="w-5 h-5 mr-2" /> Create Order
        </button>
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
                          className="w-24 p-2 border rounded-lg text-center" 
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
        <div className={`${selected ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden`}>
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
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No orders found.</td></tr>
                ) : orders.map(order => (
                  <tr key={order.id} className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${selected?.id === order.id ? 'bg-indigo-50/50' : ''}`} onClick={() => setSelected(selected?.id === order.id ? null : order)}>
                    <td className="px-5 py-4 text-sm font-mono font-semibold text-indigo-600">{order.id.substring(0, 8).toUpperCase()}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">{getCustomerName(order)}</td>
                    <td className="px-5 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getChannelStyle(order.channel)}`}>{order.channel}</span></td>
                    <td className="px-5 py-4 text-sm text-gray-500">{new Date(order.transactionDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td className="px-5 py-4"><span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusStyle(order.status)}`}>{order.status}</span></td>
                    <td className="px-5 py-4 text-sm font-bold text-gray-900">${order.grandTotal.toFixed(2)}</td>
                    <td className="px-5 py-4"><Eye size={16} className="text-gray-400" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex justify-between"><span className="text-gray-500">Order ID</span><span className="font-mono font-semibold text-indigo-600">{selected.id.substring(0, 8).toUpperCase()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Customer</span><span className="font-medium text-gray-900">{getCustomerName(selected)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Channel</span><span className="font-medium">{selected.channel}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusStyle(selected.status)}`}>{selected.status}</span></div>
            </div>
            <div className="pt-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Line Items</p>
              <div className="space-y-3">
                {selected.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-gray-900">{item.item?.itemName || item.itemCode}</p>
                      <p className="text-gray-500 mt-0.5">Qty: {item.qty} × ${item.rate.toFixed(2)}</p>
                    </div>
                    <span className="font-bold text-gray-900">${item.amount.toFixed(2)}</span>
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
