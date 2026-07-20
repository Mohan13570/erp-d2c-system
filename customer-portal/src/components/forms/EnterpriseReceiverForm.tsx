import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Building2, User, MapPin, Clock } from 'lucide-react';

export default function EnterpriseReceiverForm() {
  const { register } = useFormContext();
  const prefix = "receiver";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-600 mb-6">
          <Building2 className="w-5 h-5" /> Enterprise Receiver Profile
        </h2>
        
        {/* Company & Department */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-medium">Receiver Company</label>
            <input {...register(`${prefix}.company.companyName`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Receiver Branch</label>
            <input {...register(`${prefix}.company.branch`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Department</label>
            <input {...register(`${prefix}.company.department`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
        </div>

        {/* Contact Info */}
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2 dark:border-slate-800">
          <User className="w-4 h-4" /> Primary Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Person</label>
            <input {...register(`${prefix}.contact.fullName`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Designation</label>
            <input {...register(`${prefix}.contact.designation`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Primary Email</label>
            <input type="email" {...register(`${prefix}.contact.email`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Alternate Email</label>
            <input type="email" {...register(`${prefix}.contact.alternateEmail`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Office Phone</label>
            <input {...register(`${prefix}.contact.phone`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mobile</label>
            <input {...register(`${prefix}.contact.mobile`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
        </div>

        {/* Address */}
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2 dark:border-slate-800">
          <MapPin className="w-4 h-4" /> Address Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-sm font-medium">Street Address</label>
            <input {...register(`${prefix}.address.street`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Building/Suite</label>
            <input {...register(`${prefix}.address.building`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <input {...register(`${prefix}.address.city`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">State/Province</label>
            <input {...register(`${prefix}.address.state`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Postal Code</label>
            <input {...register(`${prefix}.address.postalCode`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <input {...register(`${prefix}.address.country`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
        </div>

        {/* Delivery Details */}
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2 dark:border-slate-800">
          <Clock className="w-4 h-4" /> Delivery & Operations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Receiving Contact</label>
            <input {...register(`${prefix}.delivery.receivingContact`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Receiving Phone</label>
            <input {...register(`${prefix}.delivery.receivingPhone`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Delivery Warehouse</label>
            <input {...register(`${prefix}.delivery.warehouseName`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2 md:col-span-3">
            <label className="text-sm font-medium">Delivery Address</label>
            <input {...register(`${prefix}.delivery.address`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Preferred Delivery Time</label>
            <input type="time" {...register(`${prefix}.delivery.preferredTime`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Delivery Reference Number</label>
            <input {...register(`${prefix}.delivery.referenceNumber`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2 md:col-span-3">
            <label className="text-sm font-medium">Receiving Instructions</label>
            <textarea {...register(`${prefix}.delivery.instructions`)} rows={2} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 resize-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
