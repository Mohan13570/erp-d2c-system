import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, Save, RefreshCw, MapPin, Phone, Briefcase, 
  Settings, ShieldAlert, Clock, FileText, StickyNote, Activity,
  CheckCircle2, Plus, Copy, PowerOff, Printer, FileUp, Trash2
} from 'lucide-react';

const MOCK_WAREHOUSE = {
  id: 'WH-8812',
  code: 'LHR-MAIN-01',
  name: 'London Heathrow Central Hub',
  type: 'Distribution Center',
  category: 'Tier 1',
  status: 'ACTIVE',
  description: 'Primary UK distribution center handling all EU cross-dock operations.',
  capacity: 250000, capacityUnit: 'PALLETS',
  area: 500000, areaUnit: 'SQ_FT',
  maxWeightCapacity: 1000000, storageCapacity: 200000,
  
  location: {
    country: 'United Kingdom', state: 'Greater London', district: 'Hillingdon', city: 'London',
    area: 'Heathrow', street: '144 Cargo Way', building: 'Block C', floor: 'Ground',
    postalCode: 'TW6 2GW', latitude: 51.4700, longitude: -0.4543, mapsLink: 'https://maps.google.com/...'
  },
  
  contact: {
    managerName: 'Eleanor Vance', operationsManager: 'David Chen', supervisor: 'Michael Rossi',
    phone: '+44 20 7946 0958', mobile: '+44 7700 900077', email: 'eleanor.v@acme-logistics.com',
    emergencyContact: 'Security Desk (24/7)', emergencyPhone: '+44 20 7946 0999'
  },
  
  business: {
    branch: 'UK HQ', businessUnit: 'European Logistics', costCenter: 'CC-UK-8812',
    currency: 'GBP', timeZone: 'GMT (UTC+0)', workingDays: 'Mon-Sun', workingHours: '24/7', holidayCalendar: 'UK Standard'
  },
  
  services: {
    inbound: true, outbound: true, crossDock: true, coldStorage: true, dryStorage: true,
    hazardousStorage: false, bondedWarehouse: true, returnsProcessing: true, packaging: true, labeling: true,
    qualityInspection: true, containerYard: false
  },
  
  safety: {
    fireSafety: true, cctv: true, security: true, accessControl: true, tempMonitoring: true,
    humidityMonitoring: false, emergencyExit: true, safetyCert: 'CERT-UK-99', insuranceId: 'INS-LLOYDS-44'
  },
  
  hours: {
    monday: { open: true, start: '00:00', end: '23:59' },
    tuesday: { open: true, start: '00:00', end: '23:59' },
    wednesday: { open: true, start: '00:00', end: '23:59' },
    thursday: { open: true, start: '00:00', end: '23:59' },
    friday: { open: true, start: '00:00', end: '23:59' },
    saturday: { open: true, start: '00:00', end: '23:59' },
    sunday: { open: true, start: '00:00', end: '23:59' }
  },

  documents: [
    { id: 'DOC-1', type: 'LICENSE', name: 'Operating_License_2026.pdf', date: 'Jan 15, 2026' },
    { id: 'DOC-2', type: 'FIRE_SAFETY', name: 'Fire_Clearance_Cert.pdf', date: 'Feb 10, 2026' }
  ]
};

export default function WarehouseMaster() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(MOCK_WAREHOUSE);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Building2 className="w-7 h-7 text-indigo-600 bg-indigo-100 p-1 rounded-lg" /> 
            Warehouse Master Profile
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm font-bold text-slate-500">
            <span>Code: <span className="text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">{data.code}</span></span>
            <span>Name: <span className="text-slate-800">{data.name}</span></span>
            <span className={\`px-2 py-0.5 rounded uppercase tracking-wider text-xs \${data.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}\`}>
              {data.status}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" /> 
            {isSaving ? 'Saving Master...' : 'Save Warehouse'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* MAIN SCROLLABLE CONTENT (SECTIONS 1-9) */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth pb-32">
          
          {/* SECTION 1: WAREHOUSE INFORMATION */}
          <section id="information" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Building2 className="w-5 h-5 text-indigo-600"/> Warehouse Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Warehouse Code</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" defaultValue={data.code} /></div>
              <div className="lg:col-span-2"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Warehouse Name</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" defaultValue={data.name} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Status</label><select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"><option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option></select></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Warehouse Type</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" defaultValue={data.type} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Category</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" defaultValue={data.category} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Capacity</label><div className="flex gap-2"><input type="number" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-900 outline-none" defaultValue={data.capacity} /><select className="w-24 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold"><option>PALLETS</option><option>SQ_FT</option></select></div></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Area</label><div className="flex gap-2"><input type="number" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-900 outline-none" defaultValue={data.area} /><select className="w-24 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold"><option>SQ_FT</option><option>SQ_M</option></select></div></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Max Weight Cap.</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" defaultValue={data.maxWeightCapacity} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Storage Capacity</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" defaultValue={data.storageCapacity} /></div>
              <div className="md:col-span-2 lg:col-span-4"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Description</label><textarea rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" defaultValue={data.description}></textarea></div>
            </div>
          </section>

          {/* SECTION 2: LOCATION */}
          <section id="location" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <MapPin className="w-5 h-5 text-emerald-600"/> Location Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Country</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.location.country} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">State / Province</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.location.state} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">City</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.location.city} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">District</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.location.district} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Area</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.location.area} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Postal Code</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.location.postalCode} /></div>
              <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Street Address</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.location.street} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Building</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.location.building} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Floor / Unit</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.location.floor} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Latitude</label><input type="number" step="0.0001" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.location.latitude} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Longitude</label><input type="number" step="0.0001" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold" defaultValue={data.location.longitude} /></div>
              <div className="md:col-span-3"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Google Maps Link</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-blue-600 font-bold" defaultValue={data.location.mapsLink} /></div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SECTION 3: CONTACT INFORMATION */}
            <section id="contact" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Phone className="w-5 h-5 text-blue-600"/> Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Facility Manager</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold" defaultValue={data.contact.managerName} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Operations Manager</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold" defaultValue={data.contact.operationsManager} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Supervisor</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold" defaultValue={data.contact.supervisor} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Office Phone</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold" defaultValue={data.contact.phone} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Mobile</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold" defaultValue={data.contact.mobile} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Email</label><input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold" defaultValue={data.contact.email} /></div>
                <div className="md:col-span-2 pt-4 border-t border-slate-100"><label className="block text-xs font-black text-rose-600 uppercase tracking-widest mb-1">Emergency Contact Person</label><input type="text" className="w-full bg-rose-50 border border-rose-200 rounded-lg p-2 text-sm font-bold text-rose-900" defaultValue={data.contact.emergencyContact} /></div>
                <div className="md:col-span-2"><label className="block text-xs font-black text-rose-600 uppercase tracking-widest mb-1">Emergency Phone</label><input type="text" className="w-full bg-rose-50 border border-rose-200 rounded-lg p-2 text-sm font-bold text-rose-900" defaultValue={data.contact.emergencyPhone} /></div>
              </div>
            </section>

            {/* SECTION 4: BUSINESS INFORMATION */}
            <section id="business" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Briefcase className="w-5 h-5 text-amber-600"/> Business Architecture
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Branch</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold" defaultValue={data.business.branch} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Business Unit</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold" defaultValue={data.business.businessUnit} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Cost Center Code</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold" defaultValue={data.business.costCenter} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Primary Currency</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold" defaultValue={data.business.currency} /></div>
                <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Time Zone</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold" defaultValue={data.business.timeZone} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Standard Working Days</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold" defaultValue={data.business.workingDays} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Holiday Calendar Ref</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold" defaultValue={data.business.holidayCalendar} /></div>
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SECTION 5: WAREHOUSE SERVICES */}
            <section id="services" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Settings className="w-5 h-5 text-indigo-600"/> Services & Capabilities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                {Object.entries(data.services).map(([key, val]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-lg">
                    <input type="checkbox" defaultChecked={val} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                    <span className="text-sm font-bold text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* SECTION 6: SAFETY */}
            <section id="safety" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <ShieldAlert className="w-5 h-5 text-emerald-600"/> Safety & Compliance
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 mb-6">
                {Object.entries(data.safety).filter(([key]) => typeof data.safety[key as keyof typeof data.safety] === 'boolean').map(([key, val]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-lg">
                    <input type="checkbox" defaultChecked={val as boolean} className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" />
                    <span className="text-sm font-bold text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </label>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Safety Certificate ID</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold" defaultValue={data.safety.safetyCert} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Insurance Policy ID</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold" defaultValue={data.safety.insuranceId} /></div>
              </div>
            </section>
          </div>

          {/* SECTION 7: OPERATING HOURS */}
          <section id="hours" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Clock className="w-5 h-5 text-cyan-600"/> Operating Hours
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                <div key={day} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked={data.hours[day as keyof typeof data.hours].open} className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500" />
                    <span className="text-sm font-black text-slate-900 capitalize">{day}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input type="time" defaultValue={data.hours[day as keyof typeof data.hours].start} className="flex-1 bg-white border border-slate-200 rounded p-1.5 text-xs font-bold" />
                    <span className="text-slate-400 font-bold">-</span>
                    <input type="time" defaultValue={data.hours[day as keyof typeof data.hours].end} className="flex-1 bg-white border border-slate-200 rounded p-1.5 text-xs font-bold" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 8: DOCUMENTS */}
          <section id="documents" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-600"/> Compliance Documents
              </h2>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                <FileUp className="w-4 h-4" /> Upload New Document
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">{doc.name}</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">{doc.type.replace(/_/g, ' ')} • Uploaded {doc.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><FileUp className="w-4 h-4"/></button>
                    <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 9: NOTES */}
          <section id="notes" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <StickyNote className="w-5 h-5 text-amber-500"/> Internal Warehouse Notes
            </h2>
            <textarea rows={4} className="w-full bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm font-medium text-amber-900 focus:ring-2 focus:ring-amber-500 outline-none placeholder:text-amber-300" placeholder="Type internal operations notes here..."></textarea>
          </section>

        </div>

        {/* SECTION 10: STICKY RIGHT SIDEBAR */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 sticky top-0 overflow-y-auto">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-100 transition-colors">
                <Plus className="w-4 h-4"/> Create New Warehouse
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors">
                <Copy className="w-4 h-4"/> Duplicate Profile
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors">
                <Printer className="w-4 h-4"/> Print Master Profile
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-rose-50 text-rose-700 font-bold text-sm rounded-xl hover:bg-rose-100 transition-colors">
                <PowerOff className="w-4 h-4"/> Deactivate Facility
              </button>
            </div>
          </div>
          
          <div className="p-6 flex-1">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500"/> Live Operations Pulse
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Today's Inbound</p>
                <p className="text-2xl font-black text-slate-900">45 Trucks</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Current Storage Usage</p>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-2xl font-black text-slate-900">80%</p>
                  <p className="text-sm font-bold text-slate-500">200k / 250k</p>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 text-xs font-bold flex gap-2 items-start mt-4">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <p>Fire Safety & Insurance certificates are up to date and valid.</p>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
