import React, { useState } from 'react';
import { Key, Globe, Activity, Copy, Check, Eye, EyeOff } from 'lucide-react';

export default function DeveloperPortal() {
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const apiKey = "sk_live_51Mxxxxx...";
  const fullApiKey = "mock_live_51Mxx90qPZLxkL82nJp029mB2kLv0";

  const handleCopy = () => {
    navigator.clipboard.writeText(fullApiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Developer Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Manage API keys and Webhook endpoints for B2B ERP integration.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-sm">
          Generate New API Key
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center space-x-3">
                <Key className="text-indigo-600" size={20}/>
                <h2 className="font-bold text-gray-900">Active API Keys</h2>
             </div>
             <div className="p-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                   <div>
                      <p className="text-sm font-bold text-gray-900">Production Key (Main App)</p>
                      <div className="flex items-center mt-2 space-x-2">
                         <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono tracking-wider">
                           {showKey ? fullApiKey : apiKey}
                         </code>
                         <button onClick={() => setShowKey(!showKey)} className="text-gray-400 hover:text-gray-600 p-1">
                           {showKey ? <EyeOff size={16}/> : <Eye size={16}/>}
                         </button>
                      </div>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded mb-2">ACTIVE</span>
                      <button onClick={handleCopy} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                         {copied ? <><Check size={14} className="mr-1"/> Copied</> : <><Copy size={14} className="mr-1"/> Copy Key</>}
                      </button>
                   </div>
                </div>
                <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                   <strong>Warning:</strong> Do not share your API key in publicly accessible areas such as GitHub, client-side code, etc. This key provides full administrative access to your logistics data.
                </p>
             </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                   <Globe className="text-indigo-600" size={20}/>
                   <h2 className="font-bold text-gray-900">Webhook Endpoints</h2>
                </div>
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Add Endpoint</button>
             </div>
             <div className="p-6">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                   <div>
                      <p className="text-sm font-bold text-gray-900">https://api.acme-corp.com/logistics/webhook</p>
                      <p className="text-xs text-gray-500 mt-1">Events: <span className="font-mono bg-gray-100 px-1 rounded">shipment.status_updated</span>, <span className="font-mono bg-gray-100 px-1 rounded">invoice.generated</span></p>
                   </div>
                   <button className="text-sm text-gray-400 hover:text-red-600 transition">Delete</button>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
             <div className="flex items-center space-x-3 mb-4">
                <Activity className="text-indigo-600" size={20}/>
                <h2 className="font-bold text-gray-900">API Usage (Current Month)</h2>
             </div>
             <div className="space-y-4">
                <div>
                   <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Total Requests</span>
                      <span className="font-bold text-gray-900">14,230 / 50,000</span>
                   </div>
                   <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '28%' }}></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Error Rate (5xx)</span>
                      <span className="font-bold text-green-600">0.01%</span>
                   </div>
                </div>
                <p className="text-xs text-gray-500 mt-4 border-t border-gray-100 pt-4">Your current plan allows up to 50,000 API requests per month. To increase limits, please contact your account manager.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
