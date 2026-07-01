import React, { useState, useEffect } from 'react';
import { DollarSign, FileText, CheckCircle2 } from 'lucide-react';

export default function ContainerBillingHub() {
  const [billings, setBillings] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/container-finance/billing')
      .then(res => res.json())
      .then(setBillings)
      .catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <DollarSign className="mr-3 text-emerald-600" size={32} /> Billing & AR/AP
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage Demurrage, Detention, Storage, and Cleaning charges across multiple currencies.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FileText className="mr-2 text-emerald-500" size={24} /> Financial Ledgers
          </h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-100">
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Date</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Type</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Container No</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Line Items</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Total Amount</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {billings.map(bill => (
              <tr key={bill.id} className="hover:bg-gray-50">
                <td className="p-4 text-sm font-bold text-gray-500">{new Date(bill.timestamp).toLocaleDateString()}</td>
                <td className="p-4 text-sm font-bold text-gray-700">{bill.type}</td>
                <td className="p-4 text-sm font-black text-gray-900 font-mono tracking-wider">{bill.container?.containerNo || 'Multiple'}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {bill.charges?.map((c: any) => (
                      <span key={c.id} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded">
                        {c.chargeType}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-sm font-black text-gray-900">
                  {bill.totalAmount.toLocaleString()} {bill.currency}
                </td>
                <td className="p-4">
                  {bill.status === 'Paid' ? (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center inline-flex">
                      <CheckCircle2 size={12} className="mr-1" /> Paid
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Draft</span>
                  )}
                </td>
              </tr>
            ))}
            {billings.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400 font-medium">No billing records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
