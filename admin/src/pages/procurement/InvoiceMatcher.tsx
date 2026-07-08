import React, { useState, useEffect } from 'react';
import { Receipt, Search, FileSignature, CheckCircle, AlertOctagon } from 'lucide-react';

export default function InvoiceMatcher() {
  const [invoices, setInvoices] = useState([]);
  
  useEffect(() => {
    fetch('/api/procurement/invoices')
      .then(r => r.json())
      .then(data => setInvoices(data))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Receipt className="mr-3 text-rose-600" size={32} />
            3-Way Invoice Matching
          </h1>
          <p className="text-gray-500 mt-1">Automated reconciliation of Vendor Invoice, PO, and GRN.</p>
        </div>
        <button className="bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-rose-700 transition">
          <FileSignature className="w-4 h-4 mr-2" /> Upload Invoice
        </button>
      </div>

      <div className="bg-white rounded-2xl flex-1 border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search Invoices..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl" />
          </div>
        </div>
        <div className="overflow-auto flex-1 p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Invoice #</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">PO Reference</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Amount</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Match Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-rose-50/30">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{inv.invoiceNumber}</p>
                    <p className="text-xs text-gray-500">Due: {new Date(inv.dueDate).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-600">{inv.purchaseOrder?.poNumber}</td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">{inv.currency} {inv.totalAmount?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {inv.matchStatus === '3-Way-Matched' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        <CheckCircle size={12} className="mr-1"/> Matched
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                        <AlertOctagon size={12} className="mr-1"/> Discrepancy
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-indigo-600 font-medium text-sm hover:underline">Review</button>
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