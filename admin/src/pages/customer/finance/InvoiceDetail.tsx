import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, CreditCard, ArrowLeft, Printer, ShieldCheck } from 'lucide-react';

export default function InvoiceDetail() {
  const { id } = useParams();
  const invoiceId = id || 'INV-10045';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
         <Link to="/customer/finance/invoices" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
         </Link>
         <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoice {invoiceId}</h1>
            <p className="text-sm text-gray-500">Ref: BKG-772910 • Issued Oct 24, 2026</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
           <div className="flex justify-between items-start mb-10 pb-8 border-b border-gray-100">
              <div>
                 <h2 className="text-3xl font-extrabold text-indigo-900 tracking-tight">INVOICE</h2>
                 <p className="text-sm font-semibold text-gray-500 mt-2">D2C Logistics Enterprise Corp.</p>
                 <p className="text-sm text-gray-500">123 Freight Avenue<br/>New York, NY 10001</p>
              </div>
              <div className="text-right">
                 <p className="text-sm font-bold text-gray-900">Billed To:</p>
                 <p className="text-sm text-gray-600 mt-1">Acme Global Industries<br/>450 Corporate Blvd<br/>San Francisco, CA 94107</p>
              </div>
           </div>

           <table className="w-full text-left mb-8">
              <thead>
                 <tr className="border-b-2 border-gray-900">
                    <th className="py-3 text-sm font-bold text-gray-900">Description</th>
                    <th className="py-3 text-sm font-bold text-gray-900 text-center">Qty</th>
                    <th className="py-3 text-sm font-bold text-gray-900 text-right">Rate</th>
                    <th className="py-3 text-sm font-bold text-gray-900 text-right">Amount</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                 <tr>
                    <td className="py-4 text-gray-800">Ocean Freight (Shanghai to LA) - 1x40HC Container</td>
                    <td className="py-4 text-center text-gray-600">1</td>
                    <td className="py-4 text-right text-gray-600">$0.00</td>
                    <td className="py-4 text-right font-medium text-gray-900">$0.00</td>
                 </tr>
                 <tr>
                    <td className="py-4 text-gray-800">Terminal Handling Charges (THC) - Origin & Destination</td>
                    <td className="py-4 text-center text-gray-600">1</td>
                    <td className="py-4 text-right text-gray-600">$0.00</td>
                    <td className="py-4 text-right font-medium text-gray-900">$0.00</td>
                 </tr>
                 <tr>
                    <td className="py-4 text-gray-800">Customs Clearance Services</td>
                    <td className="py-4 text-center text-gray-600">1</td>
                    <td className="py-4 text-right text-gray-600">$0.00</td>
                    <td className="py-4 text-right font-medium text-gray-900">$0.00</td>
                 </tr>
                 <tr>
                    <td className="py-4 text-gray-800">Marine Cargo Insurance (Premium)</td>
                    <td className="py-4 text-center text-gray-600">1</td>
                    <td className="py-4 text-right text-gray-600">$0.00</td>
                    <td className="py-4 text-right font-medium text-gray-900">$0.00</td>
                 </tr>
              </tbody>
           </table>

           <div className="flex justify-end">
              <div className="w-64 space-y-3 text-sm">
                 <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>$0.00</span>
                 </div>
                 <div className="flex justify-between text-gray-600">
                    <span>Tax (18%)</span>
                    <span>$0.00</span>
                 </div>
                 <div className="flex justify-between font-bold text-lg text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total Due</span>
                    <span>$0.00</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Payment Actions</h3>
              <Link to="/customer/finance/payments" className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm mb-3">
                 <CreditCard size={18} className="mr-2" /> Pay $0.00
              </Link>
              <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
                 <Download size={18} className="mr-2" /> Download PDF
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition mt-3">
                 <Printer size={18} className="mr-2" /> Print Invoice
              </button>
           </div>

           <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                 <ShieldCheck className="text-emerald-600" size={24} />
                 <h3 className="font-bold text-emerald-900">Secure Payment</h3>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                 All transactions are processed securely via our enterprise gateway utilizing 256-bit encryption. Dispute window open for 14 days post-payment.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
