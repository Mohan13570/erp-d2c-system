import React from 'react';
import { TrendingUp, PieChart, BarChart } from 'lucide-react';

export default function ProfitabilityAnalysis() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Revenue & Profitability</h2>
          <p className="text-sm text-gray-500 mt-1">Multi-dimensional analysis of margins by shipment, customer, and warehouse.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center"><PieChart className="w-5 h-5 mr-2 text-indigo-500"/> Revenue by Service Line</h3>
          <div className="space-y-4">
            {[
              { label: 'Ocean Freight', rev: 450000, margin: '22%' },
              { label: 'Air Freight', rev: 320000, margin: '18%' },
              { label: 'Warehouse & Storage', rev: 150000, margin: '45%' },
              { label: 'Customs Clearance', rev: 80000, margin: '65%' },
            ].map((s, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{s.label}</span>
                  <div className="space-x-4">
                    <span className="text-gray-900 font-bold">${(s.rev).toLocaleString()}</span>
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">{s.margin} margin</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: (s.rev/450000)*100 + '%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-emerald-500"/> Top Customer Profitability</h3>
          <div className="space-y-4">
            {[
              { label: 'Global Tech Corp', rev: 250000, cost: 180000 },
              { label: 'Stark Industries', rev: 180000, cost: 120000 },
              { label: 'Acme Logistics', rev: 120000, cost: 110000 }, // low margin
            ].map((c, i) => {
              const marginPercent = ((c.rev - c.cost) / c.rev * 100).toFixed(1);
              const isLow = Number(marginPercent) < 15;
              return (
                <div key={i} className="p-3 border border-gray-100 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{c.label}</p>
                    <p className="text-xs text-gray-500">Rev: ${(c.rev).toLocaleString()} | Cost: ${(c.cost).toLocaleString()}</p>
                  </div>
                  <div className={
                    "text-right px-3 py-1 rounded-lg " +
                    (isLow ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700')
                  }>
                    <p className="text-lg font-bold">{marginPercent}%</p>
                    <p className="text-[10px] uppercase tracking-wider font-semibold">Margin</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
