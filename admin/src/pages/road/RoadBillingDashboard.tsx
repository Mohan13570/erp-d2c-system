import React, { useState } from 'react';
import { DollarSign, FileText, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';

export default function RoadBillingDashboard() {
  const [invoices] = useState([
    { id: 'INV-001', booking: 'RB-48291', amount: 4500, currency: 'USD', status: 'DRAFT', customer: 'Global Freight LLC' },
    { id: 'INV-002', booking: 'RB-48292', amount: 12000, currency: 'USD', status: 'SENT', customer: 'Apex Logistics' },
    { id: 'INV-003', booking: 'RB-48293', amount: 890, currency: 'USD', status: 'PAID', customer: 'FastTrack Shipping' }
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 flex items-center">
          <DollarSign className="mr-3 text-emerald-600" size={32} /> Road Freight Billing & Costing
        </h1>
        <p className="text-gray-500 font-medium mt-1">Manage customer invoices, vendor bills, and trip profitability.</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl"><DollarSign size={20} /></div>
            <span className="text-xs font-bold text-gray-400 uppercase">This Month</span>
          </div>
          <p className="text-sm font-bold text-gray-400">Total Revenue</p>
          <p className="text-3xl font-black text-gray-900">$0.00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-rose-50 text-rose-600 p-3 rounded-xl"><CreditCard size={20} /></div>
            <span className="text-xs font-bold text-gray-400 uppercase">This Month</span>
          </div>
          <p className="text-sm font-bold text-gray-400">Total Expenses (Tolls, Fuel)</p>
          <p className="text-3xl font-black text-gray-900">$0.00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl"><TrendingUp size={20} /></div>
            <span className="text-xs font-bold text-gray-400 uppercase">Average</span>
          </div>
          <p className="text-sm font-bold text-gray-400">Net Margin</p>
          <p className="text-3xl font-black text-gray-900">25.8%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-50 text-amber-600 p-3 rounded-xl"><AlertCircle size={20} /></div>
            <span className="text-xs font-bold text-gray-400 uppercase">Pending</span>
          </div>
          <p className="text-sm font-bold text-gray-400">Accounts Receivable</p>
          <p className="text-3xl font-black text-amber-600">$0.00</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FileText className="mr-2 text-indigo-500" size={20} /> Customer Invoices
          </h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold">Generate Invoice</button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="pb-3 pl-4">Invoice #</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Booking Ref</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                <td className="py-4 pl-4 font-black text-indigo-600">{inv.id}</td>
                <td className="py-4 font-bold text-gray-900">{inv.customer}</td>
                <td className="py-4 text-sm font-mono text-gray-500">{inv.booking}</td>
                <td className="py-4 font-bold text-gray-900">${inv.amount.toLocaleString()} {inv.currency}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded uppercase tracking-wider ${
                    inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                    inv.status === 'SENT' ? 'bg-sky-100 text-sky-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
