import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { Save, User, Building2, Truck, Bell, CreditCard, Landmark, FileSignature, ShieldCheck, MapPin, Package, CheckCircle2, X, FileText, Tag } from 'lucide-react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import EnterpriseCustomerForm from '../components/forms/EnterpriseCustomerForm';
import EnterpriseSenderForm from '../components/forms/EnterpriseSenderForm';
import EnterpriseReceiverForm from '../components/forms/EnterpriseReceiverForm';
import EnterpriseNotifyBillToForm from '../components/forms/EnterpriseNotifyBillToForm';
import EnterpriseBankTermsForm from '../components/forms/EnterpriseBankTermsForm';
import EnterpriseErpNotesForm from '../components/forms/EnterpriseErpNotesForm';
import CargoForm from '../components/forms/CargoForm';
import EditablePackageTable from '../components/forms/EditablePackageTable';
import PricingSummaryPanel from '../components/PricingSummaryPanel';

const api = axios.create({ baseURL: 'http://localhost:5000/api/v1' });

export default function BookingWizard() {
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [pricingData, setPricingData] = useState<any>(null);
  const navigate = useNavigate();

  const fillDummyData = () => {
    methods.reset({
      shipmentType: 'Export',
      serviceType: 'Ocean Freight',
      origin: 'Shanghai, CN (CNSHA)',
      destination: 'Los Angeles, US (USLAX)',
      expectedPickupDate: new Date().toISOString().split('T')[0],
      cargo: { commodity: 'Electronics', cargoDescription: 'Consumer Electronics and Parts', declaredCargoValue: 45000 },
      packages: [
        { packageType: 'Pallet', quantity: 2, weight: { grossWeight: 1200 }, dimension: { length: 120, width: 100, height: 150, unit: 'CM' } }
      ],
      customer: { 
        legalName: 'Global Tech Industries LLC', 
        tradingName: 'Global Tech',
        taxId: 'US-987654321',
        currency: 'USD', 
        paymentTerms: 'Net 30', 
        customerType: 'Corporate', 
        creditLimit: 50000, 
        taxExempt: false,
        contact: { fullName: 'Jane Doe', email: 'jane.doe@globaltech.com', mobile: '+1 415 555 0198' },
        address: { street: '123 Tech Blvd', city: 'San Francisco', state: 'CA', country: 'USA', postalCode: '94105' }
      },
      sender: {
        company: { companyName: 'Shanghai Electronics Factory', branch: 'Pudong Assembly', department: 'Logistics' },
        contact: { fullName: 'Li Wei', designation: 'Dispatch Manager', email: 'li.wei@sh-electronics.cn', alternateEmail: 'dispatch@sh-electronics.cn', mobile: '+86 138 0013 8000', phone: '+86 21 5555 1234' },
        address: { street: '456 Industrial Road', building: 'Building B, Floor 1', city: 'Shanghai', state: 'SH', country: 'China', postalCode: '200120' },
        pickup: { facilityType: 'Factory', loadingEquipment: 'Forklift Required', operatingHoursStart: '08:00', operatingHoursEnd: '18:00', weekendPickupAvailable: true, mobile: '+86 138 0013 8000', warehouseName: 'Pudong WH-1', address: 'Gate 4, 456 Industrial Rd', date: new Date().toISOString().split('T')[0], time: '14:00', window: '14:00-16:00' }
      },
      receiver: {
        company: { companyName: 'Global Tech Logistics Hub', branch: 'West Coast Distribution', department: 'Receiving' },
        contact: { fullName: 'Mike Johnson', designation: 'Warehouse Supervisor', email: 'receiving@globaltech.com', alternateEmail: 'mike.j@globaltech.com', mobile: '+1 310 555 0199', phone: '+1 310 555 0100' },
        address: { street: '789 Warehouse Ave', building: 'Dock 12-15', city: 'Long Beach', state: 'CA', country: 'USA', postalCode: '90802' },
        delivery: { receivingContact: 'Mike Johnson', receivingPhone: '+1 310 555 0199', warehouseName: 'LAX-Hub-1', address: '789 Warehouse Ave, Long Beach CA', preferredTime: '10:00', referenceNumber: 'PO-998877', instructions: 'Must call 1 hour before arrival. Appointment required for unloading.' }
      },
      terms: { customerTermsAccepted: true, privacyPolicyAccepted: true, electronicInvoiceConsent: true },
      notifyParty: {
        company: { companyName: 'Customs Brokerage Inc' },
        contact: { fullName: 'Sarah Smith', email: 'clearance@brokerage.com', mobile: '+1 310 555 0200' },
        address: { street: '100 Customs Way', city: 'Los Angeles', state: 'CA', country: 'USA', postalCode: '90045' }
      },
      billToParty: {
        company: { companyName: 'Global Tech Industries LLC' },
        contact: { fullName: 'Accounts Payable', email: 'ap@globaltech.com' },
        address: { street: '123 Tech Blvd', city: 'San Francisco', state: 'CA', country: 'USA', postalCode: '94105' }
      },
      erpInfo: { blacklistStatus: false, vipCustomer: true, customerRating: 'A' },
      communicationPref: { email: true, phone: true, portalNotification: true },
      generateInvoice: true,
      attachInvoiceToEmail: true,
      invoiceTemplate: 'standard',
      generateLabels: true
    });
  };

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      shipmentType: 'Export', 
      serviceType: 'Ocean Freight',
      packages: [],
      customer: { currency: 'USD', paymentTerms: 'Net 30', customerType: 'Corporate', creditLimit: 0, taxExempt: false },
      terms: { customerTermsAccepted: false, privacyPolicyAccepted: false, electronicInvoiceConsent: true },
      notifyParty: { notifyRequired: false },
      erpInfo: { blacklistStatus: false, vipCustomer: false, customerRating: 'A' },
      communicationPref: { email: true, phone: true, portalNotification: true }
    }
  });

  const { handleSubmit, getValues, formState: { isDirty, isValid } } = methods;
  const watchValues = useWatch({ control: methods.control });
  
  const calculatePricingMutation = useMutation({
    mutationFn: (data: any) => api.post('/bookings/calculate-pricing', data).then(res => res.data.data),
    onSuccess: (data) => setPricingData(data)
  });

  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => {
      setIsAutoSaving(true);
      if (isValid) {
        calculatePricingMutation.mutate(getValues());
      }
      setTimeout(() => setIsAutoSaving(false), 1000);
    }, 1500);
    return () => clearTimeout(timer);
  }, [watchValues, isDirty, isValid]);

  const submitMutation = useMutation({
    mutationFn: (data: any) => api.post('/bookings/submit', data).then(res => res.data.data),
    onSuccess: (data) => {
      alert('Enterprise Booking Submitted Successfully!');
      navigate(`/booking/${data.id}`);
    },
    onError: (err: any) => alert(`Error submitting booking: ${err.response?.data?.message || err.message}`)
  });

  const draftMutation = useMutation({
    mutationFn: (data: any) => api.post('/bookings/draft', data),
    onSuccess: () => alert('Draft Saved Successfully!'),
  });

  return (
    <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-8rem)] pb-32">
      
      <div className="mb-6 px-2 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Enterprise Information Management</h1>
          <p className="text-slate-500 mt-2">Exhaustive configuration for Customer, Sender, Receiver, and Logistics.</p>
        </div>
        <button 
          type="button" 
          onClick={fillDummyData}
          className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          <FileText className="w-4 h-4" /> Fill Random Data
        </button>
      </div>

      <FormProvider {...methods}>
        <form id="booking-form" className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Main Content Area (Sequential Scrolling) */}
          <div className="xl:col-span-3 space-y-10">
            
            <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
               <EnterpriseCustomerForm prefix="customer" />
            </section>
            
            <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 space-y-10">
              <div>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-600">
                  <MapPin className="w-5 h-5" /> Routing Details
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Shipment Type *</label>
                    <select {...methods.register('shipmentType')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:bg-slate-950">
                      <option value="Export">Export</option>
                      <option value="Import">Import</option>
                      <option value="Cross-Trade">Cross-Trade</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Service Type *</label>
                    <select {...methods.register('serviceType')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:bg-slate-950">
                      <option value="Ocean Freight">Ocean Freight</option>
                      <option value="Air Freight">Air Freight</option>
                      <option value="Road Freight">Road Freight</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expected Pickup Date *</label>
                    <input type="date" {...methods.register('expectedPickupDate')} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:bg-slate-950" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Origin Port/City *</label>
                    <input {...methods.register('origin')} placeholder="e.g. Shanghai, CN" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:bg-slate-950" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Destination Port/City *</label>
                    <input {...methods.register('destination')} placeholder="e.g. Los Angeles, US" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:bg-slate-950" />
                  </div>
                </div>
              </div>
              
              <hr className="border-slate-100 dark:border-slate-800" />
              
              <div>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-cyan-600">
                  <Package className="w-5 h-5" /> Cargo Details
                </h2>
                <CargoForm prefix="cargo" />
              </div>
              
              <hr className="border-slate-100 dark:border-slate-800" />

              <div>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-cyan-600">
                  <Package className="w-5 h-5" /> Packages
                </h2>
                <EditablePackageTable />
              </div>
            </section>

            <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
              <EnterpriseSenderForm />
            </section>

            <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
              <EnterpriseReceiverForm />
            </section>

            <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
              <EnterpriseNotifyBillToForm />
            </section>

            <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
              <EnterpriseBankTermsForm />
            </section>

            <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
              <EnterpriseErpNotesForm />
            </section>

            {/* Invoicing and Labels Section */}
            <section className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-900/50 p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                <FileText className="w-5 h-5" /> Invoice & Label Generation
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Configure how invoices and shipping labels should be generated upon submission.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="font-semibold flex items-center gap-2"><FileText className="w-4 h-4 text-emerald-500" /> Commercial Invoice</h3>
                  <label className="flex items-center gap-3 text-sm">
                    <input type="checkbox" {...methods.register('generateInvoice')} className="w-4 h-4" defaultChecked /> Auto-Generate Commercial Invoice
                  </label>
                  <label className="flex items-center gap-3 text-sm">
                    <input type="checkbox" {...methods.register('attachInvoiceToEmail')} className="w-4 h-4" defaultChecked /> Attach to Bill-To Email
                  </label>
                  <div className="space-y-2 mt-4">
                    <label className="text-xs font-medium text-slate-500 uppercase">Invoice Template</label>
                    <select {...methods.register('invoiceTemplate')} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:bg-slate-950">
                      <option value="standard">Standard Global Template</option>
                      <option value="eu">EU Compliant Template</option>
                      <option value="us">US Customs Template</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="font-semibold flex items-center gap-2"><Tag className="w-4 h-4 text-orange-500" /> Shipping Labels</h3>
                  <label className="flex items-center gap-3 text-sm">
                    <input type="checkbox" {...methods.register('generateLabels')} className="w-4 h-4" defaultChecked /> Auto-Generate Package Labels
                  </label>
                  <label className="flex items-center gap-3 text-sm">
                    <input type="checkbox" {...methods.register('printLabelsImmediately')} className="w-4 h-4" /> Send to Default Printer On Submit
                  </label>
                  <div className="space-y-2 mt-4">
                    <label className="text-xs font-medium text-slate-500 uppercase">Label Format</label>
                    <select {...methods.register('labelFormat')} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:bg-slate-950">
                      <option value="6x6">6" x 6" Thermal Label</option>
                      <option value="a4">A4 Sheet (4 per page)</option>
                      <option value="custom">Custom Dimensions</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column: Dynamic Pricing Panel */}
          <div className="xl:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-xl border border-blue-100 dark:border-blue-800/50">
                <h3 className="font-bold flex items-center gap-2"><Truck className="w-4 h-4"/> Auto-Pricing Active</h3>
                <p className="text-sm mt-1 opacity-80">Pricing is dynamically calculated as you fill in Routing and Cargo details.</p>
              </div>
              <PricingSummaryPanel pricingData={pricingData} isLoading={calculatePricingMutation.isPending || isAutoSaving} />
            </div>
          </div>

        </form>
      </FormProvider>

      {/* Sticky Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button type="button" className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-medium">
            <X className="w-4 h-4" /> Cancel
          </button>
          
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => draftMutation.mutate(getValues())} className="px-6 py-2.5 rounded-xl font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Draft {isAutoSaving && <span className="text-xs ml-1">(saving...)</span>}
            </button>
            <button type="button" onClick={handleSubmit((data) => submitMutation.mutate(data))} disabled={submitMutation.isPending || !isValid} className="px-8 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 shadow-lg shadow-blue-500/25 flex items-center gap-2 disabled:opacity-50">
              {submitMutation.isPending ? 'Submitting...' : 'Submit Booking'} <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
