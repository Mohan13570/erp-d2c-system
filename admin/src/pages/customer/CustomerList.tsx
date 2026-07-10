import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/customer-portal')
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(console.error);
  }, []);

  const filtered = customers.filter((c: any) => 
    c.legalName.toLowerCase().includes(search.toLowerCase()) || 
    c.customerCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Directory</h1>
          <p className="text-muted-foreground">Comprehensive list of all registered corporate accounts.</p>
        </div>
        <button onClick={() => navigate('/customer/register')} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 shadow">
          <UserPlus className="w-4 h-4" /> Register Customer
        </button>
      </div>

      <Card>
        <CardHeader className="py-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Code or Name..." 
              className="pl-9 pr-4 py-2 w-full border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Code</TableHead>
                <TableHead>Legal Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Compliance Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono font-medium text-blue-600">{c.customerCode}</TableCell>
                  <TableCell className="font-semibold">{c.legalName}</TableCell>
                  <TableCell>{c.addresses?.[0]?.city || 'N/A'}, {c.addresses?.[0]?.country || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${c.compliance?.complianceScore >= 80 ? 'bg-green-500' : c.compliance?.complianceScore >= 50 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${c.compliance?.complianceScore || 0}%` }}></div>
                      </div>
                      <span className="text-xs font-medium">{c.compliance?.complianceScore || 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.status === 'Active' ? 'default' : c.status === 'Pending Approval' ? 'secondary' : 'destructive'}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <button onClick={() => navigate(`/customer/${c.id}`)} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-end gap-1 ml-auto">
                      <FileText className="w-4 h-4" /> Profile
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">No customers found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
