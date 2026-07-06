import React, { useState } from 'react';
import { BookOpen, Plus, Search, Filter, Download, ArrowRightLeft, FileText, CheckCircle } from 'lucide-react';

export default function GeneralLedger() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">General Ledger & Journals</h2>
          <p className="text-sm text-gray-500 mt-1">Manage manual journal entries, auto-postings, and double-entry bookkeeping.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Month-End Close
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" /> New Journal Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Pending Journals</p>
          <p className="text-2xl font-bold text-amber-600">12</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Posted Today</p>
          <p className="text-2xl font-bold text-emerald-600">145</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Debits (Today)</p>
          <p className="text-2xl font-bold text-gray-900">$452,100</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Credits (Today)</p>
          <p className="text-2xl font-bold text-gray-900">$452,100</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search journal entries..." 
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
                <th className="px-6 py-4 font-medium">Journal #</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Narration</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium text-right">Debit</th>
                <th className="px-6 py-4 font-medium text-right">Credit</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { no: 'JV-2023-11-001', date: '2023-11-15', desc: 'Accrued Payroll Expenses', src: 'Manual', dr: '$125,000.00', cr: '$125,000.00', status: 'Posted' },
                { no: 'JV-2023-11-002', date: '2023-11-15', desc: 'Vendor Bill AP-4022', src: 'Accounts Payable', dr: '$14,200.00', cr: '$14,200.00', status: 'Posted' },
                { no: 'JV-2023-11-003', date: '2023-11-16', desc: 'Prepaid Rent Adjustments', src: 'Manual', dr: '$5,000.00', cr: '$5,000.00', status: 'Draft' },
              ].map((jv, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-indigo-600">{jv.no}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{jv.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{jv.desc}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{jv.src}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">{jv.dr}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">{jv.cr}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " +
                      (jv.status === 'Posted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800')
                    }>
                      {jv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">View</button>
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
