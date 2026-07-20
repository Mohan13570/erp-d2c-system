import React from 'react';
import { useFormContext } from 'react-hook-form';

interface CompanyFormProps {
  prefix: string;
  isMandatory?: boolean;
}

export default function CompanyForm({ prefix, isMandatory = true }: CompanyFormProps) {
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
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Name {isMandatory && '*'}</label>
        <div className="relative">
          <input 
            {...register(`${prefix}.companyName`)}
            placeholder="Search company or enter manually..."
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500"
          />
          {getError(`${prefix}.companyName`) && <span className="text-xs text-red-500 block mt-1">{getError(`${prefix}.companyName`)}</span>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">GST Number</label>
        <input {...register(`${prefix}.gstNumber`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">PAN / Tax ID</label>
        <input {...register(`${prefix}.panNumber`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Type</label>
        <select {...register(`${prefix}.companyType`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select Type</option>
          <option value="LLC">LLC</option>
          <option value="Corporation">Corporation</option>
          <option value="Partnership">Partnership</option>
          <option value="Proprietorship">Proprietorship</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Email</label>
        <input type="email" {...register(`${prefix}.companyEmail`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500" />
        {getError(`${prefix}.companyEmail`) && <span className="text-xs text-red-500 block mt-1">{getError(`${prefix}.companyEmail`)}</span>}
      </div>
    </div>
  );
}
