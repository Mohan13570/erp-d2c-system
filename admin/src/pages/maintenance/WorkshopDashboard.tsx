import React, { useState, useEffect } from 'react';
import { Hammer, Users, PenTool, CheckCircle, Clock, Wrench } from 'lucide-react';

export default function WorkshopDashboard() {
  const [workshops, setWorkshops] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/maintenance/workshop/dashboard')
      .then(res => res.json())
      .then(setWorkshops)
      .catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <Hammer className="mr-3 text-indigo-600" size={32} /> Workshop Dashboard
          </h1>
          <p className="text-gray-500 font-medium mt-1">Live kanban overview of workshop bays, mechanics, and active Job Cards.</p>
        </div>
      </div>

      {workshops.map(workshop => (
        <div key={workshop.id} className="space-y-6">
          <h2 className="text-2xl font-black text-gray-800">{workshop.name} <span className="text-lg text-gray-400 font-medium ml-2">• {workshop.location}</span></h2>
          
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* To-Do / Open Column */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                    <span>Pending Job Cards</span>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">Open</span>
                  </h3>
                  <div className="space-y-4">
                    {workshop.jobCards?.filter((jc: any) => jc.status === 'Open').map((jc: any) => (
                      <div key={jc.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-indigo-700">{jc.vehicle?.registrationNo}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-700">{jc.description}</p>
                        <button className="mt-4 w-full py-2 bg-indigo-600 text-white font-bold text-sm rounded-xl">Assign to Bay</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* In Progress Column */}
                <div className="bg-white rounded-3xl p-6 border border-amber-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                    <span>Active Repairs</span>
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs">In Progress</span>
                  </h3>
                  <div className="space-y-4">
                    {workshop.jobCards?.filter((jc: any) => jc.status === 'In-Progress').map((jc: any) => (
                      <div key={jc.id} className="p-4 bg-amber-50 border border-amber-100 rounded-2xl relative overflow-hidden">
                        <div className="flex justify-between items-start mb-2 relative z-10">
                          <span className="font-bold text-gray-900">{jc.vehicle?.registrationNo}</span>
                          <span className="text-xs font-bold text-amber-700 bg-amber-200 px-2 py-1 rounded">{jc.bay?.name}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-700 relative z-10">{jc.description}</p>
                        <div className="mt-3 flex items-center text-xs font-bold text-gray-500 relative z-10">
                          <Wrench size={14} className="mr-1" /> Mechanic: {jc.mechanic?.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QA Column */}
                <div className="bg-white rounded-3xl p-6 border border-emerald-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                    <span>Quality Assurance</span>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs">QA Check</span>
                  </h3>
                  <div className="space-y-4">
                    {workshop.jobCards?.filter((jc: any) => jc.status === 'QA').map((jc: any) => (
                      <div key={jc.id} className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-gray-900">{jc.vehicle?.registrationNo}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-700">{jc.description}</p>
                        <button className="mt-4 w-full py-2 bg-emerald-600 text-white font-bold text-sm rounded-xl flex justify-center items-center">
                          <CheckCircle size={16} className="mr-2"/> Sign Off & Close
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            <div className="xl:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Users size={20} className="mr-2 text-indigo-500"/> Mechanics on Duty</h3>
                <div className="space-y-3">
                  {workshop.mechanics?.map((m: any) => (
                    <div key={m.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{m.name}</p>
                        <p className="text-xs text-gray-500 font-medium">{m.specialization || 'General'}</p>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${m.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
