import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function APIGateway() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/integration/gateways')
      .then(res => res.json())
      .then(data => setRoutes(data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">API Gateway</h1>
      <p className="text-muted-foreground">Manage API routes, rate limiting, and authentications for third-party consumers.</p>

      <Card>
        <CardHeader>
          <CardTitle>Registered API Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Rate Limit (Req/hr)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.version}</TableCell>
                  <TableCell>{r.rateLimit}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === 'Active' ? 'default' : 'destructive'}>
                      {r.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
