import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Truck, CheckCircle, Package, UserCheck, ShieldAlert,
  Camera, FileText, UploadCloud, MapPin, Search, Edit3, Save, RefreshCw, Send, XCircle, AlertTriangle
} from 'lucide-react';

export default function OperationsManagement() {
  const { id } = useParams();
  const [isSaving, setIsSaving] = useState(false);
  const [shipmentStatus, setShipmentStatus] = useState('DISPATCHED');
  
  // Dummy Form State
  const { register, watch, handleSubmit } = useForm({
    defaultValues: {
      pickupStatus: 'SCHEDULED',
      deliveryStatus: 'PENDING',
      checklist: {
        cargoReady: true,
        documentsReady: true,
        vehicleReady: true,
      },
      pod: {
        receiverName: '',
        signature: null
      }
    }
  });

  const formValues = watch();

  const handleAction = (newStatus: string) => {
    setIsSaving(true);
    setTimeout(() => {
      setShipmentStatus(newStatus);
      setIsSaving(false);
      alert(`Shipment Status updated to \${newStatus}`);
    }, 1000);
  };

  const onSubmit = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Operations Data Saved!');
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      {/* 1. STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 shrink-0 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Pickup & Delivery Ops</h1>
          </div>
          <div className="h-6 w-px bg-slate-200 mx-2"></div>
          <div>
            <span className="text-2xl font-black text-blue-700 tracking-tighter">TRK-90218-444</span>
            <span className={`ml-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest
              \${shipmentStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {shipmentStatus}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleSubmit(onSubmit)} className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold text-sm transition-colors shadow-sm">
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
            Save Progress
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* 2. MAIN CONTENT SCROLLABLE */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-[#F8FAFC]">
          <div className="max-w-5xl mx-auto space-y-6 pb-20">

            {/* =============================================================== */}
            {/* PICKUP OPERATIONS (Sections 1-5) */}
            {/* =============================================================== */}
            <div className="bg-slate-900 text-white p-3 rounded-lg font-black tracking-widest uppercase text-sm shadow-md">
              A. Pickup Operations
            </div>

            {/* SECTION 1: PICKUP INFORMATION */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 border-l-4 border-l-blue-500">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-blue-600" /> Pickup Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Date & Slot</label>
                  <input type="datetime-local" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Address</label>
                  <input type="text" defaultValue="WH-NY-01, 123 Logistics Ave, New York" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50" readOnly />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person</label>
                  <input type="text" defaultValue="John Doe" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Mobile</label>
                  <input type="text" defaultValue="+1 555-0198" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
              </div>
            </section>

            {/* SECTION 3: LOADING OPERATIONS & SECTION 4: PICKUP CHECKLIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6">
                  <Package className="w-5 h-5 text-indigo-600" /> Loading Operations
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Loading Bay</label>
                    <input type="text" defaultValue="Bay 04" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
                      <input type="time" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1">End Time</label>
                      <input type="time" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Container Seal Number</label>
                    <input type="text" placeholder="Scan or Enter Seal ID" className="w-full px-3 py-2 border border-emerald-300 bg-emerald-50 rounded-lg text-sm font-bold" />
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6">
                  <CheckCircle className="w-5 h-5 text-emerald-600" /> Pickup Checklist
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" {...register('checklist.cargoReady')} className="w-5 h-5 rounded border-slate-300 text-blue-600" />
                    <span className="text-sm font-bold text-slate-700">Cargo & Package Count Verified</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" {...register('checklist.vehicleReady')} className="w-5 h-5 rounded border-slate-300 text-blue-600" />
                    <span className="text-sm font-bold text-slate-700">Vehicle & Container Inspection Passed</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" {...register('checklist.documentsReady')} className="w-5 h-5 rounded border-slate-300 text-blue-600" />
                    <span className="text-sm font-bold text-slate-700">Commercial Invoice & Documents Ready</span>
                  </label>
                </div>
              </section>
            </div>

            {/* SECTION 5: PICKUP DOCUMENTS */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 border-dashed border-2">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-slate-600" /> Pickup Documents & Gate Pass
              </h2>
              <div className="flex items-center justify-center h-32 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors group">
                <div className="text-center">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-blue-500" />
                  <p className="text-sm font-bold text-slate-600 group-hover:text-blue-600">Drag & Drop Loading Sheets / Gate Pass here</p>
                </div>
              </div>
            </section>

            {/* =============================================================== */}
            {/* DELIVERY OPERATIONS (Sections 6-10) */}
            {/* =============================================================== */}
            <div className="bg-slate-900 text-white p-3 rounded-lg font-black tracking-widest uppercase text-sm shadow-md mt-12">
              B. Delivery Operations & POD
            </div>

            {/* SECTION 6: DELIVERY INFORMATION */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 border-l-4 border-l-purple-500">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-purple-600" /> Delivery Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expected Delivery</label>
                  <input type="datetime-local" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Address</label>
                  <input type="text" defaultValue="WH-CHI-01, 456 Delivery Blvd, Chicago" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50" readOnly />
                </div>
              </div>
            </section>

            {/* SECTION 9: PROOF OF DELIVERY (POD) */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 border-l-4 border-l-emerald-500">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6">
                <Edit3 className="w-5 h-5 text-emerald-600" /> Proof of Delivery (POD)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Signature Pad Mock */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Receiver Digital Signature <span className="text-red-500">*</span></label>
                  <div className="h-48 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex items-center justify-center relative cursor-crosshair">
                     <span className="text-slate-300 font-bold select-none">Sign Here</span>
                     <div className="absolute bottom-2 right-2 flex gap-2">
                       <button type="button" className="text-xs bg-white border border-slate-200 px-2 py-1 rounded shadow-sm hover:bg-slate-100 font-medium">Clear</button>
                     </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Receiver Name (Print)</label>
                    <input type="text" {...register('pod.receiverName')} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                  </div>
                </div>

                {/* POD Evidence */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-slate-500"/> Delivery Photos
                    </label>
                    <div className="h-24 border border-slate-200 bg-slate-50 rounded-xl flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors">
                      <p className="text-xs font-bold text-slate-500">Tap to Camera / Upload (0 attached)</p>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">GPS Verification</h4>
                    <p className="text-sm font-mono text-emerald-700">Lat: 41.8781, Lng: -87.6298</p>
                    <p className="text-xs text-emerald-600 mt-1">✓ Location matches Delivery Address</p>
                  </div>
                </div>

              </div>
            </section>

            {/* SECTION 10: DELIVERY EXCEPTIONS */}
            <section className="bg-white rounded-2xl shadow-sm border border-red-200 p-8">
              <h2 className="text-lg font-black text-red-900 flex items-center gap-2 mb-6">
                <ShieldAlert className="w-5 h-5 text-red-600" /> Log Exception / Issue
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Exception Type</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                    <option value="">-- No Exceptions --</option>
                    <option value="DAMAGED">Shipment Damaged</option>
                    <option value="REFUSED">Customer Refused Delivery</option>
                    <option value="DELAYED">Weather/Traffic Delay</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Exception Notes</label>
                  <input type="text" placeholder="Detail any issues encountered..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
              </div>
            </section>

          </div>
        </main>

        {/* 3. STICKY RIGHT SIDEBAR */}
        <aside className="w-96 bg-white border-l border-slate-200 shrink-0 flex flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)]">
          <div className="p-6 flex-1 overflow-y-auto">
            
            <h3 className="font-black text-slate-900 mb-6 uppercase tracking-wider text-xs">Quick Actions</h3>
            
            {/* ACTION PIPELINE */}
            <div className="space-y-3 mb-8">
              <button 
                onClick={() => handleAction('LOADING')}
                disabled={shipmentStatus !== 'DISPATCHED'}
                className={`w-full font-bold py-3 rounded-xl shadow-sm transition-all text-sm flex justify-between items-center px-4
                \${shipmentStatus === 'DISPATCHED' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              >
                <span>1. Start Loading</span>
                <Send className="w-4 h-4" />
              </button>
              
              <button 
                onClick={() => handleAction('IN_TRANSIT')}
                disabled={shipmentStatus !== 'LOADING'}
                className={`w-full font-bold py-3 rounded-xl shadow-sm transition-all text-sm flex justify-between items-center px-4
                \${shipmentStatus === 'LOADING' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              >
                <span>2. Depart (In Transit)</span>
                <Truck className="w-4 h-4" />
              </button>

              <button 
                onClick={() => handleAction('OUT_FOR_DELIVERY')}
                disabled={shipmentStatus !== 'IN_TRANSIT'}
                className={`w-full font-bold py-3 rounded-xl shadow-sm transition-all text-sm flex justify-between items-center px-4
                \${shipmentStatus === 'IN_TRANSIT' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              >
                <span>3. Out For Delivery</span>
                <MapPin className="w-4 h-4" />
              </button>

              <button 
                onClick={() => handleAction('DELIVERED')}
                disabled={shipmentStatus !== 'OUT_FOR_DELIVERY'}
                className={`w-full font-black py-4 rounded-xl shadow-lg transition-all text-sm flex justify-between items-center px-4
                \${shipmentStatus === 'OUT_FOR_DELIVERY' ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                <span>4. Complete Delivery (POD)</span>
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>

            {/* SECTION 11: STATUS TIMELINE VISUALIZATION */}
            <h3 className="font-black text-slate-900 mb-6 uppercase tracking-wider text-xs">Live Status Timeline</h3>
            
            <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pb-4">
              
              <div className="relative pl-6">
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white
                  \${shipmentStatus === 'DELIVERED' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <p className={`text-sm font-bold \${shipmentStatus === 'DELIVERED' ? 'text-emerald-700' : 'text-slate-400'}`}>Delivered</p>
                <p className="text-xs text-slate-500">Pending POD verification</p>
              </div>

              <div className="relative pl-6">
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white
                  \${['OUT_FOR_DELIVERY', 'DELIVERED'].includes(shipmentStatus) ? 'bg-purple-500' : 'bg-slate-300'}`}></div>
                <p className={`text-sm font-bold \${['OUT_FOR_DELIVERY', 'DELIVERED'].includes(shipmentStatus) ? 'text-purple-700' : 'text-slate-400'}`}>Out For Delivery</p>
                <p className="text-xs text-slate-500">Local dispatch to WH-CHI-01</p>
              </div>

              <div className="relative pl-6">
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white
                  \${['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(shipmentStatus) ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                <p className={`text-sm font-bold \${['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(shipmentStatus) ? 'text-indigo-700' : 'text-slate-400'}`}>In Transit</p>
                <p className="text-xs text-slate-500">En route on I-80 W</p>
              </div>

              <div className="relative pl-6">
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white
                  \${['LOADING', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(shipmentStatus) ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                <p className={`text-sm font-bold \${['LOADING', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(shipmentStatus) ? 'text-blue-700' : 'text-slate-400'}`}>Loading</p>
                <p className="text-xs text-slate-500">Gate Pass generated</p>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white bg-slate-900"></div>
                <p className="text-sm font-bold text-slate-900">Dispatched</p>
                <p className="text-xs text-slate-500">Allocations Locked</p>
              </div>

            </div>

          </div>
        </aside>
      </div>
    </div>
  );
}
