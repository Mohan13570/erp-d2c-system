import React from 'react';
import { ReceiptText, Plus, Search, Filter, Download, ArrowUpRight, Clock, AlertCircle } from 'lucide-react';

export default function AccountsReceivable() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Accounts Receivable</h2>
          <p className="text-sm text-gray-500 mt-1">Manage customer invoices, receipts, collections, and dunning.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
            Run Dunning Process
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" /> New Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Outstanding AR</p>
          <p className="text-2xl font-bold text-gray-900">$125,500.00</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-amber-500">
          <p className="text-sm text-gray-500 mb-1">Overdue (1-30 Days)</p>
          <p className="text-2xl font-bold text-gray-900">$45,200.00</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-rose-500">
          <p className="text-sm text-gray-500 mb-1">Overdue (30+ Days)</p>
          <p className="text-2xl font-bold text-gray-900">$12,800.00</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search invoices..." 
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
              />
            </div>
            <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Invoice #</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Balance</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { no: 'INV-2023-001', cust: 'Global Tech Corp', date: '2023-11-02', due: '2023-12-02', amt: '$45,000.00', bal: '$45,000.00', status: 'Sent' },
                { no: 'INV-2023-002', cust: 'Acme Logistics', date: '2023-10-15', due: '2023-11-15', amt: '$12,500.00', bal: '$12,500.00', status: 'Overdue' },
                { no: 'INV-2023-003', cust: 'Stark Industries', date: '2023-11-05', due: '2023-12-05', amt: '$8,200.00', bal: '$0.00', status: 'Paid' },
              ].map((inv, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-indigo-600">{inv.no}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{inv.cust}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{inv.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{inv.due}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{inv.amt}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{inv.bal}</td>
                  <td className="px-6 py-4">
                    <span className={
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " +
                      (inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                      inv.status === 'Overdue' ? 'bg-rose-100 text-rose-800' : 'bg-indigo-100 text-indigo-800')
                    }>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Receive Payment</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
