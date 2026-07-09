import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, Truck } from 'lucide-react';

export default function VendorASNList() {
  const [asns, setAsns] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/vendor-logistics/asns')
      .then(res => res.json())
      .then(data => setAsns(data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advance Shipment Notices</h1>
          <p className="text-muted-foreground">Manage and track your dispatched deliveries to the warehouse.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2">
          <Truck className="w-4 h-4" /> Create New ASN
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ASN Directory</CardTitle>
          <CardDescription>All active and past shipment notices.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ASN Number</TableHead>
                <TableHead>Purchase Order</TableHead>
                <TableHead>Expected Arrival</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">No ASNs found.</TableCell>
                </TableRow>
              ) : (
                asns.map((asn: any) => (
                  <TableRow key={asn.id}>
                    <TableCell className="font-medium font-mono">{asn.asnNumber}</TableCell>
                    <TableCell className="text-muted-foreground">{asn.purchaseOrder?.id.split('-')[0].toUpperCase()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {new Date(asn.expectedArrival).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{asn.carrier || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={asn.status === 'Completed' ? 'default' : asn.status === 'Pending' ? 'secondary' : 'outline'}>
                        {asn.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button className="text-indigo-600 hover:underline text-sm font-medium">View Tracking</button>
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
