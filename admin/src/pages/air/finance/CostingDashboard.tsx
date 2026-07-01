import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Receipt, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CostingDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <DollarSign className="mr-3 text-emerald-600" size={32} /> Air Freight Financials
          </h1>
          <p className="text-gray-500 font-medium mt-1">Costing, Margins, AP/AR, and Revenue Analytics.</p>
        </div>
        <button className="bg-gray-900 text-white px-5 py-2 rounded-xl font-bold hover:bg-black transition flex items-center">
          <FileText size={20} className="mr-2" /> Export GL Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-500">Gross Revenue (MTD)</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">$450,230</h3>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600"><TrendingUp size={24} /></div>
          </div>
          <p className="text-xs font-bold text-emerald-600 mt-4">+12.5% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-500">Total Costs (MTD)</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">$310,400</h3>
            </div>
            <div className="p-3 bg-red-100 rounded-xl text-red-600"><TrendingDown size={24} /></div>
          </div>
          <p className="text-xs font-bold text-gray-400 mt-4">Airline & Handling Fees</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-500">Gross Margin</p>
              <h3 className="text-3xl font-black text-emerald-600 mt-1">31.05%</h3>
            </div>
            <div className="p-3 bg-sky-100 rounded-xl text-sky-600"><DollarSign size={24} /></div>
          </div>
          <p className="text-xs font-bold text-sky-600 mt-4">Target: 25.0%</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-500">Pending AR</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">$84,500</h3>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600"><Receipt size={24} /></div>
          </div>
          <p className="text-xs font-bold text-amber-600 mt-4">12 Invoices Overdue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Recent Shipment Profitability</h2>
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                 <th className="pb-3">AWB / Booking</th>
                 <th className="pb-3 text-right">Revenue</th>
                 <th className="pb-3 text-right">Cost</th>
                 <th className="pb-3 text-right">Margin</th>
                 <th className="pb-3 text-center">Action</th>
               </tr>
             </thead>
             <tbody className="text-sm font-semibold">
               {['AB-10293', 'AB-55821', 'AB-99201'].map((id, i) => (
                 <tr key={i} className="border-t border-gray-50">
                   <td className="py-3 text-sky-600">{id}</td>
                   <td className="py-3 text-right text-gray-900">$5,400.00</td>
                   <td className="py-3 text-right text-red-500">$3,200.00</td>
                   <td className="py-3 text-right text-emerald-600">40.7%</td>
                   <td className="py-3 text-center">
                     <Link to={`/air/finance/profitability/${id}`} className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200">View P&L</Link>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Outstanding Payables (Vendor Bills)</h2>
           <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:shadow-md transition">
                <div className="flex items-center">
                  <CreditCard className="text-gray-400 mr-4" size={32} />
                  <div>
                    <div className="font-bold text-gray-900">Emirates SkyCargo</div>
                    <div className="text-xs text-gray-500">Bill #VB-8821 • Due in 5 Days</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-gray-900">$12,450.00</div>
                  <button className="text-xs font-bold text-sky-600 hover:underline">Pay Now</button>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
