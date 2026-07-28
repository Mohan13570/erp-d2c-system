import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import { employeePortalService } from '../services/employeeApi';
import {
  Truck, ArrowLeft, ChevronRight, CheckCircle2, Clock, AlertTriangle,
  FileText, ShieldCheck, DollarSign, UserCheck, Upload, Download, Plus, X, ArrowRight, ShieldAlert
} from 'lucide-react';

export default function EmployeeShipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useEmployeeAuth();
  const navigate = useNavigate();

  const [shipment, setShipment] = useState<any>(null);
  const [vendorList, setVendorList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFinancialRole, setIsFinancialRole] = useState(false);

  // Status Transition Modal
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [targetNextStatus, setTargetNextStatus] = useState('');
  const [transitionRemarks, setTransitionRemarks] = useState('');
  const [transitioning, setTransitioning] = useState(false);

  // Vendor Assignment Modal
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');

  // Exception Modal
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [reasonCode, setReasonCode] = useState('CUSTOMS_INSPECTION');
  const [exDescription, setExDescription] = useState('');
  const [escalateManager, setEscalateManager] = useState(true);

  // Document Upload & Auto-Gen Modal
  const [showDocModal, setShowDocModal] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('POD');
  const [docUrl, setDocUrl] = useState('');

  // Document Status Tracker & Version Control State
  const [docTracker, setDocTracker] = useState<any[]>([]);
  const [activePdfDoc, setActivePdfDoc] = useState<any>(null);
  const [reprintReason, setReprintReason] = useState('');
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const loadShipmentDetail = () => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      employeePortalService.getShipmentDetail(id),
      employeePortalService.getShipmentDocumentTracker(id)
    ])
      .then(([shipRes, docRes]) => {
        if (shipRes.data.success) {
          const data = shipRes.data.data;
          setShipment(data.shipment);
          setIsFinancialRole(data.isFinancialRole);
          setVendorList(data.vendorMasterList || []);
          if (data.vendorMasterList && data.vendorMasterList.length > 0) {
            setSelectedVendorId(data.vendorMasterList[0].id);
          }
        }
        if (docRes.data.success) {
          setDocTracker(docRes.data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleGeneratePdfDoc = async (type: string, reason?: string) => {
    setGeneratingPdf(true);
    try {
      const res = await employeePortalService.generateShipmentDocument({
        shipmentId: shipment.id,
        docType: type,
        reasonForReprint: reason || 'PDF generation requested from shipment workspace.'
      });
      alert(`Standard ${type.replace('_', ' ')} Document generated cleanly! Version: ${res.data.data.docItem.currentVersion}`);
      loadShipmentDetail();
    } catch (err: any) {
      alert(err.message || 'PDF Generation failed');
    } finally {
      setGeneratingPdf(false);
    }
  };

  useEffect(() => {
    loadShipmentDetail();
  }, [id]);

  const handleStatusTransitionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransitioning(true);

    try {
      await employeePortalService.transitionShipmentStatus(shipment.id, targetNextStatus, transitionRemarks);
      setShowTransitionModal(false);
      setTransitionRemarks('');
      loadShipmentDetail();
      alert(`Shipment status successfully updated to ${targetNextStatus}!`);
    } catch (err: any) {
      alert(err.message || 'Status transition failed');
    } finally {
      setTransitioning(false);
    }
  };

  const handleVendorAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeePortalService.assignShipmentVendor(shipment.id, {
        vendorId: selectedVendorId,
        vehicleNumber: vehicleNo,
        driverName,
        driverPhone
      });
      setShowVendorModal(false);
      loadShipmentDetail();
      alert('Transporter & Carrier assigned successfully!');
    } catch (err: any) {
      alert(err.message || 'Vendor assignment failed');
    }
  };

  const handleExceptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await employeePortalService.flagShipmentException(shipment.id, {
        reasonCode,
        description: exDescription,
        escalate: escalateManager
      });
      setShowExceptionModal(false);
      setExDescription('');
      loadShipmentDetail();
      alert(`Operational delay flagged! ${escalateManager ? 'Manager escalation ticket created.' : ''}`);
    } catch (err: any) {
      alert(err.message || 'Exception flagging failed');
    }
  };

  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeePortalService.uploadShipmentDocument(shipment.id, {
        documentName: docName,
        documentType: docType,
        fileUrl: docUrl
      });
      setShowDocModal(false);
      setDocName('');
      setDocUrl('');
      loadShipmentDetail();
      alert('Document attached successfully!');
    } catch (err: any) {
      alert(err.message || 'Document attachment failed');
    }
  };

  if (loading || !shipment) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        <div className="h-32 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  const allowedNextTransitions: Record<string, string[]> = {
    BOOKED: ['PICKED_UP'],
    PICKED_UP: ['IN_TRANSIT'],
    IN_TRANSIT: ['CUSTOMS', 'OUT_FOR_DELIVERY'],
    CUSTOMS: ['IN_TRANSIT', 'OUT_FOR_DELIVERY'],
    OUT_FOR_DELIVERY: ['DELIVERED'],
    DELIVERED: []
  };

  const nextAllowed = allowedNextTransitions[shipment.status] || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* ── Breadcrumbs & Header Bar ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <Link to="/hr-portal/shipments" className="hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft size={12} /> Master Shipments
            </Link>
            <ChevronRight size={12} />
            <span className="text-blue-600 font-bold">{shipment.shipmentNumber}</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Shipment Record: {shipment.shipmentNumber}
            </h1>
            <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
              shipment.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              shipment.status === 'IN_TRANSIT' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              shipment.status === 'CUSTOMS' ? 'bg-rose-50 text-rose-700 border-rose-200' :
              'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {shipment.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button
            onClick={() => setShowExceptionModal(true)}
            className="px-3.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1.5"
          >
            <AlertTriangle size={15} /> Flag Exception / Delay
          </button>

          <button
            onClick={() => setShowVendorModal(true)}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5"
          >
            <UserCheck size={15} /> Assign Transporter
          </button>
        </div>
      </div>

      {/* ── 1. Status State Machine Transition Bar ─────────────────────────── */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock size={18} className="text-blue-600" /> State Machine Status Workflow
            </h2>
            <p className="text-xs text-slate-500 font-medium">Strict transition validation with logged timestamps and user identity.</p>
          </div>
          
          <div className="flex gap-2">
            {nextAllowed.map(nxt => (
              <button
                key={nxt}
                onClick={() => {
                  setTargetNextStatus(nxt);
                  setShowTransitionModal(true);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
              >
                Transition to {nxt} <ArrowRight size={14} />
              </button>
            ))}
            {nextAllowed.length === 0 && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                Shipment Delivered (Terminal State)
              </span>
            )}
          </div>
        </div>

        {/* State Pipeline Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1 text-center text-xs font-bold">
          {['BOOKED', 'PICKED_UP', 'IN_TRANSIT', 'CUSTOMS', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((st, idx) => {
            const isCurrent = shipment.status === st;
            const isPassed = shipment.statusHistory.some((h: any) => h.toStatus === st);
            return (
              <div
                key={st}
                className={`p-2.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                    : isPassed
                    ? 'bg-slate-100 text-slate-800 border-slate-200'
                    : 'bg-slate-50 text-slate-400 border-slate-100'
                }`}
              >
                <div className="text-[10px] font-extrabold opacity-70">Stage 0{idx + 1}</div>
                <div className="truncate">{st}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 2. Two Column Grid: Details & Multi-Leg ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Master Details, Vendor, Cost Breakdown (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Master Details */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Truck size={18} className="text-blue-600" /> Waybill Specification Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Customer Information</span>
                <p className="text-sm font-bold text-slate-900">{shipment.customerName}</p>
                <p className="text-slate-500">{shipment.customerEmail} · {shipment.customerPhone}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Route Details</span>
                <p className="text-sm font-bold text-slate-900">{shipment.origin}</p>
                <p className="text-slate-500">➔ {shipment.destination}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1 text-xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Cargo & Service Type</span>
              <p className="text-slate-900 font-bold">{shipment.serviceType}</p>
              <p className="text-slate-600">{shipment.cargoDetails}</p>
              <p className="text-slate-500 text-[11px] italic">Note: {shipment.specialInstructions}</p>
            </div>
          </div>

          {/* Carrier & Transporter Assignment Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserCheck size={18} className="text-purple-600" /> Carrier & Vendor Assignment
              </h2>
              <button onClick={() => setShowVendorModal(true)} className="text-xs text-purple-600 font-bold hover:underline">
                Reassign →
              </button>
            </div>

            {shipment.vendor ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Transporter Company</span>
                  <p className="text-slate-900 font-bold">{shipment.vendor.name}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Vehicle Registration</span>
                  <p className="text-blue-600 font-mono font-bold">{shipment.vendor.vehicleNumber}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Driver Contact</span>
                  <p className="text-slate-900 font-bold">{shipment.vendor.driverName}</p>
                  <p className="text-slate-500">{shipment.vendor.driverPhone}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-medium">No carrier assigned yet.</p>
            )}
          </div>

          {/* Role-Scoped Shipment Cost Breakdown Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <DollarSign size={18} className="text-emerald-600" /> Shipment Cost Breakdown & Margin
              </h2>
              <span className="text-xs text-slate-400 font-semibold">Financial Visibility</span>
            </div>

            {isFinancialRole ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">Billed to Customer</span>
                  <p className="text-base font-bold text-slate-900">₹{shipment.billedAmount?.toLocaleString()}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">Internal Vendor Cost</span>
                  <p className="text-base font-bold text-slate-700">₹{shipment.internalCost?.toLocaleString()}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-0.5">
                  <span className="text-[10px] font-extrabold text-emerald-800 uppercase">Net Margin (%)</span>
                  <p className="text-base font-bold text-emerald-600 font-mono">{shipment.marginPercentage} (₹{shipment.marginAmount?.toLocaleString()})</p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 text-slate-500 text-xs font-medium flex items-center gap-2">
                <ShieldCheck size={16} /> Restricted: Financial breakdown is hidden for standard operational staff roles.
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Multi-Leg Tracking & History Timeline */}
        <div className="space-y-6">
          
          {/* Multi-Leg Route Tracker */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Truck size={18} className="text-blue-600" /> Route Multi-Leg Tracker
            </h2>

            <div className="space-y-3">
              {(shipment.legs || []).map((leg: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{leg.legName}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                      leg.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      leg.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-slate-200 text-slate-600 border-slate-300'
                    }`}>
                      {leg.status}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium">{leg.origin} ➔ {leg.destination}</p>
                  <p className="text-[10px] text-slate-400">Carrier: {leg.carrier}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Exceptions & Escalations Panel */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert size={18} className="text-rose-600" /> Exceptions & Escalations
              </h2>
              <button onClick={() => setShowExceptionModal(true)} className="text-xs text-rose-600 font-bold hover:underline">
                Flag Exception
              </button>
            </div>

            <div className="space-y-2">
              {(shipment.exceptions || []).map((ex: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1">
                  <div className="flex items-center justify-between text-rose-900 font-bold">
                    <span>{ex.reasonCode}</span>
                    {ex.escalated && (
                      <span className="text-[10px] bg-rose-600 text-white font-extrabold px-1.5 py-0.5 rounded">
                        Escalated: {ex.escalatedTicketId}
                      </span>
                    )}
                  </div>
                  <p className="text-rose-700">{ex.description}</p>
                  <p className="text-[10px] text-rose-500 font-medium">{new Date(ex.timestamp).toLocaleString()}</p>
                </div>
              ))}
              {(!shipment.exceptions || shipment.exceptions.length === 0) && (
                <p className="text-xs text-slate-400 font-medium">No exceptions flagged on this shipment.</p>
              )}
            </div>
          </div>

          {/* Document Status Tracker Component per Shipment */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText size={18} className="text-blue-600" /> Standard Document Status Tracker
                </h2>
                <p className="text-xs text-slate-500 font-medium">Auto-generation & version control audit per shipment document.</p>
              </div>
            </div>

            <div className="space-y-3">
              {docTracker.map((dt: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{dt.title}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                        dt.status === 'SIGNED' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        dt.status === 'GENERATED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {dt.status}
                      </span>
                    </div>
                    
                    <span className="font-mono text-xs font-bold text-blue-600">Ver: {dt.currentVersion}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      {dt.lastGeneratedAt ? `Last generated by ${dt.lastGeneratedBy} on ${new Date(dt.lastGeneratedAt).toLocaleDateString()}` : 'Pending initial generation'}
                    </span>

                    <button
                      onClick={() => handleGeneratePdfDoc(dt.docType, 'Re-generation requested from shipment workspace.')}
                      disabled={generatingPdf}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
                    >
                      {dt.status === 'PENDING' ? 'Generate PDF' : 'Reprint PDF (New Ver)'}
                    </button>
                  </div>

                  {/* Version Audit Log List */}
                  {dt.versions && dt.versions.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Version History Audit</span>
                      {dt.versions.map((ver: any, i: number) => (
                        <div key={i} className="flex items-center justify-between text-[10px] text-slate-600 bg-white p-1.5 rounded border border-slate-200/60">
                          <span className="font-mono font-bold text-slate-800">{ver.version} ({new Date(ver.generatedAt).toLocaleTimeString()})</span>
                          <span className="truncate max-w-[180px]">{ver.reason}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Document Attachment Vault Slot */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText size={18} className="text-blue-600" /> Documents & Manifest Vault
              </h2>
              <button onClick={() => setShowDocModal(true)} className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                <Plus size={12} /> Attach Doc
              </button>
            </div>

            <div className="space-y-2">
              {(shipment.documents || []).map((doc: any, idx: number) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
                  <div className="truncate">
                    <p className="font-bold text-slate-900 truncate">{doc.name}</p>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{doc.type}</span>
                  </div>
                  <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-white border border-slate-200 text-blue-600 hover:bg-blue-50">
                    <Download size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Audit History Log Timeline */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Status Transition Audit History
            </h2>
            <div className="space-y-3">
              {(shipment.statusHistory || []).map((h: any, idx: number) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{h.fromStatus} ➔ {h.toStatus}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{new Date(h.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{h.remarks}</p>
                  <p className="text-[10px] text-blue-600 font-semibold">By: {h.updatedBy}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ── Status State Machine Modal ────────────────────────────────────── */}
      {showTransitionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">State Transition to {targetNextStatus}</h3>
              <button onClick={() => setShowTransitionModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleStatusTransitionSubmit} className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-800 font-medium">
                Current Stage: <strong>{shipment.status}</strong> ➔ Target Stage: <strong>{targetNextStatus}</strong>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Transition Remarks & Location</label>
                <textarea
                  value={transitionRemarks}
                  onChange={e => setTransitionRemarks(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                  placeholder="Record timestamp details, checkpoint location, or vehicle status..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowTransitionModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                <button type="submit" disabled={transitioning} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20">
                  {transitioning ? 'Processing...' : 'Confirm Transition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Vendor Assignment Modal ───────────────────────────────────────── */}
      {showVendorModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Assign Transporter & Carrier</h3>
              <button onClick={() => setShowVendorModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleVendorAssignSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Select Vendor Transporter</label>
                <select
                  value={selectedVendorId}
                  onChange={e => setSelectedVendorId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                >
                  {vendorList.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.city})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Vehicle Reg Number</label>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={e => setVehicleNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium"
                  placeholder="e.g. MH-04-AB-1234"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Driver Name</label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={e => setDriverName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium"
                    placeholder="Rajesh Kumar"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Driver Phone</label>
                  <input
                    type="text"
                    value={driverPhone}
                    onChange={e => setDriverPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium"
                    placeholder="+91 98765 11111"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowVendorModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20">Assign Carrier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Flag Exception Modal ──────────────────────────────────────────── */}
      {showExceptionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Flag Operational Exception</h3>
              <button onClick={() => setShowExceptionModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleExceptionSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Reason Code</label>
                <select
                  value={reasonCode}
                  onChange={e => setReasonCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-rose-500"
                >
                  <option value="CUSTOMS_INSPECTION">Customs Inspection Hold</option>
                  <option value="WEATHER_DELAY">Weather / Monsoons Interruption</option>
                  <option value="VEHICLE_BREAKDOWN">Vehicle Breakdown / Mechanical</option>
                  <option value="TRAFFIC_CONGESTION">Highway Toll Traffic Congestion</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Incident Explanation</label>
                <textarea
                  value={exDescription}
                  onChange={e => setExDescription(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 font-medium"
                  placeholder="Describe location, impact, and reroute steps..."
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="escCheck"
                  checked={escalateManager}
                  onChange={e => setEscalateManager(e.target.checked)}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="escCheck" className="text-xs text-slate-700 font-bold">Escalate & create manager task ticket</label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowExceptionModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-600/20">Flag Delay</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Document Upload Modal ─────────────────────────────────────────── */}
      {showDocModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Attach Shipment Document</h3>
              <button onClick={() => setShowDocModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleDocumentSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Document Name</label>
                <input
                  type="text"
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium"
                  placeholder="e.g. Proof of Delivery (POD).pdf"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Document Type</label>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold"
                >
                  <option value="POD">Proof of Delivery (POD)</option>
                  <option value="EWAY_BILL">E-Way Bill Manifest</option>
                  <option value="LR_COPY">Lorry Receipt (LR Copy)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">File Link / Storage URL</label>
                <input
                  type="text"
                  value={docUrl}
                  onChange={e => setDocUrl(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium"
                  placeholder="https://docs.lizome.com/pod-84920.pdf"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowDocModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20">Attach Document</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
