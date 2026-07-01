import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle, Wrench, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function PreventiveMaintenanceCalendar() {
  const [schedules, setSchedules] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/maintenance/preventive/schedules')
      .then(res => res.json())
      .then(setSchedules)
      .catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <Calendar className="mr-3 text-amber-500" size={32} /> Preventive Maintenance
          </h1>
          <p className="text-gray-500 font-medium mt-1">Algorithmically scheduled service intervals based on time and mileage.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <AlertCircle className="mr-2 text-rose-500" size={24} /> Overdue & Upcoming
          </h2>
          <div className="space-y-4">
            {schedules.map(schedule => (
              <div key={schedule.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-amber-200 transition-colors">
                <div className="flex items-center space-x-6">
                  <div className={`p-4 rounded-2xl ${schedule.status === 'Overdue' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                    <Wrench size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{schedule.vehicle?.registrationNo}</h3>
                    <p className="text-gray-500 font-medium">{schedule.plan?.name} • Due: {schedule.nextDueDate ? new Date(schedule.nextDueDate).toLocaleDateString() : `${schedule.nextDueMileage} KM`}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${schedule.status === 'Overdue' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                    {schedule.status}
                  </span>
                  <button className="px-4 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
                    Create Job Card
                  </button>
                </div>
              </div>
            ))}
            {schedules.length === 0 && (
              <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 border-dashed">
                <ShieldCheck size={48} className="mx-auto text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">All Caught Up!</h3>
                <p className="text-gray-500 font-medium">There are no upcoming or overdue maintenance schedules.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <CheckCircle2 className="mr-2 text-emerald-500" size={24} /> Active Maintenance Plans
          </h2>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center border border-gray-100">
              <div>
                <p className="font-bold text-gray-900">10,000 KM Standard Service</p>
                <p className="text-sm font-medium text-gray-500">Mileage Based</p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center border border-gray-100">
              <div>
                <p className="font-bold text-gray-900">6 Month Safety Inspection</p>
                <p className="text-sm font-medium text-gray-500">Time Based</p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
            <button className="w-full py-3 bg-amber-50 text-amber-700 font-bold rounded-xl hover:bg-amber-100 transition-colors">
              Manage Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
