import React, { useState, useEffect } from 'react';
import { Settings, AlertTriangle, ShieldCheck, Plus } from 'lucide-react';

export default function VehicleOpsDashboard() {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/road/vehicle-ops/alerts').then(res => res.json()).then(setAlerts).catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 flex items-center">
          <Settings className="mr-3 text-rose-600" size={32} /> Vehicle Operations & Maintenance
        </h1>
        <p className="text-gray-500 font-medium mt-1">Manage maintenance alerts, pre-trip inspections, and tyre logs.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
            <div className="flex items-center"><AlertTriangle className="mr-2 text-rose-500" size={20} /> Active Maintenance Alerts</div>
            <button className="bg-rose-50 text-rose-600 px-3 py-1 rounded text-sm font-bold flex items-center">
              <Plus size={16} className="mr-1"/> Log Issue
            </button>
          </h2>
          <div className="space-y-4">
            {alerts.map((a) => (
              <div key={a.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <p className="font-bold text-gray-900">{a.issue}</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">Vehicle: {a.vehicle?.registrationNo} • Reported: {new Date(a.reportedAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded uppercase tracking-wider ${a.severity === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                  {a.severity}
                </span>
              </div>
            ))}
            {alerts.length === 0 && <p className="text-gray-400 text-sm font-medium">No active maintenance alerts.</p>}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center"><ShieldCheck className="mr-2 text-indigo-500" size={20} /> Inspections</h2>
          <div className="p-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold cursor-pointer hover:bg-indigo-100 transition-colors">
            Log Pre-Trip Inspection
          </div>
          <div className="p-4 bg-gray-50 text-gray-700 rounded-2xl font-bold cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200">
            Log Post-Trip Inspection
          </div>
        </div>
      </div>
    </div>
  );
}
