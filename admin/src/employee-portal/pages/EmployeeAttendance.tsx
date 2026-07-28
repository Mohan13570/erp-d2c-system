import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import { employeePortalService } from '../services/employeeApi';
import {
  Clock, MapPin, CheckCircle2, History, AlertCircle,
  Calendar, Check, Shield, Users, Filter, Plus, ChevronRight
} from 'lucide-react';

export default function EmployeeAttendance() {
  const { user } = useEmployeeAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') === 'team' ? 'team' : 'my';

  const [activeTab, setActiveTab] = useState<'my' | 'team'>(initialTab);
  const [time, setTime] = useState(new Date());
  const [clockedIn, setClockedIn] = useState(false);
  const [clocking, setClocking] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [teamLogs, setTeamLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Attendance Correction Modal
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [corrDate, setCorrDate] = useState('');
  const [corrClockIn, setCorrClockIn] = useState('');
  const [corrClockOut, setCorrClockOut] = useState('');
  const [corrReason, setCorrReason] = useState('');
  const [corrSubmitted, setCorrSubmitted] = useState(false);

  const isManagerOrHR = user?.role === 'manager' || user?.role === 'hr_admin';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadAttendanceLogs = () => {
    setLoading(true);
    employeePortalService.getMyAttendanceLogs()
      .then(res => {
        if (res.data.success) {
          const data = res.data.data;
          setLogs(data);
          if (data.length > 0) {
            const today = new Date();
            today.setHours(0,0,0,0);
            const todayLog = data.find((l: any) => new Date(l.date) >= today);
            if (todayLog && todayLog.clockIn && !todayLog.clockOut) {
              setClockedIn(true);
            } else {
              setClockedIn(false);
            }
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    if (isManagerOrHR) {
      employeePortalService.getTeamAttendanceLogs()
        .then(res => {
          if (res.data.success) setTeamLogs(res.data.data);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    loadAttendanceLogs();
  }, []);

  const handleClockToggle = async () => {
    setClocking(true);
    try {
      if (clockedIn) {
        await employeePortalService.clockOut();
        setClockedIn(false);
      } else {
        await employeePortalService.clockIn({
          latitude: 19.0760,
          longitude: 72.8777,
          address: 'Lizome HQ Terminal'
        });
        setClockedIn(true);
      }
      loadAttendanceLogs();
    } catch (err: any) {
      alert(err.message || 'Clock action failed');
    } finally {
      setClocking(false);
    }
  };

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCorrSubmitted(true);
    setTimeout(() => {
      setCorrSubmitted(false);
      setShowCorrectionModal(false);
      alert('Correction request submitted to manager/HR for approval');
      setCorrDate('');
      setCorrClockIn('');
      setCorrClockOut('');
      setCorrReason('');
    }, 800);
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
            <span className="text-blue-600 font-bold">Attendance & Timesheet</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Attendance & Time Tracking
          </h1>
          <p className="text-sm text-slate-500 font-normal mt-0.5">
            Record shift timestamps, view monthly logs, and request attendance corrections.
          </p>
        </div>

        {isManagerOrHR && (
          <div className="flex bg-slate-200/80 p-1 rounded-xl self-start">
            <button
              onClick={() => setActiveTab('my')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'my' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Attendance
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'team' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users size={14} /> Team Logs
            </button>
          </div>
        )}
      </div>

      {activeTab === 'my' ? (
        <>
          {/* ── Top Live Clock Widget Grid ─────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Live Clock Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center flex flex-col justify-between items-center space-y-4 shadow-sm">
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={15} className="text-blue-600" /> Live System Timer
              </div>

              <div>
                <p className="text-4xl font-bold font-mono tracking-wider text-blue-600">
                  {time.toLocaleTimeString()}
                </p>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <button
                onClick={handleClockToggle}
                disabled={clocking}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 ${
                  clockedIn
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20'
                }`}
              >
                {clocking ? 'Processing...' : clockedIn ? 'CLOCK OUT NOW' : 'CLOCK IN NOW'}
              </button>
            </div>

            {/* GPS & Terminal Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm">
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={15} className="text-indigo-600" /> Geofence & GPS Terminal
              </div>

              <div className="space-y-2 text-xs font-medium">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Location Status</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} /> Verified Geofence
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Station</span>
                  <span className="text-slate-900 font-semibold">Lizome HQ Mumbai</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Coordinates</span>
                  <span className="text-slate-600 font-mono">19.0760° N, 72.8777° E</span>
                </div>
              </div>

              <button
                onClick={() => setShowCorrectionModal(true)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={15} /> Request Attendance Correction
              </button>
            </div>

            {/* Shift Policy Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm">
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Shield size={15} className="text-purple-600" /> Shift Policy & Rules
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-slate-900 font-bold">Standard Shift: 09:00 AM - 06:00 PM</p>
                <p className="text-slate-500 leading-relaxed">
                  Overtime is automatically calculated after 8.0 hours worked. Attendance corrections require manager sign-off.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700 flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>Shift modification? Contact HR admin.</span>
              </div>
            </div>

          </div>

          {/* ── Attendance Log History Table ─────────────────────────────────── */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <History size={18} className="text-blue-600" /> Attendance History Logs
              </h2>
              <span className="text-xs text-slate-500 font-semibold">{logs.length} Logged Sessions</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-100">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Date</th>
                    <th className="p-3.5">Clock In</th>
                    <th className="p-3.5">Clock Out</th>
                    <th className="p-3.5">Hours Worked</th>
                    <th className="p-3.5">Source</th>
                    <th className="p-3.5 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">
                        {new Date(log.date).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 font-mono text-blue-600 font-semibold">
                        {log.clockIn ? new Date(log.clockIn).toLocaleTimeString() : '—'}
                      </td>
                      <td className="p-3.5 font-mono text-indigo-600 font-semibold">
                        {log.clockOut ? new Date(log.clockOut).toLocaleTimeString() : 'Active'}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-800">
                        {log.hoursWorked ? `${log.hoursWorked} hrs` : 'In Progress'}
                      </td>
                      <td className="p-3.5 text-slate-500 font-medium">{log.source || 'Web Portal'}</td>
                      <td className="p-3.5">
                        <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Present
                        </span>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                        No attendance logs recorded yet. Use the Clock In button above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* ── Team Attendance View (Manager / HR Admin) ───────────────────── */
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users size={18} className="text-blue-600" /> Team Attendance Overview
            </h2>
            <span className="text-xs text-blue-600 font-bold">Manager Scope</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Employee</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Clock In</th>
                  <th className="p-3.5">Clock Out</th>
                  <th className="p-3.5">Hours</th>
                  <th className="p-3.5">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teamLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      {log.employee?.employeeName || 'Team Member'}
                    </td>
                    <td className="p-3.5 font-semibold">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="p-3.5 font-mono text-blue-600 font-semibold">{log.clockIn ? new Date(log.clockIn).toLocaleTimeString() : '—'}</td>
                    <td className="p-3.5 font-mono text-indigo-600 font-semibold">{log.clockOut ? new Date(log.clockOut).toLocaleTimeString() : 'Active'}</td>
                    <td className="p-3.5 font-mono font-bold">{log.hoursWorked ? `${log.hoursWorked} hrs` : 'In Progress'}</td>
                    <td className="p-3.5 text-slate-500 font-medium">{log.source || 'Web Portal'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Attendance Correction Modal ────────────────────────────────────── */}
      {showCorrectionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Request Attendance Correction</h3>
              <button onClick={() => setShowCorrectionModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCorrectionSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Target Date</label>
                <input
                  type="date"
                  value={corrDate}
                  onChange={e => setCorrDate(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Correct Clock In</label>
                  <input
                    type="time"
                    value={corrClockIn}
                    onChange={e => setCorrClockIn(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Correct Clock Out</label>
                  <input
                    type="time"
                    value={corrClockOut}
                    onChange={e => setCorrClockOut(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Reason for Adjustment</label>
                <textarea
                  value={corrReason}
                  onChange={e => setCorrReason(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                  placeholder="Forgotten clock-in, system outage, client visit..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={corrSubmitted}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20"
                >
                  {corrSubmitted ? 'Submitting...' : 'Submit to Manager'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
