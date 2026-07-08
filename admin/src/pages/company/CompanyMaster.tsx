import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, MapPin, Users, Activity } from 'lucide-react';
import axios from 'axios';

interface Company {
  id: string;
  companyCode: string;
  name: string;
  legalName?: string;
  status: string;
  branches: any[];
  businessUnits: any[];
}

const fetchCompanies = async (): Promise<Company[]> => {
  const { data } = await axios.get('http://localhost:5000/api/company');
  return data;
};

export default function CompanyMaster() {
  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies
  });

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enterprise Company Master</h1>
          <p className="text-muted-foreground mt-2">Manage global corporate entities, subsidiaries, and legal holding structures.</p>
        </div>
        <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Register Legal Entity
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-3 text-center py-12 text-muted-foreground">Loading Corporate Master Data...</div>
        ) : (
          companies?.map(company => (
            <Card key={company.id} className="hover:shadow-md transition-all duration-200 border-indigo-100 dark:border-indigo-900/50">
              <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-slate-900/20">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                      <Building2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <p className="text-sm font-medium text-slate-500">{company.companyCode}</p>
                    </div>
                  </div>
                  <Badge variant={company.status === 'Active' ? 'default' : 'secondary'} className={company.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' : ''}>
                    {company.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground flex items-center gap-2"><MapPin className="h-3 w-3" /> Branches</span>
                    <span className="font-medium">{company.branches?.length || 0} Facilities</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground flex items-center gap-2"><Activity className="h-3 w-3" /> Business Units</span>
                    <span className="font-medium">{company.businessUnits?.length || 0} Units</span>
                  </div>
                </div>
                <div className="pt-4 border-t flex justify-end gap-2">
                  <Button variant="outline" size="sm">Structure</Button>
                  <Button variant="default" size="sm">Manage Profile</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        
        {/* Placeholder if none exist */}
        {!isLoading && (!companies || companies.length === 0) && (
          <div className="col-span-3 text-center py-12 border-2 border-dashed rounded-lg border-slate-200">
            <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No Companies Registered</h3>
            <p className="text-slate-500">Initialize your ERP by registering the root holding company.</p>
          </div>
        )}
      </div>
    </div>
  );
}
