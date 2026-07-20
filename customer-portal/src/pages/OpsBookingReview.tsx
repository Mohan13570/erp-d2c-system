import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calculator, Plus, Trash2, CheckCircle2, Package, MapPin, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';

const packageSchema = z.object({
  type: z.string().min(1, "Type required"),
  quantity: z.number().min(1, "Min 1"),
  length: z.number().min(0.1, "Min 0.1"),
  width: z.number().min(0.1, "Min 0.1"),
  height: z.number().min(0.1, "Min 0.1"),
  grossWeight: z.number().min(0.1, "Min 0.1"),
});

const pricingSchema = z.object({
  packages: z.array(packageSchema).min(1, "At least one package is required"),
  baseRate: z.number().min(0.01, "Base rate must be greater than 0"),
});

type PricingFormValues = z.infer<typeof pricingSchema>;

// Mock data for the read-only booking summary
const mockBooking = {
  id: "PBK-2026-847291",
  customerName: "Acme Corp",
  origin: "Shanghai, CN",
  destination: "Los Angeles, US",
  shipmentType: "Ocean",
  serviceType: "Door-to-Door",
  cargoDescription: "Electronic components and circuit boards. Stackable pallets.",
  submittedAt: "2026-07-18T10:30:00Z"
};

export default function OpsBookingReview() {
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PricingFormValues>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      packages: [{ type: "Pallet", quantity: 1, length: 100, width: 100, height: 100, grossWeight: 500 }],
      baseRate: 2.50
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "packages",
  });

  const onCalculate = async (data: PricingFormValues) => {
    setIsCalculating(true);
    
    // Simulate backend calculation delay
    setTimeout(() => {
      // Logic constraint simulation: Volume in CBM * 167
      let totalVolume = 0;
      let totalActualWeight = 0;

      data.packages.forEach(pkg => {
        const cbm = (pkg.length * pkg.width * pkg.height) / 1000000;
        totalVolume += (cbm * pkg.quantity);
        totalActualWeight += (pkg.grossWeight * pkg.quantity);
      });

      const volumetricWeight = totalVolume * 167;
      const chargeableWeight = Math.max(totalActualWeight, volumetricWeight);

      const baseCharge = chargeableWeight * data.baseRate;
      const fuelSurcharge = baseCharge * 0.10;
      const handlingFee = 50.00;
      const tax = (baseCharge + fuelSurcharge + handlingFee) * 0.05;
      const grandTotal = baseCharge + fuelSurcharge + handlingFee + tax;

      setCalculationResult({
        totalVolume: totalVolume.toFixed(2),
        totalActualWeight: totalActualWeight.toFixed(2),
        volumetricWeight: volumetricWeight.toFixed(2),
        chargeableWeight: chargeableWeight.toFixed(2),
        baseCharge: baseCharge.toFixed(2),
        fuelSurcharge: fuelSurcharge.toFixed(2),
        handlingFee: handlingFee.toFixed(2),
        tax: tax.toFixed(2),
        grandTotal: grandTotal.toFixed(2)
      });
      setIsCalculating(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Booking Review & Pricing</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review portal submission and apply operational pricing.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Read-Only Summary */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="sticky top-8">
              <CardHeader className="bg-slate-100/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 rounded-t-xl">
                <CardTitle className="text-lg flex justify-between items-center">
                  Booking Details
                  <span className="text-xs font-normal bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 px-2.5 py-1 rounded-full">
                    {mockBooking.id}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-500">Origin</p>
                      <p className="text-base text-slate-900 dark:text-white font-semibold">{mockBooking.origin}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Navigation className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-500">Destination</p>
                      <p className="text-base text-slate-900 dark:text-white font-semibold">{mockBooking.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Mode</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{mockBooking.shipmentType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Service</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{mockBooking.serviceType}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-slate-500">Customer</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{mockBooking.customerName}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                  <p className="text-sm font-medium text-slate-500 mb-2">Cargo Description</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-md">
                    {mockBooking.cargoDescription}
                  </p>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Right Column: Pricing Engine Form */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Cargo Dimensions & Rate Engine
                </CardTitle>
                <CardDescription>Input the actual package dimensions to calculate chargeable weight and final rate.</CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit(onCalculate)}>
                <CardContent className="space-y-6">
                  
                  {/* Package Array */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Packages</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => append({ type: "Pallet", quantity: 1, length: 0, width: 0, height: 0, grossWeight: 0 })}
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Package Line
                      </Button>
                    </div>

                    {fields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-12 gap-3 items-end bg-slate-50 dark:bg-slate-900/30 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="col-span-12 sm:col-span-3">
                          <Label className="text-xs mb-1 block text-slate-500">Type</Label>
                          <Input {...register(`packages.${index}.type`)} defaultValue="Pallet" />
                        </div>
                        <div className="col-span-4 sm:col-span-2">
                          <Label className="text-xs mb-1 block text-slate-500">Qty</Label>
                          <Input type="number" step="1" {...register(`packages.${index}.quantity`, { valueAsNumber: true })} />
                        </div>
                        <div className="col-span-4 sm:col-span-2">
                          <Label className="text-xs mb-1 block text-slate-500">L x W x H (cm)</Label>
                          <div className="flex gap-1">
                            <Input className="px-1 text-center" type="number" {...register(`packages.${index}.length`, { valueAsNumber: true })} placeholder="L" />
                            <Input className="px-1 text-center" type="number" {...register(`packages.${index}.width`, { valueAsNumber: true })} placeholder="W" />
                            <Input className="px-1 text-center" type="number" {...register(`packages.${index}.height`, { valueAsNumber: true })} placeholder="H" />
                          </div>
                        </div>
                        <div className="col-span-4 sm:col-span-2">
                          <Label className="text-xs mb-1 block text-slate-500">Weight (kg)</Label>
                          <Input type="number" step="0.1" {...register(`packages.${index}.grossWeight`, { valueAsNumber: true })} />
                        </div>
                        <div className="col-span-12 sm:col-span-1 flex justify-end">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {errors.packages && <p className="text-sm text-red-500">{errors.packages.message}</p>}
                  </div>

                  {/* Pricing Inputs */}
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="max-w-xs">
                      <Label htmlFor="baseRate" className="text-base font-semibold block mb-2">Base Rate per KG (USD)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                        <Input 
                          id="baseRate" 
                          type="number" 
                          step="0.01" 
                          className="pl-8 text-lg font-medium"
                          {...register("baseRate", { valueAsNumber: true })} 
                        />
                      </div>
                      {errors.baseRate && <p className="text-sm text-red-500 mt-1">{errors.baseRate.message}</p>}
                    </div>
                  </div>

                </CardContent>
                
                <CardFooter className="bg-slate-50/80 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-800 py-4 px-6 flex justify-between items-center rounded-b-xl">
                  <p className="text-sm text-slate-500">Verify all package details before calculating.</p>
                  <Button type="submit" disabled={isCalculating} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    {isCalculating ? "Calculating..." : <><Calculator className="w-4 h-4 mr-2" /> Calculate Freight</>}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Receipt-style Breakdown */}
            {calculationResult && (
              <Card className="mt-8 border-green-200 dark:border-green-900 shadow-md shadow-green-100/20 dark:shadow-none animate-in slide-in-from-bottom-4 fade-in">
                <CardHeader className="bg-green-50/50 dark:bg-green-900/10 border-b border-green-100 dark:border-green-900/30 rounded-t-xl pb-4">
                  <CardTitle className="text-green-800 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Freight Calculation Complete
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Weight Breakdown */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Volume & Weight Profile</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Total Actual Volume</span>
                        <span className="font-medium text-slate-900 dark:text-white">{calculationResult.totalVolume} CBM</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Total Actual Weight</span>
                        <span className="font-medium text-slate-900 dark:text-white">{calculationResult.totalActualWeight} KG</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Volumetric Weight</span>
                        <span className="font-medium text-slate-900 dark:text-white">{calculationResult.volumetricWeight} KG</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-slate-100 dark:border-slate-800 font-bold">
                        <span className="text-slate-900 dark:text-white">Chargeable Weight</span>
                        <span className="text-blue-600 dark:text-blue-400">{calculationResult.chargeableWeight} KG</span>
                      </div>
                    </div>

                    {/* Financial Receipt */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-lg font-mono text-sm border border-slate-200 dark:border-slate-800">
                      <div className="text-center mb-4 border-b border-dashed border-slate-300 dark:border-slate-700 pb-2">
                        <span className="font-bold tracking-widest text-slate-900 dark:text-slate-300">RATE QUOTE</span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">BASE CHARGE</span>
                          <span className="text-slate-900 dark:text-slate-200">${calculationResult.baseCharge}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">FUEL SURCHARGE (10%)</span>
                          <span className="text-slate-900 dark:text-slate-200">${calculationResult.fuelSurcharge}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">HANDLING FEE</span>
                          <span className="text-slate-900 dark:text-slate-200">${calculationResult.handlingFee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">TAXES (5%)</span>
                          <span className="text-slate-900 dark:text-slate-200">${calculationResult.tax}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-3 border-t border-dashed border-slate-300 dark:border-slate-700 text-base font-bold">
                        <span className="text-slate-900 dark:text-white">GRAND TOTAL</span>
                        <span className="text-green-700 dark:text-green-400">${calculationResult.grandTotal}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button className="bg-green-600 hover:bg-green-700 text-white min-w-[200px]">
                      Approve & Save Pricing
                    </Button>
                  </div>

                </CardContent>
              </Card>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
