import React, { useState } from 'react';
import { CreditCard, Smartphone, Building, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PaymentGateway() {
  const [method, setMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto mt-20 bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-xl">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600" size={40} />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-8">Thank you. $12,500.00 has been credited to your account and applied to Invoice INV-10045.</p>
        <div className="bg-gray-50 rounded-xl p-4 mb-8 text-sm text-gray-600 flex justify-between max-w-sm mx-auto">
          <span>Transaction Ref:</span>
          <span className="font-mono font-bold text-gray-900">TXN-STRIPE-882194</span>
        </div>
        <Link to="/customer/finance/ledger" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">
          View Account Ledger <ArrowRight className="ml-2" size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">Secure Checkout</h1>
        <p className="text-gray-500 mt-2">Select a payment method to settle your outstanding balance of <span className="font-bold text-gray-900">$12,500.00</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="font-bold text-gray-900">Payment Method</h2>
          </div>
          <div className="p-6 space-y-4">
            {/* Card Option */}
            <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition ${method === 'card' ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input type="radio" name="payment" className="mt-1 mr-4 w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" checked={method === 'card'} onChange={() => setMethod('card')} />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-900 flex items-center"><CreditCard size={18} className="mr-2 text-gray-500"/> Credit/Debit Card (Stripe)</span>
                  <div className="flex space-x-1">
                    <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] font-bold flex items-center justify-center">VISA</div>
                    <div className="w-8 h-5 bg-orange-500 rounded text-white text-[8px] font-bold flex items-center justify-center">MC</div>
                  </div>
                </div>
                {method === 'card' && (
                  <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <input type="text" placeholder="Card Number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="MM/YY" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                      <input type="text" placeholder="CVC" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                )}
              </div>
            </label>

            {/* Bank Transfer Option */}
            <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition ${method === 'bank' ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input type="radio" name="payment" className="mt-1 mr-4 w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" checked={method === 'bank'} onChange={() => setMethod('bank')} />
              <div>
                <span className="font-bold text-gray-900 flex items-center"><Building size={18} className="mr-2 text-gray-500"/> ACH / Wire Transfer</span>
                <p className="text-sm text-gray-500 mt-1">Directly wire funds to our corporate bank account.</p>
              </div>
            </label>
            
            {/* Wallet Option */}
            <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition ${method === 'wallet' ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input type="radio" name="payment" className="mt-1 mr-4 w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" checked={method === 'wallet'} onChange={() => setMethod('wallet')} />
              <div>
                <span className="font-bold text-gray-900 flex items-center"><Smartphone size={18} className="mr-2 text-gray-500"/> Digital Wallets (PayPal / Apple Pay)</span>
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Order Summary</h2>
            <div className="space-y-3 text-sm text-gray-600 mb-4">
               <div className="flex justify-between">
                 <span>Invoice INV-10045</span>
                 <span className="font-medium text-gray-900">$12,500.00</span>
               </div>
               <div className="flex justify-between">
                 <span>Gateway Fee (Waived)</span>
                 <span className="text-green-600 font-medium">$0.00</span>
               </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100 mb-6">
               <span className="font-bold text-gray-900">Total to Pay</span>
               <span className="text-2xl font-extrabold text-indigo-600">$12,500.00</span>
            </div>
            <button 
              onClick={handlePay}
              disabled={isProcessing}
              className={`w-full flex items-center justify-center px-4 py-3 rounded-xl font-bold text-white transition ${isProcessing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'}`}>
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>Pay $12,500.00 Securely <Lock size={16} className="ml-2"/></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
