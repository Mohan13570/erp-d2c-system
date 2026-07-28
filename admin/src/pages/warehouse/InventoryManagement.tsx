import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Package, Save, RefreshCw, BarChart3, Database, MapPin, Activity, 
  ArrowRightLeft, Lock, FileSearch, SlidersHorizontal, Calculator, History, 
  AlertTriangle, ArrowUpRight, ArrowDownRight, Tag, ShieldAlert
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MOCK_INVENTORY = {
  sku: 'SKU-A100', name: 'MacBook Pro M4', barcode: '8801934958112', qr: 'QR-MAC-M4',
  category: 'Electronics', brand: 'Apple', batch: 'B-0991', serial: 'SN-00192', uom: 'PCS',
  
  metrics: {
    total: 1045, available: 800, reserved: 200, damaged: 5, blocked: 40,
    value: '$2,088,955'
  },
  
  locations: [
    { loc: 'LHR > BLK-A > ZON-A1 > ASL-04 > RCK-12 > SHF-L2 > BIN-05', qty: 500, type: 'PALLET' },
    { loc: 'LHR > BLK-A > ZON-A1 > ASL-04 > RCK-12 > SHF-L3 > BIN-06', qty: 300, type: 'PALLET' }
  ],
  
  movements: [
    { id: 'MV-991', type: 'PUTAWAY', date: '2026-07-23 10:45 AM', qty: 500, from: 'DOCK-04', to: 'BIN-05', by: 'System' },
    { id: 'MV-990', type: 'RESERVATION', date: '2026-07-23 09:30 AM', qty: 200, from: 'BIN-06', to: 'ORDER-112', by: 'API' }
  ],
  
  history: [
    { id: 'HIS-01', type: 'ADJUSTMENT', ref: 'ADJ-11', desc: 'Found in audit', qty: '+5', bal: 1045 },
    { id: 'HIS-02', type: 'MOVEMENT', ref: 'MV-991', desc: 'Putaway dropped', qty: '+500', bal: 1040 }
  ],
  
  chartData: [
    { name: 'Mon', in: 400, out: 240 },
    { name: 'Tue', in: 300, out: 139 },
    { name: 'Wed', in: 200, out: 980 },
    { name: 'Thu', in: 500, out: 390 },
    { name: 'Fri', in: 189, out: 480 },
  ]
};

export default function InventoryManagement() {
  const { id } = useParams();
  const [data] = useState(MOCK_INVENTORY);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Package className="w-7 h-7 text-indigo-600 bg-indigo-100 p-1 rounded-lg" /> 
            Inventory Ledger & Management
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm font-bold text-slate-500">
            <span>Warehouse: <span className="text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">LHR-MAIN-01</span></span>
            <span>Date: <span className="text-slate-900">{new Date().toLocaleDateString()}</span></span>
            <span className="px-2 py-0.5 rounded uppercase tracking-wider text-xs bg-emerald-100 text-emerald-700 flex items-center gap-1">
              <Activity className="w-3 h-3"/> REAL-TIME SYNC
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh Ledger
          </button>
          <button disabled={isProcessing} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
            <Save className="w-4 h-4" /> Save Adjustments
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* MAIN SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth pb-32">
          
          {/* SECTION 1: INVENTORY DASHBOARD */}
          <section id="dashboard" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Inventory</p>
                  <h3 className="text-3xl font-black text-slate-900">{data.metrics.total} <span className="text-lg text-slate-400 font-bold">{data.uom}</span></h3>
                </div>
                <Database className="w-8 h-8 text-indigo-500 opacity-20" />
              </div>
              <p className="text-sm font-bold text-emerald-600 flex items-center gap-1"><ArrowUpRight className="w-4 h-4"/> +14% vs last week</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Available / Reserved</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-emerald-600">{data.metrics.available}</h3>
                    <span className="text-xl font-black text-slate-300">/</span>
                    <h3 className="text-3xl font-black text-amber-500">{data.metrics.reserved}</h3>
                  </div>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-2 flex overflow-hidden">
                <div className="bg-emerald-500 h-2" style={{width: \`\${(data.metrics.available/data.metrics.total)*100}%\`}}></div>
                <div className="bg-amber-400 h-2" style={{width: \`\${(data.metrics.reserved/data.metrics.total)*100}%\`}}></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between border-b-4 border-b-rose-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-rose-600 uppercase tracking-widest">Blocked / Damaged</p>
                  <h3 className="text-3xl font-black text-rose-600">{data.metrics.blocked + data.metrics.damaged} <span className="text-lg text-rose-400 font-bold">{data.uom}</span></h3>
                </div>
                <ShieldAlert className="w-8 h-8 text-rose-500 opacity-20" />
              </div>
              <p className="text-sm font-bold text-rose-600 flex items-center gap-1">Requires immediate review</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Valuation</p>
                  <h3 className="text-3xl font-black text-indigo-700">{data.metrics.value}</h3>
                </div>
                <BarChart3 className="w-8 h-8 text-indigo-500 opacity-20" />
              </div>
              <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.chartData}>
                    <Tooltip cursor={false} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="in" fill="#10b981" radius={[2,2,0,0]} />
                    <Bar dataKey="out" fill="#f43f5e" radius={[2,2,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* SECTION 2: INVENTORY MASTER */}
          <section id="master" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Tag className="w-5 h-5 text-indigo-600"/> Product Master Data
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Product Code</label><input type="text" readOnly className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-sm font-black text-slate-900" defaultValue={data.sku} /></div>
              <div className="col-span-2"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Product Name</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.name} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Category</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.category} /></div>
              
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Barcode</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-indigo-700" defaultValue={data.barcode} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Batch Number</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.batch} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Serial Number</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.serial} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Base UOM</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.uom} /></div>
            </div>
          </section>

          {/* SECTION 3: STOCK LOCATION */}
          <section id="location" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <MapPin className="w-5 h-5 text-indigo-600"/> Granular Stock Locations
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-widest">
                    <th className="p-3 rounded-tl-lg">Absolute Physical Path</th>
                    <th className="p-3">Storage Type</th>
                    <th className="p-3 text-right rounded-tr-lg">Quantity Located</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-bold">
                  {data.locations.map((loc, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="p-3 font-mono text-xs text-slate-700">{loc.loc}</td>
                      <td className="p-3 text-slate-500">{loc.type}</td>
                      <td className="p-3 text-right text-indigo-700">{loc.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 4: INVENTORY STATUS */}
          <section id="status" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Activity className="w-5 h-5 text-indigo-600"/> Logical Inventory Status Map
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100"><p className="text-xs font-bold text-emerald-700 uppercase mb-1">Available</p><p className="text-2xl font-black text-emerald-900">{data.metrics.available}</p></div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100"><p className="text-xs font-bold text-amber-700 uppercase mb-1">Reserved</p><p className="text-2xl font-black text-amber-900">{data.metrics.reserved}</p></div>
              <div className="p-4 bg-rose-50 rounded-xl border border-rose-100"><p className="text-xs font-bold text-rose-700 uppercase mb-1">Damaged</p><p className="text-2xl font-black text-rose-900">{data.metrics.damaged}</p></div>
              <div className="p-4 bg-slate-100 rounded-xl border border-slate-200"><p className="text-xs font-bold text-slate-700 uppercase mb-1">Blocked</p><p className="text-2xl font-black text-slate-900">{data.metrics.blocked}</p></div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100"><p className="text-xs font-bold text-blue-700 uppercase mb-1">In Transit</p><p className="text-2xl font-black text-blue-900">0</p></div>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* SECTION 5: STOCK MOVEMENTS */}
            <section id="movements" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-[400px] flex flex-col">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 shrink-0">
                <ArrowRightLeft className="w-5 h-5 text-indigo-600"/> Recent Movements
              </h2>
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-widest sticky top-0">
                      <th className="p-3">Ref</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Route</th>
                      <th className="p-3 text-right">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-bold">
                    {data.movements.map((m, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <td className="p-3 text-slate-500 text-xs">{m.id}</td>
                        <td className="p-3">
                          <span className={\`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider \${m.type === 'PUTAWAY' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}\`}>
                            {m.type}
                          </span>
                        </td>
                        <td className="p-3 text-xs text-slate-600">{m.from} → {m.to}</td>
                        <td className="p-3 text-right text-slate-900">{m.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* SECTION 6: STOCK TRANSFER */}
            <section id="transfer" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <ArrowRightLeft className="w-5 h-5 text-blue-600"/> Execute Stock Transfer
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">From Bin</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold placeholder:text-slate-400" placeholder="Scan Bin..." /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">To Bin</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold placeholder:text-slate-400" placeholder="Scan Target Bin..." /></div>
                </div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Transfer Quantity</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-indigo-700" placeholder="0" /></div>
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-colors mt-2 shadow-lg shadow-blue-900/20">
                  EXECUTE TRANSACTION
                </button>
              </div>
            </section>

            {/* SECTION 7: INVENTORY RESERVATION */}
            <section id="reservation" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Lock className="w-5 h-5 text-amber-600"/> Create Reservation
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Order / Shipment Ref</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold placeholder:text-slate-400" placeholder="ORD-2026-..." /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Reserve Qty</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-amber-700" placeholder="0" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Expiry Date</label><input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-700" /></div>
                </div>
                <button className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl transition-colors mt-2 shadow-lg shadow-amber-900/20">
                  LOCK INVENTORY
                </button>
              </div>
            </section>

            {/* SECTION 8: CYCLE COUNT */}
            <section id="count" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <FileSearch className="w-5 h-5 text-emerald-600"/> Log Cycle Count
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Target Bin</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold placeholder:text-slate-400" placeholder="BIN-..." /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">System Qty</label><input type="text" readOnly className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-sm font-black text-slate-500" value="500" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Physical Count</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-indigo-700" placeholder="0" /></div>
                </div>
                <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition-colors mt-2 shadow-lg shadow-emerald-900/20">
                  SUBMIT COUNT LOG
                </button>
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* SECTION 9: STOCK ADJUSTMENT */}
            <section id="adjustment" className="bg-rose-50 p-6 rounded-2xl shadow-sm border border-rose-200">
              <h2 className="text-lg font-black text-rose-900 mb-6 flex items-center gap-2 border-b border-rose-200 pb-4">
                <SlidersHorizontal className="w-5 h-5 text-rose-600"/> Manual Adjustment (Requires Auth)
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="block text-xs font-bold text-rose-700 uppercase tracking-widest mb-1">Type</label><select className="w-full bg-white border border-rose-200 rounded-lg p-2.5 text-sm font-bold text-rose-900"><option>DECREASE</option><option>INCREASE</option></select></div>
                  <div className="col-span-2"><label className="block text-xs font-bold text-rose-700 uppercase tracking-widest mb-1">Reason Code</label><select className="w-full bg-white border border-rose-200 rounded-lg p-2.5 text-sm font-bold text-rose-900"><option>DAMAGE</option><option>LOSS</option><option>CORRECTION</option></select></div>
                  <div className="col-span-3"><label className="block text-xs font-bold text-rose-700 uppercase tracking-widest mb-1">Qty</label><input type="number" className="w-full bg-white border border-rose-200 rounded-lg p-2.5 text-sm font-black text-rose-700" placeholder="0" /></div>
                </div>
                <button className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl transition-colors mt-2 shadow-lg shadow-rose-900/20">
                  FORCE ADJUSTMENT
                </button>
              </div>
            </section>

            {/* SECTION 10: INVENTORY VALUATION */}
            <section id="valuation" className="bg-indigo-900 p-6 rounded-2xl shadow-xl text-white">
              <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2 border-b border-indigo-800 pb-4">
                <Calculator className="w-5 h-5 text-indigo-400"/> Financial Valuation
              </h2>
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-indigo-800 pb-4">
                  <div>
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Costing Method</p>
                    <p className="text-xl font-bold">FIFO (First-In-First-Out)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Unit Cost</p>
                    <p className="text-xl font-bold">$1,999.00</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Total Extended Value</p>
                  <p className="text-5xl font-black text-emerald-400">{data.metrics.value}</p>
                </div>
              </div>
            </section>
          </div>

          {/* SECTION 11: INVENTORY HISTORY (IMMUTABLE LEDGER) */}
          <section id="history" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <History className="w-5 h-5 text-slate-600"/> Immutable Audit Ledger
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs uppercase tracking-widest">
                    <th className="p-4 rounded-tl-lg">ID</th>
                    <th className="p-4">Tx Type</th>
                    <th className="p-4">Reference</th>
                    <th className="p-4">Description</th>
                    <th className="p-4 text-right">Delta</th>
                    <th className="p-4 text-right rounded-tr-lg">Running Bal.</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-bold font-mono">
                  {data.history.map((h, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="p-4 text-slate-500 text-xs">{h.id}</td>
                      <td className="p-4 text-slate-700">{h.type}</td>
                      <td className="p-4 text-indigo-600">{h.ref}</td>
                      <td className="p-4 text-slate-600">{h.desc}</td>
                      <td className={\`p-4 text-right \${h.qty.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}\`}>{h.qty}</td>
                      <td className="p-4 text-right text-slate-900 text-lg">{h.bal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>

        {/* SECTION 12: STICKY RIGHT SIDEBAR */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 sticky top-0 overflow-y-auto">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500"/> System Alerts
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs font-bold text-amber-800">4 SKUs Below Minimum Reorder Level.</p>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <p className="text-xs font-bold text-rose-800">12 Pallets marked as DAMAGED requiring quarantine.</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 flex-1">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Transactions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-slate-50 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-100 transition-colors border border-slate-200">
                <ArrowRightLeft className="w-4 h-4 text-blue-600"/> Batch Transfer
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-slate-50 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-100 transition-colors border border-slate-200">
                <Lock className="w-4 h-4 text-amber-600"/> Mass Reserve
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-slate-50 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-100 transition-colors border border-slate-200">
                <FileSearch className="w-4 h-4 text-emerald-600"/> Print Count Sheets
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-rose-50 text-rose-700 font-bold text-sm rounded-xl hover:bg-rose-100 transition-colors border border-rose-200 mt-4">
                <SlidersHorizontal className="w-4 h-4"/> Admin Adjustment
              </button>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
