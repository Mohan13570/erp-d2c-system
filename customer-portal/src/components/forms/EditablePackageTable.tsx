import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Copy, FileSpreadsheet, Calculator } from 'lucide-react';

export default function EditablePackageTable() {
  const { register, control, watch } = useFormContext();
  
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "packages"
  });

  const packages = watch('packages') || [];

  // Local helper for live UI calculation previews
  const calculateCBM = (l: number, w: number, h: number, unit: string) => {
    if (!l || !w || !h) return 0;
    let cl = l, cw = w, ch = h;
    if (unit === 'MM') { cl /= 10; cw /= 10; ch /= 10; }
    if (unit === 'INCH') { cl *= 2.54; cw *= 2.54; ch *= 2.54; }
    if (unit === 'METER') { cl *= 100; cw *= 100; ch *= 100; }
    return (cl * cw * ch) / 1000000;
  };

  const addPackage = () => {
    append({
      packageType: 'Carton',
      quantity: 1,
      dimension: { length: 0, width: 0, height: 0, unit: 'CM' },
      weight: { grossWeight: 0, unit: 'KG' }
    });
  };

  const duplicatePackage = (index: number) => {
    const pkgToClone = packages[index];
    insert(index + 1, { ...pkgToClone, packageNumber: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Shipment Packages</h3>
        <div className="flex gap-2">
          <button type="button" className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-green-600" /> Import Excel
          </button>
          <button type="button" onClick={addPackage} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Package
          </button>
        </div>
      </div>

      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto custom-scrollbar bg-white dark:bg-slate-900">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Qty</th>
              <th className="px-4 py-3 font-medium">L × W × H (Unit)</th>
              <th className="px-4 py-3 font-medium text-right">Vol (CBM)</th>
              <th className="px-4 py-3 font-medium">Gross Wt (Unit)</th>
              <th className="px-4 py-3 font-medium text-right">Chrg Wt</th>
              <th className="px-4 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {fields.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  No packages added yet. Click 'Add Package' to begin.
                </td>
              </tr>
            )}
            {fields.map((field, index) => {
              const currentPkg = packages[index] || {};
              const dim = currentPkg.dimension || { length: 0, width: 0, height: 0, unit: 'CM' };
              const cbm = calculateCBM(dim.length, dim.width, dim.height, dim.unit);
              const volWeight = cbm * 167; // Assuming standard Air Freight for preview
              const gross = currentPkg.weight?.grossWeight || 0;
              const chrgWt = Math.max(gross, volWeight);

              return (
                <tr key={field.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-2">
                    <select {...register(`packages.${index}.packageType`)} className="w-32 px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-1 focus:ring-blue-500">
                      <option>Carton</option><option>Pallet</option><option>Box</option><option>Crate</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" min="1" {...register(`packages.${index}.quantity`, { valueAsNumber: true })} className="w-16 px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-1 focus:ring-blue-500 text-center" />
                  </td>
                  <td className="px-4 py-2 min-w-[280px]">
                    <div className="flex items-center gap-1">
                      <input type="number" placeholder="L" {...register(`packages.${index}.dimension.length`, { valueAsNumber: true })} className="w-14 px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-1 focus:ring-blue-500 text-center" />
                      <span className="text-slate-400">×</span>
                      <input type="number" placeholder="W" {...register(`packages.${index}.dimension.width`, { valueAsNumber: true })} className="w-14 px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-1 focus:ring-blue-500 text-center" />
                      <span className="text-slate-400">×</span>
                      <input type="number" placeholder="H" {...register(`packages.${index}.dimension.height`, { valueAsNumber: true })} className="w-14 px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-1 focus:ring-blue-500 text-center" />
                      <select {...register(`packages.${index}.dimension.unit`)} className="w-16 px-1 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none text-xs ml-1">
                        <option>CM</option><option>MM</option><option>INCH</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-indigo-600 dark:text-indigo-400">
                    {cbm.toFixed(3)}
                  </td>
                  <td className="px-4 py-2 min-w-[140px]">
                    <div className="flex items-center gap-1">
                      <input type="number" placeholder="Wt" {...register(`packages.${index}.weight.grossWeight`, { valueAsNumber: true })} className="w-16 px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-1 focus:ring-blue-500 text-right" />
                      <select {...register(`packages.${index}.weight.unit`)} className="w-14 px-1 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none text-xs">
                        <option>KG</option><option>LB</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-orange-600 dark:text-orange-400">
                    {chrgWt.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button type="button" onClick={() => duplicatePackage(index)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Duplicate">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => remove(index)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
