import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function VendorRFQList() {
  const [rfqs, setRfqs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/vendor-procurement/rfqs')
      .then(res => res.json())
      .then(data => setRfqs(data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Requests for Quotation (RFQ)</h1>
          <p className="text-muted-foreground">Review RFQs and submit your price quotes and lead times.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open RFQs</CardTitle>
          <CardDescription>Click 'Quote' to enter your pricing and delivery schedule.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RFQ Reference</TableHead>
                <TableHead>Items Count</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Your Quote Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfqs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">No active RFQs found.</TableCell>
                </TableRow>
              ) : (
                rfqs.map((rfq: any) => {
                  const quoteStatus = rfq.vendorQuotations && rfq.vendorQuotations.length > 0 
                                      ? rfq.vendorQuotations[0].status 
                                      : 'Not Started';
                  
                  return (
                    <TableRow key={rfq.id}>
                      <TableCell className="font-medium font-mono">{rfq.id.split('-')[0].toUpperCase()}</TableCell>
                      <TableCell>{rfq.items?.length || 0} items</TableCell>
                      <TableCell>{new Date(rfq.deadlineDate || Date.now()).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={quoteStatus === 'Not Started' ? 'secondary' : 'default'}>
                          {quoteStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <button className="text-indigo-600 hover:underline text-sm font-medium">
                          {quoteStatus === 'Not Started' ? 'Submit Quote' : 'View Negotiation'}
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
