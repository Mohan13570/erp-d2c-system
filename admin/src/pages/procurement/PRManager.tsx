import React, { useState, useEffect } from 'react';
import { FileText, Search, Plus, Filter, ArrowRight, User } from 'lucide-react';

export default function PRManager() {
  const [prs, setPrs] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/pr')
      .then(r => r.json())
      .then(data => setPrs(data))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="mr-3 text-indigo-600" size={32} />
            Purchase Requisitions (PR)
          </h1>
          <p className="text-gray-500 mt-1">Manage departmental requests, budgets, and routing.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition">
          <Plus className="w-4 h-4 mr-2" /> New Requisition
        </button>
      </div>

      <div className="bg-white rounded-2xl flex-1 border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search by PR Number or Department..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <div className="overflow-auto flex-1 p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">PR Number</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Department</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Items</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Est Amount</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Priority</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {prs.map((pr: any) => (
                <tr key={pr.id} className="hover:bg-indigo-50/30">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{pr.prNumber}</p>
                    <p className="text-xs text-gray-500">{new Date(pr.requestDate).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-800">{pr.department || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">{pr.items?.length || 0}</td>
                  <td className="px-6 py-4 font-mono text-gray-900">{pr.currency} {pr.totalEstAmount?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      pr.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                    }`}>{pr.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      pr.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>{pr.status}</span>
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