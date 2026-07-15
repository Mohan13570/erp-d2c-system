'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Trash2, ArrowRight, CheckCircle2, X } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('d2c_user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      setFormData(prev => ({
        ...prev,
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        email: u.email || '',
        phone: u.phone || ''
      }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsCheckingOut(true);

    try {
      const response = await fetch('/api/d2c/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            ...user,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone
          },
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
          items: items.map(i => ({ itemCode: i.itemCode, qty: i.qty, price: i.rate })),
          grandTotal: cartTotal
        })
      });

      if (response.ok) {
        setOrderSuccess(true);
        clearCart();
        setShowCheckoutForm(false);
      } else {
        const errData = await response.json();
        alert(`Checkout failed: ${errData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Network error connecting to ERP API.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto py-24 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 mb-8">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Order Confirmed!</h1>
        <p className="text-xl text-gray-500 mb-10">Your items are being prepared. A Sales Order has been automatically generated in the ERP system.</p>
        <Link href="/" className="bg-gray-900 text-white font-semibold py-4 px-10 rounded-full hover:bg-indigo-600 transition-all duration-300 inline-flex items-center">
          Continue Shopping <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 relative">
      {/* Checkout Modal Overlay */}
      {showCheckoutForm && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-xl font-extrabold text-slate-950">Checkout Details</h2>
              <button onClick={() => setShowCheckoutForm(false)} className="text-slate-400 hover:text-slate-900 transition-colors bg-slate-100 p-1.5 rounded-full">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">First Name</label>
                  <input type="text" required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-3 text-sm font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Last Name</label>
                  <input type="text" required name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-3 text-sm font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                  <input type="email" required name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 text-sm font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Phone Number</label>
                  <input type="tel" required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 text-sm font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Shipping Address</label>
                <input type="text" required name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Main St, Apt 4B" className="w-full px-4 py-3 text-sm font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">City</label>
                  <input type="text" required name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 text-sm font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Zip Code</label>
                  <input type="text" required name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full px-4 py-3 text-sm font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total to pay</p>
                  <p className="text-3xl font-black text-slate-950">${cartTotal.toFixed(2)}</p>
                </div>
                <button 
                  type="submit" 
                  disabled={isCheckingOut}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all disabled:opacity-50 flex items-center text-sm shadow-md shadow-indigo-600/10"
                >
                  {isCheckingOut ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Confirm Payment <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-black text-slate-950 mb-10 tracking-tight">Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-24 bg-slate-50 rounded-3xl border border-slate-100">
          <p className="text-slate-500 font-semibold text-lg mb-6">Your cart is currently empty.</p>
          <Link href="/" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline">Browse Collection &rarr;</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.itemCode} className="flex space-x-6 bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.005)]">
                <div className="w-24 h-24 relative bg-slate-50 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                  <Image src={item.image} alt={item.itemName} fill className="object-cover" unoptimized />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-1 gap-4">
                    <h3 className="font-extrabold text-slate-950 text-base line-clamp-1">{item.itemName}</h3>
                    <p className="font-black text-slate-950 text-base">${(item.rate * item.qty).toFixed(2)}</p>
                  </div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-auto">Code: {item.itemCode}</p>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button onClick={() => updateQuantity(item.itemCode, item.qty - 1)} className="px-3.5 py-1.5 hover:bg-slate-100 text-slate-600 font-bold transition-colors">-</button>
                      <span className="px-4 py-1.5 font-bold text-sm text-slate-950 border-x border-slate-200">{item.qty}</span>
                      <button onClick={() => updateQuantity(item.itemCode, item.qty + 1)} className="px-3.5 py-1.5 hover:bg-slate-100 text-slate-600 font-bold transition-colors">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.itemCode)} className="text-slate-400 hover:text-red-500 transition-colors p-2 bg-slate-50 hover:bg-red-50 rounded-xl">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-slate-50/60 border border-slate-100 p-8 rounded-3xl h-fit sticky top-28">
            <h2 className="text-lg font-extrabold text-slate-950 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 pb-6 border-b border-slate-200 font-semibold text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-950 font-extrabold">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold">Free</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-black text-slate-950 mb-8">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => setShowCheckoutForm(true)}
              className="w-full bg-slate-950 text-white font-bold py-4 rounded-full hover:bg-indigo-600 transition-all flex items-center justify-center text-sm shadow-md"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
