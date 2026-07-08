import React, { useState, useEffect } from 'react';
import { CreditCard, Search, Plus } from 'lucide-react';

export default function PaymentManager() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch('/api/procurement/finance/payments')
      .then(res => res.json())
      .then(setPayments)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <CreditCard className="mr-3 text-emerald-600" size={32} />
            Payment Gateway & Ledger
          </h1>
          <p className="text-gray-500 mt-1">Track outgoing payments, methods, and bank reconciliations.</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-emerald-700 transition">
          <Plus className="w-4 h-4 mr-2" /> New Payment
        </button>
      </div>

      <div className="bg-white rounded-2xl flex-1 border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search Payment ID..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl" />
          </div>
        </div>
        <div className="overflow-auto flex-1 p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Payment Ref</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Vendor</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Method</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Amount Paid</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((pay: any) => (
                <tr key={pay.id} className="hover:bg-emerald-50/30">
                  <td className="px-6 py-4 font-bold text-gray-900">{pay.paymentNumber}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{pay.vendor?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{pay.method}</td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">$ {pay.amount?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(pay.paymentDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {pay.status}
                    </span>
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