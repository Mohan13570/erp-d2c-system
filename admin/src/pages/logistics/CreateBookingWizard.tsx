import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Save, CheckCircle, Package, Truck, Ship, FileText, Globe, Building2, User, Landmark, Plus, QrCode, Printer } from 'lucide-react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define Validation Schema with Zod
const bookingSchema = z.object({
  bookingInfo: z.object({
    bookingType: z.string().min(1, "Booking Type is required"),
    serviceType: z.string().min(1, "Service Type is required"),
    tradeType: z.string().min(1, "Trade Type is required"),
    expectedPickup: z.string().optional(),
    expectedDelivery: z.string().optional(),
    currency: z.string().min(1, "Currency is required"),
    paymentTerms: z.string().optional(),
    bookingNotes: z.string().optional(),
    specialInstructions: z.string().optional(),
    priority: z.string().optional(),
  }),
  senderDetails: z.object({
    companyName: z.string().min(2, "Company Name is required"),
    contactPerson: z.string().min(2, "Contact Person is required"),
    email: z.string().email("Invalid email").optional().or(z.literal('')),
    phone: z.string().optional(),
    line1: z.string().min(5, "Address Line 1 is required"),
    city: z.string().min(2, "City is required"),
    country: z.string().min(2, "Country is required"),
    postalCode: z.string().min(2, "Postal Code is required"),
  }),
  receiverDetails: z.object({
    companyName: z.string().min(2, "Company Name is required"),
    contactPerson: z.string().min(2, "Contact Person is required"),
    email: z.string().email("Invalid email").optional().or(z.literal('')),
    phone: z.string().optional(),
    line1: z.string().min(5, "Address Line 1 is required"),
    city: z.string().min(2, "City is required"),
    country: z.string().min(2, "Country is required"),
    postalCode: z.string().min(2, "Postal Code is required"),
  }),
  notifyParty: z.object({
    companyName: z.string().optional(),
    contactPerson: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    notificationPreference: z.string().optional()
  }),
  billToParty: z.object({
    billingCompany: z.string().optional(),
    financeContact: z.string().optional(),
    invoiceEmail: z.string().optional(),
    paymentTerms: z.string().optional(),
  }),
  cargoInformation: z.array(z.object({
    commodity: z.string().min(2, "Commodity is required"),
    description: z.string().optional(),
    hsCode: z.string().optional(),
    packageType: z.string().min(1, "Package type is required"),
    numberOfPackages: z.coerce.number().min(1),
    grossWeight: z.coerce.number().min(0.1),
    length: z.coerce.number().min(1).optional(),
    width: z.coerce.number().min(1).optional(),
    height: z.coerce.number().min(1).optional(),
    isDangerousGoods: z.boolean().optional(),
    isTemperatureControlled: z.boolean().optional(),
    containerType: z.string().optional(),
    containerSize: z.string().optional(),
    containerQuantity: z.coerce.number().optional()
  })).min(1, "At least one cargo item is required")
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const TABS = [
  { id: 'booking', label: 'Booking Info', icon: Globe },
  { id: 'sender', label: 'Sender Details', icon: Building2 },
  { id: 'receiver', label: 'Receiver Details', icon: User },
  { id: 'cargo', label: 'Cargo Information', icon: Package },
  { id: 'billing', label: 'Billing & Notify', icon: Landmark },
];

export default function EnterpriseCreateBookingWizard() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedBookingId, setGeneratedBookingId] = useState('');

  const methods = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema as any),
    defaultValues: {
      bookingInfo: {
        bookingType: 'Standard',
        serviceType: 'Ocean Freight',
        tradeType: 'Export',
        currency: 'USD',
        priority: 'Normal'
      },
      senderDetails: { companyName: '', contactPerson: '', email: '', phone: '', line1: '', city: '', country: '', postalCode: '' },
      receiverDetails: { companyName: '', contactPerson: '', email: '', phone: '', line1: '', city: '', country: '', postalCode: '' },
      notifyParty: { notificationPreference: 'Email' },
      billToParty: {},
      cargoInformation: [{ commodity: '', packageType: 'Pallets', numberOfPackages: 1, grossWeight: 1 }]
    },
    mode: 'onTouched'
  });

  const { handleSubmit, register, formState: { errors }, control, trigger } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: 'cargoInformation' });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      let totalVolumetric = 0;
      let totalActual = 0;
      
      data.cargoInformation.forEach((item: any) => {
         const l = item.length || 1;
         const w = item.width || 1;
         const h = item.height || 1;
         const pkgs = item.numberOfPackages || 1;
         totalVolumetric += ((l * w * h) / 5000) * pkgs;
         totalActual += (item.grossWeight || 0);
      });
      
      const chargeableWeight = Math.max(totalActual, totalVolumetric);
      const baseFreight = chargeableWeight * 4.5;
      const fuelSurcharge = baseFreight * 0.12;
      const subtotal = baseFreight + fuelSurcharge;
      const gst = subtotal * 0.18;
      const grandTotal = subtotal + gst;

      const calcData = {
        metrics: { volumetricWeight: totalVolumetric, actualWeight: totalActual, chargeableWeight },
        financials: { baseFreight, fuelSurcharge, subtotal, gst, grandTotal }
      };

      const mockBookingId = 'BKG-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setGeneratedBookingId(mockBookingId);
      
      const finalData = {
        ...data,
        calculation: calcData
      };
      
      localStorage.setItem(`bookingData_${mockBookingId}`, JSON.stringify(finalData));
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert('Error creating booking');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isSuccess) {
    return (
      <div className="max-w-7xl mx-auto mt-6 mb-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8 text-center mb-6 animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed & Calculated</h1>
          <p className="text-gray-500 mb-4">Your booking <span className="font-mono font-bold text-gray-900">{generatedBookingId}</span> has been processed.</p>
          <button 
            onClick={() => {
              setIsSuccess(false);
              methods.reset();
            }}
            className="text-indigo-600 hover:text-indigo-800 font-medium font-sm underline"
          >
            Create another booking
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          
          {/* Invoice Frame */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold flex items-center text-indigo-900"><FileText size={18} className="mr-2 text-indigo-600"/> Commercial Invoice</h3>
              <button 
                onClick={() => {
                  const frame = document.getElementById('invoice-frame') as HTMLIFrameElement;
                  frame?.contentWindow?.print();
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-sm"
              >
                <Printer size={16} className="mr-2"/> Print A4
              </button>
            </div>
            <iframe 
              id="invoice-frame"
              src={`/admin/booking/invoice/${generatedBookingId}?embed=true`} 
              className="w-full h-[700px] bg-gray-100"
            />
          </div>

          {/* Label Frame */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold flex items-center text-orange-900"><QrCode size={18} className="mr-2 text-orange-600"/> Shipping Labels</h3>
              <button 
                onClick={() => {
                  const frame = document.getElementById('label-frame') as HTMLIFrameElement;
                  frame?.contentWindow?.print();
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-sm"
              >
                <Printer size={16} className="mr-2"/> Print 6x6
              </button>
            </div>
            <iframe 
              id="label-frame"
              src={`/admin/booking/label/${generatedBookingId}?embed=true`} 
              className="w-full h-[700px] bg-gray-100"
            />
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Enterprise Booking</h1>
          <p className="text-sm text-gray-500 mt-1">Multi-modal global logistics & freight forwarding</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Form Body */}
        <div className="p-8">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Section 1: Booking Info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
                  <Globe className="text-indigo-600" size={20} />
                  <h2 className="text-lg font-semibold text-gray-900">Booking Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Type <span className="text-red-500">*</span></label>
                    <select {...register('bookingInfo.serviceType')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
                      <option value="Ocean Freight">Ocean Freight</option>
                      <option value="Air Freight">Air Freight</option>
                      <option value="Road Transport">Road Transport</option>
                      <option value="Rail">Rail</option>
                      <option value="Multimodal">Multimodal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trade Type <span className="text-red-500">*</span></label>
                    <select {...register('bookingInfo.tradeType')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
                      <option value="Export">Export</option>
                      <option value="Import">Import</option>
                      <option value="Domestic">Domestic</option>
                      <option value="International">International</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Booking Type <span className="text-red-500">*</span></label>
                    <select {...register('bookingInfo.bookingType')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
                      <option value="Standard">Standard</option>
                      <option value="Express">Express</option>
                      <option value="Consolidated">Consolidated (LCL/LTL)</option>
                      <option value="Direct">Direct (FCL/FTL)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Pickup</label>
                    <input type="date" {...register('bookingInfo.expectedPickup')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery</label>
                    <input type="date" {...register('bookingInfo.expectedDelivery')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency <span className="text-red-500">*</span></label>
                    <select {...register('bookingInfo.currency')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="INR">INR - Indian Rupee</option>
                    </select>
                  </div>
                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                    <textarea {...register('bookingInfo.specialInstructions')} rows={3} placeholder="Any specific requirements or instructions for this booking..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"></textarea>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />
              {/* Section 2: Sender Details */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
                  <Building2 className="text-indigo-600" size={20} />
                  <h2 className="text-lg font-semibold text-gray-900">Sender / Exporter Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider bg-gray-50 p-2 rounded">Contact Information</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name <span className="text-red-500">*</span></label>
                      <input type="text" {...register('senderDetails.companyName')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      {errors.senderDetails?.companyName && <p className="text-red-500 text-xs mt-1">{errors.senderDetails.companyName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person <span className="text-red-500">*</span></label>
                      <input type="text" {...register('senderDetails.contactPerson')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      {errors.senderDetails?.contactPerson && <p className="text-red-500 text-xs mt-1">{errors.senderDetails.contactPerson.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                        <input type="email" {...register('senderDetails.email')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        {errors.senderDetails?.email && <p className="text-red-500 text-xs mt-1">{errors.senderDetails.email.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                        <input type="text" {...register('senderDetails.phone')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        {errors.senderDetails?.phone && <p className="text-red-500 text-xs mt-1">{errors.senderDetails.phone.message}</p>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider bg-gray-50 p-2 rounded">Pickup Location</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address / Street <span className="text-red-500">*</span></label>
                      <input type="text" {...register('senderDetails.line1')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      {errors.senderDetails?.line1 && <p className="text-red-500 text-xs mt-1">{errors.senderDetails.line1.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                        <input type="text" {...register('senderDetails.city')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        {errors.senderDetails?.city && <p className="text-red-500 text-xs mt-1">{errors.senderDetails.city.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code <span className="text-red-500">*</span></label>
                        <input type="text" {...register('senderDetails.postalCode')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        {errors.senderDetails?.postalCode && <p className="text-red-500 text-xs mt-1">{errors.senderDetails.postalCode.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country <span className="text-red-500">*</span></label>
                      <input type="text" {...register('senderDetails.country')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      {errors.senderDetails?.country && <p className="text-red-500 text-xs mt-1">{errors.senderDetails.country.message}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* TAB 3: Receiver Details */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
                  <User className="text-indigo-600" size={20} />
                  <h2 className="text-lg font-semibold text-gray-900">Receiver / Consignee Details</h2>
                </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider bg-gray-50 p-2 rounded">Company Info</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name <span className="text-red-500">*</span></label>
                        <input type="text" {...register('receiverDetails.companyName')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        {errors.receiverDetails?.companyName && <p className="text-red-500 text-xs mt-1">{errors.receiverDetails.companyName.message}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person <span className="text-red-500">*</span></label>
                          <input type="text" {...register('receiverDetails.contactPerson')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                          {errors.receiverDetails?.contactPerson && <p className="text-red-500 text-xs mt-1">{errors.receiverDetails.contactPerson.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <input type="text" {...register('receiverDetails.phone')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" {...register('receiverDetails.email')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        {errors.receiverDetails?.email && <p className="text-red-500 text-xs mt-1">{errors.receiverDetails.email.message}</p>}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider bg-gray-50 p-2 rounded">Delivery Location</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address / Street <span className="text-red-500">*</span></label>
                        <input type="text" {...register('receiverDetails.line1')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        {errors.receiverDetails?.line1 && <p className="text-red-500 text-xs mt-1">{errors.receiverDetails.line1.message}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                          <input type="text" {...register('receiverDetails.city')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                          {errors.receiverDetails?.city && <p className="text-red-500 text-xs mt-1">{errors.receiverDetails.city.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code <span className="text-red-500">*</span></label>
                          <input type="text" {...register('receiverDetails.postalCode')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                          {errors.receiverDetails?.postalCode && <p className="text-red-500 text-xs mt-1">{errors.receiverDetails.postalCode.message}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country <span className="text-red-500">*</span></label>
                        <input type="text" {...register('receiverDetails.country')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        {errors.receiverDetails?.country && <p className="text-red-500 text-xs mt-1">{errors.receiverDetails.country.message}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              <hr className="border-gray-100" />
              {/* TAB 4: Cargo Information */}
              <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <Package className="text-indigo-600" size={20} />
                      <h2 className="text-lg font-semibold text-gray-900">Cargo Details</h2>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => append({ commodity: '', packageType: 'Cartons', numberOfPackages: 1, grossWeight: 1 })}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center bg-indigo-50 px-3 py-1.5 rounded-md"
                    >
                      <Plus size={16} className="mr-1" /> Add Cargo Line
                    </button>
                  </div>
                  
                  {fields.map((field, index) => (
                    <div key={field.id} className="p-5 border border-gray-200 rounded-xl bg-gray-50/50 relative">
                      {fields.length > 1 && (
                        <button type="button" onClick={() => remove(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                          <span className="text-sm font-medium">Remove</span>
                        </button>
                      )}
                      <h3 className="text-sm font-bold text-gray-700 mb-4">Cargo Line {index + 1}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Commodity <span className="text-red-500">*</span></label>
                          <input type="text" {...register(`cargoInformation.${index}.commodity`)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. Electronics, Garments" />
                          {errors.cargoInformation?.[index]?.commodity && <p className="text-red-500 text-xs mt-1">{errors.cargoInformation[index]?.commodity?.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Package Type <span className="text-red-500">*</span></label>
                          <select {...register(`cargoInformation.${index}.packageType`)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                            <option value="Cartons">Cartons</option>
                            <option value="Pallets">Pallets</option>
                            <option value="Crates">Crates</option>
                            <option value="Drums">Drums</option>
                            <option value="Bales">Bales</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity <span className="text-red-500">*</span></label>
                          <input type="number" min="1" {...register(`cargoInformation.${index}.numberOfPackages`)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                          {errors.cargoInformation?.[index]?.numberOfPackages && <p className="text-red-500 text-xs mt-1">{errors.cargoInformation[index]?.numberOfPackages?.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gross Wt (KG) <span className="text-red-500">*</span></label>
                          <input type="number" step="0.01" {...register(`cargoInformation.${index}.grossWeight`)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                          {errors.cargoInformation?.[index]?.grossWeight && <p className="text-red-500 text-xs mt-1">{errors.cargoInformation[index]?.grossWeight?.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Dim (L, W, H cm)</label>
                          <div className="flex gap-2">
                             <input type="number" placeholder="L" {...register(`cargoInformation.${index}.length`)} className="w-1/3 px-2 py-2 border border-gray-300 rounded-lg text-sm text-center" />
                             <input type="number" placeholder="W" {...register(`cargoInformation.${index}.width`)} className="w-1/3 px-2 py-2 border border-gray-300 rounded-lg text-sm text-center" />
                             <input type="number" placeholder="H" {...register(`cargoInformation.${index}.height`)} className="w-1/3 px-2 py-2 border border-gray-300 rounded-lg text-sm text-center" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4">
                        <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                          <input type="checkbox" {...register(`cargoInformation.${index}.isDangerousGoods`)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                          <span>Dangerous Goods (DG)</span>
                        </label>
                        <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                          <input type="checkbox" {...register(`cargoInformation.${index}.isTemperatureControlled`)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                          <span>Temperature Controlled (Reefer)</span>
                        </label>
                      </div>
                    </div>
                  ))}
                  {errors.cargoInformation && typeof errors.cargoInformation.message === 'string' && (
                    <p className="text-red-500 text-sm font-medium">{errors.cargoInformation.message}</p>
                  )}
              </div>
              
              <hr className="border-gray-100" />
              {/* TAB 5: Billing & Notify */}
              <div className="space-y-6">
                  <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
                    <Landmark className="text-indigo-600" size={20} />
                    <h2 className="text-lg font-semibold text-gray-900">Billing & Notify Party</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Notify Party */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider bg-gray-50 p-2 rounded">Notify Party</h3>
                      <p className="text-xs text-gray-500">Leave blank if same as Receiver/Consignee.</p>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input type="text" {...register('notifyParty.companyName')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                        <input type="email" {...register('notifyParty.email')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notification Preference</label>
                        <select {...register('notifyParty.notificationPreference')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                          <option value="Email">Email</option>
                          <option value="SMS">SMS</option>
                          <option value="Both">Both (Email + SMS)</option>
                        </select>
                      </div>
                    </div>

                    {/* Bill To Party */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider bg-gray-50 p-2 rounded">Bill-To Party</h3>
                      <p className="text-xs text-gray-500">Leave blank if Freight Prepaid by Sender.</p>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Billing Company</label>
                        <input type="text" {...register('billToParty.billingCompany')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Finance Email</label>
                        <input type="email" {...register('billToParty.invoiceEmail')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                        <select {...register('billToParty.paymentTerms')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                          <option value="">Select Terms...</option>
                          <option value="Prepaid">Prepaid</option>
                          <option value="Collect">Collect</option>
                          <option value="Net 15">Net 15 Days</option>
                          <option value="Net 30">Net 30 Days</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

            </form>
          </FormProvider>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-gray-100 bg-gray-50 flex items-center justify-center">
          <button 
            type="button"
            onClick={methods.handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full max-w-md flex justify-center items-center space-x-3 px-8 py-4 rounded-xl font-black text-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl transition-all disabled:opacity-70 disabled:cursor-wait"
          >
            {isSubmitting ? (
              <>
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing Calculation...</span>
              </>
            ) : (
              <>
                <Save size={24} />
                <span>Submit & Generate Documents</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
