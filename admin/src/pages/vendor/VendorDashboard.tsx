import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, FileCheck, Inbox, AlertTriangle, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function VendorDashboard() {
  // Mocked state for the external vendor view
  const complianceScore = 85;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Portal</h1>
          <p className="text-muted-foreground">Welcome back, Acme Corp Ltd. Here is your supplier overview.</p>
        </div>
        <Badge variant="default" className="text-sm px-4 py-1 bg-green-600">Active Supplier</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{complianceScore}%</div>
            <p className="text-xs text-muted-foreground">Tier 1 Supplier Rating</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Purchase Orders</CardTitle>
            <Inbox className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">3 pending fulfillment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Documents</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">GST, PAN, Trade License</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Required</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">1</div>
            <p className="text-xs text-muted-foreground">Insurance expires in 14 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-3 bg-slate-50 rounded-lg">
                <FileCheck className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold">KYC Verification Successful</h4>
                  <p className="text-xs text-muted-foreground">Your recent PAN upload was approved by administration.</p>
                  <span className="text-xs text-muted-foreground mt-1 block">2 hours ago</span>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold">Insurance Certificate Expiring</h4>
                  <p className="text-xs text-muted-foreground">Please upload a renewed general liability insurance certificate.</p>
                  <span className="text-xs text-muted-foreground mt-1 block">1 day ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border rounded-lg text-center hover:bg-slate-50 transition-colors">
                <Inbox className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
                <span className="text-sm font-medium">View Purchase Orders</span>
              </button>
              <button className="p-4 border rounded-lg text-center hover:bg-slate-50 transition-colors">
                <FileCheck className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
                <span className="text-sm font-medium">Update Documents</span>
              </button>
              <button className="p-4 border rounded-lg text-center hover:bg-slate-50 transition-colors">
                <Building2 className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
                <span className="text-sm font-medium">Company Profile</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
