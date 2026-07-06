import React from 'react';
import { FileText, Plus, Search, Filter, Download, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export default function AccountsPayable() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Accounts Payable</h2>
          <p className="text-sm text-gray-500 mt-1">Manage vendor bills, 3-way matching, and payment schedules.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
            Generate AP Ageing
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" /> Record Bill
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search vendor bills..." 
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
              />
            </div>
            <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </button>
          </div>
          <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center">
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Bill #</th>
                <th className="px-6 py-4 font-medium">Vendor</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Match Status</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { no: 'BILL-001', vendor: 'Maersk Logistics', date: '2023-11-01', due: '2023-11-15', amt: '$12,450.00', match: '3-Way Matched', status: 'Pending' },
                { no: 'BILL-002', vendor: 'DHL Express', date: '2023-11-05', due: '2023-11-20', amt: '$4,200.00', match: 'Discrepancy', status: 'Hold' },
                { no: 'BILL-003', vendor: 'Cisco Systems', date: '2023-10-25', due: '2023-11-10', amt: '$89,000.00', match: '3-Way Matched', status: 'Paid' },
              ].map((bill, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-indigo-600">{bill.no}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{bill.vendor}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{bill.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{bill.due}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{bill.amt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1.5">
                      {bill.match === '3-Way Matched' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      <span className="text-xs font-medium text-gray-700">{bill.match}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " +
                      (bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                      bill.status === 'Hold' ? 'bg-rose-100 text-rose-800' : 'bg-indigo-100 text-indigo-800')
                    }>
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Process</button>
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
