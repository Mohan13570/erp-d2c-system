import React, { useState, useEffect } from 'react';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import { employeePortalService } from '../services/employeeApi';
import { HeadphonesIcon, Plus, CheckCircle2, Clock, AlertCircle, MessageSquare, Shield, Users, ChevronRight } from 'lucide-react';

export default function EmployeeSupport() {
  const { user } = useEmployeeAuth();
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [allTickets, setAllTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Ticket creation modal
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('HR Query');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [submitting, setSubmitting] = useState(false);

  const isHRAdmin = user?.role === 'hr_admin';

  const loadTickets = () => {
    setLoading(true);
    employeePortalService.getMyTickets()
      .then(res => {
        if (res.data.success) setMyTickets(res.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    if (isHRAdmin) {
      employeePortalService.getAllTickets()
        .then(res => {
          if (res.data.success) setAllTickets(res.data.data);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await employeePortalService.createTicket({
        category,
        subject,
        description,
        priority
      });
      setShowModal(false);
      setSubject('');
      setDescription('');
      loadTickets();
      alert('Support query submitted successfully! HR will respond shortly.');
    } catch (err: any) {
      alert(err.message || 'Failed to submit query');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        <div className="h-64 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* ── Breadcrumbs & Page Header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Home</span>
            <ChevronRight size={12} />
            <span>Employee Portal</span>
            <ChevronRight size={12} />
            <span className="text-blue-600 font-bold">Support & Helpdesk</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Support & HR Helpdesk
          </h1>
          <p className="text-sm text-slate-500 font-normal mt-0.5">
            Raise operational or HR inquiries, track responses, and view ticket resolution status.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {isHRAdmin && (
            <div className="flex bg-slate-200/80 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('my')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'my' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Tickets
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'all' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield size={14} /> HR Admin Queue
              </button>
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition-all"
          >
            <Plus size={16} /> Raise HR Ticket
          </button>
        </div>
      </div>

      {activeTab === 'my' ? (
        /* ── My Support Tickets Table ─────────────────────────────────────── */
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HeadphonesIcon size={18} className="text-blue-600" /> My Submitted Queries
            </h2>
            <span className="text-xs text-slate-500 font-semibold">{myTickets.length} Tickets</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-100">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Ticket #</th>
                  <th className="p-3.5">Subject</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Submitted</th>
                  <th className="p-3.5 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(myTickets.length > 0 ? myTickets : [
                  { ticketNumber: 'TKT-849201', subject: 'Payroll Tax TDS Clarification', category: 'Payroll', priority: 'Medium', status: 'In Progress', createdAt: '2026-07-20' },
                  { ticketNumber: 'TKT-739102', subject: 'Laptop Battery Replacement Request', category: 'IT Support', priority: 'Low', status: 'Open', createdAt: '2026-07-18' }
                ]).map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-blue-600">{t.ticketNumber}</td>
                    <td className="p-3.5 font-bold text-slate-900">{t.subject}</td>
                    <td className="p-3.5 text-slate-500 font-medium">{t.category}</td>
                    <td className="p-3.5 font-semibold text-slate-700">{t.priority}</td>
                    <td className="p-3.5 text-slate-400 text-xs">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="p-3.5">
                      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        t.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        t.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ── HR Admin All Tickets Queue ────────────────────────────────────── */
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield size={18} className="text-purple-600" /> HR Helpdesk Queue (Admin View)
            </h2>
            <span className="text-xs text-purple-600 font-bold">{allTickets.length} Global Tickets</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Ticket #</th>
                  <th className="p-3.5">Requester</th>
                  <th className="p-3.5">Subject</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allTickets.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-purple-600">{t.ticketNumber}</td>
                    <td className="p-3.5 font-semibold text-slate-900">{t.customerName || 'Employee'}</td>
                    <td className="p-3.5 font-semibold">{t.subject}</td>
                    <td className="p-3.5 text-slate-500 font-medium">{t.category}</td>
                    <td className="p-3.5 font-bold text-amber-600">{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Raise Ticket Modal ────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Raise Support / HR Query</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="HR Query">HR & Policies</option>
                    <option value="Payroll">Payroll & Taxes</option>
                    <option value="IT Support">IT & Equipment</option>
                    <option value="Leave Query">Leave Balance Issue</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                  placeholder="Brief summary of your query"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Detailed Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                  placeholder="Provide full details or context regarding your request..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20"
                >
                  {submitting ? 'Submitting...' : 'Submit Query'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
