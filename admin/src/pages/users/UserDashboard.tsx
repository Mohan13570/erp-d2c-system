import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Shield, Activity, Laptop } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/api/users');
      return data;
    }
  });

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto bg-slate-50/50 dark:bg-slate-900/10 min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enterprise User Administration</h1>
          <p className="text-muted-foreground mt-2">Manage global users, security policies, sessions, and active devices.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-indigo-200">
            Bulk Import
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <UserPlus className="mr-2 h-4 w-4" /> Provision User
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="border-l-4 border-l-indigo-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Total Identities
              <Users className="h-4 w-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Active Sessions
              <Activity className="h-4 w-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {users?.reduce((acc: number, u: any) => acc + (u.sessions?.length || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Pending Approvals
              <Shield className="h-4 w-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {users?.filter((u: any) => u.status === 'Pending').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Active Devices
              <Laptop className="h-4 w-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {users?.reduce((acc: number, u: any) => acc + (u.devices?.length || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="bg-white dark:bg-slate-950 border-b">
          <CardTitle>User Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-900/50 uppercase border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Employee Link</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="text-center py-8">Loading users...</td></tr>
                ) : (
                  users?.map((user: any) => (
                    <tr key={user.id} className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900/20">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{user.firstName} {user.lastName}</span>
                          <span className="text-xs text-slate-500">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="bg-slate-100">{user.role?.name || 'Standard User'}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={user.status === 'Active' ? 'default' : 'secondary'} className={user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : ''}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {user.employeeProfile ? (
                           <Link to={`/users/employee/${user.employeeProfile.id}`}>
                             <Badge className="bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 cursor-pointer">
                               {user.employeeProfile.employeeCode}
                             </Badge>
                           </Link>
                        ) : (
                          <span className="text-xs text-slate-400">Not Linked</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="text-indigo-600">Manage</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
