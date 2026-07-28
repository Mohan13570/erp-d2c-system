import React, { useState, useEffect } from 'react';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import { employeePortalService } from '../services/employeeApi';
import {
  FolderOpen, FileText, Upload, Download, Lock, Shield, Plus, CheckCircle2,
  ChevronRight, Archive, Layers, Search, Filter, AlertTriangle, RefreshCw, CheckSquare, Square
} from 'lucide-react';

export default function EmployeeDocuments() {
  const { user } = useEmployeeAuth();
  const [activeTab, setActiveTab] = useState<'bulk' | 'compliance' | 'my'>('bulk');
  const [loading, setLoading] = useState(true);

  // Bulk Document Action Hub State
  const [shipmentList, setShipmentList] = useState<any[]>([]);
  const [selectedShipmentIds, setSelectedShipmentIds] = useState<string[]>(['SHP-84920']);
  const [selectedDocTypes, setSelectedDocTypes] = useState<string[]>(['INVOICE', 'EWAY_BILL']);
  const [bulkJobLoading, setBulkJobLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkResult, setBulkResult] = useState<any>(null);

  // Compliance Repository State
  const [complianceDocs, setComplianceDocs] = useState<any[]>([]);
  const [complianceCategory, setComplianceCategory] = useState('ALL');
  const [complianceSearch, setComplianceSearch] = useState('');
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [compTitle, setCompTitle] = useState('');
  const [compCategory, setCompCategory] = useState('LICENSE');
  const [compDocType, setCompDocType] = useState('Customs License');
  const [compIssuer, setCompIssuer] = useState('');
  const [compExpiryDate, setCompExpiryDate] = useState('2026-12-31');

  // Personal Documents State
  const [myDocs, setMyDocs] = useState<any[]>([]);

  const fetchComplianceDocs = () => {
    employeePortalService.getComplianceRepository({ category: complianceCategory, search: complianceSearch })
      .then(res => {
        if (res.data.success) setComplianceDocs(res.data.data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    Promise.all([
      employeePortalService.getShipments({ limit: 10 }),
      employeePortalService.getComplianceRepository(),
      employeePortalService.getMyDocuments()
    ])
      .then(([shipRes, compRes, myRes]) => {
        if (shipRes.data.success) setShipmentList(shipRes.data.data.shipments || []);
        if (compRes.data.success) setComplianceDocs(compRes.data.data || []);
        if (myRes.data.success) setMyDocs(myRes.data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'compliance') fetchComplianceDocs();
  }, [complianceCategory]);

  const toggleSelectShipment = (id: string) => {
    setSelectedShipmentIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllShipments = () => {
    if (selectedShipmentIds.length === shipmentList.length) {
      setSelectedShipmentIds([]);
    } else {
      setSelectedShipmentIds(shipmentList.map(s => s.id));
    }
  };

  const handleRunBulkJob = async () => {
    if (selectedShipmentIds.length === 0) {
      alert('Please select at least one shipment for bulk document generation');
      return;
    }
    setBulkJobLoading(true);
    setBulkProgress(10);

    const interval = setInterval(() => {
      setBulkProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 400);

    try {
      const res = await employeePortalService.runBulkDocumentJob({
        shipmentIds: selectedShipmentIds,
        docTypes: selectedDocTypes
      });
      setTimeout(() => {
        setBulkProgress(100);
        setBulkResult(res.data.data);
        setBulkJobLoading(false);
      }, 1500);
    } catch (err: any) {
      clearInterval(interval);
      setBulkJobLoading(false);
      alert(err.message || 'Bulk job failed');
    }
  };

  const handleAddComplianceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeePortalService.uploadComplianceDoc({
        title: compTitle,
        category: compCategory,
        docType: compDocType,
        issuer: compIssuer,
        expiryDate: compExpiryDate
      });
      setShowComplianceModal(false);
      setCompTitle('');
      setCompIssuer('');
      fetchComplianceDocs();
      alert('Compliance document registered successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to register compliance document');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* ── Breadcrumbs & Header Bar ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Home</span>
            <ChevronRight size={12} />
            <span>Employee Portal</span>
            <ChevronRight size={12} />
            <span className="text-blue-600 font-bold">Documents & Compliance</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Documents, Bulk Actions & Compliance Repository
          </h1>
          <p className="text-sm text-slate-500 font-normal mt-0.5">
            Auto-generate PDF manifests, execute bulk batch jobs, and manage regulatory compliance licenses.
          </p>
        </div>
      </div>

      {/* ── Tabs Navigation Bar ───────────────────────────────────────────── */}
      <div className="flex gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('bulk')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'bulk'
              ? 'border-blue-600 text-blue-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Archive size={16} /> Bulk Document Action Hub
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'compliance'
              ? 'border-blue-600 text-blue-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Shield size={16} /> Compliance Repository & HS Codes
        </button>

        <button
          onClick={() => setActiveTab('my')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'my'
              ? 'border-blue-600 text-blue-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FolderOpen size={16} /> Personal Vault
        </button>
      </div>

      {/* ── Tab 1: Bulk Document Action Hub ────────────────────────────────── */}
      {activeTab === 'bulk' && (
        <div className="space-y-6">
          
          {/* Bulk Action Controls */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Archive size={18} className="text-blue-600" /> Multi-Shipment Batch Generator
                </h2>
                <p className="text-xs text-slate-500 font-medium">Select multiple shipments to generate or download documents in bulk ZIP archives.</p>
              </div>

              <button
                onClick={handleRunBulkJob}
                disabled={bulkJobLoading || selectedShipmentIds.length === 0}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
              >
                <Download size={15} /> Generate Bulk ZIP ({selectedShipmentIds.length} Selected)
              </button>
            </div>

            {/* Batch Job Progress Indicator */}
            {bulkJobLoading && (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 space-y-2 animate-in fade-in">
                <div className="flex justify-between text-xs font-bold text-blue-900">
                  <span>Batch Generation Job Running...</span>
                  <span>{bulkProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${bulkProgress}%` }} />
                </div>
              </div>
            )}

            {/* Bulk Result Banner */}
            {bulkResult && !bulkJobLoading && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs text-emerald-900 animate-in fade-in">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-600" /> Bulk Job Completed: {bulkResult.jobId}</span>
                  <a href={bulkResult.downloadZipUrl} target="_blank" rel="noreferrer" className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg shadow">
                    Download ZIP Bundle ({bulkResult.generatedDocumentsCount} Files)
                  </a>
                </div>
                <p className="text-[11px] text-emerald-800">Batch manifest compiled across {bulkResult.totalShipmentsProcessed} shipment records.</p>
              </div>
            )}

            {/* Multi-Select Shipments Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-3 w-10 text-center">
                      <button onClick={toggleSelectAllShipments} className="text-slate-600">
                        {selectedShipmentIds.length === shipmentList.length && shipmentList.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>
                    </th>
                    <th className="p-3">Waybill #</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Route Corridor</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Service Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shipmentList.map((s, idx) => {
                    const isSelected = selectedShipmentIds.includes(s.id);
                    return (
                      <tr key={idx} className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50/40' : ''}`}>
                        <td className="p-3 text-center">
                          <button onClick={() => toggleSelectShipment(s.id)} className="text-blue-600">
                            {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                          </button>
                        </td>
                        <td className="p-3 font-mono font-bold text-blue-600">{s.shipmentNumber}</td>
                        <td className="p-3 font-bold text-slate-900">{s.customerName}</td>
                        <td className="p-3">{s.origin} ➔ {s.destination}</td>
                        <td className="p-3">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {s.status}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-slate-600">{s.serviceType}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ── Tab 2: Compliance Repository & HS Code Mappings ────────────────── */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Shield size={18} className="text-blue-600" /> Compliance Document Repository & HS Codes
                </h2>
                <p className="text-xs text-slate-500 font-medium">Central store for regulatory operating licenses, Customs permits, and global HS code tariff matrices.</p>
              </div>

              <button
                onClick={() => setShowComplianceModal(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <Plus size={15} /> Upload Compliance Record
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex gap-3 items-center">
              <select
                value={complianceCategory}
                onChange={e => setComplianceCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700"
              >
                <option value="ALL">All Categories</option>
                <option value="LICENSE">Licenses & Permits</option>
                <option value="REGISTRATION">Registrations (IEC)</option>
                <option value="HS_MAPPING">HS Code Mappings</option>
              </select>
            </div>

            {/* Compliance Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {complianceDocs.map((cd, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{cd.title}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                      cd.status === 'EXPIRING_SOON' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      {cd.status}
                    </span>
                  </div>

                  <p className="text-slate-600 font-medium">Issuer: {cd.issuer}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                    <span className="text-slate-500 font-semibold">Expiry Date: <strong className="text-slate-800">{cd.expiryDate}</strong></span>
                    <a href={cd.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                      <Download size={13} /> View License PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── Tab 3: Personal Vault ─────────────────────────────────────────── */}
      {activeTab === 'my' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FolderOpen size={18} className="text-blue-600" /> Private Document Vault
          </h2>

          <div className="space-y-2">
            {myDocs.map((d, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{d.documentName}</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">{d.documentType}</p>
                </div>
                <a href={d.fileUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-white border border-slate-200 text-blue-600">
                  <Download size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Add Compliance Document Modal ─────────────────────────────────── */}
      {showComplianceModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Upload Compliance Document</h3>
              <button onClick={() => setShowComplianceModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleAddComplianceSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Document Title</label>
                <input
                  type="text"
                  value={compTitle}
                  onChange={e => setCompTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium"
                  placeholder="e.g. Customs Brokerage License 2026"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Category</label>
                <select
                  value={compCategory}
                  onChange={e => setCompCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold"
                >
                  <option value="LICENSE">License & Permit</option>
                  <option value="REGISTRATION">Registration (IEC)</option>
                  <option value="HS_MAPPING">HS Code Mapping</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Issuing Authority</label>
                <input
                  type="text"
                  value={compIssuer}
                  onChange={e => setCompIssuer(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium"
                  placeholder="e.g. Central Board of Indirect Taxes & Customs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Expiry Date</label>
                <input
                  type="date"
                  value={compExpiryDate}
                  onChange={e => setCompExpiryDate(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowComplianceModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20">Register License</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
