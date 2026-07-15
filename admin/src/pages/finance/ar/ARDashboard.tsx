import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, ShieldAlert, BarChart3, TrendingDown, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Link } from 'react-router-dom';

export default function ARDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/erp/ar/dashboard')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(console.error);
  }, []);

  const agingData = data ? [
     { name: 'Current', value: data.aging.current, color: '#10b981' },
     { name: '1-30 Days', value: data.aging.days_1_30, color: '#f59e0b' },
     { name: '31-60 Days', value: data.aging.days_31_60, color: '#f97316' },
     { name: '61-90 Days', value: data.aging.days_61_90, color: '#ef4444' },
     { name: '90+ Days', value: data.aging.days_90_plus, color: '#7f1d1d' },
  ] : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounts Receivable (AR)</h1>
          <p className="text-sm text-gray-500 mt-1">Manage outstanding debts, allocations, customer ledgers, and credit limits.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/finance/ar/allocate" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center shadow-sm">
             <DollarSign size={16} className="mr-2" /> Allocate Payment
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
            <h3 className="text-sm font-bold text-gray-500 mb-2">Total Outstanding</h3>
            <div className="flex items-end space-x-2">
               <span className="text-3xl font-extrabold text-gray-900">${(data?.totalOutstanding || 0).toLocaleString()}</span>
            </div>
            <div className="absolute right-6 top-6 w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
               <BarChart3 size={24}/>
            </div>
         </div>
         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
            <h3 className="text-sm font-bold text-gray-500 mb-2">Past Due (Over 30 Days)</h3>
            <div className="flex items-end space-x-2">
               <span className="text-3xl font-extrabold text-orange-600">${((data?.aging?.days_31_60 || 0) + (data?.aging?.days_61_90 || 0) + (data?.aging?.days_90_plus || 0)).toLocaleString()}</span>
            </div>
            <div className="absolute right-6 top-6 w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
               <ShieldAlert size={24}/>
            </div>
         </div>
         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
            <h3 className="text-sm font-bold text-gray-500 mb-2">Days Sales Outstanding (DSO)</h3>
            <div className="flex items-end space-x-2">
               <span className="text-3xl font-extrabold text-emerald-600">{data?.avgCollectionDays || 0} Days</span>
            </div>
            <div className="absolute right-6 top-6 w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
               <Clock size={24}/>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
           <h2 className="font-bold text-gray-900 mb-6 flex items-center"><TrendingDown className="mr-2 text-indigo-600"/> Aging Analysis</h2>
           <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={agingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#374151', fontWeight: 600}} tickFormatter={(val) => `$${val/1000}k`} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{fill: '#f3f4f6'}} formatter={(value: number) => `$${value.toLocaleString()}`} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                       {agingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
           <h2 className="font-bold text-gray-900 mb-6">AR Modules</h2>
           <div className="grid grid-cols-2 gap-4">
              <Link to="/finance/ar/ledger" className="p-4 border border-gray-100 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition group">
                 <div className="w-10 h-10 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 mb-3 group-hover:bg-indigo-200">
                    <BarChart3 size={20} />
                 </div>
                 <h3 className="font-bold text-gray-900 text-sm">Customer Ledgers</h3>
                 <p className="text-xs text-gray-500 mt-1">View running statements and T-accounts.</p>
              </Link>
              <Link to="/finance/ar/collections" className="p-4 border border-gray-100 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition group">
                 <div className="w-10 h-10 rounded bg-orange-100 flex items-center justify-center text-orange-600 mb-3 group-hover:bg-orange-200">
                    <Users size={20} />
                 </div>
                 <h3 className="font-bold text-gray-900 text-sm">Collections Engine</h3>
                 <p className="text-xs text-gray-500 mt-1">Track promises-to-pay and follow-ups.</p>
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
