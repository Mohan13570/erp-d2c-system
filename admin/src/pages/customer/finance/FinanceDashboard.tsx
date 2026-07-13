import React from 'react';
import { DollarSign, CreditCard, FileText, AlertTriangle, TrendingUp, Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockRevenueData = [
  { month: 'Jun', invoiced: 45000, paid: 40000 },
  { month: 'Jul', invoiced: 52000, paid: 48000 },
  { month: 'Aug', invoiced: 61000, paid: 55000 },
  { month: 'Sep', invoiced: 49000, paid: 45000 },
  { month: 'Oct', invoiced: 78000, paid: 60000 },
];

export default function FinanceDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage invoices, track payments, and monitor credit limits securely.</p>
        </div>
        <div className="flex space-x-3">
           <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center">
             <Download size={16} className="mr-2"/> Statement of Account
           </button>
           <Link to="/customer/finance/payments" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center shadow-sm">
             <CreditCard size={16} className="mr-2"/> Make a Payment
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Outstanding Balance', value: '$18,450.00', icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Available Credit', value: '$31,550.00', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Unpaid Invoices', value: '4', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Overdue Warning', value: '1', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Invoicing vs Payments (6 Months)</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dx={-10} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="invoiced" name="Amount Invoiced" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="paid" name="Amount Paid" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
               <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Action Required</h2>
            </div>
            <div className="p-5 space-y-4">
               <div className="flex justify-between items-center p-4 border border-red-100 bg-red-50 rounded-xl">
                  <div>
                     <p className="text-sm font-bold text-red-900">INV-10042</p>
                     <p className="text-xs text-red-700 mt-1">Overdue by 5 days</p>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-bold text-red-900">$4,500.00</p>
                     <button className="text-xs font-semibold text-white bg-red-600 px-3 py-1 rounded-md mt-1 hover:bg-red-700">Pay Now</button>
                  </div>
               </div>
               <div className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div>
                     <p className="text-sm font-bold text-gray-900">INV-10045</p>
                     <p className="text-xs text-gray-500 mt-1">Due in 12 days</p>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-bold text-gray-900">$12,500.00</p>
                     <Link to="/customer/finance/payments" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 mt-1 block">View Invoice</Link>
                  </div>
               </div>
            </div>
            <div className="p-4 border-t border-gray-100 text-center bg-gray-50/50">
               <Link to="/customer/finance/invoices" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center">
                  View All Invoices <ArrowRight size={16} className="ml-1"/>
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
