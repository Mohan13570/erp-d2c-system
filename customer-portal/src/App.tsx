import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import BookingWizard from './pages/BookingWizard';
import BookingDashboard from './pages/BookingDashboard';
import ShipmentDashboard from './pages/ShipmentDashboard';
import PortalLogin from './pages/PortalLogin';
import PortalDashboard from './pages/PortalDashboard';
import PortalCreateBooking from './pages/PortalCreateBooking';
import PortalSettings from './pages/PortalSettings';
import PortalDocuments from './pages/PortalDocuments';
import OpsBookingReview from './pages/OpsBookingReview';
import OpsPickupScheduling from './pages/OpsPickupScheduling';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomerAuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300">
            
            <main>
              <Routes>
                <Route path="/" element={<Navigate to="/portal/login" replace />} />
                <Route path="/portal/login" element={<PortalLogin />} />
                <Route path="/portal/dashboard" element={<PortalDashboard />} />
                <Route path="/portal/bookings/new" element={<PortalCreateBooking />} />
                <Route path="/portal/documents" element={<PortalDocuments />} />
                <Route path="/portal/settings" element={<PortalSettings />} />
                <Route path="/ops/booking-review" element={<OpsBookingReview />} />
                <Route path="/ops/pickup-scheduling" element={<OpsPickupScheduling />} />
                <Route path="/booking/new" element={<BookingWizard />} />
                <Route path="/booking/:id" element={<BookingDashboard />} />
                <Route path="/shipment/:id" element={<ShipmentDashboard />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </CustomerAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
