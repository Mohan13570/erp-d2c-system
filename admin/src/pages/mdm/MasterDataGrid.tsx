import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MasterDataGrid() {
  const { entity } = useParams<{ entity: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['mdm', entity],
    queryFn: async () => {
      const res = await axios.get(`/api/mdm/${entity}`);
      return res.data;
    }
  });

  const columns = data?.length > 0 ? Object.keys(data[0]).filter(k => k !== 'id' && !k.endsWith('Id') && typeof data[0][k] !== 'object') : [];

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-full space-y-6">
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/mdm/dashboard')}><ArrowLeft className="h-4 w-4" /></Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight capitalize">{entity} Master</h1>
            <p className="text-muted-foreground mt-2">Manage definitions for {entity}.</p>
          </div>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Create Record
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-lg">Data Grid</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                {columns.map(col => (
                  <th key={col} className="px-6 py-4 font-semibold text-slate-600 capitalize">{col}</th>
                ))}
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={columns.length + 1} className="text-center py-8 text-slate-400">Loading {entity}...</td></tr>
              ) : (
                data?.map((row: any) => (
                  <tr key={row.id} className="border-b hover:bg-slate-50/50">
                    {columns.map(col => (
                      <td key={col} className="px-6 py-4 text-slate-700">
                        {col === 'status' ? (
                          <Badge variant={row[col] === 'Active' ? 'default' : 'secondary'}>{row[col]}</Badge>
                        ) : (
                          String(row[col])
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-indigo-600">Edit</Button>
                    </td>
                  </tr>
                ))
              )}
              {data?.length === 0 && (
                <tr><td colSpan={columns.length + 1} className="text-center py-8 text-slate-400">No data found in {entity} master.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

    </div>
  );
}
