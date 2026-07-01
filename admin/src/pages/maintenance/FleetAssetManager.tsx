import React, { useState, useEffect } from 'react';
import { Car, FileText, AlertTriangle, ShieldCheck, Download, Plus, Search, Calendar, ChevronRight } from 'lucide-react';

export default function FleetAssetManager() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/maintenance/assets')
      .then(res => res.json())
      .then(setVehicles)
      .catch(console.error);
  }, []);

  const filteredVehicles = vehicles.filter(v => v.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <Car className="mr-3 text-emerald-600" size={32} /> Fleet Asset Master
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage compliance documents, RCs, and vehicle specifications.</p>
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search registration..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
            <Plus size={18} className="mr-2" /> Add Vehicle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVehicles.map(vehicle => (
          <div key={vehicle.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-emerald-200 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{vehicle.registrationNo}</h3>
                <p className="text-sm font-medium text-gray-500">{vehicle.make} {vehicle.model} • {vehicle.type}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${vehicle.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {vehicle.status}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center text-sm font-bold text-gray-700">
                  <ShieldCheck size={16} className="mr-2 text-indigo-500" /> Insurance
                </div>
                {vehicle.documents?.find((d: any) => d.type === 'Insurance') ? (
                  <span className="text-xs font-bold text-emerald-600">Valid</span>
                ) : (
                  <span className="text-xs font-bold text-rose-500">Missing</span>
                )}
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center text-sm font-bold text-gray-700">
                  <FileText size={16} className="mr-2 text-blue-500" /> Fitness Cert
                </div>
                {vehicle.documents?.find((d: any) => d.type === 'Fitness') ? (
                  <span className="text-xs font-bold text-emerald-600">Valid</span>
                ) : (
                  <span className="text-xs font-bold text-rose-500">Missing</span>
                )}
              </div>
            </div>

            <button className="w-full py-3 bg-gray-50 text-gray-700 font-bold rounded-xl flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
              Manage Documents <ChevronRight size={18} className="ml-1" />
            </button>
          </div>
        ))}
        {filteredVehicles.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 font-medium bg-white rounded-3xl border border-gray-100 border-dashed">
            No vehicles found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
