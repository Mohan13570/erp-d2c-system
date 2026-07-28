import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export type PortalUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  customerId: string;
  companyName: string;
};

type PortalAuthContextType = {
  user: PortalUser | null;
  token: string | null;
  login: (token: string, user: PortalUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isInitializing: boolean;
};

// ─── Context ──────────────────────────────────────────────────────────────────
const PortalAuthContext = createContext<PortalAuthContextType | undefined>(undefined);

// Separate localStorage keys from admin — never share auth state
const TOKEN_KEY = 'portal_token';
const USER_KEY  = 'portal_user';

// ─── Provider ─────────────────────────────────────────────────────────────────
export function PortalAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]               = useState<PortalUser | null>(null);
  const [token, setToken]             = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser  = localStorage.getItem(USER_KEY);
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setIsInitializing(false);
  }, []);

  const login = (newToken: string, newUser: PortalUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <PortalAuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!token, isInitializing }}
    >
      {children}
    </PortalAuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function usePortalAuth(): PortalAuthContextType {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) throw new Error('usePortalAuth must be used within a PortalAuthProvider');
  return ctx;
}
