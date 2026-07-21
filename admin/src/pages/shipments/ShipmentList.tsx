import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { 
  Search, Filter, Download, Plus, MoreVertical, 
  ChevronLeft, ChevronRight, LayoutGrid, List,
  ArrowUpDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor('trackingNumber', {
    header: 'Shipment #',
    cell: info => <span className="font-bold text-blue-600 cursor-pointer">{info.getValue()}</span>,
  }),
  columnHelper.accessor('bookingNumber', {
    header: 'Booking #',
    cell: info => <span className="text-slate-600 font-medium">{info.getValue() || '--'}</span>,
  }),
  columnHelper.accessor('customer.legalName', {
    header: 'Customer',
    cell: info => <span className="font-semibold text-slate-800">{info.getValue() || '--'}</span>,
  }),
  columnHelper.accessor('origin', {
    header: 'Origin',
    cell: info => info.getValue() || '--',
  }),
  columnHelper.accessor('destination', {
    header: 'Destination',
    cell: info => info.getValue() || '--',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => {
      const val = info.getValue();
      let bg = 'bg-slate-100 text-slate-700';
      if (val === 'Pending Pickup') bg = 'bg-amber-100 text-amber-700';
      if (val === 'In Transit') bg = 'bg-blue-100 text-blue-700';
      if (val === 'Delivered') bg = 'bg-emerald-100 text-emerald-700';
      
      return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${bg}`}>
          {val}
        </span>
      );
    },
  }),
  columnHelper.accessor('priority', {
    header: 'Priority',
    cell: info => {
      const val = info.getValue();
      const isHigh = val === 'High' || val === 'Urgent';
      return <span className={`font-semibold ${isHigh ? 'text-red-600' : 'text-slate-600'}`}>{val}</span>;
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: () => (
      <button className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-700 transition-colors">
        <MoreVertical className="w-4 h-4" />
      </button>
    ),
  }),
];

export default function ShipmentList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['shipments', page, limit, search],
    queryFn: async () => {
      const res = await fetch(`/api/v1/shipments?page=${page}&limit=${limit}&search=${search}`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
  });

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1); // Reset to first page on search
  };

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      {/* 1. TOP STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 shrink-0 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Shipment Registry</h1>
          </div>
          
          <form onSubmit={handleSearch} className="relative w-96 hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search tracking #, customer..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
          </form>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <Link to="/shipments/create" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm shadow-blue-200">
            <Plus className="w-4 h-4" />
            New Shipment
          </Link>
        </div>
      </header>

      {/* 2. STICKY FILTER BAR */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 h-14 shrink-0 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm font-bold transition-colors">
            <Filter className="w-4 h-4" /> Advanced Filters
          </button>
          <div className="h-4 w-px bg-slate-300 mx-1"></div>
          <span className="text-sm font-medium text-slate-500">{data?.meta?.total || 0} Records Found</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/shipments" className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md transition-colors" title="Dashboard View">
            <LayoutGrid className="w-5 h-5" />
          </Link>
          <div className="p-1.5 text-blue-600 bg-blue-50 rounded-md cursor-default" title="List View">
            <List className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. MAIN TABLE SCROLLABLE AREA */}
      <main className="flex-1 overflow-auto p-6 scroll-smooth bg-white">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <div key={i} className="h-12 bg-slate-100 rounded-lg"></div>
            ))}
          </div>
        ) : (data?.data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
             <Search className="w-12 h-12 text-slate-300 mb-4" />
             <p className="text-lg font-semibold text-slate-700">No shipments found</p>
             <p className="text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    <th className="px-4 py-3 w-12 text-center">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    </th>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-4 py-3 font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.id !== 'actions' && <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-100">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-4 py-3 w-12 text-center">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-3 text-slate-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </main>

      {/* 4. BOTTOM PAGINATION BAR */}
      <footer className="h-14 shrink-0 bg-white border-t border-slate-200 px-6 flex items-center justify-between">
        <div className="text-sm text-slate-500 font-medium">
          Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data?.meta?.total || 0)} of {data?.meta?.total || 0} entries
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-4 py-1.5 text-sm font-bold text-slate-700 bg-slate-100 rounded-md">
            Page {page} of {data?.meta?.totalPages || 1}
          </div>
          <button 
            onClick={() => setPage(p => p + 1)}
            disabled={!data?.meta || page >= data.meta.totalPages}
            className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

    </div>
  );
}
