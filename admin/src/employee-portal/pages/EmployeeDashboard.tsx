import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import { employeePortalService } from '../services/employeeApi';
import {
  Clock, AlertTriangle, CheckCircle2, Truck, Package,
  DollarSign, Plus, UserCheck, FileCheck, X, ChevronRight,
  TrendingUp, ArrowUpRight, ShieldCheck, Activity
} from 'lucide-react';

export default function EmployeeDashboard() {
  const { user } = useEmployeeAuth();
  const [loading, setLoading] = useState(true);
  const [opsData, setOpsData] = useState<any>(null);

  // Quick Action Modal States
  const [activeModal, setActiveModal] = useState<'create_booking' | 'assign_ticket' | 'approve_quote' | 'alert_detail' | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // Form Inputs
  const [bookingOrigin, setBookingOrigin] = useState('');
  const [bookingDestination, setBookingDestination] = useState('');
  const [bookingWeight, setBookingWeight] = useState('');
  const [ticketId, setTicketId] = useState('TKT-9482');
  const [assigneeAgent, setAssigneeAgent] = useState('Aura Employee');
  const [quoteId, setQuoteId] = useState('Q-901');

  useEffect(() => {
    employeePortalService.getOpsSummary()
      .then(opsRes => {
        if (opsRes.data.success) setOpsData(opsRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCreateBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`New Freight Booking created! Waybill: WB-${Math.floor(100000 + Math.random() * 900000)}`);
    setActiveModal(null);
    setBookingOrigin('');
    setBookingDestination('');
    setBookingWeight('');
  };

  const handleAssignTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Ticket ${ticketId} assigned to agent ${assigneeAgent}!`);
    setActiveModal(null);
  };

  const handleApproveQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Quote ${quoteId} approved and converted to active freight booking!`);
    setActiveModal(null);
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-10 w-64 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200" />)}
        </div>
      </div>
    );
  }

  const ops = opsData?.opsOverview || {
    inTransit: { count: 0 },
    pendingPickup: { count: 0 },
    delayedToday: { count: 0 },
    deliveredToday: { count: 0 }
  };

  const alerts = opsData?.alerts || [];
  const taskQueue = opsData?.taskQueue || [];
  const financials = opsData?.financials || { isAccessible: false };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* ── Breadcrumbs & Page Header (Image 1 Premium Style) ─────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium mb-1">
            <span>Home</span>
            <span>&gt;</span>
            <span>Logistics</span>
            <span>&gt;</span>
            <span className="text-blue-600 font-semibold">Dashboard</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Logistics Operations Control Center
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Real-time overview of active freight, operational alerts, pending queues, and financial snapshots.
          </p>
        </div>

        {/* Action Controls & Quick Action Pills */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
            <Clock size={15} className="text-slate-500" />
            <span>Last 6 Months</span>
          </button>

          <button
            onClick={() => setActiveModal('create_booking')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus size={14} /> Create Booking
          </button>

          <button
            onClick={() => setActiveModal('assign_ticket')}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5"
          >
            <UserCheck size={14} /> Assign Ticket
          </button>

          <button
            onClick={() => setActiveModal('approve_quote')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <FileCheck size={14} /> Approve Quote
          </button>
        </div>
      </div>

      {/* ── Top 4 KPI Stat Cards Row (Image 1 UI Design + Watermarks + Dark 4th Card) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: IN TRANSIT */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between h-32 hover:shadow-md transition-all group">
          <div>
            <div className="flex items-center gap-1.5 text-blue-600 mb-2">
              <Truck size={15} />
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">IN TRANSIT</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{ops.inTransit.count}</p>
          </div>
          <p className="text-xs text-slate-400 font-medium">Current active in transit</p>
          {/* Large Watermark Icon */}
          <div className="absolute -right-3 -bottom-3 opacity-[0.08] group-hover:opacity-15 transition-all pointer-events-none text-blue-600">
            <Truck size={110} />
          </div>
        </div>

        {/* Card 2: PENDING PICKUP */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between h-32 hover:shadow-md transition-all group">
          <div>
            <div className="flex items-center gap-1.5 text-blue-600 mb-2">
              <Package size={15} />
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">PENDING PICKUP</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{ops.pendingPickup.count}</p>
          </div>
          <p className="text-xs text-slate-400 font-medium">Awaiting driver pickup</p>
          {/* Large Watermark Icon */}
          <div className="absolute -right-3 -bottom-3 opacity-[0.08] group-hover:opacity-15 transition-all pointer-events-none text-amber-600">
            <Package size={110} />
          </div>
        </div>

        {/* Card 3: DELAYED TODAY */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between h-32 hover:shadow-md transition-all group">
          <div>
            <div className="flex items-center gap-1.5 text-blue-600 mb-2">
              <AlertTriangle size={15} />
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">DELAYED TODAY</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{ops.delayedToday.count}</p>
          </div>
          <p className="text-xs text-slate-400 font-medium">Exceptions flagged</p>
          {/* Large Watermark Icon */}
          <div className="absolute -right-3 -bottom-3 opacity-[0.08] group-hover:opacity-15 transition-all pointer-events-none text-rose-600">
            <AlertTriangle size={110} />
          </div>
        </div>

        {/* Card 4: DELIVERED TODAY (Dark Navy UI from Image 1!) */}
        <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between h-32 text-white hover:shadow-md transition-all group">
          <div>
            <div className="flex items-center gap-1.5 text-blue-400 mb-2">
              <CheckCircle2 size={15} />
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">DELIVERED TODAY</span>
            </div>
            <p className="text-3xl font-bold text-white tracking-tight">{ops.deliveredToday.count}</p>
          </div>
          <p className="text-xs text-slate-400 font-medium">Completed deliveries today</p>
          {/* Large Watermark Icon */}
          <div className="absolute -right-3 -bottom-3 opacity-20 group-hover:opacity-30 transition-all pointer-events-none text-blue-400">
            <CheckCircle2 size={110} />
          </div>
        </div>

      </div>

      {/* ── Main Content Grid (Image 1 Layout Structure + Image 2 Content) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width) - Alerts & Financial Overview */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Operational Alerts & Incidents */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle size={17} className="text-rose-600" /> Operational Alerts &amp; Incidents
              </h2>
              <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2.5 py-0.5 rounded-full border border-rose-200">
                {alerts.length} Active
              </span>
            </div>

            {alerts.length > 0 ? (
              <div className="space-y-2.5">
                {alerts.map((alt: any) => (
                  <div
                    key={alt.id}
                    onClick={() => {
                      setSelectedRecord(alt);
                      setActiveModal('alert_detail');
                    }}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs cursor-pointer hover:border-blue-400 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                        alt.severity === 'critical' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                        alt.severity === 'high' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                        'bg-blue-100 text-blue-800 border-blue-300'
                      }`}>
                        {alt.severity}
                      </span>
                      <span className="font-bold text-slate-900">{alt.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{alt.timestamp}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-slate-200/80 rounded-xl bg-slate-50/40 p-8 flex items-center justify-center min-h-[140px]">
                <p className="text-xs font-bold text-slate-400">No active incidents or operational alerts.</p>
              </div>
            )}
          </div>

          {/* Revenue & Financial Snapshot (Matching Image 1 Chart Container Style) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <DollarSign size={17} className="text-emerald-600" /> Revenue &amp; Financial Snapshot
              </h2>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span> Revenue
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block"></span> Expenses
                </span>
              </div>
            </div>

            {financials.isAccessible ? (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Outstanding Receivables</span>
                  <p className="text-xl font-bold text-slate-900">{financials.formattedReceivables || '₹0'}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider">Overdue Invoices</span>
                  <p className="text-xl font-bold text-rose-600">{financials.overdueInvoicesCount || 0} Invoices</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">Today's Collections</span>
                  <p className="text-xl font-bold text-emerald-600">{financials.formattedCollections || '₹0'}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider">Avg Resolution Time</span>
                  <p className="text-xl font-bold text-slate-900">0 Hours</p>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-slate-200/80 rounded-xl bg-slate-50/40 p-8 flex items-center justify-center min-h-[140px]">
                <p className="text-xs font-bold text-slate-400">{financials.message}</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (1/3 width) - Pending Task Queue */}
        <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock size={17} className="text-blue-600" /> Pending Task Queue
              </h2>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">ACTION NEEDED</span>
            </div>

            <div className="space-y-3.5 pt-3">
              {/* Quotes Pending Approval */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Quotes Pending Approval</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      {taskQueue.find((t: any) => t.type === 'quotes_pending')?.count || 0}
                    </span>
                  </div>
                  <Link to="/admin/hr-portal/quotes" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5">
                    View All &rarr;
                  </Link>
                </div>

                {(taskQueue.find((t: any) => t.type === 'quotes_pending')?.items || []).map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200/60 text-xs">
                    <span className="text-slate-800 font-semibold">{item.id}: {item.name}</span>
                    <span className="text-blue-600 font-bold">{item.amount}</span>
                  </div>
                ))}
              </div>

              {/* Claims Pending Review */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Claims Pending Review</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      {taskQueue.find((t: any) => t.type === 'claims_pending')?.count || 0}
                    </span>
                  </div>
                  <Link to="/admin/hr-portal/claims" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5">
                    View All &rarr;
                  </Link>
                </div>

                {(taskQueue.find((t: any) => t.type === 'claims_pending')?.items || []).map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200/60 text-xs">
                    <span className="text-slate-800 font-semibold">{item.id}: {item.name}</span>
                    <span className="text-blue-600 font-bold">{item.amount}</span>
                  </div>
                ))}
              </div>

              {/* Unassigned / Overdue Tickets */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Unassigned / Overdue Tickets</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      {taskQueue.find((t: any) => t.type === 'tickets_overdue')?.count || 0}
                    </span>
                  </div>
                  <Link to="/admin/hr-portal/support" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5">
                    View All &rarr;
                  </Link>
                </div>

                {(taskQueue.find((t: any) => t.type === 'tickets_overdue')?.items || []).map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200/60 text-xs">
                    <span className="text-slate-800 font-semibold">{item.id}: {item.name}</span>
                    <span className="text-rose-600 font-bold">{item.priority}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── Quick Action Modals ──────────────────────────────────────────── */}
      
      {/* 1. Create Booking Modal */}
      {activeModal === 'create_booking' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create New Freight Booking</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleCreateBookingSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Origin Terminal</label>
                  <input
                    type="text"
                    value={bookingOrigin}
                    onChange={e => setBookingOrigin(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900"
                    placeholder="Mumbai Terminal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Destination Hub</label>
                  <input
                    type="text"
                    value={bookingDestination}
                    onChange={e => setBookingDestination(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900"
                    placeholder="Delhi Hub"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Cargo Weight &amp; Details</label>
                <input
                  type="text"
                  value={bookingWeight}
                  onChange={e => setBookingWeight(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900"
                  placeholder="e.g. 2,400 kg · 4 Pallets"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20">Generate Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Assign Ticket Modal */}
      {activeModal === 'assign_ticket' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Assign Support Ticket</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleAssignTicketSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Select Ticket</label>
                <select
                  value={ticketId}
                  onChange={e => setTicketId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-bold"
                >
                  <option value="TKT-9482">TKT-9482: Container Seals Mismatch Query</option>
                  <option value="TKT-739102">TKT-739102: Demurrage Audit Request</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Assignee Agent</label>
                <select
                  value={assigneeAgent}
                  onChange={e => setAssigneeAgent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-bold"
                >
                  <option value="Aura Employee">Aura Employee</option>
                  <option value="Mohan Manager">Mohan Manager</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-purple-600 text-white text-xs font-bold shadow-md shadow-purple-600/20">Assign Agent</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Approve Quote Modal */}
      {activeModal === 'approve_quote' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Approve Freight Quote</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleApproveQuoteSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Select Quote</label>
                <select
                  value={quoteId}
                  onChange={e => setQuoteId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-bold"
                >
                  <option value="Q-901">Q-901: Freight Quote - Pharma Cold Chain (₹2,40,000)</option>
                  <option value="Q-902">Q-902: Heavy Machinery Transport Quote (₹5,80,000)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20">Approve &amp; Convert</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Alert Detail Modal */}
      {activeModal === 'alert_detail' && selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Incident Detail: {selectedRecord.recordId}</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Alert Title</span>
                <span className="font-bold text-slate-900">{selectedRecord.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Severity</span>
                <span className="font-bold uppercase text-rose-600">{selectedRecord.severity}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 text-slate-700 font-medium">
                {selectedRecord.description}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold">Close Detail</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
