import React, { useState, useEffect } from 'react';
import { Building2, Receipt, Star } from 'lucide-react';

export default function ComplianceAndVendorHub() {
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/maintenance-ops/vendors').then(res => res.json()).then(setVendors).catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <Building2 className="mr-3 text-purple-600" size={32} /> Vendor & Service Hub
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage external garages, parts suppliers, and vendor invoices.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map(vendor => (
          <div key={vendor.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-purple-200 transition-colors">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full uppercase tracking-wider">{vendor.type}</span>
                <div className="flex items-center text-amber-500 font-bold text-sm">
                  <Star size={16} className="mr-1 fill-amber-500" /> {vendor.rating.toFixed(1)}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{vendor.name}</h3>
              <p className="text-sm font-medium text-gray-500">{vendor.contactPerson} • {vendor.phone}</p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
              <button className="text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors flex items-center">
                <Receipt size={16} className="mr-1" /> View Invoices
              </button>
            </div>
          </div>
        ))}
        {vendors.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 font-medium bg-white rounded-3xl border border-gray-100 border-dashed">
            No service vendors found.
          </div>
        )}
      </div>
    </div>
  );
}
