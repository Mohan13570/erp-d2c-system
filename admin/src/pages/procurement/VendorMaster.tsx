import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Filter, Download, ExternalLink, ShieldCheck, Star, AlertTriangle, Building2, MapPin } from 'lucide-react';

export default function VendorMaster() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/procurement/vendors')
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
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        v.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                        v.status === 'Blacklisted' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
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