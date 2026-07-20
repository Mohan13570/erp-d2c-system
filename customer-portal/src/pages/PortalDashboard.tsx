import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Package,
  Truck,
  CheckCircle2,
  FileText,
  Plus,
  LogOut,
  User,
  Bell
} from 'lucide-react';

import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

// --- MOCK DATA ---
const chartData = [
  { name: 'Jan', shipments: 12 },
  { name: 'Feb', shipments: 19 },
  { name: 'Mar', shipments: 15 },
  { name: 'Apr', shipments: 22 },
  { name: 'May', shipments: 28 },
  { name: 'Jun', shipments: 25 },
];

type Shipment = {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: 'In Transit' | 'Delivered' | 'Pending' | 'Exception';
};

const recentShipments: Shipment[] = [
  { id: '1', trackingNumber: 'TRK-2026-001', origin: 'Shanghai, CN', destination: 'Los Angeles, US', status: 'In Transit' },
  { id: '2', trackingNumber: 'TRK-2026-002', origin: 'Hamburg, DE', destination: 'New York, US', status: 'Delivered' },
  { id: '3', trackingNumber: 'TRK-2026-003', origin: 'Mumbai, IN', destination: 'London, UK', status: 'Pending' },
  { id: '4', trackingNumber: 'TRK-2026-004', origin: 'Shenzhen, CN', destination: 'Sydney, AU', status: 'In Transit' },
  { id: '5', trackingNumber: 'TRK-2026-005', origin: 'Dubai, AE', destination: 'Singapore, SG', status: 'Exception' },
];

const columnHelper = createColumnHelper<Shipment>();

const columns = [
  columnHelper.accessor('trackingNumber', {
    header: 'Tracking Number',
    cell: info => <span className="font-medium text-slate-900 dark:text-white">{info.getValue()}</span>,
  }),
  columnHelper.accessor('origin', {
    header: 'Origin',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('destination', {
    header: 'Destination',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => {
      const status = info.getValue();
      let colorClass = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      if (status === 'In Transit') colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      if (status === 'Delivered') colorClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      if (status === 'Exception') colorClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
          {status}
        </span>
      );
    },
  }),
];

export default function PortalDashboard() {
  const navigate = useNavigate();

  const table = useReactTable({
    data: recentShipments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleLogout = () => {
    navigate('/portal/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="text-white w-5 h-5" />
            </div>
            <img src="/lizome-logo.png" alt="LIZOME" className="h-8 object-contain" />
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-500">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium leading-none text-slate-900 dark:text-white">Acme Corp</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">admin@acme.com</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-500" />
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-500 hover:text-red-500 ml-2">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of your logistics activity.</p>
          </div>
          <Button onClick={() => navigate('/portal/bookings/new')} className="shrink-0 gap-2">
            <Plus className="w-4 h-4" />
            Create New Booking
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Bookings</CardTitle>
              <Package className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">12</div>
              <p className="text-xs text-slate-500 mt-1">+2 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">In Transit</CardTitle>
              <Truck className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">8</div>
              <p className="text-xs text-slate-500 mt-1">3 arriving today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Delivered (This Month)</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">45</div>
              <p className="text-xs text-slate-500 mt-1">+15% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Outstanding Invoices</CardTitle>
              <FileText className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">$12,450</div>
              <p className="text-xs text-slate-500 mt-1">2 invoices due this week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity Table */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map(row => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map(cell => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Volume Chart */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Shipment Volume</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="shipments" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
