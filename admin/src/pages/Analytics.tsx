import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Globe, DollarSign } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/analytics/dashboard')
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) return <div className="p-12 text-center text-gray-400">Loading metrics...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/40 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Analytics & BI</h1>
          <p className="text-gray-500 font-medium mt-1">Business intelligence and sales performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-8 rounded-3xl text-white shadow-lg">
          <DollarSign size={32} className="mb-4 opacity-50" />
          <p className="text-indigo-100 font-medium mb-1">Total Revenue</p>
          <p className="text-4xl font-black">${data.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <ShoppingBag size={32} className="text-emerald-500 mb-4" />
          <p className="text-gray-500 font-medium mb-1">Total Orders</p>
          <p className="text-4xl font-black text-gray-900">{data.totalOrders}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <Globe size={32} className="text-blue-500 mb-4" />
          <p className="text-gray-500 font-medium mb-1">Sales Channels</p>
          <p className="text-4xl font-black text-gray-900">{data.channelSales?.length || 0}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <TrendingUp size={32} className="text-purple-500 mb-4" />
          <p className="text-gray-500 font-medium mb-1">Conversion</p>
          <p className="text-4xl font-black text-gray-900">3.4%</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <h2 className="font-bold text-gray-900 mb-6 text-xl">Recent Transactions Feed</h2>
        <div className="space-y-4">
          {data.recentOrders?.map((o: any) => (
            <div key={o.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl font-bold text-xs ${o.channel === 'D2C' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'}`}>{o.channel}</div>
                <div>
                  <p className="font-bold text-gray-900">{o.customer?.customerName || o.d2cCustomer?.firstName || 'Guest'}</p>
                  <p className="text-xs font-medium text-gray-500">{new Date(o.transactionDate).toLocaleString()}</p>
                </div>
              </div>
              <p className="font-black text-lg text-gray-900">${o.grandTotal.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
