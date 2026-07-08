import React, { useState, useEffect } from 'react';
import { TrendingUp, Filter } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function SpendAnalytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/procurement/analytics/spend')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="mr-3 text-cyan-600" size={32} />
            Deep Spend Analytics
          </h1>
          <p className="text-gray-500 mt-1">Multi-dimensional analysis by Category, Cost Center, and Vendor.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Spend Volume vs Transactions (Mock Data)</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'IT Hardware', spend: 120000 },
              { name: 'Marketing Services', spend: 85000 },
              { name: 'Logistics', spend: 310000 },
              { name: 'Raw Materials', spend: 520000 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="spend" fill="#0891B2" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}