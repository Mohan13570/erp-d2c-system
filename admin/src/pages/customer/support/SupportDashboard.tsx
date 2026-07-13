import React from 'react';
import { Search, Plus, MessageSquare, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockTickets = [
  { id: 'TCK-9901', subject: 'Invoice INV-10045 discrepancy', category: 'FINANCE', priority: 'HIGH', status: 'OPEN', updated: '2 hours ago' },
  { id: 'TCK-9882', subject: 'Customs clearance delayed at LAX', category: 'CUSTOMS', priority: 'CRITICAL', status: 'IN_PROGRESS', updated: '5 hours ago' },
  { id: 'TCK-9710', subject: 'Missing POD document for BKG-55210', category: 'SHIPMENT', priority: 'MEDIUM', status: 'RESOLVED', updated: '1 day ago' },
];

export default function SupportDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support & Ticketing</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your support requests and communicate with our operations teams.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-sm flex items-center">
          <Plus size={16} className="mr-2" /> New Support Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><MessageSquare size={24} /></div>
          <div><p className="text-sm font-medium text-gray-500">Total Open Tickets</p><p className="text-2xl font-bold text-gray-900">12</p></div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-red-50 text-red-600"><AlertCircle size={24} /></div>
          <div><p className="text-sm font-medium text-gray-500">Action Required</p><p className="text-2xl font-bold text-gray-900">3</p></div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-yellow-50 text-yellow-600"><Clock size={24} /></div>
          <div><p className="text-sm font-medium text-gray-500">Average Resolution Time</p><p className="text-2xl font-bold text-gray-900">4.2h</p></div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-green-50 text-green-600"><CheckCircle size={24} /></div>
          <div><p className="text-sm font-medium text-gray-500">Resolved (This Month)</p><p className="text-2xl font-bold text-gray-900">45</p></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search tickets..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 w-72" />
          </div>
          <div className="flex space-x-2">
             <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"><option>All Status</option><option>Open</option></select>
             <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"><option>All Categories</option></select>
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="p-4">Ticket ID</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Category</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockTickets.map((t) => (
              <tr key={t.id} className="hover:bg-indigo-50/30 transition-colors">
                <td className="p-4 font-bold text-gray-900">{t.id}</td>
                <td className="p-4 font-medium text-gray-700">{t.subject}</td>
                <td className="p-4"><span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{t.category}</span></td>
                <td className="p-4">
                   <span className={`text-xs font-bold px-2 py-1 rounded-md ${t.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' : t.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                      {t.priority}
                   </span>
                </td>
                <td className="p-4 font-bold text-indigo-600">{t.status.replace('_', ' ')}</td>
                <td className="p-4 text-right text-sm text-gray-500">{t.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
