import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function CargoForm() {
  const { register, watch } = useFormContext();
  
  const isDG = watch('cargo.dangerousGoods');
  const isTemp = watch('cargo.temperatureControlled');

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Commodity *</label>
          <input {...register('cargo.commodity')} placeholder="General Cargo, Electronics, etc." className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">HS Code</label>
          <input {...register('cargo.hsCode')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="col-span-full space-y-2">
          <label className="text-sm font-medium">Cargo Description</label>
          <textarea {...register('cargo.cargoDescription')} rows={3} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" {...register('cargo.dangerousGoods')} className="w-4 h-4 text-red-600 rounded" />
          <span className="text-sm font-semibold text-red-600">Dangerous Goods (DG)</span>
        </label>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" {...register('cargo.temperatureControlled')} className="w-4 h-4 text-blue-600 rounded" />
          <span className="text-sm font-semibold text-blue-600">Temperature Controlled</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" {...register('cargo.fragile')} className="w-4 h-4 text-amber-600 rounded" />
          <span className="text-sm font-semibold text-amber-600">Fragile</span>
        </label>
      </div>

      {isDG && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 rounded-xl">
          <div className="space-y-2">
            <label className="text-sm font-medium text-red-700 dark:text-red-400">UN Number *</label>
            <input {...register('cargo.unNumber')} className="w-full px-4 py-2 rounded-lg border border-red-200 dark:border-red-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-red-700 dark:text-red-400">Hazard Class *</label>
            <input {...register('cargo.hazardClass')} className="w-full px-4 py-2 rounded-lg border border-red-200 dark:border-red-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
        </div>
      )}

      {isTemp && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl">
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-700 dark:text-blue-400">Required Temp (°C) *</label>
            <input type="number" step="0.1" {...register('cargo.requiredTemperature', { valueAsNumber: true })} className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-700 dark:text-blue-400">Humidity Control (%)</label>
            <input type="number" {...register('cargo.humidityControl', { valueAsNumber: true })} className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Declared Cargo Value</label>
          <div className="flex">
            <select {...register('cargo.currency')} className="px-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 rounded-l-lg outline-none">
              <option>USD</option><option>EUR</option>
            </select>
            <input type="number" {...register('cargo.declaredCargoValue', { valueAsNumber: true })} className="w-full px-4 py-2 rounded-r-lg border border-l-0 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
        <div className="space-y-2 flex items-end pb-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('cargo.insuranceRequired')} className="w-4 h-4 rounded text-blue-600" />
            <span className="text-sm font-medium">Insurance Required</span>
          </label>
        </div>
      </div>
    </div>
  );
}
