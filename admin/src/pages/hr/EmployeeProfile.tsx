import React from 'react';
import { Mail, Phone, MapPin, Briefcase, FileText, Building2, ShieldCheck, Clock, CheckCircle } from 'lucide-react';

export default function EmployeeProfile() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="px-8 pb-8 relative">
             <div className="absolute -top-12 w-24 h-24 rounded-2xl bg-white p-2 shadow-sm border border-gray-100">
                <div className="w-full h-full bg-indigo-100 rounded-xl flex items-center justify-center text-3xl font-extrabold text-indigo-700">JS</div>
             </div>
             <div className="mt-14 flex justify-between items-start">
                <div>
                   <h1 className="text-2xl font-bold text-gray-900">John Smith</h1>
                   <p className="text-sm font-medium text-indigo-600">Head of Operations <span className="text-gray-400 mx-2">•</span> EMP-1045</p>
                </div>
                <div className="flex space-x-3">
                   <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-700 shadow-sm">Edit Profile</button>
                </div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center"><Building2 className="mr-2 text-indigo-600" size={18}/> Employment</h3>
                <div className="space-y-4 text-sm">
                   <div><p className="text-gray-500 text-xs">Department</p><p className="font-medium text-gray-900">Operations & Logistics</p></div>
                   <div><p className="text-gray-500 text-xs">Reporting Manager</p><p className="font-medium text-indigo-600 hover:underline cursor-pointer">Sarah Jenkins</p></div>
                   <div><p className="text-gray-500 text-xs">Joining Date</p><p className="font-medium text-gray-900">Oct 12, 2023</p></div>
                   <div><p className="text-gray-500 text-xs">Work Mode</p><span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 font-bold text-xs rounded-md">HYBRID</span></div>
                </div>
             </div>

             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center"><ShieldCheck className="mr-2 text-indigo-600" size={18}/> Compliance</h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm"><FileText size={16} className="text-gray-400 mr-2"/> Aadhaar / SSN</div>
                      <CheckCircle size={16} className="text-green-500"/>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm"><FileText size={16} className="text-gray-400 mr-2"/> Bank Details</div>
                      <CheckCircle size={16} className="text-green-500"/>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm"><FileText size={16} className="text-gray-400 mr-2"/> NDA Signed</div>
                      <CheckCircle size={16} className="text-green-500"/>
                   </div>
                </div>
             </div>
          </div>

          <div className="md:col-span-2 space-y-6">
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Personal Information</h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm">
                   <div><p className="text-gray-500 text-xs mb-1">Official Email</p><div className="flex items-center font-medium"><Mail size={14} className="mr-2 text-gray-400"/> john.s@company.com</div></div>
                   <div><p className="text-gray-500 text-xs mb-1">Mobile Number</p><div className="flex items-center font-medium"><Phone size={14} className="mr-2 text-gray-400"/> +1 (555) 019-2831</div></div>
                   <div><p className="text-gray-500 text-xs mb-1">Location</p><div className="flex items-center font-medium"><MapPin size={14} className="mr-2 text-gray-400"/> New York HQ, USA</div></div>
                   <div><p className="text-gray-500 text-xs mb-1">Date of Birth</p><p className="font-medium">March 14, 1988</p></div>
                   <div><p className="text-gray-500 text-xs mb-1">Nationality</p><p className="font-medium">United States</p></div>
                </div>
             </div>

             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Onboarding Timeline</h3>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                   <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-white bg-indigo-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                         <div className="flex items-center justify-between mb-1">
                            <div className="font-bold text-gray-900 text-sm">Account Provisioned</div>
                            <div className="text-xs text-indigo-600 font-medium">Completed</div>
                         </div>
                         <div className="text-xs text-gray-500">Email, Slack, and ERP access granted.</div>
                      </div>
                   </div>
                   <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-white bg-indigo-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                         <div className="flex items-center justify-between mb-1">
                            <div className="font-bold text-gray-900 text-sm">IT Assets Assigned</div>
                            <div className="text-xs text-indigo-600 font-medium">Completed</div>
                         </div>
                         <div className="text-xs text-gray-500">MacBook Pro M2 assigned (Tag: LPT-1092)</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
