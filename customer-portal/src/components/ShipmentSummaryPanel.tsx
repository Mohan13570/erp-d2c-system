import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Calculator, Package, Scale, Box } from 'lucide-react';

export default function ShipmentSummaryPanel() {
  const { watch } = useFormContext();
  const packages = watch('packages') || [];

  let totalQty = 0;
  let totalGrossWt = 0;
  let totalCBM = 0;
  let totalChrgWt = 0;

  packages.forEach((pkg: any) => {
    const qty = pkg.quantity || 1;
    totalQty += qty;
    
    // Weight
    const gross = pkg.weight?.grossWeight || 0;
    totalGrossWt += (gross * qty);
    
    // CBM
    const dim = pkg.dimension;
    if (dim && dim.length && dim.width && dim.height) {
      let l = dim.length, w = dim.width, h = dim.height;
      if (dim.unit === 'MM') { l /= 10; w /= 10; h /= 10; }
      if (dim.unit === 'INCH') { l *= 2.54; w *= 2.54; h *= 2.54; }
      if (dim.unit === 'METER') { l *= 100; w *= 100; h *= 100; }
      
      const cbm = (l * w * h) / 1000000;
      totalCBM += (cbm * qty);
    }
  });

  totalChrgWt = Math.max(totalGrossWt, totalCBM * 167);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl sticky top-24">
      <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-6 uppercase tracking-wider">
        <Calculator className="w-4 h-4" /> Live Shipment Summary
      </h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Packages</p>
              <p className="text-lg font-bold">{totalQty}</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-700/50 w-full"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Scale className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Gross Weight</p>
              <p className="text-lg font-bold">{totalGrossWt.toFixed(2)} <span className="text-xs text-slate-500">KG</span></p>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-700/50 w-full"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Box className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Volume</p>
              <p className="text-lg font-bold">{totalCBM.toFixed(3)} <span className="text-xs text-slate-500">CBM</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-4 mt-6 backdrop-blur-sm border border-white/10">
          <p className="text-xs text-slate-300 mb-1">Estimated Chargeable Weight</p>
          <p className="text-2xl font-bold text-orange-400">{totalChrgWt.toFixed(2)} <span className="text-sm">KG</span></p>
        </div>
      </div>
    </div>
  );
}
