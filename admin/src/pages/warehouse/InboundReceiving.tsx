import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  PackageCheck, Save, RefreshCw, Truck, MapPin, ListChecks, 
  ShieldCheck, FileSignature, FileUp, ArrowRightLeft, MessageSquare, 
  Activity, CheckCircle2, AlertTriangle, FileText
} from 'lucide-react';

const MOCK_RECEIVING = {
  id: 'RCV-9921', warehouse: 'LHR-MAIN-01', date: '2026-07-23 09:30 AM',
  type: 'Purchase Order', poNumber: 'PO-2026-4412', supplier: 'Global Tech Suppliers Ltd',
  reference: 'INV-88910', status: 'INSPECTION',
  
  vehicle: {
    number: 'UK-TRK-8812', container: 'MSCU-9988112', seal: 'SEAL-4451',
    driver: 'John Smith', mobile: '+44 7700 900111', arrival: '08:45 AM', dock: 'Dock 04'
  },
  
  shipment: {
    number: 'SHP-44102', booking: 'BKG-LHR-90', mode: 'Road', carrier: 'Eddie Stobart',
    origin: 'Rotterdam Port', destination: 'LHR-MAIN-01', eta: '2026-07-23 08:00 AM'
  },
  
  items: [
    { id: 1, code: 'SKU-A100', name: 'MacBook Pro M4', batch: 'B-0991', ordered: 100, received: 100, accepted: 98, rejected: 2, uom: 'PCS' },
    { id: 2, code: 'SKU-A105', name: 'Magic Keyboard', batch: 'B-0992', ordered: 50, received: 50, accepted: 50, rejected: 0, uom: 'PCS' }
  ],
  
  inspection: {
    required: true, status: 'PARTIAL', passed: false, inspector: 'Sarah Jenkins',
    date: '2026-07-23 10:15 AM', notes: '2 MacBooks found with dented packaging. Rejecting 2 units.',
    rejectedReason: 'Physical Damage in Transit'
  },
  
  grn: {
    number: 'PENDING GENERATION', date: '-', warehouse: 'LHR-MAIN-01',
    supplier: 'Global Tech Suppliers Ltd', receivedBy: 'Michael Rossi', status: 'DRAFT'
  },
  
  putaway: {
    number: 'Awaiting GRN Approval', priority: 'HIGH', zone: 'Fast Moving (ZON-A1)', status: 'PENDING_GENERATION'
  },
  
  documents: [
    { id: 'D1', type: 'Purchase Order', name: 'PO-2026-4412.pdf' },
    { id: 'D2', type: 'Delivery Challan', name: 'DC-88910.pdf' }
  ]
};

export default function InboundReceiving() {
  const { id } = useParams();
  const [data] = useState(MOCK_RECEIVING);
  const [isProcessing, setIsProcessing] = useState(false);
  const [grnStatus, setGrnStatus] = useState(data.grn.status);
  const [putawayStatus, setPutawayStatus] = useState(data.putaway.status);

  const handleGenerateGRN = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setGrnStatus('GENERATED');
      setIsProcessing(false);
    }, 1500);
  };

  const handleApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setGrnStatus('APPROVED');
      setPutawayStatus('GENERATING_VIA_BULLMQ');
      // Simulate BullMQ Webhook response
      setTimeout(() => {
        setPutawayStatus('GENERATED');
      }, 3000);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <PackageCheck className="w-7 h-7 text-indigo-600 bg-indigo-100 p-1 rounded-lg" /> 
            Inbound Receiving & GRN
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm font-bold text-slate-500">
            <span>RCV: <span className="text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">{data.id}</span></span>
            <span>GRN: <span className="text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">{grnStatus === 'DRAFT' ? 'PENDING' : 'GRN-2026-991'}</span></span>
            <span className="px-2 py-0.5 rounded uppercase tracking-wider text-xs bg-amber-100 text-amber-700">
              {grnStatus === 'APPROVED' ? 'COMPLETED' : data.status}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button disabled={isProcessing} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
            <Save className="w-4 h-4" /> Save Receiving
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* MAIN SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth pb-32">
          
          {/* SECTION 1: RECEIVING INFORMATION */}
          <section id="info" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <PackageCheck className="w-5 h-5 text-indigo-600"/> Receiving Profile
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Receiving No.</label><input type="text" readOnly className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-sm font-black text-slate-900" defaultValue={data.id} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Target Warehouse</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.warehouse} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Receiving Date</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.date} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Source Type</label><select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold"><option>{data.type}</option></select></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">PO Number</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-blue-600 cursor-pointer" defaultValue={data.poNumber} /></div>
              <div className="col-span-2"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Supplier / Customer</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.supplier} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Ext. Reference</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.reference} /></div>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* SECTION 2: VEHICLE INFORMATION */}
            <section id="vehicle" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Truck className="w-5 h-5 text-amber-600"/> Vehicle & Dock Data
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Vehicle No.</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.vehicle.number} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Container No.</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.vehicle.container} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Seal Number</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.vehicle.seal} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Assigned Dock</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.vehicle.dock} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Driver Name</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.vehicle.driver} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Arrival Time</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.vehicle.arrival} /></div>
              </div>
            </section>

            {/* SECTION 3: SHIPMENT INFORMATION */}
            <section id="shipment" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <MapPin className="w-5 h-5 text-cyan-600"/> Logistics & Tracking
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Shipment No.</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-blue-600 cursor-pointer" defaultValue={data.shipment.number} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Transport Mode</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.shipment.mode} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Carrier / LSP</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.shipment.carrier} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Origin Port</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.shipment.origin} /></div>
                <div className="col-span-2"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Target Destination</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.shipment.destination} /></div>
              </div>
            </section>
          </div>

          {/* SECTION 4: ITEM RECEIVING */}
          <section id="items" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <ListChecks className="w-5 h-5 text-emerald-600"/> Item Receiving Manifest
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-widest">
                    <th className="p-3 rounded-tl-lg">SKU / Product</th>
                    <th className="p-3">Batch</th>
                    <th className="p-3 text-right">Ordered</th>
                    <th className="p-3 text-right">Received</th>
                    <th className="p-3 text-right text-emerald-700">Accepted</th>
                    <th className="p-3 text-right text-rose-700">Rejected</th>
                    <th className="p-3 rounded-tr-lg">UOM</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-bold">
                  {data.items.map((item, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="p-3">
                        <p className="text-slate-900">{item.code}</p>
                        <p className="text-xs font-medium text-slate-500">{item.name}</p>
                      </td>
                      <td className="p-3 text-slate-600">{item.batch}</td>
                      <td className="p-3 text-right text-slate-500">{item.ordered}</td>
                      <td className="p-3 text-right"><input type="number" defaultValue={item.received} className="w-20 bg-white border border-slate-300 rounded p-1 text-right focus:ring-2 focus:ring-indigo-500 outline-none" /></td>
                      <td className="p-3 text-right"><input type="number" defaultValue={item.accepted} className="w-20 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded p-1 text-right focus:ring-2 focus:ring-emerald-500 outline-none" /></td>
                      <td className="p-3 text-right"><input type="number" defaultValue={item.rejected} className="w-20 bg-rose-50 text-rose-900 border border-rose-300 rounded p-1 text-right focus:ring-2 focus:ring-rose-500 outline-none" /></td>
                      <td className="p-3 text-slate-500">{item.uom}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* SECTION 5: QUALITY INSPECTION */}
            <section id="inspection" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-amber-500">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <ShieldCheck className="w-5 h-5 text-amber-600"/> Quality Control & Inspection
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Inspection Status</label><select className="w-full bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-2.5 text-sm font-bold"><option>{data.inspection.status}</option><option>PASSED</option><option>FAILED</option></select></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Inspector</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.inspection.inspector} /></div>
                <div className="col-span-2"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Rejection Reason</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-rose-600" defaultValue={data.inspection.rejectedReason} /></div>
                <div className="col-span-2"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">QA Notes</label><textarea rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-medium" defaultValue={data.inspection.notes}></textarea></div>
              </div>
            </section>

            {/* SECTION 6: GOODS RECEIPT NOTE (GRN) */}
            <section id="grn" className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white">
              <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2 border-b border-slate-700 pb-4">
                <FileSignature className="w-5 h-5 text-indigo-400"/> Goods Receipt Note (GRN)
              </h2>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">GRN Number</p>
                  <p className="text-xl font-black text-white">{grnStatus === 'DRAFT' ? 'PENDING GENERATION' : 'GRN-2026-991'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">GRN Status</p>
                  <span className={\`px-3 py-1 rounded-lg text-xs font-bold uppercase \${grnStatus === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : grnStatus === 'GENERATED' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-slate-700 text-slate-300'}\`}>
                    {grnStatus}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Supplier</p>
                  <p className="text-sm font-bold text-slate-200">{data.grn.supplier}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Received By</p>
                  <p className="text-sm font-bold text-slate-200">{data.grn.receivedBy}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleGenerateGRN}
                  disabled={grnStatus !== 'DRAFT' || isProcessing}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2"
                >
                  <FileText className="w-4 h-4"/> {grnStatus !== 'DRAFT' ? 'GRN Generated' : 'Generate GRN'}
                </button>
                <button 
                  onClick={handleApprove}
                  disabled={grnStatus === 'APPROVED' || grnStatus === 'DRAFT' || isProcessing}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4"/> {grnStatus === 'APPROVED' ? 'GRN Approved' : 'Approve GRN'}
                </button>
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* SECTION 8: PUTAWAY REQUEST */}
            <section id="putaway" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-indigo-500">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <ArrowRightLeft className="w-5 h-5 text-indigo-600"/> Automated Putaway Generation
              </h2>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
                {putawayStatus === 'PENDING_GENERATION' && (
                  <>
                    <Activity className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <h3 className="font-black text-slate-900 text-lg mb-1">Awaiting GRN Approval</h3>
                    <p className="text-sm text-slate-500 font-medium">Putaway request will be automatically dispatched to BullMQ queue once the GRN is approved.</p>
                  </>
                )}
                {putawayStatus === 'GENERATING_VIA_BULLMQ' && (
                  <>
                    <RefreshCw className="w-10 h-10 text-indigo-500 mx-auto mb-3 animate-spin" />
                    <h3 className="font-black text-slate-900 text-lg mb-1">Processing via BullMQ...</h3>
                    <p className="text-sm text-slate-500 font-medium">Calculating optimal Zone & Bin locations...</p>
                  </>
                )}
                {putawayStatus === 'GENERATED' && (
                  <>
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                    <h3 className="font-black text-slate-900 text-lg mb-1">Putaway Request PWR-2026-101 Generated</h3>
                    <p className="text-sm text-slate-500 font-bold">Suggested Location: <span className="text-indigo-600">Zone A1 (Fast Moving) • Rack 04 • Bin 12</span></p>
                    <button className="mt-4 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">View Putaway Document</button>
                  </>
                )}
              </div>
            </section>
            
            {/* SECTION 7: DOCUMENTS */}
            <section id="documents" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FileUp className="w-5 h-5 text-slate-600"/> Receiving Documents
                </h2>
                <button className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2"><FileUp className="w-4 h-4"/> Upload</button>
              </div>
              <div className="space-y-3">
                {data.documents.map(doc => (
                  <div key={doc.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{doc.name}</p>
                      <p className="text-xs font-medium text-slate-500">{doc.type}</p>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-bold">View</button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* SECTION 9: REMARKS */}
          <section id="remarks" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <MessageSquare className="w-5 h-5 text-slate-600"/> General Remarks
            </h2>
            <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Enter receiving or dock operational notes..."></textarea>
          </section>
          
        </div>

        {/* SECTION 10: STICKY RIGHT SIDEBAR */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 sticky top-0 overflow-y-auto">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={handleGenerateGRN} 
                disabled={grnStatus !== 'DRAFT'} 
                className="w-full flex items-center gap-3 p-3 bg-indigo-50 disabled:bg-slate-50 disabled:text-slate-400 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-100 transition-colors"
              >
                <FileSignature className="w-4 h-4"/> Generate Draft GRN
              </button>
              <button 
                onClick={handleApprove} 
                disabled={grnStatus !== 'GENERATED'} 
                className="w-full flex items-center gap-3 p-3 bg-emerald-50 disabled:bg-slate-50 disabled:text-slate-400 text-emerald-700 font-bold text-sm rounded-xl hover:bg-emerald-100 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4"/> Approve Receiving
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors">
                <FileUp className="w-4 h-4"/> Upload Vendor Invoice
              </button>
            </div>
          </div>
          
          <div className="p-6 flex-1">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500"/> Pipeline Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-sm font-bold text-slate-700">Dock Arrival</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-sm font-bold text-slate-700">QA Inspection</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-sm font-bold text-slate-700">GRN Generated</span>
                {grnStatus !== 'DRAFT' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-2 h-2 rounded-full bg-slate-300"></div>}
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-sm font-bold text-slate-700">Putaway Ready</span>
                {putawayStatus === 'GENERATED' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-2 h-2 rounded-full bg-slate-300"></div>}
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
