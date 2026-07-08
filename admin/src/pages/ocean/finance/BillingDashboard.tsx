import React, { useState, useEffect } from 'react';
import { DollarSign, FileText, ArrowUpRight, ArrowDownRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BillingDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ocean/finance/invoices')
      .then(res => res.json())
      .then(data => {
        setInvoices(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="text-emerald-600" /> Ocean Freight Finance
          </h1>
          <p className="text-gray-500 mt-1">Multi-currency billing, AP/AR, and profitability overview.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/ocean/finance/profitability" className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
            <Briefcase size={18} /> <span>Margin Analysis</span>
          </Link>
          <Link to="/ocean/finance/invoices/new" className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 flex items-center space-x-2">
            <span>Create Invoice / Bill</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-start mb-2">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                 <ArrowUpRight size={20} />
              </div>
           </div>
           <div className="text-sm font-medium text-gray-500">Accounts Receivable (AR)</div>
           <div className="text-2xl font-bold text-gray-900 mt-1">$450,200.00</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-start mb-2">
              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                 <ArrowDownRight size={20} />
              </div>
           </div>
           <div className="text-sm font-medium text-gray-500">Accounts Payable (AP)</div>
           <div className="text-2xl font-bold text-gray-900 mt-1">$210,850.00</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-start mb-2">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                 <FileText size={20} />
              </div>
           </div>
           <div className="text-sm font-medium text-gray-500">Outstanding Invoices</div>
           <div className="text-2xl font-bold text-gray-900 mt-1">45</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-start mb-2">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                 <Briefcase size={20} />
              </div>
           </div>
           <div className="text-sm font-medium text-gray-500">Avg. Margin per TEU</div>
           <div className="text-2xl font-bold text-gray-900 mt-1">18.5%</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <h2 className="text-lg font-bold text-gray-900 p-6 border-b border-gray-100">Recent Financial Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm font-semibold">
              <tr>
                <th className="p-4">Invoice No.</th>
                <th className="p-4">Type</th>
                <th className="p-4">Party</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading financial data...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No invoices found.</td></tr>
              ) : invoices.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-emerald-600 hover:underline cursor-pointer">{inv.invoiceNumber}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded text-xs font-semibold ${inv.type === 'Receivable' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {inv.type}
                     </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900">{inv.partyName}</td>
                  <td className="p-4 text-sm font-semibold text-gray-900">
                     {inv.currency?.code || 'USD'} {inv.grandTotal.toFixed(2)}
                  </td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded text-xs font-medium ${inv.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {inv.status}
                     </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500 hover:text-emerald-600 cursor-pointer">View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
