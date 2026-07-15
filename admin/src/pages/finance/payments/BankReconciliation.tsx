import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, CheckCircle, RefreshCcw, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BankReconciliation() {
  const [statements, setStatements] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);

  const fetchReconData = () => {
    fetch('http://localhost:5000/api/erp/payments/recon-view')
      .then(res => res.json())
      .then(data => {
         setStatements(data.unmatchedStatements);
         setReceipts(data.unmatchedReceipts);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchReconData();
  }, []);

  const handleAutoReconcile = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/erp/payments/auto-reconcile', { method: 'POST' });
      const data = await res.json();
      setMatchResult(data);
      fetchReconData();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/finance/payments" className="text-indigo-600 text-sm font-medium hover:underline mb-2 inline-block">&larr; Back to Treasury</Link>
          <h1 className="text-2xl font-bold text-gray-900">Bank Reconciliation</h1>
          <p className="text-sm text-gray-500 mt-1">Match raw Bank Statement lines against internal ERP Receipts.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleAutoReconcile} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center shadow-sm disabled:opacity-50">
             <RefreshCcw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> 
             {loading ? 'Reconciling...' : 'Run Auto-Reconcile AI'}
          </button>
        </div>
      </div>

      {matchResult && (
         <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center justify-between mb-6">
            <div className="flex items-center">
               <ShieldCheck className="mr-2" size={20} />
               <span className="font-bold">Reconciliation Complete.</span> 
               <span className="ml-2 text-sm">{matchResult.matchedCount} exact matches found and securely linked.</span>
            </div>
            <button onClick={() => setMatchResult(null)} className="text-sm font-bold text-emerald-600 hover:underline">Dismiss</button>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
               <h3 className="font-bold text-gray-900 flex items-center"><ArrowLeftRight className="mr-2 text-gray-400" size={18}/> Bank Statement (External)</h3>
               <p className="text-xs text-gray-500 mt-1">Raw transactions imported from the bank.</p>
            </div>
            <div className="overflow-y-auto flex-1 p-0">
               {statements.length > 0 ? (
                  <table className="w-full text-left text-sm">
                     <tbody className="divide-y divide-gray-100">
                        {statements.map((s: any) => (
                           <tr key={s.id} className="hover:bg-gray-50 transition border-l-4 border-transparent hover:border-indigo-400 cursor-pointer">
                              <td className="p-4">
                                 <p className="font-bold text-gray-900">{s.description}</p>
                                 <p className="text-xs text-gray-500">{new Date(s.transactionDate).toLocaleDateString()}</p>
                              </td>
                              <td className="p-4 text-right">
                                 <p className={`font-bold ${s.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {s.amount > 0 ? '+' : ''}{s.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                 </p>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               ) : (
                  <div className="p-12 text-center text-gray-500 h-full flex flex-col justify-center items-center">
                     <CheckCircle size={32} className="mb-2 text-emerald-400 opacity-50" />
                     <p>No unmatched bank statements.</p>
                  </div>
               )}
            </div>
         </div>

         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-gray-200 bg-indigo-50">
               <h3 className="font-bold text-indigo-900 flex items-center"><ArrowLeftRight className="mr-2 text-indigo-400" size={18}/> ERP Receipts (Internal)</h3>
               <p className="text-xs text-indigo-600 mt-1">Payments recorded in the system awaiting verification.</p>
            </div>
            <div className="overflow-y-auto flex-1 p-0">
               {receipts.length > 0 ? (
                  <table className="w-full text-left text-sm">
                     <tbody className="divide-y divide-gray-100">
                        {receipts.map((r: any) => (
                           <tr key={r.id} className="hover:bg-indigo-50/50 transition border-l-4 border-transparent hover:border-indigo-400 cursor-pointer">
                              <td className="p-4">
                                 <p className="font-mono font-bold text-indigo-700">{r.receiptNumber}</p>
                                 <p className="text-xs text-gray-500">Ref: {r.referenceNumber || 'N/A'}</p>
                              </td>
                              <td className="p-4 text-right">
                                 <p className="font-bold text-gray-900">
                                    ${r.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                 </p>
                                 <span className="text-[10px] uppercase font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">{r.status}</span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               ) : (
                  <div className="p-12 text-center text-gray-500 h-full flex flex-col justify-center items-center">
                     <CheckCircle size={32} className="mb-2 text-emerald-400 opacity-50" />
                     <p>All ERP receipts are reconciled!</p>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
