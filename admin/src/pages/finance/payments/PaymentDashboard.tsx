import React, { useState, useEffect } from 'react';
import { Wallet, Building, RefreshCcw, Landmark, Receipt, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PaymentDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/erp/payments/dashboard')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Treasury & Cash Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage physical bank accounts, payment processing, and reconciliations.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/finance/payments/receive" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 flex items-center shadow-sm">
             <Receipt size={16} className="mr-2" /> Receive Payment
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
            <h3 className="text-sm font-bold text-gray-500 mb-2">Total Bank Balance</h3>
            <div className="flex items-end space-x-2">
               <span className="text-3xl font-extrabold text-gray-900">${(data?.totalBankBalance || 0).toLocaleString(undefined, {minimumFractionDigits:2})}</span>
            </div>
            <div className="absolute right-6 top-6 w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
               <Landmark size={24}/>
            </div>
         </div>
         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
            <h3 className="text-sm font-bold text-gray-500 mb-2">Unreconciled Cash (In Transit)</h3>
            <div className="flex items-end space-x-2">
               <span className="text-3xl font-extrabold text-orange-600">${(data?.totalCashInTransit || 0).toLocaleString(undefined, {minimumFractionDigits:2})}</span>
            </div>
            <div className="absolute right-6 top-6 w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
               <RefreshCcw size={24}/>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
         <h2 className="font-bold text-gray-900 mb-6">Treasury Modules</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/finance/payments/receive" className="p-5 border border-gray-100 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition group">
               <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-200">
                  <CreditCard size={24} />
               </div>
               <h3 className="font-bold text-gray-900">Point of Sale</h3>
               <p className="text-sm text-gray-500 mt-1">Log incoming wires, checks, and generate receipts.</p>
            </Link>
            
            <Link to="/finance/payments/reconciliation" className="p-5 border border-gray-100 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition group">
               <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-200">
                  <RefreshCcw size={24} />
               </div>
               <h3 className="font-bold text-gray-900">Bank Reconciliation</h3>
               <p className="text-sm text-gray-500 mt-1">Match ERP payments against raw bank statements.</p>
            </Link>
            
            <Link to="/finance/payments/cashbook" className="p-5 border border-gray-100 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition group">
               <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 mb-4 group-hover:bg-amber-200">
                  <Wallet size={24} />
               </div>
               <h3 className="font-bold text-gray-900">Cash Book</h3>
               <p className="text-sm text-gray-500 mt-1">Manage physical petty cash and daily till balances.</p>
            </Link>
         </div>
      </div>
    </div>
  );
}
