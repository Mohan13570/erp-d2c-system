import React, { useState, useEffect } from 'react';
import { FileText, Plus, CheckCircle, Clock, XCircle, Calculator, FileCheck, Anchor, Plane, Truck } from 'lucide-react';

export default function Quotations() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'rfqs' | 'quotes' | 'calculator'>('rfqs');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [calcState, setCalcState] = useState({ buyRate: 0, margin: 0, sellRate: 0 });

  const fetchData = async () => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      const [rfqRes, quoteRes] = await Promise.all([
        fetch('/api/quotations/rfqs', { headers }),
        fetch('/api/quotations', { headers })
      ]);
      if (rfqRes.ok) setRfqs(await rfqRes.json());
      if (quoteRes.ok) setQuotes(await quoteRes.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = activeTab === 'rfqs' ? 'rfqs' : '';
    const payload = { ...formData };
    if (activeTab === 'quotes' && payload.validUntil) {
      payload.validUntil = new Date(payload.validUntil).toISOString();
    }
    try {
      const res = await fetch(`/api/quotations/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({});
        fetchData();
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col relative">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Sales & Quotations</h1>
          <p className="text-gray-500 font-medium mt-1">Manage RFQs, Air/Ocean Freight Quotes, and Margin Approvals.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2">
          <Plus size={18} /><span>Add {activeTab === 'rfqs' ? 'RFQ' : 'Quote'}</span>
        </button>
      </div>

      <div className="bg-gray-100/80 p-1.5 rounded-2xl w-fit flex space-x-1 mb-6 shrink-0">
        <button onClick={() => setActiveTab('rfqs')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'rfqs' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500'}`}>
          <FileText size={18} className="mr-2" /> RFQ Management
        </button>
        <button onClick={() => setActiveTab('quotes')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'quotes' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500'}`}>
          <FileCheck size={18} className="mr-2" /> Quotations
        </button>
        <button onClick={() => setActiveTab('calculator')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'calculator' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500'}`}>
          <Calculator size={18} className="mr-2" /> Margin Calculator
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'rfqs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rfqs.map(rfq => (
              <div key={rfq.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    {rfq.freightType === 'Ocean' ? <Anchor className="text-blue-500" size={20}/> : 
                     rfq.freightType === 'Air' ? <Plane className="text-sky-500" size={20}/> : 
                     <Truck className="text-emerald-500" size={20}/>}
                    <h3 className="font-bold text-gray-900">{rfq.freightType} RFQ</h3>
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold rounded-lg ${rfq.status === 'Open' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>{rfq.status}</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Route:</strong> {rfq.origin} → {rfq.destination}</p>
                  <p><strong>Cargo:</strong> {rfq.expectedWeight} kg / {rfq.expectedVolume} cbm</p>
                  <p className="text-xs text-gray-400">Received: {new Date(rfq.requestDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'quotes' && (
          <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <thead className="bg-gray-50"><tr>
              {['Quote ID', 'RFQ Route', 'Total Value', 'Status', 'Approvals'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {quotes.map(q => (
                <tr key={q.id}>
                  <td className="px-6 py-4 font-bold text-gray-900">{q.id.split('-')[0].toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{q.rfq?.origin} → {q.rfq?.destination}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">${q.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">{q.status}</span></td>
                  <td className="px-6 py-4 text-sm">{q.approvals?.length || 0} / 1 required</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'calculator' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
             <h2 className="text-xl font-bold mb-6 flex items-center"><Calculator className="mr-2"/> Freight Cost Engine</h2>
             <div className="space-y-4">
                <input type="number" placeholder="Buy Rate ($)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setCalcState({...calcState, buyRate: parseFloat(e.target.value) || 0})} />
                <input type="number" placeholder="Target Margin (%)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setCalcState({...calcState, margin: parseFloat(e.target.value) || 0})} />
                <button 
                  onClick={() => {
                    const sell = calcState.buyRate / (1 - (calcState.margin / 100));
                    setCalcState({...calcState, sellRate: sell});
                  }}
                  className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800">
                  Calculate Sell Rate
                </button>
                {calcState.sellRate > 0 && (
                  <div className="mt-4 p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center">
                    <p className="text-sm font-semibold">Recommended Sell Rate:</p>
                    <p className="text-3xl font-black">${calcState.sellRate.toFixed(2)}</p>
                  </div>
                )}
             </div>
          </div>
        )}
      </div>

      {showModal && (activeTab === 'rfqs' || activeTab === 'quotes') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Create {activeTab === 'rfqs' ? 'RFQ' : 'Quotation'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'rfqs' ? (
                <>
                  <select required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" onChange={e => setFormData({...formData, freightType: e.target.value})}>
                    <option value="">Select Transport Mode</option>
                    <option value="Air">Air Freight</option>
                    <option value="Ocean">Ocean Freight</option>
                    <option value="Road">Road Freight</option>
                    <option value="Rail">Rail Freight</option>
                  </select>
                  <div className="flex gap-4">
                    <input required placeholder="Origin Port" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, origin: e.target.value})} />
                    <input required placeholder="Destination Port" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, destination: e.target.value})} />
                  </div>
                  <div className="flex gap-4">
                    <input type="number" placeholder="Weight (kg)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, expectedWeight: parseFloat(e.target.value)})} />
                    <input type="number" placeholder="Volume (CBM)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, expectedVolume: parseFloat(e.target.value)})} />
                  </div>
                </>
              ) : (
                <>
                  <select required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" onChange={e => setFormData({...formData, rfqId: e.target.value})}>
                    <option value="">Select Target RFQ</option>
                    {rfqs.filter(r => r.status === 'Open').map(r => (
                      <option key={r.id} value={r.id}>{r.freightType} RFQ: {r.origin} → {r.destination}</option>
                    ))}
                  </select>
                  <input required type="number" placeholder="Total Amount ($)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, totalAmount: parseFloat(e.target.value)})} />
                  <input required type="date" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, validUntil: e.target.value})} />
                </>
              )}
              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
