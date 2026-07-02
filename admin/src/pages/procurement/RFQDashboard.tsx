import React, { useState, useEffect } from 'react';
import { Target, Plus, Search, Filter, Clock, CheckCircle2, User, Building2 } from 'lucide-react';

export default function RFQDashboard() {
  const [rfqs, setRfqs] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/rfq')
      .then(r => r.json())
      .then(data => setRfqs(data))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Target className="mr-3 text-indigo-600" size={32} />
            Sourcing & RFQ Control
          </h1>
          <p className="text-gray-500 mt-1">Manage Requests for Quotation, competitive bidding, and awards</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition">
          <Plus className="w-4 h-4 mr-2" /> Create RFQ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2 flex-shrink-0">
         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center">
               <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mr-4"><Clock size={24} /></div>
               <div><p className="text-sm text-gray-500">Open Bids</p><p className="text-2xl font-bold">14</p></div>
            </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center">
               <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mr-4"><CheckCircle2 size={24} /></div>
               <div><p className="text-sm text-gray-500">Awarded (MTD)</p><p className="text-2xl font-bold">42</p></div>
            </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center">
               <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mr-4"><Building2 size={24} /></div>
               <div><p className="text-sm text-gray-500">Active Participants</p><p className="text-2xl font-bold">89</p></div>
            </div>
         </div>
      </div>

      <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search RFQ by ID, Title or Department..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl" />
          </div>
        </div>
        <div className="overflow-auto flex-1 p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">RFQ ID & Title</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Items</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Vendors Invited</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Responses</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Deadline</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {rfqs.length === 0 ? (
                 <tr><td colSpan={6} className="text-center py-8 text-gray-500">No active RFQs.</td></tr>
               ) : rfqs.map((rfq: any) => (
                 <tr key={rfq.id} className="hover:bg-indigo-50/30 cursor-pointer">
                   <td className="px-6 py-4">
                     <p className="font-bold text-gray-900">{rfq.rfqNumber}</p>
                     <p className="text-sm text-gray-500">{rfq.title}</p>
                   </td>
                   <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                     {rfq.items?.length || 0} Line Items
                   </td>
                   <td className="px-6 py-4">
                     <div className="flex -space-x-2">
                       {rfq.vendors?.slice(0,3).map((v:any, i:number) => (
                         <div key={i} className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-700" title={v.vendor?.name}>
                           {v.vendor?.name?.charAt(0)}
                         </div>
                       ))}
                       {rfq.vendors?.length > 3 && (
                         <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                           +{rfq.vendors.length - 3}
                         </div>
                       )}
                     </div>
                   </td>
                   <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                         {rfq._count?.responses || 0} Received
                      </span>
                   </td>
                   <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                     {new Date(rfq.deadline).toLocaleDateString()}
                   </td>
                   <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        rfq.status === 'Open' ? 'bg-amber-100 text-amber-800' :
                        rfq.status === 'Awarded' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {rfq.status}
                      </span>
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