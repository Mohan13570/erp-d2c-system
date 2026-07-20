import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FileText, Building2, CreditCard, ShieldCheck, Mail, MapPin } from 'lucide-react';

interface EnterpriseCustomerFormProps {
  prefix: string;
}

export default function EnterpriseCustomerForm({ prefix }: EnterpriseCustomerFormProps) {
  const { register, formState: { errors } } = useFormContext();

  const getError = (field: string) => {
    const keys = field.split('.');
    let err: any = errors;
    for (const key of keys) {
      if (!err) break;
      err = err[key];
    }
    return err?.message as string | undefined;
  };

  return (
    <div className="space-y-8">
      {/* Basic Profile */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2 dark:border-slate-800">
          <Building2 className="w-4 h-4" /> Basic Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Legal Name *</label>
            <input {...register(`${prefix}.legalName`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" placeholder="e.g. Acme Corp LLC" />
            {getError(`${prefix}.legalName`) && <span className="text-xs text-red-500 block">{getError(`${prefix}.legalName`)}</span>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Trading Name (DBA)</label>
            <input {...register(`${prefix}.tradingName`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" placeholder="e.g. Acme Logistics" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Industry Type</label>
            <select {...register(`${prefix}.industryType`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
              <option value="">Select Industry</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail">Retail</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Automotive">Automotive</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Customer Type</label>
            <select {...register(`${prefix}.customerType`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
              <option value="Corporate">Corporate</option>
              <option value="SME">SME</option>
              <option value="Individual">Individual</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Website</label>
            <input {...register(`${prefix}.website`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" placeholder="https://..." />
          </div>
        </div>
      </div>

      {/* Tax & Compliance */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2 dark:border-slate-800">
          <FileText className="w-4 h-4" /> Tax & Registration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tax ID (PAN/EIN)</label>
            <input {...register(`${prefix}.taxId`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Registration Number</label>
            <input {...register(`${prefix}.registrationNumber`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">VAT / GST Number</label>
            <input {...register(`${prefix}.vatGstNumber`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
        </div>
      </div>

      {/* Financials & Billing */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2 dark:border-slate-800">
          <CreditCard className="w-4 h-4" /> Financials & Billing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Currency</label>
            <select {...register(`${prefix}.currency`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Terms</label>
            <select {...register(`${prefix}.paymentTerms`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
              <option value="Prepaid">Prepaid</option>
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 60">Net 60</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Credit Limit Req.</label>
            <input type="number" {...register(`${prefix}.creditLimit`, { valueAsNumber: true })} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2 flex items-center gap-2 mt-6">
            <input type="checkbox" {...register(`${prefix}.taxExempt`)} className="w-4 h-4 rounded border-slate-300" id="taxExempt" />
            <label htmlFor="taxExempt" className="text-sm font-medium">Tax Exempt</label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* Primary Contact */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2 dark:border-slate-800">
            <Mail className="w-4 h-4" /> Primary Contact
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name *</label>
                <input {...register(`${prefix}.contact.fullName`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
                {getError(`${prefix}.contact.fullName`) && <span className="text-xs text-red-500 block">{getError(`${prefix}.contact.fullName`)}</span>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Designation</label>
                <input {...register(`${prefix}.contact.designation`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address *</label>
                <input type="email" {...register(`${prefix}.contact.email`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
                {getError(`${prefix}.contact.email`) && <span className="text-xs text-red-500 block">{getError(`${prefix}.contact.email`)}</span>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mobile Number</label>
                <input {...register(`${prefix}.contact.mobile`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
              </div>
            </div>
          </div>
        </div>

        {/* Primary Address */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2 dark:border-slate-800">
            <MapPin className="w-4 h-4" /> Billing Address
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Street Address</label>
              <input {...register(`${prefix}.address.street`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City *</label>
                <input {...register(`${prefix}.address.city`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
                {getError(`${prefix}.address.city`) && <span className="text-xs text-red-500 block">{getError(`${prefix}.address.city`)}</span>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">State / Region</label>
                <input {...register(`${prefix}.address.state`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Postal Code</label>
                <input {...register(`${prefix}.address.postalCode`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Country *</label>
                <input {...register(`${prefix}.address.country`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
                {getError(`${prefix}.address.country`) && <span className="text-xs text-red-500 block">{getError(`${prefix}.address.country`)}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
