import React, { useState, useEffect } from 'react';
import { Package, FileText, ReceiptText, LifeBuoy, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CustomerPortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('shipments');
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Mocking fetch since we don't have true auth ID wired yet
    const type = activeTab === 'shipments' ? 'shipments' : 'tickets';
    fetch(`/api/portals/customer/CUSTOMER_123/${type}`)
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, [activeTab]);

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Client Portal</h1>
          <p className="text-gray-500 font-medium mt-1">Welcome back, {user?.firstName || 'Valued Client'}.</p>
        </div>
      </div>

      <div className="flex space-x-4 mb-8 border-b border-gray-200">
        <button onClick={() => setActiveTab('shipments')} className={`pb-4 px-2 font-bold flex items-center space-x-2 border-b-2 ${activeTab === 'shipments' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}><Package size={18}/><span>Shipments</span></button>
        <button onClick={() => setActiveTab('invoices')} className={`pb-4 px-2 font-bold flex items-center space-x-2 border-b-2 ${activeTab === 'invoices' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}><ReceiptText size={18}/><span>Invoices</span></button>
        <button onClick={() => setActiveTab('documents')} className={`pb-4 px-2 font-bold flex items-center space-x-2 border-b-2 ${activeTab === 'documents' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}><FileText size={18}/><span>Documents</span></button>
        <button onClick={() => setActiveTab('support')} className={`pb-4 px-2 font-bold flex items-center space-x-2 border-b-2 ${activeTab === 'support' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}><LifeBuoy size={18}/><span>Support</span></button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {activeTab === 'shipments' && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-indigo-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Shipments</h3>
            <p className="text-gray-500">You currently have no active freight or cargo shipments.</p>
          </div>
        )}
        {activeTab === 'invoices' && (
          <div className="text-center py-12">
            <ReceiptText size={48} className="mx-auto text-emerald-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">All Caught Up</h3>
            <p className="text-gray-500">You have no unpaid invoices.</p>
          </div>
        )}
        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-100 rounded-xl flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
               <div className="flex items-center space-x-3"><FileText className="text-indigo-500"/><span className="font-semibold text-gray-800">Master_Contract_2025.pdf</span></div>
               <Download size={18} className="text-gray-400"/>
            </div>
          </div>
        )}
        {activeTab === 'support' && (
          <div className="max-w-md">
            <h3 className="text-lg font-bold mb-4">Raise a Support Ticket</h3>
            <input placeholder="Subject" className="w-full p-3 border border-gray-200 rounded-xl mb-4" />
            <textarea placeholder="Describe your issue..." rows={4} className="w-full p-3 border border-gray-200 rounded-xl mb-4"></textarea>
            <button className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700">Submit Ticket</button>
          </div>
        )}
      </div>
    </div>
  );
}
