import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { 
  Package, Save, RefreshCw, Download, Printer, 
  Layers, AlertTriangle, Thermometer, ShieldAlert,
  Scale, Calculator, Image as ImageIcon, CheckCircle, Plus, Trash2, Copy
} from 'lucide-react';

const VOLUMETRIC_DIVISOR = 6000;

export default function CargoManagement() {
  const { id } = useParams();
  const [isSaving, setIsSaving] = useState(false);

  // Initialize react-hook-form for the massive grid
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      cargoName: 'Electronics Consignment',
      commodityCategory: 'Consumer Electronics',
      hsCode: '8517.12',
      unNumber: '',
      cargoNature: 'General',
      insuranceRequired: false,
      dangerousGoods: false,
      temperatureControlled: false,
      fragile: true,
      stackable: false,
      packages: [
        {
          packageNumber: 'PKG-001',
          packageType: 'Pallet',
          description: 'Smartphones',
          marksAndNumbers: 'N/M',
          quantity: 2,
          length: 120,
          width: 100,
          height: 150,
          dimensionUnit: 'cm',
          grossWeight: 450,
          weightUnit: 'kg'
        }
      ]
    }
  });

  const { fields, append, remove, copy } = useFieldArray({
    control,
    name: "packages"
  });

  // Watch packages to auto-calculate totals
  const packages = watch('packages');
  
  const [totals, setTotals] = useState({
    qty: 0,
    gross: 0,
    cbm: 0,
    volWeight: 0,
    chargeable: 0
  });

  useEffect(() => {
    let tQty = 0, tGross = 0, tCbm = 0, tVol = 0, tCharge = 0;
    
    packages.forEach(pkg => {
      const q = Number(pkg.quantity) || 1;
      const gw = Number(pkg.grossWeight) || 0;
      let cbm = 0;
      let volW = 0;
      
      if (pkg.length && pkg.width && pkg.height && pkg.dimensionUnit === 'cm') {
        const cm3 = Number(pkg.length) * Number(pkg.width) * Number(pkg.height);
        cbm = cm3 / 1000000;
        volW = cm3 / VOLUMETRIC_DIVISOR;
      }
      
      const chargeable = Math.max(gw, volW);

      tQty += q;
      tGross += gw * q;
      tCbm += cbm * q;
      tVol += volW * q;
      tCharge += chargeable * q;
    });

    setTotals({ qty: tQty, gross: tGross, cbm: tCbm, volWeight: tVol, chargeable: tCharge });
  }, [packages]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSaving(false);
      alert('Cargo & Packages saved successfully (simulated API)');
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      {/* 1. STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 shrink-0 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Cargo Management</h1>
          </div>
          <div className="h-6 w-px bg-slate-200 mx-2"></div>
          <div>
            <span className="text-2xl font-black text-blue-700 tracking-tighter">TRK-90218-444</span>
            <span className="ml-3 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 uppercase tracking-widest">Awaiting Cargo</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold text-sm transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export Excel
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold text-sm transition-colors shadow-sm">
            <Printer className="w-4 h-4" /> Print Labels
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          <button onClick={handleSubmit(onSubmit)} className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-bold text-sm transition-colors shadow-sm">
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
            Save Changes
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* 2. MAIN CONTENT SCROLLABLE */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-[#F8FAFC]">
          <form className="max-w-6xl mx-auto space-y-6 pb-20">

            {/* SECTION 1: CARGO INFORMATION */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-blue-600" /> Cargo Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cargo Name / Description</label>
                  <input {...register('cargoName')} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Commodity Category</label>
                  <input {...register('commodityCategory')} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">HS Code</label>
                  <input {...register('hsCode')} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>
            </section>

            {/* SECTION 2: SPECIAL HANDLING */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 border-l-4 border-l-red-500">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6">
                <ShieldAlert className="w-5 h-5 text-red-600" /> Special Handling Requirements
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input type="checkbox" {...register('dangerousGoods')} className="rounded border-slate-300 text-red-600 focus:ring-red-500 w-4 h-4" />
                  <span className="text-sm font-bold text-slate-700">Dangerous Goods</span>
                </label>
                <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input type="checkbox" {...register('temperatureControlled')} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4" />
                  <span className="text-sm font-bold text-slate-700">Temp Controlled</span>
                </label>
                <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input type="checkbox" {...register('fragile')} className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4" />
                  <span className="text-sm font-bold text-slate-700">Fragile</span>
                </label>
                <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input type="checkbox" {...register('stackable')} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4" />
                  <span className="text-sm font-bold text-slate-700">Stackable</span>
                </label>
                <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input type="checkbox" {...register('oversizedCargo')} className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4" />
                  <span className="text-sm font-bold text-slate-700">Oversized</span>
                </label>
              </div>
            </section>

            {/* SECTION 3 & 5: PACKAGE MANAGEMENT & DIMENSION CALC (Merged into advanced grid) */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-indigo-600" /> Package Line Items (Auto-Calculating)
                </h2>
                <button type="button" onClick={() => append({ packageNumber: `PKG-00\${fields.length + 1}`, quantity: 1, dimensionUnit: 'cm', weightUnit: 'kg' })} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md text-sm font-bold hover:bg-indigo-100 transition-colors">
                  <Plus className="w-4 h-4" /> Add Package
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
                    <tr>
                      <th className="px-3 py-3 font-bold uppercase tracking-wider">Pkg #</th>
                      <th className="px-3 py-3 font-bold uppercase tracking-wider">Type</th>
                      <th className="px-3 py-3 font-bold uppercase tracking-wider">Qty</th>
                      <th className="px-3 py-3 font-bold uppercase tracking-wider bg-blue-50/50">L x W x H (cm)</th>
                      <th className="px-3 py-3 font-bold uppercase tracking-wider bg-emerald-50/50">Gross Wt (kg)</th>
                      <th className="px-3 py-3 font-bold uppercase tracking-wider text-right text-indigo-700">Auto CBM</th>
                      <th className="px-3 py-3 font-bold uppercase tracking-wider text-right text-indigo-700">Auto Vol. Wt</th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fields.map((field, index) => {
                      const pkg = packages[index] || {};
                      
                      // Client side real-time calculation display
                      let cbm = 0; let volW = 0;
                      if (pkg.length && pkg.width && pkg.height) {
                         const cm3 = Number(pkg.length) * Number(pkg.width) * Number(pkg.height);
                         cbm = cm3 / 1000000;
                         volW = cm3 / VOLUMETRIC_DIVISOR;
                      }

                      return (
                      <tr key={field.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 py-2">
                          <input {...register(`packages.\${index}.packageNumber` as const)} className="w-20 px-2 py-1 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent focus:bg-white text-sm font-bold text-slate-700" />
                        </td>
                        <td className="px-3 py-2">
                          <select {...register(`packages.\${index}.packageType` as const)} className="w-24 px-2 py-1 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent focus:bg-white text-sm">
                            <option>Pallet</option><option>Carton</option><option>Crate</option><option>Drum</option>
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" {...register(`packages.\${index}.quantity` as const)} className="w-16 px-2 py-1 border border-slate-200 rounded text-sm text-center" />
                        </td>
                        <td className="px-3 py-2 bg-blue-50/20">
                          <div className="flex items-center gap-1">
                            <input type="number" placeholder="L" {...register(`packages.\${index}.length` as const)} className="w-14 px-1.5 py-1 border border-slate-200 rounded text-sm text-center" />
                            <span className="text-slate-400 text-xs">x</span>
                            <input type="number" placeholder="W" {...register(`packages.\${index}.width` as const)} className="w-14 px-1.5 py-1 border border-slate-200 rounded text-sm text-center" />
                            <span className="text-slate-400 text-xs">x</span>
                            <input type="number" placeholder="H" {...register(`packages.\${index}.height` as const)} className="w-14 px-1.5 py-1 border border-slate-200 rounded text-sm text-center" />
                          </div>
                        </td>
                        <td className="px-3 py-2 bg-emerald-50/20">
                          <input type="number" {...register(`packages.\${index}.grossWeight` as const)} className="w-20 px-2 py-1 border border-slate-200 rounded text-sm text-right" />
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-sm text-indigo-700 bg-indigo-50/10 font-bold">
                          {cbm > 0 ? cbm.toFixed(3) : '-'}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-sm text-indigo-700 bg-indigo-50/10 font-bold">
                          {volW > 0 ? volW.toFixed(2) : '-'}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button type="button" onClick={() => remove(index)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </section>

            {/* SECTION 6, 7, 8, 9, 10: READ-ONLY/VISUALIZATION SECTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-emerald-600" /> Quality Check & Inspection
                </h2>
                <div className="p-4 rounded-xl border border-dashed border-emerald-300 bg-emerald-50 text-emerald-800 text-sm font-medium flex items-center justify-center h-32">
                   Quality Inspection Module Active. Requires physical scan to unlock.
                </div>
              </section>

              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4">
                  <ImageIcon className="w-5 h-5 text-purple-600" /> Package Photos
                </h2>
                <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 text-sm font-medium flex flex-col items-center justify-center h-32 hover:bg-slate-100 transition-colors cursor-pointer">
                   <ImageIcon className="w-8 h-8 text-slate-300 mb-2"/>
                   Click or drag to upload damage/cargo photos.
                </div>
              </section>

            </div>

          </form>
        </main>

        {/* 3. STICKY RIGHT SIDEBAR */}
        <aside className="w-80 bg-white border-l border-slate-200 shrink-0 overflow-y-auto shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)]">
          <div className="p-6">
            
            {/* SECTION 4: WEIGHT SUMMARY (AUTO TALLY) */}
            <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-600" /> Dynamic Weight Summary
            </h3>
            
            <div className="bg-blue-600 rounded-2xl p-5 text-white mb-6 shadow-md shadow-blue-200">
              <h3 className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Chargeable Weight</h3>
              <div className="text-3xl font-black">{totals.chargeable.toLocaleString(undefined, {maximumFractionDigits: 2})} <span className="text-sm font-medium text-blue-200">KG</span></div>
              <p className="text-[10px] text-blue-200 mt-2 font-medium">Auto-calculated: MAX(Gross, Volumetric)</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Total Packages</span>
                <span className="text-sm font-bold text-slate-800">{totals.qty}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Gross Weight</span>
                <span className="text-sm font-bold text-slate-800">{totals.gross.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Total CBM</span>
                <span className="text-sm font-bold text-indigo-700">{totals.cbm.toFixed(3)} m³</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Volumetric Wt</span>
                <span className="text-sm font-bold text-indigo-700">{totals.volWeight.toFixed(2)} kg</span>
              </div>
            </div>

            <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs">Container Planning</h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6">
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                <span>40ft HC</span>
                <span>{(totals.cbm / 76 * 100).toFixed(1)}% Full</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `\${Math.min(100, totals.cbm / 76 * 100)}%`}}></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Assuming 76 CBM Max Capacity</p>
            </div>

            <button onClick={handleSubmit(onSubmit)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save Cargo Data
            </button>

          </div>
        </aside>
      </div>
    </div>
  );
}
