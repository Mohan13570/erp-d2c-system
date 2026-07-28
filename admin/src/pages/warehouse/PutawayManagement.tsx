import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ArrowRightLeft, Save, RefreshCw, Box, MapPin, Target, 
  Settings2, UserCircle2, PlayCircle, AlertOctagon, CheckCircle2,
  Scan, QrCode, Activity, ListChecks
} from 'lucide-react';

const MOCK_PUTAWAY = {
  id: 'PWR-2026-9912', warehouse: 'LHR-MAIN-01', grn: 'GRN-2026-991',
  date: '2026-07-23 10:45 AM', priority: 'HIGH', status: 'SUGGESTED',
  taskType: 'STANDARD_PUTAWAY',
  
  items: [
    { id: 1, code: 'SKU-A100', name: 'MacBook Pro M4', batch: 'B-0991', qty: 98, weight: 196, volume: 1.2, req: 'AMBIENT' },
    { id: 2, code: 'SKU-A105', name: 'Magic Keyboard', batch: 'B-0992', qty: 50, weight: 25, volume: 0.3, req: 'AMBIENT' }
  ],
  
  source: { dock: 'Dock 04', tempBin: 'TMP-IN-04', zone: 'Receiving Floor' },
  
  suggested: {
    block: 'BLK-A (Dry)', zone: 'ZON-A1 (Fast Moving)', aisle: 'ASL-04',
    rack: 'RCK-12', shelf: 'SHF-L2', bin: 'BIN-12-L2-05',
    capacity: 50, remaining: 20, type: 'PALLET', score: 98.5
  },
  
  rules: { fifo: true, fefo: false, dedicated: false, random: false, abc: true, hazardous: false },
  
  assignment: {
    operator: 'Alex Mercer', supervisor: 'Sarah Jenkins', eqType: 'FORKLIFT', eqId: 'FL-09',
    estimated: '15 mins', start: '-', end: '-'
  },
  
  execution: { status: 'PENDING_EXECUTION', barcode: false, qr: false },
  
  exceptions: []
};

export default function PutawayManagement() {
  const { id } = useParams();
  const [data] = useState(MOCK_PUTAWAY);
  const [isProcessing, setIsProcessing] = useState(false);
  const [taskStatus, setTaskStatus] = useState(data.status);
  const [execStatus, setExecStatus] = useState(data.execution.status);
  const [barcodeScanned, setBarcodeScanned] = useState(false);

  const handleAssign = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setTaskStatus('ASSIGNED');
      setIsProcessing(false);
    }, 1000);
  };

  const handleStart = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setTaskStatus('IN_PROGRESS');
      setExecStatus('IN_PROGRESS');
      setIsProcessing(false);
    }, 1000);
  };

  const handleScan = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setBarcodeScanned(true);
      setIsProcessing(false);
    }, 800);
  };

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setTaskStatus('COMPLETED');
      setExecStatus('COMPLETED');
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ArrowRightLeft className="w-7 h-7 text-indigo-600 bg-indigo-100 p-1 rounded-lg" /> 
            Putaway Management
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm font-bold text-slate-500">
            <span>PWR: <span className="text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">{data.id}</span></span>
            <span>GRN: <span className="text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">{data.grn}</span></span>
            <span className={\`px-2 py-0.5 rounded uppercase tracking-wider text-xs \${taskStatus === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}\`}>
              {taskStatus}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button disabled={isProcessing} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
            <Save className="w-4 h-4" /> Save Putaway Task
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* MAIN SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth pb-32">
          
          {/* SECTION 1: PUTAWAY INFORMATION */}
          <section id="info" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Box className="w-5 h-5 text-indigo-600"/> Putaway Task Profile
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Putaway No.</label><input type="text" readOnly className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-sm font-black text-slate-900" defaultValue={data.id} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Target Warehouse</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.warehouse} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Created Date</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.date} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Task Type</label><select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold"><option>{data.taskType}</option></select></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Priority</label><span className="w-full block bg-rose-50 border border-rose-200 text-rose-700 rounded-lg p-2.5 text-sm font-black">{data.priority}</span></div>
            </div>
          </section>

          {/* SECTION 2: ITEM DETAILS */}
          <section id="items" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <ListChecks className="w-5 h-5 text-emerald-600"/> Items to Putaway
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-widest">
                    <th className="p-3 rounded-tl-lg">SKU / Product</th>
                    <th className="p-3">Batch</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Weight (kg)</th>
                    <th className="p-3 text-right">Volume (m3)</th>
                    <th className="p-3 rounded-tr-lg">Storage Req</th>
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
                      <td className="p-3 text-right text-indigo-700">{item.qty}</td>
                      <td className="p-3 text-right text-slate-500">{item.weight}</td>
                      <td className="p-3 text-right text-slate-500">{item.volume}</td>
                      <td className="p-3"><span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">{item.req}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* SECTION 3: SOURCE LOCATION */}
            <section id="source" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-slate-400">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <MapPin className="w-5 h-5 text-slate-600"/> Source Location (Current)
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Receiving Dock</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.source.dock} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Current Zone</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.source.zone} /></div>
                <div className="col-span-2"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Temporary Bin</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.source.tempBin} /></div>
              </div>
            </section>

            {/* SECTION 4: SUGGESTED DESTINATION */}
            <section id="destination" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-emerald-500">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Target className="w-5 h-5 text-emerald-600"/> Target Engine Suggestion
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex justify-between items-center bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  <div>
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Engine Score</p>
                    <p className="text-2xl font-black text-emerald-900">{data.suggested.score}% Match</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-emerald-500"/>
                </div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Target Zone</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.suggested.zone} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Target Bin</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-black text-indigo-700" defaultValue={data.suggested.bin} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Bin Capacity Left</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={\`\${data.suggested.remaining} PALLETS\`} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Storage Type</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.suggested.type} /></div>
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* SECTION 5: PUTAWAY RULES */}
            <section id="rules" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Settings2 className="w-5 h-5 text-blue-600"/> Active Storage Rules
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className={\`p-3 rounded-lg border font-bold text-sm flex items-center justify-between \${data.rules.fifo ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-400'}\`}>FIFO <div className={\`w-2 h-2 rounded-full \${data.rules.fifo ? 'bg-blue-500' : 'bg-slate-300'}\`}></div></div>
                <div className={\`p-3 rounded-lg border font-bold text-sm flex items-center justify-between \${data.rules.fefo ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-400'}\`}>FEFO <div className={\`w-2 h-2 rounded-full \${data.rules.fefo ? 'bg-blue-500' : 'bg-slate-300'}\`}></div></div>
                <div className={\`p-3 rounded-lg border font-bold text-sm flex items-center justify-between \${data.rules.abc ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-400'}\`}>ABC Class <div className={\`w-2 h-2 rounded-full \${data.rules.abc ? 'bg-blue-500' : 'bg-slate-300'}\`}></div></div>
                <div className={\`p-3 rounded-lg border font-bold text-sm flex items-center justify-between \${data.rules.hazardous ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-400'}\`}>Hazardous <div className={\`w-2 h-2 rounded-full \${data.rules.hazardous ? 'bg-amber-500' : 'bg-slate-300'}\`}></div></div>
              </div>
            </section>

            {/* SECTION 6: TASK ASSIGNMENT */}
            <section id="assignment" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <UserCircle2 className="w-5 h-5 text-indigo-600"/> Resource Allocation
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Operator</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.assignment.operator} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Eq. Type</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.assignment.eqType} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Eq. ID</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.assignment.eqId} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Est. Duration</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-amber-700" defaultValue={data.assignment.estimated} /></div>
              </div>
            </section>
          </div>

          {/* SECTION 7: PUTAWAY EXECUTION */}
          <section id="execution" className="bg-indigo-900 p-6 rounded-2xl shadow-xl text-white">
            <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2 border-b border-indigo-800 pb-4">
              <PlayCircle className="w-5 h-5 text-indigo-400"/> Task Execution Engine
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 bg-indigo-950 p-6 rounded-xl border border-indigo-800">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Location Verification</p>
                <div className="flex gap-4">
                  <button 
                    onClick={handleScan}
                    disabled={barcodeScanned || isProcessing || taskStatus === 'COMPLETED'}
                    className={\`flex-1 py-4 rounded-xl flex flex-col items-center justify-center gap-2 font-bold transition-colors \${barcodeScanned ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500' : 'bg-indigo-800 hover:bg-indigo-700 text-white'}\`}
                  >
                    <Scan className="w-6 h-6"/> {barcodeScanned ? 'Bin Verified' : 'Scan Bin Barcode'}
                  </button>
                  <button 
                    disabled={barcodeScanned || isProcessing || taskStatus === 'COMPLETED'}
                    className="flex-1 py-4 bg-indigo-800 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex flex-col items-center justify-center gap-2"
                  >
                    <QrCode className="w-6 h-6"/> Scan Bin QR
                  </button>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <button 
                  onClick={handleConfirm}
                  disabled={!barcodeScanned || taskStatus === 'COMPLETED' || isProcessing}
                  className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-black text-lg rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
                >
                  {taskStatus === 'COMPLETED' ? 'TASK COMPLETED' : 'CONFIRM PUTAWAY DROP'}
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 8: EXCEPTIONS */}
          <section id="exceptions" className="bg-white p-6 rounded-2xl shadow-sm border border-rose-200">
            <h2 className="text-lg font-black text-rose-700 mb-6 flex items-center gap-2 border-b border-rose-100 pb-4">
              <AlertOctagon className="w-5 h-5"/> Exception Reporting
            </h2>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-sm font-bold hover:bg-rose-100 transition-colors">Report Full Bin</button>
              <button className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-sm font-bold hover:bg-rose-100 transition-colors">Report Blockage</button>
              <button className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-sm font-bold hover:bg-rose-100 transition-colors">Equipment Failure</button>
            </div>
          </section>

          {/* SECTION 9: CONFIRMATION LOGS */}
          <section id="confirmation" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600"/> Final Sign-Off Log
            </h2>
            <textarea readOnly rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-900 focus:outline-none" value={taskStatus === 'COMPLETED' ? \`[SYSTEM] Putaway Task \${data.id} finalized.\n[BARCODE] Bin \${data.suggested.bin} verified successfully.\n[INVENTORY] Stock updated in ERP.\` : 'Awaiting confirmation...'}></textarea>
          </section>

        </div>

        {/* SECTION 10: STICKY RIGHT SIDEBAR */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 sticky top-0 overflow-y-auto">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={handleAssign}
                disabled={taskStatus !== 'SUGGESTED'}
                className="w-full flex items-center gap-3 p-3 bg-slate-50 disabled:bg-slate-50 disabled:text-slate-400 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-100 transition-colors"
              >
                <UserCircle2 className="w-4 h-4"/> Assign Operator
              </button>
              <button 
                onClick={handleStart}
                disabled={taskStatus !== 'ASSIGNED'}
                className="w-full flex items-center gap-3 p-3 bg-indigo-50 disabled:bg-slate-50 disabled:text-slate-400 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-100 transition-colors"
              >
                <PlayCircle className="w-4 h-4"/> Start Putaway Task
              </button>
            </div>
          </div>
          
          <div className="p-6 flex-1">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500"/> Execution Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-sm font-bold text-slate-700">Location Engine</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-sm font-bold text-slate-700">Resource Assigned</span>
                {taskStatus === 'ASSIGNED' || taskStatus === 'IN_PROGRESS' || taskStatus === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-2 h-2 rounded-full bg-slate-300"></div>}
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-sm font-bold text-slate-700">In Progress</span>
                {taskStatus === 'IN_PROGRESS' || taskStatus === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-2 h-2 rounded-full bg-slate-300"></div>}
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-sm font-bold text-slate-700">Confirmed (Stock +)</span>
                {taskStatus === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-2 h-2 rounded-full bg-slate-300"></div>}
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
