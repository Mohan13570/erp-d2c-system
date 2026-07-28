import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Send, 
  Calendar,
  CheckCircle,
  Clock,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MyLeave() {
  const { user } = useAuth();
  const [balances, setBalances] = useState<any>({ casual: 0, sick: 0, earned: 0 });
  const [history, setHistory] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('Casual');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadLeaveData = async () => {
    if (!user) return;
    try {
      const balRes = await fetch(`/api/hr-leave/balance/${user.id}`);
      const balData = await balRes.json();
      if (balData.success) {
        setBalances(balData.data);
      }

      const holRes = await fetch('/api/hr-leave/holidays');
      const holData = await holRes.json();
      if (holData.success) {
        setHolidays(holData.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadLeaveData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      alert('All fields are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/hr-leave/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: user?.id,
          startDate,
          endDate,
          type,
          reason
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Leave application submitted successfully!');
        setStartDate('');
        setEndDate('');
        setReason('');
        loadLeaveData();
        // Add local entry for quick feedback
        setHistory(prev => [
          {
            startDate,
            endDate,
            type,
            reason,
            status: 'Pending'
          },
          ...prev
        ]);
      } else {
        alert(data.error || 'Failed to submit leave request');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to the API');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Leave Management</h1>
          <p className="text-slate-500 font-medium mt-1">Apply for leave, track balances, and check public holidays.</p>
        </div>
      </div>

      {/* Leave Balances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Casual Leave</span>
            <span className="bg-teal-50 text-teal-600 font-bold px-2 py-0.5 rounded text-xs">Available</span>
          </div>
          <p className="text-3xl font-black text-slate-800">{balances.casual} Days</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sick Leave</span>
            <span className="bg-teal-50 text-teal-600 font-bold px-2 py-0.5 rounded text-xs">Available</span>
          </div>
          <p className="text-3xl font-black text-slate-800">{balances.sick} Days</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Earned Leave</span>
            <span className="bg-teal-50 text-teal-600 font-bold px-2 py-0.5 rounded text-xs">Available</span>
          </div>
          <p className="text-3xl font-black text-slate-800">{balances.earned} Days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Request Leave Form */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Send className="text-teal-600" size={20} /> Request Leave
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Start Date</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-slate-600" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">End Date</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-slate-600" 
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Leave Type</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-slate-600 font-semibold"
              >
                <option value="Casual">Casual Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Earned">Earned Leave</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Reason</label>
              <textarea 
                value={reason} 
                onChange={e => setReason(e.target.value)}
                placeholder="Reason for requesting leave..." 
                rows={4} 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-slate-600"
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition-colors disabled:opacity-55"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>

        {/* Holidays Panel */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Calendar className="text-teal-600" size={20} /> Public Holidays
          </h2>
          <div className="divide-y divide-slate-100">
            {holidays.map((h, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                <div>
                  <p className="font-bold text-slate-700 text-sm">{h.name}</p>
                  <p className="text-xs text-slate-400 font-medium">{new Date(h.date).toLocaleDateString()}</p>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                  Official
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leave Application History */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-2">
          <CalendarDays className="text-teal-600" size={20} />
          <h2 className="text-xl font-bold text-slate-800">My Leave Applications</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                {['Type', 'Start Date', 'End Date', 'Reason', 'Status'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-850">
                    {item.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-semibold">
                    {new Date(item.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-semibold">
                    {new Date(item.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {item.reason}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold bg-amber-55 text-amber-800 px-3 py-1 rounded-full">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400 font-medium">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
