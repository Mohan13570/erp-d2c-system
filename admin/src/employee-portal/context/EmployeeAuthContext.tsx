import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type EmployeeUser = {
  id: string;
  employeeId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'employee' | 'manager' | 'hr_admin';
  employeeCode: string;
  designation?: string;
  photo?: string;
  avatarUrl?: string;
  phone?: string;
};

type EmployeeAuthContextType = {
  user: EmployeeUser | null;
  token: string | null;
  login: (token: string, user: EmployeeUser) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<EmployeeUser>) => void;
  isAuthenticated: boolean;
  isInitializing: boolean;
};

const EmployeeAuthContext = createContext<EmployeeAuthContextType | undefined>(undefined);

const TOKEN_KEY = 'employee_token';
const USER_KEY = 'employee_user';

export function EmployeeAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<EmployeeUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
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

  const login = (newToken: string, newUser: EmployeeUser) => {
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

  const updateUser = (updatedData: Partial<EmployeeUser>) => {
    setUser(prev => {
      const base = prev || {
        id: 'usr_01',
        employeeId: 'EMP_01',
        email: 'admin@aura.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'hr_admin',
        employeeCode: 'EMP-001'
      };
      const updated = { ...base, ...updatedData };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <EmployeeAuthContext.Provider
      value={{ user, token, login, logout, updateUser, isAuthenticated: !!token, isInitializing }}
    >
      {children}
    </EmployeeAuthContext.Provider>
  );
}

export function useEmployeeAuth(): EmployeeAuthContextType {
  const ctx = useContext(EmployeeAuthContext);
  if (!ctx) throw new Error('useEmployeeAuth must be used within EmployeeAuthProvider');
  return ctx;
}
