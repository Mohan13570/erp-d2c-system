import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ShieldCheck, AlignLeft, Paperclip } from 'lucide-react';

export default function EnterpriseErpNotesForm() {
  const { register } = useFormContext();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* INTERNAL ERP INFO */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-600 mb-6">
          <ShieldCheck className="w-5 h-5" /> Internal ERP Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sales Executive</label>
            <input {...register('erpInfo.salesExecutive')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Operations Executive</label>
            <input {...register('erpInfo.operationsExecutive')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Account Manager</label>
            <input {...register('erpInfo.accountManager')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Customer Success Manager</label>
            <input {...register('erpInfo.customerSuccessManager')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Customer Rating</label>
            <select {...register('erpInfo.customerRating')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
              <option value="A">A - Excellent</option>
              <option value="B">B - Good</option>
              <option value="C">C - Average</option>
              <option value="D">D - Poor</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Risk Level</label>
            <select {...register('erpInfo.riskLevel')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>
          
          <div className="space-y-2 flex items-center gap-2 pt-8">
            <input type="checkbox" {...register('erpInfo.vipCustomer')} id="vipCustomer" className="w-4 h-4 rounded border-slate-300" />
            <label htmlFor="vipCustomer" className="text-sm font-medium font-bold text-amber-600">VIP Customer</label>
          </div>
          <div className="space-y-2 flex items-center gap-2 pt-8">
            <input type="checkbox" {...register('erpInfo.blacklistStatus')} id="blacklistStatus" className="w-4 h-4 rounded border-slate-300" />
            <label htmlFor="blacklistStatus" className="text-sm font-medium font-bold text-red-600">Blacklisted</label>
          </div>
        </div>
      </div>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* NOTES */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-600 mb-6">
          <AlignLeft className="w-5 h-5" /> Operational Notes
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Internal Notes</label>
            <textarea {...register('notes.internalNotes')} rows={3} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Customer Notes</label>
            <textarea {...register('notes.customerNotes')} rows={3} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Operations Notes</label>
            <textarea {...register('notes.operationsNotes')} rows={3} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Finance Notes</label>
            <textarea {...register('notes.financeNotes')} rows={3} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-red-500">Special Instructions</label>
            <textarea {...register('notes.specialInstructions')} rows={2} className="w-full px-4 py-2 rounded-lg border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20" />
          </div>
        </div>
      </div>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* ATTACHMENTS (Placeholder for UI) */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-600 mb-6">
          <Paperclip className="w-5 h-5" /> Required Attachments Checklist
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-70">
          <div className="p-4 border border-dashed border-slate-300 rounded-lg text-center text-sm font-medium">Company Registration Certificate</div>
          <div className="p-4 border border-dashed border-slate-300 rounded-lg text-center text-sm font-medium">GST Certificate</div>
          <div className="p-4 border border-dashed border-slate-300 rounded-lg text-center text-sm font-medium">PAN Card</div>
          <div className="p-4 border border-dashed border-slate-300 rounded-lg text-center text-sm font-medium">IEC Certificate</div>
          <div className="p-4 border border-dashed border-slate-300 rounded-lg text-center text-sm font-medium">Import License</div>
          <div className="p-4 border border-dashed border-slate-300 rounded-lg text-center text-sm font-medium">Address Proof</div>
          <div className="p-4 border border-dashed border-slate-300 rounded-lg text-center text-sm font-medium">Insurance Documents</div>
          <div className="p-4 border border-dashed border-slate-300 rounded-lg text-center text-sm font-medium">Signed Agreement</div>
        </div>
      </div>

    </div>
  );
}
