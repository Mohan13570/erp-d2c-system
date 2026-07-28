import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import { employeePortalService } from '../services/employeeApi';
import {
  CalendarDays, Plus, CheckCircle2, Clock, XCircle,
  Users, Check, X, AlertCircle, FileText, Upload, ChevronRight
} from 'lucide-react';

export default function EmployeeLeave() {
  const { user } = useEmployeeAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') === 'team' ? 'team' : 'my';

  const [activeTab, setActiveTab] = useState<'my' | 'team'>(initialTab);
  const [balances, setBalances] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [teamRequests, setTeamRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Leave Modal State
  const [showModal, setShowModal] = useState(false);
  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manager Approval Comment State
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);

  const isManagerOrHR = user?.role === 'manager' || user?.role === 'hr_admin';

  const loadLeaveData = () => {
    setLoading(true);
    employeePortalService.getLeaveBalances()
      .then(res => {
        if (res.data.success) {
          setBalances(res.data.data);
          if (res.data.data.length > 0) setLeaveTypeId(res.data.data[0].leaveTypeId);
        }
      })
      .catch(console.error);

    employeePortalService.getMyLeaveRequests()
      .then(res => {
        if (res.data.success) setMyRequests(res.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    if (isManagerOrHR) {
      employeePortalService.getTeamLeaveRequests()
        .then(res => {
          if (res.data.success) setTeamRequests(res.data.data);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    loadLeaveData();
  }, []);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setApplying(true);

    try {
      await employeePortalService.applyLeave({
        leaveTypeId,
        startDate,
        endDate,
        reason,
        documentUrl: documentUrl || undefined
      });
      setShowModal(false);
      setStartDate('');
      setEndDate('');
      setReason('');
      setDocumentUrl('');
      loadLeaveData();
      alert('Leave application submitted successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to submit leave application');
    } finally {
      setApplying(false);
    }
  };

  const handleActionLeave = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await employeePortalService.approveLeaveRequest(id, status, status === 'REJECTED' ? rejectionReason : undefined);
      setSelectedReqId(null);
      setRejectionReason('');
      loadLeaveData();
      alert(`Leave request ${status.toLowerCase()} successfully`);
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* ── Breadcrumbs & Page Header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Home</span>
            <ChevronRight size={12} />
            <span>Employee Portal</span>
            <ChevronRight size={12} />
            <span className="text-blue-600 font-bold">Leave & Absence</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Leave & Absence Management
          </h1>
          <p className="text-sm text-slate-500 font-normal mt-0.5">
            Apply for leave, track real-time balance gauges, and manage team approval requests.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {isManagerOrHR && (
            <div className="flex bg-slate-200/80 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('my')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'my' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Leaves
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'team' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users size={14} /> Team Approvals
              </button>
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition-all"
          >
            <Plus size={16} /> Apply for Leave
          </button>
        </div>
      </div>

      {activeTab === 'my' ? (
        <>
          {/* ── Leave Balances Grid ────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {balances.map((b, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{b.leaveType.name}</span>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {b.leaveType.code}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <p className="text-3xl font-bold text-slate-900">{b.balance} Days</p>
                  <p className="text-xs text-slate-500 font-medium">Available remaining balance</p>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${Math.min(100, (b.balance / (b.accrued || 12)) * 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1">
                  <span>Accrued: {b.accrued}</span>
                  <span>Used: {b.used}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── My Requests List ────────────────────────────────────────────── */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays size={18} className="text-blue-600" /> My Leave Requests
              </h2>
              <span className="text-xs text-slate-500 font-semibold">{myRequests.length} Applications</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-100">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Type</th>
                    <th className="p-3.5">Start Date</th>
                    <th className="p-3.5">End Date</th>
                    <th className="p-3.5">Total Days</th>
                    <th className="p-3.5">Reason</th>
                    <th className="p-3.5 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myRequests.map((req, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">
                        {req.leaveType?.name || 'Leave'}
                      </td>
                      <td className="p-3.5 font-semibold">{new Date(req.startDate).toLocaleDateString()}</td>
                      <td className="p-3.5 font-semibold">{new Date(req.endDate).toLocaleDateString()}</td>
                      <td className="p-3.5 font-mono font-bold text-blue-600">{req.totalDays} Days</td>
                      <td className="p-3.5 text-slate-500 max-w-xs truncate">{req.reason}</td>
                      <td className="p-3.5">
                        <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : req.status === 'REJECTED'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {myRequests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                        No leave requests submitted yet. Use the button above to apply.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* ── Team Approvals View (Manager / HR) ─────────────────────────── */
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users size={18} className="text-blue-600" /> Team Leave Applications Desk
            </h2>
            <span className="text-xs text-blue-600 font-bold">Manager Desk</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Dates</th>
                  <th className="p-3.5">Duration</th>
                  <th className="p-3.5">Reason</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teamRequests.map((req, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{req.leaveType?.name}</td>
                    <td className="p-3.5 font-semibold">
                      {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-blue-600">{req.totalDays} Days</td>
                    <td className="p-3.5 text-slate-500">{req.reason}</td>
                    <td className="p-3.5">
                      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        req.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {req.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleActionLeave(req.id, 'APPROVED')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleActionLeave(req.id, 'REJECTED')}
                            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Apply Leave Modal ────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Apply for Leave</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={15} /> <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Leave Category</label>
                <select
                  value={leaveTypeId}
                  onChange={e => setLeaveTypeId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                >
                  {balances.map(b => (
                    <option key={b.leaveTypeId} value={b.leaveTypeId}>
                      {b.leaveType.name} ({b.balance} Days Available)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Reason for Absence</label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                  placeholder="State the reason for your leave request..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Supporting Document URL (Optional)</label>
                <input
                  type="text"
                  value={documentUrl}
                  onChange={e => setDocumentUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                  placeholder="https://docs-url.com/medical-certificate.pdf"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
