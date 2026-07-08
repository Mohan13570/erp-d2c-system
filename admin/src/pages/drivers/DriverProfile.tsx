import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Star, Activity, Phone, ShieldAlert, CreditCard, HeartPulse, FileText } from 'lucide-react';

export default function DriverProfile() {
  const { id } = useParams();
  const [driver, setDriver] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetch(`/api/drivers/${id}`).then(r => r.json()).then(setDriver).catch(console.error);
  }, [id]);

  if (!driver) return <div className="p-8 text-center font-bold text-gray-500 animate-pulse">Loading Driver Profile...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col relative">
      <Link to="/drivers/list" className="absolute top-8 right-8 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 font-bold flex items-center gap-2 shadow-sm"><ArrowLeft size={16}/> Back to Roster</Link>

      <div className="flex items-start gap-6 mb-8 mt-2">
         <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-lg shrink-0 border-4 border-white">
            {driver.name.charAt(0)}
         </div>
         <div>
            <div className="flex items-center gap-3">
               <h1 className="text-4xl font-black text-gray-900 tracking-tight">{driver.name}</h1>
               <span className={`px-4 py-1 rounded-full font-bold text-sm border ${driver.availability === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                  {driver.availability}
               </span>
            </div>
            <p className="text-xl font-bold text-gray-500 mt-1 uppercase tracking-wide">License: {driver.licenseNo}</p>
            <div className="flex gap-4 mt-3">
               <p className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold flex items-center gap-1"><Star size={12} className="text-amber-500 fill-amber-500"/> {driver.rating?.toFixed(1) || '5.0'} Rating</p>
               <p className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold flex items-center gap-1"><Phone size={12}/> {driver.phone}</p>
            </div>
         </div>
      </div>

      <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl mb-6 w-max shrink-0">
         {['overview', 'documents', 'shifts', 'violations', 'audit'].map(tab => (
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
                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><HeartPulse className="text-red-500"/> Health & Emergency</h3>
                     <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                        <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500 font-medium">Blood Group</span><span className="font-bold text-gray-900">{driver.bloodGroup || 'N/A'}</span></div>
                        <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500 font-medium">Medical Expiry</span><span className="font-bold text-gray-900">{driver.medicalCertExpiry ? new Date(driver.medicalCertExpiry).toLocaleDateString() : 'N/A'}</span></div>
                        <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500 font-medium">Emergency Contact</span><span className="font-bold text-gray-900">{driver.emergencyContact || 'N/A'}</span></div>
                        <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500 font-medium">Emergency Phone</span><span className="font-bold text-gray-900">{driver.emergencyPhone || 'N/A'}</span></div>
                     </div>
                  </div>
                  
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><CreditCard className="text-emerald-500"/> Payroll Details</h3>
                     <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                        <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500 font-medium">Payroll ID</span><span className="font-bold text-gray-900">{driver.payrollId || 'N/A'}</span></div>
                        <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500 font-medium">Hourly Rate</span><span className="font-bold text-gray-900">${driver.hourlyRate?.toFixed(2) || '0.00'}</span></div>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-bl-full"></div>
                     <h3 className="font-bold text-lg mb-2 relative z-10">Assigned Vehicle</h3>
                     {driver.assignedVehicles && driver.assignedVehicles.length > 0 ? (
                        <div className="relative z-10 mt-4">
                           <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center text-xl font-black mb-3"><Activity size={24}/></div>
                           <p className="font-black text-xl tracking-wider">{driver.assignedVehicles[0].plateNumber}</p>
                           <p className="text-slate-400 text-sm mt-1">{driver.assignedVehicles[0].make} {driver.assignedVehicles[0].model}</p>
                        </div>
                     ) : (
                        <p className="text-slate-400 font-medium mt-4 relative z-10 italic">No vehicle currently assigned.</p>
                     )}
                     <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors shadow-sm border border-white/5">Reassign Vehicle</button>
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'violations' && (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
               <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2"><ShieldAlert className="text-red-500"/> Violation & Penalty Records</h3>
               {driver.violations?.length > 0 ? (
                  <div className="space-y-4">
                     {driver.violations.map((v: any) => (
                        <div key={v.id} className="p-4 border border-red-100 bg-red-50/30 rounded-2xl flex justify-between items-center">
                           <div>
                              <p className="font-black text-red-700">{v.violationType}</p>
                              <p className="text-sm text-gray-600 mt-1">{v.description || 'No description provided'}</p>
                              <p className="text-xs text-gray-400 mt-1 font-bold">{new Date(v.date).toLocaleString()}</p>
                           </div>
                           <div className="text-right">
                              <p className="font-black text-xl text-gray-900">-${v.penaltyAmount?.toFixed(2)}</p>
                              <span className={`text-xs font-bold px-2 py-1 rounded-md mt-1 inline-block ${v.deducted ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{v.deducted ? 'Deducted' : 'Pending Deduction'}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <p className="text-gray-500 font-bold italic text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">Excellent record! No violations logged.</p>
               )}
            </div>
         )}
         
         {activeTab === 'audit' && (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
               <h3 className="font-bold text-xl text-gray-900 mb-6">HR Audit Trail</h3>
               <div className="space-y-6 pl-4 border-l-2 border-gray-100">
                  {driver.auditLogs?.map((log: any) => (
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

         {/* Placeholders for documents and shifts which follow similar UI patterns */}
         {(activeTab === 'documents' || activeTab === 'shifts') && (
            <div className="bg-white rounded-3xl border border-gray-100 p-16 shadow-sm flex flex-col items-center justify-center text-gray-400">
               <FileText size={48} className="mb-4 text-gray-200" />
               <h3 className="font-bold text-xl text-gray-900">Module Component Loaded</h3>
               <p className="font-medium mt-2">Connecting to live datastore for {activeTab}...</p>
            </div>
         )}
      </div>
    </div>
  );
}
