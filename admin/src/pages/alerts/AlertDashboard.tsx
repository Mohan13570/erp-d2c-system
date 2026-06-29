import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2, Siren, Clock } from 'lucide-react';

export default function AlertDashboard() {
  const [alerts, setAlerts] = useState<any[]>([]);

  const fetchAlerts = () => {
    fetch('/api/alerts').then(r => r.json()).then(setAlerts).catch(console.error);
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const acknowledgeAlert = async (id: string) => {
     await fetch(`/api/alerts/${id}/status`, {
        method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ status: 'Acknowledged' })
     });
     fetchAlerts();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
             <Bell className="text-red-500"/> Alert Command Center
          </h1>
          <p className="text-gray-500 font-medium mt-1">Real-time SOS, Overspeed, and Geofence violation monitor.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8 shrink-0">
         <div className="bg-red-50 border border-red-200 p-6 rounded-3xl flex items-center gap-4">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-600"><Siren size={28}/></div>
            <div><p className="text-sm font-bold text-red-600 uppercase">Critical (Open)</p><h2 className="text-3xl font-black text-red-900">{alerts.filter(a => a.status === 'Open').length}</h2></div>
         </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex-1 overflow-auto p-4">
         <table className="w-full text-left border-collapse">
            <thead className="text-gray-400 text-xs uppercase font-bold sticky top-0 bg-white">
               <tr>
                  <th className="px-6 py-4 border-b">Timestamp</th>
                  <th className="px-6 py-4 border-b">Severity</th>
                  <th className="px-6 py-4 border-b">Event Details</th>
                  <th className="px-6 py-4 border-b">Asset</th>
                  <th className="px-6 py-4 border-b">Status</th>
                  <th className="px-6 py-4 border-b text-right">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {alerts.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4 text-sm text-gray-500 font-medium flex items-center gap-2"><Clock size={14}/> {new Date(a.timestamp).toLocaleString()}</td>
                     <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                           a.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                           a.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                           'bg-yellow-100 text-yellow-700'
                        }`}>{a.severity}</span>
                     </td>
                     <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{a.type}</p>
                        <p className="text-sm text-gray-500">{a.message}</p>
                     </td>
                     <td className="px-6 py-4 font-bold text-indigo-600">{a.vehicle?.plateNumber || 'Unknown'}</td>
                     <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded text-xs font-bold ${a.status === 'Open' ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-gray-100 text-gray-600'}`}>{a.status}</span>
                     </td>
                     <td className="px-6 py-4 text-right">
                        {a.status === 'Open' && (
                           <button onClick={() => acknowledgeAlert(a.id)} className="px-4 py-2 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 rounded-lg font-bold text-sm transition-colors">Acknowledge</button>
                        )}
                     </td>
                  </tr>
               ))}
               {alerts.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-gray-400 font-medium">No alerts detected.</td></tr>}
            </tbody>
         </table>
      </div>
    </div>
  );
}
