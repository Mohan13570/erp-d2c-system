import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Bell, CreditCard, Mail, Building2, User } from 'lucide-react';

export default function EnterpriseNotifyBillToForm() {
  const { register } = useFormContext();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* NOTIFY PARTY */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-600 mb-6">
          <Bell className="w-5 h-5" /> Notify Party
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2 flex items-center gap-2 pt-8">
            <input type="checkbox" {...register('notifyParty.notifyRequired')} id="notifyRequired" className="w-4 h-4 rounded border-slate-300" />
            <label htmlFor="notifyRequired" className="text-sm font-medium">Notify Required</label>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Notify Company</label>
            <input {...register('notifyParty.companyName')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Department</label>
            <input {...register('notifyParty.department')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Person</label>
            <input {...register('notifyParty.contactPerson')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Notify Email</label>
            <input type="email" {...register('notifyParty.email')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Notify Phone / WhatsApp</label>
            <input {...register('notifyParty.phone')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
        </div>

        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2 dark:border-slate-800">Notification Methods</h3>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('notifyParty.methodEmail')} /> Email</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('notifyParty.methodSMS')} /> SMS</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('notifyParty.methodWhatsApp')} /> WhatsApp</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('notifyParty.methodPush')} /> Push Notification</label>
        </div>
      </div>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* BILL TO PARTY */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-600 mb-6">
          <CreditCard className="w-5 h-5" /> Bill To Party
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-medium">Billing Company</label>
            <input {...register('billToParty.companyName')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Billing Contact</label>
            <input {...register('billToParty.contactPerson')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Finance Email</label>
            <input type="email" {...register('billToParty.financeEmail')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Finance Mobile</label>
            <input {...register('billToParty.financeMobile')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">GST Number</label>
            <input {...register('billToParty.gstNumber')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tax Number / PAN</label>
            <input {...register('billToParty.taxNumber')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2 md:col-span-3">
            <label className="text-sm font-medium">Billing Address</label>
            <input {...register('billToParty.billingAddress')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
        </div>

        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2 dark:border-slate-800">Financials</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Billing Currency</label>
            <input {...register('billToParty.billingCurrency')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" placeholder="e.g. USD, EUR" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Credit Limit</label>
            <input type="number" {...register('billToParty.creditLimit')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Credit Period (Days)</label>
            <input type="number" {...register('billToParty.creditPeriod')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Invoice Delivery</label>
            <select {...register('billToParty.invoiceDeliveryMethod')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
              <option value="Email">Email</option>
              <option value="Portal">Portal</option>
              <option value="Post">Post</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
