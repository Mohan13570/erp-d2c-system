import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Globe, Package, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MDMDashboard() {
  const mdmLinks = [
    { name: 'Countries', path: '/mdm/country', icon: <Globe className="h-4 w-4" /> },
    { name: 'Seaports', path: '/mdm/port', icon: <Globe className="h-4 w-4" /> },
    { name: 'Currencies', path: '/mdm/currency', icon: <Landmark className="h-4 w-4" /> },
    { name: 'Incoterms', path: '/mdm/incoterm', icon: <Landmark className="h-4 w-4" /> },
    { name: 'Cargo Types', path: '/mdm/cargoType', icon: <Package className="h-4 w-4" /> },
    { name: 'Container Types', path: '/mdm/containerType', icon: <Package className="h-4 w-4" /> },
    { name: 'HS Codes', path: '/mdm/hSCode', icon: <Package className="h-4 w-4" /> }
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Master Data Management (MDM)</h1>
          <p className="text-muted-foreground mt-2">Centralized Source of Truth for Enterprise Master Data.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Data Dictionary Health
              <Database className="h-4 w-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-slate-800">99.8%</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Master Data Directories</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mdmLinks.map(link => (
            <Link 
              key={link.path}
              to={link.path} 
              className="p-4 border rounded-lg hover:shadow-md hover:border-indigo-400 transition-all flex items-center space-x-3 bg-slate-50 hover:bg-white"
            >
              <div className="p-2 bg-indigo-100 rounded-md text-indigo-700">
                {link.icon}
              </div>
              <span className="font-semibold text-slate-700">{link.name}</span>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
