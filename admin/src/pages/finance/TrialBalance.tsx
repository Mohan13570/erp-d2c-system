import React from 'react';
import { Scale, Search, Filter, Download, FileBarChart, RefreshCw } from 'lucide-react';

export default function TrialBalance() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Trial Balance</h2>
          <p className="text-sm text-gray-500 mt-1">Real-time unadjusted and adjusted trial balance sheet.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" /> Recalculate
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex space-x-4">
            <select className="border-gray-200 rounded-lg text-sm text-gray-600">
              <option>As of Today</option>
              <option>End of Last Month</option>
              <option>End of Last Year</option>
            </select>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search account..." 
                className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-indigo-500 w-64"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-900 text-sm tracking-wide border-b border-gray-200">
                <th className="px-6 py-4 font-semibold w-1/2">Account Name</th>
                <th className="px-6 py-4 font-semibold text-right">Debit Balance</th>
                <th className="px-6 py-4 font-semibold text-right">Credit Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {[
                { name: '1110 - Bank of America Checking', dr: '$420,000.00', cr: '-' },
                { name: '1120 - Petty Cash', dr: '$2,500.00', cr: '-' },
                { name: '1200 - Accounts Receivable', dr: '$125,500.00', cr: '-' },
                { name: '1300 - Inventory Assets', dr: '$45,000.00', cr: '-' },
                { name: '2100 - Accounts Payable', dr: '-', cr: '$84,300.00' },
                { name: '2200 - Accrued Payroll', dr: '-', cr: '$45,000.00' },
                { name: '3100 - Common Stock', dr: '-', cr: '$100,000.00' },
                { name: '3200 - Retained Earnings', dr: '-', cr: '$353,700.00' },
                { name: '4100 - Sales Revenue', dr: '-', cr: '$150,000.00' },
                { name: '5100 - Cost of Goods Sold', dr: '$60,000.00', cr: '-' },
                { name: '6100 - Payroll Expenses', dr: '$80,000.00', cr: '-' },
              ].map((acc, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-700">{acc.name}</td>
                  <td className="px-6 py-3 text-gray-900 text-right">{acc.dr}</td>
                  <td className="px-6 py-3 text-gray-900 text-right">{acc.cr}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold text-gray-900 border-t-2 border-gray-200">
                <td className="px-6 py-4 uppercase">Total</td>
                <td className="px-6 py-4 text-right">$733,000.00</td>
                <td className="px-6 py-4 text-right">$733,000.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
