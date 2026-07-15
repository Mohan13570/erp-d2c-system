import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Globe, Plane, Anchor, Truck } from 'lucide-react';

export default function RateCards() {
  const [rates, setRates] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/erp/pricing/rates')
      .then(res => res.json())
      .then(data => setRates(data))
      .catch(console.error);
  }, []);

  const filtered = rates.filter((r: any) => 
    r.originCode.toLowerCase().includes(search.toLowerCase()) ||
    r.destinationCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Standard Rate Cards</h1>
          <p className="text-sm text-gray-500 mt-1">Global public sell rates per transport mode and origin-destination pair.</p>
        </div>
        <div className="flex space-x-3">
           <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center shadow-sm">
             <Plus size={16} className="mr-2" /> Add Rate Entry
           </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="relative w-96">
               <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
               <input 
                  type="text" 
                  placeholder="Search by Origin or Destination code..." 
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
               />
            </div>
            <div className="flex space-x-2">
               <button className="px-3 py-1.5 border border-gray-300 text-gray-700 bg-white rounded-lg text-xs font-medium hover:bg-gray-50">OCEAN</button>
               <button className="px-3 py-1.5 border border-gray-300 text-gray-700 bg-white rounded-lg text-xs font-medium hover:bg-gray-50">AIR</button>
               <button className="px-3 py-1.5 border border-gray-300 text-gray-700 bg-white rounded-lg text-xs font-medium hover:bg-gray-50">ROAD</button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                     <th className="px-6 py-4">Mode</th>
                     <th className="px-6 py-4">Routing (Origin &rarr; Dest)</th>
                     <th className="px-6 py-4">Unit Type</th>
                     <th className="px-6 py-4 text-right">Base Sell Rate</th>
                     <th className="px-6 py-4">Validity</th>
                     <th className="px-6 py-4">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 text-gray-900">
                  {filtered.length > 0 ? filtered.map((r: any) => (
                     <tr key={r.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                           {r.transportMode === 'OCEAN' ? <div className="flex items-center text-sky-600"><Anchor size={16} className="mr-2" /> OCEAN</div> : 
                            r.transportMode === 'AIR' ? <div className="flex items-center text-amber-600"><Plane size={16} className="mr-2" /> AIR</div> : 
                            <div className="flex items-center text-emerald-600"><Truck size={16} className="mr-2" /> ROAD</div>}
                        </td>
                        <td className="px-6 py-4 font-bold tracking-wider">
                           {r.originCode} <span className="text-gray-400 mx-1">&rarr;</span> {r.destinationCode}
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">Per {r.unitType}</td>
                        <td className="px-6 py-4 text-right font-extrabold text-indigo-600">
                           {r.currency} {r.baseRate.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                           {new Date(r.validTo).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${
                              r.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                           }`}>
                              {r.status}
                           </span>
                        </td>
                     </tr>
                  )) : (
                     <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                           No rates configured. Run the backend seeder or add manually.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
