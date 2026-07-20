import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Truck, Calendar, Clock, User, QrCode, Loader2, CheckCircle2 } from 'lucide-react';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';

const pickupSchema = z.object({
  pickupDate: z.string().min(1, "Pickup date is required"),
  timeWindow: z.string().min(1, "Time window is required"),
  vehicle: z.string().min(1, "Vehicle assignment is required"),
  driver: z.string().min(1, "Driver assignment is required"),
});

type PickupFormValues = z.infer<typeof pickupSchema>;

export default function OpsPickupScheduling() {
  const [isDispatching, setIsDispatching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Mock labels for visual presentation (Base64 data URIs would normally come from the backend)
  const mockQrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TRK-2026-9823471";
  const mockBarcodeUrl = "https://bwipjs-api.metafloor.com/?bcid=code128&text=TRK-2026-9823471&scale=3&height=10&includetext";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PickupFormValues>({
    resolver: zodResolver(pickupSchema),
  });

  const onSubmit = async (data: PickupFormValues) => {
    setIsDispatching(true);
    // Simulate API call to dispatch driver
    setTimeout(() => {
      console.log('Driver Dispatched:', data);
      setIsDispatching(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Pickup Scheduling & Dispatch</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Assign resources and generate manifest for Shipment SHP-2026-842201.</p>
        </div>

        {isSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-4 rounded-lg shadow-sm flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
            <div>
              <p className="font-semibold">Driver Dispatched Successfully</p>
              <p className="text-sm text-green-700">The manifest and labels have been sent to the driver's mobile device.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Labels & Manifest (Left Column) */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="bg-slate-100/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-base flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  Shipment Labels
                </CardTitle>
                <CardDescription>Scannable manifest for warehouse & driver.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 flex flex-col items-center gap-6">
                
                <div className="flex flex-col items-center gap-2 w-full">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tracking QR</span>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm w-32 h-32 flex items-center justify-center">
                    <img src={mockQrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 w-full border-t border-slate-100 dark:border-slate-800 pt-6">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reference Barcode</span>
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm w-full h-24 flex items-center justify-center">
                    <img src={mockBarcodeUrl} alt="Barcode" className="w-full h-full object-contain" />
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-2">Print Manifest</Button>
              </CardContent>
            </Card>
          </div>

          {/* Scheduling Form (Right Column) */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Resource Allocation</CardTitle>
                <CardDescription>Select the pickup time and assign a fleet vehicle.</CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="pickupDate" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        Pickup Date
                      </Label>
                      {/* Using native date input for ShadCN DatePicker stub */}
                      <Input 
                        id="pickupDate" 
                        type="date" 
                        className={errors.pickupDate ? "border-red-500" : ""}
                        disabled={isDispatching || isSuccess}
                        {...register("pickupDate")}
                      />
                      {errors.pickupDate && <p className="text-sm text-red-500">{errors.pickupDate.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeWindow" className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        Time Window
                      </Label>
                      <Select 
                        id="timeWindow"
                        className={errors.timeWindow ? "border-red-500" : ""}
                        disabled={isDispatching || isSuccess}
                        {...register("timeWindow")}
                      >
                        <option value="">Select window...</option>
                        <option value="Morning">Morning (08:00 - 12:00)</option>
                        <option value="Afternoon">Afternoon (12:00 - 17:00)</option>
                        <option value="Evening">Evening (17:00 - 20:00)</option>
                      </Select>
                      {errors.timeWindow && <p className="text-sm text-red-500">{errors.timeWindow.message}</p>}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="vehicle" className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-slate-500" />
                        Fleet Vehicle
                      </Label>
                      <Select 
                        id="vehicle"
                        className={errors.vehicle ? "border-red-500" : ""}
                        disabled={isDispatching || isSuccess}
                        {...register("vehicle")}
                      >
                        <option value="">Assign vehicle...</option>
                        <option value="TRK-001">TRK-001 (5-Ton Box Truck)</option>
                        <option value="TRK-042">TRK-042 (10-Ton Flatbed)</option>
                        <option value="VAN-018">VAN-018 (Sprinter Van)</option>
                      </Select>
                      {errors.vehicle && <p className="text-sm text-red-500">{errors.vehicle.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="driver" className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-500" />
                        Assigned Driver
                      </Label>
                      <Select 
                        id="driver"
                        className={errors.driver ? "border-red-500" : ""}
                        disabled={isDispatching || isSuccess}
                        {...register("driver")}
                      >
                        <option value="">Assign driver...</option>
                        <option value="D-102">John Smith</option>
                        <option value="D-105">Maria Garcia</option>
                        <option value="D-119">David Chen</option>
                      </Select>
                      {errors.driver && <p className="text-sm text-red-500">{errors.driver.message}</p>}
                    </div>
                  </div>

                </CardContent>
                <CardFooter className="bg-slate-50/80 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-800 py-4 px-6 flex justify-end rounded-b-xl">
                  <Button type="submit" disabled={isDispatching || isSuccess} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[180px]">
                    {isDispatching ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Dispatching...</>
                    ) : (
                      "Dispatch Driver"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
