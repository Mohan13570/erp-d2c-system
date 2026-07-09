import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function VendorPOView() {
  const [pos, setPos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/vendor-procurement/purchase-orders')
      .then(res => res.json())
      .then(data => setPos(data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
          <p className="text-muted-foreground">Acknowledge, Accept, or Reject new Purchase Orders.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PO Directory</CardTitle>
          <CardDescription>All purchase orders assigned to your company.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Date Issued</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">No purchase orders found.</TableCell>
                </TableRow>
              ) : (
                pos.map((po: any) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-medium font-mono">{po.id.split('-')[0].toUpperCase()}</TableCell>
                    <TableCell>{new Date(po.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="font-bold">${po.totalAmount}</TableCell>
                    <TableCell>
                      <Badge variant={po.status === 'Accepted' ? 'default' : po.status === 'Rejected' ? 'destructive' : 'secondary'}>
                        {po.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {po.status === 'Pending' ? (
                        <div className="space-x-2">
                          <button className="text-green-600 hover:underline text-sm font-medium">Accept</button>
                          <button className="text-red-600 hover:underline text-sm font-medium">Reject</button>
                        </div>
                      ) : (
                        <button className="text-indigo-600 hover:underline text-sm font-medium">View PO</button>
                      )}
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
