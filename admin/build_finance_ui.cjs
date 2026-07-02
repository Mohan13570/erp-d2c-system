const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages', 'procurement');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const templates = {
  'ExecutiveDashboard.tsx': `
import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, TrendingDown, DollarSign, Users, Briefcase, Activity } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';

export default function ExecutiveDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/analytics/dashboard')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(console.error);
  }, []);

  if (!data) return <div className="p-8 text-gray-500">Loading Enterprise Analytics...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Target className="mr-3 text-indigo-600" size={32} />
            Procurement Executive Dashboard
          </h1>
          <p className="text-gray-500 mt-1">C-Suite level insights into global spend, risk, and vendor performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
          <p className="text-indigo-100 font-medium">Total Spend (YTD)</p>
          <h3 className="text-4xl font-bold mt-2">$ {(data.kpis.totalSpendThisYear || 0).toLocaleString()}</h3>
          <div className="mt-4 flex items-center text-sm font-medium text-indigo-200">
            <TrendingUp size={16} className="mr-1"/> +12.5% vs last year
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium flex items-center"><DollarSign size={16} className="mr-2 text-rose-500"/> Pending Payments</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">$ {(data.kpis.pendingPayments || 0).toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium flex items-center"><Activity size={16} className="mr-2 text-amber-500"/> Budget Utilization</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">{data.kpis.budgetUtilization}</h3>
          <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
            <div className="bg-amber-500 h-2 rounded-full" style={{width: data.kpis.budgetUtilization}}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium flex items-center"><Briefcase size={16} className="mr-2 text-emerald-500"/> Open Approvals</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">{data.kpis.openPRs} Requisitions</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Monthly Spend Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlySpend}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6"/>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tickFormatter={(val) => \`M\${val}\`} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => \`$\${val/1000}k\`} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="spend" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center"><Users size={20} className="mr-2 text-gray-400"/> Top Vendors by Spend</h3>
          <div className="space-y-4">
            {data.topVendors.length > 0 ? data.topVendors.map((v: any, i: number) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                <span className="font-medium text-gray-800">{v.vendorName}</span>
                <span className="font-bold text-indigo-600 font-mono">$ {v.spend.toLocaleString()}</span>
              </div>
            )) : <p className="text-sm text-gray-500">No vendor spend data available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
`,

  'VendorBilling.tsx': `
import React, { useState, useEffect } from 'react';
import { FileText, Search, ExternalLink, CreditCard } from 'lucide-react';

export default function VendorBilling() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/finance/bills')
      .then(res => res.json())
      .then(setBills)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="mr-3 text-rose-600" size={32} />
            Accounts Payable & Vendor Bills
          </h1>
          <p className="text-gray-500 mt-1">Manage incoming invoices, tax allocations, and AP liabilities.</p>
        </div>
        <button className="bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-rose-700 transition">
          <ExternalLink className="w-4 h-4 mr-2" /> Upload Bill
        </button>
      </div>

      <div className="bg-white rounded-2xl flex-1 border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search Bill Number or Vendor..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl" />
          </div>
        </div>
        <div className="overflow-auto flex-1 p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Bill #</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Vendor</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Amount (Inc Tax)</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Due Date</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bills.map((bill: any) => (
                <tr key={bill.id} className="hover:bg-rose-50/30">
                  <td className="px-6 py-4 font-bold text-gray-900">{bill.billNumber}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{bill.vendor?.name}</td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">{bill.currency} {bill.totalAmount?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(bill.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={\`px-2.5 py-1 rounded-full text-xs font-medium \${
                      bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }\`}>{bill.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 font-medium text-sm hover:underline flex items-center justify-end w-full">
                      <CreditCard size={16} className="mr-1"/> Pay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`,

  'PaymentManager.tsx': `
import React, { useState, useEffect } from 'react';
import { CreditCard, Search, Plus } from 'lucide-react';

export default function PaymentManager() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/finance/payments')
      .then(res => res.json())
      .then(setPayments)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <CreditCard className="mr-3 text-emerald-600" size={32} />
            Payment Gateway & Ledger
          </h1>
          <p className="text-gray-500 mt-1">Track outgoing payments, methods, and bank reconciliations.</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-emerald-700 transition">
          <Plus className="w-4 h-4 mr-2" /> New Payment
        </button>
      </div>

      <div className="bg-white rounded-2xl flex-1 border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search Payment ID..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl" />
          </div>
        </div>
        <div className="overflow-auto flex-1 p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Payment Ref</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Vendor</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Method</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Amount Paid</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((pay: any) => (
                <tr key={pay.id} className="hover:bg-emerald-50/30">
                  <td className="px-6 py-4 font-bold text-gray-900">{pay.paymentNumber}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{pay.vendor?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{pay.method}</td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">$ {pay.amount?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(pay.paymentDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {pay.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`,

  'BudgetManager.tsx': `
import React, { useState, useEffect } from 'react';
import { Activity, Plus, Search } from 'lucide-react';

export default function BudgetManager() {
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/finance/budgets')
      .then(res => res.json())
      .then(setBudgets)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Activity className="mr-3 text-amber-600" size={32} />
            Budget Control Center
          </h1>
          <p className="text-gray-500 mt-1">Define departmental allocations, enforce limits, and view consumption.</p>
        </div>
        <button className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-amber-700 transition">
          <Plus className="w-4 h-4 mr-2" /> Allocate Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
        {budgets.map((b: any) => {
          const util = ((b.consumedAmount / b.totalBudget) * 100).toFixed(1);
          return (
            <div key={b.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{b.department || 'Corporate'}</h3>
                  <p className="text-xs text-gray-500 mt-1">FY {b.fiscalYear}</p>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">{b.status}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Utilization</span>
                <span className="text-sm font-bold text-gray-900">{util}%</span>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                <div 
                  className={\`h-2 rounded-full \${parseFloat(util) > 90 ? 'bg-rose-500' : 'bg-amber-500'}\`} 
                  style={{width: \`\${Math.min(parseFloat(util), 100)}%\`}}
                ></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Allocated</p>
                  <p className="font-bold text-gray-900 font-mono mt-1">{b.currency} {b.totalBudget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Consumed</p>
                  <p className="font-bold text-gray-900 font-mono mt-1">{b.currency} {b.consumedAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
`,

  'SpendAnalytics.tsx': `
import React, { useState, useEffect } from 'react';
import { TrendingUp, Filter } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function SpendAnalytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/analytics/spend')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="mr-3 text-cyan-600" size={32} />
            Deep Spend Analytics
          </h1>
          <p className="text-gray-500 mt-1">Multi-dimensional analysis by Category, Cost Center, and Vendor.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Spend Volume vs Transactions (Mock Data)</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'IT Hardware', spend: 120000 },
              { name: 'Marketing Services', spend: 85000 },
              { name: 'Logistics', spend: 310000 },
              { name: 'Raw Materials', spend: 520000 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="spend" fill="#0891B2" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
`
};

for (const [filename, content] of Object.entries(templates)) {
  fs.writeFileSync(path.join(dir, filename), content.trim());
}

console.log("Finance UI components generated successfully.");
