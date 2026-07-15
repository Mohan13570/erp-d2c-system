import React, { useState, useEffect } from 'react';
import { DollarSign, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PaymentAllocation() {
  const [invoices, setInvoices] = useState([]);
  const [paymentRefId, setPaymentRefId] = useState('');
  const [allocationAmount, setAllocationAmount] = useState<number>(0);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/erp/ar/open-invoices')
      .then(res => res.json())
      .then(data => setInvoices(data))
      .catch(console.error);
  }, []);

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/erp/ar/allocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentRefId, invoiceId: selectedInvoiceId, allocatedAmount: allocationAmount })
      });
      if (res.ok) {
         setMsg('Payment successfully allocated to invoice.');
         setTimeout(() => window.location.reload(), 1500);
      } else {
         const err = await res.json();
         setMsg(`Error: ${err.error}`);
      }
    } catch (error) {
      setMsg('Failed to allocate payment');
    }
    setLoading(false);
  };

  const selectedInvoice: any = invoices.find((i: any) => i.id === selectedInvoiceId);
  const balanceRemaining = selectedInvoice ? selectedInvoice.grandTotal - selectedInvoice.amountPaid : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/finance/ar" className="text-indigo-600 text-sm font-medium hover:underline mb-2 inline-block">&larr; Back to AR</Link>
          <h1 className="text-2xl font-bold text-gray-900">Payment Allocation</h1>
          <p className="text-sm text-gray-500 mt-1">Apply incoming bank wires or checks against open invoices.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
               <h3 className="font-bold text-gray-900">Open Invoices</h3>
            </div>
            <div className="p-0 max-h-96 overflow-y-auto">
               <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-gray-100">
                     {invoices.map((inv: any) => (
                        <tr key={inv.id} 
                            onClick={() => setSelectedInvoiceId(inv.id)}
                            className={`cursor-pointer transition ${selectedInvoiceId === inv.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}>
                           <td className="p-4">
                              <p className="font-bold text-gray-900">{inv.invoiceNumber}</p>
                              <p className="text-xs text-gray-500">{inv.customerId}</p>
                           </td>
                           <td className="p-4 text-right">
                              <p className="font-bold text-red-600">${(inv.grandTotal - inv.amountPaid).toLocaleString()}</p>
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{inv.status}</p>
                           </td>
                        </tr>
                     ))}
                     {invoices.length === 0 && (
                        <tr>
                           <td colSpan={2} className="p-12 text-center text-gray-500">No open invoices found.</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 flex items-center mb-6"><DollarSign className="mr-2 text-indigo-600"/> Allocation Details</h3>
            
            <form onSubmit={handleAllocate} className="space-y-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Bank Payment Reference ID</label>
                  <input type="text" required className="w-full border border-gray-300 rounded-lg p-2 text-sm" placeholder="e.g. WIRE-998822" value={paymentRefId} onChange={e => setPaymentRefId(e.target.value)} />
               </div>

               {selectedInvoiceId ? (
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                     <p className="text-xs text-indigo-600 font-bold uppercase mb-2">Target Invoice</p>
                     <div className="flex justify-between items-end">
                        <span className="font-mono font-bold text-indigo-900">{selectedInvoice.invoiceNumber}</span>
                        <div className="text-right">
                           <span className="block text-xs text-gray-500">Unpaid Balance</span>
                           <span className="font-bold text-red-600">${balanceRemaining.toLocaleString()}</span>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm text-gray-500 text-center border-dashed">
                     Select an invoice from the left panel to allocate funds.
                  </div>
               )}

               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Amount to Apply</label>
                  <div className="relative">
                     <DollarSign className="absolute left-3 top-2 text-gray-400" size={18} />
                     <input type="number" required max={balanceRemaining} disabled={!selectedInvoiceId} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-lg font-bold disabled:bg-gray-100" value={allocationAmount} onChange={e => setAllocationAmount(Number(e.target.value))} />
                  </div>
                  {allocationAmount > balanceRemaining && (
                     <p className="text-xs text-red-600 mt-1 flex items-center"><AlertCircle size={12} className="mr-1"/> Amount exceeds invoice balance.</p>
                  )}
               </div>

               <div className="pt-6">
                  <button type="submit" disabled={!selectedInvoiceId || loading || allocationAmount <= 0 || allocationAmount > balanceRemaining} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50 flex justify-center items-center">
                     {loading ? 'Processing Ledger...' : <><CheckCircle size={18} className="mr-2"/> Post Allocation</>}
                  </button>
               </div>

               {msg && <p className="text-sm font-medium text-center text-indigo-600 bg-indigo-50 p-2 rounded-lg">{msg}</p>}
            </form>
         </div>
      </div>
    </div>
  );
}
