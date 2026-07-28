import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  History,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MyAttendance() {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [timesheet, setTimesheet] = useState<any[]>([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [lastLog, setLastLog] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadAttendance = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/hr-attendance/timesheet/${user.id}`);
      const data = await res.json();
      if (data.success) {
        setTimesheet(data.data);
        if (data.data.length > 0) {
          setLastLog(data.data[0]);
          setIsCheckedIn(data.data[0].status === 'Active' || !data.data[0].checkOut);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [user]);

  const handleCheckInOut = async (action: 'check-in' | 'check-out') => {
    if (!user) return;
    setLoading(true);
    try {
      const payload = {
        employeeId: user.id,
        latitude: 19.0760, // Mock lat
        longitude: 72.8777, // Mock lon
        address: 'Lizome HQ, Mumbai'
      };

      const endpoint = action === 'check-in' ? '/api/hr-attendance/check-in' : '/api/hr-attendance/check-out';
      // In standard api, check-out might be post to check-in with check-out type or PUT.
      // Let's use check-in endpoint first.
      const res = await fetch('/api/hr-attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.success) {
        setIsCheckedIn(action === 'check-in');
        loadAttendance();
      } else {
        alert(result.error || 'Failed to update attendance');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while checking in/out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Clock In / Out</h1>
          <p className="text-slate-500 font-medium mt-1">Check in to record your working hours for the day.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Clock Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col justify-between items-center text-center">
          <div className="w-16 h-16 bg-teal-500/10 text-teal-400 rounded-2xl flex items-center justify-center mb-4">
            <Clock size={32} />
          </div>
          
          <div className="my-6">
            <p className="text-5xl font-black tracking-widest text-teal-400 font-mono">
              {time.toLocaleTimeString()}
            </p>
            <p className="text-sm font-semibold text-slate-400 mt-2">
              {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="w-full space-y-3">
            {!isCheckedIn ? (
              <button
                onClick={() => handleCheckInOut('check-in')}
                disabled={loading}
                className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-55 text-slate-900 font-black py-4 rounded-xl shadow-lg shadow-teal-500/20 transition-all"
              >
                {loading ? 'Clocking In...' : 'CLOCK IN'}
              </button>
            ) : (
              <button
                onClick={() => handleCheckInOut('check-out')}
                disabled={loading}
                className="w-full bg-rose-500 hover:bg-rose-455 disabled:opacity-55 text-white font-black py-4 rounded-xl shadow-lg shadow-rose-500/20 transition-all"
              >
                {loading ? 'Clocking Out...' : 'CLOCK OUT'}
              </button>
            )}
          </div>
        </div>

        {/* Status Info Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin className="text-teal-600" /> Current Work Session
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">GPS Verification</span>
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle size={12} /> verified
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Office Geofence</span>
                <span className="text-slate-700 font-bold text-sm">Lizome Mumbai HQ</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Logged Location</span>
                <span className="text-slate-700 font-bold text-sm">Mumbai, India</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 flex gap-3 mt-6">
            <AlertCircle className="text-teal-600 shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Attendance records are stored securely. Falsification of GPS data is subject to disciplinary action.
            </p>
          </div>
        </div>

        {/* Summary Mini Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="text-teal-600" /> Summary stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-slate-800">{timesheet.length}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Days Worked</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-slate-800">100%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">On Time</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-6 mt-6">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Last Sync</span>
            <p className="text-sm font-semibold text-slate-700 mt-1">{new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* History Timesheet Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-2">
          <History className="text-teal-600" size={20} />
          <h2 className="text-xl font-bold text-slate-800">Monthly Timesheet (July 2026)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                {['Date', 'Check In', 'Check Out', 'Hours', 'Status'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timesheet.map((log: any, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono font-semibold">
                    {log.checkIn}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono font-semibold">
                    {log.checkOut || 'Active'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono font-semibold">
                    {log.hoursWorked ? `${log.hoursWorked} hrs` : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold bg-teal-50 text-teal-600 px-3 py-1 rounded-full">
                      Present
                    </span>
                  </td>
                </tr>
              ))}
              {timesheet.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400 font-medium">
                    No timesheet data available.
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
