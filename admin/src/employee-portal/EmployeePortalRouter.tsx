import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { EmployeeAuthProvider } from './context/EmployeeAuthContext';
import EmployeePortalGuard from './components/EmployeePortalGuard';
import EmployeePortalLayout from './layouts/EmployeePortalLayout';

import EmployeeLogin from './pages/EmployeeLogin';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeShipments from './pages/EmployeeShipments';
import EmployeeShipmentDetail from './pages/EmployeeShipmentDetail';
import EmployeeQuotes from './pages/EmployeeQuotes';
import EmployeeBilling from './pages/EmployeeBilling';
import EmployeeClaims from './pages/EmployeeClaims';
import EmployeeReturns from './pages/EmployeeReturns';
import EmployeeTickets from './pages/EmployeeTickets';
import EmployeeSettings from './pages/EmployeeSettings';
import EmployeeProfile from './pages/EmployeeProfile';
import EmployeePayroll from './pages/EmployeePayroll';
import EmployeeDocuments from './pages/EmployeeDocuments';
import EmployeeAnnouncements from './pages/EmployeeAnnouncements';
import EmployeeDirectory from './pages/EmployeeDirectory';

export default function EmployeePortalRouter() {
  return (
    <EmployeeAuthProvider>
      <Routes>
        {/* Public Auth Route */}
        <Route path="login" element={<EmployeeLogin />} />

        {/* Guarded Employee Portal Routes */}
        <Route element={<EmployeePortalGuard />}>
          <Route element={<EmployeePortalLayout />}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="shipments" element={<EmployeeShipments />} />
            <Route path="shipments/:id" element={<EmployeeShipmentDetail />} />
            <Route path="quotes" element={<EmployeeQuotes />} />
            <Route path="billing" element={<EmployeeBilling />} />
            <Route path="claims" element={<EmployeeClaims />} />
            <Route path="returns" element={<EmployeeReturns />} />
            <Route path="support" element={<EmployeeTickets />} />
            <Route path="settings" element={<EmployeeSettings />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="payroll" element={<EmployeePayroll />} />
            <Route path="documents" element={<EmployeeDocuments />} />
            <Route path="announcements" element={<EmployeeAnnouncements />} />
            <Route path="directory" element={<EmployeeDirectory />} />
          </Route>
        </Route>

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/hr-portal" replace />} />
      </Routes>
    </EmployeeAuthProvider>
  );
}
