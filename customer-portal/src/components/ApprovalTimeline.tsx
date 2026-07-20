import React, { useState } from 'react';
import { GitCommit, CheckCircle2, XCircle, AlertCircle, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const api = axios.create({ baseURL: 'http://localhost:5000/api/v1' });

interface ApprovalTimelineProps {
  bookingId: string;
  approvalData: any;
}

export default function ApprovalTimeline({ bookingId, approvalData }: ApprovalTimelineProps) {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  
  const approveMutation = useMutation({
    mutationFn: () => api.post(`/bookings/${bookingId}/approve`, { comment }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['booking', bookingId] })
  });

  const rejectMutation = useMutation({
    mutationFn: () => api.post(`/bookings/${bookingId}/reject`, { comment }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['booking', bookingId] })
  });

  if (!approvalData) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 p-6 rounded-2xl text-center">
        <p className="text-slate-500 text-sm">Approval Workflow not initialized.</p>
      </div>
    );
  }

  const isComplete = approvalData.status === 'Approved' || approvalData.status === 'Rejected';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Approval Workflow</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          approvalData.status === 'Approved' ? 'bg-green-100 text-green-700' :
          approvalData.status === 'Rejected' ? 'bg-red-100 text-red-700' :
          'bg-amber-100 text-amber-700'
        }`}>
          {approvalData.stage}
        </span>
      </div>

      {/* History Timeline */}
      <div className="relative pl-4 border-l border-slate-200 dark:border-slate-800 space-y-6 mb-8">
        {approvalData.history?.map((hist: any, i: number) => (
          <div key={i} className="relative">
            <span className="absolute -left-[25px] bg-white dark:bg-slate-900 p-1">
              {hist.action === 'Approved' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> :
               hist.action === 'Rejected' ? <XCircle className="w-4 h-4 text-red-500" /> :
               <GitCommit className="w-4 h-4 text-slate-400" />}
            </span>
            <div className="ml-2">
              <p className="text-sm font-medium">{hist.action} <span className="text-slate-500 font-normal">at {hist.stage}</span></p>
              <p className="text-xs text-slate-400">{new Date(hist.createdAt).toLocaleString()} by {hist.performedBy}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Area */}
      {!isComplete && (
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-medium text-slate-500 mb-2">Required Comment</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter approval/rejection reason..." 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:bg-slate-900" 
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button 
              onClick={() => approveMutation.mutate()}
              disabled={approveMutation.isPending || rejectMutation.isPending || !comment}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {approveMutation.isPending ? 'Processing...' : 'Approve'}
            </button>
            <button 
              onClick={() => rejectMutation.mutate()}
              disabled={approveMutation.isPending || rejectMutation.isPending || !comment}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {isComplete && (
        <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 flex gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>Workflow has concluded. Further modifications require a manual override or a new booking draft.</p>
        </div>
      )}
    </div>
  );
}
