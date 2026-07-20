import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Building2, User, MapPin, Package, Clock } from 'lucide-react';

export default function EnterpriseSenderForm() {
  const { register } = useFormContext();
  const prefix = "sender";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-600 mb-6">
          <Building2 className="w-5 h-5" /> Enterprise Sender Profile
        </h2>
        
        {/* Company & Department */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sender Company</label>
            <input {...register(`${prefix}.company.companyName`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Sender Branch</label>
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
            <label className="text-sm font-medium">Mobile Number</label>
            <input {...register(`${prefix}.contact.mobile`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Office Phone</label>
            <input {...register(`${prefix}.contact.phone`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
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

        {/* Pickup Logistics */}
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2 dark:border-slate-800">
          <Package className="w-4 h-4" /> Pickup Logistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Pickup Facility Type</label>
            <select {...register(`${prefix}.pickup.facilityType`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
              <option value="Warehouse">Warehouse</option>
              <option value="Factory">Factory</option>
              <option value="Distribution Center">Distribution Center</option>
              <option value="Office">Office</option>
              <option value="Residential">Residential</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Loading Equipment Reqd</label>
            <input {...register(`${prefix}.pickup.loadingEquipment`)} placeholder="e.g. Forklift, Tail lift" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1"><Clock className="w-3 h-3"/> Operating Hours Start</label>
            <input type="time" {...register(`${prefix}.pickup.operatingHoursStart`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1"><Clock className="w-3 h-3"/> Operating Hours End</label>
            <input type="time" {...register(`${prefix}.pickup.operatingHoursEnd`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2 flex items-end pb-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" {...register(`${prefix}.pickup.weekendPickupAvailable`)} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm font-medium">Weekend Pickup Available</span>
            </label>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Pickup Mobile</label>
            <input {...register(`${prefix}.pickup.mobile`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Pickup Warehouse Name</label>
            <input {...register(`${prefix}.pickup.warehouseName`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2 md:col-span-3">
            <label className="text-sm font-medium">Pickup Address</label>
            <input {...register(`${prefix}.pickup.address`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Pickup Date</label>
            <input type="date" {...register(`${prefix}.pickup.date`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Pickup Time</label>
            <input type="time" {...register(`${prefix}.pickup.time`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Pickup Window</label>
            <input {...register(`${prefix}.pickupWindow`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" placeholder="e.g. 09:00 - 12:00" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Loading Dock Number</label>
            <input {...register(`${prefix}.loadingDock`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Pickup Reference Number</label>
            <input {...register(`${prefix}.pickupReferenceNumber`)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="space-y-2 md:col-span-3">
            <label className="text-sm font-medium">Loading Instructions</label>
            <textarea {...register(`${prefix}.loadingInstructions`)} rows={2} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
          </div>
        </div>
      </div>
    </div>
  );
}
