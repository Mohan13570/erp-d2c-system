import React, { useState } from 'react';
import { Save, Plus, Trash2, Calculator, CheckCircle, Ship, Package, Briefcase, Hash } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function CreateInvoice() {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([{ description: '', quantity: 1, unitPrice: 0, discountAmount: 0 }]);
  const [charges, setCharges] = useState<any[]>([{ chargeType: 'FREIGHT', description: '', amount: 0 }]);
  const [taxes, setTaxes] = useState<any[]>([{ taxType: 'GST', taxPercent: 18 }]);
  
  const [form, setForm] = useState({
    customerId: '',
    invoiceType: 'SHIPMENT',
    dueDate: '',
    currency: 'USD',
    referenceNumber: '',
    shipmentNumber: ''
  });

  const [calc, setCalc] = useState({ subtotal: 0, freight: 0, tax: 0, total: 0 });

  const calculatePreview = () => {
     let sub = 0;
     items.forEach(i => sub += (Number(i.quantity) * Number(i.unitPrice)) - Number(i.discountAmount));
     let frt = 0;
     charges.forEach(c => frt += Number(c.amount));
     
     let taxAmt = 0;
     taxes.forEach(t => taxAmt += ((sub + frt) * Number(t.taxPercent)) / 100);
     
     setCalc({ subtotal: sub, freight: frt, tax: taxAmt, total: sub + frt + taxAmt });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, items, charges, taxes };
    
    try {
      const res = await fetch('http://localhost:5000/api/erp/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) navigate('/finance/billing');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/finance/billing" className="text-indigo-600 text-sm font-medium hover:underline mb-2 inline-block">&larr; Back to Invoices</Link>
          <h1 className="text-2xl font-bold text-gray-900">Create Commercial Invoice</h1>
          <p className="text-sm text-gray-500 mt-1">Generate a draft invoice, calculate taxes, and add freight charges.</p>
        </div>
        <div className="flex space-x-3">
           <button onClick={calculatePreview} className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center">
             <Calculator size={16} className="mr-2" /> Calculate Math
           </button>
           <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center shadow-sm">
             <Save size={16} className="mr-2" /> Save Draft Invoice
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
               <h2 className="font-bold text-gray-900 mb-6 flex items-center"><Briefcase className="mr-2 text-indigo-600"/> General Details</h2>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                     <input type="text" className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="e.g. CUST-1049" value={form.customerId} onChange={e => setForm({...form, customerId: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Type</label>
                     <select className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" value={form.invoiceType} onChange={e => setForm({...form, invoiceType: e.target.value})}>
                        <option value="SHIPMENT">Ocean/Air Shipment</option>
                        <option value="WAREHOUSE">Warehouse Storage</option>
                        <option value="CUSTOMS">Customs Clearance</option>
                        <option value="PROFORMA">Proforma Invoice</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                     <input type="date" className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                     <select className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="AED">AED - Arab Dirham</option>
                     </select>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="font-bold text-gray-900 flex items-center"><Package className="mr-2 text-indigo-600"/> Line Items</h2>
                  <button onClick={() => setItems([...items, { description: '', quantity: 1, unitPrice: 0, discountAmount: 0 }])} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center"><Plus size={16} className="mr-1"/> Add Item</button>
               </div>
               <div className="space-y-4">
                  {items.map((item, idx) => (
                     <div key={idx} className="flex space-x-3 items-end p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                        <div className="flex-1">
                           <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                           <input type="text" className="w-full border border-gray-300 rounded text-sm p-2" value={item.description} onChange={e => { const n = [...items]; n[idx].description = e.target.value; setItems(n); }} />
                        </div>
                        <div className="w-20">
                           <label className="block text-xs font-bold text-gray-500 mb-1">Qty</label>
                           <input type="number" className="w-full border border-gray-300 rounded text-sm p-2" value={item.quantity} onChange={e => { const n = [...items]; n[idx].quantity = Number(e.target.value); setItems(n); }} />
                        </div>
                        <div className="w-32">
                           <label className="block text-xs font-bold text-gray-500 mb-1">Unit Price</label>
                           <input type="number" className="w-full border border-gray-300 rounded text-sm p-2" value={item.unitPrice} onChange={e => { const n = [...items]; n[idx].unitPrice = Number(e.target.value); setItems(n); }} />
                        </div>
                        <div className="w-32">
                           <label className="block text-xs font-bold text-gray-500 mb-1">Discount Amt</label>
                           <input type="number" className="w-full border border-gray-300 rounded text-sm p-2" value={item.discountAmount} onChange={e => { const n = [...items]; n[idx].discountAmount = Number(e.target.value); setItems(n); }} />
                        </div>
                        <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="p-2 text-red-500 hover:bg-red-50 rounded mb-1"><Trash2 size={16}/></button>
                     </div>
                  ))}
               </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="font-bold text-gray-900 flex items-center"><Ship className="mr-2 text-indigo-600"/> Freight & Surcharges</h2>
                  <button onClick={() => setCharges([...charges, { chargeType: 'FREIGHT', description: '', amount: 0 }])} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center"><Plus size={16} className="mr-1"/> Add Charge</button>
               </div>
               <div className="space-y-4">
                  {charges.map((charge, idx) => (
                     <div key={idx} className="flex space-x-3 items-end p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                        <div className="w-40">
                           <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
                           <select className="w-full border border-gray-300 rounded text-sm p-2" value={charge.chargeType} onChange={e => { const n = [...charges]; n[idx].chargeType = e.target.value; setCharges(n); }}>
                              <option value="FREIGHT">Ocean/Air Freight</option>
                              <option value="FUEL">Fuel Surcharge (BAF)</option>
                              <option value="LOADING">THC / Loading</option>
                              <option value="CUSTOMS">Customs Doc Fee</option>
                           </select>
                        </div>
                        <div className="flex-1">
                           <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                           <input type="text" className="w-full border border-gray-300 rounded text-sm p-2" value={charge.description} onChange={e => { const n = [...charges]; n[idx].description = e.target.value; setCharges(n); }} />
                        </div>
                        <div className="w-40">
                           <label className="block text-xs font-bold text-gray-500 mb-1">Amount</label>
                           <input type="number" className="w-full border border-gray-300 rounded text-sm p-2" value={charge.amount} onChange={e => { const n = [...charges]; n[idx].amount = Number(e.target.value); setCharges(n); }} />
                        </div>
                        <button onClick={() => setCharges(charges.filter((_, i) => i !== idx))} className="p-2 text-red-500 hover:bg-red-50 rounded mb-1"><Trash2 size={16}/></button>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-gray-900 text-white rounded-2xl p-6 sticky top-6 shadow-xl">
               <h2 className="font-bold mb-6 flex items-center"><Calculator className="mr-2"/> Live Summary</h2>
               
               <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-400">Subtotal</span>
                     <span className="font-mono">{calc.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-400">Freight & Charges</span>
                     <span className="font-mono">{calc.freight.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-400">Calculated Tax (18%)</span>
                     <span className="font-mono text-indigo-400">+{calc.tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-800">
                     <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-gray-300">Grand Total ({form.currency})</span>
                        <span className="text-3xl font-extrabold tracking-tight">{calc.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                     </div>
                  </div>
               </div>
               
               <div className="mt-8 pt-6 border-t border-gray-800">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Tax Configuration</h3>
                  {taxes.map((t, idx) => (
                     <div key={idx} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                        <span className="text-sm font-bold">{t.taxType}</span>
                        <span className="text-sm text-gray-400">{t.taxPercent}%</span>
                     </div>
                  ))}
               </div>
               
               <button onClick={handleSave} className="w-full mt-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition">
                  Save as Draft Invoice
               </button>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
               <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center"><Hash className="mr-2 text-indigo-600"/> References</h3>
               <div className="space-y-3">
                  <input type="text" placeholder="Shipment/AWB Number" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" value={form.shipmentNumber} onChange={e => setForm({...form, shipmentNumber: e.target.value})} />
                  <input type="text" placeholder="Customer PO Ref" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" value={form.referenceNumber} onChange={e => setForm({...form, referenceNumber: e.target.value})} />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
