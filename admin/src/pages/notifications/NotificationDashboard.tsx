import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, AlertTriangle, Clock, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['notification-dashboard'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5000/api/notifications/dashboard');
      return res.data;
    }
  });

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communication Engine Hub</h1>
          <p className="text-muted-foreground mt-2">Monitor omni-channel deliveries across Email, SMS, WhatsApp, and Web Push.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="border-l-4 border-l-indigo-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Successful Dispatches
              <Send className="h-4 w-4 text-indigo-500" />
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-slate-800">{isLoading ? '...' : data?.metrics?.sentCount || 0}</div></CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-rose-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Failed Deliveries
              <AlertTriangle className="h-4 w-4 text-rose-500" />
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-rose-600">{isLoading ? '...' : data?.metrics?.failedCount || 0}</div></CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Queued (BullMQ)
              <Clock className="h-4 w-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-amber-600">{isLoading ? '...' : data?.metrics?.queuedCount || 0}</div></CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Global Success Rate
              <Mail className="h-4 w-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-emerald-600">{isLoading ? '...' : (data?.metrics?.successRate || 0).toFixed(1)}%</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Delivery Logs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y text-sm">
              {isLoading ? <div className="p-4 text-slate-500">Loading logs...</div> : data?.recentLogs?.map((log: any) => (
                <li key={log.id} className="p-4 hover:bg-slate-50 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{log.notification?.title || 'System Alert'}</p>
                    <p className="text-xs text-slate-500">Channel: {log.channel}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${log.status === 'Delivered' ? 'text-emerald-600' : 'text-rose-600'}`}>{log.status}</p>
                    <p className="text-xs text-slate-400">{new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/notifications/templates" className="block p-4 border rounded-lg hover:shadow-sm hover:border-indigo-300 transition-all bg-indigo-50/30">
              <h3 className="font-bold text-indigo-700">Template Builder</h3>
              <p className="text-sm text-slate-500">Design HTML Emails, SMS, and WhatsApp parameterized templates.</p>
            </Link>
            <Link to="/notifications/announcements" className="block p-4 border rounded-lg hover:shadow-sm hover:border-amber-300 transition-all bg-amber-50/30">
              <h3 className="font-bold text-amber-700">Global Announcements</h3>
              <p className="text-sm text-slate-500">Broadcast company-wide or department-specific emergency alerts.</p>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
