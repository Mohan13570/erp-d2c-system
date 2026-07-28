import React, { useState, useEffect } from 'react';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import { employeePortalService } from '../services/employeeApi';
import {
  ShieldAlert, Plus, Search, Filter, ChevronRight, AlertTriangle, Clock,
  FileText, CheckCircle2, UserCheck, ShieldCheck, DollarSign, Camera, X,
  ArrowUpRight, MessageSquare, ThumbsUp, ThumbsDown, BarChart2, Shield
} from 'lucide-react';

export default function EmployeeClaims() {
  const { user } = useEmployeeAuth();
  const [activeTab, setActiveTab] = useState<'claims' | 'aging'>('claims');
  const [loading, setLoading] = useState(true);

  // Claims List State
  const [claims, setClaims] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Intake Modal State
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [intakeShipmentId, setIntakeShipmentId] = useState('SHP-84920');
  const [intakeDamageType, setIntakeDamageType] = useState('CARGO_DAMAGE');
  const [intakeDesc, setIntakeDesc] = useState('');
  const [intakeAmount, setIntakeAmount] = useState('85000');
  const [intakePhotoUrl, setIntakePhotoUrl] = useState('');

  // Investigation & Insurance Detail Modal State
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [investigator, setInvestigator] = useState('');
  const [liability, setLiability] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');
  const [policyRef, setPolicyRef] = useState('');
  const [insurerName, setInsurerName] = useState('');
  const [insurerStatus, setInsurerStatus] = useState('SUBMITTED');
  const [settlementAmt, setSettlementAmt] = useState('0');

  // Senior Approval Modal State
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approvalComments, setApprovalComments] = useState('');

  // Claims Aging Report State
  const [agingReport, setAgingReport] = useState<any>(null);

  const isSeniorRole = user?.role === 'manager' || user?.role === 'hr_admin';

  const fetchClaims = () => {
    employeePortalService.getClaims({ status: statusFilter, search })
      .then(res => {
        if (res.data.success) setClaims(res.data.data);
      })
      .catch(console.error);
  };

  const fetchAgingReport = () => {
    employeePortalService.getClaimsAgingReport()
      .then(res => {
        if (res.data.success) setAgingReport(res.data.data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      employeePortalService.getClaims(),
      employeePortalService.getClaimsAgingReport()
    ])
      .then(([clmRes, ageRes]) => {
        if (clmRes.data.success) setClaims(clmRes.data.data);
        if (ageRes.data.success) setAgingReport(ageRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'claims') fetchClaims();
    if (activeTab === 'aging') fetchAgingReport();
  }, [activeTab, statusFilter]);

  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await employeePortalService.createClaimIntake({
        shipmentId: intakeShipmentId,
        damageType: intakeDamageType,
        description: intakeDesc,
        claimedAmount: intakeAmount,
        photoUrl: intakePhotoUrl
      });
      setShowIntakeModal(false);
      setIntakeDesc('');
      fetchClaims();
      alert(`Claim intake registered successfully! Claim Number: ${res.data.data.claimNumber}`);
    } catch (err: any) {
      alert(err.message || 'Claim intake failed');
    }
  };

  const openDetailModal = (claim: any) => {
    setSelectedClaim(claim);
    setInvestigator(claim.investigator || 'Unassigned');
    setLiability(claim.liabilityDetermination || 'UNCLEAR');
    setPolicyRef(claim.insurance?.policyReference || '');
    setInsurerName(claim.insurance?.providerName || '');
    setInsurerStatus(claim.insurance?.settlementStatus || 'SUBMITTED');
    setSettlementAmt(claim.insurance?.settlementAmount?.toString() || '0');
    setShowDetailModal(true);
  };

  const handleUpdateInvestigation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeePortalService.updateClaimInvestigation(selectedClaim.id, {
        investigator,
        liabilityDetermination: liability,
        internalNote: internalNoteText
      });
      setInternalNoteText('');
      const updated = await employeePortalService.getClaimDetail(selectedClaim.id);
      setSelectedClaim(updated.data.data);
      fetchClaims();
      alert('Investigation details updated!');
    } catch (err: any) {
      alert(err.message || 'Update failed');
    }
  };

  const handleUpdateInsurance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeePortalService.updateClaimInsurance(selectedClaim.id, {
        policyReference: policyRef,
        providerName: insurerName,
        settlementStatus: insurerStatus,
        settlementAmount: settlementAmt
      });
      const updated = await employeePortalService.getClaimDetail(selectedClaim.id);
      setSelectedClaim(updated.data.data);
      fetchClaims();
      alert('Insurance provider tracking updated!');
    } catch (err: any) {
      alert(err.message || 'Insurance update failed');
    }
  };

  const handleSeniorApprovalSubmit = async (action: 'APPROVE' | 'DENY') => {
    try {
      await employeePortalService.approveClaimPayout(selectedClaim.id, {
        action,
        comments: approvalComments
      });
      setShowApproveModal(false);
      setShowDetailModal(false);
      fetchClaims();
      alert(`Claim payout ${action === 'APPROVE' ? 'Approved & Settled' : 'Denied'}!`);
    } catch (err: any) {
      alert(err.message || 'Approval action failed');
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
            <span className="text-blue-600 font-bold">Claims & Insurance</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Cargo Claims & Insurance Investigation Hub
          </h1>
          <p className="text-sm text-slate-500 font-normal mt-0.5">
            Log cargo damage claims, assign investigators, determine liability, track insurance policies, and monitor aging reports.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button
            onClick={() => setShowIntakeModal(true)}
            className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20"
          >
            <Plus size={16} /> New Claim Intake
          </button>
        </div>
      </div>

      {/* ── Tabs Navigation Bar ───────────────────────────────────────────── */}
      <div className="flex gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('claims')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'claims' ? 'border-blue-600 text-blue-600 font-extrabold' : 'border-transparent text-slate-500'
          }`}
        >
          <ShieldAlert size={16} /> Active Claims Queue ({claims.length})
        </button>

        <button
          onClick={() => setActiveTab('aging')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'aging' ? 'border-blue-600 text-blue-600 font-extrabold' : 'border-transparent text-slate-500'
          }`}
        >
          <BarChart2 size={16} /> Claims Aging & Stale Report
        </button>
      </div>

      {/* ── Tab 1: Active Claims Queue ────────────────────────────────────── */}
      {activeTab === 'claims' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert size={18} className="text-rose-600" /> Master Claims Desk
              </h2>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700"
              >
                <option value="ALL">All Claim Statuses</option>
                <option value="INTAKE">Intake Registered</option>
                <option value="UNDER_INVESTIGATION">Under Investigation</option>
                <option value="PENDING_APPROVAL">Pending Senior Approval</option>
                <option value="SETTLED">Settled</option>
                <option value="DENIED">Denied</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-3">Claim #</th>
                    <th className="p-3">Waybill #</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Damage Type</th>
                    <th className="p-3">Claimed Amount</th>
                    <th className="p-3">Investigator</th>
                    <th className="p-3">Liability</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {claims.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 font-medium">
                      <td className="p-3 font-mono font-bold text-blue-600">
                        {c.claimNumber}
                        {c.isStale && <span className="text-[9px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.5 rounded ml-1 border border-rose-300">Stale &gt;14d</span>}
                      </td>
                      <td className="p-3 font-mono text-slate-800 font-bold">{c.shipmentId}</td>
                      <td className="p-3 font-bold text-slate-900">{c.customerName}</td>
                      <td className="p-3">{c.damageType?.replace('_', ' ')}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">₹{c.claimedAmount?.toLocaleString()}</td>
                      <td className="p-3 text-slate-600">{c.investigator}</td>
                      <td className="p-3">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                          {c.liabilityDetermination}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                          c.status === 'SETTLED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                          c.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                          c.status === 'DENIED' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                          'bg-blue-100 text-blue-800 border-blue-300'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => openDetailModal(c)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow"
                        >
                          Investigate →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Claims Aging Report ────────────────────────────────────── */}
      {activeTab === 'aging' && agingReport && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Total Open Claims</span>
              <p className="text-2xl font-bold text-slate-900">{agingReport.totalOpenClaims}</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold text-rose-600 uppercase">Stale Claims (&gt; 14 Days Open)</span>
              <p className="text-2xl font-bold text-rose-600">{agingReport.staleClaimsCount}</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold text-purple-600 uppercase">Senior Sign-off Threshold</span>
              <p className="text-base font-bold text-purple-700">Claims &gt; ₹50,000</p>
            </div>
          </div>

          {/* Stale Claims Flagged List */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <AlertTriangle size={18} className="text-rose-600" /> Stale Claims Requiring Urgent Escalation
            </h2>

            <div className="space-y-2">
              {(agingReport.staleClaims || []).map((sc: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-rose-900">{sc.claimNumber} ({sc.shipmentId})</span>
                    <p className="text-rose-700 font-medium">Customer: {sc.customerName} · Investigator: {sc.investigator}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-rose-900">{sc.daysOpen} Days Open</span>
                    <button onClick={() => openDetailModal(sc)} className="text-xs font-bold text-blue-600 hover:underline block">
                      Escalate Claim →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── Claim Intake Modal ────────────────────────────────────────────── */}
      {showIntakeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">New Cargo Claim Intake</h3>
              <button onClick={() => setShowIntakeModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleIntakeSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Waybill / Shipment ID</label>
                <input
                  type="text"
                  value={intakeShipmentId}
                  onChange={e => setIntakeShipmentId(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900"
                  placeholder="SHP-84920"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Damage / Loss Category</label>
                <select
                  value={intakeDamageType}
                  onChange={e => setIntakeDamageType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900"
                >
                  <option value="CARGO_DAMAGE">Cargo Physical Damage</option>
                  <option value="TOTAL_LOSS">Total Consignment Loss</option>
                  <option value="PARTIAL_PILFERAGE">Partial Pilferage / Theft</option>
                  <option value="TEMPERATURE_EXCURSION">Refrigerated Temperature Excursion</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Claimed Payout Amount (₹)</label>
                <input
                  type="number"
                  value={intakeAmount}
                  onChange={e => setIntakeAmount(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Incident Description</label>
                <textarea
                  value={intakeDesc}
                  onChange={e => setIntakeDesc(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-medium text-slate-900"
                  placeholder="Describe damage details and unsealing report..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Photo Evidence URL</label>
                <input
                  type="text"
                  value={intakePhotoUrl}
                  onChange={e => setIntakePhotoUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900"
                  placeholder="https://docs.lizome.com/claims/photo.jpg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowIntakeModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-600/20">Register Claim</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Investigation & Insurance Detail Modal ───────────────────────── */}
      {showDetailModal && selectedClaim && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-2xl space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Claim Workspace: {selectedClaim.claimNumber}</h3>
                <p className="text-xs text-slate-500 font-medium">Waybill: {selectedClaim.shipmentId} · Customer: {selectedClaim.customerName}</p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            {/* Senior Approval Banner */}
            {selectedClaim.requiresSeniorApproval && selectedClaim.status === 'PENDING_APPROVAL' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
                <div>
                  <span className="font-bold flex items-center gap-1.5"><AlertTriangle size={15} className="text-amber-600" /> Senior Payout Approval Required</span>
                  <p>Claimed Amount (₹{selectedClaim.claimedAmount?.toLocaleString()}) exceeds ₹50,000 threshold.</p>
                </div>
                {isSeniorRole && (
                  <div className="flex gap-2">
                    <button onClick={() => handleSeniorApprovalSubmit('APPROVE')} className="px-3 py-1 bg-emerald-600 text-white font-bold rounded shadow">Approve Payout</button>
                    <button onClick={() => handleSeniorApprovalSubmit('DENY')} className="px-3 py-1 bg-rose-600 text-white font-bold rounded shadow">Deny Claim</button>
                  </div>
                )}
              </div>
            )}

            {/* Investigation Form */}
            <form onSubmit={handleUpdateInvestigation} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <span className="font-extrabold text-blue-600 uppercase tracking-wider block">Internal Investigation Desk</span>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Assigned Investigator</label>
                  <select
                    value={investigator}
                    onChange={e => setInvestigator(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900"
                  >
                    <option value="Aura Employee">Aura Employee</option>
                    <option value="Mohan Manager">Mohan Manager</option>
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Liability Determination</label>
                  <select
                    value={liability}
                    onChange={e => setLiability(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900"
                  >
                    <option value="CARRIER_AT_FAULT">Transporter / Carrier at Fault</option>
                    <option value="CUSTOMER_PACKAGING_ISSUE">Customer Sub-Standard Packaging</option>
                    <option value="UNCLEAR">Unclear / Under Review</option>
                    <option value="THIRD_PARTY_NEGLIGENCE">Third-Party Terminal Negligence</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase">Add Internal Note (Not Customer Visible)</label>
                <input
                  type="text"
                  value={internalNoteText}
                  onChange={e => setInternalNoteText(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-900"
                  placeholder="Record investigation findings..."
                />
              </div>

              <div className="flex justify-end">
                <button type="submit" className="px-3.5 py-1.5 bg-blue-600 text-white font-bold rounded shadow">Save Investigation Log</button>
              </div>
            </form>

            {/* Insurance Provider Tracking Form */}
            <form onSubmit={handleUpdateInsurance} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <span className="font-extrabold text-purple-600 uppercase tracking-wider block">Insurance Provider Tracking</span>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Policy Ref Number</label>
                  <input
                    type="text"
                    value={policyRef}
                    onChange={e => setPolicyRef(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Insurer Settlement Status</label>
                  <select
                    value={insurerStatus}
                    onChange={e => setInsurerStatus(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900"
                  >
                    <option value="SUBMITTED">Submitted</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="APPROVED">Approved</option>
                    <option value="DENIED">Denied</option>
                    <option value="PAID">Paid</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="px-3.5 py-1.5 bg-purple-600 text-white font-bold rounded shadow">Update Insurance Record</button>
              </div>
            </form>

            <div className="flex justify-end">
              <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Close Workspace</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
