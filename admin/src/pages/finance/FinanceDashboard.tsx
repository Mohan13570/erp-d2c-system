import React from 'react';
import { Target, TrendingUp, TrendingDown, DollarSign, Activity, FileText, ArrowUpRight, ArrowDownRight, CreditCard, Landmark, PiggyBank } from 'lucide-react';

export default function FinanceDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Finance Executive Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Real-time accounting analytics and cash flow positions.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
            Generate Report
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            New Journal Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-indigo-100 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Landmark className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Cash & Bank</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 relative z-10">$0.00</p>
          <div className="flex items-center mt-2 text-sm">
            <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
            <span className="text-emerald-600 font-medium">+2.5%</span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-emerald-100 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Receivables (AR)</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 relative z-10">$0.00</p>
          <div className="flex items-center mt-2 text-sm">
            <ArrowDownRight className="w-4 h-4 text-rose-500 mr-1" />
            <span className="text-rose-600 font-medium">-1.2%</span>
            <span className="text-gray-500 ml-2">outstanding</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-rose-100 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Payables (AP)</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 relative z-10">$0.00</p>
          <div className="flex items-center mt-2 text-sm">
            <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
            <span className="text-emerald-600 font-medium">+4.1%</span>
            <span className="text-gray-500 ml-2">scheduled</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-amber-100 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Activity className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Net Profit Margin</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 relative z-10">0.0%</p>
          <div className="flex items-center mt-2 text-sm">
            <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
            <span className="text-emerald-600 font-medium">+1.4%</span>
            <span className="text-gray-500 ml-2">vs last quarter</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Cash Flow Forecast</h3>
            <select className="text-sm border-gray-200 rounded-lg text-gray-600">
              <option>This Month</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          <div className="h-64 flex items-end space-x-2">
            {[0, 0, 0, 0, 0, 0, 0, 0].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end group">
                <div className="w-full bg-indigo-100 rounded-t-sm group-hover:bg-indigo-200 transition-colors relative" style={{ height: h + '%' }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ${(h * 1000).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Pending Approvals</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {[].map((item: any, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.type} <span className="text-gray-500 font-normal">({item.ref})</span></p>
                    <p className="text-xs text-gray-500">Requested by {item.req}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-900">$\{(item.amount).toLocaleString()}</span>
                  <div className="flex space-x-2">
                    <button className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg">Approve</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
