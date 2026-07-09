import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { Search } from 'lucide-react';

interface Log {
  id: string;
  timestamp: string;
  level: string;
  service: string;
  message: string;
}

export default function LogsViewer() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/logs/system')
      .then(res => {
        setLogs(res.data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'INFO': return 'bg-blue-100 text-blue-800';
      case 'WARN': return 'bg-amber-100 text-amber-800';
      case 'ERROR': return 'bg-rose-100 text-rose-800';
      case 'FATAL': return 'bg-rose-600 text-white';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground mt-1">Centralized logging and audit trails</p>
        </div>
      </div>

      <Card>
        <CardHeader className="py-4 border-b bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              placeholder="Search logs via ElasticSearch index..." 
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-slate-500">Loading logs...</TableCell></TableRow>
              ) : (
                logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs whitespace-nowrap text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-bold tracking-wider ${getLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-slate-700">
                      {log.service}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {log.message}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
