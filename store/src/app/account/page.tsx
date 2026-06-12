'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingBag, Star, RotateCcw, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('d2c_user');
    if (!stored) { router.push('/login'); return; }
    const userData = JSON.parse(stored);
    setUser(userData);

    fetch(`/api/d2c/orders?email=${encodeURIComponent(userData.email)}`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(console.error);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('d2c_user');
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Account</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user.firstName}!</p>
        </div>
        <button onClick={handleLogout} className="flex items-center text-sm text-gray-500 hover:text-red-600 font-medium transition-colors">
          <LogOut size={16} className="mr-2" /> Sign out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-black text-2xl mx-auto mb-3">
            {user.firstName.charAt(0)}
          </div>
          <h2 className="font-bold text-gray-900">{user.firstName}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="mt-4 pt-4 border-t border-gray-50">
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Silver Member</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center">
          <Star className="text-amber-400 mb-2" size={28} fill="currentColor" />
          <p className="text-3xl font-bold text-gray-900">{user.loyaltyPoints || 0}</p>
          <p className="text-sm text-gray-500 font-medium">Loyalty Points</p>
          <p className="text-xs text-gray-400 mt-1">≈ ${((user.loyaltyPoints || 0) / 100).toFixed(2)} store credit</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center">
          <ShoppingBag className="text-indigo-500 mb-2" size={28} />
          <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
          <p className="text-sm text-gray-500 font-medium">Total Orders</p>
          <Link href="/" className="text-xs text-indigo-600 font-medium mt-1 hover:underline">Start shopping →</Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'My Orders', icon: ShoppingBag, href: '/' },
            { label: 'Wishlist', icon: Star, href: '/' },
            { label: 'Returns', icon: RotateCcw, href: '/' },
            { label: 'Sign Out', icon: LogOut, href: '#', action: handleLogout },
          ].map(item => (
            <button key={item.label} onClick={item.action}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-gray-600 group">
              <item.icon size={22} className="mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-6 text-xl">Order History</h2>
        {orders.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl">
            <ShoppingBag className="mx-auto h-10 w-10 text-gray-400 mb-3" />
            <p className="text-gray-500 font-medium">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order.id} className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Order #{order.orderId}</p>
                    <p className="text-xs text-gray-500">{new Date(order.transactionDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">${order.grandTotal.toFixed(2)}</p>
                    <p className="text-xs text-emerald-600 font-bold uppercase">{order.status}</p>
                  </div>
                </div>
                <div className="px-6 py-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center py-2 text-sm">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">{item.qty}x</span>
                        <span className="text-gray-600">{item.item?.itemName || item.itemCode}</span>
                      </div>
                      <span className="text-gray-900 font-medium">${(item.amount).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
