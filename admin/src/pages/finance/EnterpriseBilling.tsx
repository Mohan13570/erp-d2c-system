import React from 'react';
import { FileText, Plus, Search, Filter, Download, DollarSign, Send, FileCheck } from 'lucide-react';

export default function EnterpriseBilling() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Enterprise Billing Hub</h2>
          <p className="text-sm text-gray-500 mt-1">Manage complex consolidated multi-currency logistics bills.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center">
            <DollarSign className="w-4 h-4 mr-2" /> Billing Rules
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" /> Create Invoice
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search bills by customer, BL, or reference..." 
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-indigo-500 w-80"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 flex items-center"><Filter className="w-4 h-4 mr-1" /> Filter</button>
            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 flex items-center"><Download className="w-4 h-4 mr-1" /> Export</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Invoice #</th>
                <th className="px-6 py-4 font-medium">Bill To</th>
                <th className="px-6 py-4 font-medium">Source / Type</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Taxes (GST)</th>
                <th className="px-6 py-4 font-medium">Total Payable</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { no: 'FB-889012', client: 'Acme Corp', src: 'Ocean Freight (SHP-001)', amt: '$0.00', tax: '$0.00', tot: '$0.00' },
                { no: 'WB-445019', client: 'Global Tech', src: 'Warehouse Storage', amt: '$0.00', tax: '$0.00', tot: '$0.00' },
                { no: 'CB-112093', client: 'Stark Industries', src: 'Customs Clearance', amt: '$0.00', tax: '$0.00', tot: '$0.00' },
              ].map((bill, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-indigo-600">{bill.no}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{bill.client}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium mr-2">
                      {bill.src.split(' ')[0]}
                    </span>
                    {bill.src}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{bill.amt}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{bill.tax}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{bill.tot}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="p-1.5 text-gray-400 hover:text-indigo-600"><FileCheck className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-400 hover:text-indigo-600"><Send className="w-4 h-4" /></button>
                    </div>
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
