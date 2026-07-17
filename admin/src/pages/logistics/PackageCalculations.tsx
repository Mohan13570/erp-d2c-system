import React, { useState } from 'react';
import { Package, Calculator, Box, Scale, DollarSign, ArrowRight, CheckCircle, ShieldCheck, FileText, Anchor, Plane, Truck, Activity } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  bookingId: z.string().uuid().default('00000000-0000-0000-0000-000000000000'), // Mock default for demo
  packageType: z.string().min(1, 'Required'),
  quantity: z.coerce.number().positive(),
  description: z.string(),
  length: z.coerce.number().positive(),
  width: z.coerce.number().positive(),
  height: z.coerce.number().positive(),
  unit: z.enum(['CM', 'IN']),
  actualWeight: z.coerce.number().positive(),
  weightUnit: z.enum(['KG', 'LBS']),
  serviceType: z.enum(['Ocean', 'Air', 'Road']),
});

export default function PackageCalculations() {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      packageType: 'Pallet',
      quantity: 1,
      length: 120,
      width: 100,
      height: 150,
      unit: 'CM',
      actualWeight: 500,
      weightUnit: 'KG',
      serviceType: 'Ocean',
      description: 'Industrial Equipment',
      bookingId: '123e4567-e89b-12d3-a456-426614174000' // Mock UUID for demo
    }
  });

  const serviceType = watch('serviceType');

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/logistics/package/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      setResult(resData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Calculator className="mr-3 text-indigo-600" size={32} />
          Enterprise Package Calculation Engine
        </h1>
        <p className="text-gray-500">Database-driven pricing, volumetric engine, and automated freight auditing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* INPUT PANEL */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center mb-6">
              <Box className="w-5 h-5 mr-2 text-indigo-600" /> Package Inputs
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Service</label>
                    <div className="relative">
                      <select {...register('serviceType')} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 appearance-none font-medium">
                        <option value="Ocean">Ocean Freight</option>
                        <option value="Air">Air Freight</option>
                        <option value="Road">Road Transport</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        {serviceType === 'Ocean' && <Anchor size={16} className="text-gray-400" />}
                        {serviceType === 'Air' && <Plane size={16} className="text-gray-400" />}
                        {serviceType === 'Road' && <Truck size={16} className="text-gray-400" />}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pkg Type</label>
                    <select {...register('packageType')} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 font-medium">
                      <option value="Pallet">Pallet</option>
                      <option value="Carton">Carton</option>
                      <option value="Crate">Crate</option>
                      <option value="Drum">Drum</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Quantity</label>
                    <input type="number" {...register('quantity')} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Unit</label>
                    <select {...register('unit')} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 font-medium">
                      <option value="CM">CM</option>
                      <option value="IN">INCHES</option>
                    </select>
                  </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Dimensions (L x W x H)</label>
                    <div className="flex space-x-2">
                      <input type="number" placeholder="L" {...register('length')} className="w-1/3 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl p-3 text-center font-medium" />
                      <input type="number" placeholder="W" {...register('width')} className="w-1/3 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl p-3 text-center font-medium" />
                      <input type="number" placeholder="H" {...register('height')} className="w-1/3 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl p-3 text-center font-medium" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center"><Scale size={14} className="mr-1"/> Actual Weight</label>
                    <input type="number" {...register('actualWeight')} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Weight Unit</label>
                    <select {...register('weightUnit')} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 font-medium">
                      <option value="KG">KG</option>
                      <option value="LBS">LBS</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-bold rounded-xl text-sm px-5 py-4 text-center shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center"
                >
                  {isLoading ? 'Processing Engine...' : (
                    <>Run Calculation Engine <Activity size={18} className="ml-2" /></>
                  )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center">
                  <ShieldCheck size={14} className="mr-1" /> Executed securely on the backend
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* RESULTS PANEL */}
        <div className="lg:col-span-2">
          {result ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Engine Results</h2>
                  <p className="text-gray-500 mt-1">Package ID: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">{result.package.packageRef}</span></p>
                </div>
                <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-bold flex items-center">
                  <CheckCircle size={18} className="mr-2" />
                  Calculation Saved
                </div>
              </div>

              {/* Engine Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase">Volume (CBM)</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{result.calculation.volumeCBM.toFixed(3)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase">Divisor</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{result.calculation.volumetricDivisor}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                  <p className="text-xs font-bold text-orange-600 uppercase">Volumetric Wt</p>
                  <p className="text-2xl font-black text-orange-700 mt-1">{result.calculation.volumetricWeight.toFixed(2)} <span className="text-sm font-medium">kg</span></p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 shadow-sm shadow-indigo-100">
                  <p className="text-xs font-bold text-indigo-600 uppercase">Chargeable Wt</p>
                  <p className="text-2xl font-black text-indigo-700 mt-1">{result.calculation.chargeableWeight.toFixed(2)} <span className="text-sm font-medium">kg</span></p>
                </div>
              </div>

              {/* Charge Breakdown */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden mb-6">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-gray-500" />
                    Dynamic Charge Breakdown
                  </h3>
                  <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full uppercase">Read Only</span>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {result.calculation.breakdowns.map((b: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 last:pb-0">
                        <div>
                          <p className="font-bold text-gray-900">{b.chargeName}</p>
                          <p className="text-xs font-medium text-gray-500">Code: {b.chargeCode} {b.isTaxable ? '• Taxable' : '• Non-Taxable'}</p>
                        </div>
                        <div className="font-mono text-lg font-medium text-gray-900">
                          {b.amount.toLocaleString('en-US', { style: 'currency', currency: result.calculation.currency })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Grand Total Footer */}
                <div className="bg-gray-900 text-white p-6 flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 font-medium mb-1">Grand Total</p>
                    <p className="text-xs text-gray-500">Includes all database-driven rules, taxes & FSC</p>
                  </div>
                  <div className="text-4xl font-black text-emerald-400 tracking-tight">
                    {result.calculation.grandTotal.toLocaleString('en-US', { style: 'currency', currency: result.calculation.currency })}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 h-full min-h-[500px] flex flex-col items-center justify-center text-gray-400">
              <Calculator size={48} className="mb-4 text-gray-300" />
              <p className="font-medium text-gray-500">Enter package details and run the engine</p>
              <p className="text-sm mt-1 text-gray-400 text-center px-8">Calculations will be executed securely on the backend <br/>using active Rate Cards from the database.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
