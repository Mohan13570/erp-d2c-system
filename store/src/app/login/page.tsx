'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Users, ShoppingBag, ArrowRight } from 'lucide-react';

export default function UnifiedLogin() {
  const [role, setRole] = useState<'admin' | 'employee' | 'customer' | null>(null);
  const router = useRouter();

  const handleRoleSelect = (selectedRole: 'admin' | 'employee' | 'customer') => {
    setRole(selectedRole);
    if (selectedRole === 'admin' || selectedRole === 'employee') {
      window.location.href = '/admin'; // Redirects to the Vite ERP frontend
    } else {
      // Customer login logic (using existing D2C store flow)
      // We can just show a form or redirect them to a customer-specific route
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Lizome Platform</h2>
        <p className="mt-2 text-sm text-gray-500 font-medium">Select your role to access your portal</p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100">
          {!role || role === 'customer' ? (
            <div className="space-y-4">
              <button
                onClick={() => handleRoleSelect('admin')}
                className="w-full flex items-center justify-between p-5 border-2 border-transparent bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 rounded-2xl transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                    <Shield size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-700 transition-colors">System Admin</h3>
                    <p className="text-sm text-gray-500 font-medium">Full ERP control & configuration</p>
                  </div>
                </div>
                <ArrowRight className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </button>

              <button
                onClick={() => handleRoleSelect('employee')}
                className="w-full flex items-center justify-between p-5 border-2 border-transparent bg-gray-50 hover:bg-emerald-50 hover:border-emerald-200 rounded-2xl transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                    <Users size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors">Employee Portal</h3>
                    <p className="text-sm text-gray-500 font-medium">Manage orders, stock, and HR</p>
                  </div>
                </div>
                <ArrowRight className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
              </button>

              <button
                onClick={() => handleRoleSelect('customer')}
                className="w-full flex items-center justify-between p-5 border-2 border-transparent bg-gray-50 hover:bg-orange-50 hover:border-orange-200 rounded-2xl transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                    <ShoppingBag size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-700 transition-colors">Customer Account</h3>
                    <p className="text-sm text-gray-500 font-medium">Track orders & loyalty points</p>
                  </div>
                </div>
                <ArrowRight className="text-gray-400 group-hover:text-orange-600 transition-colors" />
              </button>
            </div>
          ) : null}

          {role === 'customer' && (
            <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <form className="space-y-5" onSubmit={async (e) => { 
                e.preventDefault(); 
                const form = e.target as HTMLFormElement;
                try {
                  const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: form.email.value, password: form.password.value, type: 'Customer' })
                  });
                  if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem('d2c_user', JSON.stringify(data.user));
                    localStorage.setItem('d2c_token', data.token);
                    router.push('/account');
                  } else {
                    const err = await res.json();
                    alert(err.error || 'Login failed');
                  }
                } catch (err) {
                  alert('Network error');
                }
              }}>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Customer Email</label>
                  <input name="email" required type="email" className="appearance-none block w-full px-4 py-3.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium" placeholder="jane@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                  <input name="password" required type="password" placeholder="••••••••" className="appearance-none block w-full px-4 py-3.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium" />
                </div>
                <button type="submit" className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors">
                  Sign in to Storefront
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
