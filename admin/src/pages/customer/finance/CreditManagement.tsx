import React from 'react';
import { ShieldAlert, TrendingUp, DollarSign, CheckCircle } from 'lucide-react';

export default function CreditManagement() {
  const creditLimit = 50000;
  const utilized = 18450;
  const available = creditLimit - utilized;
  const percentUsed = (utilized / creditLimit) * 100;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Credit Management</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor your corporate credit limits and request extensions.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-sm">
          Request Credit Limit Increase
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-gray-50 text-gray-600">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Approved Credit Limit</p>
            <p className="text-2xl font-bold text-gray-900">${creditLimit.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Utilized (Owed)</p>
            <p className="text-2xl font-bold text-gray-900">${utilized.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-emerald-600 rounded-2xl p-6 shadow-lg shadow-emerald-200 flex items-center space-x-4 text-white">
          <div className="p-3 rounded-xl bg-emerald-500">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-100">Available Credit</p>
            <p className="text-2xl font-bold">${available.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Credit Utilization Bar</h2>
        
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                {percentUsed.toFixed(1)}% Used
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-gray-600">
                ${utilized.toLocaleString()} / ${creditLimit.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-100">
            <div style={{ width: `${percentUsed}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${percentUsed > 80 ? 'bg-red-500' : 'bg-indigo-500'}`}></div>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-5">
           <h3 className="font-bold text-gray-900 flex items-center mb-2"><CheckCircle size={18} className="text-green-500 mr-2"/> Account is in Good Standing</h3>
           <p className="text-sm text-gray-600">Your account payments have been historically on time. You are pre-approved for a credit limit extension up to $0.00. Contact your Account Manager to activate.</p>
        </div>
      </div>
    </div>
  );
}
