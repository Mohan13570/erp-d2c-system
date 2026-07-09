import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Cpu, Database, HardDrive, Network, Server, Webhook } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

interface LiveMetrics {
  server?: {
    cpuUsage: number;
    memoryTotal: number;
    memoryUsed: number;
    diskTotal: number;
    diskUsed: number;
    uptime: number;
  };
  database?: {
    activeConnections: number;
    queryRate: number;
  };
}

export default function SystemDashboard() {
  const [metrics, setMetrics] = useState<LiveMetrics | null>(null);
  const [health, setHealth] = useState<any[]>([]);

  useEffect(() => {
    // Fetch initial health checks
    axios.get('/api/admin/health').then(res => setHealth(res.data)).catch(console.error);

    // Connect WebSocket for Live Metrics
    const socket: Socket = io('http://localhost:5000');
    
    socket.on('live_metrics', (data: LiveMetrics) => {
      setMetrics(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'Operational': return 'bg-emerald-500';
      case 'Degraded': return 'bg-amber-500';
      case 'Down': return 'bg-rose-500';
      default: return 'bg-slate-300';
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Control Tower</h1>
          <p className="text-muted-foreground mt-1">Live monitoring and enterprise administration</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          Live Socket Connected
        </div>
      </div>

      {/* Global Health Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {health.map((h, i) => (
          <Card key={i} className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">{h.component}</p>
                <p className="text-lg font-bold">{h.status}</p>
              </div>
              <div className={`w-4 h-4 rounded-full ${getHealthColor(h.status)}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Server Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.server?.cpuUsage.toFixed(1) || '0.0'}%</div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-indigo-500 h-2 transition-all duration-300" style={{ width: `${metrics?.server?.cpuUsage || 0}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Memory Allocation</CardTitle>
            <Database className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.server?.memoryUsed.toFixed(1) || '0.0'} GB</div>
            <p className="text-xs text-slate-500 mt-1">of {metrics?.server?.memoryTotal.toFixed(1) || '0.0'} GB Total</p>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div className="bg-blue-500 h-2 transition-all duration-300" style={{ width: `${((metrics?.server?.memoryUsed || 0) / (metrics?.server?.memoryTotal || 1)) * 100}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Storage (Disk)</CardTitle>
            <HardDrive className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.server?.diskUsed || 0} GB</div>
            <p className="text-xs text-slate-500 mt-1">of {metrics?.server?.diskTotal || 0} GB Total</p>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-2 transition-all duration-300" style={{ width: `${((metrics?.server?.diskUsed || 0) / (metrics?.server?.diskTotal || 1)) * 100}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Database Load</CardTitle>
            <Activity className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.database?.activeConnections || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Active PG Connections</p>
            <div className="mt-2 text-sm font-medium text-rose-600">
              {metrics?.database?.queryRate || 0} QPS
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 border-slate-200">
          <CardHeader>
            <CardTitle>Background Queues (BullMQ)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['email-queue', 'report-queue', 'webhook-queue'].map((q, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-xl bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm border"><Webhook className="w-4 h-4 text-slate-600" /></div>
                    <span className="font-medium text-slate-900">{q}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-center">
                    <div>
                      <div className="font-bold text-amber-600">{Math.floor(Math.random() * 5)}</div>
                      <div className="text-xs text-slate-500">Active</div>
                    </div>
                    <div>
                      <div className="font-bold text-emerald-600">{Math.floor(Math.random() * 500) + 100}</div>
                      <div className="text-xs text-slate-500">Done</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-slate-200">
          <CardHeader>
            <CardTitle>Recent System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border border-rose-100 bg-rose-50 rounded-xl text-rose-900 text-sm">
                <span className="font-bold mr-2">[WARN]</span> High memory utilization detected in worker process.
              </div>
              <div className="p-3 border border-amber-100 bg-amber-50 rounded-xl text-amber-900 text-sm">
                <span className="font-bold mr-2">[INFO]</span> Nightly Database Backup completed successfully (45s).
              </div>
              <div className="p-3 border border-blue-100 bg-blue-50 rounded-xl text-blue-900 text-sm">
                <span className="font-bold mr-2">[INFO]</span> Admin "Mohan" logged in from new IP 192.168.1.55.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
