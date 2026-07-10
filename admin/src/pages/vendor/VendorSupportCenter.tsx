import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from 'lucide-react';

export default function VendorSupportCenter() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/vendor-support/tickets')
      .then(res => res.json())
      .then(data => setTickets(data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support & Help Desk</h1>
          <p className="text-muted-foreground">Raise and track issues regarding Finance, Logistics, or Procurement.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> New Ticket
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Support Tickets</CardTitle>
          <CardDescription>All active and resolved queries.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No support tickets found.</TableCell>
                </TableRow>
              ) : (
                tickets.map((t: any) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono font-medium">{t.ticketNumber}</TableCell>
                    <TableCell className="font-semibold">{t.subject}</TableCell>
                    <TableCell>{t.category}</TableCell>
                    <TableCell>
                      <Badge variant={t.priority === 'Critical' ? 'destructive' : 'secondary'}>{t.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={t.status === 'Resolved' ? 'default' : 'outline'}>{t.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(t.createdAt).toLocaleDateString()}</TableCell>
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
