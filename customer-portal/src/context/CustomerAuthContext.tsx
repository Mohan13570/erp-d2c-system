import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CustomerUser {
  id: string;
  customerId: string;
  email: string;
  displayName: string;
  phone?: string;
  profilePhoto?: string | null;
}

interface CustomerAuthContextType {
  user: CustomerUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedData: Partial<CustomerUser>) => void;
  loading: boolean;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomerUser | null>(() => {
    const savedUser = localStorage.getItem('customer_portal_user');
    return savedUser ? JSON.parse(savedUser) : {
      id: 'usr_cust_901',
      customerId: 'cust_901',
      email: 'admin@acme.com',
      displayName: 'Acme Corporation Admin',
      phone: '+1 (555) 234-5678',
      profilePhoto: null
    };
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('customer_portal_token') || 'mock-customer-session-token-901';
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('customer_portal_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('customer_portal_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('customer_portal_token', token);
    } else {
      localStorage.removeItem('customer_portal_token');
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const mockUser: CustomerUser = {
        id: 'usr_cust_901',
        customerId: 'cust_901',
        email: email || 'admin@acme.com',
        displayName: 'Acme Corporation Admin',
        phone: '+1 (555) 234-5678',
        profilePhoto: null
      };
      const mockToken = 'mock-customer-session-token-901';
      setUser(mockUser);
      setToken(mockToken);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('customer_portal_user');
    localStorage.removeItem('customer_portal_token');
  };

  const updateUser = (updatedData: Partial<CustomerUser>) => {
    setUser(prev => prev ? { ...prev, ...updatedData } : null);
  };

  return (
    <CustomerAuthContext.Provider value={{ user, token, login, logout, updateUser, loading }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};
