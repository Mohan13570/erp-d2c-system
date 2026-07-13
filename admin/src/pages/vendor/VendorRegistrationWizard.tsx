import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Circle, ChevronRight, FileCheck2 } from "lucide-react";

export default function VendorRegistrationWizard() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Partner Registration Portal</h2>
          <p className="mt-2 text-sm text-gray-600">Complete your company profile to start receiving purchase orders.</p>
        </div>

        {/* Wizard Progress Bar */}
        <div className="flex items-center justify-between relative mb-12">
          <div className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-gray-200" aria-hidden="true"></div>
          
          {[
            { id: 1, name: 'Company Details' },
            { id: 2, name: 'Tax & Compliance' },
            { id: 3, name: 'Banking' },
            { id: 4, name: 'Documents' }
          ].map((s) => (
            <div key={s.id} className="relative flex flex-col items-center">
              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-slate-50 ${step > s.id ? 'bg-indigo-600' : step === s.id ? 'bg-indigo-600' : 'bg-white border-2 border-gray-300'}`}>
                {step > s.id ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <Circle className={`w-3 h-3 ${step === s.id ? 'text-white' : 'text-transparent'}`} />
                )}
              </span>
              <span className={`absolute -bottom-6 text-xs font-medium ${step >= s.id ? 'text-indigo-600' : 'text-gray-500'}`}>{s.name}</span>
            </div>
          ))}
        </div>

        {/* Wizard Form Area */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>{step === 1 ? 'Step 1: Company Details' : step === 2 ? 'Step 2: Tax & Compliance' : step === 3 ? 'Step 3: Banking Information' : 'Step 4: Document Uploads'}</CardTitle>
            <CardDescription>All fields marked with an asterisk (*) are mandatory.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Legal Entity Name *</label>
                  <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="e.g. Acme Corp Ltd." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trade Name (Doing Business As)</label>
                  <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Official Company Email *</label>
                  <input type="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                <FileCheck2 className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm font-semibold text-gray-900">Drag & Drop KYC Documents Here</span>
                <span className="mt-1 block text-xs text-gray-500">PDF, JPEG or PNG up to 10MB (GST, PAN, Cancelled Cheque)</span>
              </div>
            )}

            <div className="flex justify-end pt-6 border-t">
              <button 
                onClick={() => setStep(step < 4 ? step + 1 : 4)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-primary-foreground hover:bg-indigo-600/90 h-10 px-4 py-2"
              >
                {step === 4 ? 'Submit Registration' : 'Save & Continue'}
                {step !== 4 && <ChevronRight className="ml-2 h-4 w-4" />}
              </button>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}
