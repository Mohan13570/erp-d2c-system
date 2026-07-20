import React from 'react';
import { Calculator, CheckCircle2, ChevronDown, Receipt } from 'lucide-react';

interface PricingSummaryPanelProps {
  pricingData: any;
  isLoading: boolean;
}

export default function PricingSummaryPanel({ pricingData, isLoading }: PricingSummaryPanelProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  if (isLoading) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center animate-pulse">
        <Calculator className="w-8 h-8 mx-auto text-slate-400 mb-4 animate-spin-slow" />
        <h3 className="font-medium text-slate-500">Calculating Live Rates...</h3>
      </div>
    );
  }

  if (!pricingData) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center">
        <p className="text-slate-500">No pricing data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-950 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3">
          <Receipt className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">Calculation Breakdown</h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Rate Generated
          </span>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-500 mb-1">Actual Weight</p>
              <p className="font-semibold">{pricingData.actualWeight?.toFixed(2)} KG</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Volume</p>
              <p className="font-semibold">{pricingData.totalVolume?.toFixed(3)} CBM</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Volumetric Weight</p>
              <p className="font-semibold">{pricingData.volumetricWeight?.toFixed(2)} KG</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-semibold mb-1">Chargeable Weight</p>
              <p className="font-bold text-lg text-blue-600">{pricingData.chargeableWeight?.toFixed(2)} KG</p>
            </div>
          </div>

          <div className="space-y-4">
            {pricingData.breakdowns?.map((item: any, i: number) => (
              <div key={i} className={`flex items-center justify-between text-sm ${item.chargeType === 'DISCOUNT' ? 'text-green-600' : 'text-slate-600 dark:text-slate-300'}`}>
                <span>{item.chargeName}</span>
                <span className="font-medium">
                  {item.chargeType === 'DISCOUNT' ? '-' : ''}
                  {item.currency} {item.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-lg font-semibold">Grand Total</span>
            <span className="text-2xl font-bold text-blue-600">
              {pricingData.currency} {pricingData.grandTotal?.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
