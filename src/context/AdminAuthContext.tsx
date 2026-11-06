import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  status?: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('valora_admin_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    const savedToken = localStorage.getItem('valora_admin_token');
    if (!savedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await adminApi.getMe();
      if (data.user) {
        setUser(data.user);
      } else {
        localStorage.removeItem('valora_admin_token');
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      localStorage.removeItem('valora_admin_token');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await adminApi.login(email, password);
    localStorage.setItem('valora_admin_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('valora_admin_token');
    setToken(null);
    setUser(null);
    window.location.href = '/admin/login';
  };

  const refreshUser = async () => {
    try {
      const data = await adminApi.getMe();
      if (data.user) setUser(data.user);
    } catch (e) {
      // ignore
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
