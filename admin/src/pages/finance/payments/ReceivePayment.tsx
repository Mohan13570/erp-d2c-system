import React, { useState } from 'react';
import { DollarSign, FileText, CheckCircle, Search, Copy, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReceivePayment() {
  const [form, setForm] = useState({
    customerId: 'CUST-1049',
    paymentMethod: 'WIRE',
    referenceNumber: '',
    amount: ''
  });

  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/erp/payments/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount: Number(form.amount) })
      });
      if (res.ok) {
         const data = await res.json();
         setReceipt(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/finance/payments" className="text-indigo-600 text-sm font-medium hover:underline mb-2 inline-block">&larr; Back to Treasury</Link>
          <h1 className="text-2xl font-bold text-gray-900">Receive Payment</h1>
          <p className="text-sm text-gray-500 mt-1">Record incoming physical or digital funds and generate official receipts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Customer ID</label>
                  <input type="text" required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" value={form.customerId} onChange={e => setForm({...form, customerId: e.target.value})} />
               </div>

               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                     {['WIRE', 'CHEQUE', 'CASH', 'CREDIT_CARD'].map(m => (
                        <button type="button" key={m} onClick={() => setForm({...form, paymentMethod: m})}
                           className={`p-2.5 border rounded-lg text-sm font-bold ${form.paymentMethod === m ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white text-gray-500'}`}>
                           {m}
                        </button>
                     ))}
                  </div>
               </div>

               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Bank / Check Reference Number</label>
                  <input type="text" required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-mono uppercase" value={form.referenceNumber} onChange={e => setForm({...form, referenceNumber: e.target.value})} placeholder="e.g. TRN-99882211" />
               </div>

               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Amount Received</label>
                  <div className="relative">
                     <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={18} />
                     <input type="number" required min="0.01" step="0.01" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-lg font-bold text-gray-900" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0.00" />
                  </div>
               </div>

               <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center">
                  {loading ? 'Processing...' : 'Record Payment & Generate Receipt'}
               </button>
            </form>
         </div>

         <div>
            {receipt ? (
               <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden print:shadow-none print:border-none">
                  <div className="bg-emerald-50 p-6 text-center border-b border-emerald-100 print:hidden">
                     <CheckCircle size={48} className="mx-auto text-emerald-500 mb-2" />
                     <h2 className="text-emerald-800 font-bold text-lg">Payment Successfully Logged</h2>
                     <p className="text-emerald-600 text-sm">Receipt Generated. Awaiting Bank Reconciliation.</p>
                  </div>
                  
                  <div className="p-8">
                     <div className="flex justify-between items-start mb-8 pb-8 border-b border-gray-100">
                        <div>
                           <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">RECEIPT</h1>
                           <p className="text-gray-500 mt-1">Official Payment Acknowledgement</p>
                        </div>
                        <div className="text-right">
                           <p className="font-mono font-bold text-indigo-600 text-lg">{receipt.receiptNumber}</p>
                           <p className="text-sm text-gray-500">{new Date(receipt.receivedDate).toLocaleDateString()}</p>
                        </div>
                     </div>
                     
                     <div className="space-y-4 text-sm mb-12">
                        <div className="flex justify-between">
                           <span className="text-gray-500">Customer ID</span>
                           <span className="font-bold">{receipt.customerId}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-gray-500">Payment Method</span>
                           <span className="font-bold">{receipt.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-gray-500">Reference / Check No</span>
                           <span className="font-mono">{receipt.referenceNumber}</span>
                        </div>
                     </div>
                     
                     <div className="bg-gray-50 p-6 rounded-xl flex justify-between items-center">
                        <span className="font-bold text-gray-500 uppercase tracking-widest text-xs">Total Amount Received</span>
                        <span className="text-3xl font-extrabold text-gray-900">{receipt.currency} {receipt.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                     </div>
                  </div>
                  
                  <div className="p-6 bg-gray-50 border-t border-gray-100 flex space-x-3 print:hidden">
                     <button onClick={() => window.print()} className="flex-1 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold flex justify-center items-center hover:bg-gray-50">
                        <Printer size={16} className="mr-2" /> Print PDF
                     </button>
                     <Link to="/finance/ar/allocate" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold flex justify-center items-center hover:bg-indigo-700">
                        Allocate to Invoice &rarr;
                     </Link>
                  </div>
               </div>
            ) : (
               <div className="bg-gray-50 rounded-2xl border border-gray-100 p-12 text-center h-full flex flex-col justify-center items-center text-gray-400">
                  <FileText size={48} className="mb-4 opacity-20" />
                  <p>Receipt preview will appear here.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
