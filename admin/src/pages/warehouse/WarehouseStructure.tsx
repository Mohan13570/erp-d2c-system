import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Barcode from 'react-barcode';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Building2, Save, RefreshCw, LayoutGrid, Layers, Columns, Grid2x2, TableProperties, Box, 
  Map, Activity, Printer, Download, Plus, Search, ChevronRight, FileText
} from 'lucide-react';

const MOCK_HIERARCHY = {
  warehouse: { code: 'LHR-MAIN-01', name: 'London Heathrow Central Hub', type: 'Distribution Center', status: 'ACTIVE', capacity: 250000 },
  block: { code: 'BLK-A', name: 'North Block', description: 'Primary Dry Storage', type: 'Dry', tempZone: 'Ambient', maxCap: 50000, current: 42000, status: 'ACTIVE' },
  zone: { code: 'ZON-A1', name: 'Fast Moving', type: 'Picking', description: 'High turnover FMCG', status: 'ACTIVE' },
  aisle: { code: 'ASL-01', number: 1, width: 3.5, direction: 'BI_DIRECTIONAL', capacity: 5000, status: 'ACTIVE' },
  rack: { code: 'RCK-01A', number: 1, type: 'Selective', maxWeight: 10000, maxHeight: 12, levels: 6, status: 'ACTIVE' },
  shelf: { code: 'SHF-L1', number: 1, level: 1, maxWeight: 2000, maxVolume: 10, type: 'Standard', status: 'ACTIVE' },
  bin: { code: 'BIN-01A-L1-01', number: 1, barcode: 'LHR-B-01A-L1-01', qr: 'QR-LHR-B-01A-L1-01', maxCap: 2, maxWeight: 1000, current: 1, type: 'PALLET', status: 'OCCUPIED' }
};

export default function WarehouseStructure() {
  const { id } = useParams();
  const [isSaving, setIsSaving] = useState(false);
  const [data] = useState(MOCK_HIERARCHY);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <LayoutGrid className="w-7 h-7 text-indigo-600 bg-indigo-100 p-1 rounded-lg" /> 
            Storage Structure Management
          </h1>
          <p className="text-sm font-bold text-slate-500 mt-1">Warehouse {data.warehouse.code} • Hierarchical Build</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
            <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Structure'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* MAIN SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth pb-32">
          
          {/* SECTION 1: WAREHOUSE SELECTION */}
          <section id="warehouse" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Building2 className="w-5 h-5 text-indigo-600"/> Root: Warehouse Selection
            </h2>
            <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Current Warehouse</p>
                <p className="text-xl font-black text-slate-900">{data.warehouse.code} - {data.warehouse.name}</p>
              </div>
              <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-bold">
                {data.warehouse.status}
              </div>
              <button className="p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"><Search className="w-5 h-5 text-slate-600"/></button>
            </div>
          </section>

          {/* SECTION 8: LOCATION PATH (Moved up for UX logic) */}
          <section id="path" className="bg-indigo-900 p-6 rounded-2xl shadow-xl text-white">
            <h2 className="text-xs font-bold text-indigo-300 mb-4 flex items-center gap-2 uppercase tracking-widest">
              <Map className="w-4 h-4"/> Absolute Location Path
            </h2>
            <div className="flex items-center gap-3 text-lg font-black flex-wrap">
              <span className="bg-indigo-800 px-3 py-1 rounded-lg">WH: {data.warehouse.code}</span> <ChevronRight className="text-indigo-400 w-5 h-5"/>
              <span className="bg-indigo-800 px-3 py-1 rounded-lg">BLK: {data.block.code}</span> <ChevronRight className="text-indigo-400 w-5 h-5"/>
              <span className="bg-indigo-800 px-3 py-1 rounded-lg">ZON: {data.zone.code}</span> <ChevronRight className="text-indigo-400 w-5 h-5"/>
              <span className="bg-indigo-800 px-3 py-1 rounded-lg">ASL: {data.aisle.code}</span> <ChevronRight className="text-indigo-400 w-5 h-5"/>
              <span className="bg-indigo-800 px-3 py-1 rounded-lg">RCK: {data.rack.code}</span> <ChevronRight className="text-indigo-400 w-5 h-5"/>
              <span className="bg-indigo-800 px-3 py-1 rounded-lg">SHF: {data.shelf.code}</span> <ChevronRight className="text-indigo-400 w-5 h-5"/>
              <span className="bg-emerald-500 px-3 py-1 rounded-lg text-emerald-950">BIN: {data.bin.code}</span>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* SECTION 2: BLOCK MANAGEMENT */}
            <section id="block" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Layers className="w-5 h-5 text-blue-600"/> L1: Block Management
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Block Code</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.block.code} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Block Name</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.block.name} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Block Type</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.block.type} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Temp Zone</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.block.tempZone} /></div>
                <div className="col-span-2"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Description</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.block.description} /></div>
              </div>
            </section>

            {/* SECTION 3: ZONE MANAGEMENT */}
            <section id="zone" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Grid2x2 className="w-5 h-5 text-cyan-600"/> L2: Zone Management
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Zone Code</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.zone.code} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Zone Name</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.zone.name} /></div>
                <div className="col-span-2"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Zone Type</label><select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold"><option>{data.zone.type}</option><option>Bulk</option><option>Cold</option></select></div>
                <div className="col-span-2"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Description</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.zone.description} /></div>
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* SECTION 4: AISLE MANAGEMENT */}
            <section id="aisle" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Columns className="w-5 h-5 text-purple-600"/> L3: Aisle Management
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Aisle Code</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.aisle.code} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Aisle Number</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.aisle.number} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Width (m)</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.aisle.width} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Direction</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.aisle.direction} /></div>
              </div>
            </section>

            {/* SECTION 5: RACK MANAGEMENT */}
            <section id="rack" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <TableProperties className="w-5 h-5 text-pink-600"/> L4: Rack Management
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Rack Code</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.rack.code} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Rack Type</label><select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold"><option>{data.rack.type}</option><option>Drive-In</option></select></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Max Weight (kg)</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.rack.maxWeight} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Levels</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.rack.levels} /></div>
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* SECTION 6: SHELF MANAGEMENT */}
            <section id="shelf" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <LayoutGrid className="w-5 h-5 text-amber-500"/> L5: Shelf Management
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Shelf Code</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.shelf.code} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Level Number</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.shelf.level} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Max Weight (kg)</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.shelf.maxWeight} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Max Volume (cbm)</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.shelf.maxVolume} /></div>
              </div>
            </section>

            {/* SECTION 7: BIN MANAGEMENT */}
            <section id="bin" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-emerald-500">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Box className="w-5 h-5 text-emerald-600"/> L6: Bin / Slot Management
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Bin Code</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.bin.code} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Storage Type</label><select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold"><option>{data.bin.type}</option><option>CARTON</option><option>PIECE</option></select></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Bin Status</label><select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-emerald-700 bg-emerald-50"><option>{data.bin.status}</option><option>AVAILABLE</option><option>RESERVED</option></select></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Current Occupancy</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.bin.current} /></div>
              </div>
            </section>
          </div>

          {/* SECTION 10: BARCODE & QR */}
          <section id="barcode" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Printer className="w-5 h-5 text-slate-600"/> Label Generation Engine
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center p-8 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
              <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <Barcode value={data.bin.barcode} width={2} height={60} fontSize={14} />
                <button className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800"><Download className="w-4 h-4"/> Print Barcode</button>
              </div>
              <div className="h-24 w-px bg-slate-200 hidden md:block"></div>
              <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <QRCodeSVG value={data.bin.qr} size={100} level="H" />
                <button className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 mt-2"><Download className="w-4 h-4"/> Print QR Code</button>
              </div>
            </div>
          </section>

          {/* SECTION 11: NOTES */}
          <section id="notes" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <FileText className="w-5 h-5 text-amber-500"/> Structural Notes
            </h2>
            <textarea rows={3} className="w-full bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm font-medium text-amber-900 focus:ring-2 focus:ring-amber-500 outline-none placeholder:text-amber-300" placeholder="Type notes regarding physical constraints or maintenance rules..."></textarea>
          </section>

        </div>

        {/* SECTION 12: STICKY RIGHT SIDEBAR */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 sticky top-0 overflow-y-auto">
          {/* SECTION 9: CAPACITY SUMMARY */}
          <div className="p-6 border-b border-slate-100 bg-slate-900 text-white">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400"/> Global Capacity Summary
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Volume Capacity</p>
                <p className="text-2xl font-black">{data.warehouse.capacity.toLocaleString()} Pallets</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold text-slate-400 uppercase">Bin Occupancy</p>
                  <p className="text-sm font-bold text-emerald-400">84%</p>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '84%' }}></div>
                </div>
                <p className="text-xs font-bold text-slate-500 mt-2">12,600 / 15,000 Bins Filled</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Add Node</h3>
            <div className="space-y-2 text-sm font-bold text-slate-700">
              <button className="w-full flex items-center gap-3 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"><Plus className="w-4 h-4 text-blue-600"/> Add Child Block</button>
              <button className="w-full flex items-center gap-3 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"><Plus className="w-4 h-4 text-cyan-600"/> Add Child Zone</button>
              <button className="w-full flex items-center gap-3 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"><Plus className="w-4 h-4 text-purple-600"/> Add Child Aisle</button>
              <button className="w-full flex items-center gap-3 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"><Plus className="w-4 h-4 text-pink-600"/> Add Child Rack</button>
              <button className="w-full flex items-center gap-3 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"><Plus className="w-4 h-4 text-amber-500"/> Add Child Shelf</button>
              <button className="w-full flex items-center gap-3 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"><Plus className="w-4 h-4 text-emerald-600"/> Add Child Bin</button>
            </div>
          </div>

          <div className="p-6 flex-1">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Mass Actions</h3>
            <div className="space-y-2 text-sm font-bold text-slate-700">
              <button className="w-full flex items-center gap-3 p-3 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors"><Printer className="w-4 h-4"/> Generate All QR Codes</button>
              <button className="w-full flex items-center gap-3 p-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"><Download className="w-4 h-4"/> Export Full Hierarchy</button>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
