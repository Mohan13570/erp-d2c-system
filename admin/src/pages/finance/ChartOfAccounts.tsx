import React, { useState } from 'react';
import { Layers, Plus, Search, ChevronRight, ChevronDown, Folder, FileText, Download, Upload } from 'lucide-react';

export default function ChartOfAccounts() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'assets': true,
    'current-assets': true
  });

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Chart of Accounts</h2>
          <p className="text-sm text-gray-500 mt-1">Manage global financial ledger structures and account hierarchies.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center">
            <Upload className="w-4 h-4 mr-2" /> Import
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" /> New Account
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="relative w-96">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search accounts by code or name..." 
              className="w-full pl-10 pr-4 py-2 border-gray-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">Expand All</button>
            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">Collapse All</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* Mocked Tree Structure for COA */}
          <div className="border border-gray-100 rounded-lg">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer" onClick={() => toggle('assets')}>
              <div className="flex items-center space-x-2">
                {expanded['assets'] ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                <Folder className="w-5 h-5 text-indigo-500" />
                <span className="font-semibold text-gray-900">1000 - Assets</span>
              </div>
              <div className="flex items-center space-x-8 text-sm">
                <span className="text-gray-500 w-24">Asset</span>
                <span className="font-medium text-gray-900 w-32 text-right">$1,240,000.00</span>
                <button className="text-indigo-600 hover:text-indigo-700">Add Sub</button>
              </div>
            </div>
            
            {expanded['assets'] && (
              <div className="pl-8 border-l-2 border-gray-100 ml-5 my-1 space-y-1">
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer rounded-lg" onClick={() => toggle('current-assets')}>
                  <div className="flex items-center space-x-2">
                    {expanded['current-assets'] ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                    <Folder className="w-4 h-4 text-indigo-400" />
                    <span className="font-medium text-gray-800">1100 - Current Assets</span>
                  </div>
                  <div className="flex items-center space-x-8 text-sm">
                    <span className="text-gray-500 w-24">Group</span>
                    <span className="font-medium text-gray-900 w-32 text-right">$540,200.00</span>
                  </div>
                </div>
                
                {expanded['current-assets'] && (
                  <div className="pl-8 border-l-2 border-gray-100 ml-3 my-1 space-y-1">
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">1110 - Bank of America Checking</span>
                      </div>
                      <div className="flex items-center space-x-8 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-gray-500 w-24">Bank</span>
                        <span className="text-gray-900 w-32 text-right">$420,000.00</span>
                        <button className="text-indigo-600 hover:text-indigo-700">Edit</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">1120 - Petty Cash</span>
                      </div>
                      <div className="flex items-center space-x-8 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-gray-500 w-24">Cash</span>
                        <span className="text-gray-900 w-32 text-right">$2,500.00</span>
                        <button className="text-indigo-600 hover:text-indigo-700">Edit</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border border-gray-100 rounded-lg">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer" onClick={() => toggle('liabilities')}>
              <div className="flex items-center space-x-2">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <Folder className="w-5 h-5 text-rose-500" />
                <span className="font-semibold text-gray-900">2000 - Liabilities</span>
              </div>
              <div className="flex items-center space-x-8 text-sm">
                <span className="text-gray-500 w-24">Liability</span>
                <span className="font-medium text-gray-900 w-32 text-right">$450,000.00</span>
                <button className="text-indigo-600 hover:text-indigo-700">Add Sub</button>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-100 rounded-lg">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer" onClick={() => toggle('equity')}>
              <div className="flex items-center space-x-2">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <Folder className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold text-gray-900">3000 - Equity</span>
              </div>
              <div className="flex items-center space-x-8 text-sm">
                <span className="text-gray-500 w-24">Equity</span>
                <span className="font-medium text-gray-900 w-32 text-right">$790,000.00</span>
                <button className="text-indigo-600 hover:text-indigo-700">Add Sub</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
