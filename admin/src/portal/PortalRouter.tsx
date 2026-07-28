/**
 * PortalRouter — the entire /portal/* route tree.
 *
 * Mounted from main.tsx with its own BrowserRouter (basename="/portal").
 * The admin App.tsx is NEVER modified — it keeps its own BrowserRouter
 * with basename="/admin".
 *
 * Route map:
 *   /portal/login       → PortalLogin  (public)
 *   /portal             → PortalDashboard (protected)
 *   /portal/shipments   → stub (protected)
 *   /portal/shipments/:id → stub (protected)
 *   /portal/quotations  → stub (protected)
 *   /portal/documents   → stub (protected)
 *   /portal/billing     → stub (protected)
 *   /portal/claims      → stub (protected)
 *   /portal/returns     → stub (protected)
 *   /portal/support     → stub (protected)
 *   /portal/profile     → stub (protected)
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  Package, FileText, FolderOpen, CreditCard,
  ShieldCheck, RotateCcw, HeadphonesIcon, User,
} from 'lucide-react';

import { PortalAuthProvider } from './context/PortalAuthContext';
import PortalGuard             from './components/PortalGuard';
import PortalPlaceholder       from './components/PortalPlaceholder';
import PortalLayout            from './layouts/PortalLayout';
import PortalLogin             from './pages/PortalLogin';
import PortalDashboard         from './pages/PortalDashboard';

/**
 * PortalRouterInner — contains the route declarations.
 * Exported separately so PortalRouter can wrap it in its own BrowserRouter.
 */
export function PortalRouterInner() {
  return (
    <PortalAuthProvider>
      <Routes>

        {/* ── Public ────────────────────────────────────────────────────── */}
        <Route path="login" element={<PortalLogin />} />

        {/* ── Protected (portal JWT required) ───────────────────────────── */}
        <Route element={<PortalGuard />}>
          <Route element={<PortalLayout />}>

            <Route index element={<PortalDashboard />} />

            <Route path="shipments"
              element={<PortalPlaceholder title="My Shipments"
                description="Track and manage all your active, pending, and delivered shipments."
                icon={Package} />}
            />
            <Route path="shipments/:id"
              element={<PortalPlaceholder title="Shipment Detail"
                description="Full timeline, documents, tracking map, and charges."
                icon={Package} />}
            />
            <Route path="quotations"
              element={<PortalPlaceholder title="Quotations"
                description="Request, compare, and accept freight quotations."
                icon={FileText} />}
            />
            <Route path="documents"
              element={<PortalPlaceholder title="Documents"
                description="View and upload BL, Packing List, Certificates, and more."
                icon={FolderOpen} />}
            />
            <Route path="billing"
              element={<PortalPlaceholder title="Billing"
                description="View invoices, make payments, and raise disputes."
                icon={CreditCard} />}
            />
            <Route path="claims"
              element={<PortalPlaceholder title="Claims & Insurance"
                description="File and track insurance claims for your shipments."
                icon={ShieldCheck} />}
            />
            <Route path="returns"
              element={<PortalPlaceholder title="Returns"
                description="Initiate return requests and track to refund or replacement."
                icon={RotateCcw} />}
            />
            <Route path="support"
              element={<PortalPlaceholder title="Support"
                description="Raise tickets, chat with AI, and view resolution history."
                icon={HeadphonesIcon} />}
            />
            <Route path="profile"
              element={<PortalPlaceholder title="Profile & Settings"
                description="Manage company details, addresses, and notification preferences."
                icon={User} />}
            />

            {/* Catch-all → dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Route>
        </Route>

      </Routes>
    </PortalAuthProvider>
  );
}

/**
 * PortalRouter — top-level export with its own BrowserRouter.
 * basename="/portal" means all routes resolve relative to /portal/.
 */
export default function PortalRouter() {
  return (
    <BrowserRouter basename="/portal">
      <PortalRouterInner />
    </BrowserRouter>
  );
}
