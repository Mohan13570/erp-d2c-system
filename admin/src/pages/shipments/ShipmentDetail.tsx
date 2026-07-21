import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { 
  Package, Search, Bell, Download, Printer, RefreshCw, 
  ChevronRight, MapPin, Truck, CheckCircle, Clock, 
  FileText, Activity, User, Building, Phone, Mail, 
  Globe, DollarSign, Calendar, Navigation, Layers
} from 'lucide-react';

const STAGES = [
  "Shipment Created", "Pickup Scheduled", "Picked Up", "Warehouse", 
  "Dispatched", "In Transit", "Destination Warehouse", "Out For Delivery", 
  "Delivered", "Completed"
];

// Helper Component for Data Fields
const DataField = ({ label, value, className = "" }: { label: string, value: any, className?: string }) => (
  <div className={`flex flex-col ${className}`}>
    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</span>
    <span className="text-sm font-bold text-slate-800">{value || '--'}</span>
  </div>
);

// Section Header Component
const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
  <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
      <Icon className="w-5 h-5" />
    </div>
    <h2 className="text-lg font-black text-slate-900 tracking-tight">{title}</h2>
  </div>
);

export default function ShipmentDetail() {
  const { id } = useParams();

  const { data: shipment, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['shipment', id],
    queryFn: async () => {
      // Using a fallback for missing ID so it renders for UI demo if accessed without valid ID
      const targetId = id || 'dummy';
      const res = await fetch(`/api/v1/shipments/${targetId}`);
      if (!res.ok) {
         // Return mock data if not found so the UI can be previewed
         return {
            trackingNumber: "TRK-90218-444",
            bookingNumber: "BKG-2026-X88",
            referenceNumber: "REF-00192",
            status: "In Transit",
            priority: "High",
            freightType: "FCL",
            transportMode: "Ocean",
            serviceType: "Door to Door",
            operation: "Export",
            branch: "New York HQ",
            businessUnit: "Logistics",
            createdDate: new Date().toISOString(),
            expectedDelivery: new Date(Date.now() + 86400000 * 5).toISOString(),
            currentLocation: "Mid-Atlantic Ocean",
            totalPackages: 400,
            totalPieces: 400,
            grossWeight: 4500.5,
            netWeight: 4200.0,
            chargeableWeight: 4500.5,
            cbm: 12.5,
            cft: 441.4,
            customer: {
              legalName: "Acme Corp Ltd",
              customerCode: "CUST-ACME-01",
              accountManager: "Jane Doe",
              email: "logistics@acme.com",
              phone: "+1 555 0192"
            }
         };
      }
      return res.json();
    }
  });

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin text-blue-600"><RefreshCw className="w-8 h-8"/></div>
    </div>;
  }

  // Determine active step index
  const currentStageIndex = Math.max(0, STAGES.findIndex(s => s.toLowerCase() === shipment?.status?.toLowerCase()));

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      {/* 1. STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 shrink-0 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Shipment Details</h1>
          </div>
          <div className="h-6 w-px bg-slate-200 mx-2"></div>
          <div>
            <span className="text-2xl font-black text-blue-700 tracking-tighter">{shipment?.trackingNumber}</span>
            <span className="ml-3 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase tracking-widest">{shipment?.status}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          <button className="flex items-center gap-2 px-3 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold text-sm transition-colors shadow-sm">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold text-sm transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => refetch()} className="flex items-center gap-2 px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-bold text-sm transition-colors shadow-sm">
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </header>

      {/* 2. STICKY PROGRESS BAR */}
      <div className="sticky top-16 z-30 bg-white border-b border-slate-200 shrink-0 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between relative">
            {/* Connecting Line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-10 rounded-full"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 -z-10 rounded-full transition-all duration-500" 
              style={{ width: `\${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
            ></div>

            {STAGES.map((stage, idx) => {
              const isActive = idx === currentStageIndex;
              const isPast = idx < currentStageIndex;
              
              return (
                <div key={stage} className="flex flex-col items-center gap-2 group">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors 
                    \${isActive ? 'border-blue-500 bg-white shadow-[0_0_0_4px_rgba(59,130,246,0.2)]' : 
                      isPast ? 'border-blue-500 bg-blue-500' : 'border-slate-200 bg-white'}`}
                  >
                    {isPast && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    {isActive && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider text-center max-w-[80px] leading-tight
                    \${isActive ? 'text-blue-700' : isPast ? 'text-slate-700' : 'text-slate-400'}`}
                  >
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* 3. MAIN CONTENT (VERTICALLY SCROLLABLE - NO TABS) */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-[#F8FAFC]">
          <div className="max-w-4xl mx-auto space-y-6 pb-20">

            {/* SECTION 1: SHIPMENT INFORMATION */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <SectionHeader title="Shipment Information" icon={Package} />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8 gap-x-6">
                <DataField label="Shipment Number" value={shipment?.trackingNumber} className="md:col-span-1" />
                <DataField label="Booking Number" value={shipment?.bookingNumber} className="md:col-span-1" />
                <DataField label="Reference Number" value={shipment?.referenceNumber} className="md:col-span-2" />
                
                <DataField label="Shipment Type" value={shipment?.freightType} />
                <DataField label="Transport Mode" value={shipment?.transportMode} />
                <DataField label="Service Type" value={shipment?.serviceType} />
                <DataField label="Operation" value={shipment?.operation} />
                
                <DataField label="Shipment Status" value={shipment?.status} />
                <DataField label="Priority" value={shipment?.priority} />
                <DataField label="Created Date" value={shipment?.createdDate ? new Date(shipment.createdDate).toLocaleDateString() : ''} />
                <DataField label="Created By" value={shipment?.createdBy || 'System Admin'} />
                
                <DataField label="Branch" value={shipment?.branch} />
                <DataField label="Business Unit" value={shipment?.businessUnit} />
                <DataField label="Expected Delivery" value={shipment?.expectedDelivery ? new Date(shipment.expectedDelivery).toLocaleDateString() : ''} />
                <DataField label="Current Location" value={shipment?.currentLocation} />
              </div>
            </section>

            {/* SECTION 2: CUSTOMER INFORMATION */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <SectionHeader title="Customer Information" icon={Building} />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8 gap-x-6">
                <DataField label="Customer Code" value={shipment?.customer?.customerCode} />
                <DataField label="Customer Name" value={shipment?.customer?.legalName} className="md:col-span-2" />
                <DataField label="Customer Category" value="Enterprise" />
                
                <DataField label="Account Manager" value={shipment?.customer?.accountManager} />
                <DataField label="Customer Contact" value={shipment?.customer?.contactName || shipment?.customer?.legalName} />
                <DataField label="Email" value={shipment?.customer?.email} />
                <DataField label="Phone" value={shipment?.customer?.phone} />
                
                <DataField label="GST / Tax ID" value={shipment?.customer?.taxId || 'Pending'} />
                <DataField label="Credit Terms" value="Net 30 Days" />
                <DataField label="Payment Terms" value="Bank Transfer" className="md:col-span-2" />
              </div>
            </section>

            {/* SECTION 3: SHIPPER */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 border-l-4 border-l-indigo-500">
              <SectionHeader title="Shipper Details" icon={User} />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8 gap-x-6">
                <DataField label="Company" value="Global Exports Ltd" className="md:col-span-2" />
                <DataField label="Contact Person" value="Michael Chang" />
                <DataField label="Department" value="Logistics" />
                
                <DataField label="Email" value="michael@globalexports.com" className="md:col-span-2" />
                <DataField label="Phone" value="+86 21 555 0101" />
                <DataField label="Mobile" value="+86 139 555 0101" />
                
                <DataField label="Country" value="China" />
                <DataField label="City" value="Shanghai" />
                <DataField label="Address" value="45 Export Zone Block C, Pudong" className="md:col-span-2" />
                
                <DataField label="Pickup Location" value="Dock 4A" className="md:col-span-2" />
                <DataField label="Pickup Instructions" value="Call 1hr before arrival." className="md:col-span-2" />
              </div>
            </section>

            {/* SECTION 4: CONSIGNEE */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 border-l-4 border-l-emerald-500">
              <SectionHeader title="Consignee Details" icon={User} />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8 gap-x-6">
                <DataField label="Company" value={shipment?.customer?.legalName} className="md:col-span-2" />
                <DataField label="Contact Person" value="Sarah Jenkins" />
                <DataField label="Department" value="Receiving" />
                
                <DataField label="Email" value="receiving@acme.com" className="md:col-span-2" />
                <DataField label="Phone" value="+1 212 555 0199" />
                <DataField label="Mobile" value="+1 917 555 0199" />
                
                <DataField label="Country" value="USA" />
                <DataField label="City" value="New York" />
                <DataField label="Address" value="100 Acme Way, NY 10001" className="md:col-span-2" />
                
                <DataField label="Delivery Location" value="Main Warehouse Door 2" className="md:col-span-2" />
                <DataField label="Delivery Instructions" value="Deliver between 9 AM and 4 PM only." className="md:col-span-2" />
              </div>
            </section>

            {/* SECTION 5: NOTIFY PARTY */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <SectionHeader title="Notify Party" icon={Bell} />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8 gap-x-6">
                <DataField label="Company" value="Acme Customs Brokerage" className="md:col-span-2" />
                <DataField label="Contact Person" value="David Miller" />
                <DataField label="Notification Method" value="Email & SMS" />
                
                <DataField label="Email" value="customs@acmebrokerage.com" className="md:col-span-2" />
                <DataField label="Phone" value="+1 212 555 9000" className="md:col-span-2" />
              </div>
            </section>

            {/* SECTION 6: BILL TO PARTY */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <SectionHeader title="Bill To Party" icon={DollarSign} />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8 gap-x-6">
                <DataField label="Company" value={shipment?.customer?.legalName} className="md:col-span-2" />
                <DataField label="Finance Contact" value="Accounting Dept" />
                <DataField label="Currency" value="USD" />
                
                <DataField label="Accounts Email" value="ap@acme.com" className="md:col-span-2" />
                <DataField label="Payment Terms" value="Net 30" />
                <DataField label="Billing Address" value="100 Acme Way, Finance Office" />
              </div>
            </section>

            {/* SECTION 7: SHIPMENT SUMMARY */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <SectionHeader title="Shipment Cargo Summary" icon={Layers} />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8 gap-x-6">
                <DataField label="Total Packages" value={shipment?.totalPackages} />
                <DataField label="Total Pieces" value={shipment?.totalPieces} />
                <DataField label="Gross Weight (KG)" value={shipment?.grossWeight} />
                <DataField label="Net Weight (KG)" value={shipment?.netWeight} />
                
                <DataField label="Chargeable Wt (KG)" value={shipment?.chargeableWeight} />
                <DataField label="CBM" value={shipment?.cbm} />
                <DataField label="CFT" value={shipment?.cft} />
                <DataField label="Volume" value={shipment?.totalVolume} />
                
                <DataField label="Declared Value" value={shipment?.declaredValue ? `$\${shipment.declaredValue}` : '--'} />
                <DataField label="Insurance Required" value={shipment?.insuranceRequired ? "Yes" : "No"} />
                <DataField label="Special Cargo" value={shipment?.specialCargo ? "Yes" : "No"} />
                <DataField label="Temperature Controlled" value={shipment?.tempControlled ? "Yes" : "No"} />
              </div>
            </section>

            {/* SECTION 8: BOOKING SUMMARY */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <SectionHeader title="Booking Summary" icon={Navigation} />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8 gap-x-6">
                <DataField label="Origin Port" value="CNSHA (Shanghai)" className="md:col-span-2" />
                <DataField label="Destination Port" value="USNYC (New York)" className="md:col-span-2" />
                
                <DataField label="Route" value="Direct" />
                <DataField label="Carrier" value="Maersk Line" />
                <DataField label="Incoterms" value="FOB" />
                <DataField label="Shipping Date" value={new Date().toLocaleDateString()} />
                
                <DataField label="Estimated Arrival" value={shipment?.expectedDelivery ? new Date(shipment.expectedDelivery).toLocaleDateString() : ''} className="md:col-span-2" />
                <DataField label="Estimated Delivery" value={shipment?.expectedDelivery ? new Date(shipment.expectedDelivery).toLocaleDateString() : ''} className="md:col-span-2" />
              </div>
            </section>

            {/* SECTION 9: INTERNAL INFORMATION */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <SectionHeader title="Internal Information & Assignments" icon={Activity} />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8 gap-x-6">
                <DataField label="Sales Executive" value="John Smith" />
                <DataField label="Operations Executive" value={shipment?.operationsExecutive || 'Unassigned'} />
                <DataField label="Approver" value={shipment?.approver || 'Manager'} />
                <DataField label="Current Workflow Stage" value={shipment?.currentWorkflowStage || shipment?.status} />
                
                <DataField label="Assigned Warehouse" value="WH-NY-01" />
                <DataField label="Container Number" value="MSKU1234567" />
                <DataField label="Assigned Vehicle" value={shipment?.assignedVehicle || 'Pending Dispatch'} />
                <DataField label="Assigned Driver" value={shipment?.assignedDriver || 'Pending Dispatch'} />
              </div>
            </section>

            {/* SECTION 10: NOTES */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <SectionHeader title="Notes & Remarks" icon={FileText} />
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Customer Notes</h4>
                  <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-600 border border-slate-100">Please ensure delivery is made before 4 PM. Call Sarah upon arrival.</div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Operations Notes</h4>
                  <div className="p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800 border border-yellow-100">Priority clearance required at USNYC. Docs handed over to broker.</div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Internal Remarks</h4>
                  <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-600 border border-slate-100">Margin approved by JS.</div>
                </div>
              </div>
            </section>

          </div>
        </main>

        {/* 4. STICKY RIGHT SIDEBAR */}
        <aside className="w-80 bg-white border-l border-slate-200 shrink-0 overflow-y-auto shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)]">
          <div className="p-6">
            
            {/* Status Card */}
            <div className="bg-blue-600 rounded-2xl p-5 text-white mb-6 shadow-md shadow-blue-200">
              <h3 className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Current Status</h3>
              <div className="text-2xl font-black mb-3">{shipment?.status}</div>
              <div className="flex items-center gap-2 text-sm text-blue-50">
                <MapPin className="w-4 h-4" /> {shipment?.currentLocation || 'In Transit'}
              </div>
            </div>

            <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs">Quick Actions</h3>
            <div className="space-y-2 mb-8">
              <button className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-3">
                <Truck className="w-4 h-4 text-slate-400" /> Assign Driver & Vehicle
              </button>
              <button className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-3">
                <Package className="w-4 h-4 text-slate-400" /> Assign Warehouse
              </button>
              <button className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-400" /> Generate Documents
              </button>
              <button className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-3">
                <Printer className="w-4 h-4 text-slate-400" /> Print Shipment
              </button>
              <div className="grid grid-cols-2 gap-2 mt-4 pt-2">
                <button className="px-3 py-2 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors text-center">Dispatch</button>
                <button className="px-3 py-2 rounded-lg text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 transition-colors text-center">Hold</button>
              </div>
            </div>

            <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs">Shipment Health</h3>
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 mb-6">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-2">
                <CheckCircle className="w-4 h-4" /> On Schedule
              </div>
              <p className="text-xs text-emerald-600 font-medium leading-relaxed">This shipment is currently trending on time. No predicted delays at origin port.</p>
            </div>

            <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs">AI Suggestions</h3>
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <p className="text-xs text-indigo-700 font-medium leading-relaxed mb-3">Weather alert at destination port (New York) for Friday. Recommend notifying consignee of potential 1-day delivery delay.</p>
              <button className="text-xs font-bold text-white bg-indigo-600 px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors">Draft Notification</button>
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
}
