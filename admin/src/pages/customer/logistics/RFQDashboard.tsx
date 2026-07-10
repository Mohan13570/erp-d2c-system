import React from 'react';
import { Search, Filter, Download, MoreVertical, FileText, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockRFQs = [
  { id: 'RFQ-891001', bookingRef: 'BKG-772910', route: 'SHA -> LAX', mode: 'Ocean', status: 'Awarded', quotesCount: 3, date: 'Oct 24, 2026' },
  { id: 'RFQ-891002', bookingRef: 'BKG-881023', route: 'FRA -> JFK', mode: 'Air', status: 'Open', quotesCount: 2, date: 'Oct 25, 2026' },
  { id: 'RFQ-891003', bookingRef: 'BKG-992011', route: 'BOM -> DXB', mode: 'Ocean', status: 'Closed', quotesCount: 5, date: 'Oct 26, 2026' },
  { id: 'RFQ-891004', bookingRef: 'BKG-112044', route: 'SIN -> LHR', mode: 'Air', status: 'Open', quotesCount: 0, date: 'Oct 27, 2026' },
];

export default function RFQDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Request for Quotations (RFQs)</h1>
          <p className="text-sm text-gray-500 mt-1">Track incoming bids from vendors against your logistics requirements.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search RFQs..." 
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
              />
            </div>
            <button className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
          <button className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="p-4">RFQ Number</th>
              <th className="p-4">Linked Booking</th>
              <th className="p-4">Route</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Bids Received</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockRFQs.map((rfq) => (
              <tr key={rfq.id} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="p-4">
                  <span className="font-semibold text-indigo-600">{rfq.id}</span>
                  <div className="text-xs text-gray-400 mt-1">{rfq.date}</div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-gray-900">{rfq.bookingRef}</span>
                  <div className="text-xs text-gray-500 mt-1">{rfq.mode} Freight</div>
                </td>
                <td className="p-4 text-sm font-medium text-gray-700">
                  {rfq.route}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    rfq.status === 'Awarded' ? 'bg-green-100 text-green-700' : 
                    rfq.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {rfq.status === 'Awarded' && <CheckCircle size={12} className="mr-1.5" />}
                    {rfq.status === 'Open' && <Clock size={12} className="mr-1.5" />}
                    {rfq.status === 'Closed' && <XCircle size={12} className="mr-1.5" />}
                    {rfq.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                    rfq.quotesCount > 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {rfq.quotesCount}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {rfq.quotesCount > 0 ? (
                    <Link to={`/customer/logistics/quotations/compare/${rfq.id}`} className="inline-flex items-center px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-50 shadow-sm transition-colors">
                      Compare Bids <ArrowRight size={14} className="ml-1" />
                    </Link>
                  ) : (
                    <button disabled className="inline-flex items-center px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed">
                      Waiting for Bids
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
