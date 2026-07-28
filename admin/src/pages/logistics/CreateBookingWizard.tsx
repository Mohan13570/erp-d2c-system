import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Save, CheckCircle, RotateCcw, Search, Calendar, MapPin, UploadCloud, FileText,
  MessageCircle, RefreshCw, Calculator, Truck, Clock, DollarSign, Check, Zap, X, Printer, ArrowLeft, ChevronDown, List
} from 'lucide-react';

const bookingSchema = z.object({
  orderType: z.string().min(1, "Order type required"),
  transportMode: z.string().min(1, "Transport mode required"),
  operation: z.string().min(1, "Operation required"),
  customerName: z.string().min(1, "Customer name required"),
  contactPerson: z.string().min(1, "Contact person required"),
  mobileNumber: z.string().min(1, "Mobile number required"),
  email: z.string().email().optional().or(z.literal('')),
  bookingDate: z.string().min(1, "Booking date required"),
  referenceNo: z.string().optional(),
  
  shippingDate: z.string().min(1, "Shipping date required"),
  cargoType: z.string().min(1, "Cargo type required"),
  incoterms: z.string().min(1, "Incoterms required"),
  shipmentCurrency: z.string().min(1, "Currency required"),
  shipmentValue: z.coerce.number().min(0, "Value required"),
  commodity: z.string().min(1, "Commodity required"),
  hsCode: z.string().optional(),
  insurance: z.boolean().optional(),
  specialCargo: z.string().optional(),
  temperature: z.string().optional(),
  serviceType: z.string().optional(),

  shipperCompany: z.string().min(1, "Shipper required"),
  shipperContact: z.string().min(1, "Contact required"),
  shipperCountry: z.string().min(1, "Country required"),
  shipperCity: z.string().min(1, "City required"),
  shipperAddress: z.string().min(1, "Address required"),
  originPort: z.string().min(1, "Origin port required"),
  etdDate: z.string().min(1, "ETD required"),
  pickupTime: z.string().optional(),
  pickupInstruction: z.string().optional(),

  consigneeCompany: z.string().min(1, "Consignee required"),
  consigneeContact: z.string().min(1, "Contact required"),
  consigneeCountry: z.string().min(1, "Country required"),
  consigneeCity: z.string().min(1, "City required"),
  consigneeAddress: z.string().min(1, "Address required"),
  destinationPort: z.string().min(1, "Destination port required"),
  etaDate: z.string().min(1, "ETA required"),
  deliveryInstruction: z.string().optional(),

  pieces: z.coerce.number().min(1, "Pieces required"),
  packageType: z.string().min(1, "Package type required"),
  grossWeight: z.coerce.number().min(0.1, "Gross weight required"),
  volumeCbm: z.coerce.number().min(0, "Volume required"),
  chargeableWeight: z.coerce.number().optional(),
  cargoCommodity: z.string().min(1, "Commodity required"),
  cargoHsCode: z.string().optional(),
  dgCargo: z.boolean().optional(),
  stackable: z.boolean().optional(),
  temperatureControl: z.boolean().optional(),
  insuranceValue: z.coerce.number().optional(),
  remarks: z.string().optional()
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const LizomeLogo = ({ className = "h-10" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <svg viewBox="0 0 100 100" className="h-full w-auto">
      <defs>
        <linearGradient id="gradL" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor:'#06143c', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#005ae6', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="gradR" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor:'#26e5a6', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#008ce6', stopOpacity:1}} />
        </linearGradient>
      </defs>
      <path d="M 47 25 L 62 32.5 L 62 70 L 47 62.5 Z" fill="url(#gradR)" stroke="url(#gradR)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M 25 25 L 40 15 L 40 65 L 75 82.5 L 60 92.5 L 25 75 Z" fill="url(#gradL)" stroke="url(#gradL)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
    <div className="flex items-center tracking-widest font-black text-slate-900 uppercase" style={{ fontSize: '2em' }}>
      LIZOM
      <div className="flex flex-col justify-between ml-1 h-[0.7em] w-[0.65em]" style={{ marginTop: '0.05em' }}>
        <div className="w-full h-[22%] rounded-sm" style={{ backgroundColor: '#26e5a6' }}></div>
        <div className="w-full h-[22%] rounded-sm" style={{ backgroundColor: '#00ccff' }}></div>
        <div className="w-full h-[22%] rounded-sm" style={{ backgroundColor: '#005ce6' }}></div>
      </div>
    </div>
  </div>
);

type ViewState = 'form' | 'success';

export default function CreateBookingWizard() {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewState>('form');
  const [submittedData, setSubmittedData] = useState<BookingFormValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const methods = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: 'onTouched'
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = methods;

  // Auto calculate chargeable weight
  const grossWeight = watch('grossWeight') || 0;
  const volumeCbm = watch('volumeCbm') || 0;
  const autoChargeableWeight = Math.max(grossWeight, volumeCbm * 167);

  // Dynamic variables for Sidebar
  const cName = watch('customerName');
  const refNo = watch('referenceNo');
  const shipAddr = watch('shipperAddress');
  const oPort = watch('originPort');
  const dPort = watch('destinationPort');

  // AI Assistant State
  const isCustomerVerified = !!cName && cName.length > 2;
  const isCreditAvailable = !!cName && cName.length > 2;
  const isKycCompleted = !!cName && cName.length > 2;
  const isNoDuplicate = !!refNo && refNo.length > 2;
  const isAddressVerified = !!shipAddr && shipAddr.length > 5;

  // AI Suggestions Data
  const bestRoute = oPort && dPort ? `${oPort} → ${dPort}` : '-';
  const transitTime = oPort && dPort ? (oPort === 'Shenzhen Port' ? '14 - 18 Days' : '2 - 3 Days') : '-';
  const freightEstimate = autoChargeableWeight > 0 ? `AED ${(autoChargeableWeight * 12.5).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '-';
  const marginEst = autoChargeableWeight > 0 ? '18.6%' : '-';

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    // Simulate backend delay to process booking and generate documents
    setTimeout(() => {
       setIsSubmitting(false);
       setSubmittedData({ ...data, chargeableWeight: autoChargeableWeight });
       setView('success');
       window.scrollTo(0,0);
    }, 1500);
  };

  const onError = (errors: any) => {
    console.error("Form Validation Errors:", errors);
    alert("Please fill all required fields marked with * correctly.");
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSaveDraft = () => {
    const data = methods.getValues();
    const draftName = data.customerName ? `Draft: ${data.customerName}` : `Draft ${drafts.length + 1}`;
    setDrafts(prev => [{ name: draftName, timestamp: new Date().toLocaleString(), data }, ...prev]);
    setShowDrafts(true);
  };

  const handleLoadDraft = (draft: any) => {
    methods.reset(draft.data);
    setShowDrafts(false);
  };

  const handleReset = () => {
    methods.reset({
      orderType: '', transportMode: '', operation: '', customerName: '', contactPerson: '', 
      mobileNumber: '', email: '', bookingDate: '', referenceNo: '', shippingDate: '', 
      cargoType: '', incoterms: '', shipmentCurrency: '', shipmentValue: undefined, 
      commodity: '', hsCode: '', insurance: false, specialCargo: '', temperature: '', 
      serviceType: '', shipperCompany: '', shipperContact: '', shipperCountry: '', 
      shipperCity: '', shipperAddress: '', originPort: '', etdDate: '', pickupTime: '', 
      pickupInstruction: '', consigneeCompany: '', consigneeContact: '', consigneeCountry: '', 
      consigneeCity: '', consigneeAddress: '', destinationPort: '', etaDate: '', 
      deliveryInstruction: '', pieces: undefined, packageType: '', grossWeight: undefined, 
      volumeCbm: undefined, cargoCommodity: '', cargoHsCode: '', dgCargo: false, 
      stackable: false, temperatureControl: false, insuranceValue: undefined, remarks: ''
    });
    setUploadedFiles([]);
    window.scrollTo(0,0);
  };

  const handleAutoFill = () => {
    methods.reset({
      orderType: 'B2B',
      transportMode: 'Sea',
      operation: 'Export',
      customerName: 'Global Traders LLC',
      contactPerson: 'Ahmed Hassan',
      mobileNumber: '501234567',
      email: 'ahmed@globaltraders.com',
      bookingDate: new Date().toISOString().split('T')[0],
      referenceNo: 'REF-2026-X9',
      shippingDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      cargoType: 'General',
      incoterms: 'FOB',
      shipmentCurrency: 'AED',
      shipmentValue: 125000,
      commodity: 'Electronics',
      hsCode: '8517.12.00',
      insurance: false,
      shipperCompany: 'Tech Manufacturing Co.',
      shipperContact: 'Jane Smith',
      shipperCountry: 'China',
      shipperCity: 'Shenzhen',
      shipperAddress: '128 Industrial Park, Nanshan',
      originPort: 'Shenzhen Port',
      etdDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      consigneeCompany: 'Global Traders LLC',
      consigneeContact: 'Ahmed Hassan',
      consigneeCountry: 'UAE',
      consigneeCity: 'Dubai',
      consigneeAddress: 'Warehouse 45, DIP 1',
      destinationPort: 'Jebel Ali',
      etaDate: new Date(Date.now() + 86400000 * 18).toISOString().split('T')[0],
      pieces: 24,
      packageType: 'Pallets',
      grossWeight: 4500,
      volumeCbm: 12.5,
      cargoCommodity: 'Electronics',
      cargoHsCode: '8517.12.00',
      dgCargo: false,
      stackable: true,
      temperatureControl: false,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePrint = (elementId: string) => {
    const printContent = document.getElementById(elementId);
    if (!printContent) return;
    const windowPrint = window.open('', '', 'width=900,height=650');
    windowPrint?.document.write(`
      <html>
        <head>
          <title>Print</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body onload="window.print(); window.close();" style="margin: 0; padding: 0;">
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    windowPrint?.document.close();
  };


  if (view === 'success' && submittedData) {
    const cw = submittedData.chargeableWeight || 0;
    const baseFreight = cw * 10;
    const fuelSurcharge = cw * 1.5;
    const handlingFee = 150;
    const customsClearance = 250;
    const totalAmount = baseFreight + fuelSurcharge + handlingFee + customsClearance;
    const trackingNo = submittedData.referenceNo || `AWB${Math.floor(Math.random() * 1000000000)}`;

    return (
      <div className="min-h-screen bg-slate-100 font-sans pb-20">
        <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setView('form')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </button>
              <div>
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Booking Confirmed</h1>
                <p className="text-sm text-green-600 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Documents generated successfully</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => handlePrint('invoice-print-area')} className="px-4 py-2 bg-slate-900 text-white rounded-md font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm">
                <Printer className="w-4 h-4" /> Print Invoice
              </button>
              <button onClick={() => handlePrint('label-print-area')} className="px-4 py-2 bg-blue-600 text-white rounded-md font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
                <Printer className="w-4 h-4" /> Print 6x6 Label
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-6 mt-10 flex flex-col xl:flex-row gap-10 items-start">
          
          {/* A4 INVOICE */}
          <div className="flex-1 flex flex-col items-center">
            <h3 className="text-sm font-bold text-slate-500 mb-4 tracking-widest uppercase">Commercial Invoice (A4)</h3>
            <div id="invoice-print-area" className="w-[210mm] min-h-[297mm] bg-white shadow-xl p-[20mm] mx-auto text-slate-900 flex flex-col border border-slate-200 relative overflow-hidden">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-10 border-b-2 border-slate-900 pb-6">
                <div>
                  <LizomeLogo className="h-10 mb-2" />
                  <p className="text-xs font-medium text-slate-500 mt-1">123 Logistics Park, Dubai, UAE<br/>TRN: 100293847563<br/>contact@lizome.com</p>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-black uppercase text-slate-300 tracking-wider">Invoice</h2>
                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <span className="font-bold text-slate-500">Invoice No:</span> <span className="font-black">INV-{Math.floor(Math.random() * 100000)}</span>
                    <span className="font-bold text-slate-500">Date:</span> <span className="font-black">{submittedData.bookingDate}</span>
                    <span className="font-bold text-slate-500">Job Ref:</span> <span className="font-black">{submittedData.referenceNo || 'N/A'}</span>
                    <span className="font-bold text-slate-500">Terms:</span> <span className="font-black">{submittedData.incoterms}</span>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-2 gap-10 mb-10">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Shipper (Sender)</h3>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="font-black text-base">{submittedData.shipperCompany}</p>
                    <p className="text-sm text-slate-600 mt-1">{submittedData.shipperAddress}</p>
                    <p className="text-sm text-slate-600">{submittedData.shipperCity}, {submittedData.shipperCountry}</p>
                    <p className="text-sm text-slate-600 mt-2 font-medium">Attn: {submittedData.shipperContact}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Consignee (Receiver)</h3>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="font-black text-base">{submittedData.consigneeCompany}</p>
                    <p className="text-sm text-slate-600 mt-1">{submittedData.consigneeAddress}</p>
                    <p className="text-sm text-slate-600">{submittedData.consigneeCity}, {submittedData.consigneeCountry}</p>
                    <p className="text-sm text-slate-600 mt-2 font-medium">Attn: {submittedData.consigneeContact}</p>
                  </div>
                </div>
              </div>

              {/* Routing */}
              <div className="flex items-center justify-between py-4 border-y border-slate-200 mb-10 px-4">
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-500 uppercase">Port of Loading</p>
                  <p className="font-black text-sm">{submittedData.originPort}</p>
                </div>
                <Truck className="w-6 h-6 text-slate-300 mx-4" />
                <div className="flex-1 text-right">
                  <p className="text-xs font-bold text-slate-500 uppercase">Port of Discharge</p>
                  <p className="font-black text-sm">{submittedData.destinationPort}</p>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full mb-10 text-sm">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="py-3 px-4 text-left font-bold w-1/2">Description of Goods</th>
                    <th className="py-3 px-4 text-center font-bold">Qty</th>
                    <th className="py-3 px-4 text-center font-bold">C. Weight</th>
                    <th className="py-3 px-4 text-right font-bold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-4 px-4">
                      <p className="font-bold">{submittedData.cargoCommodity}</p>
                      <p className="text-xs text-slate-500 mt-1">HS Code: {submittedData.cargoHsCode || 'N/A'}</p>
                      <p className="text-xs text-slate-500">{submittedData.pieces} {submittedData.packageType} @ {submittedData.grossWeight}KG / {submittedData.volumeCbm}CBM</p>
                    </td>
                    <td className="py-4 px-4 text-center font-medium">{submittedData.pieces}</td>
                    <td className="py-4 px-4 text-center font-medium">{cw.toFixed(2)} KG</td>
                    <td className="py-4 px-4 text-right font-medium">AED {baseFreight.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Split Charges & Totals */}
              <div className="flex justify-end mb-16">
                <div className="w-1/2">
                  <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span className="font-medium text-slate-600">Base Freight</span>
                    <span className="font-bold text-slate-900">AED {baseFreight.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span className="font-medium text-slate-600">Fuel Surcharge (FSC)</span>
                    <span className="font-bold text-slate-900">AED {fuelSurcharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span className="font-medium text-slate-600">Terminal Handling (THC)</span>
                    <span className="font-bold text-slate-900">AED {handlingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span className="font-medium text-slate-600">Customs Clearance</span>
                    <span className="font-bold text-slate-900">AED {customsClearance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-4 border-b-2 border-slate-900 mt-2 text-lg">
                    <span className="font-black text-slate-900 uppercase">Total Amount</span>
                    <span className="font-black text-blue-700">AED {totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto pt-6 border-t border-slate-200 text-xs text-slate-500 text-center">
                <p className="font-bold mb-1">Thank you for your business!</p>
                <p>This is a computer generated invoice and requires no signature.</p>
              </div>
            </div>
          </div>

          {/* 6x6 LABEL */}
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-bold text-slate-500 mb-4 tracking-widest uppercase">Shipping Label (6x6)</h3>
            <div id="label-print-area" className="w-[152.4mm] h-[152.4mm] bg-white shadow-xl p-6 border-2 border-slate-900 flex flex-col justify-between text-slate-900">
              
              {/* Label Header */}
              <div className="flex justify-between items-start border-b-4 border-slate-900 pb-4">
                <div>
                  <LizomeLogo className="h-8 mb-1" />
                  <p className="text-[10px] font-bold mt-1">PRIORITY EXPRESS</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black bg-slate-900 text-white px-3 py-1 rounded">
                    {submittedData.transportMode.substring(0, 3).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Routing */}
              <div className="flex py-4 border-b-2 border-slate-900">
                <div className="flex-1 border-r-2 border-slate-900 pr-4">
                  <p className="text-[10px] font-bold text-slate-500">ORIGIN</p>
                  <p className="text-2xl font-black uppercase truncate">{submittedData.originPort.substring(0, 3)}</p>
                </div>
                <div className="flex-1 pl-4">
                  <p className="text-[10px] font-bold text-slate-500">DESTINATION</p>
                  <p className="text-2xl font-black uppercase truncate">{submittedData.destinationPort.substring(0, 3)}</p>
                </div>
              </div>

              {/* Addresses */}
              <div className="flex flex-col gap-4 py-4 border-b-2 border-slate-900 flex-1">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 mb-1">FROM:</p>
                  <p className="font-bold text-sm leading-tight">{submittedData.shipperCompany}</p>
                  <p className="text-xs leading-tight line-clamp-2">{submittedData.shipperAddress}, {submittedData.shipperCity}, {submittedData.shipperCountry}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 mb-1">TO (CONSIGNEE):</p>
                  <p className="font-black text-base leading-tight">{submittedData.consigneeCompany}</p>
                  <p className="text-sm leading-tight line-clamp-2">{submittedData.consigneeAddress}, {submittedData.consigneeCity}, {submittedData.consigneeCountry}</p>
                  <p className="text-sm font-bold mt-1">Ph: {submittedData.consigneeContact}</p>
                </div>
              </div>

              {/* Details & Barcode */}
              <div className="pt-4">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500">WEIGHT</p>
                    <p className="text-xl font-black">{submittedData.grossWeight} KG</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500">PIECES</p>
                    <p className="text-xl font-black text-center">{submittedData.pieces}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500">DATE</p>
                    <p className="text-sm font-bold">{submittedData.bookingDate}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  <img src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${trackingNo}&scale=3&includetext`} alt="Barcode" className="h-20 w-full object-contain" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    );
  }

  // --- FORM VIEW ---
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="min-h-screen bg-slate-50 font-sans pb-10 relative">
        
        <div className="bg-white border-b border-slate-200 relative z-40">
          <div className="max-w-screen-2xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Job Booking / Order Creation</h1>
              <p className="text-sm text-slate-500 font-medium">Create new booking for your shipment</p>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={handleAutoFill} className="px-4 py-2 border border-blue-200 bg-blue-50 rounded-md text-blue-700 font-bold flex items-center gap-2 hover:bg-blue-100 transition-colors shadow-sm">
                <Zap className="w-4 h-4" /> Auto Fill Demo
              </button>
              
              {/* Drafts Dropdown Logic */}
              <div className="relative">
                <button type="button" onClick={() => setShowDrafts(!showDrafts)} className="px-4 py-2 border border-slate-200 rounded-md text-slate-700 font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm bg-white">
                  <List className="w-4 h-4" /> View Drafts {drafts.length > 0 && `(${drafts.length})`}
                </button>
                {showDrafts && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDrafts(false)}></div>
                    <div className="absolute top-full mt-2 w-72 bg-white border border-slate-200 rounded-md shadow-xl z-50 p-2 right-0">
                      <p className="text-[10px] font-bold text-slate-400 mb-2 px-2 uppercase tracking-wider">Saved Drafts ({drafts.length})</p>
                      {drafts.length === 0 ? (
                        <p className="text-xs text-slate-500 px-2 pb-2">No drafts saved yet.</p>
                      ) : (
                        <div className="max-h-64 overflow-y-auto space-y-1 relative z-50">
                          {drafts.map((d, i) => (
                            <button key={i} type="button" onClick={() => handleLoadDraft(d)} className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-md text-sm font-bold text-slate-700 flex flex-col group border border-transparent hover:border-blue-100 transition-colors">
                              <span className="truncate w-full group-hover:text-blue-700">{d.name}</span>
                              <span className="text-[10px] text-slate-400 font-medium mt-0.5">{d.timestamp}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <button type="button" onClick={handleSaveDraft} className="px-4 py-2 border border-slate-200 rounded-md text-slate-700 font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm bg-white">
                <Save className="w-4 h-4" /> Save Draft
              </button>
              
              <button type="button" onClick={handleReset} className="px-4 py-2 border border-slate-200 rounded-md text-slate-700 font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm bg-white">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
              
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold flex items-center gap-2 transition-colors shadow-sm min-w-[180px] justify-center">
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <><CheckCircle className="w-4 h-4" /> Submit Booking</>
                )}
              </button>
            </div>
          </div>

          <div className="max-w-screen-2xl mx-auto px-6 pb-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-between min-w-[800px] relative mt-2">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-slate-200 -z-10"></div>
              {[
                { id: 'section-order', label: 'Order Info', step: 1 },
                { id: 'section-shipment', label: 'Shipment', step: 2 },
                { id: 'section-pickup', label: 'Pickup', step: 3 },
                { id: 'section-delivery', label: 'Delivery', step: 4 },
                { id: 'section-cargo', label: 'Cargo', step: 5 },
                { id: 'section-billing', label: 'Billing', step: 6 },
                { id: 'section-review', label: 'Review', step: 7 },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center gap-2 cursor-pointer bg-white px-4" onClick={() => scrollTo(item.id)}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${item.step === 1 ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400'}`}>
                    {item.step}
                  </div>
                  <span className="text-xs font-bold text-slate-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-6 mt-8 flex flex-col lg:flex-row gap-8 items-start relative z-10">
          
          <div className="flex-1 w-full space-y-6">
            
            {/* 1. ORDER INFORMATION */}
            <div id="section-order" className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs">1</div>
                <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">Order Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Order Type <span className="text-red-500">*</span></label>
                  <div className="flex gap-3">
                    {['B2B', 'B2C'].map(type => (
                      <button key={type} type="button" onClick={() => setValue('orderType', type, {shouldValidate: true})} className={`flex-1 py-2.5 rounded-md border font-bold text-xs transition-all ${watch('orderType') === type ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-[0_0_0_1px_rgba(37,99,235,1)]' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                        {type}
                      </button>
                    ))}
                  </div>
                  {errors.orderType && <p className="text-red-500 text-xs mt-1">{errors.orderType.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Transport Mode <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    {['Air', 'Sea', 'Road', 'Courier'].map(mode => (
                      <button key={mode} type="button" onClick={() => setValue('transportMode', mode, {shouldValidate: true})} className={`flex-1 py-2.5 rounded-md border font-bold text-[10px] flex items-center justify-center gap-1 transition-all ${watch('transportMode') === mode ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-[0_0_0_1px_rgba(37,99,235,1)]' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                        {mode}
                      </button>
                    ))}
                  </div>
                  {errors.transportMode && <p className="text-red-500 text-xs mt-1">{errors.transportMode.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Operation <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    {['Import', 'Export', 'Domestic'].map(op => (
                      <button key={op} type="button" onClick={() => setValue('operation', op, {shouldValidate: true})} className={`flex-1 py-2.5 rounded-md border font-bold text-xs transition-all ${watch('operation') === op ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-[0_0_0_1px_rgba(37,99,235,1)]' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                        {op}
                      </button>
                    ))}
                  </div>
                  {errors.operation && <p className="text-red-500 text-xs mt-1">{errors.operation.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 mb-2">Customer <span className="text-red-500">*</span></label>
                  <Search className="w-4 h-4 absolute left-3 top-9 text-slate-400" />
                  <input type="text" {...register('customerName')} placeholder="Search by name, email, phone or company" className={`w-full pl-9 pr-3 py-2.5 bg-white border ${errors.customerName ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Contact Person <span className="text-red-500">*</span></label>
                  <input type="text" {...register('contactPerson')} placeholder="Enter contact person" className={`w-full px-4 py-2.5 bg-white border ${errors.contactPerson ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Mobile Number <span className="text-red-500">*</span></label>
                  <div className="flex rounded-md shadow-sm">
                    <div className="px-3 py-2.5 border border-r-0 border-slate-200 bg-slate-50 rounded-l-md flex items-center"><span className="text-sm font-medium text-slate-600">+971</span></div>
                    <input type="text" {...register('mobileNumber')} placeholder="Enter number" className={`flex-1 px-4 py-2.5 bg-white border ${errors.mobileNumber ? 'border-red-500' : 'border-slate-200'} rounded-r-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-2">Email</label>
                  <input type="email" {...register('email')} placeholder="Enter email address" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Booking Date <span className="text-red-500">*</span></label>
                  <input type="date" {...register('bookingDate')} className={`w-full px-4 py-2.5 bg-white border ${errors.bookingDate ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Job No.</label>
                  <input type="text" disabled placeholder="AUTO GENERATE" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-400 font-bold outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Reference No.</label>
                  <input type="text" {...register('referenceNo')} placeholder="Enter reference number" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow" />
                </div>
              </div>
            </div>

            {/* 2. SHIPMENT DETAILS */}
            <div id="section-shipment" className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs">2</div>
                <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">Shipment Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Shipping Date <span className="text-red-500">*</span></label>
                  <input type="date" {...register('shippingDate')} className={`w-full px-4 py-2.5 bg-white border ${errors.shippingDate ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Cargo Type <span className="text-red-500">*</span></label>
                  <select {...register('cargoType')} className={`w-full px-4 py-2.5 bg-white border ${errors.cargoType ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`}>
                    <option value="">Select cargo type</option>
                    <option value="General">General</option>
                    <option value="Hazardous">Hazardous</option>
                    <option value="Perishable">Perishable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Incoterms <span className="text-red-500">*</span></label>
                  <select {...register('incoterms')} className={`w-full px-4 py-2.5 bg-white border ${errors.incoterms ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`}>
                    <option value="">Select incoterms</option>
                    <option value="EXW">EXW - Ex Works</option>
                    <option value="FOB">FOB - Free on Board</option>
                    <option value="CIF">CIF - Cost, Insurance, Freight</option>
                    <option value="DDP">DDP - Delivered Duty Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Shipment Currency <span className="text-red-500">*</span></label>
                  <select {...register('shipmentCurrency')} className={`w-full px-4 py-2.5 bg-white border ${errors.shipmentCurrency ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`}>
                    <option value="AED">AED - UAE Dirham</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Shipment Value <span className="text-red-500">*</span></label>
                  <input type="number" {...register('shipmentValue', { valueAsNumber: true })} placeholder="Enter value" className={`w-full px-4 py-2.5 bg-white border ${errors.shipmentValue ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Commodity <span className="text-red-500">*</span></label>
                  <input type="text" {...register('commodity')} placeholder="Search commodity" className={`w-full px-4 py-2.5 bg-white border ${errors.commodity ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">HS Code</label>
                  <input type="text" {...register('hsCode')} placeholder="Auto / Manual" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Insurance</label>
                  <div className="flex gap-3">
                     <button type="button" onClick={() => setValue('insurance', false)} className={`flex-1 py-2.5 rounded-md border font-bold text-xs transition-all ${watch('insurance') === false ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-[0_0_0_1px_rgba(37,99,235,1)]' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>No</button>
                     <button type="button" onClick={() => setValue('insurance', true)} className={`flex-1 py-2.5 rounded-md border font-bold text-xs transition-all ${watch('insurance') === true ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-[0_0_0_1px_rgba(37,99,235,1)]' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>Yes</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Special Cargo</label>
                  <select {...register('specialCargo')} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow">
                    <option value="">Select type</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Temperature</label>
                  <select {...register('temperature')} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow">
                    <option value="">Select range</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Service Type</label>
                  <select {...register('serviceType')} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow">
                    <option value="">Select service</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. PICKUP (SHIPPER) */}
            <div id="section-pickup" className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs">3</div>
                  <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">Pickup (Shipper)</h2>
                </div>
                <button type="button" className="text-xs font-bold border border-slate-200 rounded-md px-4 py-2 flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm text-slate-700">
                  <FileText className="w-3 h-3" /> Use Previous Pickup
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Shipper / Company <span className="text-red-500">*</span></label>
                  <input type="text" {...register('shipperCompany')} placeholder="Enter shipper name" className={`w-full px-4 py-2.5 bg-white border ${errors.shipperCompany ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Contact Person <span className="text-red-500">*</span></label>
                  <input type="text" {...register('shipperContact')} placeholder="Enter contact person" className={`w-full px-4 py-2.5 bg-white border ${errors.shipperContact ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Country <span className="text-red-500">*</span></label>
                  <select {...register('shipperCountry')} className={`w-full px-4 py-2.5 bg-white border ${errors.shipperCountry ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`}>
                    <option value="">Select country</option>
                    <option value="UAE">United Arab Emirates</option>
                    <option value="USA">United States</option>
                    <option value="China">China</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">City <span className="text-red-500">*</span></label>
                  <input type="text" {...register('shipperCity')} placeholder="Enter city" className={`w-full px-4 py-2.5 bg-white border ${errors.shipperCity ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`} />
                </div>
                <div className="col-span-2 relative">
                  <label className="block text-xs font-bold text-slate-700 mb-2">Address <span className="text-red-500">*</span></label>
                  <input type="text" {...register('shipperAddress')} placeholder="Enter complete address" className={`w-full px-4 py-2.5 bg-white border ${errors.shipperAddress ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow pr-10`} />
                  <MapPin className="w-5 h-5 absolute right-3 top-9 text-slate-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Origin Port / Location <span className="text-red-500">*</span></label>
                  <select {...register('originPort')} className={`w-full px-4 py-2.5 bg-white border ${errors.originPort ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`}>
                    <option value="">Select origin</option>
                    <option value="Jebel Ali">Jebel Ali</option>
                    <option value="Shenzhen Port">Shenzhen Port</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">ETD (Expected Date) <span className="text-red-500">*</span></label>
                  <input type="date" {...register('etdDate')} className={`w-full px-4 py-2.5 bg-white border ${errors.etdDate ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Pickup Time</label>
                  <select {...register('pickupTime')} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow">
                    <option value="">Select time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Pickup Instruction</label>
                  <input type="text" {...register('pickupInstruction')} placeholder="Enter instruction" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow" />
                </div>
              </div>
            </div>

            {/* 4. DELIVERY (CONSIGNEE) */}
            <div id="section-delivery" className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs">4</div>
                  <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">Delivery (Consignee)</h2>
                </div>
                <button type="button" className="text-xs font-bold border border-slate-200 rounded-md px-4 py-2 flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm text-slate-700">
                  <FileText className="w-3 h-3" /> Use Previous Consignee
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Consignee / Company <span className="text-red-500">*</span></label>
                  <input type="text" {...register('consigneeCompany')} placeholder="Enter consignee name" className={`w-full px-4 py-2.5 bg-white border ${errors.consigneeCompany ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Contact Person <span className="text-red-500">*</span></label>
                  <input type="text" {...register('consigneeContact')} placeholder="Enter contact person" className={`w-full px-4 py-2.5 bg-white border ${errors.consigneeContact ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Country <span className="text-red-500">*</span></label>
                  <select {...register('consigneeCountry')} className={`w-full px-4 py-2.5 bg-white border ${errors.consigneeCountry ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`}>
                    <option value="">Select country</option>
                    <option value="UAE">United Arab Emirates</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">City <span className="text-red-500">*</span></label>
                  <input type="text" {...register('consigneeCity')} placeholder="Enter city" className={`w-full px-4 py-2.5 bg-white border ${errors.consigneeCity ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`} />
                </div>
                <div className="col-span-2 relative">
                  <label className="block text-xs font-bold text-slate-700 mb-2">Address <span className="text-red-500">*</span></label>
                  <input type="text" {...register('consigneeAddress')} placeholder="Enter complete address" className={`w-full px-4 py-2.5 bg-white border ${errors.consigneeAddress ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow pr-10`} />
                  <MapPin className="w-5 h-5 absolute right-3 top-9 text-slate-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2">Destination Port / Location <span className="text-red-500">*</span></label>
                  <select {...register('destinationPort')} className={`w-full px-4 py-2.5 bg-white border ${errors.destinationPort ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`}>
                    <option value="">Select destination</option>
                    <option value="Jebel Ali">Jebel Ali</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">ETA (Expected Date) <span className="text-red-500">*</span></label>
                  <input type="date" {...register('etaDate')} className={`w-full px-4 py-2.5 bg-white border ${errors.etaDate ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Delivery Instruction</label>
                  <input type="text" {...register('deliveryInstruction')} placeholder="Enter instruction" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow" />
                </div>
              </div>
            </div>

            {/* 5. CARGO DETAILS */}
            <div id="section-cargo" className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs">1</div>
                <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">Cargo Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">No. of Pieces <span className="text-red-500">*</span></label>
                  <input type="number" min="1" {...register('pieces')} placeholder="Enter pieces" className={`w-full px-4 py-2.5 bg-white border ${errors.pieces ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Package Type <span className="text-red-500">*</span></label>
                  <select {...register('packageType')} className={`w-full px-4 py-2.5 bg-white border ${errors.packageType ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`}>
                    <option value="">Select package</option>
                    <option value="Cartons">Cartons</option>
                    <option value="Pallets">Pallets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Gross Weight (kg) <span className="text-red-500">*</span></label>
                  <input type="number" step="0.01" {...register('grossWeight')} placeholder="Enter weight" className={`w-full px-4 py-2.5 bg-white border ${errors.grossWeight ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Volume (CBM)</label>
                  <input type="number" step="0.01" {...register('volumeCbm')} placeholder="Enter volume" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Chargeable Weight (kg)</label>
                  <input type="text" disabled value={autoChargeableWeight} placeholder="Auto calculate" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-400 font-bold outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Commodity <span className="text-red-500">*</span></label>
                  <select {...register('cargoCommodity')} className={`w-full px-4 py-2.5 bg-white border ${errors.cargoCommodity ? 'border-red-500' : 'border-slate-200'} rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow`}>
                    <option value="">Search commodity</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">HS Code</label>
                  <input type="text" {...register('cargoHsCode')} placeholder="Auto / Manual" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">DG Cargo</label>
                  <div className="flex gap-3">
                     <button type="button" onClick={() => setValue('dgCargo', false)} className={`flex-1 py-2.5 rounded-md border font-bold text-xs transition-all ${watch('dgCargo') === false ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-[0_0_0_1px_rgba(37,99,235,1)]' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>No</button>
                     <button type="button" onClick={() => setValue('dgCargo', true)} className={`flex-1 py-2.5 rounded-md border font-bold text-xs transition-all ${watch('dgCargo') === true ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-[0_0_0_1px_rgba(37,99,235,1)]' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>Yes</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Stackable</label>
                  <div className="flex gap-3">
                     <button type="button" onClick={() => setValue('stackable', true)} className={`flex-1 py-2.5 rounded-md border font-bold text-xs transition-all ${watch('stackable') === true ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-[0_0_0_1px_rgba(37,99,235,1)]' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>Yes</button>
                     <button type="button" onClick={() => setValue('stackable', false)} className={`flex-1 py-2.5 rounded-md border font-bold text-xs transition-all ${watch('stackable') === false ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-[0_0_0_1px_rgba(37,99,235,1)]' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>No</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Temperature Control</label>
                  <div className="flex gap-3">
                     <button type="button" onClick={() => setValue('temperatureControl', false)} className={`flex-1 py-2.5 rounded-md border font-bold text-xs transition-all ${watch('temperatureControl') === false ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-[0_0_0_1px_rgba(37,99,235,1)]' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>No</button>
                     <button type="button" onClick={() => setValue('temperatureControl', true)} className={`flex-1 py-2.5 rounded-md border font-bold text-xs transition-all ${watch('temperatureControl') === true ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-[0_0_0_1px_rgba(37,99,235,1)]' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>Yes</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Insurance Value</label>
                  <input type="number" {...register('insuranceValue')} placeholder="Enter value" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Remarks</label>
                  <input type="text" {...register('remarks')} placeholder="Enter instructions" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow" />
                </div>
              </div>
            </div>
            
            {/* Mandatory Note */}
            <div className="mt-4 px-2">
              <p className="text-xs text-slate-500 flex items-center gap-1 font-medium"><FileText className="w-3 h-3" /> Fields marked with <span className="text-red-500">*</span> are mandatory.</p>
            </div>
          </div>

          <div className="w-full lg:w-[340px] flex-shrink-0 space-y-6 pb-10">
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-5">
                <Search className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-[13px] text-slate-900 tracking-wider">AI ASSISTANT <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full ml-1 font-bold">BETA</span></h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Customer Verified', active: isCustomerVerified },
                  { label: 'Credit Available', active: isCreditAvailable },
                  { label: 'KYC Completed', active: isKycCompleted },
                  { label: 'No Duplicate Found', active: isNoDuplicate },
                  { label: 'Address Verified', active: isAddressVerified }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`${item.active ? 'bg-green-500' : 'bg-slate-200'} text-white rounded-full p-0.5 transition-colors`}><Check className="w-4 h-4" /></div>
                    <span className={`text-sm font-semibold transition-colors ${item.active ? 'text-slate-700' : 'text-slate-500'}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-5">
                <Search className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-[13px] text-slate-900 tracking-wider">AI SUGGESTIONS</h3>
              </div>
              <div className="space-y-4 text-[13px]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold">Best Route</span>
                  <span className="font-bold text-slate-900">{bestRoute}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold">Estimated Transit Time</span>
                  <span className="font-bold text-slate-900">{transitTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold">Freight Estimate</span>
                  <span className="font-bold text-slate-900">{freightEstimate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold">Margin (Est.)</span>
                  <span className="font-bold text-slate-900">{marginEst}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-5">
                <Calculator className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-[13px] text-slate-900 tracking-wider">SMART INPUT</h3>
              </div>
              <div className="space-y-4">
                <button type="button" onClick={() => alert('Uploading PO...')} className="w-full flex items-center gap-4 text-left group">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors"><FileText className="w-5 h-5" /></div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">Upload Purchase Order</div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">Extract data from PO</div>
                  </div>
                </button>
                <button type="button" onClick={() => alert('Fetching previous records...')} className="w-full flex items-center gap-4 text-left group">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition-colors"><RotateCcw className="w-5 h-5" /></div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">Repeat Previous Booking</div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">Use last booking details</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Document Upload */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-5">
                <UploadCloud className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-[13px] text-slate-900 tracking-wider">DOCUMENT UPLOAD</h3>
              </div>
              
              <div 
                className="border border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center mb-5 bg-white transition-colors hover:border-blue-400 cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files) { setUploadedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]); } }}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="w-8 h-8 text-blue-500 mb-3" />
                <p className="text-[13px] font-bold text-slate-800">Drag & Drop files here</p>
                <p className="text-[11px] text-slate-400 my-1 font-medium">or</p>
                
                <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                
                <button type="button" className="px-5 py-1.5 border border-slate-200 rounded-md text-[12px] font-bold text-slate-800 bg-white shadow-sm mt-1 mb-2 hover:bg-slate-50 transition-colors pointer-events-none">
                  Browse Files
                </button>
                <p className="text-[10px] text-slate-400 font-medium">Supported: PDF, JPG, PNG (Max. 5MB)</p>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mb-4 space-y-2">
                  <p className="text-xs font-bold text-slate-700">Uploaded Files</p>
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded-md border border-slate-100 text-xs shadow-sm">
                      <span className="truncate flex-1 font-medium text-slate-700 pr-2">{file.name}</span>
                      <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="text-red-500 hover:text-red-700 p-1 bg-white rounded shadow-sm border border-slate-200"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <p className="text-[13px] font-bold text-slate-900 mb-3">Required Documents</p>
                <ul className="space-y-3 text-[13px]">
                  <li className="flex justify-between items-center"><span className="flex items-center gap-2 text-slate-600 font-semibold"><FileText className="w-4 h-4 text-slate-400"/> Commercial Invoice</span> <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-full">Pending</span></li>
                  <li className="flex justify-between items-center"><span className="flex items-center gap-2 text-slate-600 font-semibold"><FileText className="w-4 h-4 text-slate-400"/> Packing List</span> <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-full">Pending</span></li>
                  <li className="flex justify-between items-center"><span className="flex items-center gap-2 text-slate-600 font-semibold"><FileText className="w-4 h-4 text-slate-400"/> Purchase Order</span> <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/50">Optional</span></li>
                  <li className="flex justify-between items-center"><span className="flex items-center gap-2 text-slate-600 font-semibold"><FileText className="w-4 h-4 text-slate-400"/> Passport / ID</span> <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/50">Optional</span></li>
                  <li className="flex justify-between items-center"><span className="flex items-center gap-2 text-slate-600 font-semibold"><FileText className="w-4 h-4 text-slate-400"/> Trade Licence</span> <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/50">Optional</span></li>
                </ul>
                <button type="button" className="w-full text-center text-xs text-blue-600 font-bold mt-5 hover:underline">View all documents</button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
               <div className="flex items-center gap-2 mb-5">
                <Clock className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-[13px] text-slate-900 tracking-wider">QUICK ACTIONS</h3>
              </div>
              <div className="space-y-4">
                <button type="button" onClick={() => alert('Opening Freight Calculator...')} className="w-full flex items-center gap-4 text-left group">
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-slate-600 border border-slate-100 shadow-sm group-hover:border-blue-200 transition-colors"><Calculator className="w-5 h-5 text-slate-500" /></div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">Freight Calculator</div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">Get instant rate estimate</div>
                  </div>
                </button>
                <button type="button" onClick={() => alert('Checking available services...')} className="w-full flex items-center gap-4 text-left group">
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-slate-600 border border-slate-100 shadow-sm group-hover:border-blue-200 transition-colors"><Search className="w-5 h-5 text-slate-500" /></div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">Check Services</div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">Check available services</div>
                  </div>
                </button>
                <button type="button" onClick={() => alert('Estimating transit times...')} className="w-full flex items-center gap-4 text-left group">
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-slate-600 border border-slate-100 shadow-sm group-hover:border-blue-200 transition-colors"><Clock className="w-5 h-5 text-slate-500" /></div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">Check Transit Time</div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">Estimate delivery time</div>
                  </div>
                </button>
                <button type="button" onClick={() => alert('Opening Currency Converter...')} className="w-full flex items-center gap-4 text-left group">
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-slate-600 border border-slate-100 shadow-sm group-hover:border-blue-200 transition-colors"><DollarSign className="w-5 h-5 text-slate-500" /></div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">Currency Converter</div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">Live currency conversion</div>
                  </div>
                </button>
              </div>
            </div>

          </div>
        </div>
        
      </form>
    </FormProvider>
  );
}
