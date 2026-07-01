import React, { useState, useEffect } from 'react';
import { Droplet, Circle, Flame } from 'lucide-react';

export default function FuelAndTyreDesk() {
  const [fuelLogs, setFuelLogs] = useState<any[]>([]);
  const [tyres, setTyres] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/maintenance-ops/fuel').then(res => res.json()).then(setFuelLogs).catch(console.error);
    fetch('/api/maintenance-ops/tyres').then(res => res.json()).then(setTyres).catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* FUEL MODULE */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-gray-900 flex items-center">
                <Flame className="mr-3 text-orange-500" size={28} /> Fuel Economy
              </h1>
              <p className="text-gray-500 font-medium text-sm mt-1">Track liters consumed and cost efficiency.</p>
            </div>
            <button className="px-4 py-2 bg-orange-50 text-orange-600 font-bold text-sm rounded-xl hover:bg-orange-100 transition-colors">
              Log Fuel
            </button>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Date</th>
                  <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Vehicle</th>
                  <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Liters</th>
                  <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fuelLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="p-4 text-sm font-medium text-gray-500">{new Date(log.timestamp).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-gray-900">{log.vehicle?.registrationNo}</td>
                    <td className="p-4 text-sm font-bold text-gray-700">{log.quantityLiters} L</td>
                    <td className="p-4 text-sm font-bold text-gray-700">${log.cost}</td>
                  </tr>
                ))}
                {fuelLogs.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-400 text-sm">No fuel logs found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* TYRE MODULE */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-gray-900 flex items-center">
                <Circle className="mr-3 text-slate-800" size={28} /> Tyre Lifecycle
              </h1>
              <p className="text-gray-500 font-medium text-sm mt-1">Manage positions, tread depth, and rotation.</p>
            </div>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors">
              Add Tyre
            </button>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Serial No</th>
                  <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Status/Pos</th>
                  <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Tread</th>
                  <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tyres.map(tyre => (
                  <tr key={tyre.id} className="hover:bg-gray-50">
                    <td className="p-4 text-sm font-bold text-gray-900">{tyre.serialNumber}<br/><span className="text-xs text-gray-500 font-normal">{tyre.brand} {tyre.size}</span></td>
                    <td className="p-4">
                      {tyre.status === 'Installed' ? (
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">{tyre.vehicle?.registrationNo} • {tyre.position}</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded">{tyre.status}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div className={`h-2 rounded-full ${tyre.treadDepth < 3 ? 'bg-rose-500' : tyre.treadDepth < 6 ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{width: `${(tyre.treadDepth / 12) * 100}%`}}></div>
                        </div>
                        <span className="text-xs font-bold text-gray-600">{tyre.treadDepth}mm</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button className="text-slate-600 text-xs font-bold hover:underline">Update</button>
                    </td>
                  </tr>
                ))}
                {tyres.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-400 text-sm">No tyres found in inventory.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
