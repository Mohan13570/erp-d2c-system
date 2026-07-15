import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, Plus, Eye, MoreHorizontal, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/erp/billing')
      .then(res => res.json())
      .then(data => setInvoices(data))
      .catch(console.error);
  }, []);

  const filtered = invoices.filter((i: any) => 
    i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    i.customerId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">Search, filter, and manage all commercial and freight invoices.</p>
        </div>
        <div className="flex space-x-3">
           <button className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center">
             <Download size={16} className="mr-2" /> Export CSV
           </button>
           <Link to="/finance/billing/create" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center shadow-sm">
             <Plus size={16} className="mr-2" /> New Invoice
           </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="relative w-96">
               <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
               <input 
                  type="text" 
                  placeholder="Search by Invoice # or Customer..." 
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
               />
            </div>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-sm font-medium flex items-center">
               <Filter size={16} className="mr-2" /> Advanced Filters
            </button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                     <th className="px-6 py-4">Invoice Number</th>
                     <th className="px-6 py-4">Customer ID</th>
                     <th className="px-6 py-4">Issue Date</th>
                     <th className="px-6 py-4">Due Date</th>
                     <th className="px-6 py-4 text-right">Grand Total</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 text-gray-900">
                  {filtered.length > 0 ? filtered.map((inv: any) => (
                     <tr key={inv.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-bold text-indigo-600">{inv.invoiceNumber}</td>
                        <td className="px-6 py-4">{inv.customerId}</td>
                        <td className="px-6 py-4 text-gray-500">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-gray-500">{new Date(inv.dueDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right font-extrabold">{inv.currency} {inv.grandTotal.toLocaleString()}</td>
                        <td className="px-6 py-4">
                           <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${
                              inv.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                              inv.status === 'PENDING_APPROVAL' ? 'bg-orange-100 text-orange-700' :
                              inv.status === 'APPROVED' ? 'bg-indigo-100 text-indigo-700' :
                              inv.status === 'PAID' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                           }`}>
                              {inv.status.replace('_', ' ')}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center justify-center space-x-2">
                              <button onClick={() => navigate(`/finance/billing/${inv.id}`)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded">
                                 <Eye size={16} />
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                                 <MoreHorizontal size={16} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  )) : (
                     <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                           <FileText size={32} className="mx-auto mb-3 opacity-30 text-gray-400" />
                           No invoices found matching your criteria.
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
