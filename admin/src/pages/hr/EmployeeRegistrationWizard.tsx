import React, { useState } from 'react';
import { UserPlus, Briefcase, FileText, CheckCircle, UploadCloud } from 'lucide-react';

export default function EmployeeRegistrationWizard() {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Employee Onboarding Wizard</h1>
        <p className="text-sm text-gray-500 mt-2">Create a new employee profile and trigger the IT asset onboarding sequence.</p>
      </div>

      {/* Stepper */}
      <div className="flex justify-center mb-10">
         <div className="flex items-center space-x-4">
            {[
              { id: 1, name: 'Personal Details', icon: UserPlus },
              { id: 2, name: 'Employment Details', icon: Briefcase },
              { id: 3, name: 'Identity & Compliance', icon: FileText },
            ].map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className={`flex flex-col items-center w-32 ${step >= s.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold shadow-sm transition-all ${step >= s.id ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 'bg-gray-100'}`}>
                      {step > s.id ? <CheckCircle size={20}/> : <s.icon size={18}/>}
                   </div>
                   <span className="text-xs font-bold text-center">{s.name}</span>
                </div>
                {idx < 2 && <div className={`w-16 h-1 rounded-full ${step > s.id ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>}
              </React.Fragment>
            ))}
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
         {step === 1 && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Personal Information</h2>
             <div className="grid grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                   <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g. John" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                   <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Smith" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Official Email <span className="text-red-500">*</span></label>
                   <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="john.smith@acmecorp.com" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                   <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                   <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                      <option>Select Gender</option><option>Male</option><option>Female</option><option>Other</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                   <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                      <option>United States</option><option>United Kingdom</option><option>India</option>
                   </select>
                </div>
             </div>
           </div>
         )}

         {step === 2 && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Employment Details</h2>
             <div className="grid grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                   <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Senior Manager" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                   <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                      <option>Operations</option><option>Finance</option><option>Warehouse</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                   <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                      <option>Permanent Full-Time</option><option>Contractor</option><option>Intern</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date <span className="text-red-500">*</span></label>
                   <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Manager</label>
                   <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                      <option>Search directory...</option>
                      <option>EMP-1001: Michael Chang (Warehouse Head)</option>
                   </select>
                </div>
             </div>
           </div>
         )}

         {step === 3 && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Identity & Compliance</h2>
             <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                <p className="text-sm text-blue-800">You must upload at least one valid Government ID (Aadhaar, PAN, SSN, or Passport) to comply with logistics background verification regulations.</p>
             </div>
             
             <div className="grid grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                   <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                      <option>Passport</option><option>National ID</option><option>Driving License</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Document Number</label>
                   <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g. A12345678" />
                </div>
                <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-2">Upload Scan copy</label>
                   <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:border-indigo-500 hover:bg-indigo-50 transition cursor-pointer">
                      <UploadCloud size={32} className="mb-3 text-indigo-500" />
                      <p className="text-sm font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs mt-1">PDF, JPG, PNG (Max 5MB)</p>
                   </div>
                </div>
             </div>
           </div>
         )}

         <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button 
              onClick={() => setStep(step > 1 ? step - 1 : 1)}
              className={`px-6 py-2 border border-gray-200 rounded-xl text-sm font-medium ${step === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              disabled={step === 1}
            >
              Back
            </button>
            <button 
              onClick={() => setStep(step < 3 ? step + 1 : 3)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-sm"
            >
              {step === 3 ? 'Submit Registration & Trigger Onboarding' : 'Save & Continue'}
            </button>
         </div>
      </div>
    </div>
  );
}
