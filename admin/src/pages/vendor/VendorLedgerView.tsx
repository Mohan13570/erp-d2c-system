import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function VendorLedgerView() {
  const [ledger, setLedger] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/vendor-finance/ledger')
      .then(res => res.json())
      .then(data => setLedger(data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Statement</h1>
          <p className="text-muted-foreground">View your running balance, invoices, and payments ledger.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ledger Entries</CardTitle>
          <CardDescription>Chronological transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Debit (-)</TableHead>
                <TableHead className="text-right">Credit (+)</TableHead>
                <TableHead className="text-right">Running Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledger.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">No ledger entries found.</TableCell>
                </TableRow>
              ) : (
                ledger.map((entry: any) => (
                  <TableRow key={entry.id}>
                    <TableCell>{new Date(entry.transactionDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`flex items-center gap-1 ${entry.type === 'Invoice' ? 'text-orange-600' : 'text-green-600'}`}>
                        {entry.type === 'Invoice' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {entry.type}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-sm">{entry.description}</TableCell>
                    <TableCell className="text-right text-green-600">
                      {entry.debitAmount > 0 ? `$${entry.debitAmount.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell className="text-right text-orange-600">
                      {entry.creditAmount > 0 ? `$${entry.creditAmount.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      ${entry.balanceAmount.toFixed(2)}
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
