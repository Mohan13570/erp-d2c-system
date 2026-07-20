import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BookingWizard from './pages/BookingWizard';
import BookingDashboard from './pages/BookingDashboard';
import ShipmentDashboard from './pages/ShipmentDashboard';
import PortalLogin from './pages/PortalLogin';
import PortalDashboard from './pages/PortalDashboard';
import PortalCreateBooking from './pages/PortalCreateBooking';
import OpsBookingReview from './pages/OpsBookingReview';
import OpsPickupScheduling from './pages/OpsPickupScheduling';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300">
          <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <img src="/lizome-logo.png" alt="LIZOME" className="h-8 object-contain" />
              <nav className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Customer Booking</span>
              </nav>
            </div>
          </header>
          
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Navigate to="/portal/login" replace />} />
              <Route path="/portal/login" element={<PortalLogin />} />
              <Route path="/portal/dashboard" element={<PortalDashboard />} />
              <Route path="/portal/bookings/new" element={<PortalCreateBooking />} />
              <Route path="/ops/booking-review" element={<OpsBookingReview />} />
              <Route path="/ops/pickup-scheduling" element={<OpsPickupScheduling />} />
              <Route path="/booking/new" element={<BookingWizard />} />
              <Route path="/booking/:id" element={<BookingDashboard />} />
              <Route path="/shipment/:id" element={<ShipmentDashboard />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
