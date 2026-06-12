import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, DollarSign, AlertTriangle, TrendingUp, RotateCcw, Layers } from 'lucide-react';

interface Summary {
  totalOrders: number;
  totalRevenue: number;
  totalEmployees: number;
  totalItems: number;
  pendingPOs: number;
  openReturns: number;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetch('/api/finance/summary')
      .then(r => r.json())
      .then(setSummary)
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Revenue', value: summary ? `$${summary.totalRevenue.toLocaleString('en', { minimumFractionDigits: 2 })}` : '...', icon: DollarSign, color: 'bg-indigo-50 text-indigo-600', change: '+12.5%' },
    { label: 'Sales Orders', value: summary?.totalOrders ?? '...', icon: ShoppingCart, color: 'bg-emerald-50 text-emerald-600', change: '+8.2%' },
    { label: 'Employees', value: summary?.totalEmployees ?? '...', icon: Users, color: 'bg-amber-50 text-amber-600' },
    { label: 'Active Items', value: summary?.totalItems ?? '...', icon: Package, color: 'bg-purple-50 text-purple-600' },
    { label: 'Pending POs', value: summary?.pendingPOs ?? '...', icon: Layers, color: 'bg-sky-50 text-sky-600' },
    { label: 'Open Returns', value: summary?.openReturns ?? '...', icon: RotateCcw, color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
        <p className="text-gray-500 mt-1">Real-time snapshot of your ERP + D2C system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.color}`}>
                <card.icon size={20} />
              </div>
              {card.change && (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center">
                  <TrendingUp size={10} className="mr-1" /> {card.change}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-gray-900">{String(card.value)}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-6 text-lg">System Modules & Activity</h2>
          <div className="space-y-4">
            {[
              { name: 'Sales & D2C Orders', count: summary?.totalOrders || 0, color: 'indigo' },
              { name: 'Active Employees', count: summary?.totalEmployees || 0, color: 'amber' },
              { name: 'Inventory Items', count: summary?.totalItems || 0, color: 'emerald' },
            ].map(m => (
              <div key={m.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">{m.name}</span>
                  <span className="text-gray-900 font-bold">{m.count} records</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-2 bg-${m.color}-500 rounded-full`} style={{ width: m.count > 0 ? '100%' : '5%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-6 text-lg">System Alerts</h2>
          <div className="space-y-4">
            {[
              { msg: 'System Online & Authenticated', color: 'text-emerald-600 bg-emerald-50' },
              { msg: `${summary?.pendingPOs || 0} Purchase Orders pending approval`, color: 'text-amber-600 bg-amber-50' },
              { msg: `${summary?.openReturns || 0} Return requests need review`, color: 'text-rose-600 bg-rose-50' },
              { msg: `${summary?.totalOrders || 0} Total Orders processed`, color: 'text-indigo-600 bg-indigo-50' },
            ].map((a, i) => (
              <div key={i} className={`flex items-center space-x-3 p-3 rounded-xl text-sm font-medium ${a.color}`}>
                <AlertTriangle size={16} />
                <span>{a.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
