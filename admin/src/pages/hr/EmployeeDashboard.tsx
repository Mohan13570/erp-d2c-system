import React from 'react';
import { Users, FileCheck, UserPlus, ShieldAlert, Download, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HR & Payroll Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage employee lifecycle, onboarding, and compliance.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-200 bg-white rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center text-gray-700">
             <Download size={16} className="mr-2"/> Export HR Report
          </button>
          <Link to="/hr/register" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-sm flex items-center">
             <UserPlus size={16} className="mr-2" /> Invite Employee
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><Users size={24} /></div>
          <div><p className="text-sm font-medium text-gray-500">Total Active Employees</p><p className="text-2xl font-bold text-gray-900">1,245</p></div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-yellow-50 text-yellow-600"><Clock size={24} /></div>
          <div><p className="text-sm font-medium text-gray-500">Onboarding Pending</p><p className="text-2xl font-bold text-gray-900">24</p></div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-red-50 text-red-600"><ShieldAlert size={24} /></div>
          <div><p className="text-sm font-medium text-gray-500">Expiring Documents</p><p className="text-2xl font-bold text-gray-900">18</p></div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-green-50 text-green-600"><CheckCircle size={24} /></div>
          <div><p className="text-sm font-medium text-gray-500">Global Compliance</p><p className="text-2xl font-bold text-gray-900">98.5%</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
               <h2 className="font-bold text-gray-900 flex items-center"><FileCheck className="mr-2 text-indigo-600" size={20}/> Pending Approvals</h2>
               <Link to="/hr/approvals" className="text-sm text-indigo-600 font-medium hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-gray-100">
               {[
                 { action: 'Offer Letter Generation', emp: 'Sarah Jenkins', role: 'Logistics Analyst', time: '1 hr ago' },
                 { action: 'Background Check Review', emp: 'Michael Chang', role: 'Warehouse Manager', time: '3 hrs ago' },
                 { action: 'IT Asset Allocation', emp: 'David Miller', role: 'Finance Executive', time: '1 day ago' },
               ].map((item, i) => (
                 <div key={i} className="p-5 flex justify-between items-center hover:bg-gray-50 transition">
                    <div>
                       <p className="text-sm font-bold text-gray-900">{item.action}</p>
                       <p className="text-xs text-gray-500 mt-1">{item.emp} • {item.role}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                       <span className="text-xs text-gray-400">{item.time}</span>
                       <button className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100">Review</button>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
               <h2 className="font-bold text-gray-900 flex items-center"><Users className="mr-2 text-indigo-600" size={20}/> Department Overview</h2>
            </div>
            <div className="p-5 space-y-4">
               {[
                 { dept: 'Operations & Logistics', count: 450, color: 'bg-blue-500', width: '80%' },
                 { dept: 'Warehouse & Yard', count: 320, color: 'bg-green-500', width: '60%' },
                 { dept: 'Sales & Customer Success', count: 180, color: 'bg-purple-500', width: '40%' },
                 { dept: 'Finance & Accounting', count: 120, color: 'bg-yellow-500', width: '30%' },
                 { dept: 'Technology & IT', count: 85, color: 'bg-indigo-500', width: '20%' },
               ].map((dept, i) => (
                 <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                       <span className="font-medium text-gray-700">{dept.dept}</span>
                       <span className="font-bold text-gray-900">{dept.count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                       <div className={`${dept.color} h-2 rounded-full`} style={{ width: dept.width }}></div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
