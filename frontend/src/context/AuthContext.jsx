import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(undefined);

/**
 * Normalize a UserResponse from the backend into the shape the frontend expects.
 * Backend returns `userType`; frontend uses `accountType` everywhere.
 */
function normalizeUser(userData) {
  if (!userData) return null;
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    accountType: userData.userType || userData.accountType,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!token && !!user;

  const login = useCallback(async ({ emailOrPhone, password, rememberMe }) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: emailOrPhone,
        password,
      });
      const { token: newToken, user: userData } = response.data;
      const normalizedUser = normalizeUser(userData);
      setToken(newToken);
      setUser(normalizedUser);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      sessionStorage.setItem('token', newToken);
      sessionStorage.setItem('user', JSON.stringify(normalizedUser));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async ({ name, email, phone, password, accountType }) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        phone,
        password,
        userType: accountType,
      });
      const { token: newToken, user: userData } = response.data;
      const normalizedUser = normalizeUser(userData);
      setToken(newToken);
      setUser(normalizedUser);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const demoLogin = useCallback((role = 'STUDENT') => {
    const demoUser = {
      id: 1,
      name: 'AMAN GUPTA',
      email: 'aman@montra.app',
      phone: '9876543210',
      accountType: role,
    };
    const demoToken = 'mock-jwt-token-demo';
    setToken(demoToken);
    setUser(demoUser);
    localStorage.setItem('token', demoToken);
    localStorage.setItem('user', JSON.stringify(demoUser));
    sessionStorage.setItem('token', demoToken);
    sessionStorage.setItem('user', JSON.stringify(demoUser));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }, []);

  // Sync token from sessionStorage if not in localStorage
  useEffect(() => {
    if (!token) {
      const sessionToken = sessionStorage.getItem('token');
      const sessionUser = sessionStorage.getItem('user');
      if (sessionToken && sessionUser) {
        setToken(sessionToken);
        try { setUser(JSON.parse(sessionUser)); } catch { /* ignore */ }
      }
    }
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    demoLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
