import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, FileText, CheckCircle } from 'lucide-react';

export default function ApprovalInbox() {
  const { data: approvals, isLoading, refetch } = useQuery({
    queryKey: ['approvals'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/api/approvals/pending');
      return data;
    }
  });

  const handleAction = async (id: string, stepId: string, action: string) => {
    try {
      await axios.post(`http://localhost:5000/api/approvals/${id}/decide`, {
        action,
        stepId,
        comments: `${action} via Unified Inbox`
      });
      refetch();
    } catch (e) {
      alert('Failed to process approval.');
    }
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Unified Inbox</h1>
        <p className="text-muted-foreground mt-2">Manage your pending approvals and task assignments.</p>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="text-center py-12 text-slate-400">Syncing inbox...</div>
        ) : (
          approvals?.map((app: any) => (
            <Card key={app.id} className="hover:shadow-md transition-all border-l-4 border-l-amber-500">
              <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                
                <div className="p-4 bg-amber-50 rounded-full flex-shrink-0">
                  <Clock className="h-8 w-8 text-amber-600" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{app.entityType}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-400">{new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                  <CardTitle className="text-xl">Pending Approval for {app.entityType} #{app.entityId}</CardTitle>
                  <CardDescription>
                    Requires your authorization at Step {app.currentStep} of the workflow.
                  </CardDescription>
                </div>
                
                <div className="flex space-x-3 flex-shrink-0">
                  <Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50"
                          onClick={() => handleAction(app.id, app.steps[0].id, 'Rejected')}>
                    <X className="mr-2 h-4 w-4" /> Reject
                  </Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => handleAction(app.id, app.steps[0].id, 'Approved')}>
                    <Check className="mr-2 h-4 w-4" /> Approve
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
        
        {approvals?.length === 0 && (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">Inbox Zero</h3>
            <p className="text-slate-500 mt-1">You have caught up with all your approvals.</p>
          </div>
        )}
      </div>
    </div>
  );
}
