import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DollarSign, Plus, Calculator, FileText, CheckCircle2 } from 'lucide-react';

export default function ShipmentProfitability() {
  const { id } = useParams();
  
  // Mocks for now - would fetch from `/api/air/finance/:id`
  const [revenueLines, setRevenueLines] = useState([
    { code: 'FREIGHT', name: 'Air Freight Charge', amount: 4500, currency: 'USD' },
    { code: 'FSC', name: 'Fuel Surcharge', amount: 500, currency: 'USD' }
  ]);
  const [costLines, setCostLines] = useState([
    { code: 'FREIGHT', name: 'Airline Base Rate', amount: 3000, currency: 'USD' },
    { code: 'HANDLING', name: 'Terminal Handling', amount: 350, currency: 'USD' }
  ]);

  const totalRev = revenueLines.reduce((s, l) => s + l.amount, 0);
  const totalCost = costLines.reduce((s, l) => s + l.amount, 0);
  const margin = totalRev - totalCost;
  const marginPct = (margin / totalRev) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <Calculator className="mr-3 text-sky-600" size={32} /> P&L: {id}
          </h1>
          <p className="text-gray-500 font-medium mt-1">Shipment Profitability & Cost Breakdown</p>
        </div>
        <button className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center shadow-lg shadow-emerald-200">
          <FileText size={20} className="mr-2" /> Generate Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Revenue</div>
            <div className="text-4xl font-black">${totalRev.toFixed(2)}</div>
          </div>
          <DollarSign size={120} className="absolute -right-6 -bottom-6 text-gray-800 opacity-50" />
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Costs</div>
          <div className="text-4xl font-black text-red-500">${totalCost.toFixed(2)}</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl shadow-sm">
          <div className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-2">Gross Margin</div>
          <div className="text-4xl font-black text-emerald-600">${margin.toFixed(2)}</div>
          <div className="mt-2 inline-block px-3 py-1 bg-emerald-200 text-emerald-800 font-bold rounded-full text-sm">
            {marginPct.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-black text-gray-900">Revenue (Receivables)</h2>
            <button className="text-sky-600 font-bold text-sm flex items-center hover:underline"><Plus size={16} className="mr-1"/> Add Charge</button>
          </div>
          <table className="w-full text-left">
            <tbody>
              {revenueLines.map((l, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{l.name}</div>
                    <div className="text-xs text-gray-500">{l.code}</div>
                  </td>
                  <td className="p-4 text-right font-bold text-gray-900">{l.currency} {l.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
            <h2 className="font-black text-red-900">Costs (Payables)</h2>
            <button className="text-red-600 font-bold text-sm flex items-center hover:underline"><Plus size={16} className="mr-1"/> Add Cost</button>
          </div>
          <table className="w-full text-left">
            <tbody>
              {costLines.map((l, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-red-50/50">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{l.name}</div>
                    <div className="text-xs text-gray-500">{l.code}</div>
                  </td>
                  <td className="p-4 text-right font-bold text-red-600">{l.currency} {l.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
