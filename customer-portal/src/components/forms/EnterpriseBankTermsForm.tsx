import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Landmark, FileSignature, MessageSquare, AlertTriangle } from 'lucide-react';

export default function EnterpriseBankTermsForm() {
  const { register } = useFormContext();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* BANK DETAILS */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-600 mb-6">
          <Landmark className="w-5 h-5" /> Bank Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Bank Name</label>
            <input {...register('bankDetails.bankName')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Account Holder</label>
            <input {...register('bankDetails.accountHolder')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Account Number</label>
            <input {...register('bankDetails.accountNumber')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">IBAN</label>
            <input {...register('bankDetails.iban')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">SWIFT Code</label>
            <input {...register('bankDetails.swiftCode')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">IFSC / Branch Code</label>
            <input {...register('bankDetails.ifscCode')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
        </div>
      </div>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* EMERGENCY CONTACT */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-red-600 mb-6">
          <AlertTriangle className="w-5 h-5" /> Emergency Contact
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Name</label>
            <input {...register('emergencyContact.name')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Relationship</label>
            <input {...register('emergencyContact.relationship')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <input {...register('emergencyContact.phone')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <input type="email" {...register('emergencyContact.email')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
        </div>
      </div>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* TERMS & CONDITIONS */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-600 mb-6">
          <FileSignature className="w-5 h-5" /> Terms & Conditions Policies
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <label className="flex items-center gap-3 text-sm p-3 border rounded-xl border-slate-200 dark:border-slate-700">
            <input type="checkbox" {...register('terms.customerTermsAccepted')} className="w-4 h-4" /> Customer Terms Accepted
          </label>
          <label className="flex items-center gap-3 text-sm p-3 border rounded-xl border-slate-200 dark:border-slate-700">
            <input type="checkbox" {...register('terms.privacyPolicyAccepted')} className="w-4 h-4" /> Privacy Policy Accepted
          </label>
          <label className="flex items-center gap-3 text-sm p-3 border rounded-xl border-slate-200 dark:border-slate-700">
            <input type="checkbox" {...register('terms.dataSharingConsent')} className="w-4 h-4" /> Data Sharing Consent
          </label>
          <label className="flex items-center gap-3 text-sm p-3 border rounded-xl border-slate-200 dark:border-slate-700">
            <input type="checkbox" {...register('terms.electronicInvoiceConsent')} className="w-4 h-4" /> Electronic Invoice Consent
          </label>
          <label className="flex items-center gap-3 text-sm p-3 border rounded-xl border-slate-200 dark:border-slate-700">
            <input type="checkbox" {...register('terms.digitalSignatureConsent')} className="w-4 h-4" /> Digital Signature Consent
          </label>
          <label className="flex items-center gap-3 text-sm p-3 border rounded-xl border-slate-200 dark:border-slate-700">
            <input type="checkbox" {...register('terms.insuranceTermsAccepted')} className="w-4 h-4" /> Insurance Terms Accepted
          </label>
          <label className="flex items-center gap-3 text-sm p-3 border rounded-xl border-slate-200 dark:border-slate-700">
            <input type="checkbox" {...register('terms.dangerousGoodsDeclaration')} className="w-4 h-4 text-red-500" /> Dangerous Goods Declaration
          </label>
          <label className="flex items-center gap-3 text-sm p-3 border rounded-xl border-slate-200 dark:border-slate-700">
            <input type="checkbox" {...register('terms.liabilityAcceptance')} className="w-4 h-4" /> Liability Acceptance
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Incoterms</label>
            <select {...register('terms.incoterms')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
              <option value="">Select Incoterm</option>
              <option value="EXW">EXW - Ex Works</option>
              <option value="FCA">FCA - Free Carrier</option>
              <option value="FOB">FOB - Free On Board</option>
              <option value="CIF">CIF - Cost, Insurance, Freight</option>
              <option value="DDP">DDP - Delivered Duty Paid</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Customs Responsibility</label>
            <select {...register('terms.customsResponsibility')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
              <option value="Customer">Customer</option>
              <option value="Agent">Agent (Us)</option>
              <option value="Consignee">Consignee</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  );
}
