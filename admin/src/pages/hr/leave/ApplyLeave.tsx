import React, { useState } from 'react';
import { Calendar, UploadCloud, Plane, HelpCircle, AlertCircle } from 'lucide-react';

export default function ApplyLeave() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Apply for Time Off</h1>
          <p className="text-sm text-gray-500 mt-1">Submit your leave request for manager approval.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
               <div className="space-y-6">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Leave Type</label>
                     <select className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                        <option>Casual Leave (CL)</option>
                        <option>Sick Leave (SL)</option>
                        <option>Earned/Annual Leave (EL)</option>
                        <option>Comp-Off</option>
                        <option>Loss of Pay (LOP)</option>
                     </select>
                     <p className="text-xs text-green-600 mt-2 font-medium flex items-center"><HelpCircle size={12} className="mr-1"/> You have 12.5 days of Casual Leave remaining.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">From Date</label>
                        <input type="date" className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">To Date</label>
                        <input type="date" className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                     </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start">
                     <AlertCircle size={18} className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                     <div>
                        <h4 className="text-sm font-bold text-blue-900">Total Duration: 3 Days</h4>
                        <p className="text-xs text-blue-700 mt-1">This request does not conflict with any company holidays. Your reporting manager, Jane Doe, will be notified.</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Reason for Leave</label>
                     <textarea rows={4} className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Please provide a brief reason for your absence..."></textarea>
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Backup / Delegated Employee</label>
                     <select className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Select a colleague to handle urgent queries...</option>
                        <option>Michael Chang (EMP-204)</option>
                        <option>Sarah Jenkins (EMP-182)</option>
                     </select>
                     <p className="text-xs text-gray-500 mt-2">Optional. They will be notified to cover your responsibilities.</p>
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Supporting Documents</label>
                     <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer">
                        <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-indigo-600">Click to upload medical certificate</p>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG up to 5MB</p>
                     </div>
                  </div>
               </div>

            </div>
         </div>
         <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
            <button className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 shadow-sm">Cancel</button>
            <button className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm flex items-center">
               <Plane size={16} className="mr-2"/> Submit Leave Request
            </button>
         </div>
      </div>
    </div>
  );
}
