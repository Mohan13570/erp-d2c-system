import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import PortalRouter from './portal/PortalRouter.tsx'
import { AuthProvider } from './context/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

// ─── Route-based app selector ───────────────────────────────────────────────
// If the user is visiting /portal (or any /portal/* path), mount the
// Customer Portal (PortalRouter) with its own BrowserRouter (basename="/portal").
//
// Otherwise, mount the existing admin ERP app (App) unchanged.
//
// This is the ONLY change to the original main.tsx.
// App.tsx, AuthContext, and all admin routes are completely untouched.
const isPortalPath = window.location.pathname.startsWith('/portal');

// Global API Error Interceptor — only for the admin app paths
if (!isPortalPath) {
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    if (!response.ok && args[0].toString().startsWith('/api')) {
      try {
        const cloned = response.clone();
        const errData = await cloned.json();
        if (errData.error) {
          alert(`Action Failed: ${errData.error}`);
        }
      } catch (e) {
        alert(`System Error: ${response.status} ${response.statusText}`);
      }
    }
    return response;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isPortalPath ? (
      // ── Customer Portal (/portal/*) ──────────────────────────────────────
      // Has its own BrowserRouter, PortalAuthProvider, and layout.
      // Completely separate from the admin auth, sidebar, and route tree.
      <PortalRouter />
    ) : (
      // ── Admin ERP (/admin/*) — unchanged ─────────────────────────────────
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    )}
  </StrictMode>,
)
