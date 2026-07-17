'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('d2c_user', JSON.stringify(data.user));
        localStorage.setItem('d2c_token', data.token);
        router.push('/account');
      } else {
        const err = await res.json();
        alert(err.error || 'Signup failed');
      }
    } catch (err) {
      alert('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Create your account</h1>
          <p className="text-gray-500">Join LIZOME and start shopping</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/60 border border-gray-100 p-8">
          {/* Benefits */}
          <div className="grid grid-cols-1 gap-2 mb-6 bg-indigo-50 rounded-2xl p-4">
            {['Free express shipping on first order', 'Earn loyalty points on every purchase', 'Easy 30-day returns'].map(b => (
              <div key={b} className="flex items-center text-sm text-indigo-700 font-medium">
                <Check size={14} className="mr-2 shrink-0" /> {b}
              </div>
            ))}
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                  placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                  placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handleChange} required
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  placeholder="Min 8 characters" minLength={6} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-600/30 disabled:opacity-60 flex items-center justify-center mt-2">
              {loading ? <Loader2 size={20} className="animate-spin mr-2" /> : null}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
