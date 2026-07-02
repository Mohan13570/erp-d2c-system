const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages', 'procurement');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const templates = {
  'ProcurementHub.tsx': `
import React, { useEffect, useState } from 'react';
import { Building2, Users, FileText, Target, TrendingUp, AlertTriangle, CheckCircle, BarChart3, Search, Activity, ShieldCheck, DollarSign } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';

export default function ProcurementHub() {
  const data = [
    { name: 'Jan', requests: 45, spend: 120000 },
    { name: 'Feb', requests: 52, spend: 145000 },
    { name: 'Mar', requests: 38, spend: 98000 },
    { name: 'Apr', requests: 65, spend: 180000 },
    { name: 'May', requests: 48, spend: 135000 },
    { name: 'Jun', requests: 70, spend: 210000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Building2 className="mr-3 text-indigo-600" size={32} />
            Procurement Executive Hub
          </h1>
          <p className="text-gray-500 mt-1">Enterprise Sourcing, Vendor Management & Contracts</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition">
          <Target className="w-4 h-4 mr-2" /> Quick Source RFQ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Active Vendors', value: '1,248', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Open RFQs', value: '34', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Contracts Expiring (<30d)', value: '12', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Pending Approvals', value: '8', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition">
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
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="mr-2 text-gray-400" size={20} /> Monthly Spend vs Requests
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" orientation="left" stroke="#4F46E5" />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar yAxisId="left" dataKey="spend" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Spend ($)" />
                <Line yAxisId="right" type="monotone" dataKey="requests" stroke="#10B981" strokeWidth={3} name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <Activity className="mr-2 text-gray-400" size={20} /> Vendor Risk Distribution
          </h3>
          <div className="space-y-6 mt-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-emerald-700">Low Risk Vendors</span>
                <span className="text-gray-500">84%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-amber-700">Medium Risk Vendors</span>
                <span className="text-gray-500">12%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-rose-700">High Risk (Requires Audit)</span>
                <span className="text-gray-500">4%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: '4%' }}></div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-amber-50 rounded-xl flex items-start">
               <ShieldCheck className="text-amber-600 mt-1 mr-3 flex-shrink-0" size={20} />
               <div>
                 <p className="text-sm font-bold text-amber-800">Compliance Action Required</p>
                 <p className="text-xs text-amber-700 mt-1">14 Vendors have ISO certifications expiring in the next 15 days. Auto-reminders have been dispatched.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`,

  'VendorMaster.tsx': `
import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Filter, Download, ExternalLink, ShieldCheck, Star, AlertTriangle, Building2, MapPin } from 'lucide-react';

export default function VendorMaster() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/vendors')
      .then(r => r.json())
      .then(data => { setVendors(data); setLoading(false); })
      .catch(e => { console.error(e); setLoading(false); });
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="mr-3 text-indigo-600" size={32} />
            Vendor Master Desk
          </h1>
          <p className="text-gray-500 mt-1">Manage enterprise supplier profiles and compliance status</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-50 transition">
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition">
            <Plus className="w-4 h-4 mr-2" /> Onboard Vendor
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search vendors by name, GST, or category..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl flex items-center hover:bg-gray-100">
            <Filter size={18} className="mr-2" /> Filter
          </button>
        </div>

        <div className="overflow-auto flex-1 p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 sticky top-0 backdrop-blur-sm z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Vendor Identity</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Rating / Risk</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Category</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Location</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading vendors...</td></tr>
              ) : vendors.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No vendors found.</td></tr>
              ) : (
                vendors.map((v: any) => (
                  <tr key={v.id} className="hover:bg-indigo-50/30 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                          {v.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition">{v.name}</p>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">GST: {v.gstNo || 'Unregistered'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-amber-500">
                        <Star size={16} className="fill-current" />
                        <span className="ml-1 font-bold text-gray-900">{v.rating || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                         {v.category?.name || 'Uncategorized'}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-600 text-sm">
                         <MapPin size={14} className="mr-1 text-gray-400" />
                         {v.country || 'Global'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={\`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium \${
                        v.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                        v.status === 'Blacklisted' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }\`}>
                        {v.status === 'Active' && <ShieldCheck size={12} className="mr-1" />}
                        {v.status === 'Blacklisted' && <AlertTriangle size={12} className="mr-1" />}
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-900 font-medium text-sm flex items-center justify-end w-full">
                        View 360 Profile <ExternalLink size={14} className="ml-1" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`,

  'RFQDashboard.tsx': `
import React, { useState, useEffect } from 'react';
import { Target, Plus, Search, Filter, Clock, CheckCircle2, User, Building2 } from 'lucide-react';

export default function RFQDashboard() {
  const [rfqs, setRfqs] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/rfq')
      .then(r => r.json())
      .then(data => setRfqs(data))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Target className="mr-3 text-indigo-600" size={32} />
            Sourcing & RFQ Control
          </h1>
          <p className="text-gray-500 mt-1">Manage Requests for Quotation, competitive bidding, and awards</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition">
          <Plus className="w-4 h-4 mr-2" /> Create RFQ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2 flex-shrink-0">
         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center">
               <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mr-4"><Clock size={24} /></div>
               <div><p className="text-sm text-gray-500">Open Bids</p><p className="text-2xl font-bold">14</p></div>
            </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center">
               <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mr-4"><CheckCircle2 size={24} /></div>
               <div><p className="text-sm text-gray-500">Awarded (MTD)</p><p className="text-2xl font-bold">42</p></div>
            </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center">
               <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mr-4"><Building2 size={24} /></div>
               <div><p className="text-sm text-gray-500">Active Participants</p><p className="text-2xl font-bold">89</p></div>
            </div>
         </div>
      </div>

      <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search RFQ by ID, Title or Department..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl" />
          </div>
        </div>
        <div className="overflow-auto flex-1 p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">RFQ ID & Title</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Items</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Vendors Invited</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Responses</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Deadline</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {rfqs.length === 0 ? (
                 <tr><td colSpan={6} className="text-center py-8 text-gray-500">No active RFQs.</td></tr>
               ) : rfqs.map((rfq: any) => (
                 <tr key={rfq.id} className="hover:bg-indigo-50/30 cursor-pointer">
                   <td className="px-6 py-4">
                     <p className="font-bold text-gray-900">{rfq.rfqNumber}</p>
                     <p className="text-sm text-gray-500">{rfq.title}</p>
                   </td>
                   <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                     {rfq.items?.length || 0} Line Items
                   </td>
                   <td className="px-6 py-4">
                     <div className="flex -space-x-2">
                       {rfq.vendors?.slice(0,3).map((v:any, i:number) => (
                         <div key={i} className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-700" title={v.vendor?.name}>
                           {v.vendor?.name?.charAt(0)}
                         </div>
                       ))}
                       {rfq.vendors?.length > 3 && (
                         <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                           +{rfq.vendors.length - 3}
                         </div>
                       )}
                     </div>
                   </td>
                   <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                         {rfq._count?.responses || 0} Received
                      </span>
                   </td>
                   <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                     {new Date(rfq.deadline).toLocaleDateString()}
                   </td>
                   <td className="px-6 py-4">
                     <span className={\`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium \${
                        rfq.status === 'Open' ? 'bg-amber-100 text-amber-800' :
                        rfq.status === 'Awarded' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-gray-100 text-gray-800'
                      }\`}>
                        {rfq.status}
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

  'ContractManager.tsx': `
import React, { useState, useEffect } from 'react';
import { FileText, Search, Plus, Filter, AlertTriangle, Shield, CheckCircle } from 'lucide-react';

export default function ContractManager() {
  const [contracts, setContracts] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/contracts')
      .then(r => r.json())
      .then(data => setContracts(data))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="mr-3 text-indigo-600" size={32} />
            Contract Lifecycle Manager
          </h1>
          <p className="text-gray-500 mt-1">Digital agreements, rate contracts, and compliance expiry tracking</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition">
          <Plus className="w-4 h-4 mr-2" /> New Contract
        </button>
      </div>

      <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search Contract ID or Vendor..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl" />
          </div>
        </div>
        <div className="overflow-auto flex-1 p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Contract ID</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Vendor</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Type</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Validity</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Value</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {contracts.length === 0 ? (
                 <tr><td colSpan={6} className="text-center py-8 text-gray-500">No active contracts found.</td></tr>
               ) : contracts.map((c: any) => (
                 <tr key={c.id} className="hover:bg-indigo-50/30">
                   <td className="px-6 py-4">
                     <p className="font-bold text-gray-900">{c.contractNo}</p>
                     <p className="text-sm text-gray-500">{c.title}</p>
                   </td>
                   <td className="px-6 py-4">
                     <span className="font-medium text-gray-800">{c.vendor?.name}</span>
                   </td>
                   <td className="px-6 py-4">
                     <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                       {c.type}
                     </span>
                   </td>
                   <td className="px-6 py-4 text-sm">
                      <p className="text-gray-900">{new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}</p>
                   </td>
                   <td className="px-6 py-4 font-mono font-medium text-gray-700">
                     {c.currency} {c.value?.toLocaleString() || 'N/A'}
                   </td>
                   <td className="px-6 py-4">
                      {c.status === 'Active' ? (
                        <span className="inline-flex items-center text-emerald-600 font-medium text-sm"><CheckCircle size={16} className="mr-1"/> Active</span>
                      ) : (
                        <span className="inline-flex items-center text-amber-600 font-medium text-sm"><AlertTriangle size={16} className="mr-1"/> Expiring</span>
                      )}
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

  'ApprovalQueue.tsx': `
import React, { useState, useEffect } from 'react';
import { CheckCircle, Search, Clock, FileText, Check, X } from 'lucide-react';

export default function ApprovalQueue() {
  const [queue, setQueue] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/approvals')
      .then(r => r.json())
      .then(data => setQueue(data))
      .catch(e => console.error(e));
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    await fetch(\`http://localhost:5000/api/procurement/approvals/\${id}/\${action}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comments: \`\${action} by UI\` })
    });
    // Optimistic UI update
    setQueue(queue.map((q:any) => q.id === id ? { ...q, status: action === 'approve' ? 'Approved' : 'Rejected' } : q));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <CheckCircle className="mr-3 text-indigo-600" size={32} />
            Multi-Level Approval Queue
          </h1>
          <p className="text-gray-500 mt-1">Review pending RFQ awards, Requisitions, and Contracts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {queue.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl">
            <CheckCircle size={48} className="mx-auto text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">All Caught Up!</h3>
            <p className="text-gray-500 mt-2">There are no pending approvals in your queue.</p>
          </div>
        ) : queue.map((q: any) => (
          <div key={q.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition">
            <div className="flex items-center space-x-6">
              <div className={\`p-4 rounded-xl flex-shrink-0 \${
                q.entityType.includes('RFQ') ? 'bg-indigo-50 text-indigo-600' :
                q.entityType.includes('Contract') ? 'bg-emerald-50 text-emerald-600' :
                'bg-amber-50 text-amber-600'
              }\`}>
                <FileText size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{q.entityType}</span>
                  <span className={\`text-xs px-2 py-0.5 rounded-full font-medium \${
                    q.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                    q.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                    'bg-amber-100 text-amber-800'
                  }\`}>{q.status}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-1">Reference: {q.entityId}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-2 gap-4">
                  <span className="flex items-center"><UserIcon size={14} className="mr-1" /> Req. By: {q.requestedBy}</span>
                  <span className="flex items-center"><Clock size={14} className="mr-1" /> {new Date(q.requestDate).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {q.status === 'Pending' && (
              <div className="flex gap-3">
                <button 
                  onClick={() => handleAction(q.id, 'reject')}
                  className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg font-medium flex items-center hover:bg-rose-100 transition">
                  <X size={18} className="mr-1" /> Reject
                </button>
                <button 
                  onClick={() => handleAction(q.id, 'approve')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium flex items-center hover:bg-emerald-700 transition shadow-sm shadow-emerald-200">
                  <Check size={18} className="mr-1" /> Approve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function UserIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
`
};

for (const [filename, content] of Object.entries(templates)) {
  fs.writeFileSync(path.join(dir, filename), content.trim());
}

console.log("Procurement UI components generated successfully.");
