import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Package, MapPin, Anchor, Loader2, ArrowLeft, ArrowRight, Receipt } from 'lucide-react';
import DocumentManager from '../components/DocumentManager';
import ApprovalTimeline from '../components/ApprovalTimeline';
import PricingSummaryPanel from '../components/PricingSummaryPanel';

const api = axios.create({ baseURL: 'http://localhost:5000/api/v1' });

export default function BookingDashboard() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => api.get(`/bookings/${id}/full`).then(res => res.data.data),
    refetchInterval: 5000 // Poll for live updates (e.g. from ops)
  });

  if (isLoading) {
    return <div className="h-[calc(100vh-5rem)] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  if (error || !data) {
    return <div className="p-12 text-center text-red-500">Failed to load booking.</div>;
  }

  const { booking, approval, documents, billing, shipment } = data;
  const isApproved = approval?.status === 'Approved';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <Link to="/" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{booking.bookingNumber || `Booking ${booking.id.split('-')[0]}`}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              booking.status === 'Approved' ? 'bg-green-100 text-green-700' :
              booking.status === 'Draft' ? 'bg-slate-100 text-slate-700' :
              booking.status === 'Rejected' ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {booking.status}
            </span>
          </div>
        </div>

        {billing && (
          <div className="text-right">
            <p className="text-sm text-slate-500 mb-1">Billing Request</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium">
              <Receipt className="w-4 h-4" /> {billing.requestNumber}
            </div>
          </div>
        )}
      </div>

      {/* Phase 6: Shipment Conversion Banner */}
      {shipment && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Package className="w-6 h-6" /> Shipment Created: {shipment.shipmentNumber}
            </h2>
            <p className="opacity-80 text-sm mt-1">This booking is now locked and actively executing as a shipment.</p>
          </div>
          <Link 
            to={`/shipment/${shipment.id}`}
            className="px-6 py-3 bg-white text-blue-700 font-bold rounded-xl shadow hover:bg-slate-50 transition-colors"
          >
            View Shipment Dashboard
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Pricing */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 text-blue-600 mb-3"><Anchor className="w-5 h-5" /><h3 className="font-semibold text-slate-900 dark:text-white">Service</h3></div>
              <p className="font-medium text-lg">{booking.serviceType}</p>
              <p className="text-sm text-slate-500">{booking.shipmentType}</p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 text-emerald-600 mb-3"><MapPin className="w-5 h-5" /><h3 className="font-semibold text-slate-900 dark:text-white">Route</h3></div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{booking.origin}</span>
                <ArrowRight className="w-4 h-4 text-slate-300" />
                <span className="font-medium">{booking.destination}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 text-purple-600 mb-3"><Package className="w-5 h-5" /><h3 className="font-semibold text-slate-900 dark:text-white">Cargo</h3></div>
              <p className="font-medium">{booking.packages?.length || 0} Packages</p>
              <p className="text-sm text-slate-500">Commodity: {booking.cargo?.commodity || 'General'}</p>
            </div>
          </div>

          {/* Pricing Panel */}
          {booking.pricing && (
             <PricingSummaryPanel pricingData={{ ...booking.pricing, breakdowns: booking.pricing.breakdowns }} isLoading={false} />
          )}

          {/* Document Management */}
          <DocumentManager bookingId={id!} documents={documents} />

        </div>

        {/* Right Column: Approvals */}
        <div className="space-y-6">
          <ApprovalTimeline bookingId={id!} approvalData={approval} />
        </div>
      </div>
    </div>
  );
}
