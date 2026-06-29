import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Truck, ArrowLeft, QrCode, ShieldCheck, Map, Activity, FileText, Upload, Plus } from 'lucide-react';

export default function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetch(`/api/vehicles/${id}`).then(r => r.json()).then(setVehicle).catch(console.error);
  }, [id]);

  if (!vehicle) return <div className="p-8 text-center font-bold text-gray-500 animate-pulse">Loading Vehicle Profile...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col relative">
      <Link to="/vehicles/list" className="absolute top-8 right-8 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 font-bold flex items-center gap-2"><ArrowLeft size={16}/> Back to Fleet</Link>

      <div className="flex items-start gap-6 mb-8 mt-2">
         <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm shrink-0">
            <Truck size={48} />
         </div>
         <div>
            <div className="flex items-center gap-3">
               <h1 className="text-4xl font-black text-gray-900 tracking-tight">{vehicle.plateNumber}</h1>
               <span className={`px-4 py-1 rounded-full font-bold text-sm border ${vehicle.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                  {vehicle.status}
               </span>
            </div>
            <p className="text-xl font-bold text-gray-500 mt-1">{vehicle.make || 'Unknown Make'} {vehicle.model || 'Unknown Model'} • {vehicle.year || 'N/A'}</p>
            <div className="flex gap-4 mt-3">
               <p className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1"><QrCode size={12}/> {vehicle.barcode}</p>
               <p className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-wider">{vehicle.type} ({vehicle.capacity} KG)</p>
            </div>
         </div>
      </div>

      <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl mb-6 w-max shrink-0">
         {['overview', 'documents', 'maintenance', 'telemetry', 'audit'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2.5 rounded-xl font-bold capitalize transition-all ${activeTab === tab ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:bg-gray-200'}`}>
               {tab}
            </button>
         ))}
      </div>

      <div className="flex-1 overflow-auto">
         {activeTab === 'overview' && (
            <div className="grid grid-cols-3 gap-6">
               <div className="col-span-2 space-y-6">
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Settings2Icon className="text-gray-400"/> Technical Specifications</h3>
                     <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                        <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500 font-medium">Category</span><span className="font-bold text-gray-900">{vehicle.category}</span></div>
                        <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500 font-medium">Fuel Type</span><span className="font-bold text-gray-900">{vehicle.fuelType || 'Diesel'}</span></div>
                        <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500 font-medium">Ownership</span><span className="font-bold text-gray-900">{vehicle.ownershipType}</span></div>
                        <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500 font-medium">GPS Device ID</span><span className="font-bold text-gray-900">{vehicle.GPSDevice?.imei || 'Not Installed'}</span></div>
                     </div>
                  </div>
                  
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Activity className="text-emerald-500"/> Recent Trips</h3>
                     {vehicle.trips?.length > 0 ? (
                        <div className="space-y-3">
                           {vehicle.trips.map((t: any) => (
                              <div key={t.id} className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
                                 <div><p className="font-bold text-gray-900">{t.origin} ➔ {t.destination}</p><p className="text-xs text-gray-500 mt-1">{new Date(t.startTime).toLocaleDateString()}</p></div>
                                 <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700">{t.status}</span>
                              </div>
                           ))}
                        </div>
                     ) : <p className="text-gray-500 font-medium italic">No recent trips.</p>}
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-bl-full"></div>
                     <h3 className="font-bold text-lg mb-2 relative z-10">Current Assignment</h3>
                     {vehicle.assignedDriver ? (
                        <div className="relative z-10 mt-4">
                           <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-xl font-black mb-3">{vehicle.assignedDriver.name.charAt(0)}</div>
                           <p className="font-black text-xl">{vehicle.assignedDriver.name}</p>
                           <p className="text-slate-400 text-sm mt-1 flex items-center gap-2"><PhoneIcon className="w-4 h-4"/> {vehicle.assignedDriver.phone}</p>
                        </div>
                     ) : (
                        <p className="text-slate-400 font-medium mt-4 relative z-10 italic">Vehicle is currently sitting idle in the yard.</p>
                     )}
                     <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors">Reassign Driver</button>
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'documents' && (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl text-gray-900">Compliance Documents</h3>
                  <button className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl flex items-center gap-2 hover:bg-indigo-100"><Upload size={16}/> Upload Document</button>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  {vehicle.documents?.map((doc: any) => (
                     <div key={doc.id} className="p-5 border border-gray-200 rounded-2xl flex items-start gap-4 hover:border-indigo-300 transition-colors cursor-pointer">
                        <div className={`p-3 rounded-xl ${doc.status === 'Valid' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}><FileText size={24}/></div>
                        <div>
                           <h4 className="font-black text-gray-900 text-lg">{doc.type}</h4>
                           <p className="text-sm font-bold text-gray-500 mt-1">Doc No: {doc.documentNo}</p>
                           <p className="text-xs text-gray-400 mt-1">Expires: {new Date(doc.expiryDate).toLocaleDateString()}</p>
                        </div>
                        <div className="ml-auto">
                           <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${doc.status === 'Valid' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{doc.status}</span>
                        </div>
                     </div>
                  ))}
                  {vehicle.documents?.length === 0 && <p className="col-span-2 p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-400 font-bold">No documents uploaded.</p>}
               </div>
            </div>
         )}

         {activeTab === 'audit' && (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
               <h3 className="font-bold text-xl text-gray-900 mb-6">Audit Trail</h3>
               <div className="space-y-6 pl-4 border-l-2 border-gray-100">
                  {vehicle.auditLogs?.map((log: any) => (
                     <div key={log.id} className="relative">
                        <div className="absolute -left-6 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full mt-1.5"></div>
                        <p className="text-xs font-bold text-gray-400 mb-1">{new Date(log.timestamp).toLocaleString()}</p>
                        <p className="font-bold text-gray-900 bg-gray-50 inline-block px-3 py-1 rounded-lg mb-2">{log.action}</p>
                        <p className="text-gray-600">{log.description}</p>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
    </div>
  );
}

// Icons
function Settings2Icon({ className }: { className?: string }) { return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>; }
function PhoneIcon({ className }: { className?: string }) { return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>; }
