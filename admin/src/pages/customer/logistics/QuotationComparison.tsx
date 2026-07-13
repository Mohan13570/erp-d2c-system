import React from 'react';
import { ShieldCheck, Award, Clock, DollarSign, MessageSquare, Anchor, TrendingDown, Calendar, CheckCircle } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const mockQuotes = [
  { id: 'QTN-001', vendor: 'Global Ocean Lines', amount: 4250, currency: 'USD', transit: 21, valid: 'Oct 30, 2026', score: 98, isRecommended: true },
  { id: 'QTN-002', vendor: 'Pacific Logistics Ltd', amount: 3950, currency: 'USD', transit: 28, valid: 'Oct 28, 2026', score: 85, isRecommended: false },
  { id: 'QTN-003', vendor: 'FastFreight International', amount: 5100, currency: 'USD', transit: 18, valid: 'Nov 02, 2026', score: 92, isRecommended: false },
];

export default function QuotationComparison() {
  const { id } = useParams();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <Link to="/customer/logistics/rfqs" className="text-indigo-600 text-sm font-medium hover:underline mb-2 inline-block">&larr; Back to RFQs</Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            Compare Quotations 
            <span className="ml-3 px-2.5 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-lg">{id || 'RFQ-891002'}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Review vendor bids based on cost, transit time, and algorithmic reliability score.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockQuotes.map((quote) => (
          <div key={quote.id} className={`bg-white rounded-2xl border ${quote.isRecommended ? 'border-indigo-400 ring-4 ring-indigo-50 shadow-md' : 'border-gray-200 shadow-sm'} overflow-hidden relative transition-all hover:shadow-lg`}>
            {quote.isRecommended && (
              <div className="absolute top-0 inset-x-0 h-1 bg-indigo-600"></div>
            )}
            
            <div className="p-6">
              {quote.isRecommended && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full mb-4">
                  <Award size={12} />
                  <span>AI Recommended</span>
                </span>
              )}
              
              <h3 className="text-lg font-bold text-gray-900">{quote.vendor}</h3>
              <p className="text-sm text-gray-500 mb-6">Quote Ref: {quote.id}</p>

              <div className="flex items-end space-x-2 mb-6">
                <span className="text-4xl font-extrabold text-gray-900">${quote.amount.toLocaleString()}</span>
                <span className="text-gray-500 font-medium mb-1">{quote.currency}</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Clock size={16} className="mr-2" />
                    Transit Time
                  </div>
                  <span className="font-bold text-gray-900">{quote.transit} Days</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <ShieldCheck size={16} className="mr-2" />
                    Vendor Reliability
                  </div>
                  <span className={`font-bold ${quote.score > 90 ? 'text-green-600' : 'text-amber-600'}`}>{quote.score}/100</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    Valid Until
                  </div>
                  <span className="font-medium text-gray-900">{quote.valid}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col space-y-3">
              <button className={`w-full py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex justify-center items-center ${quote.isRecommended ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
                <CheckCircle size={16} className="mr-2" />
                Award Shipment
              </button>
              <button className="w-full py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex justify-center items-center">
                <MessageSquare size={14} className="mr-2" />
                Negotiate / Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
