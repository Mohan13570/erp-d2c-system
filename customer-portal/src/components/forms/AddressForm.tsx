import React from 'react';
import { useFormContext } from 'react-hook-form';

interface AddressFormProps {
  prefix: string; // e.g. "sender.address", "receiver.address"
}

export default function AddressForm({ prefix }: AddressFormProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2 col-span-full">
        <label className="text-sm font-medium">Search Address (Google Maps)</label>
        <div className="relative">
          <input 
            placeholder="Start typing an address..."
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-2.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Auto Complete Ready</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Building Number</label>
        <input {...register(`${prefix}.buildingNumber`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Street</label>
        <input {...register(`${prefix}.street`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">City *</label>
        <input {...register(`${prefix}.city`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500" />
        {getError(`${prefix}.city`) && <span className="text-xs text-red-500">{getError(`${prefix}.city`)}</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">State / Province</label>
        <input {...register(`${prefix}.state`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Country *</label>
        <select {...register(`${prefix}.country`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select Country</option>
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="IN">India</option>
          <option value="SG">Singapore</option>
          <option value="AE">UAE</option>
        </select>
        {getError(`${prefix}.country`) && <span className="text-xs text-red-500">{getError(`${prefix}.country`)}</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Postal Code *</label>
        <input {...register(`${prefix}.postalCode`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500" />
        {getError(`${prefix}.postalCode`) && <span className="text-xs text-red-500">{getError(`${prefix}.postalCode`)}</span>}
      </div>
    </div>
  );
}
