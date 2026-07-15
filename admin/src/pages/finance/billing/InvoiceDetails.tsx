import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Printer, Mail, CheckCircle, XCircle, Send, FileSignature, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function InvoiceDetails() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/erp/billing/${id}`)
      .then(res => res.json())
      .then(data => setInvoice(data))
      .catch(console.error);
  }, [id]);

  const handleApprove = async () => {
    try {
      await fetch(`http://localhost:5000/api/erp/billing/${id}/approve`, { method: 'POST' });
      window.location.reload();
    } catch (e) { console.error(e); }
  };

  if (!invoice) return <div className="p-12 text-center text-gray-500 animate-pulse">Loading Invoice Math...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/finance/billing" className="text-indigo-600 text-sm font-medium hover:underline mb-2 inline-block">&larr; Back to Invoices</Link>
          <div className="flex items-center space-x-3">
             <h1 className="text-2xl font-bold text-gray-900">{invoice.invoiceNumber}</h1>
             <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-md ${
                invoice.status === 'DRAFT' ? 'bg-gray-200 text-gray-700' :
                invoice.status === 'APPROVED' ? 'bg-indigo-100 text-indigo-700' :
                'bg-green-100 text-green-700'
             }`}>
                {invoice.status.replace('_', ' ')}
             </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Customer: <span className="font-medium text-gray-900">{invoice.customerId}</span> | Created: {new Date(invoice.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div className="flex space-x-3">
           <button onClick={() => window.print()} className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center">
             <Printer size={16} className="mr-2" /> Print PDF
           </button>
           {invoice.status === 'APPROVED' && (
             <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center shadow-sm">
               <Mail size={16} className="mr-2" /> Dispatch Email
             </button>
           )}
           {(invoice.status === 'DRAFT' || invoice.status === 'PENDING_APPROVAL') && (
             <button onClick={handleApprove} className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 flex items-center shadow-sm">
               <ShieldCheck size={16} className="mr-2" /> Approve & Lock
             </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Print View Layout for PDF generation via Browser Print */}
         <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-lg p-10 print:shadow-none print:border-none print:p-0">
            {/* INVOICE HEADER */}
            <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
               <div>
                  <div className="flex items-center space-x-2 text-indigo-600 mb-4">
                     <FileText size={32} />
                     <span className="text-2xl font-extrabold tracking-tighter">AURA LOGISTICS</span>
                  </div>
                  <p className="text-sm text-gray-500">123 Global Trade Center</p>
                  <p className="text-sm text-gray-500">New York, NY 10001, USA</p>
                  <p className="text-sm text-gray-500 mt-2">GSTIN: 99AXCDE1234F1Z5</p>
               </div>
               <div className="text-right">
                  <h2 className="text-4xl font-extrabold text-gray-200 uppercase tracking-widest mb-4">Invoice</h2>
                  <p className="text-sm font-bold text-gray-900">Invoice #: {invoice.invoiceNumber}</p>
                  <p className="text-sm text-gray-600">Date: {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                  <div className="mt-4 inline-block px-3 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-bold text-gray-700 uppercase">
                     {invoice.invoiceType}
                  </div>
               </div>
            </div>

            {/* CUSTOMER & REFS */}
            <div className="flex justify-between mb-8">
               <div className="w-1/2 pr-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
                  <p className="text-sm font-bold text-gray-900">{invoice.customerId}</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.billingAddress || 'No Address Provided'}</p>
               </div>
               <div className="w-1/2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                     <span className="text-gray-500">Shipment Ref:</span>
                     <span className="font-medium text-gray-900">{invoice.shipmentNumber || 'N/A'}</span>
                     <span className="text-gray-500">Customer PO:</span>
                     <span className="font-medium text-gray-900">{invoice.referenceNumber || 'N/A'}</span>
                     <span className="text-gray-500">Currency:</span>
                     <span className="font-bold text-indigo-600">{invoice.currency} (Rate: {invoice.exchangeRate})</span>
                  </div>
               </div>
            </div>

            {/* LINE ITEMS */}
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Services & Items</h3>
            <table className="w-full text-left text-sm mb-8">
               <thead className="border-y border-gray-200 bg-gray-50">
                  <tr>
                     <th className="py-3 px-4 font-bold text-gray-700">Description</th>
                     <th className="py-3 px-4 font-bold text-gray-700 text-right">Qty</th>
                     <th className="py-3 px-4 font-bold text-gray-700 text-right">Unit Price</th>
                     <th className="py-3 px-4 font-bold text-gray-700 text-right">Amount</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {invoice.items.map((item: any) => (
                     <tr key={item.id}>
                        <td className="py-3 px-4 text-gray-900">{item.description}</td>
                        <td className="py-3 px-4 text-right">{item.quantity} {item.unit}</td>
                        <td className="py-3 px-4 text-right">{item.unitPrice.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-medium">{item.amount.toLocaleString()}</td>
                     </tr>
                  ))}
               </tbody>
            </table>

            {/* FREIGHT CHARGES */}
            {invoice.charges.length > 0 && (
               <>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Freight & Surcharges</h3>
                  <table className="w-full text-left text-sm mb-8">
                     <tbody className="divide-y divide-gray-100 border-b border-gray-200">
                        {invoice.charges.map((charge: any) => (
                           <tr key={charge.id}>
                              <td className="py-3 px-4 text-gray-900"><span className="text-xs font-bold text-gray-500 mr-2 bg-gray-100 px-1 rounded">{charge.chargeType}</span>{charge.description}</td>
                              <td className="py-3 px-4 text-right font-medium">{charge.amount.toLocaleString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </>
            )}

            {/* TOTALS */}
            <div className="flex justify-end mb-12">
               <div className="w-80 space-y-3 text-sm">
                  <div className="flex justify-between">
                     <span className="text-gray-500">Subtotal</span>
                     <span className="font-medium text-gray-900">{invoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-gray-500">Freight & Charges</span>
                     <span className="font-medium text-gray-900">{invoice.freightTotal.toLocaleString()}</span>
                  </div>
                  {invoice.taxes.map((t: any) => (
                     <div key={t.id} className="flex justify-between">
                        <span className="text-gray-500">Tax ({t.taxType} @ {t.taxPercent}%)</span>
                        <span className="font-medium text-gray-900">{t.taxAmount.toLocaleString()}</span>
                     </div>
                  ))}
                  <div className="flex justify-between py-3 border-t border-gray-900 mt-2">
                     <span className="font-bold text-gray-900 text-lg">Grand Total</span>
                     <span className="font-extrabold text-indigo-600 text-xl">{invoice.currency} {invoice.grandTotal.toLocaleString()}</span>
                  </div>
               </div>
            </div>

            {/* SIGNATURE */}
            <div className="flex justify-between items-end border-t border-gray-200 pt-8 mt-12">
               <div className="text-xs text-gray-500">
                  <p className="font-bold text-gray-900 mb-1">Terms & Conditions</p>
                  <p>1. Payment is due within standard terms.</p>
                  <p>2. Late payments subject to 1.5% interest per month.</p>
               </div>
               <div className="text-center">
                  <div className="w-48 h-12 border-b border-gray-400 mb-2"></div>
                  <p className="text-xs font-bold text-gray-900">Authorized Signatory</p>
                  <p className="text-[10px] text-gray-500">Aura Logistics Finance Dept.</p>
               </div>
            </div>
         </div>

         {/* AUDIT TIMELINE */}
         <div className="space-y-6 print:hidden">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
               <h3 className="font-bold text-gray-900 mb-6 flex items-center"><FileSignature className="mr-2 text-indigo-600"/> Audit Timeline</h3>
               
               <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                  {invoice.history.map((h: any, i: number) => (
                     <div key={h.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-indigo-50 text-indigo-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                           {h.action === 'CREATED' ? <Plus size={16} /> : h.action === 'APPROVED' ? <CheckCircle size={16} /> : <Send size={16} />}
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                           <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-gray-900 text-sm">{h.action}</span>
                           </div>
                           <p className="text-xs text-gray-500">{h.notes}</p>
                           <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider">{new Date(h.createdAt).toLocaleString()} • {h.performedBy}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
