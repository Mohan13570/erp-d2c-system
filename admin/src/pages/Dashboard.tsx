import React, { useState, useEffect } from 'react';
import { ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown, Clock, Bell, Truck, Box } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

const PIE_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#6366F1'];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('Last 6 Months');

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/bi/dashboard')
      .then(res => res.json())
      .then(d => {
        if(d.error) {
          setError(d.error);
        } else {
          setData(d);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  const handlePrintReport = () => {
    window.print(); // Simple functional button action
  };

  const toggleTimeRange = () => {
    setTimeRange(prev => prev === 'Last 6 Months' ? 'Last 30 Days' : 'Last 6 Months');
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data || !data.kpis) {
    return (
      <div className="flex flex-col h-full items-center justify-center space-y-4">
        <div className="text-rose-500 font-bold text-xl">System Error or Empty Database</div>
        <p className="text-gray-500">Failed to load BI aggregated data. Check your database connections or create some records.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10 print:bg-white print:p-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1">Real-time overview of your enterprise operations and D2C sales.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={toggleTimeRange} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold shadow-sm hover:bg-gray-50 flex items-center">
            <Clock size={16} className="mr-2"/> {timeRange}
          </button>
          <button onClick={handlePrintReport} className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><DollarSign size={80} className="text-emerald-500 translate-x-4 -translate-y-4"/></div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Net Revenue</p>
          <p className="text-4xl font-black text-gray-900 mb-2">${data.kpis.revenue.toLocaleString()}</p>
          <div className="flex items-center text-sm font-bold text-emerald-600">
            {data.kpis.revenue > 0 ? <><TrendingUp size={16} className="mr-1"/> <span>Active</span></> : <span className="text-gray-400">No data yet</span>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><ShoppingCart size={80} className="text-indigo-500 translate-x-4 -translate-y-4"/></div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Orders</p>
          <p className="text-4xl font-black text-gray-900 mb-2">{data.kpis.totalSales}</p>
          <div className="flex items-center text-sm font-bold text-emerald-600">
             {data.kpis.totalSales > 0 ? <><TrendingUp size={16} className="mr-1"/> <span>Active</span></> : <span className="text-gray-400">No data yet</span>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><Truck size={80} className="text-amber-500 translate-x-4 -translate-y-4"/></div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Active Shipments</p>
          <p className="text-4xl font-black text-gray-900 mb-2">{data.kpis.activeShipments}</p>
          <div className="flex items-center text-sm font-bold text-amber-500">
            <span className="text-gray-400">Current active</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl shadow-lg relative overflow-hidden text-white group">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-30 transition-opacity"><Users size={80} className="translate-x-4 -translate-y-4"/></div>
          <p className="text-sm font-bold text-indigo-200 uppercase tracking-wider mb-2">System Users</p>
          <p className="text-4xl font-black mb-2">{data.kpis.totalUsers}</p>
          <div className="flex items-center text-sm font-bold text-indigo-100">
             <span>Employees, Vendors & Customers</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-900">Revenue & Expenses</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div><span className="text-sm font-semibold text-gray-600">Revenue</span></div>
              <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-emerald-400"></div><span className="text-sm font-semibold text-gray-600">Expenses</span></div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            {data.revenueForecast.length === 0 || data.revenueForecast.every((i: any) => i.revenue === 0 && i.expenses === 0) ? (
               <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl">
                 <p className="text-gray-400 font-bold">No financial data available to chart.</p>
               </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueForecast} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontWeight: 600}} tickFormatter={(value) => `$${value/1000}k`} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="expenses" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Inventory by Category</h2>
          <div className="flex-1 min-h-[300px]">
            {data.categoryData.length === 0 ? (
               <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl">
                 <p className="text-gray-400 font-bold">No inventory data.</p>
               </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.categoryData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                    {data.categoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontWeight: 600, color: '#4B5563', fontSize: '14px' }}/>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Weekly Logistics Volume</h2>
          <div className="h-[300px]">
             {data.logisticsData.length === 0 || data.logisticsData.every((i: any) => i.shipped === 0 && i.delivered === 0) ? (
               <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl">
                 <p className="text-gray-400 font-bold">No active shipments this week.</p>
               </div>
             ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.logisticsData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontWeight: 600}} dy={10}/>
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontWeight: 600}}/>
                  <Tooltip cursor={{fill: '#F3F4F6', opacity: 0.4}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}/>
                  <Bar dataKey="shipped" name="Shipped" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={16}/>
                  <Bar dataKey="delivered" name="Delivered" fill="#14B8A6" radius={[4, 4, 0, 0]} barSize={16}/>
                </BarChart>
              </ResponsiveContainer>
             )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Live Operations Feed</h2>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>Live</span>
          </div>
          <div className="space-y-5 flex-1 overflow-y-auto pr-2">
             {data.feed.length === 0 ? (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl">
                 <p className="text-gray-400 font-bold">No recent activities.</p>
               </div>
             ) : (
               data.feed.map((f: any, i: number) => (
                 <div key={i} className="flex space-x-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                   <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600 shrink-0"><Box size={20}/></div>
                   <div>
                     <p className="font-bold text-gray-900">{f.title}</p>
                     <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
                     <p className="text-xs font-bold text-gray-400 mt-2">{new Date(f.time).toLocaleString()}</p>
                   </div>
                 </div>
               ))
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
