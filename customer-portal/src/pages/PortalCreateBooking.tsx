import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const bookingSchema = z.object({
  origin: z.string().min(2, { message: "Origin is required." }),
  destination: z.string().min(2, { message: "Destination is required." }),
  shipmentType: z.enum(["Ocean", "Air", "Road"], {
    errorMap: () => ({ message: "Please select a valid shipment type." })
  }),
  serviceType: z.enum(["Door-to-Door", "Port-to-Port"], {
    errorMap: () => ({ message: "Please select a valid service type." })
  }),
  cargoDescription: z.string().min(5, { message: "Please provide a brief cargo description." }),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function PortalCreateBooking() {
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      origin: "",
      destination: "",
      cargoDescription: "",
    },
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Booking request submitted:', data);
      setShowToast(true);
      
      // Redirect after showing toast
      setTimeout(() => {
        navigate('/portal/dashboard');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/portal/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">New Booking</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl relative">
        {showToast && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-sm">Booking Requested Successfully!</p>
              <p className="text-xs text-green-700">Redirecting to dashboard...</p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Create Booking Request</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Submit a new shipment request for your account.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Section 1: Route Details */}
          <Card>
            <CardHeader>
              <CardTitle>Route Details</CardTitle>
              <CardDescription>Where is the shipment going?</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin <span className="text-red-500">*</span></Label>
                <Input
                  id="origin"
                  placeholder="e.g. Shanghai, CN"
                  className={errors.origin ? "border-red-500" : ""}
                  disabled={isLoading || showToast}
                  {...register("origin")}
                />
                {errors.origin && <p className="text-sm text-red-500">{errors.origin.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination">Destination <span className="text-red-500">*</span></Label>
                <Input
                  id="destination"
                  placeholder="e.g. Los Angeles, US"
                  className={errors.destination ? "border-red-500" : ""}
                  disabled={isLoading || showToast}
                  {...register("destination")}
                />
                {errors.destination && <p className="text-sm text-red-500">{errors.destination.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipmentType">Shipment Type <span className="text-red-500">*</span></Label>
                <Select
                  id="shipmentType"
                  className={errors.shipmentType ? "border-red-500" : ""}
                  disabled={isLoading || showToast}
                  {...register("shipmentType")}
                >
                  <option value="">Select a mode...</option>
                  <option value="Ocean">Ocean Freight</option>
                  <option value="Air">Air Freight</option>
                  <option value="Road">Road / Land Transport</option>
                </Select>
                {errors.shipmentType && <p className="text-sm text-red-500">{errors.shipmentType.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type <span className="text-red-500">*</span></Label>
                <Select
                  id="serviceType"
                  className={errors.serviceType ? "border-red-500" : ""}
                  disabled={isLoading || showToast}
                  {...register("serviceType")}
                >
                  <option value="">Select service level...</option>
                  <option value="Door-to-Door">Door-to-Door</option>
                  <option value="Port-to-Port">Port-to-Port</option>
                </Select>
                {errors.serviceType && <p className="text-sm text-red-500">{errors.serviceType.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Cargo Details */}
          <Card>
            <CardHeader>
              <CardTitle>Cargo Details</CardTitle>
              <CardDescription>What are you shipping?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="cargoDescription">Cargo Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="cargoDescription"
                  placeholder="Provide details about the commodity, weight, and volume..."
                  className={errors.cargoDescription ? "border-red-500" : ""}
                  disabled={isLoading || showToast}
                  {...register("cargoDescription")}
                />
                {errors.cargoDescription && <p className="text-sm text-red-500">{errors.cargoDescription.message}</p>}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/portal/dashboard')} disabled={isLoading || showToast}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || showToast} className="min-w-[200px]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Request...
                </>
              ) : (
                "Submit Booking Request"
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
