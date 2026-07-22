import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Receipt, DollarSign, Calculator, Percent, CreditCard, 
  FileText, Activity, Save, Send, Download, FileSpreadsheet,
  AlertTriangle, CheckCircle, Clock
} from 'lucide-react';

const MOCK_FINANCIALS = {
  summary: {
    billingStatus: 'READY_FOR_BILLING',
    invoiceStatus: 'PENDING',
    paymentStatus: 'UNPAID',
    currency: 'USD',
    totalAmount: 3750.00,
    outstandingAmount: 3750.00
  },
  charges: {
    baseFreight: 2500,
    fuelSurcharge: 200,
    handlingCharges: 150,
    loadingCharges: 100,
    unloadingCharges: 100,
    warehouseCharges: 250,
    insuranceCharges: 100,
    customsCharges: 50,
    documentationCharges: 50,
    otherCharges: 200,
    subtotal: 3700
  },
  taxes: [
    { type: 'GST', percentage: 10, amount: 370 }
  ],
  discounts: {
    customerDiscount: 120,
    corporateDiscount: 0,
    promotionalDiscount: 50,
    manualDiscount: 0,
    netDiscount: 170
  },
  totals: {
    subtotal: 3700,
    tax: 370,
    discount: 170,
    grandTotal: 3900,
    paidAmount: 0,
    outstandingAmount: 3900
  },
  invoice: {
    number: 'PENDING',
    date: 'TBD',
    status: 'DRAFT',
    dueDate: 'TBD',
    terms: 'NET 30',
    generatedBy: 'System'
  },
  notes: {
    billing: 'Standard corporate net-30 terms apply.',
    finance: 'Pending final warehouse dimension check.',
    customer: 'Thank you for your business.',
    internal: 'Check customs manifest before billing.'
  }
};

export default function ShipmentBilling() {
  const { id } = useParams();
  const shipmentId = id || 'TRK-90218-444';

  const [data, setData] = useState(MOCK_FINANCIALS);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateBilling = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setData({
        ...data,
        summary: { ...data.summary, billingStatus: 'INVOICED', invoiceStatus: 'ISSUED' },
        invoice: {
          ...data.invoice,
          number: 'INV-773821',
          date: new Date().toLocaleDateString(),
          status: 'ISSUED',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
        }
      });
      setIsGenerating(false);
    }, 1500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: data.summary.currency }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-emerald-600 bg-emerald-100 p-1 rounded-lg" /> 
            Billing Integration & Settlement
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm font-bold text-slate-500">
            <span>Shipment: <span className="text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">{shipmentId}</span></span>
            <span>Booking: BKG-77123</span>
            <span>Customer: Acme Global</span>
            <span className={\`px-2 py-0.5 rounded uppercase tracking-wider text-xs \${data.summary.billingStatus === 'INVOICED' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}\`}>
              {data.summary.billingStatus.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button 
            onClick={handleGenerateBilling}
            disabled={isGenerating || data.summary.billingStatus === 'INVOICED'}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" /> 
            {isGenerating ? 'Dispatching to Finance...' : 'Generate Billing Request'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* MAIN SCROLLABLE CONTENT (SECTIONS 1-9) */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
          
          {/* SECTION 1: SUMMARY */}
          <section id="summary" className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Amount</p>
              <h3 className="text-3xl font-black text-slate-900">{formatCurrency(data.totals.grandTotal)}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Outstanding</p>
              <h3 className="text-3xl font-black text-amber-600">{formatCurrency(data.totals.outstandingAmount)}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Invoice Status</p>
              <h3 className={\`text-2xl mt-1 font-black \${data.invoice.status === 'ISSUED' ? 'text-indigo-600' : 'text-slate-400'}\`}>{data.invoice.status}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Payment Status</p>
              <h3 className="text-2xl mt-1 font-black text-slate-400">{data.summary.paymentStatus}</h3>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SECTION 2: FREIGHT CHARGES */}
            <section id="freight" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <Calculator className="w-5 h-5 text-indigo-600"/> Freight & Operational Charges
              </h2>
              <div className="space-y-3 text-sm font-medium text-slate-700">
                <div className="flex justify-between"><span>Base Freight</span><span>{formatCurrency(data.charges.baseFreight)}</span></div>
                <div className="flex justify-between"><span>Fuel Surcharge</span><span>{formatCurrency(data.charges.fuelSurcharge)}</span></div>
                <div className="flex justify-between"><span>Handling Charges</span><span>{formatCurrency(data.charges.handlingCharges)}</span></div>
                <div className="flex justify-between"><span>Loading Charges</span><span>{formatCurrency(data.charges.loadingCharges)}</span></div>
                <div className="flex justify-between"><span>Unloading Charges</span><span>{formatCurrency(data.charges.unloadingCharges)}</span></div>
                <div className="flex justify-between"><span>Warehouse Charges</span><span>{formatCurrency(data.charges.warehouseCharges)}</span></div>
                <div className="flex justify-between"><span>Insurance Charges</span><span>{formatCurrency(data.charges.insuranceCharges)}</span></div>
                <div className="flex justify-between"><span>Customs Charges</span><span>{formatCurrency(data.charges.customsCharges)}</span></div>
                <div className="flex justify-between"><span>Documentation</span><span>{formatCurrency(data.charges.documentationCharges)}</span></div>
                <div className="flex justify-between"><span>Other Charges</span><span>{formatCurrency(data.charges.otherCharges)}</span></div>
                <div className="flex justify-between pt-4 mt-2 border-t border-slate-200 font-black text-slate-900 text-lg">
                  <span>Subtotal</span><span>{formatCurrency(data.charges.subtotal)}</span>
                </div>
              </div>
            </section>

            <div className="space-y-8">
              {/* SECTION 3: TAX SUMMARY */}
              <section id="tax" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                  <Receipt className="w-5 h-5 text-emerald-600"/> Tax Summary
                </h2>
                {data.taxes.map((tax, i) => (
                  <div key={i} className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                    <span>{tax.type} ({tax.percentage}%)</span><span>{formatCurrency(tax.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-4 mt-2 border-t border-slate-200 font-black text-slate-900 text-lg">
                  <span>Total Tax</span><span>{formatCurrency(data.totals.tax)}</span>
                </div>
              </section>

              {/* SECTION 4: DISCOUNTS */}
              <section id="discounts" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                  <Percent className="w-5 h-5 text-rose-600"/> Discounts
                </h2>
                <div className="space-y-2 text-sm font-medium text-slate-700 mb-4">
                  <div className="flex justify-between"><span>Customer Discount</span><span className="text-rose-600">-{formatCurrency(data.discounts.customerDiscount)}</span></div>
                  <div className="flex justify-between"><span>Promotional Discount</span><span className="text-rose-600">-{formatCurrency(data.discounts.promotionalDiscount)}</span></div>
                </div>
                <div className="flex justify-between pt-4 mt-2 border-t border-slate-200 font-black text-slate-900 text-lg">
                  <span>Net Discount</span><span className="text-rose-600">-{formatCurrency(data.totals.discount)}</span>
                </div>
              </section>
            </div>
          </div>

          {/* SECTION 5: TOTAL SUMMARY */}
          <section id="total" className="bg-slate-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-10"><DollarSign className="w-64 h-64" /></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-1">Grand Total</p>
                <h2 className="text-5xl font-black tracking-tight">{formatCurrency(data.totals.grandTotal)}</h2>
              </div>
              <div className="flex gap-12 mt-6 md:mt-0 text-right">
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-1">Paid Amount</p>
                  <p className="text-2xl font-bold text-emerald-400">{formatCurrency(data.totals.paidAmount)}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-1">Outstanding</p>
                  <p className="text-2xl font-bold text-amber-400">{formatCurrency(data.totals.outstandingAmount)}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* SECTION 6: INVOICE INFORMATION */}
            <section id="invoice" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <FileText className="w-5 h-5 text-blue-600"/> External Invoice Reference
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Invoice Number</p>
                  <p className="font-bold text-slate-800">{data.invoice.number}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Invoice Date</p>
                  <p className="font-bold text-slate-800">{data.invoice.date}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Due Date</p>
                  <p className="font-bold text-slate-800">{data.invoice.dueDate}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Payment Terms</p>
                  <p className="font-bold text-slate-800">{data.invoice.terms}</p>
                </div>
              </div>
            </section>

            {/* SECTION 8: FINANCIAL NOTES */}
            <section id="notes" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <FileSpreadsheet className="w-5 h-5 text-amber-600"/> Financial Notes
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Billing Notes</p>
                  <p className="text-sm font-medium text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">{data.notes.billing}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Internal Notes</p>
                  <p className="text-sm font-medium text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">{data.notes.internal}</p>
                </div>
              </div>
            </section>
          </div>

        </div>

        {/* SECTION 10: STICKY RIGHT SIDEBAR */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 sticky top-0 overflow-y-auto">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button disabled={data.invoice.status !== 'ISSUED'} className="w-full flex items-center gap-3 p-3 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-100 disabled:opacity-50 transition-colors">
                <Eye className="w-4 h-4"/> View Invoice PDF
              </button>
              <button disabled={data.invoice.status !== 'ISSUED'} className="w-full flex items-center gap-3 p-3 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 disabled:opacity-50 transition-colors">
                <Download className="w-4 h-4"/> Download Invoice
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors">
                <CreditCard className="w-4 h-4"/> View Customer Ledger
              </button>
            </div>
          </div>
          
          <div className="p-6 flex-1">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500"/> Integration Alerts
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-100 text-xs font-bold flex gap-2 items-start">
                <Clock className="w-4 h-4 shrink-0" />
                <p>Ensure customs charges are finalized before generating the Billing Request.</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 text-xs font-bold flex gap-2 items-start">
                <Activity className="w-4 h-4 shrink-0" />
                <p>Data linked to central Accounting via Finance API Gateway.</p>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

// Temporary icon mapping for missing imports
import { Eye } from 'lucide-react';
