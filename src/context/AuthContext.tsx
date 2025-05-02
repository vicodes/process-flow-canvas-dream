
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AccountInfo } from '@azure/msal-browser';
import { authService } from '@/services/authService';
import { getEnvironment } from '@/config/environments';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AccountInfo | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  devLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const environment = getEnvironment();

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        await authService.init();
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    setIsLoading(true);
    try {
      await authService.login();
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const devLogin = async () => {
    setIsLoading(true);
    try {
      // Use the development login from authService
      const result = authService.devLogin();
      setUser(result.account);
    } catch (error) {
      console.error('Development login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // In development mode, check for an existing login
  useEffect(() => {
    if (environment.name === 'Development' && authService.isLoggedIn()) {
      const devUser = authService.getCurrentUser();
      if (devUser) {
        setUser(devUser);
      }
    }
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        devLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
