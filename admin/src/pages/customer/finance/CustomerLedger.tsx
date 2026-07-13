import React from 'react';
import { Download, Search, FileSpreadsheet } from 'lucide-react';

const mockLedger = [
  { id: 'LGR-004', date: 'Oct 24, 2026', type: 'DEBIT', desc: 'Invoice INV-10046 Generated', ref: 'INV-10046', amount: 4300.50, balance: 16800.50 },
  { id: 'LGR-003', date: 'Oct 22, 2026', type: 'CREDIT', desc: 'Payment via Stripe (TXN-99881)', ref: 'TXN-99881', amount: 12500.00, balance: 12500.00 },
  { id: 'LGR-002', date: 'Oct 20, 2026', type: 'DEBIT', desc: 'Invoice INV-10045 Generated', ref: 'INV-10045', amount: 12500.00, balance: 25000.00 },
  { id: 'LGR-001', date: 'Oct 01, 2026', type: 'DEBIT', desc: 'Opening Balance (Oct 1)', ref: '-', amount: 12500.00, balance: 12500.00 },
];

export default function CustomerLedger() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statement of Account</h1>
          <p className="text-sm text-gray-500 mt-1">Live customer ledger showing all debits, credits, and running balance.</p>
        </div>
        <div className="flex space-x-3">
           <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center shadow-sm">
             <Download size={16} className="mr-2"/> Download PDF Statement
           </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search transactions..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 w-72" />
          </div>
          <div className="flex space-x-3">
             <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white shadow-sm focus:ring-indigo-500 outline-none">
                <option>This Month (Oct 2026)</option>
                <option>Last Month (Sep 2026)</option>
                <option>Year to Date</option>
             </select>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="p-4">Date</th>
              <th className="p-4">Description</th>
              <th className="p-4">Reference</th>
              <th className="p-4 text-right">Debit (Charge)</th>
              <th className="p-4 text-right">Credit (Payment)</th>
              <th className="p-4 text-right bg-indigo-50/30">Running Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {mockLedger.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-600">{row.date}</td>
                <td className="p-4 font-medium text-gray-900">{row.desc}</td>
                <td className="p-4 text-indigo-600 font-mono text-xs">{row.ref}</td>
                <td className="p-4 text-right font-medium text-gray-900">
                   {row.type === 'DEBIT' ? `$${row.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}` : '-'}
                </td>
                <td className="p-4 text-right font-bold text-green-600">
                   {row.type === 'CREDIT' ? `$${row.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}` : '-'}
                </td>
                <td className="p-4 text-right font-bold text-indigo-900 bg-indigo-50/10">
                   ${row.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
