import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, PackagePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateShipmentWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    freightType: 'Ocean',
    cargo: [{}],
    locations: [{ type: 'Pickup' }, { type: 'Destination' }],
    carrier: {},
    charges: {}
  });
  const navigate = useNavigate();

  const handleNext = () => setStep(s => Math.min(s + 1, 8));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/v1/shipments/wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        navigate('/shipments/list');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const steps = [
    'Customer Info', 'Cargo Info', 'Pickup', 'Destination', 'Carrier', 'Charges', 'Documents', 'Review'
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-8 shrink-0">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create Shipment</h1>
        <p className="text-gray-500 font-medium mt-1">Multi-modal shipment generation wizard.</p>
        
        {/* Stepper */}
        <div className="flex items-center mt-8">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className={`flex flex-col items-center ${step === i + 1 ? 'text-indigo-600' : step > i + 1 ? 'text-emerald-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === i + 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : step > i + 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100'}`}>
                  {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span className="text-[10px] mt-2 font-bold uppercase tracking-wider hidden md:block">{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-1 mx-2 rounded ${step > i + 1 ? 'bg-emerald-400' : 'bg-gray-100'}`}></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex-1 overflow-auto p-8 relative">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-bold">Customer Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Shipper</label>
                <input className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-200 focus:border-indigo-500" onChange={e => setFormData({...formData, shipper: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Consignee</label>
                <input className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-200 focus:border-indigo-500" onChange={e => setFormData({...formData, consignee: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Freight Type</label>
                <select className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-200 focus:border-indigo-500" value={formData.freightType} onChange={e => setFormData({...formData, freightType: e.target.value})}>
                  <option value="Ocean">Ocean</option>
                  <option value="Air">Air</option>
                  <option value="Road">Road</option>
                  <option value="Rail">Rail</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Incoterms</label>
                <select className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-200 focus:border-indigo-500" onChange={e => setFormData({...formData, incoterms: e.target.value})}>
                  <option value="">Select Incoterm</option>
                  <option value="FOB">FOB (Free On Board)</option>
                  <option value="EXW">EXW (Ex Works)</option>
                  <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                  <option value="DDP">DDP (Delivered Duty Paid)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-bold">Cargo Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Commodity</label>
                <input className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" onChange={e => {
                  const cargo = [...formData.cargo];
                  cargo[0].commodity = e.target.value;
                  setFormData({...formData, cargo});
                }} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Gross Weight (kg)</label>
                <input type="number" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" onChange={e => {
                  const cargo = [...formData.cargo];
                  cargo[0].grossWeight = e.target.value;
                  setFormData({...formData, cargo});
                }} />
              </div>
            </div>
            <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-100 flex gap-4">
               <div>
                  <input type="checkbox" id="hazmat" className="w-5 h-5 accent-orange-600 rounded" onChange={e => setFormData({...formData, dangerousGoods: e.target.checked})} />
               </div>
               <div className="-mt-1">
                 <label htmlFor="hazmat" className="font-bold text-orange-900 block">Dangerous Goods (Hazmat)</label>
                 <p className="text-sm text-orange-700">Check this if the cargo requires special handling or UN certifications.</p>
               </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-bold">Charges & Profitability</h2>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Freight Cost ($)</label>
                <input type="number" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" onChange={e => setFormData({...formData, charges: {...formData.charges, freight: e.target.value}})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Customs ($)</label>
                <input type="number" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" onChange={e => setFormData({...formData, charges: {...formData.charges, customs: e.target.value}})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Expected Revenue ($)</label>
                <input type="number" className="w-full p-3 bg-emerald-50 rounded-xl border border-emerald-200 focus:border-emerald-500" onChange={e => setFormData({...formData, charges: {...formData.charges, expectedRevenue: e.target.value}})} />
              </div>
            </div>
            <div className="p-6 bg-slate-900 text-white rounded-2xl flex justify-between items-center mt-8 shadow-xl">
               <div>
                 <p className="text-slate-400 font-semibold uppercase text-sm">Calculated Profit</p>
                 <h3 className="text-4xl font-black text-emerald-400">
                   ${ (parseFloat(formData.charges.expectedRevenue || 0) - parseFloat(formData.charges.freight || 0) - parseFloat(formData.charges.customs || 0)).toFixed(2) }
                 </h3>
               </div>
               <PackagePlus size={48} className="text-slate-700" />
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-bold text-center">Review & Submit</h2>
            <div className="p-6 bg-gray-50 rounded-2xl max-w-2xl mx-auto space-y-4">
              <div className="flex justify-between border-b pb-4"><span className="text-gray-500">Freight Type:</span> <span className="font-bold">{formData.freightType}</span></div>
              <div className="flex justify-between border-b pb-4"><span className="text-gray-500">Shipper:</span> <span className="font-bold">{formData.shipper || 'N/A'}</span></div>
              <div className="flex justify-between border-b pb-4"><span className="text-gray-500">Consignee:</span> <span className="font-bold">{formData.consignee || 'N/A'}</span></div>
              <div className="flex justify-between pb-2"><span className="text-gray-500">Expected Profit:</span> <span className="font-bold text-emerald-600">${ (parseFloat(formData.charges?.expectedRevenue || 0) - parseFloat(formData.charges?.freight || 0) - parseFloat(formData.charges?.customs || 0)).toFixed(2) }</span></div>
            </div>
            <div className="text-center mt-8">
               <button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-black text-lg shadow-xl shadow-indigo-200 transition-all active:scale-95">Generate Shipment Workflow</button>
            </div>
          </div>
        )}

        {/* Skipped Steps Placeholder Message for UI simplicity in this context */}
        {[3,4,5,7].includes(step) && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
             <p className="text-lg font-bold">Standard Details Entry</p>
             <p className="text-sm">Proceed to next step</p>
          </div>
        )}

      </div>

      <div className="shrink-0 pt-6 flex justify-between items-center">
        <button onClick={handlePrev} disabled={step === 1} className={`px-6 py-3 font-bold rounded-xl flex items-center space-x-2 ${step === 1 ? 'text-gray-300' : 'text-gray-600 bg-white hover:bg-gray-50 border border-gray-200'}`}>
          <ArrowLeft size={18} /><span>Previous</span>
        </button>
        {step < 8 && (
          <button onClick={handleNext} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-gray-200 hover:bg-black">
            <span>Next Step</span><ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
