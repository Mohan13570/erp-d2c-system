import { usePortalAuth } from '../context/PortalAuthContext';

/**
 * usePortalUser — convenience hook that returns the authenticated portal user.
 * Throws if called outside PortalAuthProvider (catches misconfigured trees early).
 */
export function usePortalUser() {
  const { user, isAuthenticated, isInitializing } = usePortalAuth();
  return { user, isAuthenticated, isInitializing };
}
