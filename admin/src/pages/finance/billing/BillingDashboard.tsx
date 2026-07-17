import React, { useState, useEffect } from 'react';
import { FileText, DollarSign, Activity, AlertCircle, Calendar, Plus, Download, TrendingUp, Users, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';

export default function BillingDashboard() {
  const [stats, setStats] = useState<any>(null);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/erp/billing/dashboard')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);



  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enterprise Billing Engine</h1>
          <p className="text-sm text-gray-500 mt-1">Manage core ERP customer invoices, taxes, and freight accounts.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/finance/billing/create" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center shadow-sm">
             <Plus size={16} className="mr-2" /> Create Invoice
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
            <h3 className="text-sm font-bold text-gray-500 mb-2">Collected Cash</h3>
            <div className="flex items-end space-x-2">
               <span className="text-3xl font-extrabold text-green-600">${(stats?.stats?.paidAmount || 0).toLocaleString()}</span>
            </div>
            <div className="absolute right-6 top-6 w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
               <Activity size={24}/>
            </div>
         </div>
         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
            <h3 className="text-sm font-bold text-gray-500 mb-2">Outstanding Receivables</h3>
            <div className="flex items-end space-x-2">
               <span className="text-3xl font-extrabold text-orange-600">${(stats?.stats?.outstandingAmount || 0).toLocaleString()}</span>
            </div>
            <div className="absolute right-6 top-6 w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
               <AlertCircle size={24}/>
            </div>
         </div>
         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
            <h3 className="text-sm font-bold text-gray-500 mb-2">Total Invoices</h3>
            <div className="flex items-end space-x-2">
               <span className="text-3xl font-extrabold text-gray-900">{stats?.recentInvoices?.length || 0}</span>
            </div>
            <div className="absolute right-6 top-6 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-600">
               <FileText size={24}/>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="md:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
           <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-gray-900 flex items-center"><Calendar className="mr-2 text-indigo-600"/> Recent Drafts</h2>
              <button className="text-indigo-600 hover:text-indigo-800"><RefreshCw size={14}/></button>
           </div>
           
           <div className="space-y-4">
              {stats?.recentInvoices?.map((inv: any) => (
                 <div key={inv.id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition cursor-pointer flex justify-between items-center">
                    <div>
                       <p className="text-sm font-bold text-gray-900">{inv.invoiceNumber}</p>
                       <p className="text-xs text-gray-500 mt-1">{new Date(inv.createdAt).toLocaleDateString()} • {inv.currency} {inv.grandTotal.toLocaleString()}</p>
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${
                       inv.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                       inv.status === 'PENDING_APPROVAL' ? 'bg-orange-100 text-orange-700' :
                       inv.status === 'APPROVED' ? 'bg-indigo-100 text-indigo-700' :
                       'bg-green-100 text-green-700'
                    }`}>
                       {inv.status.replace('_', ' ')}
                    </span>
                 </div>
              ))}
              
              {!stats?.recentInvoices?.length && (
                 <div className="text-center py-8 text-gray-400">
                    <FileText size={32} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No recent invoices found.</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
