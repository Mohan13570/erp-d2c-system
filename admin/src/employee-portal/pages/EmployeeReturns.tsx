import React, { useState, useEffect } from 'react';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import { employeePortalService } from '../services/employeeApi';
import {
  RotateCcw, Plus, Search, Filter, ChevronRight, Truck, Clock,
  FileText, CheckCircle2, UserCheck, ShieldCheck, DollarSign, X,
  ArrowRight, RefreshCw, CornerDownLeft, ShieldAlert
} from 'lucide-react';

export default function EmployeeReturns() {
  const { user } = useEmployeeAuth();
  const [returnsList, setReturnsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Intake Modal State
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [shipmentId, setShipmentId] = useState('SHP-84920');
  const [invoiceId, setInvoiceId] = useState('INV-2026-001');
  const [reasonCode, setReasonCode] = useState('WRONG_ITEM');
  const [description, setDescription] = useState('');
  const [returnValue, setReturnValue] = useState('50000');

  // Detail Workspace Modal State
  const [selectedReturn, setSelectedReturn] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [vendorList, setVendorList] = useState<any[]>([]);

  // Reverse Pickup Modal
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [pickupDate, setPickupDate] = useState('2026-07-25T10:00');
  const [vehicleNo, setVehicleNo] = useState('');
  const [driverName, setDriverName] = useState('');

  // Transition State
  const [transitionRemarks, setTransitionRemarks] = useState('');
  const [transitioning, setTransitioning] = useState(false);

  const fetchReturns = () => {
    employeePortalService.getReturns({ status: statusFilter, search })
      .then(res => {
        if (res.data.success) setReturnsList(res.data.data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    setLoading(true);
    employeePortalService.getReturns()
      .then(res => {
        if (res.data.success) setReturnsList(res.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchReturns();
  }, [statusFilter]);

  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await employeePortalService.createReturnIntake({
        shipmentId,
        invoiceId,
        reasonCode,
        description,
        returnValue
      });
      setShowIntakeModal(false);
      setDescription('');
      fetchReturns();
      alert(`Return Request registered! Return Number: ${res.data.data.returnNumber}`);
    } catch (err: any) {
      alert(err.message || 'Intake registration failed');
    }
  };

  const openDetailModal = (ret: any) => {
    employeePortalService.getReturnDetail(ret.id)
      .then(res => {
        if (res.data.success) {
          setSelectedReturn(res.data.data.returnRecord);
          setVendorList(res.data.data.vendorMasterList || []);
          if (res.data.data.vendorMasterList?.length > 0) {
            setSelectedVendorId(res.data.data.vendorMasterList[0].id);
          }
          setShowDetailModal(true);
        }
      })
      .catch(console.error);
  };

  const handleReverseBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeePortalService.scheduleReverseBooking(selectedReturn.id, {
        vendorId: selectedVendorId,
        pickupDate,
        vehicleNumber: vehicleNo,
        driverName
      });
      setShowPickupModal(false);
      const updated = await employeePortalService.getReturnDetail(selectedReturn.id);
      setSelectedReturn(updated.data.data.returnRecord);
      fetchReturns();
      alert('Reverse pickup carrier scheduled successfully!');
    } catch (err: any) {
      alert(err.message || 'Scheduling failed');
    }
  };

  const handleTransitionStatus = async (nextStatus: string) => {
    setTransitioning(true);
    try {
      const res = await employeePortalService.transitionReturnStatus(selectedReturn.id, nextStatus, transitionRemarks);
      setTransitionRemarks('');
      setSelectedReturn(res.data.data);
      fetchReturns();
      if (nextStatus === 'REFUNDED') {
        alert(`Return status set to REFUNDED! Credit Note ${res.data.data.linkedCreditNote?.creditNoteNumber} automatically posted to Customer Account Ledger!`);
      } else {
        alert(`Return stage updated to ${nextStatus}!`);
      }
    } catch (err: any) {
      alert(err.message || 'Status transition failed');
    } finally {
      setTransitioning(false);
    }
  };

  const allowedTransitions: Record<string, string[]> = {
    RETURN_REQUESTED: ['PICKED_UP'],
    PICKED_UP: ['IN_TRANSIT'],
    IN_TRANSIT: ['RECEIVED'],
    RECEIVED: ['INSPECTED'],
    INSPECTED: ['REFUNDED', 'REPLACED'],
    REFUNDED: [],
    REPLACED: []
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
            <span className="text-blue-600 font-bold">Reverse Logistics & Returns</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Reverse Logistics & Return Management Desk
          </h1>
          <p className="text-sm text-slate-500 font-normal mt-0.5">
            Log return requests linked to original shipments/invoices, schedule reverse carriers, and trigger automated ledger credit notes.
          </p>
        </div>

        <button
          onClick={() => setShowIntakeModal(true)}
          className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} /> New Return Intake
        </button>
      </div>

      {/* ── Master Returns Table Card ─────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <RotateCcw size={18} className="text-blue-600" /> Master Return Requests Queue
          </h2>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Return Stages</option>
            <option value="RETURN_REQUESTED">Return Requested</option>
            <option value="PICKED_UP">Picked Up</option>
            <option value="IN_TRANSIT">In Transit to Hub</option>
            <option value="RECEIVED">Received at Hub</option>
            <option value="INSPECTED">Inspected</option>
            <option value="REFUNDED">Refunded (Credit Note Issued)</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-3">Return #</th>
                <th className="p-3">Original Shipment</th>
                <th className="p-3">Linked Invoice</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Return Value</th>
                <th className="p-3">Status Stage</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {returnsList.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50 font-medium">
                  <td className="p-3 font-mono font-bold text-blue-600">{r.returnNumber}</td>
                  <td className="p-3 font-mono text-slate-800 font-bold">{r.shipmentId}</td>
                  <td className="p-3 font-mono text-purple-600 font-bold">{r.invoiceId}</td>
                  <td className="p-3 font-bold text-slate-900">{r.customerName}</td>
                  <td className="p-3">{r.reasonCode?.replace('_', ' ')}</td>
                  <td className="p-3 font-mono font-bold text-slate-900">₹{r.returnValue?.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                      r.status === 'REFUNDED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      r.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                      'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => openDetailModal(r)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow"
                    >
                      Manage Return →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Return Intake Modal ───────────────────────────────────────────── */}
      {showIntakeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">New Return Request Intake</h3>
              <button onClick={() => setShowIntakeModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleIntakeSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Original Shipment Waybill #</label>
                <input
                  type="text"
                  value={shipmentId}
                  onChange={e => setShipmentId(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900"
                  placeholder="SHP-84920"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Original Invoice #</label>
                <input
                  type="text"
                  value={invoiceId}
                  onChange={e => setInvoiceId(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900"
                  placeholder="INV-2026-001"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Return Reason Code</label>
                <select
                  value={reasonCode}
                  onChange={e => setReasonCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900"
                >
                  <option value="WRONG_ITEM">Wrong Item / SKU Mismatch</option>
                  <option value="DAMAGED_CARGO">Damaged Cargo In Transit</option>
                  <option value="CUSTOMER_REFUSAL">Customer Refused Consignment</option>
                  <option value="QUALITY_DISCREPANCY">Quality Spec Discrepancy</option>
                  <option value="OTHER">Other Reason</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Return Item Value (₹)</label>
                <input
                  type="number"
                  value={returnValue}
                  onChange={e => setReturnValue(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Description / Details</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-medium text-slate-900"
                  placeholder="Record SKU discrepancies, pallet counts..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowIntakeModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20">Register Return</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Return Detail & State Machine Workspace Modal ───────────────── */}
      {showDetailModal && selectedReturn && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-2xl space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Return Record: {selectedReturn.returnNumber}</h3>
                <p className="text-xs text-slate-500 font-medium">Waybill: {selectedReturn.shipmentId} · Invoice: {selectedReturn.invoiceId}</p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            {/* Credit Note Banner if Refunded */}
            {selectedReturn.linkedCreditNote && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs text-emerald-900">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-600" /> Credit Note Issued: {selectedReturn.linkedCreditNote.creditNoteNumber}</span>
                  <span className="font-mono font-extrabold text-emerald-700">₹{selectedReturn.linkedCreditNote.amount?.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-emerald-800">Credit note automatically posted to Customer Account Ledger statement.</p>
              </div>
            )}

            {/* Reverse Carrier Assignment Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-purple-600 uppercase tracking-wider">Scheduled Reverse Carrier</span>
                <button onClick={() => setShowPickupModal(true)} className="text-purple-600 font-bold hover:underline">
                  Schedule Pickup →
                </button>
              </div>
              {selectedReturn.reverseCarrier ? (
                <div className="grid grid-cols-2 gap-2 text-slate-800 font-medium">
                  <div>Transporter: <strong>{selectedReturn.reverseCarrier.name}</strong></div>
                  <div>Vehicle Reg: <strong className="font-mono text-blue-600">{selectedReturn.reverseCarrier.vehicleNumber}</strong></div>
                  <div>Driver: <strong>{selectedReturn.reverseCarrier.driverName}</strong></div>
                  <div>Pickup Window: <strong>{new Date(selectedReturn.reverseCarrier.pickupScheduledAt).toLocaleString()}</strong></div>
                </div>
              ) : (
                <p className="text-slate-400">No reverse pickup scheduled.</p>
              )}
            </div>

            {/* State Machine Transition Actions */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <span className="font-extrabold text-blue-600 uppercase tracking-wider block">Return Stage Pipeline</span>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-1 text-center font-bold">
                {['RETURN_REQUESTED', 'PICKED_UP', 'IN_TRANSIT', 'RECEIVED', 'INSPECTED', 'REFUNDED'].map((st, idx) => {
                  const isCurrent = selectedReturn.status === st;
                  const isPassed = selectedReturn.statusHistory.some((h: any) => h.toStatus === st);
                  return (
                    <div
                      key={st}
                      className={`p-2 rounded border text-[10px] ${
                        isCurrent ? 'bg-blue-600 text-white border-blue-600' :
                        isPassed ? 'bg-slate-200 text-slate-800 border-slate-300' :
                        'bg-white text-slate-400 border-slate-200'
                      }`}
                    >
                      {st}
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase">Transition Remarks</label>
                <input
                  type="text"
                  value={transitionRemarks}
                  onChange={e => setTransitionRemarks(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-900"
                  placeholder="Checkpoint inspection remarks..."
                />
              </div>

              <div className="flex gap-2 flex-wrap pt-1">
                {(allowedTransitions[selectedReturn.status] || []).map(nxt => (
                  <button
                    key={nxt}
                    onClick={() => handleTransitionStatus(nxt)}
                    disabled={transitioning}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow transition-all flex items-center gap-1"
                  >
                    Advance to {nxt} <ArrowRight size={13} />
                  </button>
                ))}
              </div>
            </div>

            {/* Audit History Timeline */}
            <div className="space-y-2 text-xs">
              <span className="font-extrabold text-slate-700 uppercase tracking-wider block">Status Transition Audit History</span>
              {(selectedReturn.statusHistory || []).map((h: any, idx: number) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-slate-900">{h.fromStatus} ➔ {h.toStatus}</span>
                    <p className="text-slate-500">{h.remarks}</p>
                  </div>
                  <span className="text-blue-600 font-semibold">{h.updatedBy}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Close Workspace</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Schedule Reverse Pickup Modal ─────────────────────────────────── */}
      {showPickupModal && selectedReturn && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Schedule Reverse Pickup Carrier</h3>
              <button onClick={() => setShowPickupModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleReverseBookingSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Select Vendor Transporter</label>
                <select
                  value={selectedVendorId}
                  onChange={e => setSelectedVendorId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900"
                >
                  {vendorList.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.city})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Scheduled Pickup Date & Time</label>
                <input
                  type="datetime-local"
                  value={pickupDate}
                  onChange={e => setPickupDate(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Vehicle Reg Number</label>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={e => setVehicleNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900"
                  placeholder="e.g. MH-04-AB-1234"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowPickupModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-purple-600 text-white text-xs font-bold shadow-md shadow-purple-600/20">Schedule Pickup</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
