import React, { useState } from 'react';
import { Search, Filter, Mail, Phone, MoreHorizontal, ShieldCheck } from 'lucide-react';

const mockDirectory = [
  { id: 'EMP-1045', name: 'John Smith', role: 'Head of Logistics', dept: 'Operations', location: 'New York, USA', status: 'ACTIVE', email: 'john.s@company.com' },
  { id: 'EMP-1046', name: 'Sarah Jenkins', role: 'Logistics Analyst', dept: 'Operations', location: 'London, UK', status: 'ACTIVE', email: 'sarah.j@company.com' },
  { id: 'EMP-1047', name: 'Michael Chang', role: 'Warehouse Manager', dept: 'Warehouse', location: 'Shanghai, CN', status: 'ON_LEAVE', email: 'michael.c@company.com' },
  { id: 'EMP-1048', name: 'David Miller', role: 'Finance Executive', dept: 'Finance', location: 'Dubai, UAE', status: 'ACTIVE', email: 'david.m@company.com' },
  { id: 'EMP-1049', name: 'Elena Rodriguez', role: 'Customs Broker', dept: 'Customs', location: 'Miami, USA', status: 'ACTIVE', email: 'elena.r@company.com' },
];

export default function EmployeeDirectory() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Global Employee Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Search and manage your global workforce.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by name, ID, or role..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 w-80" />
          </div>
          <div className="flex space-x-2">
             <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white font-medium flex items-center"><Filter size={16} className="mr-2 text-gray-400"/> Filter</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Employee</th>
                <th className="p-4">Employee ID</th>
                <th className="p-4">Role & Department</th>
                <th className="p-4">Location</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockDirectory.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                           {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                           <p className="text-sm font-bold text-gray-900">{emp.name}</p>
                           <p className="text-xs text-gray-500 flex items-center"><ShieldCheck size={12} className="mr-1 text-green-600"/> Verified</p>
                        </div>
                     </div>
                  </td>
                  <td className="p-4 font-mono text-sm font-medium text-gray-600">{emp.id}</td>
                  <td className="p-4">
                     <p className="text-sm font-medium text-gray-900">{emp.role}</p>
                     <p className="text-xs text-gray-500">{emp.dept}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{emp.location}</td>
                  <td className="p-4">
                     <div className="flex space-x-2">
                        <button className="p-1.5 text-gray-400 hover:text-indigo-600 bg-gray-50 rounded-lg hover:bg-indigo-50"><Mail size={16}/></button>
                        <button className="p-1.5 text-gray-400 hover:text-indigo-600 bg-gray-50 rounded-lg hover:bg-indigo-50"><Phone size={16}/></button>
                     </div>
                  </td>
                  <td className="p-4">
                     <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${emp.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {emp.status}
                     </span>
                  </td>
                  <td className="p-4 text-center">
                     <button className="p-1 text-gray-400 hover:text-gray-900"><MoreHorizontal size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
