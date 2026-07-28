import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CalendarDays, 
  Wallet, 
  TrendingUp, 
  Briefcase, 
  AlertCircle, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [attendanceToday, setAttendanceToday] = useState<any>(null);
  const [leaveBalance, setLeaveBalance] = useState<any>(null);
  const [upcomingHolidays, setUpcomingHolidays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    // Simulate/Fetch relevant employee aggregates
    const loadDashboardData = async () => {
      try {
        // Fetch leaves
        const leaveRes = await fetch(`/api/hr-leave/balance/${user.id}`);
        const leaveData = await leaveRes.json();
        if (leaveData.success) setLeaveBalance(leaveData.data);

        // Fetch holidays
        const holidayRes = await fetch('/api/hr-leave/holidays');
        const holidayData = await holidayRes.json();
        if (holidayData.success) setUpcomingHolidays(holidayData.data.slice(0, 3));

        // Fetch today's timesheet or logs
        const attendanceRes = await fetch(`/api/hr-attendance/timesheet/${user.id}`);
        const attendanceData = await attendanceRes.json();
        if (attendanceData.success && attendanceData.data.length > 0) {
          setAttendanceToday(attendanceData.data[0]);
        }
      } catch (err) {
        console.error('Failed to load employee dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-3xl p-8 shadow-lg shadow-teal-500/10">
        <h1 className="text-3xl font-black tracking-tight">Welcome, {user?.firstName}!</h1>
        <p className="mt-2 text-teal-100 font-medium">Have a productive day at Lizome. Here's your self-service overview.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Status Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Status</p>
            <p className="text-lg font-bold text-slate-800 mt-1">
              {attendanceToday ? `Clocked In: ${attendanceToday.checkIn}` : 'Not Checked In'}
            </p>
          </div>
        </div>

        {/* Leave Balance Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Leaves</p>
            <p className="text-lg font-bold text-slate-800 mt-1">
              {leaveBalance ? `${leaveBalance.casual + leaveBalance.sick + leaveBalance.earned} Days` : '15 Days'}
            </p>
          </div>
        </div>

        {/* Holiday Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role Profile</p>
            <p className="text-lg font-bold text-slate-800 mt-1">{user?.role || 'Employee'}</p>
          </div>
        </div>
      </div>

      {/* Primary Actions / Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Attendance Controller Quick Action */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <span className="bg-teal-500/10 text-teal-400 text-xs font-bold px-3 py-1.5 rounded-full border border-teal-500/20">
              Live Shifts
            </span>
            <h2 className="text-2xl font-bold mt-4 mb-2">Track Attendance Easily</h2>
            <p className="text-slate-400 text-sm">Clock in to begin your shift or request overtime directly from your workspace.</p>
          </div>
          <div className="mt-8 flex gap-4">
            <Link 
              to="/employee/attendance" 
              className="bg-teal-500 text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-teal-400 transition-colors flex items-center gap-2"
            >
              Go to Timesheet <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Upcoming Holidays Panel */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CalendarDays className="text-teal-600" /> Upcoming Holidays
          </h2>
          <div className="divide-y divide-slate-100">
            {upcomingHolidays.length > 0 ? (
              upcomingHolidays.map((holiday: any, idx) => (
                <div key={idx} className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{holiday.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{new Date(holiday.date).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    Official
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 font-medium text-sm">
                No upcoming holidays loaded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
