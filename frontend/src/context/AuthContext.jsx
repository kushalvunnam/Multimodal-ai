import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, signin, signup, signout } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('[AUTH] checking current session');
        const res = await getCurrentUser();
        if (res.success && res.data.user) {
          console.log(`[AUTH] session restored for user: ${res.data.user.id || res.data.user._id}`);
          setUser(res.data.user);
          setIsAuthenticated(true);
        } else {
          console.log('[AUTH] session not authenticated');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.log('[AUTH] session not authenticated (401/403)');
          setUser(null);
          setIsAuthenticated(false);
        } else {
          console.log('[AUTH] network failure or server error during session check');
          // Don't treat a 500/503 network error as explicitly logged out if we don't know yet.
          // However, if we leave them in loading forever it's a bad UX.
          // For now, we will assume not authenticated but log it appropriately.
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (credentials) => {
    const res = await signin(credentials);
    if (res.success) {
      setUser(res.data.user);
      setIsAuthenticated(true);
    }
    return res;
  };

  const register = async (data) => {
    const res = await signup(data);
    if (res.success) {
      setUser(res.data.user);
      setIsAuthenticated(true);
    }
    return res;
  };

  const logout = async () => {
    try {
      await signout();
    } catch(e) {}
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

