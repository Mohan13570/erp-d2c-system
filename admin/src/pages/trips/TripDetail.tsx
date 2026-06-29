import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Truck, CheckCircle2, Navigation, DollarSign, Activity, FileText } from 'lucide-react';

export default function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetch(`/api/trips/${id}`).then(r => r.json()).then(setTrip).catch(console.error);
  }, [id]);

  const updateStatus = async (status: string) => {
     if(confirm(`Update trip status to ${status}?`)) {
        const r = await fetch(`/api/trips/${id}/status`, {
           method: 'PUT', headers: {'Content-Type': 'application/json'},
           body: JSON.stringify({ status })
        });
        if(r.ok) window.location.reload();
     }
  };

  const addExpense = async () => {
     const amt = prompt('Enter fuel expense amount ($):');
     if(amt) {
        const r = await fetch(`/api/trips/${id}/expenses`, {
           method: 'POST', headers: {'Content-Type': 'application/json'},
           body: JSON.stringify({ fuelCost: parseFloat(amt) })
        });
        if(r.ok) window.location.reload();
     }
  };

  if (!trip) return <div className="p-8 text-center font-bold text-gray-500 animate-pulse">Loading Trip Data...</div>;

  const expenses = (trip.fuelCost || 0) + (trip.tollExpenses || 0) + (trip.otherExpenses || 0);
  const profit = (trip.revenue || 0) - expenses;

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col relative">
      <Link to="/trips" className="absolute top-8 right-8 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 font-bold flex items-center gap-2 shadow-sm"><ArrowLeft size={16}/> Back</Link>

      <div className="mb-8">
         <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight font-mono">{trip.tripNumber?.split('-')[0].toUpperCase()}</h1>
            <span className={`px-4 py-1.5 rounded-full font-bold text-sm border flex items-center gap-1.5 ${trip.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
               <div className={`w-2 h-2 rounded-full ${trip.status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'}`}></div>
               {trip.status}
            </span>
         </div>
         <p className="text-xl font-bold text-gray-500 mt-2 flex items-center gap-3">
            <span>{trip.origin}</span> <ArrowLeft size={16} className="rotate-180"/> <span>{trip.destination}</span>
         </p>
      </div>

      <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl mb-6 w-max shrink-0">
         {['overview', 'timeline', 'financials', 'audit'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2.5 rounded-xl font-bold capitalize transition-all ${activeTab === tab ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:bg-gray-200'}`}>
               {tab}
            </button>
         ))}
      </div>

      <div className="flex-1 overflow-auto">
         {activeTab === 'overview' && (
            <div className="grid grid-cols-3 gap-6">
               <div className="col-span-2 space-y-6">
                  
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><MapPin className="text-orange-500"/> Route Waypoints</h3>
                     <div className="space-y-4">
                        <div className="flex gap-4 items-center">
                           <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">O</div>
                           <div className="font-bold text-gray-900 flex-1">{trip.origin}</div>
                           <div className="text-sm font-bold text-gray-400">Origin</div>
                        </div>
                        {trip.stops.map((stop: any, idx: number) => (
                           <div key={stop.id} className="flex gap-4 items-center relative before:absolute before:-top-4 before:left-4 before:w-0.5 before:h-4 before:bg-gray-200">
                              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm">{idx+1}</div>
                              <div className="font-bold text-gray-900 flex-1">{stop.locationName}</div>
                              <div className={`text-sm font-bold px-2 py-1 rounded ${stop.type === 'Pickup' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>{stop.type}</div>
                           </div>
                        ))}
                        <div className="flex gap-4 items-center relative before:absolute before:-top-4 before:left-4 before:w-0.5 before:h-4 before:bg-gray-200">
                           <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm">D</div>
                           <div className="font-bold text-gray-900 flex-1">{trip.destination}</div>
                           <div className="text-sm font-bold text-gray-400">Destination</div>
                        </div>
                     </div>
                  </div>

               </div>

               <div className="space-y-6">
                  <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Truck className="text-blue-400"/> Assigned Assets</h3>
                     <div className="space-y-4">
                        <div>
                           <p className="text-slate-400 text-sm font-medium">Vehicle</p>
                           <p className="font-bold text-xl">{trip.vehicle.plateNumber}</p>
                        </div>
                        <div>
                           <p className="text-slate-400 text-sm font-medium">Driver</p>
                           <p className="font-bold text-xl">{trip.driver.firstName} {trip.driver.lastName}</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Activity className="text-indigo-500"/> Dispatch Controls</h3>
                     <div className="space-y-3">
                        <button onClick={() => updateStatus('Dispatched')} className="w-full py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-colors">Mark as Dispatched</button>
                        <button onClick={() => updateStatus('InTransit')} className="w-full py-3 bg-blue-50 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition-colors">Mark In-Transit</button>
                        <button onClick={() => updateStatus('Completed')} className="w-full py-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold hover:bg-emerald-100 transition-colors">Mark Completed</button>
                     </div>
                  </div>
               </div>
            </div>
         )}
         
         {activeTab === 'financials' && (
            <div className="max-w-3xl">
               <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                     <h3 className="font-bold text-emerald-700 uppercase tracking-wider text-sm">Total Revenue</h3>
                     <h2 className="text-5xl font-black text-emerald-900 mt-2">${trip.revenue.toFixed(2)}</h2>
                  </div>
                  <div className="bg-indigo-900 p-6 rounded-3xl text-white">
                     <h3 className="font-bold text-indigo-300 uppercase tracking-wider text-sm">Net Profit</h3>
                     <h2 className="text-5xl font-black mt-2">${profit.toFixed(2)}</h2>
                  </div>
               </div>
               
               <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold text-xl">Trip Expenses</h3>
                     <button onClick={addExpense} className="text-indigo-600 font-bold hover:bg-indigo-50 px-4 py-2 rounded-lg">+ Add Fuel</button>
                  </div>
                  <div className="space-y-4 font-mono text-lg">
                     <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Fuel Cost</span><span className="font-bold">${trip.fuelCost.toFixed(2)}</span></div>
                     <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Tolls</span><span className="font-bold">${trip.tollExpenses.toFixed(2)}</span></div>
                     <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Other</span><span className="font-bold">${trip.otherExpenses.toFixed(2)}</span></div>
                     <div className="flex justify-between text-red-500 pt-2"><span className="font-bold">Total Expenses</span><span className="font-black">${expenses.toFixed(2)}</span></div>
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'audit' && (
            <div className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white font-mono min-h-full">
               <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><FileText className="text-slate-400"/> Operational Audit Trail</h3>
               <div className="space-y-4">
                  {trip.auditLogs?.map((log: any) => (
                     <div key={log.id} className="flex gap-4 text-sm border-b border-slate-800 pb-3">
                        <span className="text-slate-500 w-48 shrink-0">{new Date(log.timestamp).toLocaleString()}</span>
                        <span className={`w-36 shrink-0 font-bold ${log.action === 'StatusChanged' ? 'text-indigo-400' : log.action === 'ExpenseAdded' ? 'text-red-400' : 'text-emerald-400'}`}>[{log.action}]</span>
                        <span className="text-slate-300">{log.description}</span>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
    </div>
  );
}
