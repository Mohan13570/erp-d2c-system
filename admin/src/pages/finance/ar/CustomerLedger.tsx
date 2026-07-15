import React, { useState, useEffect } from 'react';
import { Search, Download, FileText, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CustomerLedger() {
  const [profile, setProfile] = useState<any>(null);
  const [search, setSearch] = useState('CUST-1049');

  const fetchLedger = () => {
    fetch(`http://localhost:5000/api/erp/ar/ledger/${search}`)
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(() => setProfile(null));
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/finance/ar" className="text-indigo-600 text-sm font-medium hover:underline mb-2 inline-block">&larr; Back to AR</Link>
          <h1 className="text-2xl font-bold text-gray-900">Customer AR Ledger</h1>
          <p className="text-sm text-gray-500 mt-1">Double-entry accounting statement showing running balances.</p>
        </div>
        <div className="flex space-x-3">
           <button onClick={() => window.print()} className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center">
             <Download size={16} className="mr-2" /> Export Statement PDF
           </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 mb-6">
         <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
               type="text" 
               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
               value={search}
               onChange={e => setSearch(e.target.value)}
               placeholder="Customer ID..."
            />
         </div>
         <button onClick={fetchLedger} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700">Load Ledger</button>
      </div>

      {profile ? (
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 space-y-4">
               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Credit Profile</h3>
                  <div className="space-y-4">
                     <div>
                        <p className="text-xs text-gray-500">Credit Limit</p>
                        <p className="text-lg font-bold">${profile.creditLimit.toLocaleString()}</p>
                     </div>
                     <div>
                        <p className="text-xs text-gray-500">Used Credit (Debt)</p>
                        <p className="text-lg font-bold text-red-600">${profile.usedCredit.toLocaleString()}</p>
                     </div>
                     <div>
                        <p className="text-xs text-gray-500">Available Credit</p>
                        <p className="text-lg font-bold text-emerald-600">${profile.availableCredit.toLocaleString()}</p>
                     </div>
                     
                     <div className="pt-4 border-t border-gray-100">
                        <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${profile.isOnCreditHold ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                           {profile.isOnCreditHold ? 'ON CREDIT HOLD' : 'ACCOUNT ACTIVE'}
                        </span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="md:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-bold text-gray-900">Financial Statement: {profile.customerId}</h3>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                     <thead className="bg-gray-100 text-gray-500 font-medium">
                        <tr>
                           <th className="px-6 py-4">Date</th>
                           <th className="px-6 py-4">Ref ID</th>
                           <th className="px-6 py-4">Description</th>
                           <th className="px-6 py-4 text-right">Debit (Owed)</th>
                           <th className="px-6 py-4 text-right">Credit (Paid)</th>
                           <th className="px-6 py-4 text-right bg-indigo-50 font-bold text-indigo-900">Running Bal</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 text-gray-900">
                        {profile.ledgers.map((l: any) => (
                           <tr key={l.id} className="hover:bg-gray-50">
                              <td className="px-6 py-3 text-xs text-gray-500">{new Date(l.transactionDate).toLocaleString()}</td>
                              <td className="px-6 py-3 font-mono text-indigo-600">{l.referenceId}</td>
                              <td className="px-6 py-3">{l.description}</td>
                              <td className="px-6 py-3 text-right text-red-600">{l.debitAmount > 0 ? l.debitAmount.toLocaleString() : '-'}</td>
                              <td className="px-6 py-3 text-right text-emerald-600">{l.creditAmount > 0 ? l.creditAmount.toLocaleString() : '-'}</td>
                              <td className="px-6 py-3 text-right bg-indigo-50/30 font-bold font-mono">{l.runningBalance.toLocaleString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      ) : (
         <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p>Enter a Customer ID to load their financial statement.</p>
         </div>
      )}
    </div>
  );
}
