import React, { useState, useEffect } from 'react';
import { TrendingUp, Anchor, Plane, Truck, DollarSign, Activity, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function PricingDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/erp/pricing/dashboard')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  const marginData = [
    { name: 'Ocean FCL', margin: stats?.avgOceanMargin || 18, color: '#0ea5e9' }, // Light Blue
    { name: 'Air Freight', margin: stats?.avgAirMargin || 24, color: '#f59e0b' }, // Amber
    { name: 'Road Transport', margin: stats?.avgRoadMargin || 12, color: '#10b981' }, // Emerald
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Freight Rate Engine</h1>
          <p className="text-sm text-gray-500 mt-1">Manage global rate cards, automated customer pricing, and calculate shipment profitability.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/finance/pricing/calculator" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center shadow-sm">
             <Activity size={16} className="mr-2" /> Live Calculator
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
            <h3 className="text-sm font-bold text-gray-500 mb-2">Active Contracts</h3>
            <div className="flex items-end space-x-2">
               <span className="text-3xl font-extrabold text-gray-900">{stats?.totalActiveContracts || 0}</span>
            </div>
            <div className="absolute right-6 top-6 w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
               <FileText size={24}/>
            </div>
         </div>
         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
            <h3 className="text-sm font-bold text-gray-500 mb-2">Ocean Freight Margin</h3>
            <div className="flex items-end space-x-2">
               <span className="text-3xl font-extrabold text-sky-600">{stats?.avgOceanMargin || 0}%</span>
            </div>
            <div className="absolute right-6 top-6 w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center text-sky-600">
               <Anchor size={24}/>
            </div>
         </div>
         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
            <h3 className="text-sm font-bold text-gray-500 mb-2">Air Freight Margin</h3>
            <div className="flex items-end space-x-2">
               <span className="text-3xl font-extrabold text-amber-600">{stats?.avgAirMargin || 0}%</span>
            </div>
            <div className="absolute right-6 top-6 w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
               <Plane size={24}/>
            </div>
         </div>
         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
            <h3 className="text-sm font-bold text-gray-500 mb-2">Road Transport Margin</h3>
            <div className="flex items-end space-x-2">
               <span className="text-3xl font-extrabold text-emerald-600">{stats?.avgRoadMargin || 0}%</span>
            </div>
            <div className="absolute right-6 top-6 w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
               <Truck size={24}/>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
           <h2 className="font-bold text-gray-900 mb-6 flex items-center"><TrendingUp className="mr-2 text-indigo-600"/> Gross Profit Margin by Mode</h2>
           <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={marginData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} tickFormatter={(val) => `${val}%`} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#374151', fontWeight: 600}} width={100} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{fill: 'transparent'}} />
                    <Bar dataKey="margin" radius={[0, 8, 8, 0]} barSize={32}>
                       {marginData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
           <h2 className="font-bold text-gray-900 mb-6">Quick Actions & Setup</h2>
           <div className="grid grid-cols-2 gap-4">
              <Link to="/finance/pricing/rates" className="p-4 border border-gray-100 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition group">
                 <div className="w-10 h-10 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 mb-3 group-hover:bg-indigo-200">
                    <DollarSign size={20} />
                 </div>
                 <h3 className="font-bold text-gray-900 text-sm">Standard Rate Cards</h3>
                 <p className="text-xs text-gray-500 mt-1">Manage public base prices per route.</p>
              </Link>
              <Link to="/finance/pricing/contracts" className="p-4 border border-gray-100 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition group">
                 <div className="w-10 h-10 rounded bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3 group-hover:bg-emerald-200">
                    <FileText size={20} />
                 </div>
                 <h3 className="font-bold text-gray-900 text-sm">Customer Contracts</h3>
                 <p className="text-xs text-gray-500 mt-1">Configure tiered pricing for key accounts.</p>
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
