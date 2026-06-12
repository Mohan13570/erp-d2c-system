import { useState, useEffect } from 'react';
import { TrendingUp, Plus, Activity, Building, ArrowRight } from 'lucide-react';

export default function CompanyStock() {
  const [data, setData] = useState<{ stocks: any[], actions: any[] }>({ stocks: [], actions: [] });
  const [loading, setLoading] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);

  const [newStock, setNewStock] = useState({ ticker: '', companyName: '', sharesOutstanding: 0, currentPrice: 0, marketCap: 0 });
  const [newAction, setNewAction] = useState({ ticker: '', actionType: 'Buyback', quantity: '', price: '' });

  const fetchStock = () => {
    fetch('/api/equity/status')
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleCreateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/equity/stocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newStock, sharesOutstanding: Number(newStock.sharesOutstanding), currentPrice: Number(newStock.currentPrice), marketCap: Number(newStock.marketCap) })
    });
    setShowStockModal(false);
    fetchStock();
  };

  const handleCreateAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/equity/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAction)
    });
    setShowActionModal(false);
    fetchStock();
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Company Stocks</h1>
          <p className="text-gray-500 mt-1">Manage equities and track corporate actions.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setShowActionModal(true)} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-medium shadow-sm flex items-center">
            <Activity className="w-5 h-5 mr-2" /> Corporate Action
          </button>
          <button onClick={() => setShowStockModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm flex items-center">
            <Plus className="w-5 h-5 mr-2" /> Add Stock
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.stocks.map(stock => (
          <div key={stock.ticker} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:shadow-lg transition-shadow">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="bg-indigo-900 text-white px-3 py-1 rounded-lg text-xs font-black tracking-widest">{stock.ticker}</span>
                  <h3 className="text-gray-900 font-bold mt-2">{stock.companyName}</h3>
                </div>
                <div className="text-right">
                  <h1 className="text-2xl font-black text-gray-900">${Number(stock.currentPrice).toFixed(2)}</h1>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Market Cap</p>
                  <p className="font-semibold text-gray-900">${(stock.marketCap / 1000000).toFixed(2)}M</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shares</p>
                  <p className="font-semibold text-gray-900">{(parseInt(stock.sharesOutstanding) / 1000000).toFixed(2)}M</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {data.stocks.length === 0 && (
          <div className="col-span-full p-12 text-center text-gray-400 border border-dashed rounded-3xl">
            No company stocks added yet. Click "Add Stock" to start tracking equity.
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col mt-8">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h2 className="font-black text-xl text-gray-900">Corporate Actions Ledger</h2>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-gray-50">
            <thead className="bg-gray-50/80">
              <tr>
                {['Date', 'Ticker', 'Action', 'Qty', 'Price', 'Total Value', 'Status'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.actions.map((a: any) => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">{new Date(a.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-indigo-900">{a.ticker}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${a.actionType === 'Buyback' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{a.actionType}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{a.quantity.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">${a.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm font-black text-gray-900">${a.totalValue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-medium text-emerald-600">{a.status}</td>
                </tr>
              ))}
              {data.actions.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-400">No corporate actions recorded yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Add Company Stock</h2>
            <form onSubmit={handleCreateStock} className="space-y-4">
              <input required placeholder="Ticker (e.g. AAPL)" className="w-full p-3 border rounded-xl font-bold uppercase" onChange={e => setNewStock({...newStock, ticker: e.target.value.toUpperCase()})} />
              <input required placeholder="Company Name" className="w-full p-3 border rounded-xl" onChange={e => setNewStock({...newStock, companyName: e.target.value})} />
              <input required type="number" placeholder="Shares Outstanding" className="w-full p-3 border rounded-xl" onChange={e => setNewStock({...newStock, sharesOutstanding: Number(e.target.value)})} />
              <input required type="number" step="0.01" placeholder="Current Price ($)" className="w-full p-3 border rounded-xl" onChange={e => setNewStock({...newStock, currentPrice: Number(e.target.value)})} />
              <input required type="number" step="0.01" placeholder="Market Cap ($)" className="w-full p-3 border rounded-xl" onChange={e => setNewStock({...newStock, marketCap: Number(e.target.value)})} />
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setShowStockModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl">Create Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center"><Activity className="mr-2" /> Log Corporate Action</h2>
            <form onSubmit={handleCreateAction} className="space-y-4">
              <select required className="w-full p-3 border rounded-xl font-bold" onChange={e => setNewAction({...newAction, ticker: e.target.value})}>
                <option value="">Select Ticker...</option>
                {data.stocks.map(s => <option key={s.ticker} value={s.ticker}>{s.ticker}</option>)}
              </select>
              <select required className="w-full p-3 border rounded-xl" onChange={e => setNewAction({...newAction, actionType: e.target.value})}>
                <option value="Buyback">Buyback</option>
                <option value="Issue Shares">Issue Shares</option>
              </select>
              <input required type="number" placeholder="Quantity (Shares)" className="w-full p-3 border rounded-xl" onChange={e => setNewAction({...newAction, quantity: e.target.value})} />
              <input required type="number" step="0.01" placeholder="Price per Share ($)" className="w-full p-3 border rounded-xl" onChange={e => setNewAction({...newAction, price: e.target.value})} />
              
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setShowActionModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl disabled:opacity-50">Execute Action</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
