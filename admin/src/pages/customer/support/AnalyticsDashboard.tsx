import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Download } from 'lucide-react';

const mockTransitData = [
  { month: 'Jan', actual: 14, expected: 12 },
  { month: 'Feb', actual: 13, expected: 12 },
  { month: 'Mar', actual: 12, expected: 12 },
  { month: 'Apr', actual: 15, expected: 12 }, // Suez Canal Issue
  { month: 'May', actual: 13, expected: 12 },
  { month: 'Jun', actual: 12, expected: 12 },
];

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Analytics & Performance</h1>
          <p className="text-sm text-gray-500 mt-1">Enterprise BI Dashboards tracking your logistics efficiency and spend.</p>
        </div>
        <button className="px-4 py-2 border border-gray-200 bg-white rounded-xl text-sm font-medium hover:bg-gray-50 shadow-sm flex items-center text-gray-700">
          <Download size={16} className="mr-2" /> Export Report PDF
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500">On-Time Delivery Rate</p>
          <div className="mt-2 flex items-baseline">
             <p className="text-3xl font-extrabold text-gray-900">96.5%</p>
             <p className="ml-2 text-sm font-bold text-green-600">+2.1%</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Average Transit Time (Ocean)</p>
          <div className="mt-2 flex items-baseline">
             <p className="text-3xl font-extrabold text-gray-900">13.2 <span className="text-lg text-gray-500 font-medium">Days</span></p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Spend (YTD)</p>
          <div className="mt-2 flex items-baseline">
             <p className="text-3xl font-extrabold text-gray-900">$0.00M</p>
             <p className="ml-2 text-sm font-bold text-red-600">+12%</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Customs Clearance Time</p>
          <div className="mt-2 flex items-baseline">
             <p className="text-3xl font-extrabold text-gray-900">1.8 <span className="text-lg text-gray-500 font-medium">Days</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Transit Time Analysis (Actual vs Expected)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTransitData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dx={-10} />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="actual" name="Actual (Days)" stroke="#4f46e5" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="expected" name="Expected (Days)" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Freight Spend by Mode (YTD)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                 { month: 'Jan', ocean: 4000, air: 2400, road: 2400 },
                 { month: 'Feb', ocean: 3000, air: 1398, road: 2210 },
                 { month: 'Mar', ocean: 2000, air: 9800, road: 2290 },
                 { month: 'Apr', ocean: 2780, air: 3908, road: 2000 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6"/>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dy={10}/>
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dx={-10}/>
                <Tooltip />
                <Area type="monotone" dataKey="air" stackId="1" stroke="#3b82f6" fill="#bfdbfe" name="Air Freight" />
                <Area type="monotone" dataKey="ocean" stackId="1" stroke="#4f46e5" fill="#c7d2fe" name="Ocean Freight" />
                <Area type="monotone" dataKey="road" stackId="1" stroke="#10b981" fill="#a7f3d0" name="Road Freight" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
