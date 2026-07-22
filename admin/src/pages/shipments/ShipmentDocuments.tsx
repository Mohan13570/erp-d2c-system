import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FileText, ShieldCheck, AlertCircle, Upload, Eye, CheckCircle, XCircle, Trash2, 
  RefreshCcw, FileSignature, Box, Map, Scale, Building2, Zap, Save
} from 'lucide-react';

const MOCK_DOCS = {
  commercial: [
    { id: '1', name: 'Commercial Invoice', status: 'APPROVED', uploadedAt: '2026-07-20T10:00:00Z', size: '245 KB' },
    { id: '2', name: 'Packing List', status: 'PENDING_REVIEW', uploadedAt: '2026-07-21T10:00:00Z', size: '120 KB' }
  ],
  transport: [
    { id: '3', name: 'Master Bill Of Lading', status: 'DRAFT', uploadedAt: '2026-07-22T08:00:00Z', size: '1.2 MB' }
  ],
  customs: [
    { id: '4', name: 'Certificate Of Origin', status: 'REJECTED', uploadedAt: '2026-07-19T08:00:00Z', size: '400 KB', remarks: 'Missing official stamp' }
  ],
  insurance: [],
  warehouse: [],
  proof: []
};

const MOCK_COMPLIANCE = [
  { type: 'Import Compliance', status: 'COMPLIANT' },
  { type: 'Export Compliance', status: 'PENDING_REVIEW' },
  { type: 'Dangerous Goods (DG)', status: 'NON_COMPLIANT' },
  { type: 'Tax & Duties', status: 'COMPLIANT' },
];

export default function ShipmentDocuments() {
  const { id } = useParams();
  const trackingNumber = id || 'TRK-90218-444';

  const [documents, setDocuments] = useState(MOCK_DOCS);
  const [compliance, setCompliance] = useState(MOCK_COMPLIANCE);

  const DocumentRow = ({ doc }: { doc: any }) => (
    <div className="flex items-center justify-between p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-slate-500" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900">{doc.name}</h4>
          <p className="text-xs font-medium text-slate-500">{doc.size} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={\`text-xs font-bold px-2.5 py-1 rounded-md \${
          doc.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
          doc.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
          doc.status === 'PENDING_REVIEW' ? 'bg-amber-100 text-amber-700' :
          'bg-slate-100 text-slate-700'
        }\`}>
          {doc.status}
        </span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
          <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"><CheckCircle className="w-4 h-4" /></button>
          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <FileSignature className="w-6 h-6 text-indigo-600" /> Documents & Compliance
          </h1>
          <div className="flex items-center gap-4 mt-1 text-sm font-bold text-slate-500">
            <span>Shipment: <span className="text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">{trackingNumber}</span></span>
            <span>Booking: BKG-77123</span>
            <span>Customer: Acme Global</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
            <RefreshCcw className="w-4 h-4" /> Refresh
          </button>
          <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
            <Zap className="w-4 h-4" /> Generate Auto-Docs
          </button>
          <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* MAIN SCROLLABLE CONTENT (SECTIONS 1-11) */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
          
          {/* SECTION 1: SUMMARY */}
          <section id="summary" className="grid grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Documents</p>
              <h3 className="text-3xl font-black text-slate-900">14</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Pending Approval</p>
              <h3 className="text-3xl font-black text-amber-600">3</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Approved Docs</p>
              <h3 className="text-3xl font-black text-emerald-600">10</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-red-500">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Rejected Docs</p>
              <h3 className="text-3xl font-black text-red-600">1</h3>
            </div>
          </section>

          {/* SECTION 2: COMMERCIAL */}
          <section id="commercial" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2"><Building2 className="w-5 h-5 text-blue-600"/> Commercial Documents</h2>
              <button className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline"><Upload className="w-4 h-4"/> Upload</button>
            </div>
            <div className="p-2">
              {documents.commercial.map(doc => <DocumentRow key={doc.id} doc={doc} />)}
            </div>
          </section>

          {/* SECTION 3: TRANSPORT */}
          <section id="transport" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2"><Map className="w-5 h-5 text-indigo-600"/> Transport Documents</h2>
              <button className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline"><Upload className="w-4 h-4"/> Upload</button>
            </div>
            <div className="p-2">
              {documents.transport.map(doc => <DocumentRow key={doc.id} doc={doc} />)}
            </div>
          </section>

          {/* SECTION 4: CUSTOMS */}
          <section id="customs" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2"><Scale className="w-5 h-5 text-emerald-600"/> Customs Documents</h2>
              <button className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline"><Upload className="w-4 h-4"/> Upload</button>
            </div>
            <div className="p-2">
              {documents.customs.map(doc => <DocumentRow key={doc.id} doc={doc} />)}
              {documents.customs.length === 0 && <p className="p-6 text-center text-sm font-bold text-slate-400">No customs documents uploaded yet.</p>}
            </div>
          </section>

          {/* SECTION 10 & 11: COMPLIANCE & WORKFLOW */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200">
            <section id="compliance" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6"><ShieldCheck className="w-5 h-5 text-indigo-600"/> Compliance Matrix</h2>
              <div className="space-y-4">
                {compliance.map((c, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-sm text-slate-700">{c.type}</span>
                    <span className={\`text-xs font-bold px-2 py-1 rounded \${c.status === 'COMPLIANT' ? 'bg-emerald-100 text-emerald-700' : c.status === 'NON_COMPLIANT' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}\`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
            
            <section id="validation" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6"><AlertCircle className="w-5 h-5 text-red-500"/> Document Validation</h2>
              <div className="space-y-3">
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm font-bold flex gap-3 items-start">
                  <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>Missing mandatory document: <strong>Commercial Invoice</strong> requires approval.</p>
                </div>
                <div className="p-4 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 text-sm font-bold flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>Customs document <strong>Certificate Of Origin</strong> was rejected. Resubmission required.</p>
                </div>
              </div>
              <button className="w-full mt-6 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">
                Run Validation Check
              </button>
            </section>
          </div>

        </div>

        {/* SECTION 12: STICKY RIGHT SIDEBAR */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 sticky top-0 overflow-y-auto">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-100 transition-colors"><Upload className="w-4 h-4"/> Bulk Upload</button>
              <button className="w-full flex items-center gap-3 p-3 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-xl hover:bg-emerald-100 transition-colors"><CheckCircle className="w-4 h-4"/> Approve All Pending</button>
              <button className="w-full flex items-center gap-3 p-3 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors"><FileText className="w-4 h-4"/> Generate PDF Bundle</button>
            </div>
          </div>
          
          <div className="p-6 flex-1">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500"/> AI Suggestions</h3>
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <p className="text-sm font-bold text-slate-800 leading-relaxed">
                The attached <strong>Packing List</strong> has a mismatch with the <strong>Commercial Invoice</strong> item quantities. Recommend manual review before Customs submission.
              </p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
