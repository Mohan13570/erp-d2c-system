import React, { useState } from 'react';
import { UserCheck, CalendarDays, Wallet, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EmployeePortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('attendance');

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Employee Self-Service</h1>
          <p className="text-gray-500 font-medium mt-1">Hello, {user?.firstName}. View your HR details.</p>
        </div>
      </div>

      <div className="flex space-x-4 mb-8 border-b border-gray-200">
        <button onClick={() => setActiveTab('attendance')} className={`pb-4 px-2 font-bold flex items-center space-x-2 border-b-2 ${activeTab === 'attendance' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}><Clock size={18}/><span>Attendance</span></button>
        <button onClick={() => setActiveTab('leave')} className={`pb-4 px-2 font-bold flex items-center space-x-2 border-b-2 ${activeTab === 'leave' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}><CalendarDays size={18}/><span>Leave Management</span></button>
        <button onClick={() => setActiveTab('payroll')} className={`pb-4 px-2 font-bold flex items-center space-x-2 border-b-2 ${activeTab === 'payroll' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}><Wallet size={18}/><span>My Payslips</span></button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {activeTab === 'attendance' && (
          <div className="flex flex-col items-center py-12">
            <div className="bg-teal-50 text-teal-700 px-6 py-3 rounded-full font-bold text-2xl mb-8 flex items-center shadow-sm">
              <Clock className="mr-3"/> {new Date().toLocaleTimeString()}
            </div>
            <div className="flex gap-4">
               <button className="bg-teal-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-teal-700 shadow-md">Clock In</button>
               <button className="bg-gray-200 text-gray-700 font-bold px-8 py-4 rounded-2xl hover:bg-gray-300">Clock Out</button>
            </div>
          </div>
        )}
        {activeTab === 'leave' && (
          <div className="max-w-md">
            <h3 className="text-lg font-bold mb-4">Request Leave</h3>
            <div className="flex gap-4 mb-4">
              <input type="date" title="Start Date" className="w-full p-3 border border-gray-200 rounded-xl text-gray-500" />
              <input type="date" title="End Date" className="w-full p-3 border border-gray-200 rounded-xl text-gray-500" />
            </div>
            <textarea placeholder="Reason for leave..." rows={4} className="w-full p-3 border border-gray-200 rounded-xl mb-4"></textarea>
            <button className="bg-teal-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-teal-700">Submit Request</button>
          </div>
        )}
        {activeTab === 'payroll' && (
          <div className="text-center py-12">
            <Wallet size={48} className="mx-auto text-teal-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Payslips Generated</h3>
            <p className="text-gray-500">Your payslips will appear here once processed by Finance.</p>
          </div>
        )}
      </div>
    </div>
  );
}
