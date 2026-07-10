import React, { useState } from 'react';
import { Package, Navigation, ArrowRight, Anchor, Truck, Plane, MapPin, UploadCloud, Calendar, DollarSign, CheckCircle, Save, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else navigate('/customer/logistics'); // In real app, submit payload here
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Booking</h1>
          <p className="text-sm text-gray-500 mt-1">Request a quotation and schedule a pickup</p>
        </div>
        <button className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-xl bg-white shadow-sm">
          <Save size={16} />
          <span>Save Draft</span>
        </button>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0"></div>
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full z-0 transition-all duration-500`} style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          
          {['Route Details', 'Cargo Specification', 'Pickup Scheduling', 'Review'].map((label, idx) => {
            const isActive = step >= idx + 1;
            const isCurrent = step === idx + 1;
            return (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                  isActive ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-indigo-100' : ''}`}>
                  {isActive && !isCurrent ? <CheckCircle size={18} /> : idx + 1}
                </div>
                <span className={`absolute top-12 text-xs font-semibold whitespace-nowrap ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 min-h-[400px]">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-gray-900">Route & Mode</h2>
            <div className="grid grid-cols-3 gap-4">
              <label className="border-2 border-indigo-600 bg-indigo-50 rounded-xl p-4 flex flex-col items-center cursor-pointer transition-all">
                <input type="radio" name="mode" className="sr-only" defaultChecked />
                <Anchor size={32} className="text-indigo-600 mb-2" />
                <span className="font-semibold text-indigo-900">Ocean Freight</span>
              </label>
              <label className="border-2 border-gray-100 hover:border-gray-200 bg-white rounded-xl p-4 flex flex-col items-center cursor-pointer transition-all">
                <input type="radio" name="mode" className="sr-only" />
                <Plane size={32} className="text-gray-400 mb-2" />
                <span className="font-semibold text-gray-600">Air Freight</span>
              </label>
              <label className="border-2 border-gray-100 hover:border-gray-200 bg-white rounded-xl p-4 flex flex-col items-center cursor-pointer transition-all">
                <input type="radio" name="mode" className="sr-only" />
                <Truck size={32} className="text-gray-400 mb-2" />
                <span className="font-semibold text-gray-600">Road Transport</span>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origin Port/City</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. Shanghai Port" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination Port/City</label>
                <div className="relative">
                  <Navigation size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. Port of Los Angeles" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-xl font-bold text-gray-900">Cargo Details</h2>
             <div className="grid grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Commodity Type</label>
                 <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                   <option>General Cargo</option>
                   <option>Electronics</option>
                   <option>Garments</option>
                   <option>Dangerous Goods</option>
                   <option>Perishables</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">HS Code (Optional)</label>
                 <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="8542.31.0000" />
               </div>
             </div>
             <div className="grid grid-cols-3 gap-6">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Total Weight</label>
                 <div className="flex">
                   <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-l-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-r-0" placeholder="1000" />
                   <select className="bg-gray-50 border border-gray-200 rounded-r-xl px-2 text-sm text-gray-600 focus:ring-0">
                     <option>KG</option>
                     <option>LBS</option>
                   </select>
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Total Volume</label>
                 <div className="flex">
                   <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-l-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-r-0" placeholder="2.5" />
                   <select className="bg-gray-50 border border-gray-200 rounded-r-xl px-2 text-sm text-gray-600 focus:ring-0">
                     <option>CBM</option>
                     <option>CUFT</option>
                   </select>
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Package Count</label>
                 <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="20 Pallets" />
               </div>
             </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-xl font-bold text-gray-900">Pickup & Origin Handling</h2>
             <div className="p-4 bg-indigo-50 rounded-xl flex items-start space-x-3 border border-indigo-100">
               <Info size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
               <p className="text-sm text-indigo-900">Leave blank if you will deliver the cargo directly to our warehouse/port.</p>
             </div>
             
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
               <textarea className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24" placeholder="Enter complete factory or warehouse address..."></textarea>
             </div>
             
             <div className="grid grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Pickup Date</label>
                 <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="date" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                 <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="+1 (555) 000-0000" />
               </div>
             </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-xl font-bold text-gray-900">Final Review</h2>
             <p className="text-gray-500">Please review your booking details before converting it into an RFQ to receive competitive quotes.</p>
             
             <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-4">
               <div className="grid grid-cols-2 gap-4 text-sm">
                 <div>
                   <p className="text-gray-500 mb-1">Transport Mode</p>
                   <p className="font-semibold text-gray-900 flex items-center"><Anchor size={14} className="text-indigo-600 mr-2" /> Ocean Freight</p>
                 </div>
                 <div>
                   <p className="text-gray-500 mb-1">Route</p>
                   <p className="font-semibold text-gray-900">Shanghai <ArrowRight size={12} className="inline mx-1 text-gray-400"/> Los Angeles</p>
                 </div>
                 <div>
                   <p className="text-gray-500 mb-1">Cargo</p>
                   <p className="font-semibold text-gray-900">1000 KG / 2.5 CBM</p>
                 </div>
                 <div>
                   <p className="text-gray-500 mb-1">Pickup Scheduled</p>
                   <p className="font-semibold text-gray-900">Yes</p>
                 </div>
               </div>
             </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4">
        <button 
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button 
          onClick={handleNext}
          className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all flex items-center space-x-2"
        >
          <span>{step === 4 ? 'Submit Request for Quote' : 'Continue'}</span>
          {step < 4 && <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
}
