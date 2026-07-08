import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ShieldAlert, Lock, Fingerprint, Activity, Clock } from 'lucide-react';

export default function SecurityDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['security-dashboard'],
    queryFn: async () => {
      const res = await axios.get('/api/security/dashboard');
      return res.data;
    }
  });

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto bg-slate-50/50 dark:bg-slate-900/10 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security & Audit Control Center</h1>
          <p className="text-muted-foreground mt-2">Monitor enterprise authentication, MFA compliance, and threat vectors.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-indigo-200">Export Audit Log</Button>
          <Button className="bg-rose-600 hover:bg-rose-700 text-white">
            <Lock className="mr-2 h-4 w-4" /> Global Lockdown
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Active Sessions
              <Activity className="h-4 w-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {isLoading ? '...' : data?.metrics?.activeSessions || 0}
            </div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center">Live WebSocket tracking</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              MFA Compliant
              <Fingerprint className="h-4 w-4 text-indigo-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {isLoading ? '...' : data?.metrics?.mfaEnabledUsers || 0}
            </div>
            <p className="text-xs text-indigo-600 mt-1">Users protected via 2FA</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-all bg-amber-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Failed Logins (24h)
              <ShieldAlert className="h-4 w-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700 dark:text-amber-500">
              {isLoading ? '...' : data?.metrics?.failedLogins24h || 0}
            </div>
            <p className="text-xs text-amber-600 mt-1 font-medium">Potential brute-force attempts</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500 shadow-sm hover:shadow-md transition-all bg-rose-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Locked Accounts
              <Lock className="h-4 w-4 text-rose-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-700 dark:text-rose-500">
              {isLoading ? '...' : data?.metrics?.lockedUsers || 0}
            </div>
            <p className="text-xs text-rose-600 mt-1 font-medium">Requires Admin override</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b">
            <CardTitle className="flex items-center text-lg"><ShieldAlert className="mr-2 h-5 w-5 text-amber-500" /> Recent Security Alerts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             {isLoading ? <div className="p-8 text-center text-slate-400">Scanning logs...</div> : (
               data?.recentAlerts?.length > 0 ? (
                 <ul className="divide-y">
                   {data.recentAlerts.map((alert: any) => (
                     <li key={alert.id} className="p-4 hover:bg-slate-50">
                       <div className="flex justify-between">
                         <span className="font-semibold">{alert.eventType}</span>
                         <span className="text-xs text-slate-500">{new Date(alert.createdAt).toLocaleString()}</span>
                       </div>
                       <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
                     </li>
                   ))}
                 </ul>
               ) : (
                 <div className="p-8 flex flex-col items-center justify-center text-slate-400">
                   <Shield className="h-12 w-12 text-emerald-100 mb-3" />
                   <p>No active security threats detected.</p>
                 </div>
               )
             )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b">
            <CardTitle className="flex items-center text-lg"><Clock className="mr-2 h-5 w-5 text-indigo-500" /> Global Security Policy</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-sm">
             <div className="flex justify-between py-2 border-b">
               <span className="text-slate-500">Password Expiry</span>
               <span className="font-medium text-slate-900">90 Days</span>
             </div>
             <div className="flex justify-between py-2 border-b">
               <span className="text-slate-500">Max Failed Logins (Lockout)</span>
               <span className="font-medium text-rose-600">5 Attempts</span>
             </div>
             <div className="flex justify-between py-2 border-b">
               <span className="text-slate-500">Minimum Password Length</span>
               <span className="font-medium text-slate-900">12 Characters</span>
             </div>
             <div className="flex justify-between py-2 border-b">
               <span className="text-slate-500">MFA Requirement</span>
               <span className="font-medium text-indigo-600">Mandatory (C-Level & IT)</span>
             </div>
             <div className="flex justify-between py-2 border-b">
               <span className="text-slate-500">Concurrent Sessions Allowed</span>
               <span className="font-medium text-slate-900">3 per User</span>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
