const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages', 'procurement');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const templates = {
  'PurchaseDashboard.tsx': `
import React from 'react';
import { ShoppingCart, Package, FileText, CheckCircle, TrendingUp, AlertCircle, RefreshCcw, DollarSign } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function PurchaseDashboard() {
  const data = [
    { name: 'Week 1', spend: 4000, items: 240 },
    { name: 'Week 2', spend: 3000, items: 139 },
    { name: 'Week 3', spend: 2000, items: 980 },
    { name: 'Week 4', spend: 2780, items: 390 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="mr-3 text-emerald-600" size={32} />
            Purchasing Operations Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Real-time overview of PRs, POs, Receipts, and Returns.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Pending PRs', value: '45', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Active POs', value: '112', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending GRNs', value: '18', icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Returns (MTD)', value: '6', icon: RefreshCcw, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</h3>
              </div>
              <div className={\`p-3 rounded-xl \${stat.bg} \${stat.color}\`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className={\`absolute bottom-0 left-0 w-full h-1 \${stat.bg}\`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="mr-2 text-gray-400" size={20} /> Purchasing Spend Trend
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="spend" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <AlertCircle className="mr-2 text-amber-500" size={20} /> Pending Actions
          </h3>
          <div className="space-y-4">
             {[
               { title: 'Budget Approval Required', desc: 'PR-2026-00104 exceeds department budget by 15%', time: '2 hours ago', icon: DollarSign, color: 'text-amber-500' },
               { title: 'Quality Inspection Pending', desc: 'GRN-2026-00042 arrived with 2 damaged boxes', time: '5 hours ago', icon: CheckCircle, color: 'text-blue-500' },
               { title: 'Invoice Discrepancy', desc: 'INV-7738 value is 10% higher than PO grand total', time: '1 day ago', icon: AlertCircle, color: 'text-rose-500' },
             ].map((alert, i) => (
                <div key={i} className="flex items-start p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                   <div className={\`p-2 rounded-lg bg-white mr-4 shadow-sm \${alert.color}\`}>
                     <alert.icon size={20} />
                   </div>
                   <div>
                     <h4 className="font-bold text-gray-900 text-sm">{alert.title}</h4>
                     <p className="text-sm text-gray-500 mt-1">{alert.desc}</p>
                   </div>
                   <span className="ml-auto text-xs text-gray-400">{alert.time}</span>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
`,

  'PRManager.tsx': `
import React, { useState, useEffect } from 'react';
import { FileText, Search, Plus, Filter, ArrowRight, User } from 'lucide-react';

export default function PRManager() {
  const [prs, setPrs] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/pr')
      .then(r => r.json())
      .then(data => setPrs(data))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="mr-3 text-indigo-600" size={32} />
            Purchase Requisitions (PR)
          </h1>
          <p className="text-gray-500 mt-1">Manage departmental requests, budgets, and routing.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition">
          <Plus className="w-4 h-4 mr-2" /> New Requisition
        </button>
      </div>

      <div className="bg-white rounded-2xl flex-1 border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search by PR Number or Department..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <div className="overflow-auto flex-1 p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">PR Number</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Department</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Items</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Est Amount</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Priority</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {prs.map((pr: any) => (
                <tr key={pr.id} className="hover:bg-indigo-50/30">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{pr.prNumber}</p>
                    <p className="text-xs text-gray-500">{new Date(pr.requestDate).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-800">{pr.department || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">{pr.items?.length || 0}</td>
                  <td className="px-6 py-4 font-mono text-gray-900">{pr.currency} {pr.totalEstAmount?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={\`px-2.5 py-1 rounded-md text-xs font-bold \${
                      pr.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                    }\`}>{pr.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={\`px-2.5 py-1 rounded-full text-xs font-medium \${
                      pr.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }\`}>{pr.status}</span>
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

  'POControlCenter.tsx': `
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, ExternalLink, Printer } from 'lucide-react';

export default function POControlCenter() {
  const [pos, setPos] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/po')
      .then(r => r.json())
      .then(data => setPos(data))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="mr-3 text-indigo-600" size={32} />
            Purchase Order Control Center
          </h1>
          <p className="text-gray-500 mt-1">Manage vendor dispatch, blanket orders, and partial fulfillments.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition">
          <Plus className="w-4 h-4 mr-2" /> Create PO
        </button>
      </div>

      <div className="bg-white rounded-2xl flex-1 border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search PO Number, Vendor, or Status..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl" />
          </div>
        </div>
        <div className="overflow-auto flex-1 p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">PO Number</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Vendor</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Order Date</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Grand Total</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pos.map((po: any) => (
                <tr key={po.id} className="hover:bg-indigo-50/30">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{po.poNumber}</p>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded mt-1 inline-block">{po.type}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{po.vendor?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(po.orderDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">{po.currency} {po.grandTotal?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={\`px-2.5 py-1 rounded-full text-xs font-medium \${
                      po.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                      po.status === 'Partial_Receipt' ? 'bg-amber-100 text-amber-800' :
                      po.status === 'Closed' ? 'bg-gray-200 text-gray-800' :
                      'bg-emerald-100 text-emerald-800'
                    }\`}>{po.status.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 text-gray-400">
                      <button className="hover:text-indigo-600"><Printer size={18} /></button>
                      <button className="hover:text-indigo-600"><ExternalLink size={18} /></button>
                    </div>
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

  'GoodsReceiptDesk.tsx': `
import React, { useState, useEffect } from 'react';
import { Package, Search, ScanLine, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function GoodsReceiptDesk() {
  const [grns, setGrns] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/grn')
      .then(r => r.json())
      .then(data => setGrns(data))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Package className="mr-3 text-emerald-600" size={32} />
            Warehouse Receiving & GRN
          </h1>
          <p className="text-gray-500 mt-1">Scan, inspect, and receive goods against Purchase Orders.</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-emerald-700 transition">
          <ScanLine className="w-4 h-4 mr-2" /> Receive Goods
        </button>
      </div>

      <div className="bg-white rounded-2xl flex-1 border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Scan PO Barcode or type GRN Number..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl font-mono" />
          </div>
        </div>
        <div className="overflow-auto flex-1 p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">GRN Number</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">PO Reference</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Vendor</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Items Received</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">QC Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {grns.map((grn: any) => (
                <tr key={grn.id} className="hover:bg-emerald-50/30">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{grn.grnNumber}</p>
                    <p className="text-xs text-gray-500">{new Date(grn.receivedDate).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-600">{grn.purchaseOrder?.poNumber}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{grn.purchaseOrder?.vendor?.name}</td>
                  <td className="px-6 py-4 text-sm font-medium text-emerald-700">
                    {grn.items?.length || 0} Units Scanned
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <ShieldCheck size={12} className="mr-1" /> Inspected
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

  'InvoiceMatcher.tsx': `
import React, { useState, useEffect } from 'react';
import { Receipt, Search, FileSignature, CheckCircle, AlertOctagon } from 'lucide-react';

export default function InvoiceMatcher() {
  const [invoices, setInvoices] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/invoices')
      .then(r => r.json())
      .then(data => setInvoices(data))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Receipt className="mr-3 text-rose-600" size={32} />
            3-Way Invoice Matching
          </h1>
          <p className="text-gray-500 mt-1">Automated reconciliation of Vendor Invoice, PO, and GRN.</p>
        </div>
        <button className="bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-rose-700 transition">
          <FileSignature className="w-4 h-4 mr-2" /> Upload Invoice
        </button>
      </div>

      <div className="bg-white rounded-2xl flex-1 border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search Invoices..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl" />
          </div>
        </div>
        <div className="overflow-auto flex-1 p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Invoice #</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">PO Reference</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Amount</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Match Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-rose-50/30">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{inv.invoiceNumber}</p>
                    <p className="text-xs text-gray-500">Due: {new Date(inv.dueDate).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-600">{inv.purchaseOrder?.poNumber}</td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">{inv.currency} {inv.totalAmount?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {inv.matchStatus === '3-Way-Matched' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        <CheckCircle size={12} className="mr-1"/> Matched
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                        <AlertOctagon size={12} className="mr-1"/> Discrepancy
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-indigo-600 font-medium text-sm hover:underline">Review</button>
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

  'PurchaseReturns.tsx': `
import React, { useState, useEffect } from 'react';
import { RefreshCcw, Search, Plus } from 'lucide-react';

export default function PurchaseReturns() {
  const [returns, setReturns] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/returns')
      .then(r => r.json())
      .then(data => setReturns(data))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <RefreshCcw className="mr-3 text-orange-600" size={32} />
            Purchase Returns (RTV)
          </h1>
          <p className="text-gray-500 mt-1">Manage Return to Vendor logistics, replacements, and credit notes.</p>
        </div>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-700 transition">
          <Plus className="w-4 h-4 mr-2" /> New Return
        </button>
      </div>

      <div className="bg-white rounded-2xl flex-1 border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search Return ID..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl" />
          </div>
        </div>
        <div className="overflow-auto flex-1 p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">RTV Number</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">PO Reference</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Reason</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Items</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {returns.map((ret: any) => (
                <tr key={ret.id} className="hover:bg-orange-50/30">
                  <td className="px-6 py-4 font-bold text-gray-900">{ret.returnNumber}</td>
                  <td className="px-6 py-4 font-mono text-gray-600">{ret.purchaseOrder?.poNumber}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{ret.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ret.items?.length || 0} items</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {ret.status}
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
`
};

for (const [filename, content] of Object.entries(templates)) {
  fs.writeFileSync(path.join(dir, filename), content.trim());
}

console.log("Purchasing UI components generated successfully.");
