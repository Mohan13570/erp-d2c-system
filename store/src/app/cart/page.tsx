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
    <div className="max-w-4xl mx-auto py-12 px-4 relative">
      {/* Checkout Modal Overlay */}
      {showCheckoutForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-bold text-gray-900">Checkout Details</h2>
              <button onClick={() => setShowCheckoutForm(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                  <input type="text" required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                  <input type="text" required name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <input type="email" required name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Shipping Address</label>
                <input type="text" required name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Main St, Apt 4B" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                  <input type="text" required name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Zip Code</label>
                  <input type="text" required name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total to pay</p>
                  <p className="text-2xl font-bold text-gray-900">${cartTotal.toFixed(2)}</p>
                </div>
                <button 
                  type="submit" 
                  disabled={isCheckingOut}
                  className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {isCheckingOut ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Confirm Payment <ArrowRight className="w-5 h-5 ml-2" /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-900 mb-10 tracking-tight">Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <p className="text-gray-500 font-medium text-lg mb-6">Your cart is currently empty.</p>
          <Link href="/" className="text-indigo-600 font-semibold hover:text-indigo-700">Browse Collection &rarr;</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            {items.map((item) => (
              <div key={item.itemCode} className="flex space-x-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-24 h-24 relative bg-gray-50 rounded-xl overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.itemName} fill className="object-cover" unoptimized />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{item.itemName}</h3>
                    <p className="font-bold text-gray-900">${(item.rate * item.qty).toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-auto">${item.rate.toFixed(2)} each</p>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.itemCode, item.qty - 1)} className="px-3 py-1 hover:bg-gray-50 text-gray-600 font-bold">-</button>
                      <span className="px-4 py-1 font-medium text-sm text-gray-900 border-x border-gray-200">{item.qty}</span>
                      <button onClick={() => updateQuantity(item.itemCode, item.qty + 1)} className="px-3 py-1 hover:bg-gray-50 text-gray-600 font-bold">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.itemCode)} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-8 rounded-3xl h-fit sticky top-28">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 mb-8">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => setShowCheckoutForm(true)}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
