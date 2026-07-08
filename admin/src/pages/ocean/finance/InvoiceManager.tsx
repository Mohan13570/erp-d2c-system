import React, { useState } from 'react';
import { DollarSign, Save, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InvoiceManager() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bookingId: '',
    type: 'Receivable',
    partyName: '',
    currencyId: 'USD',
    grandTotal: 0
  });
  
  const [lines, setLines] = useState([{ description: 'Ocean Freight (O/F)', unitPrice: 0, quantity: 1, lineTotal: 0 }]);

  const addLine = () => setLines([...lines, { description: '', unitPrice: 0, quantity: 1, lineTotal: 0 }]);

  const handleSubmit = async () => {
    // Basic calculation
    const calculatedTotal = lines.reduce((acc, curr) => acc + (curr.unitPrice * curr.quantity), 0);
    
    try {
      const res = await fetch('/api/ocean/finance/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           ...formData,
           grandTotal: calculatedTotal,
           lines: lines.map(l => ({ ...l, lineTotal: l.unitPrice * l.quantity }))
        })
      });
      if (res.ok) {
         navigate('/ocean/finance/billing');
      }
    } catch (e) {
      alert("Failed to generate invoice.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
           <DollarSign size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Generate Invoice / Bill</h1>
          <p className="text-gray-500 text-sm">Create Accounts Receivable (Customer Invoices) or Accounts Payable (Vendor Bills).</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
         <div className="grid grid-cols-2 gap-6 border-b pb-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Type</label>
               <select className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                       value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="Receivable">Accounts Receivable (Customer Invoice)</option>
                  <option value="Payable">Accounts Payable (Vendor Bill)</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Booking Reference ID</label>
               <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500" 
                      placeholder="e.g. BKG-123456" value={formData.bookingId} onChange={e => setFormData({...formData, bookingId: e.target.value})} />
            </div>
            <div className="col-span-2">
               <label className="block text-sm font-medium text-gray-700 mb-2">{formData.type === 'Receivable' ? 'Bill To (Customer Name)' : 'Bill From (Vendor/Agent)'}</label>
               <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500" 
                      value={formData.partyName} onChange={e => setFormData({...formData, partyName: e.target.value})} />
            </div>
         </div>

         <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Charge Lines (BAF, CAF, THC, Freight)</h3>
            {lines.map((line, idx) => (
               <div key={idx} className="flex space-x-4 items-center">
                  <input type="text" placeholder="Charge Description" className="flex-1 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                         value={line.description} onChange={e => {
                            const newLines = [...lines];
                            newLines[idx].description = e.target.value;
                            setLines(newLines);
                         }} />
                  <input type="number" placeholder="Qty" className="w-24 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                         value={line.quantity} onChange={e => {
                            const newLines = [...lines];
                            newLines[idx].quantity = Number(e.target.value);
                            setLines(newLines);
                         }} />
                  <input type="number" placeholder="Unit Price" className="w-32 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                         value={line.unitPrice} onChange={e => {
                            const newLines = [...lines];
                            newLines[idx].unitPrice = Number(e.target.value);
                            setLines(newLines);
                         }} />
               </div>
            ))}
            <button onClick={addLine} className="text-emerald-600 text-sm font-medium flex items-center space-x-1 hover:underline mt-2">
               <Plus size={16}/> <span>Add Charge Line</span>
            </button>
         </div>

         <div className="flex justify-end pt-4 border-t border-gray-100">
            <button onClick={handleSubmit} className="bg-emerald-600 text-white px-6 py-2 rounded-xl flex items-center space-x-2">
               <Save size={18}/> <span>Generate Document</span>
            </button>
         </div>
      </div>
    </div>
  );
}
