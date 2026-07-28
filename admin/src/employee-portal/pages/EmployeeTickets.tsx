import React, { useState, useEffect } from 'react';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import { employeePortalService } from '../services/employeeApi';
import {
  HeadphonesIcon, MessageSquare, AlertCircle, Clock, Plus, Search, Filter,
  ChevronRight, ShieldAlert, FileText, CheckCircle2, UserCheck, ShieldCheck,
  Send, Lock, Eye, AlertTriangle, ArrowUpRight, BookOpen, X, Sparkles
} from 'lucide-react';

export default function EmployeeTickets() {
  const { user } = useEmployeeAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [assignedView, setAssignedView] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Ticket Detail Workspace State
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [cannedResponses, setCannedResponses] = useState<any[]>([]);

  // Dual Reply Modes State
  const [replyMode, setReplyMode] = useState<'CUSTOMER_REPLY' | 'INTERNAL_NOTE'>('CUSTOMER_REPLY');
  const [replyText, setReplyText] = useState('');
  const [assigneeEmail, setAssigneeEmail] = useState('');

  // Canned Response Manager Modal
  const [showCannedModal, setShowCannedModal] = useState(false);
  const [newCrCategory, setNewCrCategory] = useState('TRACKING_QUERY');
  const [newCrTitle, setNewCrTitle] = useState('');
  const [newCrText, setNewCrText] = useState('');

  const fetchTickets = () => {
    employeePortalService.getTickets({ category: categoryFilter, assignedView, search })
      .then(res => {
        if (res.data.success) setTickets(res.data.data);
      })
      .catch(console.error);
  };

  const fetchCanned = () => {
    employeePortalService.getCannedResponses()
      .then(res => {
        if (res.data.success) setCannedResponses(res.data.data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      employeePortalService.getTickets(),
      employeePortalService.getCannedResponses()
    ])
      .then(([tckRes, crRes]) => {
        if (tckRes.data.success) setTickets(tckRes.data.data);
        if (crRes.data.success) setCannedResponses(crRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [assignedView, categoryFilter]);

  const openTicketDetail = (ticket: any) => {
    employeePortalService.getTicketDetail(ticket.id)
      .then(res => {
        if (res.data.success) {
          setSelectedTicket(res.data.data.ticket);
          setCannedResponses(res.data.data.cannedResponses || []);
          setAssigneeEmail(res.data.data.ticket.assignedTo || 'Unassigned');
          setShowDetailModal(true);
        }
      })
      .catch(console.error);
  };

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await employeePortalService.postTicketReply(selectedTicket.id, {
        messageType: replyMode,
        text: replyText
      });
      setReplyText('');
      const updated = await employeePortalService.getTicketDetail(selectedTicket.id);
      setSelectedTicket(updated.data.data.ticket);
      fetchTickets();
      alert(replyMode === 'INTERNAL_NOTE' ? 'Internal note added!' : 'Reply sent to customer!');
    } catch (err: any) {
      alert(err.message || 'Failed to post reply');
    }
  };

  const handleAssignTicket = async () => {
    try {
      await employeePortalService.assignTicket(selectedTicket.id, user?.email || 'Aura Agent');
      const updated = await employeePortalService.getTicketDetail(selectedTicket.id);
      setSelectedTicket(updated.data.data.ticket);
      setAssigneeEmail(user?.email || 'Aura Agent');
      fetchTickets();
      alert('Ticket assigned to you!');
    } catch (err: any) {
      alert(err.message || 'Assignment failed');
    }
  };

  const handleRouteToClaim = async () => {
    try {
      const res = await employeePortalService.routeTicketToClaim(selectedTicket.id);
      setSelectedTicket(res.data.data.ticket);
      fetchTickets();
      alert(`Damage report ticket auto-routed to Claims module! Created Claim Record: ${res.data.data.createdClaim.claimNumber}`);
    } catch (err: any) {
      alert(err.message || 'Auto-routing failed');
    }
  };

  const handleEscalateSla = async () => {
    try {
      const res = await employeePortalService.escalateTicketSla(selectedTicket.id);
      setSelectedTicket(res.data.data);
      fetchTickets();
      alert('SLA breached ticket auto-escalated to Senior Operations Manager!');
    } catch (err: any) {
      alert(err.message || 'Escalation failed');
    }
  };

  const handleInsertCannedResponse = (crText: string) => {
    setReplyText(prev => (prev ? `${prev}\n\n${crText}` : crText));
  };

  const handleCreateCannedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeePortalService.createCannedResponse({
        category: newCrCategory,
        title: newCrTitle,
        templateText: newCrText
      });
      setShowCannedModal(false);
      setNewCrTitle('');
      setNewCrText('');
      fetchCanned();
      alert('Canned response template saved!');
    } catch (err: any) {
      alert(err.message || 'Failed to save template');
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
            <span className="text-blue-600 font-bold">Support & Tickets</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Customer Support & SLA Escalation Desk
          </h1>
          <p className="text-sm text-slate-500 font-normal mt-0.5">
            Manage assigned/unassigned support queues, dual reply modes (internal notes vs customer replies), canned response libraries, and auto-route damage reports to Claims.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button
            onClick={() => setShowCannedModal(true)}
            className="px-3.5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20"
          >
            <BookOpen size={15} /> Canned Responses
          </button>
        </div>
      </div>

      {/* ── Views & Filters Toolbar ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
        
        {/* Queue View Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setAssignedView('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${assignedView === 'ALL' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
          >
            All Tickets ({tickets.length})
          </button>

          <button
            onClick={() => setAssignedView('UNASSIGNED')}
            className={`px-3 py-1.5 rounded-lg transition-all ${assignedView === 'UNASSIGNED' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
          >
            Unassigned Queue
          </button>

          <button
            onClick={() => setAssignedView('ASSIGNED_TO_ME')}
            className={`px-3 py-1.5 rounded-lg transition-all ${assignedView === 'ASSIGNED_TO_ME' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
          >
            Assigned Queue
          </button>

          <button
            onClick={() => setAssignedView('OVERDUE_SLA')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${assignedView === 'OVERDUE_SLA' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-600 font-extrabold'}`}
          >
            <AlertTriangle size={13} /> SLA Overdue
          </button>
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700"
        >
          <option value="ALL">All Categories</option>
          <option value="BILLING_QUERY">Billing Query</option>
          <option value="TRACKING_QUERY">Tracking Query</option>
          <option value="COMPLAINT">Complaint</option>
          <option value="DAMAGE_REPORT">Damage Report (Claims)</option>
        </select>

      </div>

      {/* ── Tickets Master Queue Table ────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-3">Ticket #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Waybill #</th>
                <th className="p-3">Category</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Assigned Agent</th>
                <th className="p-3">SLA Countdown</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50 font-medium">
                  <td className="p-3 font-mono font-bold text-blue-600">{t.ticketNumber}</td>
                  <td className="p-3 font-bold text-slate-900">{t.customerName}</td>
                  <td className="p-3 font-mono text-slate-800 font-bold">{t.shipmentId}</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                      t.category === 'DAMAGE_REPORT' ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-slate-100 text-slate-800 border-slate-200'
                    }`}>
                      {t.category?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                      t.priority === 'HIGH' || t.priority === 'URGENT' ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-blue-100 text-blue-800 border-blue-300'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-3 max-w-xs truncate font-bold text-slate-900">{t.subject}</td>
                  <td className="p-3 font-medium text-slate-600">{t.assignedTo}</td>
                  <td className="p-3">
                    {t.isSlaBreached || t.slaHoursRemaining <= 0 ? (
                      <span className="text-[10px] font-extrabold text-rose-600 flex items-center gap-1">
                        <AlertTriangle size={13} /> SLA Breached ({Math.abs(t.slaHoursRemaining)}h ago)
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <Clock size={13} /> {t.slaHoursRemaining}h remaining
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                      t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      t.status === 'ROUTED_TO_CLAIMS' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                      t.status === 'ESCALATED' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                      'bg-blue-100 text-blue-800 border-blue-300'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => openTicketDetail(t)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow"
                    >
                      Open Ticket →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Ticket Detail Workspace Modal (Dual Reply Modes & Claims Auto-Routing) ── */}
      {showDetailModal && selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-3xl space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            {/* Header Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Ticket {selectedTicket.ticketNumber}: {selectedTicket.subject}</h3>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                    selectedTicket.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-blue-100 text-blue-800 border-blue-300'
                  }`}>
                    {selectedTicket.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Customer: {selectedTicket.customerName} ({selectedTicket.customerEmail}) · Waybill: {selectedTicket.shipmentId}
                </p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            {/* SLA Escalation & Claims Auto-Routing Actions Toolbar */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Assigned To: {selectedTicket.assignedTo}</span>
                {selectedTicket.assignedTo === 'Unassigned' && (
                  <button onClick={handleAssignTicket} className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded shadow">
                    Assign To Me
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Auto-Route Damage Report to Claims Button */}
                {selectedTicket.category === 'DAMAGE_REPORT' && !selectedTicket.linkedClaimId && (
                  <button
                    onClick={handleRouteToClaim}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded shadow flex items-center gap-1.5 shadow-rose-600/20"
                  >
                    <ShieldAlert size={14} /> Auto-Route to Claims Module
                  </button>
                )}
                {selectedTicket.linkedClaimId && (
                  <span className="font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded border border-purple-300 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Claims Linked: {selectedTicket.linkedClaimId}
                  </span>
                )}

                {/* SLA Escalation Button */}
                {selectedTicket.isSlaBreached && !selectedTicket.isEscalated && (
                  <button
                    onClick={handleEscalateSla}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded shadow flex items-center gap-1"
                  >
                    <AlertTriangle size={14} /> Escalate to Manager
                  </button>
                )}
              </div>
            </div>

            {/* Conversation Timeline */}
            <div className="space-y-3 max-h-72 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
              {(selectedTicket.messages || []).map((m: any, idx: number) => {
                const isInternal = m.type === 'INTERNAL_NOTE';
                const isCustomer = m.type === 'CUSTOMER_REPLY';

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border space-y-1.5 ${
                      isInternal ? 'bg-amber-50/90 border-amber-200 text-amber-950' :
                      isCustomer ? 'bg-white border-slate-200 text-slate-900' :
                      'bg-blue-50/90 border-blue-200 text-blue-950'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        {isInternal ? <Lock size={13} className="text-amber-600" /> : <Eye size={13} className="text-blue-600" />}
                        {m.author}
                        {isInternal && <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-extrabold uppercase ml-1">Internal Note (Staff Only)</span>}
                        {!isInternal && !isCustomer && <span className="text-[9px] bg-blue-200 text-blue-900 px-1.5 py-0.5 rounded font-extrabold uppercase ml-1">Customer Visible Reply</span>}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{new Date(m.timestamp).toLocaleString()}</span>
                    </div>

                    <p className="font-medium whitespace-pre-wrap">{m.text}</p>
                  </div>
                );
              })}
            </div>

            {/* Dual Reply Mode Input Box */}
            <form onSubmit={handlePostReply} className="space-y-3 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                
                {/* Mode Selector Toggle */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setReplyMode('CUSTOMER_REPLY')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                      replyMode === 'CUSTOMER_REPLY' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    <Eye size={14} /> Customer-Visible Reply
                  </button>

                  <button
                    type="button"
                    onClick={() => setReplyMode('INTERNAL_NOTE')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                      replyMode === 'INTERNAL_NOTE' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    <Lock size={14} /> Internal Agent Note (Private)
                  </button>
                </div>

                {/* Quick Canned Response Inserter */}
                <select
                  onChange={e => { if (e.target.value) handleInsertCannedResponse(e.target.value); }}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-purple-700"
                >
                  <option value="">+ Insert Canned Response Template</option>
                  {cannedResponses.map(cr => (
                    <option key={cr.id} value={cr.templateText}>{cr.title}</option>
                  ))}
                </select>
              </div>

              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                rows={3}
                required
                className={`w-full p-3 rounded-xl border text-xs font-medium focus:ring-2 outline-none transition-all ${
                  replyMode === 'INTERNAL_NOTE'
                    ? 'bg-amber-50/50 border-amber-200 focus:ring-amber-400 text-amber-950 placeholder-amber-400'
                    : 'bg-slate-50 border-slate-200 focus:ring-blue-400 text-slate-900 placeholder-slate-400'
                }`}
                placeholder={replyMode === 'INTERNAL_NOTE' ? 'Record internal private investigation notes (hidden from customer)...' : 'Type reply message to be delivered to customer...'}
              />

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowDetailModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Close</button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-lg text-white text-xs font-bold flex items-center gap-2 shadow-md ${
                    replyMode === 'INTERNAL_NOTE' ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                  }`}
                >
                  <Send size={14} /> {replyMode === 'INTERNAL_NOTE' ? 'Add Internal Note' : 'Send Customer Reply'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ── Canned Response Template Manager Modal ──────────────────────── */}
      {showCannedModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Canned Response Template Manager</h3>
              <button onClick={() => setShowCannedModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleCreateCannedSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Category</label>
                <select
                  value={newCrCategory}
                  onChange={e => setNewCrCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900"
                >
                  <option value="TRACKING_QUERY">Tracking Query</option>
                  <option value="BILLING_QUERY">Billing Query</option>
                  <option value="DAMAGE_REPORT">Damage Report</option>
                  <option value="GENERAL">General Support</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Template Title</label>
                <input
                  type="text"
                  value={newCrTitle}
                  onChange={e => setNewCrTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900"
                  placeholder="e.g. Standard Customs Clearance Delay"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Template Content Text</label>
                <textarea
                  value={newCrText}
                  onChange={e => setNewCrText(e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-medium text-slate-900"
                  placeholder="Dear Customer, your shipment is held at customs for..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCannedModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-purple-600 text-white text-xs font-bold shadow-md shadow-purple-600/20">Save Template</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
