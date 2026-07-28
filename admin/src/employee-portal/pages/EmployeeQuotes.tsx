import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import { employeePortalService } from '../services/employeeApi';
import {
  FileText, Plus, Search, Filter, Calculator, CheckCircle2,
  Clock, AlertTriangle, Send, XCircle, ShieldAlert, DollarSign,
  TrendingUp, Table, Eye, X, ThumbsUp, ThumbsDown
} from 'lucide-react';

export default function EmployeeQuotes() {
  const { user } = useEmployeeAuth();
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState<any[]>([]);
  const [rateCards, setRateCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFinancialRole, setIsFinancialRole] = useState(false);

  // Active Main Tab State ('quotations' | 'rfq' | 'calculator')
  const [activeTab, setActiveTab] = useState<'quotations' | 'rfq' | 'calculator'>('quotations');

  // Filters State
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Rate Card Search State
  const [rateCardSearch, setRateCardSearch] = useState('');
  const [rateCardMode, setRateCardMode] = useState('ALL');

  // Manual Quote Builder Modal State
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [mode, setMode] = useState('Road FTL');
  const [weight, setWeight] = useState('1,500 kg');
  const [specialHandling, setSpecialHandling] = useState('');
  const [proposedPrice, setProposedPrice] = useState('150000');
  const [internalCost, setInternalCost] = useState('105000');
  const [discountPercentage, setDiscountPercentage] = useState('10');
  const [builderLoading, setBuilderLoading] = useState(false);

  // Manager Approval Modal State
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [approvalAction, setApprovalAction] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [approvalComments, setApprovalComments] = useState('');

  // Conversion Modal State
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [conversionType, setConversionType] = useState<'WON' | 'LOST'>('WON');
  const [winReason, setWinReason] = useState('Competitive pricing & SLA assurance');
  const [lossReasonCode, setLossReasonCode] = useState('PRICE_TOO_HIGH');
  const [lossRemarks, setLossRemarks] = useState('');

  const fetchQuotes = () => {
    setLoading(true);
    employeePortalService.getQuotes({ status: statusFilter, search })
      .then(res => {
        if (res.data.success) {
          setQuotes(res.data.data.quotes);
          setRateCards(res.data.data.rateCards || []);
          setIsFinancialRole(res.data.data.isFinancialRole);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuotes();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuotes();
  };

  // Live Margin Calculation inside Calculator
  const priceNum = parseFloat(proposedPrice) || 0;
  const costNum = parseFloat(internalCost) || 0;
  const discountNum = parseFloat(discountPercentage) || 0;
  const marginNum = priceNum - costNum;
  const marginPct = priceNum > 0 ? ((marginNum / priceNum) * 100).toFixed(1) : '0';
  const requiresApproval = discountNum > 15;

  const handleCreateQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBuilderLoading(true);

    try {
      const res = await employeePortalService.createManualQuote({
        customerName,
        customerEmail,
        customerPhone,
        origin,
        destination,
        mode,
        weight,
        specialHandling,
        proposedPrice,
        internalCost,
        discountPercentage
      });
      setShowBuilderModal(false);
      fetchQuotes();
      alert(`Quote created successfully! ${res.data.data.status === 'PENDING_APPROVAL' ? 'Discount > 15%: Sent to manager for approval.' : 'Auto-approved.'}`);
    } catch (err: any) {
      alert(err.message || 'Failed to create quote');
    } finally {
      setBuilderLoading(false);
    }
  };

  const handleApprovalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeePortalService.approveQuote(selectedQuote.id, {
        action: approvalAction,
        comments: approvalComments
      });
      setShowApproveModal(false);
      setApprovalComments('');
      fetchQuotes();
      alert(`Quote ${approvalAction === 'APPROVE' ? 'Approved' : 'Rejected'}!`);
    } catch (err: any) {
      alert(err.message || 'Approval action failed');
    }
  };

  const handleConversionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (conversionType === 'WON') {
        const res = await employeePortalService.convertQuoteToBooking(selectedQuote.id, { winReason });
        alert(`Quote WON! Converted to active shipment booking: ${res.data.data.shipment.shipmentNumber}`);
      } else {
        await employeePortalService.markQuoteLost(selectedQuote.id, { lossReasonCode, remarks: lossRemarks });
        alert('Quote marked as LOST.');
      }
      setShowConversionModal(false);
      fetchQuotes();
    } catch (err: any) {
      alert(err.message || 'Conversion action failed');
    }
  };

  const handleSendQuote = async (quoteId: string) => {
    try {
      await employeePortalService.sendQuoteToCustomer(quoteId);
      fetchQuotes();
      alert(`Proposal email sent to customer!`);
    } catch (err: any) {
      alert(err.message || 'Failed to send quote');
    }
  };

  // Filtered Rate Cards
  const filteredRateCards = rateCards.filter(c => {
    const matchMode = rateCardMode === 'ALL' || c.mode.toLowerCase().includes(rateCardMode.toLowerCase());
    const matchSearch = !rateCardSearch || c.origin.toLowerCase().includes(rateCardSearch.toLowerCase()) || c.destination.toLowerCase().includes(rateCardSearch.toLowerCase());
    return matchMode && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* ── Page Header (Exact Image Design) ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sales &amp; Quotations
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Manage RFQs, Air/Ocean Freight Quotes, and Margin Approvals.
          </p>
        </div>

        <button
          onClick={() => setShowBuilderModal(true)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Plus size={16} /> Add Quote
        </button>
      </div>

      {/* ── 3 Main Feature Tabs Bar (Exact Image Design) ───────────────────── */}
      <div className="bg-slate-100/90 p-1.5 rounded-2xl flex items-center gap-2 w-fit border border-slate-200/50">
        <button
          onClick={() => setActiveTab('rfq')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'rfq'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText size={15} />
          <span>RFQ Management</span>
        </button>

        <button
          onClick={() => setActiveTab('quotations')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'quotations'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 size={15} />
          <span>Quotations</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'calculator'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calculator size={15} />
          <span>Margin Calculator</span>
        </button>
      </div>

      {/* ── 1. QUOTATIONS TAB (Default View - Matching Image Table Columns) ──── */}
      {activeTab === 'quotations' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden space-y-0">
          
          {/* Table Header Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by Quote #, Customer, Route..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </form>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold focus:outline-none focus:border-indigo-500 self-end sm:self-auto"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="SENT">Sent to Customer</option>
              <option value="WON">Won (Converted)</option>
              <option value="LOST">Lost</option>
            </select>
          </div>

          {/* Table Columns (Exact Image Match: QUOTE ID, RFQ ROUTE, TOTAL VALUE, STATUS, APPROVALS, ACTIONS) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/70 text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">QUOTE ID</th>
                  <th className="py-3.5 px-6">RFQ ROUTE</th>
                  <th className="py-3.5 px-6">TOTAL VALUE</th>
                  <th className="py-3.5 px-6">STATUS</th>
                  <th className="py-3.5 px-6">APPROVALS</th>
                  <th className="py-3.5 px-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotes.map((q, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-indigo-600">
                      {q.quoteNumber}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-900">
                      <div className="font-semibold">{q.lane}</div>
                      <div className="text-slate-400 text-[10px]">{q.mode} · {q.weight}</div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      ₹{q.proposedPrice?.toLocaleString()}
                      {q.marginPercentage && (
                        <div className="text-[10px] text-emerald-600 font-bold">Margin: {q.marginPercentage}</div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        q.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        q.status === 'PENDING_APPROVAL' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        q.status === 'SENT' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        q.status === 'WON' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[11px] font-medium text-slate-600">
                      {q.approver}
                    </td>
                    <td className="py-4 px-6 text-right space-x-1.5">
                      {q.status === 'PENDING_APPROVAL' && (user?.role === 'manager' || user?.role === 'hr_admin') && (
                        <button
                          onClick={() => { setSelectedQuote(q); setShowApproveModal(true); }}
                          className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-300 font-bold hover:bg-amber-100"
                        >
                          Sign-off
                        </button>
                      )}
                      {q.status === 'APPROVED' && (
                        <button
                          onClick={() => handleSendQuote(q.id)}
                          className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold hover:bg-blue-100"
                        >
                          Send
                        </button>
                      )}
                      {q.status === 'SENT' && (
                        <button
                          onClick={() => { setSelectedQuote(q); setConversionType('WON'); setShowConversionModal(true); }}
                          className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                        >
                          Convert
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {quotes.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400 font-semibold text-xs">
                      No quotations found. Click "+ Add Quote" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 2. RFQ MANAGEMENT TAB (SLA Queue & Urgency) ───────────────────── */}
      {activeTab === 'rfq' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock size={18} className="text-amber-600" /> Incoming RFQ Queue (SLA Urgency)
            </h2>
            <span className="text-xs text-slate-500 font-semibold">{quotes.length} Open Requests</span>
          </div>

          <div className="space-y-3">
            {quotes.map((q, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs space-y-1">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{q.quoteNumber}: {q.customerName}</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                      SLA: {q.slaTimeRemaining || '24 Hours'}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium">{q.lane} · Mode: {q.mode} · Weight: {q.weight}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-bold text-slate-900 text-sm">₹{q.proposedPrice?.toLocaleString()}</p>
                  <button
                    onClick={() => { setSelectedQuote(q); setShowApproveModal(true); }}
                    className="px-3 py-1 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
                  >
                    Process RFQ
                  </button>
                </div>
              </div>
            ))}

            {quotes.length === 0 && (
              <div className="py-12 text-center text-slate-400 font-semibold text-xs">
                No incoming RFQs in queue.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 3. MARGIN CALCULATOR TAB (Live Calculator & Rate Cards) ───────── */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Live Calculator Form */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Calculator size={18} className="text-indigo-600" /> Live Margin Calculator
            </h2>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 uppercase text-[10px]">Internal Cost (₹)</label>
                  <input
                    type="number"
                    value={internalCost}
                    onChange={e => setInternalCost(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase text-[10px]">Proposed Price (₹)</label>
                  <input
                    type="number"
                    value={proposedPrice}
                    onChange={e => setProposedPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase text-[10px]">Discount Percentage (%)</label>
                <input
                  type="number"
                  value={discountPercentage}
                  onChange={e => setDiscountPercentage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-900"
                />
              </div>

              {/* Calculated Outputs */}
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Gross Margin Amount:</span>
                  <span className="text-emerald-600 font-mono text-sm">₹{marginNum.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Margin Percentage:</span>
                  <span className="text-emerald-600 font-mono text-sm">{marginPct}%</span>
                </div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 pt-1 border-t border-indigo-100">
                  <span>Approval Rule Check:</span>
                  <span className={requiresApproval ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>
                    {requiresApproval ? 'Requires Manager Sign-off (>15%)' : 'Auto-Approved (≤15%)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rate Cards Lookup Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Table size={18} className="text-blue-600" /> Standard Rate Card Lookup
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                value={rateCardSearch}
                onChange={e => setRateCardSearch(e.target.value)}
                placeholder="Search origin or destination..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
              />

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredRateCards.map((rc, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900">{rc.origin} ➔ {rc.destination}</p>
                      <p className="text-[10px] text-slate-500">{rc.mode} · {rc.weightSlab}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-indigo-600">₹{rc.stdRate?.toLocaleString()}</p>
                      <p className="text-[10px] text-emerald-600 font-bold">Margin: {rc.margin}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── Add Quote Modal (Manual Quote Builder) ────────────────────────── */}
      {showBuilderModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-xl space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Manual Freight Quote Builder</h3>
              <button onClick={() => setShowBuilderModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleCreateQuoteSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Customer Name / Enterprise</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 font-medium"
                  placeholder="e.g. Apex Pharma Healthcare Ltd"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Origin Terminal</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={e => setOrigin(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 font-medium"
                    placeholder="e.g. Mumbai JNPT"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Destination Hub</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 font-medium"
                    placeholder="e.g. Delhi NCR Hub"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Internal Cost (₹)</label>
                  <input
                    type="number"
                    value={internalCost}
                    onChange={e => setInternalCost(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Proposed Price (₹)</label>
                  <input
                    type="number"
                    value={proposedPrice}
                    onChange={e => setProposedPrice(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBuilderModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={builderLoading}
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700"
                >
                  {builderLoading ? 'Building...' : 'Create Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Approval Modal ────────────────────────────────────────────────── */}
      {showApproveModal && selectedQuote && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Manager Sign-off: {selectedQuote.quoteNumber}</h3>
              <button onClick={() => setShowApproveModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleApprovalSubmit} className="space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setApprovalAction('APPROVE')}
                  className={`flex-1 py-2 rounded-lg font-bold text-xs ${approvalAction === 'APPROVE' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  Approve Discount
                </button>
                <button
                  type="button"
                  onClick={() => setApprovalAction('REJECT')}
                  className={`flex-1 py-2 rounded-lg font-bold text-xs ${approvalAction === 'REJECT' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  Reject Proposal
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Comments / Audit Note</label>
                <textarea
                  value={approvalComments}
                  onChange={e => setApprovalComments(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                  placeholder="Manager sign-off note..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowApproveModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20">Submit Action</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Conversion Modal (WON / LOST) ─────────────────────────────────── */}
      {showConversionModal && selectedQuote && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Quote Outcome: {selectedQuote.quoteNumber}</h3>
              <button onClick={() => setShowConversionModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleConversionSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Outcome Reason Code</label>
                <input
                  type="text"
                  value={winReason}
                  onChange={e => setWinReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold"
                  placeholder="e.g. Competitive pricing & SLA assurance"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowConversionModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20">Convert to Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
