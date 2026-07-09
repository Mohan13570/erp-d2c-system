import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, FileCheck2, UserPlus, FileWarning } from "lucide-react";

export default function VendorList() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/vendor-portal')
      .then(res => res.json())
      .then(data => setVendors(data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Management</h1>
          <p className="text-muted-foreground">Approve, monitor, and manage enterprise supplier relationships.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <FileCheck2 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {vendors.filter(v => v.status === 'Pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Invitations</CardTitle>
            <UserPlus className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring KYC</CardTitle>
            <FileWarning className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">3</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enterprise Vendors Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Compliance Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">No vendors registered yet.</TableCell>
                </TableRow>
              ) : (
                vendors.map((vendor: any) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>
                      <Badge variant={vendor.compliance?.kycStatus === 'Verified' ? 'default' : 'secondary'}>
                        {vendor.compliance?.kycStatus || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {vendor.compliance?.complianceScore ? (
                        <div className="w-full bg-secondary h-2 rounded-full mt-2">
                          <div 
                            className={`h-2 rounded-full ${vendor.compliance.complianceScore > 80 ? 'bg-green-500' : 'bg-orange-500'}`} 
                            style={{ width: `${vendor.compliance.complianceScore}%` }}
                          />
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">Awaiting assessment</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={vendor.status === 'Active' ? 'default' : 'destructive'}>
                        {vendor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button className="text-indigo-600 hover:underline text-sm font-medium">View Profile</button>
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
