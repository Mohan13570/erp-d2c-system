import React, { useState } from 'react';
import { Truck, UploadCloud, FileSpreadsheet, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function VendorPortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('jobs');

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Supplier & Carrier Hub</h1>
          <p className="text-gray-500 font-medium mt-1">Vendor ID: VND-08291</p>
        </div>
      </div>

      <div className="flex space-x-4 mb-8 border-b border-gray-200">
        <button onClick={() => setActiveTab('jobs')} className={`pb-4 px-2 font-bold flex items-center space-x-2 border-b-2 ${activeTab === 'jobs' ? 'border-orange-600 text-orange-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}><Truck size={18}/><span>Available Jobs / POs</span></button>
        <button onClick={() => setActiveTab('upload')} className={`pb-4 px-2 font-bold flex items-center space-x-2 border-b-2 ${activeTab === 'upload' ? 'border-orange-600 text-orange-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}><UploadCloud size={18}/><span>Document Upload</span></button>
        <button onClick={() => setActiveTab('bills')} className={`pb-4 px-2 font-bold flex items-center space-x-2 border-b-2 ${activeTab === 'bills' ? 'border-orange-600 text-orange-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}><FileSpreadsheet size={18}/><span>Submit Bill</span></button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {activeTab === 'jobs' && (
          <div className="text-center py-12">
            <Building size={48} className="mx-auto text-orange-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Open Purchase Orders</h3>
            <p className="text-gray-500">There are no pending job assignments for your vendor profile.</p>
          </div>
        )}
        {activeTab === 'upload' && (
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:bg-gray-50 cursor-pointer transition-colors">
            <UploadCloud size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="font-bold text-gray-900">Drag & Drop Documents Here</p>
            <p className="text-sm text-gray-500 mt-2">Support for PDF, JPG, and DOCX (Max 10MB)</p>
          </div>
        )}
        {activeTab === 'bills' && (
          <div className="max-w-md">
            <h3 className="text-lg font-bold mb-4">Submit Vendor Bill</h3>
            <input placeholder="Invoice Number" className="w-full p-3 border border-gray-200 rounded-xl mb-4" />
            <input type="number" placeholder="Total Amount ($)" className="w-full p-3 border border-gray-200 rounded-xl mb-4" />
            <input type="date" title="Due Date" className="w-full p-3 border border-gray-200 rounded-xl text-gray-500 mb-4" />
            <button className="bg-orange-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-700">Submit to Finance</button>
          </div>
        )}
      </div>
    </div>
  );
}
