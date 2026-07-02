import React, { useState, useEffect } from 'react';
import { FileText, Search, ExternalLink, CreditCard } from 'lucide-react';

export default function VendorBilling() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/finance/bills')
      .then(res => res.json())
      .then(setBills)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="mr-3 text-rose-600" size={32} />
            Accounts Payable & Vendor Bills
          </h1>
          <p className="text-gray-500 mt-1">Manage incoming invoices, tax allocations, and AP liabilities.</p>
        </div>
        <button className="bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-rose-700 transition">
          <ExternalLink className="w-4 h-4 mr-2" /> Upload Bill
        </button>
      </div>

      <div className="bg-white rounded-2xl flex-1 border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search Bill Number or Vendor..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl" />
          </div>
        </div>
        <div className="overflow-auto flex-1 p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Bill #</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Vendor</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Amount (Inc Tax)</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Due Date</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bills.map((bill: any) => (
                <tr key={bill.id} className="hover:bg-rose-50/30">
                  <td className="px-6 py-4 font-bold text-gray-900">{bill.billNumber}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{bill.vendor?.name}</td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">{bill.currency} {bill.totalAmount?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(bill.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>{bill.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 font-medium text-sm hover:underline flex items-center justify-end w-full">
                      <CreditCard size={16} className="mr-1"/> Pay
                    </button>
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