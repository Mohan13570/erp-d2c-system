import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FilePlus } from 'lucide-react';

export default function VendorInvoiceList() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/vendor-finance/invoices')
      .then(res => res.json())
      .then(data => setInvoices(data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">View and submit invoices against your Purchase Orders.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2">
          <FilePlus className="w-4 h-4" /> Create Invoice
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Directory</CardTitle>
          <CardDescription>History of all submitted billing documents.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Linked PO</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Tax Amount</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">No invoices found.</TableCell>
                </TableRow>
              ) : (
                invoices.map((inv: any) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium font-mono">{inv.invoiceNumber}</TableCell>
                    <TableCell className="text-muted-foreground">{inv.purchaseOrder?.id.split('-')[0].toUpperCase() || 'N/A'}</TableCell>
                    <TableCell className="font-semibold">${inv.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-muted-foreground">${inv.taxAmount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(inv.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={inv.status === 'Paid' ? 'default' : inv.status === 'Overdue' ? 'destructive' : 'secondary'}>
                        {inv.status}
                      </Badge>
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
