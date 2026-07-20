import React from 'react';
import { useFormContext } from 'react-hook-form';

interface ContactFormProps {
  prefix: string; // e.g. "sender.contact"
  isMandatory?: boolean;
}

export default function ContactForm({ prefix, isMandatory = true }: ContactFormProps) {
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
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name {isMandatory && '*'}</label>
        <input {...register(`${prefix}.fullName`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500" />
        {getError(`${prefix}.fullName`) && <span className="text-xs text-red-500">{getError(`${prefix}.fullName`)}</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Designation</label>
        <input {...register(`${prefix}.designation`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mobile Number {isMandatory && '*'}</label>
        <input {...register(`${prefix}.mobileNumber`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500" />
        {getError(`${prefix}.mobileNumber`) && <span className="text-xs text-red-500">{getError(`${prefix}.mobileNumber`)}</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Official Email</label>
        <input type="email" {...register(`${prefix}.officialEmail`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500" />
        {getError(`${prefix}.officialEmail`) && <span className="text-xs text-red-500">{getError(`${prefix}.officialEmail`)}</span>}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Telephone</label>
        <input {...register(`${prefix}.telephone`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
    </div>
  );
}
