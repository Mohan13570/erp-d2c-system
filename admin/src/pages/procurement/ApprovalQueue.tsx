import React, { useState, useEffect } from 'react';
import { CheckCircle, Search, Clock, FileText, Check, X } from 'lucide-react';

export default function ApprovalQueue() {
  const [queue, setQueue] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/approvals')
      .then(r => r.json())
      .then(data => setQueue(data))
      .catch(e => console.error(e));
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    await fetch(`http://localhost:5000/api/procurement/approvals/${id}/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comments: `${action} by UI` })
    });
    // Optimistic UI update
    setQueue(queue.map((q:any) => q.id === id ? { ...q, status: action === 'approve' ? 'Approved' : 'Rejected' } : q));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <CheckCircle className="mr-3 text-indigo-600" size={32} />
            Multi-Level Approval Queue
          </h1>
          <p className="text-gray-500 mt-1">Review pending RFQ awards, Requisitions, and Contracts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {queue.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl">
            <CheckCircle size={48} className="mx-auto text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">All Caught Up!</h3>
            <p className="text-gray-500 mt-2">There are no pending approvals in your queue.</p>
          </div>
        ) : queue.map((q: any) => (
          <div key={q.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition">
            <div className="flex items-center space-x-6">
              <div className={`p-4 rounded-xl flex-shrink-0 ${
                q.entityType.includes('RFQ') ? 'bg-indigo-50 text-indigo-600' :
                q.entityType.includes('Contract') ? 'bg-emerald-50 text-emerald-600' :
                'bg-amber-50 text-amber-600'
              }`}>
                <FileText size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{q.entityType}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    q.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                    q.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>{q.status}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-1">Reference: {q.entityId}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-2 gap-4">
                  <span className="flex items-center"><UserIcon size={14} className="mr-1" /> Req. By: {q.requestedBy}</span>
                  <span className="flex items-center"><Clock size={14} className="mr-1" /> {new Date(q.requestDate).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {q.status === 'Pending' && (
              <div className="flex gap-3">
                <button 
                  onClick={() => handleAction(q.id, 'reject')}
                  className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg font-medium flex items-center hover:bg-rose-100 transition">
                  <X size={18} className="mr-1" /> Reject
                </button>
                <button 
                  onClick={() => handleAction(q.id, 'approve')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium flex items-center hover:bg-emerald-700 transition shadow-sm shadow-emerald-200">
                  <Check size={18} className="mr-1" /> Approve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function UserIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}