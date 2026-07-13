import React from 'react';
import { Search, Filter, Download, FileText, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockInvoices = [
  { id: 'INV-10045', date: 'Oct 24, 2026', due: 'Nov 24, 2026', ref: 'BKG-772910', amount: 12500.00, status: 'UNPAID' },
  { id: 'INV-10042', date: 'Sep 15, 2026', due: 'Oct 15, 2026', ref: 'BKG-661002', amount: 4500.00, status: 'OVERDUE' },
  { id: 'INV-10038', date: 'Sep 01, 2026', due: 'Oct 01, 2026', ref: 'BKG-559011', amount: 8200.00, status: 'PAID' },
];

export default function InvoiceList() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices & Billing</h1>
          <p className="text-sm text-gray-500 mt-1">View, download, and manage your freight invoices.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search Invoice ID or Ref..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 w-72" />
          </div>
          <div className="flex space-x-3">
             <button className="flex items-center px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white shadow-sm hover:bg-gray-50">
               <Filter size={16} className="mr-2" /> Filter
             </button>
             <button className="flex items-center px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white shadow-sm hover:bg-gray-50">
               <Download size={16} className="mr-2" /> Export
             </button>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="p-4">Invoice No</th>
              <th className="p-4">Date Issued</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Booking Ref</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                     <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><FileText size={16} /></div>
                     <span className="font-bold text-gray-900">{inv.id}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">{inv.date}</td>
                <td className="p-4 text-sm font-medium text-gray-900">{inv.due}</td>
                <td className="p-4 text-sm text-gray-500">{inv.ref}</td>
                <td className="p-4 font-bold text-gray-900">${inv.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td className="p-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                     inv.status === 'PAID' ? 'bg-green-100 text-green-700' :
                     inv.status === 'OVERDUE' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                     {inv.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link to={`/customer/finance/invoices/${inv.id}`} className="text-gray-400 hover:text-indigo-600 transition-colors p-2 inline-block">
                    <Eye size={18} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
