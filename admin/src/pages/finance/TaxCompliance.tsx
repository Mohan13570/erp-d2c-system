import React from 'react';
import { ShieldCheck, Download, AlertTriangle } from 'lucide-react';

export default function TaxCompliance() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Taxation & Compliance</h2>
          <p className="text-sm text-gray-500 mt-1">GST/VAT auto-calculation, TDS deductions, and tax filings.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center">
          <Download className="w-4 h-4 mr-2" /> Generate Filing GSTR-1
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm border-t-4 border-t-indigo-500">
          <p className="text-sm text-gray-500 mb-1">Total Output Tax (GST Collected)</p>
          <p className="text-2xl font-bold text-gray-900">$0.00</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm border-t-4 border-t-emerald-500">
          <p className="text-sm text-gray-500 mb-1">Input Tax Credit (ITC)</p>
          <p className="text-2xl font-bold text-gray-900">$0.00</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm border-t-4 border-t-rose-500">
          <p className="text-sm text-gray-500 mb-1">Net Tax Payable</p>
          <p className="text-2xl font-bold text-rose-600">$0.00</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4 text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm font-medium">Warning: 3 Vendor Bills have mismatched ITC amounts. Please reconcile before filing.</span>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Tax Ledgers (Nov 2023)</h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-gray-100">
              <th className="py-2">Tax Component</th>
              <th className="py-2 text-right">Collected (Output)</th>
              <th className="py-2 text-right">Paid (Input)</th>
              <th className="py-2 text-right">Liability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr>
              <td className="py-3 font-medium text-gray-900">CGST @ 9%</td>
              <td className="py-3 text-right">$0.00</td>
              <td className="py-3 text-right">$0.00</td>
              <td className="py-3 text-right font-semibold">$0.00</td>
            </tr>
            <tr>
              <td className="py-3 font-medium text-gray-900">SGST @ 9%</td>
              <td className="py-3 text-right">$0.00</td>
              <td className="py-3 text-right">$0.00</td>
              <td className="py-3 text-right font-semibold">$0.00</td>
            </tr>
            <tr>
              <td className="py-3 font-medium text-gray-900">IGST @ 18%</td>
              <td className="py-3 text-right">$0.00</td>
              <td className="py-3 text-right">$0.00</td>
              <td className="py-3 text-right font-semibold">$0.00</td>
            </tr>
            <tr className="bg-gray-50 font-bold border-t-2 border-gray-200">
              <td className="py-3">TOTAL NET PAYABLE</td>
              <td colSpan={3} className="py-3 text-right text-rose-600 text-lg">$0.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
