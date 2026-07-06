import React from 'react';
import { Landmark, UploadCloud, CheckCircle, AlertTriangle, ArrowRightLeft } from 'lucide-react';

export default function BankReconciliation() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Bank Reconciliation</h2>
          <p className="text-sm text-gray-500 mt-1">Match bank statement lines with internal system transactions.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center">
            <UploadCloud className="w-4 h-4 mr-2" /> Upload MT940 / CSV
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center">
            <ArrowRightLeft className="w-4 h-4 mr-2" /> Auto-Match AI
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">System Balance</p>
          <p className="text-2xl font-bold text-gray-900">$420,000.00</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Statement Balance</p>
          <p className="text-2xl font-bold text-gray-900">$420,150.00</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-rose-500">
          <p className="text-sm text-gray-500 mb-1">Difference</p>
          <p className="text-2xl font-bold text-rose-600">-$150.00</p>
          <p className="text-xs text-rose-500 mt-1">Unreconciled Bank Charges</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Statement Lines */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-gray-900">Bank Statement Lines</h3>
          </div>
          <div className="p-0">
            <ul className="divide-y divide-gray-100">
              <li className="p-4 flex justify-between items-center bg-emerald-50/50">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Incoming Transfer: Global Tech</p>
                  <p className="text-xs text-gray-500">14 Nov 2023</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">+$45,000.00</p>
                  <span className="inline-flex items-center text-xs text-emerald-700 mt-1"><CheckCircle className="w-3 h-3 mr-1" /> Matched</span>
                </div>
              </li>
              <li className="p-4 flex justify-between items-center bg-rose-50/50">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Account Maintenance Fee</p>
                  <p className="text-xs text-gray-500">15 Nov 2023</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-rose-600">-$150.00</p>
                  <span className="inline-flex items-center text-xs text-rose-700 mt-1"><AlertTriangle className="w-3 h-3 mr-1" /> Unmatched</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* System Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-gray-900">System Transactions</h3>
          </div>
          <div className="p-0">
            <ul className="divide-y divide-gray-100">
              <li className="p-4 flex justify-between items-center bg-emerald-50/50 border-l-4 border-l-emerald-500">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Receipt REC-14022</p>
                  <p className="text-xs text-gray-500">Global Tech Corp</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">+$45,000.00</p>
                </div>
              </li>
              <li className="p-4 flex justify-between items-center text-center justify-center">
                <p className="text-sm text-gray-500">No matching transaction found in system for -$150.00</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
