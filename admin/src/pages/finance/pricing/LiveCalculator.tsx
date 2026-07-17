import React, { useState } from 'react';
import { Calculator, ArrowRight, Zap, CheckCircle, Ship, Plane, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LiveCalculator() {
  const [form, setForm] = useState({
    customerId: 'CUST-1049',
    originCode: 'JFK',
    destinationCode: 'LHR',
    transportMode: 'AIR',
    weightKg: 0,
    volumeCbm: 0,
    containerCount: 0,
    equipmentType: 'TEU'
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('http://localhost:5000/api/erp/pricing/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Calculation failed');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/finance/pricing" className="text-indigo-600 text-sm font-medium hover:underline mb-2 inline-block">&larr; Back to Dashboard</Link>
          <h1 className="text-2xl font-bold text-gray-900">Live Rate Calculator</h1>
          <p className="text-sm text-gray-500 mt-1">Instantly quote shipments using the ERP Pricing Engine algorithm.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-6 flex items-center"><Calculator className="mr-2 text-indigo-600"/> Shipment Parameters</h2>
            
            <form onSubmit={calculate} className="space-y-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Customer ID (For Contracts)</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg p-2 text-sm" value={form.customerId} onChange={e => setForm({...form, customerId: e.target.value})} />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Origin Code</label>
                     <input type="text" className="w-full border border-gray-300 rounded-lg p-2 text-sm font-mono uppercase" value={form.originCode} onChange={e => setForm({...form, originCode: e.target.value.toUpperCase()})} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Dest Code</label>
                     <input type="text" className="w-full border border-gray-300 rounded-lg p-2 text-sm font-mono uppercase" value={form.destinationCode} onChange={e => setForm({...form, destinationCode: e.target.value.toUpperCase()})} />
                  </div>
               </div>

               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Transport Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                     <button type="button" onClick={() => setForm({...form, transportMode: 'OCEAN'})} className={`p-2 rounded-lg border text-sm font-bold flex justify-center items-center ${form.transportMode === 'OCEAN' ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-gray-50 text-gray-500'}`}><Ship size={16} className="mr-2"/> OCEAN</button>
                     <button type="button" onClick={() => setForm({...form, transportMode: 'AIR'})} className={`p-2 rounded-lg border text-sm font-bold flex justify-center items-center ${form.transportMode === 'AIR' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-gray-50 text-gray-500'}`}><Plane size={16} className="mr-2"/> AIR</button>
                     <button type="button" onClick={() => setForm({...form, transportMode: 'ROAD'})} className={`p-2 rounded-lg border text-sm font-bold flex justify-center items-center ${form.transportMode === 'ROAD' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-50 text-gray-500'}`}><Truck size={16} className="mr-2"/> ROAD</button>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Weight (KG)</label>
                     <input type="number" className="w-full border border-gray-300 rounded-lg p-2 text-sm" value={form.weightKg} onChange={e => setForm({...form, weightKg: Number(e.target.value)})} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Volume (CBM)</label>
                     <input type="number" className="w-full border border-gray-300 rounded-lg p-2 text-sm" value={form.volumeCbm} onChange={e => setForm({...form, volumeCbm: Number(e.target.value)})} />
                  </div>
               </div>

               {form.transportMode === 'OCEAN' && (
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Container Count</label>
                       <input type="number" className="w-full border border-gray-300 rounded-lg p-2 text-sm" value={form.containerCount} onChange={e => setForm({...form, containerCount: Number(e.target.value)})} />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Equipment</label>
                       <select className="w-full border border-gray-300 rounded-lg p-2 text-sm" value={form.equipmentType} onChange={e => setForm({...form, equipmentType: e.target.value})}>
                          <option value="TEU">20ft (TEU)</option>
                          <option value="FEU">40ft (FEU)</option>
                       </select>
                    </div>
                 </div>
               )}

               <div className="pt-4 mt-4 border-t border-gray-100">
                  <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50">
                     {loading ? 'Calculating via AI Engine...' : 'Generate Quote'}
                  </button>
               </div>

               {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                     {error}
                  </div>
               )}
            </form>
         </div>

         <div>
            {result ? (
               <div className="bg-gray-900 text-white rounded-2xl border border-gray-800 shadow-xl overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                  <div className="p-8">
                     <div className="flex justify-between items-start mb-8">
                        <div>
                           <h2 className="text-xl font-bold mb-1">Quotation Result</h2>
                           <p className="text-sm text-gray-400 font-mono">{result.route}</p>
                        </div>
                        <div className="flex items-center space-x-2 bg-indigo-900 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold">
                           <Zap size={14} />
                           <span>{result.appliedRateType} RATE</span>
                        </div>
                     </div>

                     <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-end border-b border-gray-800 pb-3">
                           <span className="text-gray-400">Base Freight</span>
                           <span className="font-mono text-gray-200">{result.currency} {result.baseFreight.toFixed(2)}</span>
                        </div>

                        {result.surcharges.map((s: any, idx: number) => (
                           <div key={idx} className="flex justify-between items-end border-b border-gray-800 pb-3">
                              <span className="text-gray-400">Surcharge: {s.name}</span>
                              <span className="font-mono text-gray-200">+{result.currency} {s.amount.toFixed(2)}</span>
                           </div>
                        ))}

                        {result.discountAmount > 0 && (
                           <div className="flex justify-between items-end border-b border-gray-800 pb-3 text-emerald-400">
                              <span>Contract Discount Applied</span>
                              <span className="font-mono">-{result.currency} {result.discountAmount.toFixed(2)}</span>
                           </div>
                        )}

                        <div className="flex justify-between items-end pt-4 pb-2">
                           <span className="text-lg font-bold">Net Freight Quote</span>
                           <span className="text-3xl font-extrabold text-indigo-400 font-mono">{result.currency} {result.netFreight.toFixed(2)}</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="bg-gray-800 p-6 border-t border-gray-700 text-sm">
                     <h3 className="font-bold mb-3 text-gray-300">Margin Analysis</h3>
                     <div className="flex justify-between items-center text-gray-400 mb-2">
                        <span>Est. Buy Rate (Carrier Cost):</span>
                        <span className="font-mono">{result.currency} {result.marginAnalysis.estimatedBuyRate.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="font-bold text-white">Projected Gross Margin:</span>
                        <span className="font-bold text-emerald-400">{result.marginAnalysis.marginPercent.toFixed(1)}%</span>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="bg-gray-50 rounded-2xl border border-gray-100 shadow-sm p-12 text-center h-full flex flex-col justify-center items-center text-gray-400">
                  <Calculator size={48} className="mb-4 opacity-20" />
                  <p>Enter shipment parameters to calculate automated freight rates based on system rules and contracts.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
