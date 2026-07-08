import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WorkflowDashboard() {
  const { data: workflows, isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/api/workflow');
      return data;
    }
  });

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Process Automation Hub</h1>
          <p className="text-muted-foreground mt-2">Monitor state-machine executions and workflow health.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Running Workflows
              <Activity className="h-4 w-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-slate-800">24</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Completed (24h)
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-emerald-600">142</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Pending Approvals
              <Clock className="h-4 w-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-amber-600">18</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-rose-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Failed Executions
              <AlertCircle className="h-4 w-4 text-rose-500" />
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-rose-600">2</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deployed Definitions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-500">Workflow Name</th>
                <th className="px-6 py-4 font-medium text-slate-500">Category</th>
                <th className="px-6 py-4 font-medium text-slate-500">Active Version</th>
                <th className="px-6 py-4 font-medium text-slate-500">Executions</th>
                <th className="px-6 py-4 font-medium text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-400">Loading configurations...</td></tr>
              ) : (
                workflows?.map((wf: any) => (
                  <tr key={wf.id} className="border-b hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium">{wf.name}</td>
                    <td className="px-6 py-4"><Badge variant="outline">{wf.category}</Badge></td>
                    <td className="px-6 py-4">v{wf.versions?.[0]?.version || 1}.0</td>
                    <td className="px-6 py-4">{wf._count?.executions || 0}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                       <Link to="/workflow/builder" className="text-indigo-600 hover:underline">Edit Canvas</Link>
                    </td>
                  </tr>
                ))
              )}
              {workflows?.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-slate-400">No workflows deployed. Go build one!</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
