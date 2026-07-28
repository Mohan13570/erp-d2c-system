import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import { employeePortalService } from '../services/employeeApi';
import { Mail, Lock, ArrowRight, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';

export default function EmployeeLogin() {
  const { login } = useEmployeeAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('employee@aura.com');
  const [password, setPassword] = useState('employee123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await employeePortalService.login(email, password);
      const { token, user } = res.data.data;
      login(token, user);
      navigate('/hr-portal', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setTestRoleCredentials = (role: 'employee' | 'manager' | 'hr_admin') => {
    if (role === 'employee') {
      setEmail('employee@aura.com');
      setPassword('employee123');
    } else if (role === 'manager') {
      setEmail('manager@aura.com');
      setPassword('employee123');
    } else {
      setEmail('admin@aura.com');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B16] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Dynamic Purple/Blue Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[440px] relative z-10 space-y-6">
        
        {/* Top Left Navigation Link */}
        <div className="flex items-center justify-between px-1">
          <Link
            to="/login"
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft size={14} /> Back to Portals
          </Link>
          <div className="flex items-center gap-2">
            <img src="/lizome-icon.svg" className="h-6 w-auto" alt="LIZOME" />
            <span className="text-xs font-bold text-white tracking-wide">Lizome ERP</span>
          </div>
        </div>

        {/* Main Card Matching Image */}
        <div className="bg-[#121324]/90 border border-slate-800/80 rounded-[32px] p-8 md:p-9 backdrop-blur-2xl shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="space-y-1.5">
            <h1 className="text-3xl font-black text-white tracking-tight">
              Sign in to <span className="text-indigo-400">Employee</span>
            </h1>
            <p className="text-xs text-slate-400 font-normal">
              Enter your credentials to access your workspace
            </p>
          </div>

          {/* Quick Role Tester Pills */}
          <div className="bg-[#1A1C30]/80 border border-slate-800/60 rounded-2xl p-2.5 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest px-1">
              <Sparkles size={12} /> Test Credentials Role Switcher
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setTestRoleCredentials('employee')}
                className={`py-1.5 px-2 rounded-xl transition-all border ${
                  email === 'employee@aura.com'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-[#121324] text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Employee
              </button>
              <button
                type="button"
                onClick={() => setTestRoleCredentials('manager')}
                className={`py-1.5 px-2 rounded-xl transition-all border ${
                  email === 'manager@aura.com'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-[#121324] text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => setTestRoleCredentials('hr_admin')}
                className={`py-1.5 px-2 rounded-xl transition-all border ${
                  email === 'admin@aura.com'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-[#121324] text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                HR Admin
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 font-medium">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            
            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 tracking-wide">
                Email address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-500 pointer-events-none">
                  <Mail size={17} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#EBECEF] text-slate-900 font-medium rounded-2xl pl-11 pr-4 py-3.5 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
                  placeholder="admin@aura.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 tracking-wide">
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-500 pointer-events-none">
                  <Lock size={17} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#EBECEF] text-slate-900 font-medium rounded-2xl pl-11 pr-4 py-3.5 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button (Pill Violet Button matching uploaded image) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] mt-2 cursor-pointer"
            >
              {loading ? 'Accessing...' : (
                <>
                  Access Workspace <ArrowRight size={15} />
                </>
              )}
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}
