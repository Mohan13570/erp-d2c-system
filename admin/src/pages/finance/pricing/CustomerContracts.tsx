import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, FileSignature, CheckCircle, Shield } from 'lucide-react';

export default function CustomerContracts() {
  const [contracts, setContracts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/erp/pricing/contracts')
      .then(res => res.json())
      .then(data => setContracts(data))
      .catch(console.error);
  }, []);

  const filtered = contracts.filter((c: any) => 
    c.contractNumber.toLowerCase().includes(search.toLowerCase()) ||
    c.customerId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Pricing Contracts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage negotiated rates, volume discounts, and credit terms for key accounts.</p>
        </div>
        <div className="flex space-x-3">
           <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center shadow-sm">
             <Plus size={16} className="mr-2" /> New Contract
           </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="relative w-96">
               <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
               <input 
                  type="text" 
                  placeholder="Search by Contract # or Customer ID..." 
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
               />
            </div>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-sm font-medium flex items-center">
               <Filter size={16} className="mr-2" /> Filter
            </button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                     <th className="px-6 py-4">Contract #</th>
                     <th className="px-6 py-4">Customer</th>
                     <th className="px-6 py-4">Credit Terms</th>
                     <th className="px-6 py-4">Global Discount</th>
                     <th className="px-6 py-4">Validity</th>
                     <th className="px-6 py-4">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 text-gray-900">
                  {filtered.length > 0 ? filtered.map((c: any) => (
                     <tr key={c.id} className="hover:bg-gray-50 transition cursor-pointer">
                        <td className="px-6 py-4 font-bold text-indigo-600 flex items-center">
                           <FileSignature size={16} className="mr-2 text-gray-400" /> {c.contractNumber}
                        </td>
                        <td className="px-6 py-4 font-medium">{c.customerId}</td>
                        <td className="px-6 py-4 text-gray-500">{c.creditTerms} Days</td>
                        <td className="px-6 py-4 text-emerald-600 font-bold">{c.discountPercent}% ({c.discountType})</td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                           {new Date(c.validFrom).toLocaleDateString()} to {new Date(c.validTo).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${
                              c.status === 'ACTIVE' ? 'bg-indigo-100 text-indigo-700' : 'bg-red-100 text-red-700'
                           }`}>
                              {c.status}
                           </span>
                        </td>
                     </tr>
                  )) : (
                     <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                           <Shield size={32} className="mx-auto mb-3 opacity-30 text-gray-400" />
                           No contracts found.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
