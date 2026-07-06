import React from 'react';
import { Settings, Building, Building2, Landmark, ShieldCheck } from 'lucide-react';

export default function FinanceSettings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Finance Master Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Configure fiscal years, banks, cost centers, and financial controls.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            Save Configuration
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Building className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Company Finance Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fiscal Year Start</label>
              <select className="w-full border-gray-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option>January 1st</option>
                <option>April 1st</option>
                <option>July 1st</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Currency</label>
              <select className="w-full border-gray-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option>USD - US Dollar</option>
                <option>EUR - Euro</option>
                <option>INR - Indian Rupee</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Financial Controls</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Enable 3-Way Matching</p>
                <p className="text-xs text-gray-500">Require PO, Receipt, and Bill to match before AP payment.</p>
              </div>
              <div className="w-11 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Multi-Currency Enabled</p>
                <p className="text-xs text-gray-500">Allow transactions in foreign currencies with daily FX rates.</p>
              </div>
              <div className="w-11 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
