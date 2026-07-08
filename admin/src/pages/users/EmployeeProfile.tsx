import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Briefcase, Mail, Phone, MapPin, Building2, UserCircle2, ShieldAlert } from 'lucide-react';

export default function EmployeeProfile() {
  const { id } = useParams();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/employees/${id}`);
      return data;
    },
    enabled: !!id
  });

  if (isLoading) return <div className="p-8 text-center">Loading Enterprise Profile...</div>;
  if (!profile) return <div className="p-8 text-center text-red-500">Profile Not Found</div>;

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      
      {/* Header Card */}
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
          <div className="absolute -bottom-12 left-8 h-24 w-24 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
             {profile.profilePhoto ? (
               <img src={profile.profilePhoto} alt="Profile" className="object-cover h-full w-full" />
             ) : (
               <UserCircle2 className="h-16 w-16 text-slate-400" />
             )}
          </div>
        </div>
        <CardContent className="pt-16 pb-6 px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{profile.firstName} {profile.lastName}</h1>
              <div className="flex space-x-4 mt-2 text-sm text-slate-500">
                <span className="flex items-center"><Briefcase className="h-4 w-4 mr-1" /> {profile.employeeCode}</span>
                <span className="flex items-center"><Mail className="h-4 w-4 mr-1" /> {profile.officialEmail}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                {profile.verificationStatus}
              </Badge>
              <Badge variant="default" className="bg-indigo-600">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Layout */}
      <Tabs defaultValue="employment" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger value="employment" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-6 py-3">Employment Info</TabsTrigger>
          <TabsTrigger value="personal" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-6 py-3">Personal Details</TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-6 py-3">Documents & Compliance</TabsTrigger>
          <TabsTrigger value="devices" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-6 py-3">IT Assets</TabsTrigger>
        </TabsList>

        <div className="py-6">
          <TabsContent value="employment" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center"><Building2 className="h-5 w-5 mr-2 text-indigo-500" /> Professional Assignment</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-x-12 gap-y-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Company Entity</p>
                  <p className="font-medium">{profile.employmentInfo?.companyId || 'Not Assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Branch / Location</p>
                  <p className="font-medium">{profile.employmentInfo?.branchId || 'Not Assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Employment Type</p>
                  <p className="font-medium">{profile.employmentInfo?.employmentType}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Work Mode</p>
                  <Badge variant="outline">{profile.employmentInfo?.workMode}</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-0 space-y-4">
            {profile.documents?.map((doc: any) => (
              <Card key={doc.id} className="flex justify-between items-center p-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <ShieldAlert className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{doc.documentType}</h4>
                    <p className="text-sm text-slate-500">ID: {doc.documentNumber}</p>
                  </div>
                </div>
                <Badge variant={doc.status === 'Active' ? 'default' : 'destructive'}>{doc.status}</Badge>
              </Card>
            ))}
            {(!profile.documents || profile.documents.length === 0) && (
              <div className="text-center py-12 text-slate-400">No documents uploaded.</div>
            )}
          </TabsContent>
          
          <TabsContent value="personal" className="mt-0">
             <div className="text-slate-400 p-8 text-center border rounded-lg">Personal Details Form rendering goes here...</div>
          </TabsContent>
          
          <TabsContent value="devices" className="mt-0">
             <div className="text-slate-400 p-8 text-center border rounded-lg">Allocated IT Assets and Login Sessions...</div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
