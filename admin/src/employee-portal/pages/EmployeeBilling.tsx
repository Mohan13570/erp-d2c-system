import React, { useState, useEffect } from 'react';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import { employeePortalService } from '../services/employeeApi';
import {
  Wallet, DollarSign, AlertCircle, Clock, Plus, Search, Filter,
  ChevronRight, ShieldAlert, FileText, CheckCircle2, RefreshCw, X,
  ArrowUpRight, ShieldCheck, UserCheck, Calendar, ArrowDownRight, Scale, CreditCard
} from 'lucide-react';

export default function EmployeeBilling() {
  const { user } = useEmployeeAuth();
  const [activeTab, setActiveTab] = useState<'invoices' | 'credit' | 'reconciliation' | 'disputes' | 'ledger' | 'recurring'>('invoices');
  const [loading, setLoading] = useState(true);

  // Invoices List State
  const [invoices, setInvoices] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [showManualInvModal, setShowManualInvModal] = useState(false);
  const [manualCustomer, setManualCustomer] = useState('');
  const [manualWaybill, setManualWaybill] = useState('');
  const [manualAmount, setManualAmount] = useState('125000');
  const [manualDueDate, setManualDueDate] = useState('2026-08-15');
  const [manualDesc, setManualDesc] = useState('');

  // Credit Control Dashboard State
  const [creditData, setCreditData] = useState<any>(null);

  // Payment Reconciliation State
  const [showReconcileModal, setShowReconcileModal] = useState(false);
  const [recInvoiceNum, setRecInvoiceNum] = useState('');
  const [recAmount, setRecAmount] = useState('');
  const [recRef, setRecRef] = useState('');
  const [recMethod, setRecMethod] = useState('NEFT / RTGS Bank Transfer');

  // Dispute Queue State
  const [disputes, setDisputes] = useState<any[]>([]);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [resAction, setResAction] = useState('WAIVE');
  const [resNote, setResNote] = useState('');
  const [revisedAmt, setRevisedAmt] = useState('');

  // Customer Ledger State
  const [selectedCustomerForLedger, setSelectedCustomerForLedger] = useState('Aura Consumer Tech Ltd');
  const [ledgerData, setLedgerData] = useState<any>(null);

  // Recurring Billing State
  const [recurringContracts, setRecurringContracts] = useState<any[]>([]);
  const [showContractModal, setShowContractModal] = useState(false);
  const [recCustomer, setRecCustomer] = useState('');
  const [recCycle, setRecCycle] = useState('Monthly (1st of month)');
  const [recRetainer, setRecRetainer] = useState('450000');
  const [recWaybills, setRecWaybills] = useState('Up to 25 FTL Express Shipments');

  const fetchInvoices = () => {
    employeePortalService.getBillingInvoices({ status: statusFilter, search })
      .then(res => {
        if (res.data.success) setInvoices(res.data.data);
      })
      .catch(console.error);
  };

  const fetchCreditControl = () => {
    employeePortalService.getCreditControlDashboard()
      .then(res => {
        if (res.data.success) setCreditData(res.data.data);
      })
      .catch(console.error);
  };

  const fetchDisputes = () => {
    employeePortalService.getDisputesQueue()
      .then(res => {
        if (res.data.success) setDisputes(res.data.data);
      })
      .catch(console.error);
  };

  const fetchLedger = (custName: string) => {
    employeePortalService.getCustomerLedger(custName)
      .then(res => {
        if (res.data.success) setLedgerData(res.data.data);
      })
      .catch(console.error);
  };

  const fetchRecurring = () => {
    employeePortalService.getRecurringContracts()
      .then(res => {
        if (res.data.success) setRecurringContracts(res.data.data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      employeePortalService.getBillingInvoices(),
      employeePortalService.getCreditControlDashboard(),
      employeePortalService.getDisputesQueue(),
      employeePortalService.getCustomerLedger(selectedCustomerForLedger),
      employeePortalService.getRecurringContracts()
    ])
      .then(([invRes, credRes, dispRes, ledgRes, recRes]) => {
        if (invRes.data.success) setInvoices(invRes.data.data);
        if (credRes.data.success) setCreditData(credRes.data.data);
        if (dispRes.data.success) setDisputes(dispRes.data.data);
        if (ledgRes.data.success) setLedgerData(ledgRes.data.data);
        if (recRes.data.success) setRecurringContracts(recRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'invoices') fetchInvoices();
    if (activeTab === 'credit') fetchCreditControl();
    if (activeTab === 'disputes') fetchDisputes();
    if (activeTab === 'ledger') fetchLedger(selectedCustomerForLedger);
    if (activeTab === 'recurring') fetchRecurring();
  }, [activeTab, statusFilter, selectedCustomerForLedger]);

  const handleManualInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await employeePortalService.createManualInvoice({
        customerName: manualCustomer,
        shipmentId: manualWaybill,
        amount: manualAmount,
        dueDate: manualDueDate,
        itemsDescription: manualDesc
      });
      setShowManualInvModal(false);
      setManualCustomer('');
      fetchInvoices();
      alert(`Manual Invoice generated: ${res.data.data.invoiceNumber}`);
    } catch (err: any) {
      alert(err.message || 'Failed to create manual invoice');
    }
  };

  const handleReconciliationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeePortalService.reconcilePayment({
        invoiceNumber: recInvoiceNum,
        paymentAmount: recAmount,
        paymentReference: recRef,
        paymentMethod: recMethod
      });
      setShowReconcileModal(false);
      setRecInvoiceNum('');
      setRecAmount('');
      fetchInvoices();
      alert('Incoming payment reconciled successfully!');
    } catch (err: any) {
      alert(err.message || 'Reconciliation failed');
    }
  };

  const handleResolveDisputeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeePortalService.resolveDispute(selectedDispute.id, {
        resolutionAction: resAction,
        resolutionNote: resNote,
        revisedAmount: revisedAmt
      });
      setShowResolveModal(false);
      setResNote('');
      fetchDisputes();
      fetchInvoices();
      alert('Dispute resolved successfully!');
    } catch (err: any) {
      alert(err.message || 'Dispute resolution failed');
    }
  };

  const handleCreateRecurringSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeePortalService.createRecurringContract({
        customerName: recCustomer,
        billingCycle: recCycle,
        monthlyRetainer: recRetainer,
        includedWaybills: recWaybills
      });
      setShowContractModal(false);
      setRecCustomer('');
      fetchRecurring();
      alert('Recurring billing contract created successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to create contract');
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
            <span className="text-blue-600 font-bold">Billing & Credit Control</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Billing, Credit Control & Reconciliation Hub
          </h1>
          <p className="text-sm text-slate-500 font-normal mt-0.5">
            Auto-generate invoices on shipment delivery, monitor overdue aging buckets, reconcile payments, and resolve disputes.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button
            onClick={() => setShowReconcileModal(true)}
            className="px-3.5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
          >
            <CreditCard size={15} /> Match Payment
          </button>

          <button
            onClick={() => setShowManualInvModal(true)}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <Plus size={16} /> Manual Invoice
          </button>
        </div>
      </div>

      {/* ── Tabs Navigation Bar ───────────────────────────────────────────── */}
      <div className="flex gap-2 border-b border-slate-200 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'invoices' ? 'border-blue-600 text-blue-600 font-extrabold' : 'border-transparent text-slate-500'
          }`}
        >
          <FileText size={16} /> Invoices Master
        </button>

        <button
          onClick={() => setActiveTab('credit')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'credit' ? 'border-blue-600 text-blue-600 font-extrabold' : 'border-transparent text-slate-500'
          }`}
        >
          <Scale size={16} /> Credit Control & Aging
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'disputes' ? 'border-blue-600 text-blue-600 font-extrabold' : 'border-transparent text-slate-500'
          }`}
        >
          <ShieldAlert size={16} /> Dispute Queue ({disputes.length})
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'ledger' ? 'border-blue-600 text-blue-600 font-extrabold' : 'border-transparent text-slate-500'
          }`}
        >
          <Wallet size={16} /> Customer Ledger
        </button>

        <button
          onClick={() => setActiveTab('recurring')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'recurring' ? 'border-blue-600 text-blue-600 font-extrabold' : 'border-transparent text-slate-500'
          }`}
        >
          <Calendar size={16} /> Recurring Contracts
        </button>
      </div>

      {/* ── Tab 1: Invoices Master ────────────────────────────────────────── */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText size={18} className="text-blue-600" /> Master Commercial Invoices
              </h2>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700"
              >
                <option value="ALL">All Statuses</option>
                <option value="UNPAID">Unpaid</option>
                <option value="PARTIALLY_PAID">Partially Paid</option>
                <option value="PAID">Paid</option>
                <option value="DISPUTED">Disputed</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-3">Invoice #</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Waybill #</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Paid Amount</th>
                    <th className="p-3">Open Balance</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 font-medium">
                      <td className="p-3 font-mono font-bold text-blue-600">
                        {inv.invoiceNumber}
                        {inv.isAutoGenerated && <span className="text-[9px] bg-blue-50 text-blue-700 font-extrabold px-1.5 py-0.5 rounded ml-1">Auto-Gen</span>}
                      </td>
                      <td className="p-3 font-bold text-slate-900">{inv.customerName}</td>
                      <td className="p-3 font-mono text-slate-600">{inv.shipmentId}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">₹{inv.amount?.toLocaleString()}</td>
                      <td className="p-3 font-mono text-emerald-600 font-bold">₹{inv.paidAmount?.toLocaleString()}</td>
                      <td className="p-3 font-mono text-rose-600 font-bold">₹{inv.balanceAmount?.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                          inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                          inv.status === 'PARTIALLY_PAID' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                          inv.status === 'DISPUTED' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                          'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {inv.balanceAmount > 0 && (
                          <button
                            onClick={() => { setRecInvoiceNum(inv.invoiceNumber); setRecAmount(inv.balanceAmount.toString()); setShowReconcileModal(true); }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow"
                          >
                            Reconcile Payment
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Credit Control & Aging ─────────────────────────────────── */}
      {activeTab === 'credit' && creditData && (
        <div className="space-y-6">
          
          {/* Aggregate Overdue Aging Buckets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Total Receivables Outstanding</span>
              <p className="text-2xl font-bold text-slate-900">{creditData.formattedTotalOutstanding}</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase">0 – 30 Days Aging</span>
              <p className="text-2xl font-bold text-emerald-600">₹{creditData.aggregateAging.days0_30?.toLocaleString()}</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold text-amber-600 uppercase">30 – 60 Days Aging</span>
              <p className="text-2xl font-bold text-amber-600">₹{creditData.aggregateAging.days30_60?.toLocaleString()}</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold text-rose-600 uppercase">60 – 90+ Days (High Risk)</span>
              <p className="text-2xl font-bold text-rose-600">₹{creditData.aggregateAging.days60_90Plus?.toLocaleString()}</p>
            </div>
          </div>

          {/* Customer Credit Utilization Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Scale size={18} className="text-purple-600" /> Customer Credit Limits & Aging Utilization
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-3">Customer Enterprise</th>
                    <th className="p-3">Credit Limit</th>
                    <th className="p-3">Utilized Amount</th>
                    <th className="p-3">Utilization %</th>
                    <th className="p-3">0-30 Days</th>
                    <th className="p-3">30-60 Days</th>
                    <th className="p-3">60-90+ Days</th>
                    <th className="p-3">Risk Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(creditData.customers || []).map((c: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 font-medium">
                      <td className="p-3 font-bold text-slate-900">{c.customerName}</td>
                      <td className="p-3 font-mono">₹{c.creditLimit?.toLocaleString()}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">₹{c.utilizedCredit?.toLocaleString()}</td>
                      <td className="p-3 font-mono text-purple-600 font-bold">{c.utilizedPercentage}</td>
                      <td className="p-3 font-mono text-emerald-600 font-bold">₹{c.agingBuckets?.days0_30?.toLocaleString()}</td>
                      <td className="p-3 font-mono text-amber-600 font-bold">₹{c.agingBuckets?.days30_60?.toLocaleString()}</td>
                      <td className="p-3 font-mono text-rose-600 font-bold">₹{c.agingBuckets?.days60_90Plus?.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                          c.riskRating === 'HIGH_RISK' ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}>
                          {c.riskRating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ── Tab 3: Dispute Queue ─────────────────────────────────────────── */}
      {activeTab === 'disputes' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <ShieldAlert size={18} className="text-rose-600" /> Invoice Dispute & Discrepancy Queue
          </h2>

          <div className="space-y-3">
            {disputes.map((d, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{d.invoiceNumber} ({d.customerName})</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 uppercase">
                      {d.disputeStatus}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm">Disputed Amount: ₹{d.amount?.toLocaleString()}</span>
                </div>

                <p className="text-slate-600 font-medium">Dispute Reason: {d.disputeReason}</p>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => { setSelectedDispute(d); setShowResolveModal(true); }}
                    className="px-3.5 py-1.5 bg-blue-600 text-white font-bold rounded-lg shadow"
                  >
                    Resolve Dispute →
                  </button>
                </div>
              </div>
            ))}
            {disputes.length === 0 && (
              <p className="text-slate-400 text-center py-6">No open invoice disputes reported.</p>
            )}
          </div>
        </div>
      )}

      {/* ── Tab 4: Customer Ledger ────────────────────────────────────────── */}
      {activeTab === 'ledger' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wallet size={18} className="text-blue-600" /> Running Customer Account Ledger
            </h2>

            <select
              value={selectedCustomerForLedger}
              onChange={e => setSelectedCustomerForLedger(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900"
            >
              <option value="Aura Consumer Tech Ltd">Aura Consumer Tech Ltd</option>
              <option value="GlobeTech Manufacturing India">GlobeTech Manufacturing India</option>
              <option value="Apex Pharma Healthcare Ltd">Apex Pharma Healthcare Ltd</option>
            </select>
          </div>

          {ledgerData && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-3">Posting Date</th>
                    <th className="p-3">Transaction Type</th>
                    <th className="p-3">Reference #</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Debit (Invoice)</th>
                    <th className="p-3">Credit (Payment)</th>
                    <th className="p-3 font-bold text-slate-900">Running Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(ledgerData.ledger || []).map((l: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 font-medium">
                      <td className="p-3">{l.date}</td>
                      <td className="p-3 font-bold text-slate-900">{l.type}</td>
                      <td className="p-3 font-mono text-blue-600 font-bold">{l.reference}</td>
                      <td className="p-3">{l.description}</td>
                      <td className="p-3 font-mono text-rose-600 font-bold">{l.debit > 0 ? `₹${l.debit?.toLocaleString()}` : '-'}</td>
                      <td className="p-3 font-mono text-emerald-600 font-bold">{l.credit > 0 ? `₹${l.credit?.toLocaleString()}` : '-'}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">₹{l.runningBalance?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Tab 5: Recurring Billing Contracts ─────────────────────────────── */}
      {activeTab === 'recurring' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" /> Recurring & Contract Monthly Billing
            </h2>

            <button
              onClick={() => setShowContractModal(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow"
            >
              + New Recurring Contract
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recurringContracts.map((rc, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{rc.contractNumber}: {rc.customerName}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded border border-emerald-300">
                    {rc.status}
                  </span>
                </div>

                <p className="text-slate-600 font-medium">Monthly Retainer: <strong className="text-slate-900">₹{rc.monthlyRetainer?.toLocaleString()}</strong></p>
                <p className="text-slate-500">Included Scope: {rc.includedWaybills}</p>
                <p className="text-[11px] text-blue-600 font-bold">Next Consolidated Auto-Invoice: {rc.nextInvoiceDate}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Reconcile Payment Modal ───────────────────────────────────────── */}
      {showReconcileModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Incoming Payment Reconciliation</h3>
              <button onClick={() => setShowReconcileModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleReconciliationSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Target Invoice Number</label>
                <input
                  type="text"
                  value={recInvoiceNum}
                  onChange={e => setRecInvoiceNum(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900"
                  placeholder="e.g. INV-2026-001"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Payment Amount (₹)</label>
                <input
                  type="number"
                  value={recAmount}
                  onChange={e => setRecAmount(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900"
                  placeholder="75000"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Payment Reference / UTR Number</label>
                <input
                  type="text"
                  value={recRef}
                  onChange={e => setRecRef(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900"
                  placeholder="e.g. UTR-NEFT-904128"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowReconcileModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20">Reconcile Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Resolve Dispute Modal ─────────────────────────────────────────── */}
      {showResolveModal && selectedDispute && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Resolve Dispute: {selectedDispute.invoiceNumber}</h3>
              <button onClick={() => setShowResolveModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleResolveDisputeSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Resolution Action</label>
                <select
                  value={resAction}
                  onChange={e => setResAction(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900"
                >
                  <option value="WAIVE">Waive Disputed Discrepancy Amount</option>
                  <option value="ADJUST_AMOUNT">Adjust Revised Billed Amount</option>
                  <option value="REJECT_DISPUTE">Reject Customer Dispute</option>
                </select>
              </div>

              {resAction === 'ADJUST_AMOUNT' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Revised Invoice Amount (₹)</label>
                  <input
                    type="number"
                    value={revisedAmt}
                    onChange={e => setRevisedAmt(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Resolution Note</label>
                <textarea
                  value={resNote}
                  onChange={e => setResNote(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-medium text-slate-900"
                  placeholder="Record resolution rationale..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowResolveModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20">Confirm Resolution</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Manual Invoice Modal ──────────────────────────────────────────── */}
      {showManualInvModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Manual Invoice Creation / Adjustment</h3>
              <button onClick={() => setShowManualInvModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleManualInvoiceSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Customer Name</label>
                <input
                  type="text"
                  value={manualCustomer}
                  onChange={e => setManualCustomer(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900"
                  placeholder="Aura Consumer Tech Ltd"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Invoice Amount (₹)</label>
                <input
                  type="number"
                  value={manualAmount}
                  onChange={e => setManualAmount(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Description</label>
                <input
                  type="text"
                  value={manualDesc}
                  onChange={e => setManualDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900"
                  placeholder="Freight Adjustment / Demurrage Fee"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowManualInvModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20">Generate Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
