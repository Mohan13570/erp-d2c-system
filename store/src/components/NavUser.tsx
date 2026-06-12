'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NavUser() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const check = () => {
      const stored = localStorage.getItem('d2c_user');
      setUser(stored ? JSON.parse(stored) : null);
    };
    check();
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, []);

  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/account" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
            {user.firstName?.charAt(0) || 'U'}
          </div>
          <span className="hidden md:block">{user.firstName}</span>
        </Link>
        <button onClick={() => { localStorage.removeItem('d2c_user'); setUser(null); router.push('/'); }}
          className="text-gray-400 hover:text-red-500 transition-colors p-1" title="Sign out">
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Sign in</Link>
      <Link href="/signup" className="text-sm font-bold bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
        Sign up
      </Link>
    </div>
  );
}
