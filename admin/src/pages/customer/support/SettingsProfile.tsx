import React from 'react';
import { User, Building, Lock, Bell, Globe } from 'lucide-react';

export default function SettingsProfile() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings & Preferences</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account profile, company details, and security preferences.</p>
      </div>

      <div className="flex space-x-8">
        <div className="w-64 space-y-2">
           {[
             { name: 'Profile', icon: User, active: true },
             { name: 'Company Details', icon: Building, active: false },
             { name: 'Security & Auth', icon: Lock, active: false },
             { name: 'Notifications', icon: Bell, active: false },
             { name: 'Localization', icon: Globe, active: false },
           ].map((tab, idx) => (
             <button key={idx} className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition ${tab.active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                <tab.icon size={18} className={`mr-3 ${tab.active ? 'text-indigo-600' : 'text-gray-400'}`} />
                {tab.name}
             </button>
           ))}
        </div>

        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
           <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Profile</h2>
           
           <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold">
                 JS
              </div>
              <div>
                 <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Upload New Avatar</button>
                 <p className="text-xs text-gray-500 mt-2">Recommended size: 256x256px. JPG or PNG.</p>
              </div>
           </div>

           <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" defaultValue="John" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" defaultValue="Smith" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                 </div>
              </div>
              
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                 <input type="email" defaultValue="john.smith@acmecorp.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50" disabled />
                 <p className="text-xs text-gray-500 mt-1">To change your email, please contact Support.</p>
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Job Title / Designation</label>
                 <input type="text" defaultValue="Logistics Director" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                 <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">Save Changes</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
