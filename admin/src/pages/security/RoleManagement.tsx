import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KeyRound, Plus, ShieldCheck } from 'lucide-react';

export default function RoleManagement() {
  const { data: roles, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await axios.get('/api/rbac/roles');
      return res.data;
    }
  });

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto min-h-full bg-white dark:bg-slate-950">
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role-Based Access Control (RBAC)</h1>
          <p className="text-muted-foreground mt-2">Manage enterprise roles, map permissions, and define segregation of duties.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Create New Role
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {isLoading ? (
          <div className="col-span-3 text-center py-12 text-slate-400">Loading Roles...</div>
        ) : (
          roles?.map((role: any) => (
            <Card key={role.id} className="hover:shadow-md transition-all border-slate-200">
              <CardHeader className="pb-3 bg-slate-50 border-b">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <ShieldCheck className="h-5 w-5 text-indigo-600" />
                    </div>
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                  </div>
                  {role.isSystem && <Badge variant="secondary" className="bg-amber-100 text-amber-700">System Role</Badge>}
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <p className="text-sm text-slate-500 min-h-[40px]">{role.description || 'No description provided.'}</p>
                <div className="flex justify-between text-sm py-2 border-t">
                  <span className="text-slate-500">Assigned Users</span>
                  <span className="font-bold">{role._count?.userRoles || 0}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-t">
                  <span className="text-slate-500">Granted Permissions</span>
                  <span className="font-bold text-indigo-600">{role.permissions?.length || 0}</span>
                </div>
                <div className="pt-2 flex gap-2">
                  <Button variant="outline" size="sm" className="w-full">Permission Matrix</Button>
                  <Button variant="default" size="sm" className="w-full">Edit Role</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
