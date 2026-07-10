import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ShieldCheck, Mail, MapPin, CheckCircle, ArrowLeft } from 'lucide-react';

export default function CustomerProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/customer-portal/${id}`)
      .then(res => res.json())
      .then(data => setCustomer(data))
      .catch(console.error);
  }, [id]);

  const handleApprove = async () => {
    try {
      await fetch(`http://localhost:5000/api/customer-portal/${id}/approve`, { method: 'PUT' });
      setCustomer((prev: any) => ({ ...prev, status: 'Active', compliance: { ...prev.compliance, complianceScore: 100 } }));
    } catch (e) {
      console.error(e);
    }
  };

  if (!customer) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Profile...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{customer.legalName}</h1>
            <Badge variant={customer.status === 'Active' ? 'default' : 'secondary'}>{customer.status}</Badge>
          </div>
          <p className="text-muted-foreground font-mono mt-1">{customer.customerCode}</p>
        </div>
        
        {customer.status === 'Pending Approval' && (
          <div className="ml-auto">
            <button onClick={handleApprove} className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700 shadow">
              <CheckCircle className="w-4 h-4" /> Approve Registration
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5" /> Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500 block">Trade Name</span><span className="font-medium">{customer.tradeName || 'N/A'}</span></div>
              <div><span className="text-gray-500 block">Company Type</span><span className="font-medium">{customer.profile?.companyType || 'N/A'}</span></div>
              <div><span className="text-gray-500 block">GST Number</span><span className="font-medium font-mono">{customer.profile?.gstNumber || 'N/A'}</span></div>
              <div><span className="text-gray-500 block">PAN Number</span><span className="font-medium font-mono">{customer.profile?.panNumber || 'N/A'}</span></div>
              <div className="col-span-2"><span className="text-gray-500 block">Business Description</span><span className="font-medium">{customer.profile?.businessDesc || 'N/A'}</span></div>
            </div>

            <div className="pt-6 border-t">
              <h3 className="font-semibold text-base mb-4 flex items-center gap-2"><MapPin className="w-4 h-4" /> Registered Address</h3>
              {customer.addresses?.[0] ? (
                <div className="text-sm">
                  <p>{customer.addresses[0].addressLine1}</p>
                  <p>{customer.addresses[0].city}, {customer.addresses[0].state}</p>
                  <p>{customer.addresses[0].country} - {customer.addresses[0].zipCode}</p>
                </div>
              ) : <p className="text-sm text-gray-500">No address provided.</p>}
            </div>
            
            <div className="pt-6 border-t">
              <h3 className="font-semibold text-base mb-4 flex items-center gap-2"><Mail className="w-4 h-4" /> Primary Contact</h3>
              {customer.contacts?.[0] ? (
                <div className="text-sm">
                  <p className="font-medium">{customer.contacts[0].firstName} {customer.contacts[0].lastName}</p>
                  <p className="text-gray-600">{customer.contacts[0].email} | {customer.contacts[0].phone}</p>
                </div>
              ) : <p className="text-sm text-gray-500">No contact provided.</p>}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="flex items-center gap-2 text-lg"><ShieldCheck className="w-5 h-5 text-indigo-600" /> Compliance Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-5xl font-black text-indigo-600 mb-2">{customer.compliance?.complianceScore || 0}%</div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Trust Score</p>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Risk Level</span>
                  <span className={`font-semibold ${customer.compliance?.riskLevel === 'Low' ? 'text-green-600' : 'text-orange-500'}`}>{customer.compliance?.riskLevel || 'Unknown'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">KYC Status</span>
                  <span className="font-semibold">{customer.kyc?.kycStatus || 'Pending'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md border font-medium">Resend Invitation Email</button>
              <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md border font-medium">Request Document Update</button>
              <button className="w-full text-left px-3 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-md border border-red-200 font-medium">Suspend Account</button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
