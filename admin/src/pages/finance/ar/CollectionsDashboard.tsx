import React, { useState, useEffect } from 'react';
import { Phone, Mail, Calendar, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CollectionsDashboard() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/erp/ar/collections')
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/finance/ar" className="text-indigo-600 text-sm font-medium hover:underline mb-2 inline-block">&larr; Back to AR</Link>
          <h1 className="text-2xl font-bold text-gray-900">Collections Engine</h1>
          <p className="text-sm text-gray-500 mt-1">Track collector follow-ups and promises to pay for overdue accounts.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                     <th className="px-6 py-4">Customer ID</th>
                     <th className="px-6 py-4">Activity Date</th>
                     <th className="px-6 py-4">Type</th>
                     <th className="px-6 py-4">Notes</th>
                     <th className="px-6 py-4">Promise Date</th>
                     <th className="px-6 py-4">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 text-gray-900">
                  {activities.length > 0 ? activities.map((a: any) => (
                     <tr key={a.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold">{a.profile?.customerId || a.profileId}</td>
                        <td className="px-6 py-4 text-gray-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                           {a.activityType === 'CALL' ? <span className="flex items-center text-sky-600"><Phone size={14} className="mr-1"/> CALL</span> : 
                            a.activityType === 'EMAIL' ? <span className="flex items-center text-amber-600"><Mail size={14} className="mr-1"/> EMAIL</span> : 
                            <span className="flex items-center text-indigo-600">{a.activityType}</span>}
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate text-gray-600">{a.notes}</td>
                        <td className="px-6 py-4 text-emerald-600 font-bold">
                           {a.promiseToPayDate ? <span className="flex items-center"><Calendar size={14} className="mr-1"/> {new Date(a.promiseToPayDate).toLocaleDateString()}</span> : '-'}
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${
                              a.status === 'OPEN' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                           }`}>
                              {a.status}
                           </span>
                        </td>
                     </tr>
                  )) : (
                     <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                           <CheckCircle size={32} className="mx-auto mb-3 opacity-30 text-emerald-400" />
                           No pending collections tasks!
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
