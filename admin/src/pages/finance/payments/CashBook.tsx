import React from 'react';
import { Link } from 'react-router-dom';

export default function CashBook() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/finance/payments" className="text-indigo-600 text-sm font-medium hover:underline mb-2 inline-block">&larr; Back to Treasury</Link>
          <h1 className="text-2xl font-bold text-gray-900">Cash Book</h1>
          <p className="text-sm text-gray-500 mt-1">Petty cash and daily till management.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-500">
         <p>Cash Book module UI is initialized. Requires further backend wiring for Phase 5.</p>
      </div>
    </div>
  );
}
